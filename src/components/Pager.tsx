import { Link } from "react-router-dom";

export interface PagerTarget {
  label: string;
  path: string;
}

/** Prev/next across the sidebar reading order, as a docs site does. */
export function Pager({ prev, next }: { prev?: PagerTarget; next?: PagerTarget }) {
  if (!prev && !next) return null;

  return (
    <nav className="pager" aria-label="Previous and next page">
      {prev ? (
        <Link to={prev.path} className="pager__link" rel="prev">
          <span className="pager__dir">Previous</span>
          <span className="pager__title">{prev.label}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link to={next.path} className="pager__link pager__link--next" rel="next">
          <span className="pager__dir">Next</span>
          <span className="pager__title">{next.label}</span>
        </Link>
      )}
    </nav>
  );
}
