/**
 * Writing.
 *
 * Posts are structured blocks rather than markdown strings so the site needs no
 * markdown runtime and every post is type-checked. Adding a post: append an entry
 * and keep `slug` stable. Slugs are public URLs and appear in the sitemap and in
 * schema.org `@id` values.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "code"; lang: string; code: string }
  | { type: "note"; text: string };

export interface Post {
  slug: string;
  title: string;
  /** One sentence. Used in listings, meta description and schema.org `description`. */
  description: string;
  /** ISO 8601. */
  datePublished: string;
  /** ISO 8601, when edited after publication. */
  dateModified?: string;
  tags: string[];
  /** Reading time in minutes, rounded. */
  readingMinutes: number;
  /** Slug of a related project, when the post came out of one. */
  relatedProject?: string;
  body: Block[];
}

export const posts: Post[] = [
  {
    slug: "thresholds-beat-rounding",
    title: "Thresholds beat rounding",
    description:
      "Air quality indices and energy load levels are ordered categories, but forecasting tools return continuous numbers. Rounding the forecast throws away the one thing you can still fix.",
    datePublished: "2026-11-08",
    tags: ["Research", "Forecasting", "Machine learning"],
    readingMinutes: 6,
    body: [
      {
        type: "p",
        text: "A lot of the series people actually act on are not numbers. They are ordered categories. Air quality is Good, Moderate, Unhealthy for Sensitive Groups, and so on. Drought severity is D0 through D4. Building energy load gets bucketed into levels because that is what the operational decision needs. The categories are ordered, the gaps between them are not equal, and nobody promises that the distance from Moderate to Unhealthy means the same thing as the distance from Good to Moderate.",
      },
      {
        type: "p",
        text: "Standard forecasting tools do not produce categories. They produce a continuous number. So the usual move is to forecast the number and round it to the nearest category, and that is where accuracy quietly leaks away.",
      },
      { type: "h2", text: "What rounding assumes" },
      {
        type: "p",
        text: "Rounding to the nearest integer puts the boundary between category 2 and category 3 at exactly 2.5. That is a claim, not a neutral default. It says the model is calibrated, so that when the model outputs 2.5 the true category really is on the knife edge. Forecasting models are frequently not calibrated like that. They are often biased in a way that is consistent: the ordering is right, but the whole surface is shifted or compressed. Trend shifts and evolving seasonality both do this.",
      },
      {
        type: "p",
        text: "That is a useful failure. If a model preserves order but gets the level wrong, the ordering carries all the information you need and only the cut points are wrong. Cut points are cheap to fix.",
      },
      { type: "h2", text: "The two stages" },
      {
        type: "ol",
        items: [
          "Fit NeuralProphet to the ordinal labels treated as continuous. You get a continuous forecast and, because that is what NeuralProphet does, an interpretable decomposition into trend, seasonality and autoregressive components.",
          "Learn the thresholds that map that continuous forecast back to categories, by optimising them on a held-out validation segment instead of assuming 2.5.",
        ],
      },
      {
        type: "p",
        text: "The constraint that matters in stage two is that the thresholds stay ordered. You are fitting a monotone step function, not a free-form classifier, which keeps the number of parameters tiny and keeps the model honest about the ordinal structure.",
      },
      { type: "h2", text: "What the results looked like" },
      {
        type: "p",
        text: "We evaluated against simulations plus three real hourly series: Beijing air quality, electricity load in a Ball State University building, and U.S. Drought Monitor categories. Measured in quadratic weighted kappa, which penalises being wrong by two categories more than being wrong by one (the right metric when the categories are ordered):",
      },
      {
        type: "ul",
        items: [
          "In simulation, the method recovered the latent ordering and the generating components, and threshold optimisation beat rounding in every condition we tested.",
          "The gain was largest exactly where predicted: when the first stage was miscalibrated but order-preserving, as under trend shifts or evolving seasonality.",
          "On the real series it outperformed logistic and ordered-logit baselines at every horizon.",
          "Threshold optimisation beat rounding at every drought horizon and at all but the shortest Beijing horizon.",
        ],
      },
      {
        type: "p",
        text: "That shortest-horizon exception is the interesting one rather than an embarrassment. At a one-step horizon the first stage is already well calibrated, so there is nothing for the thresholds to correct and you are just spending validation data to rediscover 2.5.",
      },
      { type: "h2", text: "Why this is worth writing down" },
      {
        type: "p",
        text: "The appealing part is what it does not require. There is no specialised ordinal neural architecture here. You keep a well-understood, interpretable forecasting model, and you add a small monotone calibration step on top. You can still show someone the trend and seasonality components and explain why the forecast says what it says, which matters a great deal when the output drives an operational decision.",
      },
      {
        type: "p",
        text: "The general lesson I took from it: when a model is systematically wrong but consistently ordered, do not retrain it. Fix the mapping.",
      },
      {
        type: "note",
        text: "Full method, simulation design and results are in the paper: Han, Abdul-Rahim, Nzenwata and Lazar, Forecasting 8(6), 105, 2026. DOI 10.3390/forecast8060105. Open access.",
      },
    ],
  },
  {
    slug: "tenant-isolation-belongs-in-the-database",
    title: "Tenant isolation belongs in the database",
    description:
      "In a multi-tenant app, a forgotten WHERE clause is a data breach. Postgres row-level security turns that from a code-review problem into a thing the database refuses to do.",
    datePublished: "2026-10-12",
    tags: ["PostgreSQL", "Multi-tenancy", "Go", "Security"],
    readingMinutes: 7,
    relatedProject: "gatstogo",
    body: [
      {
        type: "p",
        text: "GatsToGo gives every LPG gas plant its own white-labelled customer site on shared infrastructure. One database, many plants. Each plant sees its own prices, staff, shifts, tickets and cash movements, and must never see anyone else's.",
      },
      {
        type: "p",
        text: "The obvious way to build that is to put the tenant in the query. Every handler takes a tenant ID and every query carries a WHERE tenant_id = $1. It works, right up until the day it does not, because the failure mode is a single forgotten clause in a single query and the symptom is one plant reading another plant's revenue.",
      },
      { type: "h2", text: "The thing I did not want to rely on" },
      {
        type: "p",
        text: "That design asks correctness of every query ever written, including the ones written in a hurry at the end of a long day, including the ad-hoc one someone runs during an incident. Code review is not a security boundary. I wanted a design where the unsafe version is not possible rather than merely discouraged.",
      },
      { type: "h2", text: "Pushing it down a layer" },
      {
        type: "p",
        text: "Postgres row-level security lets the database hold the policy. You enable RLS on a table, write a policy saying which rows the current session may see, and from then on the filter is applied whether or not the query asked for it. A SELECT with no WHERE clause returns only the current tenant's rows. The unsafe query stops being unsafe.",
      },
      {
        type: "code",
        lang: "sql",
        code: `ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON tickets
  USING (tenant_id = current_setting('app.tenant_id')::uuid);`,
      },
      {
        type: "p",
        text: "The session variable is set at the start of a transaction, which is what makes this safe under connection pooling. A pooled connection carries no tenant between transactions, so there is no state to leak into the next request.",
      },
      {
        type: "code",
        lang: "go",
        code: `// Every tenant-scoped read and write runs inside this.
// Nothing in the app gets a bare connection.
func WithTenant(ctx context.Context, pool *pgxpool.Pool, tenantID string,
    fn func(Querier) error) error {

    tx, err := pool.Begin(ctx)
    if err != nil {
        return err
    }
    defer tx.Rollback(ctx)

    // set_config with local=true scopes this to the transaction
    if _, err := tx.Exec(ctx,
        "SELECT set_config('app.tenant_id', $1, true)", tenantID); err != nil {
        return err
    }

    if err := fn(tx); err != nil {
        return err
    }
    return tx.Commit(ctx)
}`,
      },
      { type: "h2", text: "The part people miss: the role" },
      {
        type: "p",
        text: "RLS has one large hole. Policies do not apply to a table's owner, and they do not apply to a superuser. If your application connects as the role that created the schema, you have enabled RLS and changed nothing at all.",
      },
      {
        type: "p",
        text: "So the roles have to be split. GatsToGo has two:",
      },
      {
        type: "ul",
        items: [
          "gatstogo_app is what the application connects as. Owns nothing, is not a superuser, and is therefore subject to every policy.",
          "gatstogo_admin owns the schema, runs migrations, and can bypass policies. Used by migrations and by deliberate platform-level administration, never by a request handler.",
        ],
      },
      {
        type: "p",
        text: "Platform administration is the honest exception. Onboarding a new plant and changing a plant's status are cross-tenant by definition, so they run through the admin path, which is a small and separately authenticated surface rather than something every handler can reach.",
      },
      { type: "h2", text: "What it costs" },
      {
        type: "p",
        text: "It is not free, and pretending otherwise would be dishonest:",
      },
      {
        type: "ul",
        items: [
          "Every tenant-scoped query must run inside the transaction helper. Forgetting it does not leak data. It returns nothing, which is a loud and fast failure rather than a silent one.",
          "Policy predicates are part of the query plan, so tenant_id wants an index and composite indexes want it in the leading position.",
          "Debugging gets stranger. Rows that plainly exist are invisible in a session with no tenant set. Worth knowing before it costs an hour.",
        ],
      },
      {
        type: "p",
        text: "I will take all three. The failure mode of the WHERE-clause approach is a cross-tenant data leak. The failure mode of this one is an empty result set.",
      },
    ],
  },
  {
    slug: "do-not-let-the-model-file-the-report",
    title: "Do not let the model file the report",
    description:
      "Headway reads a photo of a blocked ramp and fills in the report. It does not submit it. Where you put the human is the whole design.",
    datePublished: "2026-09-02",
    tags: ["AI", "Accessibility", "Product"],
    readingMinutes: 5,
    relatedProject: "headway",
    body: [
      {
        type: "p",
        text: "Headway answers two questions for Ball State students who face mobility barriers: what is in my way, and something is wrong here, how does someone get told? The second one is where the AI is, and it is also where the AI has to be held back.",
      },
      {
        type: "p",
        text: "Reporting a barrier opens the camera first. You photograph the blocked ramp or the out-of-service elevator. The photo goes to a vision model, which returns a description and a category, and the form comes back prefilled.",
      },
      { type: "h2", text: "Then it stops" },
      {
        type: "p",
        text: "The form does not submit. It waits for the person to confirm or edit it. Auto-submitting would have been fewer taps and it was genuinely tempting, because the whole value of the camera-first flow is that reporting a barrier takes seconds while you are standing in front of it.",
      },
      {
        type: "p",
        text: "But look at what a report does. It shows up on other students' screens as a live warning. It routes people away from a corridor. It is a claim about physical reality that strangers will act on. A vision model can read a photo of a ramp and call it blocked when what it is seeing is a cleaning cart that will be gone in ten minutes. If the model files that unchallenged, the app has published a false claim in a disabled student's name, and the cost lands on the next person who takes a detour they did not need.",
      },
      {
        type: "p",
        text: "So the model drafts and the human signs. The AI does the tedious part, describing what is in the frame and picking a category. The person keeps the part only they can do, which is vouching for it.",
      },
      { type: "h2", text: "Nothing on the path may be load-bearing" },
      {
        type: "p",
        text: "The second rule followed from the first. If the model is an accelerator rather than a dependency, then nothing in the chain is allowed to be required:",
      },
      {
        type: "ul",
        items: [
          "Camera permission denied? The manual form works. It is not a degraded fallback screen, it is the same form.",
          "Photo optional entirely. A report with no image is still a valid report.",
          "Vision analysis fails or times out? Submission is unaffected. You get an empty form instead of a prefilled one.",
          "The thumbs up/down on the AI summary is optional, and it is only stored when analysis actually ran.",
        ],
      },
      {
        type: "p",
        text: "An accessibility tool that stops working when a third-party model is down is not an accessibility tool. The feature it is replacing, a person typing a sentence, has to remain intact underneath.",
      },
      { type: "h2", text: "The same logic on the way out" },
      {
        type: "p",
        text: "Resolution needed the same treatment from the other direction. If one tap could clear a report, one careless or malicious tap could erase a real barrier and send someone into it. So marking a report resolved takes three independent confirmations plus an anti-spam fingerprint. Creating a warning is cheap and reversible; removing one is not.",
      },
      {
        type: "p",
        text: "The voice assistant works the same way. It replies in speech, but it also emits JSON actions, which the app parses out and strips from what gets spoken before routing you or opening a modal. The model proposes the action. The app decides whether that action is one it knows how to take.",
      },
      {
        type: "p",
        text: "None of this is a position on AI in general. It is a question I now ask of every feature: if the model is confidently wrong here, who absorbs it? When the answer is someone other than the user who invoked it, the model drafts and a human signs.",
      },
    ],
  },
  {
    slug: "block-the-save",
    title: "Block the save",
    description:
      "Every accessibility checker tells you what you got wrong after you are finished. My CS 499 research asks what happens if the tool refuses to let you finish.",
    datePublished: "2026-10-28",
    tags: ["Accessibility", "Research", "WCAG"],
    readingMinutes: 5,
    relatedProject: "accessibility-docs",
    body: [
      {
        type: "p",
        text: "The standard accessibility workflow for a document is: write the whole thing, run a checker, get a list of problems, fix some of them. That ordering is the problem. By the time the checker runs, the document is done, the deadline is close, and the fixes are retroactive chores. Alt text written at that point is written to clear a warning, not to describe an image to someone.",
      },
      {
        type: "p",
        text: "My CS 499 research question is whether moving the constraint earlier changes the output. Specifically: does enforcing alt text, heading structure and reading order as structural rules at authoring time produce scholarly documents with higher WCAG 2.2 Level AA conformance than documents written in Microsoft Word and exported as PDF?",
      },
      { type: "h2", text: "Two tools, one rules engine" },
      {
        type: "p",
        text: "To test that, I needed to compare checking against enforcing, which means both have to judge documents identically. If the checker and the authoring tool ran different rules, any difference in the results would be the rules, not the timing.",
      },
      {
        type: "ul",
        items: [
          "The checker is a Google Docs add-on. It audits a document you have already written and lists issues in a sidebar. This is the conventional workflow, as a baseline.",
          "The author is a browser editor. You write, style text and insert images, and Save is blocked while any error-severity rule fails. There is no override.",
        ],
      },
      {
        type: "p",
        text: "Both convert the document into the same DocumentModel and run the same checks from the same shared package. A Google Doc, the editor's state, and a saved .a11ydoc.json file all parse into that one model, so there is exactly one definition of conformant and it cannot drift between tools.",
      },
      { type: "h2", text: "What blocking the save forces" },
      {
        type: "p",
        text: "The interesting consequence is not that errors get fixed. It is when they get fixed. You insert an image and you cannot continue until it has alt text, so you write the alt text while you still remember why you chose that image. You cannot skip from a heading level two to a heading level four, so the document's outline is built as you go instead of being imposed afterwards.",
      },
      {
        type: "p",
        text: "That is also why reading order had to be modelled explicitly rather than inferred from visual styling. In most editors reading order is emergent, a consequence of where things ended up on the page, which makes it something you can only audit and never author. If you want to enforce it, the model has to represent it as a first-class property.",
      },
      { type: "h2", text: "The obvious objection" },
      {
        type: "p",
        text: "A tool that refuses to save is a tool people route around. That is a real risk and it is why severity is split: only error-severity rules block, and advisory findings stay advisory. Draw that line wrong and you have built something nobody will use twice, which is a result too, just not the one I am hoping for.",
      },
      {
        type: "p",
        text: "Both tools are up and usable now, which is the point at which a research prototype starts producing data instead of opinions.",
      },
    ],
  },
];

export function postBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export const postsNewestFirst = [...posts].sort((a, b) =>
  b.datePublished.localeCompare(a.datePublished),
);

export const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
