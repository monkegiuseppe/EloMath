// lib/cas-math.ts

import { create, all } from 'mathjs';
import {
  symbolicIntegrate,
  symbolicDifferentiate,
  integrateSum,
  differentiateSum,
  normalizeExpression
} from './math-rules';

const math = create(all);

math.import({
  hbar: math.unit('1.054571817e-34 J s'),
  c: math.unit('299792458 m/s'),
  G: math.unit('6.67430e-11 m^3 kg^-1 s^-2'),
  k_B: math.unit('1.380649e-23 J/K'),
  e_charge: math.unit('1.602176634e-19 C'),
  infinity: Infinity,
}, { override: true });

const MAX_ITERATIONS = 50;

function latexToMathJS(latex: string): string {
  let s = latex;

  s = s.replace(/−/g, '-');                    // Unicode minus → ASCII minus
  s = s.replace(/′/g, "'");                    // Unicode prime → ASCII apostrophe
  s = s.replace(/([A-Za-z]+)_\{(\d+)\}/g, '$1$2'); // C_{1} → C1
  s = s.replace(/([A-Za-z]+)_(\d+)/g, '$1$2');     // C_1 → C1

  s = s.replace(/\\left/g, "").replace(/\\right/g, "");
  s = s.replace(/\\operatorname\{([^}]+)\}/g, "$1");
  s = s.replace(/\\mathrm\{([^}]+)\}/g, "$1");
  s = s.replace(/\\text\{([^}]+)\}/g, "$1");
  s = s.replace(/\\,/g, "");

  let iterations = 0;
  while (s.includes("\\frac{") && iterations < 10) {
    s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "(($1)/($2))");
    iterations++;
  }
  s = s.replace(/\\frac/g, "");

  const replacements: [RegExp, string][] = [
    [/\\sqrt\[3\]\{([^{}]+)\}/g, "cbrt($1)"],
    [/\\sqrt\{([^{}]+)\}/g, "sqrt($1)"],
    [/\\sin/g, "sin"], [/\\cos/g, "cos"], [/\\tan/g, "tan"],
    [/\\csc/g, "csc"], [/\\sec/g, "sec"], [/\\cot/g, "cot"],
    [/\\sinh/g, "sinh"], [/\\cosh/g, "cosh"], [/\\tanh/g, "tanh"],
    [/\\arcsin/g, "asin"], [/\\arccos/g, "acos"], [/\\arctan/g, "atan"],
    [/\\ln/g, "log"], [/\\log/g, "log10"],
    [/\\cdot/g, "*"], [/\\times/g, "*"], [/\\ast/g, "*"],
    [/\\pi/g, "pi"], [/\\theta/g, "theta"],
    [/\\infty/g, "Infinity"],
  ];

  replacements.forEach(([regex, replacement]) => {
    s = s.replace(regex, replacement);
  });

  s = s.replace(/\{/g, "(").replace(/\}/g, ")");
  s = s.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
  s = s.replace(/(\))([a-zA-Z0-9(])/g, '$1*$2');

  return s;
}

function formatNumberLatex(num: number): string {
  if (!isFinite(num)) {
    if (num === Infinity) return "\\infty";
    if (num === -Infinity) return "-\\infty";
    return "undefined";
  }

  if (Math.abs(num) < 1e-10) return "0";

  if (Math.abs(num - Math.round(num)) < 1e-9) {
    return Math.round(num).toString();
  }

  try {
    const f = math.fraction(num);
    const n = Number((f as any).n);
    const d = Number((f as any).d);
    const s = Number((f as any).s);

    if (d < 1000 && d > 1) {
      const sign = s < 0 ? '-' : '';
      return `${sign}\\frac{${Math.abs(n)}}{${d}}`;
    }
  } catch (e) { }

  return parseFloat(num.toFixed(6)).toString();
}

function safeEvaluate(expr: any, scope: Record<string, number>): number | null {
  try {
    const result = expr.evaluate(scope);
    if (typeof result === 'number' && isFinite(result)) {
      return result;
    }
    return null;
  } catch (e) {
    return null;
  }
}

function solveEquation(equationStr: string, variable: string): string {
  try {
    const parts = equationStr.split("=");
    let exprStr: string;

    if (parts.length === 2) {
      exprStr = `(${parts[0].trim()}) - (${parts[1].trim()})`;
    } else if (parts.length === 1) {
      exprStr = parts[0].trim();
    } else {
      return "Error: Invalid equation format";
    }

    let expr: any;
    try {
      expr = math.compile(exprStr);
    } catch (e) {
      return "Error: Cannot parse expression";
    }

    const analysis = detectEquationType(expr, variable);

    if (analysis.type === 'error') {
      return "Error: Cannot analyze equation";
    }

    switch (analysis.type) {
      case 'linear':
        return solveLinear(analysis.a!, analysis.b!);
      case 'quadratic':
        return solveQuadratic(analysis.a!, analysis.b!, analysis.c!);
      case 'rational':
      case 'other':
        return solveNumerically(expr, variable, analysis.hints || [1, -1, 0.5, 2]);
      default:
        return solveNumerically(expr, variable, [1, -1, 0.5]);
    }

  } catch (e) {
    console.error('Solve error:', e);
    return "Error";
  }
}

interface EquationAnalysis {
  type: 'linear' | 'quadratic' | 'rational' | 'other' | 'error';
  a?: number;
  b?: number;
  c?: number;
  hints?: number[];
}

function detectEquationType(expr: any, variable: string): EquationAnalysis {
  const testPoints = [1, 2, 3, -1, -2, 0.5, -0.5];
  const values: { x: number; y: number }[] = [];

  for (const x of testPoints) {
    const y = safeEvaluate(expr, { [variable]: x });
    if (y !== null) {
      values.push({ x, y });
    }
  }

  if (values.length < 3) {
    const hints: number[] = [];
    for (let x = -10; x <= 10; x += 0.5) {
      const y = safeEvaluate(expr, { [variable]: x });
      if (y !== null && Math.abs(y) < 1000) {
        hints.push(x);
        if (hints.length >= 5) break;
      }
    }
    return { type: 'rational', hints: hints.length > 0 ? hints : [1, -1, 2] };
  }

  const [p1, p2, p3] = values;

  const slope1 = (p2.y - p1.y) / (p2.x - p1.x);
  const slope2 = (p3.y - p2.y) / (p3.x - p2.x);

  if (Math.abs(slope1 - slope2) < 0.001) {
    const a = slope1;
    const b = p1.y - a * p1.x;
    return { type: 'linear', a, b };
  }

  try {
    const [[x1, y1], [x2, y2], [x3, y3]] = values.slice(0, 3).map(p => [p.x, p.y]);

    const denom = (x1 - x2) * (x1 - x3) * (x2 - x3);
    if (Math.abs(denom) < 1e-10) {
      return { type: 'other', hints: values.map(v => v.x) };
    }

    const a = (x3 * (y2 - y1) + x2 * (y1 - y3) + x1 * (y3 - y2)) / denom;
    const b = (x3 * x3 * (y1 - y2) + x2 * x2 * (y3 - y1) + x1 * x1 * (y2 - y3)) / denom;
    const c = (x2 * x3 * (x2 - x3) * y1 + x3 * x1 * (x3 - x1) * y2 + x1 * x2 * (x1 - x2) * y3) / denom;

    if (values.length >= 4) {
      const p4 = values[3];
      const predicted = a * p4.x * p4.x + b * p4.x + c;
      if (Math.abs(predicted - p4.y) < 0.01) {
        return { type: 'quadratic', a, b, c };
      }
    } else if (Math.abs(a) > 1e-6) {
      return { type: 'quadratic', a, b, c };
    }
  } catch (e) { }

  const hints = values
    .filter(v => Math.abs(v.y) < 10)
    .sort((a, b) => Math.abs(a.y) - Math.abs(b.y))
    .slice(0, 3)
    .map(v => v.x);

  return { type: 'other', hints: hints.length > 0 ? hints : [1, -1, 0] };
}

function solveLinear(a: number, b: number): string {
  if (Math.abs(a) < 1e-10) {
    if (Math.abs(b) < 1e-10) return "All real numbers";
    return "No solution";
  }
  return formatNumberLatex(-b / a);
}

function extractSqrtFactor(n: number): { coeff: number; rad: number } {
  let coeff = 1;
  let rad = n;
  for (let p = 2; p * p <= rad; p++) {
    while (rad % (p * p) === 0) {
      coeff *= p;
      rad = rad / (p * p);
    }
  }
  return { coeff, rad };
}

function formatRootLatex(constPart: number, sqrtCoeff: number, rad: number, denom: number): string {
  if (denom < 0) { constPart = -constPart; sqrtCoeff = -sqrtCoeff; denom = -denom; }
  const absCoeff = Math.abs(sqrtCoeff);
  const sqrtExpr = absCoeff === 1 ? `\\sqrt{${rad}}` : `${absCoeff}\\sqrt{${rad}}`;
  const sqrtStr = sqrtCoeff > 0 ? sqrtExpr : `-${sqrtExpr}`;
  let numerStr: string;
  if (constPart === 0) {
    numerStr = sqrtStr;
  } else {
    numerStr = sqrtCoeff > 0 ? `${constPart}+${sqrtStr}` : `${constPart}${sqrtStr}`;
  }
  return denom === 1 ? numerStr : `\\frac{${numerStr}}{${denom}}`;
}

function solveQuadratic(a: number, b: number, c: number): string {
  if (Math.abs(a) < 1e-10) return solveLinear(b, c);

  const discriminant = b * b - 4 * a * c;

  if (discriminant < -1e-10) {
    const real = -b / (2 * a);
    const imag = Math.sqrt(-discriminant) / (2 * a);
    return `${formatNumberLatex(real)} \\pm ${formatNumberLatex(Math.abs(imag))}i`;
  }

  if (Math.abs(discriminant) < 1e-10) {
    return formatNumberLatex(-b / (2 * a));
  }

  // Exact form when all coefficients are integers
  const ai = Math.round(a), bi = Math.round(b), ci = Math.round(c);
  if (Math.abs(a - ai) < 1e-6 && Math.abs(b - bi) < 1e-6 && Math.abs(c - ci) < 1e-6) {
    const D = bi * bi - 4 * ai * ci;
    const sqrtDInt = Math.round(Math.sqrt(D));
    if (sqrtDInt * sqrtDInt === D) {
      return `${formatNumberLatex((-bi + sqrtDInt) / (2 * ai))}, ${formatNumberLatex((-bi - sqrtDInt) / (2 * ai))}`;
    }
    const { coeff: sqrtCoeff, rad } = extractSqrtFactor(D);
    const nc = -bi, ns = sqrtCoeff, dn = 2 * ai;
    const g = gcd(gcd(Math.abs(nc), ns), Math.abs(dn));
    const r1 = formatRootLatex(nc / g, ns / g, rad, dn / g);
    const r2 = formatRootLatex(nc / g, -(ns / g), rad, dn / g);
    return `${r1}, ${r2}`;
  }

  const sqrtD = Math.sqrt(discriminant);
  return `${formatNumberLatex((-b + sqrtD) / (2 * a))}, ${formatNumberLatex((-b - sqrtD) / (2 * a))}`;
}

function gcd(x: number, y: number): number {
  x = Math.abs(Math.round(x));
  y = Math.abs(Math.round(y));
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function solveNumerically(expr: any, variable: string, startingPoints: number[]): string {
  const solutions: number[] = [];
  const tolerance = 1e-8;
  const h = 1e-6;
  const searchMin = -100;
  const searchMax = 100;
  const divisions = 400;
  const step = (searchMax - searchMin) / divisions;

  for (let i = 0; i < divisions; i++) {
    const a = searchMin + i * step;
    const b = a + step;

    const fa = safeEvaluate(expr, { [variable]: a });
    const fb = safeEvaluate(expr, { [variable]: b });

    if (fa === null || fb === null) continue;

    if (Math.abs(fa) < tolerance) {
      if (!solutions.some(s => Math.abs(s - a) < 1e-4)) {
        solutions.push(a);
      }
    }

    if (fa * fb < 0) {
      let lo = a, hi = b, flo = fa;
      for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
        const mid = (lo + hi) / 2;
        const fmid = safeEvaluate(expr, { [variable]: mid });
        if (fmid === null) break;

        if (Math.abs(fmid) < tolerance || Math.abs(hi - lo) < tolerance) {
          if (!solutions.some(s => Math.abs(s - mid) < 1e-4)) {
            solutions.push(mid);
          }
          break;
        }

        if (flo * fmid < 0) { hi = mid; }
        else { lo = mid; flo = fmid; }
      }
    }
  }

  const hints: number[] = [...startingPoints];
  for (let x = -20; x <= 20; x += 0.5) {
    const y = safeEvaluate(expr, { [variable]: x });
    if (y !== null && Math.abs(y) < 50) {
      hints.push(x);
    }
  }

  for (const start of hints.slice(0, 30)) {
    let x = start;

    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
      const y = safeEvaluate(expr, { [variable]: x });
      if (y === null) break;
      if (Math.abs(y) < tolerance) {
        if (!solutions.some(s => Math.abs(s - x) < 1e-4)) {
          solutions.push(x);
        }
        break;
      }

      const y_plus = safeEvaluate(expr, { [variable]: x + h });
      const y_minus = safeEvaluate(expr, { [variable]: x - h });
      if (y_plus === null || y_minus === null) break;

      const dy = (y_plus - y_minus) / (2 * h);
      if (Math.abs(dy) < 1e-12) break;

      let newtonStep = y / dy;
      if (Math.abs(newtonStep) > 10) newtonStep = Math.sign(newtonStep) * 10;

      const newX = x - newtonStep;
      if (Math.abs(newX - x) < tolerance) {
        if (!solutions.some(s => Math.abs(s - newX) < 1e-4)) {
          solutions.push(newX);
        }
        break;
      }
      x = newX;
    }
  }

  if (solutions.length === 0) {
    return "No real solution found";
  }

  solutions.sort((a, b) => a - b);
  return solutions.map(s => formatNumberLatex(s)).join(", ");
}

function definiteIntegral(exprStr: string, variable: string, start: number, end: number): string {
  try {
    const expr = math.compile(exprStr);
    const n = 1000;
    const h = (end - start) / n;

    let sum = 0;
    let validPoints = 0;

    for (let i = 0; i <= n; i++) {
      const x = start + i * h;
      const val = safeEvaluate(expr, { [variable]: x });

      if (val === null) continue;

      validPoints++;

      if (i === 0 || i === n) {
        sum += val;
      } else if (i % 2 === 0) {
        sum += 2 * val;
      } else {
        sum += 4 * val;
      }
    }

    if (validPoints < n / 2) {
      return "Integral may not converge";
    }

    const result = (h / 3) * sum;

    if (!isFinite(result)) {
      return "Divergent";
    }

    return formatNumberLatex(result);
  } catch (e) {
    console.error('Definite integral error:', e);
    return "Error";
  }
}

function evaluateLimit(exprStr: string, variable: string, targetStr: string): string {
  try {
    const expr = math.compile(exprStr);

    const targetLower = targetStr.toLowerCase().trim();

    if (targetLower === 'infinity' || targetLower === 'inf' || targetLower === '∞') {
      return evaluateLimitAtInfinity(expr, variable, 1);
    }
    if (targetLower === '-infinity' || targetLower === '-inf' || targetLower === '-∞') {
      return evaluateLimitAtInfinity(expr, variable, -1);
    }

    const target = math.evaluate(targetStr);
    if (!isFinite(target)) {
      return evaluateLimitAtInfinity(expr, variable, target > 0 ? 1 : -1);
    }

    return evaluateLimitAtPoint(expr, variable, target);
  } catch (e) {
    console.error('Limit error:', e);
    return "Error";
  }
}

function evaluateLimitAtPoint(expr: any, variable: string, target: number): string {
  const direct = safeEvaluate(expr, { [variable]: target });
  if (direct !== null && isFinite(direct)) {
    return formatNumberLatex(direct);
  }

  const deltas = [0.1, 0.01, 0.001, 0.0001, 0.00001];
  const leftValues: number[] = [];
  const rightValues: number[] = [];

  for (const delta of deltas) {
    const left = safeEvaluate(expr, { [variable]: target - delta });
    const right = safeEvaluate(expr, { [variable]: target + delta });

    if (left !== null && isFinite(left)) leftValues.push(left);
    if (right !== null && isFinite(right)) rightValues.push(right);
  }

  if (leftValues.length >= 3 && rightValues.length >= 3) {
    const leftLimit = leftValues[leftValues.length - 1];
    const rightLimit = rightValues[rightValues.length - 1];

    if (Math.abs(leftLimit - rightLimit) < 0.001) {
      return formatNumberLatex((leftLimit + rightLimit) / 2);
    }
    return "Does not exist";
  }

  return "Undefined";
}

function evaluateLimitAtInfinity(expr: any, variable: string, sign: number): string {
  const testValues = sign > 0
    ? [10, 100, 1000, 10000, 100000]
    : [-10, -100, -1000, -10000, -100000];

  const values: number[] = [];

  for (const x of testValues) {
    const val = safeEvaluate(expr, { [variable]: x });
    if (val !== null) {
      values.push(val);
    }
  }

  if (values.length < 3) {
    return "Cannot evaluate";
  }

  const last = values[values.length - 1];
  const secondLast = values[values.length - 2];

  if (Math.abs(last - secondLast) < 0.001) {
    if (Math.abs(last) < 1e-8) return "0";
    return formatNumberLatex(last);
  }

  if (Math.abs(last) > 1e10) {
    return last > 0 ? "\\infty" : "-\\infty";
  }

  return "Does not exist";
}

const ODE_MATH_SYMBOLS = new Set([
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'sinh', 'cosh', 'tanh', 'log', 'log10', 'exp',
  'sqrt', 'cbrt', 'abs', 'pi', 'e', 'i', 'Infinity', 'theta',
]);

export function verifyODESolution(odeExpr: string, solutionLatex: string, variable: string = 'x'): boolean {
  try {
    const solutionStr = latexToMathJS(solutionLatex);

    // Normalise to LHS = 0 form
    let lhsStr = odeExpr.trim();
    if (lhsStr.includes('=')) {
      const eq = lhsStr.indexOf('=');
      lhsStr = `(${lhsStr.slice(0, eq)})-(${lhsStr.slice(eq + 1)})`;
    }

    // Replace y'', y', y with numeric placeholders (longest match first)
    const odeMathStr = lhsStr
      .replace(/y''/g, '_ypp')
      .replace(/y'/g, '_yp')
      .replace(/\by\b/g, '_y');

    const odeCompiled = math.compile(odeMathStr);

    // Assign deterministic values to any free constants in the solution (C1, C2, A, B …)
    const constants: Record<string, number> = {};
    const constPool = [1.7, 2.3, 1.3, 2.9];
    let poolIdx = 0;
    const solutionNode = math.parse(solutionStr);
    solutionNode.traverse((node: any) => {
      if (node.isSymbolNode && node.name !== variable && !ODE_MATH_SYMBOLS.has(node.name) && !(node.name in constants)) {
        constants[node.name] = constPool[poolIdx++ % constPool.length];
      }
    });

    const solutionCompiled = math.compile(solutionStr);
    const h = 1e-5;

    const evalY = (x: number): number => {
      return solutionCompiled.evaluate({ [variable]: x, ...constants }) as number;
    };

    for (const xVal of [0.3, 0.8, 1.5, -0.4, 2.2]) {
      const y0 = evalY(xVal);
      const yh = evalY(xVal + h);
      const ymh = evalY(xVal - h);
      if (!isFinite(y0) || !isFinite(yh) || !isFinite(ymh)) continue;

      const scope: Record<string, number> = {
        [variable]: xVal,
        _y: y0,
        _yp: (yh - ymh) / (2 * h),
        _ypp: (yh - 2 * y0 + ymh) / (h * h),
        ...constants,
      };

      const residual = odeCompiled.evaluate(scope);
      if (typeof residual !== 'number' || !isFinite(residual) || Math.abs(residual) > 1e-3) {
        return false;
      }
    }

    return true;
  } catch (e) {
    return false;
  }
}

export const evaluateMath = (
  expression: string,
  sessionType: 'math' | 'physics' | 'default' = 'default'
): string => {
  try {
    const sanitized = latexToMathJS(expression);
    const trimmed = sanitized.trim();

    if (trimmed.startsWith("verifyODE(")) {
      const match = trimmed.match(/^verifyODE\(([^,]+),\s*([^,]+),\s*([a-zA-Z])\)$/);
      if (match) {
        const satisfied = verifyODESolution(match[1].trim(), match[2].trim(), match[3].trim());
        return satisfied
          ? "\\text{✓ Satisfies ODE}"
          : "\\text{✗ Does not satisfy ODE}";
      }
      return "\\text{Error: use verifyODE(ode, solution, variable)}";
    }

    if (trimmed.startsWith("solve(")) {
      const match = trimmed.match(/^solve\((.+),\s*([a-zA-Z0-9_]+)\)$/);
      if (match) return solveEquation(match[1], match[2]);
      return "Error: Invalid solve syntax";
    }

    if (trimmed.includes("derivative") || trimmed.includes("d/d")) {
      let exprStr: string;
      let varStr: string;

      const dMatch = trimmed.match(/d\/d([a-zA-Z])\((.+)\)/);
      if (dMatch) {
        varStr = dMatch[1];
        exprStr = dMatch[2];
      } else {
        const derivMatch = trimmed.match(/^derivative\((.+),\s*([a-zA-Z])\)$/);
        if (derivMatch) {
          exprStr = derivMatch[1];
          varStr = derivMatch[2];
        } else {
          return "Error: Invalid derivative syntax";
        }
      }

      const ruleResult = differentiateSum(exprStr, varStr);
      if (ruleResult && !ruleResult.includes('\\frac{d}')) {
        return ruleResult;
      }

      try {
        const result = math.derivative(exprStr, varStr);
        return result.toString().replace(/\s\*\s/g, "");
      } catch (e) {
        return ruleResult || "Error: Cannot differentiate expression";
      }
    }

    if (trimmed.startsWith("integrate(")) {
      const defMatch = trimmed.match(/^integrate\((.+),\s*([a-zA-Z]+),\s*([^,]+),\s*([^)]+)\)$/);
      if (defMatch) {
        return definiteIntegral(defMatch[1], defMatch[2], math.evaluate(defMatch[3]), math.evaluate(defMatch[4]));
      }

      const indefMatch = trimmed.match(/^integrate\((.+),\s*([a-zA-Z]+)\)$/);
      if (indefMatch) {
        return integrateSum(indefMatch[1], indefMatch[2]);
      }

      const singleMatch = trimmed.match(/^integrate\((.+)\)$/);
      if (singleMatch) {
        return integrateSum(singleMatch[1], 'x');
      }
    }

    if (trimmed.startsWith("limit(")) {
      const cleanLimit = trimmed.replace("->", ",");
      const match = cleanLimit.match(/^limit\(([^,]+),\s*([a-zA-Z]+),\s*([^)]+)\)$/);
      if (match) return evaluateLimit(match[1], match[2], match[3]);
    }

    if (trimmed.match(/^(sum|product)\(/)) {
      const match = trimmed.match(/^(sum|product)\(([^,]+),\s*([a-zA-Z]+),\s*([^,]+),\s*([^)]+)\)$/);
      if (match) {
        const type = match[1];
        const exprStr = match[2];
        const variable = match[3];
        const start = parseInt(match[4]);
        const end = parseInt(match[5]);
        if (end - start > 10000) return "Range too large";

        let acc = type === 'sum' ? 0 : 1;
        const expr = math.compile(exprStr);
        for (let i = start; i <= end; i++) {
          const val = expr.evaluate({ [variable]: i });
          acc = type === 'sum' ? acc + val : acc * val;
        }
        return formatNumberLatex(acc);
      }
    }

    if (trimmed.startsWith("simplify(")) {
      const inner = trimmed.match(/^simplify\((.+)\)$/);
      if (inner) return math.simplify(inner[1]).toString().replace(/\s\*\s/g, "");
    }

    if (trimmed.startsWith("expand(")) {
      const inner = trimmed.match(/^expand\((.+)\)$/);
      if (inner) return math.rationalize(inner[1]).toString().replace(/\s\*\s/g, "");
    }

    if (trimmed.startsWith("factor(")) {
      const inner = trimmed.match(/^factor\((.+)\)$/);
      if (inner) return math.simplify(inner[1]).toString().replace(/\s\*\s/g, "");
    }

    const result = math.evaluate(sanitized);
    if (typeof result === 'number') {
      return formatNumberLatex(result);
    }
    if (result && result.re !== undefined && result.im !== undefined) {
      return `${formatNumberLatex(result.re)} ${result.im >= 0 ? '+' : '-'} ${formatNumberLatex(Math.abs(result.im))}i`;
    }

    return result.toString().replace(/\s\*\s/g, "");

  } catch {
    return "";
  }
};