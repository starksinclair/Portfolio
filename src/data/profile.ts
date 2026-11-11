/**
 * Identity, work history and contact details.
 *
 * Everything here is also the input to the schema.org graph in `src/lib/schema.ts`,
 * so keep the shapes close to what schema.org expects. Dates in particular
 * must stay ISO 8601 for `startDate` / `endDate` to validate.
 */

export const SITE_URL = "https://www.sinclairnzenwata.com";

export const profile = {
  name: "Sinclair Nzenwata",
  givenName: "Sinclair",
  familyName: "Nzenwata",
  additionalName: "Ihuanyachukwu",
  /** LinkedIn headline, verbatim. */
  headline: "Building at the intersection of AI research and real-world engineering",
  jobTitle: "Software Engineer",
  email: "nzenwatasinclair@gmail.com",
  phone: "+12194555261",
  location: {
    city: "Muncie",
    region: "IN",
    country: "US",
    countryName: "United States",
  },
  hometown: {
    city: "Owerri",
    region: "Imo State",
    country: "NG",
    countryName: "Nigeria",
  },
  nationality: "Nigerian",
  /**
   * The lead on the overview page and the meta description for `/`. Sinclair's
   * own wording, from the hero introduction in his knowledge base. Per BRAND.md
   * §7 every claim here is traceable to docs/research.md or to a public
   * repository.
   */
  summary:
    "I'm Sinclair Nzenwata, a computer science student and software developer building useful web and mobile products. My work spans accessible scholarly documents, data forecasting, AI-assisted software engineering, and platforms that help communities solve practical problems.",
  /**
   * The same person in the third person, for `Person.description` in the
   * schema.org graph. A machine-readable bio is written about him, not by him,
   * so the voice differs from `summary` on purpose; the facts do not.
   */
  bio:
    "Sinclair Nzenwata is a computer science student at Ball State University and a software developer interested in building technology that addresses practical problems. His work includes research on accessible scholarly PDFs, ordinal time-series forecasting, and how AI coding agents handle incomplete software requirements. Through Digital Corps and applied research projects, he has worked on web applications, data tools and user-facing software. He also develops entrepreneurial products focused on student services, grassroots sports, and the operations of LPG businesses in Nigeria.",
  /**
   * The background section of `/about`, in his own words.
   *
   * Drawn from his CMU statement of intent and his cover letter, which are the
   * documents where he actually tells this story. Everything load-bearing here
   * appears in one of them: the phone, the friend, the Digital Corps
   * realisation, the Naahia dorm conversation, the Codex pilot, the Cursor run
   * notes. The one external statistic is cited, because a number without a
   * source is the kind of claim BRAND.md §7 exists to prevent.
   */
  longBio: [
    "I learned to program on a phone. That was the computer I had in Nigeria, and the gap between what I wanted to build and what I could build on it is most of the reason I kept going. I came to Ball State University in 2023 and will finish a B.S. in Computer Science in May 2027.",
    "I did not start out thinking about accessibility. Watching a close friend who uses a wheelchair navigate everyday technology, I saw how many ordinary tools quietly shut him out. The harder part was realising I had built the same barriers myself: by then I had contributed to fifteen projects at Ball State's Digital Corps, and I had shipped work without once asking who could not use it. Fewer than 3.2% of nearly 20,000 scholarly PDFs published between 2014 and 2023 meet six basic accessibility criteria, and 74.9% meet none of them. Most of those failures begin in an authoring tool that let someone skip a heading, a tag or an image description without noticing.",
    "So that became the question I work on: can accessibility problems be prevented while someone is writing, instead of repaired after publication? In an independent study with Dr. Jay Bagga I built two prototypes on a shared rules engine, a Google Docs add-on that audits a finished document and an editor that refuses to save while a check on titles, headings or alternative text is failing, and I am writing a compiler from scratch that turns structured content into a tagged PDF. The useful thing it has taught me is a negative result. Satisfying a structural requirement does not make a document accessible. A tool can force alternative text to exist; it cannot make that text describe the image, and passing an automated checker does not mean a screen reader user can navigate what you wrote.",
    "That led to a question one step out: what should a tool ask before it decides something for you? With Dr. Sugandha Malviya I am studying how AI coding systems handle incomplete requirements. In a pilot I asked Codex to build an advising appointment system without specifying appointment length or any visual design; it chose thirty-minute slots and the university's colours without asking, and even in plan mode its questions were technical rather than about the business rules it was implementing. In a separate evaluation of coding agents designed with Noah Ziems at Notre Dame, every one of sixteen tasks passed its tests, and my run notes recorded an agent passing one of them by restructuring an interface it was supposed to expose. The distance between passing and correct is the thing I want evaluations to catch. Coauthoring a forecasting paper with Dr. Drew Lazar taught me the same lesson from the other direction: decide what the baseline is before you trust the result.",
    "I build as well as study, and the building usually starts with a conversation rather than an idea. Naahia began in the dorms, watching people throw away things at the end of the year; I asked why they did not sell them on Facebook Marketplace and kept hearing that it did not feel safe, so my co-founder and I built the marketplace where students offer help and request services instead. GatsToGo came out of how cooking gas is actually bought and sold in Nigeria. The through line is the same as the research: find out who you are serving before you decide what they need.",
    "I am from Owerri, Imo State. Access to Build, an initiative to get young Nigerian innovators the tools and mentorship to turn ideas into working things, won the LewerMark Make Your Mark scholarship in 2026, and through Afrilibrum I want to run workshops that teach the next group of African developers to describe an image properly and to design for people with disabilities from the start, rather than treating accessibility as something you satisfy at the end. I would like to keep doing this as research. I would also like young developers at home to inherit it as a habit rather than a correction.",
  ],
  socials: {
    github: "https://github.com/starksinclair",
    linkedin: "https://www.linkedin.com/in/sinclair-nzenwata",
    twitter: "https://twitter.com/nzenwata_",
    whatsapp: "https://wa.me/+12194555261",
    /**
     * Two different things, both kept.
     *
     * `googleScholarLookup` is a search for the paper: the link MDPI publishes
     * on the article page. `googleScholarProfile` is the author himself, and it
     * is the one that matters, because a profile is an entity a search engine
     * can tie to this site through `Person.sameAs`, whereas a search is not.
     * Stored without `view_op`, which is view state rather than identity; the
     * `user=` id is what addresses the profile.
     */
    googleScholarLookup:
      "https://scholar.google.com/scholar_lookup?title=NeuralProphet+for+Ordinal+Time+Series+Forecasting%3A+A+Two-Stage+Approach+with+Threshold+Optimization&doi=10.3390%2Fforecast8060105",
    googleScholarProfile:
      "https://scholar.google.com/citations?user=kC5b09gAAAAJ&hl=en" as string | undefined,
    /** The canonical researcher identifier: stable across name changes,
        institutions and publishers, which is exactly what `sameAs` wants. */
    orcid: "https://orcid.org/0009-0000-9095-8017" as string | undefined,
  },
  /** Used for schema.org `knowsAbout`. Topics, not a skills-bar inventory. */
  knowsAbout: [
    "Software engineering",
    "Full-stack web development",
    "Artificial intelligence",
    "Large language model agents",
    "Model Context Protocol",
    "Time series forecasting",
    "Ordinal time series forecasting",
    "NeuralProphet",
    "Data analytics",
    "Database architecture",
    "Single sign-on and OIDC",
    "Web accessibility",
    "Document accessibility",
    "Human-computer interaction",
  ],
} as const;

export interface Position {
  role: string;
  organization: string;
  organizationUrl?: string;
  location: string;
  /** ISO 8601. */
  startDate: string;
  /** ISO 8601, or undefined when current. */
  endDate?: string;
  /** Human-readable range shown in the UI. */
  period: string;
  highlights: string[];
}

export const positions: Position[] = [
  {
    role: "Co-Founder",
    organization: "SportyKore",
    location: "Remote",
    startDate: "2026-09",
    period: "Sept 2026 to present",
    highlights: [
      "Built a grassroots football platform for Nigeria: competition management, fixtures, standings, player statistics and live match coverage.",
      "Partnerships with 4 competitions covering 50+ teams, including the Imo Super League finals, with 20+ more competitions on the launch waitlist.",
      "Lead a team of roughly 10 across four ventures, coordinating technical direction, task assignment and onboarding.",
    ],
  },
  {
    role: "Co-Founder",
    organization: "Naahia",
    organizationUrl: "https://naahia.com",
    location: "Remote",
    startDate: "2025-09",
    period: "Sept 2025 to present",
    highlights: [
      "Co-founded with a fellow Ball State student: a marketplace where students offer help and request services, now expanding from campus toward a public marketplace in Nigeria with identity verification.",
      "Build the mobile and backend features in React Native / Expo and AdonisJS.",
      "Built the moderation dashboard for user reports, account and listing actions and audit logging, with administrator access behind Duo single sign-on and OpenID Connect.",
      "Taught my co-founder to code and guided development of the platform. Pre-launch.",
    ],
  },
  {
    role: "Founder",
    organization: "GatsToGo",
    organizationUrl: "https://gatstogo.com",
    location: "Remote",
    startDate: "2026-01",
    period: "2026 to present",
    highlights: [
      "Operations software for LPG gas filling plants in Nigeria: customers buy cooking gas without creating an account, staff record fills and cash sales, owners manage pumps, staff, hours and reviews.",
      "Architected a multi-tenant platform, each plant on its own subdomain, in Go with Postgres row-level security.",
      "First pilot planned at a family-owned plant currently under construction.",
    ],
  },
  {
    role: "Founder and Volunteer Developer",
    organization: "Afrilibrum Institute Academy",
    organizationUrl: "https://afrilibrum.com",
    location: "Remote",
    startDate: "2026-01",
    period: "2026 to present",
    highlights: [
      "Nonprofit education initiative and mobile-first learning platform for African learners.",
      "Run webinars across Nigeria on leadership, business and marketing, so students can connect and network.",
      "20+ students on the launch waitlist.",
    ],
  },
  {
    role: "Development Specialist",
    organization: "Digital Corps, Ball State University",
    organizationUrl:
      "https://www.bsu.edu/about/administrativeoffices/information-technology/services/the-digital-corps",
    location: "Muncie, IN",
    startDate: "2023-09",
    period: "Sept 2023 to present",
    highlights: [
      "Development Specialist since August 2024, Apprentice Developer before that.",
      "Work with cross-functional teams (UX, developers, videographers, communications and project managers) to deliver digital solutions for Ball State faculty.",
      "Build web and mobile applications in React and modern tooling to support university operations.",
      "Design database architecture and implement secure authentication, including MySQL schema design and SAML single sign-on.",
    ],
  },
  {
    role: "DevOps Intern",
    organization: "Sim2K, Inc.",
    location: "Indianapolis, IN",
    startDate: "2026-05",
    endDate: "2026-08",
    period: "Summer 2026",
    highlights: [
      "Co-developed a PowerShell tool to migrate IT documentation between Hudu instances, handling API authentication, pagination and procedure migration for 200+ documents, passwords and procedures.",
      "Resolved a Halo PSA custom-field integration issue so Pia SmartForms could connect to the Halo platform, restoring connectivity for 50+ managed client organisations.",
    ],
  },
  {
    role: "Software Engineer",
    organization: "Basitech",
    location: "Remote",
    startDate: "2024-07",
    endDate: "2025-01",
    period: "July 2024 to Jan 2025",
    highlights: [
      "Built a school management system for middle and high schools covering student and teacher management, results tracking and fee payments.",
      "Built the student management dashboard: data tables, suspension and activation controls, and academic results visualisation.",
      "Integrated REST APIs for real-time data synchronisation and migrated the entire React codebase from JavaScript to TypeScript.",
    ],
  },
  {
    role: "Software Engineer, Fellowship Program",
    organization: "HeadStarter",
    location: "Remote",
    startDate: "2024-07",
    endDate: "2024-09",
    period: "July 2024 to Sept 2024",
    highlights: [
      "Built and deployed five AI projects in five weeks using React, Next.js, Firebase, Clerk and Vercel.",
      "Worked in agile cycles with CI/CD, shipping each project to production rather than leaving it at prototype.",
    ],
  },
];

export interface Education {
  credential: string;
  institution: string;
  institutionUrl?: string;
  location: string;
  startDate: string;
  endDate: string;
  period: string;
  details: string[];
}

export const education: Education[] = [
  {
    credential: "Bachelor of Science, Computer Science",
    institution: "Ball State University",
    institutionUrl: "https://www.bsu.edu",
    location: "Muncie, IN",
    startDate: "2023-08",
    endDate: "2027-05",
    period: "Aug 2023 to May 2027",
    details: [
      "Minor in Computer Technology, concentration in data analytics.",
      "4.0 GPA.",
      "Undergraduate research in the Department of Mathematical Sciences.",
    ],
  },
];

export interface SkillGroup {
  group: string;
  items: string[];
}

/**
 * Grouped, unranked. BRAND.md §3 rejects percentage bars, because invented
 * precision is the opposite of precise.
 */
export const skills: SkillGroup[] = [
  {
    group: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Go", "Java", "PHP", "R", "SQL", "PowerShell"],
  },
  {
    group: "Frontend",
    items: ["React", "Next.js", "React Native", "Astro", "Tailwind CSS", "HTML", "CSS"],
  },
  {
    group: "Backend",
    items: ["Node.js", "AdonisJS", "FastAPI", "Chi", "templ", "Edge templates", "REST APIs"],
  },
  {
    group: "Data",
    items: ["PostgreSQL", "MySQL", "SQLite", "Firebase", "Supabase", "Redis", "Google Sheets API"],
  },
  {
    group: "AI",
    items: [
      "Model Context Protocol",
      "Claude API",
      "OpenAI API",
      "Gemini API",
      "Multi-agent orchestration",
      "NeuralProphet",
    ],
  },
  {
    group: "Platform",
    items: ["AWS", "Docker", "Vercel", "Netlify", "Render", "CI/CD", "WordPress"],
  },
  {
    group: "Security",
    items: [
      "SAML SSO",
      "Duo SSO",
      "OIDC",
      "Row-level security",
      "CSRF protection",
      "bcrypt",
      "Webhook signature verification",
    ],
  },
];

export interface Activity {
  role: string;
  organization: string;
  period: string;
  note?: string;
}

export const activities: Activity[] = [
  {
    role: "At-Large Senator",
    organization: "Student Government Association, Ball State University",
    period: "Feb 2026 to present",
    note: "Approved by the senate 22–4 with two abstentions.",
  },
  {
    role: "Vice-President and co-founder",
    organization: "Ball State First Cooking Club",
    period: "2025 to present",
    note: "Co-founded with Senator Marvelous Imo.",
  },
  {
    role: "Secretary",
    organization: "Ball State Business Analytics Club",
    period: "2025 to present",
  },
  { role: "Treasurer", organization: "Ball State Drone Club", period: "2025 to present" },
  { role: "Member", organization: "Ball State Cybersecurity Club", period: "2024 to present" },
];

export const languages = [
  { name: "English", level: "Native" },
  { name: "Igbo", level: "Native" },
];
