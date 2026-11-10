import type { ProjectStatus } from "../data/projects";
import { STATUS_LABEL } from "../data/projects";

/**
 * Status always carries its text label. Colour is never the sole carrier of
 * meaning (BRAND.md §4.3), so this component cannot render colour-only.
 */
export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={`badge badge--${status}`}>{STATUS_LABEL[status]}</span>;
}

export function Badge({
  children,
  accent = false,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return <span className={accent ? "badge badge--accent" : "badge"}>{children}</span>;
}
