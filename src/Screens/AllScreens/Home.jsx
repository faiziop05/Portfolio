import React from "react";
import "../../Styles/Home.css";
import NavBar from "../../Components/NavBar";
import Image from "../../assets/HomeImage.png";
function Home() {
  return (
    <div>
      <div className="HomeSCreenConatiner">
        <NavBar />
        <div className="WelcomeContainer">
          <img src={Image} className="HomeImage" alt="img" />
          <div>
            <h1>Welcome.</h1>
            <p className="welocmeDesc">
              Hello! I'm Faizan Hanif, a dedicated web and Mobile App Developer driven by a
              passion for crafting innovative digital solutions. My expertise
              lies in React.js, React Native Expo, and JavaScript, but I'm
              always eager to explore new technologies. Let's build something
              incredible together!
            </p>
            <p className="exploreText">Explore my projects to see my work in action.</p>
          </div>
        </div>
      </div>
      <div className="HomeBottomWhiteIsland"></div>
    </div>
  );
}

export default Home;
