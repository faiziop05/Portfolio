import React from "react";
import "../Styles/ProjectCard.css";
import gitHubIcon from "../assets/github-mark-white.png";
const ProjectsCard = ({cardImg,headiing,details,link}) => {
  return (
    <div className="ProjectCardContiner">
      <img src={cardImg} alt="" />
      <h1>{headiing}</h1>
      <p>{details}</p>
      <h3>
        Source Code at:
        <a target="_blank" href={link}>
          <img className="gitHubIcon" src={gitHubIcon} alt="" />
        </a>
      </h3>
    </div>
  );
};

export default ProjectsCard;
