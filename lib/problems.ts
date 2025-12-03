// lib/problems.ts

import { mathProblems as calculusProblems } from './Exercises/math-problems';
import { physicsProblems as allPhysicsProblems } from './Exercises/physics-problems';
import { arithmeticProblems } from './Exercises/arithmetic-problems';
import { beginnerPhysicsProblems } from './Exercises/beginner-physics-problems';
import { beginnerMathProblems } from './Exercises/beginner-math-problems';
import { statisticsProblems } from './Exercises/statistics-problems';

export interface Problem {
  id: string;
  topic: string;
  category: string;
  difficulty: number;
  problem: string;
  answer: string;
  unit?: string;
  format_hint?: string;
}

export const mathProblems: Problem[] = [
  ...beginnerMathProblems,
  ...arithmeticProblems,
  ...calculusProblems,
  ...statisticsProblems
];

export const physicsProblems: Problem[] = [
  ...beginnerPhysicsProblems,
  ...allPhysicsProblems
];

export const allProblems: Problem[] = [...mathProblems, ...physicsProblems];

export const allCategories: string[] = [
  "Addition",
  "Subtraction",
  "Multiplication",
  "Division",
  "Linear Equations",
  "Exponents",
  "Statistics",
  "Calculus I",
  "Calculus II",
  "Calculus III",
  "Differential Equations",
  "Linear Algebra1",
  "Linear Algebra2",
  "Complex Analysis",
  "Algebra I",
  "Algebra II",
  "Geometry",
  "Pre-Calculus",
  "Pre-Algebra",
  "Arithmetic",
  "Kinematic Equations",
  "Forces & Newton's Laws",
  "Work & Energy",
  "Momentum & Collisions",
  "Circular Motion & Gravitation",
  "Rotational Motion",
  "Simple Harmonic Motion",
  "Electric Fields & Potential",
  "Circuits & Capacitance",
  "Magnetic Fields & Forces",
  "Electromagnetic Induction",
  "Thermodynamics",
  "Statistical Mechanics",
  "Optics and Waves",
  "Modern Physics",
  "Quantum Mechanics",
  "Quantum Field Theory",
];