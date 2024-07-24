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
              I am an international student at Ball State University majoring in
              computer science with a focus on Data Analytics, and I am aspiring
              to be a data scientist or data engineer. I developed interest in
              frontend web design during the COVID-19 pandemic as a way of
              generating income for myself and my college bills. While in the
              programming the world I picked interest in data, which is one of
              the reasons I traveled to the US and also chose Ball State
              University.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
