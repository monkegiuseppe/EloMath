// components/inline-math-field.tsx

"use client";

import { useRef } from 'react';
import { EditableMathField } from 'react-mathquill';

interface InlineMathFieldProps {
  latex: string;
  onChange: (latex: string) => void;
  onDelete: () => void;
}

export default function InlineMathField({ latex, onChange, onDelete }: InlineMathFieldProps) {
  const mathFieldRef = useRef<any>(null);

  return (
    <EditableMathField
      latex={latex}
      onChange={() => {
        if (mathFieldRef.current) {
          onChange(mathFieldRef.current.latex());
        }
      }}
      mathquillDidMount={(mathField) => {
        mathFieldRef.current = mathField;
        mathField.focus();
      }}
      config={{
        handlers: {
          deleteOutOf: (dir) => {
            if (dir < 0 && mathFieldRef.current?.latex() === '') {
              onDelete();
            }
          },
          moveOutOf: (dir) => {
            const mathFieldElement = mathFieldRef.current?.el();
            if (!mathFieldElement) return;

            // Find the main wrapper span for our equation
            const wrapper = mathFieldElement.closest('.inline-math-wrapper');
            if (!wrapper) return;

            // Get the browser's current text selection/cursor
            const selection = window.getSelection();
            if (!selection) return;

            // Create a new cursor position (a "range")
            const range = document.createRange();

            if (dir < 0) {
              // If moving left (dir is -1), place the cursor just BEFORE the wrapper
              range.setStartBefore(wrapper);
            } else {
              // If moving right (dir is 1), place the cursor just AFTER the wrapper
              range.setStartAfter(wrapper);
            }

            // Collapse the range to a single point (making it a cursor, not a selection)
            range.collapse(true);

            // Apply the new cursor position
            selection.removeAllRanges();
            selection.addRange(range);
          },
        },
      }}
    />
  );
}