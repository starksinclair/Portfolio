import "./Footer.css";
// import { FaGithub, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";
import Logo from "../assets/favicon.ico";
import { socials } from "./socials/Social";

export const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <img src={Logo} alt="logo" />
            <p>&copy; Sinclair Nzenwata 2024</p>
          </div>
          <div className="socials">
            {socials.map((social, index) => (
              <a
                title="social icons"
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.Icon />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
};
