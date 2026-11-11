import { Page, Section } from "../components/Page";

const toc = [
  { id: "why-tyrian", label: "Why Tyrian purple" },
  { id: "colour", label: "Colour" },
];

const swatches = [
  { token: "--tyrian-anchor", hex: "#66023C", note: "Anchor. Wordmark only." },
  { token: "--tyrian-700", hex: "#7F014B", note: "Links on light. 10.46:1." },
  { token: "--tyrian-600", hex: "#9E1B62", note: "Focus ring on light. 7.20:1." },
  { token: "--tyrian-300", hex: "#F09EC0", note: "Links on dark. 9.59:1." },
  { token: "--ink-900", hex: "#1F1A1C", note: "Body text on light. 16.41:1." },
  { token: "--ink-200", hex: "#E9E4E5", note: "Body text on dark. 15.45:1." },
];

/** The design decisions, documented, which is the only honest format for a site
 *  that claims to be a documentation site. */
export function Colophon() {
  return (
    <Page
      eyebrow="Meta"
      title="Colophon"
      description="How this site is put together."
      path="/colophon"
      toc={toc}
      crumbs={[
        { name: "Overview", path: "/" },
        { name: "Colophon", path: "/colophon" },
      ]}
    >
      <div className="prose">
        <p>
          The theme statement is <strong>precise, candid, field manual</strong>. It is
          meant to be usable as a veto: it is why there is no animated hero, no
          carousel, and no skills section with percentage bars.
        </p>
      </div>

      <Section id="why-tyrian" title="Why Tyrian purple">
        <div className="prose">
          <p>
            Tyrian purple was the rarest colour in the ancient world. It was extracted
            from murex sea snails, thousands of them for a single garment, and it cost
            more by weight than gold. Rome eventually wrote the scarcity into law:
            wearing it without rank was a crime. No other dye held its colour the way
            it did, and none was harder to get.
          </p>
          <p>
            I chose it because of what it meant, not because of how it looks. I see
            myself as a rare person. Where I come from, what I have built so far, and
            what I am still trying to accomplish do not line up with any path I can
            point at and copy. This colour is the closest thing to a claim I am
            willing to make about that, and it is a quiet one: it sits under the links
            and in the wordmark, and nowhere else.
          </p>
        </div>
      </Section>

      <Section id="colour" title="Colour">
        <div className="prose">
          <p>
            Everything is generated at OKLCH hue 353.6, the hue of{" "}
            <code>#66023C</code>. The neutrals share that hue at very low chroma, so
            they read as faintly plum and the page feels like one material rather than
            an accent dropped onto grey.
          </p>
        </div>
        <table>
          <caption className="visually-hidden">
            Key colour tokens with contrast ratios
          </caption>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Value</th>
              <th scope="col">Use</th>
            </tr>
          </thead>
          <tbody>
            {swatches.map((s) => (
              <tr key={s.token}>
                <td>
                  <span
                    aria-hidden="true"
                    style={{
                      display: "inline-block",
                      width: "0.8rem",
                      height: "0.8rem",
                      background: s.hex,
                      border: "1px solid var(--rule-strong)",
                      borderRadius: "2px",
                      marginRight: "0.4rem",
                      verticalAlign: "-1px",
                    }}
                  />
                  <code>{s.token}</code>
                </td>
                <td>
                  <code>{s.hex}</code>
                </td>
                <td>{s.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div role="note" className="callout">
          <span className="callout__label">Accessibility</span>
          Every foreground and background pair in the palette was checked against WCAG
          2.1 and passes AA for text. Status is never carried by colour alone: every
          badge also has a text label.
        </div>
      </Section>
    </Page>
  );
}
