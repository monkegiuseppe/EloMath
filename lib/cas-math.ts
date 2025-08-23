// lib/cas-math.ts

import { create, all } from 'mathjs'

const math = create(all);

math.import({
  hbar: math.unit('1.054571817e-34 J s'),
  c: math.unit('299792458 m/s'),
  G: math.unit('6.67430e-11 m^3 kg^-1 s^-2'),
  k_B: math.unit('1.380649e-23 J/K'),
  e: math.unit('1.602176634e-19 C'),
}, { override: true });

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

    // FIXED: Intelligent equation handling for functions like solve()
    // This checks if the expression is a function call containing an equals sign.
    const solveMatch = sanitizedExpr.match(/solve\((.*)=([^,]+),([^)]+)\)/);
    if (solveMatch) {
      const lhs = solveMatch[1].trim();
      const rhs = solveMatch[2].trim();
      const variable = solveMatch[3].trim();
      // Rewrite `solve(LHS = RHS, var)` to `solve(LHS - (RHS), var)`
      sanitizedExpr = `solve(${lhs} - (${rhs}), ${variable})`;
    }
      
    const result = math.evaluate(sanitizedExpr);
    
    return result.toTex ? result.toTex() : String(result);

  } catch (error: any) {
    return `Error: ${error.message}`;
  }
};