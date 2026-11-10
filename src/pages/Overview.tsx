import { Link } from "react-router-dom";
import { Page, Section } from "../components/Page";
import { Pager } from "../components/Pager";
import { StatusBadge } from "../components/Badge";
import { profile, positions } from "../data/profile";
import { featuredProjects, projects } from "../data/projects";
import { postsNewestFirst } from "../data/posts";
import { publications } from "../data/press";
import { adjacent } from "../nav";
import { formatDate } from "../lib/format";

const toc = [
  { id: "now", label: "What I'm doing now" },
  { id: "selected", label: "Selected work" },
  { id: "recent-writing", label: "Recent writing" },
  { id: "start-here", label: "Start here" },
];

export function Overview() {
  const paper = publications[0];
  const latest = postsNewestFirst.slice(0, 3);
  const { next } = adjacent("/");


  return (
    <Page
      eyebrow="Overview"
      title={profile.name}
      description={profile.headline}
      metaDescription={profile.summary}
      path="/"
      toc={toc}
    >
      <div className="prose">
        <p>{profile.summary}</p>
      </div>

      <Section id="now" title="What I'm doing now">
        <ul className="now-list">
          {positions
            .filter((p) => !p.endDate)
            .map((p) => (
              <li key={p.organization}>
                <strong>{p.role}</strong> at {p.organization}, {p.period}.
              </li>
            ))}
          <li>
            <strong>Published</strong> in <cite>{paper.citation!.journal}</cite>: a
            two-stage method for forecasting ordinal time series.{" "}
            <a href={paper.url} target="_blank" rel="noopener noreferrer">
              DOI {paper.citation!.doi}
            </a>
          </li>
          <li>
            <strong>Researching</strong> whether enforcing accessibility at authoring
            time beats checking it afterwards, for CS 499.{" "}
            <Link to="/projects/accessibility-docs">Read the write-up</Link>
          </li>
          <li>
            <strong>Finishing</strong> a BSc in Computer Science at Ball State
            University in May 2027.
          </li>
        </ul>
      </Section>

      <Section id="selected" title="Selected work">
        <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
          Four of {projects.length}. The full index is under{" "}
          <Link to="/projects">Projects</Link>.
        </p>
        <ul className="index-list">
          {featuredProjects.map((p) => (
            <li key={p.slug}>
              <Link to={`/projects/${p.slug}`} className="index-row">
                <span className="index-row__top">
                  <span className="index-row__title">{p.title}</span>
                  <StatusBadge status={p.status} />
                </span>
                <span className="index-row__summary">{p.summary}</span>
                <span className="index-row__meta">
                  <span>{p.year}</span>
                  <span aria-hidden>·</span>
                  <span>{p.context}</span>
                  <span aria-hidden>·</span>
                  <span>{p.technologies.slice(0, 4).join(", ")}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="recent-writing" title="Recent writing">
        <ul className="index-list">
          {latest.map((post) => (
            <li key={post.slug}>
              <Link to={`/writing/${post.slug}`} className="index-row">
                <span className="index-row__top">
                  <span className="index-row__title">{post.title}</span>
                </span>
                <span className="index-row__summary">{post.description}</span>
                <span className="index-row__meta">
                  <time dateTime={post.datePublished}>
                    {formatDate(post.datePublished)}
                  </time>
                  <span aria-hidden>·</span>
                  <span>{post.readingMinutes} min</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="start-here" title="Start here">
        <dl className="meta-table">
          <div>
            <dt>Hiring</dt>
            <dd>
              <Link to="/cv">CV</Link> and{" "}
              <Link to="/experience">experience</Link>, then{" "}
              <Link to="/contact">contact</Link>.
            </dd>
          </div>
          <div>
            <dt>Research</dt>
            <dd>
              <Link to="/research">Publications</Link>: one peer-reviewed paper, one
              study in progress.
            </dd>
          </div>
          <div>
            <dt>Code</dt>
            <dd>
              <Link to="/projects">{projects.length} projects</Link>, or{" "}
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer">
                github.com/starksinclair
              </a>
              .
            </dd>
          </div>
          <div>
            <dt>Third parties</dt>
            <dd>
              <Link to="/press">Press &amp; recognition</Link>: what other people
              have published.
            </dd>
          </div>
        </dl>
      </Section>

      <Pager next={next && { label: next.label, path: next.path }} />
    </Page>
  );
}
