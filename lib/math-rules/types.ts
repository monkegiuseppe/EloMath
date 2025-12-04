// lib/math-rules/types.ts

export interface MatchResult {
    matched: boolean;
    captures: Record<string, string>;
    original: string;
}

export interface MathRule {
    id: string;
    name: string;
    pattern: RegExp;
    transform: (match: MatchResult, variable: string) => string;
    conditions?: (match: MatchResult) => boolean;
    priority: number;
}

export interface RuleMatchResult {
    rule: MathRule | null;
    result: string | null;
    match: MatchResult | null;
}