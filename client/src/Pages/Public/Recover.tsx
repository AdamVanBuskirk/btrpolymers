import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../Core/hooks';
import { getUser, resetPassword } from '../../Store/Auth';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import RedirectToDash from '../../Components/RedirectToDash';
import SalesDoingHero from '../../Components/Controls/SalesDoingHero';

function Recover() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(getUser);
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
    const [password1, setPassword1] = useState<string>("");
    const [showPassword1, setShowPassword1] = useState<boolean>(false);
    const [password2, setPassword2] = useState<string>("");
    const [showPassword2, setShowPassword2] = useState<boolean>(false);
    const [queryParams] = useSearchParams();
    const [recoveryCode, setRecoveryCode] = useState<string | null>(null);    

    useEffect(() => {
        setRecoveryCode(queryParams.get('ar'));
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (formSubmitted) {
            if (user.status === "idle"){
                setSuccessMessage("Your password has been successfully changed. You will now be redirected to the login page.");
                setSuccess(true);
                setTimeout(() => navigate("/login"), 2000);
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

    const handlePassword1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword1(e.target.value);
    }

    const handlePassword2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword2(e.target.value);
    }

    const toggleShowPassword1 = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setShowPassword1(!showPassword1);
    }

    const toggleShowPassword2 = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setShowPassword2(!showPassword2);
    }

    const handleRecoverPassword = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>) => {

        e.preventDefault();

        if (e.type === "keydown" ) {
            let keypress = e as React.KeyboardEvent;
            if (keypress.key !== 'Enter') {
                return;
            }            
        }
        
        if (password1 !== password2 || password1 === "" || password2 === "") {
            showError("The passwords don't match");
        } else {
            if (recoveryCode) {
                setFormSubmitted(true);
                dispatch(resetPassword({password: password1, recoveryCode: recoveryCode}));
            }
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
                    Reset Your Password
                </h1>
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
                    {!showPassword1 ?
                        <input type="password" style={{ marginTop: "10px" }} className="form-control" placeholder="Password"
                            value={password1}
                            onChange={(e) => handlePassword1Change(e)} />
                    :
                        <input type="input" style={{ marginTop: "10px" }} className="form-control" placeholder="Password"
                            value={password1}
                            onChange={(e) => handlePassword1Change(e)} />
                    }  
                    <div onClick={(e) => toggleShowPassword1(e)} style={{
                        float: "right", position: "relative", top: "-32px", left: "-15px", marginBottom: "-12px",
                        textAlign: "right", width: "20px" }}>
                        {!showPassword1 ?
                            <IoEyeOutline color="gray" size={18} />
                        :
                            <IoEyeOffOutline color="gray" size={18} />
                        }
                    </div>

                    {!showPassword2 ?
                        <input type="password" className="form-control" placeholder="Password"
                            value={password2}
                            onChange={(e) => handlePassword2Change(e)} />
                    :
                        <input type="input" className="form-control" placeholder="Password"
                            value={password2}
                            onChange={(e) => handlePassword2Change(e)} />
                    } 

                    <div onClick={(e) => toggleShowPassword2(e)} style={{
                        float: "right", position: "relative", top: "-32px", left: "-15px",
                        textAlign: "right", width: "20px" }}>
                        {!showPassword2 ?
                            <IoEyeOutline color="gray" size={18} />
                        :
                            <IoEyeOffOutline color="gray" size={18} />
                        }
                    </div>
   
                    <button className="orangeButton" style={{ width: "100%", marginTop: "10px" }}
                        onClick={(e) => handleRecoverPassword(e)} onKeyDown={(e) => handleRecoverPassword(e)}>
                        Change Password
                    </button>
                </div>
            </div>
        </div>
        <SalesDoingHero />
    </div>
    </>
    );
}

export default Recover;