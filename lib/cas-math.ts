// lib/cas-math.ts

import { create, all } from 'mathjs';

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

function isBalanced(s: string): boolean {
  let count = 0;
  for (const c of s) {
    if (c === '(') count++;
    if (c === ')') count--;
    if (count < 0) return false;
  }
  return count === 0;
}

function splitIntoTerms(expr: string): string[] {
  const terms: string[] = [];
  let current = '';
  let depth = 0;

  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];

    if (c === '(') depth++;
    else if (c === ')') depth--;

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

  return terms;
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

function solveQuadratic(a: number, b: number, c: number): string {
  if (Math.abs(a) < 1e-10) {
    return solveLinear(b, c);
  }

  const discriminant = b * b - 4 * a * c;

  if (discriminant < -1e-10) {
    const real = -b / (2 * a);
    const imag = Math.sqrt(-discriminant) / (2 * a);
    return `${formatNumberLatex(real)} \\pm ${formatNumberLatex(Math.abs(imag))}i`;
  }

  if (Math.abs(discriminant) < 1e-10) {
    return formatNumberLatex(-b / (2 * a));
  }

  const sqrtD = Math.sqrt(discriminant);
  const r1 = (-b + sqrtD) / (2 * a);
  const r2 = (-b - sqrtD) / (2 * a);

  const sqrtDRounded = Math.round(sqrtD);
  if (Math.abs(sqrtD - sqrtDRounded) < 1e-6) {
    return `${formatNumberLatex(r1)}, ${formatNumberLatex(r2)}`;
  }

  const discRounded = Math.round(discriminant);
  if (Math.abs(discriminant - discRounded) < 1e-6 && discRounded > 0) {
    let outside = 1;
    let inside = discRounded;
    for (let i = 2; i * i <= inside; i++) {
      while (inside % (i * i) === 0) {
        inside /= (i * i);
        outside *= i;
      }
    }

    if (inside === 1) {
      return `${formatNumberLatex(r1)}, ${formatNumberLatex(r2)}`;
    }

    let denominator = 2 * Math.abs(a);
    const bPart = -b;

    const g = gcd(outside, denominator);
    outside = outside / g;
    denominator = denominator / g;
    let bPartSimplified = bPart;
    if (bPart !== 0) {
      const gB = gcd(Math.abs(bPart), denominator);
      if (gB === denominator) {
        bPartSimplified = bPart / gB;
      }
    }

    const sqrtPart = outside === 1 ? `\\sqrt{${inside}}` : `${outside}\\sqrt{${inside}}`;

    const signFromA = a < 0 ? -1 : 1;

    if (denominator === 1) {
      if (Math.abs(bPart) < 1e-10) {
        return `\\pm ${sqrtPart}`;
      }
      return `${formatNumberLatex(bPart * signFromA)} \\pm ${sqrtPart}`;
    }

    if (Math.abs(bPart) < 1e-10) {
      return `\\pm \\frac{${sqrtPart}}{${denominator}}`;
    }

    return `\\frac{${formatNumberLatex(bPart * signFromA)} \\pm ${sqrtPart}}{${denominator}}`;
  }

  return `${formatNumberLatex(r1)}, ${formatNumberLatex(r2)}`;
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

interface IntegrationResult {
  success: boolean;
  result: string;
}

function integrateExpression(exprStr: string, variable: string): string {
  try {
    let normalized = exprStr.trim();

    while (normalized.startsWith('(') && normalized.endsWith(')') && isBalanced(normalized.slice(1, -1))) {
      normalized = normalized.slice(1, -1).trim();
    }
    normalized = normalized.replace(/\(\((\d+)\)\/\(([^()]+)\)\)/g, '$1/($2)');
    normalized = normalized.replace(/\(\(([^()]+)\)\/\(([^()]+)\)\)/g, '($1)/($2)');

    const terms = splitIntoTerms(normalized);

    if (terms.length === 0) {
      return "0 + C";
    }

    const results: string[] = [];

    for (const term of terms) {
      const result = integrateTerm(term.trim(), variable);
      results.push(result.result);
    }

    let combined = results[0];
    for (let i = 1; i < results.length; i++) {
      const r = results[i];
      if (r.startsWith('-')) {
        combined += ` ${r}`;
      } else {
        combined += ` + ${r}`;
      }
    }

    combined = combined
      .replace(/\+ -/g, '- ')
      .replace(/- -/g, '+ ')
      .replace(/\+ \+/g, '+ ')
      .replace(/^\s*\+\s*/, '');

    return combined + " + C";
  } catch (e) {
    console.error('Integration error:', e);
    return `\\int (${exprStr})\\, d${variable} + C`;
  }
}

function parsePowerTerm(term: string, variable: string): { coeff: number; power: number } | null {
  const v = variable;
  let s = term.trim();

  while (s.startsWith('(') && s.endsWith(')') && isBalanced(s.slice(1, -1))) {
    s = s.slice(1, -1).trim();
  }

  let sign = 1;
  if (s.startsWith('-')) {
    sign = -1;
    s = s.slice(1).trim();
  } else if (s.startsWith('+')) {
    s = s.slice(1).trim();
  }

  const parenFracMatch = s.match(new RegExp(`^\\(?([\\d.]+)?\\)?\\s*\\/\\s*\\(?\\s*${v}(?:\\^([\\d.]+))?\\s*\\)?$`));
  if (parenFracMatch) {
    const numerator = parenFracMatch[1] ? parseFloat(parenFracMatch[1]) : 1;
    const denomPower = parenFracMatch[2] ? parseFloat(parenFracMatch[2]) : 1;
    return { coeff: sign * numerator, power: -denomPower };
  }

  const simpleFracMatch = s.match(new RegExp(`^([\\d.]*)?\\s*\\/\\s*${v}(?:\\^([\\d.]+))?$`));
  if (simpleFracMatch) {
    const numerator = simpleFracMatch[1] ? parseFloat(simpleFracMatch[1]) : 1;
    const denomPower = simpleFracMatch[2] ? parseFloat(simpleFracMatch[2]) : 1;
    return { coeff: sign * numerator, power: -denomPower };
  }

  const fracWithParenMatch = s.match(new RegExp(`^([\\d.]*)?\\s*\\/\\s*\\(\\s*${v}(?:\\^([\\d.]+))?\\s*\\)$`));
  if (fracWithParenMatch) {
    const numerator = fracWithParenMatch[1] ? parseFloat(fracWithParenMatch[1]) : 1;
    const denomPower = fracWithParenMatch[2] ? parseFloat(fracWithParenMatch[2]) : 1;
    return { coeff: sign * numerator, power: -denomPower };
  }

  const powerMatch = s.match(new RegExp(`^([\\d.]*)?\\s*\\*?\\s*${v}(?:\\^([+-]?[\\d.]+))?$`));
  if (powerMatch) {
    let coeff = 1;
    if (powerMatch[1] && powerMatch[1].trim() !== '') {
      coeff = parseFloat(powerMatch[1]);
    }
    const power = powerMatch[2] ? parseFloat(powerMatch[2]) : 1;
    return { coeff: sign * coeff, power };
  }

  if (s === v) {
    return { coeff: sign, power: 1 };
  }
  const numMatch = s.match(/^([\d.]+)$/);
  if (numMatch && !s.includes(v)) {
    return { coeff: sign * parseFloat(numMatch[1]), power: 0 };
  }

  const fullMatch = s.match(new RegExp(`^([\\d.]+)\\s*\\*\\s*${v}(?:\\^([+-]?[\\d.]+))?$`));
  if (fullMatch) {
    const coeff = parseFloat(fullMatch[1]);
    const power = fullMatch[2] ? parseFloat(fullMatch[2]) : 1;
    return { coeff: sign * coeff, power };
  }

  const negPowerMatch = s.match(new RegExp(`^${v}\\^\\((-?[\\d.]+)\\)$`));
  if (negPowerMatch) {
    return { coeff: sign, power: parseFloat(negPowerMatch[1]) };
  }

  return null;
}

function integrateTerm(term: string, variable: string): IntegrationResult {
  const v = variable;
  let s = term.trim();

  if (!s || s === '0') {
    return { success: true, result: '0' };
  }

  const powerParsed = parsePowerTerm(s, v);
  if (powerParsed !== null) {
    const { coeff, power } = powerParsed;

    if (Math.abs(power + 1) < 1e-10) {
      if (Math.abs(coeff - 1) < 1e-10) return { success: true, result: `\\ln|${v}|` };
      if (Math.abs(coeff + 1) < 1e-10) return { success: true, result: `-\\ln|${v}|` };
      return { success: true, result: `${formatNumberLatex(coeff)}\\ln|${v}|` };
    }

    const newPower = power + 1;
    const newCoeff = coeff / newPower;

    return formatPowerResult(newCoeff, newPower, v);
  }

  const funcResult = integrateKnownFunction(s, v);
  if (funcResult.success) {
    return funcResult;
  }
  try {
    const simplified = math.simplify(s).toString();
    if (simplified !== s) {
      const simplifiedParsed = parsePowerTerm(simplified, v);
      if (simplifiedParsed !== null) {
        const { coeff, power } = simplifiedParsed;
        if (Math.abs(power + 1) < 1e-10) {
          if (Math.abs(coeff - 1) < 1e-10) return { success: true, result: `\\ln|${v}|` };
          if (Math.abs(coeff + 1) < 1e-10) return { success: true, result: `-\\ln|${v}|` };
          return { success: true, result: `${formatNumberLatex(coeff)}\\ln|${v}|` };
        }
        const newPower = power + 1;
        const newCoeff = coeff / newPower;
        return formatPowerResult(newCoeff, newPower, v);
      }
    }
  } catch (e) { }

  return { success: false, result: `\\int ${term}\\, d${v}` };
}

function formatPowerResult(coeff: number, power: number, v: string): IntegrationResult {
  const isNeg = coeff < 0;
  const absCoeff = Math.abs(coeff);

  let numerator: number = 1;
  let denominator: number = 1;

  try {
    const f = math.fraction(absCoeff);
    numerator = Number((f as any).n);
    denominator = Number((f as any).d);
  } catch (e) {
    numerator = absCoeff;
  }

  const sign = isNeg ? '-' : '';

  if (Math.abs(power - 1) < 1e-10) {
    if (Math.abs(absCoeff - 1) < 1e-10) {
      return { success: true, result: `${sign}${v}` };
    }
    if (denominator === 1) {
      return { success: true, result: `${sign}${Math.round(numerator)}${v}` };
    }
    return { success: true, result: `${sign}\\frac{${Math.round(numerator)}}{${denominator}}${v}` };
  }

  if (power > 0) {
    const powerStr = Number.isInteger(power) ? power.toString() : formatNumberLatex(power);
    if (Math.abs(absCoeff - 1) < 1e-10) {
      return { success: true, result: `${sign}${v}^{${powerStr}}` };
    }
    if (denominator === 1) {
      return { success: true, result: `${sign}${Math.round(numerator)}${v}^{${powerStr}}` };
    }
    return { success: true, result: `${sign}\\frac{${Math.round(numerator)}}{${denominator}}${v}^{${powerStr}}` };
  }

  const absPower = Math.abs(power);

  if (Math.abs(absPower - 1) < 1e-10) {
    if (denominator === 1 && Math.abs(numerator - 1) < 1e-10) {
      return { success: true, result: `${sign}\\frac{1}{${v}}` };
    }
    if (denominator === 1) {
      return { success: true, result: `${sign}\\frac{${Math.round(numerator)}}{${v}}` };
    }
    return { success: true, result: `${sign}\\frac{${Math.round(numerator)}}{${denominator}${v}}` };
  }

  const powerInt = Math.round(absPower);
  const powerStr = Number.isInteger(absPower) ? powerInt.toString() : formatNumberLatex(absPower);

  if (denominator === 1 && Math.abs(numerator - 1) < 1e-10) {
    return { success: true, result: `${sign}\\frac{1}{${v}^{${powerStr}}}` };
  }
  if (denominator === 1) {
    return { success: true, result: `${sign}\\frac{${Math.round(numerator)}}{${v}^{${powerStr}}}` };
  }
  return { success: true, result: `${sign}\\frac{${Math.round(numerator)}}{${denominator}${v}^{${powerStr}}}` };
}

function integrateKnownFunction(term: string, v: string): IntegrationResult {
  const normalized = term.replace(/\s+/g, '').toLowerCase();

  const knownIntegrals: { [pattern: string]: string } = {
    [`sin(${v})`]: `-\\cos(${v})`,
    [`cos(${v})`]: `\\sin(${v})`,
    [`tan(${v})`]: `-\\ln|\\cos(${v})|`,
    [`cot(${v})`]: `\\ln|\\sin(${v})|`,
    [`sec(${v})^2`]: `\\tan(${v})`,
    [`csc(${v})^2`]: `-\\cot(${v})`,
    [`sec(${v})*tan(${v})`]: `\\sec(${v})`,
    [`csc(${v})*cot(${v})`]: `-\\csc(${v})`,
    [`sec(${v})`]: `\\ln|\\sec(${v})+\\tan(${v})|`,
    [`csc(${v})`]: `-\\ln|\\csc(${v})+\\cot(${v})|`,
    [`e^${v}`]: `e^{${v}}`,
    [`exp(${v})`]: `e^{${v}}`,
    [`sinh(${v})`]: `\\cosh(${v})`,
    [`cosh(${v})`]: `\\sinh(${v})`,
    [`tanh(${v})`]: `\\ln(\\cosh(${v}))`,
    [`log(${v})`]: `${v}\\ln(${v})-${v}`,
    [`ln(${v})`]: `${v}\\ln(${v})-${v}`,
  };

  for (const [pattern, result] of Object.entries(knownIntegrals)) {
    if (normalized === pattern.toLowerCase()) {
      return { success: true, result };
    }
  }

  return { success: false, result: '' };
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

export const evaluateMath = (
  expression: string,
  sessionType: 'math' | 'physics' | 'default' = 'default'
): string => {
  try {
    const sanitized = latexToMathJS(expression);
    const trimmed = sanitized.trim();

    if (trimmed.startsWith("solve(")) {
      const match = trimmed.match(/^solve\((.+),\s*([a-zA-Z0-9_]+)\)$/);
      if (match) return solveEquation(match[1], match[2]);
      return "Error: Invalid solve syntax";
    }

    if (trimmed.includes("derivative") || trimmed.includes("d/d")) {
      const dMatch = trimmed.match(/d\/d([a-zA-Z])\((.+)\)/);
      let cmd = trimmed;
      if (dMatch) cmd = `derivative(${dMatch[2]}, ${dMatch[1]})`;
      const res = math.evaluate(cmd);
      return res.toString().replace(/\s\*\s/g, "");
    }

    if (trimmed.startsWith("integrate(")) {
      const defMatch = trimmed.match(/^integrate\((.+),\s*([a-zA-Z]+),\s*([^,]+),\s*([^)]+)\)$/);
      if (defMatch) {
        return definiteIntegral(defMatch[1], defMatch[2], math.evaluate(defMatch[3]), math.evaluate(defMatch[4]));
      }

      const indefMatch = trimmed.match(/^integrate\((.+),\s*([a-zA-Z]+)\)$/);
      if (indefMatch) {
        return integrateExpression(indefMatch[1], indefMatch[2]);
      }

      const singleMatch = trimmed.match(/^integrate\((.+)\)$/);
      if (singleMatch) {
        return integrateExpression(singleMatch[1], 'x');
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

  } catch (error: any) {
    console.error('CAS Error:', error);
    return "Error";
  }
};