/**
 * Checks the generated CV against the things that actually make a PDF usable
 * with a screen reader.
 *
 *   node scripts/check-cv-pdf.mjs [path]
 *
 * This is not a substitute for PAC or Acrobat's checker, and it does not claim
 * PDF/UA conformance. It asserts the properties this generator is responsible
 * for, so a regression in the writer fails here rather than in someone's
 * assistive technology.
 */

import fs from "node:fs";
import zlib from "node:zlib";
import path from "node:path";
import { fileURLToPath } from "node:url";

const file =
  process.argv[2] ??
  path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "sinclair-nzenwata-cv.pdf");
const buf = fs.readFileSync(file);
const latin = buf.toString("latin1");

const results = [];
const check = (ok, label, detail = "") => results.push({ ok, label, detail });

/* ── objects ──────────────────────────────────────────────────────────── */

const objects = new Map();
const re = /(\d+) 0 obj\n([\s\S]*?)\nendobj\n/g;
for (let m; (m = re.exec(latin)); ) {
  objects.set(Number(m[1]), m[2]);
}

const catalog = [...objects.values()].find((o) => o.includes("/Type /Catalog")) ?? "";

check(/\/MarkInfo << \/Marked true >>/.test(catalog), "document is marked as tagged");
check(/\/Lang \(([^)]+)\)/.test(catalog), "document language is set", catalog.match(/\/Lang \(([^)]+)\)/)?.[1] ?? "");
check(
  /\/ViewerPreferences << \/DisplayDocTitle true >>/.test(catalog),
  "readers announce the title, not the file name",
);
check(/\/StructTreeRoot \d+ 0 R/.test(catalog), "structure tree is attached");

const info = [...objects.values()].find((o) => o.includes("/Title (") && o.includes("/Author ("));
const title = info?.match(/\/Title \(([^)]*)\)/)?.[1] ?? "";
check(title.length > 0, "document title is set", title);

const xmp = latin.match(/<x:xmpmeta[\s\S]*?<\/x:xmpmeta>/)?.[0] ?? "";
check(xmp.includes(title), "XMP title agrees with the document information");
check(/<dc:language>/.test(xmp), "XMP declares a language");

/* ── structure elements ───────────────────────────────────────────────── */

const elems = [...objects.entries()]
  .filter(([, body]) => body.includes("/Type /StructElem"))
  .map(([id, body]) => ({
    id,
    tag: body.match(/\/S \/(\w+)/)?.[1],
    kids: body.match(/\/K (.+)/)?.[1] ?? "",
    page: body.match(/\/Pg (\d+) 0 R/)?.[1],
  }));

check(elems.length > 0, "structure elements exist", `${elems.length} elements`);

const counts = {};
for (const e of elems) counts[e.tag] = (counts[e.tag] ?? 0) + 1;
check(counts.H1 === 1, "exactly one H1", `H1=${counts.H1 ?? 0}`);
check((counts.H2 ?? 0) > 0 && (counts.H3 ?? 0) > 0, "headings below H1 exist",
  `H2=${counts.H2 ?? 0} H3=${counts.H3 ?? 0}`);
check((counts.LBody ?? 0) === (counts.LI ?? 0), "every list item has a body",
  `LI=${counts.LI ?? 0} LBody=${counts.LBody ?? 0}`);

/* Reading order of headings, in document order, must not skip a level. */
const order = [];
const walk = (id, seen = new Set()) => {
  if (seen.has(id)) return;
  seen.add(id);
  const e = elems.find((x) => x.id === id);
  if (!e) return;
  if (/^H[1-6]$/.test(e.tag)) order.push(Number(e.tag[1]));
  for (const kid of [...e.kids.matchAll(/(\d+) 0 R/g)].map((m) => Number(m[1]))) {
    walk(kid, seen);
  }
};
const docElem = elems.find((e) => e.tag === "Document");
if (docElem) walk(docElem.id);

let skip = null;
for (let i = 1; i < order.length; i++) {
  if (order[i] > order[i - 1] + 1) skip = `H${order[i - 1]} to H${order[i]}`;
}
check(order.length > 0 && !skip, "heading levels never skip", skip ?? `${order.length} headings`);

/* ── marked content: every text run is tagged ─────────────────────────── */

let totalBdc = 0;
let artifacts = 0;
let untagged = 0;
const mcidsByPage = [];

for (const [, body] of objects) {
  if (!body.includes("/Filter /FlateDecode") || !body.includes("stream")) continue;
  const start = latin.indexOf(body);
  const sOff = latin.indexOf("stream\n", start) + 7;
  const len = Number(body.match(/\/Length (\d+)/)?.[1] ?? 0);
  if (!len) continue;
  let text;
  try {
    text = zlib.inflateSync(buf.subarray(sOff, sOff + len)).toString("latin1");
  } catch {
    continue;
  }
  if (!text.includes(" Tj")) continue;

  const mcids = [...text.matchAll(/\/MCID (\d+) >> BDC/g)].map((m) => Number(m[1]));
  mcidsByPage.push(mcids);
  totalBdc += mcids.length;
  artifacts += (text.match(/\/Artifact BMC/g) ?? []).length;

  /* Any Tj that is not inside a BDC or BMC is untagged content. */
  let depth = 0;
  for (const token of text.split("\n")) {
    if (token.endsWith("BDC") || token.endsWith("BMC")) depth++;
    else if (token === "EMC") depth--;
    else if (token.endsWith(" Tj") && depth === 0) untagged++;
  }
}

check(untagged === 0, "no untagged text", `${untagged} untagged runs`);
check(totalBdc > 0, "text is inside marked content", `${totalBdc} marked runs`);
check(artifacts > 0, "page furniture is marked as artifact", `${artifacts} artifacts`);

/* Every MCID on every page must be claimed by exactly one structure element. */
const claimed = new Set();
for (const e of elems) {
  for (const m of e.kids.matchAll(/(?:^|[\s[])(\d+)(?=[\s\]]|$)/g)) {
    claimed.add(`${e.page}:${m[1]}`);
  }
}
let orphan = 0;
const pageIds = [...objects.entries()]
  .filter(([, b]) => b.includes("/Type /Page") && !b.includes("/Type /Pages"))
  .map(([id]) => String(id));
mcidsByPage.forEach((mcids, i) => {
  for (const mcid of mcids) if (!claimed.has(`${pageIds[i]}:${mcid}`)) orphan++;
});
check(orphan === 0, "every marked run is claimed by the structure tree", `${orphan} orphans`);

/* ── links and fonts ──────────────────────────────────────────────────── */

const annots = [...objects.values()].filter((o) => o.includes("/Subtype /Link"));
check(
  annots.length === 0 || annots.every((a) => /\/Contents \(/.test(a)),
  "every link annotation has a description",
  `${annots.length} links`,
);
check(
  annots.every((a) => /\/StructParent \d+/.test(a)),
  "every link annotation is in the structure tree",
);

const fonts = [...objects.values()].filter((o) => o.includes("/Subtype /Type0"));
check(fonts.length > 0 && fonts.every((f) => f.includes("/ToUnicode")),
  "every font maps back to Unicode", `${fonts.length} fonts`);
const descriptors = [...objects.values()].filter((o) => o.includes("/Type /FontDescriptor"));
check(descriptors.every((d) => d.includes("/FontFile2")), "every font is embedded",
  `${descriptors.length} descriptors`);

/* ── report ───────────────────────────────────────────────────────────── */

const failed = results.filter((r) => !r.ok);
for (const r of results) {
  console.log(`${r.ok ? "pass" : "FAIL"}  ${r.label}${r.detail ? `  (${r.detail})` : ""}`);
}
console.log(
  `\n${results.length - failed.length}/${results.length} checks passed on ${path.basename(file)}`,
);
process.exit(failed.length ? 1 : 0);
