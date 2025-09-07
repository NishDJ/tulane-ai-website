"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type ContrastMode = "normal" | "high";

interface ThemeContextType {
  theme: Theme;
  contrastMode: ContrastMode;
  setTheme: (theme: Theme) => void;
  setContrastMode: (mode: ContrastMode) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultContrastMode?: ContrastMode;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultContrastMode = "normal",
  storageKey = "tulane-ai-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [contrastMode, setContrastMode] = useState<ContrastMode>(defaultContrastMode);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Load theme from localStorage
    const storedTheme = localStorage.getItem(storageKey) as Theme;
    const storedContrast = localStorage.getItem(`${storageKey}-contrast`) as ContrastMode;
    
    if (storedTheme) {
      setTheme(storedTheme);
    }
    
    if (storedContrast) {
      setContrastMode(storedContrast);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove("light", "dark", "high-contrast");
    
    let effectiveTheme: "light" | "dark";
    
    if (theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      effectiveTheme = theme;
    }
    
    setResolvedTheme(effectiveTheme);
    root.classList.add(effectiveTheme);
    
    if (contrastMode === "high") {
      root.classList.add("high-contrast");
    }
    
    // Store in localStorage
    localStorage.setItem(storageKey, theme);
    localStorage.setItem(`${storageKey}-contrast`, contrastMode);
  }, [theme, contrastMode, storageKey]);

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      if (theme === "system") {
        const newTheme = mediaQuery.matches ? "dark" : "light";
        setResolvedTheme(newTheme);
        
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(newTheme);
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    contrastMode,
    setTheme,
    setContrastMode,
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};