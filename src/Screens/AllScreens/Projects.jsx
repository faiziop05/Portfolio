import React, { useEffect, useRef, useState } from "react";
import NavBar from "../../Components/NavBar";
import ProjectsCard from "../../Components/ProjectsCard";
import "../../Styles/Projects.css";

import BlogUI from "../../assets/BlogUI.jpg";
import CMSUI from "../../assets/CMSUI.gif";
import TaskAppUI from "../../assets/TaskAppUI.gif";
import VideosAppUI from "../../assets/VideosAppUI.gif";
import WeatherUI from "../../assets/WeatherUI.gif";
import EComUI from "../../assets/EComUI.gif";
import ChatUI from "../../assets/ChatUI.gif";
import SpecifyItUI from "../../assets/SpecifyItUI.gif";

const data = [
  {
    CardImage: WeatherUI,
    CardHeading: "Weather Application",
    CardDetailes:
      "A Weather mobile application built using React Native, Expo, and the open-source Weather API. The app provides a smooth experience with features like city search, hourly forecasts, and detailed weather data for today's weather.",
    GitHubLink: "https://github.com/faiziop05/Weather",
  },
  {
    CardImage: EComUI,
    CardHeading: "E-commerce",
    CardDetailes:
      "An e-commerce mobile application built using React Native, Expo and open source E-commerce API. The app provides a seamless shopping experience with features like product listing, cart management, and user authentication. The app integrates state management using Redux and navigation with React Navigation.",
    GitHubLink: "https://github.com/faiziop05/E-Commerce",
  },
  {
    CardImage: CMSUI,
    CardHeading: "CMS",
    CardDetailes:
      "The MUST Student Console is built using MERN technology, this system offers a cross-platform mobile application for students and a web interface for faculty (Admin, Coordinator, and Teacher). The app provides seamless access to academic information, course management, and user-friendly interaction for both students and faculty members.",
    GitHubLink: "https://github.com/faiziop05/CMS-Final-Year-Project",
  },
  {
    CardImage: TaskAppUI,
    CardHeading: "Task App",
    CardDetailes:
      "An Task (Todo) mobile application built using React Native, Expo and Firebase for user authentication, authorization, and Data Storage. The app provides a seamless Tasks management with features like Adding, Updating, and Deletion of taks. The app integrates state management using Redux and navigation with React Navigation.",
    GitHubLink: "https://github.com/faiziop05/Task-App",
  },
  {
    CardImage: VideosAppUI,
    CardHeading: "Video App",
    CardDetailes:
      "An Videos browsing mobile application built using React Native, Expo, and the open-source Pixabay API. The app provides a smooth experience with features like infinite scrolling (pagination) and Video caching for optimized loading.",
    GitHubLink: "https://github.com/faiziop05/Video-App-with-pagination-and-caching",
  },
  {
    CardImage: BlogUI,
    CardHeading: "Blog Website",
    CardDetailes:
      "A modern, feature-rich blog website built using React.js and Vite. The website offers content creation, image uploads, and an intuitive text editor to manage posts seamlessly. The project utilizes state management with Redux and integrates Cloudinary for efficient image hosting.",
    GitHubLink: "https://github.com/faiziop05/Blog-Website",
  },
  {
    CardImage: ChatUI,
    CardHeading: "Chatting Website",
    CardDetailes:
      "A modern, real-time chat platform built with React.js and Vite on the frontend, and Express.js, Socket.io, and MongoDB on the backend. The website features seamless real-time messaging, and profile image uploads via Cloudinary.",
    GitHubLink: "https://github.com/faiziop05/chat-website",
  },
  {
    CardImage: SpecifyItUI,
    CardHeading: "SpecifyIt",
    CardDetailes:
      "SpecifyIt is a mobile application built using React Native and the GSM Arena API to explore the specifications of various mobile phones, smartwatches, and tablets. It offers an intuitive way for users to check specifications, compare devices, and browse through the latest tech gadgets. The app implements pagination for smooth data loading and uses React Navigation for seamless transitions between screens.",
    GitHubLink: "https://github.com/faiziop05/SpecifyIt",
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
        threshold: 0.1, // Trigger when 10% of the element is visible
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
        <div
          ref={aboutRef}
          className={`ProjectsCardsWrapper ${isInView ? "in-view" : ""}`}
        >
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
