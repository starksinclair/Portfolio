import type { CvBlock, CvEntry as CvEntryData } from "../data/cv";

/**
 * One entry from `src/data/cv.ts`, rendered.
 *
 * It lives here rather than inside the CV page because `/research` shows the
 * same research entries. Duplicating the markup would let the two pages drift
 * apart while claiming to describe the same work.
 */
export function CvBlocks({ blocks }: { blocks: CvBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.kind === "bullets") {
          return (
            <ul className="entry__points" key={i}>
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.kind === "labelled") {
          return (
            <p className="cv-note" key={i}>
              <strong>
                {block.label}
                {block.text ? ": " : ""}
              </strong>
              {block.text}
            </p>
          );
        }
        return (
          <p className="cv-note" key={i}>
            {block.text}
          </p>
        );
      })}
    </>
  );
}

export function CvEntry({
  entry,
  heading,
  children,
}: {
  entry: CvEntryData;
  /** False when the section title already says what this entry is. */
  heading: boolean;
  /** Rendered after the entry's own blocks: links, buttons. */
  children?: React.ReactNode;
}) {
  return (
    <li>
      {heading && (
        <div className="entry__head">
          <div>
            <h3 className="entry__role">
              {entry.url ? (
                <a href={entry.url} target="_blank" rel="noopener noreferrer">
                  {entry.title}
                </a>
              ) : (
                entry.title
              )}
            </h3>
            {entry.subtitle && <div className="entry__org">{entry.subtitle}</div>}
            {entry.detail && <div className="entry__org">{entry.detail}</div>}
          </div>
          {entry.meta && <div className="entry__period">{entry.meta}</div>}
        </div>
      )}
      {entry.question && (
        <p className="cv-note">
          <strong>Research question: </strong>
          {entry.question}
        </p>
      )}
      {entry.blocks && <CvBlocks blocks={entry.blocks} />}
      {children}
    </li>
  );
}
