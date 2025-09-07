"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SkipLink {
  href: string;
  label: string;
}

const defaultSkipLinks: SkipLink[] = [
  { href: "#main-content", label: "Skip to main content" },
  { href: "#navigation", label: "Skip to navigation" },
  { href: "#footer", label: "Skip to footer" },
];

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

export function SkipLinks({ links = defaultSkipLinks, className }: SkipLinksProps) {
  return (
    <div
      className={cn(
        "sr-only focus-within:not-sr-only fixed top-0 left-0 z-[100] bg-tulane-green text-white p-2 space-x-2",
        className
      )}
      role="navigation"
      aria-label="Skip links"
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="inline-block px-4 py-2 bg-tulane-green text-white rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-tulane-green hover:bg-tulane-green/90 transition-colors"
          onFocus={(e) => {
            // Ensure the skip link is visible when focused
            e.currentTarget.parentElement?.classList.remove("sr-only");
          }}
          onBlur={(e) => {
            // Hide skip links when focus moves away from all skip links
            const parent = e.currentTarget.parentElement;
            if (parent && !parent.contains(e.relatedTarget as Node)) {
              parent.classList.add("sr-only");
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}