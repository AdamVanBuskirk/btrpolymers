import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../Core/hooks';
import { getUser, login, socialLogin, activateUser, resendActivationLink } from '../../Store/Auth';
import { isValidEmail } from '../../Helpers/isValidEmail';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import GoogleSSO from '../../Components/GoogleSso';
import { decodeToken } from '../../Helpers/DecodeToken';
import RedirectToDash from '../../Components/RedirectToDash';
import { getDevice } from '../../Helpers/getDevice';
import { getCompany, getCompanyPublic } from '../../Store/Company';
import { PublicClientApplication } from '@azure/msal-browser';
import SalesDoingHero from '../../Components/Controls/SalesDoingHero';

function Login() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(getUser);
    const companyState = useAppSelector(getCompany);
    const {company, link } = useParams();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [loginSubmitted, setLoginSubmitted] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [queryParams] = useSearchParams();
    const [projectName, setProjectName] = useState<string>(""); 
    
    useEffect(() => {
        if (company && link) {
            dispatch(getCompanyPublic({ companyId: company, link: link }));
        }
    }, []);

    useEffect(() => {
        if (queryParams.get('ac')) {
            let code = queryParams.get('ac');
            if (code !== null) {
                dispatch(activateUser(code));
                setSuccess(true);
                setSuccessMessage("Your account has been activated. You can now login.")
                setTimeout(() => {
                    setSuccess(false);
                    setSuccessMessage("");
                }, 5000);
            }
        }
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (loginSubmitted) {
            if (user.accessToken !== "" && user.status !== "loading"){
                navigate('/dash');
            } else if (user.status === "failed") {
                if (user.errorMessage !== "Your account needs activated."){
                    setError(true);
                    showError(user.errorMessage);
                    setLoginSubmitted(false);
                }
            }
        }
    }, [user.status]);

    const showError = (error: string) => {
        setError(true);
        setErrorMessage(error);
        setLoginSubmitted(false);
        setTimeout(() => setError(false), 2000);
    }

    const toggleShowPassword = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const handleLogin = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {
        
        e.preventDefault();

        if (e.type === "keydown" ) {
            let keypress = e as React.KeyboardEvent;
            if (keypress.key !== 'Enter') {
                return;
            }            
        }

        if (!isValidEmail(email)) {
            showError("Please enter a valid email address");
        } else if(password === "") {
            showError("Please enter all fields");
        } else {
            setLoginSubmitted(true);
            dispatch(login({
                email: email.toLowerCase(),
                password: password,
                companyId: company,
                link: link,
                device: getDevice()
            }));
        }
    }

    const resendActivation = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (email !== "") {
            dispatch(resendActivationLink(email));
            setSuccess(true);
            setSuccessMessage("Your activation code has been resent");
            setTimeout(() => {
                setSuccess(false);
                setSuccessMessage("");
            }, 2000);

        } else {
            showError("Enter your email so we can send the activation link");
        }
    }

    function processGoogleLogin(response: google.accounts.id.CredentialResponse){
        const payload = decodeToken(response.credential as string);
        if (payload) {
            setLoginSubmitted(true);
            dispatch(socialLogin({ 
                email: payload.email, 
                firstName: payload.given_name, 
                lastName: payload.family_name, 
                platform: "google",
                method: "login",
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

    async function processAzureLogin() {

        setLoginSubmitted(true);
        try {
            const response = await publicClientApplication.loginPopup({
                scopes: [
                    "openid",
                    "profile",
                    "email",
                    process.env.REACT_APP_AZURE_SCOPES!   // your API scope
                ],
                prompt: "select_account"
            });

            const claims = response.idTokenClaims as Record<string, any>;

            dispatch(socialLogin({ 
                email: claims.email, 
                firstName: "", 
                lastName: "", 
                platform: "microsoft",
                method: "login",
                token: response.idToken,
                //token: response.accessToken,
                picture: "",
                companyId: company,
                link: link,
                device: getDevice()
            }));


        }
        catch(err) {
            console.log(err);
            /* not logged in, throw error if want */
        }
    }

    let registerLink = "/register";
    if (company && link) {
        registerLink = "/register/" + company + "/" + link
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
                <h1 style={{ fontSize: "24pt", textAlign: "center", paddingTop: "10px" }}>
                    Sign-in with
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
                    {success &&
                        <div className="success" style={{ marginTop: "10px" }}>
                            {successMessage}
                        </div>
                    }
                    {error &&
                        <div className="error" style={{ marginTop: "10px" }}>
                            {errorMessage}
                        </div>
                    }
                    {user.errorMessage === "Your account needs activated." &&
                        <div className="error" style={{ marginTop: "10px" }}>
                            Your account needs activated. Click <Link to="" onClick={(e) => resendActivation(e)}>here</Link> to resend your activation code to your email
                        </div>                   
                    }

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
                    <div style={{ marginTop: "10px", textAlign: "right" }}>
                        <Link to="/forgot" className="blackLink forgotPasswordLink" >
                            Forgot password?
                        </Link>
                    </div>
                    <button className="cta-orange-button" style={{ width: "100%", marginTop: "10px" }}
                        onClick={(e) => handleLogin(e)} onKeyDown={(e) => handleLogin(e)}>
                        Sign-in
                    </button>
                    <div className="loginPageSignup">
                        Don't have an account?&nbsp;
                        <Link to={registerLink} className="blackLink">
                            Sign Up
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

export default Login;