// src/Components/Mobile/DashMobile.tsx
import React, { CSSProperties } from "react";
import { useAppSelector } from "../../Core/hooks";
import { getSettings } from "../../Store/Settings";
import Redirect from "../Redirect";
import TopNav from "./TopNav";
import SubNav from "./SubNav";
import LeftNav from "./LeftNav"; // ✅ re-added
import Work from "./Work";
import Data from "./Data";
import Meetings from "./Meetings";
import Lists from "./Lists";
import Scripts from "../Scripts";
import Stories from "../Stories";
import Settings from "./CompanySettings";
import { differenceInDays, subDays } from "date-fns";
import { getMostRecentPayment, getStripe } from "../../Store/Stripe";
import { getCompany } from "../../Store/Company";
import TrialExpired from "../TrialExpired";
import CompanySettings from "./CompanySettings";
import { getUser } from "../../Store/Auth";

function Dash() {

  const userState = useAppSelector(getUser);
  const settingsState = useAppSelector(getSettings);
  const stripeState = useAppSelector(getStripe);
  const companyState = useAppSelector(getCompany);

  const { settings, showMenu } = settingsState;

  const lastPayment = stripeState.mostRecentPayment;

  let daysLeft = 0;
  let owner = companyState.members.find(m => m.role === "owner");

  if (owner && owner.created) {
    daysLeft = differenceInDays(owner.created, subDays(new Date(), 30));
  }

  if (!settings.loadedComponentType) {
    return (
      <>
        <Redirect />
        <div
          style={{
            width: "100%",
            marginTop: "200px",
            textAlign: "center",
            fontStyle: "italic",
            fontSize: "16pt",
            color: "#555",
          }}
        >
          Loading...
        </div>
      </>
    );
  }

  let loadedComponent = <></>;

  switch (settings.loadedComponentType) {
    case "settings":
      loadedComponent = <CompanySettings />;
      break;
    case "work":
      loadedComponent = <Work mode="create" />;
      break;
    case "data":
      loadedComponent = <Data />;
      break;
    case "meetings":
      loadedComponent = <Meetings />;
      break;
    case "lists":
      loadedComponent = <Lists />;
      break;
    case "scripts":
      loadedComponent = <Scripts />;
      break;
    case "stories":
      loadedComponent = <Stories />;
      break;
    default:
      loadedComponent = <div style={{ padding: "20px" }}>Component not found</div>;
  }

  if (daysLeft < 0 && !lastPayment && !userState.earlyAdopter) {
    loadedComponent = <TrialExpired />;
  }

  const layoutStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    overflowX: "hidden",
    overflowY: "hidden",
    position: "relative",
    zIndex: 0,
  };

  return (
    <div style={layoutStyle}>
      <Redirect />
      <TopNav />
      <SubNav />
      <div style={{ flex: 1, overflowY: "hidden" }}>
        {loadedComponent}
      </div>

      {/* ✅ Add this — renders menu overlay above everything */}
      {showMenu && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999 }}>
          <LeftNav />
        </div>
      )}
    </div>
  );
}

export default Dash;
