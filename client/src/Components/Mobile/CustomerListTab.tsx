import React, { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../Core/hooks";
import {
  deleteOutreach,
  deleteProspect,
  getCompany,
  saveProspect,
  setOutreach,
  setProspects,
} from "../../Store/Company";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import Work from "./Work";
import DataFilters from "../Controls/DataFilters";
import { Outreach } from "../../Models/Outreach";
import { formatDateTime } from "../../Helpers/formatDateTime";
import { formatDate } from "../../Helpers/formatDate";
import { maskPhone } from "../../Helpers/maskphone";
import { cleanPhone } from "../../Helpers/cleanPhone";
import { isValidMaskedPhone } from "../../Helpers/isValidMaskedPhone";

function CustomerListTab() {
  const dispatch = useAppDispatch();
  const companyState = useAppSelector(getCompany);
  const prospectTypes = companyState.prospectTypes || [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterText, setFilterText] = useState("");
  const [filterProspectType, setFilterProspectType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modals
  const [editProspect, setEditProspect] = useState<any>(null);
  const [editProspectErrors, setEditProspectErrors] = useState<{ [key: string]: boolean }>({});
  const [deleteProspectId, setDeleteProspectId] = useState<string | null>(null);
  const [editOutreach, setEditOutreach] = useState<any>(null);
  const [deleteOutreachId, setDeleteOutreachId] = useState<string | null>(null);

  const prospects = [...companyState.prospects];
  const outreach = [...companyState.outreach];

  const role = companyState.members.find((m) => m.me)?.role || "";
  const thisUser = companyState.members.find((m) => m.me);

  const [dataTeams, setDataTeams] = useState<string[]>([]);
  const teams = companyState.teams || [];

  const metricsByProspectId = useMemo(() => {
    const cutoff = new Date();
    //cutoff.setMonth(cutoff.getMonth() - 1);
    cutoff.setDate(cutoff.getDate() - 7); // last 7 days

    const cutoffMs = cutoff.getTime();
    const map: Record<string, { recentActions: number; lastOutreachMs: number | null }> = {};
    outreach.forEach((o) => {
      const id = o.prospectId;
      const createdMs = new Date(o.created).getTime();
      const entry = map[id] || { recentActions: 0, lastOutreachMs: null };
      if (createdMs >= cutoffMs && o.actions) {
        o.actions.forEach((action) => {
          const val = String(action.value).toLowerCase().trim();
          if (!isNaN(Number(val)) && val !== "") entry.recentActions += Number(val);
          else if (val === "true") entry.recentActions += 1;
        });
      }
      entry.lastOutreachMs =
        entry.lastOutreachMs === null ? createdMs : Math.max(entry.lastOutreachMs, createdMs);
      map[id] = entry;
    });
    return map;
  }, [outreach]);

  const memberByUserId = useMemo(() => {
    const map: Record<string, any> = {};
    (companyState.members || []).forEach((m: any) => {
      if (m?.userId) map[String(m.userId)] = m;
    });
    return map;
  }, [companyState.members]);
  
  const filteredProspects = useMemo(() => {
    return prospects.filter((p) => {
      const text = (filterText || "").toLowerCase();
  
      const owner = memberByUserId[String(p.userId)];
      const ownerFullName = `${owner?.firstName || ""} ${owner?.lastName || ""}`.toLowerCase();
  
      // ✅ TEAM FILTER (multi-select)
      // none selected => include all
      if (dataTeams.length > 0) {
        const ownerTeams = (owner?.teams ?? []).map((id: any) => String(id));
        const matchesTeam = ownerTeams.some((id: string) => dataTeams.includes(id));
        if (!matchesTeam) return false;
      }
  
      const textMatch =
        (p.firstName || "").toLowerCase().includes(text) ||
        (p.lastName || "").toLowerCase().includes(text) ||
        (p.company || "").toLowerCase().includes(text) ||
        (p.phone || "").toLowerCase().includes(text) ||
        (p.email || "").toLowerCase().includes(text) ||
        ownerFullName.includes(text);
  
      const createdDate = new Date(p.created);
      const startBound = startDate ? new Date(`${startDate}T00:00:00.000Z`) : null;
      const endBound = endDate ? new Date(`${endDate}T23:59:59.999Z`) : null;
  
      const afterStart = !startBound || createdDate >= startBound;
      const beforeEnd = !endBound || createdDate <= endBound;
      const typeMatch = !filterProspectType || p.typeId === filterProspectType;
  
      return textMatch && afterStart && beforeEnd && typeMatch;
    });
  }, [
    prospects,
    filterText,
    startDate,
    endDate,
    filterProspectType,
    dataTeams,        // ✅ add
    memberByUserId,   // ✅ add
  ]);
  

  const handleConfirmDelete = () => {
    if (!deleteProspectId) return;
    dispatch(deleteProspect(deleteProspectId));
    dispatch(setProspects(prospects.filter((p) => p._id !== deleteProspectId)));
    dispatch(setOutreach(outreach.filter((o) => o.prospectId !== deleteProspectId)));
    setDeleteProspectId(null);
  };

  const handleConfirmDeleteOutreach = () => {
    if (!deleteOutreachId) return;
    dispatch(deleteOutreach(deleteOutreachId));
    dispatch(setOutreach(outreach.filter((o) => o._id !== deleteOutreachId)));
    setDeleteOutreachId(null);
  };

  const isValidEmail = (val: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val.trim());
  };

  const handleSaveProspect = () => {
    if (!editProspect) return;

    const errors: { [key: string]: boolean } = {};

    const companyVal = (editProspect.company || "").toString();
    const firstVal   = (editProspect.firstName || "").toString();
    const lastVal    = (editProspect.lastName || "").toString();
    const phoneVal   = (editProspect.phone || "").toString();
    const emailVal   = (editProspect.email || "").toString();

    if (!companyVal.trim()) errors.company = true;
    if (!firstVal.trim()) errors.firstName = true;
    if (!lastVal.trim()) errors.lastName = true;
    if (!phoneVal.trim() || !isValidMaskedPhone(phoneVal)) errors.phone = true;
    if (!emailVal.trim() || !isValidEmail(emailVal)) errors.email = true;

    setEditProspectErrors(errors);
    if (Object.keys(errors).length > 0) return;   // ❌ don't save if any invalid

    dispatch(saveProspect(editProspect));

    const updated = prospects.map((p) =>
      p._id === editProspect._id ? editProspect : p
    );
    dispatch(setProspects(updated));

    setEditProspect(null);
    setEditProspectErrors({});
  };


  // 🔹 Count total actions for a single outreach record
  const getOutreachActionsTotal = (o: Outreach) => {
    let total = 0;

    o.actions?.forEach((a) => {
      const val = String(a.value).toLowerCase().trim();

      if (!isNaN(Number(val)) && val !== "") {
        total += Number(val); // numeric action (e.g., 1–5)
      } else if (val === "true") {
        total += 1; // boolean action checked
      }
    });

    return total;
  };

  const formatNumber = (num: string | number) => {
    if (num === null || num === undefined || num === "") return "";
    const parsed = Number(num);
    if (isNaN(parsed)) return String(num);
    return parsed.toLocaleString("en-US", {
      minimumFractionDigits: parsed % 1 !== 0 ? 2 : 0,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div style={{ padding: "12px", paddingBottom: "50px" }}>
      <div style={{ marginBottom: "12px" }}>
        <DataFilters
          filterText={filterText}
          setFilterText={setFilterText}
          filterProspectType={filterProspectType}
          setFilterProspectType={setFilterProspectType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          prospectTypes={prospectTypes}
          teams={teams}
          dataTeams={dataTeams}
          setDataTeams={setDataTeams}
        />
      </div>

      {filteredProspects.map((p) => {
        const owner = companyState.members.find((m) => m.userId === p.userId);
        const metrics = metricsByProspectId[p._id] || {
          recentActions: 0,
          lastOutreachMs: null,
        };
        const typeName = prospectTypes.find((t) => t._id === p.typeId)?.name || "—";
        const lastOutreachDate = metrics.lastOutreachMs
          ? formatDateTime(new Date(metrics.lastOutreachMs))
          : "—";

        return (
          <div
            key={p._id}
            style={{
              background: "#fff",
              borderRadius: "12px",
              marginBottom: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              padding: "14px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              {/* Left: Prospect details */}
              <div
                style={{ flex: 1 }}
                onClick={() => setExpanded(expanded === p._id ? null : p._id)}
              >
                {p.phone && (
                  <p style={{ margin: "3px 0 0", fontSize: "16px" }}>
                    <a onClick={(e) => e.stopPropagation()} href={`tel:${p.phone}`} style={{ color: "#007AFF", textDecoration: "none" }}>
                      {maskPhone(p.phone)}
                    </a>
                  </p>
                )}
                <h3 style={{ fontSize: "15px", fontWeight: 600, margin: "10px 0px 5px 0px" }}>{p.company}</h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#555" }}>
                  {p.firstName} {p.lastName} • {typeName}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#777" }}>
                  Created {formatDateTime(new Date(p.created))}
                </p>
                {p.email && (
                  <p style={{ margin: "3px 0 0", fontSize: "12px" }}>
                    <a onClick={(e) => e.stopPropagation()} href={`mailto:${p.email}`} style={{ color: "#007AFF", textDecoration: "none" }}>
                      {p.email}
                    </a>
                  </p>
                )}
              </div>

              {/* Right: icons + metrics */}
              <div style={{ textAlign: "right", minWidth: "60px" }}>
                {role !== "advisor" &&
                  !(
                    role === "manager" &&
                    p.userId.toString() !== thisUser?.userId?.toString()
                  ) && (
                    <div style={{ marginBottom: "4px" }}>
                      <BsPencil
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditProspect({
                            ...p,
                            phone: maskPhone(cleanPhone(p.phone || "")),
                          });
                          setEditProspectErrors({});
                        }}
                        style={{ cursor: "pointer", marginRight: "20px" }}
                      />
                      <BsTrash3
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteProspectId(p._id);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  )}
                <div style={{ fontSize: "13px", color: "#16a34a" }}>
                  ⚡ {metrics.recentActions}
                </div>
                <div style={{ fontSize: "12px", color: "#555" }}>
                  {formatDate(lastOutreachDate)}
                  <div style={{ fontSize: "7pt" }}>Last Outreach</div>
                </div>
              </div>
            </div>

            {/* Expanded outreach */}
            {expanded === p._id && (
              <div
                style={{
                  marginTop: "10px",
                  borderTop: "1px solid #eee",
                  paddingTop: "8px",
                }}
              >
                <h4
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                >
                  Outreach
                </h4>
                {outreach.filter((o) => o.prospectId === p._id).length === 0 ? (
                  <p style={{ fontSize: "13px", color: "#666" }}>
                    No outreach records
                  </p>
                ) : (
                  outreach
                    .filter((o) => o.prospectId === p._id)
                    .sort(
                      (a, b) =>
                        new Date(b.created).getTime() -
                        new Date(a.created).getTime()
                    )
                    .map((o, i) => {
                      const totalActions = getOutreachActionsTotal(o);
                      const oOwner = companyState.members.find(m => m.userId === o.userId);
                      let outreachOwner = "";
                      if (oOwner) {
                        outreachOwner = oOwner.firstName + ' ' + oOwner.lastName;
                      }

                      return (
                        <div
                          key={o._id}
                          style={{
                            background: "#f9fafb",
                            borderRadius: "10px",
                            padding: "10px",
                            marginBottom: "8px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "start",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                                fontSize: "13px",
                              }}
                            >
                              {formatDateTime(new Date(o.created))}
                              {o.modified && (
                                <div
                                  style={{
                                    fontSize: "9pt",
                                    color: "gray",
                                    fontStyle: "italic",
                                    fontWeight: "normal",
                                  }}
                                >
                                  Modified on{" "}
                                  {formatDateTime(new Date(o.modified))}
                                </div>
                              )}
                              {outreachOwner !== "" &&
                                <div style={{ fontSize: "9pt", fontWeight: "normal", color: "gray" }}>
                                  Sales Person: {outreachOwner}
                                </div>
                              }
                              <div
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "normal",
                                }}
                              >
                                Total Actions: {totalActions}
                              </div>
                            </span>

                            {role !== "advisor" &&
                              !(
                                role === "manager" &&
                                p.userId.toString() !==
                                  thisUser?.userId?.toString()
                              ) && (
                                <div>
                                  <BsPencil
                                    onClick={() => setEditOutreach(o)}
                                    style={{
                                      marginRight: "20px",
                                      cursor: "pointer",
                                    }}
                                  />
                                  <BsTrash3
                                    onClick={() => setDeleteOutreachId(o._id)}
                                    style={{ cursor: "pointer" }}
                                  />
                                </div>
                              )}
                          </div>
                          <p
                            style={{
                              fontSize: "13px",
                              margin: "6px 0",
                              whiteSpace: "pre-wrap"
                            }}
                          >
                            {o.notes}
                          </p>
                          <ul
                            style={{
                              marginLeft: "18px",
                              fontSize: "12px",
                              color: "#555",
                            }}
                          >
                            {o.success && (
                              <li key={"success-" + i}>
                                Success of the Week: Yes
                              </li>
                            )}
                            {o.actions
                              .filter(
                                (a) => a.value !== "" && a.value !== "false"
                              )
                              .map((a) => {
                                let displayName = a.name;
                                const action = companyState.actions.find(
                                  (x) => x._id === a.name
                                );
                                if (action) {
                                  const caction =
                                    companyState.companyActions.find(
                                      (cx) =>
                                        cx.actionId === action._id
                                    );
                                  displayName = caction
                                    ? caction.name
                                    : action.name;
                                }

                                return (
                                  <li key={a.name}>
                                    {displayName}:{" "}
                                    {a.value === "true" ? "Yes" : a.value}
                                  </li>
                                );
                              })}
                            {o.amounts
                              .filter(
                                (a) => a.value !== "" && a.value !== "0"
                              )
                              .map((a) => {
                                let displayName = a.name;
                                const amount = companyState.amounts.find(
                                  (x) => x._id === a.name
                                );

                                if (amount) {
                                  const camount =
                                    companyState.companyAmounts.find(
                                      (cx) =>
                                        cx.actionId === amount._id
                                    );
                                  displayName = camount
                                    ? camount.label
                                    : amount.label;
                                }

                                return (
                                  <li key={a.name}>
                                    {displayName}: ${a.value}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      );
                    })
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Full-screen Outreach Modal */}
      {editOutreach && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#fff",
            zIndex: 200,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              background: "#fff",
              padding: "16px",
              borderBottom: "1px solid #e5e7eb",
              textAlign: "center",
              zIndex: 10,
            }}
          >
            <h3 style={{ margin: 0 }}>Edit Outreach</h3>
            <button
              onClick={() => setEditOutreach(null)}
              style={{
                position: "absolute",
                left: "16px",
                top: "16px",
                fontSize: "16px",
                border: "none",
                background: "none",
                color: "#555",
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ padding: "16px" }}>
            <Work
              mode="update"
              outreach={editOutreach}
              cancelEditHandler={() => setEditOutreach(null)}
            />
          </div>
        </div>
      )}

      {/* Edit Prospect Modal */}
      {editProspect && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "90%",
              maxWidth: "420px",
              padding: "24px",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>Edit Contact</h3>
            <select
              className="form-control"
              style={{ marginBottom: "10px", width: "100%" }}
              value={editProspect.typeId}
              onChange={(e) =>
                setEditProspect({ ...editProspect, typeId: e.target.value })
              }
            >
              {prospectTypes.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
            <input
              className={`form-control ${
                editProspectErrors.company ? "form-control-error" : ""
              }`}
              style={{ marginBottom: "10px", width: "100%" }}
              value={editProspect.company}
              onChange={(e) =>
                setEditProspect({ ...editProspect, company: e.target.value })
              }
              placeholder="Company*"
            />
            <input
              className={`form-control ${
                editProspectErrors.firstName ? "form-control-error" : ""
              }`}
              style={{ marginBottom: "10px", width: "100%" }}
              value={editProspect.firstName}
              onChange={(e) =>
                setEditProspect({
                  ...editProspect,
                  firstName: e.target.value,
                })
              }
              placeholder="First Name*"
            />
            <input
              className={`form-control ${
                editProspectErrors.lastName ? "form-control-error" : ""
              }`}
              style={{ marginBottom: "10px", width: "100%" }}
              value={editProspect.lastName}
              onChange={(e) =>
                setEditProspect({
                  ...editProspect,
                  lastName: e.target.value,
                })
              }
              placeholder="Last Name*"
            />
            <input
              className={`form-control ${
                editProspectErrors.phone ? "form-control-error" : ""
              }`}
              style={{ marginBottom: "10px", width: "100%" }}
              value={maskPhone(editProspect.phone) || ""}
              onChange={(e) =>
                setEditProspect({
                  ...editProspect,
                  phone: maskPhone(cleanPhone(e.target.value)),
                })
              }
              placeholder="Phone*"
            />
            <input
              className={`form-control ${
                editProspectErrors.email ? "form-control-error" : ""
              }`}
              style={{ marginBottom: "10px", width: "100%" }}
              value={editProspect.email || ""}
              onChange={(e) =>
                setEditProspect({
                  ...editProspect,
                  email: e.target.value,
                })
              }
              placeholder="Email*"
            />
            
            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button
                onClick={() => {
                  setEditProspect(null);
                  setEditProspectErrors({});
                }}
                className="button-primary-cancel"
                style={{ marginRight: "10px" }}
              >
                Cancel
              </button>
              <button onClick={handleSaveProspect} className="button-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Prospect Confirmation */}
      {deleteProspectId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              width: "85%",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <h3>Delete Contact?</h3>
            <p>This will also delete all related outreach records.</p>
            <div style={{ marginTop: "12px" }}>
              <button
                onClick={() => setDeleteProspectId(null)}
                className="button-primary-cancel"
                style={{ marginRight: "8px" }}
              >
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="button-primary">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Outreach Confirmation */}
      {deleteOutreachId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              width: "85%",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <h3>Delete Outreach?</h3>
            <p>This action cannot be undone.</p>
            <div style={{ marginTop: "12px" }}>
              <button
                onClick={() => setDeleteOutreachId(null)}
                className="button-primary-cancel"
                style={{ marginRight: "8px" }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteOutreach}
                className="button-primary"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerListTab;
