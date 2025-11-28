// lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { create, all } from 'mathjs'

const math = create(all)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const evaluateExpression = (str: string): number => {
  try {
    if (str.includes("/") && !str.match(/[a-zA-Z]/)) {
      const parts = str.split("/");
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den;
      }
    }
    const simpleFloat = parseFloat(str);
    if (!isNaN(simpleFloat) && !str.match(/[a-zA-Z^√π]/)) {
      return simpleFloat;
    }

    const expression = str
      .replace(/π/g, "Math.PI")
      .replace(/√/g, "Math.sqrt")
      .replace(/\^/g, "**")
      .replace(/e/g, "Math.E");

    return new Function("return " + expression)();
  } catch (e) {
    return NaN;
  }
};


const compareAlgebraicExpressions = (expr1: string, expr2: string): boolean => {
  try {
    const clean1 = expr1.replace(/\s/g, '');
    const clean2 = expr2.replace(/\s/g, '');

    const node1 = math.parse(clean1);
    const node2 = math.parse(clean2);

    const simplified1 = math.simplify(node1);
    const simplified2 = math.simplify(node2);

    const diff = math.simplify(math.parse(`(${simplified1}) - (${simplified2})`));

    return diff.toString() === '0';
    return diff.toString() === '0';
  } catch (e) {
    return false;
  }
};

const testEquivalence = (expr1: string, expr2: string): boolean => {
  try {
    const clean1 = expr1.replace(/\s/g, '');
    const clean2 = expr2.replace(/\s/g, '');

    const vars1 = clean1.match(/[a-z]/gi) || [];
    const vars2 = clean2.match(/[a-z]/gi) || [];
    const allVars = [...new Set([...vars1, ...vars2])].filter(v => v !== 'e' && v !== 'pi');

    if (allVars.length === 0) return false;

    const testValues = [0, 1, -1, 2, -2, 0.5, 3, -3, 10];

    for (const testVal of testValues) {
      const scope: Record<string, number> = {};
      allVars.forEach(v => scope[v] = testVal);

      try {
        const result1 = math.evaluate(clean1, scope);
        const result2 = math.evaluate(clean2, scope);

        if (!isFinite(result1) || !isFinite(result2)) continue;

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

  if (cleanUserAnswer.replace(/[\s]/g, '').toLowerCase() ===
    cleanCorrectAnswer.replace(/[\s]/g, '').toLowerCase()) {
    return true;
  }
  const userNum = evaluateExpression(cleanUserAnswer);
  const correctNum = evaluateExpression(cleanCorrectAnswer);

  if (!isNaN(userNum) && !isNaN(correctNum)) {
    return Math.abs(userNum - correctNum) < 0.001;
  }
  const hasAlgebra = /[a-df-hj-oq-z]/i.test(cleanUserAnswer) || /[a-df-hj-oq-z]/i.test(cleanCorrectAnswer);

  if (hasAlgebra) {
    if (compareAlgebraicExpressions(cleanUserAnswer, cleanCorrectAnswer)) {
      return true;
    }

    if (testEquivalence(cleanUserAnswer, cleanCorrectAnswer)) {
      return true;
    }
  }

  return (
    cleanUserAnswer.replace(/[\s()<>*]/g, "").toLowerCase() ===
    cleanCorrectAnswer.replace(/[\s()<>*]/g, "").toLowerCase()
  );
};