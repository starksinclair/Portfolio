import { Link, useLocation, useParams } from "react-router-dom";
import "./ProjectDetail.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { usePortfolio } from "../../context/usePortfolio";
import Loading from "../loading/Loading";

export const WorkDetail = () => {
  const { workId } = useParams();
  const location = useLocation();
  const { works, error, loading } = usePortfolio();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const work = works.find((work) => work.id === workId);
  const otherWorks = works.filter((work) => work.id !== workId);

  if (loading) return <Loading />;
  if (!work)
    return <h2 className="text-center text-white">Project not found</h2>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <>
      <div className="back-button-container">
        <Link
          to="/#skills & projects"
          className="d-flex align-items-center back-button gap-2"
        >
          <span>&#8592;</span> Back to Home{" "}
        </Link>
      </div>
      <div className="work-detail-container">
        <h1>{work?.title}</h1>
        <p>{work?.description}</p>
        <h3>Status: {work.status}</h3>
        {work.externalLink && (
          <p>
            <a
              href={work.externalLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Project
            </a>
          </p>
        )}
        <h3>Technologies Used:</h3>
        <ul>{work?.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul>
        <h3>User Stories</h3>
        <ul>
          {work?.userStories?.length === 0 && (
            <li>No user stories available for this project.</li>
          )}
          {work?.userStories?.map((story) => <li key={story}>{story}</li>)}
        </ul>
        <h3>Development Journey:</h3>
        <div className="timeline">
          {work.challenges.map((challenge, index) => (
            <div className="timeline-item fade-in" key={`journey-${index}`}>
              <div className="timeline-icon challenge">🚧</div>
              <div className="timeline-content">
                <h4>Challenge {index + 1}</h4>
                <p>{challenge}</p>
              </div>
              {work.solutions[index] && (
                <>
                  <div className="timeline-icon solution">✅</div>
                  <div className="timeline-content">
                    <h4>Solution {index + 1}</h4>
                    <p>{work.solutions[index]}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="other-projects">
        <h2>Other Projects</h2>
        <Carousel className="carousel">
          {otherWorks?.map((work) => (
            <Carousel.Item key={work.id} className="carousel-item">
              <Link to={work.link || ""} className="d-block text-center">
                <img
                  src={work.thumbnail}
                  alt={`${work.title} Thumbnail`}
                  className="d-block w-100"
                />
                <Carousel.Caption className="carousel-caption">
                  <h3>{work.title}</h3>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </>
  );
};
