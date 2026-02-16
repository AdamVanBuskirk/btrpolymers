import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../Core/hooks';

import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem
} from "reactstrap";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [logoPath] = useState("/");
  const isMobile = useIsMobile();

  const toggle = () => setIsOpen(prev => !prev);

  const whiteHamburgerIcon = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='white' stroke-width='2' stroke-linecap='round' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\")"
  };

  const navbarStyle: React.CSSProperties = {
    paddingTop: 0,
    paddingBottom: 0,
    width: "100%",
    zIndex: 9999,
    boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
    position: isMobile ? "fixed" : "sticky",
    top: 0,
    left: 0,
    right: 0,
  };
  

  return (
    <>
    <Navbar expand="xl" light className="px-3" style={navbarStyle}>
      <NavbarBrand tag={Link} to={logoPath} className="logoLink">
        <img
          style={{ width: "75px", cursor: "pointer" }}
          src="/images/btr-green-arrow.gif"
          alt="BTR Polymers"
        />
      </NavbarBrand>

      <NavbarToggler onClick={toggle} className="ms-auto">
        <span className="navbar-toggler-icon" style={whiteHamburgerIcon} />
      </NavbarToggler>

      <Collapse isOpen={isOpen} navbar className="justify-content-end">
        <Nav navbar className="ms-auto">
          <NavItem>
            <NavLink to="/solutions" onClick={() => setIsOpen(false)} className="nav-link">
              Solutions
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink to="/materials" onClick={() => setIsOpen(false)} className="nav-link">
              Materials
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink to="/about" onClick={() => setIsOpen(false)} className="nav-link">
              About
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink to="/contact" onClick={() => setIsOpen(false)} className="nav-link">
              Contact
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink to="/careers" onClick={() => setIsOpen(false)} className="nav-link">
              Careers
            </NavLink>
          </NavItem>

          <a href="tel:+18336602281" style={{ color: "#fff", textDecoration: "none" }}>(234) 602-4211</a>

        </Nav>
      </Collapse>
    </Navbar>
    <div style={{ marginBottom: isMobile ? "86px" : "0px" }}>
      {/* filler to adjust for height of navbar */}
    </div>
    </>
  );
}

export default Navigation;
