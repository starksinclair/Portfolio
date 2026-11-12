import { Link } from "react-router-dom";
import { Page } from "../components/Page";
import { Pager } from "../components/Pager";
import { Badge } from "../components/Badge";
import { presentationsNewestFirst } from "../data/presentations";
import { formatDate } from "../lib/format";
import { adjacent } from "../nav";

export function Presentations() {
  const { prev, next } = adjacent("/presentations");
  const crumbs = [
    { name: "Overview", path: "/" },
    { name: "Presentations", path: "/presentations" },
  ];

  return (
    <Page
      eyebrow="Writing"
      title="Presentations"
      description="Talks and workshops, with the slides as they were presented."
      path="/presentations"
      crumbs={crumbs}
    >
      <ul className="index-list">
        {presentationsNewestFirst.map((p) => (
          <li key={p.slug}>
            <Link to={`/presentations/${p.slug}`} className="index-row">
              <span className="index-row__top">
                <span className="index-row__title">{p.title}</span>
                {p.status === "upcoming" && <Badge>Upcoming</Badge>}
              </span>
              <span className="index-row__summary">{p.description}</span>
              <span className="index-row__meta">
                <time dateTime={p.date}>{formatDate(p.date)}</time>
                <span aria-hidden>·</span>
                <span>{p.series}</span>
                <span aria-hidden>·</span>
                <span>{p.audience}</span>
              </span>
            </Link>
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
