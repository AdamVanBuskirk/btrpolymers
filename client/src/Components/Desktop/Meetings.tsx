import { useAppSelector } from "../../Core/hooks";
import { getSettings } from "../../Store/Settings";
import MeetingsDailyTab from "../MeetingsDailyTab";
import MeetingsMonthlyTab from "../MeetingsMonthlyTab";
import MeetingsQuarterlyTab from "../MeetingsQuarterlyTab";
import MeetingsWeeklyTab from "../MeetingsWeeklyTab";

function Meetings() {

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
        {loadedSubComponent === "daily" &&
          <MeetingsDailyTab />
        }
        {loadedSubComponent === "weekly" &&
          <MeetingsWeeklyTab />
        }
        {loadedSubComponent === "monthly" &&
          <MeetingsMonthlyTab />
        }
        {loadedSubComponent === "quarterly" &&
          <MeetingsQuarterlyTab />
        }
      </div>
    );
  }

export default Meetings;