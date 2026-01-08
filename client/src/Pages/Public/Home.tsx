import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
//import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '../../Core/hooks';
import { getUser, login, setLoggingIn } from '../../Store/Auth';
import Footer from '../../Components/Footer';
import Navigation from '../../Components/Navigation';
//import Registration from '../../Modals/Registration';
//import Login from '../../Modals/Login';
import PricingTiers from '../../Components/PricingTiers';
import { isValidEmail } from '../../Helpers/isValidEmail';
import { HiArrowLongRight } from "react-icons/hi2";
import RedirectToDash from '../../Components/RedirectToDash';
import { useIsMobile } from '../../Core/hooks';
import { RxCalendar, RxLightningBolt } from 'react-icons/rx';
import { IoAnalytics, IoListSharp, IoPeople } from 'react-icons/io5';
import { MdAutoStories } from 'react-icons/md';
import { BiConversation } from 'react-icons/bi';

/*
interface Feedback {
    answers: Record<string, boolean>;
    otherText?: string;
}
*/
function Home() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(getUser);
    const [email, setEmail] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [feedback, setFeedback] = useState("");
    
    const [answers, setAnswers] = useState<Record<string, boolean>>({});
    const isMobile = useIsMobile();



    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (user.accessToken !== "" && user.status !== "loading"){
            navigate('/dash');
        }
    }, [user]);

    const handleCheckboxChange = (point: string) => {
        setAnswers((prev) => ({
          ...prev,
          [point]: !prev[point],
        }));
      };

    return (
    <>
        <RedirectToDash />
        <Navigation />

        <div className="main-container">
            <div style={{ display: "flex", flexWrap: "wrap",  gap: "0px" }}>
                <div style={{ flex: "0 0 40%", minWidth: "300px", order: 1 }}>
                    <h1 style={{ fontWeight: "bold", fontSize: isMobile ? "50px" : "60px", marginBottom: "30px", letterSpacing: "-1px" }}>
                        Put Outgrow into overdrive
                    </h1>

                    <div style={{ color: "#6B6A6A", fontSize: "24px", fontWeight: "460", marginBottom: "30px" }}>
                        Bring your Team, Proactive Customer Communications, Sales Activities,
                        Analytics, and Meetings together in one platform designed to help
                        Outgrow-run companies execute with clarity and speed.
                    </div>

                    <div style={{ margin: isMobile ? "0px auto" : "unset", textAlign: isMobile ? "center" : "unset" }}>
                        <div className="cta-orange-outline"
                            style={{ marginRight: isMobile ? "0px" : "20px", marginBottom: isMobile ? "20px" : "unset" }}
                            onClick={(e) => {
                            e.preventDefault();
                                navigate("/register");
                            }}>
                            START FOR FREE
                        </div>

                        <div className="cta-black-outline"
                            style={{ marginBottom: isMobile ? "60px" : "unset" }}
                            onClick={(e) => {
                            e.preventDefault();
                                navigate("");
                            }}>
                            LEARN MORE
                        </div>
                    </div>
                </div>

                <div style={{ flex: "0 0 60%", minWidth: "300px", position: "relative", order: 2 }}>

                    <img src="images/desktop-mock-1227.gif"
                        style={{ width: "100%", display: "block" }} />

                    <img src="images/mobile-mock-1227.gif"
                        style={{
                            height: isMobile ? "180px" : "520px",
                            zIndex: 5,
                            maxWidth: "90%",
                            position: isMobile ? "relative" : "absolute",
                            top: isMobile ? "-205px" : "-30px",
                            right: isMobile ? "-160px" : "-10px",
                            marginTop: isMobile ? "20px" : "0",
                            marginBottom: isMobile ? "-200px" : "0"
                        }}
                    />
                </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap",  gap: "0px", marginTop: isMobile ? "80px" : "120px" }}>

                <div style={{ position: "relative", width: "300px", margin: "0 auto" }}>
  
                    {/* Main Image */}
                    <img 
                        src="/images/powereby.png"
                        style={{ width: "250px", display: "block", margin: "0 auto" }}
                    />

                    {/* ICON 1 — top-left */}
                    <div style={{
                        position: "absolute",
                        top: "-35px",
                        left: "50px",
                        background: "#fff",
                        borderRadius: "50%",
                        width: "75px",
                        height: "75px",
                        border: "3px solid #000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <RxLightningBolt size={40} />
                    </div>

                    {/* ICON 2 — top-right */}
                    <div style={{
                        position: "absolute",
                        top: "-32px",
                        right: "50px",
                        background: "#fff",
                        borderRadius: "50%",
                        width: "75px",
                        height: "75px",
                        border: "3px solid #000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <IoAnalytics size={40} />
                    </div>

                    {/* ICON 3 — right middle */}
                    <div style={{
                        position: "absolute",
                        top: "60px",
                        right: "-20px",
                        background: "#fff",
                        borderRadius: "50%",
                        width: "75px",
                        height: "75px",
                        border: "3px solid #000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <MdAutoStories size={40} />
                    </div>

                    {/* ICON 4 — bottom-right */}
                    <div style={{
                        position: "absolute",
                        bottom: "5px",
                        right: "5px",
                        background: "#fff",
                        borderRadius: "50%",
                        width: "75px",
                        height: "75px",
                        border: "3px solid #000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <RxCalendar size={40} />
                    </div>

                    {/* ICON 5 — bottom-left */}
                    <div style={{
                        position: "absolute",
                        bottom: "5px",
                        left: "5px",
                        background: "#fff",
                        borderRadius: "50%",
                        width: "75px",
                        height: "75px",
                        border: "3px solid #000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <IoListSharp size={40} />
                    </div>

                    {/* ICON 6 — left-middle */}
                    <div style={{
                        position: "absolute",
                        top: "60px",
                        left: "-20px",
                        background: "#fff",
                        borderRadius: "50%",
                        width: "75px",
                        height: "75px",
                        border: "3px solid #000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <BiConversation size={40} />
                    </div>

                    {/* ICON 7 — bottom center */}
                    <div style={{
                        position: "absolute",
                        bottom: "-45px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#fff",
                        borderRadius: "50%",
                        width: "75px",
                        height: "75px",
                        border: "3px solid #000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <IoPeople size={40} />
                    </div>

                </div>

                <div style={{ flex: "0 0 70%", minWidth: "300px", order: 1 }}>
                    <h2 style={{ fontWeight: "bold", fontSize: isMobile ? "40px" : "50px", marginBottom: "30px", letterSpacing: "-1px",
                        marginTop: isMobile ? "100px" : "0px" }}>
                            The most comprehensive software for Outgrow
                    </h2>
                    <div style={{ color: "#6B6A6A", fontSize: "24px", fontWeight: "460", marginBottom: "30px" }}>
                        Started in 2025, SalesDoing is helping teams and organizations get maximum value 
                        from the Run Outgrow Sales System with our Outgrow-specific platform.
                    </div>
                </div>
            </div> 
        </div>

        <Footer style={{ position: "relative" }} />
    </>
    );
}

export default Home;