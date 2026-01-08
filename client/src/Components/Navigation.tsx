import { useState, useEffect } from 'react';
import { useAppSelector, useIsMobile } from '../Core/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../Store/Auth';
import { SettingsContextParam } from "../Models/Requests/SettingsContextParam";


import { RxCalendar, RxLightningBolt } from "react-icons/rx";
import { IoAnalytics, IoListSharp, IoPeople } from "react-icons/io5";
import { MdAutoStories } from "react-icons/md";
import { BiConversation } from "react-icons/bi";

import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem
} from "reactstrap";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);        // main mobile menu
  const [aboutOpen, setAboutOpen] = useState(false);  // About submenu (mobile only)
  const [toolsOpen, setToolsOpen] = useState(false); 

  const toggle = () => {
    setIsOpen(prev => !prev);
    if (isOpen) {
      setAboutOpen(false);
    }
  };

  const user = useAppSelector(getUser);
  const navigate = useNavigate();
  const [logoPath, setLogoPath] = useState("/");
  const [settingsContextParams, setSettingsContextParams] = useState<SettingsContextParam>();
  const isMobile = useIsMobile();

  useEffect(() => {
    setLogoPath("/");
    setSettingsContextParams(undefined);
  }, [user.accessToken]);

  const whiteHamburgerIcon = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='white' stroke-width='2' stroke-linecap='round' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\")"
  };

  const handleSubLinkClick = (path: string) => {
    setAboutOpen(false);
    setIsOpen(false);
    navigate(path);
  };

  return (
    <Navbar expand="xl" light className="px-3" style={{ paddingTop: 0, paddingBottom: 0 }}>
      {/* LEFT: LOGO */}
      <NavbarBrand tag={Link} to={logoPath} className="logoLink">
        <img
          style={{ width: "100px", cursor: "pointer" }}
          src="/images/sales-doing-logo-white-red-flame.png"
          alt="SalesDoing.com"
        />
      </NavbarBrand>

      {/* RIGHT: HAMBURGER */}
      <NavbarToggler onClick={toggle} className="ms-auto">
        <span
          className="navbar-toggler-icon"
          style={whiteHamburgerIcon}
        />
      </NavbarToggler>

      {/* COLLAPSIBLE MENU */}
      <Collapse isOpen={isOpen} navbar className="justify-content-end">
        <Nav navbar className="ms-auto">
            {/*
          <NavItem>
            <Link to="" onClick={() => setIsOpen(false)} className="nav-link">Tools</Link>
          </NavItem>
        */}





        {/* TOOLS MEGA DROPDOWN */}
        <NavItem
            className={`nav-item tools-dropdown ${toolsOpen && isMobile ? "show" : ""}`}
            onMouseEnter={() => !isMobile && setToolsOpen(true)}
            onMouseLeave={() => !isMobile && setToolsOpen(false)}
            >
            <span
                className="dropdown-toggle"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                if (isMobile) {
                    e.preventDefault();
                    setToolsOpen(prev => !prev);
                }
                }}
            >
                Tools
            </span>

            <div className={`mega-menu ${toolsOpen && isMobile ? "show" : ""}`}>
                <div className="mega-menu-grid">
                {/* Column 1 */}
                <button
                    type="button"
                    className="mega-item"
                    onClick={() => { setIsOpen(false); navigate("/tools/actions"); }}
                >
                    <div className="mega-item-icon"><RxLightningBolt /></div>
                    <div className="mega-item-text">
                    <div className="mega-item-title">Actions</div>
                    <div className="mega-item-subtitle">Log proactive communication.</div>
                    </div>
                </button>
                <button
                    type="button"
                    className="mega-item"
                    onClick={() => { setIsOpen(false); navigate("/tools/data"); }}
                >
                    <div className="mega-item-icon"><IoAnalytics /></div>
                    <div className="mega-item-text">
                    <div className="mega-item-title">Data</div>
                    <div className="mega-item-subtitle">Measure performance.</div>
                    </div>
                </button>
                <button
                    type="button"
                    className="mega-item"
                    onClick={() => { setIsOpen(false); navigate("/tools/lists"); }}
                >
                    <div className="mega-item-icon"><IoListSharp /></div>
                    <div className="mega-item-text">
                    <div className="mega-item-title">Lists</div>
                    <div className="mega-item-subtitle">Save time w/ intuitive prospect and customer lists.</div>
                    </div>
                </button>
                <button
                    type="button"
                    className="mega-item"
                    onClick={() => { setIsOpen(false); navigate("/tools/stories"); }}
                >
                    <div className="mega-item-icon">< MdAutoStories /></div>
                    <div className="mega-item-text">
                    <div className="mega-item-title">Success Stories</div>
                    <div className="mega-item-subtitle">Motivate with shared wins.</div>
                    </div>
                </button>
                <button
                    type="button"
                    className="mega-item"
                    onClick={() => {
                    setIsOpen(false);
                    navigate("/tools/meetings");
                    }}
                >
                    <div className="mega-item-icon"><BiConversation /></div>
                    <div className="mega-item-text">
                    <div className="mega-item-title">Meetings</div>
                    <div className="mega-item-subtitle">Run better meetings.</div>
                    </div>
                </button>
                {/*
                <button
                    type="button"
                    className="mega-item"
                    onClick={() => { setIsOpen(false); navigate("/tools/asks"); }}
                >
                    <div className="mega-item-icon"><BiConversation /></div>
                    <div className="mega-item-text">
                    <div className="mega-item-title">Asks</div>
                    <div className="mega-item-subtitle">Master proactive sales techniques.</div>
                    </div>
                </button>
                */}
                <button
                    type="button"
                    className="mega-item"
                    onClick={() => { setIsOpen(false); navigate("/tools/people"); }}
                >
                    <div className="mega-item-icon"><IoPeople /></div>
                    <div className="mega-item-text">
                    <div className="mega-item-title">People</div>
                    <div className="mega-item-subtitle">Support for advisors, admins, managers, and sales teams.</div>
                    </div>
                </button>

                {/* Add more items as needed... */}
                </div>
            </div>
        </NavItem>







          <NavItem>
            <Link to="/integrations" onClick={() => setIsOpen(false)} className="nav-link">Integrations</Link>
          </NavItem>
          <NavItem>
            <Link to="/advisors" onClick={() => setIsOpen(false)} className="nav-link">Advisors</Link>
          </NavItem>

          {/* ABOUT WITH DROPDOWN */}
          <NavItem
            className={`nav-item dropdown ${aboutOpen && isMobile ? "show" : ""}`}
          >
            {/* Main ABOUT label */}
            <span
              className="dropdown-toggle"
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.preventDefault();
                if (isMobile) {
                  setAboutOpen(prev => !prev);
                }
                // on desktop, click does nothing; hover will open menu
              }}
            >
              About
            </span>

            <div
              className={`dropdown-menu ${aboutOpen && isMobile ? "show" : ""}`}
            >
              <button
                type="button"
                className="dropdown-item"
                onClick={() => handleSubLinkClick("/about")}
              >
                About SalesDoing
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => handleSubLinkClick("/case-studies")}
              >
                Case Studies
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => handleSubLinkClick("/contact")}
              >
                Contact Us
              </button>
            </div>
          </NavItem>
          <NavItem>
            {/*<Link to="/blog" onClick={() => setIsOpen(false)} className="nav-link">Blog</Link>*/}
            <a
              href="https://salesdoing.com/blog"
              onClick={() => setIsOpen(false)}
              className="nav-link">
              Blog
          </a>
          </NavItem>
         {/*
          <NavItem>
            <Link to="" onClick={() => setIsOpen(false)} className="nav-link">Resources</Link>
          </NavItem>
        */}
          <NavItem>
            <Link to="/pricing" onClick={() => setIsOpen(false)} className="nav-link">Pricing</Link>
          </NavItem>
          <NavItem>
            <Link to="/login" onClick={() => setIsOpen(false)} className="nav-link">Login</Link>
          </NavItem>

          {user.accessToken === "" && (
            <NavItem>
              <div
                className="cta-orange-button"
                style={{
                  width: "unset",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "2%"
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  navigate("/register");
                }}
              >
                START FOR FREE
              </div>
            </NavItem>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
}

export default Navigation;
