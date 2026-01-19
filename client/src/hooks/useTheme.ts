/**
 * useTheme Hook
 * Manages dark/light theme state with localStorage persistence
 */

import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem("lifeos-theme") as Theme | null;
    if (stored) return stored;
    
    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("lifeos-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const setLightTheme = useCallback(() => setTheme("light"), []);
  const setDarkTheme = useCallback(() => setTheme("dark"), []);

  return {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === "dark",
  };
}
