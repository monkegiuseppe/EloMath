// components/cas-math-field.tsx

"use client";

import { useState, useRef, FC } from 'react';
import { EditableMathField, StaticMathField, MathField } from 'react-mathquill';
import { evaluateMath } from '@/lib/cas-math';

interface CasMathFieldProps {
  latex: string;
  onChange: (newLatex: string) => void;
  onDelete: () => void;
  onMount: (field: MathField) => void;
  sessionType?: 'math' | 'physics' | 'default';
}

const CasMathField: FC<CasMathFieldProps> = ({ latex, onChange, onMount, onDelete, sessionType }) => {
  const [output, setOutput] = useState('');
  const mathFieldRef = useRef<MathField | null>(null);

  const handleEnter = (field: MathField) => {
    if (field) {
      const currentLatex = field.latex();
      if (currentLatex) {
        const result = evaluateMath(currentLatex, sessionType);
        setOutput(result);
      }
    }
  };

  return (
    <div className="inline-block align-middle mx-1 my-2 p-2 bg-muted/30 rounded-lg w-auto shadow-sm border border-border/50">
      <EditableMathField
        latex={latex}
        mathquillDidMount={(field) => {
          mathFieldRef.current = field;
          onMount(field);
          field.focus();
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
            deleteOutOf: () => onDelete(),
            moveOutOf: (dir) => {
              const wrapper = mathFieldRef.current?.el().closest('.inline-math-wrapper');
              if (!wrapper || !wrapper.parentNode) return;

              const parent = wrapper.parentNode;
              const parentEditor = wrapper.closest('[contenteditable="true"]') as HTMLElement | null;
              if (!parentEditor) return;

              mathFieldRef.current?.blur();

              setTimeout(() => {
                const selection = window.getSelection();
                if (!selection) return;

                const range = document.createRange();

                if (dir === 1) {
                  const next = wrapper.nextSibling;
                  if (next && next.nodeType === Node.TEXT_NODE && next.textContent) {
                    range.setStart(next, 0);
                    range.collapse(true);
                  } else {
                    const newTextNode = document.createTextNode('\u200B');
                    parent.insertBefore(newTextNode, wrapper.nextSibling);
                    range.setStart(newTextNode, 1);
                    range.collapse(true);
                  }
                } else if (dir === -1) {
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
        className="p-2 rounded-md bg-input border border-border min-w-12 text-lg"
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