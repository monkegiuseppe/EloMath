// components/math-answer-input.tsx

"use client"

import { StaticMathField, addStyles } from 'react-mathquill';
import { Info } from 'lucide-react';

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

const convertToLatex = (input: string): string => {
  if (!input) return '';

  try {
    let latex = input;

    latex = latex.replace(/\bsin\b/g, '\\sin');
    latex = latex.replace(/\bcos\b/g, '\\cos');
    latex = latex.replace(/\btan\b/g, '\\tan');
    latex = latex.replace(/\bsec\b/g, '\\sec');
    latex = latex.replace(/\bcsc\b/g, '\\csc');
    latex = latex.replace(/\bcot\b/g, '\\cot');

    latex = latex.replace(/\bln\b/g, '\\ln');
    latex = latex.replace(/\blog\b/g, '\\log');

    latex = latex.replace(/\bpi\b/gi, '\\pi');
    latex = latex.replace(/\btheta\b/gi, '\\theta');

    latex = latex.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');

    latex = latex.replace(/\(((?:[^()]|\([^)]*\))+)\)\s*\/\s*\(((?:[^()]|\([^)]*\))+)\)/g, '\\frac{$1}{$2}');

    latex = latex.replace(/\((\\[a-z]+)\(([^)]+)\)\)\s*\/\s*\((\\[a-z]+)\(([^)]+)\)\)/gi, '\\frac{$1{($2)}}{$3{($4)}}');
    latex = latex.replace(/\((\\[a-z]+)\(([^)]+)\)\)\s*\/\s*\((\\[a-z]+)\(([^)]+)\)\)/gi, '\\frac{$1{($2)}}{$3{($4)}}');

    latex = latex.replace(/(\\[a-z]+)\(([^)]+)\)\s*\/\s*\((\\[a-z]+)\(([^)]+)\)\)/gi, '\\frac{$1{($2)}}{$3{($4)}}');

    latex = latex.replace(/\((\\[a-z]+)\(([^)]+)\)\)\s*\/\s*\((\\[a-z]+)\(([^)]+)\)\)/gi, '\\frac{$1{($2)}}{$3{($4)}}');
    latex = latex.replace(/\((\\[a-z]+)\(([^)]+)\)\)\s*\/\s*(\\[a-z]+)\(([^)]+)\)/gi, '\\frac{$1{($2)}}{$3{($4)}}');

    latex = latex.replace(/(\\[a-z]+)\(([^)]+)\)\s*\/\s*(\\[a-z]+)\(([^)]+)\)/gi, '\\frac{$1{($2)}}{$3{($4)}}');

    latex = latex.replace(/(\\[a-z]+)\(([^)]+)\)\s*\/\s*([a-z0-9^{}]+)/gi, '\\frac{$1{($2)}}{$3}');

    latex = latex.replace(/(\\[a-z]+)\(([^)]+)\)\s*\/\s*\(((?:[^()]|\([^)]*\))+)\)/gi, '\\frac{$1{($2)}}{$3}');

    latex = latex.replace(/([a-z0-9^{}]+)\s*\/\s*(\\[a-z]+)\(([^)]+)\)/gi, '\\frac{$1}{$2{($3)}}');
    latex = latex.replace(/([a-z0-9^{}]+)\s*\/\s*(\\[a-z]+)\(([^)]+)\)/gi, '\\frac{$1}{$2{($3)}}');

    latex = latex.replace(/\(((?:[^()]|\([^)]*\))+)\)\s*\/\s*(\\[a-z]+)\(([^)]+)\)/gi, '\\frac{$1}{$2{($3)}}');
    latex = latex.replace(/\(((?:[^()]|\([^)]*\))+)\)\s*\/\s*(\\[a-z]+)\(([^)]+)\)/gi, '\\frac{$1}{$2{($3)}}');

    latex = latex.replace(/\(((?:[^()]|\([^)]*\))+)\)\s*\/\s*([a-z0-9^{}]+)/gi, '\\frac{$1}{$2}');

    latex = latex.replace(/([a-z0-9^{}]+)\s*\/\s*\(((?:[^()]|\([^)]*\))+)\)/gi, '\\frac{$1}{$2}');

    latex = latex.replace(/([a-z0-9]+(?:\^[{]?[a-z0-9]+[}]?)?)\s*\/\s*([a-z0-9]+(?:\^[{]?[a-z0-9]+[}]?)?)/gi, '\\frac{$1}{$2}');

    latex = latex.replace(/\*/g, '\\cdot ');

    return latex;
  } catch (e) {
    return input;
  }
};

export default function MathAnswerInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Your Answer...",
  onOpenGuide
}: MathAnswerInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

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
          className="w-full bg-background/80 border-2 border-border rounded-lg py-3 pr-12 pl-4 text-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/50 focus:border-foreground/80 transition-all disabled:opacity-50"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
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
      {value && (
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="text-sm flex items-center gap-2">
            <span className="font-semibold text-muted-foreground">Rendered:</span>
            <div className="flex-1">
              <StaticMathField>{convertToLatex(value)}</StaticMathField>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}