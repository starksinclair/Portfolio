/**
 * A tagged PDF writer.
 *
 * The point of generating the CV rather than exporting it is the structure
 * tree. A PDF exported from Word through macOS print loses its tags, and an
 * untagged PDF is an image of a document as far as a screen reader is
 * concerned: no headings, no lists, no reading order, no title.
 *
 * So this writes the tags itself. Every piece of text is inside a marked-content
 * sequence whose MCID is referenced by a structure element, the structure
 * elements form a tree under /StructTreeRoot, the number tree maps each page
 * back to its elements, and the catalogue declares /Marked true, a /Lang, and
 * /DisplayDocTitle so a reader announces the title instead of the filename.
 *
 * Running headers are marked as artifacts, which is how you say "this is
 * furniture, skip it".
 *
 * Input is a tree of nodes. A node either has `kids` (a container, such as Sect
 * or L) or `runs` (a leaf that draws text, such as H2 or LBody).
 */

import zlib from "node:zlib";
import { parseTTF, subsetTTF } from "./ttf.mjs";

const PT = (n) => Math.round(n * 100) / 100;

class Objects {
  constructor() {
    this.bodies = [null]; // 1-indexed
  }
  alloc() {
    this.bodies.push(null);
    return this.bodies.length - 1;
  }
  set(id, body) {
    this.bodies[id] = body;
    return id;
  }
  add(body) {
    return this.set(this.alloc(), body);
  }
}

function dict(o) {
  const parts = [];
  for (const [k, v] of Object.entries(o)) {
    if (v === undefined || v === null) continue;
    parts.push(`/${k} ${v}`);
  }
  return `<< ${parts.join(" ")} >>`;
}

/** PDF text string: parenthesised, with the three characters that must escape. */
function str(s) {
  return `(${s.replace(/[\\()]/g, (c) => "\\" + c)})`;
}

/* ── fonts ──────────────────────────────────────────────────────────── */

class Font {
  constructor(key, buf) {
    this.key = key;
    this.ttf = parseTTF(buf);
    this.used = new Map(); // gid -> code point
  }
  /** Code points to glyph ids, recording each one for the subset. */
  glyphs(text) {
    const out = [];
    for (const ch of text) {
      const cp = ch.codePointAt(0);
      const gid = this.ttf.cmap.get(cp) ?? this.ttf.cmap.get(0x20) ?? 0;
      this.used.set(gid, cp);
      out.push(gid);
    }
    return out;
  }
  width(text, size) {
    let w = 0;
    for (const ch of text) {
      const gid = this.ttf.cmap.get(ch.codePointAt(0)) ?? 0;
      w += this.ttf.advances[gid] ?? 0;
    }
    return (w * size) / this.ttf.unitsPerEm;
  }
  encode(text) {
    return this.glyphs(text)
      .map((g) => g.toString(16).padStart(4, "0"))
      .join("");
  }
}

function embedFont(objs, font, tag) {
  const { ttf } = font;
  const scale = 1000 / ttf.unitsPerEm;
  const gids = [...font.used.keys()].sort((a, b) => a - b);
  const file = subsetTTF(ttf, gids);
  const packed = zlib.deflateSync(file, { level: 9 });

  const fileId = objs.add({
    dict: dict({ Length: packed.length, Length1: file.length, Filter: "/FlateDecode" }),
    stream: packed,
  });

  const descriptor = objs.add({
    dict: dict({
      Type: "/FontDescriptor",
      FontName: `/${tag}`,
      /* Nonsymbolic serif-less text font. Flag 4 (symbolic) is what breaks
         text extraction in a lot of generated PDFs. */
      Flags: ttf.italicAngle ? 96 : 32,
      FontBBox: `[${ttf.bbox.map((v) => Math.round(v * scale)).join(" ")}]`,
      ItalicAngle: ttf.italicAngle,
      Ascent: Math.round(ttf.ascent * scale),
      Descent: Math.round(ttf.descent * scale),
      CapHeight: Math.round(ttf.capHeight * scale),
      StemV: 80,
      FontFile2: `${fileId} 0 R`,
    }),
  });

  const w = [];
  for (const g of gids) {
    w.push(`${g} [${Math.round((ttf.advances[g] ?? 0) * scale)}]`);
  }

  const toUni = toUnicodeCMap(font.used);
  const toUniPacked = zlib.deflateSync(Buffer.from(toUni, "latin1"), { level: 9 });
  const toUniId = objs.add({
    dict: dict({ Length: toUniPacked.length, Filter: "/FlateDecode" }),
    stream: toUniPacked,
  });

  const cid = objs.add({
    dict: dict({
      Type: "/Font",
      Subtype: "/CIDFontType2",
      BaseFont: `/${tag}`,
      CIDSystemInfo: `<< /Registry (Adobe) /Ordering (Identity) /Supplement 0 >>`,
      FontDescriptor: `${descriptor} 0 R`,
      DW: 1000,
      W: `[${w.join(" ")}]`,
      CIDToGIDMap: "/Identity",
    }),
  });

  return objs.add({
    dict: dict({
      Type: "/Font",
      Subtype: "/Type0",
      BaseFont: `/${tag}`,
      Encoding: "/Identity-H",
      DescendantFonts: `[${cid} 0 R]`,
      ToUnicode: `${toUniId} 0 R`,
    }),
  });
}

/** Without this, selecting text in the PDF copies glyph ids, not words. */
function toUnicodeCMap(used) {
  const entries = [...used.entries()].sort((a, b) => a[0] - b[0]);
  const lines = entries.map(([gid, cp]) => {
    const hex =
      cp > 0xffff
        ? (() => {
            const v = cp - 0x10000;
            return (
              (0xd800 + (v >> 10)).toString(16).padStart(4, "0") +
              (0xdc00 + (v & 0x3ff)).toString(16).padStart(4, "0")
            );
          })()
        : cp.toString(16).padStart(4, "0");
    return `<${gid.toString(16).padStart(4, "0")}> <${hex}>`;
  });

  const chunks = [];
  for (let i = 0; i < lines.length; i += 100) {
    const part = lines.slice(i, i + 100);
    chunks.push(`${part.length} beginbfchar\n${part.join("\n")}\nendbfchar`);
  }

  return `/CIDInit /ProcSet findresource begin
12 dict begin
begincmap
/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def
/CMapName /Adobe-Identity-UCS def
/CMapType 2 def
1 begincodespacerange
<0000> <FFFF>
endcodespacerange
${chunks.join("\n")}
endcmap
CMapName currentdict /CMap defineresource pop
end
end`;
}

/* ── layout ─────────────────────────────────────────────────────────── */

/**
 * Break `runs` into lines that fit `width`. A run is {text, font, size}; the
 * break is a plain greedy fit on spaces, which is what a CV wants: no
 * hyphenation, no justification, so no rivers and no broken words.
 */
function breakLines(runs, width, fonts) {
  const lines = [];
  let line = [];
  let used = 0;

  for (const run of runs) {
    const font = fonts[run.font];
    const words = run.text.split(/(\s+)/).filter((w) => w !== "");
    for (const word of words) {
      const w = font.width(word, run.size);
      const isSpace = /^\s+$/.test(word);
      if (used + w > width && !isSpace && line.length) {
        lines.push(line);
        line = [];
        used = 0;
      }
      if (isSpace && used === 0) continue;
      line.push({ ...run, text: word, w });
      used += w;
    }
  }
  if (line.length) lines.push(line);
  return lines.length ? lines : [[]];
}

/** Consecutive runs sharing a link (or sharing no link) read as one unit. */
function groupRuns(line) {
  const groups = [];
  for (const run of line) {
    const last = groups[groups.length - 1];
    if (last && last.link === run.link) last.runs.push(run);
    else groups.push({ link: run.link, runs: [run] });
  }
  return groups;
}

/* ── document ───────────────────────────────────────────────────────── */

const PAGE = { w: 612, h: 792 };
const MARGIN = { top: 54, bottom: 56, left: 54, right: 54 };

export function buildPdf({ meta, fontFiles, root, footer }) {
  const fonts = {};
  for (const [key, file] of Object.entries(fontFiles)) fonts[key] = new Font(key, file);

  const contentWidth = PAGE.w - MARGIN.left - MARGIN.right;
  const objs = new Objects();

  /* Pages are built as they fill. Each holds its own content operators, its
     marked-content counter and the structure elements that point into it. */
  const pages = [];
  let page = null;
  let y = 0;

  const newPage = () => {
    page = { ops: [], mcid: 0, elems: [], annots: [], id: objs.alloc() };
    pages.push(page);
    y = PAGE.h - MARGIN.top;
  };
  newPage();

  const structRoot = objs.alloc();
  const elems = []; // every structure element, in creation order

  const makeElem = (tag, parentId) => {
    const id = objs.alloc();
    const elem = { id, tag, parent: parentId, kids: [], pages: new Set() };
    elems.push(elem);
    return elem;
  };

  const docElem = makeElem("Document", structRoot);

  /** Draw one leaf: its own lines, its own marked content, its own element. */
  function drawLeaf(node, parentElem) {
    const size = node.size ?? 10;
    const leading = node.leading ?? size * 1.28;
    const indent = node.indent ?? 0;
    const width = contentWidth - indent - (node.rightWidth ?? 0);
    const runs = node.runs.map((r) => ({ size, font: "regular", ...r }));
    const lines = breakLines(runs, width, fonts);

    const spaceBefore = node.spaceBefore ?? 0;
    const height = lines.length * leading;

    if (!node.sameLine) {
      /* Keep a heading with at least the first line of what it introduces. */
      const need = height + spaceBefore + (node.keepWithNext ? leading * 2 : 0);
      if (y - need < MARGIN.bottom) newPage();
      else y -= spaceBefore;
    }

    const elem = makeElem(node.tag, parentElem.id);
    parentElem.kids.push({ elem });

    let ty = node.sameLine ? node.sameLineY : y;

    /* A date or place set against the right margin on the heading's first
       line. It is a sibling element, so it reads after the heading rather
       than inside it. */
    if (node.right) {
      const rightElem = makeElem(node.right.tag ?? "P", parentElem.id);
      parentElem.kids.push({ elem: rightElem });
      const rRuns = node.right.runs.map((r) => ({ size: size - 0.5, font: "regular", ...r }));
      const rw = rRuns.reduce((acc, r) => acc + fonts[r.font].width(r.text, r.size), 0);
      let rx = PAGE.w - MARGIN.right - rw;
      for (const run of rRuns) {
        const mcid = page.mcid++;
        rightElem.kids.push({ mcid, page });
        rightElem.pages.add(page);
        page.ops.push(
          `/P << /MCID ${mcid} >> BDC`,
          "BT",
          `/${run.font === "semibold" ? "F2" : run.font === "mono" ? "F3" : "F1"} ${PT(run.size)} Tf`,
          colorOp(run.color ?? node.right.color),
          `1 0 0 1 ${PT(rx)} ${PT(ty - size)} Tm`,
          `<${fonts[run.font].encode(run.text)}> Tj`,
          "ET",
          "EMC",
        );
        rx += fonts[run.font].width(run.text, run.size);
      }
    }

    lines.forEach((line, i) => {
      if (!node.sameLine && i > 0 && ty - leading < MARGIN.bottom) {
        newPage();
        ty = y;
      }
      const lineWidth = line.reduce((s, r) => s + r.w, 0);
      let x = MARGIN.left + indent;
      if (node.align === "right") x = PAGE.w - MARGIN.right - lineWidth;

      if (i === 0 && node.bullet) {
        const bulletFont = fonts.regular;
        const bx = x - 11;
        page.ops.push(
          artifactText(bulletFont, "•", size, bx, ty - size, node.color),
        );
      }

      /* One marked-content sequence per run of text with the same owner,
         not one per word: a reader treats each sequence as a unit, so
         word-sized sequences make it read in stutters. */
      for (const group of groupRuns(line)) {
        const target = group.link ? makeElem("Link", elem.id) : elem;
        if (group.link) elem.kids.push({ elem: target });

        const mcid = page.mcid++;
        target.kids.push({ mcid, page });
        target.pages.add(page);
        elem.pages.add(page);

        page.ops.push(`/${group.link ? "Link" : node.tag} << /MCID ${mcid} >> BDC`);
        const groupX = x;
        for (const run of group.runs) {
          page.ops.push(
            "BT",
            `/${run.font === "semibold" ? "F2" : run.font === "mono" ? "F3" : "F1"} ${PT(run.size)} Tf`,
            colorOp(run.color ?? node.color),
            `1 0 0 1 ${PT(x)} ${PT(ty - run.size)} Tm`,
            `<${fonts[run.font].encode(run.text)}> Tj`,
            "ET",
          );
          x += run.w;
        }
        page.ops.push("EMC");

        if (group.link) {
          const width = x - groupX;
          const size = group.runs[0].size;
          const annot = objs.alloc();
          page.annots.push({
            id: annot,
            rect: [groupX, ty - size - 2, x, ty + 2],
            url: group.link,
            elem: target,
          });
          target.annot = annot;
          /* Underline, so the link is not signalled by colour alone. */
          page.ops.push(
            "q",
            colorOp(group.runs[0].color ?? node.color),
            `${PT(groupX)} ${PT(ty - size - 1.5)} ${PT(width)} 0.5 re f`,
            "Q",
          );
        }
      }
      ty -= leading;
    });

    if (!node.sameLine) y = ty - (node.spaceAfter ?? 0);

    /* A hairline under a section heading. Furniture, so it is an artifact. */
    if (node.ruleAfter) {
      const [r, g, b] = node.ruleAfter;
      page.ops.push(
        "/Artifact BMC",
        "q",
        `${PT(r)} ${PT(g)} ${PT(b)} rg`,
        `${MARGIN.left} ${PT(y - 3)} ${PAGE.w - MARGIN.left - MARGIN.right} 0.7 re f`,
        "Q",
        "EMC",
      );
      y -= 8;
    }
    return { height };
  }

  function walk(node, parentElem) {
    if (node.runs) return drawLeaf(node, parentElem);
    const elem = node.tag === "Document" ? docElem : makeElem(node.tag, parentElem.id);
    if (node.tag !== "Document") parentElem.kids.push({ elem });
    if (node.breakBefore && y < PAGE.h - MARGIN.top - 1) newPage();
    for (const kid of node.kids) {
      if (kid.sameLineAsPrevious) kid.sameLineY = y + (kid.sameLineOffset ?? 0);
      walk(kid, elem);
    }
    return null;
  }

  walk(root, docElem);

  /* ── page furniture, marked as artifacts so readers skip it ───────── */
  pages.forEach((p, i) => {
    const text = footer(i + 1, pages.length);
    const f = fonts.regular;
    const w = f.width(text, 8);
    p.ops.push(
      artifactText(f, text, 8, PAGE.w - MARGIN.right - w, MARGIN.bottom - 24, [0.42, 0.39, 0.4]),
    );
  });

  /* ── assemble ─────────────────────────────────────────────────────── */
  const fontIds = {
    F1: embedFont(objs, fonts.regular, "AAAAAA+Inter-Regular"),
    F2: embedFont(objs, fonts.semibold, "AAAAAB+Inter-SemiBold"),
    F3: embedFont(objs, fonts.mono, "AAAAAC+JetBrainsMono-Regular"),
  };

  const pagesId = objs.alloc();
  const pageIds = [];

  pages.forEach((p, i) => {
    const content = zlib.deflateSync(Buffer.from(p.ops.join("\n"), "latin1"), { level: 9 });
    const contentId = objs.add({
      dict: dict({ Length: content.length, Filter: "/FlateDecode" }),
      stream: content,
    });

    objs.set(p.id, {
      dict: dict({
        Type: "/Page",
        Parent: `${pagesId} 0 R`,
        MediaBox: `[0 0 ${PAGE.w} ${PAGE.h}]`,
        Resources: dict({
          Font: dict({ F1: `${fontIds.F1} 0 R`, F2: `${fontIds.F2} 0 R`, F3: `${fontIds.F3} 0 R` }),
          ProcSet: "[/PDF /Text]",
        }),
        Contents: `${contentId} 0 R`,
        StructParents: i,
        Annots: p.annots.length ? `[${p.annots.map((a) => `${a.id} 0 R`).join(" ")}]` : undefined,
      }),
    });
    pageIds.push(p.id);
  });

  objs.set(pagesId, {
    dict: dict({
      Type: "/Pages",
      Count: pageIds.length,
      Kids: `[${pageIds.map((id) => `${id} 0 R`).join(" ")}]`,
    }),
  });

  /* Structure elements, now that every page has an object id. */
  for (const elem of elems) {
    const kids = elem.kids.map((k) =>
      k.mcid !== undefined ? String(k.mcid) : `${k.elem.id} 0 R`,
    );
    /* An element whose kids are MCIDs must name the page they sit on. */
    const onePage = elem.pages.size === 1 ? [...elem.pages][0] : null;
    objs.set(elem.id, {
      dict: dict({
        Type: "/StructElem",
        S: `/${elem.tag}`,
        P: `${elem.parent} 0 R`,
        Pg: onePage ? `${onePage.id} 0 R` : undefined,
        K: elem.annot
          ? `[${kids.join(" ")} << /Type /OBJR /Obj ${elem.annot} 0 R >>]`
          : kids.length === 1
            ? kids[0]
            : `[${kids.join(" ")}]`,
        Alt: elem.alt ? str(elem.alt) : undefined,
      }),
    });
  }

  /* Number tree: page index (and each link annotation) back to its elements. */
  const nums = [];
  pages.forEach((p, i) => {
    const byMcid = [];
    for (const elem of elems) {
      for (const k of elem.kids) {
        if (k.mcid !== undefined && k.page === p) byMcid[k.mcid] = elem;
      }
    }
    const arr = objs.add({
      array: `[${byMcid.map((e) => (e ? `${e.id} 0 R` : "null")).join(" ")}]`,
    });
    nums.push(`${i} ${arr} 0 R`);
  });

  let structParent = pages.length;
  for (const p of pages) {
    for (const a of p.annots) {
      a.structParent = structParent;
      nums.push(`${structParent} ${a.elem.id} 0 R`);
      structParent++;
      /* A link annotation needs its own number-tree entry, or a checker
         reports the annotation itself as untagged content. */
      objs.set(a.id, {
        dict: dict({
          Type: "/Annot",
          Subtype: "/Link",
          Rect: `[${a.rect.map(PT).join(" ")}]`,
          Border: "[0 0 0]",
          StructParent: a.structParent,
          A: dict({ Type: "/Action", S: "/URI", URI: str(a.url) }),
          Contents: str(a.url),
        }),
      });
    }
  }

  const parentTree = objs.add({ dict: dict({ Nums: `[${nums.join(" ")}]` }) });

  objs.set(structRoot, {
    dict: dict({
      Type: "/StructTreeRoot",
      K: `[${docElem.id} 0 R]`,
      ParentTree: `${parentTree} 0 R`,
      ParentTreeNextKey: structParent,
    }),
  });

  /* XMP must not be compressed, and its /Length is bytes, not characters:
     the leading byte-order mark alone is three bytes and one character. */
  const metadata = Buffer.from(xmp(meta), "utf8");
  const metaId = objs.add({
    dict: dict({ Type: "/Metadata", Subtype: "/XML", Length: metadata.length }),
    stream: metadata,
  });

  const info = objs.add({
    dict: dict({
      Title: str(meta.title),
      Author: str(meta.author),
      Subject: str(meta.subject),
      Keywords: str(meta.keywords),
      Creator: str(meta.creator),
      Producer: str(meta.creator),
      CreationDate: str(meta.date),
      ModDate: str(meta.date),
    }),
  });

  const catalog = objs.add({
    dict: dict({
      Type: "/Catalog",
      Pages: `${pagesId} 0 R`,
      Lang: str(meta.lang),
      MarkInfo: "<< /Marked true >>",
      StructTreeRoot: `${structRoot} 0 R`,
      /* Without this a reader announces the file name instead of the title. */
      ViewerPreferences: "<< /DisplayDocTitle true >>",
      Metadata: `${metaId} 0 R`,
    }),
  });

  return serialise(objs, catalog, info);
}

function colorOp(c) {
  const [r, g, b] = c ?? [0.12, 0.1, 0.11];
  return `${PT(r)} ${PT(g)} ${PT(b)} rg`;
}

function artifactText(font, text, size, x, y, color) {
  return [
    "/Artifact BMC",
    "BT",
    `/F1 ${PT(size)} Tf`,
    colorOp(color),
    `1 0 0 1 ${PT(x)} ${PT(y)} Tm`,
    `<${font.encode(text)}> Tj`,
    "ET",
    "EMC",
  ].join("\n");
}

function xmp(meta) {
  const esc = (s) => s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]);
  return `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:pdf="http://ns.adobe.com/pdf/1.3/"
    xmlns:xmp="http://ns.adobe.com/xap/1.0/"
    xmlns:pdfuaid="http://www.aiim.org/pdfua/ns/id/">
   <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${esc(meta.title)}</rdf:li></rdf:Alt></dc:title>
   <dc:creator><rdf:Seq><rdf:li>${esc(meta.author)}</rdf:li></rdf:Seq></dc:creator>
   <dc:description><rdf:Alt><rdf:li xml:lang="x-default">${esc(meta.subject)}</rdf:li></rdf:Alt></dc:description>
   <dc:language><rdf:Bag><rdf:li>${esc(meta.lang)}</rdf:li></rdf:Bag></dc:language>
   <pdf:Producer>${esc(meta.creator)}</pdf:Producer>
   <xmp:CreatorTool>${esc(meta.creator)}</xmp:CreatorTool>
   <pdfuaid:part>1</pdfuaid:part>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

function serialise(objs, catalog, info) {
  const parts = [Buffer.from("%PDF-1.7\n%\xe2\xe3\xcf\xd3\n", "latin1")];
  let offset = parts[0].length;
  const offsets = [0];

  for (let id = 1; id < objs.bodies.length; id++) {
    const body = objs.bodies[id];
    offsets[id] = offset;
    let buf;
    if (body === null) {
      buf = Buffer.from(`${id} 0 obj\nnull\nendobj\n`, "latin1");
    } else if (body.array) {
      buf = Buffer.from(`${id} 0 obj\n${body.array}\nendobj\n`, "latin1");
    } else if (body.stream) {
      buf = Buffer.concat([
        Buffer.from(`${id} 0 obj\n${body.dict}\nstream\n`, "latin1"),
        Buffer.isBuffer(body.stream) ? body.stream : Buffer.from(body.stream, "latin1"),
        Buffer.from("\nendstream\nendobj\n", "latin1"),
      ]);
    } else {
      buf = Buffer.from(`${id} 0 obj\n${body.dict}\nendobj\n`, "latin1");
    }
    parts.push(buf);
    offset += buf.length;
  }

  const n = objs.bodies.length;
  let xref = `xref\n0 ${n}\n0000000000 65535 f \n`;
  for (let id = 1; id < n; id++) {
    xref += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  }
  xref += `trailer\n${dict({ Size: n, Root: `${catalog} 0 R`, Info: `${info} 0 R`, ID: `[<${"0".repeat(32)}> <${"0".repeat(32)}>]` })}\nstartxref\n${offset}\n%%EOF\n`;
  parts.push(Buffer.from(xref, "latin1"));
  return Buffer.concat(parts);
}
