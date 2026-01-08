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
import { emailSales } from '../../Store/Utility';

/*
interface Feedback {
    answers: Record<string, boolean>;
    otherText?: string;
}
*/
function Contact() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(getUser);

    const [email, setEmail] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const [error, setError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    
    const isMobile = useIsMobile();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (user.accessToken !== "" && user.status !== "loading"){
            navigate('/dash');
        }
    }, [user]);

    const submitForm = () => {
        // reset flags
        setError(false);
        setSuccess(false);

        const trimmedFirst = firstName.trim();
        const trimmedLast = lastName.trim();
        const trimmedEmail = email.trim();
        const trimmedMessage = message.trim();

        // validate required fields + email
        if (
            !trimmedFirst ||
            !trimmedLast ||
            !trimmedEmail ||
            !trimmedMessage ||
            !isValidEmail(trimmedEmail)
        ) {
            setError(true);
            setTimeout(() => setError(false), 2000);
            return;
        }

        dispatch(emailSales({
            firstName: firstName,
            lastName: lastName,
            email: email,
            message: message
        }));

        setFirstName("");
        setLastName("");
        setEmail("");
        setMessage("");

        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
    };

    return (
    <>
        <RedirectToDash />
        <Navigation />

        <div className="main-container" style={{ width: isMobile ? "80%" : "70%" }}>

            <h1 style={{ fontWeight: "bold", fontSize: isMobile ? "50px" : "60px", margin: " 0px auto 60px auto", letterSpacing: "-1px", textAlign: "center" }}>
                Get in touch with us
            </h1>

            <div style={{ display: "flex", flexWrap: "wrap",  gap: "10%" }}>
                <div style={{ flex: "0 0 45%", minWidth: "300px", order: 1 }}>
                    <h2 style={{ fontWeight: "bold", fontSize: "30px", marginBottom: "30px", letterSpacing: "-1px" }}>
                        Contact us about SalesDoing.
                    </h2>

                    <div style={{ color: "#6B6A6A", fontSize: "24px", fontWeight: "460", marginBottom: "30px" }}>
                        Strengthen your role as a trusted advisor and increase your revenue as a SalesDoing partner. 
                    </div>

                    <div style={{ margin: isMobile ? "0px auto" : "unset", textAlign: isMobile ? "center" : "unset" }}>

                        {error &&
                            <div className="error" style={{ marginBottom: "10px" }}>
                                Please complete all fields with a valid email address.
                            </div>
                        }
                        {success &&
                            <div className="success" style={{ marginBottom: "10px" }}>
                                Thanks for reaching out! We'll get back to you shortly.
                            </div>
                        }

                        <div style={{ display: "flex", gap: "10%", marginBottom: "10px" }}>
                            <div style={{ flex: "0 0 45%" }}>
                                <input type="input" placeholder="First Name*" className="form-control"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.currentTarget.value)} />
                            </div>
                            <div style={{ flex: "0 0 45%" }}>
                                <input type="input" placeholder="Last Name*" className="form-control"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.currentTarget.value)} />
                            </div>
                        </div>

                        <div style={{ marginBottom: "10px" }}>
                            <input type="input" placeholder="Email*" className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}/>
                        </div>

                        <div style={{ marginBottom: "30px" }}>
                            <textarea rows={3} placeholder="Message*" className="form-control"
                                value={message}
                                onChange={(e) => setMessage(e.currentTarget.value)} />
                        </div>

                        <div className="cta-orange-outline"
                            onClick={() => submitForm()}>
                            SUBMIT
                        </div>
                    </div>
                </div>

                <div style={{ flex: "0 0 45%", minWidth: "300px", position: "relative", order: 2, marginBottom: isMobile ? "30px" : "0px" }}>
                    <h2 style={{ fontWeight: "bold", fontSize: "30px", marginBottom: "30px", letterSpacing: "-1px" }}>
                        Use Live Chat for immediate assistance.
                    </h2>
                    <div style={{ color: "#6B6A6A", fontSize: "24px", fontWeight: "460", marginBottom: "30px" }}>
                        Click the chat bubble in the <b>bottom-right corner</b> of pages on the website and app.
                    </div>
                    <div style={{ color: "#6B6A6A", fontSize: "24px", fontWeight: "460", marginBottom: "30px", fontStyle: "italic" }}>
                        Coming soon...
                    </div>
                </div>
            </div>
             
        </div>

        <Footer style={{ position: "relative" }} />
    </>
    );
}

export default Contact;