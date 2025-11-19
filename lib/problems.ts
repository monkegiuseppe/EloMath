// lib/problems.ts

import { mathProblems as calculusProblems } from './math-problems';
import { physicsProblems as allPhysicsProblems } from './physics-problems';
import { arithmeticProblems } from './arithmetic-problems';

// The main interface for all problems in the application.
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

// Combine Calculus/Linear Algebra with Arithmetic/Algebra
export const mathProblems: Problem[] = [...arithmeticProblems, ...calculusProblems];
export const physicsProblems: Problem[] = allPhysicsProblems;

export const allProblems: Problem[] = [...mathProblems, ...physicsProblems];

export const allCategories: string[] = [
  // Basic Math (New)
  "Addition",
  "Subtraction",
  "Multiplication",
  "Division",
  "Linear Equations",
  "Exponents",
  // Advanced Math
  "Calculus I",
  "Calculus II",
  "Calculus III",
  "Differential Equations",
  "Linear Algebra1",
  "Linear Algebra2",
  "Complex Analysis",
  // Physics
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