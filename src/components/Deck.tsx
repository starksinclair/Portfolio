import { useEffect, useRef, useState } from "react";
import type { Presentation } from "../data/presentations";

/** The size a self-contained deck is authored against. */
const STAGE = { width: 1280, height: 720 };

/**
 * Shows a talk's slides inside the page.
 *
 * A self-contained deck is framed, not reimplemented. It runs in an iframe at
 * its own size, which keeps the thing on screen identical to the thing that was
 * projected: its own fonts, its own colours, its own interactions. Rebuilding a
 * deck in this site's components would quietly make it a different deck, and a
 * record of a talk that differs from the talk is not a record.
 *
 * The iframe is given the full 1280x720 viewport the deck expects and the
 * *frame* is scaled down to fit, rather than handing the deck a small window
 * and trusting it to cope. Decks size themselves against `window.innerWidth`,
 * which inside an iframe is the iframe; this one lays out a fixed stage and
 * centres it, so in a narrower window the stage overflows and the half that
 * overflows is clipped away. Scaling the frame means the deck always believes
 * it is on a projector, which is the only assumption it was built with.
 */
export function Deck({ presentation }: { presentation: Presentation }) {
  const { media, title } = presentation;
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || media.kind !== "deck") return;

    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / STAGE.width);
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, [media.kind]);

  if (media.kind === "images") {
    return (
      <ul className="deck-images">
        {media.sources.map((img) => (
          <li key={img.src}>
            <img src={img.src} alt={img.alt} loading="lazy" />
          </li>
        ))}
      </ul>
    );
  }

  if (media.kind === "pdf") {
    return (
      <figure className="deck deck--pdf">
        <iframe className="deck__frame" src={media.href} title={`Slides: ${title}`} />
      </figure>
    );
  }

  const ratio = media.aspect === "4:3" ? "4 / 3" : "16 / 9";

  return (
    <figure className="deck" style={{ aspectRatio: ratio }} ref={hostRef}>
      {/* Until the first measurement the frame would be full size and overflow,
          so it is held back one frame rather than flashing oversized. */}
      {scale > 0 && (
        <iframe
          className="deck__stage"
          src={media.href}
          title={`Slides: ${title}`}
          width={STAGE.width}
          height={STAGE.height}
          style={{ transform: `scale(${scale})` }}
          loading="lazy"
        />
      )}
    </figure>
  );
}

/** The controls the deck itself listens for, stated rather than discovered. */
export function DeckControls({ presentation }: { presentation: Presentation }) {
  if (presentation.media.kind !== "deck") return null;
  return (
    <p className="cv-note">
      <strong>In the deck: </strong>
      arrow keys or click to move between slides, <kbd>F</kbd> for full screen,{" "}
      <kbd>Home</kbd> and <kbd>End</kbd> for the first and last. Adding{" "}
      <code>#s9</code> to the deck&rsquo;s address opens it at slide 9.
    </p>
  );
}
