// lib/cas-math.ts

import { create, all, MathNode, OperatorNode } from 'mathjs' // Import OperatorNode

const math = create(all);

math.import({
  hbar: math.unit('1.054571817e-34 J s'),
  c: math.unit('299792458 m/s'),
  G: math.unit('6.67430e-11 m^3 kg^-1 s^-2'),
  k_B: math.unit('1.380649e-23 J/K'),
  e: math.unit('1.602176634e-19 C'),
}, { override: true });

interface RationalizeResult {
  coefficients: number[];
  variables: string[];
  expression: MathNode;
}

export const evaluateMath = (
  expression: string,
  sessionType: 'math' | 'physics' | 'default' = 'default'
): string => {
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

    const solveMatch = sanitizedExpr.match(/^solve\(([^,]+),([^)]+)\)/);
    if (solveMatch) {
      if (sessionType === 'math') {
        return "Error: solve() is disabled during math practice.";
      }
      
      let equation = solveMatch[1].trim();
      const variable = solveMatch[2].trim();

      if (equation.includes('=')) {
        const parts = equation.split('=');
        equation = `${parts[0].trim()} - (${parts.slice(1).join('=').trim()})`;
      }
      
      const simplified = math.simplify(equation);
      
      let expressionToSolve: MathNode | string = simplified;

      // *** THIS IS THE FIX ***
      // Use a type guard to check if the simplified node is an OperatorNode.
      if ('isOperatorNode' in simplified && (simplified as OperatorNode).op === '/') {
        expressionToSolve = (simplified as OperatorNode).args[0];
      }

      const poly = math.rationalize(expressionToSolve, {}, true) as RationalizeResult;

      if (poly.variables.length > 1 || (poly.variables.length > 0 && poly.variables[0] !== variable)) {
        return "Error: Can only solve for the specified variable.";
      }
      
      if (poly.coefficients.length === 0) return "Error: Could not find coefficients.";
      
      const coeffs = poly.coefficients.reverse();
      
      if (coeffs.length === 3) { // Quadratic
        const [a, b, c] = coeffs;
        const discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return "No real roots";
        
        const root1 = math.simplify(`(-${b} + sqrt(${discriminant})) / (2 * ${a})`);
        const root2 = math.simplify(`(-${b} - sqrt(${discriminant})) / (2 * ${a})`);
        if (root1.equals(root2)) return root1.toTex();
        return `${root1.toTex()}, ${root2.toTex()}`;
      }
      else if (coeffs.length === 2) { // Linear
        const [a, b] = coeffs;
        if (a === 0) return "Invalid linear equation";
        const root = math.simplify(`${-b} / ${a}`);
        return root.toTex();
      }
       else if (coeffs.length === 1) {
        return coeffs[0] === 0 ? "All real numbers" : "No solution";
      }
      
      return "Solver only supports linear and quadratic equations.";
    }
      
    const result = math.evaluate(sanitizedExpr);
    
    return result.toTex ? result.toTex() : String(result);

  } catch (error: any) {
    return `Error: ${error.message}`;
  }
};