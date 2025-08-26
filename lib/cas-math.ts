// lib/cas-math.ts

import { create, all, MathNode } from 'mathjs'

const math = create(all);

math.import({
  hbar: math.unit('1.054571817e-34 J s'),
  c: math.unit('299792458 m/s'),
  G: math.unit('6.67430e-11 m^3 kg^-1 s^-2'),
  k_B: math.unit('1.380649e-23 J/K'),
  e: math.unit('1.602176634e-19 C'),
}, { override: true });

// ADDED: A type definition to correctly handle the output of rationalize
interface RationalizeResult {
  coefficients: number[];
  variables: string[];
  expression: MathNode;
}

export const evaluateMath = (expression: string): string => {
  try {
    let sanitizedExpr = expression
      .replace(/\\sqrt/g, 'sqrt')
      .replace(/\\pi/g, 'pi')
      .replace(/\\hbar/g, 'hbar')
      .replace(/\\cdot/g, '*')
      .replace(/\\left\(/g, '(')
      .replace(/\\right\)/g, ')')
      .replace(/\{/g, '(')
      .replace(/\}/g, ')');

    // REWRITTEN: This logic now correctly solves linear and quadratic equations.
    const solveMatch = sanitizedExpr.match(/^solve\(([^,]+),([^)]+)\)/);
    if (solveMatch) {
      let equation = solveMatch[1].trim();
      const variable = solveMatch[2].trim();

      if (equation.includes('=')) {
        const parts = equation.split('=');
        equation = `${parts[0].trim()} - (${parts.slice(1).join('=').trim()})`;
      }
      
      const simplified = math.simplify(equation);
      const poly = math.rationalize(simplified, {}, true) as RationalizeResult;

      if (poly.variables.length > 1 || poly.variables[0] !== variable) {
        return "Error: Can only solve for one variable.";
      }

      const coeffs = poly.coefficients.reverse(); // From [c, b, a] to [a, b, c]
      
      // Solve Quadratic: ax^2 + bx + c = 0
      if (coeffs.length === 3) {
        const [a, b, c] = coeffs;
        const discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return "No real roots";
        
        const root1 = math.simplify(`(-${b} + sqrt(${discriminant})) / (2 * ${a})`);
        const root2 = math.simplify(`(-${b} - sqrt(${discriminant})) / (2 * ${a})`);
        return `${root1.toTex()}, ${root2.toTex()}`;
      }
      // Solve Linear: ax + b = 0
      else if (coeffs.length === 2) {
        const [a, b] = coeffs;
        const root = math.simplify(`${-b} / ${a}`);
        return root.toTex();
      }
      
      return "Solver only supports linear and quadratic equations.";
    }
      
    const result = math.evaluate(sanitizedExpr);
    
    return result.toTex ? result.toTex() : String(result);

  } catch (error: any) {
    return `Error: ${error.message}`;
  }
};