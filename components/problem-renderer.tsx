// components/problem-renderer.tsx

"use client"

import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface ProblemRendererProps {
  text: string;
}

export default function ProblemRenderer({ text }: ProblemRendererProps) {
  const parts = text.split('$');

  return (
    <div className="text-lg leading-relaxed text-foreground prose prose-lg max-w-none">
      {parts.map((part, index) => {
        if (index % 2 === 0) {
          return <span key={index}>{part}</span>;
        }
        else {
          try {
            const html = katex.renderToString(part, {
              throwOnError: false,
              displayMode: false,
            });
            return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch (e) {
            console.error("KaTeX rendering failed:", e);
            return <span key={index} className="text-red-500">{`Error: ${part}`}</span>;
          }
        }
      })}
    </div>
  );
}