import React from 'react';
import NavBar from '../../Components/NavBar';
import '../../Styles/About.css'; // Assuming you have a separate CSS file for styling

const About = () => {
  return (
    <div>
      <NavBar />
      <div className="about-section">
        <h1>About Me</h1>
        <p>
          Hi, I'm Faizan Hanif, a passionate developer with a Bachelor's degree in Computer Science. I have over 2 years of experience in technologies like React.js, React Native, HTML, CSS, and JavaScript. 
        </p>
        <p>
          I enjoy building web and mobile applications, and have worked on various projects such as e-commerce apps, weather apps, and a CMS system for my final year project. I am always eager to learn new technologies and work on innovative projects.
        </p>
        <h2>Skills</h2>
        <ul>
          <li>JavaScript</li>
          <li>React.js</li>
          <li>React Native</li>
          <li>HTML & CSS</li>
          <li>MongoDB</li>
          <li>SQL</li>
          <li>Express (Beginner to Intermediate)</li>
          <li>Communication</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
