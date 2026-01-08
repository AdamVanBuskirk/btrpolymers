import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../Core/hooks';
import { getUser } from '../../Store/Auth';
import Footer from '../../Components/Footer';
import Navigation from '../../Components/Navigation';
import RedirectToDash from '../../Components/RedirectToDash';
import { useIsMobile } from '../../Core/hooks';

function Advisor() {

    const navigate = useNavigate();
    const user = useAppSelector(getUser);
    const isMobile = useIsMobile();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (user.accessToken !== "" && user.status !== "loading"){
            navigate('/dash');
        }
    }, [user]);

    return (
    <>
        <RedirectToDash />
        <Navigation />

        <div className="main-container">
            <div style={{ display: "flex", flexWrap: "wrap",  gap: "0px" }}>
                <div style={{ flex: "0 0 40%", minWidth: "300px", order: 1 }}>
                    <h1 style={{ fontWeight: "bold", fontSize: isMobile ? "50px" : "60px", marginBottom: "30px", letterSpacing: "-1px" }}>
                        The strategic partnership that fuels revenue growth
                    </h1>

                    <div style={{ color: "#6B6A6A", fontSize: "24px", fontWeight: "460", marginBottom: "30px" }}>
                        Strengthen your role as a trusted advisor and increase your revenue as a SalesDoing partner. 
                    </div>

                    <div style={{ margin: isMobile ? "0px auto" : "unset", textAlign: isMobile ? "center" : "unset" }}>
                        <div className="cta-orange-outline"
                            style={{ marginRight: isMobile ? "0px" : "20px", marginBottom: isMobile ? "20px" : "unset" }}
                            onClick={(e) => {
                            e.preventDefault();
                                //navigate("/register");
                            }}>
                            HOW IT WORKS
                        </div>

                        <div className="cta-black-outline"
                            style={{ marginBottom: isMobile ? "60px" : "unset" }}
                            onClick={(e) => {
                            e.preventDefault();
                                //navigate("");
                            }}>
                            TESTIMONIALS
                        </div>
                    </div>
                </div>

                <div style={{ flex: "0 0 60%", minWidth: "300px", position: "relative", order: 2 }}>
                    <img src="images/advisor-stock-2.jpg"
                        style={{ width: "100%", display: "block" }} />
                </div>
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap",  gap: "60px", marginTop: isMobile ? "80px" : "120px" }}>

                <div style={{ flex: "50% 0 0", minWidth: "300px", order: 1 }}>
                    <div style={{ position: "relative" }}>
                        <img src="images/laptop-wireframe-01.png"
                            style={{ width: "100%", display: "block" }} />

                        <img src="images/mobile-wireframe-01.png"
                            style={{
                                height: isMobile ? "180px" : "450px",
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
                <div style={{ flex: "0 0 40%", minWidth: "300px", order: 1 }}>
                    <h2 style={{ fontWeight: "bold", fontSize: isMobile ? "30px" : "40px", marginBottom: "30px", letterSpacing: "-1px" }}>
                            Earn more by helping companies execute better with SalesDoing
                    </h2>
                    <div style={{ color: "#6B6A6A", fontSize: "20px", fontWeight: "460", marginBottom: "30px" }}>
                        Great advisors know strategy often isn't the problem - execution is. SalesDoing gives you a powerful 
                        platform you can confidently recommend to help Outgrow run businesses turn proactive communications 
                        into measurable growth.
                    </div>
                    <div style={{ color: "#6B6A6A", fontSize: "20px", fontWeight: "460", marginBottom: "30px" }}>
                        With SalesDoing, teams get real-time visibility into activity, accountability, and progress 
                        toward revenue targets. You get a solution that reinforces everything required to drive results: 
                        daily actions, analytics, coaching tools, and performance insights.
                    </div>
                    <div style={{ color: "#6B6A6A", fontSize: "20px", fontWeight: "460", marginBottom: "30px" }}>
                        Whether you're an advisor, consultant, or peer group leader, SalesDoing helps you deliver more value, 
                        expand your impact, and unlock a new revenue stream by empowering businesses to execute the Outgrow 
                        framework more effectively.
                    </div>
                </div>
            </div>
        
        </div>

        <Footer style={{ position: "relative" }} />
    </>
    );
}

export default Advisor;