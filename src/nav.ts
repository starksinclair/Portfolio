/**
 * Sidebar navigation. One place, so the sidebar, the sitemap generator and the
 * breadcrumb trails cannot disagree about what the site contains.
 */

import { projects } from "./data/projects";
import { posts } from "./data/posts";
import { mentions } from "./data/press";

export interface NavItem {
  label: string;
  path: string;
  /** Shown right-aligned in the sidebar. */
  count?: number;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    title: "Introduction",
    items: [
      { label: "Overview", path: "/" },
      { label: "About", path: "/about" },
      { label: "Experience", path: "/experience" },
    ],
  },
  {
    title: "Work",
    items: [
      { label: "Projects", path: "/projects", count: projects.length },
      { label: "Research", path: "/research" },
    ],
  },
  {
    title: "Writing",
    items: [{ label: "Blog", path: "/writing", count: posts.length }],
  },
  {
    title: "Record",
    items: [
      { label: "Press & recognition", path: "/press", count: mentions.length },
      { label: "CV", path: "/cv" },
      { label: "Contact", path: "/contact" },
    ],
  },
];

/** Flat, in sidebar order: the reading order used by the prev/next pager. */
export const navOrder: NavItem[] = navGroups.flatMap((g) => g.items);

export function navLabel(path: string): string | undefined {
  return navOrder.find((i) => i.path === path)?.label;
}

export function adjacent(path: string): { prev?: NavItem; next?: NavItem } {
  const i = navOrder.findIndex((n) => n.path === path);
  if (i === -1) return {};
  return { prev: navOrder[i - 1], next: navOrder[i + 1] };
}
