import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Core/hooks";
import {
  deleteUserInvite,
  getCompany,
  getMembers,
  inviteUser,
  resendInvite,
  saveUser,
  setMembers,
} from "../../Store/Company";
import { getSettings } from "../../Store/Settings";
import { format } from "date-fns";
import Avatar from "../Avatar";
import { BsGear, BsPencil, BsTrash3 } from "react-icons/bs";
import { Member } from "../../Models/Requests/Member";
import { capitalizeFirstLetter } from "../../Helpers/capitalizeFirstLetter";
import { Role } from "../../Helpers/types";
import { isValidEmail } from "../../Helpers/isValidEmail";

function UserTab() {
  const dispatch = useAppDispatch();
  const companyState = useAppSelector(getCompany);
  const settingsState = useAppSelector(getSettings);

  const [sortField, setSortField] = useState<
    "name" | "role" | "lastLogin" | "status" | "platform" | "created" | "goal"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [editUser, setEditUser] = useState<Member | null>(null);
  const [creatingUser, setCreatingUser] = useState(false);

  const [deleteUserInviteEmail, setDeleteUserInviteEmail] = useState<string | undefined>(undefined);

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [roleError, setRoleError] = useState(false);

  const [actionGoal, setActionGoal] = useState("");
  const [actionGoalError, setActionGoalError] = useState(false);

  // ✅ includeInReports (create modal state)
  const [includeInReports, setIncludeInReports] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [teams, setTeams] = useState<string[]>([]);

  const [resending, setResending] = useState<string | null>(null);
  const [resentSuccess, setResentSuccess] = useState<string | null>(null);

  useEffect(() => {
    const company = companyState.company;
    if (company) {
      dispatch(getMembers(company._id));
    }
  }, []);

  const handleSaveUser = () => {
    if (!editUser) return;

    if (!editUser.firstName || editUser.firstName.trim() === "") {
      setFirstNameError(true);
      return;
    }
    if (!editUser.lastName || editUser.lastName.trim() === "") {
      setLastNameError(true);
      return;
    }

    const companyId = companyState.company?._id;
    if (companyId) {
      const payloadUser: any = {
        ...editUser,
        // ensure booleans are explicit
        active: editUser.active !== false,
        includeInReports: (editUser as any).includeInReports === true ? true : false,
        ...(editUser.actionGoal !== undefined && editUser.actionGoal !== null
          ? { actionGoal: editUser.actionGoal }
          : {}),
      };

      // backend
      dispatch(
        saveUser({
          companyId,
          user: payloadUser,
          ...(payloadUser.actionGoal !== undefined ? { actionGoal: payloadUser.actionGoal } : {}),
        })
      );

      // frontend
      const members = [...companyState.members];
      const index = members.findIndex((m) => m.userId === editUser.userId);
      if (index !== -1) {
        members[index] = payloadUser;
        dispatch(setMembers(members));
      }
    }

    setFirstNameError(false);
    setLastNameError(false);
    setActionGoalError(false);
    setEditUser(null);
  };

  const handleCreateUser = () => {
    const userExists = companyState.members.find((m) => m.email === email);

    if (!firstName || firstName.trim() === "") {
      setFirstNameError(true);
      return;
    }
    if (!lastName || lastName.trim() === "") {
      setLastNameError(true);
      return;
    }
    if (!email || email.trim() === "" || !isValidEmail(email) || userExists) {
      setEmailError(true);
      return;
    }

    const num = Number(actionGoal);
    if (actionGoal !== "") {
      if (!Number.isInteger(num) || num <= 0) {
        setActionGoalError(true);
        return;
      }
    }

    const companyId = companyState.company?._id;
    if (companyId) {
      dispatch(
        inviteUser({
          companyId,
          user: {
            firstName,
            lastName,
            email,
            role,
            teams,
            includeInReports,
            ...(actionGoal !== "" && { actionGoal: Number(actionGoal) }),
          } as any,
        })
      );
    }

    setFirstName("");
    setLastName("");
    setRole("member");
    setEmail("");
    setActionGoal("");
    setIncludeInReports(true);
    setFirstNameError(false);
    setLastNameError(false);
    setEmailError(false);
    setRoleError(false);
    setActionGoalError(false);
    setCreatingUser(false);
    setTeams([]);
  };

  const handleResendInvite = (email: string) => {
    const companyId = companyState.company?._id;
    if (!companyId) return;

    setResending(email);
    setResentSuccess(null);

    dispatch(resendInvite({ companyId, email }));

    setResending(null);
    setResentSuccess(email);
    setTimeout(() => setResentSuccess(null), 3000);
  };

  // sort + search
  const searchText = (settingsState.settings.searchText || "").toLowerCase();
  const filteredMembers = useMemo(() => {
    let members = companyState.members || [];
    if (searchText) {
      members = members.filter(
        (m) =>
          m.firstName.toLowerCase().includes(searchText) ||
          m.lastName.toLowerCase().includes(searchText) ||
          m.email.toLowerCase().includes(searchText) ||
          (m.role && m.role.toLowerCase().includes(searchText))
      );
    }

    return [...members].sort((a, b) => {
      let aVal: any = "";
      let bVal: any = "";

      const isNumericSort = sortField === "goal" || sortField === "lastLogin" || sortField === "created";

      switch (sortField) {
        case "name":
          aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
          bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case "platform":
          aVal = `${a.platform}`.toLowerCase();
          bVal = `${b.platform}`.toLowerCase();
          break;
        case "role":
          aVal = (a.role || "").toLowerCase();
          bVal = (b.role || "").toLowerCase();
          break;
        case "status": {
          const aStatus = a.status === "invited" ? "Invited" : a.active === false ? "Inactive" : "Active";
          const bStatus = b.status === "invited" ? "Invited" : b.active === false ? "Inactive" : "Active";
          aVal = aStatus.toLowerCase();
          bVal = bStatus.toLowerCase();
          break;
        }
        case "goal":
          aVal = a.actionGoal ?? 0;
          bVal = b.actionGoal ?? 0;
          break;
        case "lastLogin":
          aVal = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
          bVal = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
          break;
        case "created":
          aVal = a.created ? new Date(a.created).getTime() : 0;
          bVal = b.created ? new Date(b.created).getTime() : 0;
          break;
      }

      if (isNumericSort) {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [companyState.members, searchText, sortField, sortOrder]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortArrow = (field: typeof sortField) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  return (
    <div style={{ padding: "0px 20px 10px 20px" }}>
      {/* Header + Invite */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <h1></h1>
        <Link to="" className="btn-orange" onClick={() => setCreatingUser(true)}>
          Invite Users
        </Link>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#051a26", color: "#fff" }}>
          <tr>
            <th
              onClick={() => handleSort("name")}
              style={{
                cursor: "pointer",
                padding: "10px",
                borderTopLeftRadius: "30px",
                borderBottomLeftRadius: "30px",
              }}
            >
              Name{renderSortArrow("name")}
            </th>
            <th onClick={() => handleSort("platform")} style={{ cursor: "pointer", padding: "10px" }}>
              Type{renderSortArrow("platform")}
            </th>
            <th onClick={() => handleSort("role")} style={{ cursor: "pointer", padding: "10px" }}>
              Role{renderSortArrow("role")}
            </th>
            <th onClick={() => handleSort("goal")} style={{ cursor: "pointer", padding: "10px" }}>
              Action Goal{renderSortArrow("goal")}
            </th>
            <th style={{ padding: "10px", textAlign: "center" }}>Reports</th>
            <th onClick={() => handleSort("status")} style={{ cursor: "pointer", padding: "10px" }}>
              Status{renderSortArrow("status")}
            </th>
            <th onClick={() => handleSort("created")} style={{ cursor: "pointer", padding: "10px" }}>
              Created{renderSortArrow("created")}
            </th>
            <th onClick={() => handleSort("lastLogin")} style={{ cursor: "pointer", padding: "10px" }}>
              Last Active{renderSortArrow("lastLogin")}
            </th>
            <th
              style={{
                textAlign: "center",
                padding: "10px 20px 10px 10px",
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

        <tbody>
          {filteredMembers.map((m, idx) => {
            const name = m.firstName || m.lastName ? `${m.firstName} ${m.lastName}` : "Pending Invite";
            const status = m.status === "invited" ? "Invited" : m.active === false ? "Inactive" : "Active";
            const statusColor = m.status === "invited" ? "orange" : m.active === false ? "red" : "green";
            const inReports = (m as any).includeInReports === true;

            return (
              <tr key={idx} style={{ background: "white", borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px", display: "flex", alignItems: "center" }}>
                  <Avatar size="small" member={m} />
                  <div style={{ marginLeft: "10px" }}>
                    <div style={{ fontWeight: "600" }}>
                      {name}
                      {m.me && (
                        <span
                          style={{
                            background: "linear-gradient(135deg, #8e44ad, #6f42c1)",
                            color: "white",
                            borderRadius: "999px",
                            padding: "2px 10px",
                            fontSize: "10px",
                            fontWeight: 600,
                            marginLeft: "6px",
                            letterSpacing: "0.3px",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                            textTransform: "uppercase",
                            display: "inline-block",
                          }}
                        >
                          ME
                        </span>
                      )}
                      {m.status === "invited" && (
                        <span
                          style={{
                            background: "linear-gradient(135deg, #28a745, #218838)",
                            color: "white",
                            borderRadius: "999px",
                            padding: "2px 10px",
                            fontSize: "10px",
                            fontWeight: 600,
                            marginLeft: "6px",
                            letterSpacing: "0.3px",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                            textTransform: "uppercase",
                            display: "inline-block",
                          }}
                        >
                          Invited
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "10pt", color: "#555" }}>{m.email}</div>
                  </div>
                </td>

                <td style={{ padding: "10px" }}>{capitalizeFirstLetter(m.platform) || "-"}</td>
                <td style={{ padding: "10px" }}>{capitalizeFirstLetter(m.role) || "—"}</td>

                <td style={{ padding: "10px" }}>
                  {m.actionGoal ? (
                    m.actionGoal
                  ) : (
                    <span style={{ fontSize: "9pt", fontStyle: "italic", color: "gray" }}>Using Company Setting</span>
                  )}
                </td>

                <td style={{ padding: "10px", textAlign: "center" }}>{inReports ? "✓" : "—"}</td>

                <td style={{ padding: "10px", color: statusColor }}>{status}</td>

                <td style={{ padding: "10px" }}>{m.created ? format(new Date(m.created), "M/d/yy") : ""}</td>

                {m.status === "invited" ? (
                  <td style={{ padding: "10px" }}>
                    {resending === m.email ? (
                      <span style={{ color: "#8e44ad", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            border: "2px solid #8e44ad",
                            borderTop: "2px solid transparent",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        />
                        Sending...
                      </span>
                    ) : resentSuccess === m.email ? (
                      <span
                        style={{
                          background: "linear-gradient(135deg, #28a745, #218838)",
                          color: "white",
                          borderRadius: "999px",
                          padding: "3px 10px",
                          fontSize: "10px",
                          fontWeight: 600,
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                          textTransform: "uppercase",
                          display: "inline-block",
                        }}
                      >
                        Sent ✓
                      </span>
                    ) : (
                      <Link to="" onClick={() => handleResendInvite(m.email)}>
                        Resend Invite
                      </Link>
                    )}
                  </td>
                ) : (
                  <td style={{ padding: "10px" }}>{m.lastLogin ? format(new Date(m.lastLogin), "M/d/yy") : ""}</td>
                )}

                <td style={{ padding: "10px 25px 10px 10px", textAlign: "right" }}>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setEditUser(m);
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

                  {/* ✅ Only allow delete of INVITES (not users) */}
                  {m.role !== "owner" && m.status === "invited" && (
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteUserInviteEmail(m.email);
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
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Create Modal */}
      {creatingUser && (
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
          <div style={{ background: "#fff", padding: "30px", borderRadius: "16px", width: "400px" }}>
            <h3 style={{ marginBottom: "10px" }}>Invite User</h3>

            <input
              className="form-control"
              style={{ marginBottom: "10px", ...(firstNameError && { border: "1px solid red" }) }}
              value={firstName}
              onChange={(e) => {
                setFirstNameError(false);
                setFirstName(e.target.value);
              }}
              placeholder="First Name*"
            />

            <input
              className="form-control"
              style={{ marginBottom: "10px", ...(lastNameError && { border: "1px solid red" }) }}
              value={lastName}
              onChange={(e) => {
                setLastNameError(false);
                setLastName(e.target.value);
              }}
              placeholder="Last Name*"
            />

            <input
              className="form-control"
              style={{ marginBottom: "10px", ...(emailError && { border: "1px solid red" }) }}
              value={email}
              onChange={(e) => {
                setEmailError(false);
                setEmail(e.target.value);
              }}
              placeholder="Email*"
            />

            <select
              className="form-control"
              style={{ marginBottom: "10px", ...(roleError && { border: "1px solid red" }) }}
              value={role}
              onChange={(e) => {
                setRoleError(false);
                setRole(e.target.value as Role);
              }}
            >
              {companyState.roles
                .filter((r) => r.name !== "owner")
                .map((r) => (
                  <option key={r.name} value={r.name}>
                    {capitalizeFirstLetter(r.name)}
                  </option>
                ))}
            </select>

            <input
              className="form-control"
              style={{ marginBottom: "10px", ...(actionGoalError && { border: "1px solid red" }) }}
              value={actionGoal}
              onChange={(e) => {
                setActionGoalError(false);
                setActionGoal(e.target.value);
              }}
              placeholder="Weekly Action Goal, Per Member"
            />

            <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: "11pt" }}>
              <input type="checkbox" checked={includeInReports} onChange={(e) => setIncludeInReports(e.target.checked)} />
              Include in Reports
            </label>

            {companyState.teams.length > 0 && (
              <select
                multiple
                className="form-control form-control-10px-border"
                style={{ marginBottom: "10px" }}
                value={teams}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
                  setTeams(selected);
                }}
                size={Math.min(companyState.teams.length + 1, 6)}
              >
                <option disabled>Optional - choose team(s)</option>
                {companyState.teams.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button
                onClick={() => {
                  setFirstNameError(false);
                  setLastNameError(false);
                  setRoleError(false);
                  setActionGoalError(false);
                  setCreatingUser(false);
                  setTeams([]);
                  setRole("member");
                  setIncludeInReports(true);
                }}
                className="button-primary-cancel"
                style={{ marginRight: "10px" }}
              >
                Cancel
              </button>
              <button onClick={handleCreateUser} className="button-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
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
          <div style={{ background: "#fff", padding: "30px", borderRadius: "16px", width: "420px" }}>
            {/* ✅ Heading row with Active toggle on the right */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <h3 style={{ margin: 0 }}>{editUser.status === "invited" ? "Update Invite" : "Update User"}</h3>

              {(editUser.status !== "invited" && editUser.role !== "owner" && !editUser.me) && (
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "11pt", margin: 0 }}>
                  <span style={{ fontSize: "10pt", color: "#333" }}>Active</span>
                  <input
                    type="checkbox"
                    checked={editUser.active !== false}
                    onChange={(e) => setEditUser({ ...editUser, active: e.target.checked })}
                  />
                </label>
              )}
            </div>

            <input
              className="form-control"
              style={{ marginBottom: "10px", ...(firstNameError && { border: "1px solid red" }) }}
              value={editUser.firstName}
              onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })}
              placeholder="First Name*"
            />

            <input
              className="form-control"
              style={{ marginBottom: "10px", ...(lastNameError && { border: "1px solid red" }) }}
              value={editUser.lastName}
              onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })}
              placeholder="Last Name*"
            />

            {editUser.role !== "owner" && (
              <select
                className="form-control"
                style={{ marginBottom: "10px" }}
                value={editUser.role}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value as Role })}
              >
                {companyState.roles
                  .filter((r) => r.name !== "owner")
                  .map((r) => (
                    <option key={r._id} value={r.name}>
                      {capitalizeFirstLetter(r.name)}
                    </option>
                  ))}
              </select>
            )}

            <input
              className="form-control"
              style={{ marginBottom: "10px", ...(actionGoalError && { border: "1px solid red" }) }}
              value={editUser.actionGoal ?? ""}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                  setActionGoalError(false);
                  setEditUser({ ...editUser, actionGoal: undefined });
                  return;
                }

                const isValidInteger = /^[0-9]+$/.test(value);
                setActionGoalError(!isValidInteger);

                const num = Number(value);
                setEditUser({ ...editUser, actionGoal: Number.isNaN(num) ? undefined : num });
              }}
              placeholder="Weekly Action Goal, Per Member"
            />

            {/* Include In Reports (edit) */}
            <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: "11pt" }}>
              <input
                type="checkbox"
                checked={(editUser as any).includeInReports === true}
                onChange={(e) => setEditUser({ ...(editUser as any), includeInReports: e.target.checked } as any)}
              />
              Include in Reports
            </label>

            {companyState.teams.length > 0 && (
              <select
                multiple
                className="form-control form-control-10px-border"
                style={{ marginBottom: "10px" }}
                value={editUser.teams}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
                  setEditUser({ ...editUser, teams: selected });
                }}
                size={Math.min(companyState.teams.length + 1, 6)}
              >
                <option disabled>Optional - choose team(s)</option>
                {companyState.teams.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button
                onClick={() => {
                  setFirstNameError(false);
                  setLastNameError(false);
                  setActionGoalError(false);
                  setEditUser(null);
                }}
                className="button-primary-cancel"
                style={{ marginRight: "10px" }}
              >
                Cancel
              </button>
              <button onClick={handleSaveUser} className="button-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Invite Confirm Modal (only for invites) */}
      {deleteUserInviteEmail && (
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
          <div style={{ background: "#fff", padding: "25px", borderRadius: "16px", width: "450px", textAlign: "center" }}>
            <h3>Delete Invite?</h3>
            <p>This action cannot be undone.</p>
            <div style={{ marginTop: "20px" }}>
              <button
                onClick={() => setDeleteUserInviteEmail(undefined)}
                className="button-primary-cancel"
                style={{ marginRight: "10px" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const companyId = companyState.company?._id;
                  if (!companyId) return;

                  dispatch(deleteUserInvite({ companyId, email: deleteUserInviteEmail })); // backend

                  const members = [...companyState.members];
                  const index = members.findIndex((m) => m.email === deleteUserInviteEmail);
                  if (index !== -1) {
                    members.splice(index, 1);
                    dispatch(setMembers(members));
                  }

                  setDeleteUserInviteEmail(undefined);
                }}
                className="button-primary"
                style={{ marginRight: "10px" }}
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

export default UserTab;
