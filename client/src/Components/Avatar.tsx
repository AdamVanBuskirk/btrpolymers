import { useAppSelector } from '../Core/hooks';
import { getUser } from '../Store/Auth';
import { Member } from "../Models/Requests/Member";
import { BsPerson } from 'react-icons/bs';

interface Props {
    size: string;
    member?: Member;
    inline?: boolean;
    owner?: boolean;
}

function Avatar(props: Props) {

    const user = useAppSelector(getUser);

    let aClass = "";
    let iClass = "";

    if (props.inline) {
        aClass = (props.size === "xxsmall") ? "iimgxxSmallAvatar" : (props.size === "xsmall") ? "iimgxSmallAvatar" : (props.size === "small") ? "iimgSmallAvatar" : "iimgAvatar";
        iClass = (props.size === "xxsmall") ? "iimgxxSmallAvatarInitials" : (props.size === "xsmall") ? "iimgxSmallAvatarInitials" : (props.size === "small") ? "iimgSmallAvatarInitials" : "iimgAvatarInitials";
    
    } else {
        aClass = (props.size === "xxsmall") ? "imgxxSmallAvatar" : (props.size === "xsmall") ? "imgxSmallAvatar" : (props.size === "small") ? "imgSmallAvatar" : "imgAvatar";
        iClass = (props.size === "xxsmall") ? "imgxxSmallAvatarInitials" : (props.size === "xsmall") ? "imgxSmallAvatarInitials" : (props.size === "small") ? "imgSmallAvatarInitials" : "imgAvatarInitials";
    }

    return (
        <>
        {props.member ?
            <>
             {props.member.avatar !== "" && props.member.avatar !== undefined ?
               
                    <img className={aClass} src={props.member.avatar} referrerPolicy="no-referrer" />
             
            :
                <>
                {props.member.status === "invited" ?
                    <div className={iClass} style={{ backgroundColor: "#000", color: "#fff" }}>
                        <div style={{ position: "relative", top: "-2px" }}>
                            <BsPerson />
                        </div>
                    </div>
                    
                :
                    <div className={iClass}
                        style={{ backgroundColor: props.member.defaultAvatarColor, 
                            color: props.member.defaultAvatarFontColor
                        }}>
                        {props.member.firstName.charAt(0).toUpperCase()}
                        {props.member.lastName.charAt(0).toUpperCase()}
                    </div>
                }
                </>
            }
            </>
        :
            <>
            {user.avatar !== "" && user.avatar !== undefined ?
                <>
                {props.owner !== false &&
                   
                        <img className={aClass} src={user.avatar} referrerPolicy="no-referrer" />
                   
                }
                </>
            :
                <div className={iClass}
                    style={{ backgroundColor: user.defaultAvatarColor, 
                        color: user.defaultAvatarFontColor
                    }}>
                    {user.firstName.charAt(0).toUpperCase()}
                    {user.lastName.charAt(0).toUpperCase()}
                </div>
            }
            </>
        }
       </>
    );
}

export default Avatar;