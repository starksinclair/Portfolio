import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { navGroups } from "../nav";

/**
 * Below 1024px this is a drawer; the `open` prop drives `data-open`, which the
 * stylesheet turns into a fixed overlay. `onNavigate` closes it after a tap.
 */
export function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const ref = useRef<HTMLElement>(null);

  /* Opening the drawer moves focus into it, so the first Tab lands on a link
     rather than carrying on through the header. */
  useEffect(() => {
    if (!open) return;
    ref.current?.querySelector<HTMLAnchorElement>("a")?.focus();
  }, [open]);

  return (
    <nav
      ref={ref}
      className="docs-sidebar"
      data-open={open}
      aria-label="Site sections"
      id="site-nav"
    >
      {navGroups.map((group) => (
        <div className="nav-group" key={group.title}>
          <h2 className="nav-group__title">{group.title}</h2>
          <ul className="nav-list">
            {group.items.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path} end className="nav-link" onClick={onNavigate}>
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span className="nav-link__count">{item.count}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
