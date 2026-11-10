import { useEffect, useState } from "react";

export interface TocEntry {
  id: string;
  label: string;
}

/**
 * On-page contents. Appears at 1280px and up. The active entry is tracked with
 * IntersectionObserver rather than scroll handlers so it costs nothing on the
 * main thread while scrolling.
 */
export function Toc({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string | null>(entries[0]?.id ?? null);

  useEffect(() => {
    if (entries.length === 0) return;

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((r) => r.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    const nodes = entries
      .map((e) => document.getElementById(e.id))
      .filter((n): n is HTMLElement => n !== null);
    nodes.forEach((n) => observer.observe(n));

    return () => observer.disconnect();
  }, [entries]);

  if (entries.length < 2) return <aside className="docs-toc" aria-hidden />;

  return (
    <aside className="docs-toc" aria-label="On this page">
      <div className="docs-toc__title">On this page</div>
      <ol>
        {entries.map((e) => (
          <li key={e.id}>
            <a href={`#${e.id}`} aria-current={active === e.id ? "true" : undefined}>
              {e.label}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
