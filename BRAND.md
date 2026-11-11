# Brand Guidelines: Sinclair Nzenwata

> Derived with `/creative` (Brand Architect → Palette Architect → Typography Director → Layout
> Strategist). Maturity at time of writing: **L0, greenfield**, with no prior design language documented.
> This file is the design language. Change it here first, then in `src/styles/tokens.css`.

---

## 1. Design read

| | |
|---|---|
| **What this is** | A personal reference site: who Sinclair is, what he has built, what has been written about him. |
| **Audience** | Engineering hiring managers, academic collaborators, founders and clients evaluating competence quickly. |
| **Register** | Technical competence over warmth. This audience reads neutrality as reliability. |
| **Format** | A documentation site, not a marketing page. Sidebar, stable URLs, scannable prose, no hero theatre. |

**Dials:** Creativity = Safe · Density = Balanced · Variance = Uniform · Motion = Static.

Motion is pinned to Static by an accessibility constraint, not by taste: Sinclair's own research work
(`accessibility-docs`, CS 499) is about WCAG conformance. A site that animates aggressively while its
author publishes accessibility tooling fails the promise-vs-product-truth test.

---

## 2. Practice philosophy

**Point-of-view-first.** The brand is an argument, not a decoration.

The argument, drawn from his own words: *systems that are poorly built cost money, and AI that sounds
impressive but does not work is worth nothing.* Everything on the site must earn its place against
that claim. Hence a documentation format, where every assertion sits next to its evidence: a repo, a
DOI, a named employer, a named newspaper.

**Archetype:** Sage primary, Creator secondary. Sage sets the register (restrained, editorial,
evidence-first). Creator earns the one place where the palette is allowed to be loud: the project
index.

**Identity-system type:** Static/monolithic. One wordmark, one palette, one grid, everywhere. A
one-person brand does not have the surface area to govern a flexible system, and inconsistency would
read as carelessness.

---

## 3. Theme statement

> ### precise, candid, field manual

Three adjectives maximum, and the noun names the world: a field manual. Typeset for reading, ordered
for lookup, no ornament, authoritative because it is specific.

**The statement is usable as a veto.** These are rejected *by the statement*, not by preference:

- A full-bleed animated hero. A field manual has no cover art.
- "Passionate about leveraging cutting-edge technologies". Not candid, not precise.
- A skills section with percentage bars. Invented precision is the opposite of precise.
- Carousels, parallax, scroll-jacking. Ornament.
- Gradients of any kind, frosted-glass translucency, backdrop blur. A printed manual has one
  flat surface. Colour changes in steps, never in a ramp across a surface.
- Three competing display faces. A manual has one voice.

---

## 4. Palette

Anchor: **Tyrian purple `#66023C`** → `oklch(0.3354 0.1363 353.56)`.

### Why this colour

Tyrian purple was the rarest colour in the ancient world. It was extracted from murex sea snails,
thousands of them per garment, and cost more by weight than gold. Rome wrote the scarcity into law
and made wearing it without rank a crime.

Sinclair chose it for that meaning, in his own words: *"I see myself as a rare individual in
society, based on my experience, what I have done, and what I am trying to accomplish."* The colour
is the argument, so it is used sparingly. A claim made quietly is credible; the same claim shouted
across a page is not. That is why Tyrian appears only in links, the active sidebar marker, the
wordmark, section rules and filled actions, and never as a large background fill.

Secondary benefit, not the reason: it is a deep red-violet, not the blue-violet "AI purple" that
saturates every 2026 AI landing page. Every ramp below is generated at hue **353.6**, so the
neutrals are faintly plum rather than dead grey and the whole page feels like one material.

### 4.1 Brand ramp: `--tyrian-*`

| Token | Hex | OKLCH | vs white | vs `#100C0D` |
|---|---|---|---|---|
| `tyrian-50` | `#FEF4F7` | `oklch(0.975 0.012 353.6)` | 1.08 | 18.33 |
| `tyrian-100` | `#FEE5EE` | `oklch(0.945 0.030 353.6)` | 1.19 | 16.60 |
| `tyrian-200` | `#FBC6DB` | `oklch(0.880 0.065 353.6)` | 1.48 | 13.35 |
| `tyrian-300` | `#F09EC0` | `oklch(0.790 0.105 353.6)` | 2.03 | **9.74** |
| `tyrian-400` | `#D9719F` | `oklch(0.680 0.140 353.6)` | 3.08 | 6.40 |
| `tyrian-500` | `#BD447F` | `oklch(0.570 0.165 353.6)` | 4.89 | 4.04 |
| `tyrian-600` | `#9E1B62` | `oklch(0.470 0.175 353.6)` | **7.54** | 2.62 |
| `tyrian-700` | `#7F014B` | `oklch(0.390 0.160 353.6)` | **10.46** | 1.89 |
| `tyrian-800` | `#5C0035` | `oklch(0.310 0.130 353.6)` | 13.94 | 1.42 |
| `tyrian-900` | `#400124` | `oklch(0.245 0.100 353.6)` | 16.83 | 1.17 |
| `tyrian-950` | `#280215` | `oklch(0.185 0.070 353.6)` | 18.92 | 1.04 |

The anchor itself sits between `800` and `700`. It is kept as `--tyrian-anchor` for the wordmark and
for any printed or exported asset, so the one historically meaningful value is never lost to a ramp.

### 4.2 Neutral ramp: `--ink-*`

| Token | Hex | OKLCH | vs white | vs `#100C0D` |
|---|---|---|---|---|
| `ink-50` | `#FCF9FA` | `oklch(0.985 0.003 353.6)` | 1.05 | 18.86 |
| `ink-100` | `#F5F1F2` | `oklch(0.962 0.004 353.6)` | 1.12 | 17.62 |
| `ink-200` | `#E9E4E5` | `oklch(0.922 0.006 353.6)` | 1.26 | **15.69** |
| `ink-300` | `#D5CFD1` | `oklch(0.860 0.008 353.6)` | 1.54 | 12.85 |
| `ink-400` | `#B0A8AB` | `oklch(0.740 0.010 353.6)` | 2.32 | **8.49** |
| `ink-500` | `#8C8387` | `oklch(0.620 0.012 353.6)` | 3.68 | 5.37 |
| `ink-600` | `#6C6366` | `oklch(0.510 0.012 353.6)` | **5.81** | 3.40 |
| `ink-700` | `#50484B` | `oklch(0.410 0.011 353.6)` | 8.86 | 2.23 |
| `ink-800` | `#352E31` | `oklch(0.310 0.010 353.6)` | 13.24 | 1.49 |
| `ink-900` | `#1F1A1C` | `oklch(0.225 0.009 353.6)` | **17.17** | 1.15 |
| `ink-950` | `#100C0D` | `oklch(0.160 0.008 353.6)` | 19.44 | 1.02 |

### 4.3 Semantic

Hues are deliberately pushed clear of the brand's 353.6 so a danger state never reads as decoration.

| Role | Hue | Light text | Ratio | Dark text | Ratio | Surface L | Surface D |
|---|---|---|---|---|---|---|---|
| success | 145 | `#176D23` | 6.18 | `#92D094` | 10.80 | `#E5F6E5` | `#0D270F` |
| warning | 75 | `#854C00` | 6.62 | `#E5B46E` | 10.26 | `#FCEEDC` | `#2F1C00` |
| danger | 27 | `#98342E` | 7.00 | `#FAA399` | 9.96 | `#FFEAE6` | `#361512` |
| info | 250 | `#005DA3` | 6.49 | `#89C3FF` | 10.47 | `#E3F2FF` | `#082239` |

Colourblind safety: success and danger differ in hue *and* are never the sole carrier of meaning.
Every status also carries a text label. No red/green-only distinction exists anywhere in the UI.

Both muted levels carry real text, so both are held to 4.5:1 against *every* light surface, the
sunken one included, not only against the page background. `ink-500` is a light-mode text colour
nowhere on the site: at 3.68:1 it fails, and it is kept for list markers and hairlines only.

### 4.4 Role assignments

| Role | Light | Dark |
|---|---|---|
| page background | `ink-50` | `ink-950` |
| raised surface | `#FFFFFF` | `ink-900` |
| body text | `ink-900` | `ink-200` |
| muted / metadata | `ink-700` (7.91:1 worst case) | `ink-400` |
| faint / labels | `ink-600` (5.19:1 worst case) | `ink-500` |
| hairline rule | `ink-200` | `ink-800` |
| link, rest | `tyrian-700` | `tyrian-300` |
| link, hover | `tyrian-600` | `tyrian-200` |
| link, visited | `tyrian-800` | `tyrian-400` |
| focus ring | `tyrian-600` (7.20:1) | `tyrian-300` (9.59:1) |
| filled action | bg `tyrian-800`, text white (13.94) | bg `tyrian-300`, text `tyrian-950` |
| disabled | `ink-400` text on `ink-100`, plus `aria-disabled` | `ink-600` on `ink-900` |

**Where brand colour may not go:** body text, long-form prose, large background fills, or any state
that means "something is wrong". Tyrian is for links, the active sidebar marker, the wordmark, rules
under section headings, and filled actions. Nothing else. Disabled states are reduced-chroma
colours, never opacity dropped onto text.

---

## 5. Typography

Three faces, three disjoint jobs. None of them is decorative.

| Role | Face | Why | Fallback |
|---|---|---|---|
| UI, headings, nav | **Inter** (Google Fonts, OFL, variable) | Neo-grotesque workhorse, tall x-height, the de facto open UI standard. Carries no opinion, which is the point; the opinion is in the words. | `-apple-system, "Segoe UI", system-ui, sans-serif` |
| Long-form prose | **Newsreader** (Google Fonts, OFL, optical sizes) | Real optical sizing for sustained reading. This is what makes the site read as a manual rather than a product page. | `Iowan Old Style, Charter, Georgia, serif` |
| Code, metadata, labels | **JetBrains Mono** (Google Fonts, OFL) | Technical credibility, built-by-engineers signal, and genuinely good at small sizes. | `Menlo, Consolas, monospace` |

Caveats carried forward from the type library: no long prose set in mono; no second grotesque
anywhere; Newsreader's heavy display cuts are not used for body text.

### 5.1 Scale: ratio 1.2, base 16px

| Token | px | rem | Role | Line height | Tracking |
|---|---|---|---|---|---|
| `xs` | 11 | 0.6875 | mono eyebrow, table meta | 1.45 | +0.06em |
| `sm` | 13 | 0.8125 | captions, badges, sidebar | 1.5 | +0.01em |
| `base` | 16 | 1 | UI text, lists | 1.6 | 0 |
| `prose` | 17 | 1.0625 | article body (Newsreader) | 1.65 | 0 |
| `md` | 19 | 1.1875 | lead paragraph, `h4` | 1.5 | 0 |
| `lg` | 23 | 1.4375 | `h3` | 1.35 | −0.005em |
| `xl` | 28 | 1.75 | `h2` | 1.25 | −0.01em |
| `2xl` | 33 | 2.0625 | `h1`, page title | 1.15 | −0.02em |

Headings are set at weight 600, never 700+. A manual states, it does not shout. One `h1` per page.
Measure is capped at **68ch**; prose wider than that is a readability failure regardless of how much
screen is available.

---

## 6. Layout

| | |
|---|---|
| Composition | **Sidebar + main + on-page contents**, the canonical docs three-column |
| Grid | Fluid single column inside `main`; 12-col only for the project index |
| Base unit | 4px |
| Radius | 2px controls, 4px cards. Near-square: a field manual is printed, not injection-moulded |
| Depth | **None.** Hairline rules and background steps only: no box-shadows, no gradients, no translucency or backdrop blur |

### 6.1 Spacing

| Token | px | Use |
|---|---|---|
| `xs` | 4 | icon gap, badge padding |
| `sm` | 8 | label-to-field, inline list gap |
| `md` | 16 | paragraph rhythm, card padding |
| `lg` | 24 | between sibling blocks |
| `xl` | 32 | heading top margin |
| `2xl` | 48 | section separation |
| `3xl` | 64 | page top/bottom |

### 6.2 Breakpoints

| Name | px | Behaviour |
|---|---|---|
| `sm` | 480 | single column, sidebar in a drawer |
| `md` | 768 | single column, sidebar in a drawer, wider gutters |
| `lg` | 1024 | sidebar becomes persistent |
| `xl` | 1280 | on-page contents rail appears |
| `2xl` | 1440 | max container 1360px, content stays 68ch |

Side gutter never below 16px. No horizontal page scroll at any width.

### 6.3 Motion

Colour and border transitions at 120ms `ease-out`. Nothing else moves. All of it sits behind
`@media (prefers-reduced-motion: reduce)`.

---

## 7. Voice

Verbal and visual must point the same direction, so the voice is the theme statement in prose:
**precise, candid.**

| Do | Don't |
|---|---|
| "Go is the server; Postgres row-level security isolates tenants." | "Leveraging cutting-edge cloud-native paradigms." |
| "On hold since March 2026." | Silently leaving a dead project listed as active. |
| "I own the data layer; a teammate owns the maps." | Claiming a team's work in the first person. |
| Name the employer, the journal, the DOI, the newspaper. | "Featured in the press." |
| "This did not work, and here is what I changed." | Hiding the failure and keeping the outcome. |

Specificity is the credibility mechanism. A number, a date, a named system, or a link: every claim
carries one.

---

## 8. Wordmark and mark

### 8.1 Wordmark

Set `Sinclair Nzenwata` in Inter 600, tracking −0.02em, in `--tyrian-anchor` (`#66023C`) on light and
`tyrian-300` on dark. Clear space on all sides equals the cap height, expressed as `--space-md`, so
the rule is a token and not a note. Minimum size 16px; below that, use the initials `SN` in the same
weight and colour. No gradient, no outline variant, and **no mark beside it**: in the page header the
identity is typographic, full stop.

### 8.2 Mark

The mark is a bold **S with rain and sweat droplets**. The S is Sinclair's initial.
Rain represents hard days; sweat represents effort. There will always be more work
and another challenge. The reminder is personal: stop postponing happiness, make
room for fun, and **be happy now**.

The reference silhouette informed a generated concept in
`docs/brand/dripping-s-concept.png`. The production mark uses flat ivory `#FCF9FA`
on Tyrian purple `#66023C`, with broad counters and droplets at both ends. It has no
gradients, gloss or shadows. The purple retains its personal meaning of rarity.

`scripts/make-icons.py` holds the production paths and generates the SVG, 16/32/48px
ICO, Apple touch icon, and maskable 192/512px icons. Run `npm run icons` after edits.
At small sizes the S carries recognition; the colophon explains the droplets.

---

## 9. Evidence base

The positioning above is derived from verifiable public record, not invented. Full sources in
[`docs/research.md`](docs/research.md). The load-bearing items:

- Peer-reviewed co-authorship in *Forecasting* (MDPI), DOI `10.3390/forecast8060105`.
- *Ball State Daily News*, 19 Feb 2026: approved to SGA At-Large Senate, 22 to 4 with two abstentions.
- Ball State Digital Corps recruitment page: featured student testimonial.
- LewerMark "Make Your Mark" Spring 2026 scholarship, for the *Access to Build* initiative.

This section exists because of the Layer 1 principle that promise must match product truth. If a
claim on the site cannot be traced to this list or to a public repository, it does not belong on the
site.
