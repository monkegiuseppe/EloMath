// lib/cas-math.ts

import { create, all, type MathNode, type OperatorNode } from 'mathjs'

const math = create(all);

math.import({
  hbar: math.unit('1.054571817e-34 J s'),
  c: math.unit('299792458 m/s'),
  G: math.unit('6.67430e-11 m^3 kg^-1 s^-2'),
  k_B: math.unit('1.380649e-23 J/K'),
  e_charge: math.unit('1.602176634e-19 C'),
}, { override: true });

// Helper function to add explicit multiplication where needed
const addImplicitMultiplication = (expr: string): string => {
  // Add * between number and letter: 2x -> 2*x, 25x -> 25*x
  expr = expr.replace(/(\d)([a-z])/gi, '$1*$2');
  // Add * between ) and (: )(  -> )*(
  expr = expr.replace(/\)\s*\(/g, ')*(');
  // Add * between ) and letter: )x -> )*x
  expr = expr.replace(/\)([a-z])(?![a-z]*\()/gi, ')*$1');
  
  return expr;
};

export const evaluateMath = (
  expression: string,
  sessionType: 'math' | 'physics' | 'default' = 'default'
): string => {
  console.log('evaluateMath called with:', expression);
  
  try {
    let sanitizedExpr = expression
      // Handle \operatorname{functionname} -> functionname
      .replace(/\\operatorname\{([^}]+)\}/g, '$1')
      // Convert \sqrt{...} to sqrt(...) BEFORE removing all curly braces
      .replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)')
      // Handle other LaTeX commands
      .replace(/\\pi/g, 'pi')
      .replace(/\\hbar/g, 'hbar')
      .replace(/\\cdot/g, '*')
      .replace(/\\times/g, '*')
      .replace(/\\div/g, '/')
      .replace(/\\left\(/g, '(')
      .replace(/\\right\)/g, ')')
      .replace(/\\left\|/g, 'abs(')
      .replace(/\\right\|/g, ')')
      .replace(/\\int/g, 'integrate')
      // NOW remove remaining curly braces (for exponents, etc.)
      .replace(/\{/g, '')
      .replace(/\}/g, '');

    sanitizedExpr = addImplicitMultiplication(sanitizedExpr);
    console.log('Sanitized expression:', sanitizedExpr);

    // Handle derivative
    const derivativeMatch = sanitizedExpr.match(/^(?:d\/d([a-z])|derivative)\(([^,]+)(?:,\s*([a-z]))?\)/i);
    if (derivativeMatch) {
      const variable = derivativeMatch[1] || derivativeMatch[3] || 'x';
      const expr = derivativeMatch[2].trim();
      
      try {
        const node = math.parse(expr);
        const derivative = math.derivative(node, variable);
        const simplified = math.simplify(derivative);
        return simplified.toTex();
      } catch (error: any) {
        return `Error: ${error.message}`;
      }
    }

    // Handle simplify
    const simplifyMatch = sanitizedExpr.match(/^simplify\((.+)\)$/i);
    if (simplifyMatch) {
      try {
        const expr = simplifyMatch[1].trim();
        const node = math.parse(expr);
        const simplified = math.simplify(node);
        return simplified.toTex();
      } catch (error: any) {
        return `Error: ${error.message}`;
      }
    }

    // Handle expand
    const expandMatch = sanitizedExpr.match(/^expand\((.+)\)$/i);
    if (expandMatch) {
      try {
        const expr = expandMatch[1].trim();
        const node = math.parse(expr);
        const simplified = math.simplify(node);
        return simplified.toTex();
      } catch (error: any) {
        return `Error: ${error.message}`;
      }
    }

    // Handle factor
    const factorMatch = sanitizedExpr.match(/^factor\((.+)\)$/i);
    if (factorMatch) {
      try {
        const expr = factorMatch[1].trim();
        const node = math.parse(expr);
        const result = math.rationalize(node);
        return result.toTex ? result.toTex() : result.toString();
      } catch (error: any) {
        return `Error: ${error.message}`;
      }
    }

    // Enhanced solve function
    const solveMatch = sanitizedExpr.match(/^solve\(([^,]+),\s*([a-z]+)\)/i);
    if (solveMatch) {
      console.log('Solve match found:', solveMatch);
      let equation = solveMatch[1].trim();
      const variable = solveMatch[2].trim();

      // Convert equation format
      if (equation.includes('=')) {
        const parts = equation.split('=');
        equation = `(${parts[0].trim()}) - (${parts[1].trim()})`;
      }
      
      console.log('Equation to solve:', equation, 'for variable:', variable);
      
      try {
        const parsed = math.parse(equation);
        console.log('Parsed equation:', parsed.toString());
        
        const simplified = math.simplify(parsed);
        console.log('Simplified equation:', simplified.toString());
        
        // Evaluate coefficients manually
        const scope0: any = {};
        scope0[variable] = 0;
        
        let c: number, b: number, a2: number;
        
        try {
          c = Number(simplified.evaluate(scope0));
          console.log('c (constant term):', c);
          
          if (!isFinite(c)) {
            return "Cannot solve: Equation contains division by zero or undefined values";
          }
        } catch (e) {
          return "Cannot solve: Unable to evaluate equation at x=0";
        }
        
        try {
          const d1 = math.derivative(simplified, variable);
          b = Number(d1.evaluate(scope0));
          console.log('b (linear coefficient):', b);
          
          if (!isFinite(b)) {
            return "Cannot solve: Transcendental equation (contains sqrt, log, trig, etc.)";
          }
        } catch (e) {
          return "Cannot solve: Unable to compute first derivative";
        }
        
        try {
          const d1 = math.derivative(simplified, variable);
          const d2 = math.derivative(d1, variable);
          a2 = Number(d2.evaluate(scope0));
          console.log('a2 (quadratic coefficient * 2):', a2);
          
          if (!isFinite(a2)) {
            return "Cannot solve: Transcendental equation (contains sqrt, log, trig, etc.)";
          }
        } catch (e) {
          // If we can't compute second derivative, assume it's 0
          a2 = 0;
        }
        
        // Quadratic equation: a*x^2 + b*x + c = 0
        if (Math.abs(a2) > 1e-10) {
          const a = a2 / 2;
          console.log('Quadratic equation with a:', a, 'b:', b, 'c:', c);
          
          const discriminant = b * b - 4 * a * c;
          console.log('Discriminant:', discriminant);
          
          if (discriminant < 0) {
            return "No real solutions";
          }
          
          const sqrtDisc = Math.sqrt(discriminant);
          const root1 = (-b + sqrtDisc) / (2 * a);
          const root2 = (-b - sqrtDisc) / (2 * a);
          
          console.log('Roots:', root1, root2);
          
          // Format roots
          const formatRoot = (val: number): string => {
            if (!isFinite(val)) return "undefined";
            if (Math.abs(val) < 1e-10) return "0";
            if (Math.abs(val - Math.round(val)) < 1e-6) return String(Math.round(val));
            return val.toFixed(3);
          };
          
          if (Math.abs(root1 - root2) < 1e-10) {
            const result = formatRoot(root1);
            console.log('Single root result:', result);
            return result;
          }
          
          const result = `${formatRoot(root1)}, ${formatRoot(root2)}`;
          console.log('Two roots result:', result);
          return result;
        }
        // Linear equation: b*x + c = 0
        else if (Math.abs(b) > 1e-10) {
          console.log('Linear equation');
          const root = -c / b;
          
          if (!isFinite(root)) {
            return "No solution (division by zero)";
          }
          
          const result = Math.abs(root) < 1e-10 ? "0" : Math.abs(root - Math.round(root)) < 1e-6 ? String(Math.round(root)) : root.toFixed(3);
          console.log('Linear root result:', result);
          return result;
        }
        // Constant equation
        else {
          const result = Math.abs(c) < 1e-10 ? "All real numbers" : "No solution";
          console.log('Constant equation result:', result);
          return result;
        }
        
      } catch (error: any) {
        console.error('Error in solve:', error);
        return `Error: ${error.message}`;
      }
    }

    // Handle limit
    const limitMatch = sanitizedExpr.match(/^limit\(([^,]+),\s*([a-z]+)\s*->\s*([^)]+)\)/i);
    if (limitMatch) {
      try {
        const expr = limitMatch[1].trim();
        const variable = limitMatch[2].trim();
        const value = limitMatch[3].trim();
        
        const node = math.parse(expr);
        
        const scope: any = {};
        if (value === 'inf' || value === 'infinity') {
          scope[variable] = Infinity;
        } else {
          scope[variable] = parseFloat(value);
        }
        const result = node.evaluate(scope);
        if (isFinite(result as number)) {
          return String((result as number).toFixed(6));
        }
        
        return "Limit requires L'Hôpital's rule";
      } catch (error: any) {
        return `Error: ${error.message}`;
      }
    }
      
    // Regular expression evaluation
    const result = math.evaluate(sanitizedExpr);
    console.log('Evaluation result:', result);
    
    // Format the result
    if (result && typeof result === 'object' && 'toTex' in result && typeof result.toTex === 'function') {
      return result.toTex();
    } else if (typeof result === 'number') {
      if (Math.abs(result) < 1e-10) return '0';
      if (Math.abs(result - Math.round(result)) < 1e-10) return String(Math.round(result));
      return result.toFixed(6);
    } else {
      return String(result);
    }

  } catch (error: any) {
    console.error('Error in evaluateMath:', error);
    let errorMsg = error.message || 'Unknown error';
    errorMsg = errorMsg
      .replace(/Undefined symbol/i, 'Unknown variable')
      .replace(/Unexpected token/i, 'Syntax error');
    
    return `Error: ${errorMsg}`;
  }
};