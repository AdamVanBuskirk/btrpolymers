import { useState, useEffect } from 'react';
import { useAppSelector, useIsMobile } from '../Core/hooks';
import { Link, useNavigate } from 'react-router-dom';

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


  const navigate = useNavigate();
  const [logoPath, setLogoPath] = useState("/");

  const isMobile = useIsMobile();

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
          style={{ width: "75px", cursor: "pointer" }}
          src="/images/btr-green-arrow.gif"
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
          <NavItem>
            <Link to="/integrations" onClick={() => setIsOpen(false)} className="nav-link">About</Link>
          </NavItem>
          <NavItem>
            <Link to="/advisors" onClick={() => setIsOpen(false)} className="nav-link">Contact</Link>
          </NavItem>
          <NavItem>
            <Link to="/pricing" onClick={() => setIsOpen(false)} className="nav-link">Services</Link>
          </NavItem>
          <NavItem>
            <Link to="/login" onClick={() => setIsOpen(false)} className="nav-link">We Buy</Link>
          </NavItem>
          <NavItem>
            <Link to="/login" onClick={() => setIsOpen(false)} className="nav-link">We Sell</Link>
          </NavItem>
  

     
        </Nav>
      </Collapse>
    </Navbar>
  );
}

export default Navigation;
