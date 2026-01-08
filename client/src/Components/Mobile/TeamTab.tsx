import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector, useIsMobile } from "../../Core/hooks";
import { createTeam, deleteTeam, getCompany, getMembers, getTeams, saveTeam, saveTeamMembers, setMembers, setTeams } from "../../Store/Company";
import { getSettings } from "../../Store/Settings";
import { getUser } from "../../Store/Auth";
import { format } from "date-fns";
import Avatar from "../Avatar";
import { BsThreeDots, BsGear, BsPencil, BsTrash3, BsPerson } from "react-icons/bs";
import SharingContext from "../../Modals/SharingContext";
import MemberContextMenu from "../../Modals/MemberContextMenu";
import PopupContextMenu from "../../Modals/PopupContext";
import { SharingContextParam } from "../../Models/Requests/SharingContextParam";
import { MemberContextMenuParam } from "../../Models/Requests/MemberContexMenuParam";
import { PopupContextParam } from "../../Models/Requests/PopupContextParam";
import { Member } from "../../Models/Requests/Member";
import { capitalizeFirstLetter } from "../../Helpers/capitalizeFirstLetter";
import { Team } from "../../Models/Team";
import { generateGUID } from "../../Helpers/generateGuid";

function TeamTab() {

    const dispatch = useAppDispatch();
    const companyState = useAppSelector(getCompany);
    const settingsState = useAppSelector(getSettings);
    const userState = useAppSelector(getUser);
    const isMobile = useIsMobile();

    const [popupParams, setPopupParams] = useState<PopupContextParam>();
    const [sharingContextParams, setSharingContextParams] = useState<SharingContextParam>();
    const [memberContextMenuParams, setMemberContextMenuParams] = useState<MemberContextMenuParam>();
    const [sortField, setSortField] = useState<"name" | "memberCount">("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [editTeam, setEditTeam] = useState<Team | null>(null);
    const [deleteTeamId, setDeleteTeamId] = useState<string | undefined>(undefined);
    const [creatingTeam, setCreatingTeam] = useState(false);
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState(false);
    const [actionGoal, setActionGoal] = useState("");
    const [actionGoalError, setActionGoalError] = useState(false);
    const [managingTeam, setManagingTeam] = useState<Team | null>(null);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    useEffect(() => {
        const company = companyState.company;
        if (company) {
            dispatch(getTeams(company._id));
        }
    }, []);
  

    const handleOpenManageMembers = (team: Team) => {
        const teamMembers = (companyState.members || [])
          .filter((m) => Array.isArray(m.teams) && m.teams.includes(team._id) && m.status !== "invited")
          .map((m) => m.userId)
          .filter((id): id is string => Boolean(id)); // removes undefined and asserts type
      
        setSelectedMembers(teamMembers);
        setManagingTeam(team);
      };
      
      
      const handleToggleMember = (userId?: string) => {
        if (!userId) return; // ignore undefined IDs safely
        setSelectedMembers((prev) =>
          prev.includes(userId)
            ? prev.filter((id) => id !== userId)
            : [...prev, userId]
        );
      };
      
      
      const handleSaveTeamMembers = () => {
        if (!managingTeam) return;
      
        const teamId = managingTeam._id;
        const allMembers = companyState.members || [];
      
        // ✅ Create new array of members with proper team membership
        const updatedMembers = allMembers.map((m) => {
          if (!m?.userId) return m; // skip invalid
      
          const inTeam = Array.isArray(m.teams) && m.teams.includes(teamId);
          const shouldBeInTeam = selectedMembers.includes(m.userId);
      
          // only mutate if there's an actual change
          if (shouldBeInTeam && !inTeam) {
            // add user to team
            return { ...m, teams: [...(m.teams || []), teamId] };
          } else if (!shouldBeInTeam && inTeam) {
            // remove user from team
            return { ...m, teams: (m.teams || []).filter((tid) => tid !== teamId) };
          }
          return m; // no change
        });
      
        // ✅ Only send checked users (not everyone)
        const userIds = selectedMembers.filter(
          (id): id is string => typeof id === "string" && id.trim() !== ""
        );
      
        // ✅ Dispatch frontend updates
        dispatch(setMembers(updatedMembers));
        dispatch(saveTeamMembers({ teamId, userIds: userIds })); // <- key fix: pass as "members", not "userIds"
      
        // ✅ Close modal
        setManagingTeam(null);
      };
      
      

  // sort and search logic
  const searchText = (settingsState.settings.searchText || "").toLowerCase();
  const filteredTeams = useMemo(() => {
    let teams = companyState.teams || [];
    if (searchText) {
      teams = teams.filter(
        (t) => t.name.toLowerCase().includes(searchText)
      );
    }

    return [...teams].sort((a, b) => {
      let aVal = "", bVal = "";
      switch (sortField) {
        case "name":
            aVal = `${a.name} ${a.name}`.toLowerCase();
            bVal = `${b.name} ${b.name}`.toLowerCase();
            break;
        case "memberCount": {
            const members = companyState.members.filter(m => m.status !== "invited") || [];
            const aCount = members.filter((m) => Array.isArray(m.teams) && m.teams.includes(a._id)).length;
            const bCount = members.filter((m) => Array.isArray(m.teams) && m.teams.includes(b._id)).length;
            aVal = aCount.toString();
            bVal = bCount.toString();
            break;
        }
      }
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [companyState.teams, searchText, sortField, sortOrder]);

    const handleCreateTeam = () => {
        if (!name || name.trim() === "") {
            setNameError(true);
            return;
        }

        if (actionGoal !== "") {
            const num = Number(actionGoal);
            if ( !Number.isInteger(num) || num <= 0) {
                setActionGoalError(true);
                return;
            }
        }

        let companyId = companyState.company?._id;
        if (companyId) {

            dispatch(createTeam({ 
                companyId, 
                name, 
                ...(actionGoal !== "" && { actionGoal: Number(actionGoal) }),
            }));
            // update the frontend
            let team: Team = {
                _id: generateGUID(),
                companyId,
                name,
                created: new Date(),
                modified: new Date(),
                active: true,
                ...(actionGoal !== "" && { actionGoal: Number(actionGoal) }),
            };

            dispatch(setTeams([...(companyState.teams ?? []), team]));
        }
        setNameError(false);
        setActionGoalError(false);
        setCreatingTeam(false);
        setName("");  
        setActionGoal("");
    };

    const handleSaveTeam = () => {
        if (!editTeam || !editTeam.name || editTeam.name.trim() === "") {
            setNameError(true);
            return;
        }

        // update the backend
        dispatch(saveTeam({ 
            teamId: editTeam._id , 
            name: editTeam.name, 
            ...(editTeam.actionGoal !== 0 && { actionGoal: editTeam.actionGoal }),
        }));
        // update the frontend
        let teams = [...companyState.teams];
        let index = teams.findIndex(t => t._id === editTeam._id);
        if (index !== -1) {
            teams[index] = {
                ...teams[index],
                name: editTeam.name,
                ...(editTeam.actionGoal !== 0 && { actionGoal: editTeam.actionGoal }),
            }
            dispatch(setTeams(teams));
        }
        setNameError(false);
        setActionGoalError(false);
        setEditTeam(null);
    };

    const handleConfirmDelete = () => {
        if (!deleteTeamId) return;

        // update backend
        dispatch(deleteTeam(deleteTeamId));

        // update frontend
        let teams = [...companyState.teams];
        let index = teams.findIndex(t => t._id === deleteTeamId);
        if (index !== -1) {
            teams.splice(index, 1);
            dispatch(setTeams(teams));
        }

        setDeleteTeamId(undefined);
    };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortArrow = (field: typeof sortField) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  return (
    <div style={{ padding: "20px 20px", backgroundColor: "#fff" }}>
      {/* Header + New Team */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <h1></h1>
        <Link to="" className="btn-orange" onClick={() => setCreatingTeam(true)}>
          Create Team
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
            <th
                onClick={() => handleSort("memberCount")}
                style={{ cursor: "pointer", padding: "10px", textAlign: "center" }}
            >
                <BsPerson /> {renderSortArrow("memberCount")}
            </th>
            <th
                style={{
                textAlign: "right",
                padding: "10px 40px 10px 10px",
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

        {filteredTeams.length > 0 ? (
            <tbody>
            {filteredTeams.map((t, i) => {
                const company = companyState.company;
                if (!company) return null;

                // ✅ Count how many members belong to this team
                const memberCount = (companyState.members || []).filter((m) =>
                    Array.isArray(m.teams) && m.teams.includes(t._id) && m.status !== "invited"
                ).length;

                return (
                <tr
                    key={i}
                    style={{ background: "white", borderBottom: "1px solid #ddd" }}
                >
                    <td style={{ padding: "10px" }}>{t.name}</td>
                    <td
                        style={{ padding: "10px", textAlign: "center", cursor: "pointer", color: "#007bff" }}
                        onClick={() => handleOpenManageMembers(t)}
                        title="Manage team members"
                        >
                        {memberCount}
                    </td>
                    <td
                    style={{
                        padding: "10px 25px 10px 10px",
                        textAlign: "right",
                    }}
                    >
                    <div
                        onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditTeam(t);
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
                        setDeleteTeamId(t._id);
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
                    </td>
                </tr>
                );
            })}
            </tbody>
        ) : (
            <tbody>
            <tr
                style={{
                margin: "0px auto",
                fontStyle: "italic",
                textAlign: "center",
                }}
            >
                <td colSpan={3} style={{ paddingTop: "50px" }}>
                Click Create Team to add your first
                </td>
            </tr>
            </tbody>
        )}
        </table>


        {/* Create Modal */}
        {creatingTeam && (
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
                zIndex: 1000,
            }}
        >
        <div
            style={{
                background: "#fff",
                width: "100%",
                height: "100%",
                borderRadius: "0px",
                padding: "20px",
                overflowY: "auto",
                boxSizing: "border-box",
            }}
        >
                <h3 style={{ marginBottom: "10px" }}>Create Team</h3>
                <input
                    className="form-control"
                    style={{ marginBottom: "10px", ...(nameError) && { border: "1px solid red" }}}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Team Name"
                />

                <input 
                    className="form-control"
                    style={{ marginBottom: "10px", ...(actionGoalError) && { border: "1px solid red" }}}
                    value={actionGoal}
                    onChange={(e) => setActionGoal(e.target.value)}
                    placeholder="Weekly Action Goal, Per Member" 
                />

                <div style={{ marginTop: "20px", textAlign: "right" }}>
                    <button
                        onClick={() => { 
                            setNameError(false); 
                            setName("");
                            setActionGoalError(false); 
                            setActionGoal("");
                            setCreatingTeam(false)
                        }}
                        className="button-primary-cancel"
                        style={{
                            marginRight: "10px"
                        }}>
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateTeam}
                        className="button-primary">
                        Save
                    </button>
                </div>
            </div>
            </div>
        )}

        {/* Edit Modal */}
        {editTeam && (
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
        zIndex: 1000,
        }}
        >
        <div
        style={{
            background: "#fff",
            width: "100%",
            height: "100%",
            borderRadius: "0px",
            padding: "20px",
            overflowY: "auto",
            boxSizing: "border-box",
        }}
        >
                <h3 style={{ marginBottom: "10px" }}>Update Team</h3>
                <input
                    className="form-control"
                    style={{ marginBottom: "10px", ...(nameError) && { border: "1px solid red" }}}
                    value={editTeam.name}
                    onChange={(e) => setEditTeam({ ...editTeam, name: e.target.value })}
                    placeholder="Team Name"
                />
                <input
                className="form-control"
                style={{ marginBottom: "10px" }}
                value={editTeam.actionGoal ?? ""}   // safe for undefined
                onChange={(e) => {
                    const value = e.target.value;

                    // User cleared the field
                    if (value === "") {
                    setActionGoalError(false);
                    setEditTeam({
                        ...editTeam,
                        actionGoal: undefined,
                    });
                    return;
                    }

                    const num = Number(value);

                    // Validate
                    if (!Number.isInteger(num) || num <= 0) {
                    setActionGoalError(true);      // show error
                    } else {
                    setActionGoalError(false);
                    }

                    // Always reflect what they typed into state
                    setEditTeam({
                    ...editTeam,
                    actionGoal: Number.isNaN(num) ? undefined : num,
                    });
                }}
                placeholder="Weekly Action Goal, Per Member"
                />
                <div style={{ marginTop: "20px", textAlign: "right" }}>
                    <button
                        onClick={() => { 
                            setNameError(false); 
                            setName("");
                            setActionGoalError(false); 
                            setActionGoal("");
                            setEditTeam(null)
                        }}
                        className="button-primary-cancel"
                        style={{
                            marginRight: "10px"
                        }}>
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveTeam}
                        className="button-primary">
                        Save
                    </button>
                </div>
            </div>
            </div>
        )}

        {/* Delete Confirm Modal */}
        {deleteTeamId && (
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
        zIndex: 1000,
        }}
        >
        <div
        style={{
            background: "#fff",
            width: "100%",
            height: "100%",
            borderRadius: "0px",
            padding: "20px",
            overflowY: "auto",
            boxSizing: "border-box",
        }}
        >
                <h3>Delete Team?</h3>
                <p>This action cannot be undone. All users who belong to this team will have it removed.</p>
                <div style={{ marginTop: "20px" }}>
                    <button
                        onClick={() => setDeleteTeamId(undefined)}
                        className="button-primary-cancel"
                        style={{
                            marginRight: "10px"
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmDelete}
                        className="button-primary"
                        style={{
                            marginRight: "10px"
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
            </div>
        )}

        {/* Manage Team Members Modal */}
        {managingTeam && (
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
        zIndex: 1000,
        }}
        >
        <div
        style={{
            background: "#fff",
            width: "100%",
            height: "100%",
            borderRadius: "0px",
            padding: "20px",
            overflowY: "auto",
            boxSizing: "border-box",
        }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                }}>
                <h3 style={{ margin: 0 }}>
                    {managingTeam.name}
                </h3>

                <button
                    onClick={() => setManagingTeam(null)}
                    aria-label="Close"
                    style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "26px",
                    cursor: "pointer",
                    lineHeight: 1,
                    padding: "6px 10px", // good tap target for mobile
                    }}
                >
                    ×
                </button>
            </div>

            <div style={{ marginBottom: "15px", color: "#666" }}>
                Add or remove users from this team:
            </div>

            {(companyState.members || [])
            .filter((m) => m.status !== "invited" && m.userId)
            .map((m) => (
                <label
                key={m.userId!}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 0",
                    width: "100%",
                }}
                >
                {/* Left: Avatar + Name */}
                <div
                    style={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                    minWidth: 0,
                    }}
                >
                    <Avatar size="small" member={m} />
                    <div
                    style={{
                        marginLeft: "10px",
                        overflow: "hidden",
                    }}
                    >
                    <div
                        style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        }}
                    >
                        {m.firstName} {m.lastName}
                    </div>

                    {/* Role (stacked under name on mobile) */}
                    <div
                        style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginTop: "2px",
                        textTransform: "capitalize",
                        }}
                    >
                        {m.role}
                    </div>
                    </div>
                </div>

                {/* Right: Checkbox */}
                <input
                    type="checkbox"
                    checked={selectedMembers.includes(m.userId!)}
                    onChange={() => handleToggleMember(m.userId)}
                    style={{
                    transform: "scale(1.1)", // slightly larger for touch
                    }}
                />
                </label>
            ))}



            <div style={{ marginTop: "20px", textAlign: "right" }}>
                <button
                onClick={() => setManagingTeam(null)}
                className="button-primary-cancel"
                style={{ marginRight: "10px" }}
                >
                Cancel
                </button>
                <button
                onClick={handleSaveTeamMembers}
                className="button-primary"
                >
                Save
                </button>
            </div>
            </div>
        </div>
        )}


    </div>
  );
}

export default TeamTab;
