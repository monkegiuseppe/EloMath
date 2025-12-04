// lib/math-rules/index.ts

export * from './types';
export * from './pattern-matcher';
export * from './integration-rules';
export * from './differentiation-rules';

import { integrationRules } from './integration-rules';
import { differentiationRules } from './differentiation-rules';
import { findMatchingRule, normalizeExpression } from './pattern-matcher';

export function symbolicIntegrate(expr: string, variable: string = 'x'): string | null {
    const result = findMatchingRule(expr, integrationRules, variable);
    return result.result;
}

export function symbolicDifferentiate(expr: string, variable: string = 'x'): string | null {
    const result = findMatchingRule(expr, differentiationRules, variable);
    return result.result;
}

export function splitTerms(expr: string): string[] {
    const terms: string[] = [];
    let current = '';
    let depth = 0;

    const normalized = normalizeExpression(expr);

    for (let i = 0; i < normalized.length; i++) {
        const c = normalized[i];

        if (c === '(' || c === '{') depth++;
        else if (c === ')' || c === '}') depth--;

        if (depth === 0 && (c === '+' || c === '-') && i > 0) {
            if (current.trim()) {
                terms.push(current.trim());
            }
            current = c;
        } else {
            current += c;
        }
    }

    if (current.trim()) {
        terms.push(current.trim());
    }

    return terms.map(t => {
        if (t.startsWith('+')) return t.slice(1).trim();
        return t;
    });
}

export function integrateSum(expr: string, variable: string = 'x'): string {
    const terms = splitTerms(expr);

    if (terms.length === 0) {
        return '0 + C';
    }

    if (terms.length === 1) {
        const result = symbolicIntegrate(terms[0], variable);
        if (result) {
            return result + ' + C';
        }
        return `\\int ${terms[0]}\\, d${variable} + C`;
    }

    const results: string[] = [];
    let hasUnresolved = false;

    for (const term of terms) {
        const result = symbolicIntegrate(term, variable);
        if (result) {
            results.push(result);
        } else {
            results.push(`\\int ${term}\\, d${variable}`);
            hasUnresolved = true;
        }
    }

    let combined = results.join(' + ');
    combined = combined
        .replace(/\+ -/g, '- ')
        .replace(/\+ \+/g, '+ ')
        .replace(/- -/g, '+ ');

    return combined + ' + C';
}

export function differentiateSum(expr: string, variable: string = 'x'): string {
    const terms = splitTerms(expr);

    if (terms.length === 0) {
        return '0';
    }

    if (terms.length === 1) {
        const result = symbolicDifferentiate(terms[0], variable);
        if (result) {
            return result;
        }
        return `\\frac{d}{d${variable}}(${terms[0]})`;
    }

    const results: string[] = [];

    for (const term of terms) {
        const result = symbolicDifferentiate(term, variable);
        if (result && result !== '0') {
            results.push(result);
        } else if (!result) {
            results.push(`\\frac{d}{d${variable}}(${term})`);
        }
    }

    if (results.length === 0) {
        return '0';
    }

    let combined = results.join(' + ');
    combined = combined
        .replace(/\+ -/g, '- ')
        .replace(/\+ \+/g, '+ ')
        .replace(/- -/g, '+ ');

    return combined;
}

export function debugMatchRule(expr: string, variable: string = 'x', type: 'integrate' | 'differentiate' = 'integrate'): void {
    const rules = type === 'integrate' ? integrationRules : differentiationRules;
    const result = findMatchingRule(expr, rules, variable);

    console.log('=== Debug Rule Match ===');
    console.log('Expression:', expr);
    console.log('Normalized:', normalizeExpression(expr));
    console.log('Variable:', variable);

    if (result.rule) {
        console.log('Matched Rule:', result.rule.id, '-', result.rule.name);
        console.log('Pattern:', result.rule.pattern.source);
        console.log('Captures:', result.match?.captures);
        console.log('Result:', result.result);
    } else {
        console.log('No matching rule found');
    }
    console.log('========================');
}