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

function latexToMathJS(latex: string): string {
  let s = latex;

  s = s.replace(/\\left/g, "").replace(/\\right/g, "");
  s = s.replace(/\\operatorname\{([^}]+)\}/g, "$1");
  s = s.replace(/\\mathrm\{([^}]+)\}/g, "$1");
  s = s.replace(/\\text\{([^}]+)\}/g, "$1");
  s = s.replace(/\\,/g, "");

  while (s.includes("\\frac{")) {
    s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)");
    if (s.includes("\\frac{") && !s.match(/\\frac\{([^{}]+)\}\{([^{}]+)\}/)) {
      s = s.replace(/\\frac/g, "");
      break;
    }
  }

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
    [/\^/g, "^"],
  ];

  replacements.forEach(([regex, replacement]) => {
    s = s.replace(regex, replacement);
  });

  s = s.replace(/\{/g, "(").replace(/\}/g, ")");

  s = s.replace(/(\d)([a-zA-Z\\(])/g, '$1*$2');
  s = s.replace(/(\))([a-zA-Z0-9\\(])/g, '$1*$2');

  return s;
}

function formatNumberLatex(num: number): string {
  if (Math.abs(num) < 1e-10) return "0";

  if (Math.abs(num - Math.round(num)) < 1e-9) return Math.round(num).toString();
  try {
    const f = math.fraction(num);
    // Only accept "simple" fractions (small denominator)
    if ((f as any).d < 1000) {
      const ratio = math.format(f, { fraction: 'ratio' });
      if (ratio.includes("/")) {
        const [n, d] = ratio.split("/");
        return `\\frac{${n}}{${d}}`;
      }
      return ratio;
    }
  } catch (e) { }

  // 3. Fallback to fixed decimal
  return parseFloat(num.toFixed(4)).toString();
}

function simplifyRadicalLatex(num: number): string {
  if (num < 0) return `\\sqrt{${num}}`;
  const n = Math.round(num);
  if (Math.abs(n - num) > 1e-6) return `\\sqrt{${parseFloat(num.toFixed(4))}}`;

  let maxSquare = 1;
  for (let i = 2; i * i <= n; i++) {
    if (n % (i * i) === 0) {
      maxSquare = i * i;
    }
  }

  const outside = Math.sqrt(maxSquare);
  const inside = n / maxSquare;

  if (inside === 1) return outside.toString();
  if (outside === 1) return `\\sqrt{${inside}}`;
  return `${outside}\\sqrt{${inside}}`;
}

function getGcd(x: number, y: number): number {
  x = Math.abs(x); y = Math.abs(y);
  while (y) { var t = y; y = x % y; x = t; }
  return x;
}

function solveNumerically(expr: any, variable: string, initialGuess = 1): string {
  let x = initialGuess;
  for (let i = 0; i < 20; i++) {
    try {
      const y = expr.evaluate({ [variable]: x });
      // Approximate derivative
      const h = 0.0001;
      const y_plus = expr.evaluate({ [variable]: x + h });
      const dy = (y_plus - y) / h;

      if (Math.abs(dy) < 1e-9) break; // stationary point
      const nextX = x - y / dy;

      if (Math.abs(nextX - x) < 1e-6) {
        return formatNumberLatex(nextX);
      }
      x = nextX;
    } catch (e) {
      return "Error";
    }
  }
  return "No solution found";
}

function solveEquation(equationStr: string, variable: string): string {
  try {
    const parts = equationStr.split("=");
    let exprStr = parts[0];
    if (parts.length > 1) {
      exprStr = `(${parts[0]}) - (${parts[1]})`;
    }

    const expr = math.compile(exprStr);

    const c = expr.evaluate({ [variable]: 0 });
    const val1 = expr.evaluate({ [variable]: 1 });
    const valMinus1 = expr.evaluate({ [variable]: -1 });
    let a = (val1 + valMinus1) / 2 - c;
    let b = (val1 - valMinus1) / 2;
    let c_term = c;

    const roundIfClose = (n: number) => Math.abs(n - Math.round(n)) < 1e-6 ? Math.round(n) : n;
    a = roundIfClose(a);
    b = roundIfClose(b);
    c_term = roundIfClose(c_term);

    const threshold = 1e-10;

    const valTest = expr.evaluate({ [variable]: 10 });
    const predicted = a * 100 + b * 10 + c_term;

    if (Math.abs(valTest - predicted) > 0.001) {
      return solveNumerically(expr, variable);
    }

    if (Math.abs(a) < threshold) {
      if (Math.abs(b) < threshold) return "No solution";
      const res = -c_term / b;
      return formatNumberLatex(res);
    }

    const discriminant = b * b - 4 * a * c_term;

    if (discriminant < 0) {
      const real = -b / (2 * a);
      const imag = Math.sqrt(-discriminant) / (2 * a);
      return `${formatNumberLatex(real)} \\pm ${formatNumberLatex(imag)}i`;
    }

    const rootD = Math.sqrt(discriminant);
    if (Math.abs(rootD - Math.round(rootD)) < 1e-6) {
      const r1 = (-b + Math.round(rootD)) / (2 * a);
      const r2 = (-b - Math.round(rootD)) / (2 * a);
      if (Math.abs(r1 - r2) < threshold) return formatNumberLatex(r1);
      return `${formatNumberLatex(r1)}, ${formatNumberLatex(r2)}`;
    } else {
      const n = Math.round(discriminant);
      let maxSquare = 1;
      for (let i = 2; i * i <= n; i++) {
        if (n % (i * i) === 0) {
          maxSquare = i * i;
        }
      }
      const rootCoeff = Math.sqrt(maxSquare);
      const insideRoot = n / maxSquare;

      let termB = -b;
      let termRoot = rootCoeff;
      let termDenom = 2 * a;

      if (termDenom < 0) {
        termB = -termB;
        termDenom = -termDenom;
      }

      let commonDivisor = 1;
      if (Math.abs(termB) < threshold) {
        commonDivisor = getGcd(Math.round(termRoot), Math.round(termDenom));
      } else {
        const gcd1 = getGcd(Math.round(termB), Math.round(termRoot));
        commonDivisor = getGcd(gcd1, Math.round(termDenom));
      }

      termB /= commonDivisor;
      termRoot /= commonDivisor;
      termDenom /= commonDivisor;

      let rootPart = "";
      if (termRoot === 1) rootPart = `\\sqrt{${insideRoot}}`;
      else rootPart = `${formatNumberLatex(termRoot)}\\sqrt{${insideRoot}}`;

      if (Math.abs(termB) < threshold) {
        if (termDenom === 1) return `\\pm ${rootPart}`;
        return `\\pm \\frac{${rootPart}}{${formatNumberLatex(termDenom)}}`;
      }

      if (termDenom === 1) {
        return `${formatNumberLatex(termB)} \\pm ${rootPart}`;
      }

      return `\\frac{${formatNumberLatex(termB)} \\pm ${rootPart}}{${formatNumberLatex(termDenom)}}`;
    }

  } catch (e) {
    return "Error";
  }
}

function integrateTerm(term: string, variable: string): string {
  term = term.replace(/\s/g, "");
  const varPlaceholder = "VAR";
  const normalized = term.split(variable).join(varPlaceholder);

  const powerRule = /^([+-]?[\d\.]*)?[\*]?VAR(?:\^([+-]?[\d\.]+))?$/;
  const powerMatch = normalized.match(powerRule);

  if (powerMatch) {
    let coeff = 1;
    if (powerMatch[1] === "-") coeff = -1;
    else if (powerMatch[1] && powerMatch[1] !== "+") coeff = parseFloat(powerMatch[1]);

    let power = 1;
    if (powerMatch[2]) power = parseFloat(powerMatch[2]);

    if (power === -1) {
      const cStr = formatNumberLatex(coeff);
      if (cStr === "1") return `\\ln(${variable})`;
      if (cStr === "-1") return `-\\ln(${variable})`;
      return `${cStr}\\ln(${variable})`;
    }

    const newPower = power + 1;
    const newCoeff = coeff / newPower;
    const coeffStr = formatNumberLatex(newCoeff);

    let prefix = coeffStr;
    if (coeffStr === "1") prefix = "";
    if (coeffStr === "-1") prefix = "-";

    return `${prefix}${variable}^{${newPower}}`;
  }

  if (!normalized.includes(varPlaceholder)) {
    const val = parseFloat(term);
    if (!isNaN(val)) return `${formatNumberLatex(val)}${variable}`;
  }

  if (normalized === `sin(${varPlaceholder})`) return `-\\cos(${variable})`;
  if (normalized === `cos(${varPlaceholder})`) return `\\sin(${variable})`;
  if (normalized === `e^${varPlaceholder}` || normalized === `exp(${varPlaceholder})`) return `e^{${variable}}`;

  if (normalized === `VAR*cos(VAR)`) return `\\cos(${variable}) + ${variable}\\sin(${variable})`;
  if (normalized === `VAR*sin(VAR)`) return `\\sin(${variable}) - ${variable}\\cos(${variable})`;
  if (normalized === `VAR*e^VAR`) return `${variable}e^{${variable}} - e^{${variable}}`;

  return `\\int ${term}`;
}

function integrateExpression(exprStr: string, variable: string): string {
  try {
    const terms = exprStr.match(/([+-]?[^+-]+)/g);
    if (!terms) return integrateTerm(exprStr, variable) + " + C";

    const results = terms.map(t => integrateTerm(t, variable));
    let final = results.join(" + ").replace(/\+ \-/g, "- ").replace(/\+ \+/g, "+ ");
    if (final.startsWith("+ ")) final = final.substring(2);

    return final + " + C";
  } catch (e) {
    return "Error";
  }
}

function definiteIntegral(exprStr: string, variable: string, start: number, end: number): string {
  try {
    const expr = math.compile(exprStr);
    const n = 100;
    const h = (end - start) / n;
    let sum = expr.evaluate({ [variable]: start }) + expr.evaluate({ [variable]: end });

    for (let i = 1; i < n; i++) {
      const x = start + i * h;
      const val = expr.evaluate({ [variable]: x });
      sum += (i % 2 === 0 ? 2 : 4) * val;
    }

    const result = (h / 3) * sum;
    return formatNumberLatex(result);
  } catch (e) {
    return "Error";
  }
}

function approximateLimit(exprStr: string, variable: string, targetVal: number | string): string {
  try {
    const expr = math.compile(exprStr);
    let val = 0;
    const isInf = targetVal === 'Infinity' || targetVal === Infinity;
    const isNegInf = targetVal === '-Infinity' || targetVal === -Infinity;

    if (isInf) val = 10000;
    else if (isNegInf) val = -10000;
    else val = Number(targetVal);

    if (isNaN(val)) return "Error";

    if (!isInf && !isNegInf) {
      const h = 0.0001;
      const right = expr.evaluate({ [variable]: val + h });
      const left = expr.evaluate({ [variable]: val - h });
      if (Math.abs(right - left) > 0.1 && Math.abs(right) < 1000) return "Undefined";
      if (!isFinite(right)) return "Undefined";
      return formatNumberLatex(right);
    } else {
      const res = expr.evaluate({ [variable]: val });
      return formatNumberLatex(res);
    }
  } catch (e) {
    return "Error";
  }
}

function factorQuadratic(exprStr: string): string {
  try {
    const variable = 'x';
    const roots = solveEquation(exprStr + "=0", variable);

    if (roots.includes("Error") || roots.includes("No") || roots.includes("\\pm") || roots.includes("sqrt")) return math.simplify(exprStr).toString();

    const parts = roots.split(",");

    return math.simplify(exprStr).toString();
  } catch (e) {
    return "Error";
  }
}

export const evaluateMath = (
  expression: string,
  sessionType: 'math' | 'physics' | 'default' = 'default'
): string => {
  try {
    const sanitized = latexToMathJS(expression);
    const trimmed = sanitized.trim();

    if (trimmed.startsWith("solve(")) {
      const match = trimmed.match(/^solve\((.+),([a-zA-Z0-9_]+)\)$/);
      if (match) return solveEquation(match[1], match[2]);
    }

    if (trimmed.includes("derivative") || trimmed.includes("d/d")) {
      const dMatch = trimmed.match(/d\/d([a-zA-Z])\((.+)\)/);
      let cmd = trimmed;
      if (dMatch) cmd = `derivative(${dMatch[2]}, ${dMatch[1]})`;
      const res = math.evaluate(cmd);
      return res.toString().replace(/\s\*\s/g, "");
    }

    if (trimmed.startsWith("integrate(")) {
      const defMatch = trimmed.match(/^integrate\(([^,]+),([a-zA-Z]+),([^,]+),([^,]+)\)$/);
      if (defMatch) return definiteIntegral(defMatch[1], defMatch[2], math.evaluate(defMatch[3]), math.evaluate(defMatch[4]));
      const indefMatch = trimmed.match(/^integrate\(([^,]+),([a-zA-Z]+)\)$/);
      if (indefMatch) return integrateExpression(indefMatch[1], indefMatch[2]);
    }

    if (trimmed.startsWith("limit(")) {
      const cleanLimit = trimmed.replace("->", ",");
      const match = cleanLimit.match(/^limit\(([^,]+),([a-zA-Z]+),([^)]+)\)$/);
      if (match) return approximateLimit(match[1], match[2], match[3]);
    }

    if (trimmed.match(/^(sum|product)\(/)) {
      const match = trimmed.match(/^(sum|product)\(([^,]+),([a-zA-Z]+),([^,]+),([^)]+)\)$/);
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
      if (inner) return factorQuadratic(inner[1]);
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
    return "Error";
  }
};