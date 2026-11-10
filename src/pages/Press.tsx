import { FiExternalLink } from "react-icons/fi";
import { Page } from "../components/Page";
import { Pager } from "../components/Pager";
import { Badge } from "../components/Badge";
import { mentions, KIND_LABEL } from "../data/press";
import { formatDate } from "../lib/format";
import { adjacent } from "../nav";

export function Press() {
  const { prev, next } = adjacent("/press");
  const ordered = [...mentions].sort((a, b) => b.date.localeCompare(a.date));
  const crumbs = [
    { name: "Overview", path: "/" },
    { name: "Press & recognition", path: "/press" },
  ];


  return (
    <Page
      eyebrow="Record"
      title="Press & recognition"
      description="Things other people published. Every entry names the outlet and links to the source. Nothing here is self-published."
      path="/press"
      crumbs={crumbs}
    >
      <ul className="entry-list">
        {ordered.map((m) => (
          <li key={m.id} id={m.id}>
            <div className="entry__head">
              <div>
                <div className="entry__role">
                  <a href={m.url} target="_blank" rel="noopener noreferrer">
                    {m.title}
                  </a>{" "}
                  <FiExternalLink
                    aria-hidden
                    size={13}
                    style={{ display: "inline", verticalAlign: "baseline" }}
                  />
                </div>
                <div className="entry__org">
                  {m.outletUrl ? (
                    <a href={m.outletUrl} target="_blank" rel="noopener noreferrer">
                      {m.outlet}
                    </a>
                  ) : (
                    m.outlet
                  )}
                </div>
              </div>
              <div className="entry__period">
                <Badge accent>{KIND_LABEL[m.kind]}</Badge>{" "}
                <time dateTime={m.date}>{formatDate(m.date)}</time>
              </div>
            </div>

            <div className="entry__points">{m.description}</div>

            {m.quote && (
              <blockquote className="pull-quote">
                {m.quote}
                {m.quoteAttribution && <cite>{m.quoteAttribution}</cite>}
              </blockquote>
            )}

            {m.note && (
              <div role="note" className="callout" style={{ marginTop: "var(--space-md)" }}>
                <span className="callout__label">Context</span>
                {m.note}
              </div>
            )}
          </li>
        ))}
      </ul>

      <Pager
        prev={prev && { label: prev.label, path: prev.path }}
        next={next && { label: next.label, path: next.path }}
      />
    </Page>
  );
}
