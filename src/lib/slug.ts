import type { Block } from "../data/posts";

/** Heading text to an id. Used for in-page anchors and the contents rail. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** A post's top-level headings, for the contents rail. */
export function headingEntries(body: Block[]) {
  return body
    .filter((b): b is { type: "h2"; text: string } => b.type === "h2")
    .map((b) => ({ id: slugify(b.text), label: b.text }));
}
