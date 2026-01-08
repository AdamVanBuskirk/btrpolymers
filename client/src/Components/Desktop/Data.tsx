import { useAppDispatch, useAppSelector } from "../../Core/hooks";
import { getSettings } from "../../Store/Settings";
import DashboardsTab from "./DashboardsTab";
import ReportsTab from "../ReportsTab";
import ScorecardTab from "../ScorecardTab";

function Data() {

    const dispatch = useAppDispatch();
    const settingsState = useAppSelector(getSettings);
    const settings = settingsState.settings;
    //const loadedSubComponent = settings.loadedSubComponentType;
    const loadedSubComponent = settings.loadedSubComponentType[settings.loadedComponentType];

    return (
        <div className="rightContentDefault" style={{ height: "calc(100vh - 103.16px)" /* override for 53.16px for nav and 50px for sub nav height */ }}>
            <div style={{ width: "100%", height: "100%", margin: "0px auto", overflowY: "auto"}}>
                {loadedSubComponent === "dashboards" && <DashboardsTab />}
                {loadedSubComponent === "reports" && <ReportsTab />}
                {(loadedSubComponent === "scorecards" || loadedSubComponent === "quickstats") && <ScorecardTab />}
            </div>
        </div>
    );
}

export default Data;