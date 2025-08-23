// components/cas-math-field.tsx

"use client";

import { useState, useRef, FC } from 'react';
import { EditableMathField, StaticMathField, MathField } from 'react-mathquill';
import { evaluateMath } from '../lib/cas-math';

interface CasMathFieldProps {
  latex: string;
  onChange: (latex: string) => void;
  onDelete: () => void;
  onFocus: (field: MathField) => void;
}

const CasMathField: FC<CasMathFieldProps> = ({ latex, onChange, onFocus, onDelete }) => {
  const [output, setOutput] = useState('');
  const mathFieldRef = useRef<MathField | null>(null);

  const handleEnter = (field: MathField) => {
    // Good practice to have a check here as well.
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
          field.focus();
        }}
        config={{
          handlers: {
            edit: (mathField) => {
              // FIXED: This guard clause is the definitive solution.
              // It ensures we never try to access a property on an undefined object.
              if (mathField) {
                onChange(mathField.latex());
              }
            },
            enter: handleEnter,
            deleteOutOf: () => onDelete(),
            moveOutOf: (dir) => {
              const el = mathFieldRef.current?.el();
              if (!el) return;
              const wrapper = el.closest('.inline-math-wrapper');
              if (!wrapper) return;
              const selection = window.getSelection();
              if (!selection) return;
              const range = document.createRange();
              if (dir < 0) range.setStartBefore(wrapper);
              else range.setStartAfter(wrapper);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            },
          },
        }}
        onFocus={() => {
          if (mathFieldRef.current) {
            onFocus(mathFieldRef.current);
          }
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