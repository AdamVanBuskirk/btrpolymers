import React, { CSSProperties } from 'react';
import { useAppSelector } from '../../Core/hooks';
import Settings, { getSettings } from '../../Store/Settings';
import SubNav from '../Desktop/SubNav';
import TopNav from './TopNav';
import LeftNav from '../Desktop/LeftNav';
import Main from '../Main';
import Redirect from '../Redirect';
import CompanySettings from './CompanySettings';
import Lists from './Lists';
import Meetings from './Meetings';
//import Actions from './Actions';
import Work from './Work';
import Data from './Data';
import Stories from '../Stories';
import Scripts from '../Scripts';
import { getStripe } from '../../Store/Stripe';
import { getCompany } from '../../Store/Company';
import { differenceInDays, subDays } from 'date-fns';
import TrialExpired from '../TrialExpired';
import { getUser } from '../../Store/Auth';

function Dash() {

  const userState = useAppSelector(getUser);
  const settingsState = useAppSelector(getSettings);
  const stripeState = useAppSelector(getStripe);
  const companyState = useAppSelector(getCompany);
  const settings = settingsState.settings;
  const lastPayment = stripeState.mostRecentPayment;

  let daysLeft = 0;
  let owner = companyState.members.find(m => m.role === "owner");

  if (owner && owner.created) {
    daysLeft = differenceInDays(owner.created, subDays(new Date(), 30));
  }
 
  let mainStyle: CSSProperties = { 
    height: "100vh",
    overflow: "hidden",
    display: "inline-block"
    
  };
  let leftNavStyle: CSSProperties = { display: "inline-block" };
  
  if (settingsState.settings.sidebarExpanded) {
      leftNavStyle.width = "20%";
      mainStyle.width = "80%";
  } else {
      leftNavStyle.width = "5%";
      mainStyle.width = "95%";

  }
  
  if (settingsState.settings.loadedComponentType === "") 
    return (
      <>
        <Redirect />
        <div style={{ width: "100%", margin: "0px auto", paddingTop: "50px", textAlign: "center" }}>
            <div style={{ fontStyle: "italic", fontSize: "18pt", fontWeight: "300", color: "#555" }}>
                Loading...
            </div>
        </div>
      </>
    );

  let loadedComponent = <Main />;

  if (settingsState.status !== "loadingComponent") {
    if (settings.loadedComponentType === "settings") {
      loadedComponent = <CompanySettings />;
    //} else if (settings.loadedComponentType === "actions") {
    //  loadedComponent = <Actions />;
    } else if (settings.loadedComponentType === "work") {
      loadedComponent = <Work mode="create" />;
    } else if (settings.loadedComponentType === "data") {
      loadedComponent = <Data />;
    } else if (settings.loadedComponentType === "stories") {
      loadedComponent = <Stories />;
    } else if (settings.loadedComponentType === "meetings") {
      loadedComponent = <Meetings />;
    } else if (settings.loadedComponentType === "lists") {
      loadedComponent = <Lists />;
    } else if (settings.loadedComponentType === "scripts") {
      loadedComponent = <Scripts />;
    }
  }

  if (daysLeft < 0 && !lastPayment && !userState.earlyAdopter) {
    loadedComponent = <TrialExpired />;
  }
//backgroundColor: "#F8F9FA"
  return (
    <>
      <Redirect />
      <div style={{ display: "flex", alignItems: "top", margin: "0px auto", 
          backgroundColor: "#F8F9FA", height: "100vh"
        }}>
        <div style={{ display: "inline-block", width: ".5%" }}></div>

        <div style={leftNavStyle}>
          <LeftNav />
        </div>
        <div style={mainStyle}>
          <TopNav />
          <SubNav />
          {loadedComponent}
        </div>
        <div style={{ display: "inline-block", width: ".5%" }}></div>
      </div>
    </>
  );
}

export default Dash;