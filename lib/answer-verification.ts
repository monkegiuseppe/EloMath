// lib/answer-verification.ts

import { create, all } from 'mathjs';

const math = create(all);

function cleanInput(input: string): string {
    return input
        .replace(/\\/g, "")
        .replace(/\{/g, "(")
        .replace(/\}/g, ")")
        .replace(/\s/g, "")
        .replace(/π/g, "pi")
        .replace(/²/g, "^2")
        .replace(/³/g, "^3")
        .replace(/√/g, "sqrt")
        .replace(/pi/gi, "pi")
        .replace(/ln/gi, "log")
        .toLowerCase();
}

export const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
    if (!userAnswer) return false;

    if (userAnswer.trim() === correctAnswer.trim()) return true;

    try {
        const userNum = Number(userAnswer);
        const correctNum = Number(correctAnswer);

        if (!isNaN(userNum) && !isNaN(correctNum)) {
            const tolerance = Math.abs(correctNum * 0.01);
            return Math.abs(userNum - correctNum) <= (tolerance || 0.001);
        }
    } catch (e) {
    }

    try {
        const diffExpression = `(${userAnswer}) - (${correctAnswer})`;

        const simplified = math.simplify(diffExpression);
        if (simplified.toString() === "0") return true;

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

        for (let i = 0; i < 5; i++) {
            const scope: any = {};
            allVars.forEach(v => scope[v] = Math.random() * 10 + 1);

            const res1 = nodeUser.evaluate(scope);
            const res2 = nodeCorrect.evaluate(scope);

            if (Math.abs(res1 - res2) > 1e-5) return false;
        }

        return true;

    } catch (e) {
        return cleanInput(userAnswer) === cleanInput(correctAnswer);
    }
};