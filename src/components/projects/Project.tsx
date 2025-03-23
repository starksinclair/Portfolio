import React from "react";
import "./Project.css";
import { Link } from "react-router-dom";
import { works } from "../../utils/project-data";

interface SkillsProps {
  id: string;
}

const categorizedSkills = [
  { category: "FRONTEND DEVELOPMENT", description: "Experience in React, HTML, CSS, JavaScript, React, React Native, Vue and TypeScript. " },
  { category: "FULL STACK DEVELOPMENT", description: "Experience in Node.js, Gemini API, AdonisJS, MySQL, and Firebase." },
  { category: "OTHER TECHNOLOGIES", description: "Experience in Git, AWS, Java, GitHub, RESTful APIs, GraphQL, WordPress, and Wix." }
];

export const Project: React.FC<SkillsProps> = ({ id }) => {
  return (
    <div className="skills-projects" id={id}>
      <h1 className="text">SKILLS & PROJECTS</h1>
      <div className="skills-grid">
        {categorizedSkills.map((skill, index) => (
          <div className="skills-column" key={index}>
            <h2>{skill.category}</h2>
            <p>{skill.description}</p>
            <div className="projects-list">
              {works.filter(work => work.category === skill.category).map(project => (
                <Link to={project.link || "/"} className="project-card" key={project.id}>
                  <img src={project.thumbnail} alt={`${project.title} Thumbnail`} className="thumbnail" />
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
