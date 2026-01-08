import { useAppSelector } from "../../Core/hooks";
import { getSettings } from "../../Store/Settings";
import ActionsTab from "../ActionsTab";
import CompanySettingsTab from "../CompanySettingsTab";
import TeamTab from "./TeamTab";
import UserTab from "./UserTab";

function CompanySettings() {

    const settingsState = useAppSelector(getSettings);
    const settings = settingsState.settings;
    //const loadedSubComponent = settings.loadedSubComponentType;
    const loadedSubComponent = settings.loadedSubComponentType[settings.loadedComponentType];

    return (
      <div
        
        style={{
          height: "100vh",
          overflowY: "auto",
          background: "#f7f8fa",
          paddingBottom: "150px",
      }}>
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
    );
  }

export default CompanySettings;