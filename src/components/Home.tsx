import React, { useEffect, useState } from "react";
import "./Home.css";
import Gif from "../assets/Sin1.gif";
import resume_Img from "../assets/files/sinclair_nzenwata_resume.pdf";
import { About } from "./About";
import { Skills } from "./Skills";
import { Works } from "./Works";
import { Resume } from "./Resume";
import { Footer } from "./Footer";
import { Contact } from "./Contact";
import { Analytics } from "@vercel/analytics/react";
import { FaBars } from "react-icons/fa";
// import video from "../assets/Online_Freelancing_Explained(720p).mp4";

interface HomeProps {
  name: string;
}
const nav_link = ["Home", "About", "Skills", "Projects", "Resume", "Contact"];

const Home: React.FC<HomeProps> = ({ name }) => {
  const [showNav, setShowNav] = useState(false);

  const handleNav = () => {
    setShowNav(!showNav);
  };
  useEffect(() => {
    window.addEventListener("scroll", () => {
      const scrollHeight = window.scrollY;
      console.log(scrollHeight);
      const nav = document.querySelector(".nav-item");
      const navHeight = nav?.getBoundingClientRect().height;
      console.log("kdkdk" + navHeight);
      if (scrollHeight > navHeight!) {
        nav?.classList.add("fixed-nav");
      } else {
        nav?.classList.remove("fixed-nav");
      }
    });
  }, []);
  return (
    <>
      <Analytics />
      <header className="header" id="home">
        <nav className="navbar">
          {/* <div className="logo">
          <h4>Portfolio</h4>
        </div> */}

          <ul className="nav-link-container">
            <li className={`nav-item `}>
              {nav_link.map((link, index) => (
                <a
                  href={`#${link.toLowerCase()}`}
                  className={`nav-link ${showNav ? "show-nav" : ""}`}
                  key={index}
                >
                  {link}
                </a>
              ))}
              <div className="nav-icon" onClick={handleNav}>
                <FaBars />
              </div>
            </li>
          </ul>
        </nav>
        <div className="banner-img">
          <img src={Gif} alt="Gif" className="banner" />
          <div className="">
            <p className="owner-name">Hi, My name is Sinclair Nzenwata,</p>
            <h3 id="welcome" className="">
              Welcome <i className="user"> {name} </i> to my ocean of creativity
            </h3>
            <div className="resume">
              <a href={resume_Img} download>
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </header>
      <About id="about" />
      <Skills id="skills" />
      <Works id="projects" />
      <Resume id="resume" />
      <Contact id="contact" />
      <Footer />
    </>
  );
};

export default Home;
