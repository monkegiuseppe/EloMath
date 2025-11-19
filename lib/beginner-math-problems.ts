import type { Problem } from './problems';

export const beginnerMathProblems: Problem[] = [
    // Algebra: Linear Equations (400-700)
    {
        id: "BM_ALG01",
        topic: "Linear Equations",
        category: "Algebra I",
        difficulty: 400,
        problem: "Solve for x: $3x = 15$",
        answer: "5"
    },
    {
        id: "BM_ALG02",
        topic: "Linear Equations",
        category: "Algebra I",
        difficulty: 450,
        problem: "Solve for x: $2x + 4 = 12$",
        answer: "4"
    },
    {
        id: "BM_ALG03",
        topic: "Linear Equations",
        category: "Algebra I",
        difficulty: 500,
        problem: "Solve for x: $5x - 3 = 2x + 9$",
        answer: "4"
    },
    {
        id: "BM_ALG04",
        topic: "Linear Equations",
        category: "Algebra I",
        difficulty: 550,
        problem: "Solve for y: $\\frac{y}{3} - 1 = 2$",
        answer: "9"
    },
    {
        id: "BM_ALG05",
        topic: "Linear Equations",
        category: "Algebra I",
        difficulty: 600,
        problem: "Solve for x: $2(x + 1) = 10$",
        answer: "4"
    },
    {
        id: "BM_ALG06",
        topic: "Slope",
        category: "Algebra I",
        difficulty: 650,
        problem: "Find the slope of the line: $y = 4x - 2$",
        answer: "4"
    },
    {
        id: "BM_ALG07",
        topic: "Slope",
        category: "Algebra I",
        difficulty: 700,
        problem: "Find the slope between points $(1, 2)$ and $(3, 8)$.",
        answer: "3"
    },

    // Algebra: Systems & Quadratics (700-900)
    {
        id: "BM_SYS01",
        topic: "Systems of Equations",
        category: "Algebra I",
        difficulty: 750,
        problem: "If $x + y = 6$ and $x - y = 2$, find $x$.",
        answer: "4"
    },
    {
        id: "BM_SYS02",
        topic: "Systems of Equations",
        category: "Algebra I",
        difficulty: 800,
        problem: "If $y = 2x$ and $x + y = 9$, find $y$.",
        answer: "6"
    },
    {
        id: "BM_QUAD01",
        topic: "Quadratics",
        category: "Algebra I",
        difficulty: 800,
        problem: "Find the positive solution: $x^2 = 64$",
        answer: "8"
    },
    {
        id: "BM_QUAD02",
        topic: "Quadratics",
        category: "Algebra I",
        difficulty: 850,
        problem: "Solve for positive x: $x^2 - 5x + 6 = 0$. (Enter the larger root)",
        answer: "3"
    },
    {
        id: "BM_QUAD03",
        topic: "Quadratics",
        category: "Algebra I",
        difficulty: 900,
        problem: "Factor and solve for positive x: $x^2 + 4x + 4 = 0$",
        answer: "-2"
    },

    // Geometry (500-800)
    {
        id: "BM_GEO01",
        topic: "Area",
        category: "Geometry",
        difficulty: 500,
        problem: "Area of a rectangle with length 6 and width 4.",
        answer: "24"
    },
    {
        id: "BM_GEO02",
        topic: "Perimeter",
        category: "Geometry",
        difficulty: 500,
        problem: "Perimeter of a square with side length 5.",
        answer: "20"
    },
    {
        id: "BM_GEO03",
        topic: "Triangles",
        category: "Geometry",
        difficulty: 550,
        problem: "Area of a triangle with base 10 and height 5.",
        answer: "25"
    },
    {
        id: "BM_GEO04",
        topic: "Circles",
        category: "Geometry",
        difficulty: 600,
        problem: "Circumference of a circle with radius 3. (Use $\\pi$)",
        answer: "6pi"
    },
    {
        id: "BM_GEO05",
        topic: "Circles",
        category: "Geometry",
        difficulty: 650,
        problem: "Area of a circle with radius 4. (Use $\\pi$)",
        answer: "16pi"
    },
    {
        id: "BM_GEO06",
        topic: "Angles",
        category: "Geometry",
        difficulty: 550,
        problem: "Two angles in a triangle are $60^\\circ$ and $50^\\circ$. Find the third.",
        answer: "70"
    },
    {
        id: "BM_GEO07",
        topic: "Pythagoras",
        category: "Geometry",
        difficulty: 750,
        problem: "Right triangle with legs 6 and 8. Find the hypotenuse.",
        answer: "10"
    },
    {
        id: "BM_GEO08",
        topic: "Pythagoras",
        category: "Geometry",
        difficulty: 800,
        problem: "Find leg $b$ if hypotenuse is 13 and leg $a$ is 5.",
        answer: "12"
    },

    // Exponents & Radicals (600-900)
    {
        id: "BM_EXP01",
        topic: "Exponents",
        category: "Algebra I",
        difficulty: 600,
        problem: "Simplify: $2^3 \\cdot 2^2$",
        answer: "32"
    },
    {
        id: "BM_EXP02",
        topic: "Exponents",
        category: "Algebra I",
        difficulty: 650,
        problem: "Calculate: $(3^2)^2$",
        answer: "81"
    },
    {
        id: "BM_EXP03",
        topic: "Exponents",
        category: "Algebra I",
        difficulty: 700,
        problem: "Evaluate: $4^{-1}$ as a decimal.",
        answer: "0.25"
    },
    {
        id: "BM_EXP04",
        topic: "Exponents",
        category: "Algebra I",
        difficulty: 750,
        problem: "Simplify: $x^5 / x^2$ (enter exponent of x)",
        answer: "3"
    },
    {
        id: "BM_RAD01",
        topic: "Radicals",
        category: "Algebra I",
        difficulty: 700,
        problem: "Simplify: $\\sqrt{16} + \\sqrt{9}$",
        answer: "7"
    },
    {
        id: "BM_RAD02",
        topic: "Radicals",
        category: "Algebra I",
        difficulty: 800,
        problem: "Simplify: $\\sqrt{8}$ as $2\\sqrt{x}$. What is x?",
        answer: "2"
    },

    // Trigonometry & Functions (800-1100)
    {
        id: "BM_TRIG01",
        topic: "Basic Trig",
        category: "Pre-Calculus",
        difficulty: 850,
        problem: "Evaluate: $\\sin(0)$",
        answer: "0"
    },
    {
        id: "BM_TRIG02",
        topic: "Basic Trig",
        category: "Pre-Calculus",
        difficulty: 900,
        problem: "Evaluate: $\\cos(0)$",
        answer: "1"
    },
    {
        id: "BM_TRIG03",
        topic: "Right Triangles",
        category: "Pre-Calculus",
        difficulty: 950,
        problem: "In a right triangle, $\\sin(\\theta) = 3/5$. Find $\\cos(\\theta)$ if $\\theta$ is acute.",
        answer: "0.8"
    },
    {
        id: "BM_TRIG04",
        topic: "Radians",
        category: "Pre-Calculus",
        difficulty: 900,
        problem: "Convert $90^\\circ$ to radians. (Use $\\pi$)",
        answer: "pi/2"
    },
    {
        id: "BM_FUNC01",
        topic: "Functions",
        category: "Algebra II",
        difficulty: 800,
        problem: "If $f(x) = 2x - 5$, find $f(4)$.",
        answer: "3"
    },
    {
        id: "BM_FUNC02",
        topic: "Functions",
        category: "Algebra II",
        difficulty: 900,
        problem: "If $g(x) = x^2 + 1$, find $g(-2)$.",
        answer: "5"
    },
    {
        id: "BM_FUNC03",
        topic: "Composite Functions",
        category: "Algebra II",
        difficulty: 1000,
        problem: "If $f(x) = x+1$ and $g(x) = 2x$, find $f(g(3))$.",
        answer: "7"
    },

    // Intro to Linear Algebra / Vectors (900-1150)
    {
        id: "BM_VEC01",
        topic: "Vector Addition",
        category: "Linear Algebra",
        difficulty: 900,
        problem: "Add vectors: $\\langle 2, 3 \\rangle + \\langle 1, 4 \\rangle$. Enter x-component.",
        answer: "3"
    },
    {
        id: "BM_VEC02",
        topic: "Scalar Mult",
        category: "Linear Algebra",
        difficulty: 950,
        problem: "Calculate $3 \\cdot \\langle 2, -1 \\rangle$. Enter y-component.",
        answer: "-3"
    },
    {
        id: "BM_VEC03",
        topic: "Magnitude",
        category: "Linear Algebra",
        difficulty: 1050,
        problem: "Find the magnitude of vector $\\langle 3, 4 \\rangle$.",
        answer: "5"
    },
    {
        id: "BM_MAT01",
        topic: "Matrix Element",
        category: "Linear Algebra",
        difficulty: 1000,
        problem: "Matrix $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$. What is $A_{21}$?",
        answer: "3"
    },
    {
        id: "BM_MAT02",
        topic: "Matrix Trace",
        category: "Linear Algebra",
        difficulty: 1100,
        problem: "Find the trace (sum of diagonal) of $\\begin{pmatrix} 5 & 1 \\\\ 2 & 3 \\end{pmatrix}$.",
        answer: "8"
    },

    // Logarithms (900-1100)
    {
        id: "BM_LOG01",
        topic: "Logarithms",
        category: "Algebra II",
        difficulty: 900,
        problem: "Evaluate: $\\log_2(8)$",
        answer: "3"
    },
    {
        id: "BM_LOG02",
        topic: "Logarithms",
        category: "Algebra II",
        difficulty: 950,
        problem: "Evaluate: $\\log_{10}(1000)$",
        answer: "3"
    },
    {
        id: "BM_LOG03",
        topic: "Logarithms",
        category: "Algebra II",
        difficulty: 1000,
        problem: "Simplify: $\\ln(e)$",
        answer: "1"
    },
    {
        id: "BM_LOG04",
        topic: "Logarithms",
        category: "Algebra II",
        difficulty: 1100,
        problem: "Solve for x: $2^x = 16$",
        answer: "4"
    },

    // Arithmetic Misc (300-500 Filler)
    {
        id: "BM_ARITH01",
        topic: "Order of Ops",
        category: "Arithmetic",
        difficulty: 350,
        problem: "Calculate: $10 - 2 \\times 3$",
        answer: "4"
    },
    {
        id: "BM_ARITH02",
        topic: "Percentages",
        category: "Arithmetic",
        difficulty: 450,
        problem: "What is 50% of 80?",
        answer: "40"
    },
    {
        id: "BM_ARITH03",
        topic: "Negative Numbers",
        category: "Arithmetic",
        difficulty: 400,
        problem: "Calculate: $-5 + (-7)$",
        answer: "-12"
    },
    {
        id: "BM_ARITH04",
        topic: "Fractions",
        category: "Arithmetic",
        difficulty: 480,
        problem: "Simplify: $\\frac{1}{3} + \\frac{1}{3}$",
        answer: "2/3"
    }
];