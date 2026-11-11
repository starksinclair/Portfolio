import { FiDownload } from "react-icons/fi";
import { Page, Section } from "../components/Page";
import { Pager } from "../components/Pager";
import { profile } from "../data/profile";
import { cvMeta, cvSections, researchInterests } from "../data/cv";
import { CvEntry } from "../components/CvEntry";
import { adjacent } from "../nav";

const toc = [
  { id: "interests", label: "Research interests" },
  ...cvSections.map((s) => ({ id: s.id, label: s.title })),
];

export function Cv() {
  const { prev, next } = adjacent("/cv");
  const crumbs = [
    { name: "Overview", path: "/" },
    { name: "CV", path: "/cv" },
  ];

  return (
    <Page
      eyebrow="Record"
      title="Curriculum vitae"
      description="Education, publications, research, professional experience, ventures and technical skills. The same content as the PDF, as real text."
      path="/cv"
      toc={toc}
      crumbs={crumbs}
      aside={
        <div className="button-row" style={{ marginTop: "var(--space-lg)" }}>
          <a className="button button--primary" href={cvMeta.pdfPath} download>
            <FiDownload aria-hidden size={15} /> Download tagged PDF
          </a>
          <a className="button button--secondary" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </div>
      }
    >
      <Section id="interests" title="Research interests">
        <div className="prose">
          <p>{researchInterests}</p>
        </div>
      </Section>

      {cvSections.map((section) => {
        /* A section that is one list does not repeat its own title inside it. */
        const bare =
          section.entries.length === 1 && section.entries[0].title === section.title;
        return (
          <Section id={section.id} title={section.title} key={section.id}>
            {section.intro && (
              <div className="prose">
                <p>{section.intro}</p>
              </div>
            )}
            <ul className="entry-list">
              {section.entries.map((entry) => (
                <CvEntry key={entry.title} entry={entry} heading={!bare} />
              ))}
            </ul>
          </Section>
        );
      })}

      <Pager
        prev={prev && { label: prev.label, path: prev.path }}
        next={next && { label: next.label, path: next.path }}
      />
    </Page>
  );
}
