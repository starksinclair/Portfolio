/**
 * The route table: one definition of what each URL is.
 *
 * Why this file exists: social and search crawlers (Facebook, LinkedIn, Slack,
 * iMessage, Discord, X, and Google's non-rendering first pass) do not execute
 * JavaScript. In a single-page app every URL serves the same `index.html`, so
 * without this every shared link previews as the home page.
 *
 * `vite.config.ts` reads this table at build time and emits a real HTML file per
 * route with that route's title, description, Open Graph tags and schema.org
 * graph baked into the head. `Page.tsx` reads the same table at runtime. One
 * source, so what a crawler sees and what the app sets can never disagree.
 */

import { profile, SITE_URL } from "../data/profile";
import { projects, projectBySlug } from "../data/projects";
import { posts, postBySlug } from "../data/posts";
import { mentions, publications } from "../data/press";
import { navOrder } from "../nav";
import {
  graph,
  webPageNode,
  projectNode,
  blogNode,
  blogPostingNode,
  scholarlyArticleNode,
  mentionNode,
  itemListNode,
  cvDocumentNode,
  ID,
  type Crumb,
} from "./schema";

export interface RouteSeo {
  path: string;
  /** Without the site name, which `documentTitle` appends. */
  title: string;
  description: string;
  ogType: "website" | "article" | "profile";
  jsonLd: unknown;
  crumbs: Crumb[];
  /**
   * Extra `<meta name=... content=...>` tags for this route only, repeated
   * names allowed. Used for the `citation_*` set that Google Scholar's crawler
   * reads; see the `/research` entry.
   */
  extraMeta?: { name: string; content: string }[];
  /**
   * Keep this page out of the index, and omit its canonical. Only the 404 page
   * uses it: it is served at every address that does not exist, so there is no
   * one URL for a canonical to name.
   */
  noIndex?: boolean;
  /** ISO 8601, for the sitemap. */
  lastmod?: string;
  changefreq: string;
  priority: string;
}

const home: Crumb = { name: "Overview", path: "/" };

/** The `<title>` for a path. Shared by the prerenderer and the runtime head. */
export function documentTitle(path: string, title: string): string {
  return path === "/"
    ? `${profile.name}, Software Engineer & Researcher`
    : `${title} · ${profile.name}`;
}

/**
 * The Highwire Press `citation_*` tags for one publication.
 *
 * This is the vocabulary Google Scholar's crawler understands, and it is the
 * only machine-readable thing on the page that ties this site to the paper in
 * Scholar's index. Repeated `citation_author` tags are correct and required:
 * one per author, in the order they appear on the article.
 */
function citationMeta(m: (typeof publications)[number]) {
  const c = m.citation!;
  return [
    { name: "citation_title", content: m.title },
    ...c.authors.map((a) => ({ name: "citation_author", content: a })),
    { name: "citation_publication_date", content: c.datePublished.replace(/-/g, "/") },
    { name: "citation_journal_title", content: c.journal },
    { name: "citation_volume", content: c.volume },
    { name: "citation_issue", content: c.issue },
    { name: "citation_firstpage", content: c.articleNumber },
    { name: "citation_doi", content: c.doi },
    { name: "citation_issn", content: c.issn },
    { name: "citation_publisher", content: "MDPI" },
    { name: "citation_language", content: "en" },
    { name: "citation_keywords", content: c.keywords.join("; ") },
    { name: "citation_abstract_html_url", content: c.journalUrl },
    { name: "citation_pdf_url", content: c.pdfUrl },
  ];
}

function staticRoutes(): RouteSeo[] {
  const featured = projects.filter((p) => p.featured);
  const latestPosts = [...posts]
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished))
    .slice(0, 3);
  const paper = publications[0];

  return [
    {
      path: "/",
      title: "Overview",
      description: profile.summary,
      ogType: "profile",
      crumbs: [home],
      changefreq: "weekly",
      priority: "1.0",
      jsonLd: graph([
        webPageNode({
          path: "/",
          title: documentTitle("/", "Overview"),
          description: profile.summary,
          type: "ProfilePage",
          crumbs: [home],
        }),
        scholarlyArticleNode(paper),
        blogNode(),
        ...featured.map(projectNode),
        ...latestPosts.map(blogPostingNode),
        ...relatedProjectNodes(latestPosts),
      ]),
    },
    {
      path: "/about",
      title: "About",
      description:
        "How Sinclair Nzenwata got from learning to program on a phone in Nigeria to researching whether document accessibility can be enforced while someone writes, and what he builds in between.",
      ogType: "website",
      crumbs: [home, { name: "About", path: "/about" }],
      changefreq: "monthly",
      priority: "0.8",
      jsonLd: graph([
        webPageNode({
          path: "/about",
          title: documentTitle("/about", "About"),
          description: profile.summary,
          type: "AboutPage",
          crumbs: [home, { name: "About", path: "/about" }],
        }),
      ]),
    },
    {
      path: "/experience",
      title: "Experience",
      description:
        "Software engineering roles at SportyKore, Ball State Digital Corps, Basitech and HeadStarter, and a BSc in Computer Science at Ball State University.",
      ogType: "website",
      crumbs: [home, { name: "Experience", path: "/experience" }],
      changefreq: "monthly",
      priority: "0.8",
      jsonLd: graph([
        webPageNode({
          path: "/experience",
          title: documentTitle("/experience", "Experience"),
          description:
            "Employment and education, with what Sinclair personally owned at each place.",
          crumbs: [home, { name: "Experience", path: "/experience" }],
        }),
      ]),
    },
    {
      path: "/projects",
      title: "Projects",
      description: `${projects.length} projects, from a multi-tenant Go platform with Postgres row-level security to multi-agent AI systems. Each entry lists the role, the problems and the fixes.`,
      ogType: "website",
      crumbs: [home, { name: "Projects", path: "/projects" }],
      changefreq: "monthly",
      priority: "0.8",
      jsonLd: graph([
        webPageNode({
          path: "/projects",
          title: documentTitle("/projects", "Projects"),
          description: `An index of ${projects.length} projects.`,
          type: "CollectionPage",
          crumbs: [home, { name: "Projects", path: "/projects" }],
        }),
        itemListNode({
          id: `${SITE_URL}/projects#list`,
          name: "Projects",
          items: projects.map((p) => ({
            id: ID.project(p.slug),
            name: p.title,
            url: `${SITE_URL}/projects/${p.slug}`,
          })),
        }),
        ...projects.map(projectNode),
      ]),
    },
    {
      path: "/research",
      title: "Research",
      description:
        "Peer-reviewed work on ordinal time series forecasting in Forecasting (MDPI), a CS 499 study on enforcing document accessibility at authoring time, two studies of how AI coding agents handle ambiguity and context, and the Ball State campus energy dashboard.",
      ogType: "website",
      crumbs: [home, { name: "Research", path: "/research" }],
      changefreq: "monthly",
      priority: "0.8",
      /**
       * Google Scholar does not read schema.org; it reads the `citation_*`
       * tags defined by the Highwire Press convention, which is why they are
       * here in addition to the `ScholarlyArticle` node. Every value is taken
       * from `press.ts`, and the URLs point at the publisher of record rather
       * than at this site: this page lists the paper, it does not host it.
       */
      extraMeta: citationMeta(paper),
      jsonLd: graph([
        webPageNode({
          path: "/research",
          title: documentTitle("/research", "Research"),
          description: "Publications and research in progress.",
          type: "CollectionPage",
          crumbs: [home, { name: "Research", path: "/research" }],
        }),
        ...publications.map(scholarlyArticleNode),
        ...(projectBySlug("accessibility-docs")
          ? [projectNode(projectBySlug("accessibility-docs")!)]
          : []),
      ]),
    },
    {
      path: "/writing",
      title: "Blog",
      description:
        "Notes on building software systems, applied AI, and research. Architecture decisions written down while they were still annoying.",
      ogType: "website",
      crumbs: [home, { name: "Writing", path: "/writing" }],
      changefreq: "weekly",
      priority: "0.8",
      jsonLd: graph([
        webPageNode({
          path: "/writing",
          title: documentTitle("/writing", "Blog"),
          description: "Notes on building software systems, applied AI, and research.",
          type: "CollectionPage",
          crumbs: [home, { name: "Writing", path: "/writing" }],
        }),
        blogNode(),
        itemListNode({
          id: `${SITE_URL}/writing#list`,
          name: "Blog posts",
          items: latestPostsAll().map((p) => ({
            id: ID.post(p.slug),
            name: p.title,
            url: `${SITE_URL}/writing/${p.slug}`,
          })),
        }),
        ...latestPostsAll().map(blogPostingNode),
        ...relatedProjectNodes(latestPostsAll()),
      ]),
    },
    {
      path: "/press",
      title: "Press & recognition",
      description:
        "External coverage: a peer-reviewed publication in Forecasting, Ball State Daily News reports on SGA senate work, Building Indiana on the Cummins Xtern Challenge, a university feature, and the LewerMark Make Your Mark scholarship.",
      ogType: "website",
      crumbs: [home, { name: "Press & recognition", path: "/press" }],
      changefreq: "monthly",
      priority: "0.8",
      jsonLd: graph([
        webPageNode({
          path: "/press",
          title: documentTitle("/press", "Press & recognition"),
          description: "External coverage and recognition.",
          type: "CollectionPage",
          crumbs: [home, { name: "Press & recognition", path: "/press" }],
        }),
        itemListNode({
          id: `${SITE_URL}/press#list`,
          name: "Press and recognition",
          items: orderedMentions().map((m) => ({
            id: ID.mention(m.id),
            name: m.title,
            url: m.url,
          })),
        }),
        ...orderedMentions().map((m) =>
          m.kind === "publication" ? scholarlyArticleNode(m) : mentionNode(m),
        ),
      ]),
    },
    {
      path: "/cv",
      title: "Curriculum vitae",
      description: `Curriculum vitae for ${profile.name}: education, publications, research, professional experience, ventures and technical skills, as real text, plus a tagged PDF.`,
      ogType: "profile",
      crumbs: [home, { name: "CV", path: "/cv" }],
      changefreq: "monthly",
      priority: "0.8",
      jsonLd: graph([
        webPageNode({
          path: "/cv",
          title: documentTitle("/cv", "Curriculum vitae"),
          description: `Curriculum vitae for ${profile.name}.`,
          type: "ProfilePage",
          crumbs: [home, { name: "CV", path: "/cv" }],
        }),
        cvDocumentNode(),
      ]),
    },
    {
      path: "/contact",
      title: "Contact",
      description:
        "Open to software engineering and AI roles, research collaboration, and freelance work.",
      ogType: "website",
      crumbs: [home, { name: "Contact", path: "/contact" }],
      changefreq: "yearly",
      priority: "0.6",
      jsonLd: graph([
        webPageNode({
          path: "/contact",
          title: documentTitle("/contact", "Contact"),
          description: `How to reach ${profile.name}.`,
          type: "ContactPage",
          crumbs: [home, { name: "Contact", path: "/contact" }],
        }),
      ]),
    },
    {
      path: "/colophon",
      title: "Colophon",
      description:
        "The meaning behind my dripping S mark, a reminder to be happy now, and why I chose Tyrian purple.",
      ogType: "website",
      crumbs: [home, { name: "Colophon", path: "/colophon" }],
      changefreq: "yearly",
      priority: "0.3",
      jsonLd: graph([
        webPageNode({
          path: "/colophon",
          title: documentTitle("/colophon", "Colophon"),
          description: "How this site is designed and built, and why.",
          crumbs: [home, { name: "Colophon", path: "/colophon" }],
        }),
      ]),
    },
  ];
}

function latestPostsAll() {
  return [...posts].sort((a, b) => b.datePublished.localeCompare(a.datePublished));
}

/**
 * The project nodes referenced by these posts' `about`. A reference to a node
 * that is not in the same graph is a dangling edge, so they ship together.
 */
function relatedProjectNodes(list: typeof posts) {
  const slugs = new Set(
    list.map((p) => p.relatedProject).filter((s): s is string => Boolean(s)),
  );
  return [...slugs]
    .map((slug) => projectBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map(projectNode);
}

function orderedMentions() {
  return [...mentions].sort((a, b) => b.date.localeCompare(a.date));
}

function projectRoutes(): RouteSeo[] {
  return projects.map((p) => {
    const crumbs: Crumb[] = [
      home,
      { name: "Projects", path: "/projects" },
      { name: p.title, path: `/projects/${p.slug}` },
    ];
    return {
      path: `/projects/${p.slug}`,
      title: p.title,
      description: p.summary,
      ogType: "website" as const,
      crumbs,
      changefreq: "yearly",
      priority: "0.6",
      jsonLd: graph([
        webPageNode({
          path: `/projects/${p.slug}`,
          title: documentTitle(`/projects/${p.slug}`, p.title),
          description: p.summary,
          crumbs,
        }),
        projectNode(p),
      ]),
    };
  });
}

function postRoutes(): RouteSeo[] {
  return posts.map((post) => {
    const crumbs: Crumb[] = [
      home,
      { name: "Writing", path: "/writing" },
      { name: post.title, path: `/writing/${post.slug}` },
    ];
    return {
      path: `/writing/${post.slug}`,
      title: post.title,
      description: post.description,
      ogType: "article" as const,
      crumbs,
      lastmod: post.dateModified ?? post.datePublished,
      changefreq: "yearly",
      priority: "0.7",
      jsonLd: graph([
        webPageNode({
          path: `/writing/${post.slug}`,
          title: documentTitle(`/writing/${post.slug}`, post.title),
          description: post.description,
          crumbs,
          dateModified: post.dateModified ?? post.datePublished,
        }),
        blogNode(),
        blogPostingNode(post),
        ...relatedProjectNodes([post]),
      ]),
    };
  });
}

/**
 * The 404 page, prerendered so the host has a real file to serve.
 *
 * Deliberately not in `allRoutes()`: it must never reach the sitemap, and its
 * head is the one head on the site that tells crawlers to stay away. Vercel
 * serves `404.html` from the build output whenever a request matches no other
 * file, which is how a bad URL reaches this instead of Vercel's own error page.
 */
export function notFoundRoute(): RouteSeo {
  const title = "Not found";
  const description =
    "There is no page at this address. It may have been renamed, or the link may be wrong.";

  return {
    path: "/404",
    title,
    description,
    ogType: "website",
    noIndex: true,
    crumbs: [home],
    changefreq: "yearly",
    priority: "0.0",
    jsonLd: graph([
      webPageNode({
        path: "/404",
        title: documentTitle("/404", title),
        description,
        crumbs: [home],
      }),
    ]),
  };
}

/** Every prerenderable route, in sidebar order then content order. */
export function allRoutes(): RouteSeo[] {
  const statics = staticRoutes();
  const byPath = new Map(statics.map((r) => [r.path, r]));
  /* Keep the sidebar's order so the sitemap reads the way the site does. */
  const ordered = navOrder
    .map((n) => byPath.get(n.path))
    .filter((r): r is RouteSeo => r !== undefined);
  const rest = statics.filter((r) => !ordered.includes(r));

  return [...ordered, ...rest, ...projectRoutes(), ...postRoutes()];
}

const routeIndex = new Map(allRoutes().map((r) => [r.path, r]));

/** Lookup for the runtime head. Dynamic routes resolve by their full path. */
export function routeSeo(path: string): RouteSeo | undefined {
  return routeIndex.get(path);
}

/** Guards against a slug existing in one table but not the other. */
export function hasContent(path: string): boolean {
  if (path.startsWith("/projects/")) return !!projectBySlug(path.slice(10));
  if (path.startsWith("/writing/")) return !!postBySlug(path.slice(9));
  return routeIndex.has(path);
}
