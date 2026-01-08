import React from 'react';
import { useEffect, useState } from 'react';
import { PopupContext } from '../Models/PopupContext';
import { PopupContextParam } from'../Models/Requests/PopupContextParam';
import { AiOutlineClose } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { useIsMobile } from '../Core/hooks';

interface Props {
    params: PopupContextParam | undefined;    
}

function PopupContextMenu(props: Props) {

    const [popupContext, setPopupContext] = useState<PopupContext>();
    const isMobile = useIsMobile();

    useEffect(() => {
        if (props.params) {
            let popupContext = { _id: "", x: 0, y: 0, width: 0, height: 0 };
            if ((popupContext && popupContext._id !== props.params._id) || !popupContext) {

                //let menuWidth = window.outerWidth / 5;
                let menuWidth = 300;
                let menuXStart = window.outerWidth / 2 - 150;
                let menuYStart = 100;

                if (props.params.event) {
                    menuXStart = props.params.event.clientX - (menuWidth / 2);
                    menuYStart = props.params.event.clientY - 120;
                }

                menuXStart = (menuXStart < 0) ? 10 : menuXStart;
                menuYStart = (menuYStart < 0) ? 10 : menuYStart;

                if (menuXStart + menuWidth > window.outerWidth) {
                    menuXStart = window.outerWidth - menuWidth - 10;
                }
                
                popupContext._id = props.params._id;
                popupContext.x = menuXStart;
                popupContext.y = menuYStart;
                popupContext.width = menuWidth;
            }
            setPopupContext(popupContext);
        }
    }, [props.params]);

    const closePopupContext = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        let context = { _id: "", x: 0, y: 0, width: 0 };
        setPopupContext(context);
    }

    const sPopupContext: React.CSSProperties = {
        top: popupContext && !isMobile ? popupContext.y : 0,
        left: popupContext && !isMobile ? popupContext.x : 0,
        width: isMobile 
            ? "100vw" 
            : popupContext 
                ? popupContext.width 
                : 300,
        overflow: "visible",
        whiteSpace: "normal",
        height: isMobile ? "100vh" : "auto",
    };

    return (
        <>
        {popupContext && popupContext._id !== "" &&
            <div onClick={e => closePopupContext(e)} className="popupContainer">
                <div className="contextMenu" style={sPopupContext} onClick={e => { e.preventDefault(); e.stopPropagation()}}>
                    <h1 className="mb-2">{props.params?.headingText}</h1>
                    {props.params?.backButton &&       
                        <div className="divBack" onClick={(e) => props.params?.closeHandler(e)}>
                            <IoIosArrowBack color="#555" size="13" />
                        </div>
                    }
                    <div className="divClose" onClick={(e) => props.params?.closeHandler(e)}>
                        <AiOutlineClose color="#555" size="13" />
                    </div>
                    <div style={{ fontSize: "11pt", padding: "10px" }}>
                        {props.params?.message}
                    </div>

                        {props.params?.buttonHandler !== undefined &&
                            <div className={props.params?.buttonClass}
                                // @ts-ignore
                                onClick={(e) => props.params?.buttonHandler(e)}>
                                {props.params.buttonText}
                            </div>
                        }
                        {props.params?.buttonHandlerWithId !== undefined &&
                            <div className={props.params?.buttonClass} 
                                // @ts-ignore
                                onClick={(e) => props.params?.buttonHandlerWithId(e, props.params._id)}>
                                {props.params.buttonText}
                            </div>
                        }
                </div>
            </div>
        }
        </>
    );
}

export default PopupContextMenu;