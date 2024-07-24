import React, { useEffect, useState } from "react";
import "./Home.css";
import Gif from "../assets/Sin1Optimized.gif";
import resume_Img from "../assets/files/sinclair_nzenwata_resume.pdf";
import { About } from "./About";
import { Skills } from "./Skills";
import { Works } from "./Works";
import { Resume } from "./Resume";
import { Footer } from "./Footer";
import { Contact } from "./Contact";
import { Analytics } from "@vercel/analytics/react";
import { FaBars, FaTimes } from "react-icons/fa";
import { socials } from "./socials/Social";

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
    const handleScroll = () => {
      const scrollHeight = window.scrollY;
      const nav = document.querySelector(".nav-link-container");
      const navbar = document.querySelector(".navbar");
      const navbarHeight = navbar?.getBoundingClientRect().height;
      const navHeight = nav?.getBoundingClientRect().height;

      if (scrollHeight > navHeight!) {
        nav?.classList.add("fixed-nav");
      } else {
        nav?.classList.remove("fixed-nav");
      }

      if (scrollHeight > navbarHeight!) {
        navbar?.classList.add("fixed-navbar");
      } else {
        navbar?.classList.remove("fixed-navbar");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Analytics />
      <header className="header" id="home">
        <nav className="navbar">
          <ul className={`nav-link-container ${showNav ? "show-nav" : ""}`}>
            {nav_link.map((link, index) => (
              <li className="nav-item" key={index}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="nav-link"
                  onClick={() => setShowNav(false)}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-icon" onClick={handleNav}>
            {showNav ? <FaTimes /> : <FaBars />}
          </div>
        </nav>
        <div className="banner-container">
          <div className="banner-content">
            <p className="owner-name">Hi, My name is Sinclair Nzenwata,</p>
            <h3 id="welcome">
              Welcome <i className="user"> {name} </i> to my ocean of creativity
            </h3>
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
      <Skills id="skills" />
      <Works id="projects" />
      <Resume id="resume" />
      <Contact id="contact" />
      <Footer />
    </>
  );
};

export default Home;
