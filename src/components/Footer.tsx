import "./Footer.css";
import { FaGithub, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";
import Logo from "../assets/favicon.ico";

export const Footer = () => {
  const socials = [
    {
      Icon: FaGithub,
      link: "https://github.com/starksinclair",
    },
    {
      Icon: FaLinkedin,
      link: "https://www.linkedin.com/in/sinclair-nzenwata-8a7108236?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    },
    {
      Icon: FaTwitter,
      link: "https://twitter.com/nzenwata_",
    },
    {
      Icon: FaWhatsapp,
      link: "https://wa.me/+12194555261",
    },
  ];
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
