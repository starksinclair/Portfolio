/**
 * The smallest TrueType reader and subsetter that a tagged PDF needs.
 *
 * It answers two questions: what glyph does this character map to, and how wide
 * is it; and then it rebuilds a font file containing only the glyphs actually
 * used. Subsetting is what keeps the CV under 100 KB instead of 700 KB.
 *
 * No third-party code, because this runs from a plain `node scripts/...` with
 * nothing installed, and a CV generator nobody can run is not a generator.
 */

const u16 = (b, o) => b.readUInt16BE(o);
const i16 = (b, o) => b.readInt16BE(o);
const u32 = (b, o) => b.readUInt32BE(o);

export function parseTTF(buf) {
  const numTables = u16(buf, 4);
  const tables = {};
  for (let i = 0; i < numTables; i++) {
    const p = 12 + i * 16;
    tables[buf.toString("latin1", p, p + 4)] = {
      offset: u32(buf, p + 8),
      length: u32(buf, p + 12),
    };
  }

  const head = tables.head.offset;
  const unitsPerEm = u16(buf, head + 18);
  const indexToLocFormat = i16(buf, head + 50);
  const bbox = [50, 52, 54, 56].map((d) => i16(buf, head + d));

  const numGlyphs = u16(buf, tables.maxp.offset + 4);
  const numberOfHMetrics = u16(buf, tables.hhea.offset + 34);

  /* hmtx stores advances for the first numberOfHMetrics glyphs; every glyph
     after that repeats the last advance. */
  const advances = new Array(numGlyphs);
  const hm = tables.hmtx.offset;
  let last = 0;
  for (let g = 0; g < numGlyphs; g++) {
    if (g < numberOfHMetrics) last = u16(buf, hm + g * 4);
    advances[g] = last;
  }

  const os2 = tables["OS/2"]?.offset;
  const ascent = os2 ? i16(buf, os2 + 68) : i16(buf, tables.hhea.offset + 4);
  const descent = os2 ? i16(buf, os2 + 70) : i16(buf, tables.hhea.offset + 6);
  const capHeight = os2 && u16(buf, os2) >= 2 ? i16(buf, os2 + 88) : Math.round(ascent * 0.7);
  const italicAngle = i16(buf, tables.post.offset + 4);

  return {
    buf,
    tables,
    unitsPerEm,
    indexToLocFormat,
    numGlyphs,
    advances,
    bbox,
    ascent,
    descent,
    capHeight,
    italicAngle,
    cmap: readCmap(buf, tables.cmap.offset),
  };
}

/** Unicode code point to glyph id. Formats 4 and 12 cover every modern font. */
function readCmap(buf, off) {
  const n = u16(buf, off + 2);
  let best = null;
  for (let i = 0; i < n; i++) {
    const p = off + 4 + i * 8;
    const platform = u16(buf, p);
    const encoding = u16(buf, p + 2);
    const sub = off + u32(buf, p + 4);
    const format = u16(buf, sub);
    const unicode =
      platform === 3 ? encoding === 1 || encoding === 10 : platform === 0;
    if (!unicode) continue;
    if (format === 12) best = { sub, format };
    else if (format === 4 && !best) best = { sub, format };
  }
  if (!best) throw new Error("no usable cmap subtable");

  const map = new Map();
  if (best.format === 12) {
    const groups = u32(buf, best.sub + 12);
    for (let i = 0; i < groups; i++) {
      const g = best.sub + 16 + i * 12;
      const start = u32(buf, g);
      const end = u32(buf, g + 4);
      const gid = u32(buf, g + 8);
      for (let c = start; c <= end; c++) map.set(c, gid + (c - start));
    }
    return map;
  }

  const segX2 = u16(buf, best.sub + 6);
  const ends = best.sub + 14;
  const starts = ends + segX2 + 2;
  const deltas = starts + segX2;
  const ranges = deltas + segX2;
  for (let s = 0; s < segX2 / 2; s++) {
    const end = u16(buf, ends + s * 2);
    const start = u16(buf, starts + s * 2);
    const delta = i16(buf, deltas + s * 2);
    const rangeOffset = u16(buf, ranges + s * 2);
    if (start === 0xffff) continue;
    for (let c = start; c <= end; c++) {
      let gid;
      if (rangeOffset === 0) gid = (c + delta) & 0xffff;
      else {
        const gi = ranges + s * 2 + rangeOffset + (c - start) * 2;
        if (gi + 1 >= buf.length) continue;
        gid = u16(buf, gi);
        if (gid !== 0) gid = (gid + delta) & 0xffff;
      }
      if (gid) map.set(c, gid);
    }
  }
  return map;
}

function locaAt(font, i) {
  const { buf, tables, indexToLocFormat } = font;
  return indexToLocFormat
    ? u32(buf, tables.loca.offset + i * 4)
    : u16(buf, tables.loca.offset + i * 2) * 2;
}

/** A composite glyph references other glyphs, which must travel with it. */
function componentsOf(font, gid, out) {
  const start = locaAt(font, gid);
  const end = locaAt(font, gid + 1);
  if (end <= start) return;
  const g = font.tables.glyf.offset + start;
  if (i16(font.buf, g) >= 0) return; // simple glyph
  let p = g + 10;
  for (;;) {
    const flags = u16(font.buf, p);
    const index = u16(font.buf, p + 2);
    if (!out.has(index)) {
      out.add(index);
      componentsOf(font, index, out);
    }
    p += 4;
    p += flags & 1 ? 4 : 2; // ARG_1_AND_2_ARE_WORDS
    if (flags & 8) p += 2; // WE_HAVE_A_SCALE
    else if (flags & 0x40) p += 4; // X_AND_Y_SCALE
    else if (flags & 0x80) p += 8; // TWO_BY_TWO
    if (!(flags & 0x20)) break; // MORE_COMPONENTS
  }
}

const KEEP = ["cvt ", "fpgm", "prep", "gasp"];

/**
 * Rebuild the font with only `gids` (glyph 0 always included). Glyph ids are
 * preserved rather than remapped, so the PDF can keep using Identity-H and the
 * caller does not have to renumber anything; the gaps cost two bytes each in
 * `loca` and nothing in `glyf`.
 */
export function subsetTTF(font, gids) {
  const keep = new Set([0, ...gids]);
  for (const g of [...keep]) componentsOf(font, g, keep);

  const maxGid = Math.max(...keep) + 1;
  const glyphs = [];
  let total = 0;
  for (let g = 0; g < maxGid; g++) {
    if (!keep.has(g)) {
      glyphs.push(Buffer.alloc(0));
      continue;
    }
    const s = locaAt(font, g);
    const e = locaAt(font, g + 1);
    let data = font.buf.subarray(font.tables.glyf.offset + s, font.tables.glyf.offset + e);
    if (data.length % 4) data = Buffer.concat([data, Buffer.alloc(4 - (data.length % 4))]);
    glyphs.push(data);
    total += data.length;
  }

  const glyf = Buffer.concat(glyphs, total);
  const loca = Buffer.alloc((maxGid + 1) * 4);
  let o = 0;
  for (let g = 0; g < maxGid; g++) {
    loca.writeUInt32BE(o, g * 4);
    o += glyphs[g].length;
  }
  loca.writeUInt32BE(o, maxGid * 4);

  const head = Buffer.from(
    font.buf.subarray(font.tables.head.offset, font.tables.head.offset + font.tables.head.length),
  );
  head.writeInt16BE(1, 50); // indexToLocFormat: long

  const maxp = Buffer.from(
    font.buf.subarray(font.tables.maxp.offset, font.tables.maxp.offset + font.tables.maxp.length),
  );
  maxp.writeUInt16BE(maxGid, 4);

  const hhea = Buffer.from(
    font.buf.subarray(font.tables.hhea.offset, font.tables.hhea.offset + font.tables.hhea.length),
  );
  hhea.writeUInt16BE(maxGid, 34); // every glyph carries its own advance

  const hmtx = Buffer.alloc(maxGid * 4);
  for (let g = 0; g < maxGid; g++) hmtx.writeUInt16BE(font.advances[g] ?? 0, g * 4);

  const out = { head, hhea, maxp, hmtx, loca, glyf };
  for (const t of KEEP) {
    const tab = font.tables[t];
    if (tab) out[t] = font.buf.subarray(tab.offset, tab.offset + tab.length);
  }
  return buildTTF(out);
}

function buildTTF(tables) {
  const tags = Object.keys(tables).sort();
  const n = tags.length;
  const search = Math.floor(Math.log2(n));
  const header = Buffer.alloc(12 + n * 16);
  header.writeUInt32BE(0x00010000, 0);
  header.writeUInt16BE(n, 4);
  header.writeUInt16BE(2 ** search * 16, 6);
  header.writeUInt16BE(search, 8);
  header.writeUInt16BE(n * 16 - 2 ** search * 16, 10);

  const parts = [header];
  let offset = header.length;
  tags.forEach((tag, i) => {
    let data = tables[tag];
    if (data.length % 4) data = Buffer.concat([data, Buffer.alloc(4 - (data.length % 4))]);
    const p = 12 + i * 16;
    header.write(tag.padEnd(4), p, 4, "latin1");
    header.writeUInt32BE(checksum(data), p + 4);
    header.writeUInt32BE(offset, p + 8);
    header.writeUInt32BE(tables[tag].length, p + 12);
    parts.push(data);
    offset += data.length;
  });
  return Buffer.concat(parts);
}

function checksum(buf) {
  let sum = 0;
  for (let i = 0; i + 3 < buf.length; i += 4) sum = (sum + buf.readUInt32BE(i)) >>> 0;
  return sum;
}
