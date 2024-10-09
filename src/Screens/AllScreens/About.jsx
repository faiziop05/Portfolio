import React, { useEffect, useRef, useState } from "react";
import NavBar from "../../Components/NavBar";
import "../../Styles/About.css"; // Assuming you have a separate CSS file for styling

const About = () => {
  const aboutRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

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
  return (
    <div>
      {/* <NavBar /> */}
      <div
        ref={aboutRef}
        className={`about-section ${isInView ? "in-view" : ""}`}
        id="aboutSection"
      >
        <h1>About Me</h1>
        <div className="AboutParagraphsWrapper">
          <p>
            Hi, I'm Faizan Hanif, a passionate developer with a Bachelor's
            degree in Computer Science. I have over 2 years of experience in
            technologies like React.js, React Native, HTML, CSS, and JavaScript.
          </p>
          <p>
            I enjoy building web and mobile applications, and have worked on
            various projects such as e-commerce apps, weather apps, and a CMS
            system for my final year project. I am always eager to learn new
            technologies and work on innovative projects.
          </p>
        </div>
        <h1>Skills</h1>
        <ul>
          <li>HTML & CSS</li>
          <li>JavaScript</li>
          <li>React.js</li>
          <li>React Native</li>
          <li>Express</li>
          <li>MongoDB</li>
          <li>SQL</li>
          <li>Firebase</li>
          <li>Redux</li>
          <li>Communication</li>
          <li>Problem Solving</li>
          <li>Teamwork</li>
        </ul>
      </div>
      <div className="AboutBottomWhiteIsland"></div>
    </div>
  );
};

export default About;
