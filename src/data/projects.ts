/**
 * Project index: the single source of truth.
 *
 * This file replaced the Firestore `portfolio` collection and the `/api/function`
 * serverless reader. Everything is local and typed, so the project list is part of
 * the build instead of a runtime fetch.
 *
 * Adding a project: append an entry, keep `slug` URL-safe and stable (slugs are
 * public URLs and are referenced by schema.org `@id` values).
 */

export type ProjectStatus = "shipped" | "in-progress" | "on-hold" | "archived";

/**
 * Grouped by the kind of engineering problem, not by which layer of the stack
 * the code sits in. "Frontend / Backend / Full stack" told a reader almost
 * nothing and put a WordPress CMS and a Django bank in the same bucket.
 */
export type ProjectCategory =
  | "AI & agent systems"
  | "Platforms & operational systems"
  | "Developer tools & automation"
  | "Applications & interfaces"
  | "Early work & coursework";

export interface Project {
  /** URL segment under /projects. Stable and public. */
  slug: string;
  title: string;
  /** Calendar year, or a range for multi-year work. */
  year: string;
  status: ProjectStatus;
  category: ProjectCategory;
  /** What Sinclair personally did, not what the team did. */
  role: string;
  /** Employer, client, course, or "Personal". */
  context: string;
  /** One sentence, used in listings and meta descriptions. */
  summary: string;
  description: string;
  technologies: string[];
  userStories: string[];
  challenges: string[];
  solutions: string[];
  liveUrl?: string;
  repoUrl?: string;
  thumbnail?: string;
  featured?: boolean;
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  shipped: "Shipped",
  "in-progress": "In progress",
  "on-hold": "On hold",
  archived: "Archived",
};

/** Listing order on /projects: most substantial work first. */
export const CATEGORY_ORDER: ProjectCategory[] = [
  "AI & agent systems",
  "Platforms & operational systems",
  "Developer tools & automation",
  "Applications & interfaces",
  "Early work & coursework",
];

export const projects: Project[] = [
  {
    slug: "gatstogo",
    title: "GatsToGo",
    year: "2026",
    status: "in-progress",
    category: "Platforms & operational systems",
    role: "Architect and sole developer",
    context: "GatsToGo",
    summary:
      "A multi-tenant platform for LPG gas plants: each plant gets a white-labelled customer site, plus owner, staff and admin terminals that run the plant.",
    description:
      "GatsToGo is a multi-tenant web app for LPG (cooking gas) plants. Each plant gets a white-labelled customer site; GatsToGo provides the internal owner, admin and staff terminal surfaces that actually operate the plant. Customers buy gas with no signup, pay by transfer, card or USSD through Paystack, and receive a redemption code. Staff log into a terminal with a PIN tied to an open shift, redeem codes, confirm fills, record cash sales and token returns, and close the shift. Owners get live ticket, shift and cash data, set prices, create and deactivate staff, record cash movements and void tickets. Every one of those is a real database-backed write path, not a UI mock. Tenant isolation is enforced in Postgres itself with row-level security and a split between a restricted application role and a bypass admin role, so a bug in application code cannot leak one plant's data into another plant's site.",
    technologies: [
      "Go 1.26",
      "templ",
      "Chi",
      "PostgreSQL",
      "Row-level security",
      "pgx",
      "Redis",
      "Paystack",
      "bcrypt",
      "Docker Compose",
      "Alpine.js",
    ],
    userStories: [
      "As a customer, I want to buy gas without creating an account and get a code I can redeem at the plant.",
      "As a customer, I want to look up my past tickets with my phone number and a one-time code.",
      "As a staff member, I want to sign in with a PIN tied to my shift and redeem a customer's code.",
      "As a plant owner, I want live visibility of tickets, shifts and cash, and control over prices and staff.",
      "As a platform admin, I want to onboard a new plant without touching another plant's data.",
    ],
    challenges: [
      "Multi-tenant data isolation where an application-code mistake must not be able to leak one plant's data to another.",
      "Payment webhooks that must be trustworthy and must not double-credit a ticket when Paystack retries.",
      "A staff terminal that has to behave like a real point-of-sale device over an unreliable connection.",
      "CSRF protection across two different kinds of form: public, unauthenticated purchase forms and authenticated internal forms.",
    ],
    solutions: [
      "Pushed tenant isolation down into PostgreSQL row-level security, with every query running inside a tenant-scoped transaction helper, and split the database roles so the app role cannot bypass the policies.",
      "Verified Paystack webhooks with HMAC-SHA512 and made the ticket credit idempotent, so a retried webhook is a no-op.",
      "Built the terminal as a real fetch-driven state machine against server endpoints rather than local mock state, with Redis-backed rate limiting on PIN and OTP attempts.",
      "Used session-derived CSRF tokens for authenticated forms and double-submit tokens for public ones, instead of forcing one scheme to cover both.",
    ],
    repoUrl: "https://github.com/starksinclair/gatstogo",
    featured: true,
  },
  {
    slug: "naahia",
    title: "Naahia",
    year: "2025 to present",
    status: "in-progress",
    category: "Platforms & operational systems",
    role: "Co-founder, mobile and backend developer",
    context: "Naahia",
    summary:
      "A marketplace where students offer help and request services, now expanding toward a public marketplace in Nigeria.",
    description:
      "Naahia started from a problem every student recognises: the person who can cut your hair, fix your laptop or drive you to the airport is three doors down, and you find them by scrolling Instagram or Snapchat. Naahia is the marketplace where students offer help, request services and build community. I co-founded it with a fellow Ball State student, build the mobile app and the backend, and we are extending it past campus toward a public marketplace in Nigeria with identity verification. The moderation side of it is its own project, listed separately as the Admin Moderation System.",
    technologies: [
      "React Native",
      "Expo",
      "AdonisJS",
      "Node.js",
      "MySQL",
      "Duo SSO",
      "OpenID Connect",
    ],
    userStories: [
      "As a student, I want to list a service I can provide so that people nearby can find and book it.",
      "As a student, I want to request a service and see who can do it, without searching social media.",
      "As a user in Nigeria, I want to know the person I am dealing with is verified.",
      "As an administrator, I want reports and account actions to be logged and reviewable.",
    ],
    challenges: [
      "Moving from a closed campus audience, where a university login is identity enough, to a public marketplace where it is not.",
      "Building a mobile app and a backend as a two-person team, one of whom was learning to code.",
      "Keeping administrator access genuinely restricted rather than password-protected.",
    ],
    solutions: [
      "Designed identity verification into the expansion rather than bolting it on, since trust is the product in a marketplace between strangers.",
      "Taught my co-founder to code and guided the architecture, so the work could be split rather than bottlenecked.",
      "Put administrator access behind Duo single sign-on and OpenID Connect, with audit logging on every action.",
    ],
    liveUrl: "https://naahia.com",
    featured: true,
  },
  {
    slug: "afrilibrum",
    title: "Afrilibrum Institute Academy",
    year: "2026 to present",
    status: "in-progress",
    category: "Applications & interfaces",
    role: "Founder and volunteer developer",
    context: "Afrilibrum Institute Academy",
    summary:
      "A nonprofit education initiative and mobile-first learning platform for African learners.",
    description:
      "Afrilibrum is a nonprofit education initiative with a mobile-first learning platform behind it, built for African learners who have the ability and not the access. Alongside the platform we run webinars across Nigeria on leadership, business and marketing, so that students meet people doing the work and meet each other. The platform is in development; 20+ students are on the launch waitlist.",
    technologies: ["React Native", "Expo", "Node.js", "PostgreSQL"],
    userStories: [
      "As a learner, I want course material that works on the phone I already have, on the data I can afford.",
      "As a learner, I want to attend sessions with people working in the field I am trying to enter.",
      "As an organiser, I want to run a webinar series and keep the people who attend connected afterwards.",
    ],
    challenges: [
      "Mobile-first is a constraint, not a style choice: the audience is on phones, often on metered data.",
      "A nonprofit has no engineering budget, so the stack has to be maintainable by one volunteer developer.",
    ],
    solutions: [
      "Built for the phone first and kept payloads small rather than shipping a desktop app that happens to resize.",
      "Ran the webinar programme in parallel with development, so the initiative delivers value before the platform launches.",
    ],
    liveUrl: "https://afrilibrum.com",
    featured: false,
  },
  {
    slug: "bsu-parking-app",
    title: "Ball State Parking App",
    year: "2026",
    status: "shipped",
    category: "Applications & interfaces",
    role: "Developer of the staff map editor",
    context: "Ball State Digital Corps",
    summary:
      "A campus parking app covering 90+ lots and garages, with a staff dashboard for redrawing lot boundaries as campus changes.",
    description:
      "The Ball State Parking App maps every campus lot and garage so a driver can see where they are allowed to park. I built the editor behind it: the staff admin dashboard used to rename lots and redraw lot polygons as campus parking changes, which is constant. The hard part is not drawing a polygon, it is reassigning a boundary to a different parking record without destroying geometry someone already drew, and keeping unassigned lots visibly unassigned instead of silently empty. The app covers 90+ lots and garages and has 20+ downloads since launching as a new campus initiative.",
    technologies: [
      "Google Apps Script",
      "Google Maps",
      "Google Sheets",
      "JavaScript",
      "clasp",
    ],
    userStories: [
      "As a driver, I want to see which lots I am permitted to park in before I drive there.",
      "As parking staff, I want to redraw a lot boundary when the campus changes, without redrawing the ones next to it.",
      "As parking staff, I want to reassign an existing boundary to a different record and keep the geometry.",
      "As parking staff, I want lots with no boundary yet to be obviously missing rather than invisible.",
    ],
    challenges: [
      "Reassigning a boundary between parking records while preserving the existing polygon, rather than deleting and redrawing it.",
      "Keeping assigned, unassigned and missing states correct as staff edit, so the map never quietly loses a lot.",
      "Working inside Google Apps Script, where the usual local tooling does not apply.",
    ],
    solutions: [
      "Separated the geometry from the record it belongs to, so a reassignment moves a reference instead of rewriting a shape.",
      "Made missing boundaries a visible state in the editor rather than an absence, so an incomplete map looks incomplete.",
      "Used clasp to develop locally against the Apps Script project instead of editing in the browser.",
    ],
    featured: false,
  },
  {
    slug: "marco",
    title: "Marco",
    year: "2026",
    status: "shipped",
    category: "AI & agent systems",
    role: "Team member and presenter",
    context: "TechPoint Xtern Challenge with Cummins",
    summary:
      "A multi-agent work order system for field engineers, built in a cross-university team; second place in the Enter the Matrix track.",
    description:
      "Marco, presented as Prescriptive Maintenance Dispatcher, is a multi-agent work order intelligence system for field service. A technician arriving at a failed machine is often diagnosing it for the first time on site, which is how a repeat visit happens. Marco combines machine data, diagnostics and service documentation so the problem is identified earlier and the engineer arrives with the right parts and the right expectation. TechPoint selected 100 students from more than 200 applicants and placed them in cross-university teams; mine was five people from Purdue and Ball State. We presented to Cummins judging panels in Columbus, Indiana on 6 March 2026 and took second place in the Enter the Matrix track, with a $3,000 team prize.",
    technologies: ["Python", "Multi-agent systems", "LLM APIs", "Retrieval"],
    userStories: [
      "As a field engineer, I want to know what is likely wrong before I arrive, so I bring the right parts.",
      "As a service manager, I want fewer repeat visits for the same fault.",
      "As a reviewer, I want to see why the system reached a recommendation rather than take it on trust.",
    ],
    challenges: [
      "Agentic systems are easy to demo and hard to make accountable; a wrong dispatch costs a real trip.",
      "Working as five people from two universities, remotely, over several weeks before a single presentation day.",
    ],
    solutions: [
      "Kept a human in the loop on the dispatch decision rather than automating the recommendation end to end.",
      "Combined machine data with the service documentation that already exists, so the reasoning could be traced back to a source.",
    ],
    featured: true,
  },
  {
    slug: "campus-energy-dashboard",
    title: "Campus Energy Dashboard",
    year: "2025 to 2026",
    status: "shipped",
    category: "AI & agent systems",
    role: "Undergraduate data science researcher",
    context: "The Data Mine, Ball State cohort",
    summary:
      "Energy forecasting and natural-language querying across 128 campus meters, in production for authorized users.",
    description:
      "Ball State spends real money on energy and the data to reason about it sat in a form nobody could ask questions of. With The Data Mine cohort I connected the team's forecasting model to a FastAPI backend and a React dashboard, then built an MCP server and a local Ollama interface so the data can be queried in plain language: meter search, usage summaries, demand attribution, seasonal profiles. It is live for authorized users and covers 128 campus meters with hourly data from July 2022 to July 2026. Faculty mentor: Dr. Drew Lazar. Presented at three university events in 2026.",
    technologies: [
      "Python",
      "FastAPI",
      "pandas",
      "NeuralProphet",
      "React",
      "Model Context Protocol",
      "Ollama",
      "Google Cloud Run",
      "Cloudflare",
    ],
    userStories: [
      "As a facilities decision-maker, I want to see which buildings drive demand and when.",
      "As an analyst, I want to ask a question in plain language instead of writing a query against a meter table.",
      "As a researcher, I want forecasts I can compare against what actually happened.",
    ],
    challenges: [
      "A pandas and NeuralProphet dependency conflict that blocked the forecasting pipeline outright.",
      "Deploying a research dashboard as something authorized staff can actually use, rather than a notebook.",
      "Making natural-language querying useful over meter data without inventing numbers.",
    ],
    solutions: [
      "Resolved the dependency conflict and pinned the pipeline so it builds reproducibly.",
      "Split the deployment: dashboard on Cloudflare, backend API and MCP server on separate Google Cloud Run services, access restricted to authorized users.",
      "Exposed the data through typed MCP tools (meter search, usage summaries, demand attribution, seasonal analysis) so answers come from queries rather than from a model's recollection.",
    ],
    featured: true,
  },
  {
    slug: "play-by-play",
    title: "Play-by-Play Admin",
    year: "2026",
    status: "shipped",
    category: "Applications & interfaces",
    role: "Student developer",
    context: "Junior-year capstone, Ball State",
    summary:
      "Game management, scheduling, status tracking and audit logging for a gaming system's administration platform.",
    description:
      "A junior-year capstone: the administration platform behind a gaming system, where matches move from scheduled to live to completed and someone has to be able to see and correct what happened. I contributed game management, scheduling, status tracking and the audit log. Course instructor: Dr. Huseyin Ergin. Presented at the Ball State Student Symposium in April 2026.",
    technologies: ["JavaScript", "Relational database", "REST APIs"],
    userStories: [
      "As an administrator, I want to schedule a game and move it through its states without editing the database.",
      "As an administrator, I want every correction recorded, so a disputed result has a history.",
    ],
    challenges: [
      "State transitions that look simple on a whiteboard and are not: a live match can be corrected after the fact.",
      "Delivering a defined scope inside a team capstone on a fixed deadline.",
    ],
    solutions: [
      "Modelled match state explicitly rather than inferring it from timestamps.",
      "Added an audit log so an after-the-fact correction is visible as a correction.",
    ],
    featured: false,
  },
  {
    slug: "accessibility-docs",
    title: "Accessibility Docs",
    year: "2026",
    status: "in-progress",
    category: "Developer tools & automation",
    role: "Researcher and sole developer",
    context: "CS 499 research, Ball State",
    summary:
      "A research prototype asking whether enforcing accessibility as a structural rule at authoring time produces more WCAG-conformant documents than writing in Word and exporting a PDF.",
    description:
      "Accessibility Docs is the prototype for a CS 499 research question: does enforcing alt text, heading structure and reading order as structural rules at authoring time produce scholarly documents with higher WCAG 2.2 Level AA conformance than documents written in Microsoft Word and exported as PDF? It is two tools over one shared rules engine. The checker is a Google Docs add-on that audits an existing document and reports issues in a sidebar. The author is a React editor where saving is blocked outright while any error-severity rule fails. Both convert a document into the same DocumentModel and run the same checks, so the audit and the authoring constraint can never drift apart, which is the whole point of the experiment.",
    technologies: [
      "TypeScript",
      "React",
      "TipTap",
      "Google Apps Script",
      "clasp",
      "WCAG 2.2 AA",
      "Netlify",
    ],
    userStories: [
      "As an author, I want to be stopped from saving a document that has accessibility errors, not warned after the fact.",
      "As an author, I want to audit a Google Doc I have already written and see what fails.",
      "As a researcher, I want the checker and the authoring tool to run identical rules so results are comparable.",
    ],
    challenges: [
      "Two completely different document sources, a Google Doc and a TipTap editor, had to be judged by exactly the same rules.",
      "Deciding which rules are hard errors that block a save and which are advisory, without making the tool unusable.",
      "Reading order is a structural property that most editors do not expose as something you can validate.",
    ],
    solutions: [
      "Defined one DocumentModel as the interchange format and wrote per-source adapters into it, so the rules engine never knows which tool it is serving.",
      "Split rules by severity, blocking saves only on error-severity failures, and shipped a document format (.a11ydoc.json) that records the model rather than a rendered output.",
      "Modelled heading structure and reading order explicitly in the DocumentModel instead of inferring them from visual styling.",
    ],
    repoUrl: "https://github.com/starksinclair/accessibility-docs",
    liveUrl: "https://a11yeditor.netlify.app/",
    featured: true,
  },
  {
    slug: "headway",
    title: "Headway",
    year: "2026",
    status: "shipped",
    category: "AI & agent systems",
    role: "Sole developer",
    context: "Competition prototype, Ball State",
    summary:
      "Accessible campus navigation for Ball State students facing mobility barriers, answering two questions: what is in my way, and how do I report that something is wrong?",
    description:
      "Headway is accessible campus navigation for Ball State University students who face mobility and access barriers. It answers two questions: what is in my way, and something is wrong here, how does someone get told? The home page is public with no login: search a building, see campus-wide active reports, and get a status card with accessible entrances, elevators and that building's open reports. Indoor maps for Robert Bell, Applied Technology and Bracken Library support pan and zoom, a floor switcher, routing from an entrance or a room number, and an avoid-stairs toggle that routes step-free via elevators, and says so plainly when no step-free route exists. Reporting a barrier opens the camera first; the photo goes to Claude's vision model and the form comes back prefilled for the user to confirm or edit, never auto-submitted. If the camera is denied the manual form still works, and an analysis failure never blocks a submission. A barrier report can be marked resolved after three independent confirmations.",
    technologies: [
      "Next.js 16",
      "React",
      "Tailwind CSS",
      "Supabase",
      "Postgres",
      "Supabase Realtime",
      "Claude (Sonnet)",
      "Web Speech API",
      "SVG floor plans",
    ],
    userStories: [
      "As a student with a mobility impairment, I want a step-free route between two rooms, and a clear answer when none exists.",
      "As a student, I want to report a blocked ramp or broken elevator by taking one photo.",
      "As a student, I want to ask out loud to be taken to a room and have the app route me there.",
      "As a student, I want to see barriers other people reported before I set out.",
      "As a student, I want a report I know is fixed to stop showing as active.",
    ],
    challenges: [
      "Routing had to be step-free aware across floors, not just shortest-path.",
      "An AI summary of a photo cannot be trusted enough to file a report on someone's behalf.",
      "Voice input returns free-form speech that has to become a concrete app action.",
      "Crowd-sourced resolution invites spam, and one tap should not clear a real barrier.",
    ],
    solutions: [
      "Modelled elevators and stairs as distinct edges so the avoid-stairs toggle changes the graph, and surfaced an explicit no-step-free-route message rather than silently returning a route with stairs.",
      "Used Claude Vision to prefill the form and required the user to confirm or edit before submitting, with submission still possible when analysis fails or the camera is denied.",
      "Had the assistant emit JSON actions alongside its spoken reply, then parsed the actions out, stripped them from the text-to-speech, and let the app route or open a modal.",
      "Required three independent confirmations plus an anti-spam fingerprint before a report is marked resolved.",
    ],
    repoUrl: "https://github.com/starksinclair/headway",
    liveUrl: "https://headway-delta.vercel.app",
    featured: true,
  },
  {
    slug: "sinscores",
    title: "SinScores",
    year: "2026",
    status: "shipped",
    category: "Platforms & operational systems",
    role: "Sole developer",
    context: "Personal",
    summary:
      "A mobile-first neighbourhood football league tracker covering fixtures, standings, player stats and a light admin workflow, backed by Google Sheets so an organiser needs no database.",
    description:
      "SinScores is a mobile-first tracker for a neighbourhood football league: fixtures and results, standings, player statistics, and a light admin workflow for running the league. It runs in two modes. In testing it reads and writes browser local storage; in production the client calls API routes and the server talks to Google Sheets repositories. That split is deliberate. The league organiser already keeps data in a spreadsheet and should not have to adopt a database, and keeping the Sheets credentials server-side means no secret ever reaches browser code. Standings, top scorers, top assists and player of the season are computed from match records rather than stored, so correcting a result corrects every derived table.",
    technologies: [
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "TanStack Query v5",
      "Google Sheets API",
      "Vitest",
      "React Testing Library",
    ],
    userStories: [
      "As a fan, I want fixtures, results and the current table on my phone.",
      "As a fan, I want top scorers, top assists and player of the season.",
      "As an organiser, I want to enter results without learning a database.",
      "As a player, I want to register for the league by scanning a QR code.",
    ],
    challenges: [
      "The data lives in a spreadsheet the organiser controls, which cannot be exposed to the browser.",
      "Standings and stats must stay consistent with the underlying match records.",
      "Developing against a live Google Sheet is slow and destructive.",
    ],
    solutions: [
      "Put the Sheets repositories behind server-only API routes with a separate server container, so credentials never ship to the client.",
      "Computed every derived table from match records at read time instead of storing standings, so a corrected result propagates everywhere.",
      "Added a local-storage mode selected by the same repository interface, so the whole app runs offline in testing with no credentials.",
    ],
    repoUrl: "https://github.com/starksinclair/sinscores",
    liveUrl: "https://sinscores.vercel.app",
  },
  {
    slug: "dildaily",
    title: "DilDaily",
    year: "2026",
    status: "shipped",
    category: "Applications & interfaces",
    role: "Sole developer",
    context: "Client work, Grow with KMA",
    summary:
      "A marketing site for Grow with KMA, built on Astro so the pages ship as static HTML, with a contact flow that delivers mail through Resend.",
    description:
      "A marketing and partnerships site for Grow with KMA, built with Astro and deployed on Vercel. Astro was chosen because the site is content, not an application: the pages ship as static HTML with no client-side framework, which keeps it fast and keeps the content editable in one place. The contact flow posts to a server endpoint that sends through Resend over SMTP, with the sending domain verified so partnership enquiries do not land in spam.",
    technologies: ["Astro", "Vercel", "Resend", "SMTP", "CSS"],
    userStories: [
      "As a potential partner, I want to understand the offer in one scroll.",
      "As a potential partner, I want to send an enquiry without leaving the page.",
      "As the owner, I want to edit copy and numbers without a rebuild of the whole stack.",
    ],
    challenges: [
      "Contact form mail from a new domain goes straight to spam without authentication.",
      "A marketing site does not justify shipping a client-side framework.",
    ],
    solutions: [
      "Sent through Resend with SPF and DKIM records on the verified sending domain, and kept the API key server-side.",
      "Built on Astro so pages render to static HTML with zero framework JavaScript by default.",
    ],
    repoUrl: "https://github.com/starksinclair/kma-site",
    liveUrl: "https://kma-site.vercel.app",
  },
  {
    slug: "hudu-migration",
    title: "Hudu KB Migration",
    year: "2025",
    status: "shipped",
    category: "Developer tools & automation",
    role: "Sole developer",
    context: "Ball State Digital Corps",
    summary:
      "A PowerShell migration that moves knowledge-base articles, folders and attachments between Hudu tenants and rewrites internal links so they still resolve afterwards.",
    description:
      "A PowerShell script that migrates knowledge-base content, both the central KB and company-specific KBs, from one Hudu instance to another. It runs in phases: companies are fetched from the source and created or matched in the target with an ID mapping; folders are created and linked to the mapped company IDs; articles are migrated with optional single-company filtering so a run can be tested on one company first; attachments are downloaded, size-checked and re-uploaded; and internal article links are rewritten to point at the target instance. Migrations are the kind of job that is run once under time pressure, so the design priority was being able to test a slice safely before committing to the whole move.",
    technologies: ["PowerShell 7", "HuduAPI", "REST APIs"],
    userStories: [
      "As an administrator, I want KB articles to arrive in the target instance attached to the right company.",
      "As an administrator, I want to test the migration on a single company before running everything.",
      "As a reader, I want internal links between articles to still work after the move.",
      "As an administrator, I want attachments to come across, not just the article text.",
    ],
    challenges: [
      "Company and folder IDs differ between instances, so every reference has to be remapped.",
      "Internal article links point at source-instance URLs and break silently after a migration.",
      "A failed half-migration is worse than no migration.",
    ],
    solutions: [
      "Built an explicit ID mapping between source and target companies and resolved folder and article references through it.",
      "Added a URL relinking phase that rewrites internal article links to the target instance.",
      "Made the run filterable to a single company so the whole path could be validated on a small slice first, and size-checked attachments before re-upload.",
    ],
    repoUrl: "https://github.com/starksinclair/hudu-migration",
  },
  {
    slug: "willitrain",
    title: "WillItRain",
    year: "2025",
    status: "shipped",
    category: "Applications & interfaces",
    role: "Sole developer",
    context: "Personal",
    summary:
      "A React Native weather app built with Expo, and the first project I took off the web and onto a native target.",
    description:
      "A cross-platform mobile weather app built with Expo and React Native, answering one question well rather than presenting a dashboard. It was also the exercise that moved work off the web and onto a native target: setting up Xcode and the iOS simulator, understanding how an Expo project builds, and dealing with native permissions for location rather than the browser's geolocation prompt.",
    technologies: ["React Native", "Expo", "TypeScript", "iOS Simulator"],
    userStories: [
      "As a user, I want to know whether it will rain where I am, without reading a dashboard.",
      "As a user, I want the app to use my location without me typing a city.",
    ],
    challenges: [
      "A native toolchain is a different problem from a web build, with simulators, platform runtimes and signing.",
      "Location permissions behave differently on a native target than in a browser.",
    ],
    solutions: [
      "Documented the full clean-machine setup in the repository so the project builds from nothing, and used Expo to avoid hand-managing native projects.",
      "Requested location through Expo's permission APIs and handled the denied case as a first-class state rather than an error.",
    ],
    repoUrl: "https://github.com/starksinclair/willitrain",
  },
  {
    slug: "adminmoderation",
    title: "Admin Moderation System",
    year: "2025",
    status: "shipped",
    category: "Platforms & operational systems",
    role: "Architect and sole developer",
    context: "Naahia",
    summary: "I architected and implemented a secure, full-featured admin dashboard for content moderation.",
    description: "Naahia Admin Moderation System: I architected and implemented a secure, full-featured admin dashboard for content moderation. The system supports reviewing, resolving, and dismissing user-generated reports, with a complete audit trail of all admin actions. Access is protected by Duo SSO, ensuring only authorized admins can perform moderation tasks. The dashboard features real-time filtering, analytics, and a modern, responsive UI.",
    technologies: [
      "AdonisJS",
      "Node.js",
      "Duo SSO",
      "Tailwind CSS",
      "Edge Templates",
      "MySQL",
      "SendGrid Email API",
    ],
    userStories: [
      "As an admin, I want to securely log in with SSO so that only authorized users can access moderation tools.",
      "As an admin, I want to view, filter, and act on user reports in real-time.",
      "As an admin, I want every moderation action to be tracked for audit and transparency.",
      "As a user, I want to be notified when my report is reviewed, resolved, or dismissed.",
    ],
    challenges: [
      "Integrating secure Single Sign-On (SSO) with Duo for admin authentication.",
      "Designing a flexible, auditable moderation workflow for multiple content types (users, listings, services).",
      "Ensuring real-time updates and filtering for admin actions and reports.",
      "Maintaining a clear audit trail of all moderation activities.",
      "Learning the AdonisJS framework and Edge templating system quickly to deliver production-ready features.",
    ],
    solutions: [
      "Read and watched alot of videos on the OIDC protcols and deep dive into a lot of Github repos trying to figure out how to use the npm package for implementing OIDC in a node app. ",
      "Designed a normalized database schema for tracking reports, admin actions, and audit logs.",
      "Implemented real-time filtering and analytics for moderation actions using Edge and Tailwind CSS.",
      "Created a robust notification system to inform users of report status changes.",
      "Developed a responsive, user-friendly interface for efficient moderation workflows.",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    thumbnail: "https://i.ibb.co/9mMzCXX5/moderation.png",
    featured: true,
  },
  {
    slug: "healthconnect",
    title: "HealthConnect: Multi-Agent Medical QA System",
    year: "2025",
    status: "shipped",
    category: "AI & agent systems",
    role: "Sole developer",
    context: "Personal research",
    summary: "HealthConnect is a web application that delivers accurate, reliable, and medically validated answers to user questions by leveraging a multi-agent Large Language Model (LLM)...",
    description: "HealthConnect is a web application that delivers accurate, reliable, and medically validated answers to user questions by leveraging a multi-agent Large Language Model (LLM) system. It integrates with Model Context Protocol (MCP) servers to perform comprehensive web and medical literature searches, ensuring responses are grounded in up-to-date and trustworthy information. The system features a FastAPI backend, real-time web and PubMed search, and a modern, responsive UI. Each user query is refined, researched, and validated by specialized LLM agents, ensuring trustworthy and well-formatted answers.",
    technologies: [
      "Python",
      "FastAPI",
      "Model Context Protocol (MCP)",
      "OpenAI API",
      "Google Gemini API",
      "DeepSeek API",
      "SerpAPI",
      "PubMed/NCBI E-utilities",
      "Tailwind CSS",
      "Docker",
    ],
    userStories: [
      "As a user, I want to ask medical questions and receive accurate, up-to-date answers sourced from reputable literature and web search.",
      "As a user, I want the system to clearly indicate that information is for educational purposes and not medical advice.",
      "As a developer, I want the backend to be modular and extensible, supporting new LLM agents and search tools.",
      "As a user, I want the interface to be responsive and easy to use on any device.",
    ],
    challenges: [
      "Understanding the Model Context Protocol (MCP) and its integration",
      "Learning and using Python FastAPI for the backend",
      "Parsing and handling PubMed search results in XML",
    ],
    solutions: [
      "I solved this by reading the official documentation and watching YouTube tutorials to grasp how MCP orchestrates multi-agent workflows.",
      "I addressed this by studying FastAPI docs and following video guides to implement robust API endpoints.",
      "I researched how other projects parse PubMed XML data and watched relevant tutorials to implement reliable data extraction.",
    ],
    liveUrl: "https://multi-llm-agent-system.onrender.com",
    repoUrl: "https://github.com/starksinclair/Multi-LLM-Agent-system",
    thumbnail: "https://i.ibb.co/ZRH3bbgJ/healthconnect.png",
    featured: true,
  },
  {
    slug: "schoolflow",
    title: "School Flow",
    year: "2024–2025",
    status: "shipped",
    category: "Platforms & operational systems",
    role: "Frontend lead",
    context: "Basitech",
    summary: "A high school management software that streamlines administrative and academic workflows.",
    description: "A high school management software that streamlines administrative and academic workflows.",
    technologies: [
      "React",
      "TypeScript",
      "Redux",
    ],
    userStories: [
      "As a user, I want to manage student records.",
      "As a user, I want to view students' results.",
      "As a user, I want to generate students' results.",
      "As a user, I want to communicate with parents.",
    ],
    challenges: [
      "I needed to change the file extension of the files from .jsx to .tsx because I was migrating the project from JavaScript to TypeScript.",
      "The project had a huge codebase, and I was having issues understanding it.",
    ],
    solutions: [
      "I used a Python script to change the file extension of the files from .jsx to .tsx, which made my life easier.",
      "I just sat down and worked through the logic, reusable components, and the state management of the project, and I was able to understand the codebase.",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    thumbnail: "https://i.ibb.co/7xXCvBP4/school-flow.png",
    featured: true,
  },
  {
    slug: "pantry",
    title: "Pantry Vision",
    year: "2024",
    status: "shipped",
    category: "AI & agent systems",
    role: "Sole developer",
    context: "HeadStarter Fellowship",
    summary: "Developed a pantry management app with AI features, enabling users to track food items, label them with expiration dates, and generate recipes.",
    description: "Pantry Vision: Developed a pantry management app with AI features, enabling users to track food items, label them with expiration dates, and generate recipes. Integrated camera functionality for easy input, with a Firebase backend and Next.js frontend.",
    technologies: [
      "Next.js",
      "Firebase",
      "Tailwind CSS",
      "Gemini API",
    ],
    userStories: [
      "As a user, I want to scan food items using my camera.",
      "As a user, I want to receive recipe suggestions based on scanned items.",
      "As a user, I want to track expiration dates of food items.",
      "As a user, I want to manage my pantry inventory easily.",
      "As a user, I want to be able to save my AI-generated recipes.",
      "As a user, I want to be able to register and log in to my account using normal methods or Google details.",
      "As a user, I want to be able to view nutrition information of the food items using AI.",
    ],
    challenges: [
      "I knew nothing about Next.js.",
      "I wanted a way to store the food items in a database that wouldn't cost me anything.",
      "I didn't know where to store my Gemini API key because it was in my .env and I can't push that to GitHub even though it was on a private repo.",
      "I didn't know how to use the Gemini API.",
      "Implementing camera-based input.",
      "I needed a way to style the app faster and easier.",
      "I was totally lost on how to perform complex queries using the Firebase Firestore API.",
    ],
    solutions: [
      "Learned Next.js through documentation and tutorials.",
      "After long research, I found out about Firebase Firestore, which is a NoSQL database that is free to use.",
      "I used GitHub secrets to store my Gemini API key and used it in my Next.js app.",
      "I read the Gemini API documentation, and I also used the Gemini chatbot for situations where I was confused.",
      "Used the HTML5 camera to get the file, and then used the FileReader API to read the file and convert it to a base64 string, which I then used to query the AI for results.",
      "I used Tailwind CSS to style the app, which made it easier and faster to style the app.",
      "I read the Firebase Firestore documentation and watched a lot of videos on how to use the Firestore API to perform complex queries.",
    ],
    liveUrl: "https://pantryvision.vercel.app",
    repoUrl: "https://github.com/starksinclair/pantry-app",
    thumbnail: "https://i.ibb.co/yBGzSPVh/pantry-vision.png",
    featured: true,
  },
  {
    slug: "corpsify",
    title: "Corpsify",
    year: "2025",
    status: "shipped",
    category: "Applications & interfaces",
    role: "Sole developer",
    context: "Ball State Digital Corps",
    summary: "Corpsify is a web application that allows users to search for sounds.",
    description: "Corpsify is a web application that allows users to search for sounds. It provides a user-friendly interface for searching sounds, making it easy to find the perfect sound for any project. The app is built using React and integrates with an external API to fetch sound data.",
    technologies: [
      "React",
      "API Integration",
    ],
    userStories: [
      "As a user, I want to search for sounds easily.",
      "As a user, I want to listen to sounds before downloading.",
      "As a user, I want to download sounds.",
      "As a user, I want to add sounds to a playlist.",
      "As a user, I want to view my playlist.",
      "As a user, I want to be able to view the download count, created date, and rating of the sound.",
    ],
    challenges: [
      "This was my first time using an API.",
      "This was also my first time using React.",
      "Making an API call in React without calling the API multiple times.",
      "Didn't understand response status codes.",
      "Had lots of bugs and dependency issues from using create-react-app.",
    ],
    solutions: [
      "I read the documentation on how to use the API very thoroughly.",
      "Watched a ton of videos on how to use React, and read the documentation.",
      "Used the useEffect hook to make the API call only once, and used the useState hook to store the data.",
      "Read and watched a lot of videos on what response status codes really mean.",
      "I discussed the bugs I was facing with my peers and mentors, and they suggested using Vite instead of create-react-app in my future projects as create-react-app was getting deprecated.",
    ],
    liveUrl: "https://corpsify.vercel.app",
    repoUrl: "https://github.com/starksinclair/corpsify",
    thumbnail: "https://i.ibb.co/MDCT4fM1/corpsify.png",
    featured: false,
  },
  {
    slug: "corpstube",
    title: "Corpstube",
    year: "2024",
    status: "shipped",
    category: "Applications & interfaces",
    role: "Frontend developer",
    context: "Ball State Digital Corps",
    summary: "This custom video streaming platform, designed for Ball State University's Digital Corps, displays videos uploaded by the Digital Corps employees.",
    description: "Corpstube: This custom video streaming platform, designed for Ball State University's Digital Corps, displays videos uploaded by the Digital Corps employees. (Responsive web design)",
    technologies: [
      "React",
      "Node.js",
      "API Integration",
    ],
    userStories: [
      "As a user, I want to easily access videos.",
      "As a user, I want to search for specific content.",
      "As a user, I want to sort videos by date, either from newest to oldest or from oldest to newest.",
      "As a user, I want to provide feedback on the content.",
    ],
    challenges: [
      "I had a lot of prop drilling, which made the logic look complex, and I didn't know how to fix it.",
      "I had issues with re-rendering the new comments and likes on the video page after a user liked or commented on a video.",
      "I didn't know how to display the video page when a user clicked on the video thumbnail on the home page because I was used to making a new HTML file to display another page, but React does things differently.",
    ],
    solutions: [
      "I discussed it with my mentor, and he told me about React Context, which I could use to pass around data.",
      "I used the useEffect hook and added the comments and likes state to the dependency array to re-render the new comments and likes on the video page after a user liked or commented on a video.",
      "After asking around, I used the useParams hook to get the video ID from the URL and used it to fetch the video data from the API.",
    ],
    liveUrl: "https://corptube.netlify.app",
    repoUrl: undefined,
    thumbnail: "https://i.ibb.co/VcZPb1St/Corpstube.png",
    featured: false,
  },
  {
    slug: "poma",
    title: "Poma",
    year: "2024",
    status: "shipped",
    category: "Developer tools & automation",
    role: "Full stack developer",
    context: "APSO Projects",
    summary: "I developed a custom WordPress CMS to streamline content management for clients and a plugin to seamlessly integrate content into the live site via API endpoints, which helped...",
    description: "Poma: I developed a custom WordPress CMS to streamline content management for clients and a plugin to seamlessly integrate content into the live site via API endpoints, which helped reduce manual intervention, resulting in a more dynamic and user-friendly platform. I also worked on the frontend using React to create a responsive and interactive user interface.",
    technologies: [
      "WordPress",
      "PHP",
      "React",
    ],
    userStories: [
      "As a user, I want to easily add new content.",
      "As a user, I want to easily edit or delete content.",
      "As a user, I want to view content in a responsive layout.",
      "As a user, I want to have a seamless experience between the CMS and the live site.",
    ],
    challenges: [
      "I knew nothing about WordPress and PHP.",
      "I didn't know how to query the database to get the data I needed.",
      "I wrote a lot of bad code due to the quick deadline for this project.",
      "I didn't know how to use Git properly; there were a lot of merge conflicts, a bad Git history, and I wrote bad commit messages because I didn't know there was a strict method of writing commit messages.",
    ],
    solutions: [
      "I sat down with a senior developer to learn the basics of WordPress and how to create a custom CMS. He also gave me his huge PHP book to read, which helped me understand the basics of PHP.",
      "I read the WordPress documentation and asked a lot of questions of the senior developer, and I was able to learn and use the WordPress REST API to query the database and get the data I needed.",
      "Luckily for me, my team lead was able to help me refactor my code and also sat down with me to discuss and enlighten me further on best code practices.",
      "I read the Git documentation and watched a lot of videos on how to use Git properly, and I was able to learn how to write good commit messages.",
    ],
    liveUrl: "https://poma.apsoprojects.org/",
    repoUrl: undefined,
    thumbnail: "https://i.ibb.co/WNJkGMLQ/poma.png",
    featured: false,
  },
  {
    slug: "allcentury",
    title: "All Century Voting",
    year: "2024",
    status: "shipped",
    category: "Platforms & operational systems",
    role: "Database architecture and auth",
    context: "Ball State Digital Corps",
    summary: "I designed the database architecture, implementing vote validation, voting logic, and integrating Firebase for real-time data synchronization.",
    description: "All Century Voting: I designed the database architecture, implementing vote validation, voting logic, and integrating Firebase for real-time data synchronization.",
    technologies: [
      "Firebase",
      "Node.js",
      "Vue.js",
    ],
    userStories: [
      "As a user, I want to be able to keep track of my votes.",
      "As a user, I want to be able to see the votes of other users.",
      "As a user, I want the vote count of a player to be updated in real-time.",
    ],
    challenges: [
      "I had issues understanding the codebase, because this was my first time working on a Vue codebase.",
      "Real-time updates.",
    ],
    solutions: [
      "I read the documentation and sat down with my team lead to understand the codebase and learn how things were similar in both React and Vue, which helped me understand quickly.",
      "Implemented Firestore triggers.",
    ],
    liveUrl: "https://digitalcorps.s3.amazonaws.com/all-century-voting/dist/index.html",
    repoUrl: undefined,
    thumbnail: "https://i.ibb.co/Y7NWLVVJ/all-century-voting.png",
    featured: false,
  },
  {
    slug: "orientation",
    title: "Orientation Map",
    year: "2024",
    status: "shipped",
    category: "Applications & interfaces",
    role: "Data collection and map development",
    context: "Ball State Digital Corps",
    summary: "I collaborated with the design and UX teams to develop an interactive orientation map for incoming Ball State freshmen.",
    description: "I collaborated with the design and UX teams to develop an interactive orientation map for incoming Ball State freshmen. My primary responsibilities included data collection and map development.",
    technologies: [
      "HTML",
      "Leaflet.js",
      "CSS",
      "JQuery",
    ],
    userStories: [
      "As a user, I want to easily navigate the campus.",
      "As a user, I want to find specific buildings or locations.",
      "As a user, I want to view additional information about each location.",
      "As a user, I want to be able to zoom in and out of the map.",
    ],
    challenges: [
      "I was looking for a way to display the map that wouldn't cost anything.",
      "I was given a map image layout to use, and I had to figure out how to place markers on this map that represent the actual locations of the buildings.",
      "I had an issue trying to get a user's live location on the image map, which I didn't know how to do.",
    ],
    solutions: [
      "I found Leaflet.js, which is an open-source JavaScript library for mobile-friendly interactive maps.",
      "I used the image map feature of Leaflet.js after reading the docs, which allowed me to define the longitude and latitude of the markers on the map image, and then used the Leaflet.js API to place the markers on the map.",
      "I tried a lot of math formulas for this by using the JavaScript Geolocation API, but I couldn't get it to work. This wasn't a requirement for the project, but I thought it would be cool if I was able to figure it out.",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    thumbnail: "https://i.ibb.co/cXYd9nch/orientation-map.png",
    featured: false,
  },
  {
    slug: "cs200",
    title: "CS200 - Digital Privacy Explorer",
    year: "2024",
    status: "shipped",
    category: "Early work & coursework",
    role: "Sole developer",
    context: "CS 200 coursework, Ball State",
    summary: "Digital Privacy Explorer is an interactive web-based project designed to educate users about the concept of digital fingerprints.",
    description: "Digital Privacy Explorer is an interactive web-based project designed to educate users about the concept of digital fingerprints. The project introduces users to the concept of a 'digital fingerprint,' how it is created, how it is used for tracking, privacy laws, and which data is being collected during account creation.",
    technologies: [
      "Twine",
      "JavaScript",
    ],
    userStories: [
      "As a user, I want to learn about digital fingerprints.",
      "As a user, I want to understand how my data is being used.",
      "As a user, I want to explore the implications of digital privacy.",
      "As a user, I want to interact with the content in an engaging way.",
    ],
    challenges: [
      "I didn't want to use the Twine default story format, so I had to figure out how to change the story format.",
      "Visualizing data privacy concepts.",
      "I wanted the website to play a labyrinth sound when the user is on the page, but the browser kept blocking it.",
    ],
    solutions: [
      "I read the docs on Twine, and I was able to change it to the Snowman story format, which is for people who already know JavaScript and CSS.",
      "Used interactive UI components.",
      "I realized that the sound was being blocked because it was being played automatically, which is against the rules, so I added a button to play the sound when the user clicks on it.",
    ],
    liveUrl: "https://starksinclair.github.io/cs200_final_project/",
    repoUrl: "https://github.com/starksinclair/cs200_final_project",
    thumbnail: "https://i.ibb.co/Pzrkp607/CS200.png",
    featured: false,
  },
  {
    slug: "eng104",
    title: "ENG104 MONSTER",
    year: "2024",
    status: "shipped",
    category: "Early work & coursework",
    role: "Sole developer",
    context: "ENG 104 coursework, Ball State",
    summary: "This interactive timeline, created for my English 104 class, traces the portrayal of monsters in popular culture from their earliest appearances.",
    description: "Explore Monster Evolution Through Media: This interactive timeline, created for my English 104 class, traces the portrayal of monsters in popular culture from their earliest appearances. See how these mythical creatures have been depicted over time and how media representations have evolved. (Responsive web design)",
    technologies: [
      "React",
      "jsPDF",
    ],
    userStories: [
      "As a user, I want to explore the evolution of monsters in media.",
      "As a user, I want to interact with the timeline.",
      "As a user, I want to learn about different monster representations.",
      "As a user, I want to see the timeline in a visually appealing way.",
      "As a user, I want to take a quiz to reinforce my understanding after exploring the content.",
    ],
    challenges: [
      "Finding resources and free images to use in this project.",
      "I had a lot of images, which made the site slow.",
      "I was looking for a way to generate a PDF file from the quiz results.",
    ],
    solutions: [
      "During research, I found Wikimedia, which offers free images, and I used it to find images for my project.",
      "I found Imgbb, a free hosting platform for images.",
      "I used jsPDF, an npm package, to generate a PDF file from the quiz results.",
    ],
    liveUrl: "https://eng104monster.netlify.app",
    repoUrl: undefined,
    thumbnail: "https://i.ibb.co/gZc447VZ/ENG104-Monster.png",
    featured: false,
  },
  {
    slug: "wheeloflife",
    title: "Wheel of Life App",
    year: "2024",
    status: "on-hold",
    category: "Platforms & operational systems",
    role: "Sole developer",
    context: "Personal",
    summary: "A mindfulness and self-improvement app that allows users to assess and track their progress in different life areas through an interactive chart.",
    description: "A mindfulness and self-improvement app that allows users to assess and track their progress in different life areas through an interactive chart.",
    technologies: [
      "Next.js",
      "Firebase",
      "Tailwind CSS",
      "Chart.js",
      "Clerk Security",
    ],
    userStories: [
      "As a user, I want to assess my life areas.",
      "As a user, I want to track my progress over time.",
      "As a user, I want to set goals for each life area.",
      "As a user, I want to visualize my progress in an interactive way.",
    ],
    challenges: [
      "I faced mostly teammate challenges because this was a remote team project with teammates from different time zones.",
      "Dynamic chart rendering.",
    ],
    solutions: [
      "We were able to set meeting hours and ensure that this meeting time worked for everyone's schedule.",
      "Used Chart.js.",
    ],
    liveUrl: "https://wheel-of-life-livid.vercel.app/",
    repoUrl: "https://github.com/starksinclair/wheel-of-life-waitlist",
    thumbnail: "https://i.ibb.co/GQG9ddzk/wheel-of-life.png",
    featured: false,
  },
  {
    slug: "neybank",
    title: "Ney Bank",
    year: "2025",
    status: "on-hold",
    category: "Platforms & operational systems",
    role: "Sole developer",
    context: "Personal",
    summary: "A fintech app for managing different savings and checking accounts, investment portfolios, and allowing money transfers between accounts at different banks.",
    description: "A fintech app for managing different savings and checking accounts, investment portfolios, and allowing money transfers between accounts at different banks.",
    technologies: [
      "Next.js",
      "Clerk Security",
      "PostgreSQL",
      "Prisma ORM",
    ],
    userStories: [
      "As a user, I want to manage my savings and checking accounts.",
      "As a user, I want to view my investment portfolio.",
      "As a user, I want to transfer money between accounts at different banks.",
      "As a user, I want to view my transaction history.",
    ],
    challenges: [
      "I wanted a way to have a database that would be free to use.",
      "I needed an ORM to help me manage the database and make it easier to query the database, so I decided to use Prisma, which I knew nothing about.",
      "I wanted a way to connect the banks' API to the app, so that users can transfer money between accounts at different banks.",
    ],
    solutions: [
      "I found out about SQLite, which is a free database that is easy to use and set up, after discussing it with a fellow developer.",
      "I read the Prisma documentation, and I was able to learn how to use Prisma very quickly because it was similar to Adonis Lucid, which I am familiar with, and the concepts are the same.",
      "I discovered the Plaid API, which was very costly because I wanted to make this project public, so I had to put the project on hold.",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    thumbnail: "https://i.ibb.co/Z1p34G3g/ney-bank.png",
    featured: false,
  },
  {
    slug: "sinchat",
    title: "Sinchat",
    year: "2023",
    status: "archived",
    category: "Early work & coursework",
    role: "Sole developer",
    context: "CS 121 coursework, Ball State",
    summary: "Engage in Playful Conversation with Sinchat: This interactive chat application utilizes if/else statements to generate fun and unexpected responses to your prompts.",
    description: "Engage in Playful Conversation with Sinchat: This interactive chat application utilizes if/else statements to generate fun and unexpected responses to your prompts. Inspired by my Java class, Sinchat is a testament to the power of code to create engaging experiences.",
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
    ],
    userStories: [
      "As a user, I want to have fun conversations with the chatbot.",
      "As a user, I want to see the chatbot's responses in real-time.",
      "As a user, I want to be able to toggle light/dark mode.",
      "As a user, I want to be able to reset the chat history.",
    ],
    challenges: [
      "I had a lot of challenges with the logic of the chatbot, like if I should use the user's input to return a response.",
      "I had issues with implementing dark mode since it was my first time doing it.",
    ],
    solutions: [
      "So, I stopped overthinking and remembered my aim was to send random responses irrespective of what the user entered. I used a random number generator with a maximum length of my responses to return a random response from the object (key: value) of responses.",
      "I used a static solution for dark mode, which was an onclick event: if the body is light, then turn to dark. This method doesn't account for users who have their device set to dark mode, which can result in a bad user experience. But I learned how to use CSS variables and media queries in my next projects.",
    ],
    liveUrl: "https://sinchats.netlify.app",
    repoUrl: undefined,
    thumbnail: "https://i.ibb.co/fYYFWSRd/Sinchat.png",
    featured: false,
  },
  {
    slug: "saintly",
    title: "Saintly",
    year: "2022",
    status: "archived",
    category: "Early work & coursework",
    role: "Sole developer",
    context: "Freelance",
    summary: "My First Steps in Web Development: This freelancing website marks my step into the world of web development.",
    description: "Saintly: My First Steps in Web Development: This freelancing website marks my step into the world of web development. It served as a valuable learning experience as I explored the fundamentals of building web applications.",
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "Bootstrap",
    ],
    userStories: [
      "As a user, I want to view the services offered.",
      "As a user, I want to contact the service provider.",
      "As a user, I want to view testimonials and ratings of a freelancer.",
      "As a user, I want to view the portfolio of a freelancer.",
      "As a user, I want to view the about us page.",
      "As a user, I want to view the pricing page easily.",
    ],
    challenges: [
      "Structuring a scalable layout.",
      "I had a lot of duplicated code, and I didn't know how to make it reusable, like having a product card component.",
      "I had issues with utilizing carousels and sliders.",
      "I didn't know about many CSS properties and how to use them.",
    ],
    solutions: [
      "Used Bootstrap for responsiveness.",
      "I had no solution for the duplicated code, but I learned how to make reusable components in my next projects when I used React, which made me appreciate a tool like React.",
      "I used Bootstrap carousels and sliders, and I learned how to use them properly by reading the docs on W3Schools and watching a ton of videos on YouTube.",
      "I read the documentation on W3Schools and MDN Web Docs to learn about CSS properties and how to use them.",
    ],
    liveUrl: undefined,
    repoUrl: undefined,
    thumbnail: "https://i.ibb.co/4RhpMT6Z/Saintly.png",
    featured: false,
  },];

export const featuredProjects = projects.filter((p) => p.featured);

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectsByCategory(): [ProjectCategory, Project[]][] {
  return CATEGORY_ORDER.map(
    (c) => [c, projects.filter((p) => p.category === c)] as [ProjectCategory, Project[]],
  ).filter(([, list]) => list.length > 0);
}
