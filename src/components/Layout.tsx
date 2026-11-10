import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FiGithub, FiLinkedin, FiMenu, FiTwitter, FiX } from "react-icons/fi";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { profile } from "../data/profile";

const socials = [
  { Icon: FiGithub, href: profile.socials.github, label: "GitHub" },
  { Icon: FiLinkedin, href: profile.socials.linkedin, label: "LinkedIn" },
  { Icon: FiTwitter, href: profile.socials.twitter, label: "X / Twitter" },
];

export function Layout() {
  const { pathname } = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* Reset scroll and close the drawer whenever the route changes. */
  useEffect(() => {
    setNavOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  /**
   * The drawer is a full-screen overlay, so the page behind it must stop
   * scrolling and stop taking focus. Without `inert` a keyboard user tabs
   * straight off the open drawer into content they cannot see, which is the
   * usual way a mobile nav fails an audit.
   */
  useEffect(() => {
    const behind = document.querySelectorAll<HTMLElement>(
      "#content, .docs-toc, .docs-footer",
    );
    document.body.style.overflow = navOpen ? "hidden" : "";
    behind.forEach((el) => {
      if (navOpen) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });
    return () => {
      document.body.style.overflow = "";
      behind.forEach((el) => el.removeAttribute("inert"));
    };
  }, [navOpen]);

  /* Escape closes the drawer and hands focus back to the button that opened it. */
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setNavOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  return (
    <div className="docs-shell">
      <a className="skip-link" href="#content">
        Skip to content
      </a>

      <header className="docs-header">
        <div className="docs-header__inner">
          <button
            ref={toggleRef}
            type="button"
            className="icon-button nav-toggle"
            aria-label={navOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={navOpen}
            aria-controls="site-nav"
            onClick={() => setNavOpen((v) => !v)}
          >
            {navOpen ? <FiX aria-hidden size={16} /> : <FiMenu aria-hidden size={16} />}
          </button>

          <Link to="/" className="wordmark">
            {profile.name}
            <span className="wordmark__role">Software engineer &amp; researcher</span>
          </Link>

          <div className="docs-header__spacer" />

          <div className="docs-header__links">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                className="icon-button"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <Icon aria-hidden size={16} />
              </a>
            ))}
          </div>

          <ThemeToggle />
        </div>
      </header>

      <div className="docs-body">
        <Sidebar open={navOpen} onNavigate={() => setNavOpen(false)} />
        <Outlet />
      </div>

      <footer className="docs-footer">
        <div className="docs-footer__inner">
          <p>
            &copy; {new Date().getFullYear()} {profile.name}
          </p>
          <div className="social-row">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
              >
                <Icon aria-hidden size={18} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
