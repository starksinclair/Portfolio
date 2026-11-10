import { Link, useParams } from "react-router-dom";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import { Page, Section } from "../components/Page";
import { Pager } from "../components/Pager";
import { StatusBadge } from "../components/Badge";
import { projects, projectBySlug } from "../data/projects";
import { postsNewestFirst } from "../data/posts";
import { NotFound } from "./NotFound";

export function ProjectDetail() {
  const { slug = "" } = useParams();
  const project = projectBySlug(slug);

  if (!project) {
    return (
      <NotFound
        what="project"
        backLabel="All projects"
        backPath="/projects"
      />
    );
  }

  const index = projects.findIndex((p) => p.slug === slug);
  const prev = projects[index - 1];
  const next = projects[index + 1];
  const relatedPost = postsNewestFirst.find((p) => p.relatedProject === slug);

  const crumbs = [
    { name: "Overview", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.title, path: `/projects/${project.slug}` },
  ];


  const toc = [
    { id: "what-it-is", label: "What it is" },
    ...(project.userStories.length ? [{ id: "user-stories", label: "User stories" }] : []),
    ...(project.challenges.length ? [{ id: "problems", label: "Problems and fixes" }] : []),
  ];

  return (
    <Page
      eyebrow={project.category}
      title={project.title}
      description={project.summary}
      path={`/projects/${project.slug}`}
      toc={toc}
      crumbs={crumbs}
      aside={
        <>
          <dl className="meta-table" style={{ marginTop: "var(--space-lg)" }}>
            <div>
              <dt>Status</dt>
              <dd>
                <StatusBadge status={project.status} />
              </dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>Context</dt>
              <dd>{project.context}</dd>
            </div>
            <div>
              <dt>My role</dt>
              <dd>{project.role}</dd>
            </div>
            {project.technologies.length > 0 && (
              <div>
                <dt>Built with</dt>
                <dd>
                  <ul className="tech-list">
                    {project.technologies.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>

          {(project.liveUrl || project.repoUrl) && (
            <div className="button-row" style={{ marginTop: "var(--space-lg)" }}>
              {project.liveUrl && (
                <a
                  className="button button--primary"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiExternalLink aria-hidden size={15} /> Open the live site
                </a>
              )}
              {project.repoUrl && (
                <a
                  className="button button--secondary"
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiGithub aria-hidden size={15} /> Source
                </a>
              )}
            </div>
          )}
        </>
      }
    >
      <Section id="what-it-is" title="What it is">
        <div className="prose">
          <p>{project.description}</p>
        </div>
        {relatedPost && (
          <div role="note" className="callout" style={{ marginTop: "var(--space-md)" }}>
            <span className="callout__label">Related writing</span>
            <Link to={`/writing/${relatedPost.slug}`}>{relatedPost.title}</Link>:{" "}
            {relatedPost.description}
          </div>
        )}
      </Section>

      {project.userStories.length > 0 && (
        <Section id="user-stories" title="User stories">
          <ul>
            {project.userStories.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Section>
      )}

      {project.challenges.length > 0 && (
        <Section id="problems" title="Problems and fixes">
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
            Paired: what blocked me, then what actually resolved it.
          </p>
          <ol className="entry-list" style={{ paddingLeft: 0, listStyle: "none" }}>
            {project.challenges.map((challenge, i) => (
              <li key={i}>
                <div className="entry__role" style={{ fontSize: "var(--text-sm)" }}>
                  {challenge}
                </div>
                {project.solutions[i] && (
                  <div className="entry__points" style={{ marginTop: "var(--space-xs)" }}>
                    <strong style={{ color: "var(--accent)" }}>Fix:</strong>{" "}
                    {project.solutions[i]}
                  </div>
                )}
              </li>
            ))}
          </ol>
          {project.solutions.length > project.challenges.length && (
            <ul style={{ marginTop: "var(--space-md)" }}>
              {project.solutions.slice(project.challenges.length).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </Section>
      )}

      <Pager
        prev={prev && { label: prev.title, path: `/projects/${prev.slug}` }}
        next={next && { label: next.title, path: `/projects/${next.slug}` }}
      />
    </Page>
  );
}
