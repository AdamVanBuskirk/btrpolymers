import React, { useState, useEffect, CSSProperties } from 'react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../Store/Auth';
import { useAppSelector } from '../Core/hooks';
import CompanyRow from './CompanyRow';
import StatsRow from './StatsRow';

interface Props {
    style?: CSSProperties;
}

function Footer(props: Props) {

    const user = useAppSelector(getUser);
    const navigate = useNavigate();
    const [logoPath, setLogoPath] = useState("/");

    useEffect(() => {
        if (user.accessToken !== "") {
            setLogoPath("/dash");
        }else {
            setLogoPath("/");
        }
    }, [user.accessToken]);

    const currentYear = format(new Date(), 'y');
    let style: CSSProperties = (props.style) ? props.style : {};

    return (
        <>
        <CompanyRow />
        <StatsRow />
        <div style={style}>
            <div className="subfooter">
                <div className="subfooterInner">
                    <div className="footerLeft">
                        <div style={{ textAlign: "left", marginBottom: "20px" }}>
                            <Link to={logoPath} className="text-white fw-bold fs-4">
                                <div>
                                    <img className="pb-2 pt-2" style={{ width: "200px" }} 
                                        src="/images/sales-doing-logo-white-red-flame.png" alt="SalesDoing.com" />
                                </div>
                            </Link>
                        </div>
                        <div style={{ textAlign: "left", marginBottom: "30px", fontSize: "14pt", color: "#cacfd2" }}>
                            <div style={{ marginBottom: "20px" }}>
                                SalesDoing is THE platform for systemizing and taking control of your sales growth 
                                through streamlined activities logging and advanced analytics.
                            </div>
                            <Link className="cta-orange-button" style={{ width: "unset" }}
                                to="" 
                                onClick={() => { navigate("/register/starter/topright-nav" ); }}>
                                Try it free today!
                            </Link>
                        </div>
                        {/*
                        <a href="https://www.facebook.com/share/g/16sA6mYRNX/?mibextid=wwXIfr" target="_BLANK" className="fa fa-facebook"></a>
                        <a href="https://www.instagram.com/herdrapp" target="_BLANK" className="fa fa-instagram"></a>
                        <a href="https://www.linkedin.com/company/herdrapp" target="_BLANK" className="fa fa-linkedin"></a>
                        <a href="https://www.youtube.com/@Herdrapp" target="_BLANK" className="fa fa-youtube"></a>
                        <a href="https://www.reddit.com/user/herdrapp" target="_BLANK" className="fa fa-reddit"></a>
                        */}
                        <div style={{ textAlign: "left", marginBottom: "20px" }}>
                            <a href="" target="_BLANK" className="fa-brands fa-facebook"></a>
                            <a href="https://www.tiktok.com/@salesdoing" target="_BLANK" className="fa-brands fa-tiktok"></a>   
                            <a href="" target="_BLANK" className="fa-brands fa-instagram"></a>
                            <a href="" target="_BLANK" className="fa-brands fa-linkedin"></a>
                            <a href="https://www.youtube.com/@SalesDoing" target="_BLANK" className="fa-brands fa-youtube"></a>
                        </div>
                    </div>
                    <div className="footerMiddle">
                        {/*
                        <div style={{ textAlign: "left", marginBottom: "20px", fontSize: "20pt" }}>
                            Navigation
                        </div>
                        <div style={{ textAlign: "left", marginBottom: "20px", fontSize: "16pt", color: "#cacfd2" }}>
                            <div style={{ marginBottom: "20px" }}>
                                <a className="footerLink" href="">
                                    Coming soon...
                                </a>
                            </div>
                           
                            <div>
                                <a className="footerLink">
                                    Blog
                                </a>
                            </div>
                        </div>
                        */}
                    </div>
                    <div className="footerRight">
                        <div style={{ textAlign: "left", marginBottom: "20px", fontSize: "20pt" }}>
                            Legal
                        </div>
                        <div style={{ textAlign: "left", fontSize: "16pt", color: "#cacfd2" }}>
                            <div style={{ marginBottom: "20px" }}>
                                <a className="footerLink" href="/privacy">
                                    Privacy Policy
                                </a>
                            </div>
                            <div>
                                <a className="footerLink" href="/terms">
                                    Terms of Service
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="text-center pb-3 pt-2">
                <hr style={{ margin: "20px auto 40px auto", color: "#F8F9FA", borderWidth: "1.5", 
                    width: "80%" }} />
                <div className="disclaimer">
                    &copy; {currentYear} SalesDoing, Inc. All rights reserved.
                </div>
            </footer>
        </div>
        </>
    );
}

export default Footer;