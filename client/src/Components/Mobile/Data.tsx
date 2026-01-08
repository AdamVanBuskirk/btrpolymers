import { useAppDispatch, useAppSelector } from "../../Core/hooks";
import { getSettings } from "../../Store/Settings";
import DashboardsTab from "./DashboardsTab";
import ReportsTab from "../ReportsTab";
import ScorecardTab from "../ScorecardTab";
import QuickstatsTab from "./QuickstatsTab";

function Data() {
    const dispatch = useAppDispatch();
    const settingsState = useAppSelector(getSettings);
    const settings = settingsState.settings;
    //const loadedSubComponent = settings.loadedSubComponentType;
    const loadedSubComponent = settings.loadedSubComponentType[settings.loadedComponentType];

    return (
      <div
        className="rightContentDefault"
        style={{
          height: "100vh",
          overflowY: "auto",
          background: "#f7f8fa",
          paddingBottom: "80px",
        }}
      >
        {loadedSubComponent === "quickstats" && <QuickstatsTab />}
        {loadedSubComponent === "dashboards" && <DashboardsTab />}
        {loadedSubComponent === "reports" && <ReportsTab />}
        {loadedSubComponent === "scorecards" && <ScorecardTab />}
      </div>
    );
  }

export default Data;