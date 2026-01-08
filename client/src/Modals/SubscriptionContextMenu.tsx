import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../Core/hooks';
import { ContextMenu } from '../Models/ContextMenu';
import { SubscriptionContextMenuParam } from '../Models/Requests/SubscriptionContexMenuParam';
import { AiOutlineClose } from "react-icons/ai";
import { PopupContextParam } from '../Models/Requests/PopupContextParam';
import { getSettings, loadSubComponent } from '../Store/Settings';
import { getStripe, createSubscription, deleteMostRecentPayment, cancelSubscription, createSetupIntent, setDefaultPayment, setStripeStatus, getMostRecentPayment } from '../Store/Stripe';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getUser } from '../Store/Auth';
import { useIsMobile } from '../Core/hooks';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../Helpers/Stripe';
import { getCompany } from '../Store/Company';
import { addDays, addMonths, addYears, differenceInDays, format, subDays } from 'date-fns';
import { handleLoadComponent } from '../Helpers/handleLoadComponent';
import { store } from '../Core/store';

interface Props {
    params: SubscriptionContextMenuParam | undefined;    
}

function SubscriptionContextMenu(props: Props) {

    

    const stripeState = useAppSelector(getStripe);
    const [subscriptionContextMenu, setSubscriptionContextMenu] = useState<ContextMenu>();

    const isMobile = useIsMobile();

    const closeContextMenu = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeMenu();
    }

    const closeMenu = () => {
        let contextMenu = { _id: "", x: 0, y: 0, width: 0, height: 0 };
        setSubscriptionContextMenu(contextMenu);
    }

    useEffect(() => {
        if (props.params) {
            let contextMenu = { _id: "", x: 0, y: 0, width: 0, height: 0 };
            if ( (subscriptionContextMenu && subscriptionContextMenu._id !== props.params.id) || !subscriptionContextMenu) {
                if (props.params.event) {
                    //console.log("Adam")
                    let menuWidth = window.outerWidth * .4;
                    //let menuHeight = window.outerHeight * .90;
                    let menuXStart = window.outerWidth * .3;
                    let menuYStart = 100;
                    contextMenu._id = props.params.id;
                    contextMenu.x = menuXStart;
                    contextMenu.y = menuYStart;
                    contextMenu.width = menuWidth;
                    //contextMenu.height = menuHeight;
                }
            }
            setSubscriptionContextMenu(contextMenu);
        }
    }, [props.params]);


    const sContextMenu: React.CSSProperties = {
        top: subscriptionContextMenu && !isMobile ? subscriptionContextMenu.y : 0,
        left: subscriptionContextMenu && !isMobile ? subscriptionContextMenu.x : 0,
        width: isMobile 
            ? "100vw" 
            : subscriptionContextMenu 
                ? subscriptionContextMenu.width 
                : 300,
        height: isMobile ? "100vh" : "auto",
    };

    //let plan = stripeState.plans.find(p => p.priceId === props.params?.id);
 
    return (
        <>
        {subscriptionContextMenu && subscriptionContextMenu._id !== "" && 
            <div onClick={e => closeMenu()} className="windowContainer">
                <div className="contextMenu" style={sContextMenu} onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
                    <div style={{ position: "relative" }}>
                        <div className="divClose">
                            <Link to="" onClick={(e) => closeContextMenu(e)}>
                                <AiOutlineClose color="#555" size="13" />
                            </Link>
                        </div>
                    </div>
                    <Elements stripe={stripePromise}>
                        <SubscriptionContextMenuInner {...props} />
                    </Elements>
                </div>
            </div>
        }
        </>  
    );
}

/*******************************************************************
 * primary window for subscribing, cancelling, updating card, etc.
 *******************************************************************/

function SubscriptionContextMenuInner(props: Props) {

    const stripe = useStripe();
    const elements = useElements();
    const userState = useAppSelector(getUser);
    const stripeState = useAppSelector(getStripe);
    const companyState = useAppSelector(getCompany);
    const settingsState = useAppSelector(getSettings);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [duration, setDuration] = useState("monthly");
    const [cardComplete, setCardComplete] = useState(false);
    const [cancel, setCancel] = useState(false);
    const [canceling, setCanceling] = useState(false);
    const [showUpdateCard, setShowUpdateCard] = useState(false);
    const [updatingCard, setUpdatingCard] = useState(false);
    const [cardUpdated, setCardUpdated] = useState(false);
    const [canceled, setCanceled] = useState(false);
    const isMobile = useIsMobile();
    //const [successMessage, setSuccessMessage] = useState('');

    let companyId = companyState.company?._id;
    let owner = companyState.members.find(m => m.role === "owner");
    let licenseCount = companyState.members.filter(m => m.status !== "invited" && m.active).length;

    const nowMinus30 = subDays(new Date(), 30);
    const daysLeft = differenceInDays(owner!.created, nowMinus30);

    const lastPayment = stripeState.mostRecentPayment;
    let plan = stripeState.plans.find(p => p._id === lastPayment?.stripePlanId);

    let nextPayment = new Date();

    const showMessage = (message: string) => {
        setMessage(message);
        setTimeout(() => {
            setMessage("");
        }, 2000);
    }

    useEffect(() => {
        if (stripeState.status === "subscriptionCanceled") {
            dispatch(setStripeStatus("idle"));
            setCanceling(false);
            setCanceled(true);
            setTimeout(() => {
                setCanceled(false);
            }, 2000);
        }
    }, [stripeState.status]);

    useEffect(() => {
        const confirmCardUpdate = async () => {

            if (!stripe || !elements) return;
            const card = elements.getElement(CardElement);
            if (!card) return;

            try {
                const result = await stripe.confirmCardSetup(stripeState.clientSecret, {
                    payment_method: {
                    card,
                    billing_details: { email: userState.email },
                    },
                });

                if (result.error) {
                    setUpdatingCard(false);
                    showMessage(result.error.message || "Card update failed.");
                } else {

                    if (result.setupIntent.status === 'succeeded') {

                        const paymentMethod = result.setupIntent.payment_method;
                        const paymentMethodId = typeof paymentMethod === 'string' ? paymentMethod : paymentMethod?.id;

                        // send to backend to set default
                        if (companyId && lastPayment && paymentMethodId) {
                            dispatch(setDefaultPayment({ 
                                companyId,
                                customerId: lastPayment.customerId,
                                subscriptionId: lastPayment.subscriptionId,
                                paymentMethodId 
                            }));
                            setCardUpdated(true);
                            setTimeout(() => {
                                setCardUpdated(false);
                            }, 2000);
                            // Card successfully updated
                            setUpdatingCard(false);
                            setShowUpdateCard(false);
                        }
                        // Card successfully updated and set as default
                    }
                }
            } catch (err: any) {
                setUpdatingCard(false);
                showMessage(err.message || "Something went wrong.");
            }
        };

        if (stripeState.clientSecret && showUpdateCard) {
            setUpdatingCard(false);
            confirmCardUpdate();
        }
    }, [stripeState.clientSecret]);

    const handleCreateSubscription = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        if (loading || !companyId || !owner) return;

        setLoading(true);
        setMessage('');
      
        try {
          const priceId =
            duration === 'annual'
              ? process.env.REACT_APP_STRIPE_STANDARD_ANNUAL_PRICE!
              : process.env.REACT_APP_STRIPE_STANDARD_MONTHLY_PRICE!;
      
          if (!cardComplete) {
            showMessage('Please enter a valid card.');
            setLoading(false);
            return;
          }
      
          if (!stripe || !elements) {
            showMessage('Stripe not ready.');
            setLoading(false);
            return;
          }
      
          const card = elements.getElement(CardElement);
          if (!card) {
            showMessage('Missing card element.');
            setLoading(false);
            return;
          }

          // Call backend to create subscription (returns clientSecret)
          const result = await dispatch(
            createSubscription({
              companyId: companyId,
              priceId,
              qty: licenseCount,
            })
          ).unwrap();
      
          const clientSecret = result?.clientSecret;
          if (!clientSecret) {
            showMessage('No client secret returned.');
            setLoading(false);
            return;
          }
      
          // Wait a bit to ensure PaymentIntent is fully created
          await new Promise((r) => setTimeout(r, 750));
      
          // Confirm payment on frontend
          const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card,
              billing_details: {
                email: owner.email,
                name: companyState.company?.name,
              },
            },
          });
      
          if (error) {
            
            console.error('Stripe error:', error);
            showMessage(error.message || 'Payment failed.');

            // Wait a moment to let backend persist payment record
            await new Promise((r) => setTimeout(r, 1000));

            // Re-fetch most recent payment from backend
            await dispatch(getMostRecentPayment(companyId)).unwrap();

            const mostRecent = store.getState().stripe.mostRecentPayment; // or select from Redux
            if (mostRecent?._id) {
                await dispatch(deleteMostRecentPayment({ companyId, _id: mostRecent._id }));
            }

            setTimeout(() => {
                showMessage("");
                setLoading(false);
            }, 3000);
            
            //setLoading(false);
            /*
            if (stripeState.mostRecentPayment) {
              await dispatch(deleteMostRecentPayment({ companyId, _id: stripeState.mostRecentPayment._id }));
            }
            */
          } else if (paymentIntent?.status === 'succeeded') {
            setLoading(false);
          } else {
            setLoading(false);
            console.warn('PaymentIntent incomplete:', paymentIntent?.status);
            showMessage(`Payment ${paymentIntent?.status}`);
          }
        } catch (err: any) {
            setLoading(false);
          console.error('Error creating subscription:', err);
          showMessage(err.message || 'Something went wrong.');
        }
      
        
    };
      
      
    const handleConfirmCancel = () => {

        setCancel(false);
        if (stripeState.mostRecentPayment && companyId) {
            setCanceling(true);
            dispatch(cancelSubscription({ companyId: companyId, subscriptionId: stripeState.mostRecentPayment.subscriptionId }));
        }
    }

    const CARD_OPTIONS = {
        style: {
          base: {
            iconColor: '#a0aec0',
            color: '#1a202c',
            fontWeight: 500,
            fontFamily: 'Inter, Roboto, Open Sans, Segoe UI, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            '::placeholder': {
              color: '#a0aec0',
            },
          },
          invalid: {
            color: '#e53e3e',
            iconColor: '#e53e3e',
          },
        },
    };

    if (lastPayment) {
        if (plan) {
            if (plan.billingCycle === "annual") {
                nextPayment = addDays(new Date(lastPayment!.payment), 365);
            } else {
                nextPayment = addMonths(new Date(lastPayment!.payment), 1);
            }
        }
    }
    console.log(lastPayment);
    console.log(nextPayment);
    console.log(plan);
    console.log(loading);
    let paymentMade = (lastPayment && nextPayment && plan && !loading);
    let companyName = companyState.company?.name && companyState.company.name !== "";
    let expiresOn = new Date();
    
    if (lastPayment && plan) {
        expiresOn = (plan?.billingCycle === "annual") ? addYears(new Date(lastPayment.payment), 1) : addMonths(new Date(lastPayment.payment), 1);
    }

    let onExpiredTime = lastPayment && !lastPayment.active && new Date < expiresOn;

    return (
        <>
        <div style={{ margin: "20px 10px 20px 10px" }}>
            <div style={{ fontSize: "18pt", fontWeight: "600" }}>
                {!paymentMade ? "Standard Plan" : (!onExpiredTime) ? <span style={{ color: "green" }}>Subscribed</span> : <span style={{ color: "red" }}>Canceled</span> }
                {cardUpdated &&
                    <div style={{ position: "relative", top: "-5px", fontSize: "12pt", fontWeight: "normal", color: "#265228", 
                        display: "inline-block", marginLeft: "200px", backgroundColor: "#addeb0", borderRadius: "30px", padding: "5px 20px 5px 20px" }}>
                        Card Updated!
                    </div>
                }
                {canceled &&
                    <div style={{ position: "relative", top: "-5px", fontSize: "12pt", fontWeight: "normal", color: "#265228", 
                        display: "inline-block", marginLeft: "200px", backgroundColor: "#addeb0", borderRadius: "30px", padding: "5px 20px 5px 20px" }}>
                        Subscription Canceled!
                    </div>
                }
            </div> 
            {paymentMade ?
            <>
                {onExpiredTime ?
                    <div style={{ fontSize: "12pt", marginBottom: "20px" }}>
                        {"Your plan has been cancelled with access ending on " + format(expiresOn, "MMMM do yyyy")}
                    </div>
                :
                    <div style={{ fontSize: "12pt", marginBottom: "20px" }}>
                        <div>
                            <span style={{ fontWeight: "500"}}>Next Payment:</span>
                            <span style={{ paddingLeft: "5px" }}>
                                {format(nextPayment, "MMM do, yyyy")}
                            </span> 
                        </div>
                        <div>
                            <span style={{ fontWeight: "500"}}>Plan:</span> 
                            <span style={{ paddingLeft: "5px" }}>
                                {plan?.name}
                            </span> 
                        </div>
                    </div>
                }
            </>
            :
                <div style={{ fontSize: "14pt", fontWeight: "400", marginBottom: "20px" }}>
                    {daysLeft === 0 ? "Trial Ends Today": (daysLeft === 1) ? `Trial ends in ${daysLeft} day` : (daysLeft < 0) ? 'Your Trial Has Expired' : `Trial ends in ${daysLeft} days` }
                </div>
            }
            {!paymentMade &&
                <div style={{ fontSize: "12pt", marginBottom: "20px" }}>
                    Your company is on a 30-day trial of the <b>Standard Plan</b>. Your trial will end on <b>{format(addDays(owner!.created, 30), "MMM do, yyyy")}</b>. 
                    Once your trail ends, you will be locked out of using the SalesDoing platform. You will have 
                    the ability to pay and unlock the platform.
                </div>
            }
            <div style={{ fontSize: "12pt", fontWeight: "bold" }}>
                {(!companyName) ?
                    <div style={{ color: "red", fontWeight: "normal", marginBottom: "20px" }}>
                        {`You must save a Company Name before subscribing to a paid account. Please close this window, visit Settings > Company, enter 
                        a Company Name, click Save, and return to this screen.`}
                    </div>
                :
                    <span>{companyState.company?.name}</span>
                }
            </div>
            <div style={{ fontSize: "12pt", marginBottom: "20px" }}>
                {licenseCount} licenses assigned (active users). {paymentMade && `$${plan?.price} each.`}
            </div>
            {( (!paymentMade || onExpiredTime) && companyName) &&
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>

                    <div
                        style={{
                        display: "flex",
                        border: "1px solid #ddd",
                        borderRadius: "20px",
                        overflow: "hidden",
                        cursor: "pointer",
                        userSelect: "none",
                        }}
                    >
                        <div
                        onClick={() => setDuration("monthly")}
                        style={{
                            padding: "6px 14px",
                            backgroundColor: duration === "monthly" ? "#555" : "#f8f8f8",
                            color: duration === "monthly" ? "#fff" : "#555",
                            fontWeight: duration === "monthly" ? "600" : "unset",
                            fontSize: "10.5pt",
                            transition: "all 0.2s ease",
                        }}
                        >
                        Monthly
                        </div>
                        <div
                        onClick={() => setDuration("annual")}
                        style={{
                            padding: "6px 14px",
                            backgroundColor: duration === "annual" ? "#555" : "#f8f8f8",
                            color: duration === "annual" ? "#fff" : "#555",
                            fontWeight: duration === "annual" ? "600" : "unset",
                            fontSize: "10.5pt",
                            transition: "all 0.2s ease",
                        }}
                        >
                        Annual
                        </div>
                    </div>
                </div>
            }
            {companyName &&
            <>
                { (!paymentMade || onExpiredTime) ?
                <>
                    <div style={{ fontSize: "12pt", marginBottom: "20px" }}>
                        Upon subscribing, you will be charged <b>${duration === "monthly" ? "19.99" : "179.88"} per license</b>. After subscribing, if you later add users, 
                        you will be charged a pro-rated amount for those users and then the full amount during renewals. 
                        You will not be charged for pending invites - only fully active users will incur charges.
                    </div>
                    {message && 
                        <div className="error" style={{ fontSize: "12pt", marginTop: "10px", marginBottom: "20px", padding: "5px 20px" }}>
                            {message}
                        </div>
                    }
                    <div style={{ border: "1px solid #efefef", borderRadius: "8px", padding: "10px" }}>
                        <CardElement options={CARD_OPTIONS} onChange={(event) => setCardComplete(event.complete)} />
                    </div>
                    {(!paymentMade || onExpiredTime) &&
                        <button className="button-primary" style={{ marginTop: "15px", border: "0px" }}
                            disabled={!stripe || loading} onClick={(e) => handleCreateSubscription(e)}>
                            <span>{loading ? 'Processing...' : onExpiredTime ? 'Resubscribe' : 'Subscribe'}</span>
                        </button>
                    }
                </>
                :
                <>
                    <div style={{ marginTop: "20px" }}>
                        <button
                            onClick={() => setCancel(true)}
                            className="button-primary-red"
                            style={{
                                marginRight: "10px",
                                ...(isMobile) && { marginBottom: "20px" }
                            }}>
                            {canceling ? 'Canceling...' : 'Cancel Subscription'}
                        </button>
                        <button
                            onClick={() => setShowUpdateCard(true)}
                            className="button-primary-cancel"
                            style={{
                                marginRight: "10px"
                            }}>
                            Update Card on File
                        </button>
                    </div>
                </>
                }
                </>
            }
        </div>   

        {/* Confirm Card Update Modal */}

        {showUpdateCard && (
            <div style={{ marginTop: "20px", border: "1px solid #eee", borderRadius: "8px", padding: "15px" }}>
                <div style={{ fontSize: "13pt", fontWeight: "500", marginBottom: "10px" }}>
                Enter new card details
                </div>
                <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "10px", marginBottom: "15px" }}>
                    <CardElement options={CARD_OPTIONS} onChange={(event) => setCardComplete(event.complete)} />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                <button
                    className="button-primary"
                    onClick={async () => {
                        if (!cardComplete) {
                            showMessage("Please complete the card details.");
                            return;
                        }
                        setUpdatingCard(true);
                        if (companyId) {
                            await dispatch(createSetupIntent({ companyId }));
                        }
                    }}
                    disabled={!stripe || updatingCard}
                >
                    {updatingCard ? "Saving..." : "Save Card"}
                </button>
                <button
                    className="button-primary-cancel"
                    onClick={() => setShowUpdateCard(false)}
                >
                    Cancel
                </button>
                </div>
            </div>
        )}

        {/* Confirm Cancel Modal */}
        {cancel && (
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                >
                <div
                    style={{
                    background: "#fff",
                    padding: "25px",
                    borderRadius: "16px",
                    width: "450px",
                    textAlign: "center",
                    }}
                >
                    <h3>Cancel Subscription?</h3>
                    <p>You will retain access until your current billing cycle expires. You will not be billed again.</p>
                    <div style={{ marginTop: "20px" }}>
                        <button
                            onClick={() => setCancel(false)}
                            className="button-primary-cancel"
                            style={{
                                marginRight: "10px"
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmCancel}
                            className="button-primary-red"
                            style={{
                                marginRight: "10px"
                            }}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        )}

        </>
    );
  }

export default SubscriptionContextMenu;