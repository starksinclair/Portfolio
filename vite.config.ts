import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/* The config is TypeScript and esbuild-bundled, so it can import the real site
   modules. That is deliberate: the sitemap, robots.txt, the per-route HTML and
   the static JSON-LD are all generated from the same source as the app, so they
   cannot drift from what the site actually contains. */
import { profile, SITE_URL } from "./src/data/profile";
import { allRoutes, documentTitle, type RouteSeo } from "./src/lib/routes";
import { siteNodes } from "./src/lib/schema";
import {
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_TYPE,
  OG_IMAGE_URL,
  OG_IMAGE_WIDTH,
  TWITTER_HANDLE,
} from "./src/lib/og";

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** JSON-LD is inside a <script>, so only `</` needs neutralising. */
function escapeJsonLd(json: string): string {
  return json.replace(/<\//g, "<\\/");
}

/**
 * Fails the build on a schema.org graph that references an `@id` it does not
 * contain. A dangling edge is the failure mode this structure exists to avoid,
 * and it is invisible in the rendered page, so it is checked here instead of
 * being left to a manual audit.
 */
function assertGraphResolves(path: string, jsonLd: unknown): string | null {
  const g = jsonLd as { "@graph": Record<string, unknown>[] };
  const declared = new Set<string>();
  for (const node of g["@graph"]) {
    const id = node["@id"] as string | undefined;
    if (!id) continue;
    if (declared.has(id)) return `${path}: duplicate node @id ${id}`;
    declared.add(id);
  }

  const dangling = new Set<string>();
  const walk = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(walk);
    } else if (value && typeof value === "object") {
      const keys = Object.keys(value);
      if (keys.length === 1 && keys[0] === "@id") {
        const id = (value as { "@id": string })["@id"];
        if (!declared.has(id)) dangling.add(id);
        return;
      }
      Object.values(value).forEach(walk);
    }
  };
  walk(g["@graph"]);

  return dangling.size
    ? `${path}: ${dangling.size} dangling @id reference(s): ${[...dangling].join(", ")}`
    : null;
}

/** The head tags for one route, as HTML. */
function headFor(route: RouteSeo): string {
  const title = escapeAttr(documentTitle(route.path, route.title));
  const description = escapeAttr(route.description);
  const url = `${SITE_URL}${route.path === "/" ? "/" : route.path}`;

  /* Repeated names (citation_author) are intentional, so these are appended
     rather than merged into the fixed block above. `data-route-meta` marks them
     as the route head hook's property: when the app hydrates it clears those and
     re-adds the current route's, so navigating away cannot leave a citation tag
     behind, and hydrating cannot double it. */
  const extra = (route.extraMeta ?? [])
    .map(
      (m) =>
        `\n    <meta name="${escapeAttr(m.name)}" content="${escapeAttr(
          m.content,
        )}" data-route-meta />`,
    )
    .join("");

  return `    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="author" content="${escapeAttr(profile.name)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${url}" />

    <meta property="og:type" content="${route.ogType}" />
    <meta property="og:site_name" content="${escapeAttr(profile.name)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${OG_IMAGE_URL}" />
    <meta property="og:image:secure_url" content="${OG_IMAGE_URL}" />
    <meta property="og:image:type" content="${OG_IMAGE_TYPE}" />
    <meta property="og:image:width" content="${OG_IMAGE_WIDTH}" />
    <meta property="og:image:height" content="${OG_IMAGE_HEIGHT}" />
    <meta property="og:image:alt" content="${escapeAttr(OG_IMAGE_ALT)}" />
    <meta property="og:locale" content="en_US" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="${TWITTER_HANDLE}" />
    <meta name="twitter:creator" content="${TWITTER_HANDLE}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${OG_IMAGE_URL}" />
    <meta name="twitter:image:alt" content="${escapeAttr(OG_IMAGE_ALT)}" />${extra}`;
}

/**
 * Emits sitemap.xml and robots.txt from the route table.
 */
function seoFiles(): Plugin {
  return {
    name: "seo-files",
    apply: "build",
    generateBundle() {
      const routes = allRoutes();
      const today = new Date().toISOString().slice(0, 10);

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${r.lastmod ?? today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

      const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap });
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots });
    },
  };
}

/**
 * Writes the site-wide schema.org graph into the dev-server HTML.
 *
 * In a production build the prerenderer below replaces this with a per-route
 * graph, so this only matters for `vite dev`.
 */
function devJsonLd(): Plugin {
  return {
    name: "dev-json-ld",
    apply: "serve",
    transformIndexHtml() {
      return [
        {
          tag: "script",
          attrs: { type: "application/ld+json", id: "ld-json-site" },
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": siteNodes().base,
          }),
          injectTo: "head" as const,
        },
      ];
    },
  };
}

/**
 * Emits one real HTML file per route.
 *
 * Social and search crawlers do not execute JavaScript. In a single-page app
 * every URL serves the same `index.html`, so without this, sharing
 * `/writing/block-the-save` on LinkedIn or Slack would preview the home page.
 *
 * Each emitted file is the built `index.html` with its head block replaced by
 * that route's tags and its JSON-LD graph. The body and the script tag are
 * untouched, so the app still boots and takes over exactly as before. This
 * changes only what a non-rendering client sees.
 *
 * Vercel checks the filesystem before applying rewrites, and `cleanUrls` maps
 * `/about` to `about.html`, so these are served automatically.
 */
function prerenderRoutes(): Plugin {
  return {
    name: "prerender-routes",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      const indexAsset = bundle["index.html"];
      if (!indexAsset || indexAsset.type !== "asset") {
        this.error("prerender-routes: index.html was not in the bundle");
        return;
      }

      const template = String(indexAsset.source);

      /* The head is everything between the charset/viewport block and the
         icons block; replace the marked region rather than guessing. */
      const START = "<!--seo:start-->";
      const END = "<!--seo:end-->";
      const startIdx = template.indexOf(START);
      const endIdx = template.indexOf(END);
      if (startIdx === -1 || endIdx === -1) {
        this.error(
          "prerender-routes: index.html is missing the <!--seo:start--> / <!--seo:end--> markers",
        );
        return;
      }

      const before = template.slice(0, startIdx);
      const after = template.slice(endIdx + END.length);

      const problems: string[] = [];

      for (const route of allRoutes()) {
        const problem = assertGraphResolves(route.path, route.jsonLd);
        if (problem) problems.push(problem);

        const ld = escapeJsonLd(JSON.stringify(route.jsonLd));
        const head = `${headFor(route)}

    <script type="application/ld+json" id="ld-json-site">${ld}</script>`;

        const html = before + head + after;

        /* "/" stays index.html; "/about" becomes about.html; nested paths keep
           their directories so cleanUrls resolves them. */
        const fileName =
          route.path === "/" ? "index.html" : `${route.path.replace(/^\//, "")}.html`;

        if (fileName === "index.html") {
          indexAsset.source = html;
        } else {
          this.emitFile({ type: "asset", fileName, source: html });
        }
      }

      if (problems.length) {
        this.error(`Invalid schema.org graph:\n  ${problems.join("\n  ")}`);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), seoFiles(), devJsonLd(), prerenderRoutes()],
  build: {
    target: "es2020",
    sourcemap: false,
  },
});
