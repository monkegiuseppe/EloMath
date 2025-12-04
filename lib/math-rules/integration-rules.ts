// lib/math-rules/integration-rules.ts

import { MathRule } from './types';
import { formatCoefficient, formatPower } from './pattern-matcher';

export const integrationRules: MathRule[] = [
    // ============================================
    // BASIC FORMS (Schaum's 14.1 - 14.8)
    // ============================================

    {
        id: 'int-constant',
        name: 'Constant',
        pattern: /^(-?[\d.]+)$/,
        transform: ({ captures }, v) => {
            const c = parseFloat(captures['1']);
            return `${formatCoefficient(c)}${v}`;
        },
        priority: 5
    },

    {
        id: 'int-variable',
        name: 'Variable (x)',
        pattern: /^(VAR)$/,
        transform: (_, v) => `\\frac{${v}^{2}}{2}`,
        priority: 10
    },

    {
        id: 'int-power',
        name: 'Power Rule: x^n',
        pattern: /^(VAR)\^(-?[\d.]+)$/,
        transform: ({ captures }, v) => {
            const n = parseFloat(captures['2']);
            const newN = n + 1;

            if (newN < 0) {
                const absN = Math.abs(newN);
                if (Math.abs(absN - 1) < 1e-10) {
                    return `-\\frac{1}{${v}}`;
                }
                return `-\\frac{1}{${Math.abs(n)}${v}^{${absN}}}`;
            }

            if (Number.isInteger(newN) && Number.isInteger(n)) {
                return `\\frac{${v}^{${newN}}}{${newN}}`;
            }
            return `\\frac{${v}^{${formatPower(newN)}}}{${formatPower(newN)}}`;
        },
        conditions: ({ captures }) => {
            const n = parseFloat(captures['2']);
            return Math.abs(n + 1) > 1e-10;
        },
        priority: 15
    },

    {
        id: 'int-power-negative-one',
        name: '1/x = x^(-1)',
        pattern: /^(VAR)\^-1$/,
        transform: (_, v) => `\\ln|${v}|`,
        priority: 20
    },

    {
        id: 'int-one-over-x',
        name: '1/x',
        pattern: /^1\/(VAR)$/,
        transform: (_, v) => `\\ln|${v}|`,
        priority: 20
    },

    {
        id: 'int-n-over-x',
        name: 'n/x',
        pattern: /^(-?[\d.]+)\/(VAR)$/,
        transform: ({ captures }, v) => {
            const n = parseFloat(captures['1']);
            return `${formatCoefficient(n)}\\ln|${v}|`;
        },
        priority: 19
    },

    {
        id: 'int-1-over-x-power',
        name: '1/x^n',
        pattern: /^1\/(VAR)\^(\d+)$/,
        transform: ({ captures }, v) => {
            const n = parseInt(captures['2']);
            if (n === 1) return `\\ln|${v}|`;
            const newN = n - 1;
            if (newN === 1) return `-\\frac{1}{${v}}`;
            return `-\\frac{1}{${newN}${v}^{${newN}}}`;
        },
        priority: 21
    },

    {
        id: 'int-n-over-x-power',
        name: 'n/x^m',
        pattern: /^(-?[\d.]+)\/(VAR)\^(\d+)$/,
        transform: ({ captures }, v) => {
            const coeff = parseFloat(captures['1']);
            const m = parseInt(captures['3']);
            if (m === 1) return `${formatCoefficient(coeff)}\\ln|${v}|`;
            const newM = m - 1;
            const newCoeff = -coeff / newM;
            if (newM === 1) return `${formatCoefficient(newCoeff)}\\frac{1}{${v}}`;
            return `${formatCoefficient(newCoeff)}\\frac{1}{${v}^{${newM}}}`;
        },
        priority: 18
    },

    {
        id: 'int-1-over-x-plus-a',
        name: '1/(x+a)',
        pattern: /^1\/\((VAR)\+(-?[\d.]+)\)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['2']);
            if (a >= 0) {
                return `\\ln|${v}+${a}|`;
            }
            return `\\ln|${v}${a}|`;
        },
        priority: 25
    },

    {
        id: 'int-1-over-x-minus-a',
        name: '1/(x-a)',
        pattern: /^1\/\((VAR)-(-?[\d.]+)\)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['2']);
            return `\\ln|${v}-${a}|`;
        },
        priority: 25
    },

    {
        id: 'int-1-over-a-plus-x',
        name: '1/(a+x)',
        pattern: /^1\/\((-?[\d.]+)\+(VAR)\)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['1']);
            return `\\ln|${a}+${v}|`;
        },
        priority: 25
    },

    {
        id: 'int-1-over-a-minus-x',
        name: '1/(a-x)',
        pattern: /^1\/\((-?[\d.]+)-(VAR)\)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['1']);
            return `-\\ln|${a}-${v}|`;
        },
        priority: 25
    },

    {
        id: 'int-coeff-x',
        name: 'Coefficient times x: ax',
        pattern: /^(-?[\d.]+)\*?(VAR)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['1']);
            return `${formatCoefficient(a / 2)}${v}^{2}`;
        },
        priority: 12
    },

    {
        id: 'int-coeff-power',
        name: 'Coefficient times power: ax^n',
        pattern: /^(-?[\d.]+)\*?(VAR)\^(-?[\d.]+)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['1']);
            const n = parseFloat(captures['3']);
            const newN = n + 1;
            const newCoeff = a / newN;
            if (Number.isInteger(newN)) {
                return `${formatCoefficient(newCoeff)}${v}^{${newN}}`;
            }
            return `${formatCoefficient(newCoeff)}${v}^{${formatPower(newN)}}`;
        },
        conditions: ({ captures }) => {
            const n = parseFloat(captures['3']);
            return Math.abs(n + 1) > 1e-10;
        },
        priority: 14
    },

    // ============================================
    // EXPONENTIAL FORMS (Schaum's 14.9 - 14.14)
    // ============================================
    {
        id: 'int-exp-sin',
        name: 'e^x·sin(x)',
        pattern: /^e\^(VAR)\*?sin\((VAR)\)$/,
        transform: (_, v) => `\\frac{e^{${v}}}{2}(\\sin(${v})-\\cos(${v}))`,
        priority: 55
    },

    {
        id: 'int-exp-cos',
        name: 'e^x·cos(x)',
        pattern: /^e\^(VAR)\*?cos\((VAR)\)$/,
        transform: (_, v) => `\\frac{e^{${v}}}{2}(\\sin(${v})+\\cos(${v}))`,
        priority: 55
    },

    {
        id: 'int-exp-ax-sin-bx',
        name: 'e^(ax)·sin(bx)',
        pattern: /^e\^\((-?[\d.]+)\*?(VAR)\)\*?sin\((-?[\d.]+)\*?(VAR)\)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['1']);
            const b = parseFloat(captures['3']);
            const denom = a * a + b * b;
            return `\\frac{e^{${a}${v}}}{${denom}}(${a}\\sin(${b}${v})-${b}\\cos(${b}${v}))`;
        },
        priority: 56
    },

    {
        id: 'int-exp-ax-cos-bx',
        name: 'e^(ax)·cos(bx)',
        pattern: /^e\^\((-?[\d.]+)\*?(VAR)\)\*?cos\((-?[\d.]+)\*?(VAR)\)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['1']);
            const b = parseFloat(captures['3']);
            const denom = a * a + b * b;
            return `\\frac{e^{${a}${v}}}{${denom}}(${a}\\cos(${b}${v})+${b}\\sin(${b}${v}))`;
        },
        priority: 56
    },
    {
        id: 'int-exp-x',
        name: 'e^x',
        pattern: /^e\^(VAR)$/,
        transform: (_, v) => `e^{${v}}`,
        priority: 25
    },

    {
        id: 'int-exp-ax',
        name: 'e^(ax)',
        pattern: /^e\^\((-?[\d.]+)\*?(VAR)\)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['1']);
            return `\\frac{e^{${a}${v}}}{${a}}`;
        },
        priority: 26
    },

    {
        id: 'int-exp-simple',
        name: 'exp(x)',
        pattern: /^exp\((VAR)\)$/,
        transform: (_, v) => `e^{${v}}`,
        priority: 25
    },

    {
        id: 'int-a-to-x',
        name: 'a^x',
        pattern: /^([\d.]+)\^(VAR)$/,
        transform: ({ captures }, v) => {
            const a = captures['1'];
            return `\\frac{${a}^{${v}}}{\\ln(${a})}`;
        },
        conditions: ({ captures }) => {
            const a = parseFloat(captures['1']);
            return a > 0 && Math.abs(a - 1) > 1e-10;
        },
        priority: 24
    },

    // ============================================
    // LOGARITHMIC FORMS (Schaum's 14.89 - 14.96)
    // ============================================

    {
        id: 'int-ln-x',
        name: 'ln(x)',
        pattern: /^(?:ln|log)\((VAR)\)$/,
        transform: (_, v) => `${v}\\ln(${v})-${v}`,
        priority: 25
    },
    {
        id: 'int-ln2',
        name: 'ln²(x)',
        pattern: /^ln\((VAR)\)\^2$/,
        transform: (_, v) => `${v}\\ln^2(${v}) - 2${v}\\ln(${v}) + 2${v}`,
        priority: 35
    },

    {
        id: 'int-1-over-x-ln-x',
        name: '1/(x·ln(x))',
        pattern: /^1\/\((VAR)\*?ln\((VAR)\)\)$/,
        transform: (_, v) => `\\ln|\\ln(${v})|`,
        priority: 40
    },

    // ============================================
    // TRIGONOMETRIC FORMS (Schaum's 14.15 - 14.24)
    // ============================================

    {
        id: 'int-sin-cos',
        name: 'sin(x)·cos(x)',
        pattern: /^sin\((VAR)\)\*?cos\((VAR)\)$/,
        transform: (_, v) => `\\frac{\\sin^2(${v})}{2}`,
        priority: 45
    },

    {
        id: 'int-sin3',
        name: 'sin³(x)',
        pattern: /^sin\((VAR)\)\^3$/,
        transform: (_, v) => `-\\cos(${v}) + \\frac{\\cos^3(${v})}{3}`,
        priority: 46
    },

    {
        id: 'int-cos3',
        name: 'cos³(x)',
        pattern: /^cos\((VAR)\)\^3$/,
        transform: (_, v) => `\\sin(${v}) - \\frac{\\sin^3(${v})}{3}`,
        priority: 46
    },

    {
        id: 'int-tan2',
        name: 'tan²(x)',
        pattern: /^tan\((VAR)\)\^2$/,
        transform: (_, v) => `\\tan(${v}) - ${v}`,
        priority: 35
    },

    {
        id: 'int-cot2',
        name: 'cot²(x)',
        pattern: /^cot\((VAR)\)\^2$/,
        transform: (_, v) => `-\\cot(${v}) - ${v}`,
        priority: 35
    },

    {
        id: 'int-sec3',
        name: 'sec³(x)',
        pattern: /^sec\((VAR)\)\^3$/,
        transform: (_, v) => `\\frac{1}{2}(\\sec(${v})\\tan(${v}) + \\ln|\\sec(${v})+\\tan(${v})|)`,
        priority: 36
    },

    {
        id: 'int-csc3',
        name: 'csc³(x)',
        pattern: /^csc\((VAR)\)\^3$/,
        transform: (_, v) => `-\\frac{1}{2}(\\csc(${v})\\cot(${v}) + \\ln|\\csc(${v})-\\cot(${v})|)`,
        priority: 36
    },

    {
        id: 'int-sec-tan',
        name: 'sec(x)·tan(x)',
        pattern: /^sec\((VAR)\)\*?tan\((VAR)\)$/,
        transform: (_, v) => `\\sec(${v})`,
        priority: 45
    },

    {
        id: 'int-csc-cot',
        name: 'csc(x)·cot(x)',
        pattern: /^csc\((VAR)\)\*?cot\((VAR)\)$/,
        transform: (_, v) => `-\\csc(${v})`,
        priority: 45
    },
    {
        id: 'int-sin-x',
        name: 'sin(x)',
        pattern: /^sin\((VAR)\)$/,
        transform: (_, v) => `-\\cos(${v})`,
        priority: 30
    },

    {
        id: 'int-cos-x',
        name: 'cos(x)',
        pattern: /^cos\((VAR)\)$/,
        transform: (_, v) => `\\sin(${v})`,
        priority: 30
    },

    {
        id: 'int-tan-x',
        name: 'tan(x)',
        pattern: /^tan\((VAR)\)$/,
        transform: (_, v) => `-\\ln|\\cos(${v})|`,
        priority: 30
    },

    {
        id: 'int-cot-x',
        name: 'cot(x)',
        pattern: /^cot\((VAR)\)$/,
        transform: (_, v) => `\\ln|\\sin(${v})|`,
        priority: 30
    },

    {
        id: 'int-sec-x',
        name: 'sec(x)',
        pattern: /^sec\((VAR)\)$/,
        transform: (_, v) => `\\ln|\\sec(${v})+\\tan(${v})|`,
        priority: 30
    },

    {
        id: 'int-csc-x',
        name: 'csc(x)',
        pattern: /^csc\((VAR)\)$/,
        transform: (_, v) => `-\\ln|\\csc(${v})+\\cot(${v})|`,
        priority: 30
    },

    {
        id: 'int-sec2-x',
        name: 'sec²(x)',
        pattern: /^sec\((VAR)\)\^2$/,
        transform: (_, v) => `\\tan(${v})`,
        priority: 35
    },

    {
        id: 'int-csc2-x',
        name: 'csc²(x)',
        pattern: /^csc\((VAR)\)\^2$/,
        transform: (_, v) => `-\\cot(${v})`,
        priority: 35
    },

    {
        id: 'int-sec-tan',
        name: 'sec(x)tan(x)',
        pattern: /^sec\((VAR)\)\*?tan\((VAR)\)$/,
        transform: (_, v) => `\\sec(${v})`,
        priority: 35
    },

    {
        id: 'int-csc-cot',
        name: 'csc(x)cot(x)',
        pattern: /^csc\((VAR)\)\*?cot\((VAR)\)$/,
        transform: (_, v) => `-\\csc(${v})`,
        priority: 35
    },

    // Trig with linear argument: sin(ax), cos(ax), etc.
    {
        id: 'int-sin-ax',
        name: 'sin(ax)',
        pattern: /^sin\((-?[\d.]+)\*?(VAR)\)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['1']);
            return `-\\frac{\\cos(${a}${v})}{${a}}`;
        },
        priority: 28
    },

    {
        id: 'int-cos-ax',
        name: 'cos(ax)',
        pattern: /^cos\((-?[\d.]+)\*?(VAR)\)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['1']);
            return `\\frac{\\sin(${a}${v})}{${a}}`;
        },
        priority: 28
    },

    // ============================================
    // SQUARED TRIG FORMS (Schaum's 14.25 - 14.30)
    // ============================================

    {
        id: 'int-sin2-x',
        name: 'sin²(x)',
        pattern: /^sin\((VAR)\)\^2$/,
        transform: (_, v) => `\\frac{${v}}{2}-\\frac{\\sin(2${v})}{4}`,
        priority: 32
    },

    {
        id: 'int-cos2-x',
        name: 'cos²(x)',
        pattern: /^cos\((VAR)\)\^2$/,
        transform: (_, v) => `\\frac{${v}}{2}+\\frac{\\sin(2${v})}{4}`,
        priority: 32
    },

    {
        id: 'int-tan2-x',
        name: 'tan²(x)',
        pattern: /^tan\((VAR)\)\^2$/,
        transform: (_, v) => `\\tan(${v})-${v}`,
        priority: 32
    },

    {
        id: 'int-cot2-x',
        name: 'cot²(x)',
        pattern: /^cot\((VAR)\)\^2$/,
        transform: (_, v) => `-\\cot(${v})-${v}`,
        priority: 32
    },

    // ============================================
    // HYPERBOLIC FORMS (Schaum's 14.79 - 14.88)
    // ============================================
    {
        id: 'int-sinh2',
        name: 'sinh²(x)',
        pattern: /^sinh\((VAR)\)\^2$/,
        transform: (_, v) => `\\frac{\\sinh(2${v})}{4} - \\frac{${v}}{2}`,
        priority: 35
    },

    {
        id: 'int-cosh2',
        name: 'cosh²(x)',
        pattern: /^cosh\((VAR)\)\^2$/,
        transform: (_, v) => `\\frac{\\sinh(2${v})}{4} + \\frac{${v}}{2}`,
        priority: 35
    },

    {
        id: 'int-tanh2',
        name: 'tanh²(x)',
        pattern: /^tanh\((VAR)\)\^2$/,
        transform: (_, v) => `${v} - \\tanh(${v})`,
        priority: 35
    },

    {
        id: 'int-coth',
        name: 'coth(x)',
        pattern: /^coth\((VAR)\)$/,
        transform: (_, v) => `\\ln|\\sinh(${v})|`,
        priority: 25
    },

    {
        id: 'int-sech',
        name: 'sech(x)',
        pattern: /^sech\((VAR)\)$/,
        transform: (_, v) => `2\\arctan(e^{${v}})`,
        priority: 25
    },

    {
        id: 'int-csch',
        name: 'csch(x)',
        pattern: /^csch\((VAR)\)$/,
        transform: (_, v) => `\\ln|\\tanh(\\frac{${v}}{2})|`,
        priority: 25
    },
    {
        id: 'int-sinh-x',
        name: 'sinh(x)',
        pattern: /^sinh\((VAR)\)$/,
        transform: (_, v) => `\\cosh(${v})`,
        priority: 30
    },

    {
        id: 'int-cosh-x',
        name: 'cosh(x)',
        pattern: /^cosh\((VAR)\)$/,
        transform: (_, v) => `\\sinh(${v})`,
        priority: 30
    },

    {
        id: 'int-tanh-x',
        name: 'tanh(x)',
        pattern: /^tanh\((VAR)\)$/,
        transform: (_, v) => `\\ln(\\cosh(${v}))`,
        priority: 30
    },

    {
        id: 'int-sech2-x',
        name: 'sech²(x)',
        pattern: /^sech\((VAR)\)\^2$/,
        transform: (_, v) => `\\tanh(${v})`,
        priority: 35
    },

    {
        id: 'int-csch2-x',
        name: 'csch²(x)',
        pattern: /^csch\((VAR)\)\^2$/,
        transform: (_, v) => `-\\coth(${v})`,
        priority: 35
    },

    // ============================================
    // INVERSE TRIG FORMS (Schaum's 14.45 - 14.59)
    // ============================================

    {
        id: 'int-1-over-sqrt-1-minus-x2',
        name: '1/√(1-x²)',
        pattern: /^1\/sqrt\(1-(VAR)\^2\)$/,
        transform: (_, v) => `\\arcsin(${v})`,
        priority: 43
    },

    {
        id: 'int-1-over-sqrt-a2-minus-x2',
        name: '1/√(a²-x²)',
        pattern: /^1\/sqrt\(([\d.]+)-(VAR)\^2\)$/,
        transform: ({ captures }, v) => {
            const a2 = parseFloat(captures['1']);
            const a = Math.sqrt(a2);
            if (Number.isInteger(a)) {
                return `\\arcsin\\frac{${v}}{${a}}`;
            }
            return `\\arcsin\\frac{${v}}{\\sqrt{${a2}}}`;
        },
        priority: 42
    },

    {
        id: 'int-neg-1-over-sqrt-1-minus-x2',
        name: '-1/√(1-x²)',
        pattern: /^-1\/sqrt\(1-(VAR)\^2\)$/,
        transform: (_, v) => `-\\arcsin(${v})`,
        priority: 43
    },

    {
        id: 'int-1-over-1-plus-x2',
        name: '1/(1+x²)',
        pattern: /^1\/\(1\+(VAR)\^2\)$/,
        transform: (_, v) => `\\arctan(${v})`,
        priority: 40
    },

    {
        id: 'int-1-over-x2-plus-1',
        name: '1/(x²+1)',
        pattern: /^1\/\((VAR)\^2\+1\)$/,
        transform: (_, v) => `\\arctan(${v})`,
        priority: 40
    },

    {
        id: 'int-1-over-x-sqrt-x2-minus-1',
        name: '1/(x√(x²-1))',
        pattern: /^1\/\((VAR)\*?sqrt\((VAR)\^2-1\)\)$/,
        transform: (_, v) => `\\text{arcsec}(${v})`,
        priority: 40
    },

    // ============================================
    // FORMS WITH √(a²-x²) (Schaum's 14.189 - 14.204)
    // ============================================

    {
        id: 'int-sqrt-a2-minus-x2',
        name: '√(a²-x²)',
        pattern: /^sqrt\(([\d.]+)-(VAR)\^2\)$/,
        transform: ({ captures }, v) => {
            const a2 = parseFloat(captures['1']);
            const a = Math.sqrt(a2);
            if (Number.isInteger(a)) {
                return `\\frac{${v}}{2}\\sqrt{${a2}-${v}^2}+\\frac{${a2}}{2}\\arcsin\\frac{${v}}{${a}}`;
            }
            return `\\frac{${v}}{2}\\sqrt{${a2}-${v}^2}+\\frac{${a2}}{2}\\arcsin\\frac{${v}}{\\sqrt{${a2}}}`;
        },
        priority: 38
    },

    // ============================================
    // FORMS WITH √(x²+a²) (Schaum's 14.213 - 14.228)
    // ============================================

    {
        id: 'int-1-over-sqrt-x2-plus-a2',
        name: '1/√(x²+a²)',
        pattern: /^1\/sqrt\((VAR)\^2\+([\d.]+)\)$/,
        transform: ({ captures }, v) => {
            const a2 = parseFloat(captures['2']);
            return `\\ln|${v}+\\sqrt{${v}^2+${a2}}|`;
        },
        priority: 42
    },

    {
        id: 'int-sqrt-x2-plus-a2',
        name: '√(x²+a²)',
        pattern: /^sqrt\((VAR)\^2\+([\d.]+)\)$/,
        transform: ({ captures }, v) => {
            const a2 = parseFloat(captures['2']);
            return `\\frac{${v}}{2}\\sqrt{${v}^2+${a2}}+\\frac{${a2}}{2}\\ln|${v}+\\sqrt{${v}^2+${a2}}|`;
        },
        priority: 38
    },

    // ============================================
    // FORMS WITH (a²+x²) (Schaum's 14.141 - 14.148)
    // ============================================

    {
        id: 'int-1-over-a2-plus-x2',
        name: '1/(a²+x²)',
        pattern: /^1\/\(([\d.]+)\+(VAR)\^2\)$/,
        transform: ({ captures }, v) => {
            const a2 = parseFloat(captures['1']);
            const a = Math.sqrt(a2);
            if (Number.isInteger(a)) {
                return `\\frac{1}{${a}}\\arctan\\frac{${v}}{${a}}`;
            }
            return `\\frac{1}{\\sqrt{${a2}}}\\arctan\\frac{${v}}{\\sqrt{${a2}}}`;
        },
        priority: 40
    },

    {
        id: 'int-1-over-x2-plus-a2',
        name: '1/(x²+a²)',
        pattern: /^1\/\((VAR)\^2\+([\d.]+)\)$/,
        transform: ({ captures }, v) => {
            const a2 = parseFloat(captures['2']);
            const a = Math.sqrt(a2);
            if (Number.isInteger(a)) {
                return `\\frac{1}{${a}}\\arctan\\frac{${v}}{${a}}`;
            }
            return `\\frac{1}{\\sqrt{${a2}}}\\arctan\\frac{${v}}{\\sqrt{${a2}}}`;
        },
        priority: 40
    },

    // ============================================
    // SPECIAL POLYNOMIAL FORMS  
    // ============================================

    {
        id: 'int-sqrt-x',
        name: '√x = x^(1/2)',
        pattern: /^sqrt\((VAR)\)$/,
        transform: (_, v) => `\\frac{2${v}^{3/2}}{3}`,
        priority: 22
    },

    {
        id: 'int-1-over-sqrt-x',
        name: '1/√x = x^(-1/2)',
        pattern: /^1\/sqrt\((VAR)\)$/,
        transform: (_, v) => `2\\sqrt{${v}}`,
        priority: 22
    },

    {
        id: 'int-x-sqrt-x',
        name: 'x√x = x^(3/2)',
        pattern: /^(VAR)\*?sqrt\((VAR)\)$/,
        transform: (_, v) => `\\frac{2${v}^{5/2}}{5}`,
        priority: 23
    },


    // ============================================
    // PRODUCT FORMS - x times function (Schaum's 14.97 - 14.108)
    // ============================================

    {
        id: 'int-x-sin',
        name: 'x·sin(x)',
        pattern: /^(VAR)\*?sin\((VAR)\)$/,
        transform: (_, v) => `\\sin(${v}) - ${v}\\cos(${v})`,
        priority: 50
    },

    {
        id: 'int-x-cos',
        name: 'x·cos(x)',
        pattern: /^(VAR)\*?cos\((VAR)\)$/,
        transform: (_, v) => `\\cos(${v}) + ${v}\\sin(${v})`,
        priority: 50
    },

    {
        id: 'int-x-sin-ax',
        name: 'x·sin(ax)',
        pattern: /^(VAR)\*?sin\((-?[\d.]+)\*?(VAR)\)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['2']);
            const a2 = a * a;
            return `\\frac{\\sin(${a}${v})}{${a2}} - \\frac{${v}\\cos(${a}${v})}{${a}}`;
        },
        priority: 51
    },

    {
        id: 'int-x-cos-ax',
        name: 'x·cos(ax)',
        pattern: /^(VAR)\*?cos\((-?[\d.]+)\*?(VAR)\)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['2']);
            const a2 = a * a;
            return `\\frac{\\cos(${a}${v})}{${a2}} + \\frac{${v}\\sin(${a}${v})}{${a}}`;
        },
        priority: 51
    },

    {
        id: 'int-x-exp',
        name: 'x·e^x',
        pattern: /^(VAR)\*?e\^(VAR)$/,
        transform: (_, v) => `(${v}-1)e^{${v}}`,
        priority: 50
    },

    {
        id: 'int-x-exp-ax',
        name: 'x·e^(ax)',
        pattern: /^(VAR)\*?e\^\((-?[\d.]+)\*?(VAR)\)$/,
        transform: ({ captures }, v) => {
            const a = parseFloat(captures['2']);
            const a2 = a * a;
            return `\\frac{e^{${a}${v}}}{${a2}}(${a}${v}-1)`;
        },
        priority: 51
    },

    {
        id: 'int-x-ln',
        name: 'x·ln(x)',
        pattern: /^(VAR)\*?ln\((VAR)\)$/,
        transform: (_, v) => `\\frac{${v}^2}{2}\\ln(${v}) - \\frac{${v}^2}{4}`,
        priority: 50
    },

    {
        id: 'int-x2-sin',
        name: 'x²·sin(x)',
        pattern: /^(VAR)\^2\*?sin\((VAR)\)$/,
        transform: (_, v) => `(2-${v}^2)\\cos(${v}) + 2${v}\\sin(${v})`,
        priority: 52
    },

    {
        id: 'int-x2-cos',
        name: 'x²·cos(x)',
        pattern: /^(VAR)\^2\*?cos\((VAR)\)$/,
        transform: (_, v) => `(${v}^2-2)\\sin(${v}) + 2${v}\\cos(${v})`,
        priority: 52
    },

    {
        id: 'int-x2-exp',
        name: 'x²·e^x',
        pattern: /^(VAR)\^2\*?e\^(VAR)$/,
        transform: (_, v) => `(${v}^2-2${v}+2)e^{${v}}`,
        priority: 52
    },

    // ============================================
    // INVERSE TRIG MULTIPLIED BY x (Schaum's 14.60 - 14.78)
    // ============================================

    {
        id: 'int-arcsin',
        name: 'arcsin(x)',
        pattern: /^arcsin\((VAR)\)$/,
        transform: (_, v) => `${v}\\arcsin(${v}) + \\sqrt{1-${v}^2}`,
        priority: 30
    },

    {
        id: 'int-arccos',
        name: 'arccos(x)',
        pattern: /^arccos\((VAR)\)$/,
        transform: (_, v) => `${v}\\arccos(${v}) - \\sqrt{1-${v}^2}`,
        priority: 30
    },

    {
        id: 'int-arctan',
        name: 'arctan(x)',
        pattern: /^arctan\((VAR)\)$/,
        transform: (_, v) => `${v}\\arctan(${v}) - \\frac{1}{2}\\ln(1+${v}^2)`,
        priority: 30
    },

    // ============================================
    // RATIONAL FUNCTIONS (Schaum's 14.149 - 14.188)
    // ============================================

    {
        id: 'int-1-over-a2-minus-x2',
        name: '1/(a²-x²)',
        pattern: /^1\/\(([\d.]+)-(VAR)\^2\)$/,
        transform: ({ captures }, v) => {
            const a2 = parseFloat(captures['1']);
            const a = Math.sqrt(a2);
            if (Number.isInteger(a)) {
                return `\\frac{1}{${2 * a}}\\ln\\left|\\frac{${a}+${v}}{${a}-${v}}\\right|`;
            }
            return `\\frac{1}{2\\sqrt{${a2}}}\\ln\\left|\\frac{\\sqrt{${a2}}+${v}}{\\sqrt{${a2}}-${v}}\\right|`;
        },
        priority: 41
    },

    {
        id: 'int-x-over-a2-plus-x2',
        name: 'x/(a²+x²)',
        pattern: /^(VAR)\/\(([\d.]+)\+(VAR)\^2\)$/,
        transform: ({ captures }, v) => {
            const a2 = parseFloat(captures['2']);
            return `\\frac{1}{2}\\ln(${a2}+${v}^2)`;
        },
        priority: 42
    },

    {
        id: 'int-x-over-a2-minus-x2',
        name: 'x/(a²-x²)',
        pattern: /^(VAR)\/\(([\d.]+)-(VAR)\^2\)$/,
        transform: ({ captures }, v) => {
            const a2 = parseFloat(captures['2']);
            return `-\\frac{1}{2}\\ln|${a2}-${v}^2|`;
        },
        priority: 42
    },

    {
        id: 'int-x2-over-a2-plus-x2',
        name: 'x²/(a²+x²)',
        pattern: /^(VAR)\^2\/\(([\d.]+)\+(VAR)\^2\)$/,
        transform: ({ captures }, v) => {
            const a2 = parseFloat(captures['2']);
            const a = Math.sqrt(a2);
            if (Number.isInteger(a)) {
                return `${v} - ${a}\\arctan\\frac{${v}}{${a}}`;
            }
            return `${v} - \\sqrt{${a2}}\\arctan\\frac{${v}}{\\sqrt{${a2}}}`;
        },
        priority: 43
    },
];

export function getIntegrationRuleById(id: string): MathRule | undefined {
    return integrationRules.find(r => r.id === id);
}

export function getIntegrationRulesByCategory(category: string): MathRule[] {
    const categories: Record<string, string[]> = {
        'basic': ['int-constant', 'int-variable', 'int-power', 'int-power-negative-one', 'int-one-over-x', 'int-coeff-x', 'int-coeff-power'],
        'exponential': ['int-exp-x', 'int-exp-ax', 'int-exp-simple', 'int-a-to-x'],
        'logarithmic': ['int-ln-x'],
        'trigonometric': ['int-sin-x', 'int-cos-x', 'int-tan-x', 'int-cot-x', 'int-sec-x', 'int-csc-x', 'int-sec2-x', 'int-csc2-x', 'int-sec-tan', 'int-csc-cot', 'int-sin-ax', 'int-cos-ax', 'int-sin2-x', 'int-cos2-x', 'int-tan2-x', 'int-cot2-x'],
        'hyperbolic': ['int-sinh-x', 'int-cosh-x', 'int-tanh-x', 'int-sech2-x', 'int-csch2-x'],
        'inverse-trig': ['int-1-over-sqrt-1-minus-x2', 'int-neg-1-over-sqrt-1-minus-x2', 'int-1-over-1-plus-x2', 'int-1-over-x-sqrt-x2-minus-1'],
        'radical': ['int-sqrt-a2-minus-x2', 'int-1-over-sqrt-a2-minus-x2', 'int-1-over-sqrt-x2-plus-a2', 'int-sqrt-x2-plus-a2', 'int-sqrt-x', 'int-1-over-sqrt-x', 'int-x-sqrt-x'],
    };

    const ids = categories[category] || [];
    return integrationRules.filter(r => ids.includes(r.id));
}