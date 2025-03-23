import { Link, useLocation, useParams } from "react-router-dom";
import "./WorkDetail.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Carousel from "react-bootstrap/Carousel";
import 'bootstrap/dist/css/bootstrap.min.css';
import { works } from "../../utils/project-data";
import { useEffect } from "react";

const workDetails = {
    eng104: {
      title: "ENG104 MONSTER",
      technologies: ["JavaScript", "HTML", "CSS"],
      description: "Explore Monster Evolution Through Media: This interactive timeline, created for my English 104 class, traces the portrayal of monsters in popular culture from their earliest appearances. See how these mythical creatures have been depicted over time and how media representations have evolved. (Responsive web design)",
      challenges: ["Handling user input", "Managing state"],
      solutions: ["Used event listeners", "Implemented state management"],
      status: "Finished",
      externalLink: "https://eng104monster.netlify.app",
    },
    corpstube: {
      title: "Corpstube",
      technologies: ["React", "Node.js", "MongoDB"],
      description: "Train Smarter with CORPTUBE: This custom video streaming platform, designed for Ball State University's Digital Corps, streamlines training content and optimizes the learning experience. (Responsive web design)",
      challenges: ["Database performance", "User authentication"],
      solutions: ["Optimized queries", "Implemented JWT authentication"],
      status: "Finished",
      externalLink: "https://corptube.netlify.app",
    },
    saintly: {
      title: "Saintly",
      technologies: ["HTML", "CSS", "JavaScript"],
      description: "SAINTLY: My First Steps in Web Development: This freelancing website marks my step into the world of web development. It served as a valuable learning experience as I explored the fundamentals of building web applications.",
      challenges: ["Structuring a scalable layout", "Understanding web fundamentals"],
      solutions: ["Used flexbox for responsiveness", "Built reusable components"],
      status: "Finished",
      externalLink: undefined,
    },
    sinchat: {
      title: "Sinchat",
      technologies: ["Java", "Swing"],
      description: "Engage in Playful Conversation with SINCHAT: This interactive chat application utilizes if/else statements to generate fun and unexpected responses to your prompts. Inspired by my Java class, SINCHAT is a testament to the power of code to create engaging experiences.",
      challenges: ["Handling user input dynamically", "Debugging logic errors"],
      solutions: ["Implemented regex matching", "Used debugging tools"],
      status: "Finished",
      externalLink: "https://sinchats.netlify.app",
    },
    poma: {
      title: "Poma",
      technologies: ["WordPress", "PHP", "MySQL"],
      description: "POMA: I developed a custom WordPress CMS to streamline content management for clients and a plugin to seamlessly integrate content into the live site via API endpoints which helped reduced manual intervention, resulting in a more dynamic and user-friendly platform.",
      challenges: ["Building custom API routes", "Optimizing database queries"],
      solutions: ["Created RESTful endpoints", "Indexed tables for performance"],
      status: "Finished",
      externalLink: "https://poma.apsoprojects.org/",
    },
    pantry: {
      title: "Pantry Vision",
      technologies: ["Next.js", "Firebase", "Tailwind CSS", "AI Vision"],
      description: "PANTRY VISION: Developed a pantry management app with AI features, enabling users to track food items, label them with expiration dates, and generate recipes. Integrated camera functionality for easy input, with Firebase backend and Next.js frontend.",
      challenges: ["Implementing camera-based input", "AI-powered labeling"],
      solutions: ["Used Firebase Vision API", "Trained a model for food recognition"],
      status: "Finished",
      externalLink: "https://pantryvision.vercel.app",
    },
    allcentury: {
      title: "All Century Voting",
      technologies: ["Firebase", "React", "Node.js"],
      description: "ALL CENTURY VOTING: I designed the database architecture, implementing secure user authentication and vote validation, and integrating Firebase for real-time data synchronization.",
      challenges: ["Ensuring secure voting", "Real-time updates"],
      solutions: ["Used Firebase authentication", "Implemented Firestore triggers"],
      status: "Finished",
      externalLink: undefined,
    },
    orientation: {
      title: "Orientation Map",
      technologies: ["React", "Leaflet.js"],
      description: "I collaborated with the design and UX teams to develop an interactive orientation map for incoming Ball State freshmen. My primary responsibilities included data collection and map development.",
      challenges: ["Mapping real-world coordinates", "Performance optimization"],
      solutions: ["Used Leaflet.js for mapping", "Implemented lazy loading of data"],
      status: "Finished",
      externalLink: undefined,
    },
    cs200: {
      title: "CS200 - Digital Privacy Explorer",
      technologies: ["React", "JavaScript", "Firebase"],
      description: "Digital Privacy Explorer is an interactive web-based project designed to educate users about the concept of digital fingerprints. The project introduces users to the concept of a 'digital fingerprint,' how it is created, how it is used for tracking, privacy laws and which data is being collected during account creation.",
      challenges: ["Visualizing data privacy concepts", "Ensuring accessibility"],
      solutions: ["Used interactive UI components", "Added ARIA roles and contrast adjustments"],
      status: "Finished",
      externalLink: "https://starksinclair.github.io/cs200_final_project/",
    },
    wheeloflife: {
      title: "Wheel of Life App",
      technologies: ["Next.js", "Firebase", "Tailwind CSS", "Chart.js"],
      description: "A mindfulness and self-improvement app that allows users to assess and track their progress in different life areas through an interactive chart.",
      challenges: ["Dynamic chart rendering", "User data persistence"],
      solutions: ["Used Chart.js", "Integrated Firebase Firestore"],
      status: "On Hold",
      externalLink: "https://wheel-of-life-livid.vercel.app/"
    },
    schoolflow: {
      title: "School Flow",
      technologies: ["React", "TypeScript", "Redux"],
      description: "A high school management software that streamlines administrative and academic workflows.",
      challenges: ["Migrating from JavaScript to TypeScript", "Handling form validation"],
      solutions: ["Refactored components", "Used Yup & React Hook Form"],
        status: "In Progress",
        externalLink: undefined,
    },
    neybank: {
      title: "Ney Bank",
      technologies: ["Django", "React", "PostgreSQL"],
      description: "A fintech app for managing different savings and checking accounts, investment portfolios, and allowing money transfers between accounts at different banks.",
      challenges: ["Security in transactions", "Handling multiple accounts"],
      solutions: ["Implemented encryption", "Designed efficient database models"],
        status: "In Progress",
        externalLink: undefined,
    },
  };
  

export const WorkDetail = () => {
    const { workId } = useParams();
    const location = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);
    const work = workId ? workDetails[workId as keyof typeof workDetails] : undefined;
    const otherWorks = works.filter((work) => work.id !== workId);
  
    if (!work) return <h2 className="text-center text-white">Project not found</h2>;

  
    return (
      <>
      <div className="back-button-container">
        <Link to="/" className="d-flex align-items-center back-button gap-2">
          <span>&#8592;</span> Back to Portfolio </Link>
      </div>
        <div className="work-detail-container">
          <h1>{work.title}</h1>
          <p>{work.description}</p>
          <h3>Status: {work.status}</h3>
          {work.externalLink && (
            <p>
              <a href={work.externalLink} target="_blank" rel="noopener noreferrer">
                View Project
              </a>
            </p>
          )}
          <h3>Technologies Used:</h3>
          <ul>
            {work.technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <h3>Challenges:</h3>
          <ul>
            {work.challenges.map((challenge) => (
              <li key={challenge}>{challenge}</li>
            ))}
          </ul>
          <h3>Solutions:</h3>
          <ul>
            {work.solutions.map((solution) => (
              <li key={solution}>{solution}</li>
            ))}
          </ul>
        </div>
        <div className="other-projects">
          <h2>Other Projects</h2>
          <Carousel className="carousel">
      {otherWorks.map((work) => (
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