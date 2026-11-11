import { Link } from "react-router-dom";
import { Page, Section } from "../components/Page";
import { Pager } from "../components/Pager";
import { profile, skills, languages, activities } from "../data/profile";
import { adjacent } from "../nav";

const toc = [
  { id: "background", label: "Background" },
  { id: "stack", label: "What I work with" },
  { id: "beyond", label: "Beyond the keyboard" },
];

export function About() {
  const { prev, next } = adjacent("/about");


  return (
    <Page
      eyebrow="Introduction"
      title="About"
      description="Where I come from, what I work on, and the conviction underneath both."
      path="/about"
      toc={toc}
      crumbs={[
        { name: "Overview", path: "/" },
        { name: "About", path: "/about" },
      ]}
    >
      <Section id="background" title="Background">
        <div className="prose">
          {profile.longBio.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* The one statistic above belongs to someone else, so it is cited. */}
        <p className="cv-note">
          <strong>Source: </strong>
          Anukriti Kumar and Lucy Lu Wang,{" "}
          <a
            href="https://arxiv.org/abs/2410.03022"
            target="_blank"
            rel="noopener noreferrer"
          >
            Uncovering the New Accessibility Crisis in Scholarly PDFs
          </a>
          , ASSETS 2024.
        </p>
      </Section>

      <Section id="stack" title="What I work with">
        <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
          Grouped, not ranked. A percentage next to a language name would be invented
          precision. What these actually mean is visible in{" "}
          <Link to="/projects">the projects</Link>.
        </p>
        <div className="skill-grid">
          {skills.map((group) => (
            <div key={group.group}>
              <h3 className="skill-group__title">{group.group}</h3>
              <ul className="tech-list">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="beyond" title="Beyond the keyboard">
        <ul className="entry-list">
          {activities.map((a) => (
            <li key={`${a.organization}-${a.role}`}>
              <div className="entry__head">
                <div>
                  <div className="entry__role">{a.role}</div>
                  <div className="entry__org">{a.organization}</div>
                </div>
                <div className="entry__period">{a.period}</div>
              </div>
              {a.note && <div className="entry__points">{a.note}</div>}
            </li>
          ))}
        </ul>

        <dl className="meta-table" style={{ marginTop: "var(--space-lg)" }}>
          <div>
            <dt>Languages</dt>
            <dd>{languages.map((l) => `${l.name} (${l.level.toLowerCase()})`).join(", ")}</dd>
          </div>
          <div>
            <dt>Based in</dt>
            <dd>
              {profile.location.city}, {profile.location.region},{" "}
              {profile.location.countryName}
            </dd>
          </div>
          <div>
            <dt>From</dt>
            <dd>
              {profile.hometown.city}, {profile.hometown.region},{" "}
              {profile.hometown.countryName}
            </dd>
          </div>
        </dl>
      </Section>

      <Pager
        prev={prev && { label: prev.label, path: prev.path }}
        next={next && { label: next.label, path: next.path }}
      />
    </Page>
  );
}
