import { Link } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";
import { Page, Section } from "../components/Page";
import { Pager } from "../components/Pager";
import { publications } from "../data/press";
import { researchEntries } from "../data/cv";
import { CvEntry } from "../components/CvEntry";
import { profile } from "../data/profile";
import { formatDate } from "../lib/format";
import { adjacent } from "../nav";

const toc = [
  { id: "published", label: "Published" },
  { id: "studies", label: "Research and immersive learning" },
];

export function Research() {
  const { prev, next } = adjacent("/research");
  const crumbs = [
    { name: "Overview", path: "/" },
    { name: "Research", path: "/research" },
  ];


  return (
    <Page
      eyebrow="Work"
      title="Research"
      description="One peer-reviewed paper on ordinal time series forecasting, and four studies in accessible documents, AI coding agents and campus energy."
      path="/research"
      toc={toc}
      crumbs={crumbs}
    >
      <p className="prose">
        Two fields, and the same question underneath both: whether a constraint
        applied earlier produces a better result than a correction applied later.
        In <strong>ordinal time series forecasting</strong> that constraint is a set
        of optimised thresholds instead of naive rounding. In{" "}
        <strong>document accessibility</strong>, where the work sits between
        software engineering and human&ndash;computer interaction, it is a rule
        enforced while someone writes instead of an audit afterwards.
      </p>

      <Section id="published" title="Published">
        {publications.map((m) => {
          const c = m.citation!;
          return (
            <article key={m.id}>
              <h3 style={{ marginBottom: "var(--space-sm)" }}>{m.title}</h3>
              <p className="citation">
                {c.authors.map((a, i) => (
                  <span key={a}>
                    {a === "Sinclair Nzenwata" ? <strong>{a}</strong> : a}
                    {i < c.authors.length - 1 ? ", " : ". "}
                  </span>
                ))}
                &ldquo;{m.title}&rdquo; <em>{c.journal}</em> {c.volume}, no. {c.issue} (
                {c.year}): {c.articleNumber}. doi:{c.doi}
              </p>

              <dl className="meta-table" style={{ marginTop: "var(--space-md)" }}>
                <div>
                  <dt>Journal</dt>
                  <dd>
                    {c.journal} (MDPI), ISSN {c.issn}
                  </dd>
                </div>
                <div>
                  <dt>Published</dt>
                  <dd>{formatDate(c.datePublished)}</dd>
                </div>
                <div>
                  <dt>Length</dt>
                  <dd>{c.pages} pages, open access (CC BY 4.0)</dd>
                </div>
                <div>
                  <dt>Keywords</dt>
                  <dd>{c.keywords.join(" · ")}</dd>
                </div>
              </dl>

              <div className="prose" style={{ marginTop: "var(--space-lg)" }}>
                <p>{m.description}</p>
              </div>

              <div className="button-row" style={{ marginTop: "var(--space-lg)" }}>
                <a
                  className="button button--primary"
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiExternalLink aria-hidden size={15} /> Read the paper in
                  Forecasting
                </a>
                <Link className="button button--secondary" to="/writing/thresholds-beat-rounding">
                  My write-up on threshold optimisation
                </Link>
              </div>

              <dl className="meta-table" style={{ marginTop: "var(--space-lg)" }}>
                <div>
                  <dt>Also at</dt>
                  <dd>
                    <a href={c.pdfUrl} target="_blank" rel="noopener noreferrer">
                      PDF from MDPI
                    </a>
                    {" · "}
                    <a href={c.preprintUrl} target="_blank" rel="noopener noreferrer">
                      Preprint, 7 October 2026
                    </a>
                    {" · "}
                    <a href={c.scholarUrl} target="_blank" rel="noopener noreferrer">
                      Citations on Google Scholar
                    </a>
                    {profile.socials.googleScholarProfile && (
                      <>
                        {" · "}
                        <a
                          href={profile.socials.googleScholarProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          My Google Scholar profile
                        </a>
                      </>
                    )}
                    {profile.socials.orcid && (
                      <>
                        {" · "}
                        <a
                          href={profile.socials.orcid}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          My ORCID iD
                        </a>
                      </>
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Cite</dt>
                  <dd>
                    <a href={`https://doi.org/${c.doi}`}>doi.org/{c.doi}</a>
                  </dd>
                </div>
              </dl>
            </article>
          );
        })}
      </Section>

      <Section id="studies" title="Research and immersive learning">
        <ul className="entry-list">
          {researchEntries.map((entry) => (
            <CvEntry key={entry.title} entry={entry} heading>
              {entry.title === "Accessible Scholarly Documents" && (
                <div className="button-row" style={{ marginTop: "var(--space-lg)" }}>
                  <Link
                    className="button button--primary"
                    to="/projects/accessibility-docs"
                  >
                    The Accessibility Docs prototype
                  </Link>
                  <Link
                    className="button button--secondary"
                    to="/writing/block-the-save"
                  >
                    My write-up on enforcing accessibility
                  </Link>
                </div>
              )}
              {entry.title === "Campus Energy Dashboard" && (
                <div className="button-row" style={{ marginTop: "var(--space-lg)" }}>
                  <Link
                    className="button button--secondary"
                    to="/projects/campus-energy-dashboard"
                  >
                    The Campus Energy Dashboard
                  </Link>
                </div>
              )}
            </CvEntry>
          ))}
        </ul>
      </Section>

      <Pager
        prev={prev && { label: prev.label, path: prev.path }}
        next={next && { label: next.label, path: next.path }}
      />
    </Page>
  );
}
