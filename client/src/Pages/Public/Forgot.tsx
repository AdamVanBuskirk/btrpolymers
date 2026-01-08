import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../Core/hooks';
import { getUser, sendRecoveryLink } from '../../Store/Auth';
import { isValidEmail } from '../../Helpers/isValidEmail';
import RedirectToDash from '../../Components/RedirectToDash';
import SalesDoingHero from '../../Components/Controls/SalesDoingHero';

function Forgot() {

    const dispatch = useAppDispatch();
    const user = useAppSelector(getUser);
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (formSubmitted) {
            if (user.status === "idle"){
                setSuccessMessage("A recovery link has been sent to your email");
                setSuccess(true);
                setTimeout(() => setSuccess(false), 2000);
                setFormSubmitted(false);
                setEmail("");
            } else if (user.status === "failed") {
                setError(true);
                showError(user.errorMessage);
                setFormSubmitted(false);
            }
        }
    }, [user.status]);

    const showError = (error: string) => {
        setError(true);
        setErrorMessage(error);
        setFormSubmitted(false);
        setTimeout(() => setError(false), 2000);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleSendRecoveryLink = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
        
        e.preventDefault();

        if (e.type === "keydown" ) {
            let keypress = e as React.KeyboardEvent;
            if (keypress.key !== 'Enter') {
                return;
            }            
        }

        if (!isValidEmail(email)) {
            showError("Please enter a valid email");
        } else {
            setFormSubmitted(true);
            dispatch(sendRecoveryLink(email));
        }
    }

    return (
    <>
    <RedirectToDash />
    <div style={{ display: "flex", alignItems: "top", height: "100vh", width: "100%" }}>
        <div className="loginPageLeft">
            <div style={{ width: "100%" }}>
                <div className="mobileOnlyLogo">
                    <Link to="/" className="text-white fw-bold">
                        <div style={{ margin: "0px auto", textAlign: "center" }}>
                            <img className="logoCat" src="/images/sales-doing-logo.jpg" alt="SalesDoing Logo" style={{
                                width: "300px"
                            }} />
                        </div>
                    </Link>
                </div>
                <h1 style={{ fontSize: "24pt", textAlign: "center", paddingTop: "20px" }}>
                    Can't Sign-in?
                </h1>
                <div style={{ width: "80%", margin: "16px auto 0px auto", textAlign: "center" }}>
                    We'll send a recovery link to
                </div>
                <div style={{ width: "80%", margin: "30px auto 0px auto" }}>
                    {error &&
                        <div className="error" style={{ marginTop: "10px" }}>
                            {errorMessage}
                        </div>
                    }
                    {success &&
                        <div className="success" style={{ marginTop: "10px" }}>
                            {successMessage}
                        </div>
                    }
                    <input type="input" style={{ marginTop: "10px" }} className="form-control" placeholder="Email Address" 
                        value={email}
                        onChange={(e) => handleEmailChange(e)} />
   
                    <button className="orangeButton" style={{ width: "100%", marginTop: "10px" }}
                        onClick={(e) => handleSendRecoveryLink(e)} onKeyDown={(e) => handleSendRecoveryLink(e)}>
                        Send Recovery Link
                    </button>
                    <div style={{ marginTop: "10px", textAlign: "left", fontWeight: "400", fontSize: "11pt" }}>
                        <Link to="/login" className="blackLink">
                            Return to sign-in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        <SalesDoingHero />
    </div>
    </>
    );
}

export default Forgot;