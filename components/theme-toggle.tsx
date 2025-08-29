// components/theme-toggle.tsx

"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  // State lives directly inside the component
  const [imageTheme, setImageTheme] = useState<'light' | 'dark'>('dark');

  // On initial load, set the body class
  useEffect(() => {
    document.body.classList.add('dark-bg'); // Default to the dark background
  }, []);

  const toggleTheme = () => {
    const newTheme = imageTheme === 'dark' ? 'light' : 'dark';
    setImageTheme(newTheme);
    // Directly manipulate the body's class list
    document.body.classList.toggle('dark-bg', newTheme === 'dark');
    document.body.classList.toggle('light-bg', newTheme === 'light');
  };

  const isDark = imageTheme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="glass p-3 rounded-full hover:glass-strong transition-all duration-300 group"
      aria-label="Toggle background image"
    >
      <div className="relative w-6 h-6">
        <Sun
          className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-300 ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>

      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/20 via-orange-400/20 to-pink-400/20 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </button>
  )
}