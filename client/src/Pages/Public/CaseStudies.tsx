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
function CaseStudies() {

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
                Case Studies
            </h1>

            <div style={{ margin: "0px auto" }}>
            
                <h2 style={{ fontWeight: "bold", fontSize: "30px", marginBottom: "30px", letterSpacing: "-1px" }}>
                    Real companies, real impact
                </h2>

                <div style={{ color: "#6B6A6A", fontSize: "24px", fontWeight: "460", marginBottom: "30px", fontStyle: "italic" }}>
                    As we roll out SalesDoing with early adopters, we'll add case studies here to highlight the platform's 
                    functionality and the real impact it delivers for real companies.
                </div>
            </div>
             
        </div>

        <Footer style={{ position: "relative" }} />
    </>
    );
}

export default CaseStudies;