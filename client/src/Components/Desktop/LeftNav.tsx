import React, { CSSProperties, useEffect, useState } from 'react';
import { IoAnalytics, IoListSharp, IoRefresh } from "react-icons/io5";
import { useAppSelector, useAppDispatch } from '../../Core/hooks';
import { getQuickStats, getSettings, loadSubComponent, setSettings, setStatsScope, setStatsTeam, setStatsTimeframe, toggleSidebar } from '../../Store/Settings';
import { handleLoadComponent } from '../../Helpers/handleLoadComponent';
import { BsToggleOn, BsToggleOff, BsTrophy } from "react-icons/bs";
import { RxCalendar, RxGear, RxLightningBolt } from 'react-icons/rx';
import { MdAutoStories } from 'react-icons/md';
import { getCompany } from '../../Store/Company';
import { formatDollars } from '../../Helpers/formatDollars';
import ProgressBar from '../Controls/ProgressBar';
import { BiConversation } from 'react-icons/bi';
import { Settings } from '../../Models/Settings';
import { loadedSubComponentType } from '../../Helpers/types';
import { Link } from 'react-router-dom';
import { Team } from '../../Models/Team';

function LeftNav() {

    const dispatch = useAppDispatch();
    const companyState = useAppSelector(getCompany);
    const settingsState = useAppSelector(getSettings);
    const [teamDialogOpen, setTeamDialogOpen] = useState(false);
    const [hoverTeamId, setHoverTeamId] = useState<string | null>(null);
    // whichever field you store the selected team on (adjust if your Settings model uses a different name)
    const selectedTeamId = (settingsState.settings as any).statsTeam ?? "";

    /* Quick Stats */
    //const [statsTimeframe, setStatsTimeframe] = useState<"week" | "month" | "year" | "all">("week");
    //const [statsScope, setStatsScope] = useState<"me" | "team" | "company">("me"); // scope is wired to UI, still aggregating company-wide for now

    const timeframeLabelMap: Record<string, string> = {
        week: "Weekly",
        month: "Monthly",
        year: "Year-to-Date",
        all: "All-Time",
    };

    useEffect(() => {
        if (settingsState.settings.statsTeam !== "") {
            dispatch(setStatsScope("team"));
        }
    }, [settingsState.settings.statsTeam]);

    useEffect(() => {
        // dispatch the call to retrieve the quick stats based on the scope and timeframe.
        dispatch(getQuickStats({ 
            companyId: companyState.company?._id ?? "", 
            scope: settingsState.settings.statsScope, 
            timeframe: settingsState.settings.statsTimeframe,
            teamId: settingsState.settings.statsTeam,
        }));
    },[
        settingsState.settings.statsTimeframe, 
        settingsState.settings.statsScope,
        settingsState.settings.statsTeam,
        companyState.company?._id, 
        companyState.company?.actionGoal,
        companyState.outreach
    ]);
    /*
        const scopeLabelMap: Record<"me" | "team" | "company", string> = {
            me: "My",
            team: "Team",
            company: "Company",
        };
    */
    //const userState = useAppSelector(getUser);
    
    const getSubComponent = (settings: Settings, parent: string, fallback: string) => {
        const sub = settings.loadedSubComponentType?.[parent];
        return sub && typeof sub === "string" ? sub : fallback;
    };

    const handleToggleSidebar = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        let newSetting = !settingsState.settings.sidebarExpanded;

        /* update frontend */
        let settings: Settings = { ...settingsState.settings };
        settings.sidebarExpanded = newSetting;
        dispatch(setSettings(settings));

        /* update backend */
        dispatch(toggleSidebar(newSetting));
    };

    // teams list (adjust if your state shape differs)
    const teams = (companyState as any).teams ?? [];

    let selectedTeamName = "";   
    const selectedTeam: Team = teams.find((t: Team) => t._id === settingsState.settings.statsTeam);
    if (selectedTeam) {
        selectedTeamName = selectedTeam.name;
    }

    // ✅ team pick handler
    const handlePickTeam = (teamId: string) => {
        //const companyId = companyState.company?._id ?? "";
        //if (!companyId) return;
        //alert(teamId);
        dispatch(setStatsTeam(teamId));
        setTeamDialogOpen(false);
    };

    // ---- Timeframe-based filtering ----
    /*
    const getDateRangeForTimeframe = (timeframe: string) => {
        if (timeframe === "all") {
            return { start: undefined as Date | undefined, end: undefined as Date | undefined };
        }

        const start = new Date(now);
        const end = new Date(now);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        if (timeframe === "week") {
            const dayOfWeek = start.getDay(); // 0 = Sunday
            start.setDate(start.getDate() - dayOfWeek); // Sunday
        } else if (timeframe === "month") {
            start.setDate(1); // First day of current month
        } else if (timeframe === "year") {
            start.setMonth(0, 1); // Jan 1 of current year
        }

        return { start, end };
    };
    */
    //const { start, end } = getDateRangeForTimeframe(statsTimeframe);
    /*
    const isInSelectedRange = (date: Date) => {
        if (!start || !end) return true; // all-time
        return date >= start && date <= end;
    };
    */
    const refreshStats = () => {
        // in here we will call the backend to get our 5 values: Actions, New Opps, New Opps (annualized), Quoted, and Closed 
        dispatch(getQuickStats({ 
            companyId: companyState.company?._id ?? "",
            scope: settingsState.settings.statsScope, 
            timeframe: settingsState.settings.statsTimeframe,
            teamId: settingsState.settings.statsTeam,
        }));
    }
//console.log(settingsState.settings.statsTimeframe);
//console.log(settingsState.settings.statsScope);
    const statsTimeframe = settingsState.settings.statsTimeframe ?? "week";
    const statsScope = settingsState.settings.statsScope ?? "me";
    const meMember = companyState.members.find(m => m.me);
    const role = meMember?.role;          // string | undefined
    const roleReady = !!role;             // only true once populated
    
    const canSeeMeetings = roleReady && role !== "member";

    let navItemStyle: CSSProperties = {
        cursor: "pointer",
        paddingTop: "5px",
        fontSize: "13pt",
        color: "#D9DADB",
        fontWeight: 450,
        paddingLeft: "15px",
        position: "relative",
        top: "3px"
    };

    let navItemSelectedStyle: CSSProperties = {
        cursor: "pointer",
        fontSize: "13pt",
        fontWeight: 450,
        color: "#FF8A4C",
        paddingLeft: "15px",
        position: "relative",
        top: "3px",
    };

    let rowStyle: CSSProperties = {
        cursor: "pointer",
        padding: settingsState.settings.sidebarExpanded ? "7px 17px 10px 17px" : "7px 0px 10px 0px",
        textAlign: settingsState.settings.sidebarExpanded ? "unset" : "center",
    };

    let rowSelectedStyle: CSSProperties = {
        cursor: "pointer",
        padding: settingsState.settings.sidebarExpanded ? "7px 17px 10px 17px" : "7px 0px 10px 0px",
        borderRadius: "5px",
        backgroundColor: settingsState.settings.sidebarExpanded ? "#233A47" : "unset",
        marginTop: settingsState.settings.sidebarExpanded ? "7px" : "0px",
        marginBottom: settingsState.settings.sidebarExpanded ? "7px" : "0px",
        textAlign: settingsState.settings.sidebarExpanded ? "unset" : "center",
    };

    let workTabLoaded = settingsState.settings.loadedComponentType === "work";
    let workIconColor = (workTabLoaded) ? "#FF8A4C" : "#bec1c3";
    let workDivStyle: CSSProperties = (workTabLoaded) ? navItemSelectedStyle : navItemStyle;
    let workRowStyle: CSSProperties = (workTabLoaded) ? rowSelectedStyle : rowStyle;

    let dataTabLoaded = settingsState.settings.loadedComponentType === "data";
    let dataIconColor = (dataTabLoaded) ? "#FF8A4C" : "#bec1c3";
    let dataDivStyle: CSSProperties = (dataTabLoaded) ? navItemSelectedStyle : navItemStyle;
    let dataRowStyle: CSSProperties = (dataTabLoaded) ? rowSelectedStyle : rowStyle;

    let storiesTabLoaded = settingsState.settings.loadedComponentType === "stories";
    let storiesIconColor = (storiesTabLoaded) ? "#FF8A4C" : "#bec1c3";
    let storiesDivStyle: CSSProperties = (storiesTabLoaded) ? navItemSelectedStyle : navItemStyle;
    let storiesRowStyle: CSSProperties = (storiesTabLoaded) ? rowSelectedStyle : rowStyle;

    let meetingsTabLoaded = settingsState.settings.loadedComponentType === "meetings";
    let meetingsIconColor = (meetingsTabLoaded) ? "#FF8A4C" : "#bec1c3";
    let meetingsDivStyle: CSSProperties = (meetingsTabLoaded) ? navItemSelectedStyle : navItemStyle;
    let meetingsRowStyle: CSSProperties = (meetingsTabLoaded) ? rowSelectedStyle : rowStyle;

    let listsTabLoaded = settingsState.settings.loadedComponentType === "lists";
    let listsIconColor = (listsTabLoaded) ? "#FF8A4C" : "#bec1c3";
    let listsDivStyle: CSSProperties = (listsTabLoaded) ? navItemSelectedStyle : navItemStyle;
    let listsRowStyle: CSSProperties = (listsTabLoaded) ? rowSelectedStyle : rowStyle;

    let scriptsTabLoaded = settingsState.settings.loadedComponentType === "scripts";
    let scriptsIconColor = (scriptsTabLoaded) ? "#FF8A4C" : "#bec1c3";
    let scriptsDivStyle: CSSProperties = (scriptsTabLoaded) ? navItemSelectedStyle : navItemStyle;
    let scriptsRowStyle: CSSProperties = (scriptsTabLoaded) ? rowSelectedStyle : rowStyle;

    let settingsTabLoaded = settingsState.settings.loadedComponentType === "settings";
    let settingsIconColor = (settingsTabLoaded) ? "#FF8A4C" : "#bec1c3";
    let settingsDivStyle: CSSProperties = (settingsTabLoaded) ? navItemSelectedStyle : navItemStyle;
    let settingsRowStyle: CSSProperties = (settingsTabLoaded) ? rowSelectedStyle : rowStyle;

    const now = new Date();

    let actions = 0;
    let quoted_dollars = 0;
    let closed_dollars = 0;
    let new_opp_dollars = 0;
    let annualized_dollars = 0;

    let opportunity_label = "New Opp";
    let quoted_label = "Quoted";
    let closed_label = "Closed";
    let annualized_label = "New Opp (Annualized)";

    let opportunity_guid = "New Opp";
    let quoted_guid = "Quoted";
    let closed_guid = "Closed";
    let annualized_guid = "New Opp (Annualized)";

    let opportunity = companyState.amounts.find(a => a.label === "New Opportunity $ Value");
    if (opportunity) {
        opportunity_guid = opportunity._id;
        let companyOpportunity = companyState.companyAmounts.find(a => a.actionId === opportunity?._id);
        if (companyOpportunity) {
            opportunity_label = companyOpportunity.label;
        }
    }

    let quoted = companyState.amounts.find(a => a.label === "Quote or Proposal Amount");
    if (quoted) {
        quoted_guid = quoted._id;
        let companyQuoted = companyState.companyAmounts.find(a => a.actionId === quoted?._id);
        if (companyQuoted) {
            quoted_label = companyQuoted.label;
        }
    }

    let closed = companyState.amounts.find(a => a.label === "Closed Amount");
    if (closed) {
        closed_guid = closed._id;
        let companyClosed = companyState.companyAmounts.find(a => a.actionId === closed?._id);
        if (companyClosed) {
            closed_label = companyClosed.label;
        }
    }

    let annualized = companyState.amounts.find(a => a.label === "Annualized Value");
    if (annualized) {
        annualized_guid = annualized._id;
        let companyAnnualized = companyState.companyAmounts.find(a => a.actionId === annualized?._id);
        if (companyAnnualized) {
            annualized_label = companyAnnualized.label;
        }
    }

    let company = companyState;
    /*
    if (company && company.outreach) {
        company.outreach.forEach((o: any) => {
            const created = new Date(o.created);
            if (!isInSelectedRange(created)) return;

            // Actions
            if (Array.isArray(o.actions)) {
                o.actions.forEach((action: any) => {
                    const val = String(action.value).toLowerCase().trim();

                    if (!isNaN(Number(val)) && val !== "") {
                        actions += Number(val);
                    } else if (val === "true") {
                        actions += 1;
                    }
                });
            }

            // Amounts
            if (Array.isArray(o.amounts)) {
                o.amounts.forEach((amt: any) => {
                    const name = amt.name;
                    if (!name) return;

                    // Normalized numeric value
                    const cleanedStr = String(amt.value).replace(/[$,]/g, "");
                    const num = Number(cleanedStr);
                    const safeNum = isNaN(num) ? 0 : num;

                    if (name === opportunity_guid) {
                        new_opp_dollars += safeNum;
                    } else if (name === quoted_guid) {
                        quoted_dollars += safeNum;
                    } else if (name === closed_guid) {
                        closed_dollars += safeNum;
                    } else if (name === annualized_guid) {
                        // Annualized is likely already a plain number, but this keeps it consistent
                        annualized_dollars += safeNum;
                    }
                });
            }
        });
    }
    */
    return (
        <div
            style={{
                height: "100vh",
                backgroundColor: "#051A26",
                margin: "0px auto",
                textAlign: "left",
                padding: "30px 20px 15px 20px",
                borderTopLeftRadius: "20px",
                borderBottomLeftRadius: "20px",
            }}
        >
            <div
                style={{
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                {settingsState.settings.sidebarExpanded ?
                    <div
                        style={{ cursor: "pointer", marginRight: "15px", position: "relative", top: "-3px" }}
                        onClick={(e) => handleToggleSidebar(e)}
                    >
                        {settingsState.settings.sidebarExpanded ? (
                            <BsToggleOn size={25} color="#bec1c3" />
                        ) : (
                            <BsToggleOff size={25} color="#bec1c3" />
                        )}
                    </div>
                    :
                    <div
                        style={{ cursor: "pointer", position: "relative", marginBottom: "10px" }}
                        onClick={(e) => handleToggleSidebar(e)}
                    >
                        {settingsState.settings.sidebarExpanded ? (
                            <BsToggleOn size={25} color="#bec1c3" />
                        ) : (
                            <BsToggleOff size={25} color="#bec1c3" />
                        )}
                    </div>
                }
                {settingsState.settings.sidebarExpanded &&
                    <img
                        src={`${process.env.PUBLIC_URL}/images/sales-doing-logo-white-red-flame.png`}
                        style={{ width: "100px", position: "relative", top: "-10px" }}
                    />
                }
            </div>

            {role !== "advisor" ?
                <div
                    style={{ ...workRowStyle, paddingTop: "8px" }}
                    onClick={(e) => handleLoadComponent(dispatch, "work", settingsState.settings)}
                >
                    <RxLightningBolt color={workIconColor} size={25} />
                    {settingsState.settings.sidebarExpanded &&
                        <span style={workDivStyle}>
                            Submit
                        </span>
                    }
                </div>
                :
                <div style={{ marginTop: "20px" }}></div>
            }

            <div
                style={listsRowStyle}
                onClick={(e) => {
                    const sub = getSubComponent(settingsState.settings, "lists", "customer");
                    handleLoadComponent(dispatch, "lists", settingsState.settings);
                    dispatch(loadSubComponent({ parent: "lists", child: sub as loadedSubComponentType }));
                }}
            >
                <IoListSharp color={listsIconColor} size={25} />
                {settingsState.settings.sidebarExpanded &&
                    <span style={listsDivStyle}>
                        Lists
                    </span>
                }
            </div>

            <div
                style={dataRowStyle}
                onClick={(e) => {
                    const sub = getSubComponent(settingsState.settings, "data", "scorecards");
                    handleLoadComponent(dispatch, "data", settingsState.settings);
                    dispatch(loadSubComponent({ parent: "data", child: sub as loadedSubComponentType }));
                }}
            >
                <IoAnalytics color={dataIconColor} size={25} />
                {settingsState.settings.sidebarExpanded &&
                    <span style={dataDivStyle}>
                        Data
                    </span>
                }
            </div>

            <div
                style={storiesRowStyle}
                onClick={(e) => handleLoadComponent(dispatch, "stories", settingsState.settings)}
            >
                <BsTrophy color={storiesIconColor} size={23} />
                {settingsState.settings.sidebarExpanded &&
                    <span style={storiesDivStyle}>
                        Wins
                    </span>
                }
            </div>

            <div
                style={scriptsRowStyle}
                onClick={(e) => handleLoadComponent(dispatch, "scripts", settingsState.settings)}
            >
                <BiConversation color={scriptsIconColor} size={25} />
                {settingsState.settings.sidebarExpanded &&
                    <span style={scriptsDivStyle}>
                        Tactics
                    </span>
                }
            </div>
            {canSeeMeetings &&
                <div
                    style={meetingsRowStyle}
                    onClick={(e) => {
                        const sub = getSubComponent(settingsState.settings, "meetings", "daily");
                        handleLoadComponent(dispatch, "meetings", settingsState.settings);
                        dispatch(loadSubComponent({ parent: "meetings", child: sub as loadedSubComponentType }));
                    }}
                >
                    <RxCalendar color={meetingsIconColor} size={25} />
                    {settingsState.settings.sidebarExpanded &&
                        <span style={meetingsDivStyle}>
                            Meetings
                        </span>
                    }
                </div>
            }
            {(role === "owner" || role === "admin") &&
                <div
                    style={settingsRowStyle}
                    onClick={(e) => {
                        const sub = getSubComponent(settingsState.settings, "settings", "company");
                        handleLoadComponent(dispatch, "settings", settingsState.settings);
                        dispatch(loadSubComponent({ parent: "settings", child: sub as loadedSubComponentType }));
                    }}
                >
                    <RxGear color={settingsIconColor} size={25} />
                    {settingsState.settings.sidebarExpanded &&
                        <span style={settingsDivStyle}>
                            Settings
                        </span>
                    }
                </div>
            }

            {settingsState.settings.sidebarExpanded &&
                <div className="quick-stats">
                    <div className="stats-title">
                        <span style={{ position: "relative", top: "-2px", paddingRight: "5px", cursor: "pointer" }} 
                            onClick={() => refreshStats()}>
                            <IoRefresh />
                        </span> 
                        {timeframeLabelMap[statsTimeframe]} Stats
                    </div>

                    {/* Scope Toggle */}
                    <div className="toggle-row">
                        <div className="toggle-group">
                            {[
                                { key: "me", label: "Me" },
                                { key: "team", label: "Team" },
                                { key: "company", label: "Company" },
                            ].map((option) => (
                                <button
                                    key={option.key}
                                    type="button"
                                    className={
                                        "toggle-pill" +
                                        (statsScope === option.key ? " active" : "")
                                    }
                                    onClick={() => {
                                        if ( option.key === "team" && role !== "member" && (!settingsState.settings.statsTeam || settingsState.settings.statsTeam === "")) {
                                            setTeamDialogOpen(true);
                                            return;
                                        }
                                        dispatch(setStatsScope(option.key));
                                    }}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Timeframe Toggle */}
                    <div className="toggle-row">
                        <div className="toggle-group">
                            {[
                                { key: "week", label: "Weekly" },
                                { key: "month", label: "Monthly" },
                                { key: "year", label: "YTD" },
                                { key: "all", label: "All-Time" },
                            ].map((option) => (
                                <button
                                    key={option.key}
                                    type="button"
                                    className={
                                        "toggle-pill" +
                                        (statsTimeframe === option.key ? " active" : "")
                                    }
                                    onClick={() =>
                                        dispatch(setStatsTimeframe(option.key))
                                    }
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ProgressBar
                        actions={settingsState.quickStatsActions}
                        goal={settingsState.quickStatsActionGoal}
                    />

                    <div className="stat-row">
                        <span className="stat-label">Actions</span>
                        <span className="stat-value">{settingsState.quickStatsActions && settingsState.quickStatsActions.toLocaleString()}</span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-label">{opportunity_label}</span>
                        <span className="stat-value">
                            {formatDollars(settingsState.quickStatsNewOpps)}
                        </span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-label">{annualized_label}</span>
                        <span className="stat-value">
                            {formatDollars(settingsState.quickStatsNewOppAnnualized)}
                        </span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-label">{quoted_label}</span>
                        <span className="stat-value">
                            {formatDollars(settingsState.quickStatsQuoted)}
                        </span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-label">{closed_label}</span>
                        <span className="stat-value">
                            {formatDollars(settingsState.quickStatsClosed)}
                        </span>
                    </div>
                    {role !== "member" &&
                        <div style={{ margin: "0px auto", textAlign: "center" }}>
                            <Link to="" style={{ fontSize: "9pt", color: "gray" }}
                               onClick={(e) => {
                                e.preventDefault();
                                setTeamDialogOpen(true);
                              }}>
                                {(selectedTeamName === "") ? "select team" : 
                                <>
                                    <div style={{ display: "inline-block", textDecoration: "none" }}>
                                        {selectedTeamName} (
                                    </div>change
                                    <div style={{ display: "inline-block", textDecoration: "none" }}>
                                        )
                                    </div>
                                </>
                                }
                            </Link>
                        </div>
                    }


                    {/* ✅ Team dialog */}
                    {teamDialogOpen && (
                        <div
                        onClick={() => setTeamDialogOpen(false)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.55)",
                            zIndex: 9999,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "20px",
                        }}
                        >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                            width: "100%",
                            maxWidth: "420px",
                            background: "#0B2230",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "12px",
                            padding: "16px",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                            maxHeight: "80vh",
                            display: "flex",
                            flexDirection: "column",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <div style={{ color: "#D9DADB", fontSize: "12pt", fontWeight: 600 }}>
                                Choose a Team
                            </div>
                            <button
                                type="button"
                                onClick={() => setTeamDialogOpen(false)}
                                style={{
                                background: "transparent",
                                border: "none",
                                color: "#bec1c3",
                                fontSize: "16pt",
                                cursor: "pointer",
                                lineHeight: 1,
                                }}
                                aria-label="Close"
                            >
                                ×
                            </button>
                            </div>

                            {(!teams || teams.length === 0) ? (
                            <div style={{ color: "#9aa0a6", fontSize: "10pt", padding: "10px 2px" }}>
                                No teams exist within the company.
                            </div>
                            ) : (
                            <div  style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                                marginTop: "8px",
                            
                                // ✅ critical
                                flex: 1,
                                minHeight: 0,
                            
                                // ✅ scrolling
                                overflowY: "auto",
                                paddingRight: "6px",
                              }}>
                                {teams.map((t: any) => {
                                    const isSelected = selectedTeamId === t._id;
                                    const isHovered = hoverTeamId === t._id;

                                    return (
                                        <button
                                        key={t._id}
                                        type="button"
                                        onMouseEnter={() => setHoverTeamId(t._id)}
                                        onMouseLeave={() => setHoverTeamId(null)}
                                        onClick={() => handlePickTeam(t._id)}
                                        style={{
                                            width: "100%",
                                            textAlign: "left",
                                            borderRadius: "10px",
                                            padding: "10px 12px",
                                            cursor: "pointer",
                                            transition: "transform 0.12s ease, background 0.12s ease, border-color 0.12s ease",
                                            background: isSelected
                                            ? "#233A47"                 // selected background (matches your sidebar selected row)
                                            : isHovered
                                                ? "#0E2A3A"               // hover background
                                                : "#051A26",              // default background
                                            border: isSelected
                                            ? "1px solid #FF8A4C"       // selected border (your accent)
                                            : isHovered
                                                ? "1px solid rgba(255,255,255,0.18)"
                                                : "1px solid rgba(255,255,255,0.08)",
                                            color: isSelected ? "#FF8A4C" : "#D9DADB",
                                            transform: isHovered ? "translateY(-1px)" : "translateY(0px)",
                                        }}
                                        >
                                        {t.name}
                                        </button>
                                    );
                                    })}
                            </div>
                            )}
                        </div>
                        </div>
                    )}
                </div>
            }
        </div>
    );
}

export default LeftNav;
