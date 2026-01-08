// src/Components/Mobile/SubNavMobile.tsx
import React from "react";
import { useAppDispatch, useAppSelector } from "../../Core/hooks";
import { getSettings, loadSubComponent } from "../../Store/Settings";
import { loadedSubComponentType } from "../../Helpers/types";

function SubNav() {
  const dispatch = useAppDispatch();
  const settingsState = useAppSelector(getSettings);
  const settings = settingsState.settings;
  //const loadedSubComponent = settings.loadedSubComponentType;
  const loadedSubComponent = settings.loadedSubComponentType[settings.loadedComponentType];



  const baseButton: React.CSSProperties = {
    // let width be based on content, not forced equal
    flex: "0 0 auto",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "6px 14px",
    borderRadius: "24px",
    border: "1px solid #e5e7eb",
    fontSize: "13px",
    fontWeight: 500,
    background: "#fff",
    color: "#333",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  
    whiteSpace: "nowrap",        // 🔑 never wrap
  };
  

  const activeStyle: React.CSSProperties = {
    background: "#f5330c", // orange
    color: "#fff",
    border: "1px solid #efe7eb",
    boxShadow: "0 3px 6px rgba(16,185,129,0.3)",
  };

  const tabs: { label: string; type: string }[] = [];

  if (settings.loadedComponentType === "data") {
    tabs.push(
      { label: "Quick Stats", type: "quickstats" },
      { label: "Scorecards", type: "scorecards" },
      { label: "Dashboards", type: "dashboards" },
      { label: "Reports", type: "reports" }
    );
  } else if (settings.loadedComponentType === "lists") {
    tabs.push(
      { label: "Contacts", type: "customer" },
      { label: "Docs", type: "product" },
    );
  } else if (settings.loadedComponentType === "settings") {
    tabs.push(
      { label: "Company", type: "company" },
      { label: "Team", type: "teams" },
      { label: "Users", type: "users" },
      { label: "Config", type: "actions" },
      { label: "Notifications", type: "delivery" },
    );
  } else if (settings.loadedComponentType === "meetings") {
    tabs.push(
      { label: "Daily", type: "daily" },
      { label: "Weekly", type: "weekly" },
      { label: "Monthly", type: "monthly" },
      { label: "Quarterly", type: "quarterly" },
    );
  }
  
  return (
    <>
    {tabs.length > 0 ?
      <div
      style={{
        display: "flex",
        gap: "16px",              // smaller spacing
        justifyContent: "flex-start",
        padding: "10px 8px",     // reduces outer whitespace
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 10,
        borderBottom: "1px solid #e5e7eb",
        overflowX: "auto",
        flexWrap: "nowrap"
      }}
    >    
        {tabs.map((tab) => (
          <div
            key={tab.type}
            style={{
              ...baseButton,
              ...(loadedSubComponent === tab.type ? activeStyle : {}),
            }}
            onClick={() => dispatch(loadSubComponent({ parent: settings.loadedComponentType, child: tab.type as loadedSubComponentType }))}
          >
            {tab.label}
          </div>
        ))}
      </div>
      :
      <></>
    }
    </>
  );

}

export default SubNav;
