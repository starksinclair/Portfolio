/**
 * Document head management.
 *
 * This replaces react-helmet, which is unmaintained and warns under React 18's
 * strict rendering. It is ~60 lines because that is all the job needs: set the
 * title, upsert a known set of meta tags, and swap one JSON-LD script.
 *
 * The site-wide Person + WebSite graph is also written statically into
 * `index.html`, so the primary structured data is present in the served HTML
 * before any JavaScript runs. What this hook injects is the *page-specific*
 * graph, under a separate script id so the two never fight.
 */

import { useEffect } from "react";
import { SITE_URL } from "../data/profile";
import { documentTitle } from "./routes";
import {
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_TYPE,
  OG_IMAGE_WIDTH,
  TWITTER_HANDLE,
} from "./og";

const ROUTE_LD_ID = "ld-json-route";
/** Marks the meta tags this hook owns, so it can clear its own and no others. */
const ROUTE_META_ATTR = "data-route-meta";

function upsertMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export interface HeadOptions {
  /** Without the site name, which is appended. */
  title: string;
  description: string;
  /** Route path, leading slash, no origin. */
  path: string;
  /** og:type. `article` for posts, `website` otherwise. */
  ogType?: "website" | "article" | "profile";
  /** Absolute or site-relative image URL. */
  image?: string;
  /** The page-specific schema.org graph. */
  jsonLd?: unknown;
  /** Keep this page out of search indexes. */
  noIndex?: boolean;
  /**
   * Route-specific meta tags with repeatable names, such as the `citation_*`
   * set. They are removed on every navigation and re-added for the current
   * route, so a tag never survives onto a page it does not belong to.
   */
  extraMeta?: { name: string; content: string }[];
}

export function useHead({
  title,
  description,
  path,
  ogType = "website",
  image = OG_IMAGE_PATH,
  jsonLd,
  noIndex = false,
  extraMeta,
}: HeadOptions) {
  useEffect(() => {
    const siteName = "Sinclair Nzenwata";
    const fullTitle = documentTitle(path, title);
    const url = `${SITE_URL}${path}`;
    const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

    document.title = fullTitle;

    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
    );
    upsertLink("canonical", url);

    upsertMeta('meta[property="og:type"]', "property", "og:type", ogType);
    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:image"]', "property", "og:image", absoluteImage);
    upsertMeta(
      'meta[property="og:image:secure_url"]',
      "property",
      "og:image:secure_url",
      absoluteImage,
    );
    upsertMeta('meta[property="og:image:type"]', "property", "og:image:type", OG_IMAGE_TYPE);
    upsertMeta('meta[property="og:image:width"]', "property", "og:image:width", OG_IMAGE_WIDTH);
    upsertMeta(
      'meta[property="og:image:height"]',
      "property",
      "og:image:height",
      OG_IMAGE_HEIGHT,
    );
    upsertMeta('meta[property="og:image:alt"]', "property", "og:image:alt", OG_IMAGE_ALT);
    upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", siteName);
    upsertMeta('meta[property="og:locale"]', "property", "og:locale", "en_US");

    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", absoluteImage);
    upsertMeta('meta[name="twitter:image:alt"]', "name", "twitter:image:alt", OG_IMAGE_ALT);
    upsertMeta('meta[name="twitter:site"]', "name", "twitter:site", TWITTER_HANDLE);
    upsertMeta('meta[name="twitter:creator"]', "name", "twitter:creator", TWITTER_HANDLE);

    document
      .querySelectorAll(`meta[${ROUTE_META_ATTR}]`)
      .forEach((el) => el.remove());
    for (const m of extraMeta ?? []) {
      const el = document.createElement("meta");
      el.setAttribute("name", m.name);
      el.setAttribute("content", m.content);
      el.setAttribute(ROUTE_META_ATTR, "");
      document.head.appendChild(el);
    }

    const existing = document.getElementById(ROUTE_LD_ID);
    if (existing) existing.remove();

    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = ROUTE_LD_ID;
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, path, ogType, image, jsonLd, noIndex, extraMeta]);
}
