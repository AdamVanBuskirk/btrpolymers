import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../Core/hooks";
import { getSettings, heartBeat, setShowMenu } from "../../Store/Settings";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import { BsBell, BsCreditCard, BsPerson } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { getUser, logout } from "../../Store/Auth";
import { SettingsContextParam } from "../../Models/Requests/SettingsContextParam";
import SettingsContext from "../../Modals/SettingsContext";
import { getCompany, getMembers, getTeams, setCompanyStatus } from "../../Store/Company";
import { FaHammer } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiCreditCard } from "react-icons/bi";
import { MdSwitchAccount } from "react-icons/md";
import Avatar from "../Avatar";
import SwitchCompany from "../../Modals/SwitchCompany";
import SubscriptionContextMenu from "../../Modals/SubscriptionContextMenu";
import { SubscriptionContextMenuParam } from "../../Models/Requests/SubscriptionContexMenuParam";
import { getMostRecentPayment } from "../../Store/Stripe";

function TopNav() {
  const dispatch = useAppDispatch();
  const settingsState = useAppSelector(getSettings);
  const companyState = useAppSelector(getCompany);
  const userState = useAppSelector(getUser);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [settingsContextParams, setSettingsContextParams] = useState<SettingsContextParam>();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [version, setVersion] = useState("");
  const [newVersionExists, setNewVersionExists] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [subscriptionContextParams, setSubscriptionContextParams] = useState<SubscriptionContextMenuParam>();
  const role = companyState.members.find(m => m.me)?.role || "";

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

  // close avatar dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAvatarMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (companyState.status === "companyLoaded") {
        dispatch(setCompanyStatus("idle"));
        if (companyState.company) {
            dispatch(getTeams(companyState.company._id));
            dispatch(getMembers(companyState.company._id));
        }
    }
}, [companyState.status]);


const popSubscriptionWindow = (e: React.MouseEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
  setSubscriptionContextParams({ id: "1", event: e, closeHandler: () => {} });
  //setSubscriptionContextParams ({ id: "1", event: e }); // triggers BillingContext modal
};

  const popSettingsWindow = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSettingsContextParams({ _id: "1", event: e }); // triggers SettingsContext modal
    setShowAvatarMenu(false);
  };

  const refreshBrowser = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setVersion(settingsState.version);
    setNewVersionExists(false);
    window.location.reload();
}

  let me = companyState.members.find(m => m.me);

  return (
    <>
      {newVersionExists &&
          <div className="updateBannerDiv">
              <FaHammer color="#6B7280" size={20} />
              <span className="updateBannerSpan">
                  New version released 
              </span>
              <Link to="" onClick={(e) => refreshBrowser(e)} className="updateBannerLink">
                  Take me there!
              </Link>
          </div>
      }
      <div
        style={{
          width: "100%",
          padding: "18px 20px",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #eee",
        }}
      >
        {/* Left side (menu + company name) */}
        <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
          {settingsState.showMenu ? (
            <IoCloseOutline
              size={26}
              style={{ cursor: "pointer", flexShrink: 0 }}
              onClick={() => dispatch(setShowMenu(false))}
            />
          ) : (
            <RxHamburgerMenu
              size={21}
              style={{ cursor: "pointer", flexShrink: 0 }}
              onClick={() => dispatch(setShowMenu(true))}
            />
          )}

          <div
            style={{
              paddingLeft: 12,
              fontWeight: "bold",
              fontSize: "11pt",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "250px",
            }}
            title={companyState.company?.name}
          >
            {companyState.company?.name}
          </div>
        </div>

        {/* Right side (icons + avatar) */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/*
          <div style={{ position: "relative" }}>
            <BsBell size={19} />
            <span
              style={{
                position: "absolute",
                top: "4px",
                right: "-4px",
                width: "10px",
                height: "10px",
                backgroundColor: "#2563eb",
                borderRadius: "50%",
                border: "2px solid #fff",
              }}
            ></span>
          </div>

          <IoIosSearch size={21} />
          */}
            {settingsState.otherCompanies.length > 0 &&
              <div
                  style={{
                      display: "inline-block",
                      fontSize: "8pt",
                      marginRight: "0px",
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
          {/* Avatar Dropdown */}
          <div style={{ position: "relative" }} ref={menuRef} onClick={() => setShowAvatarMenu((prev) => !prev)}>
            <Avatar
              size="small"
              member={me}
            />

            {showAvatarMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "45px",
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  zIndex: 100,
                  width: "160px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    fontSize: "9.5pt",
                  }}
                  onClick={(e) => popSettingsWindow(e)}
                >
                  <span style={{ position: "relative", top: "-1px" }}>
                    <BsPerson size={14} />
                  </span>
                  <span style={{ paddingLeft: "10px" }}>
                    Change Avatar
                  </span>
                </div>
                {(role === "owner" || role === "admin") &&
                  <div
                    style={{
                      padding: "10px 12px",
                      cursor: "pointer",
                      fontSize: "9.5pt",
                      borderTop: "1px solid #eee",
                    }}
                    onClick={(e) => popSubscriptionWindow(e)}
                  >
                    <span style={{ position: "relative", top: "-1px" }}>
                      <BsCreditCard size={14} />
                    </span>
                    <span style={{ paddingLeft: "10px" }}>
                      Billing
                    </span>
                  </div>
                }
                <div
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    fontSize: "9.5pt",
                    borderTop: "1px solid #eee",
                    color: "#dc2626",
                  }}
                  onClick={() => dispatch(logout())}
                >
                  Log Out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <SettingsContext params={settingsContextParams} />
      <SubscriptionContextMenu params={subscriptionContextParams} />
      {showModal && <SwitchCompany onClose={() => setShowModal(false)} />}
    </>
  );
}

export default TopNav;
