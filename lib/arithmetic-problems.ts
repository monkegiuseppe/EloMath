// lib/arithmetic-problems.ts
import type { Problem } from './problems';

// Helper to generate problems programmatically to save space
const generateArithmeticProblems = (): Problem[] => {
    const problems: Problem[] = [];
    let idCounter = 1;

    // 1. Basic Addition (ELO 100-200)
    for (let i = 5; i <= 20; i++) {
        for (let j = 5; j <= 20; j++) {
            if (Math.random() > 0.3) continue; // Sample subset
            problems.push({
                id: `ARITH_ADD_${idCounter++}`,
                topic: "Arithmetic",
                category: "Addition",
                difficulty: 100 + Math.floor((i + j) * 1.5),
                problem: `$${i} + ${j} = ?$`,
                answer: (i + j).toString(),
                format_hint: "Enter the number."
            });
        }
    }

    // 2. Basic Subtraction (ELO 150-250)
    for (let i = 10; i <= 30; i++) {
        for (let j = 5; j < i; j++) {
            if (Math.random() > 0.3) continue;
            problems.push({
                id: `ARITH_SUB_${idCounter++}`,
                topic: "Arithmetic",
                category: "Subtraction",
                difficulty: 150 + Math.floor((i + j) * 1.5),
                problem: `$${i} - ${j} = ?$`,
                answer: (i - j).toString(),
            });
        }
    }

    // 3. Multiplication (ELO 200-500)
    for (let i = 2; i <= 12; i++) {
        for (let j = 2; j <= 12; j++) {
            problems.push({
                id: `ARITH_MUL_${idCounter++}`,
                topic: "Arithmetic",
                category: "Multiplication",
                difficulty: 200 + (i * j) * 2,
                problem: `$${i} \\times ${j} = ?$`,
                answer: (i * j).toString(),
            });
        }
    }

    // 4. Division (ELO 300-600)
    for (let i = 2; i <= 12; i++) {
        for (let j = 2; j <= 12; j++) {
            const product = i * j;
            problems.push({
                id: `ARITH_DIV_${idCounter++}`,
                topic: "Arithmetic",
                category: "Division",
                difficulty: 300 + (product * 2),
                problem: `$${product} \\div ${i} = ?$`,
                answer: j.toString(),
            });
        }
    }

    // 5. Basic Algebra / Linear Equations (ELO 400-800)
    // Type: ax = b
    for (let a = 2; a <= 9; a++) {
        for (let x = 2; x <= 12; x++) {
            const b = a * x;
            problems.push({
                id: `ALG_LIN_1_${idCounter++}`,
                topic: "Algebra",
                category: "Linear Equations",
                difficulty: 400 + (b * 3),
                problem: `Solve for x: $${a}x = ${b}$`,
                answer: x.toString(),
            });
        }
    }

    // Type: x + a = b
    for (let a = 5; a <= 20; a++) {
        for (let x = 1; x <= 15; x++) {
            const b = x + a;
            problems.push({
                id: `ALG_LIN_2_${idCounter++}`,
                topic: "Algebra",
                category: "Linear Equations",
                difficulty: 350 + (b * 2),
                problem: `Solve for x: $x + ${a} = ${b}$`,
                answer: x.toString(),
            });
        }
    }

    // Type: ax + b = c
    for (let a = 2; a <= 6; a++) {
        for (let x = 2; x <= 10; x++) {
            for (let b = 1; b <= 10; b++) {
                if (Math.random() > 0.2) continue;
                const c = a * x + b;
                problems.push({
                    id: `ALG_LIN_3_${idCounter++}`,
                    topic: "Algebra",
                    category: "Linear Equations",
                    difficulty: 500 + (c * 2),
                    problem: `Solve for x: $${a}x + ${b} = ${c}$`,
                    answer: x.toString(),
                });
            }
        }
    }

    // 6. Basic Exponents (ELO 600-900)
    for (let base = 2; base <= 10; base++) {
        for (let exp = 2; exp <= 4; exp++) {
            problems.push({
                id: `ALG_EXP_${idCounter++}`,
                topic: "Algebra",
                category: "Exponents",
                difficulty: 600 + (Math.pow(base, exp) / 2),
                problem: `Calculate: $${base}^${exp}$`,
                answer: Math.pow(base, exp).toString(),
            });
        }
    }

    return problems;
};

export const arithmeticProblems: Problem[] = generateArithmeticProblems();