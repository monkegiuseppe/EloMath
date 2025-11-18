// components/site-header.tsx

"use client";

import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Bug, Github, HelpCircle } from "lucide-react";
import HelpModal from "./help-modal";

export function SiteHeader() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => setIsHelpOpen(true)}
          aria-label="Help & Guide"
          title="Help & Guide"
          className="glass p-2 sm:p-3 rounded-full hover:glass-strong transition-colors duration-300 group"
        >
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/80 group-hover:text-foreground transition-colors" />
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