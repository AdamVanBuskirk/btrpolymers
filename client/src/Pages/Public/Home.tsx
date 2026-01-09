import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../Core/hooks';
import Footer from '../../Components/Footer';
import Navigation from '../../Components/Navigation';
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


    const handleCheckboxChange = (point: string) => {
        setAnswers((prev) => ({
          ...prev,
          [point]: !prev[point],
        }));
      };

    return (
    <>
        <Navigation />

        <div className="main-container">
            <h1 style={{ fontWeight: "bold", fontSize: isMobile ? "50px" : "60px", margin: "30px auto", letterSpacing: "-1px", textAlign: "center" }}>
                Let's go!
            </h1>
            {/*
            <div style={{ display: "flex", flexWrap: "wrap",  gap: "0px" }}>
                <div style={{ flex: "0 0 40%", minWidth: "300px", order: 1 }}>
                    <h1 style={{ fontWeight: "bold", fontSize: isMobile ? "50px" : "60px", marginBottom: "30px", letterSpacing: "-1px" }}>
                        A Recycled Polymers Company
                    </h1>

                    <div style={{ color: "#6B6A6A", fontSize: "24px", fontWeight: "460", marginBottom: "30px" }}>
                        dsf dsa fdas fads fdas fadsljf dasj fjldas jfldaks fjlkadsj f;asdj f;adsj f;asd f
                        dsfj nsdajk nfdlsan fdlsan fjlkdsanf ladsnf ldsan fldasn fjladsjn fladsn fdas
                         adsjnf sdkanf ;alds fnadf
                    </div>

                    <div style={{ margin: isMobile ? "0px auto" : "unset", textAlign: isMobile ? "center" : "unset" }}>
                        <div className="cta-orange-outline"
                            style={{ marginRight: isMobile ? "0px" : "20px", marginBottom: isMobile ? "20px" : "unset" }}
                            onClick={(e) => {
                            e.preventDefault();
                                navigate("/register");
                            }}>
                            CONTACT SALES
                        </div>

                        <div className="cta-black-outline"
                            style={{ marginBottom: isMobile ? "60px" : "unset" }}
                            onClick={(e) => {
                            e.preventDefault();
                                navigate("");
                            }}>
                            SEE OUR SERVICES
                        </div>
                    </div>
                </div>

                <div style={{ flex: "0 0 60%", minWidth: "300px", position: "relative", order: 2 }}>
                       
                    <img src="images/recycled-pellets.jpg"
                        style={{ width: "100%", display: "block" }} />
                 
                </div>  
            </div>

            <div style={{ display: "flex", flexWrap: "wrap",  gap: "0px", marginTop: isMobile ? "80px" : "120px" }}>

                <div style={{ position: "relative", width: "300px", margin: "0 auto" }}>
  
            
                    <img 
                        src="/images/semi.jpg"
                        style={{ width: "600px", display: "block", margin: "0 auto" }}
                    />

                </div>

                <div style={{ flex: "0 0 70%", minWidth: "300px", order: 1 }}>
                    <h2 style={{ fontWeight: "bold", fontSize: isMobile ? "40px" : "50px", marginBottom: "30px", letterSpacing: "-1px",
                        marginTop: isMobile ? "100px" : "0px" }}>
                            Tdfg dfgdf gdfg df gdf gdf df gdf g
                    </h2>
                    <div style={{ color: "#6B6A6A", fontSize: "24px", fontWeight: "460", marginBottom: "30px" }}>
                        F sfldk gjsfd;gjfs;dkl gs;fdk gj;fdls gj;sdf jg;fds jg;skdfl jgk;lfsd jg;sdkf jgf;sd kj
                         sdfjk glkfd jg;lfsd jg;kfsdj g;klsfdj g;klsfjd g;lsfjdg;lskdf
                          sfdjg jdfksl gljksdfjglsd glsdj g;
                    </div>
                </div>
            </div> 
                        */}
        </div>

        <Footer style={{ position: "relative" }} />
    </>
    );
}

export default Home;