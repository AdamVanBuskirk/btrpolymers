
import React, { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

interface Props {
    style?: CSSProperties;
}

function Footer({ style }: Props) {
    const currentYear = new Date().getFullYear();

    return (
        <div style={style}>
            <div className="subfooter">
                <div className="subfooterInner btr-footer-layout">

                    <div className="footerLeft">
                        <Link to="/" aria-label="BTR Polymers Home">
                            <img
                                className="pb-2 pt-2"
                                style={{ width: '150px', maxWidth: '100%' }}
                                src="/images/btr-green-arrow.gif"
                                alt="BTR Polymers"
                            />
                        </Link>

                        <p className="btr-footer-description">
                            {/*BTR Polymers is a service-driven materials
                            company specializing in the recycling and
                            reprocessing of post-industrial polymer
                            materials. */}
                            BTR Polymers is on a mission to recycle 3 billion 
                            pounds of post-industrial plastic scrap by 2036
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
                            <Link className="footerLink" to="/about">
                                About
                            </Link>
                            <Link className="footerLink" to="/contact">
                                Contact
                            </Link>
                            <Link className="footerLink" to="/careers">
                                Careers
                            </Link>
                        </div>
                    </div>

                    <div className="footerRight">
                        <h3 className="btr-footer-heading">
                            Capabilities
                        </h3>

                        <div className="btr-footer-links">
                            <Link className="footerLink" to="/solutions">
                                Solutions
                            </Link>
                            <Link className="footerLink" to="/materials">
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
