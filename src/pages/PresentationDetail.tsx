import { useParams } from "react-router-dom";
import { FiExternalLink, FiDownload } from "react-icons/fi";
import { Page, Section } from "../components/Page";
import { Pager } from "../components/Pager";
import { Badge } from "../components/Badge";
import { Deck, DeckControls } from "../components/Deck";
import { presentations, presentationBySlug } from "../data/presentations";
import { formatDate } from "../lib/format";
import { NotFound } from "./NotFound";

export function PresentationDetail() {
  const { slug = "" } = useParams();
  const talk = presentationBySlug(slug);

  if (!talk) {
    return (
      <NotFound what="presentation" backLabel="All presentations" backPath="/presentations" />
    );
  }

  const index = presentations.findIndex((p) => p.slug === slug);
  const prev = presentations[index - 1];
  const next = presentations[index + 1];

  const crumbs = [
    { name: "Overview", path: "/" },
    { name: "Presentations", path: "/presentations" },
    { name: talk.title, path: `/presentations/${talk.slug}` },
  ];

  const toc = [
    { id: "slides", label: "Slides" },
    { id: "takeaways", label: "What you leave with" },
    ...(talk.handouts?.length ? [{ id: "handouts", label: "Handouts" }] : []),
  ];

  const deckHref = talk.media.kind === "images" ? undefined : talk.media.href;

  return (
    <Page
      eyebrow={talk.series}
      title={talk.title}
      description={talk.description}
      path={`/presentations/${talk.slug}`}
      toc={toc}
      crumbs={crumbs}
      aside={
        <>
          <dl className="meta-table" style={{ marginTop: "var(--space-lg)" }}>
            <div>
              <dt>Date</dt>
              <dd>
                <time dateTime={talk.date}>{formatDate(talk.date)}</time>
                {talk.time ? `, ${talk.time}` : ""}
                {talk.status === "upcoming" && (
                  <>
                    {" "}
                    <Badge>Upcoming</Badge>
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt>For</dt>
              <dd>{talk.audience}</dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>{talk.venue}</dd>
            </div>
            <div>
              <dt>Length</dt>
              <dd>
                {talk.durationMinutes} minutes
                {talk.media.kind === "deck" ? `, ${talk.media.slides} slides` : ""}
              </dd>
            </div>
          </dl>
          {deckHref && (
            <div className="button-row">
              <a
                className="button button--primary"
                href={deckHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open the deck <FiExternalLink aria-hidden />
              </a>
            </div>
          )}
        </>
      }
    >
      <div className="prose">
        {talk.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <Section id="slides" title="Slides">
        <DeckControls presentation={talk} />
        <Deck presentation={talk} />
      </Section>

      <Section id="takeaways" title="What you leave with">
        <ul className="entry__points">
          {talk.takeaways.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </Section>

      {/* `?.length &&` would render a literal 0 for a talk with an empty list. */}
      {!!talk.handouts?.length && (
        <Section id="handouts" title="Handouts">
          <p className="cv-note">
            Printed for the activity. They are here so anyone running the session again does not
            have to rebuild them.
          </p>
          <ul className="index-list">
            {talk.handouts.map((h) => (
              <li key={h.href}>
                <a className="index-row" href={h.href} target="_blank" rel="noopener noreferrer">
                  <span className="index-row__top">
                    <span className="index-row__title">
                      {h.title} <FiDownload aria-hidden />
                    </span>
                  </span>
                  <span className="index-row__summary">{h.description}</span>
                  <span className="index-row__meta">
                    <span>PDF</span>
                    <span aria-hidden>·</span>
                    <span>
                      {h.pages} page{h.pages === 1 ? "" : "s"}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Pager
        prev={prev && { label: prev.title, path: `/presentations/${prev.slug}` }}
        next={next && { label: next.title, path: `/presentations/${next.slug}` }}
      />
    </Page>
  );
}
