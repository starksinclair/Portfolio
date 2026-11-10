import type { Block } from "../data/posts";
import { slugify } from "../lib/slug";

/**
 * Renders a post's structured blocks. Posts are blocks rather than markdown so
 * the site ships no markdown parser and every post is type-checked at build.
 */
export function PostBody({ body }: { body: Block[] }) {
  return (
    <div className="prose">
      {body.map((block, i) => {
        switch (block.type) {
          case "p":
            return <p key={i}>{block.text}</p>;
          case "h2":
            return (
              <h2 key={i} id={slugify(block.text)}>
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={slugify(block.text)}>
                {block.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote key={i}>
                <p>{block.text}</p>
                {block.cite && <cite>{block.cite}</cite>}
              </blockquote>
            );
          case "code":
            return (
              <pre key={i} tabIndex={0} aria-label={`${block.lang} code sample`}>
                <code>{block.code}</code>
              </pre>
            );
          case "note":
            return (
              <div key={i} role="note" className="callout">
                <span className="callout__label">Note</span>
                {block.text}
              </div>
            );
        }
      })}
    </div>
  );
}
