// components/math-answer-input.tsx

"use client"

import { StaticMathField, addStyles } from 'react-mathquill';
import { Info } from 'lucide-react';

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

// Convert plain text math notation to LaTeX
const convertToLatex = (input: string): string => {
  if (!input) return '';
  
  try {
    let latex = input;
    
    // Step 1: Convert functions and constants FIRST (before handling fractions)
    // Handle trig functions
    latex = latex.replace(/\bsin\b/g, '\\sin');
    latex = latex.replace(/\bcos\b/g, '\\cos');
    latex = latex.replace(/\btan\b/g, '\\tan');
    latex = latex.replace(/\bsec\b/g, '\\sec');
    latex = latex.replace(/\bcsc\b/g, '\\csc');
    latex = latex.replace(/\bcot\b/g, '\\cot');
    
    // Handle log functions
    latex = latex.replace(/\bln\b/g, '\\ln');
    latex = latex.replace(/\blog\b/g, '\\log');
    
    // Handle common constants
    latex = latex.replace(/\bpi\b/gi, '\\pi');
    latex = latex.replace(/\btheta\b/gi, '\\theta');
    
    // Handle sqrt with proper closing
    latex = latex.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
    
    // Step 2: Handle fractions - now that functions are converted to \sin, etc.
    // We need to handle various fraction patterns in the right order (most specific first)
    
    // Pattern 1: (expr)/(expr) - both sides with parens (handles nested parens)
    // The pattern (?:[^()]|\([^)]*\))+ allows for one level of nested parentheses
    latex = latex.replace(/\(((?:[^()]|\([^)]*\))+)\)\s*\/\s*\(((?:[^()]|\([^)]*\))+)\)/g, '\\frac{$1}{$2}');
    
    // Pattern 2c: (function(args))/(function(args)) - BOTH have extra parens (most specific)
    // Matches: (\cos(x))/(\sin(x)), etc.
    latex = latex.replace(/\((\\[a-z]+)\(([^)]+)\)\)\s*\/\s*\((\\[a-z]+)\(([^)]+)\)\)/gi, '\\frac{$1{($2)}}{$3{($4)}}');
    
    // Pattern 2a: function(args)/(function(args)) - second function has extra parens
    // Matches: \cos(x)/(\sin(x)), etc.
    latex = latex.replace(/(\\[a-z]+)\(([^)]+)\)\s*\/\s*\((\\[a-z]+)\(([^)]+)\)\)/gi, '\\frac{$1{($2)}}{$3{($4)}}');
    
    // Pattern 2b: (function(args))/function(args) - first function has extra parens
    // Matches: (\cos(x))/\sin(x), etc.
    latex = latex.replace(/\((\\[a-z]+)\(([^)]+)\)\)\s*\/\s*(\\[a-z]+)\(([^)]+)\)/gi, '\\frac{$1{($2)}}{$3{($4)}}');
    
    // Pattern 2: function(args)/function(args) - BOTH sides are functions, no extra parens
    // Matches: \sin(x)/\cos(x), \ln(x)/\sin(x), etc.
    latex = latex.replace(/(\\[a-z]+)\(([^)]+)\)\s*\/\s*(\\[a-z]+)\(([^)]+)\)/gi, '\\frac{$1{($2)}}{$3{($4)}}');
    
    // Pattern 3: function(args)/number or function(args)/variable
    // Matches: \sin(x)/2, \cos(x)/y, etc.
    latex = latex.replace(/(\\[a-z]+)\(([^)]+)\)\s*\/\s*([a-z0-9^{}]+)/gi, '\\frac{$1{($2)}}{$3}');
    
    // Pattern 3a: function(args)/(expr) - function over complex expression (handles nested parens)
    // Matches: \cos(x)/(\sin(x/2)*2), \sin(x)/(x+1), etc.
    // The pattern (?:[^()]|\([^)]*\))+ allows for one level of nested parentheses
    latex = latex.replace(/(\\[a-z]+)\(([^)]+)\)\s*\/\s*\(((?:[^()]|\([^)]*\))+)\)/gi, '\\frac{$1{($2)}}{$3}');
    
    // Pattern 4: number/function(args) or variable/function(args)
    // Matches: 2/\sin(x), x/\cos(y), etc.
    latex = latex.replace(/([a-z0-9^{}]+)\s*\/\s*(\\[a-z]+)\(([^)]+)\)/gi, '\\frac{$1}{$2{($3)}}');
    
    // Pattern 4a: (expr)/function(args) - complex expression over function (handles nested parens)
    // Matches: (x+1)/\sin(x), (2*cos(x))/\sin(x), etc.
    // The pattern (?:[^()]|\([^)]*\))+ allows for one level of nested parentheses
    latex = latex.replace(/\(((?:[^()]|\([^)]*\))+)\)\s*\/\s*(\\[a-z]+)\(([^)]+)\)/gi, '\\frac{$1}{$2{($3)}}');
    
    // Pattern 5: (expr)/number or (expr)/variable (handles nested parens)
    latex = latex.replace(/\(((?:[^()]|\([^)]*\))+)\)\s*\/\s*([a-z0-9^{}]+)/gi, '\\frac{$1}{$2}');
    
    // Pattern 6: number/(expr) or variable/(expr) (handles nested parens)
    latex = latex.replace(/([a-z0-9^{}]+)\s*\/\s*\(((?:[^()]|\([^)]*\))+)\)/gi, '\\frac{$1}{$2}');
    
    // Pattern 7: Simple fractions a/b (numbers and single variables only)
    // This should be last to avoid breaking more complex patterns
    latex = latex.replace(/([a-z0-9]+(?:\^[{]?[a-z0-9]+[}]?)?)\s*\/\s*([a-z0-9]+(?:\^[{]?[a-z0-9]+[}]?)?)/gi, '\\frac{$1}{$2}');
    
    // Handle multiplication operator
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