"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import styles from "./ThemeToggle.module.css";

type Theme = "dark" | "light";

const THEME_COLOR: Record<Theme, string> = { dark: "#181818", light: "#f7f7f7" };

/**
 * Runs in <head> before first paint so a saved light theme never flashes dark.
 * Dark is the default when nothing is saved.
 */
export const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default function ThemeToggle({ className = "" }: { className?: string }) {
  // null until mounted, so the server and first client render match
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;
    // Briefly animate colours across the whole page, then drop the transition
    root.classList.add("theme-switching");
    root.dataset.theme = next;
    window.setTimeout(() => root.classList.remove("theme-switching"), 400);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[next]);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage blocked: the choice lasts for this page only
    }
    setTheme(next);
  };

  const isLight = theme === "light";

  return (
    <button
      type="button"
      className={`${styles.toggle} ${className}`}
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Dark mode" : "Light mode"}
    >
      <Sun size={18} weight="bold" className={styles.sun} aria-hidden />
      <Moon size={18} weight="bold" className={styles.moon} aria-hidden />
    </button>
  );
}
