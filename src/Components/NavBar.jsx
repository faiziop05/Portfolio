import React, { useState } from "react";
import "../Styles/NavBar.css";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for menu

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="NavBarContainer">
      <div className="NavBarLogo">
        <h2>My Portfolio</h2>
      </div>

      <div className={`NavLinksContainer ${menuOpen ? "active" : ""}`}>
        <Link className="NavLinks" to="/" onClick={toggleMenu}>
          <p>HOME</p>
        </Link>
        <Link className="NavLinks" to="/Projects" onClick={toggleMenu}>
          <p>PROJECTS</p>
        </Link>
        <Link className="NavLinks" to="/About" onClick={toggleMenu}>
          <p>ABOUT</p>
        </Link>
        <Link className="NavLinks" to="/Contact" onClick={toggleMenu}>
          <p>CONTACT</p>
        </Link>
      </div>

      <div className="MenuIcon" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />} {/* Switch between open and close icons */}
      </div>
    </nav>
  );
};

export default NavBar;
