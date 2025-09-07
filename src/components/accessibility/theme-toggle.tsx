"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Contrast } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";
import { useLiveAnnouncer } from "./live-announcer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, contrastMode, setTheme, setContrastMode, resolvedTheme } = useTheme();
  const { announce } = useLiveAnnouncer();

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    const message = `Theme changed to ${newTheme === "system" ? "system preference" : newTheme} mode`;
    announce(message);
  };

  const handleContrastChange = () => {
    const newMode = contrastMode === "normal" ? "high" : "normal";
    setContrastMode(newMode);
    announce(`Contrast mode changed to ${newMode} contrast`);
  };

  const getThemeIcon = () => {
    if (theme === "system") {
      return <Monitor className="h-4 w-4" />;
    }
    return resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Current theme: ${theme === "system" ? "system preference" : theme}. Click to change theme.`}
        >
          {getThemeIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          className="cursor-pointer"
          aria-current={theme === "light" ? "true" : "false"}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === "light" && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("dark")}
          className="cursor-pointer"
          aria-current={theme === "dark" ? "true" : "false"}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("system")}
          className="cursor-pointer"
          aria-current={theme === "system" ? "true" : "false"}
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === "system" && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleContrastChange}
          className="cursor-pointer"
          aria-current={contrastMode === "high" ? "true" : "false"}
        >
          <Contrast className="mr-2 h-4 w-4" />
          <span>High Contrast</span>
          {contrastMode === "high" && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}