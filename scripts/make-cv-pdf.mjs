/**
 * Generates `public/sinclair-nzenwata-cv.pdf` from `src/data/cv.ts`.
 *
 *   node scripts/make-cv-pdf.mjs
 *
 * Needs the Inter and JetBrains Mono TTFs in `scripts/fonts/`; run
 * `scripts/fetch-og-fonts.sh` once first. Nothing else is required, and no
 * package is installed: the tagged-PDF writer is in `scripts/lib/`.
 *
 * The PDF is a build product of the same data the /cv page renders, which is
 * the only way the two stay in agreement. Do not edit the PDF; edit the data.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPdf } from "./lib/pdf.mjs";
import { cvMeta, cvSections, researchInterests } from "../src/data/cv.ts";
import { profile, SITE_URL } from "../src/data/profile.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");

/* Inter at three weights and JetBrains Mono share one directory; pick by
   PostScript name rather than by the Google Fonts hash in the filename. */
function loadFonts() {
  const dir = path.join(here, "fonts");
  if (!fs.existsSync(dir)) {
    console.error("scripts/fonts is missing. Run scripts/fetch-og-fonts.sh first.");
    process.exit(1);
  }
  const wanted = {
    regular: "Inter-Regular",
    semibold: "Inter-SemiBold",
    mono: "JetBrainsMono-Regular",
  };
  const out = {};
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".ttf"))) {
    const buf = fs.readFileSync(path.join(dir, file));
    const name = postScriptName(buf);
    for (const [key, want] of Object.entries(wanted)) {
      if (name === want) out[key] = buf;
    }
  }
  for (const key of Object.keys(wanted)) {
    if (!out[key]) {
      console.error(`missing ${wanted[key]}. Run scripts/fetch-og-fonts.sh.`);
      process.exit(1);
    }
  }
  return out;
}

function postScriptName(buf) {
  const numTables = buf.readUInt16BE(4);
  for (let i = 0; i < numTables; i++) {
    const p = 12 + i * 16;
    if (buf.toString("latin1", p, p + 4) !== "name") continue;
    const nt = buf.readUInt32BE(p + 8);
    const count = buf.readUInt16BE(nt + 2);
    const strings = nt + buf.readUInt16BE(nt + 4);
    for (let r = 0; r < count; r++) {
      const e = nt + 6 + r * 12;
      if (buf.readUInt16BE(e + 6) !== 6) continue;
      const len = buf.readUInt16BE(e + 8);
      const off = strings + buf.readUInt16BE(e + 10);
      const slice = buf.subarray(off, off + len);
      return buf.readUInt16BE(e) === 3
        ? Buffer.from(slice).swap16().toString("utf16le")
        : slice.toString("latin1");
    }
  }
  return "";
}

/* ── type scale and colour, matching BRAND.md ───────────────────────── */

const INK = [0.12, 0.102, 0.11]; // ink-900 #1F1A1C
const MUTED = [0.314, 0.282, 0.294]; // ink-700 #50484B
const TYRIAN = [0.498, 0.004, 0.294]; // tyrian-700 #7F014B

const S = { name: 19, section: 12, entry: 10.2, body: 9.3, small: 8.6 };

const p = (text, o = {}) => ({
  tag: "P",
  size: S.body,
  color: o.color ?? INK,
  runs: [{ text, font: o.font ?? "regular" }],
  ...o,
});

const bullets = (items) => ({
  tag: "L",
  kids: items.map((text) => ({
    tag: "LI",
    kids: [
      {
        tag: "LBody",
        size: S.body,
        color: INK,
        indent: 14,
        bullet: true,
        spaceBefore: 3,
        runs: [{ text }],
      },
    ],
  })),
});

/** "Outcome: ..." with the label in semibold, as one paragraph. */
const labelled = (label, text) => ({
  tag: "P",
  size: S.body,
  color: INK,
  spaceBefore: 5,
  runs: text
    ? [
        { text: `${label}: `, font: "semibold" },
        { text, font: "regular" },
      ]
    : [{ text: `${label}`, font: "semibold" }],
});

function entryNodes(entry, { heading = true } = {}) {
  const kids = [];

  if (heading) {
    kids.push({
      tag: "H3",
      size: S.entry,
      color: INK,
      font: "semibold",
      spaceBefore: 10,
      spaceAfter: 1,
      keepWithNext: true,
      rightWidth: entry.meta ? 118 : 0,
      right: entry.meta ? { runs: [{ text: entry.meta }], color: MUTED } : undefined,
      runs: [
        entry.url
          ? { text: entry.title, font: "semibold", link: entry.url, color: TYRIAN }
          : { text: entry.title, font: "semibold" },
      ],
    });
  }

  if (entry.subtitle) kids.push(p(entry.subtitle, { color: MUTED, size: S.small }));
  /* The DOI is printed as well as linked: a CV gets read on paper. */
  if (entry.url && entry.url.startsWith("https://doi.org/")) {
    kids.push({
      tag: "P",
      size: S.small,
      color: MUTED,
      spaceBefore: 1,
      runs: [{ text: entry.url, link: entry.url, color: TYRIAN }],
    });
  }
  if (entry.detail) kids.push(p(entry.detail, { color: MUTED, size: S.small }));
  if (entry.question) {
    kids.push({
      tag: "P",
      size: S.body,
      color: INK,
      spaceBefore: 4,
      runs: [
        { text: "Research question: ", font: "semibold" },
        { text: entry.question },
      ],
    });
  }

  for (const block of entry.blocks ?? []) {
    if (block.kind === "text") kids.push(p(block.text, { spaceBefore: 4 }));
    else if (block.kind === "bullets") kids.push(bullets(block.items));
    else kids.push(labelled(block.label, block.text));
  }

  return kids;
}

function buildFlow() {
  const kids = [];

  kids.push({
    tag: "H1",
    size: S.name,
    color: INK,
    spaceAfter: 3,
    keepWithNext: true,
    runs: [{ text: profile.name, font: "semibold" }],
  });

  kids.push({
    tag: "P",
    size: S.small,
    color: MUTED,
    spaceAfter: 2,
    runs: [{ text: `${cvMeta.kicker} | ${cvMeta.location}` }],
  });

  /* Two rows rather than one wrapped row: five items do not fit on a line, and
     a greedy wrap leaves a separator dangling at the break. Addresses first,
     then the identifiers. */
  kids.push({
    tag: "P",
    size: S.small,
    color: MUTED,
    spaceAfter: 2,
    runs: [
      { text: cvMeta.emails[0], link: `mailto:${cvMeta.emails[0]}`, color: TYRIAN },
      { text: "  |  " },
      { text: cvMeta.emails[1], link: `mailto:${cvMeta.emails[1]}`, color: TYRIAN },
    ],
  });

  kids.push({
    tag: "P",
    size: S.small,
    color: MUTED,
    spaceAfter: 10,
    runs: [
      { text: cvMeta.linkedin, link: profile.socials.linkedin, color: TYRIAN },
      { text: "  |  " },
      { text: cvMeta.site, link: SITE_URL, color: TYRIAN },
      { text: "  |  " },
      { text: cvMeta.orcid, link: profile.socials.orcid, color: TYRIAN },
    ],
  });

  kids.push({
    tag: "Sect",
    kids: [sectionHeading("Research interests"), p(researchInterests, { spaceBefore: 2 })],
  });

  for (const section of cvSections) {
    const inner = [sectionHeading(section.title)];
    if (section.intro) inner.push(p(section.intro, { spaceBefore: 2, color: MUTED }));

    /* Sections that are one list do not repeat their own title as a heading. */
    const bare = section.entries.length === 1 && section.entries[0].title === section.title;

    for (const entry of section.entries) {
      inner.push({ tag: "Sect", kids: entryNodes(entry, { heading: !bare }) });
    }
    kids.push({ tag: "Sect", kids: inner });
  }

  return { tag: "Document", kids };
}

function sectionHeading(title) {
  return {
    tag: "H2",
    size: S.section,
    color: INK,
    spaceBefore: 13,
    spaceAfter: 2,
    keepWithNext: true,
    ruleAfter: TYRIAN,
    runs: [{ text: title, font: "semibold" }],
  };
}

const now = new Date();
const stamp =
  "D:" +
  [
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
  ]
    .map((n, i) => String(n).padStart(i === 0 ? 4 : 2, "0"))
    .join("") +
  "Z";

const pdf = buildPdf({
  meta: {
    title: `${profile.name}, Curriculum Vitae`,
    author: profile.name,
    subject:
      "Curriculum vitae: education, publications, research, professional experience, ventures and technical skills.",
    keywords:
      "curriculum vitae, computer science, human-computer interaction, accessible computing, software engineering",
    creator: "sinclairnzenwata.com CV generator",
    lang: "en-US",
    date: stamp,
  },
  fontFiles: loadFonts(),
  root: buildFlow(),
  footer: (n, total) => `${profile.name}  ·  page ${n} of ${total}`,
});

const out = path.join(root, "public", "sinclair-nzenwata-cv.pdf");
fs.writeFileSync(out, pdf);
console.log(`wrote ${path.relative(root, out)}  ${(pdf.length / 1024).toFixed(0)} KB`);
