import React, { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import Resizer from "react-image-file-resizer";
import { useAppDispatch, useAppSelector } from "../../Core/hooks";
import {
  deleteOutreach,
  deleteProspect,
  getCompany,
  saveCompany,
  saveProspect,
  setCompany,
  setOutreach,
  setProspects,
} from "../../Store/Company";
import { Prospect } from "../../Models/Prospect";
import { Outreach } from "../../Models/Outreach";
import { RxLightningBolt } from "react-icons/rx";
import DataFilters from "../Controls/DataFilters";
import { BsGear, BsPencil, BsTrash3 } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import Work from "./Work";
import { formatDateTime } from "../../Helpers/formatDateTime";
import { maskPhone } from "../../Helpers/maskphone";
import { cleanPhone } from "../../Helpers/cleanPhone";
import { isValidMaskedPhone } from "../../Helpers/isValidMaskedPhone";

function CustomerListTab() {
  const dispatch = useAppDispatch();
  const companyState = useAppSelector(getCompany);
  const prospectTypes = companyState.prospectTypes || [];
  const [editProspect, setEditProspect] = useState<Prospect | null>(null);
  const [editProspectErrors, setEditProspectErrors] = useState<{ [key: string]: boolean }>({});
  const [deleteProspectId, setDeleteProspectId] = useState<string | null>(null);
  const [editOutreach, setEditOutreach] = useState<Outreach | null>(null);
  const [deleteOutreachId, setDeleteOutreachId] = useState<string | null>(null);

  const role = companyState.members.find((m) => m.me)?.role || "";
  const thisUser = companyState.members.find((m) => m.me);

  // sort and outreach expansion
  type SortableField =
    | "company"
    | "phone"
    | "email"
    | "firstName"
    | "lastName"
    | "created"
    | "actions7d"
    | "lastOutreach"
    | "owner";
  const [sortField, setSortField] = useState<SortableField>("created");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [expanded, setExpanded] = useState<string | null>(null);

  // Filters
  const [filterText, setFilterText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterProspectType, setFilterProspectType] = useState("");
  const [dataTeams, setDataTeams] = useState<string[]>([]);
  const teams = companyState.teams || [];

  let prospects: Array<Prospect> = [...companyState.prospects];
  let outreach: Array<Outreach> = [...companyState.outreach];

  const handleEditOutreach = (o: Outreach) => {
    setEditOutreach(o);
  };

  const handleDeleteOutreach = (o: Outreach) => {
    setDeleteOutreachId(o._id);
  };

  const metricsByProspectId = useMemo(() => {
    const cutoff = new Date();
    //cutoff.setMonth(cutoff.getMonth() - 1); // last 30 days
    cutoff.setDate(cutoff.getDate() - 7); // last 7 days

    const cutoffMs = cutoff.getTime();

    const map: Record<string, { recentActions: number; lastOutreachMs: number | null }> = {};

    outreach.forEach((o) => {
      const id = o.prospectId;
      const createdMs = new Date(o.created).getTime();
      const entry = map[id] || { recentActions: 0, lastOutreachMs: null };

      // Count actions properly (only if within last 30 days)
      if (createdMs >= cutoffMs && o.actions) {
        o.actions.forEach((action) => {
          const val = String(action.value).toLowerCase().trim();

          if (!isNaN(Number(val)) && val !== "") {
            entry.recentActions += Number(val);
          } else if (val === "true") {
            entry.recentActions += 1;
          }
        });
      }

      // Track latest outreach timestamp
      entry.lastOutreachMs =
        entry.lastOutreachMs === null ? createdMs : Math.max(entry.lastOutreachMs, createdMs);

      map[id] = entry;
    });

    return map;
  }, [outreach]);

  // Handle sort toggle
  const handleSort = (field: SortableField) => {
    if (sortField === field) {
      setSortField(field);
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortArrow = (field: SortableField) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  const formatNumber = (num: string | number) => {
    if (num === null || num === undefined || num === "") return "";

    const parsed = Number(num);
    if (isNaN(parsed)) return String(num);

    return parsed.toLocaleString("en-US", {
      minimumFractionDigits: parsed % 1 !== 0 ? 2 : 0, // keep decimals if float
      maximumFractionDigits: 2,
    });
  };

  const handleSaveEdit = () => {
    if (!editProspect) return;

    const errors: { [key: string]: boolean } = {};
    if (!editProspect.company || !editProspect.company.trim()) errors.company = true;
    if (!editProspect.firstName || !editProspect.firstName.trim()) errors.firstName = true;
    if (!editProspect.lastName || !editProspect.lastName.trim()) errors.lastName = true;
    //if (!editProspect.phone || !isValidMaskedPhone(editProspect.phone)) errors.phone = true;

    const phoneDigits = cleanPhone(editProspect.phone || "");
    if (!phoneDigits || phoneDigits.length !== 10) errors.phone = true;
    

    if (!editProspect.email || !editProspect.email.toString().trim()) errors.email = true;

    setEditProspectErrors(errors);

    if (Object.keys(errors).length > 0) {
      return; // don't save if required fields missing
    }

    // update the backend
    dispatch(saveProspect(editProspect));

    // update the frontend
    let prospects = [...companyState.prospects];
    let index = prospects.findIndex((p) => p._id === editProspect._id);
    if (index !== -1) {
      prospects[index] = { ...editProspect };
      dispatch(setProspects(prospects));
    }

    setEditProspect(null); // close modal
    setEditProspectErrors({});
  };

  const handleConfirmDelete = () => {
    if (!deleteProspectId) return;

    // update backend
    dispatch(deleteProspect(deleteProspectId));

    // update frontend
    let prospects = [...companyState.prospects];
    let index = prospects.findIndex((p) => p._id === deleteProspectId);
    if (index !== -1) {
      prospects.splice(index, 1);
      dispatch(setProspects(prospects));
    }

    let outreach = [...companyState.outreach].filter((o) => o.prospectId !== deleteProspectId);

    dispatch(setOutreach(outreach));

    setDeleteProspectId(null);
  };

  const handleConfirmDeleteOutreach = () => {
    if (!deleteOutreachId) return;

    // update backend
    dispatch(deleteOutreach(deleteOutreachId));

    // update frontend
    let outreach = [...companyState.outreach];
    let index = outreach.findIndex((p) => p._id === deleteOutreachId);
    if (index !== -1) {
      outreach.splice(index, 1);
      dispatch(setOutreach(outreach));
    }

    setDeleteOutreachId(null);
  };


  const memberByUserId = useMemo(() => {
    const map: Record<string, any> = {};
    (companyState.members || []).forEach((m: any) => {
      if (m?.userId) map[String(m.userId)] = m;
    });
    return map;
  }, [companyState.members]);

  /** If prospects might sometimes be an object keyed by id, normalize it */
  const prospectList: Prospect[] = useMemo<Prospect[]>(() => {
    if (Array.isArray(prospects)) return prospects;
    return Object.values(prospects as Record<string, Prospect>);
  }, [prospects]);

  const filteredProspects = useMemo<Prospect[]>(() => {
    const filtered = prospectList.filter((p) => {
      const text = (filterText || "").toLowerCase();
  
      const owner = memberByUserId[String(p.userId)];
      const ownerFullName = `${owner?.firstName || ""} ${owner?.lastName || ""}`.toLowerCase();
  
      // ✅ TEAM FILTER (multi-select)
      // If no teams selected => include all
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
  
    // ...keep your sort exactly as-is...
    const asc = sortOrder === "asc";

    return [...filtered].sort((a, b) => {
      const dir = asc ? 1 : -1;

      const safeLower = (v: any) => String(v ?? "").toLowerCase().trim();
      const safeDateMs = (v: any) => {
        const t = new Date(v ?? 0).getTime();
        return Number.isFinite(t) ? t : 0;
      };

      // Metrics fallback
      const aMetrics = metricsByProspectId[a._id] || { recentActions: 0, lastOutreachMs: -Infinity };
      const bMetrics = metricsByProspectId[b._id] || { recentActions: 0, lastOutreachMs: -Infinity };

      if (sortField === "created") {
        return dir * (safeDateMs(a.created) - safeDateMs(b.created));
      }

      if (sortField === "actions7d") {
        return dir * ((aMetrics.recentActions ?? 0) - (bMetrics.recentActions ?? 0));
      }

      if (sortField === "lastOutreach") {
        const aMs = aMetrics.lastOutreachMs ?? -Infinity;
        const bMs = bMetrics.lastOutreachMs ?? -Infinity;
        return dir * (aMs - bMs);
      }

      if (sortField === "owner") {
        const aOwner = memberByUserId[String(a.userId)];
        const bOwner = memberByUserId[String(b.userId)];
        const aName = safeLower(`${aOwner?.firstName || ""} ${aOwner?.lastName || ""}`);
        const bName = safeLower(`${bOwner?.firstName || ""} ${bOwner?.lastName || ""}`);
        return dir * aName.localeCompare(bName);
      }

      if (sortField === "company") return dir * safeLower(a.company).localeCompare(safeLower(b.company));
      if (sortField === "firstName") return dir * safeLower(a.firstName).localeCompare(safeLower(b.firstName));
      if (sortField === "lastName") return dir * safeLower(a.lastName).localeCompare(safeLower(b.lastName));
      if (sortField === "phone") return dir * safeLower(a.phone).localeCompare(safeLower(b.phone));
      if (sortField === "email") return dir * safeLower(a.email).localeCompare(safeLower(b.email));

      // default fallback (stable-ish)
      return dir * (safeDateMs(a.created) - safeDateMs(b.created));
    });

  }, [
    prospectList,
    filterText,
    startDate,
    endDate,
    sortField,
    sortOrder,
    metricsByProspectId,
    filterProspectType,
    dataTeams,          // ✅ ADD
    memberByUserId,     // ✅ ADD
  ]);
  

  // 🔹 Count total actions for a single outreach record
  const getOutreachActionsTotal = (o: Outreach) => {
    let total = 0;

    o.actions?.forEach((a) => {
      const val = String(a.value).toLowerCase().trim();

      if (!isNaN(Number(val)) && val !== "") {
        total += Number(val);
      } else if (val === "true") {
        total += 1;
      }
    });

    return total;
  };

  return (
    <div style={{ padding: "10px 20px" }}>
      {/* Filters */}
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

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#051a26", color: "#fff", fontSize: "11pt" }}>
          <tr>
            {/*
            <th
              onClick={() => handleSort("type")}
              style={{
                cursor: "pointer",
                padding: "10px",
                borderTopLeftRadius: "30px",
                borderBottomLeftRadius: "30px",
              }}
            >
              Type{renderSortArrow("type")}
            </th>
            */}
            <th
              onClick={() => handleSort("company")}
              style={{ 
                cursor: "pointer",
                padding: "10px",
                borderTopLeftRadius: "30px",
                borderBottomLeftRadius: "30px", }}
            >
              Company{renderSortArrow("company")}
            </th>
            <th
              onClick={() => handleSort("firstName")}
              style={{ cursor: "pointer", padding: "10px" }}
            >
              First Name{renderSortArrow("firstName")}
            </th>
            <th
              onClick={() => handleSort("lastName")}
              style={{ cursor: "pointer", padding: "10px" }}
            >
              Last Name{renderSortArrow("lastName")}
            </th>
            <th
              onClick={() => handleSort("phone")}
              style={{ cursor: "pointer", padding: "10px" }}
            >
              Phone{renderSortArrow("phone")}
            </th>
            <th
              onClick={() => handleSort("email")}
              style={{ cursor: "pointer", padding: "10px" }}
            >
              Email{renderSortArrow("email")}
            </th>
            <th
              onClick={() => handleSort("actions7d")}
              style={{ cursor: "pointer", padding: "10px", textAlign: "center" }}
            >
              <RxLightningBolt color="#fff" size={15} /> 7D{renderSortArrow("actions7d")}
            </th>
            <th
              onClick={() => handleSort("lastOutreach")}
              style={{ cursor: "pointer", padding: "10px" }}
            >
              Last Outreach{renderSortArrow("lastOutreach")}
            </th>
            <th
              onClick={() => handleSort("owner")}
              style={{ cursor: "pointer", padding: "10px" }}
            >
              Created By{renderSortArrow("owner")}
            </th>
            <th
              onClick={() => handleSort("created")}
              style={{ cursor: "pointer", padding: "10px" }}
            >
              On{renderSortArrow("created")}
            </th>
            <th
              style={{
                padding: "10px 10px 10px 20px",
                borderTopRightRadius: "30px",
                borderBottomRightRadius: "30px",
              }}
            >
              <span style={{ position: "relative", top: "-2px" }}>
                <BsGear />
              </span>
            </th>
          </tr>
        </thead>
        <tbody style={{ fontSize: "11pt" }}>
          {filteredProspects.map((p) => {
            const owner = companyState.members.find((m) => m.userId === p.userId);
            const metrics = metricsByProspectId[p._id] || {
              recentActions: 0,
              lastOutreachMs: null,
            };
            const recentActions = metrics.recentActions;
            const lastOutreachText = metrics.lastOutreachMs
            ? formatDateTime(new Date(metrics.lastOutreachMs))
            : "—";
            const typeName =
              prospectTypes.find((t) => t._id === p.typeId)?.name || "—";
            return (
              <React.Fragment key={p._id}>
                <tr
                  onClick={() =>
                    setExpanded(expanded === p._id ? null : p._id)
                  }
                  style={{
                    background: expanded === p._id ? "#f1f5f9" : "white",
                    cursor: "pointer",
                  }}
                >
                  {/*
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    {typeName}
                  </td>
                  */}
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    {p.company}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    {p.firstName}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    {p.lastName}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    {maskPhone(p.phone)}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    {p.email}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    {recentActions}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    {lastOutreachText}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    {owner?.firstName + " " + owner?.lastName}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    {formatDateTime(new Date(p.created))}
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    {role !== "advisor" &&
                    !(
                      role === "manager" &&
                      p.userId.toString() !== thisUser?.userId?.toString()
                    ) ? (
                      <>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditProspect({
                              ...p,
                              phone: maskPhone(cleanPhone(p.phone || "")),
                            });
                            setEditProspectErrors({});
                          }}
                          style={{
                            display: "inline-block",
                            cursor: "pointer",
                            position: "relative",
                            top: "-1px",
                            paddingRight: "10px",
                          }}
                        >
                          <BsPencil />
                        </div>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDeleteProspectId(p._id);
                          }}
                          style={{
                            display: "inline-block",
                            cursor: "pointer",
                            position: "relative",
                            top: "-1px",
                          }}
                        >
                          <BsTrash3 />
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: "center" }}>-</div>
                    )}
                  </td>
                </tr>
                {expanded === p._id && (
                  <tr>
                    <td colSpan={10} style={{ padding: "10px", background: "#f9fafb" }}>
                      {outreach.filter((o) => o.prospectId === p._id).length === 0 ? (
                        <p>No outreach records</p>
                      ) : (
                        <ul style={{ paddingLeft: "0px" }}>
                          {outreach
                            .filter((o) => o.prospectId === p._id)
                            .sort(
                              (a, b) =>
                                new Date(b.created).getTime() -
                                new Date(a.created).getTime()
                            )
                            .map((o, ii) => {
                              const totalActions = getOutreachActionsTotal(o);
                              const oOwner = companyState.members.find(m => m.userId === o.userId);
                              let outreachOwner = "";
                              if (oOwner) {
                                outreachOwner = oOwner.firstName + ' ' + oOwner.lastName;
                              }
                              return (
                                <li
                                  key={o._id}
                                  style={{
                                    marginBottom: "16px",
                                    listStyle: "none",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      padding: "8px 12px",
                                      background: "#fff",
                                      borderRadius: "5px",
                                      fontSize: "16px",
                                      color: "#111827",
                                      marginBottom: "6px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                      }}
                                    >
                                      {role !== "advisor" &&
                                      !(
                                        role === "manager" &&
                                        p.userId.toString() !==
                                          thisUser?.userId?.toString()
                                      ) && (
                                        <>
                                          <span
                                            style={{
                                              paddingRight: "6px",
                                              position: "relative",
                                              top: "-1px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => handleEditOutreach(o)}
                                          >
                                            <BsPencil />
                                          </span>
                                          <span
                                            style={{
                                              paddingRight: "6px",
                                              position: "relative",
                                              top: "-1px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              handleDeleteOutreach(o)
                                            }
                                          >
                                            <BsTrash3 />
                                          </span>
                                        </>
                                      )}
                                    </div>

                                    <div style={{ fontWeight: "normal" }}>
                                      {outreachOwner !== "" &&
                                        <span style={{ fontWeight: "normal" }}>
                                          Sales Person: {outreachOwner}
                                          &nbsp;&nbsp;|&nbsp;&nbsp;
                                        </span>
                                      }
                                      <span style={{ fontWeight: "normal" }}>
                                        Created: {formatDateTime(o.created)}
                                        &nbsp;&nbsp;|&nbsp;&nbsp;
                                      </span>
                                      {o.modified && (
                                        <span>
                                          Modified: {formatDateTime(o.modified)}
                                          &nbsp;&nbsp;|&nbsp;&nbsp;
                                        </span>
                                      )}
                                      <span>
                                        Total Actions: {formatNumber(totalActions)}
                                      </span>
                                    </div>
                                  </div>

                                  <div style={{ padding: "4px 0 8px 0", whiteSpace: "pre-wrap" }}>
                                    {o.notes}
                                  </div>

                                  <ul
                                    style={{
                                      marginLeft: "20px",
                                      marginTop: 0,
                                    }}
                                  >
                                    {o.success && (
                                      <li key={"success-" + ii}>
                                        Success of the Week: Yes
                                      </li>
                                    )}

                                    {o.actions
                                      .filter(
                                        (a) =>
                                          a.value !== "" && a.value !== "false"
                                      )
                                      .map((a, i) => {
                                        let name = a.name;
                                        let action = companyState.actions.find(
                                          (action) => action._id === a.name
                                        );
                                        if (action) {
                                          let caction =
                                            companyState.companyActions.find(
                                              (caction) =>
                                                caction.actionId === action?._id
                                            );
                                          if (caction) {
                                            name = caction.name;
                                          } else {
                                            name = action.name;
                                          }
                                        }
                                        return (
                                          <li key={"action-" + i}>
                                            {name}:{" "}
                                            {a.value === "true"
                                              ? "Yes"
                                              : a.value}
                                          </li>
                                        );
                                      })}

                                    {o.amounts
                                      .filter(
                                        (amt) =>
                                          amt.value !== "" && amt.value !== "0"
                                      )
                                      .map((amt, i) => {
                                        let name = amt.name;
                                        let amount = companyState.amounts.find(
                                          (amount) => amount._id === amt.name
                                        );

                                        if (amount) {
                                          let camount =
                                            companyState.companyAmounts.find(
                                              (camount) =>
                                                camount.actionId === amount!._id
                                            );
                                          name = camount
                                            ? camount.label
                                            : amount.label;
                                        }

                                        return (
                                          <li key={"amount" + i}>
                                            {name}: ${formatNumber(amt.value)}
                                          </li>
                                        );
                                      })}
                                  </ul>
                                </li>
                              );
                            })}
                        </ul>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {/* Edit Prospect Modal */}
      {editProspect && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "16px",
              width: "400px",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>Edit Contact</h3>
            <select
              className="form-control"
              style={{ marginBottom: "10px" }}
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
              style={{ marginBottom: "10px" }}
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
              style={{ marginBottom: "10px" }}
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
              style={{ marginBottom: "10px" }}
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
              style={{ marginBottom: "10px" }}
              value={maskPhone((editProspect as any).phone) || ""}
              onChange={(e) =>
                setEditProspect({
                  ...editProspect,
                  phone: maskPhone(cleanPhone(e.target.value)),
                } as Prospect)
              }
              placeholder="Phone*"
            />
            <input
              className={`form-control ${
                editProspectErrors.email ? "form-control-error" : ""
              }`}
              style={{ marginBottom: "10px" }}
              value={(editProspect as any).email || ""}
              onChange={(e) =>
                setEditProspect({
                  ...editProspect,
                  email: e.target.value,
                } as Prospect)
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
                style={{
                  marginRight: "10px",
                }}
              >
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="button-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Prospect Confirm Modal */}
      {deleteProspectId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "16px",
              width: "450px",
              textAlign: "center",
            }}
          >
            <h3>Delete Contact?</h3>
            <p>
              This action cannot be undone. All related outreach records will
              also be deleted.
            </p>
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() => setDeleteProspectId(null)}
                className="button-primary-cancel"
                style={{
                  marginRight: "10px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="button-primary"
                style={{
                  marginRight: "10px",
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Outreach Confirm Modal */}
      {deleteOutreachId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "16px",
              width: "450px",
              textAlign: "center",
            }}
          >
            <h3>Delete Outreach?</h3>
            <p>This action cannot be undone.</p>
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() => setDeleteOutreachId(null)}
                className="button-primary-cancel"
                style={{
                  marginRight: "10px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteOutreach}
                className="button-primary"
                style={{
                  marginRight: "10px",
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Outreach Modal */}
      {editOutreach && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "16px",
              width: "80%",
              height: "90%",
              overflowY: "auto",
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
                paddingLeft: "15px",
              }}
            >
              <h3 style={{ margin: 0 }}>Edit Outreach</h3>

              <button
                onClick={() => setEditOutreach(null)}
                aria-label="Close"
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "26px",
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: "6px 10px", // bigger click target
                }}
              >
                ×
              </button>
            </div>

            <Work
              mode="update"
              outreach={editOutreach}
              cancelEditHandler={() => setEditOutreach(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default CustomerListTab;
