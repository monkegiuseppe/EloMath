// components/math-answer-input.tsx

"use client"

import { useState, useEffect } from 'react';
import { EditableMathField, StaticMathField, addStyles, MathField } from 'react-mathquill';
import { Info, Eye, EyeOff } from 'lucide-react';

// Ensure MathQuill styles are loaded
if (typeof window !== 'undefined') {
  addStyles();
}

interface MathAnswerInputProps {
  value: string;
  onChange: (newValue: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  onOpenGuide?: () => void;
}

export default function MathAnswerInput({ 
  value, 
  onChange, 
  onSubmit,
  disabled = false,
  placeholder = "Your Answer...",
  onOpenGuide
}: MathAnswerInputProps) {
  const [useMathQuill, setUseMathQuill] = useState(false);
  const [latex, setLatex] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  // Convert plain text to latex when switching to MathQuill mode
  useEffect(() => {
    if (useMathQuill && value) {
      // Simple conversion - the user can refine it in MathQuill
      const converted = value
        .replace(/\^/g, '^')
        .replace(/sqrt\(/g, '\\sqrt{')
        .replace(/\)/g, '}')
        .replace(/pi/g, '\\pi')
        .replace(/\*/g, '\\cdot ');
      setLatex(converted);
    }
  }, [useMathQuill]);

  const handleMathFieldChange = (mathField: MathField) => {
    const newLatex = mathField.latex();
    setLatex(newLatex);
    // Convert latex back to plain text format for submission
    const plainText = newLatex
      .replace(/\\frac{([^}]+)}{([^}]+)}/g, '($1)/($2)')
      .replace(/\\sqrt{([^}]+)}/g, 'sqrt($1)')
      .replace(/\\pi/g, 'pi')
      .replace(/\\cdot/g, '*')
      .replace(/\s+/g, '')
      .replace(/[{}]/g, '');
    onChange(plainText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  if (useMathQuill) {
    return (
      <div className="space-y-2">
        <div className="relative">
          <div className="w-full bg-background/80 border-2 border-border rounded-lg p-4 min-h-[60px]">
            <EditableMathField
              latex={latex}
              onChange={handleMathFieldChange}
              config={{
                autoCommands: 'pi theta sqrt',
                autoOperatorNames: 'sin cos tan ln log',
              }}
              className="text-xl"
            />
          </div>
          <div className="absolute right-3 top-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-muted-foreground hover:text-foreground p-1"
              title={showPreview ? "Hide Preview" : "Show Preview"}
            >
              {showPreview ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <button
              type="button"
              onClick={() => setUseMathQuill(false)}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border"
              title="Switch to plain text"
            >
              Plain
            </button>
            {onOpenGuide && (
              <button
                type="button"
                onClick={onOpenGuide}
                className="text-muted-foreground hover:text-foreground p-1"
                title="Formatting Guide"
              >
                <Info size={18} />
              </button>
            )}
          </div>
        </div>
        {showPreview && value && (
          <div className="text-sm text-muted-foreground bg-muted/20 rounded-lg p-2">
            <span className="font-semibold">Plain text: </span>
            <code className="font-mono">{value}</code>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-background/80 border-2 border-border rounded-lg py-3 pr-32 pl-4 text-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/50 focus:border-foreground/80 transition-all disabled:opacity-50"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUseMathQuill(true)}
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border"
            title="Switch to math editor"
          >
            Math
          </button>
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="text-muted-foreground hover:text-foreground p-1"
              title="Formatting Guide"
            >
              <Info size={18} />
            </button>
          )}
        </div>
      </div>
      {showPreview && value && (
        <div className="text-sm bg-muted/20 rounded-lg p-2">
          <span className="font-semibold text-muted-foreground">Preview: </span>
          <StaticMathField>
            {value
              .replace(/\^/g, '^')
              .replace(/sqrt\(/g, '\\sqrt{')
              .replace(/\)/g, '}')
              .replace(/pi/g, '\\pi')
              .replace(/\//g, '\\frac')
            }
          </StaticMathField>
        </div>
      )}
    </div>
  );
}