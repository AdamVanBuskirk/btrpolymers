import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Core/hooks";
import {
  deleteUserInvite,
  getMembers,
  inviteUser,
  resendInvite,
  saveUser,
  setMembers,
} from "../../Store/Company";
import { getSettings } from "../../Store/Settings";
import { format } from "date-fns";
import Avatar from "../Avatar";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import { capitalizeFirstLetter } from "../../Helpers/capitalizeFirstLetter";
import { Role } from "../../Helpers/types";
import { isValidEmail } from "../../Helpers/isValidEmail";
import { Member } from "../../Models/Requests/Member";

function UserTab() {
  const dispatch = useAppDispatch();
  const companyState = useAppSelector((state) => state.company);
  const settingsState = useAppSelector(getSettings);

  const [sortField, setSortField] = useState<"name" | "role" | "lastLogin" | "status" | "platform" | "created">("name");
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
    if (company) dispatch(getMembers(company._id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // ✅ ensure booleans are explicit (match desktop)
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

    // mimic desktop behavior (simple + snappy)
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
        case "lastLogin":
          aVal = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
          bVal = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
          break;
        case "created":
          aVal = a.created ? new Date(a.created).getTime() : 0;
          bVal = b.created ? new Date(b.created).getTime() : 0;
          break;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [companyState.members, searchText, sortField, sortOrder]);

  const modalBackdrop: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalContent: React.CSSProperties = {
    background: "#fff",
    borderRadius: "0",
    width: "100%",
    height: "100%",
    padding: "20px",
    overflowY: "auto",
  };

  return (
    <div style={{ padding: "15px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "18px", margin: 0 }}>Team Members</h2>
        <Link to="" className="btn-orange" onClick={() => setCreatingUser(true)}>
          Invite
        </Link>
      </div>

      {/* --- Card List --- */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filteredMembers.map((m, idx) => {
          const name = m.firstName || m.lastName ? `${m.firstName} ${m.lastName}` : "Pending Invite";

          const isInvited = m.status === "invited";
          const isActive = m.active !== false;

          const statusText = isInvited ? "Invited" : isActive ? "Active" : "Inactive";
          const statusColor = isInvited ? "orange" : isActive ? "green" : "red";

          const inReports = (m as any).includeInReports === true;

          return (
            <div
              key={idx}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "12px 16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                <Avatar size="small" member={m} />
                <div style={{ marginLeft: "10px", minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      whiteSpace: "normal",
                    }}
                  >
                    {name}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#555",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      whiteSpace: "normal",
                    }}
                  >
                    {m.email}
                  </div>

                  <div style={{ fontSize: "12px", color: "#777", marginTop: "3px" }}>
                    <div>
                      {inReports ? "Reports ✓" : "Reports —"}
                    </div>
                    {capitalizeFirstLetter(m.role)} •{" "}
                    <span style={{ color: statusColor, fontWeight: 600 }}>{statusText}</span>
                    {m.lastLogin && (
                      <div>
                        Last Active: {format(new Date(m.lastLogin), "M/d/yy")}
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: "12px", color: "#777", marginTop: "3px" }}>
                    Goal:{" "}
                    {m.actionGoal ? (
                      <span style={{ fontWeight: 600, color: "#111" }}>{m.actionGoal}</span>
                    ) : (
                      <span style={{ fontStyle: "italic" }}>Using Company Setting</span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                {isInvited && (
                  <button
                    onClick={() => handleResendInvite(m.email)}
                    style={{
                      background: "#f3f4f6",
                      border: "none",
                      borderRadius: "8px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      color: "#111",
                    }}
                  >
                    {resending === m.email
                      ? "Sending..."
                      : resentSuccess === m.email
                      ? "Sent ✓"
                      : "Resend"}
                  </button>
                )}

                <BsPencil style={{ cursor: "pointer" }} onClick={() => setEditUser(m)} />

                {/* ✅ Only allow delete of INVITES (not users) */}
                {m.role !== "owner" && isInvited && (
                  <BsTrash3
                    style={{ cursor: "pointer" }}
                    onClick={() => setDeleteUserInviteEmail(m.email)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Fullscreen Modals --- */}
      {creatingUser && (
        <div style={modalBackdrop}>
          <div style={modalContent}>
            <h3>Invite User</h3>

            <input
              className="form-control"
              style={{ marginBottom: "10px", ...(firstNameError && { border: "1px solid red" }) }}
              placeholder="First Name"
              value={firstName}
              onChange={(e) => {
                setFirstNameError(false);
                setFirstName(e.target.value);
              }}
            />

            <input
              className="form-control"
              style={{ marginBottom: "10px", ...(lastNameError && { border: "1px solid red" }) }}
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastNameError(false);
                setLastName(e.target.value);
              }}
            />

            <input
              className="form-control"
              style={{ marginBottom: "10px", ...(emailError && { border: "1px solid red" }) }}
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmailError(false);
                setEmail(e.target.value);
              }}
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

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "6px",
                marginBottom: "6px",
                fontSize: "14px",
              }}
            >
              <input
                type="checkbox"
                checked={includeInReports}
                onChange={(e) => setIncludeInReports(e.target.checked)}
                style={{ transform: "scale(1.15)" }}
              />
              Include in Reports
            </label>

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button
                onClick={() => {
                  setCreatingUser(false);
                  setFirstNameError(false);
                  setLastNameError(false);
                  setEmailError(false);
                  setRoleError(false);
                  setActionGoalError(false);
                  setIncludeInReports(true);
                  setTeams([]);
                  setRole("member");
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

      {editUser && (
        <div style={modalBackdrop}>
          <div style={modalContent}>
            {/* ✅ Header row w/ Active toggle on right (match desktop behavior) */}
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
              placeholder="First Name"
              value={editUser.firstName}
              onChange={(e) => {
                setFirstNameError(false);
                setEditUser({ ...editUser, firstName: e.target.value });
              }}
            />

            <input
              className="form-control"
              style={{ marginBottom: "10px", ...(lastNameError && { border: "1px solid red" }) }}
              placeholder="Last Name"
              value={editUser.lastName}
              onChange={(e) => {
                setLastNameError(false);
                setEditUser({ ...editUser, lastName: e.target.value });
              }}
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

            {/* ✅ Include In Reports (edit) - default true if missing */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "6px",
                marginBottom: "6px",
                fontSize: "14px",
              }}
            >
              <input
                type="checkbox"
                checked={(editUser as any).includeInReports === true}
                onChange={(e) =>
                  setEditUser({ ...(editUser as any), includeInReports: e.target.checked } as any)
                }
                style={{ transform: "scale(1.15)" }}
              />
              Include in Reports
            </label>

            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button
                onClick={() => {
                  setEditUser(null);
                  setFirstNameError(false);
                  setLastNameError(false);
                  setActionGoalError(false);
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

      {/* ✅ Delete Invite Confirm Modal (only for invites) */}
      {deleteUserInviteEmail && (
        <div style={modalBackdrop}>
          <div style={modalContent}>
            <h3>Delete Invite?</h3>
            <p>This action cannot be undone.</p>
            <div style={{ marginTop: "20px", textAlign: "right" }}>
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
