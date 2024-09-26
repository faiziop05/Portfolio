import React, { useEffect, useRef, useState } from "react";
import NavBar from "../../Components/NavBar";
import "../../Styles/Contact.css";
// Import necessary icons from react-icons
import { FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";
import { useForm, ValidationError } from "@formspree/react";
const Contact = () => {
  const aboutRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [state, handleSubmit] = useForm("xgvwgewo");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(aboutRef.current); // Stop observing once in view
        }
      },
      {
        threshold: 0.3, // Trigger when 10% of the element is visible
      }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => {
      if (aboutRef.current) observer.unobserve(aboutRef.current);
    };
  }, []);

  useEffect(() => {
    if (state.succeeded) {
      return;
    }
  }, []);
  return (
    <div>
      <div
        ref={aboutRef}
        className={`contact-section ${isInView ? "in-view" : ""}`}
        id="contactSection"
      >
        <h1>Contact Me</h1>
        <form
          action="https://formspree.io/f/xgvwgewo"
          method="POST"
          onSubmit={handleSubmit}
          className="contact-form"
        >
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input id="email" type="email" name="email" required />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" required></textarea>
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
            />
          </div>
          {state.succeeded ? <p> Form Submitted</p> : ""}

          <button
            type="submit"
            disabled={state.submitting}
            className="submit-btn"
          >
            Submit
          </button>
        </form>
        <h3 className="orContactPara">Or you can Reach me at</h3>
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
      <div className="ContactBottomWhiteIsland"></div>
      <h4 style={{textAlign:"center",marginTop:100}}>© 2024 Faizan Hanif</h4>
    </div>
  );
};

export default Contact;
