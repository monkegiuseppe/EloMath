// lib/cas-math.ts

import { create, all, type MathNode, type OperatorNode } from 'mathjs'

const math = create(all);

// Define physical constants
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

// Helper function to compute numerical derivative at a point
const numericalDerivative = (expr: string, variable: string, point: number, h = 1e-8): number => {
  try {
    const node = math.parse(expr);
    const scope1: any = {};
    const scope2: any = {};
    scope1[variable] = point + h;
    scope2[variable] = point - h;
    const f1 = node.evaluate(scope1);
    const f2 = node.evaluate(scope2);
    return (f1 - f2) / (2 * h);
  } catch {
    return NaN;
  }
};

// Helper function for L'Hôpital's rule
const lHopitalRule = (numerExpr: string, denomExpr: string, variable: string, value: number, maxIterations = 3): number | string => {
  for (let i = 0; i < maxIterations; i++) {
    try {
      // Check if we have 0/0 or inf/inf form
      const numNode = math.parse(numerExpr);
      const denNode = math.parse(denomExpr);
      const scope: any = {};
      scope[variable] = value;
      
      const numVal = numNode.evaluate(scope);
      const denVal = denNode.evaluate(scope);
      
      // If denominator is not zero, evaluate directly
      if (Math.abs(denVal) > 1e-10) {
        const result = numVal / denVal;
        if (isFinite(result)) return result;
      }
      
      // Apply L'Hôpital's rule: differentiate numerator and denominator
      const numDeriv = math.derivative(numNode, variable);
      const denDeriv = math.derivative(denNode, variable);
      
      numerExpr = numDeriv.toString();
      denomExpr = denDeriv.toString();
      
      // Try to evaluate the derivatives
      const numDerivVal = numDeriv.evaluate(scope);
      const denDerivVal = denDeriv.evaluate(scope);
      
      if (Math.abs(denDerivVal) > 1e-10) {
        const result = numDerivVal / denDerivVal;
        if (isFinite(result)) return result;
      }
    } catch {
      break;
    }
  }
  return "Limit does not exist or is too complex";
};

// Helper function to compute definite integral using Simpson's rule
const numericalIntegration = (expr: string, variable: string, lower: number, upper: number, n = 1000): number => {
  try {
    const node = math.parse(expr);
    const h = (upper - lower) / n;
    let sum = 0;
    
    for (let i = 0; i <= n; i++) {
      const x = lower + i * h;
      const scope: any = {};
      scope[variable] = x;
      const y = node.evaluate(scope);
      
      if (i === 0 || i === n) {
        sum += y;
      } else if (i % 2 === 1) {
        sum += 4 * y;
      } else {
        sum += 2 * y;
      }
    }
    
    return (h / 3) * sum;
  } catch {
    return NaN;
  }
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
      // Handle integration symbols
      .replace(/\\int/g, 'integrate')
      .replace(/\\sum/g, 'sum')
      .replace(/\\prod/g, 'product')
      .replace(/\\lim/g, 'limit')
      .replace(/\\infty/g, 'Infinity')
      .replace(/∞/g, 'Infinity')
      .replace(/\\to/g, '->')
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
      // Handle Greek letters
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\delta/g, 'δ')
      .replace(/\\epsilon/g, 'ε')
      .replace(/\\zeta/g, 'ζ')
      .replace(/\\eta/g, 'η')
      .replace(/\\theta/g, 'θ')
      .replace(/\\lambda/g, 'λ')
      .replace(/\\mu/g, 'μ')
      .replace(/\\nu/g, 'ν')
      .replace(/\\xi/g, 'ξ')
      .replace(/\\rho/g, 'ρ')
      .replace(/\\sigma/g, 'σ')
      .replace(/\\tau/g, 'τ')
      .replace(/\\phi/g, 'φ')
      .replace(/\\chi/g, 'χ')
      .replace(/\\psi/g, 'ψ')
      .replace(/\\omega/g, 'ω')
      // NOW remove remaining curly braces (for exponents, etc.)
      .replace(/\{/g, '')
      .replace(/\}/g, '');

    sanitizedExpr = addImplicitMultiplication(sanitizedExpr);
    console.log('Sanitized expression:', sanitizedExpr);

    // Handle integration
    const integralMatch = sanitizedExpr.match(/^integrate\(([^,]+)(?:,\s*([a-z]))?\)$/i);
    if (integralMatch) {
      const expr = integralMatch[1].trim();
      const variable = integralMatch[2]?.trim() || 'x';
      
      try {
        // Try symbolic integration for simple cases
        const node = math.parse(expr);
        
        // Simple polynomial integration
        if (expr.match(/^[x\d\s\+\-\*\^\/]+$/)) {
          const simplified = math.simplify(node);
          const terms = simplified.toString().split(/(?=[+-])/);
          let result = '';
          
          for (const term of terms) {
            const cleanTerm = term.replace(/\s/g, '');
            // Handle x^n terms
            const powerMatch = cleanTerm.match(/([+-]?\d*\.?\d*)\*?x\^([+-]?\d+\.?\d*)/);
            if (powerMatch) {
              const coef = parseFloat(powerMatch[1] || '1');
              const power = parseFloat(powerMatch[2]);
              const newPower = power + 1;
              const newCoef = coef / newPower;
              result += `${newCoef >= 0 && result ? '+' : ''}${newCoef}x^{${newPower}}`;
            }
            // Handle x terms
            else if (cleanTerm.includes('x')) {
              const coefMatch = cleanTerm.match(/([+-]?\d*\.?\d*)\*?x/);
              const coef = parseFloat(coefMatch?.[1] || '1');
              const newCoef = coef / 2;
              result += `${newCoef >= 0 && result ? '+' : ''}${newCoef}x^2`;
            }
            // Handle constants
            else {
              const constant = parseFloat(cleanTerm);
              if (!isNaN(constant)) {
                result += `${constant >= 0 && result ? '+' : ''}${constant}x`;
              }
            }
          }
          
          return result + ' + C';
        }
        
        // For trigonometric and other functions
        const integralRules: { [key: string]: string } = {
          'sin(x)': '-cos(x)',
          'cos(x)': 'sin(x)',
          'tan(x)': '-ln(abs(cos(x)))',
          'sec(x)^2': 'tan(x)',
          'csc(x)^2': '-cot(x)',
          'sec(x)*tan(x)': 'sec(x)',
          'csc(x)*cot(x)': '-csc(x)',
          'e^x': 'e^x',
          '1/x': 'ln(abs(x))',
        };
        
        for (const [pattern, integral] of Object.entries(integralRules)) {
          if (expr.replace(/\s/g, '') === pattern.replace(/\s/g, '')) {
            return integral + ' + C';
          }
        }
        
        return `∫(${expr})d${variable}`;
      } catch (error: any) {
        return `Error: ${error.message}`;
      }
    }

    // Handle definite integration
    const definiteIntegralMatch = sanitizedExpr.match(/^integrate\(([^,]+),\s*([a-z]),\s*([^,]+),\s*([^)]+)\)$/i);
    if (definiteIntegralMatch) {
      const expr = definiteIntegralMatch[1].trim();
      const variable = definiteIntegralMatch[2].trim();
      const lower = parseFloat(definiteIntegralMatch[3].trim());
      const upper = parseFloat(definiteIntegralMatch[4].trim());
      
      if (!isNaN(lower) && !isNaN(upper)) {
        const result = numericalIntegration(expr, variable, lower, upper);
        if (!isNaN(result)) {
          return result.toFixed(6);
        }
      }
      return "Error: Invalid integration bounds";
    }

    // Handle summation
    const sumMatch = sanitizedExpr.match(/^sum\(([^,]+),\s*([a-z]),\s*(\d+),\s*(\d+)\)$/i);
    if (sumMatch) {
      const expr = sumMatch[1].trim();
      const variable = sumMatch[2].trim();
      const start = parseInt(sumMatch[3]);
      const end = parseInt(sumMatch[4]);
      
      try {
        const node = math.parse(expr);
        let sum = 0;
        
        for (let i = start; i <= end; i++) {
          const scope: any = {};
          scope[variable] = i;
          sum += node.evaluate(scope);
        }
        
        return String(sum);
      } catch (error: any) {
        return `Error: ${error.message}`;
      }
    }

    // Handle product
    const prodMatch = sanitizedExpr.match(/^product\(([^,]+),\s*([a-z]),\s*(\d+),\s*(\d+)\)$/i);
    if (prodMatch) {
      const expr = prodMatch[1].trim();
      const variable = prodMatch[2].trim();
      const start = parseInt(prodMatch[3]);
      const end = parseInt(prodMatch[4]);
      
      try {
        const node = math.parse(expr);
        let product = 1;
        
        for (let i = start; i <= end; i++) {
          const scope: any = {};
          scope[variable] = i;
          product *= node.evaluate(scope);
        }
        
        return String(product);
      } catch (error: any) {
        return `Error: ${error.message}`;
      }
    }

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
        // For expand, we use simplify with specific rules
        const expanded = math.simplify(node.toString());
        // Try to expand manually for common patterns
        const expandedStr = expanded.toString()
          .replace(/\((.*?)\)\^2/g, (match, p1) => {
            // Expand (a+b)^2 style expressions
            const terms = p1.split(/[+-]/).filter(Boolean);
            if (terms.length === 2) {
              return `(${p1})*(${p1})`;
            }
            return match;
          });
        const result = math.parse(expandedStr);
        const simplified = math.simplify(result);
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

    // Enhanced limit handling
    const limitMatch = sanitizedExpr.match(/^limit\(([^,]+),\s*([a-z]+)\s*->\s*([^)]+)\)$/i);
    if (limitMatch) {
      try {
        const expr = limitMatch[1].trim();
        const variable = limitMatch[2].trim();
        const valueStr = limitMatch[3].trim();
        
        let value: number;
        if (valueStr === 'Infinity' || valueStr === 'inf' || valueStr === 'infinity' || valueStr === '\\infty') {
          value = Infinity;
        } else if (valueStr === '-Infinity' || valueStr === '-inf' || valueStr === '-infinity' || valueStr === '-\\infty') {
          value = -Infinity;
        } else {
          value = parseFloat(valueStr);
        }
        
        const node = math.parse(expr);
        
        // For finite limits, try direct evaluation first
        if (isFinite(value)) {
          const scope: any = {};
          scope[variable] = value;
          
          try {
            const directResult = node.evaluate(scope);
            if (isFinite(directResult)) {
              return directResult.toFixed(6);
            }
          } catch {
            // Direct evaluation failed, try other methods
          }
          
          // Check for 0/0 form (indeterminate)
          // Try to identify if it's a fraction
          const fractionMatch = expr.match(/^\(([^)]+)\)\/\(([^)]+)\)$/);
          if (fractionMatch) {
            const numerator = fractionMatch[1];
            const denominator = fractionMatch[2];
            
            const result = lHopitalRule(numerator, denominator, variable, value);
            if (typeof result === 'number') {
              return result.toFixed(6);
            }
            return result;
          }
          
          // Try approaching from both sides for continuity check
          const h = 1e-8;
          const scopeLeft: any = {};
          const scopeRight: any = {};
          scopeLeft[variable] = value - h;
          scopeRight[variable] = value + h;
          
          try {
            const leftLimit = node.evaluate(scopeLeft);
            const rightLimit = node.evaluate(scopeRight);
            
            if (Math.abs(leftLimit - rightLimit) < 1e-6) {
              return ((leftLimit + rightLimit) / 2).toFixed(6);
            }
          } catch {
            // Approaching from sides failed
          }
        }
        
        // For infinite limits
        if (!isFinite(value)) {
          // Try substituting large values
          const largeValue = value > 0 ? 1e10 : -1e10;
          const scope: any = {};
          scope[variable] = largeValue;
          
          try {
            const result = node.evaluate(scope);
            if (Math.abs(result) < 1e-10) return "0";
            if (!isFinite(result)) {
              return value > 0 ? "∞" : "-∞";
            }
            return result.toFixed(6);
          } catch {
            return "Limit does not exist";
          }
        }
        
        return "Limit is too complex to evaluate";
      } catch (error: any) {
        return `Error: ${error.message}`;
      }
    }

    // Enhanced solve function (kept from original)
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