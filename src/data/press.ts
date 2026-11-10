/**
 * External record: things other people published.
 *
 * Nothing in this file is self-published. Each entry has a named outlet or
 * institution and a resolvable URL; see `docs/research.md` for how each was
 * verified. Do not add an entry that cannot be cited.
 */

export type MentionKind = "publication" | "news" | "university" | "award";

export interface Mention {
  id: string;
  kind: MentionKind;
  /** Neutral, descriptive title for the link, not necessarily the outlet's headline. */
  title: string;
  outlet: string;
  outletUrl?: string;
  /** ISO 8601. */
  date: string;
  url: string;
  /** Why this is on the site. */
  description: string;
  /** Verbatim, where a quote exists. Never paraphrased into quote marks. */
  quote?: string;
  /** Shown under the quote. */
  quoteAttribution?: string;
  /** For the publication entry. */
  citation?: {
    authors: string[];
    journal: string;
    volume: string;
    issue: string;
    articleNumber: string;
    year: string;
    doi: string;
    issn: string;
    datePublished: string;
    pages: string;
    /**
     * The author keywords as printed with the article. They are reused in three
     * places: the visible keyword row on `/research`, the `keywords` property of
     * the `ScholarlyArticle` node, and the `citation_keywords` meta tag that
     * Google Scholar's crawler reads. One list, so the three cannot disagree.
     */
    keywords: string[];
    /** Every address this paper lives at, for `sameAs` and for direct links. */
    journalUrl: string;
    pdfUrl: string;
    preprintUrl: string;
    scholarUrl: string;
  };
  /** Shown as a caveat when the source needs framing. */
  note?: string;
}

export const mentions: Mention[] = [
  {
    id: "forecasting-2026",
    kind: "publication",
    title:
      "NeuralProphet for Ordinal Time Series Forecasting: A Two-Stage Approach with Threshold Optimization",
    outlet: "Forecasting (MDPI)",
    outletUrl: "https://www.mdpi.com/journal/forecasting",
    date: "2026-11-07",
    url: "https://doi.org/10.3390/forecast8060105",
    description:
      "Peer-reviewed, open access. Many time series are recorded as ordered categories (air quality indices, energy load levels, drought severity), yet standard forecasting methods return continuous numbers. We fit NeuralProphet to the ordinal labels treated as continuous, which gives an interpretable decomposition into trend, seasonality and autoregressive components, then optimise ordered thresholds on a validation segment instead of rounding naively. It beats logistic and ordered-logit baselines at every horizon tested, and the threshold step helps most when the first stage is miscalibrated but still order-preserving. One of the three real series is electricity load in a Ball State University building.",
    citation: {
      authors: ["Yuna Han", "Amira Abdul-Rahim", "Sinclair Nzenwata", "Drew Lazar"],
      journal: "Forecasting",
      volume: "8",
      issue: "6",
      articleNumber: "105",
      year: "2026",
      doi: "10.3390/forecast8060105",
      issn: "2571-9394",
      datePublished: "2026-11-07",
      pages: "26",
      keywords: [
        "ordinal time series",
        "forecasting",
        "NeuralProphet",
        "air quality prediction",
        "threshold optimization",
        "time series decomposition",
      ],
      journalUrl: "https://www.mdpi.com/2571-9394/8/6/105",
      pdfUrl: "https://www.mdpi.com/2571-9394/8/6/105/pdf",
      preprintUrl: "https://www.preprints.org/manuscript/202610.0360",
      scholarUrl:
        "https://scholar.google.com/scholar_lookup?title=NeuralProphet+for+Ordinal+Time+Series+Forecasting%3A+A+Two-Stage+Approach+with+Threshold+Optimization&doi=10.3390%2Fforecast8060105",
    },
  },
  {
    id: "bsu-daily-news-sga-2026",
    kind: "news",
    title: "Approved to the Student Government Association At-Large Senate",
    outlet: "Ball State Daily News",
    outletUrl: "https://www.ballstatedailynews.com",
    date: "2026-02-19",
    url: "https://www.ballstatedailynews.com/article/student-government-association-expresses-its-devastation-and-frustration-for-self-inflicted-gunshot-incident-feb-15-20260219",
    description:
      "Reported by Landon Jones. The senate approved my At-Large application 22–4 with two abstentions. I stood because I wanted to understand how policy actually gets made inside SGA, and to represent students whose voices are not in the room.",
    quote:
      "I also wanted to represent students whose voices aren't here, like mine. I have a lot of complaints I want to make about all things. I'm looking for an avenue to bring those complaints to them.",
    quoteAttribution: "Ball State Daily News, 19 February 2026",
    note: "This article mainly covers SGA's response to a self-harm incident on campus. It is linked here as the source for the Senate appointment only.",
  },
  {
    id: "building-indiana-xtern-2026",
    kind: "news",
    title:
      "Second place in the Enter the Matrix track, TechPoint Xtern Challenge with Cummins",
    outlet: "Building Indiana",
    outletUrl: "https://buildingindiana.com",
    date: "2026-03-23",
    url: "https://buildingindiana.com/stories/techpoint-cummins-partner-to-provide-students-with-ai-work-based-learning-experience,76193",
    description:
      "TechPoint selected 100 students from more than 200 applicants and placed them in cross-university teams to work on enterprise AI problems written with Cummins. My team of five, drawn from Purdue and Ball State, built Marco, presented as Prescriptive Maintenance Dispatcher: a multi-agent work order system that reads machine data, diagnostics and service documentation so a field engineer knows what is wrong before arriving. We presented to Cummins judging panels in Columbus, Indiana on 6 March 2026 and took second in the Enter the Matrix track.",
    quote:
      "Team 10 took second place with Prescriptive Maintenance Dispatcher, a multi-agent work order intelligence system built to help field engineers diagnose issues earlier, arrive better prepared, and reduce costly repeat service trips.",
    quoteAttribution: "Building Indiana, 23 March 2026",
    note: "The article covers the whole challenge and every placing team, not me individually. It is linked here as the source for the second-place finish.",
  },
  {
    id: "bsu-daily-news-laundry-2026",
    kind: "news",
    title: "Co-authored SGA legislation to cut the cost of residential laundry",
    outlet: "Ball State Daily News",
    outletUrl: "https://www.ballstatedailynews.com",
    date: "2026-11-05",
    url: "https://www.ballstatedailynews.com/article/sga-proposes-legislation-to-reduce-the-cost-of-residential-laundry-services-20261105",
    description:
      "Reported by Jocelyne Hernandez. SRO-3, the Residential Laundry Cost Reduction Act, is the kind of thing I joined the senate to work on: a cost students carry quietly. Roughly seven dollars a week, about 120 dollars over a 30-week year, on machines that are overcrowded at peak hours and unevenly distributed between halls. The resolution asks University Housing for discounted cycles or reduced pricing in designated periods. I am one of ten authors.",
    quote:
      "Access to affordable and reliable laundry services is an important component to student well-being, health and academic success.",
    quoteAttribution: "SRO-3, quoted in the Ball State Daily News, 5 November 2026",
  },
  {
    id: "lewermark-2026",
    kind: "award",
    title: "LewerMark 'Make Your Mark' Spring 2026 Scholarship, for Access to Build",
    outlet: "LewerMark Student Insurance",
    outletUrl: "https://lewermark.com",
    date: "2026-06-04",
    url: "https://www.linkedin.com/posts/annamariebradford_internationaleducation-studentsuccess-activity-7468336727049433088-IPWh",
    description:
      "Announced by Ball State's international education office. Access to Build is an initiative to help young Nigerian innovators get the tools, mentorship and support to turn ideas into working things.",
    quote:
      "Sinclair designed 'Access to Build', an initiative focused on helping young Nigerian innovators access the tools, mentorship, and support needed to turn ideas into reality.",
    quoteAttribution: "Anna Bradford, Ball State University, 4 June 2026",
  },
  {
    id: "bsu-digital-corps-feature",
    kind: "university",
    title: "Featured on the Ball State Digital Corps recruitment page",
    outlet: "Ball State University",
    outletUrl: "https://www.bsu.edu",
    date: "2026-07-29",
    url: "https://www.bsu.edu/about/administrativeoffices/information-technology/services/the-digital-corps/join-our-team",
    description:
      "The Digital Corps uses this quote on the page it recruits new students with.",
    quote:
      "At Digital Corps, I didn't just learn to code. I built real platforms used by thousands of students and developed the mindset to create my own startups. It's been the defining experience of my time at Ball State.",
    quoteAttribution: "Ball State University, Digital Corps, Join Our Team",
  },
];

export const publications = mentions.filter((m) => m.kind === "publication");
export const coverage = mentions.filter((m) => m.kind !== "publication");

export const KIND_LABEL: Record<MentionKind, string> = {
  publication: "Peer-reviewed",
  news: "News",
  university: "University",
  award: "Award",
};
