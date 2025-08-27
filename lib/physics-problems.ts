// lib/physics-problems.ts

import type { Problem } from './problems';

export const physicsProblems: Problem[] = [
  // --- Kinematic Equations (8 Problems) ---
  {
    category: "Kinematic Equations",
    id: "KE101",
    topic: "Constant Acceleration",
    difficulty: 1200,
    problem: "An object's velocity is described by $v(t) = 10 + 3t$. What is its acceleration at $t=5$ s?",
    answer: "3",
    unit: "m/s²",
  },
  {
    category: "Kinematic Equations",
    id: "KE102",
    topic: "Position from Velocity",
    difficulty: 1350,
    problem: "An object starts at $x=0$ with velocity $v(t) = 2t^2 - 1$. Find its position at $t=3$ using $x(t) = \\int_0^t v(\\tau)d\\tau$.",
    answer: "15",
    unit: "m",
  },
  {
    category: "Kinematic Equations",
    id: "KE103",
    topic: "Free Fall",
    difficulty: 1300,
    problem: "The position of a falling object is given by $y(t) = 50 - 4.9t^2$. Find the time $t$ when the object hits the ground ($y(t)=0$).",
    answer: "3.19",
    unit: "s",
    format_hint: "Round to two decimal places.",
  },
  {
    category: "Kinematic Equations",
    id: "KE104",
    topic: "Solving for Time",
    difficulty: 1400,
    problem: "Using the kinematic equation $\\Delta x = v_0 t + \\frac{1}{2}at^2$, solve for time $t$ if $\\Delta x=30$, $v_0=0$, and $a=10$.",
    answer: "2.45",
    unit: "s",
    format_hint: "Round to two decimal places."
  },
  {
    category: "Kinematic Equations",
    id: "KE105",
    topic: "Average Velocity",
    difficulty: 1250,
    problem: "An object's position is $x(t) = 2t^2 - 3t + 1$. What is its average velocity over the interval $t=0$ to $t=4$?",
    answer: "5",
    unit: "m/s"
  },
  {
    category: "Kinematic Equations",
    id: "KE106",
    topic: "Velocity from Acceleration",
    difficulty: 1350,
    problem: "An object with initial velocity $v_0=5$ has acceleration $a(t) = 6t$. Find its velocity at $t=2$ using $v(t) = v_0 + \\int_0^t a(\\tau)d\\tau$.",
    answer: "17",
    unit: "m/s"
  },
  {
    category: "Kinematic Equations",
    id: "KE107",
    topic: "Projectile Motion (Vertical)",
    difficulty: 1450,
    problem: "The vertical velocity of a projectile is $v_y(t) = 50 - 9.8t$. At what time $t$ does it reach its maximum height ($v_y(t)=0$)?",
    answer: "5.10",
    unit: "s",
    format_hint: "Round to two decimal places."
  },
  {
    category: "Kinematic Equations",
    id: "KE108",
    topic: "Final Velocity",
    difficulty: 1300,
    problem: "Using the equation $v_f^2 = v_0^2 + 2a\\Delta x$, find the final velocity $v_f$ if $v_0=10$, $a=3$, and $\\Delta x = 8$.",
    answer: "12.17",
    unit: "m/s",
    format_hint: "Round to two decimal places."
  },

  // --- Forces & Newton's Laws (8 Problems) ---
  {
    category: "Forces & Newton's Laws",
    id: "FNL101",
    topic: "Newton's Second Law",
    difficulty: 1200,
    problem: "A net force of $F=50$ N is applied to a mass of $m=10$ kg. Using Newton's Second Law, $F=ma$, find the acceleration $a$.",
    answer: "5",
    unit: "m/s²",
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL102",
    topic: "Static Friction",
    difficulty: 1350,
    problem: "The force of static friction is $f_s \\le \\mu_s N$. If $\\mu_s = 0.4$ and the normal force is $N=50$ N, what is the maximum force of static friction?",
    answer: "20",
    unit: "N"
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL103",
    topic: "Force Components",
    difficulty: 1300,
    problem: "A force of $F=100$ N is applied at an angle of $60^\\circ$ to the horizontal. What is the horizontal component of the force, $F_x = F\\cos(\\theta)$?",
    answer: "50",
    unit: "N"
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL104",
    topic: "Inclined Plane",
    difficulty: 1500,
    problem: "For a block of mass $m=5$ kg on a frictionless incline of $30^\\circ$, the acceleration is $a = g\\sin(\\theta)$. Find the acceleration. (Use g = 9.8 m/s²)",
    answer: "4.9",
    unit: "m/s²",
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL105",
    topic: "Tension",
    difficulty: 1400,
    problem: "An object of mass $m=20$ kg hangs from a rope. In equilibrium, the tension $T$ equals the gravitational force $mg$. Find the tension. (Use g = 9.8 m/s²)",
    answer: "196",
    unit: "N"
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL106",
    topic: "Hooke's Law",
    difficulty: 1250,
    problem: "A spring with spring constant $k=250$ N/m is stretched by $x=0.1$ m. According to Hooke's Law, $F = -kx$, what is the magnitude of the restoring force?",
    answer: "25",
    unit: "N"
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL107",
    topic: "Multiple Forces",
    difficulty: 1450,
    problem: "A block is pulled right with 50 N and left with 20 N. It experiences a kinetic friction force of 5 N. What is the net force on the block?",
    answer: "25",
    unit: "N"
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL108",
    topic: "Atwood Machine",
    difficulty: 1700,
    problem: "For an Atwood machine with masses $m_1=3$ kg and $m_2=5$ kg, the acceleration is $a = g\\frac{m_2-m_1}{m_1+m_2}$. Find $a$. (Use g = 9.8 m/s²)",
    answer: "2.45",
    unit: "m/s²",
  },

  // --- Work & Energy (8 Problems) ---
  {
    category: "Work & Energy",
    id: "WE101",
    topic: "Work by Constant Force",
    difficulty: 1250,
    problem: "Work is defined as $W = Fd\\cos(\\theta)$. A force of $F=40$ N is applied over a distance of $d=5$ m at an angle of $\\theta=60^\\circ$. Calculate the work done.",
    answer: "100",
    unit: "J"
  },
  {
    category: "Work & Energy",
    id: "WE102",
    topic: "Work-Energy Theorem",
    difficulty: 1400,
    problem: "The Work-Energy theorem states $W_{net} = \\Delta K$. If an object's kinetic energy changes from 50 J to 120 J, what was the net work done?",
    answer: "70",
    unit: "J"
  },
  {
    category: "Work & Energy",
    id: "WE103",
    topic: "Gravitational Potential Energy",
    difficulty: 1200,
    problem: "The change in gravitational potential energy is $\\Delta U_g = mgh$. Find the change in potential energy for a mass $m=2$ kg lifted by a height $h=10$ m. (g = 9.8 m/s²)",
    answer: "196",
    unit: "J"
  },
  {
    category: "Work & Energy",
    id: "WE104",
    topic: "Elastic Potential Energy",
    difficulty: 1300,
    problem: "Elastic potential energy is $U_s = \\frac{1}{2}kx^2$. A spring with $k=500$ N/m is compressed by $x=0.2$ m. How much energy is stored?",
    answer: "10",
    unit: "J"
  },
  {
    category: "Work & Energy",
    id: "WE105",
    topic: "Work by Variable Force",
    difficulty: 1650,
    problem: "Work done by a variable force is $W = \\int_a^b F(x) dx$. For a spring force $F(x) = -200x$, calculate the work done stretching it from $x=0$ to $x=0.1$ m.",
    answer: "-1",
    unit: "J",
  },
  {
    category: "Work & Energy",
    id: "WE106",
    topic: "Conservation of Energy",
    difficulty: 1450,
    problem: "A pendulum with mass $m=1$ kg is released from a height where it has 50 J of potential energy. By conservation of energy, what is its maximum kinetic energy at the bottom of its swing?",
    answer: "50",
    unit: "J"
  },
  {
    category: "Work & Energy",
    id: "WE107",
    topic: "Power",
    difficulty: 1350,
    problem: "Power is the rate of work done, $P = W/t$. If 600 J of work is done over 12 seconds, what is the average power?",
    answer: "50",
    unit: "W"
  },
  {
    category: "Work & Energy",
    id: "WE108",
    topic: "Dot Product",
    difficulty: 1500,
    problem: "Work can be calculated as a dot product $W = \\vec{F} \\cdot \\vec{d}$. Given $\\vec{F} = \\langle 5, -2 \\rangle$ N and displacement $\\vec{d} = \\langle 4, 3 \\rangle$ m, calculate the work done.",
    answer: "14",
    unit: "J"
  },

  // --- Momentum & Collisions (8 Problems) ---
  {
    category: "Momentum & Collisions",
    id: "MC101",
    topic: "Momentum",
    difficulty: 1200,
    problem: "An object with mass $m=5$ kg moves with velocity $v=10$ m/s. What is the magnitude of its momentum, $p=mv$?",
    answer: "50",
    unit: "kg*m/s"
  },
  {
    category: "Momentum & Collisions",
    id: "MC102",
    topic: "Impulse",
    difficulty: 1300,
    problem: "Impulse is defined as $J = F \\Delta t$. A constant force of $F=20$ N acts for $\\Delta t = 0.5$ s. What is the impulse delivered?",
    answer: "10",
    unit: "N*s"
  },
  {
    category: "Momentum & Collisions",
    id: "MC103",
    topic: "Impulse-Momentum Theorem",
    difficulty: 1400,
    problem: "The impulse-momentum theorem states $J = \\Delta p$. A hockey puck's momentum changes by 8 kg*m/s. What was the impulse applied to it?",
    answer: "8",
    unit: "N*s"
  },
  {
    category: "Momentum & Collisions",
    id: "MC104",
    topic: "Inelastic Collision",
    difficulty: 1550,
    problem: "In an inelastic collision, momentum is conserved: $m_1v_1 + m_2v_2 = (m_1+m_2)v_f$. A 2 kg cart at 3 m/s hits a 1 kg cart at rest. Find their final velocity $v_f$.",
    answer: "2",
    unit: "m/s"
  },
  {
    category: "Momentum & Collisions",
    id: "MC105",
    topic: "Elastic Collision",
    difficulty: 1700,
    problem: "In a 1D elastic collision, $v_{1f} = \\frac{m_1-m_2}{m_1+m_2}v_{1i}$. A 3 kg ball at 10 m/s hits a 1 kg ball at rest. What is the final velocity of the 3 kg ball?",
    answer: "5",
    unit: "m/s"
  },
  {
    category: "Momentum & Collisions",
    id: "MC106",
    topic: "Center of Mass",
    difficulty: 1500,
    problem: "The center of mass for two particles is $x_{cm} = \\frac{m_1x_1+m_2x_2}{m_1+m_2}$. Find the center of mass for a 2 kg mass at $x=1$ and a 3 kg mass at $x=6$.",
    answer: "4",
    unit: "m"
  },
  {
    category: "Momentum & Collisions",
    id: "MC107",
    topic: "Explosion",
    difficulty: 1600,
    problem: "A 5 kg object at rest explodes into two pieces. One piece of 2 kg moves at 10 m/s. By conservation of momentum, what is the speed of the other 3 kg piece?",
    answer: "6.67",
    unit: "m/s",
    format_hint: "Round to two decimal places."
  },
  {
    category: "Momentum & Collisions",
    id: "MC108",
    topic: "2D Collision",
    difficulty: 1750,
    problem: "In a 2D collision, momentum is conserved in each component. A particle with momentum $\\langle 10, 0 \\rangle$ hits a stationary particle. After, one has momentum $\\langle 6, 4 \\rangle$. What is the x-component of the other's momentum?",
    answer: "4",
    unit: "kg*m/s"
  },

  // --- Circular Motion & Gravitation (8 Problems) ---
  {
    category: "Circular Motion & Gravitation",
    id: "CG101",
    topic: "Centripetal Acceleration",
    difficulty: 1350,
    problem: "Centripetal acceleration is $a_c = v^2/r$. A car travels at a constant speed $v=20$ m/s around a circular track of radius $r=100$ m. What is its acceleration?",
    answer: "4",
    unit: "m/s²"
  },
  {
    category: "Circular Motion & Gravitation",
    id: "CG102",
    topic: "Period and Frequency",
    difficulty: 1250,
    problem: "An object completes a circle in $T=0.5$ seconds. What is its frequency, $f=1/T$?",
    answer: "2",
    unit: "Hz"
  },
  {
    category: "Circular Motion & Gravitation",
    id: "CG103",
    topic: "Angular Velocity",
    difficulty: 1400,
    problem: "The relationship between linear and angular speed is $v = r\\omega$. A point on a wheel of radius $r=0.5$ m moves at $v=10$ m/s. What is its angular speed $\\omega$?",
    answer: "20",
    unit: "rad/s"
  },
  {
    category: "Circular Motion & Gravitation",
    id: "CG104",
    topic: "Universal Gravitation",
    difficulty: 1450,
    problem: "Newton's law of gravitation is $F_g = G\\frac{m_1m_2}{r^2}$. If the distance $r$ between two masses is doubled, by what factor does the force change?",
    answer: "1/4",
  },
  {
    category: "Circular Motion & Gravitation",
    id: "CG105",
    topic: "Orbital Speed",
    difficulty: 1650,
    problem: "The speed of a satellite in a circular orbit is $v = \\sqrt{GM/r}$. If the orbital radius $r$ is quadrupled, by what factor does the speed change?",
    answer: "1/2",
  },
  {
    category: "Circular Motion & Gravitation",
    id: "CG106",
    topic: "Kepler's Third Law",
    difficulty: 1700,
    problem: "Kepler's Third Law states $T^2 \\propto a^3$. A planet has an orbital period of 8 years. What is its semi-major axis in AU?",
    answer: "4",
    unit: "AU"
  },
  {
    category: "Circular Motion & Gravitation",
    id: "CG107",
    topic: "Gravitational Field",
    difficulty: 1500,
    problem: "The gravitational field strength is $g=GM/r^2$. At a height of one Earth radius above the surface, what is the value of $g$ as a fraction of its surface value $g_s$?",
    answer: "1/4",
  },
  {
    category: "Circular Motion & Gravitation",
    id: "CG108",
    topic: "Escape Velocity",
    difficulty: 1800,
    problem: "Escape velocity is $v_e = \\sqrt{2GM/r}$. The escape velocity from Jupiter is about 59.5 km/s. If a planet had the same mass but half the radius, what would be its escape velocity?",
    answer: "84.1",
    unit: "km/s",
    format_hint: "Round to one decimal place."
  },

  // --- Rotational Motion (7 Problems) ---
  {
    category: "Rotational Motion",
    id: "RM101",
    topic: "Rotational Kinematics",
    difficulty: 1400,
    problem: "A wheel accelerates from rest with angular acceleration $\\alpha=5$ rad/s². Use $\\omega_f = \\omega_0 + \\alpha t$ to find its angular velocity at $t=4$ s.",
    answer: "20",
    unit: "rad/s"
  },
  {
    category: "Rotational Motion",
    id: "RM102",
    topic: "Torque",
    difficulty: 1350,
    problem: "Torque is $\\tau = rF\\sin(\\theta)$. A force of $F=20$ N is applied at a distance $r=0.5$ m from a pivot at an angle $\\theta=90^\\circ$. Find the torque.",
    answer: "10",
    unit: "N*m"
  },
  {
    category: "Rotational Motion",
    id: "RM103",
    topic: "Rotational Dynamics",
    difficulty: 1600,
    problem: "The rotational equivalent of Newton's second law is $\\tau = I\\alpha$. A net torque of $20$ N·m is applied to a flywheel with moment of inertia $I=4$ kg·m². Find its angular acceleration $\\alpha$.",
    answer: "5",
    unit: "rad/s²"
  },
  {
    category: "Rotational Motion",
    id: "RM104",
    topic: "Moment of Inertia",
    difficulty: 1500,
    problem: "The moment of inertia of a point mass is $I=mr^2$. Find the moment of inertia for a 2 kg mass revolving at a radius of 3 m.",
    answer: "18",
    unit: "kg*m²"
  },
  {
    category: "Rotational Motion",
    id: "RM105",
    topic: "Rotational Kinetic Energy",
    difficulty: 1550,
    problem: "Rotational kinetic energy is $K_{rot} = \\frac{1}{2}I\\omega^2$. A flywheel with $I=10$ kg·m² rotates at $\\omega=5$ rad/s. Find its kinetic energy.",
    answer: "125",
    unit: "J"
  },
  {
    category: "Rotational Motion",
    id: "RM106",
    topic: "Angular Momentum",
    difficulty: 1650,
    problem: "Angular momentum is $L=I\\omega$. A spinning disk with $I=0.5$ kg·m² has an angular velocity of $\\omega=30$ rad/s. What is its angular momentum?",
    answer: "15",
    unit: "kg*m²/s"
  },
  {
    category: "Rotational Motion",
    id: "RM107",
    topic: "Conservation of Angular Momentum",
    difficulty: 1750,
    problem: "By conservation, $I_1\\omega_1 = I_2\\omega_2$. An ice skater with $I_1=4$ kg·m² spins at $\\omega_1=2$ rad/s. When she pulls her arms in, her inertia becomes $I_2=1$ kg·m². Find her new angular speed $\\omega_2$.",
    answer: "8",
    unit: "rad/s"
  },

  // --- Electric Fields & Potential (8 Problems) ---
  {
    category: "Electric Fields & Potential",
    id: "EFP101",
    topic: "Coulomb's Law",
    difficulty: 1300,
    problem: "The force between two charges is $F = k\\frac{|q_1q_2|}{r^2}$. Given $k=9e9$, $q_1=2e-6$ C, $q_2=3e-6$ C, and $r=0.1$ m, find the force $F$.",
    answer: "5.4",
    unit: "N"
  },
  {
    category: "Electric Fields & Potential",
    id: "EFP102",
    topic: "Electric Field",
    difficulty: 1350,
    problem: "The electric field from a point charge is $E = k\\frac{|q|}{r^2}$. Find the field strength at $r=2$ m from a charge $q=8e-9$ C. (k=9e9)",
    answer: "18",
    unit: "N/C"
  },
  {
    category: "Electric Fields & Potential",
    id: "EFP103",
    topic: "Electric Potential",
    difficulty: 1400,
    problem: "The electric potential from a point charge is $V = k\\frac{q}{r}$. Find the potential at $r=0.5$ m from a charge $q=5e-9$ C. (k=9e9)",
    answer: "90",
    unit: "V"
  },
  {
    category: "Electric Fields & Potential",
    id: "EFP104",
    topic: "Work and Potential",
    difficulty: 1450,
    problem: "The work done moving a charge is $W = q\\Delta V$. How much work is done to move a charge $q=2$ C through a potential difference of $\\Delta V = 12$ V?",
    answer: "24",
    unit: "J"
  },
  {
    category: "Electric Fields & Potential",
    id: "EFP105",
    topic: "Gauss's Law",
    difficulty: 1750,
    problem: "Gauss's Law states $\\oint \\vec{E} \\cdot d\\vec{A} = Q_{enc}/\\epsilon_0$. For a spherical surface of radius $r$ around a point charge $q$, the flux is simply $E \\cdot (4\\pi r^2)$. What is $E$?",
    answer: "q/(4πε₀r²)",
    format_hint: "Use q, ε₀, and r."
  },
  {
    category: "Electric Fields & Potential",
    id: "EFP106",
    topic: "Potential Energy",
    difficulty: 1500,
    problem: "The potential energy of two point charges is $U = k\\frac{q_1q_2}{r}$. Find the energy of a system with $q_1=4e-9$ C and $q_2=2e-9$ C at $r=0.01$ m. (k=9e9)",
    answer: "7.2e-6",
    unit: "J",
    format_hint: "Use scientific notation."
  },
  {
    category: "Electric Fields & Potential",
    id: "EFP107",
    topic: "Field from Potential",
    difficulty: 1600,
    problem: "For a potential that depends only on x, $E_x = -\\frac{dV}{dx}$. If the potential is $V(x) = 10x^2$, what is the electric field at $x=3$?",
    answer: "-60",
    unit: "V/m"
  },
  {
    category: "Electric Fields & Potential",
    id: "EFP108",
    topic: "Electric Dipole",
    difficulty: 1700,
    problem: "An electric dipole has moment $p=qd$. For $q=1.6e-19$ C and $d=1e-10$ m, what is the magnitude of the dipole moment $p$?",
    answer: "1.6e-29",
    unit: "C*m",
    format_hint: "Use scientific notation."
  },

  // --- Circuits & Capacitance (8 Problems) ---
  {
    category: "Circuits & Capacitance",
    id: "CC101",
    topic: "Ohm's Law",
    difficulty: 1200,
    problem: "A circuit has a voltage of $V=12$ V and a resistance of $R=3$ Ω. Using Ohm's Law, $V=IR$, what is the current $I$?",
    answer: "4",
    unit: "A"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC102",
    topic: "Resistors in Series",
    difficulty: 1250,
    problem: "Two resistors, $R_1=20$ Ω and $R_2=30$ Ω, are in series. Their equivalent resistance is $R_{eq} = R_1 + R_2$. Find $R_{eq}$.",
    answer: "50",
    unit: "Ω"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC103",
    topic: "Resistors in Parallel",
    difficulty: 1350,
    problem: "Two resistors, $R_1=10$ Ω and $R_2=30$ Ω, are in parallel. Use the formula $\\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2}$ to find $R_{eq}$.",
    answer: "7.5",
    unit: "Ω"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC104",
    topic: "Capacitance",
    difficulty: 1400,
    problem: "A capacitor stores $Q=10e-6$ C of charge when connected to a $V=5$ V battery. What is its capacitance, $C=Q/V$?",
    answer: "2e-6",
    unit: "F",
    format_hint: "Use scientific notation."
  },
  {
    category: "Circuits & Capacitance",
    id: "CC105",
    topic: "Capacitors in Parallel",
    difficulty: 1300,
    problem: "Two capacitors, $C_1=5$ μF and $C_2=10$ μF, are in parallel. Their equivalent capacitance is $C_{eq} = C_1 + C_2$. Find $C_{eq}$.",
    answer: "15",
    unit: "μF"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC106",
    topic: "Capacitors in Series",
    difficulty: 1450,
    problem: "Two capacitors, $C_1=10$ μF and $C_2=10$ μF, are in series. Use the formula $\\frac{1}{C_{eq}} = \\frac{1}{C_1} + \\frac{1}{C_2}$ to find $C_{eq}$.",
    answer: "5",
    unit: "μF"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC107",
    topic: "RC Circuit",
    difficulty: 1650,
    problem: "The time constant for an RC circuit is $\\tau = RC$. Given $R=1000$ Ω and $C=500e-6$ F, find the time constant.",
    answer: "0.5",
    unit: "s"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC108",
    topic: "Energy in Capacitor",
    difficulty: 1500,
    problem: "The energy stored in a capacitor is $U = \\frac{1}{2}CV^2$. A capacitor with $C=20e-6$ F is charged to $V=100$ V. Find the stored energy.",
    answer: "0.1",
    unit: "J"
  },

  // --- Magnetic Fields & Forces (8 Problems) ---
  {
    category: "Magnetic Fields & Forces",
    id: "MF101",
    topic: "Force on a Charge",
    difficulty: 1400,
    problem: "The magnetic force is $F = qvB\\sin(\\theta)$. A proton ($q=1.6e-19$ C) with speed $v=5e6$ m/s enters a field $B=0.5$ T at an angle $\\theta=90^\\circ$. Find the force $F$.",
    answer: "4e-13",
    unit: "N",
    format_hint: "Use scientific notation."
  },
  {
    category: "Magnetic Fields & Forces",
    id: "MF102",
    topic: "Force on a Wire",
    difficulty: 1500,
    problem: "The force on a current-carrying wire is $F = ILB\\sin(\\theta)$. A wire of length $L=2$ m with current $I=3$ A is in a field $B=0.1$ T at an angle $\\theta=90^\\circ$. Find the force.",
    answer: "0.6",
    unit: "N"
  },
  {
    category: "Magnetic Fields & Forces",
    id: "MF103",
    topic: "Field from a Wire",
    difficulty: 1550,
    problem: "The magnetic field from a long straight wire is $B = \\frac{\\mu_0 I}{2\\pi r}$. Find the field at $r=0.01$ m from a wire with current $I=10$ A. ($\\mu_0 = 4\\pi e-7$ T·m/A)",
    answer: "2e-4",
    unit: "T",
    format_hint: "Use scientific notation."
  },
  {
    category: "Magnetic Fields & Forces",
    id: "MF104",
    topic: "Ampere's Law",
    difficulty: 1700,
    problem: "Ampere's law is $\\oint \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{enc}$. For a circular path of radius $r$ around a wire with current $I$, this becomes $B(2\\pi r) = \\mu_0 I$. What is B?",
    answer: "μ₀I/(2πr)",
    format_hint: "Use μ₀, I, and r."
  },
  {
    category: "Magnetic Fields & Forces",
    id: "MF105",
    topic: "Solenoid Field",
    difficulty: 1600,
    problem: "The field inside a long solenoid is $B=\\mu_0 n I$, where $n$ is turns per unit length. A solenoid has 1000 turns over 0.5 m and carries current $I=2$ A. Find $B$. ($\\mu_0 = 4\\pi e-7$ T·m/A)",
    answer: "0.00503",
    unit: "T",
    format_hint: "Round to three significant figures."
  },
  {
    category: "Magnetic Fields & Forces",
    id: "MF106",
    topic: "Torque on a Loop",
    difficulty: 1750,
    problem: "The torque on a current loop is $\\tau = NIAB\\sin(\\theta)$. A 100-turn coil ($N$) of area $A=0.01$ m² with current $I=0.5$ A is in a field $B=1.5$ T at an angle $\\theta=90^\\circ$. Find the torque.",
    answer: "0.75",
    unit: "N*m"
  },
  {
    category: "Magnetic Fields & Forces",
    id: "MF107",
    topic: "Right-Hand Rule",
    difficulty: 1300,
    problem: "An electron moves east into a magnetic field pointing north. The direction of the magnetic force on the electron is...",
    answer: "down",
  },
  {
    category: "Magnetic Fields & Forces",
    id: "MF108",
    topic: "Cross Product",
    difficulty: 1650,
    problem: "The magnetic force is $\\vec{F} = q(\\vec{v} \\times \\vec{B})$. Given $q=1$, $\\vec{v} = \\langle 2,0,0 \\rangle$, and $\\vec{B} = \\langle 0,3,0 \\rangle$, what is the force vector $\\vec{F}$?",
    answer: "<0,0,6>",
  },

  // --- Quantum Mechanics (8 Problems) ---
  {
    category: "Quantum Mechanics",
    id: "QM101",
    topic: "Photon Energy",
    difficulty: 1400,
    problem: "The energy of a photon is $E=hf$. Find the energy of a photon with frequency $f=5e14$ Hz. (h=6.626e-34 J·s)",
    answer: "3.31e-19",
    unit: "J",
    format_hint: "Use scientific notation with two decimal places."
  },
  {
    category: "Quantum Mechanics",
    id: "QM102",
    topic: "De Broglie Wavelength",
    difficulty: 1450,
    problem: "The de Broglie wavelength is $\\lambda = h/p$. Find the wavelength of an electron ($m=9.11e-31$ kg) moving at $v=2e6$ m/s. (h=6.626e-34 J·s)",
    answer: "3.64e-10",
    unit: "m",
    format_hint: "Use scientific notation with two decimal places."
  },
  {
    category: "Quantum Mechanics",
    id: "QM103",
    topic: "Heisenberg Uncertainty",
    difficulty: 1600,
    problem: "The uncertainty principle is $\\Delta x \\Delta p \\ge \\hbar/2$. If the uncertainty in position is $\\Delta x = 1e-10$ m, find the minimum uncertainty in momentum $\\Delta p$. ($\\hbar=1.055e-34$ J·s)",
    answer: "5.28e-25",
    unit: "kg*m/s",
    format_hint: "Use scientific notation with two decimal places."
  },
  {
    category: "Quantum Mechanics",
    id: "QM104",
    topic: "Particle in a Box",
    difficulty: 1700,
    problem: "The energy levels for a particle in a 1D box are $E_n = \\frac{n^2h^2}{8mL^2}$. Find the energy of the n=3 state in terms of $h, m, L$.",
    answer: "9h^2/(8mL^2)",
  },
  {
    category: "Quantum Mechanics",
    id: "QM105",
    topic: "Normalization",
    difficulty: 1800,
    problem: "A particle's wavefunction is $\\psi(x) = A$ for $0 \\le x \\le L$ and 0 otherwise. The normalization condition is $\\int_0^L |\\psi(x)|^2 dx = 1$. Find A.",
    answer: "1/sqrt(L)",
  },
  {
    category: "Quantum Mechanics",
    id: "QM106",
    topic: "Schrödinger Equation",
    difficulty: 1900,
    problem: "A particle is in a state with wavefunction $\\psi(x) = e^{ikx}$. In the time-independent Schrödinger equation, $\\frac{-\\hbar^2}{2m}\\frac{d^2\\psi}{dx^2} = E\\psi$, what is its energy E?",
    answer: "(hbar*k)^2/(2m)",
    format_hint: "Use hbar, k, and m."
  },
  {
    category: "Quantum Mechanics",
    id: "QM107",
    topic: "Expectation Value",
    difficulty: 2000,
    problem: "For a particle in the state $\\psi(x)$, the expectation value of an operator $\\hat{O}$ is $\\langle O \\rangle = \\int \\psi^* \\hat{O} \\psi dx$. For the momentum operator $\\hat{p} = -i\\hbar\\frac{d}{dx}$ and state $\\psi=e^{ikx}$, what is $\\langle p \\rangle$?",
    answer: "hbar*k",
    format_hint: "Use hbar and k."
  },
  {
    category: "Quantum Mechanics",
    id: "QM108",
    topic: "Quantum Operators",
    difficulty: 1850,
    problem: "The commutator of two operators is $[A,B]=AB-BA$. For the position operator $\\hat{x}=x$ and momentum operator $\\hat{p}=-i\\hbar\\frac{d}{dx}$, what is the commutator $[\\hat{x}, \\hat{p}]$ applied to a function $f(x)$?",
    answer: "i*hbar*f(x)",
    format_hint: "Use i, hbar, and f(x)."
  },
];