import React from "react";
import "../Styles/NavBar.css";
import { Link } from "react-router-dom";
const NavBar = () => {
  return (
    <div className="NavBarContinner">
      <Link className="NavLinks" to="/">
        <p>HOME</p>
      </Link>
      <Link className="NavLinks" to="/Projects">
        <p>PROJECTS</p>
      </Link>
      <Link className="NavLinks" to="/About">
        <p>ABOUT</p>
      </Link>
      <Link className="NavLinks" to="/Contact">
        <p>CONTACT</p>
      </Link>
    </div>
  );
};

export default NavBar;
