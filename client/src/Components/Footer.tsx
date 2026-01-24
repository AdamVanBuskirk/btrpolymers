import React, { useState, useEffect, CSSProperties } from 'react';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../Core/hooks';
import StatsRow from './StatsRow';
import CompanyRow from './CompanyRow';

interface Props {
    style?: CSSProperties;
}

function Footer(props: Props) {


    const navigate = useNavigate();
    const [logoPath, setLogoPath] = useState("/");

    const currentYear = format(new Date(), 'y');
    let style: CSSProperties = (props.style) ? props.style : {};

    return (
        <>
        {/*
         <CompanyRow />
         <StatsRow />
        */}
         <div style={style}>
            <div className="subfooter">
                <div className="subfooterInner">
                    <div className="footerLeft">
                        <div style={{ textAlign: "left", marginBottom: "20px" }}>
                            <Link to={logoPath} className="text-white fw-bold fs-4">
                                <div>
                                    <img className="pb-2 pt-2" style={{ width: "150px" }} 
                                        src="/images/btr-green-arrow.gif" alt="BTR Polymers" />
                                </div>
                            </Link>
                        </div>
                        <div style={{ textAlign: "left", marginBottom: "30px", fontSize: "14pt", color: "#cacfd2" }}>
                            <div style={{ marginBottom: "20px" }}>
                                BTR Polymers is your premier enterprise recycled polymers business specializing in 
                                 da fda fads fdsa fdas fads fads fdas fds fdsa fas fasd fsda fas  
                            </div>
                            <Link className="cta-orange-button" style={{ width: "unset" }}
                                to="contact">
                                Contact us today!
                            </Link>
                        </div>
                        {/*
                                              <a href="" target="_BLANK" className="fa-brands fa-facebook"></a>
                            <a href="https://www.tiktok.com/@salesdoing" target="_BLANK" className="fa-brands fa-tiktok"></a>   
                            <a href="" target="_BLANK" className="fa-brands fa-instagram"></a>
                             <a href="https://www.youtube.com/@SalesDoing" target="_BLANK" className="fa-brands fa-youtube"></a>
                        */}
                        <div style={{ textAlign: "left", marginBottom: "20px" }}>
                            <a href="" target="_BLANK" className="fa-brands fa-linkedin"></a>
                        </div>
                    </div>
                    <div className="footerMiddle">
                        <div style={{ textAlign: "left", marginBottom: "20px", fontSize: "20pt" }}>
                            Who We Are
                        </div>
                        <div style={{ textAlign: "left", marginBottom: "20px", fontSize: "16pt", color: "#cacfd2" }}>
                            <div style={{ marginBottom: "20px" }}>
                                <a className="footerLink" href="/about">
                                    About
                                </a>
                            </div>
                            <div style={{ marginBottom: "20px" }}>
                                <a className="footerLink" href="/contact">
                                    Contact
                                </a>
                            </div>
                            <div>
                                <a className="footerLink" href="/careers">
                                    Careers
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="footerRight">
                        <div style={{ textAlign: "left", marginBottom: "20px", fontSize: "20pt" }}>
                            Capabilities
                        </div>
                        <div style={{ textAlign: "left", fontSize: "16pt", color: "#cacfd2" }}>
                            <div style={{ marginBottom: "20px" }}>
                                <a className="footerLink" href="/solutions">
                                    Solutions
                                </a>
                            </div>
                            <div>
                                <a className="footerLink" href="/materials">
                                    Materials
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
                    <div style={{ fontWeight: "bold" }}>
                        118 W Streetsboro Rd, Ste 256, Hudson, OH 44236
                    </div>
                    <div>
                        &copy; {currentYear} Burdette Thomas Company LLC DBA BTR Polymers. All rights reserved.
                    </div>
                    
                </div>
            </footer>
        </div>
        </>
    );
}

export default Footer;