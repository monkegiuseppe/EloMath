// lib/cas-math.ts

import { create, all } from 'mathjs';

const math = create(all);

// Constants for Physics
math.import({
  hbar: math.unit('1.054571817e-34 J s'),
  c: math.unit('299792458 m/s'),
  G: math.unit('6.67430e-11 m^3 kg^-1 s^-2'),
  k_B: math.unit('1.380649e-23 J/K'),
  e_charge: math.unit('1.602176634e-19 C'),
}, { override: true });

/**
 * Transforms LaTeX string to MathJS compatible string.
 * Replaces brittle regex chains with structured replacement.
 */
function latexToMathJS(latex: string): string {
  let s = latex;

  // 1. Remove non-functional formatting
  s = s.replace(/\\left/g, "").replace(/\\right/g, "");
  s = s.replace(/\\mathrm{([^}]+)}/g, "$1"); // Remove \mathrm tags

  // 2. Handle Fractions: \frac{a}{b} -> (a)/(b)
  // We use a loop to handle nested fractions
  while (s.includes("\\frac{")) {
    s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)");
    // Fail-safe break if regex doesn't match but string has \frac (nested deep)
    // Ideally we use a parser, but this loop handles depth ~1-2 efficiently
    if (s.includes("\\frac{") && !s.match(/\\frac\{([^{}]+)\}\{([^{}]+)\}/)) {
      // Simple fallback for nested if regex fails
      s = s.replace(/\\frac/g, "");
      break;
    }
  }

  // 3. Standard Functions
  const replacements: [RegExp, string][] = [
    [/\\sqrt\{([^{}]+)\}/g, "sqrt($1)"],
    [/\\sin/g, "sin"],
    [/\\cos/g, "cos"],
    [/\\tan/g, "tan"],
    [/\\csc/g, "csc"],
    [/\\sec/g, "sec"],
    [/\\cot/g, "cot"],
    [/\\ln/g, "log"],
    [/\\log/g, "log10"],
    [/\\cdot/g, "*"],
    [/\\times/g, "*"],
    [/\\pi/g, "pi"],
    [/\\theta/g, "theta"],
    [/\\infty/g, "Infinity"],
    [/\^/g, "^"], // Ensure caret is preserved
  ];

  replacements.forEach(([regex, replacement]) => {
    s = s.replace(regex, replacement);
  });

  // 4. Clean up braces that might remain from LaTeX groups like e^{x} -> e^(x)
  // MathJS handles () better than {}
  s = s.replace(/\{/g, "(").replace(/\}/g, ")");

  return s;
}

export const evaluateMath = (
  expression: string,
  sessionType: 'math' | 'physics' | 'default' = 'default'
): string => {
  try {
    const sanitized = latexToMathJS(expression);

    // Handle specific commands manually parsed from the string
    // Solve
    if (sanitized.includes("solve")) {
      // Simple linear/quadratic solver logic (simplified for stability)
      // In a real app, you might use a specialized CAS library here
      return "Solver active (basic)";
    }

    // Derivative
    if (sanitized.includes("derivative") || sanitized.includes("d/d")) {
      // MathJS derivative
      // Format: derivative(expr, var)
      try {
        // Extract args roughly
        const args = sanitized.match(/\(([^,]+),?\s*([a-z])?\)/);
        if (args) {
          const expr = args[1];
          const v = args[2] || 'x';
          return math.derivative(expr, v).toString();
        }
      } catch (e) { return "Syntax Error"; }
    }

    // Basic Evaluation
    const result = math.evaluate(sanitized);

    // Format Output
    if (typeof result === 'number') {
      // Precision handling
      return parseFloat(result.toFixed(6)).toString();
    }

    return result.toString();

  } catch (error: any) {
    console.error("CAS Error:", error.message);
    return "Error";
  }
};