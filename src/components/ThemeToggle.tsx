import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

type Theme = "light" | "dark" | "system";

const KEY = "snz-theme";

function read(): Theme {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* Private mode or blocked storage. Fall through to system. */
  }
  return "system";
}

/**
 * The stylesheet handles `system` by itself through prefers-color-scheme, so this
 * only has to set or clear `data-theme`. Storage is wrapped because it throws in
 * a private window.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(read);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    try {
      if (theme === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, theme);
    } catch {
      /* Not fatal. The attribute above is already applied. */
    }
  }, [theme]);

  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const isDark = theme === "dark" || (theme === "system" && prefersDark);

  return (
    <button
      type="button"
      className="icon-button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <FiSun aria-hidden size={16} /> : <FiMoon aria-hidden size={16} />}
    </button>
  );
}
