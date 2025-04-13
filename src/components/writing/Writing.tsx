import "../resume/Resume.css";
import Memo_File from "../../assets/docs/ENG231 - Memo.pdf";
import Memo_Img from "../../assets/docs/preview_memo.png";

interface WritingProps {
  id: string;
}
export const Writing: React.FC<WritingProps> = ({ id }) => {
  return (
    <>
      <div className="resume-container" id={id}>
        <h1 className="text">ENG231: PROFESSIONAL WRITING</h1>
        <p>
          A professional memo drafted in ENG 231 addressing the elimination of
          casual Friday at a company. This document demonstrates proper memo
          formatting and effective communication of unfavorable news while
          maintaining professional tone and company relationships.
        </p>
        <div className="resume-content">
          <div className="resume-card">
            <a href={Memo_Img} download>
              <img src={Memo_Img} alt="Resume" className="resume-img" />
            </a>
            <div className="resumes">
              <a href={Memo_File} download={"sinclair-nzenwata-resume"}>
                Download File
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
