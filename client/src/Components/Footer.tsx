
import React, { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

interface Props {
    style?: CSSProperties;
}

function Footer({ style }: Props) {
    const currentYear = new Date().getFullYear();

    return (
        <div style={style}>
            <style>{`
                /* WHY PARTNER WITH BTR */

                .btr-why-footer {
                    color: #ffffff;
                    padding: 30px 24px 70px;
                }

                .btr-why-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .btr-why-heading {
                    text-align: center;
                    margin-bottom: 50px;
                }

                .btr-why-heading h2 {
                    color: #ffffff;
                    font-size: clamp(30px, 3.5vw, 44px);
                    font-weight: 700;
                    letter-spacing: -0.035em;
                    line-height: 1.2;
                    margin: 0 0 14px;
                }

                .btr-why-heading p {
                    color: #c2cdd3;
                    font-size: 17px;
                    margin: 0;
                }

                .btr-why-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 45px;
                }

                .btr-why-item {
                    text-align: center;
                    padding: 10px 15px;
                }

                .btr-why-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 76px;
                    height: 76px;
                    margin: 0 auto 24px;
                    border: 2px solid #78d84b;
                    border-radius: 50%;
                    color: #78d84b;
                }

                .btr-why-icon svg {
                    width: 36px;
                    height: 36px;
                    stroke: currentColor;
                    stroke-width: 1.8;
                    fill: none;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                }

                .btr-why-item h3 {
                    color: #ffffff;
                    font-size: 23px;
                    font-weight: 700;
                    margin: 0 0 14px;
                }

                .btr-why-item p {
                    color: #c2cdd3;
                    font-size: 16px;
                    line-height: 1.75;
                    margin: 0 auto;
                    max-width: 350px;
                }

                .btr-why-action {
                    text-align: center;
                    margin-top: 45px;
                }

                .btr-why-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    background: #72d348;
                    border: 1px solid #72d348;
                    border-radius: 4px;
                    color: #071e2e !important;
                    padding: 15px 28px;
                    font-size: 15px;
                    font-weight: 700;
                    text-decoration: none !important;
                    transition:
                        background 0.2s ease,
                        border-color 0.2s ease;
                }

                .btr-why-button:hover {
                    background: #8ae566;
                    border-color: #8ae566;
                    color: #071e2e !important;
                }

                .btr-why-button:focus-visible {
                    outline: 3px solid #ffffff;
                    outline-offset: 4px;
                }


                @media (max-width: 768px) {
                    .btr-why-footer {
                        padding: 55px 20px;
                    }

                    .btr-why-heading {
                        margin-bottom: 35px;
                    }

                    .btr-why-grid {
                        grid-template-columns: 1fr;
                        gap: 35px;
                    }

                    .btr-why-item {
                        padding: 5px 10px;
                    }

                    .btr-why-heading p {
                        font-size: 15px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .btr-why-button {
                        transition: none;
                    }
                }
                @media (max-width: 768px) {
                    .btr-why-footer {
                        padding-top: 25px;
                        padding-bottom: 55px;
                    }
                }
            `}</style>

            {/* Shared background for both footer sections */}
            <div className="subfooter">

                {/* WHY PARTNER WITH BTR */}
                <section className="btr-why-footer">
                    <div className="btr-why-inner">

                        <div className="btr-why-heading">
                            <h2>
                                Built for Long-Term Partnerships.
                            </h2>
                            <p>
                                More than a buyer of scrap.
                                A partner invested in your success.
                            </p>
                        </div>

                        <div className="btr-why-grid">

                            {/* FINANCIAL STRENGTH */}
                            <div className="btr-why-item">
                                <div className="btr-why-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <rect
                                            x="3"
                                            y="9"
                                            width="18"
                                            height="12"
                                            rx="1"
                                        />
                                        <path d="M7 9V5h10v4" />
                                        <path d="M12 12v6" />
                                        <path d="M9.5 14h5" />
                                    </svg>
                                </div>

                                <h3>Financial Strength</h3>
                                <p>
                                    Well-capitalized and positioned
                                    to purchase material consistently,
                                    meet our commitments, and support
                                    growing supplier programs.
                                </p>
                            </div>

                            {/* LONG-TERM COMMITMENT */}
                            <div className="btr-why-item">
                                <div className="btr-why-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path d="M3 12a9 9 0 1 1 3 6.7" />
                                        <path d="M3 17v-5h5" />
                                        <path d="M12 7v5l3 2" />
                                    </svg>
                                </div>

                                <h3>Long-Term Commitment</h3>
                                <p>
                                    We're building for the long haul,
                                    with a mission to recycle 3 billion
                                    pounds of post-industrial plastic
                                    scrap by 2036.
                                </p>
                            </div>

                            {/* SHARED SUCCESS */}
                            <div className="btr-why-item">
                                <div className="btr-why-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path d="M3 17l6-6 4 4 8-8" />
                                        <path d="M15 7h6v6" />
                                        <path d="M3 21h18" />
                                    </svg>
                                </div>

                                <h3>Shared Success</h3>
                                <p>
                                    Our success depends on yours.
                                    We're committed to helping
                                    suppliers and customers grow
                                    through reliable service and
                                    lasting relationships.
                                </p>
                            </div>

                        </div>

                        <div className="btr-why-action">
                            <Link
                                to="/contact"
                                className="btr-why-button"
                            >
                                Partner With BTR
                                <span aria-hidden="true">↗</span>
                            </Link>
                        </div>

                    </div>
                </section>

                <div className="btr-why-divider" />

                {/* ORIGINAL FOOTER */}
                <div className="subfooterInner btr-footer-layout">

                    <div className="footerLeft">
                        <Link
                            to="/"
                            aria-label="BTR Polymers Home"
                        >
                            <img
                                className="pb-2 pt-2"
                                style={{
                                    width: '150px',
                                    maxWidth: '100%'
                                }}
                                src="/images/btr-green-arrow.gif"
                                alt="BTR Polymers"
                            />
                        </Link>

                        <p className="btr-footer-description">
                            BTR Polymers is on a mission to recycle
                            3 billion pounds of post-industrial
                            plastic scrap by 2036.
                        </p>

                        <a
                            href="https://www.linkedin.com/company/btr-polymers/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fa-brands fa-linkedin"
                            aria-label="BTR Polymers LinkedIn"
                        />
                    </div>

                    <div className="footerMiddle">
                        <h3 className="btr-footer-heading">
                            Who We Are
                        </h3>

                        <div className="btr-footer-links">
                            <Link
                                className="footerLink"
                                to="/about"
                            >
                                About
                            </Link>
                            <Link
                                className="footerLink"
                                to="/blog"
                            >
                                Blog
                            </Link>
                            <Link
                                className="footerLink"
                                to="/contact"
                            >
                                Contact
                            </Link>
                            <Link
                                className="footerLink"
                                to="/careers"
                            >
                                Careers
                            </Link>
                        </div>
                    </div>

                    <div className="footerRight">
                        <h3 className="btr-footer-heading">
                            Capabilities
                        </h3>

                        <div className="btr-footer-links">
                            <Link
                                className="footerLink"
                                to="/solutions"
                            >
                                Solutions
                            </Link>
                            <Link
                                className="footerLink"
                                to="/materials"
                            >
                                Materials
                            </Link>
                        </div>
                    </div>

                    <div className="footerLocations">
                        <h3 className="btr-footer-heading">
                            Locations
                        </h3>

                        <div className="btr-location">
                            <div className="btr-location-title">
                                Office &amp; Operations
                            </div>
                            <address>
                                995 Home Ave<br />
                                Akron, OH 44310
                            </address>
                        </div>

                        <div className="btr-location">
                            <div className="btr-location-title">
                                Billing
                            </div>
                            <address>
                                118 W Streetsboro Rd<br />
                                Suite 256<br />
                                Hudson, OH 44236
                            </address>
                        </div>
                    </div>

                </div>
            </div>

            <footer className="btr-footer-bottom">
                <div className="btr-footer-divider" />
                <div className="disclaimer">
                    &copy; {currentYear} Burdette Thomas Company LLC
                    DBA BTR Polymers. All rights reserved.
                </div>
            </footer>

        </div>
    );
}

export default Footer;
