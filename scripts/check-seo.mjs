/**
 * Assert the built site still satisfies Google's SEO fundamentals.
 *
 *     npm run build && npm run seo:check
 *
 * Every check here maps to something in Google's Search Essentials and SEO
 * starter guide, or to a mistake this site could plausibly reintroduce. The
 * script reads `dist/`, not the source, because what matters is what a crawler
 * that does not run JavaScript actually receives.
 *
 * It exits non-zero on failure, so it can gate a deploy.
 */
import fs from "node:fs";
import path from "node:path";

const DIST = process.argv[2] ?? "dist";
const SITE = "https://www.sinclairnzenwata.com";

const results = [];
const fail = (name, detail) => results.push({ ok: false, name, detail });
const pass = (name, detail = "") => results.push({ ok: true, name, detail });

/* ── collect the prerendered pages ───────────────────────────────────── */

const pages = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) {
      const rel = path.relative(DIST, full).replace(/\.html$/, "");
      pages.push({
        url: rel === "index" ? "/" : `/${rel}`,
        file: full,
        html: fs.readFileSync(full, "utf8"),
      });
    }
  }
})(DIST);

if (!pages.length) {
  console.error(`no HTML in ${DIST}; run the build first`);
  process.exit(1);
}

const one = (html, re) => (html.match(re) ?? [])[1];
const all = (html, re) => [...html.matchAll(re)].map((m) => m[1]);
const meta = (html, name) =>
  one(html, new RegExp(`<meta name="${name}" content="([^"]*)"`));
const prop = (html, name) =>
  one(html, new RegExp(`<meta property="${name}" content="([^"]*)"`));

/* ── per-page checks ─────────────────────────────────────────────────── */

const titles = new Map();
const descriptions = new Map();
const problems = { title: [], desc: [], descLen: [], canonical: [], h1: [], og: [], ld: [], lang: [] };

for (const page of pages) {
  const { html, url } = page;

  const title = one(html, /<title>([^<]*)<\/title>/);
  if (!title) problems.title.push(url);
  else {
    if (titles.has(title)) problems.title.push(`${url} duplicates ${titles.get(title)}`);
    titles.set(title, url);
  }

  const desc = meta(html, "description");
  if (!desc) problems.desc.push(url);
  else {
    if (descriptions.has(desc))
      problems.desc.push(`${url} duplicates ${descriptions.get(desc)}`);
    descriptions.set(desc, url);
    /* Google rewrites snippets freely, but a description outside this band is
       either uselessly thin or certain to be truncated. */
    if (desc.length < 50 || desc.length > 300)
      problems.descLen.push(`${url} (${desc.length} chars)`);
  }

  const canonical = one(html, /<link rel="canonical" href="([^"]*)"/);
  const expected = `${SITE}${url}`;
  if (canonical !== expected) problems.canonical.push(`${url}: ${canonical ?? "missing"}`);

  /* Heading structure belongs to the rendered app, not to this shell, and is
     verified by the axe pass (`page-has-heading-one`, `heading-order`). What
     is checkable here is that the three titles a crawler reads agree. */
  if (prop(html, "og:title") !== title || meta(html, "twitter:title") !== title)
    problems.h1.push(url);

  for (const p of ["og:title", "og:description", "og:url", "og:image", "og:type"])
    if (!prop(html, p)) problems.og.push(`${url}: ${p}`);

  const ld = one(html, /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (!ld) problems.ld.push(`${url}: no JSON-LD`);
  else {
    try {
      const parsed = JSON.parse(ld.replace(/<\\\//g, "</"));
      if (!Array.isArray(parsed["@graph"]) || !parsed["@graph"].length)
        problems.ld.push(`${url}: empty @graph`);
    } catch (e) {
      problems.ld.push(`${url}: ${e.message}`);
    }
  }

  if (!/<html lang="en">/.test(html)) problems.lang.push(url);
}

const report = (key, name) =>
  problems[key].length
    ? fail(name, `${problems[key].length}: ${problems[key].slice(0, 3).join(", ")}`)
    : pass(name, `${pages.length} pages`);

report("title", "every page has a unique title");
report("desc", "every page has a unique description");
report("descLen", "descriptions are a usable length");
report("canonical", "canonical matches the page's own URL");
report("h1", "title, og:title and twitter:title agree");
report("og", "Open Graph tags are complete");
report("ld", "JSON-LD parses and is a non-empty graph");
report("lang", "every page declares its language");

/* ── site-level checks ───────────────────────────────────────────────── */

const stuffed = pages.filter((p) => /<meta name="keywords"/.test(p.html));
stuffed.length
  ? fail("no meta keywords tag", `${stuffed.length} pages have one`)
  : pass("no meta keywords tag", "Google ignores it; its absence is correct");

const sitemapPath = path.join(DIST, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  fail("sitemap.xml exists");
} else {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  const listed = new Set(all(sitemap, /<loc>([^<]*)<\/loc>/g).map((u) => u.replace(SITE, "")));
  const missing = pages.map((p) => p.url).filter((u) => !listed.has(u));
  const extra = [...listed].filter((u) => !pages.some((p) => p.url === u));
  missing.length || extra.length
    ? fail("sitemap matches the built pages", `missing ${missing.join(", ")} extra ${extra.join(", ")}`)
    : pass("sitemap matches the built pages", `${listed.size} URLs`);
}

const robotsPath = path.join(DIST, "robots.txt");
const robots = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, "utf8") : "";
robots.includes(`Sitemap: ${SITE}/sitemap.xml`)
  ? pass("robots.txt points at the sitemap")
  : fail("robots.txt points at the sitemap", robots.slice(0, 60));

/* Internal links that 404 waste crawl budget and strand readers. */
const dead = new Set();
for (const page of pages) {
  for (const href of all(page.html, /href="(\/[^"#?]*)"/g)) {
    if (href.startsWith("//")) continue;
    const candidates = [
      path.join(DIST, href),
      path.join(DIST, `${href}.html`),
      path.join(DIST, href, "index.html"),
    ];
    if (!candidates.some((c) => fs.existsSync(c))) dead.add(`${page.url} → ${href}`);
  }
}
dead.size
  ? fail("internal links resolve", [...dead].slice(0, 5).join("; "))
  : pass("internal links resolve");

/* Google Scholar reads citation_* tags, not schema.org. */
const research = pages.find((p) => p.url === "/research");
if (!research) fail("research page exists");
else {
  const authors = all(research.html, /<meta name="citation_author" content="([^"]*)"/g);
  const needed = ["citation_title", "citation_doi", "citation_journal_title", "citation_pdf_url"];
  const absent = needed.filter((n) => !meta(research.html, n));
  absent.length || authors.length < 2
    ? fail("Google Scholar citation tags", `missing ${absent.join(", ")}; ${authors.length} authors`)
    : pass("Google Scholar citation tags", `${authors.length} authors, DOI present`);
  authors.includes("Sinclair Nzenwata")
    ? pass("the author is named in the citation tags")
    : fail("the author is named in the citation tags");
}

/* Every img needs alt text. There are none today; this exists so that stops
   being true loudly rather than quietly. */
const noAlt = [];
for (const page of pages)
  for (const tag of page.html.match(/<img\b[^>]*>/g) ?? [])
    if (!/\salt="/.test(tag)) noAlt.push(page.url);
noAlt.length ? fail("every image has alt text", noAlt.join(", ")) : pass("every image has alt text");

/* ── report ──────────────────────────────────────────────────────────── */

for (const r of results)
  console.log(`${r.ok ? "pass" : "FAIL"}  ${r.name}${r.detail ? `  — ${r.detail}` : ""}`);

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
