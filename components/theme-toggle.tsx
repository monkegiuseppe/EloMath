// components/theme-toggle.tsx

"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, ChevronDown, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

const themes = [
  { id: 'dark-gd', label: 'Dark Default', icon: Moon, isDark: true },
  { id: 'dark-gd1', label: 'Dark Alt', icon: Moon, isDark: true },
  { id: 'light-g2', label: 'Light Default', icon: Sun, isDark: false },
  { id: 'light-g21', label: 'Light Alt', icon: Sun, isDark: false },
]

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const currentTheme = themes.find(t => t.id === theme) || themes[0]
  const isDark = currentTheme.isDark

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="glass p-3 rounded-full hover:glass-strong transition-all duration-300 group flex items-center gap-1"
          aria-label="Select theme"
        >
          <div className="relative w-6 h-6">
            <Sun
              className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-300 ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                }`}
            />
            <Moon
              className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300 ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                }`}
            />
          </div>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-card/[0.98] backdrop-blur-xl border-border/40">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Dark Themes</DropdownMenuLabel>
        {themes.filter(t => t.isDark).map((t) => {
          const Icon = t.icon
          return (
            <DropdownMenuItem
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-blue-400" />
                <span>{t.label}</span>
              </div>
              {theme === t.id && <Check className="w-4 h-4 text-primary" />}
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Light Themes</DropdownMenuLabel>
        {themes.filter(t => !t.isDark).map((t) => {
          const Icon = t.icon
          return (
            <DropdownMenuItem
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-amber-500" />
                <span>{t.label}</span>
              </div>
              {theme === t.id && <Check className="w-4 h-4 text-primary" />}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}