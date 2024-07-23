// import React from 'react'
import "./Skills.css";
interface SkillsProps {
  id: string;
}
export const Skills: React.FC<SkillsProps> = ({ id }) => {
  const skills = [
    {
      category: "FRONTEND DEVELOPMENT",
      description:
        "I have experience in building websites using HTML, CSS, JavaScript and Typescript. I have also worked with React, and I am currently learning Svelte.js.",
    },
    {
      category: "BACKEND DEVELOPMENT",
      description:
        "I have experience in building server-side applications using Adonis. I have also worked with databases like Sequel Ace, MongoDB and MySQL.",
    },
    {
      category: "OTHER TECHNOLOGIES",
      description:
        "I have experience in using version control systems like Git and GitHub. I have also worked with RESTful APIs and GraphQL.",
    },
  ];

  return (
    <>
      <div className="skills" id={id}>
        <h1 className="text">SKILLS</h1>
        <div className="skills-content">
          {skills.map((skill, index) => (
            <div className="skills-card" key={index}>
              <h2>{skill.category}</h2>
              <p>{skill.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
