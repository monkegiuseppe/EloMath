// components/site-header.tsx

"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Bug, Github, HelpCircle } from "lucide-react";
import HelpModal from "./help-modal";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [highlightHelp, setHighlightHelp] = useState(true);

  useEffect(() => {
    const hasSeen = localStorage.getItem("elomath-help-seen");
    if (!hasSeen) {
      setHighlightHelp(true);
    }
  }, []);

  const handleOpenHelp = () => {
    setIsHelpOpen(true);
    if (highlightHelp) {
      setHighlightHelp(false);
      localStorage.setItem("elomath-help-seen", "true");
    }
  };

  return (
    <>
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 flex items-center gap-1 sm:gap-2">
        <button
          onClick={handleOpenHelp}
          aria-label="Help & Guide"
          title="Help & Guide"
          className={cn(
            "glass p-2 sm:p-3 rounded-full transition-all duration-300 group relative",
            highlightHelp
              ? "bg-cyan-500/20 border-cyan-400/50 hover:bg-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
              : "hover:glass-strong"
          )}
        >
          {highlightHelp && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          )}
          <HelpCircle
            className={cn(
              "w-5 h-5 sm:w-6 sm:h-6 transition-colors",
              highlightHelp ? "text-cyan-400" : "text-foreground/80 group-hover:text-foreground"
            )}
          />
        </button>
        <a
          href="https://github.com/monkegiuseppe"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
          title="GitHub Profile"
          className="glass p-2 sm:p-3 rounded-full hover:glass-strong transition-colors duration-300 group hidden sm:flex"
        >
          <Github className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/80 group-hover:text-foreground transition-colors" />
        </a>
        <a
          href="https://github.com/monkegiuseppe/EloMath/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Report a bug"
          title="Report a Bug"
          className="glass p-2 sm:p-3 rounded-full hover:glass-strong transition-colors duration-300 group"
        >
          <Bug className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/80 group-hover:text-foreground transition-colors" />
        </a>
        <ThemeToggle />
      </div>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}