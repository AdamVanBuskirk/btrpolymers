import { useEffect, useState, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from './Pages/Public/Home';
import Privacy from './Pages/Public/Privacy';
import Pricing from './Pages/Public/Pricing';
import Login from './Pages/Public/Login';
import Register from './Pages/Public/Register';
import Forgot from './Pages/Public/Forgot';
import Recover from './Pages/Public/Recover';
import Dash from './Pages/Private/Dash';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css'
import { ToastContainer } from 'react-toastify';
import { refreshAccessToken, getUser, getAvatar, setAuthStatus } from './Store/Auth';
import { getUserSettings, getSettings, setSettingsStatus, getOtherCompanies, loadSubComponent, setSwitchStatus } from './Store/Settings';
import { useAppSelector, useAppDispatch } from './Core/hooks';
import { getPlans, getMostRecentPayment } from './Store/Stripe';
import { getDevice } from './Helpers/getDevice';
import { getActions, getAmounts, getCompany, getCompanyActions, getCompanyAmounts, getCompanyInfoById, getIndustries, getMembers, getOutreach, getProspectTypes, getProspects, getRoles, getSuccessStories, setCompanyStatus } from './Store/Company';
import { cp } from 'fs';
import CompanyInvite from './Pages/Public/CompanyInvite';
import { handleLoadComponent } from './Helpers/handleLoadComponent';
import Terms from './Pages/Public/Terms';
import Advisor from './Pages/Public/Advisor';
import Contact from './Pages/Public/Contact';
import CaseStudies from './Pages/Public/CaseStudies';
import About from './Pages/Public/About';
import Actions from './Pages/Public/Actions';
import Data from './Pages/Public/Data';
import Lists from './Pages/Public/Lists';
import Meetings from './Pages/Public/Meetings';
import Stories from './Pages/Public/Stories';
import People from './Pages/Public/People';
import Asks from './Pages/Public/Asks';
import Integrations from './Pages/Public/Integrations';
import { getSubscriptionsByReportType } from './Store/ReportSubscriptions';

interface ComponentProps {
  children ?: React.ReactNode;
}

type Props = ComponentProps;

function App(props: Props) {

  const dispatch = useAppDispatch();
  const userState = useAppSelector(getUser);
  const companyState = useAppSelector(getCompany);
  const settingsState = useAppSelector(getSettings);

  useEffect (() => {
    dispatch(refreshAccessToken());
    dispatch(getPlans()); /* public pages */
  },[]);

  useEffect (() => {
    if (userState.status === "loggedIn" && userState.acceptedInvite) {
      /* Invite accepted, switch to the new company */
      if (userState.inviteCompanyId) {
        dispatch(getCompanyInfoById(userState.inviteCompanyId));
        setAuthStatus("idle");
      }
    }
  }, [userState.status]);

  useEffect (() => {
    if (userState.accessToken !== "" && settingsState.settings._id === "") {
      dispatch(getAvatar());
      //dispatch(getMostRecentPayment());
      dispatch(getUserSettings());
      dispatch(getProspectTypes());
      dispatch(getActions());
      dispatch(getAmounts());
      dispatch(getIndustries());
      dispatch(getRoles());
      dispatch(getPlans());
    }
  }, [userState.accessToken]);

  /* Settings retrieved, we can now retrieve the company the user last loaded */
  useEffect(() => {
    if (settingsState.status === "userSettingsLoaded") {
      setSettingsStatus("idle");
      dispatch(getCompanyInfoById(settingsState.settings.loadedCompanyId));
      dispatch(getOtherCompanies(settingsState.settings.loadedCompanyId));
    }
  }, [settingsState.status])

/* Get company dependant items on initial load */
  useEffect (() => {
    if (companyState.company) {
      let companyId = companyState.company._id;
      dispatch(getProspects(companyId));
      dispatch(getOutreach(companyId));
      dispatch(getCompanyActions(companyId));
      dispatch(getCompanyAmounts(companyId));
      dispatch(getMostRecentPayment(companyId));
      dispatch(getSuccessStories(companyId));
      dispatch(getSubscriptionsByReportType({ companyId, reportType: "actions_leaderboard" }));
    }
  }, [companyState.company]);

  useEffect (() => {
    if (companyState.company && companyState.status === "outreachSaved") {
      let companyId = companyState.company._id;
      dispatch(getProspects(companyId));
      dispatch(getOutreach(companyId));
      dispatch(setCompanyStatus("idle"));
    }
  }, [companyState.status]);

  useEffect (() => {
    if (settingsState.switchStatus === "companySwitched") {
      const role = companyState.members.find(m => m.me)?.role || "";
      dispatch(setSwitchStatus("idle"));
      if (role === "owner" || role === "admin") {
        handleLoadComponent(dispatch, "settings", settingsState.settings);
        dispatch(loadSubComponent({ parent: "settings", child: "company" }));
      } else {
        if (role === "advisor") {
          handleLoadComponent(dispatch, "lists", settingsState.settings);
          dispatch(loadSubComponent({ parent: "lists", child: "customer" }));
        } else {
          handleLoadComponent(dispatch, "work", settingsState.settings);
          dispatch(loadSubComponent({ parent: "work", child: "" }));
        }
      }
    }
  }, [companyState.members]);

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      /> 
      <Routes>
        <Route path="" element={<Home />} />
        {/*<Route path="" element={<Login />} />*/}
        <Route path="/login">
          <Route path=":company/:link" element={<Login />} />
          <Route path=":ac" element={<Login />} />
          <Route path="" element={<Login />} />
        </Route>
        <Route path="/register">
          <Route path=":company/:link" element={<Register />} />
          <Route path="" element={<Register />} />
        </Route>
        <Route path="/recover">
          <Route path=":ar" element={<Recover />} />
          <Route path="" element={<Recover />} />
        </Route>
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/advisors' element={<Advisor />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/case-studies' element={<CaseStudies />} />
        <Route path='/about' element={<About />} />
        <Route path='/tools/actions' element={<Actions />} />
        <Route path='/tools/data' element={<Data />} />

        <Route path='/tools/lists' element={<Lists />} />
        <Route path='/tools/meetings' element={<Meetings />} />
        <Route path='/tools/stories' element={<Stories />} />
        <Route path='/tools/people' element={<People />} />
        <Route path='/tools/asks' element={<Asks />} />
        <Route path='/integrations' element={<Integrations />} />

        <Route path='/terms' element={<Terms />} />
        <Route path='/pricing' element={<Pricing />} />
        <Route path='/forgot' element={<Forgot />} />
        <Route path='/dash' element={<Dash />} />
        <Route path="/invite/">
          <Route path=":company/:link" element={<CompanyInvite />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
