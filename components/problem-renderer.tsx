// components/problem-renderer.tsx

"use client"

import { useEffect, useRef } from "react"
import katex from "katex"

// Define the type for the component's props
interface ProblemRendererProps {
  text: string;
}

export default function ProblemRenderer({ text }: ProblemRendererProps) {
  // Tell TypeScript this ref will hold an HTMLDivElement
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if containerRef.current is not null
    if (containerRef.current && text) {
      const renderedHtml = text.replace(/\$(.*?)\$/g, (match: string, equation: string) => {
        try {
          return katex.renderToString(equation, {
            throwOnError: false,
            displayMode: false,
          });
        } catch (e) {
          console.error("KaTeX rendering failed:", e);
          return `<span class="text-red-500">Error rendering: ${equation}</span>`;
        }
      });
      containerRef.current.innerHTML = renderedHtml;
    }
  }, [text])

  return <div ref={containerRef} className="text-lg leading-relaxed text-foreground prose prose-lg max-w-none" />
}