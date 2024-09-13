import React from "react";
import NavBar from "../../Components/NavBar";
import "../../Styles/Contact.css";
// Import necessary icons from react-icons
import { FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";

const Contact = () => {
  return (
    <div>
      <NavBar />
      <div className="contact-section">
        <h1>Contact Me</h1>
        <p>
          If you'd like to get in touch, feel free to reach me at any of the
          following platforms:
        </p>
        <ul>
          <h2>Email:</h2>
          <a
            href="mailto:faizanhanif369@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaEnvelope className="icon" />
            <li>faizanhanif369@gmail.com</li>
          </a>

          <h2>LinkedIn:</h2>
          <a
            href="https://www.linkedin.com/in/faizan-hanif-4164a9315"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="icon" />
            <li>www.linkedin.com/in/faizan-hanif-4164a9315</li>
          </a>

          <h2>GitHub:</h2>
          <a
            href="https://github.com/faiziop05"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="icon" />
            <li>https://github.com/faiziop05</li>
          </a>
        </ul>
      </div>
    </div>
  );
};

export default Contact;
