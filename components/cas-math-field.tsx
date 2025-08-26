// components/cas-math-field.tsx

"use client";

import { useState, useRef, FC } from 'react';
import { EditableMathField, StaticMathField, MathField } from 'react-mathquill';
import { evaluateMath } from '../lib/cas-math';

interface CasMathFieldProps {
  latex: string;
  onChange: (newLatex: string) => void;
  onDelete: () => void;
  onMount: (field: MathField) => void;
}

const CasMathField: FC<CasMathFieldProps> = ({ latex, onChange, onMount, onDelete }) => {
  const [output, setOutput] = useState('');
  const mathFieldRef = useRef<MathField | null>(null);

  const handleEnter = (field: MathField) => {
    if (field) {
      const currentLatex = field.latex();
      if (currentLatex) {
        const result = evaluateMath(currentLatex);
        setOutput(result);
      }
    }
  };

  return (
    <div className="inline-block align-middle mx-1 my-2 p-2 bg-muted/30 rounded-lg w-full">
      <EditableMathField
        latex={latex}
        mathquillDidMount={(field) => {
          mathFieldRef.current = field;
          onMount(field);
          field.focus();
        }}
        config={{
          handlers: {
            edit: (mathField) => {
              if (mathField) {
                onChange(mathField.latex());
              }
            },
            enter: handleEnter,
            deleteOutOf: () => onDelete(),
            moveOutOf: (dir) => {
              const wrapper = mathFieldRef.current?.el().closest('.inline-math-wrapper');
              if (!wrapper || !wrapper.parentNode) return;
              
              // *** THIS IS THE FIX ***
              // Store parentNode in a constant AFTER the null check.
              // TypeScript now knows 'parent' is guaranteed to exist.
              const parent = wrapper.parentNode;

              const parentEditor = wrapper.closest('[contenteditable="true"]') as HTMLElement | null;
              if (!parentEditor) return;
              
              parentEditor.focus();
              const selection = window.getSelection();
              if (!selection) return;
              
              const range = document.createRange();

              const createCursorAnchor = (position: 'before' | 'after') => {
                const zeroWidthNode = document.createTextNode('\u200B');
                if (position === 'before') {
                  // Use the safe 'parent' variable here
                  parent.insertBefore(zeroWidthNode, wrapper);
                } else {
                  // And here
                  parent.insertBefore(zeroWidthNode, wrapper.nextSibling);
                }
                range.setStart(zeroWidthNode, 1);
              };

              if (dir < 0) { // Moving LEFT
                const prev = wrapper.previousSibling;
                if (prev && prev.nodeType === Node.TEXT_NODE) {
                  range.setStart(prev, prev.textContent?.length || 0);
                } else {
                  createCursorAnchor('before');
                }
              } 
              else { // Moving RIGHT
                const next = wrapper.nextSibling;
                if (next && next.nodeType === Node.TEXT_NODE) {
                  const offset = next.textContent === '\u200B' ? 1 : 0;
                  range.setStart(next, offset);
                } else {
                  createCursorAnchor('after');
                }
              }
              
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            },
          },
        }}
        className="w-full p-2 rounded-md bg-input border border-border"
      />
      {output && (
        <div className="mt-2 pl-2 flex items-center gap-2 text-lg text-primary">
          <span>=</span>
          <StaticMathField>{output}</StaticMathField>
        </div>
      )}
    </div>
  );
};

export default CasMathField;