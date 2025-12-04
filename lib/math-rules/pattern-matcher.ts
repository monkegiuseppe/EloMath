// lib/math-rules/pattern-matcher.ts

import { MathRule, MatchResult, RuleMatchResult } from './types';

export function normalizeExpression(expr: string): string {
    let s = expr.trim();

    s = s.replace(/\s+/g, '');
    s = s.replace(/\*\*/g, '^');

    s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)');
    s = s.replace(/\\cdot/g, '*');
    s = s.replace(/\\sqrt\{([^{}]+)\}/g, 'sqrt($1)');
    s = s.replace(/\\sin\s*/g, 'sin');
    s = s.replace(/\\cos\s*/g, 'cos');
    s = s.replace(/\\tan\s*/g, 'tan');
    s = s.replace(/\\cot\s*/g, 'cot');
    s = s.replace(/\\sec\s*/g, 'sec');
    s = s.replace(/\\csc\s*/g, 'csc');
    s = s.replace(/\\sinh\s*/g, 'sinh');
    s = s.replace(/\\cosh\s*/g, 'cosh');
    s = s.replace(/\\tanh\s*/g, 'tanh');
    s = s.replace(/\\ln\s*/g, 'ln');
    s = s.replace(/\\log\s*/g, 'log');
    s = s.replace(/\\exp\s*/g, 'exp');
    s = s.replace(/\\arcsin\s*/g, 'arcsin');
    s = s.replace(/\\arccos\s*/g, 'arccos');
    s = s.replace(/\\arctan\s*/g, 'arctan');
    s = s.replace(/\\pi/g, 'pi');
    s = s.replace(/\{([^{}]+)\}/g, '($1)');

    s = s.replace(/\*([a-z])/gi, '$1');
    s = s.replace(/(\d)([a-z])/gi, '$1*$2');

    while (s.startsWith('(') && s.endsWith(')') && isBalanced(s.slice(1, -1))) {
        s = s.slice(1, -1);
    }

    s = s.replace(/^\((-?[\d.]+)\)\//, '$1/');

    s = s.replace(/\/\(\(([^()]+)\)\)$/, '/($1)');

    s = s.replace(/\/\(([a-z])\)$/i, '/$1');
    s = s.replace(/\/\(([a-z])\^(\d+)\)$/i, '/$1^$2');

    return s;
}

function isBalanced(s: string): boolean {
    let count = 0;
    for (const c of s) {
        if (c === '(') count++;
        if (c === ')') count--;
        if (count < 0) return false;
    }
    return count === 0;
}

export function tryMatchRule(expr: string, rule: MathRule, variable: string): MatchResult {
    const pattern = new RegExp(
        rule.pattern.source.replace(/VAR/g, variable),
        rule.pattern.flags
    );

    const match = expr.match(pattern);

    if (match) {
        const captures: Record<string, string> = {};
        match.forEach((val, idx) => {
            if (idx > 0 && val !== undefined) {
                captures[idx.toString()] = val;
            }
        });
        captures['variable'] = variable;
        captures['full'] = match[0];

        return { matched: true, captures, original: expr };
    }

    return { matched: false, captures: {}, original: expr };
}

export function findMatchingRule(
    expr: string,
    rules: MathRule[],
    variable: string
): RuleMatchResult {
    const normalized = normalizeExpression(expr);

    const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

    for (const rule of sortedRules) {
        const match = tryMatchRule(normalized, rule, variable);

        if (match.matched) {
            if (rule.conditions && !rule.conditions(match)) {
                continue;
            }

            try {
                const result = rule.transform(match, variable);
                return { rule, result, match };
            } catch (e) {
                console.warn(`Rule ${rule.id} transform failed:`, e);
                continue;
            }
        }
    }

    return { rule: null, result: null, match: null };
}

export function formatCoefficient(coeff: number, includeSign: boolean = false): string {
    if (Math.abs(coeff - 1) < 1e-10) return includeSign ? '+' : '';
    if (Math.abs(coeff + 1) < 1e-10) return '-';

    if (Number.isInteger(coeff)) {
        return includeSign && coeff > 0 ? `+${coeff}` : coeff.toString();
    }

    const tolerance = 1e-9;
    for (let d = 1; d <= 100; d++) {
        const n = Math.round(coeff * d);
        if (Math.abs(n / d - coeff) < tolerance) {
            const sign = includeSign && n / d > 0 ? '+' : '';
            if (d === 1) return `${sign}${n}`;
            return `${sign}\\frac{${Math.abs(n)}}{${d}}${n < 0 ? '' : ''}`.replace('+\\frac', '\\frac');
        }
    }

    const formatted = coeff.toFixed(4).replace(/\.?0+$/, '');
    return includeSign && coeff > 0 ? `+${formatted}` : formatted;
}

export function formatPower(power: number): string {
    if (Number.isInteger(power)) return power.toString();

    const tolerance = 1e-9;
    for (let d = 1; d <= 20; d++) {
        const n = Math.round(power * d);
        if (Math.abs(n / d - power) < tolerance && d > 1) {
            return `\\frac{${n}}{${d}}`;
        }
    }

    return power.toFixed(4).replace(/\.?0+$/, '');
}