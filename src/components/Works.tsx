import "./Works.css";
import { Link } from "react-router-dom";
import { works } from "../utils/project-data";

interface WorksProps {
  id: string;
}
export const Works: React.FC<WorksProps> = ({ id }) => {

  return (
    <>
      <div className="works" id={id}>
        <h1 className="text">PROJECTS</h1>
        <div className="works-content">
          {works.map((work, index) => (
            <Link to={work.link || "/"} className="work-card" key={index}>
                <img
                  src={work.thumbnail}
                  alt={`${work.title} Thumbnail`}
                  className="thumbnail"
                />
                <h2>{work.title}</h2>
                <p>{work.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
