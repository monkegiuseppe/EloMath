"use client"

import { useEffect, useRef } from "react"

// Enhanced math renderer with better styling and MathJax support
export default function ProblemRenderer({ text }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current && text) {
      const rendered = text.replace(/\$([^$]+)\$/g, (match, math) => {
        return `<span class="math-inline bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 px-2 py-1 rounded font-mono text-sm text-blue-900 dark:text-blue-100">${math}</span>`
      })

      containerRef.current.innerHTML = rendered

      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([containerRef.current]).catch((err) => {
          console.log("MathJax rendering failed:", err)
        })
      }
    }
  }, [text])

  return <div ref={containerRef} className="text-lg leading-relaxed text-foreground prose prose-lg max-w-none" />
}
