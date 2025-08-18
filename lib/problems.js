// Enhanced problem database with math and physics problems
// Format: { id, topic, category, difficulty, problem, answer }

export const mathProblems = [
  // --- Calculus I: Derivatives ---
  {
    category: "Calculus I",
    id: "C01",
    topic: "Basic Derivative",
    difficulty: 1100,
    problem: "Let $f(x) = 5x^3 - 7x^2 + 2x - 10$. Find the value of $f'(2)$.",
    answer: "34",
  },
  {
    category: "Calculus I",
    id: "C02",
    topic: "Product Rule",
    difficulty: 1350,
    problem: "Let $h(x) = x^2 \\cdot \\sin(x)$. Find the value of $h'(\\pi)$.",
    answer: "-π²",
  },
  {
    category: "Calculus I",
    id: "C03",
    topic: "Chain Rule",
    difficulty: 1300,
    problem: "Find the derivative of $f(x) = \\sin(3x^2 + 1)$.",
    answer: "6x*cos(3x²+1)",
  },
  {
    category: "Calculus I",
    id: "C04",
    topic: "Implicit Differentiation",
    difficulty: 1450,
    problem: "Find $\\frac{dy}{dx}$ if $x^2 + y^2 = 25$.",
    answer: "-x/y",
  },

  // --- Calculus II: Integrals ---
  {
    category: "Calculus II",
    id: "C10",
    topic: "Definite Integral",
    difficulty: 1250,
    problem:
      "Evaluate the definite integral of $f(x) = 3x^2 + 4x$ from $x=0$ to $x=2$. That is, find $\\int_0^2 (3x^2+4x)dx$.",
    answer: "16",
  },
  {
    category: "Calculus II",
    id: "C11",
    topic: "U-Substitution",
    difficulty: 1550,
    problem: "Evaluate $\\int_0^1 x(x^2 + 1)^3 dx$.",
    answer: "1.875",
  },
  {
    category: "Calculus II",
    id: "C12",
    topic: "Integration by Parts",
    difficulty: 1600,
    problem: "Evaluate $\\int x e^x dx$.",
    answer: "xe^x - e^x",
  },
  {
    category: "Calculus II",
    id: "C13",
    topic: "Series Convergence",
    difficulty: 1700,
    problem: "Does the series $\\sum_{n=1}^{\\infty} \\frac{1}{n^2}$ converge or diverge?",
    answer: "converge",
  },

  // --- Linear Algebra ---
  {
    category: "Linear Algebra",
    id: "LA01",
    topic: "Matrix Multiplication",
    difficulty: 1200,
    problem:
      "Let $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ and $B = \\begin{pmatrix} 2 & 0 \\\\ 1 & 3 \\end{pmatrix}$. Find the element in the first row, first column of the product $AB$.",
    answer: "4",
  },
  {
    category: "Linear Algebra",
    id: "LA02",
    topic: "Determinant",
    difficulty: 1150,
    problem: "Find the determinant of $\\begin{pmatrix} 3 & 1 \\\\ 2 & 4 \\end{pmatrix}$.",
    answer: "10",
  },
  {
    category: "Linear Algebra",
    id: "LA03",
    topic: "Eigenvalues",
    difficulty: 1500,
    problem: "Find the larger eigenvalue of $\\begin{pmatrix} 5 & 2 \\\\ 2 & 2 \\end{pmatrix}$.",
    answer: "6",
  },
  {
    category: "Linear Algebra",
    id: "LA04",
    topic: "Vector Spaces",
    difficulty: 1400,
    problem: "What is the dimension of the vector space $\\mathbb{R}^3$?",
    answer: "3",
  },

  {
    category: "Complex Analysis",
    id: "CA01",
    topic: "Complex Numbers",
    difficulty: 1300,
    problem: "Find the modulus of the complex number $z = 3 + 4i$.",
    answer: "5",
  },
  {
    category: "Complex Analysis",
    id: "CA02",
    topic: "Cauchy-Riemann",
    difficulty: 1800,
    problem: "Is the function $f(z) = z^2$ analytic everywhere in the complex plane?",
    answer: "yes",
  },
]

export const physicsProblems = [
  // --- Quantum Mechanics ---
  {
    category: "Quantum Mechanics",
    id: "QM01",
    topic: "Wave Function Normalization",
    difficulty: 1400,
    problem:
      "A particle in a 1D box of length $L$ has the wave function $\\psi(x) = A\\sin(\\frac{\\pi x}{L})$ for $0 \\leq x \\leq L$. Find the normalization constant $A$.",
    answer: "sqrt(2/L)",
  },
  {
    category: "Quantum Mechanics",
    id: "QM02",
    topic: "Uncertainty Principle",
    difficulty: 1600,
    problem:
      "For a particle in the ground state of a harmonic oscillator, the position uncertainty is $\\Delta x = \\sqrt{\\frac{\\hbar}{2m\\omega}}$. What is the momentum uncertainty $\\Delta p$?",
    answer: "sqrt(ℏmω/2)",
  },
  {
    category: "Quantum Mechanics",
    id: "QM03",
    topic: "Hydrogen Atom",
    difficulty: 1800,
    problem:
      "What is the energy of the first excited state (n=2) of the hydrogen atom in eV? (Ground state energy is -13.6 eV)",
    answer: "-3.4",
  },
  {
    category: "Quantum Mechanics",
    id: "QM04",
    topic: "Spin",
    difficulty: 1500,
    problem: "What is the magnitude of the spin angular momentum for an electron?",
    answer: "sqrt(3/4)*ℏ",
  },
  {
    category: "Quantum Mechanics",
    id: "QM05",
    topic: "Commutators",
    difficulty: 1700,
    problem: "What is the commutator $[\\hat{x}, \\hat{p}]$ in quantum mechanics?",
    answer: "iℏ",
  },

  // --- Quantum Field Theory ---
  {
    category: "Quantum Field Theory",
    id: "QFT01",
    topic: "Klein-Gordon Equation",
    difficulty: 2000,
    problem:
      "The Klein-Gordon equation is $(\\partial^2 + m^2)\\phi = 0$. For a plane wave solution $\\phi = Ae^{-ip \\cdot x}$, what is the dispersion relation?",
    answer: "p² = m²",
  },
  {
    category: "Quantum Field Theory",
    id: "QFT02",
    topic: "Feynman Diagrams",
    difficulty: 2200,
    problem: "In QED, the vertex factor for an electron-photon interaction is proportional to what coupling constant?",
    answer: "e",
  },
  {
    category: "Quantum Field Theory",
    id: "QFT03",
    topic: "Dirac Equation",
    difficulty: 2100,
    problem: "The Dirac equation describes particles with what spin?",
    answer: "1/2",
  },
  {
    category: "Quantum Field Theory",
    id: "QFT04",
    topic: "Gauge Theory",
    difficulty: 2300,
    problem: "In QED, what is the gauge boson?",
    answer: "photon",
  },

  // --- Statistical Mechanics ---
  {
    category: "Statistical Mechanics",
    id: "SM01",
    topic: "Boltzmann Distribution",
    difficulty: 1500,
    problem:
      "For a system in thermal equilibrium at temperature $T$, what is the ratio of populations $N_2/N_1$ for two energy levels separated by energy $\\Delta E$?",
    answer: "exp(-ΔE/kT)",
  },
  {
    category: "Statistical Mechanics",
    id: "SM02",
    topic: "Partition Function",
    difficulty: 1600,
    problem:
      "For a two-level system with energies 0 and $\\epsilon$, what is the partition function at temperature $T$?",
    answer: "1 + exp(-ε/kT)",
  },
  {
    category: "Statistical Mechanics",
    id: "SM03",
    topic: "Entropy",
    difficulty: 1700,
    problem: "What is the entropy of a system with $\\Omega$ microstates according to Boltzmann?",
    answer: "k*ln(Ω)",
  },

  {
    category: "Thermodynamics",
    id: "TD01",
    topic: "First Law",
    difficulty: 1300,
    problem: "State the first law of thermodynamics in equation form.",
    answer: "dU = δQ - δW",
  },
  {
    category: "Thermodynamics",
    id: "TD02",
    topic: "Carnot Efficiency",
    difficulty: 1500,
    problem: "What is the efficiency of a Carnot engine operating between temperatures $T_h$ and $T_c$?",
    answer: "1 - Tc/Th",
  },

  {
    category: "Electromagnetism",
    id: "EM01",
    topic: "Coulomb's Law",
    difficulty: 1200,
    problem: "What is the force between two point charges $q_1$ and $q_2$ separated by distance $r$?",
    answer: "kq₁q₂/r²",
  },
  {
    category: "Electromagnetism",
    id: "EM02",
    topic: "Maxwell Equations",
    difficulty: 1900,
    problem: "How many Maxwell equations are there?",
    answer: "4",
  },
]

export const allProblems = [...mathProblems, ...physicsProblems]
export const allCategories = [
  "Calculus I",
  "Calculus II",
  "Linear Algebra",
  "Complex Analysis",
  "Quantum Mechanics",
  "Quantum Field Theory",
  "Statistical Mechanics",
  "Thermodynamics",
  "Electromagnetism",
]
