import { Link } from "react-router-dom";
import { Page } from "../components/Page";
import { Pager } from "../components/Pager";
import { StatusBadge } from "../components/Badge";
import { projects, projectsByCategory } from "../data/projects";
import { adjacent } from "../nav";

export function Projects() {
  const grouped = projectsByCategory();
  const { prev, next } = adjacent("/projects");
  const crumbs = [
    { name: "Overview", path: "/" },
    { name: "Projects", path: "/projects" },
  ];


  const toc = grouped.map(([category]) => ({
    id: slugifyCategory(category),
    label: category,
  }));

  return (
    <Page
      eyebrow="Work"
      title="Projects"
      description={`${projects.length} projects, grouped by what they are. Each entry lists what I personally owned, what went wrong, and what fixed it.`}
      path="/projects"
      toc={toc}
      crumbs={crumbs}
    >
      {grouped.map(([category, list]) => (
        <section
          className="section"
          key={category}
          aria-labelledby={slugifyCategory(category)}
        >
          <h2 className="section__title" id={slugifyCategory(category)}>
            {category}{" "}
            <span style={{ color: "var(--text-faint)", fontWeight: 400 }}>
              ({list.length})
            </span>
          </h2>
          <ul className="index-list">
            {list.map((p) => (
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
                    {p.technologies.length > 0 && (
                      <>
                        <span aria-hidden>·</span>
                        <span>{p.technologies.slice(0, 5).join(", ")}</span>
                      </>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <Pager
        prev={prev && { label: prev.label, path: prev.path }}
        next={next && { label: next.label, path: next.path }}
      />
    </Page>
  );
}

function slugifyCategory(c: string) {
  return c
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
