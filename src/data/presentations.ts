/**
 * Talks: given, and scheduled.
 *
 * A presentation is a thing that happened in a room on a date, so each entry
 * records the event and audience, not just the file. `slug` is a public URL and
 * appears in the sitemap and in schema.org `@id` values; keep it stable.
 *
 * The deck itself is never rebuilt here. Self-contained decks live in
 * `public/decks/` and are served exactly as they were presented, which is the
 * only honest way to show a talk: a retyped deck is a different deck. The site
 * frames it, links it and describes it, and the frame is the part that follows
 * the site's design, not the slides.
 */

export type PresentationStatus = "upcoming" | "delivered";

export interface Handout {
  /** Path under `public/`. */
  href: string;
  title: string;
  /** What it is and what it is for, one line. */
  description: string;
  pages: number;
}

export interface Presentation {
  slug: string;
  title: string;
  /** One sentence. Listings, meta description, schema.org `description`. */
  description: string;
  /** The series or occasion: "Corps Conversation", "Guest lecture". */
  series: string;
  /** Who it was for. */
  audience: string;
  venue: string;
  /** ISO 8601, the date it is or was given. */
  date: string;
  /** Local time, as announced. Omitted once a talk is past. */
  time?: string;
  durationMinutes: number;
  status: PresentationStatus;
  /**
   * How the talk is published.
   *
   * `deck` is a self-contained HTML deck under `public/decks/`, served at its
   * own URL so it can be opened straight into a projector. `pdf` and `images`
   * exist because not every talk will have been built this way; add the
   * rendering for one when the first talk needs it.
   */
  media:
    | { kind: "deck"; href: string; slides: number; aspect: "16:9" | "4:3" }
    | { kind: "pdf"; href: string; pages: number }
    | { kind: "images"; sources: { src: string; alt: string }[] };
  /** What someone should leave knowing. */
  takeaways: string[];
  handouts?: Handout[];
  /** Longer framing, shown above the deck. */
  body: string[];
  tags: string[];
}

export const presentations: Presentation[] = [
  {
    slug: "ask-better-questions",
    title: "Ask better questions. Build the right thing.",
    description:
      "A Corps Conversation on requirements elicitation: why student teams build the wrong thing, what the research says about the mistakes they make, and how to run an interview that produces understanding rather than a filled-in form.",
    series: "Corps Conversation",
    audience: "Ball State Digital Corps",
    venue: "Ball State University, Muncie, Indiana",
    date: "2026-11-13",
    time: "3:00 PM",
    durationMinutes: 50,
    status: "upcoming",
    media: {
      kind: "deck",
      href: "/decks/ask-better-questions",
      slides: 18,
      aspect: "16:9",
    },
    takeaways: [
      "A requirement is a property the product must have, not a feature someone named.",
      "The mistakes student teams make at intake are documented and repeatable, which means they are avoidable.",
      "Who you are asking changes the question. There is no list that survives contact with a different stakeholder.",
      "Write down the question you asked, not just the answer you got.",
    ],
    handouts: [
      {
        href: "/decks/ask-better-questions/stakeholder-cards.pdf",
        title: "Stakeholder cards",
        description: "The role each participant plays in the Interview Lab, one card per person.",
        pages: 5,
      },
      {
        href: "/decks/ask-better-questions/analyst-scenario-cards.pdf",
        title: "Analyst scenario cards",
        description: "The brief the interviewing pair works from, deliberately underspecified.",
        pages: 5,
      },
      {
        href: "/decks/ask-better-questions/elicitation-worksheet.pdf",
        title: "Elicitation worksheet",
        description: "Where the pair records the questions they asked, not only the answers.",
        pages: 2,
      },
    ],
    body: [
      "Most of the projects I have watched go wrong did not go wrong in the build. They went wrong at intake, in the twenty minutes where everyone agreed what was being made and nobody wrote down what was actually said.",
      "This session is half argument and half practice. The first part is the case that requirements elicitation is a skill with a literature behind it: there is published work on the mistakes student teams make in their first client interviews, and the mistakes are specific, countable and familiar. The second part is the Interview Lab, where teams run an intake interview from a scenario card and have to produce the questions they asked.",
      "The deck is built to be presented, so it is published as it runs: arrow keys or click to advance, F for full screen, and the activity timer on the Interview Lab slide is live.",
    ],
    tags: ["Requirements", "Digital Corps", "Workshop"],
  },
];

export const presentationsNewestFirst = [...presentations].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export function presentationBySlug(slug: string): Presentation | undefined {
  return presentations.find((p) => p.slug === slug);
}
