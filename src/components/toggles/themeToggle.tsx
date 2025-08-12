"use client";

import { useThemeContext } from "@/contexts/themeContext";
import "./themeToggle.css";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <div className="relative">
      <input
        id="theme-toggle"
        type="checkbox"
        className="theme-input peer"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
      <label htmlFor="theme-toggle" className="theme-toggle">
        <span className="toggle__handler">
          <span className="crater crater--1" />
          <span className="crater crater--2" />
          <span className="crater crater--3" />
        </span>

        <span className="star star--1" />
        <span className="star star--2" />
        <span className="star star--3" />
        <span className="star star--4" />
        <span className="star star--5" />
        <span className="star star--6" />
      </label>
    </div>
  );
}
