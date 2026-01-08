import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../Core/hooks';
import { getUser } from '../../Store/Auth';
import Footer from '../../Components/Footer';
import Navigation from '../../Components/Navigation';
import RedirectToDash from '../../Components/RedirectToDash';
import { useIsMobile } from '../../Core/hooks';

function Integrations() {

    const navigate = useNavigate();
    const user = useAppSelector(getUser);    
    const isMobile = useIsMobile();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (user.accessToken !== "" && user.status !== "loading"){
            navigate('/dash');
        }
    }, [user]);

    return (
    <>
        <RedirectToDash />
        <Navigation />

        <div className="main-container" style={{ width: isMobile ? "80%" : "70%" }}>

            <h1 style={{ fontWeight: "bold", fontSize: isMobile ? "50px" : "60px", margin: " 0px auto 60px auto", letterSpacing: "-1px", textAlign: "center" }}>
                Integrations
            </h1>

            <div style={{ margin: "0px auto" }}>
                {/*
                <h2 style={{ fontWeight: "bold", fontSize: "30px", marginBottom: "30px", letterSpacing: "-1px" }}>
                    A tool for proactively growing your sales with existing customers.
                </h2>
                */}
                <div style={{ color: "#6B6A6A", fontSize: "24px", fontWeight: "460", marginBottom: "30px", fontStyle: "italic" }}>
                    Coming soon...
                </div>
            </div>
             
        </div>

        <Footer style={{ position: "relative" }} />
    </>
    );
}

export default Integrations;