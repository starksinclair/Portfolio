import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";

const nav_link = ["Home", "About", "Skills & Projects", "Resume", "Contact"];
const NavBar: React.FC = () => {
    const [showNav, setShowNav] = useState(false);
    const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = window.scrollY;
      setScrolled(scrollHeight > 50);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <nav className={`navbar-wrapper ${scrolled ? "fixed-mobile-nav" : ""}`}>
      <ul
        className={`nav-link-container ${
          (showNav ? "show-nav" : "hide-nav")
        } 
     ${scrolled ? "fixed-nav" : ""}
        `}
      >
        {nav_link.map((link, index) => (
          <li className="nav-item" key={index}>
            <a
              href={`#${link.toLowerCase()}`}
              className="nav-links"
              onClick={() => setShowNav(false)}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
        <div className="nav-icon" onClick={() => setShowNav(!showNav)}>
          {showNav ? <FaTimes /> : <FaBars />}
        </div>
    </nav>
  );
};

export default NavBar;
