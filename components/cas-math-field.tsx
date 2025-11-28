// components/cas-math-field.tsx

"use client";

import { useState, useRef, useCallback, FC } from 'react';
import { EditableMathField, StaticMathField, MathField } from 'react-mathquill';
import { evaluateMath } from '@/lib/cas-math';

interface CasMathFieldProps {
  latex: string;
  onChange: (newLatex: string) => void;
  onDelete: () => void;
  onMount: (field: MathField) => void;
  onFocus?: () => void;
  sessionType?: 'math' | 'physics' | 'default';
}

const CasMathField: FC<CasMathFieldProps> = ({ latex, onChange, onMount, onDelete, onFocus, sessionType }) => {
  const [output, setOutput] = useState('');
  const mathFieldRef = useRef<MathField | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback((field: MathField) => {
    if (field) {
      const currentLatex = field.latex();
      if (currentLatex) {
        const result = evaluateMath(currentLatex, sessionType);
        setOutput(result);
      }
    }
  }, [sessionType]);

  // Handle click on the wrapper to focus the math field
  const handleWrapperClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (mathFieldRef.current) {
      mathFieldRef.current.focus();
      onFocus?.();
    }
  }, [onFocus]);

  return (
    <div
      ref={wrapperRef}
      className="inline-block align-middle mx-1 my-2 p-2 bg-muted/30 rounded-lg w-auto shadow-sm border border-border/50 cursor-text"
      onClick={handleWrapperClick}
    >
      <EditableMathField
        latex={latex}
        mathquillDidMount={(field) => {
          mathFieldRef.current = field;
          onMount(field);
          // Auto-focus on mount
          setTimeout(() => {
            field.focus();
            onFocus?.();
          }, 10);
        }}
        config={{
          // Auto-commands for Greek letters, SPECIAL SYMBOLS, and FUNCTIONS that should render as symbols
          // Added 'sqrt' here so typing 'sqrt' becomes the symbol √
          autoCommands: 'pi theta alpha beta gamma delta epsilon zeta eta lambda mu nu xi rho sigma tau phi chi psi omega hbar infinity sqrt',
          // Auto-operator names for functions that should render as text (like sin, cos)
          // Removed 'sqrt' from here
          autoOperatorNames: 'sin cos tan sec csc cot sinh cosh tanh arcsin arccos arctan log ln exp abs derivative solve simplify expand factor limit integrate sum product',
          handlers: {
            edit: (mathField) => {
              if (mathField) {
                onChange(mathField.latex());
                if (output) {
                  setOutput('');
                }
              }
            },
            enter: handleEnter,
            deleteOutOf: (dir) => {
              // Only delete if the field is empty and user pressed backspace
              if (mathFieldRef.current && mathFieldRef.current.latex().trim() === '') {
                onDelete();
              }
            },
            upOutOf: () => {
              // Keep focus in the field when pressing up
              mathFieldRef.current?.focus();
            },
            downOutOf: () => {
              // Keep focus in the field when pressing down
              mathFieldRef.current?.focus();
            },
            moveOutOf: (dir) => {
              const wrapper = mathFieldRef.current?.el().closest('.inline-math-wrapper');
              if (!wrapper || !wrapper.parentNode) return;

              const parent = wrapper.parentNode;
              const parentEditor = wrapper.closest('[contenteditable="true"]') as HTMLElement | null;
              if (!parentEditor) return;

              // Blur the math field before moving focus
              mathFieldRef.current?.blur();

              setTimeout(() => {
                const selection = window.getSelection();
                if (!selection) return;

                const range = document.createRange();

                if (dir === 1) { // Right
                  const next = wrapper.nextSibling;
                  if (next && next.nodeType === Node.TEXT_NODE && next.textContent) {
                    range.setStart(next, 0);
                    range.collapse(true);
                  } else {
                    // Create a zero-width space to place cursor
                    const newTextNode = document.createTextNode('\u200B');
                    parent.insertBefore(newTextNode, wrapper.nextSibling);
                    range.setStart(newTextNode, 1);
                    range.collapse(true);
                  }
                } else if (dir === -1) { // Left
                  const prev = wrapper.previousSibling;
                  if (prev && prev.nodeType === Node.TEXT_NODE && prev.textContent) {
                    range.setStart(prev, prev.textContent.length);
                    range.collapse(true);
                  } else {
                    const newTextNode = document.createTextNode('\u200B');
                    parent.insertBefore(newTextNode, wrapper);
                    range.setStart(newTextNode, 1);
                    range.collapse(true);
                  }
                }

                selection.removeAllRanges();
                selection.addRange(range);
                parentEditor.focus();
              }, 10);
            },
          },
        }}
        className="p-2 rounded-md bg-input border border-border min-w-12 text-lg focus:ring-2 focus:ring-ring focus:border-border"
      />
      {output && (
        <div className="mt-2 pl-2 flex items-center gap-2 text-lg text-primary font-medium animate-in fade-in slide-in-from-top-1">
          <span className="text-muted-foreground">=</span>
          <StaticMathField>{output}</StaticMathField>
        </div>
      )}
    </div>
  );
};

export default CasMathField;