import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../Core/hooks';
import Footer from '../../Components/Footer';
import Navigation from '../../Components/Navigation';
import { useIsMobile } from '../../Core/hooks';

/*
interface Feedback {
    answers: Record<string, boolean>;
    otherText?: string;
}
*/
function About() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();


    const [email, setEmail] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    
    const isMobile = useIsMobile();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
    <>
        <Navigation />

        <div className="main-container" style={{ width: isMobile ? "80%" : "70%" }}>

            <h1 style={{ fontWeight: "bold", fontSize: isMobile ? "50px" : "60px", margin: " 0px auto 60px auto", letterSpacing: "-1px", textAlign: "center" }}>
                What is SalesDoing?
            </h1>

            <div style={{ color: "#6B6A6A", fontSize: "24px", fontWeight: "460", marginBottom: "30px" }}>
                SalesDoing.com is an innovative, cloud-based platform that helps sales teams focus, align, and thrive. 
                Whether you heard about SalesDoing online, from a friend, or from your Outgrow advisor, here's what 
                you need to know about our proactive sales growth platform - including where we came from and 
                where we can help you go.
            </div>

            <h2 style={{ fontWeight: "bold", fontSize: "30px", marginBottom: "30px", letterSpacing: "-1px" }}>
                Meet Our Team
            </h2>
            <div style={{ color: "#6B6A6A", fontSize: "24px", fontWeight: "460", marginBottom: "30px" }}>
                We are a team of entrepreneurs, technologists and visionaries that align on our mission to make sales 
                teams more productive, aligned, and successful.
            </div>

            <div style={{ fontSize: "22px", fontWeight: "460", marginBottom: "30px" }}>
                <div style={{ display: "flex", flexWrap: "wrap",  gap: "10%", justifyContent: "center", paddingTop: "30px" }}>
                    {/*
                    <div style={{ textAlign: "center", marginBottom: isMobile ? "30px" : "0px" }}>
                        <div style={{ marginBottom: "20px" }}><img src='/images/mari.jpeg' style={{ width: "250px", borderRadius: "50%" }} /></div>
                        <div style={{ marginBottom: "5px", fontWeight: "bold"}}>Mari Tautimes</div>
                        <div style={{ fontSize: "20px" }}>Visionary</div>
                        <div>
                            <a href="https://www.linkedin.com/in/maritautimes/" style={{ fontSize: "16px", color: "#0096FF", textDecoration: "none" }}>
                                LinkedIn
                            </a>
                        </div> 
                    </div>
                    */}
                    <div style={{ textAlign: "center" }}>
                        <div style={{ marginBottom: "20px" }}><img src='/images/adam.jpeg' style={{ width: "250px", borderRadius: "50%" }} /></div>
                        <div style={{ marginBottom: "5px", fontWeight: "bold"}}>Adam VanBuskirk</div>
                        <div style={{ fontSize: "20px" }}>Founder, CTO</div>
                        <div >
                            <a href="https://www.linkedin.com/in/adam-vanbuskirk-28b93136/" style={{ fontSize: "16px", color: "#0096FF", textDecoration: "none" }}>
                                LinkedIn
                            </a>
                        </div>
                        
                    </div>
                </div>
            </div>
             
        </div>

        <Footer style={{ position: "relative" }} />
    </>
    );
}

export default About;