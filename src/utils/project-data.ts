import Eng104 from "../assets/works/ENG104_ Monster.png";
import Corptube from "../assets/works/Corpstube.png";
import Saintly from "../assets/works/Saintly.png";
import Sinchat from "../assets/works/Sinchat.png";
import Poma from "../assets/works/poma.png";
import Pantry from "../assets/works/pantry_vision.png";
import AllCenturry from "../assets/works/all_century_voting.png";
import OrientationMap from "../assets/works/orientation_map.png";
import WheelOfLife from "../assets/works/wheel_of_life.png";
import SchoolFlow from "../assets/works/school_flow.png";
import NeyBank from "../assets/works/ney_bank.png";
import CS200 from "../assets/works/CS200.png";

interface Work {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  link: string | undefined;
  category:
    | "FRONTEND DEVELOPMENT"
    | "BACKEND DEVELOPMENT"
    | "OTHER TECHNOLOGIES"
    | "FULL STACK DEVELOPMENT";
}

export const works: Work[] = [
  {
    id: "eng104",
    title: "ENG104 MONSTER",
    thumbnail: Eng104,
    description:
      "Explore Monster Evolution Through Media: This interactive timeline, created for my English 104 class, traces the portrayal of monsters in popular culture from their earliest appearances. See how these mythical creatures have been depicted over time and how media representations have evolved. (Responsive web design)",
    link: "/works/eng104",
    category: "FRONTEND DEVELOPMENT",
  },
  {
    id: "corpstube",
    title: "Corpstube",
    thumbnail: Corptube,
    description:
      "Train Smarter with CORPTUBE: This custom video streaming platform, designed for Ball State University's Digital Corps, streamlines training content and optimizes the learning experience. (Responsive web design)",
    link: "/works/corpstube",
    category: "FRONTEND DEVELOPMENT",
  },
  {
    id: "saintly",
    title: "Saintly",
    thumbnail: Saintly,
    description:
      "SAINTLY: My First Steps in Web Development: This freelancing website marks my step into the world of web development. It served as a valuable learning experience as I explored the fundamentals of building web applications.",
    link: "/works/saintly",
    category: "FRONTEND DEVELOPMENT",
  },
  {
    id: "sinchat",
    title: "Sinchat",
    thumbnail: Sinchat,
    description:
      "Engage in Playful Conversation with SINCHAT: This interactive chat application utilizes if/else statements to generate fun and unexpected responses to your prompts. Inspired by my Java class, SINCHAT is a testament to the power of code to create engaging experiences.",
    link: "/works/sinchat",
    category: "FRONTEND DEVELOPMENT",
  },
  {
    id: "poma",
    title: "Poma",
    thumbnail: Poma,
    description:
      "POMA: I developed a custom WordPress CMS to streamline content management for clients and a plugin to seamlessly integrate content into the live site via API endpoints which helped reduced manual intervention, resulting in a more dynamic and user-friendly platform. ",
    link: "/works/poma",
    category: "OTHER TECHNOLOGIES",
  },
  {
    id: "pantry",
    title: "Pantry Vision",
    thumbnail: Pantry,
    description:
      "PANTRY VISION: Developed a pantry management app with Al features, enabling users tc track food items, label them with expiration dates, and generate recipes. Integrated camera functionality for easy input, with Firebase backend and Next. is frontend.",
    link: "/works/pantry",
    category: "FULL STACK DEVELOPMENT",
  },
  {
    id: "allcentury",
    title: "All Century Voting",
    thumbnail: AllCenturry,
    description:
      "ALL CENTURRY VOTING: I designed the database architecture, implementing secure user authentication and vote validation, and integrating Firebase for real-time data synchronization. ",
    link: "/works/allcentury",
    category: "FULL STACK DEVELOPMENT",
  },
  {
    id: "orientation",
    title: "Orientation Map",
    thumbnail: OrientationMap,
    description:
      "I collaborated with the design and UX teams to develop an interactive orientation map for incoming Ball State freshmen. My primary responsibilities included data collection and map development.",
    link: "/works/orientation",
    category: "FRONTEND DEVELOPMENT",
  },
  {
    id: "cs200",
    title: "CS200",
    thumbnail: CS200,
    description:
      "Digital Privacy Explorer is an interactive web-based project designed to educate users about the concept of digital fingerprints. The project introduces users to the concept of a 'digital fingerprint,' how it is created, how it is used for tracking, privacy laws and which data is being collected during account creation.",
    link: "/works/cs200",
    category: "FRONTEND DEVELOPMENT",
  },
  {
    id: "wheeloflife",
    category: "FULL STACK DEVELOPMENT",
    title: "Wheel of Life App",
    thumbnail: WheelOfLife,
    description:
      "A mindfulness and self-improvement app that allows users to assess and track their progress in different life areas through an interactive chart.",
    link: "/works/wheeloflife",
  },
  {
    id: "schoolflow",
    category: "FRONTEND DEVELOPMENT",
    title: "School Flow",
    thumbnail: SchoolFlow,
    description:
      "A high school management software that streamlines administrative and academic workflows.",
    link: "/works/schoolflow",
  },
  {
    id: "neybank",
    category: "FULL STACK DEVELOPMENT",
    title: "Ney Bank",
    thumbnail: NeyBank,
    description:
      "A fintech app for managing different savings and checking accounts, investment portfolios, and allowing money transfers between accounts at different banks.",
    link: "/works/neybank",
  },
];

export const workDetails = {
  eng104: {
    title: "ENG104 MONSTER",
    technologies: ["JavaScript", "HTML", "CSS"],
    description:
      "Explore Monster Evolution Through Media: This interactive timeline, created for my English 104 class, traces the portrayal of monsters in popular culture from their earliest appearances. See how these mythical creatures have been depicted over time and how media representations have evolved. (Responsive web design)",
    challenges: ["Handling user input", "Managing state"],
    solutions: ["Used event listeners", "Implemented state management"],
    status: "Finished",
    externalLink: "https://eng104monster.netlify.app",
  },
  corpstube: {
    title: "Corpstube",
    technologies: ["React", "Node.js", "MongoDB"],
    description:
      "Train Smarter with CORPTUBE: This custom video streaming platform, designed for Ball State University's Digital Corps, streamlines training content and optimizes the learning experience. (Responsive web design)",
    challenges: ["Database performance", "User authentication"],
    solutions: ["Optimized queries", "Implemented JWT authentication"],
    status: "Finished",
    externalLink: "https://corptube.netlify.app",
  },
  saintly: {
    title: "Saintly",
    technologies: ["HTML", "CSS", "JavaScript"],
    description:
      "SAINTLY: My First Steps in Web Development: This freelancing website marks my step into the world of web development. It served as a valuable learning experience as I explored the fundamentals of building web applications.",
    challenges: [
      "Structuring a scalable layout",
      "Understanding web fundamentals",
    ],
    solutions: ["Used flexbox for responsiveness", "Built reusable components"],
    status: "Finished",
    externalLink: undefined,
  },
  sinchat: {
    title: "Sinchat",
    technologies: ["Java", "Swing"],
    description:
      "Engage in Playful Conversation with SINCHAT: This interactive chat application utilizes if/else statements to generate fun and unexpected responses to your prompts. Inspired by my Java class, SINCHAT is a testament to the power of code to create engaging experiences.",
    challenges: ["Handling user input dynamically", "Debugging logic errors"],
    solutions: ["Implemented regex matching", "Used debugging tools"],
    status: "Finished",
    externalLink: "https://sinchats.netlify.app",
  },
  poma: {
    title: "Poma",
    technologies: ["WordPress", "PHP", "MySQL"],
    description:
      "POMA: I developed a custom WordPress CMS to streamline content management for clients and a plugin to seamlessly integrate content into the live site via API endpoints which helped reduced manual intervention, resulting in a more dynamic and user-friendly platform.",
    challenges: ["Building custom API routes", "Optimizing database queries"],
    solutions: ["Created RESTful endpoints", "Indexed tables for performance"],
    status: "Finished",
    externalLink: "https://poma.apsoprojects.org/",
  },
  pantry: {
    title: "Pantry Vision",
    technologies: ["Next.js", "Firebase", "Tailwind CSS", "AI Vision"],
    description:
      "PANTRY VISION: Developed a pantry management app with AI features, enabling users to track food items, label them with expiration dates, and generate recipes. Integrated camera functionality for easy input, with Firebase backend and Next.js frontend.",
    challenges: ["Implementing camera-based input", "AI-powered labeling"],
    solutions: [
      "Used Firebase Vision API",
      "Trained a model for food recognition",
    ],
    status: "Finished",
    externalLink: "https://pantryvision.vercel.app",
  },
  allcentury: {
    title: "All Century Voting",
    technologies: ["Firebase", "React", "Node.js"],
    description:
      "ALL CENTURY VOTING: I designed the database architecture, implementing secure user authentication and vote validation, and integrating Firebase for real-time data synchronization.",
    challenges: ["Ensuring secure voting", "Real-time updates"],
    solutions: [
      "Used Firebase authentication",
      "Implemented Firestore triggers",
    ],
    status: "Finished",
    externalLink: undefined,
  },
  orientation: {
    title: "Orientation Map",
    technologies: ["React", "Leaflet.js"],
    description:
      "I collaborated with the design and UX teams to develop an interactive orientation map for incoming Ball State freshmen. My primary responsibilities included data collection and map development.",
    challenges: ["Mapping real-world coordinates", "Performance optimization"],
    solutions: [
      "Used Leaflet.js for mapping",
      "Implemented lazy loading of data",
    ],
    status: "Finished",
    externalLink: undefined,
  },
  cs200: {
    title: "CS200 - Digital Privacy Explorer",
    technologies: ["React", "JavaScript", "Firebase"],
    description:
      "Digital Privacy Explorer is an interactive web-based project designed to educate users about the concept of digital fingerprints. The project introduces users to the concept of a 'digital fingerprint,' how it is created, how it is used for tracking, privacy laws and which data is being collected during account creation.",
    challenges: ["Visualizing data privacy concepts", "Ensuring accessibility"],
    solutions: [
      "Used interactive UI components",
      "Added ARIA roles and contrast adjustments",
    ],
    status: "Finished",
    externalLink: "https://starksinclair.github.io/cs200_final_project/",
  },
  wheeloflife: {
    title: "Wheel of Life App",
    technologies: ["Next.js", "Firebase", "Tailwind CSS", "Chart.js"],
    description:
      "A mindfulness and self-improvement app that allows users to assess and track their progress in different life areas through an interactive chart.",
    challenges: ["Dynamic chart rendering", "User data persistence"],
    solutions: ["Used Chart.js", "Integrated Firebase Firestore"],
    status: "On Hold",
    externalLink: "https://wheel-of-life-livid.vercel.app/",
  },
  schoolflow: {
    title: "School Flow",
    technologies: ["React", "TypeScript", "Redux"],
    description:
      "A high school management software that streamlines administrative and academic workflows.",
    challenges: [
      "Migrating from JavaScript to TypeScript",
      "Handling form validation",
    ],
    solutions: ["Refactored components", "Used Yup & React Hook Form"],
    status: "In Progress",
    externalLink: undefined,
  },
  neybank: {
    title: "Ney Bank",
    technologies: ["Django", "React", "PostgreSQL"],
    description:
      "A fintech app for managing different savings and checking accounts, investment portfolios, and allowing money transfers between accounts at different banks.",
    challenges: ["Security in transactions", "Handling multiple accounts"],
    solutions: ["Implemented encryption", "Designed efficient database models"],
    status: "In Progress",
    externalLink: undefined,
  },
};
