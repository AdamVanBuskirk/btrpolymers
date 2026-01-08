import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../Core/hooks';
import { getUser, register, socialLogin } from '../../Store/Auth';
import { isValidEmail } from '../../Helpers/isValidEmail';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import GoogleSSO from '../../Components/GoogleSso';
import { decodeToken } from '../../Helpers/DecodeToken';
import RedirectToDash from '../../Components/RedirectToDash';
import { getDevice } from '../../Helpers/getDevice';
import { getCompany, getCompanyPublic } from '../../Store/Company';
import { handleLoadComponent } from '../../Helpers/handleLoadComponent';
import { getSettings, loadSubComponent } from '../../Store/Settings';
import { AuthenticationResult, PopupRequest, PublicClientApplication } from '@azure/msal-browser';
import SalesDoingHero from '../../Components/Controls/SalesDoingHero';

const loginRequest: PopupRequest = {
    scopes: ["openid", "profile", "email"]  // plus your API scopes
};


const publicClientApplication = new PublicClientApplication({
    auth: {
        clientId: process.env.REACT_APP_AZURE_APP_ID!,
        redirectUri: process.env.REACT_APP_AZURE_REDIRECT_URL,
        authority: process.env.REACT_APP_AZURE_AUTHORITY,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: true
    }
});


function Register() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {company, link } = useParams(); /* for invites */
    const [email, setEmail] = useState("");
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [password, setPassword] = useState("");
    const user = useAppSelector(getUser);
    const companyState = useAppSelector(getCompany);
    const settingsState = useAppSelector(getSettings);
    const [error, setError] = useState<boolean>(false);
    const [registrationSubmitted, setRegistrationSubmitted] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [projectName, setProjectName] = useState<string>("");

    
    useEffect(() => {
        if (company && link) {
            dispatch(getCompanyPublic({ companyId: company, link: link }));
        }
    }, []);
        
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (registrationSubmitted) {
            if (user.accessToken !== "" && user.status === "idle"){
                navigate('/dash');
            } else if (user.accessToken === "" && user.status === "idle") {
                /* Stand alone registration, activation needed */
            } else if (user.status === "failed") {
                setError(true);
                showError(user.errorMessage);
                setRegistrationSubmitted(false);
            }
        }
    }, [user.status]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    }

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    }

    function processGoogleLogin(response: google.accounts.id.CredentialResponse){
        const payload = decodeToken(response.credential as string);
        if (payload) {
            setRegistrationSubmitted(true);
            dispatch(socialLogin({ 
                email: payload.email, 
                firstName: payload.given_name,
                lastName: payload.family_name, 
                platform: "google",
                method: "registration",
                token: response.credential,
                picture: payload.picture,
                companyId: company,
                link: link,
                device: getDevice()
            }));
        } else {
            showError("Social login failed");
        }
    }

    async function processAzureLogin() {
        try {
            const response: AuthenticationResult =
                await publicClientApplication.loginPopup(loginRequest);

            const payload: any = response.idTokenClaims;

            setRegistrationSubmitted(true);

            dispatch(socialLogin({
                email: payload.email,
                firstName: payload.given_name || payload.name?.split(" ")[0] || "",
                lastName: payload.family_name || payload.name?.split(" ").slice(1).join(" ") || "",
                platform: "microsoft",
                method: "registration",
                token: response.idToken,          // Microsoft ID token
                picture: payload.picture || null, // usually null unless you later call Graph
                companyId: company,
                link: link,
                device: getDevice()
            }));
        } catch (err) {
            console.error("Microsoft login failed", err);
            showError("Microsoft login failed");
        }
    }

    const handleRegistration = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
        
        e.preventDefault();

        if (e.type === "keydown" ) {
            let keypress = e as React.KeyboardEvent;
            if (keypress.key !== 'Enter') {
                return;
            }            
        }

        if (!isValidEmail(email)) {
            showError("Please enter a valid email address");
        } else if(password === "" || firstName === "" || lastName === "") {
            showError("Please enter all fields");
        } else {
            setRegistrationSubmitted(true);
            dispatch(register({
                email: email.toLowerCase(),
                password: password,
                firstName: firstName,
                lastName: lastName,
                companyId: company,
                link: link,
                device: getDevice()
            }));
        }
    }

    const showError = (error: string) => {
        setError(true);
        setErrorMessage(error);
        setRegistrationSubmitted(false);
        setTimeout(() => setError(false), 2000);
    }

    const toggleShowPassword = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    }

    let loginLink = "/login";
    if (company && link) {
        loginLink = "/login/" + company + "/" + link
    }

    return (
    <>
    {!company && !link &&
        <RedirectToDash />
    }
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
                {registrationSubmitted && user.status === "idle" && user.accessToken === "" ?
                    <div className="registration-success">
                        <strong>Thank you for registering</strong><br/><br/>
                        <p>
                        Please check your email for an account activation
                        link. You can close this window, click the link in your email, and you're all set to login.
                        </p>
                    </div>
                :
                <>
                    <h1 style={{ fontSize: "24pt", textAlign: "center", paddingTop: "10px" }}>
                        Sign-up with
                    </h1>

                    {companyState.inviteCompany && link &&
                        <div style={{ width: "80%", margin: "16px auto 0px auto" }}>
                            <div style={{ marginTop: "10px", textAlign: "center" }}>
                                {companyState.inviteCompany.logo &&
                                    <div style={{ marginBottom: "10px" }}>
                                        <img src={companyState.inviteCompany.logo} style={{ width: "75px" }} />
                                    </div>
                                }
                                <b>{companyState.inviteCompany.name}</b>
                            </div>
                        </div>
                    }

                    <div style={{ width: "80%", margin: "30px auto 0px auto" }}>
                        <GoogleSSO buttonText="signin_with" loginHandler={processGoogleLogin} />
                        <div id="azureLoginDiv" style={{ margin: "10px auto 0px auto", textAlign: "center" }}>
                            <img src='/images/azure-button.png' className="azureButton"
                                onClick={() => processAzureLogin()} style={{ width: "50%", cursor: "pointer" }} />
                        </div>
                        <div className="mt-2 text-center">
                            OR
                        </div>
                    </div>
                    <div style={{ width: "80%", margin: "16px auto 0px auto" }}>
                        {error &&
                            <div className="error" style={{ marginTop: "10px" }}>
                                {errorMessage}
                            </div>
                        }
                        <input type="input" style={{ marginTop: "10px" }} className="form-control" placeholder="First Name" 
                            value={firstName}
                            onChange={(e) => handleFirstNameChange(e)} />
                        <input type="input" style={{ marginTop: "10px" }} className="form-control" placeholder="Last Name" 
                            value={lastName}
                            onChange={(e) => handleLastNameChange(e)} />
                        <input type="input" style={{ marginTop: "10px" }} className="form-control" placeholder="Email Address" 
                            value={email}
                            onChange={(e) => handleEmailChange(e)} />
                        {!showPassword ?
                            <input type="password" style={{ marginTop: "10px" }} className="form-control" placeholder="Password"
                                value={password}
                                onChange={(e) => handlePasswordChange(e)} />
                        :
                            <input type="input" style={{ marginTop: "10px" }} className="form-control" placeholder="Password"
                                value={password}
                                onChange={(e) => handlePasswordChange(e)} />
                        }    
                        <div onClick={(e) => toggleShowPassword(e)} style={{
                            float: "right", position: "relative", top: "-32px", left: "-15px",
                            textAlign: "right", width: "20px"
                        }}>
                            {!showPassword ?
                                <IoEyeOutline color="gray" size={18} />
                            :
                                <IoEyeOffOutline color="gray" size={18} />
                            }
                        </div>
                        <button className="orangeButton" style={{ width: "100%", marginTop: "10px" }}
                            onClick={(e) => handleRegistration(e)} onKeyDown={(e) => handleRegistration(e)}>
                            {companyState.inviteCompany && link ? "Sign-up" : "Sign-up for free" }
                        </button>
                        <div className="loginPageSignup">
                            Already have an account?&nbsp;
                            <Link to={loginLink} className="blackLink">
                                Sign-in
                            </Link>
                        </div>
                    </div>
                </>
                }
            </div>
        </div>
        <SalesDoingHero />
    </div>
    </>
    );
}

export default Register;