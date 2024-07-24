import "./Resume.css";
import Resume_Img from "../assets/works/resume.png";
import Resume_file from "../assets/files/sinclair_nzenwata_resume.pdf";

interface ResumeProps {
  id: string;
}
export const Resume: React.FC<ResumeProps> = ({ id }) => {
  return (
    <>
      <div className="resume-container" id={id}>
        <h1 className="text">RESUME</h1>
        <div className="resume-content">
          <div className="resume-card">
            <a href={Resume_Img} download>
              <img src={Resume_Img} alt="Resume" className="resume-img" />
            </a>
            <div className="resumes">
              <a href={Resume_file} download>
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
