import React, { useEffect, useRef, useState } from "react";
import NavBar from "../../Components/NavBar";
import ProjectsCard from "../../Components/ProjectsCard";
import "../../Styles/Projects.css";

import WeatherImg from "../../assets/Weather App SS/Weather Img.png";
import ecomeimage from "../../assets/ecomeimage.png";

const data = [
  {
    CardImage: WeatherImg,
    CardHeading: "Weather Application",
    CardDetailes:
      "Developed Weather Application using React Native with Expo for front-end and open source API for realtime data.",
    GitHubLink: "https://github.com/faiziop05/Weather",
  },
  {
    CardImage: ecomeimage,
    CardHeading: "E-commerce",
    CardDetailes:
      "Developed E-commerce Application using React Native Expo and Restful open source API for Data.",
    GitHubLink: "https://github.com/faiziop05/E-Commerce",
  },
];
const Projects = () => {
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
        threshold: 0.2, // Trigger when 10% of the element is visible
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
      <div className="ProjectsContainer " id="projectsSection">
        <h1 className="ProjectsHeading">Projects</h1>
        <div         ref={aboutRef} className={`ProjectsCardsWrapper ${isInView ? "in-view" : ""}`}>
          {data.map((item, index) => {
            return (
              <ProjectsCard
                key={index}
                cardImg={item.CardImage}
                headiing={item.CardHeading}
                details={item.CardDetailes}
                link={item.GitHubLink}
              />
            );
          })}
        </div>
      </div>
      <div className="ProjectsBottomWhiteIsland"></div>
    </div>
  );
};

export default Projects;
