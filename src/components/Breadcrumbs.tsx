import { Link } from "react-router-dom";
import type { Crumb } from "../lib/schema";

/**
 * Visible trail. The machine-readable equivalent is the `BreadcrumbList` in the
 * page's schema.org graph. Both are built from the same `Crumb[]`, so they
 * cannot drift.
 */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  if (crumbs.length < 2) return null;
  const last = crumbs.length - 1;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {crumbs.map((c, i) => (
        <span key={c.path}>
          {i > 0 && (
            <span aria-hidden="true" style={{ marginRight: "0.25rem" }}>
              /
            </span>
          )}
          {i === last ? (
            <span aria-current="page">{c.name}</span>
          ) : (
            <Link to={c.path}>{c.name}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
