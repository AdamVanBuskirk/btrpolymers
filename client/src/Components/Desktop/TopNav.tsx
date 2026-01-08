import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../Core/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { VscTriangleDown } from "react-icons/vsc";
import { BiSearch } from "react-icons/bi";
import Avatar from "../../Components/Avatar";
import { getSettings, heartBeat, loadSubComponent, setSearchText, setSettingsStatus } from '../../Store/Settings';
import { getMembers, getCompany, setCompanyStatus, getTeams } from '../../Store/Company';
import { SettingsContextParam } from "../../Models/Requests/SettingsContextParam";
import SettingsContext from "../../Modals/SettingsContext";
import { getUser, setLastHeartbeat } from '../../Store/Auth';
import { getMostRecentPayment, getStripe } from '../../Store/Stripe';
//import { BillingContextMenuParam } from '../../Models/Requests/BillingContexMenuParam';
//import BillingContextMenu from '../../Modals/BillingContextMenu';
import { StripePlan } from '../../Models/Requests/StripePlan';
import { StripePayment } from '../../Models/Requests/StripePayment';
import { format } from 'date-fns';

import { FaHammer } from "react-icons/fa";
import { BsBell } from 'react-icons/bs';
import { handleLoadComponent } from '../../Helpers/handleLoadComponent';
import { IoMdSwitch } from 'react-icons/io';
import { HiOutlineSwatch } from 'react-icons/hi2';
import { MdSwitchAccount } from 'react-icons/md';
import SwitchCompany from '../../Modals/SwitchCompany';

function TopNav() {

    const dispatch = useAppDispatch();
    const userState = useAppSelector(getUser);
    const stripeState = useAppSelector(getStripe);
    const settingsState = useAppSelector(getSettings);
    const companyState = useAppSelector(getCompany);
    const [settingsContextParams, setSettingsContextParams] = useState<SettingsContextParam>();
    //const [billingContextMenuParams, setBillingContextMenuParams] = useState<BillingContextMenuParam>();
    //const [search, setSearch] = useState("");
    //const [showSubscriptionSuccess, setShowSubscriptionSuccess] = useState(false);
    const [version, setVersion] = useState("");
    const [newVersionExists, setNewVersionExists] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setVersion(settingsState.version);
        const intervalId = setInterval(() => {
            dispatch(heartBeat());
            let companyId = companyState.company?._id;
            if (companyId) {
                dispatch(getMostRecentPayment(companyId)); /* helps detect failed payments */
            }
        }, 60000);
        return () => clearInterval(intervalId);
    },[]);  
    
    useEffect(() => {
        if (settingsState.version !== "" && settingsState.version !== version) {
            if (version === "") {
                setVersion(settingsState.version);
            } else {
                setNewVersionExists(true);
            }
        }
    }, [settingsState.version]);

    /*
    useEffect(() => {
        if (stripeState.clientSecret !== "") {
            setShowSubscriptionSuccess(true);
            setTimeout(() => setShowSubscriptionSuccess(false), 5000);
        }
    },[stripeState.clientSecret]);
    */
    useEffect(() => {
        if (settingsState.status === "heartbeat") {
            dispatch(setSettingsStatus("idle"));
            dispatch(setLastHeartbeat(format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS")));
        }
    },[settingsState.status]);

    useEffect(() => {
        if (companyState.status === "companyLoaded") {
            dispatch(setCompanyStatus("idle"));
            if (companyState.company) {
                dispatch(getTeams(companyState.company._id));
                dispatch(getMembers(companyState.company._id));
            }
        }
    }, [companyState.status]);

    /*
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
        dispatch(setSearchText(e.currentTarget.value));
    }
    */
    const popSettingsWindow = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setSettingsContextParams({ _id: "1", event: e }); 
    }
    /*
    const handleShowBilling = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setBillingContextMenuParams({ id: '1', event: e }); 
    }
    */
    const refreshBrowser = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setVersion(settingsState.version);
        setNewVersionExists(false);
        window.location.reload();
    }

    let settings = settingsState.settings;
    let currentMember = undefined;
    let componentNav: JSX.Element = (<div></div>);
    let showSearchWork = true;
    let recentPayment: StripePayment | null = stripeState.mostRecentPayment;
    let plan: StripePlan | undefined = undefined;

    if (recentPayment) {
        plan = stripeState.plans.find(p => p._id === recentPayment!.stripePlanId);
    }
    
    let searchPlaceholder = "Search your " + settingsState.settings.loadedComponentType + "...";
    let trialMessage = "FREE";

    return (
        <>
        {newVersionExists &&
            <div className="updateBannerDiv">
                <FaHammer color="#6B7280" size={20} />
                <span className="updateBannerSpan">
                    We've been hard at work and just released a new version of the app 
                </span>
                <Link to="" onClick={(e) => refreshBrowser(e)} className="updateBannerLink">
                    Take me there!
                </Link>
            </div>
        }
        <div style={{ width: "100%", padding: "7px 15px 7px 10px", backgroundColor: "#F7F8FA", 
            borderTopRightRadius: "20px", display: "flex", alignItems: "center",
            justifyContent: "space-between"
            }}>
            <div style={{ display: "inline-block", marginRight: "auto" }}>
                {companyState.company?.name ?
                <>
                {companyState.company.logo &&
                    <div style={{ display: "inline-block" }}>
                        <img src={companyState.company.logo} referrerPolicy="no-referrer" style={{ width: "40px", borderRadius: "50%" }}  />
                    </div>
                }
                <div style={{ display: "inline-block", paddingLeft: "10px", fontWeight: "550" }}>
                    {companyState.company.name}
                </div>
                </>
                :
                <div style={{ display: "inline-block", cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => {
                        handleLoadComponent(dispatch, "settings", settingsState.settings);
                        dispatch(loadSubComponent({ parent: "settings", child: 'company'}));
                    }}>
                    Click here to setup your company
                </div>
                }
                {/*
                <div style={{ display: "inline-block", color: "gray" }}>&nbsp;&nbsp;&nbsp;| </div>
                <div style={{ display: "inline-block", paddingLeft: "10px", fontWeight: "550" }}>
                    Advisor: <b>Adam Morrison</b>
                </div>
                */}
                <div style={{ fontSize: "10pt" }}>
                    {componentNav}
                </div>
            </div>
            <div style={{ display: "flex",alignItems: "center" }}>
                {/*
                {showSubscriptionSuccess &&
                    <div className="success" style={{ fontSize: "11pt", marginTop: "0px", 
                        display: "inline-block", position: "relative", padding: "5px 20px" }}>
                        You're in - thanks for subscribing!
                    </div>
                }
                {showSearchWork &&
                <>
                    <div style={{ display: "inline-block", position: "relative", left: "26px" }}>
                        <BiSearch color="gray" size={18} />
                    </div>
                    <div style={{ display: "inline-block", marginRight: "20px" }}>
                        <input type="text" className="navSearchInput" placeholder={searchPlaceholder} 
                            value={search}
                            onChange={(e) => handleSearchChange(e)}
                        />
                    </div>
                </>
                }
                */}
                {/*
                <div style={{ position: "relative", marginRight: "20px" }}>
                    <BsBell size={24} />
                    <span
                        style={{
                            position: "absolute",
                            top: "4px",
                            right: "-3px",
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#2563eb",
                            borderRadius: "50%",
                            border: "2px solid #fff"
                        }}
                    ></span>
                </div>
                */}
{/*
                {userState.earlyAdopter ? 
                    <div style={{ display: "inline-block", fontSize: "8pt", marginRight: "20px" }}>
                          <div style={{ fontWeight: "bold" }}>
                              EARLY ADOPTER
                          </div>
                          <div style={{ fontWeight: "bold", color: "#007AFF" }}>
                              FREE, NO LIMITS&nbsp;
                          </div>
                      </div>                  
                :               
                    <>*/} 
                    {/*
                    {((recentPayment === null && userState.created) || (recentPayment && !recentPayment.active)) ?
                        <div style={{ display: "inline-block", fontSize: "8pt", marginRight: "20px", cursor: "pointer" }}
                            onClick={(e) => handleShowBilling(e)}>
                            <div style={{ fontWeight: "bold" }}>
                                MONTHLY
                            </div>
                            <div style={{ fontWeight: "bold", color: "#007AFF" }}>
                                {(!recentPayment) ? "Change Plan" : "Resubscribe"}&nbsp;
                                <VscTriangleDown size={14} color="#007AFF" />
                            </div>
                        </div>
                    :
                        <div style={{ display: "inline-block", fontSize: "8pt", marginRight: "20px", cursor: "pointer" }}
                            onClick={(e) => handleShowBilling(e)}>
                            <div style={{ fontWeight: "bold" }}>
                                {(plan) && plan.name.toUpperCase()}
                            </div>
                            <div style={{ fontWeight: "bold", color: "#007AFF" }}>
                                Change&nbsp;
                                <VscTriangleDown size={14} color="#007AFF" />
                            </div>
                        </div>
                    }
                    */}
                    {/*
                    </>
                } */}
                {settingsState.otherCompanies.length > 0 &&
                    <div
                        style={{
                            display: "inline-block",
                            fontSize: "8pt",
                            marginRight: "10px",
                            cursor: "pointer",
                            transition: "opacity 0.25s ease",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            backgroundColor: "#051a26"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        onClick={() => setShowModal(true)}
                        >
                        <span style={{ position: "relative", top: "5px", left: "7px" }}>
                            <MdSwitchAccount size={16} color="#f7f8fa" />
                        </span>
                    </div>
                }
                <div onClick={(e) => popSettingsWindow(e)} style={{ cursor: "pointer" }}>    
                    <Avatar size="small" member={currentMember} />
                </div>
            </div>
        </div>
        <SettingsContext params={settingsContextParams} />
        {showModal && <SwitchCompany onClose={() => setShowModal(false)} />}
        {/*
        <BillingContextMenu params={billingContextMenuParams} />
        */}
        </>
    );
}

export default TopNav;