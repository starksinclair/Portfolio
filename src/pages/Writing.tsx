import { Link } from "react-router-dom";
import { Page } from "../components/Page";
import { Pager } from "../components/Pager";
import { Badge } from "../components/Badge";
import { postsNewestFirst, allTags } from "../data/posts";
import { formatDate } from "../lib/format";
import { adjacent } from "../nav";

export function Writing() {
  const { prev, next } = adjacent("/writing");
  const crumbs = [
    { name: "Overview", path: "/" },
    { name: "Writing", path: "/writing" },
  ];


  return (
    <Page
      eyebrow="Writing"
      title="Blog"
      description="Things I learned the hard way, written down while they were still annoying. Mostly architecture decisions, applied AI, and research notes."
      path="/writing"
      crumbs={crumbs}
      aside={
        <div className="tag-row" style={{ marginTop: "var(--space-md)" }}>
          {allTags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      }
    >
      <ul className="index-list">
        {postsNewestFirst.map((post) => (
          <li key={post.slug}>
            <Link to={`/writing/${post.slug}`} className="index-row">
              <span className="index-row__top">
                <span className="index-row__title">{post.title}</span>
              </span>
              <span className="index-row__summary">{post.description}</span>
              <span className="index-row__meta">
                <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
                <span aria-hidden>·</span>
                <span>{post.readingMinutes} min read</span>
                <span aria-hidden>·</span>
                <span>{post.tags.join(", ")}</span>
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
