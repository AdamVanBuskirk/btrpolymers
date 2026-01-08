import React from "react";
import ReactDOM from "react-dom";
import { CSSProperties } from "react";
import { useAppDispatch, useAppSelector } from "../../Core/hooks";
import { getSettings, setShowMenu, loadSubComponent } from "../../Store/Settings";
import { handleLoadComponent } from "../../Helpers/handleLoadComponent";
import { RxCalendar, RxGear, RxLightningBolt } from "react-icons/rx";
import { IoAnalytics, IoListSharp } from "react-icons/io5";
import { MdAutoStories } from "react-icons/md";
import { BiConversation } from "react-icons/bi";
import { loadedComponentType, loadedSubComponentType } from "../../Helpers/types";
import { getCompany } from "../../Store/Company";
import { Settings } from "../../Models/Settings";
import { BsTrophy } from "react-icons/bs";

function LeftNav() {
  const dispatch = useAppDispatch();
  const settingsState = useAppSelector(getSettings);
  const companyState = useAppSelector(getCompany);
  const { showMenu, settings } = settingsState;
  const currentComponent = settings.loadedComponentType;
  const role = companyState.members.find(m => m.me)?.role || "";

  if (!showMenu) return null;

  const close = () => dispatch(setShowMenu(false));

  const getSubComponent = (settings: Settings, parent: string, fallback: string) => {
    const sub = settings.loadedSubComponentType?.[parent];
    return sub && typeof sub === "string" ? sub : fallback;
}   

  const go = (component: loadedComponentType) => {
    // Set default sub-tab behavior (matches desktop)
    if (component === "data") {
      //dispatch(loadSubComponent({ parent: component, child: "scorecards" }));
      const sub = getSubComponent(settingsState.settings, component, "scorecards");
      dispatch(loadSubComponent({ parent: component, child: sub as loadedSubComponentType }));
    } else if (component === "meetings") {
      //dispatch(loadSubComponent({ parent: component, child: "daily" }));
      const sub = getSubComponent(settingsState.settings, component, "daily");
      dispatch(loadSubComponent({ parent: component, child: sub as loadedSubComponentType }));
    } else if (component === "lists") {
      //dispatch(loadSubComponent({ parent: component, child: "customer" }));
      const sub = getSubComponent(settingsState.settings, component, "customer");
      dispatch(loadSubComponent({ parent: component, child: sub as loadedSubComponentType }));
    } else if (component === "settings") {
      //dispatch(loadSubComponent({ parent: component, child: "company" }));
      const sub = getSubComponent(settingsState.settings, component, "company");
      dispatch(loadSubComponent({ parent: component, child: sub as loadedSubComponentType }));
    }
    handleLoadComponent(dispatch, component, settings);
    close();
  };

  const navItems: Array<{ icon: JSX.Element; label: string; key: loadedComponentType }> = [
    { icon: <RxLightningBolt size={20} />, label: "Submit", key: "work" },
    { icon: <IoListSharp size={20} />, label: "Lists", key: "lists" },
    { icon: <IoAnalytics size={20} />, label: "Data", key: "data" },
    { icon: <BsTrophy size={20} />, label: "Wins", key: "stories" },
    { icon: <BiConversation size={20} />, label: "Tactics", key: "scripts" },
    { icon: <RxCalendar size={20} />, label: "Meetings", key: "meetings" },
    { icon: <RxGear size={20} />, label: "Settings", key: "settings" },
  ];

  // Overlay covers the whole viewport
  const overlay: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 2147483000, // above anything in your app
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(1.5px)",
  };

  // Menu panel sits just under TopNav
  const panel: CSSProperties = {
    position: "absolute",
    top: 65, // adjust if your TopNav is taller/shorter
    left: 0,
    right: 0,
    margin: "0 auto",
    width: "92%",
    maxWidth: 420,
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 28px rgba(0,0,0,0.18)",
    overflow: "hidden",
  };

  const list: CSSProperties = {
    padding: "6px 0",
    maxHeight: "70vh",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
  };

  const itemBase: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 18px",
    fontSize: "11pt",
    cursor: "pointer",
    borderBottom: "1px solid #f3f4f6",
    background: "#fff",
  };

  const labelStyle: CSSProperties = { fontWeight: 500 };

  return ReactDOM.createPortal(
    <div style={overlay} onClick={close}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <div style={list}>
          {navItems.map((item) => {
            if (role !== "owner" && role !== "admin" && item.key === "settings") {
            } else if (role === "advisor" && item.key === "work") {
            } else if (role === "member" && item.key === "meetings") {
            } else {
              const isActive = currentComponent === item.key;
              return (
                <div
                  key={item.key}
                  onClick={() => go(item.key)}
                  style={{
                    ...itemBase,
                    background: isActive ? "#fce4d9" : "#ff",
                    color: isActive ? "#ff4f00" : "#111827",
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  {item.icon}
                  <span style={labelStyle}>{item.label}</span>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default LeftNav;
