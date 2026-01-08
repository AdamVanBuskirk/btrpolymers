import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../Core/hooks'
import { CSSProperties } from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { getStripe } from '../Store/Stripe';

interface Props {
    mostPopularButtonBorder: string;   
    mostPopularButtonColor: string;
    mostPopularButtonBackgroundColor: string; 
    page: string;
}

function PricingTiers(props: Props) {

    const dispatch = useAppDispatch();
    const stripeState = useAppSelector(getStripe);
    let [starterEmail, setStarterEmail] = useState<string>("");
    let [essentialsEmail, setEssentialsEmail] = useState<string>("");
    let [teamsEmail, setTeamsEmail] = useState<string>("");
    const [starterError, setStarterError] = useState<boolean>(false);
    const [starterSuccess, setStarterSuccess] = useState<boolean>(false);
    const [essentialsError, setEssentialsError] = useState<boolean>(false);
    const [essentialsSuccess, setEssentialsSuccess] = useState<boolean>(false);
    const [teamsError, setTeamsError] = useState<boolean>(false);
    const [teamsSuccess, setTeamsSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    let mostPopularStyle: CSSProperties = {
        width: "70%", 
        backgroundColor: props.mostPopularButtonBackgroundColor, 
        padding: "15px", 
        borderRadius: "30px", 
        border: props.mostPopularButtonBorder, 
        color: props.mostPopularButtonColor, 
        fontWeight: "400", 
        fontSize: "14pt", 
        textAlign: "center"
    }

    const handleEmailChangeStarter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStarterEmail(e.target.value);
    }
    const handleEmailChangeEssentials = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEssentialsEmail(e.target.value);
    }
    const handleEmailChangeTeams = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTeamsEmail(e.target.value);
    }

    const handleRegister = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>, pricingPackage: string) => {
        //navigate("/register/" + pricingPackage + "/" + props.page);
        navigate("/register");
    }

    // Format Stripe price (assuming it's in cents)
    const formatPrice = (amount: number, currency: string = "USD") => {
        return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        }).format(amount); // Stripe usually returns cents
    };

    //console.log(stripeState);
    if (stripeState.plans.length === 0) {
        return <div>Loading...</div>
    } else {

        let plan1 = stripeState.plans.find(p => p.sort === 0);
        //let plan2 = stripeState.plans.find(p => p.sort === 1);
        //let plan3 = stripeState.plans.find(p => p.sort === 2);

        if (plan1) {
            return (
            <div className="pricingTierBox" style={{ justifyContent: "center" }}>

                <div className="pricingStarterBox"> 
                    <div style={{ width: "90%", margin: "0px auto" }}>
                        <div className="pricingStarterTitle">
                            Basic
                        </div>
                        <div style={{ textAlign: "left", marginLeft: "10px", marginTop: "10px", color: "#495866", fontWeight: "400" }}>
                            Ideal for teams not running Outgrow or those just starting out with the framework.
                        </div>
                        <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
                            <div style={{ textAlign: "left", marginLeft: "10px", fontSize: "32pt", fontWeight: "bold" }}>
                                $11.99
                            </div>
                            <div style={{ fontSize: ".8em", textAlign: "left", marginLeft: "10px", color: "#495866", fontWeight: "400" }}>
                                Per user, per month, billed monthly
                            </div>
                        </div>
                        <button className="blueButton" onClick={(e) => handleRegister(e, "starter")} onKeyDown={(e) => handleRegister(e, "starter")}>
                            Start for free
                        </button> 
                        <hr className="pricingDivider" />
                        <div style={{ textAlign: "left" }}>
                            <div style={{ marginBottom: "10px" }}>
                                <div style={{ display: "inline-block", marginRight: "10px" }}>
                                    <IoMdCheckmarkCircleOutline size={20} />
                                </div>
                                <div style={{ position: "relative", top: "2px", fontSize: "13pt", display: "inline-block" }}>
                                    Actions (90-day history)
                                </div>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <div style={{ display: "inline-block", marginRight: "10px" }}>
                                    <IoMdCheckmarkCircleOutline size={20} />
                                </div>
                                <div style={{ position: "relative", top: "2px", fontSize: "13pt", display: "inline-block" }}>
                                    Scorecard & Analytics
                                </div>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <div style={{ display: "inline-block", marginRight: "10px" }}>
                                    <IoMdCheckmarkCircleOutline size={20} />
                                </div>
                                <div style={{ position: "relative", top: "2px", fontSize: "13pt", display: "inline-block" }}>
                                    Customer & Prospect Lists
                                </div>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <div style={{ display: "inline-block", marginRight: "10px" }}>
                                    <IoMdCheckmarkCircleOutline size={20} />
                                </div>
                                <div style={{ position: "relative", top: "2px", fontSize: "13pt", display: "inline-block" }}>
                                    Meeting Tracking
                                </div>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <div style={{ display: "inline-block", marginRight: "10px" }}>
                                    <IoMdCheckmarkCircleOutline size={20} />
                                </div>
                                <div style={{ position: "relative", top: "2px", fontSize: "13pt", display: "inline-block" }}>
                                    Add Advisors For Free
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pricingStarterBox"> 
                    <div style={{ width: "90%", margin: "0px auto" }}>
                        <div className="pricingStarterTitle">
                            Standard
                        </div>
                        <div style={{ textAlign: "left", marginLeft: "10px", marginTop: "10px", color: "#495866", fontWeight: "400" }}>
                            For established teams using SalesDoing who need a CRM integration.
                        </div>
                        <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
                            <div style={{ textAlign: "left", marginLeft: "10px", fontSize: "32pt", fontWeight: "bold" }}>
                                {/*${plan1.price}*/}
                                $15.99
                            </div>
                            <div style={{ fontSize: ".8em", textAlign: "left", marginLeft: "10px", color: "#495866", fontWeight: "400" }}>
                                {plan1.billingCycle === "monthly" && "Per user, per month, billed monthly" }
                            </div>
                        </div>
                        <button className="blueButton" onClick={(e) => handleRegister(e, "starter")} onKeyDown={(e) => handleRegister(e, "starter")}>
                            Start for free
                        </button> 
                        <hr className="pricingDivider" />
                        <div style={{ textAlign: "left" }}>
                        <div style={{ marginBottom: "10px" }}>
                                <div style={{ display: "inline-block", marginRight: "10px" }}>
                                    <IoMdCheckmarkCircleOutline size={20} />
                                </div>
                                <div style={{ position: "relative", top: "2px", fontSize: "13pt", display: "inline-block" }}>
                                    <b>Basic Plan Features</b>
                                </div>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <div style={{ display: "inline-block", marginRight: "10px" }}>
                                    <IoMdCheckmarkCircleOutline size={20} />
                                </div>
                                <div style={{ position: "relative", top: "2px", fontSize: "13pt", display: "inline-block" }}>
                                    Actions (1-year history)
                                </div>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <div style={{ display: "inline-block", marginRight: "10px" }}>
                                    <IoMdCheckmarkCircleOutline size={20} />
                                </div>
                                <div style={{ position: "relative", top: "2px", fontSize: "13pt", display: "inline-block" }}>
                                    1 CRM Integration
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pricingStarterBox"> 
                    <div style={{ width: "90%", margin: "0px auto" }}>
                        <div className="pricingStarterTitle">
                            Pro
                        </div>
                        <div style={{ textAlign: "left", marginLeft: "10px", marginTop: "10px", color: "#495866", fontWeight: "400" }}>
                            For companies needing multiple CRM & App integrations.
                        </div>
                        <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
                            <div style={{ textAlign: "left", marginLeft: "10px", fontSize: "32pt", fontWeight: "bold" }}>
                                {/*${plan1.price}*/}
                                $29.99
                            </div>
                            <div style={{ fontSize: ".8em", textAlign: "left", marginLeft: "10px", color: "#495866", fontWeight: "400" }}>
                                {plan1.billingCycle === "monthly" && "Per user, per month, billed monthly" }
                            </div>
                        </div>
                        <button className="blueButton" onClick={(e) => handleRegister(e, "starter")} onKeyDown={(e) => handleRegister(e, "starter")}>
                            Start for free
                        </button> 
                        <hr className="pricingDivider" />
                        <div style={{ textAlign: "left" }}>
                        <div style={{ marginBottom: "10px" }}>
                            <div style={{ display: "inline-block", marginRight: "10px" }}>
                                    <IoMdCheckmarkCircleOutline size={20} />
                                </div>
                                <div style={{ position: "relative", top: "2px", fontSize: "13pt", display: "inline-block" }}>
                                    <b>Standard Plan Features</b>
                                </div>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <div style={{ display: "inline-block", marginRight: "10px" }}>
                                    <IoMdCheckmarkCircleOutline size={20} />
                                </div>
                                <div style={{ position: "relative", top: "2px", fontSize: "13pt", display: "inline-block" }}>
                                    Actions (all-time history)
                                </div>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <div style={{ display: "inline-block", marginRight: "10px" }}>
                                    <IoMdCheckmarkCircleOutline size={20} />
                                </div>
                                <div style={{ position: "relative", top: "2px", fontSize: "13pt", display: "inline-block" }}>
                                    3 CRM & App Integrations
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*
                <div className="pricingTeamsBox"> 
                    <div style={{ width: "90%", margin: "0px auto" }}>
                        <div className="pricingTeamsTitle">
                            {plan3.name}
                        </div>
                        <div style={{ textAlign: "left", marginLeft: "10px", marginTop: "10px", color: "#495866", fontWeight: "400" }}>
                            {plan3.description}
                        </div>
                        <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
                            <div style={{ textAlign: "left", marginLeft: "10px", fontSize: "32pt", fontWeight: "bold" }}>
                                ${plan3.price}
                            </div>
                            <div style={{ fontSize: ".8em", textAlign: "left", marginLeft: "10px", color: "#495866", fontWeight: "400" }}>
                                {plan3.billingCycle === 1 && "Per user, per month, billed monthly" }
                            </div>
                        </div>
                        {teamsError &&
                            <div className="error" style={{ marginTop: "5px", marginBottom: "5px" }}>
                                Please enter a valid email
                            </div>
                        }
                        {teamsSuccess &&
                            <div className="success" style={{ marginTop: "5px", marginBottom: "-10px" }}>
                                You're on the list!
                            </div>
                        }
                        
                        <div style={{ textAlign: "left", marginTop: "0px" }}>
                            <input className="form-control" placeholder="Enter email address"
                                value={teamsEmail} 
                                onChange={(e) => handleEmailChangeTeams(e)} />
                        </div>
                        
                        <button className="blueButton" onClick={(e) => handleJoinTeamsWaitlist(e)} 
                            onKeyDown={(e) => handleJoinTeamsWaitlist(e)}>
                            Join the Waitlist
                        </button> 
                        <button className="blueButton" onClick={(e) => handleRegister(e, "teams")} onKeyDown={(e) => handleRegister(e, "teams")}>
                            Try for free
                        </button> 
                        
                        <div style={{ fontSize: ".9em", textAlign: "center", marginLeft: "10px", 
                            color: "#495866", fontWeight: "500" }}>
                            14-day free trial <br/> No credit card needed
                        </div>
                        <hr className="pricingDivider" style={{ marginTop: "0px" }} />
                        <div style={{ textAlign: "left" }}>
                            <div style={{ marginBottom: "10px" }}>
                                <div style={{ display: "inline-block", marginRight: "10px" }}>
                                    <IoMdCheckmarkCircleOutline size={20} color="green" />
                                </div>
                                <div style={{ position: "relative", top: "2px", fontSize: "13pt", display: "inline-block" }}>
                                    {plan3.features[0]}
                                </div>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <div style={{ display: "inline-block", marginRight: "10px" }}>
                                    <IoMdCheckmarkCircleOutline size={20} color="green" />
                                </div>
                                <div style={{ position: "relative", top: "2px", fontSize: "13pt", display: "inline-block" }}>
                                {plan3.features[1]}
                                </div>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <div style={{ display: "inline-block", marginRight: "10px" }}>
                                    <IoMdCheckmarkCircleOutline size={20} color="green" />
                                </div>
                                <div style={{ position: "relative", top: "2px", fontSize: "13pt", display: "inline-block" }}>
                                {plan3.features[2]}
                                </div>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <div style={{ display: "inline-block", marginRight: "10px" }}>
                                    <IoMdCheckmarkCircleOutline size={20} />
                                </div>
                                <div style={{ position: "relative", top: "2px", fontSize: "13pt", display: "inline-block" }}>
                                {plan3.features[3]}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                */}
            </div>
            );
        } else {
            return <div>Whoops, we have no pricing!</div>
        }
    }
}

export default PricingTiers;