import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../Core/hooks';
import Footer from '../../Components/Footer';
import Navigation from '../../Components/Navigation';
import { useIsMobile } from '../../Core/hooks';


function Contact() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();


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


/*
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
*/
    return (
    <>
        <Navigation />

        <div className="main-container" style={{ width: isMobile ? "80%" : "70%" }}>

            <h1 style={{ paddingTop: isMobile ? "60px" : "0px", fontWeight: "bold", 
                fontSize: isMobile ? "50px" : "60px", margin: " 0px auto 30px auto", 
                letterSpacing: "-1px", textAlign: "center" }}>
                Get in touch with us
            </h1>

            <div style={{ margin: "0px auto", textAlign: "center", width: isMobile ? "80%" : "50%" }}>
            

                    <div style={{ color: "#6B6A6A", fontSize: "24px", fontWeight: "460", marginBottom: "40px", textAlign: "left" }}>
                        Whether you're interested in joining our team or exploring how we can work together, 
                        we'd love to hear from you. Reach out and start the conversation.
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
                            onClick={() => alert("form submiited")}>
                            SUBMIT
                        </div>
                    </div>
      

            </div>
             
        </div>

        <Footer style={{ position: "relative" }} />
    </>
    );
}

export default Contact;