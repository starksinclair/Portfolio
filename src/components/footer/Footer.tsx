import "./Footer.css";
import { socials } from "../socials/Social";

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <p>&copy; Sinclair Nzenwata {year}</p>
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
