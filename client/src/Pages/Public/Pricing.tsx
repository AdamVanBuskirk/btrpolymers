import { useEffect, useState } from 'react';
//import { Link } from 'react-router-dom';
import { useAppDispatch, useIsMobile } from '../../Core/hooks';
import { emailSupport } from '../../Store/Utility';
import Footer from '../../Components/Footer';
import Navigation from '../../Components/Navigation';
//import Registration from '../../Modals/Registration';
import PricingTiers from '../../Components/PricingTiers';
import { isValidEmail } from "../../Helpers/isValidEmail";
import RedirectToDash from '../../Components/RedirectToDash';
import { IoBulbOutline, IoCode, IoCodeSlashOutline } from 'react-icons/io5';

function Pricing() {

    const dispatch = useAppDispatch();
    const isMobile = useIsMobile();
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    //const [showRegistration, setShowRegistration] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
/*
    const toggleRegistration = (visible: boolean) => {
        setShowRegistration(visible);
    }
*/
    const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
      };

    const handleEmailSupport = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {

        e.preventDefault();

        if (e.type === "keydown" ) {
            let keypress = e as React.KeyboardEvent;
            if (keypress.key !== 'Enter') {
                return;
            }            
        }
        
        if (isValidEmail(email) && message !== "") {
            dispatch(emailSupport({
                marketingSource: "Herdr Web Inquiry: Pricing Page Inquiry Form",
                email: email,
                message: message,
            }));
            setEmail("");
            setMessage("");
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    }

    return (
        <>
            <RedirectToDash />
            <Navigation />
            <div className="pageHeader" style={{ paddingBottom: "300px" }}>
                <div className="standardPublicPage60">
                    <div className="standardPublicParagraph" style={{ textAlign: "center" }}>
                        <h1 className="homePageHeader" style={{ textAlign: "center" }}>
                            Supercharge your sales. Start free.  
                        </h1> 
                        <div style={{ color: "#cacfd2"}}>
                            Give it a spin for 30-days with no restrictions.
                        </div>
                    </div>
                </div>
            </div>

            <div className="pricingPageTiersContainer">
                <PricingTiers 
                    mostPopularButtonBackgroundColor='#e55c02' 
                    mostPopularButtonColor='#fff'
                    mostPopularButtonBorder='3px solid #02152a' 
                    page="pricing"
                />
            </div>

            <div style={{ width: "75%", margin: isMobile ? "30px auto": "60px auto" }}>
                <div style={{ margin: "0px auto", textAlign: "center", fontSize: "18px" }}>
                    <b>Get 20% off</b> any plan <b>with annual billing.</b> {!isMobile && <br/>}
                    <b>Your first 30 days are completely free - <u>no credit card required</u>.</b>{!isMobile && <br/>}
                    Try every feature of the Basic plan, and only pay if you upgrade after your trial.
                </div>

                <div>
                    <h2 style={{ margin: "60px auto 0px auto", fontSize: "40px", fontWeight: "700" }}>
                        Amp it up with addons
                    </h2>
                    <div style={{ color: "#6B6A6A", fontSize: "24px", fontWeight: "460", marginBottom: "30px", marginTop: "15px", textAlign: "left" }}>
                        Add-ons are extra features you can purchase at the account level. Visit 
                        the Billing tab for pricing and activation details.
                    </div>
                </div>

                <div style={{
                    ...(!isMobile
                    ? { display: "flex", gap: "20px" }
                    : {})
                }}>

                    <div
                        style={{
                            width: isMobile ? "100%" : "50%",
                            marginBottom: isMobile ? "30px" :"0px",
                            background: "#fff",
                            borderRadius: "18px",
                            padding: "22px",
                            display: "flex",
                            gap: "16px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                            border: "1px solid #f0f0f0",
                        }}
                        >
                        <div
                            style={{
                            minWidth: "50px",
                            height: "50px",
                            borderRadius: "14px",
                            background:
                                "linear-gradient(135deg, rgba(88,101,242,0.12), rgba(88,101,242,0.03))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid rgba(88,101,242,0.4)",
                            }}
                        >
                            <IoCodeSlashOutline size={26} color="#5865F2" />
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "16px", fontWeight: 700, color: "#111" }}>
                            API Access
                            </div>
                            <div style={{ fontSize: "14px", lineHeight: 1.5, color: "#4B5563" }}>
                                Build custom integrations and reporting by tapping directly into your SalesDoing data. 
                                If your team can imagine it, they can build it.
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            width: isMobile ? "100%" : "50%",
                            background: "#fff",
                            borderRadius: "18px",
                            padding: "22px",
                            display: "flex",
                            gap: "16px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                            border: "1px solid #f0f0f0",
                        }}
                        >
                        <div
                            style={{
                            minWidth: "50px",
                            height: "50px",
                            borderRadius: "14px",
                            background:
                                "linear-gradient(135deg, rgba(88,101,242,0.12), rgba(88,101,242,0.03))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid rgba(88,101,242,0.4)",
                            }}
                        >
                            <IoBulbOutline size={26} color="#5865F2" />
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "16px", fontWeight: 700, color: "#111" }}>
                            AI Data Insights
                            </div>

                            <div
                            style={{
                                fontSize: "14px",
                                lineHeight: 1.5,
                                color: "#4B5563",
                            }}
                            >
                                Take your reporting and analytics to the next level with
                                AI-driven insights. This add-on proactively surfaces opportunities
                                in your sales activity, helps you optimize time and revenue, and
                                lets you get answers simply by asking SalesDoing.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Pricing;