// lib/math-rules/differentiation-rules.ts

import { MathRule } from './types';
import { formatCoefficient, formatPower } from './pattern-matcher';

export const differentiationRules: MathRule[] = [
    // ============================================
    // BASIC FORMS
    // ============================================

    {
        id: 'diff-constant',
        name: 'Constant',
        pattern: /^(-?[\d.]+)$/,
        transform: () => '0',
        priority: 5
    },

    {
        id: 'diff-variable',
        name: 'Variable (x)',
        pattern: /^(VAR)$/,
        transform: () => '1',
        priority: 10
    },

    {
        id: 'diff-power',
        name: 'Power Rule: x^n',
        pattern: /^(VAR)\^(-?[\d.]+)$/,
        transform: ({ captures }, v) => {
            const n = parseFloat(captures['2']);
            if (Math.abs(n - 1) < 1e-10) return '1';
            const newN = n - 1;
            if (Math.abs(newN) < 1e-10) return formatCoefficient(n);
            if (Math.abs(newN - 1) < 1e-10) return `${formatCoefficient(n)}${v}`;
            return `${formatCoefficient(n)}${v}^{${formatPower(newN)}}`;
        },
        priority: 15
    },

    {
        id: 'diff-coeff-x',
        name: 'Coefficient times x: ax',
        pattern: /^(-?[\d.]+)\*?(VAR)$/,
        transform: ({ captures }) => {
            const a = parseFloat(captures['1']);
            return formatCoefficient(a);
        },
        priority: 12
    },

    {
        id: 'diff-coeff-power',
        name: 'Coefficient times power: ax^n',
        pattern: /^(-?[\d.]+)\*?(VAR)\^(-?[\d.]+)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['1']);
            const n = parseFloat(captures['3']);
            const newCoeff = a * n;
            const newN = n - 1;
            if (Math.abs(newN) < 1e-10) return formatCoefficient(newCoeff);
            if (Math.abs(newN - 1) < 1e-10) return `${formatCoefficient(newCoeff)}${v}`;
            return `${formatCoefficient(newCoeff)}${v}^{${formatPower(newN)}}`;
        },
        priority: 14
    },

    // ============================================
    // EXPONENTIAL FORMS
    // ============================================

    {
        id: 'diff-exp-x',
        name: 'e^x',
        pattern: /^e\^(VAR)$/,
        transform: (_, v) => `e^{${v}}`,
        priority: 25
    },

    {
        id: 'diff-exp-ax',
        name: 'e^(ax)',
        pattern: /^e\^\((-?[\d.]+)\*?(VAR)\)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['1']);
            return `${formatCoefficient(a)}e^{${a}${v}}`;
        },
        priority: 26
    },

    {
        id: 'diff-exp-simple',
        name: 'exp(x)',
        pattern: /^exp\((VAR)\)$/,
        transform: (_, v) => `e^{${v}}`,
        priority: 25
    },

    {
        id: 'diff-a-to-x',
        name: 'a^x',
        pattern: /^([\d.]+)\^(VAR)$/,
        transform: ({ captures }, v) => {
            const a = captures['1'];
            return `${a}^{${v}}\\ln(${a})`;
        },
        priority: 24
    },

    // ============================================
    // LOGARITHMIC FORMS
    // ============================================

    {
        id: 'diff-ln-x',
        name: 'ln(x)',
        pattern: /^(?:ln|log)\((VAR)\)$/,
        transform: (_, v) => `\\frac{1}{${v}}`,
        priority: 25
    },

    {
        id: 'diff-log10-x',
        name: 'log₁₀(x)',
        pattern: /^log10\((VAR)\)$/,
        transform: (_, v) => `\\frac{1}{${v}\\ln(10)}`,
        priority: 25
    },

    // ============================================
    // TRIGONOMETRIC FORMS
    // ============================================

    {
        id: 'diff-sin-x',
        name: 'sin(x)',
        pattern: /^sin\((VAR)\)$/,
        transform: (_, v) => `\\cos(${v})`,
        priority: 30
    },

    {
        id: 'diff-cos-x',
        name: 'cos(x)',
        pattern: /^cos\((VAR)\)$/,
        transform: (_, v) => `-\\sin(${v})`,
        priority: 30
    },

    {
        id: 'diff-tan-x',
        name: 'tan(x)',
        pattern: /^tan\((VAR)\)$/,
        transform: (_, v) => `\\sec^{2}(${v})`,
        priority: 30
    },

    {
        id: 'diff-cot-x',
        name: 'cot(x)',
        pattern: /^cot\((VAR)\)$/,
        transform: (_, v) => `-\\csc^{2}(${v})`,
        priority: 30
    },

    {
        id: 'diff-sec-x',
        name: 'sec(x)',
        pattern: /^sec\((VAR)\)$/,
        transform: (_, v) => `\\sec(${v})\\tan(${v})`,
        priority: 30
    },

    {
        id: 'diff-csc-x',
        name: 'csc(x)',
        pattern: /^csc\((VAR)\)$/,
        transform: (_, v) => `-\\csc(${v})\\cot(${v})`,
        priority: 30
    },

    // Trig with linear argument
    {
        id: 'diff-sin-ax',
        name: 'sin(ax)',
        pattern: /^sin\((-?[\d.]+)\*?(VAR)\)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['1']);
            return `${formatCoefficient(a)}\\cos(${a}${v})`;
        },
        priority: 28
    },

    {
        id: 'diff-cos-ax',
        name: 'cos(ax)',
        pattern: /^cos\((-?[\d.]+)\*?(VAR)\)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['1']);
            return `${formatCoefficient(-a)}\\sin(${a}${v})`;
        },
        priority: 28
    },

    // ============================================
    // SQUARED TRIG FORMS
    // ============================================

    {
        id: 'diff-sin2-x',
        name: 'sin²(x)',
        pattern: /^sin\((VAR)\)\^2$/,
        transform: (_, v) => `2\\sin(${v})\\cos(${v})`,
        priority: 32
    },

    {
        id: 'diff-cos2-x',
        name: 'cos²(x)',
        pattern: /^cos\((VAR)\)\^2$/,
        transform: (_, v) => `-2\\sin(${v})\\cos(${v})`,
        priority: 32
    },

    {
        id: 'diff-tan2-x',
        name: 'tan²(x)',
        pattern: /^tan\((VAR)\)\^2$/,
        transform: (_, v) => `2\\tan(${v})\\sec^{2}(${v})`,
        priority: 32
    },

    // ============================================
    // HYPERBOLIC FORMS
    // ============================================

    {
        id: 'diff-sinh-x',
        name: 'sinh(x)',
        pattern: /^sinh\((VAR)\)$/,
        transform: (_, v) => `\\cosh(${v})`,
        priority: 30
    },

    {
        id: 'diff-cosh-x',
        name: 'cosh(x)',
        pattern: /^cosh\((VAR)\)$/,
        transform: (_, v) => `\\sinh(${v})`,
        priority: 30
    },

    {
        id: 'diff-tanh-x',
        name: 'tanh(x)',
        pattern: /^tanh\((VAR)\)$/,
        transform: (_, v) => `\\text{sech}^{2}(${v})`,
        priority: 30
    },

    // ============================================
    // INVERSE TRIG FORMS
    // ============================================

    {
        id: 'diff-arcsin-x',
        name: 'arcsin(x)',
        pattern: /^(?:arcsin|asin)\((VAR)\)$/,
        transform: (_, v) => `\\frac{1}{\\sqrt{1-${v}^{2}}}`,
        priority: 35
    },

    {
        id: 'diff-arccos-x',
        name: 'arccos(x)',
        pattern: /^(?:arccos|acos)\((VAR)\)$/,
        transform: (_, v) => `-\\frac{1}{\\sqrt{1-${v}^{2}}}`,
        priority: 35
    },

    {
        id: 'diff-arctan-x',
        name: 'arctan(x)',
        pattern: /^(?:arctan|atan)\((VAR)\)$/,
        transform: (_, v) => `\\frac{1}{1+${v}^{2}}`,
        priority: 35
    },

    // ============================================
    // RADICAL FORMS
    // ============================================

    {
        id: 'diff-sqrt-x',
        name: '√x',
        pattern: /^sqrt\((VAR)\)$/,
        transform: (_, v) => `\\frac{1}{2\\sqrt{${v}}}`,
        priority: 22
    },

    {
        id: 'diff-1-over-x',
        name: '1/x',
        pattern: /^1\/(VAR)$/,
        transform: (_, v) => `-\\frac{1}{${v}^{2}}`,
        priority: 20
    },

    {
        id: 'diff-1-over-x2',
        name: '1/x²',
        pattern: /^1\/(VAR)\^2$/,
        transform: (_, v) => `-\\frac{2}{${v}^{3}}`,
        priority: 20
    },

    {
        id: 'diff-1-over-sqrt-x',
        name: '1/√x',
        pattern: /^1\/sqrt\((VAR)\)$/,
        transform: (_, v) => `-\\frac{1}{2${v}^{3/2}}`,
        priority: 22
    },
    {
        id: 'diff-x-sin',
        name: 'd/dx[x·sin(x)]',
        pattern: /^(VAR)\*?sin\((VAR)\)$/,
        transform: (_, v) => `\\sin(${v}) + ${v}\\cos(${v})`,
        priority: 50
    },

    {
        id: 'diff-x-cos',
        name: 'd/dx[x·cos(x)]',
        pattern: /^(VAR)\*?cos\((VAR)\)$/,
        transform: (_, v) => `\\cos(${v}) - ${v}\\sin(${v})`,
        priority: 50
    },

    {
        id: 'diff-x-exp',
        name: 'd/dx[x·e^x]',
        pattern: /^(VAR)\*?e\^(VAR)$/,
        transform: (_, v) => `(1+${v})e^{${v}}`,
        priority: 50
    },

    {
        id: 'diff-x-ln',
        name: 'd/dx[x·ln(x)]',
        pattern: /^(VAR)\*?ln\((VAR)\)$/,
        transform: (_, v) => `\\ln(${v}) + 1`,
        priority: 50
    },

    {
        id: 'diff-sin2',
        name: 'd/dx[sin²(x)]',
        pattern: /^sin\((VAR)\)\^2$/,
        transform: (_, v) => `2\\sin(${v})\\cos(${v})`,
        priority: 35
    },

    {
        id: 'diff-cos2',
        name: 'd/dx[cos²(x)]',
        pattern: /^cos\((VAR)\)\^2$/,
        transform: (_, v) => `-2\\sin(${v})\\cos(${v})`,
        priority: 35
    },

    {
        id: 'diff-tan2',
        name: 'd/dx[tan²(x)]',
        pattern: /^tan\((VAR)\)\^2$/,
        transform: (_, v) => `2\\tan(${v})\\sec^2(${v})`,
        priority: 35
    },

    {
        id: 'diff-exp-sin',
        name: 'd/dx[e^x·sin(x)]',
        pattern: /^e\^(VAR)\*?sin\((VAR)\)$/,
        transform: (_, v) => `e^{${v}}(\\sin(${v})+\\cos(${v}))`,
        priority: 55
    },

    {
        id: 'diff-exp-cos',
        name: 'd/dx[e^x·cos(x)]',
        pattern: /^e\^(VAR)\*?cos\((VAR)\)$/,
        transform: (_, v) => `e^{${v}}(\\cos(${v})-\\sin(${v}))`,
        priority: 55
    },
    {
        id: 'diff-x-sin',
        name: 'd/dx[x·sin(x)]',
        pattern: /^(VAR)\*?sin\((VAR)\)$/,
        transform: (_, v) => `\\sin(${v}) + ${v}\\cos(${v})`,
        priority: 50
    },

    {
        id: 'diff-x-cos',
        name: 'd/dx[x·cos(x)]',
        pattern: /^(VAR)\*?cos\((VAR)\)$/,
        transform: (_, v) => `\\cos(${v}) - ${v}\\sin(${v})`,
        priority: 50
    },

    {
        id: 'diff-x-exp',
        name: 'd/dx[x·e^x]',
        pattern: /^(VAR)\*?e\^(VAR)$/,
        transform: (_, v) => `(1+${v})e^{${v}}`,
        priority: 50
    },

    {
        id: 'diff-x-ln',
        name: 'd/dx[x·ln(x)]',
        pattern: /^(VAR)\*?ln\((VAR)\)$/,
        transform: (_, v) => `\\ln(${v}) + 1`,
        priority: 50
    },

    {
        id: 'diff-sin2',
        name: 'd/dx[sin²(x)]',
        pattern: /^sin\((VAR)\)\^2$/,
        transform: (_, v) => `2\\sin(${v})\\cos(${v})`,
        priority: 35
    },

    {
        id: 'diff-cos2',
        name: 'd/dx[cos²(x)]',
        pattern: /^cos\((VAR)\)\^2$/,
        transform: (_, v) => `-2\\sin(${v})\\cos(${v})`,
        priority: 35
    },

    {
        id: 'diff-tan2',
        name: 'd/dx[tan²(x)]',
        pattern: /^tan\((VAR)\)\^2$/,
        transform: (_, v) => `2\\tan(${v})\\sec^2(${v})`,
        priority: 35
    },

    {
        id: 'diff-exp-sin',
        name: 'd/dx[e^x·sin(x)]',
        pattern: /^e\^(VAR)\*?sin\((VAR)\)$/,
        transform: (_, v) => `e^{${v}}(\\sin(${v})+\\cos(${v}))`,
        priority: 55
    },

    {
        id: 'diff-exp-cos',
        name: 'd/dx[e^x·cos(x)]',
        pattern: /^e\^(VAR)\*?cos\((VAR)\)$/,
        transform: (_, v) => `e^{${v}}(\\cos(${v})-\\sin(${v}))`,
        priority: 55
    },
    {
        id: 'diff-x-sin',
        name: 'd/dx[x·sin(x)]',
        pattern: /^(VAR)\*?sin\((VAR)\)$/,
        transform: (_, v) => `\\sin(${v}) + ${v}\\cos(${v})`,
        priority: 50
    },

    {
        id: 'diff-x-cos',
        name: 'd/dx[x·cos(x)]',
        pattern: /^(VAR)\*?cos\((VAR)\)$/,
        transform: (_, v) => `\\cos(${v}) - ${v}\\sin(${v})`,
        priority: 50
    },

    {
        id: 'diff-x-exp',
        name: 'd/dx[x·e^x]',
        pattern: /^(VAR)\*?e\^(VAR)$/,
        transform: (_, v) => `(1+${v})e^{${v}}`,
        priority: 50
    },

    {
        id: 'diff-x-ln',
        name: 'd/dx[x·ln(x)]',
        pattern: /^(VAR)\*?ln\((VAR)\)$/,
        transform: (_, v) => `\\ln(${v}) + 1`,
        priority: 50
    },

    {
        id: 'diff-sin2',
        name: 'd/dx[sin²(x)]',
        pattern: /^sin\((VAR)\)\^2$/,
        transform: (_, v) => `2\\sin(${v})\\cos(${v})`,
        priority: 35
    },

    {
        id: 'diff-cos2',
        name: 'd/dx[cos²(x)]',
        pattern: /^cos\((VAR)\)\^2$/,
        transform: (_, v) => `-2\\sin(${v})\\cos(${v})`,
        priority: 35
    },

    {
        id: 'diff-tan2',
        name: 'd/dx[tan²(x)]',
        pattern: /^tan\((VAR)\)\^2$/,
        transform: (_, v) => `2\\tan(${v})\\sec^2(${v})`,
        priority: 35
    },

    {
        id: 'diff-exp-sin',
        name: 'd/dx[e^x·sin(x)]',
        pattern: /^e\^(VAR)\*?sin\((VAR)\)$/,
        transform: (_, v) => `e^{${v}}(\\sin(${v})+\\cos(${v}))`,
        priority: 55
    },

    {
        id: 'diff-exp-cos',
        name: 'd/dx[e^x·cos(x)]',
        pattern: /^e\^(VAR)\*?cos\((VAR)\)$/,
        transform: (_, v) => `e^{${v}}(\\cos(${v})-\\sin(${v}))`,
        priority: 55
    },
];

export function getDifferentiationRuleById(id: string): MathRule | undefined {
    return differentiationRules.find(r => r.id === id);
}