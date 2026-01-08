import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../Core/hooks';
import { ContextMenu } from '../Models/ContextMenu';
import { SharingContextParam } from'../Models/Requests/SharingContextParam';
import { AiOutlineClose } from "react-icons/ai";
import { getCompany, setMembers } from "../Store/Company";
import { Member } from '../Models/Requests/Member';
import { getSettings } from '../Store/Settings';
import { useIsMobile } from '../Core/hooks';
import { IconContext } from "react-icons";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { isValidEmail } from "../Helpers/isValidEmail";
import { getUser } from '../Store/Auth';
import { format } from 'date-fns';
import { generateGUID } from '../Helpers/generateGuid';
import { Role } from '../Helpers/types';

interface Props {
    params: SharingContextParam | undefined;    
}

function SharingContext(props: Props) {

    const isMobile = useIsMobile();
    const dispatch = useAppDispatch();
    const companyState = useAppSelector(getCompany);
    const [sharingContext, setSharingContext] = useState<ContextMenu>();
    const [dropDownClass, setDropDownClass] = useState<string>("dropDown");
    const [showingDropDown, setShowingDropDown] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>("Member");
    const [showingInviteSent, setShowingInviteSent] = useState<boolean>(false);
    const [showingEmailInviteBox, setShowingEmailInviteBox] = useState<boolean>(false);
    const [showingEmailInviteBoxEmail, setShowingEmailInviteBoxEmail] = useState<boolean>(false);
    const [emailInviteBoxValue, setEmailInviteBoxValue] = useState<string>("");
    const [showingEmailShareDescription, setShowingEmailShareDescription] = useState<boolean>(false);
    const [emailShareDescription, setEmailShareDescription] = useState<string>("");
    const [selectedEmails, setSelectedEmails] = useState<Array<string>>([]);
    const [editingMember, setEditingMember] = useState<Member | undefined>();
  
    useEffect(() => {
        if (props.params) {
            if (props.params && props.params.email !== "") {
                let member = companyState.members.find(m => m.email === props.params!.email);
                if (member) {
                    setEditingMember(member);
                    if (member.role) {
                        setSelectedEmails([props.params.email]);
                        setSelectedOption(member.role.charAt(0).toUpperCase() + member.role.slice(1));
                    }
                }
            }

            let contextMenu = { _id: "", x: 0, y: 0, width: 0, height: 0 };
            if ((sharingContext && sharingContext._id !== props.params._id) || !sharingContext) {
                let menuWidth = window.outerWidth * .60;
                let menuXStart = window.outerWidth * .20;
                let menuYStart = 20;
                if (menuXStart + menuWidth > window.outerWidth) {
                    menuXStart = window.outerWidth - menuWidth - 10;
                }
                contextMenu._id = props.params._id;
                contextMenu.x = menuXStart;
                contextMenu.y = menuYStart;
                contextMenu.width = menuWidth;
            }
            setSharingContext(contextMenu);
        }
    }, [props.params]);

    const closeContextMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
    }

    const closeMenu = () => {
        resetState();
        let contextMenu = { _id: "", x: 0, y: 0, width: 0, height: 0 };
        setSharingContext(contextMenu);
    }

    const resetState = () => {
        dehighlightDropdown();
        setEmailInviteBoxValue("");
        setSelectedOption("Member");
        setShowingEmailInviteBox(false);
        setShowingEmailInviteBoxEmail(false);
        setShowingEmailShareDescription(false);
        setSelectedEmails([]);
    }

    const toggleDropDownHighlight = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if(!showingDropDown) {
            highlightDropdown();
        } else {
            dehighlightDropdown();
        }
    }

    const highlightDropdown = () => {
        setDropDownClass("dropDownSelected");
        setShowingDropDown(true);
    }

    const dehighlightDropdown = () => {
        setDropDownClass("dropDown");
        setShowingDropDown(false);
    }

    const selectOption = (e: React.MouseEvent<HTMLDivElement>, option: string) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedOption(option);
        dehighlightDropdown();
    }

    const handleShowingEmailInviteBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setEmailInviteBoxValue(e.currentTarget.value);
    }

    const handleShowingEmailInviteBoxKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if(showingEmailInviteBoxEmail) {
            if (['Enter'].indexOf(e.key) !== -1) {
                selectEmail();
                return;
            }
        }

        if(e.currentTarget.value !== "") {
            setShowingEmailInviteBox(true);
            setShowingEmailInviteBoxEmail(false);
            if(isValidEmail(e.currentTarget.value)) {
                setShowingEmailInviteBoxEmail(true);
            }   
        } else {
            setShowingEmailInviteBox(false);
            setShowingEmailInviteBoxEmail(false);
        }
    }

    const handleSelectEmail = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        selectEmail();
    }

    const selectEmail = () => {
        
        setShowingEmailShareDescription(true);
        setShowingEmailInviteBox(false);
        setShowingEmailInviteBoxEmail(false);

        let emails = [...selectedEmails];
        if(!emails.includes(emailInviteBoxValue)) {
            emails.push(emailInviteBoxValue);
            setSelectedEmails(emails);
            setEmailInviteBoxValue("");
        }
    }

    const handleChangeEmailShareDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setEmailShareDescription(e.currentTarget.value);
    }

    const removeSelectedEmail = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
        e.preventDefault();
        e.stopPropagation();
        
        let emails = [...selectedEmails];
        emails.splice(i,1);
        if (sharingContext !== undefined && emails.length === 0) {
            let contextMenu = { ...sharingContext };
            contextMenu.height =  window.outerHeight * .65;
            setSharingContext(contextMenu);
            setShowingEmailShareDescription(false);
        }
        setSelectedEmails(emails);
    }

    const handleShareViaEmail = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if(sharingContext && selectedEmails.length > 0) {
            /*
            (async () => {
                let socket = await openSocket(dispatch, settingsState);
                if (socket) {
                    socket.emit("shareViaEmail", { 
                        projectId: sharingContext._id,
                        emails: selectedEmails,
                        emailBody: emailShareDescription,
                        permission: selectedOption,
                    });
                    let project = projectState.projects.find(p => p._id === sharingContext._id);
                    if (project) {
                        socket.emit("createActivity", { activity: {
                            _id: generateGUID(),
                            userId: userState._id,
                            section: "work",
                            object: "work",
                            objectId: project._id,
                            action: "shared board",
                            description: `${userState.firstName} ${userState.lastName} shared the board titled "${project.name}" with email(s) "${selectedEmails}" with permissions of "${selectedOption}".`,
                            created: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                        }});
                    }
                }
            })();
            */
            // show success, reset screen
            setShowingInviteSent(true);
            setTimeout(() => {
                setShowingInviteSent(false);
                closeContextMenu(e);
            }, 1000);
        }
    }

    const handleSaveMember = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        if(sharingContext && editingMember) {
            
            let tempMember = {...editingMember};
            tempMember.role= selectedOption.toLowerCase() as Role;

            /* update backend
            (async () => {
                let socket = await openSocket(dispatch, settingsState);
                if (socket) {
                    socket.emit("saveMember", { 
                        projectId: sharingContext._id,
                        member: tempMember
                    });
                    // Log activity
                    socket.emit("createActivity", { activity: {
                        _id: generateGUID(),
                        userId: userState._id,
                        section: "work",
                        object: "member",
                        objectId: tempMember.userId,
                        action: "save",
                        description: (tempMember.status === "invited") ?
                            `${userState.firstName} ${userState.lastName} saved invited member "${tempMember.email}".`
                        : 
                            `${userState.firstName} ${userState.lastName} saved member "${tempMember.firstName} ${tempMember.lastName}".`,
                        created: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                    }});
                }
            })();
            */
            /* update frontend */
            let members = [...companyState.members];
            let index = members.findIndex(m => m.email === tempMember.email);
            if (index !== -1) {
                members[index] = tempMember;
                dispatch(setMembers(members));
            }
            // show success, reset screen
            setShowingInviteSent(true);
            setTimeout(() => {
                setShowingInviteSent(false);
                closeContextMenu(e);
            }, 1000);
        }
    }
/*
    const chkBoard = (e: React.ChangeEvent<HTMLInputElement>, cardId: string) => {
        let map = new Map(chkBoards);
        if (map) {
            let cardSetting = map.get(cardId);
            if (cardSetting) {
                map.set(cardId, !cardSetting);
            } else {
                map.set(cardId, true);
            }
            setChkBoards(map);
        }
    }
*/
    const sContextMenu: React.CSSProperties = {
        position: "relative",
        top: sharingContext && !isMobile ? sharingContext.y : 0,
        width: isMobile 
            ? "100vw" 
            : sharingContext
                ? sharingContext.width 
                : 300,
        height: "auto",
        minHeight: isMobile ? "100vh" : "auto",
    };
    
    const memberSelected = (selectedOption === "Member") ? "selected": "";
    const observerSelected = (selectedOption === "Observer") ? "selected": "";
    const adminSelected = (selectedOption === "Admin") ? "selected": "";

    return (
        <>
        {sharingContext && sharingContext._id !== "" &&
            <div onClick={e => closeMenu()} className="windowContainer">
                <div className="cardContextMenu" style={sContextMenu} onClick={e => { e.preventDefault(); e.stopPropagation(); dehighlightDropdown(); }}>
                    <div className="divClose">
                        <Link to="" onClick={(e) => closeContextMenu(e)}>
                            <AiOutlineClose color="#555" size="13" />
                        </Link>
                    </div>
                    <div className="sharingContext" style={{ margin: "auto 0px", textAlign: "center" }}
                        onClick={(e) => { e.stopPropagation(); dehighlightDropdown(); }}>
                        <div style={{ width: "100%", margin: "0px auto 10px auto" }}>
                            <h1 style={{ width: "100%", margin: "0px auto", fontSize: "16pt", textAlign: "left", marginBottom: "20px" }}>
                                {editingMember ? "Edit Member" : "Invite Users" }
                            </h1>
                            {showingInviteSent &&
                                <div className="sharingInviteSent">
                                    <IconContext.Provider value={{ size: "20", className: "icon" }}>
                                        <IoIosCheckmarkCircleOutline />
                                    </IconContext.Provider>  
                                    <span className="ps-2">
                                        {editingMember ? "Member Saved" : "Invite(s) sent" }
                                    </span>
                                </div>
                            }
                            <div 
                                style={{
                                    ...(isMobile
                                    ? {
                                        width: "100%",
                                        paddingBottom: "5px",
                                        verticalAlign: "top"
                                        }
                                    : {
                                        display:"inline-block",
                                        width: "50%",
                                        marginRight: "2%", 
                                        verticalAlign: "top"
                                      }),
                                }}
                            >
                                <div>
                                    {selectedEmails.length > 0 ?
                                        <div className="mimicInput text-start">
                                            {selectedEmails.map((e, i) => {
                                                return (
                                                <div className="emailButton">
                                                    <span className="pe-2">{e}</span>
                                                    {!editingMember &&
                                                        <div onClick={(e) => removeSelectedEmail(e,i)} 
                                                            style={{ display: "inline-block", cursor: "pointer"  }}>
                                                            <AiOutlineClose size={13} />
                                                        </div>
                                                    }
                                                </div>
                                                )
                                            })}
                                            {!editingMember &&
                                                <input type="text"   
                                                    style={{ 
                                                        display: "inline-block",
                                                        border: "0",
                                                    }} 
                                                    onKeyUp={(e) => handleShowingEmailInviteBoxKeyUp(e)}
                                                    onChange={(e) => handleShowingEmailInviteBoxChange(e)}
                                                    value={emailInviteBoxValue}
                                                />
                                            }
                                        </div>
                                    :
                                        <input type="text" placeholder="Email address" style={{ width:"100%", height: "40px" }} 
                                            onKeyUp={(e) => handleShowingEmailInviteBoxKeyUp(e)}
                                            onChange={(e) => handleShowingEmailInviteBoxChange(e)}
                                            value={emailInviteBoxValue}
                                        />
                                    }
                                </div>
                                {showingEmailInviteBox &&
                                    <div className="emailInviteBox">
                                        {showingEmailInviteBoxEmail ?
                                            <div className="emailInviteBoxInner" onClick={(e) => handleSelectEmail(e)}>
                                                <div className="row g-0 align-items-center">
                                                    <div className="col-2">
                                                        <IconContext.Provider value={{ size: "35", color: "#000", className: "avatarIcon" }}>
                                                            <FaUserCircle />
                                                        </IconContext.Provider>
                                                    </div>
                                                    <div className="col-10 text-start ps-1">
                                                        {emailInviteBoxValue}
                                                    </div>
                                                </div>
                                            </div>
                                        :
                                            <div style={{ padding: "10px 15px" }}>
                                                Add their email address to invite them
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                            <div onClick={(e) => toggleDropDownHighlight(e)} 
                                style={{
                                    ...(isMobile
                                    ? {
                                        width: "100%",
                                        verticalAlign: "top",
                                        textAlign: "center",
                                        marginBottom: "5px"
                                        }
                                    : {
                                        position: "relative",
                                        display:"inline-block", 
                                        width: "16%",
                                        verticalAlign: "top",
                                        textAlign: "left" 
                                      }),
                                }}
                            >
                                <div className={dropDownClass}>
                                    <div style={{ paddingLeft: "10px" }}>
                                        <span>
                                            {selectedOption}    
                                        </span>
                                        <IconContext.Provider value={{ size: "20", className: "dropDownIcon" }}>
                                            <MdKeyboardArrowDown />
                                        </IconContext.Provider>                                
                                    </div>
                                </div>
                                {showingDropDown === true &&
                                    <div className="dropDownOptionsContainer">
                                        <div className={`dropDownOption ps-2 pt-2 pb-1 ${memberSelected}`} onClick={(e) => selectOption(e, "Member")}>
                                            <div className={`dropDownOptionsTitle`}>Member</div>
                                            <div className={`dropDownOptionsDescription`}>Members can view, add, and edit the roadmap's items.</div>
                                        </div>
                                        <div className={`dropDownOption ps-2 pt-1 pb-1 ${observerSelected}`} onClick={(e) => selectOption(e, "Observer")}>
                                            <div className={`dropDownOptionsTitle`}>Observer</div>
                                            <div className={`dropDownOptionsDescription`}>Observers can view and comment (if applicable).</div>
                                        </div>
                                        <div className={`dropDownOption ps-2 pt-1 pb-3 ${adminSelected}`} onClick={(e) => selectOption(e, "Admin")}>
                                            <div className={`dropDownOptionsTitle`}>Admin</div>
                                            <div className={`dropDownOptionsDescription`}>Admins can have full rights, including managing access.</div>
                                        </div>
                                    </div>
                                } 
                            </div>


                            <div 
                                style={{
                                    verticalAlign: "top",
                                    ...(isMobile
                                    ? {
                                        width: "100%",
                                        marginTop: "20px",
                                        textAlign: "center",
                                        }
                                    : {
                                        display: "inline-block",
                                        width: "8%",
                                        marginLeft: "2%", 
                                        position: "relative",
                                        top: "7px"
                                    }),
                                }}
                            >
                                {editingMember ?
                                    <Link to="" onClick={(e) => handleSaveMember(e)} className="btn-orange" 
                                    style={{
                                        width: "100%",
                                        paddingTop: "10px",
                                        paddingBottom: "10px",
                                        ...(isMobile && { display: "block" }),
                                    }}>
                                        Save
                                    </Link>
                                :
                                    <Link to="" onClick={(e) => handleShareViaEmail(e)} className="btn-orange" 
                                    style={{
                                        width: "100%",
                                        paddingTop: "10px",
                                        paddingBottom: "10px",
                                        ...(isMobile && { display: "block" }),
                                    }}>
                                        Invite
                                    </Link>
                                } 
                            </div>
                            {showingEmailShareDescription &&
                                <div className="row gx-0" style= {{ width: "78%", paddingTop: "7px", margin: "0px auto" }}>
                                    <textarea style={{ width:"100%" }} 
                                        value={emailShareDescription}
                                        onChange={(e) => handleChangeEmailShareDescription(e)}
                                        placeholder="Join me on Herdr and let's work together!" />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        }
        </>
    );
}

export default SharingContext;