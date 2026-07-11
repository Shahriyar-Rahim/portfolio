import { useEffect, useState } from "react";
import { HiMoon, HiSun } from "react-icons/hi";

const getInitialTheme = () => localStorage.getItem("portfolio-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("portfolio-theme", theme); }, [theme]);
  return <button type="button" onClick={() => setTheme((value) => value === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} className="rounded-md border border-line p-2 text-ink-dim transition hover:border-copper hover:text-copper-soft">{theme === "dark" ? <HiSun /> : <HiMoon />}</button>;
}
