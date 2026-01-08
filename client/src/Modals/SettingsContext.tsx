import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useIsMobile } from "../Core/hooks";
import { ContextMenu } from "../Models/ContextMenu";
import { SettingsContextParam } from "../Models/Requests/SettingsContextParam";
import { AiOutlineClose } from "react-icons/ai";
import { logout, setAvatar, getUser } from "../Store/Auth";
import { getSettings } from "../Store/Settings";
import { getCompany, setMembers } from "../Store/Company";
import Resizer from "react-image-file-resizer";
import Avatar from "../Components/Avatar";
import { format } from "date-fns";
import { generateGUID } from "../Helpers/generateGuid";
import { BsCreditCard } from "react-icons/bs";
import SubscriptionContextMenu from "./SubscriptionContextMenu";
import { SubscriptionContextMenuParam } from "../Models/Requests/SubscriptionContexMenuParam";

interface Props {
  params: SettingsContextParam | undefined;
}

function SettingsContext(props: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userState = useAppSelector(getUser);
  const settingsState = useAppSelector(getSettings);
  const companyState = useAppSelector(getCompany);
  const avatarUpload = useRef<HTMLInputElement | null>(null);
  const [settingsContext, setSettingsContext] = useState<ContextMenu>();
  const [subscriptionContextParams, setSubscriptionContextParams] = useState<SubscriptionContextMenuParam>();
  const isMobile = useIsMobile();
  const role = companyState.members.find(m => m.me)?.role || "";

  useEffect(() => {
    if (props.params) {
      let contextMenu = { _id: "", x: 0, y: 0, width: 0, height: 0 };
      if (!settingsContext || settingsContext._id !== props.params._id) {
        // Desktop dropdown: appear under topnav avatar
        const menuWidth = 300;
        const menuXStart = window.innerWidth - menuWidth - 25; // ✅ aligns right under avatar
        const menuYStart = 70; // just under topnav height

        contextMenu = {
          _id: props.params._id,
          x: menuXStart,
          y: menuYStart,
          width: menuWidth,
          height: 0,
        };
        setSettingsContext(contextMenu);
      }
    }
  }, [props.params]);

  const closeMenu = () => setSettingsContext({ _id: "", x: 0, y: 0, width: 0, height: 0 });

  const popSubscriptionWindow = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSubscriptionContextParams({ id: "1", event: e, closeHandler: closeMenu });
    //setSubscriptionContextParams ({ id: "1", event: e }); // triggers BillingContext modal
  };

  const logUserOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/");
  };
/*
  const popChangeAvatar = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    avatarUpload.current?.click();
  };
*/
  const captureAvatarUpload = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const file = e.currentTarget.files[0];
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        80,
        0,
        async (uri) => {
          const members = [...companyState.members];
          const index = members.findIndex((m) => m.me);
          if (index !== -1) {
            members[index] = { ...members[index], avatar: uri as string };
            dispatch(setAvatar(uri as string));
            dispatch(setMembers(members));
          }
        },
        "base64",
        200,
        200
      );
    }
  };

  const handleRemoveAvatar = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(setAvatar(""));
    const members = [...companyState.members];
    const index = members.findIndex((m) => m.userId === userState._id);
    if (index !== -1) {
      members[index] = { ...members[index], avatar: "" };
      dispatch(setMembers(members));
    }
  };

  const sContextMenu: React.CSSProperties = {
    position: isMobile ? "fixed" : "absolute",
    top: isMobile ? "0px" : "50px",
    right: isMobile ? 0 : "25px",
    left: isMobile ? 0 : "auto",
    width: isMobile ? "100vw" : settingsContext?.width || 300,
    height: isMobile ? "100vh" : "auto",
    background: "#fff",
    borderRadius: isMobile ? "0" : "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
    overflowY: "auto",
    zIndex: 1000,
  };

  const contentStyle: React.CSSProperties = {
    padding: isMobile ? "30px 20px 40px" : "25px 20px",
    textAlign: "center",
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // this must be a direct, synchronous user gesture:
    avatarUpload.current?.click();
  };

  return (
    <>
      {settingsContext && settingsContext._id !== "" && (
        <div
          onClick={(e) => closeMenu()}
          style={{
            background: "rgba(0,0,0,0.3)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        >
          <div
            className="cardContextMenu"
            style={sContextMenu}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: isMobile ? "15px 20px" : "10px 15px",
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: "12pt" }}>
                {isMobile ? "Account Settings" : ""}
              </div>
              <Link to="" onClick={(e) => { e.preventDefault(); closeMenu(); }}>
                <AiOutlineClose color="#555" size={isMobile ? 20 : 14} />
              </Link>
            </div>

            {/* Content */}
            <div style={contentStyle}>
              <input
                type="file"
                ref={avatarUpload}
                style={{ display: "none" }}
                onChangeCapture={(e) => captureAvatarUpload(e)}
              />

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "10px",
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={(e) => e.stopPropagation()} // keep modal open
              >
                <input
                  type="file"
                  ref={avatarUpload}
                  onChangeCapture={(e) => captureAvatarUpload(e)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
                <Avatar size={isMobile ? "xlarge" : "large"} member={undefined} />
              </label>

              <div style={{ fontSize: "10pt", color: "#777", marginTop: "8px" }}>
                Tap to change your avatar
              </div>

              {userState.avatar && (
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  <Link
                    to=""
                    onClick={(e) => handleRemoveAvatar(e)}
                    style={{ textDecoration: "underline", fontSize: "9pt" }}
                  >
                    Remove Avatar
                  </Link>
                </div>
              )}

              {!isMobile &&
              <>
                {(role === "owner" || role === "admin") ?
                  <div
                    style={{
                      padding: "10px 12px",
                      cursor: "pointer",
                      fontSize: "9.5pt",
                      borderTop: "1px solid #eee",
                      borderBottom: "1px solid #eee",
                      margin: "20px 0px"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f5f7fa";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      //e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
                      e.currentTarget.style.borderTop = "unset";
                      e.currentTarget.style.borderBottom = "unset";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "none";
                      //e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderTop = "1px solid #eee";
                      e.currentTarget.style.borderBottom = "1px solid #eee";
                    }}
                    onClick={(e) => popSubscriptionWindow(e)}
                  >
                    <span style={{ position: "relative", top: "-3px" }}>
                      <BsCreditCard size={20} color="#555f" />
                    </span>
                    <span style={{ paddingLeft: "10px", fontSize: "14pt", color: "#555" }}>
                      Billing
                    </span>
                  </div>
                :
                  <div style={{ paddingBottom: "10px"}}></div>
                }
              </>
              }

              

              <Link
                className="settingsLink"
                to=""
                onClick={(e) => logUserOut(e)}
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  borderRadius: "30px",
                  background: "#ef4444",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      )}
      <SubscriptionContextMenu params={subscriptionContextParams} />
    </>
  );
}

export default SettingsContext;
