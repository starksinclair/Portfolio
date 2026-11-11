/**
 * Push every URL on this site to the IndexNow engines.
 *
 *     npm run build && npm run indexnow
 *     npm run indexnow -- --dry-run
 *     npm run indexnow -- /research /projects/marco
 *
 * IndexNow inverts crawling: instead of waiting to be visited, you tell the
 * engines what changed and they come and fetch it. Bing, Yandex, Naver, Seznam
 * and Yep honour it; one call to api.indexnow.org fans out to all of them.
 * Google does not participate, and neither does Brave — those two only ever
 * discover this site by crawling it.
 *
 * The URL list comes from `dist/sitemap.xml`, which `vite.config.ts` emits from
 * the route table in `src/lib/routes.ts`. Reading the built sitemap rather than
 * importing the table directly is deliberate twice over: it is the same single
 * source, and it means a URL can only be submitted if it was actually built. A
 * route that exists in TypeScript but produced no HTML would be a 404 for the
 * crawler, and submitting 404s is how a site loses IndexNow trust.
 *
 * The key lives in exactly one place: the name of the file in `public/`. Its
 * contents must equal its own basename, which is what the engines check when
 * they fetch it. Nothing duplicates the key, so nothing can disagree about it.
 */
import fs from "node:fs";
import path from "node:path";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const DIST = "dist";
const PUBLIC = "public";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const skipVerify = args.includes("--skip-verify");
/* Bare arguments are paths to submit instead of the whole site. */
const only = args.filter((a) => !a.startsWith("--"));

const die = (message) => {
  console.error(message);
  process.exit(1);
};

/* ── the key ─────────────────────────────────────────────────────────── */

function findKey() {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY;

  const candidates = fs
    .readdirSync(PUBLIC)
    .filter((name) => /^[A-Za-z0-9-]{8,128}\.txt$/.test(name))
    .filter((name) => {
      const key = name.replace(/\.txt$/, "");
      return fs.readFileSync(path.join(PUBLIC, name), "utf8").trim() === key;
    });

  if (candidates.length === 0)
    die(
      `no IndexNow key file in ${PUBLIC}/.\n` +
        "Create one whose name is the key and whose only contents are that same key:\n" +
        '  node -e "const k=require(\'crypto\').randomBytes(16).toString(\'hex\');' +
        "require('fs').writeFileSync(`public/${k}.txt`,k)\"",
    );
  if (candidates.length > 1)
    die(`more than one IndexNow key file in ${PUBLIC}/: ${candidates.join(", ")}`);

  return candidates[0].replace(/\.txt$/, "");
}

const key = findKey();

/* ── the URLs ────────────────────────────────────────────────────────── */

const sitemapPath = path.join(DIST, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) die(`no ${sitemapPath}; run the build first`);

const sitemap = fs.readFileSync(sitemapPath, "utf8");
const all = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!all.length) die(`no <loc> entries in ${sitemapPath}`);

const origin = new URL(all[0]).origin;
const keyLocation = `${origin}/${key}.txt`;

let urls = all;
if (only.length) {
  urls = only.map((p) => (p.startsWith("http") ? p : `${origin}${p.startsWith("/") ? p : `/${p}`}`));
  const unknown = urls.filter((u) => !all.includes(u));
  if (unknown.length) die(`not in the sitemap, so not built: ${unknown.join(", ")}`);
}

/* The protocol caps a request at 10,000 URLs. This site is nowhere near, but
   the guard costs nothing and the failure it prevents is silent truncation. */
if (urls.length > 10000) die(`${urls.length} URLs exceeds the 10,000 per-request limit`);

console.log(`key          ${key}`);
console.log(`keyLocation  ${keyLocation}`);
console.log(`URLs         ${urls.length}${only.length ? " (selected)" : " (whole sitemap)"}`);

/* ── is the key file actually reachable? ─────────────────────────────── */

/* The engines fetch keyLocation to prove you own the host. If it 404s, every
   submission is rejected — and the usual reason is that the build with the key
   file in it has not been deployed yet. Better to say so than to POST into a
   rejection. */
if (!skipVerify && !dryRun) {
  let served;
  try {
    const res = await fetch(keyLocation, { redirect: "follow" });
    served = res.ok ? (await res.text()).trim() : null;
    if (!res.ok) die(`${keyLocation} returned ${res.status}. Deploy the key file first.`);
  } catch (err) {
    die(`could not fetch ${keyLocation}: ${err.message}`);
  }
  if (served !== key) die(`${keyLocation} serves "${served}", expected "${key}"`);
  console.log(`verified     ${keyLocation} serves the key`);
}

/* ── submit ──────────────────────────────────────────────────────────── */

if (dryRun) {
  for (const u of urls) console.log(`  ${u}`);
  console.log(`\ndry run: nothing submitted`);
  process.exit(0);
}

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(origin).host, key, keyLocation, urlList: urls }),
});

const body = await res.text();

/* 200 accepted, 202 accepted but the key is still being validated. Anything
   else is a refusal worth reading: 400 malformed, 403 key not valid, 422 a URL
   does not belong to this host, 429 too many submissions. */
if (res.status === 200 || res.status === 202) {
  console.log(`\n${res.status} ${res.statusText} — ${urls.length} URLs submitted`);
  if (res.status === 202) console.log("key validation pending; this is normal on a first submission");
  process.exit(0);
}

console.error(`\n${res.status} ${res.statusText}${body ? `\n${body}` : ""}`);
process.exit(1);
