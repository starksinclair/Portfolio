import { Link, useLocation, useParams } from "react-router-dom";
import "./WorkDetail.css";
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
        <h3>Challenges:</h3>
        <ul>
          {work?.challenges.map((challenge) => (
            <li key={challenge}>{challenge}</li>
          ))}
        </ul>
        <h3>Solutions:</h3>
        <ul>
          {work?.solutions.map((solution) => (
            <li key={solution}>{solution}</li>
          ))}
        </ul>
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
