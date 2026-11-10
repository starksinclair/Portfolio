import { Page, Section } from "../components/Page";
import { Pager } from "../components/Pager";
import { positions, education } from "../data/profile";
import { adjacent } from "../nav";

const toc = [
  { id: "employment", label: "Employment" },
  { id: "education", label: "Education" },
];

export function Experience() {
  const { prev, next } = adjacent("/experience");


  return (
    <Page
      eyebrow="Introduction"
      title="Experience"
      description="Where I have worked, and what I personally owned at each place."
      path="/experience"
      toc={toc}
      crumbs={[
        { name: "Overview", path: "/" },
        { name: "Experience", path: "/experience" },
      ]}
    >
      <Section id="employment" title="Employment">
        <ul className="entry-list">
          {positions.map((p) => (
            <li key={`${p.organization}-${p.startDate}`}>
              <div className="entry__head">
                <div>
                  <div className="entry__role">{p.role}</div>
                  <div className="entry__org">
                    {p.organizationUrl ? (
                      <a href={p.organizationUrl} target="_blank" rel="noopener noreferrer">
                        {p.organization}
                      </a>
                    ) : (
                      p.organization
                    )}{" "}
                    · {p.location}
                  </div>
                </div>
                <div className="entry__period">{p.period}</div>
              </div>
              <ul className="entry__points">
                {p.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="education" title="Education">
        <ul className="entry-list">
          {education.map((e) => (
            <li key={e.credential}>
              <div className="entry__head">
                <div>
                  <div className="entry__role">{e.credential}</div>
                  <div className="entry__org">
                    {e.institutionUrl ? (
                      <a href={e.institutionUrl} target="_blank" rel="noopener noreferrer">
                        {e.institution}
                      </a>
                    ) : (
                      e.institution
                    )}{" "}
                    · {e.location}
                  </div>
                </div>
                <div className="entry__period">{e.period}</div>
              </div>
              <ul className="entry__points">
                {e.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </li>
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
