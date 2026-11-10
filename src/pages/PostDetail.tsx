import { Link, useParams } from "react-router-dom";
import { Page } from "../components/Page";
import { Pager } from "../components/Pager";
import { Badge } from "../components/Badge";
import { PostBody } from "../components/PostBody";
import { headingEntries } from "../lib/slug";
import { postsNewestFirst, postBySlug } from "../data/posts";
import { projectBySlug } from "../data/projects";
import { formatDate } from "../lib/format";
import { NotFound } from "./NotFound";

export function PostDetail() {
  const { slug = "" } = useParams();
  const post = postBySlug(slug);

  if (!post) {
    return <NotFound what="post" backLabel="All posts" backPath="/writing" />;
  }

  const index = postsNewestFirst.findIndex((p) => p.slug === slug);
  const newer = postsNewestFirst[index - 1];
  const older = postsNewestFirst[index + 1];
  const project = post.relatedProject ? projectBySlug(post.relatedProject) : undefined;

  const crumbs = [
    { name: "Overview", path: "/" },
    { name: "Writing", path: "/writing" },
    { name: post.title, path: `/writing/${post.slug}` },
  ];


  return (
    <Page
      eyebrow={post.tags[0]}
      title={post.title}
      description={post.description}
      path={`/writing/${post.slug}`}
      toc={headingEntries(post.body)}
      crumbs={crumbs}
      aside={
        <>
          <p
            className="index-row__meta"
            style={{ marginTop: "var(--space-md)", display: "flex" }}
          >
            <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} min read</span>
          </p>
          <div className="tag-row" style={{ marginTop: "var(--space-sm)" }}>
            {post.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          {project && (
            <div role="note" className="callout" style={{ marginTop: "var(--space-md)" }}>
              <span className="callout__label">From the project</span>
              <Link to={`/projects/${project.slug}`}>{project.title}</Link>:{" "}
              {project.summary}
            </div>
          )}
        </>
      }
    >
      <PostBody body={post.body} />

      <Pager
        prev={older && { label: older.title, path: `/writing/${older.slug}` }}
        next={newer && { label: newer.title, path: `/writing/${newer.slug}` }}
      />
    </Page>
  );
}
