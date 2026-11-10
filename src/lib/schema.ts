/**
 * schema.org structured data.
 *
 * Design notes, because getting this right is the point:
 *
 * 1. One linked graph, not a pile of disconnected objects. Every node has a stable
 *    `@id` (a URL with a fragment) and nodes reference each other by `@id` instead
 *    of re-describing the same Person five times. That is what lets a consumer
 *    resolve "the author of this BlogPosting" to "the Person this site is about".
 *
 * 2. Correct types only. The previous version of this site emitted
 *    `worksFor: { "@type": "Digital Corps" }`. "Digital Corps" is not a schema.org
 *    type, which makes the whole node invalid. Organisations are `Organization`,
 *    universities are `CollegeOrUniversity`, journal articles are
 *    `ScholarlyArticle`, repositories are `SoftwareSourceCode`.
 *
 * 3. Nothing is asserted that is not true. No `aggregateRating` on projects, no
 *    `SearchAction` (there is no search endpoint), no `image` pointing at a file
 *    that does not exist.
 *
 * Reference: https://schema.org
 */

import { profile, SITE_URL, positions, education } from "../data/profile";
import { cvMeta } from "../data/cv";
import type { Post } from "../data/posts";
import type { Project } from "../data/projects";
import { mentions, type Mention } from "../data/press";

/** Re-exported so pages building ItemLists need only one import. */
export { SITE_URL };

/* ── stable node identifiers ─────────────────────────────────────────── */

export const ID = {
  person: `${SITE_URL}/#person`,
  website: `${SITE_URL}/#website`,
  blog: `${SITE_URL}/writing#blog`,
  organization: (slug: string) => `${SITE_URL}/#org-${slug}`,
  page: (path: string) => `${SITE_URL}${path}#webpage`,
  post: (slug: string) => `${SITE_URL}/writing/${slug}#post`,
  project: (slug: string) => `${SITE_URL}/projects/${slug}#project`,
  mention: (id: string) => `${SITE_URL}/press#${id}`,
  cv: `${SITE_URL}/cv#document`,
};

const ref = (id: string) => ({ "@id": id });

function orgSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ── core nodes ──────────────────────────────────────────────────────── */

/** Organisations referenced by `worksFor` / `alumniOf`, declared once. */
export function organizationNodes() {
  const orgs = new Map<string, Record<string, unknown>>();

  for (const p of positions) {
    const slug = orgSlug(p.organization);
    if (!orgs.has(slug)) {
      orgs.set(slug, {
        "@type": "Organization",
        "@id": ID.organization(slug),
        name: p.organization,
        ...(p.organizationUrl ? { url: p.organizationUrl } : {}),
      });
    }
  }

  for (const e of education) {
    const slug = orgSlug(e.institution);
    orgs.set(slug, {
      "@type": "CollegeOrUniversity",
      "@id": ID.organization(slug),
      name: e.institution,
      ...(e.institutionUrl ? { url: e.institutionUrl } : {}),
    });
  }

  return [...orgs.values()];
}

/**
 * `hasOccupation` describes what he does; the `OrganizationRole` entries under
 * `worksFor` carry the dated employment history, which a bare `worksFor` cannot.
 */
function occupationNodes() {
  return positions.map((p) => ({
    "@type": "OrganizationRole",
    roleName: p.role,
    startDate: p.startDate,
    ...(p.endDate ? { endDate: p.endDate } : {}),
    worksFor: ref(ID.organization(orgSlug(p.organization))),
  }));
}

export function personNode() {
  const current = positions.filter((p) => !p.endDate);

  return {
    "@type": "Person",
    "@id": ID.person,
    name: profile.name,
    givenName: profile.givenName,
    familyName: profile.familyName,
    additionalName: profile.additionalName,
    url: SITE_URL,
    jobTitle: profile.jobTitle,
    description: profile.bio,
    disambiguatingDescription: profile.headline,
    email: `mailto:${profile.email}`,
    image: `${SITE_URL}/profile.jpg`,
    nationality: {
      "@type": "Country",
      name: profile.hometown.countryName,
    },
    homeLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: profile.location.city,
        addressRegion: profile.location.region,
        addressCountry: profile.location.country,
      },
    },
    birthPlace: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: profile.hometown.city,
        addressRegion: profile.hometown.region,
        addressCountry: profile.hometown.country,
      },
    },
    knowsLanguage: [
      { "@type": "Language", name: "English" },
      { "@type": "Language", name: "Igbo" },
    ],
    knowsAbout: [...profile.knowsAbout],
    worksFor: current.map((p) => ref(ID.organization(orgSlug(p.organization)))),
    hasOccupation: occupationNodes(),
    alumniOf: education.map((e) => ref(ID.organization(orgSlug(e.institution)))),
    /** Things published *about* him. The inverse of `about`. */
    subjectOf: mentions
      .filter((m) => m.kind !== "publication")
      .map((m) => ref(ID.mention(m.id))),
    /** The ORCID as an identifier as well as a `sameAs`: one says "this is the
        same person", the other says "this is their registered iD". */
    ...(profile.socials.orcid
      ? {
          identifier: {
            "@type": "PropertyValue",
            propertyID: "ORCID",
            value: profile.socials.orcid,
          },
        }
      : {}),
    /**
     * `sameAs` is how a search engine merges the profiles it finds into one
     * entity. The scholarly identifiers earn their place here: they connect
     * "the person this site is about" to "the Nzenwata on the Forecasting
     * paper". Undefined ones are dropped rather than emitted empty.
     */
    sameAs: [
      profile.socials.github,
      profile.socials.linkedin,
      profile.socials.twitter,
      profile.socials.googleScholarProfile,
      profile.socials.orcid,
    ].filter(Boolean),
  };
}

export function webSiteNode() {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: SITE_URL,
    name: `${profile.name}: Documentation`,
    description: profile.summary,
    inLanguage: "en-US",
    author: ref(ID.person),
    publisher: ref(ID.person),
    copyrightHolder: ref(ID.person),
    /* No `potentialAction: SearchAction`. The site has no search endpoint, and
       declaring one that does not exist is the most common schema.org lie. */
  };
}

/* ── page-level nodes ────────────────────────────────────────────────── */

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbNode(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

/**
 * The CV PDF as a thing in its own right. `encodingFormat` and the explicit
 * `accessibilityFeature` values are what tell a machine the download is a
 * tagged PDF rather than a scan, which is the whole claim the file makes.
 */
export function cvDocumentNode() {
  return {
    "@type": "DigitalDocument",
    "@id": ID.cv,
    name: `${profile.name}, Curriculum Vitae`,
    url: `${SITE_URL}${cvMeta.pdfPath}`,
    encodingFormat: "application/pdf",
    inLanguage: "en-US",
    author: ref(ID.person),
    about: ref(ID.person),
    isPartOf: ref(ID.page("/cv")),
    accessibilityFeature: [
      "structuralNavigation",
      "taggedPDF",
      "readingOrder",
      "displayTransformability",
    ],
    accessibilityHazard: "none",
    accessMode: "textual",
    accessModeSufficient: ["textual"],
  };
}

export function webPageNode(opts: {
  path: string;
  title: string;
  description: string;
  type?: "WebPage" | "ProfilePage" | "CollectionPage" | "AboutPage" | "ContactPage";
  crumbs?: Crumb[];
  dateModified?: string;
}) {
  return {
    "@type": opts.type ?? "WebPage",
    "@id": ID.page(opts.path),
    url: `${SITE_URL}${opts.path}`,
    name: opts.title,
    description: opts.description,
    inLanguage: "en-US",
    isPartOf: ref(ID.website),
    about: ref(ID.person),
    /* ProfilePage's documented primary-subject property is `mainEntity`. */
    ...(opts.type === "ProfilePage" ? { mainEntity: ref(ID.person) } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    ...(opts.crumbs?.length ? { breadcrumb: breadcrumbNode(opts.crumbs) } : {}),
  };
}

/* ── content nodes ───────────────────────────────────────────────────── */

/** Rough word count from the structured body, for `wordCount`. */
function wordCount(post: Post) {
  const text = post.body
    .map((b) => {
      if ("text" in b) return b.text;
      if ("items" in b) return b.items.join(" ");
      if ("code" in b) return "";
      return "";
    })
    .join(" ");
  return text.trim().split(/\s+/).length;
}

export function blogNode() {
  return {
    "@type": "Blog",
    "@id": ID.blog,
    url: `${SITE_URL}/writing`,
    name: `Writing: ${profile.name}`,
    description:
      "Notes on building software systems, applied AI, and research in forecasting and accessibility.",
    inLanguage: "en-US",
    author: ref(ID.person),
    publisher: ref(ID.person),
  };
}

export function blogPostingNode(post: Post) {
  const url = `${SITE_URL}/writing/${post.slug}`;
  return {
    "@type": "BlogPosting",
    "@id": ID.post(post.slug),
    url,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    author: ref(ID.person),
    publisher: ref(ID.person),
    isPartOf: ref(ID.blog),
    inLanguage: "en-US",
    keywords: post.tags.join(", "),
    wordCount: wordCount(post),
    timeRequired: `PT${post.readingMinutes}M`,
    ...(post.relatedProject ? { about: ref(ID.project(post.relatedProject)) } : {}),
  };
}

/**
 * `SoftwareSourceCode` is the right type for a project with a repository.
 * `WebApplication` is added via `targetProduct` when there is a live deployment,
 * because the code and the running thing are different entities.
 */
export function projectNode(project: Project) {
  const url = `${SITE_URL}/projects/${project.slug}`;
  return {
    "@type": "SoftwareSourceCode",
    "@id": ID.project(project.slug),
    url,
    mainEntityOfPage: url,
    name: project.title,
    headline: project.title,
    description: project.summary,
    abstract: project.description,
    author: ref(ID.person),
    creator: ref(ID.person),
    inLanguage: "en-US",
    keywords: project.technologies.join(", "),
    programmingLanguage: project.technologies.map((t) => ({
      "@type": "ComputerLanguage",
      name: t,
    })),
    ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}),
    ...(project.liveUrl
      ? {
          targetProduct: {
            "@type": "WebApplication",
            name: project.title,
            url: project.liveUrl,
            applicationCategory: "WebApplication",
            operatingSystem: "Any",
            browserRequirements: "Requires JavaScript",
          },
        }
      : {}),
    ...(project.thumbnail ? { image: project.thumbnail } : {}),
  };
}

/** A journal article. DOI goes in `identifier` as a PropertyValue, plus `sameAs`. */
export function scholarlyArticleNode(m: Mention) {
  const c = m.citation!;
  return {
    "@type": "ScholarlyArticle",
    "@id": ID.mention(m.id),
    url: m.url,
    headline: m.title,
    name: m.title,
    abstract: m.description,
    datePublished: c.datePublished,
    inLanguage: "en-US",
    author: c.authors.map((a) =>
      a === profile.name
        ? ref(ID.person)
        : { "@type": "Person", name: a },
    ),
    publisher: { "@type": "Organization", name: "MDPI" },
    isPartOf: {
      "@type": "PublicationIssue",
      issueNumber: c.issue,
      datePublished: c.datePublished,
      isPartOf: {
        "@type": "PublicationVolume",
        volumeNumber: c.volume,
        isPartOf: {
          "@type": "Periodical",
          name: c.journal,
          issn: c.issn,
          publisher: { "@type": "Organization", name: "MDPI" },
        },
      },
    },
    pagination: c.articleNumber,
    /** The author keywords, verbatim from the article. */
    keywords: c.keywords,
    about: c.keywords.map((k) => ({ "@type": "DefinedTerm", name: k })),
    identifier: [
      { "@type": "PropertyValue", propertyID: "DOI", value: c.doi },
      { "@type": "PropertyValue", propertyID: "ISSN", value: c.issn },
    ],
    /** Every address this one work lives at, so none of them looks like a
        separate paper: publisher page, PDF, preprint, Scholar record. */
    sameAs: [
      `https://doi.org/${c.doi}`,
      c.journalUrl,
      c.pdfUrl,
      c.preprintUrl,
      c.scholarUrl,
    ],
    encoding: {
      "@type": "MediaObject",
      contentUrl: c.pdfUrl,
      encodingFormat: "application/pdf",
    },
    /* A plain URL, not an `@id` reference: this node also appears on `/` and
       `/press`, whose graphs do not declare the research page. */
    mainEntityOfPage: `${SITE_URL}/research`,
    copyrightYear: c.year,
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
  };
}

/**
 * Coverage written by someone else. `about` points back at the Person, which is
 * the correct inverse of `Person.subjectOf`.
 */
export function mentionNode(m: Mention) {
  const type = m.kind === "news" ? "NewsArticle" : "Article";
  return {
    "@type": type,
    "@id": ID.mention(m.id),
    url: m.url,
    headline: m.title,
    description: m.description,
    datePublished: m.date,
    inLanguage: "en-US",
    about: ref(ID.person),
    mentions: ref(ID.person),
    publisher: {
      "@type": "Organization",
      name: m.outlet,
      ...(m.outletUrl ? { url: m.outletUrl } : {}),
    },
  };
}

export function itemListNode(opts: {
  id: string;
  name: string;
  items: { id: string; name: string; url: string }[];
}) {
  return {
    "@type": "ItemList",
    "@id": opts.id,
    name: opts.name,
    numberOfItems: opts.items.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: opts.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: it.url,
      item: ref(it.id),
    })),
  };
}

/* ── assembly ────────────────────────────────────────────────────────── */

/**
 * Wraps nodes into a single `@graph`. The Person, WebSite and the organisations
 * they reference are always present, so any page's graph resolves on its own
 * without the crawler needing to have seen the home page first.
 */
export function siteNodes() {
  const declared = new Set<string>();
  const coverage = mentions
    .filter((m) => m.kind !== "publication")
    .map((m) => mentionNode(m));

  const base = [personNode(), webSiteNode(), ...organizationNodes(), ...coverage];
  for (const n of base) declared.add(n["@id"] as string);
  return { base, declared };
}

/**
 * Wraps page nodes into one `@graph` alongside the site-wide nodes.
 *
 * Person, WebSite, the organisations and the coverage articles are always
 * present, because `Person.worksFor`, `alumniOf` and `subjectOf` reference them
 * by `@id`, and a reference to a node that is not in the document is a dangling
 * edge, so they travel together. Page nodes that duplicate an `@id` already in
 * the base set are dropped rather than emitted twice.
 */
export function graph(nodes: Record<string, unknown>[]) {
  const { base, declared } = siteNodes();
  const extra = nodes.filter((n) => {
    const id = n["@id"] as string | undefined;
    if (id && declared.has(id)) return false;
    if (id) declared.add(id);
    return true;
  });

  return {
    "@context": "https://schema.org",
    "@graph": [...base, ...extra],
  };
}
