import React, { useEffect, useRef, useState } from "react";
import "../../Styles/Home.css";
import NavBar from "../../Components/NavBar";
import Image from "../../assets/HomeImage.png";
function Home() {
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
      <div
        ref={aboutRef}
        className={`HomeSCreenConatiner ${isInView ? "in-view" : ""}`}
        id="homeSection"
      >
        <NavBar />
        <div className="WelcomeContainer">
          <img src={Image} className="HomeImage" alt="img" />
          <div>
            <h1>Welcome.</h1>
            <p className="welocmeDesc">
              Hello! I'm Faizan Hanif, a dedicated web and Mobile App Developer
              driven by a passion for crafting innovative digital solutions. My
              expertise lies in React.js, React Native Expo, and JavaScript, but
              I'm always eager to explore new technologies. Let's build
              something incredible together!
            </p>
            <p className="exploreText">
              Explore my projects to see my work in action.
            </p>
          </div>
        </div>
      </div>
      <div className="HomeBottomWhiteIsland"></div>
    </div>
  );
}

export default Home;
