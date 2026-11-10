/** Date formatting shared across pages. Dates in data are ISO 8601. */
export function formatDate(iso: string): string {
  const parts = iso.split("-").map(Number);
  const [y, m, d] = parts;
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    ...(d ? { day: "numeric" as const } : {}),
    timeZone: "UTC",
  });
}

/** "Sept 2023" style, for employment ranges. */
export function formatMonth(iso: string): string {
  const [y, m] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, 1)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
