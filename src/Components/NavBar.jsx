import React, { useState } from "react";
import "../Styles/NavBar.css";
import { Link as ScrollLink } from 'react-scroll'; // Import react-scroll for smooth scrolling
import { FaBars, FaTimes } from "react-icons/fa"; 

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="NavBarContainer">
      <div className="NavBarLogo">
        <h2>Faizan Hanif</h2>
      </div>

      <div className={`NavLinksContainer ${menuOpen ? "active" : ""}`}>
        <ScrollLink
          className="NavLinks"
          to="homeSection"
          smooth={true}
          duration={500}
          onClick={toggleMenu}
        >
          <p>HOME</p>
        </ScrollLink>
        <ScrollLink
          className="NavLinks"
          to="projectsSection"
          smooth={true}
          duration={500}
          onClick={toggleMenu}
        >
          <p>PROJECTS</p>
        </ScrollLink>
        <ScrollLink
          className="NavLinks"
          to="aboutSection"
          smooth={true}
          duration={500}
          onClick={toggleMenu}
        >
          <p>ABOUT</p>
        </ScrollLink>
        <ScrollLink
          className="NavLinks"
          to="contactSection"
          smooth={true}
          duration={500}
          onClick={toggleMenu}
        >
          <p>CONTACT</p>
        </ScrollLink>
      </div>

      <div className="MenuIcon" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default NavBar;
