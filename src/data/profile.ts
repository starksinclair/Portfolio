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
  longBio: [
    "I am a computer science senior at Ball State University, where I also work on the Digital Corps development team. I came to programming through frontend web design during the pandemic and ended up somewhere more interesting: the point where a model's output has to become a system someone actually relies on.",
    "Most of what I build falls into two halves that keep informing each other. One half is applied: multi-tenant platforms, authentication and SSO, database architecture, payment paths, and the unglamorous work of making a write path correct. The other half is research: a peer-reviewed paper on ordinal time series forecasting, and a current CS 499 study on whether enforcing accessibility as a structural rule at authoring time produces more conformant documents than checking them afterwards.",
    "The conviction underneath both is simple. Systems that are built badly cost real money, and AI that sounds impressive without working is worth nothing. I would rather ship something narrow that holds up than something broad that demos well.",
    "I am from Owerri, Imo State, Nigeria. I designed Access to Build, an initiative to get young Nigerian innovators the tools and mentorship to turn ideas into working things, which the LewerMark Make Your Mark scholarship supported in 2026.",
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
