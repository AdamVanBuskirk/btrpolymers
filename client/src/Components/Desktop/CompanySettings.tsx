import { useAppDispatch, useAppSelector } from "../../Core/hooks";
import { getSettings, loadComponent } from "../../Store/Settings";
import ActionsTab from "../ActionsTab";
import CompanySettingsTab from "../CompanySettingsTab";
import TeamTab from "./TeamTab";
import UserTab from "./UserTab";

function CompanySettings() {

    const dispatch = useAppDispatch();
    const settingsState = useAppSelector(getSettings);
    const settings = settingsState.settings;
    //const loadedSubComponent = settings.loadedSubComponentType;

    const loadedSubComponent = settings.loadedSubComponentType[settings.loadedComponentType];

    return (
        <div className="rightContentDefault" style={{ height: "calc(100vh - 103.16px)" /* override for 53.16px for nav and 50px for sub nav height */ }}>
            <div style={{ width: "100%", height: "100%", margin: "0px auto", overflowY: "auto" }}>
                {loadedSubComponent === "company" &&
                    <CompanySettingsTab />
                }
                {loadedSubComponent === "actions" &&
                    <ActionsTab />
                }
                {loadedSubComponent === "teams" &&
                    <TeamTab />
                }
                {loadedSubComponent === "users" &&
                    <UserTab />
                }
            </div>
        </div>
    );
}

export default CompanySettings;