import type { ReactNode } from "react";
import { useHead } from "../lib/head";
import { Breadcrumbs } from "./Breadcrumbs";
import { Toc, type TocEntry } from "./Toc";
import { routeSeo } from "../lib/routes";
import type { Crumb } from "../lib/schema";

export interface PageProps {
  /** Mono eyebrow above the title. */
  eyebrow?: string;
  title: string;
  /** One sentence. Used for the lead paragraph and the meta description. */
  description: string;
  /** Override the meta description when the on-page lead is too long for it. */
  metaDescription?: string;
  path: string;
  crumbs?: Crumb[];
  toc?: TocEntry[];
  /** Only for routes absent from the route table, such as 404. */
  jsonLd?: unknown;
  ogType?: "website" | "article" | "profile";
  noIndex?: boolean;
  children: ReactNode;
  /** Rendered between the page head and the children: dates, status, links. */
  aside?: ReactNode;
}

/**
 * Every route renders through this.
 *
 * The head values come from the route table in `lib/routes.ts`, which is the
 * same table the build-time prerenderer uses to write each route's static HTML.
 * That is deliberate: a crawler that never runs JavaScript and a browser that
 * does must end up with identical tags. The `title` and `description` props
 * drive the *visible* heading and lead, which are allowed to differ from the
 * meta text.
 */
export function Page({
  eyebrow,
  title,
  description,
  metaDescription,
  path,
  crumbs,
  toc = [],
  jsonLd,
  ogType,
  noIndex,
  children,
  aside,
}: PageProps) {
  const seo = routeSeo(path);

  useHead({
    title: seo?.title ?? title,
    description: seo?.description ?? metaDescription ?? description,
    path,
    jsonLd: seo?.jsonLd ?? jsonLd,
    ogType: seo?.ogType ?? ogType,
    noIndex,
    extraMeta: seo?.extraMeta,
  });

  return (
    <>
      <main className="docs-main" id="content">
        <article className="docs-article">
          {crumbs && <Breadcrumbs crumbs={crumbs} />}
          <header className="page-head">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h1>{title}</h1>
            <p className="page-head__lead">{description}</p>
            {aside}
          </header>
          {children}
        </article>
      </main>
      <Toc entries={toc} />
    </>
  );
}

/** A titled section whose heading is a TOC target. */
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="section" aria-labelledby={id}>
      <h2 className="section__title" id={id}>
        {title}
      </h2>
      <div className="section__body">{children}</div>
    </section>
  );
}
