// lib/answer-verification.ts

import { create, all } from 'mathjs';

const math = create(all);

/**
 * Clean up common LaTeX artifacts that might confuse the parser
 */
function cleanInput(input: string): string {
    return input
        .replace(/\\/g, "")           // Remove backslashes
        .replace(/\{/g, "(")          // Convert {} to ()
        .replace(/\}/g, ")")
        .replace(/\s/g, "")           // Remove whitespace
        .replace(/pi/gi, "pi")        // Normalize pi
        .replace(/ln/gi, "log")       // MathJS prefers 'log' for natural log usually, but handles 'ln' too. Normalizing helps.
        .toLowerCase();
}

export const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
    if (!userAnswer) return false;

    // 1. Direct String Match (Fastest)
    if (userAnswer.trim() === correctAnswer.trim()) return true;

    // 2. Numeric Evaluation (For Physics/Engineering)
    try {
        const userNum = Number(userAnswer);
        const correctNum = Number(correctAnswer);

        if (!isNaN(userNum) && !isNaN(correctNum)) {
            // 1% tolerance for numeric answers
            const tolerance = Math.abs(correctNum * 0.01);
            return Math.abs(userNum - correctNum) <= (tolerance || 0.001);
        }
    } catch (e) {
        // Ignore numeric errors
    }

    // 3. Symbolic Comparison (The "Real" Check)
    try {
        // Parse both expressions
        // We interpret '=' as a subtraction check (left - right == 0)
        // But usually inputs are just expressions.

        const diffExpression = `(${userAnswer}) - (${correctAnswer})`;

        // Simplify the difference
        const simplified = math.simplify(diffExpression);

        // Check if it simplified to zero
        // Note: simplify() might return "0" (Node) or 0 (number)
        if (simplified.toString() === "0") return true;

        // 4. Deep Evaluation Check (Random Sampling)
        // Sometimes simplify() misses things like trig identities.
        // We evaluate both expressions at random points for variables.

        // Extract variables
        const nodeUser = math.parse(userAnswer);
        const nodeCorrect = math.parse(correctAnswer);

        const varsUser = new Set<string>();
        const varsCorrect = new Set<string>();

        nodeUser.traverse((node: any) => {
            if (node.isSymbolNode && node.name !== 'pi' && node.name !== 'e' && node.name !== 'i') {
                varsUser.add(node.name);
            }
        });
        nodeCorrect.traverse((node: any) => {
            if (node.isSymbolNode && node.name !== 'pi' && node.name !== 'e' && node.name !== 'i') {
                varsCorrect.add(node.name);
            }
        });

        const allVars = Array.from(new Set([...varsUser, ...varsCorrect]));

        // Test 5 random points
        for (let i = 0; i < 5; i++) {
            const scope: any = {};
            allVars.forEach(v => scope[v] = Math.random() * 10 + 1); // Avoid 0 to prevent div by zero

            const res1 = nodeUser.evaluate(scope);
            const res2 = nodeCorrect.evaluate(scope);

            // Use a small epsilon for floating point comparison
            if (Math.abs(res1 - res2) > 1e-5) return false;
        }

        return true;

    } catch (e) {
        // If symbolic parsing fails, fall back to basic string normalization check
        return cleanInput(userAnswer) === cleanInput(correctAnswer);
    }
};