"use client";

import { useEffect, useState, useCallback } from "react";
import {
  prefersReducedMotion,
  prefersHighContrast,
  getPreferredColorScheme,
  announceToScreenReader,
} from "@/lib/accessibility-utils";

interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  colorScheme: "light" | "dark";
}

export function useAccessibility() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
    colorScheme: "light",
  });

  useEffect(() => {
    // Check initial preferences
    setPreferences({
      reducedMotion: prefersReducedMotion(),
      highContrast: prefersHighContrast(),
      colorScheme: getPreferredColorScheme(),
    });

    // Listen for changes in user preferences
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const highContrastQuery = window.matchMedia("(prefers-contrast: high)");
    const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({ ...prev, highContrast: e.matches }));
    };

    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({ 
        ...prev, 
        colorScheme: e.matches ? "dark" : "light" 
      }));
    };

    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
    highContrastQuery.addEventListener("change", handleHighContrastChange);
    colorSchemeQuery.addEventListener("change", handleColorSchemeChange);

    return () => {
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      highContrastQuery.removeEventListener("change", handleHighContrastChange);
      colorSchemeQuery.removeEventListener("change", handleColorSchemeChange);
    };
  }, []);

  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    announceToScreenReader(message, priority);
  }, []);

  return {
    preferences,
    announce,
  };
}

/**
 * Hook for managing focus within a component
 */
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

  const setFocus = useCallback((element: HTMLElement | null) => {
    if (element) {
      element.focus();
      setFocusedElement(element);
    }
  }, []);

  const restoreFocus = useCallback(() => {
    if (focusedElement) {
      focusedElement.focus();
    }
  }, [focusedElement]);

  return {
    setFocus,
    restoreFocus,
    focusedElement,
  };
}

/**
 * Hook for keyboard navigation
 */
export function useKeyboardNavigation(
  handlers: Record<string, () => void>,
  dependencies: React.DependencyList = []
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const handler = handlers[event.key];
      if (handler) {
        event.preventDefault();
        handler();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, dependencies);
}