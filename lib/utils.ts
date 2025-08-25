import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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

export const isAnswerCorrect = (userAnswer: string, correctAnswer: string | number): boolean => {
  const cleanUserAnswer = userAnswer.trim();
  const cleanCorrectAnswer = String(correctAnswer).trim();

  const userNum = evaluateExpression(cleanUserAnswer);
  const correctNum = evaluateExpression(cleanCorrectAnswer);

  // Compare as numbers if both are valid numbers
  if (!isNaN(userNum) && !isNaN(correctNum)) {
    return Math.abs(userNum - correctNum) < 0.001;
  }

  // Fallback to string comparison for answers like "converge" or symbolic answers
  return (
    cleanUserAnswer.replace(/[\s()<>*]/g, "").toLowerCase() ===
    cleanCorrectAnswer.replace(/[\s()<>*]/g, "").toLowerCase()
  );
};