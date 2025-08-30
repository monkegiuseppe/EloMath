// components/theme-toggle.tsx

"use client"

import { useState, useEffect } from "react" // Import hooks
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  // 1. Create a state to track if the component is mounted
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // 2. Use useEffect to set the mounted state to true after the initial render
  // This hook only runs on the client, so we can be sure the theme is available.
  useEffect(() => {
    setMounted(true)
  }, [])

  // 3. If the component is not yet mounted, render a placeholder or null
  // to avoid the hydration mismatch.
  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  };

  const isDark = theme === 'dark';

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