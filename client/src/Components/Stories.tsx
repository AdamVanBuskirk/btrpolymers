import { CSSProperties, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../Core/hooks";
import { archiveSuccess, getCompany, getSuccessStories, setOutreach, setSuccessStories } from "../Store/Company";
import { SuccessStory } from "../Models/SuccessStory";
import { format } from "date-fns";
import { IoAdd, IoAddCircleOutline, IoArchiveOutline, IoCheckmarkCircle, IoCheckmarkCircleOutline, IoRemove, IoRemoveCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { fireConfetti } from "./Controls/Confetti";
import { Outreach } from "../Models/Outreach";
import { MdSettingsBackupRestore } from "react-icons/md";

function Stories() {

    const dispatch = useAppDispatch();
    const companyState = useAppSelector(getCompany);
    const [expandedOutreachIds, setExpandedOutreachIds] = useState<Set<string>>(new Set());
    const [mode, setMode] = useState<"active" | "archived">("active");
    let company = companyState.company;

    useEffect(() => {
        if (company?._id) {
            dispatch(getSuccessStories(company._id));
        }
    }, []);

    const handleModeChange = (newMode: "active" | "archived") => {
        setMode(newMode);
        /*
        if (newMode === "active") {
          if (!actions.some((a) => a.key === selected)) {
            setSelected(actions[0].key);
          }
        } else {
          if (!calls.some((c) => c.key === selected)) {
            setSelected(calls[0].key);
          }
        }
        */
      };
/*
    useEffect(() => {
        if (company?._id) {
            dispatch(getSuccessStories(company._id));
        }
    }, [companyState.outreach]);
*/
    const formatNumber = (num: string | number) => {
        if (num === null || num === undefined || num === "") return "";
    
        const parsed = Number(num);
        if (isNaN(parsed)) return String(num);
    
        return parsed.toLocaleString("en-US", {
          minimumFractionDigits: parsed % 1 !== 0 ? 2 : 0, // keep decimals if float
          maximumFractionDigits: 2,
        });
    };
    const handleArchiveSuccess = (outreachId: string) => {
        if (!company?._id) return;
      
        if (mode === "active") {
            fireConfetti();
        }

        const now = new Date();
        const archive = (mode === "active") ? true : false;
      
        /* ---- Update outreach list ---- */
        const updatedOutreach = companyState.outreach.map(o =>
          o._id === outreachId
            ? { ...o, successArchived: archive, modified: now }
            : o
        );
      
        dispatch(setOutreach(updatedOutreach));
      
        /* ---- Update success stories ---- */
        const updatedSuccessStories = companyState.successStories.map(story => {
          const hasOutreach = story.outreaches.some(o => o._id === outreachId);
          if (!hasOutreach) return story;
      
          return {
            ...story,
            outreaches: story.outreaches.map(o =>
              o._id === outreachId
                ? { ...o, successArchived: archive, modified: now }
                : o
            ),
          };
        });
      
        dispatch(setSuccessStories(updatedSuccessStories));
      
        /* ---- Backend update ---- */
        dispatch(
          archiveSuccess({
            archive: archive,
            companyId: company._id,
            outreachId,
          })
        );
    };
      

    const toggleExpand = (id: string) => {
        setExpandedOutreachIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

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

    let divStyle: CSSProperties = {
        width: "100%", 
        height: "100%", 
        margin: "0px auto", 
        textAlign: "center",
        paddingTop: "200px",
        fontStyle: "italic"
    }

    {/* Loading successeses... */}
    if (companyState.status === "loadingSuccessStories") {
        return (
            <div className="rightContentDefault">
                <div style={divStyle}>
                    Loading successes...
                </div>
            </div>
        ); 
    }

    let successes: SuccessStory[] = companyState.successStories;
    let recordsToShow = 0;

    {/* No success stories found... */}
    if (companyState.status === "idle" && successes.length === 0) {
        return (
            <div className="rightContentDefault">
                <div style={divStyle}>
                    No success stories to show...
                </div>
            </div>
        ); 
    }

    return (
        <div className="rightContentDefault">
            <div style={{ width: "100%", height: "100%", margin: "0px auto", 
               fontStyle: "italic", overflowY: "auto", overflowX: "hidden",
             }}>


                {/* Sticky header with toggle + bubbles */}
                <div
                    style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    //background: "#f9fafb",
                    padding: "10px 0px",
                    //borderBottom: "1px solid #e5e7eb",
                    }}
                >
                    {/* Attractive toggle */}
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "10px" 
                        }}>
                        <div style={{
                            display: "inline-flex",
                            borderRadius: "9999px",
                            padding: "3px",
                            background:
                                "linear-gradient(135deg, rgba(219,53,20,0.12), rgba(15,118,110,0.12))",
                            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                        }}>
                            <button
                                onClick={() => handleModeChange("active")}
                                style={{
                                    border: "none",
                                    borderRadius: "9999px",
                                    padding: "6px 18px",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    minWidth: "140px",
                                    background:
                                    mode === "active" ? "#ffffff" : "transparent",
                                    color:
                                    mode === "active" ? "#111827" : "#6b7280",
                                    boxShadow:
                                    mode === "active"
                                        ? "0 4px 10px rgba(0,0,0,0.10)"
                                        : "none",
                                    transition: "all 0.18s ease-in-out",
                                }}>
                                Active
                            </button>
                            <button
                                onClick={() => handleModeChange("archived")}
                                style={{
                                    border: "none",
                                    borderRadius: "9999px",
                                    padding: "6px 18px",
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    minWidth: "120px",
                                    background:
                                    mode === "archived" ? "#ffffff" : "transparent",
                                    color:
                                    mode === "archived" ? "#111827" : "#6b7280",
                                    boxShadow:
                                    mode === "archived"
                                        ? "0 4px 10px rgba(0,0,0,0.10)"
                                        : "none",
                                    transition: "all 0.18s ease-in-out",
                                }}>
                                Archived
                            </button>
                        </div>
                    </div>
                </div>

                {successes.map((s, sIndex) => {
                    let outreach = (mode === "archived") ? [...s.outreaches].filter(o => o.successArchived) : [...s.outreaches].filter(o => !o.successArchived);                    
                    return (
                        outreach.map((o: Outreach, i) => {
                            const owner = companyState.members.find(m => m.userId === o.userId);
                            const teamName =
                            owner?.teams?.[0] &&
                            companyState.teams.find(t => t._id === owner?.teams?.[0])?.name || "";
                            const totalActions = getOutreachActionsTotal(o);
                            if (owner) {
                                recordsToShow++;
                                return (
                                <>
                                    <div
                                    onClick={() => toggleExpand(o._id)}
                                    key={`${s.prospect._id}-${o._id ?? i}`}
                                    style={{
                                        margin: "0px 0px 10px 0px",
                                        padding: "20px",
                                        backgroundColor: "#f7f8fa",
                                        borderRadius: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        cursor: "pointer"
                                    }}
                                    >
                                        {/* Left content */}
                                        <div>
                                            <b>{owner.firstName} {owner.lastName}</b>
                                            {teamName && (
                                            <span>
                                                &nbsp;from team <b>{teamName}</b>
                                            </span>
                                            )}
                                            &nbsp;spoke to <b>{s.prospect.company}</b>
                                            &nbsp;on {format(o.created, "M/d/yy")}
                                            &nbsp;and completed <b>{totalActions}</b> actions
                                        </div>

                                        <div style={{ marginLeft: "auto"}}>
                                            {/* show / hide the outreach details 
                                            <Link
                                                to=""
                                                onClick={() => toggleExpand(o._id)}
                                                className="archive-success-link"
                                                style={{ paddingRight: "10px" }}
                                            >
                                            */}
                                            <span className="archive-success-link" style={{ paddingRight: "10px" }}>
                                                {expandedOutreachIds.has(o._id) ? <IoRemoveCircleOutline size={30} /> : <IoAddCircleOutline size={30} />}
                                            </span>
                                            {/*
                                            </Link>
                                            */}
                                            {/* Right icon */}
                                            {mode === "active" ?
                                                <Link
                                                    to=""
                                                    onClick={(e) => { 
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleArchiveSuccess(o._id);
                                                    }}
                                                    className="archive-success-link"
                                                >
                                                    <IoCheckmarkCircleOutline size={30} />
                                                </Link>
                                            :
                                                <Link
                                                    to=""
                                                    onClick={(e) => { 
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleArchiveSuccess(o._id);
                                                    }}
                                                    className="archive-success-link"
                                                >
                                                    <MdSettingsBackupRestore size={30} />
                                                </Link>
                                            }
                                        </div>

                                    </div>
                                    {expandedOutreachIds.has(o._id) &&
                                        <div style={{ padding: "10px 20px" }}>
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
                                                <li key={"success-" + i}>
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
                                        </div>
                                    }
                                </>
                                );
                            }
                        })
                    );
                })}
                {recordsToShow === 0 &&
                    <>
                        {mode === "active" ?           
                            <div style={{ margin: "100px auto 0px auto", textAlign: "center", color: "gray", fontStyle: "italic" }}>
                                No active wins to show, let's stack some up!
                            </div>                    
                        :
                            <div style={{ margin: "100px auto 0px auto", textAlign: "center", color: "gray", fontStyle: "italic" }}>
                                No archived wins to show
                            </div> 
                        }
                    </>
                }
            </div>
        </div>
    );
}

export default Stories;