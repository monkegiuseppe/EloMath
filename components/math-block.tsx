// components/math-block.tsx

"use client";

import { useState, useRef, FC } from 'react';
// MODIFIED: Import the MathField type for better type safety
import { EditableMathField, StaticMathField, MathField } from 'react-mathquill';
import { Play } from 'lucide-react';
import { evaluateMath } from '../lib/cas-math';

interface MathBlockProps {
  initialValue: string;
  onUpdate: (value: string) => void;
  onFocus: (mathField: MathField) => void;
}

const MathBlock: FC<MathBlockProps> = ({ initialValue, onUpdate, onFocus }) => {
  const [output, setOutput] = useState('');
  const mathFieldRef = useRef<MathField | null>(null);

  const handleRun = () => {
    const latex = mathFieldRef.current?.latex() || '';
    if (latex) {
      const result = evaluateMath(latex);
      setOutput(result);
    }
  };

  return (
    <div className="my-2 p-2 bg-muted/30 rounded-lg flex items-center gap-2">
      <div className="flex-grow">
        <EditableMathField
          latex={initialValue}
          // The `onChange` prop provides the mathField instance directly
          onChange={(mathField) => {
            onUpdate(mathField.latex());
          }}
          mathquillDidMount={(mathField) => {
            // We still need the ref for the "Run" button
            mathFieldRef.current = mathField;
          }}
          // FIXED: Use the standard onFocus prop here
          onFocus={() => {
            if (mathFieldRef.current) {
              onFocus(mathFieldRef.current);
            }
          }}
          // REMOVED: The incorrect `handlers` object that was causing the error
          className="w-full p-2 rounded-md bg-input border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-ring"
        />
        {output && (
          <div className="mt-2 pl-2 flex items-center gap-2 text-lg">
            <span className="text-primary">=</span>
            <StaticMathField>{output}</StaticMathField>
          </div>
        )}
      </div>
      <button
        onClick={handleRun}
        title="Evaluate Expression"
        className="p-2 bg-primary/80 text-primary-foreground rounded-full hover:bg-primary transition-colors"
      >
        <Play size={20} />
      </button>
    </div>
  );
};

export default MathBlock;