import "./Works.css";
import Eng104 from "../assets/works/ENG104_ Monster.png";
import Corptube from "../assets/works/Corpstube.png";
import Saintly from "../assets/works/Saintly.png";
import Sinchat from "../assets/works/Sinchat.png";
import Poma from "../assets/works/poma.png";
import Pantry from "../assets/works/pantry_vision.png";
import AllCenturry from "../assets/works/all_century_voting.png";
import OrientationMap from "../assets/works/orientation_map.png";
import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";

interface WorksProps {
  id: string;
}
interface Work {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  link: string | undefined;
}
export const Works: React.FC<WorksProps> = ({ id }) => {
  const [submitted, setSubmitted] = useState<string | null>(null);
  const works: Work[] = [
    {
      id: "project1",
      title: "ENG104 MONSTER",
      thumbnail: Eng104,
      description:
        "Explore Monster Evolution Through Media: This interactive timeline, created for my English 104 class, traces the portrayal of monsters in popular culture from their earliest appearances. See how these mythical creatures have been depicted over time and how media representations have evolved. (Responsive web design)",
      link: "https://eng104monster.netlify.app",
    },
    {
      id: "project2",
      title: "CORPTUBE",
      thumbnail: Corptube,
      description:
        "Train Smarter with CORPTUBE: This custom video streaming platform, designed for Ball State University's Digital Corps, streamlines training content and optimizes the learning experience. (Responsive web design)",
      link: "https://corptube.netlify.app",
    },
    {
      id: "project3",
      title: "SAINTLY",
      thumbnail: Saintly,
      description:
        "SAINTLY: My First Steps in Web Development: This freelancing website marks my step into the world of web development. It served as a valuable learning experience as I explored the fundamentals of building web applications.",
      link: undefined,
    },
    {
      id: "project4",
      title: "SINCHAT",
      thumbnail: Sinchat,
      description:
        "Engage in Playful Conversation with SINCHAT: This interactive chat application utilizes if/else statements to generate fun and unexpected responses to your prompts. Inspired by my Java class, SINCHAT is a testament to the power of code to create engaging experiences.",
      link: "https://sinchats.netlify.app",
    },
    {
      id: "project5",
      title: "POMA",
      thumbnail: Poma,
      description:
        "POMA: I developed a custom WordPress CMS to streamline content management for clients and a plugin to seamlessly integrate content into the live site via API endpoints which helped reduced manual intervention, resulting in a more dynamic and user-friendly platform. ",
      link: undefined,
    },
    {
      id: "project6",
      title: "PANTRY VISION",
      thumbnail: Pantry,
      description:
        "PANTRY VISION: Developed a pantry management app with Al features, enabling users tc track food items, label them with expiration dates, and generate recipes. Integrated camera functionality for easy input, with Firebase backend and Next. is frontend.",
      link: "https://pantryvision.vercel.app",
    },
    {
      id: "project7",
      title: "ALL CENTURRY VOTING",
      thumbnail: AllCenturry,
      description:
        "ALL CENTURRY VOTING: I designed the database architecture, implementing secure user authentication and vote validation, and integrating Firebase for real-time data synchronization. ",
      link: undefined,
    },
    {
      id: "project8",
      title: "ORIENTATION MAP",
      thumbnail: OrientationMap,
      description:
        "I collaborated with the design and UX teams to develop an interactive orientation map for incoming Ball State freshmen. My primary responsibilities included data collection and map development.",
      link: undefined,
    },
  ];
  const handleLinkClick = (link: string | undefined) => {
    if (!link) {
      setSubmitted("Link not available");
    }
  };

  return (
    <>
      <div className="works" id={id}>
        <h1 className="text">PROJECTS</h1>
        <div className="works-content">
          {works.map((work, index) => (
            <div className="work-card" key={index}>
              <a
                href={work.link}
                target="_blank"
                aria-disabled
                onClick={() => handleLinkClick(work.link)}
              >
                <img
                  src={work.thumbnail}
                  alt={`${work.title} Thumbnail`}
                  className="thumbnail"
                />
                <h2>{work.title}</h2>
                <p>{work.description}</p>
              </a>
              <Snackbar
                open={Boolean(submitted)}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                onClose={() => setSubmitted(null)}
              >
                <Alert onClose={() => setSubmitted(null)} severity="info">
                  {submitted || "An error occurred."}
                </Alert>
              </Snackbar>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
