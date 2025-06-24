import React from "react";
import "./Home.css";
import Gif from "../../assets/Sin1Optimized.gif";
import resume_Img from "../../assets/files/sinclair-nzenwata-resume-4.pdf";
import { About } from "../about/About";
import { Resume } from "../resume/Resume";
import { Contact } from "../contact/Contact";
import { Analytics } from "@vercel/analytics/react";
import { Project } from "../projects/Project";
import { socials } from "../socials/Social";
import NavBar from "../navbar/NavBar";

const Home: React.FC = () => {
  return (
    <>
      <Analytics />
      <header className="header" id="home">
        <NavBar />
        <div className="banner-container">
          <div className="banner-content">
            <p className="owner-name">
              Hi, My name is{" "}
              <span className="user">Sinclair Ihunanyachukwu Nzenwata</span>,
            </p>
            <h3 id="welcome">Welcome to my ocean of creativity</h3>
            <div className="resume">
              <a href={resume_Img} download>
                Download Resume
              </a>
            </div>
            <div className="header-socials">
              {socials.map((social, index) => (
                <a
                  href={social.link}
                  key={index}
                  title={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.Icon />
                </a>
              ))}
            </div>
          </div>
          <div className="banner-img">
            <img src={Gif} alt="Gif" className="banner" />
          </div>
        </div>
      </header>
      <About id="about" />
      <Project id="skills & projects" />
      <Resume id="resume" />
      <Contact id="contact" />
    </>
  );
};

export default Home;
