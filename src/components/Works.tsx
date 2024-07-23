import "./Works.css";
import Eng104 from "../assets/works/ENG104_ Monster.png";
import Corptube from "../assets/works/Corpstube.png";
import Saintly from "../assets/works/Saintly.png";
import Sinchat from "../assets/works/Sinchat.png";

interface WorksProps {
  id: string;
}
export const Works: React.FC<WorksProps> = ({ id }) => {
  const works = [
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
      link: "http://127.0.0.1:500/home.html",
    },
    {
      id: "project4",
      title: "SINCHAT",
      thumbnail: Sinchat,
      description:
        "Engage in Playful Conversation with SINCHAT: This interactive chat application utilizes if/else statements to generate fun and unexpected responses to your prompts. Inspired by my Java class, SINCHAT is a testament to the power of code to create engaging experiences.",
      link: "https://sinchats.netlify.app",
    },
  ];

  return (
    <>
      <div className="works" id={id}>
        <h1 className="text">PROJECTS</h1>
        <div className="works-content">
          {works.map((work, index) => (
            <div className="work-card" key={index}>
              <a href={work.link} target="_blank" aria-disabled>
                <img
                  src={work.thumbnail}
                  alt={`${work.title} Thumbnail`}
                  className="thumbnail"
                />
                <h2>{work.title}</h2>
                <p>{work.description}</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
