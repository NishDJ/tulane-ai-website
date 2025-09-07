"use client";

import * as React from "react";
import { createContext, useContext, useRef, useCallback } from "react";

type AnnouncementPriority = "polite" | "assertive";

interface LiveAnnouncerContextType {
  announce: (message: string, priority?: AnnouncementPriority) => void;
}

const LiveAnnouncerContext = createContext<LiveAnnouncerContextType | undefined>(undefined);

interface LiveAnnouncerProviderProps {
  children: React.ReactNode;
}

export function LiveAnnouncerProvider({ children }: LiveAnnouncerProviderProps) {
  const politeRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: AnnouncementPriority = "polite") => {
    const element = priority === "assertive" ? assertiveRef.current : politeRef.current;
    
    if (element) {
      // Clear the element first to ensure the screen reader announces the new message
      element.textContent = "";
      
      // Use a small delay to ensure the clearing is processed
      setTimeout(() => {
        element.textContent = message;
      }, 10);
    }
  }, []);

  const value: LiveAnnouncerContextType = {
    announce,
  };

  return (
    <LiveAnnouncerContext.Provider value={value}>
      {children}
      {/* Screen reader announcement regions */}
      <div
        ref={politeRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      />
      <div
        ref={assertiveRef}
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        role="alert"
      />
    </LiveAnnouncerContext.Provider>
  );
}

export const useLiveAnnouncer = () => {
  const context = useContext(LiveAnnouncerContext);
  
  if (context === undefined) {
    throw new Error("useLiveAnnouncer must be used within a LiveAnnouncerProvider");
  }
  
  return context;
};