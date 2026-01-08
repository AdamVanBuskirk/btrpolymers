import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../Core/hooks';
import { getCompany, setMembers } from '../Store/Company';
import { ContextMenu } from '../Models/ContextMenu';
import { MemberContextMenuParam } from'../Models/Requests/MemberContexMenuParam';
import { AiOutlineClose } from "react-icons/ai";
import PopupContextMenu from './PopupContext';
import { PopupContextParam } from '../Models/Requests/PopupContextParam';
import SharingContext from "../Modals/SharingContext";
import { SharingContextParam } from "../Models/Requests/SharingContextParam";
import { getSettings } from '../Store/Settings';
import { useIsMobile } from '../Core/hooks';
import { getUser } from '../Store/Auth';
import { format } from 'date-fns';
import { generateGUID } from '../Helpers/generateGuid';

interface Props {
    params: MemberContextMenuParam | undefined;    
}

function MemberContextMenu(props: Props) {

    const dispatch = useAppDispatch();
    const companyState = useAppSelector(getCompany);
    const settingsState = useAppSelector(getSettings);
    const userState = useAppSelector(getUser);
    const [popupParams, setPopupParams] = useState<PopupContextParam>();
    const [memberContextMenu, setMemberContextMenu] = useState<ContextMenu>();
    const [sharingContextParams, setSharingContextParams] = useState<SharingContextParam>();
    const isMobile = useIsMobile();

    useEffect(() => {
        setSharingContextParams(undefined);
    },[])

    useEffect(() => {
        if (props.params) {
            let contextMenu = { _id: "", x: 0, y: 0, width: 0, height: 0 };
            if ( (memberContextMenu && memberContextMenu._id !== props.params.projectId) || !memberContextMenu) {
                if (props.params.event) {
                    let menuWidth = window.outerWidth / 5;
                    let menuXStart = props.params.event.clientX - 10;
                    let menuYStart = props.params.event.clientY + 20
                    if (menuXStart + menuWidth > window.outerWidth) {
                        menuXStart = window.outerWidth - menuWidth - 80;
                    }
                    contextMenu._id = props.params.projectId;
                    contextMenu.x = menuXStart;
                    contextMenu.y = menuYStart - 100;
                    contextMenu.width = menuWidth;
                }
            }
            setMemberContextMenu(contextMenu);
        }
    }, [props.params]);

    const closeContextMenu = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeMenu();
    }

    const closeMenu = () => {
        let contextMenu = { _id: "", x: 0, y: 0, width: 0, height: 0 };
        setMemberContextMenu(contextMenu);
    }

    const editMember = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (props.params) {
            closeMenu();
            setSharingContextParams({ _id: props.params.projectId, email: props.params.email, event: e });
        }
    }

    const closeDeleteMemberPopup = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        /* Key here is to zero-out label */
        setPopupParams({
            _id: "",
            event: e,
            buttonClass: "",
            buttonText: "",
            closeHandler: closeDeleteMemberPopup,
            buttonHandler: deleteMemberConfirmed,
            message: "",
            headingText: "",
            backButton: true,
        });
    }
    
    const deleteMemberConfirmed = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (props.params) {
            let projectId = props.params.projectId;
            let email = props.params.email;
            /*
            (async () => {
                let socket = await openSocket(dispatch, settingsState);
                if (socket) {
                    socket.emit("deleteMember", { 
                        projectId: projectId,
                        email: email
                    });
                    socket.emit("createActivity", { activity: {
                        _id: generateGUID(),
                        userId: userState._id,
                        section: "work",
                        object: "work",
                        objectId: projectId,
                        action: "removed member",
                        description: `${userState.firstName} ${userState.lastName} removed member with email "${email}" from the project.`,
                        created: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),
                    }});
                }
            })();
            */
            let members = [...companyState.members];
            let removeMemberIndex = members.findIndex(m => m.email === email);
            if (removeMemberIndex !== -1) {
                members.splice(removeMemberIndex, 1);
                dispatch(setMembers(members));
                closeDeleteMemberPopup(e);
                closeMenu();
            }
        }
    }
    
    const handleDeleteMember = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (memberContextMenu) {
            setPopupParams({
                _id: memberContextMenu._id,
                event: e,
                buttonClass: "btnDelete",
                buttonText: "Remove",
                closeHandler: closeDeleteMemberPopup,
                buttonHandler: deleteMemberConfirmed,
                message: "This will remove this member from the company. There is no undo.",
                headingText: "Remove Member",
                backButton: true,
            });
        }
    }

    const sContextMenu: React.CSSProperties = {
        top: memberContextMenu && !isMobile ? memberContextMenu.y : 0,
        left: memberContextMenu && !isMobile ? memberContextMenu.x : 0,
        width: isMobile 
            ? "100vw" 
            : memberContextMenu 
                ? memberContextMenu.width 
                : 300,
        height: isMobile ? "100vh" : "auto",
    };

    /* Not mobile friendly. Can easily revisit once PMF */

    return (
        <>
            {memberContextMenu && memberContextMenu._id !== "" &&
                <div onClick={e => closeContextMenu(e)} className="popupContainer">
                    <div className="contextMenu" style={sContextMenu} onClick={e => { e.preventDefault(); e.stopPropagation()}}>
                        <h1>Member Options</h1>
                        <div className="divClose">
                            <Link to="" onClick={(e) => closeContextMenu(e)}>
                                <AiOutlineClose color="#555" size="13" />
                            </Link>
                        </div>
                        <div className="divDeleteList" onClick={(e) => editMember(e)}>
                            Edit Member
                        </div>
                        <div className="divDeleteList" onClick={(e) => handleDeleteMember(e)}>
                            Remove Member
                        </div>
                    </div>
                </div>
            }
            <SharingContext params={sharingContextParams} />
            <PopupContextMenu params={popupParams} />
        </>
    );
}

export default MemberContextMenu;