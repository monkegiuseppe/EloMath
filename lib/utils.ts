import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { create, all } from 'mathjs'

const math = create(all)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// lib/utils.ts

const evaluateExpression = (str: string): number => {
  try {
    // Handle simple fractions
    if (str.includes("/") && !str.match(/[a-zA-Z]/)) {
      const parts = str.split("/");
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den;
      }
    }
    // Handle simple numbers
    const simpleFloat = parseFloat(str);
    if (!isNaN(simpleFloat) && !str.match(/[a-zA-Z^√π]/)) {
      return simpleFloat;
    }

    // Handle more complex expressions
    const expression = str
      .replace(/π/g, "Math.PI")
      .replace(/√/g, "Math.sqrt")
      .replace(/\^/g, "**")
      .replace(/e/g, "Math.E");
      
    // Use Function constructor for safe evaluation
    return new Function("return " + expression)();
  } catch (e) {
    return NaN;
  }
};

/**
 * Compare two algebraic expressions symbolically using mathjs
 */
const compareAlgebraicExpressions = (expr1: string, expr2: string): boolean => {
  try {
    // Clean up the expressions
    const clean1 = expr1.replace(/\s/g, '');
    const clean2 = expr2.replace(/\s/g, '');
    
    // Parse both expressions
    const node1 = math.parse(clean1);
    const node2 = math.parse(clean2);
    
    // Simplify both expressions
    const simplified1 = math.simplify(node1);
    const simplified2 = math.simplify(node2);
    
    // Compare the simplified expressions
    const diff = math.simplify(math.parse(`(${simplified1}) - (${simplified2})`));
    
    // If the difference simplifies to 0, they're equal
    return diff.toString() === '0';
  } catch (e) {
    return false;
  }
};

/**
 * Test if two expressions are equivalent by substituting test values
 */
const testEquivalence = (expr1: string, expr2: string): boolean => {
  try {
    const clean1 = expr1.replace(/\s/g, '');
    const clean2 = expr2.replace(/\s/g, '');
    
    // Find all variables in both expressions
    const vars1 = clean1.match(/[a-z]/gi) || [];
    const vars2 = clean2.match(/[a-z]/gi) || [];
    const allVars = [...new Set([...vars1, ...vars2])].filter(v => v !== 'e' && v !== 'pi');
    
    if (allVars.length === 0) return false;
    
    // Test with multiple values
    const testValues = [0, 1, -1, 2, -2, 0.5, 3, -3, 10];
    
    for (const testVal of testValues) {
      const scope: Record<string, number> = {};
      allVars.forEach(v => scope[v] = testVal);
      
      try {
        const result1 = math.evaluate(clean1, scope);
        const result2 = math.evaluate(clean2, scope);
        
        // Skip if either result is undefined, infinity, or NaN
        if (!isFinite(result1) || !isFinite(result2)) continue;
        
        // Compare with tolerance
        if (Math.abs(result1 - result2) > 0.001) {
          return false;
        }
      } catch (e) {
        continue;
      }
    }
    
    return true;
  } catch (e) {
    return false;
  }
};

export const isAnswerCorrect = (userAnswer: string, correctAnswer: string | number): boolean => {
  const cleanUserAnswer = userAnswer.trim();
  const cleanCorrectAnswer = String(correctAnswer).trim();

  // First, try direct string comparison (fast path for exact matches)
  if (cleanUserAnswer.replace(/[\s]/g, '').toLowerCase() === 
      cleanCorrectAnswer.replace(/[\s]/g, '').toLowerCase()) {
    return true;
  }

  // Try numeric evaluation first
  const userNum = evaluateExpression(cleanUserAnswer);
  const correctNum = evaluateExpression(cleanCorrectAnswer);

  // Compare as numbers if both are valid numbers
  if (!isNaN(userNum) && !isNaN(correctNum)) {
    return Math.abs(userNum - correctNum) < 0.001;
  }

  // Check if either contains algebraic variables (but not just 'e' or 'pi')
  const hasAlgebra = /[a-df-hj-oq-z]/i.test(cleanUserAnswer) || /[a-df-hj-oq-z]/i.test(cleanCorrectAnswer);
  
  if (hasAlgebra) {
    // Try symbolic comparison first
    if (compareAlgebraicExpressions(cleanUserAnswer, cleanCorrectAnswer)) {
      return true;
    }
    
    // Fallback to numerical testing with multiple values
    if (testEquivalence(cleanUserAnswer, cleanCorrectAnswer)) {
      return true;
    }
  }

  // Final fallback to string comparison for text answers like "converge"
  return (
    cleanUserAnswer.replace(/[\s()<>*]/g, "").toLowerCase() ===
    cleanCorrectAnswer.replace(/[\s()<>*]/g, "").toLowerCase()
  );
};