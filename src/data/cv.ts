/**
 * The curriculum vitae, as structured data.
 *
 * This file is the single source for three artefacts that must not drift:
 * the /cv page, the schema.org graph on it, and the tagged PDF that
 * `scripts/make-cv-pdf.mjs` writes to `public/sinclair-nzenwata-cv.pdf`.
 *
 * Wording is Sinclair's own, taken from the Word original. Edit it here and
 * regenerate the PDF; never edit the PDF by hand, because a hand-edited PDF
 * loses its tags and the whole point of generating it is that it keeps them.
 */

export type CvBlock =
  | { kind: "text"; text: string }
  | { kind: "bullets"; items: string[] }
  /** A labelled result line: "Outcome: ...", "Impact: ...", "Technologies: ...". */
  | { kind: "labelled"; label: string; text: string };

export interface CvEntry {
  title: string;
  /** Right-aligned against the title: a date range or a place. */
  meta?: string;
  /** The line under the title: role, organisation, period. */
  subtitle?: string;
  /** A further line: advisor, instructor, coauthors. */
  detail?: string;
  /** Rendered as "Research question: ..." in italics. */
  question?: string;
  blocks?: CvBlock[];
  /** Makes the title a link. */
  url?: string;
}

export interface CvSection {
  /** Anchor id, also the TOC target. */
  id: string;
  title: string;
  intro?: string;
  entries: CvEntry[];
}

export const cvMeta = {
  /** Shown under the name on both the page and the PDF. */
  kicker: "Curriculum Vitae",
  location: "Muncie, Indiana",
  emails: ["nzenwatasinclair@gmail.com", "sinclair.nzenwata@bsu.edu"],
  linkedin: "linkedin.com/in/sinclair-nzenwata",
  site: "sinclairnzenwata.com",
  /** Display text; the href comes from `profile.socials.orcid`. */
  orcid: "orcid.org/0009-0000-9095-8017",
  /** The month the PDF was generated from this file. */
  revised: "2026-11",
  pdfPath: "/sinclair-nzenwata-cv.pdf",
};

export const researchInterests =
  "Human-computer interaction, accessible computing, and software engineering, with a focus on how authoring tools, including AI-assisted ones, can help people create accessible content while keeping them in control. Related interests include how AI coding systems handle ambiguous requirements and how to evaluate what they assume.";

export const cvSections: CvSection[] = [
  {
    id: "education",
    title: "Education",
    entries: [
      {
        title: "Ball State University",
        meta: "Muncie, IN",
        subtitle: "B.S. in Computer Science, expected May 2027",
        detail: "Minor: Computer Technology | GPA: 4.0/4.0",
        blocks: [
          {
            kind: "text",
            text: "Selected coursework: database systems, operating systems, computer networks, statistics, discrete structures, data analysis, software requirements, and independent study in document accessibility.",
          },
          {
            kind: "labelled",
            label: "Expected graduation distinctions",
            text: "Summa cum laude and Departmental Honors in Computer Science, anticipated May 2027.",
          },
        ],
      },
    ],
  },
  {
    id: "publications",
    title: "Publications",
    intro: "Peer-reviewed journal article",
    entries: [
      {
        title:
          "NeuralProphet for Ordinal Time Series Forecasting: A Two-Stage Approach with Threshold Optimization",
        subtitle:
          "Han, Y., Abdul-Rahim, A., Nzenwata, S., & Lazar, D. (2026). Forecasting, 8(6), Article 105.",
        url: "https://doi.org/10.3390/forecast8060105",
      },
    ],
  },
  {
    id: "research",
    title: "Research and immersive learning",
    entries: [
      {
        title: "Accessible Scholarly Documents",
        meta: "Fall 2026 to present",
        subtitle: "CS 499 Independent Study Researcher | Ball State University",
        detail: "Advisor: Dr. Jay Bagga",
        question:
          "Can accessibility rules enforced during authoring improve scholarly documents and preserve semantic structure in exported PDFs?",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Built two prototypes on a shared accessibility rules engine: a Google Docs add-on that audits existing documents and a React/TipTap editor that blocks saving when error-level checks fail.",
              "Developing a structured document model with graph-based constraints for heading hierarchy, image descriptions, and reading order, targeting a defined subset of WCAG 2.2 Level AA.",
              "Building a compiler that turns the editor's structured content into a tagged PDF; it currently tags document titles, with headings, figures, and reading order next.",
              "Planning a spring 2027 controlled study comparing authoring workflows and testing whether semantic structure and alternative text survive PDF export.",
            ],
          },
          {
            kind: "labelled",
            label: "Outcome",
            text: "2 working prototypes enforcing checks for document titles, headings, and image alternative text. In an initial test on 5 documents, checker-guided revisions passed both Adobe Acrobat's accessibility checker and YuJa Panorama. Work is being developed toward an ACM ASSETS submission.",
          },
        ],
      },
      {
        title: "Clarifying Ambiguous Requirements with LLM Coding Systems",
        meta: "Fall 2026 to present",
        subtitle: "Undergraduate Researcher | Ball State University",
        detail: "Advisor: Dr. Sugandha Malviya",
        question:
          "When software requirements are unclear or incomplete, do LLM coding systems ask useful clarifying questions or make assumptions about what to implement?",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Run pilot experiments with Codex on ambiguous and incomplete requirements, recording whether the system seeks clarification before implementing features.",
              "Assess the relevance and level of detail of the questions asked and how well they recover the intended requirements.",
            ],
          },
          {
            kind: "labelled",
            label: "Outcome",
            text: "Pilot in progress. In an initial pilot, Codex filled unspecified requirements (appointment length, university colors) without asking, and even in Plan Mode asked only technical questions, not business-rule questions.",
          },
        ],
      },
      {
        title: "How Context Shapes AI Coding Agents",
        meta: "Summer 2026 to present",
        subtitle: "Undergraduate Research Collaborator | Remote collaboration",
        detail:
          "Mentor: Noah Ziems, Computer Science Ph.D. student, University of Notre Dame",
        question:
          "How do prompt context and usage patterns affect Claude Code and Cursor on production-codebase tasks compared with clean benchmark problems?",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Designed a hybrid evaluation pairing production-codebase tasks with automatically graded LiveCodeBench problems, so the study can test whether benchmark performance carries over to real software work.",
              "Developed a failure taxonomy (incomplete fixes, regressions, constraint violations, unsuccessful attempts) to explain how agents fail, not just how often.",
              "Specified prompt conditions, a 10-iteration limit, experiment branches, and base-commit logging, and documented threats to validity including sample size, a single operator, and changing tool versions.",
            ],
          },
          {
            kind: "labelled",
            label: "Outcome",
            text: "Built the study's evaluation framework: 8 real-world tasks (bug fixes, interface changes, features, refactoring), 8 LiveCodeBench problems, 16 Jest test suites, and a failure taxonomy. Completed initial runs with Cursor on all 16 tasks; all passed their tests, while run notes flagged design deviations the tests did not catch.",
          },
        ],
      },
      {
        title: "NeuralProphet for Ordinal Time Series Forecasting",
        meta: "Spring 2026 to present",
        subtitle: "Undergraduate Research Assistant | Ball State University",
        detail: "Advisor: Dr. Drew Lazar | Coauthors: Yuna Han and Amira Abdul-Rahim",
        question:
          "Can a continuous forecasting model predict ordered categories while preserving interpretable trend, seasonal, and covariate structure?",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Co-developed a two-stage method that pairs continuous NeuralProphet forecasts with validation-optimized category thresholds, evaluated with quadratic weighted kappa, mean absolute error, and category-distance accuracy.",
              "Extended the method to Kansas U.S. Drought Monitor data from 2000 onward (no drought and D0 to D4), building an ordinal target aligned with precipitation, temperature, soil moisture, and evapotranspiration covariates.",
              "Designed controlled lag experiments and synthetic ordinal series with known trend, seasonality, and autoregressive noise to test whether the model recovers true temporal structure.",
              "Identified and corrected a category encoding error that excluded the no-drought class, restoring the full category range for evaluation.",
            ],
          },
          {
            kind: "labelled",
            label: "Outcome",
            text: "Coauthored a peer-reviewed article published in Forecasting, 8(6), 2026. Across a 40-seed reference simulation, optimized thresholds raised mean exact accuracy from 70.2% (naive rounding) to 76.4%. ICDA poster in preparation.",
          },
        ],
      },
      {
        title: "Campus Energy Dashboard",
        meta: "2025 to 2026",
        subtitle: "Undergraduate Data Science Researcher | The Data Mine, Ball State cohort",
        detail: "Faculty mentor: Dr. Drew Lazar",
        question:
          "How can campus energy forecasts and an interactive dashboard help Ball State make better-informed resource decisions?",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Connected the team's forecasting model to a FastAPI backend and React dashboard.",
              "Supported production deployment: dashboard on Cloudflare, with the backend API and MCP server on separate Google Cloud Run services and access restricted to authorized users.",
              "Implemented an MCP server and local Ollama interface for natural-language queries: meter search, usage summaries, demand attribution, and seasonal analysis.",
              "Resolved a pandas and NeuralProphet dependency conflict that was blocking the forecasting pipeline.",
            ],
          },
          {
            kind: "labelled",
            label: "Outcome",
            text: "Live in production for authorized users. Dashboard and query tools cover 128 campus meters with hourly data from July 2022 to July 2026. Presented at 3 university events in 2026: Student Symposium, Immersive Learning Showcase, and Data Mine Recruitment Dinner.",
          },
        ],
      },
      {
        title: "Play-by-Play Admin",
        meta: "2026",
        subtitle: "Student Developer | Junior-year capstone, Ball State University",
        detail: "Course instructor: Dr. Huseyin Ergin",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Contributed game management, scheduling, status tracking, and audit-log features to an administration platform for a gaming system.",
            ],
          },
          {
            kind: "labelled",
            label: "Outcome",
            text: "Presented at the Ball State Student Symposium, April 2026.",
          },
        ],
      },
      {
        title: "Monster Media Evolution",
        meta: "2024",
        subtitle: "Student Researcher and Web Developer | ENG 104, Ball State University",
        question:
          "How have monster portrayals in media changed over time, and what do those changes reveal about cultural values and social anxieties?",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Researched monster portrayals across media history, tracing shifts from threatening villains to more complex or sympathetic characters in relation to changing cultural values and societal fears.",
              "Organized findings into a chronological narrative and built an interactive website with data visualizations to communicate the research.",
            ],
          },
          {
            kind: "labelled",
            label: "Outcome",
            text: "First research project. Published the findings as an interactive timeline website, combining humanities research with web development.",
          },
        ],
      },
    ],
  },
  {
    id: "presentations",
    title: "Posters and presentations",
    entries: [
      {
        title: "Posters and presentations",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Poster (in preparation). NeuralProphet for Ordinal Time Series Forecasting: A Two-Stage Approach with Threshold Optimization. ICDA poster session.",
              "Presenter, Ball State Student Symposium. Campus Energy Dashboard and Play-by-Play Admin capstone projects. April 2026.",
              "Team presenter, Cummins Xtern Challenge, Enter the Matrix track. Presented Prescriptive Maintenance Dispatcher (Marco); team earned second place. March 6, 2026, Columbus, Indiana.",
              "Presenter, Ball State Immersive Learning Showcase and Data Mine Recruitment Dinner. Campus Energy Dashboard forecasting work. 2026.",
              "Panelist, Ball State Computer Science freshman panel. Shared research and student experiences with approximately 20 to 40 first-year students. 2026.",
              "Panelist, Ball State International Services webinar for prospective international students. 2026.",
              "Host, Digital Corps “Corps Conversation” on software requirements for students and staff. November 13, 2026.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "honors",
    title: "Honors and awards",
    entries: [
      {
        title: "LewerMark Make Your Mark Scholarship",
        meta: "Spring 2026",
        blocks: [
          {
            kind: "text",
            text: "$3,000; one of seven recipients in the Spring 2026 cohort, recognized for the Access to Build proposal.",
          },
        ],
      },
      {
        title: "Cummins Xtern Challenge, Second Place, Enter the Matrix track",
        meta: "March 2026",
        blocks: [
          {
            kind: "text",
            text: "$3,000 team prize for Prescriptive Maintenance Dispatcher (Marco).",
          },
        ],
      },
      {
        title: "Clinton P. Fuelling Memorial Scholarship, Ball State University",
        meta: "2025 to 2026",
        blocks: [
          { kind: "text", text: "$600 departmental scholarship in Computer Science." },
        ],
      },
      {
        /* Amount confirmed by Sinclair, 11 November 2026: $549.00, not the
           rounded $600 an older CV carried. No award year stated yet, so none
           is shown rather than guessed. */
        title: "Jack Beyerl Fund, Ball State University",
        blocks: [{ kind: "text", text: "$549 award." }],
      },
      {
        title: "Global Achievement Scholarship, Ball State University",
        blocks: [{ kind: "text", text: "$12,000 annually." }],
      },
      {
        title: "Dean's List, Ball State University",
        meta: "Fall 2023",
      },
    ],
  },
  {
    id: "experience",
    title: "Professional experience",
    entries: [
      {
        title: "Digital Corps, Ball State University",
        meta: "Muncie, IN",
        subtitle: "University IT digital studio | September 2023 to present",
        detail:
          "Development Specialist (August 2024 to present); Apprentice Developer (September 2023 to August 2024)",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Develop and maintain web and mobile applications for university offices and community partners, working with UX, design, communications, project management, and video teams.",
              "Build accessible interfaces and secure authentication workflows; mentor newer developers on Google Sheets API integration and WordPress development.",
            ],
          },
          {
            kind: "labelled",
            label: "Impact",
            text: "Contributed to 15 projects serving a university community of more than 18,000 students, faculty, and staff.",
          },
          {
            kind: "labelled",
            label: "Technologies",
            text: "React, Next.js, React Native/Expo, TypeScript, JavaScript, PHP, WordPress, Advanced Custom Fields, Leaflet, Google Sheets API, single sign-on, Git.",
          },
          {
            kind: "labelled",
            label: "Project highlights",
            text: "",
          },
          {
            kind: "bullets",
            items: [
              "Charlie's Charter: Implemented ride-status web push notifications for the campus ride service and supported Expo EAS and Android release configuration. Used by 200+ students; about 200 rides completed in Fall 2026.",
              "University Libraries: Customized the LibGuides staff intranet and wrote maintenance documentation; used by 54 library staff.",
              "Indiana Projects Map: Built a WordPress autofill workflow with Leaflet geocoding, district GeoJSON, and point-in-polygon matching; maps 100+ projects, concentrated in Delaware County.",
              "90th Annual Juried Student Art Show: Developed a submission site with per-student limits and single sign-on; handled 50+ submissions from 20+ student artists.",
            ],
          },
        ],
      },
      {
        title: "Sim2K, Inc.",
        meta: "Indianapolis, IN",
        subtitle: "Managed IT and cloud services provider | Summer 2026",
        detail: "DevOps Intern",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Co-developed a PowerShell tool to migrate IT documentation between Hudu instances, handling API authentication, pagination, and procedure migration for 200+ documents, passwords, and procedures.",
              "Resolved a Halo PSA custom-field integration issue so Pia SmartForms could connect to the Halo platform.",
              "Assisted in developing a Hatz AI workflow.",
            ],
          },
          {
            kind: "labelled",
            label: "Impact",
            text: "Supported documentation and service workflows for 50+ managed client organizations; the integration fix restored SmartForms connectivity for all of them.",
          },
          { kind: "labelled", label: "Technologies", text: "PowerShell, REST APIs." },
        ],
      },
      {
        title: "Basitech (EdTech)",
        meta: "Remote",
        subtitle: "Education technology | July 2024 to January 2025",
        detail: "Software Engineer",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Developed student management interfaces and integrated backend APIs for School Flow, Basitech's school management platform, currently in pre-launch development.",
            ],
          },
          {
            kind: "labelled",
            label: "Impact",
            text: "Migrated 30+ React files from JavaScript to TypeScript, improving type safety and maintainability ahead of launch.",
          },
          {
            kind: "labelled",
            label: "Technologies",
            text: "React, TypeScript, JavaScript, REST APIs.",
          },
        ],
      },
      {
        title: "Headstarter",
        meta: "Remote",
        subtitle:
          "Software Engineering Fellowship (selective, application-based) | July to September 2024",
        detail: "Software Engineering Fellow",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Built AI applications including Pantry Vision, which uses Gemini image recognition to log pantry items, track expiration dates, and generate recipes.",
            ],
          },
          {
            kind: "labelled",
            label: "Impact",
            text: "Built and deployed 5 AI applications in 5 weeks.",
          },
          {
            kind: "labelled",
            label: "Technologies",
            text: "React, Next.js, Firebase, Clerk, Vercel, Gemini API.",
          },
        ],
      },
    ],
  },
  {
    id: "service",
    title: "Leadership and service",
    entries: [
      {
        title: "Senator, Student Government Association, Ball State University",
        meta: "2026 to present",
        blocks: [
          {
            kind: "text",
            text: "Working with fellow senators on legislation to make calculators available for loan through the university library; bill in development.",
          },
        ],
      },
      {
        title: "Vice President and Co-Founder, Culinary Connection, Ball State University",
        meta: "Founded 2024",
        blocks: [
          {
            kind: "text",
            text: "Members propose and vote on international dishes, plan preparation, and cook together.",
          },
          { kind: "labelled", label: "Impact", text: "Grew the club to more than 70 members." },
        ],
      },
      {
        title: "Invited Student Participant, Ball State Advisory Board",
        meta: "Fall 2026",
      },
      {
        title:
          "Treasurer, Drone Club; Secretary, Business Analytics Club; Member, Cybersecurity Club",
        meta: "Ball State University",
      },
      {
        title: "Volunteer, International Student Orientation, Ball State University",
        blocks: [
          {
            kind: "text",
            text: "Supported orientation activities for incoming international students.",
          },
        ],
      },
      {
        title: "Volunteer Altar Server, St. Francis of Assisi, Muncie",
        meta: "2023 to present",
      },
    ],
  },
  {
    id: "ventures",
    title: "Ventures",
    intro:
      "Lead a team of approximately 10 across four ventures, coordinating technical direction, task assignments, and onboarding.",
    entries: [
      {
        title: "SportyKore",
        meta: "Sept 2026 to present",
        subtitle: "Co-Founder",
        blocks: [
          {
            kind: "text",
            text: "Grassroots football platform for Nigeria with competition management, fixtures, standings, player statistics, and live match coverage.",
          },
          {
            kind: "labelled",
            label: "Impact",
            text: "Partnerships with 4 competitions covering 50+ teams, including the Imo Super League finals; 20+ additional competitions on the launch waitlist.",
          },
        ],
      },
      {
        title: "Afrilibrum Institute Academy",
        meta: "2026 to present",
        subtitle: "Founder and Volunteer Developer",
        blocks: [
          {
            kind: "text",
            text: "Nonprofit education initiative and mobile-first learning platform for African learners and future leaders.",
          },
          {
            kind: "labelled",
            label: "Impact",
            text: "20+ students on the launch waitlist; hosting webinars across Nigeria on leadership, business, and marketing so students can connect and network.",
          },
        ],
      },
      {
        title: "GatsToGo",
        meta: "2026 to present",
        subtitle: "Founder",
        blocks: [
          {
            kind: "text",
            text: "Operations software for LPG gas filling plants in Nigeria.",
          },
          {
            kind: "labelled",
            label: "Impact",
            text: "Architecting a multi-tenant platform to support 100,000+ users across gas filling plants; first pilot planned at a family-owned plant under construction.",
          },
        ],
      },
      {
        title: "Naahia",
        meta: "September 2025 to present",
        subtitle: "Co-Founder",
        blocks: [
          {
            kind: "text",
            text: "Marketplace co-founded with a fellow Ball State student, expanding from university users toward a public marketplace in Nigeria with identity verification. Building mobile and backend features with React Native/Expo and AdonisJS, including a moderation dashboard for user reports, account and listing actions, and audit logging, with administrator access secured through Duo single sign-on and OpenID Connect.",
          },
          {
            kind: "labelled",
            label: "Impact",
            text: "Pre-launch. Taught the co-founder to code and guided development of the platform.",
          },
        ],
      },
    ],
  },
  {
    id: "projects",
    title: "Selected technical projects",
    entries: [
      {
        title: "Selected technical projects",
        blocks: [
          {
            kind: "bullets",
            items: [
              "Ball State Parking App: Built the Map Editor, the staff admin dashboard behind the app (Google Apps Script, Google Maps, Google Sheets), used to rename lots and redraw lot polygons as campus parking changes. The app maps 90+ lots and garages and has 20+ downloads since launching as a new campus initiative.",
              "Access to Build: Designed a scholarship proposal for young Nigerian builders; won a $3,000 LewerMark Make Your Mark award as one of seven recipients.",
              "Headway: Campus accessibility app prototype providing information about building entrances, ramps, and elevators; an early accessibility project that connects to the Accessible Scholarly Documents research above.",
              "Wilitrain: Co-developed a weather application with NASA data, Expo, and React Native for NASA Space Apps, competing among 100+ teams; published on the Apple App Store.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "skills",
    title: "Technical skills",
    entries: [
      {
        title: "Languages",
        blocks: [
          {
            kind: "text",
            text: "Python, TypeScript, JavaScript, Go, PHP, Java, SQL, PowerShell",
          },
        ],
      },
      {
        title: "Research and data",
        blocks: [
          {
            kind: "text",
            text: "pandas, NeuralProphet, PyTorch, PySpark, Jupyter, time series analysis, ordinal evaluation, experimental protocol design",
          },
        ],
      },
      {
        title: "Frameworks and infrastructure",
        blocks: [
          {
            kind: "text",
            text: "React, Next.js, React Native/Expo, AdonisJS, Laravel, FastAPI, htmx; PostgreSQL, MySQL, Redis, Firebase; Docker, AWS, Google Cloud Run, Git, CI/CD",
          },
        ],
      },
      {
        title: "AI and accessibility",
        blocks: [
          {
            kind: "text",
            text: "MCP, Ollama, OpenAI and Gemini APIs, Claude Code, Cursor; WCAG 2.2, PDF accessibility inspection, Adobe Acrobat, LaTeX, Google Apps Script, TipTap",
          },
        ],
      },
    ],
  },
];

/**
 * The research entries, for `/research`.
 *
 * The CV is the source: a study described in two places would otherwise drift.
 * The published paper has its own section on that page, driven by `press.ts`,
 * and Monster Media Evolution is coursework and lives under projects.
 */
export const researchEntries: CvEntry[] =
  cvSections
    .find((s) => s.id === "research")
    ?.entries.filter(
      (e) =>
        !e.title.startsWith("NeuralProphet") && e.title !== "Monster Media Evolution",
    ) ?? [];
