import { CSSProperties } from "react";
import { useAppDispatch, useIsMobile } from "../Core/hooks";

function TrialExpired() {
    const isMobile = useIsMobile();
    const style: CSSProperties = isMobile ? 
    {
        width: "80%",
        margin: "0px auto"
    } :
    {
        width: "50%",
        margin: "0px auto"
    }
    return (
        <div className="rightContentDefault">
            <div style={{ width: "100%", height: "100%", margin: "0px auto", 
                textAlign: "center", paddingTop: "100px", fontStyle: "italic",
                backgroundColor: "rgba(0, 0, 0, .8)", color: "#fff"
             }}>
                <div style={style}>
                    <div>
                        <img src="images/trial_expired.jpg" style={{ width: "100%" }} />
                    </div>
                    <div style={{ fontSize: "16pt", marginTop: "50px" }}>
                        <b>Your trial has expired</b>. Please click your avatar in
                        the top-right corner and select the Billing tab. You will need to 
                        subscribe to a paid plan to continue
                        using the platform.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrialExpired;