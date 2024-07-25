// import React from 'react'
import "./About.css";
import Profile_pic from "../assets/profile_pic1.jpg";

interface AboutProps {
  id: string;
}

export const About: React.FC<AboutProps> = ({ id }) => {
  return (
    <>
      <section className="about" id={id}>
        <h1 className="text">ABOUT</h1>
        <div className="about-content">
          <div className="profile_pic">
            <img src={Profile_pic} alt="Profile_pic" className="img" />
          </div>
          <div className="about-text">
            <h2>Sinclair Nzenwata</h2>
            <h3>Software Developer</h3>
            <code>nzenwatasinclair@gmail.com</code>
            <p>
              As an international student at Ball State University majoring in
              Computer Science with a focus on Data Analytics, I'm passionate
              about the intersection of data, AI, and technology. My journey
              began with frontend web design during the pandemic, which opened
              doors to the fascinating world of programming and data science.
              Driven by the transformative potential of AI and machine learning,
              I'm pursuing my dream of becoming a data scientist or data
              engineer. I'm excited about leveraging cutting-edge technologies
              to uncover insights from data and create intelligent systems that
              can make a positive impact. At Ball State, I'm constantly
              expanding my skills in data analytics, machine learning, and AI
              applications. I'm eager to contribute to the AI revolution and
              tackle complex challenges in our increasingly data-driven world.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
