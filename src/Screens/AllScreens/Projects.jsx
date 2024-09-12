import React from "react";
import NavBar from "../../Components/NavBar";
import ProjectsCard from "../../Components/ProjectsCard";
import "../../Styles/Projects.css"

import WeatherImg from "../../assets/Weather App SS/Weather Img.png";
import ecomeimage from "../../assets/ecomeimage.png";




const data=[
    {
        CardImage:WeatherImg,
        CardHeading:"Weather Application",
        CardDetailes:"Developed Weather Application using React Native with Expo for front-end and open source API for realtime data.",
        GitHubLink:"https://github.com/faiziop05/Weather",
    },
    {
        CardImage:ecomeimage,
        CardHeading:"E-commerce",
        CardDetailes:"Developed E-commerce Application using React Native Expo and Restful open source API for Data.",
        GitHubLink:"https://github.com/faiziop05/E-Commerce",
    },
]
const Projects = () => {
  return (
    <div>
      <NavBar />
      <h1 className="ProjectsHeading">Projects</h1>
      <div className="ProjectsCardsWrapper">
        {data.map((item,index)=>{
          return <ProjectsCard key={index} cardImg={item.CardImage} headiing={ item.CardHeading} details={item.CardDetailes} link={item.GitHubLink}/>
        })}
        

      </div>
    </div>
  );
};

export default Projects;
