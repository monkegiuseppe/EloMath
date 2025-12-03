// lib/Exercises/physics-problems.ts

import type { Problem } from '../problems';

export const physicsProblems: Problem[] = [
  // --- Kinematic Equations (8 Problems) ---
  {
    category: "Kinematics",
    id: "PHY_K_01",
    topic: "Displacement",
    difficulty: 1000,
    problem: "A car travels at 20 m/s for 10 seconds. Find distance.",
    answer: "200",
    unit: "m"
  },
  {
    category: "Kinematics",
    id: "PHY_K_02",
    topic: "Acceleration Def",
    difficulty: 1050,
    problem: "Velocity changes from 0 to 10 m/s in 2 seconds. Find acceleration.",
    answer: "5",
    unit: "m/s²"
  },
  {
    category: "Kinematics",
    id: "PHY_K_03",
    topic: "Free Fall Distance",
    difficulty: 1150,
    problem: "An object falls for 3 seconds ($g \\approx 10$). Approx distance? ($d = 0.5gt^2$)",
    answer: "45",
    unit: "m"
  },
  {
    category: "Kinematics",
    id: "PHY_K_04",
    topic: "Circular Speed",
    difficulty: 1200,
    problem: "A ball moves in a circle of radius 2m. It completes one rev in 3.14s. Approx speed?",
    answer: "4",
    unit: "m/s"
  },
  {
    category: "Kinematics",
    id: "PHY_K_01",
    topic: "Displacement",
    difficulty: 1000,
    problem: "A car travels at 20 m/s for 10 seconds. Find distance.",
    answer: "200",
    unit: "m"
  },
  {
    category: "Kinematics",
    id: "PHY_K_02",
    topic: "Acceleration Def",
    difficulty: 1050,
    problem: "Velocity changes from 0 to 10 m/s in 2 seconds. Find acceleration.",
    answer: "5",
    unit: "m/s²"
  },
  {
    category: "Kinematics",
    id: "PHY_K_03",
    topic: "Free Fall Distance",
    difficulty: 1150,
    problem: "An object falls for 3 seconds ($g \\approx 10$). Approx distance? ($d = 0.5gt^2$)",
    answer: "45",
    unit: "m"
  },
  {
    category: "Kinematics",
    id: "PHY_K_04",
    topic: "Circular Speed",
    difficulty: 1200,
    problem: "A ball moves in a circle of radius 2m. It completes one rev in 3.14s. Approx speed?",
    answer: "4",
    unit: "m/s"
  },
  {
    category: "Kinematic Equations",
    id: "KE_NEW_01",
    topic: "Displacement",
    difficulty: 1100,
    problem: "Calculate $\\Delta x = v t$. $v=30$, $t=4$.",
    answer: "120",
    unit: "m"
  },
  {
    category: "Kinematic Equations",
    id: "KE_NEW_02",
    topic: "Acceleration",
    difficulty: 1150,
    problem: "Find $a = \\Delta v / t$. $\\Delta v = 40$, $t=5$.",
    answer: "8",
    unit: "m/s²"
  },
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
  {
    category: "Kinematic Equations",
    id: "KE201",
    topic: "Interpreting Motion",
    difficulty: 1450,
    problem: "The position of a particle is given by the function $x(t) = t^3 - 6t^2 + 9t + 1$. At what time(s) is the particle momentarily at rest?",
    answer: "1 and 3",
    unit: "s",
  },
  {
    category: "Kinematic Equations",
    id: "KE202",
    topic: "Relative Motion",
    difficulty: 1500,
    problem: "Car A starts at $x=0$ and moves with velocity $v_A(t) = 2t$. Car B starts at $x=10$ and moves with a constant velocity of $v_B = 1$ m/s. When does Car A overtake Car B?",
    answer: "3.7",
    unit: "s",
    format_hint: "Round to one decimal place."
  },
  {
    category: "Kinematic Equations",
    id: "KE203",
    topic: "Maximum Height",
    difficulty: 1400,
    problem: "An object is thrown upwards with an initial velocity of 40 m/s. Its height is described by $y(t) = 40t - 4.9t^2$. What is the maximum height it reaches?",
    answer: "81.6",
    unit: "m",
    format_hint: "Round to one decimal place."
  },
  {
    category: "Kinematic Equations",
    id: "KE204",
    topic: "Jerk",
    difficulty: 1550,
    problem: "The acceleration of a high-tech elevator is given by $a(t) = 6t - 2$. What is the total change in velocity from $t=1$ to $t=3$?",
    answer: "20",
    unit: "m/s"
  },
  {
    category: "Kinematic Equations",
    id: "KE205",
    topic: "Constant Acceleration",
    difficulty: 1350,
    problem: "A car accelerates uniformly from 10 m/s to 30 m/s over a distance of 100 m. What is its acceleration?",
    answer: "4",
    unit: "m/s²"
  },
  {
    category: "Kinematic Equations",
    id: "KE206",
    topic: "Free Fall",
    difficulty: 1300,
    problem: "A stone is dropped from a tall building. How long does it take to travel the first 50 meters of its fall? (Use g = 9.8 m/s²)",
    answer: "3.19",
    unit: "s"
  },
  {
    category: "Kinematic Equations",
    id: "KE207",
    topic: "Projectile Angle",
    difficulty: 1600,
    problem: "A projectile is fired with an initial speed of 100 m/s. Its range is given by $R(\\theta) = \\frac{v_0^2 \\sin(2\\theta)}{g}$. At what angle $\\theta$ is the range 500 m? (Use g=9.8 m/s²)",
    answer: "14.7",
    unit: "degrees",
    format_hint: "Provide the smaller angle, rounded to one decimal place."
  },
  {
    category: "Kinematic Equations",
    id: "KE208",
    topic: "Average vs Instantaneous",
    difficulty: 1450,
    problem: "A particle's position is $x(t) = 4t^2 - 1$. Find the time at which its instantaneous velocity is equal to its average velocity over the interval from t=0 to t=5.",
    answer: "2.5",
    unit: "s"
  },
  {
    category: "Kinematic Equations",
    id: "KE209",
    topic: "Stopping Distance",
    difficulty: 1400,
    problem: "A car is traveling at 25 m/s and applies the brakes, causing a constant deceleration of 5 m/s². How far does it travel before coming to a complete stop?",
    answer: "62.5",
    unit: "m"
  },
  {
    category: "Kinematic Equations",
    id: "KE210",
    topic: "Multi-stage motion",
    difficulty: 1650,
    problem: "A rocket accelerates upwards at 20 m/s² for 10 seconds, then its engine cuts out and it enters free fall. What is the maximum altitude it reaches? (Use g=9.8 m/s²)",
    answer: "3040.8",
    unit: "m",
    format_hint: "Round to one decimal place."
  },
  {
    category: "Kinematic Equations",
    id: "KE211",
    topic: "Vector Kinematics",
    difficulty: 1550,
    problem: "A particle's position vector is $\\vec{r}(t) = \\langle 2t^2, 3t-1 \\rangle$. What is the magnitude of its velocity vector at $t=2$?",
    answer: "8.54",
    unit: "m/s",
    format_hint: "Round to two decimal places."
  },



  // --- Forces & Newton's Laws (8 Problems) ---
  {
    category: "Forces & Newton's Laws",
    id: "PHY_DYN_01",
    topic: "Inclined Planes",
    difficulty: 1300,
    problem: "A block slides down a frictionless 30-degree incline. Gravity is $g=10$. What is the acceleration?",
    answer: "5",
    unit: "m/s^2"
  },
  {
    category: "Forces & Newton's Laws",
    id: "PHY_DYN_02",
    topic: "Friction",
    difficulty: 1400,
    problem: "A 10kg block requires 40N of force to start moving on a horizontal surface. What is the coefficient of static friction? (g=10)",
    answer: "0.4",
  },
  {
    category: "Forces",
    id: "PHY_F_01",
    topic: "Net Force",
    difficulty: 1200,
    problem: "Two forces of 3N and 4N pull at right angles. Net force magnitude?",
    answer: "5",
    unit: "N"
  },
  {
    category: "Forces",
    id: "PHY_F_02",
    topic: "Weight",
    difficulty: 1250,
    problem: "Mass is 10kg. What is weight on Earth? ($g=9.8$)",
    answer: "98",
    unit: "N"
  },
  {
    category: "Forces",
    id: "PHY_F_03",
    topic: "Friction",
    difficulty: 1350,
    problem: "Normal force is 100N, coeff of friction is 0.5. Max friction force?",
    answer: "50",
    unit: "N"
  },
  {
    category: "Forces",
    id: "PHY_F_04",
    topic: "Spring Force",
    difficulty: 1300,
    problem: "Spring constant k=100 N/m. Stretched 0.5m. Force?",
    answer: "50",
    unit: "N"
  },
  {
    category: "Forces",
    id: "PHY_F_01",
    topic: "Net Force",
    difficulty: 1200,
    problem: "Two forces of 3N and 4N pull at right angles. Net force magnitude?",
    answer: "5",
    unit: "N"
  },
  {
    category: "Forces",
    id: "PHY_F_02",
    topic: "Weight",
    difficulty: 1250,
    problem: "Mass is 10kg. What is weight on Earth? ($g=9.8$)",
    answer: "98",
    unit: "N"
  },
  {
    category: "Forces",
    id: "PHY_F_03",
    topic: "Friction",
    difficulty: 1350,
    problem: "Normal force is 100N, coeff of friction is 0.5. Max friction force?",
    answer: "50",
    unit: "N"
  },
  {
    category: "Forces",
    id: "PHY_F_04",
    topic: "Spring Force",
    difficulty: 1300,
    problem: "Spring constant k=100 N/m. Stretched 0.5m. Force?",
    answer: "50",
    unit: "N"
  },
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
  {
    category: "Forces & Newton's Laws",
    id: "FNL201",
    topic: "Force with Friction",
    difficulty: 1500,
    problem: "A 10 kg box is pushed on a horizontal floor with a force of 50 N. The coefficient of kinetic friction is 0.3. What is the acceleration of the box? (Use g=9.8 m/s²)",
    answer: "2.06",
    unit: "m/s²"
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL202",
    topic: "Angled Force",
    difficulty: 1600,
    problem: "A 20 kg crate is pulled by a rope with a tension of 100 N at an angle of 30° above the horizontal. If the floor is frictionless, what is the crate's acceleration?",
    answer: "4.33",
    unit: "m/s²"
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL203",
    topic: "Equilibrium",
    difficulty: 1450,
    problem: "A traffic light weighing 150 N hangs from a cable tied to two other cables at 120° to each other. By symmetry, the vertical components of tension in the upper cables must balance the weight. What is the tension in each of the upper cables?",
    answer: "150",
    unit: "N"
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL204",
    topic: "Connected Objects",
    difficulty: 1700,
    problem: "A 5 kg block and a 10 kg block are connected by a string. The 10 kg block is pulled to the right with a force of 60 N on a frictionless surface. What is the tension in the string between them?",
    answer: "20",
    unit: "N"
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL205",
    topic: "Elevator Physics",
    difficulty: 1550,
    problem: "A person with a mass of 70 kg stands on a scale in an elevator. The elevator is accelerating downwards at 2 m/s². What does the scale read in Newtons? (Use g=9.8 m/s²)",
    answer: "546",
    unit: "N"
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL206",
    topic: "Variable Force",
    difficulty: 1650,
    problem: "A 2 kg object is subjected to a time-varying force $F(t) = 12t^2$. If it starts from rest, what is its velocity at $t=2$ s?",
    answer: "16",
    unit: "m/s"
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL207",
    topic: "Angled Friction",
    difficulty: 1750,
    problem: "A 10 kg block is pulled by a 100 N force at 30° above horizontal. The coefficient of kinetic friction is 0.4. What is the acceleration? (Use g=9.8 m/s²)",
    answer: "6.74",
    unit: "m/s²"
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL208",
    topic: "System of Pulleys",
    difficulty: 1800,
    problem: "A 4 kg mass and a 6 kg mass are connected by a rope over a frictionless pulley. What is the magnitude of the acceleration of the system? (Use g=9.8 m/s²)",
    answer: "1.96",
    unit: "m/s²"
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL209",
    topic: "Terminal Velocity",
    difficulty: 1600,
    problem: "An object reaches terminal velocity when the force of gravity equals the drag force, $F_d = kv^2$. A 80 kg skydiver has a drag constant $k=0.25$ kg/m. What is their terminal velocity? (Use g=9.8 m/s²)",
    answer: "56",
    unit: "m/s"
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL210",
    topic: "Vector Sum of Forces",
    difficulty: 1500,
    problem: "A particle experiences two forces: $\\vec{F}_1 = \\langle 10, -5 \\rangle$ N and $\\vec{F}_2 = \\langle -3, 15 \\rangle$ N. What is the magnitude of the net force?",
    answer: "12.2",
    unit: "N",
    format_hint: "Round to one decimal place."
  },
  {
    category: "Forces & Newton's Laws",
    id: "FNL211",
    topic: "Conical Pendulum",
    difficulty: 1850,
    problem: "A 1 kg mass is swung in a horizontal circle at the end of a 2 m long string. The string makes an angle of 30° with the vertical. What is the speed of the mass? (Use g=9.8 m/s²)",
    answer: "2.38",
    unit: "m/s"
  },


  // --- Work & Energy  ---
  {
    category: "Work & Energy",
    id: "PHY_EN_01",
    topic: "Spring Potential",
    difficulty: 1250,
    problem: "A spring with $k=200$ N/m is compressed by 0.2m. How much potential energy is stored?",
    answer: "4",
    unit: "J"
  },
  {
    category: "Work & Energy",
    id: "PHY_EN_02",
    topic: "Kinetic Energy",
    difficulty: 1200,
    problem: "An object of mass 2kg is moving at 10m/s. What is its kinetic energy?",
    answer: "100",
    unit: "J"
  },
  {
    category: "Energy",
    id: "PHY_E_01",
    topic: "Kinetic Energy",
    difficulty: 1300,
    problem: "Mass 2kg moving at 3 m/s. Calculate KE.",
    answer: "9",
    unit: "J"
  },
  {
    category: "Energy",
    id: "PHY_E_02",
    topic: "Potential Energy",
    difficulty: 1350,
    problem: "Mass 5kg lifted 2m. ($g=10$). Calculate PE.",
    answer: "100",
    unit: "J"
  },
  {
    category: "Energy",
    id: "PHY_E_03",
    topic: "Work",
    difficulty: 1400,
    problem: "Force of 10N pushes box 5m. Work done?",
    answer: "50",
    unit: "J"
  },
  {
    category: "Energy",
    id: "PHY_E_04",
    topic: "Power",
    difficulty: 1450,
    problem: "100J of work done in 5 seconds. Power?",
    answer: "20",
    unit: "W"
  },
  {
    category: "Energy",
    id: "PHY_E_01",
    topic: "Kinetic Energy",
    difficulty: 1300,
    problem: "Mass 2kg moving at 3 m/s. Calculate KE.",
    answer: "9",
    unit: "J"
  },
  {
    category: "Energy",
    id: "PHY_E_02",
    topic: "Potential Energy",
    difficulty: 1350,
    problem: "Mass 5kg lifted 2m. ($g=10$). Calculate PE.",
    answer: "100",
    unit: "J"
  },
  {
    category: "Energy",
    id: "PHY_E_03",
    topic: "Work",
    difficulty: 1400,
    problem: "Force of 10N pushes box 5m. Work done?",
    answer: "50",
    unit: "J"
  },
  {
    category: "Energy",
    id: "PHY_E_04",
    topic: "Power",
    difficulty: 1450,
    problem: "100J of work done in 5 seconds. Power?",
    answer: "20",
    unit: "W"
  },
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
  {
    category: "Work & Energy",
    id: "WE201",
    topic: "Energy Conservation",
    difficulty: 1450,
    problem: "A 2 kg rollercoaster car starts from rest at the top of a 20 m high hill. Assuming no friction, what is its speed at the bottom of the hill? (g=9.8 m/s²)",
    answer: "19.8",
    unit: "m/s",
  },
  {
    category: "Work & Energy",
    id: "WE202",
    topic: "Work by Friction",
    difficulty: 1500,
    problem: "A 5 kg block sliding at 10 m/s on a rough surface comes to a stop after traveling 15 m. What was the magnitude of the force of friction acting on it?",
    answer: "16.67",
    unit: "N"
  },
  {
    category: "Work & Energy",
    id: "WE203",
    topic: "Spring Launch",
    difficulty: 1600,
    problem: "A 0.5 kg block is launched by a spring with spring constant $k=500$ N/m, which was compressed by 0.2 m. What is the block's speed as it leaves the spring?",
    answer: "6.32",
    unit: "m/s"
  },
  {
    category: "Work & Energy",
    id: "WE204",
    topic: "Potential Energy Function",
    difficulty: 1750,
    problem: "A particle's potential energy is described by $U(x) = 2x^4 - 8x^2$. Find the position(s) of stable equilibrium.",
    answer: "sqrt(2) and -sqrt(2)",
  },
  {
    category: "Work & Energy",
    id: "WE205",
    topic: "Power",
    difficulty: 1400,
    problem: "A motor lifts a 100 kg elevator at a constant speed of 3 m/s. What is the power output of the motor? (g=9.8 m/s²)",
    answer: "2940",
    unit: "W"
  },
  {
    category: "Work & Energy",
    id: "WE206",
    topic: "Loop-the-Loop",
    difficulty: 1800,
    problem: "A cart must maintain contact with the track at the top of a loop-the-loop of radius 10 m. What is the minimum height it must be released from (from rest) to complete the loop?",
    answer: "25",
    unit: "m"
  },
  {
    category: "Work & Energy",
    id: "WE207",
    topic: "Work-Energy with Angled Force",
    difficulty: 1650,
    problem: "A 10 kg box is pulled 5 meters across a frictionless floor by a 40 N force angled at 60° above the horizontal. If it started from rest, what is its final speed?",
    answer: "4.47",
    unit: "m/s"
  },
  {
    category: "Work & Energy",
    id: "WE208",
    topic: "Escape Energy",
    difficulty: 1700,
    problem: "The gravitational potential energy of a satellite of mass $m$ in orbit around Earth (mass M) is $U = -GmM/r$. How much additional work must be done to allow the satellite to escape Earth's gravity (i.e., reach a total energy of 0)?",
    answer: "GmM/r",
  },
  {
    category: "Work & Energy",
    id: "WE209",
    topic: "Variable Power",
    difficulty: 1550,
    problem: "An engine provides power to a car according to $P(t) = 300t^2$. How much work is done by the engine from t=0 to t=5 seconds?",
    answer: "12500",
    unit: "J"
  },
  {
    category: "Work & Energy",
    id: "WE210",
    topic: "Spring and Gravity",
    difficulty: 1750,
    problem: "A 2 kg mass is dropped from 0.5 m above a vertical spring with k=800 N/m. What is the maximum distance the spring is compressed? (Use g=9.8 m/s²)",
    answer: "0.21",
    unit: "m"
  },
  {
    category: "Work & Energy",
    id: "WE211",
    topic: "Force from Potential",
    difficulty: 1600,
    problem: "The potential energy of a diatomic molecule can be approximated by the Lennard-Jones potential $U(r) = A/r^{12} - B/r^6$. What is the force $F(r)$ between the atoms?",
    answer: "12A/r^13 - 6B/r^7",
  },



  // --- Momentum & Collisions (8 Problems) ---

  {
    category: "Momentum & Collisions",
    id: "PHY_MOM_01",
    topic: "Inelastic Collision",
    difficulty: 1350,
    problem: "A 2kg mass moving at 3m/s hits a stationary 1kg mass and sticks to it. What is the final velocity?",
    answer: "2",
    unit: "m/s"
  },
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
  {
    category: "Momentum & Collisions",
    id: "MC201",
    topic: "Ballistic Pendulum",
    difficulty: 1800,
    problem: "A 0.01 kg bullet is fired into a 2 kg block of wood, which then swings up to a maximum height of 0.1 m. What was the initial speed of the bullet? (g=9.8 m/s²)",
    answer: "281.4",
    unit: "m/s"
  },
  {
    category: "Momentum & Collisions",
    id: "MC202",
    topic: "Impulse from Graph",
    difficulty: 1500,
    problem: "The force on an object over time is a triangle starting at (0,0), rising to (2s, 100N), and returning to (4s, 0). What is the total impulse delivered?",
    answer: "200",
    unit: "N*s"
  },
  {
    category: "Momentum & Collisions",
    id: "MC203",
    topic: "Elastic Collision 2D",
    difficulty: 1850,
    problem: "A pool ball moving at 5 m/s hits an identical stationary ball. After the collision, the first ball moves off at a 30° angle to its original path. Assuming a perfectly elastic collision, at what angle does the second ball move off?",
    answer: "-60",
    unit: "degrees"
  },
  {
    category: "Momentum & Collisions",
    id: "MC204",
    topic: "Rocket Propulsion",
    difficulty: 1700,
    problem: "A rocket expels fuel at a rate of 50 kg/s with an exhaust velocity of 2000 m/s relative to the rocket. What is the magnitude of the thrust produced?",
    answer: "100000",
    unit: "N"
  },
  {
    category: "Momentum & Collisions",
    id: "MC205",
    topic: "Center of Mass Motion",
    difficulty: 1450,
    problem: "A 2 kg mass at the origin and a 3 kg mass at $x=5$ are both initially at rest. No external forces act on the system. If the masses are pulled toward each other by an internal spring, what is the final position of their center of mass when they collide?",
    answer: "3",
    unit: "m"
  },
  {
    category: "Momentum & Collisions",
    id: "MC206",
    topic: "Kinetic Energy in Collisions",
    difficulty: 1600,
    problem: "A 4 kg cart at 5 m/s collides with and sticks to a 6 kg cart at rest. How much kinetic energy was lost in the collision?",
    answer: "30",
    unit: "J"
  },
  {
    category: "Momentum & Collisions",
    id: "MC207",
    topic: "Bouncing Ball",
    difficulty: 1400,
    problem: "A 0.5 kg ball is dropped from a height of 2 m. It hits the ground and rebounds to a height of 1.5 m. What is the magnitude of the impulse delivered by the floor to the ball? (g=9.8 m/s²)",
    answer: "5.86",
    unit: "N*s"
  },
  {
    category: "Momentum & Collisions",
    id: "MC208",
    topic: "Force from Momentum",
    difficulty: 1550,
    problem: "A fire hose shoots water at a rate of 20 kg/s and a speed of 30 m/s against a wall. The water stops when it hits the wall. What is the force exerted by the water on the wall?",
    answer: "600",
    unit: "N"
  },
  {
    category: "Momentum & Collisions",
    id: "MC209",
    topic: "Vector Momentum",
    difficulty: 1650,
    problem: "A 3 kg object has velocity $\\vec{v} = \\langle 4, -2 \\rangle$ m/s. A 5 kg object has velocity $\\vec{v} = \\langle -1, 5 \\rangle$ m/s. What is the magnitude of the total momentum of the system?",
    answer: "20.1",
    unit: "kg*m/s",
    format_hint: "Round to one decimal place."
  },
  {
    category: "Momentum & Collisions",
    id: "MC210",
    topic: "Coefficient of Restitution",
    difficulty: 1750,
    problem: "A ball is dropped from 10 m and bounces to 6.4 m. The coefficient of restitution $e$ is given by $e=\\sqrt{h_f/h_i}$. What is $e$?",
    answer: "0.8",
  },
  {
    category: "Momentum & Collisions",
    id: "MC211",
    topic: "Variable Mass System",
    difficulty: 1900,
    problem: "A cart of mass 100 kg is moving at 10 m/s. Rain begins to fall, adding mass to the cart at a rate of 2 kg/s. Assuming no friction, what is the cart's speed after 10 seconds?",
    answer: "8.33",
    unit: "m/s"
  },


  // --- Circular Motion & Gravitation (8 Problems) ---

  {
    category: "Circular Motion & Gravitation",
    id: "PHY_CIRC_01",
    topic: "Centripetal Force",
    difficulty: 1450,
    problem: "A 2kg ball spins in a circle of radius 1m at 4m/s. Calculate the centripetal force.",
    answer: "32",
    unit: "N"
  },
  {
    category: "Circular Motion & Gravitation",
    id: "PHY_GRAV_02",
    topic: "Gravitational Force",
    difficulty: 1550,
    problem: "If the distance between two planets doubles, by what factor does the gravitational force decrease?",
    answer: "4",
  },
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
  {
    category: "Circular Motion & Gravitation",
    id: "CG201",
    topic: "Banked Curve",
    difficulty: 1750,
    problem: "A car is driving on a frictionless banked curve of radius 150 m. The ideal speed for the curve is 25 m/s. What is the banking angle $\\theta$ in degrees? (g=9.8 m/s²)",
    answer: "22.8",
    unit: "degrees",
  },
  {
    category: "Circular Motion & Gravitation",
    id: "CG202",
    topic: "Vertical Circle",
    difficulty: 1650,
    problem: "A 1 kg bucket of water is swung in a vertical circle of radius 1.2 m. What is the minimum speed it must have at the top of the circle to not spill the water? (g=9.8 m/s²)",
    answer: "3.43",
    unit: "m/s"
  },
  {
    category: "Circular Motion & Gravitation",
    id: "CG203",
    topic: "Geosynchronous Orbit",
    difficulty: 1700,
    problem: "A geosynchronous satellite orbits Earth in exactly 24 hours. Using Kepler's Third Law in the form $r = (GMT^2 / (4\\pi^2))^{1/3}$, find the orbital radius. ($G=6.67e-11$, $M_{Earth}=5.97e24$ kg, $T=86400$ s)",
    answer: "4.22e7",
    unit: "m"
  },
  {
    category: "Circular Motion & Gravitation",
    id: "CG204",
    topic: "Comparing g",
    difficulty: 1500,
    problem: "Planet X has twice the mass of Earth and three times the radius. What is the acceleration due to gravity on Planet X, as a multiple of Earth's g?",
    answer: "2/9",
  },
  {
    category: "Circular Motion & Gravitation",
    id: "CG205",
    topic: "Artificial Gravity",
    difficulty: 1600,
    problem: "A space station is designed as a large rotating ring to simulate Earth's gravity (9.8 m/s²). If the station has a radius of 200 m, what must its angular velocity be?",
    answer: "0.22",
    unit: "rad/s"
  },
  {
    category: "Circular Motion & Gravitation",
    id: "CG206",
    topic: "Orbital Energy",
    difficulty: 1800,
    problem: "The total energy of a satellite in a circular orbit is $E = -GmM/(2r)$. If a 1000 kg satellite is in an orbit with radius $r=7e6$ m around Earth ($M=5.97e24$ kg), what is its total energy? ($G=6.67e-11$)",
    answer: "-2.84e10",
    unit: "J"
  },
  {
    category: "Circular Motion & Gravitation",
    id: "CG207",
    topic: "Frequency to Acceleration",
    difficulty: 1450,
    problem: "A centrifuge spins a sample at 3000 rpm (revolutions per minute) at a radius of 0.15 m. What is the centripetal acceleration experienced by the sample?",
    answer: "14804",
    unit: "m/s²",
    format_hint: "Round to the nearest integer."
  },
  {
    category: "Circular Motion & Gravitation",
    id: "CG208",
    topic: "Lagrange Points",
    difficulty: 1950,
    problem: "The L1 Lagrange point is where the gravity from the Sun and Earth on a satellite cancel out the centripetal force required to orbit with the Earth. If a satellite is at this point, does it orbit faster, slower, or at the same angular velocity as Earth?",
    answer: "same",
  },
  {
    category: "Circular Motion & Gravitation",
    id: "CG209",
    topic: "Dark Matter",
    difficulty: 1600,
    problem: "Stars in a galaxy orbit much faster than predicted by visible matter alone. If a star's speed remains constant far from the galactic center, how must the enclosed mass M(r) scale with radius r, based on the orbital speed formula?",
    answer: "proportional to r",
  },
  {
    category: "Circular Motion & Gravitation",
    id: "CG210",
    topic: "Weightlessness",
    difficulty: 1350,
    problem: "Astronauts in orbit feel 'weightless' not because there is no gravity, but because they are in a constant state of what?",
    answer: "free fall",
  },


  // --- Rotational Motion ---

  {
    category: "Rotational Motion",
    id: "PHY_ROT_01",
    topic: "Torque",
    difficulty: 1650,
    problem: "A force of 10N is applied perpendicularly to a wrench 0.5m long. What is the torque?",
    answer: "5",
    unit: "Nm"
  },
  {
    category: "Rotational Motion",
    id: "PHY_ROT_02",
    topic: "Rotational Inertia",
    difficulty: 1750,
    problem: "Calculate the Moment of Inertia of a solid disk ($M=2$kg, $R=1$m) rotating about its center. ($I = 1/2 MR^2$)",
    answer: "1",
    unit: "kg*m^2"
  },
  {
    category: "Rotational Motion",
    id: "PHY_ROT_03",
    topic: "Angular Momentum",
    difficulty: 1800,
    problem: "An ice skater spins with $I=2$ and $\\omega=5$. She pulls her arms in, reducing $I$ to 1. What is her new $\\omega$?",
    answer: "10",
    unit: "rad/s"
  },
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
  {
    category: "Rotational Motion",
    id: "RM201",
    topic: "Rolling without Slipping",
    difficulty: 1750,
    problem: "A solid sphere ($I=2/5 mr^2$) rolls without slipping down a ramp. What fraction of its total kinetic energy is rotational?",
    answer: "2/7",
  },
  {
    category: "Rotational Motion",
    id: "RM202",
    topic: "Torque and Equilibrium",
    difficulty: 1600,
    problem: "A 10 m long uniform beam weighing 200 N is supported at both ends. A 500 N person stands 2 m from the left end. What is the upward support force from the right end?",
    answer: "200",
    unit: "N"
  },
  {
    category: "Rotational Motion",
    id: "RM203",
    topic: "Angular Impulse",
    difficulty: 1550,
    problem: "A constant torque of 10 N·m is applied to a flywheel for 4 seconds. What is the change in the flywheel's angular momentum?",
    answer: "40",
    unit: "kg*m²/s"
  },
  {
    category: "Rotational Motion",
    id: "RM204",
    topic: "Parallel Axis Theorem",
    difficulty: 1800,
    problem: "A thin rod of mass M and length L has inertia $I_{cm}=ML^2/12$ about its center. What is its moment of inertia about one end?",
    answer: "ML^2/3",
  },
  {
    category: "Rotational Motion",
    id: "RM205",
    topic: "Conservation of Angular Momentum",
    difficulty: 1850,
    problem: "A 2 m radius merry-go-round with a moment of inertia of 500 kg·m² is rotating at 10 rad/s. A 60 kg person stands at the center and then walks to the outer edge. What is the new angular velocity?",
    answer: "6.76",
    unit: "rad/s"
  },
  {
    category: "Rotational Motion",
    id: "RM206",
    topic: "Work in Rotation",
    difficulty: 1650,
    problem: "A torque of $\\tau(\\theta) = 5\\theta$ is applied to a wheel as it rotates from $\\theta=0$ to $\\theta=2\\pi$. How much work was done?",
    answer: "98.7",
    unit: "J",
    format_hint: "Round to one decimal place."
  },
  {
    category: "Rotational Motion",
    id: "RM207",
    topic: "Cross Product Torque",
    difficulty: 1700,
    problem: "A force $\\vec{F} = \\langle 1, 5, 0 \\rangle$ N is applied at a position $\\vec{r} = \\langle 2, 1, 0 \\rangle$ m relative to a pivot. What is the torque vector $\\vec{\\tau} = \\vec{r} \\times \\vec{F}$?",
    answer: "<0,0,-9>",
    unit: "N*m"
  },
  {
    category: "Rotational Motion",
    id: "RM208",
    topic: "Gyroscopic Precession",
    difficulty: 1900,
    problem: "If a spinning gyroscope is tilted by gravity (a torque is applied), in which direction does it precess relative to the angular momentum and torque vectors?",
    answer: "perpendicular",
  },
  {
    category: "Rotational Motion",
    id: "RM209",
    topic: "Yo-yo Dynamics",
    difficulty: 1800,
    problem: "A yo-yo (solid disk, I=1/2 mr²) of mass $m$ unrolls down its string. What is its linear acceleration as a multiple of $g$?",
    answer: "2/3",
  },
  {
    category: "Rotational Motion",
    id: "RM210",
    topic: "Comparing Rolling Objects",
    difficulty: 1600,
    problem: "A solid sphere, a disk, and a hoop all roll without slipping down an incline. Which one reaches the bottom first?",
    answer: "sphere",
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
  {
    category: "Electric Fields & Potential",
    id: "EFP201",
    topic: "Zero Field Point",
    difficulty: 1600,
    problem: "A charge of +4Q is at x=0 and a charge of +1Q is at x=3. At what x-coordinate between them is the net electric field zero?",
    answer: "2",
  },
  {
    category: "Electric Fields & Potential",
    id: "EFP202",
    topic: "Electric Flux",
    difficulty: 1550,
    problem: "A uniform electric field of 50 N/C passes through a flat square surface of area 4 m². The field is perpendicular to the surface. What is the electric flux?",
    answer: "200",
    unit: "N*m²/C"
  },
  {
    category: "Electric Fields & Potential",
    id: "EFP203",
    topic: "Potential of a Quadrupole",
    difficulty: 1700,
    problem: "Two positive charges (+q) are at (0,a) and (0,-a). Two negative charges (-q) are at (a,0) and (-a,0). What is the electric potential at the origin (0,0)?",
    answer: "0",
  },
  {
    category: "Electric Fields & Potential",
    id: "EFP204",
    topic: "Field from Potential",
    difficulty: 1650,
    problem: "The electric potential in a region is $V(x,y) = 3x^2y - y^3$. What is the x-component of the electric field at the point (1,2)?",
    answer: "-12",
    unit: "V/m"
  },
  {
    category: "Electric Fields & Potential",
    id: "EFP205",
    topic: "Electron Volt",
    difficulty: 1400,
    problem: "An electron is accelerated from rest through a potential difference of 5000 V. What is its final kinetic energy in electron-volts (eV)?",
    answer: "5000",
    unit: "eV"
  },
  {
    category: "Electric Fields & Potential",
    id: "EFP206",
    topic: "Energy of Assembly",
    difficulty: 1800,
    problem: "How much work is required to assemble three +1 C charges into an equilateral triangle with side length 1 m? (Use k=9e9)",
    answer: "2.7e10",
    unit: "J"
  },
  {
    category: "Electric Fields & Potential",
    id: "EFP207",
    topic: "Conducting Sphere",
    difficulty: 1500,
    problem: "A solid conducting sphere of radius R is given a net charge of +Q. What is the electric field at a point inside the sphere (r < R)?",
    answer: "0",
  },
  {
    category: "Electric Fields & Potential",
    id: "EFP208",
    topic: "Potential from Field",
    difficulty: 1750,
    problem: "The electric field between two parallel plates is a uniform 2000 V/m. The plates are separated by 0.05 m. What is the potential difference between them?",
    answer: "100",
    unit: "V"
  },
  {
    category: "Electric Fields & Potential",
    id: "EFP209",
    topic: "Field Lines",
    difficulty: 1300,
    problem: "If the density of electric field lines in a region doubles, what has happened to the magnitude of the electric field?",
    answer: "doubled",
  },
  {
    category: "Electric Fields & Potential",
    id: "EFP210",
    topic: "Gauss's Law - Cylinder",
    difficulty: 1850,
    problem: "A very long insulating cylinder has charge distributed uniformly with charge per unit length $\\lambda$. Using a cylindrical Gaussian surface of radius r and length L, what is the magnitude of the electric field at distance r?",
    answer: "λ/(2πε₀r)",
  },


  // --- Circuits & Capacitance ---
  {
    category: "Circuits & Capacitance",
    id: "PHY_CIRC_04",
    topic: "RC Circuits",
    difficulty: 2100,
    problem: "A circuit has $R=1000$ Ohms and $C=1e-3$ Farads. What is the time constant $\\tau$?",
    answer: "1",
    unit: "s"
  },
  {
    category: "Circuits & Capacitance",
    id: "PHY_CIRC_05",
    topic: "Power Dissipation",
    difficulty: 1700,
    problem: "A 10 Ohm resistor carries 2 Amps. How much power is dissipated?",
    answer: "40",
    unit: "W"
  },
  {
    category: "Circuits",
    id: "PHY_C_01",
    topic: "Current Definition",
    difficulty: 1400,
    problem: "10 Coulombs pass in 2 seconds. Current?",
    answer: "5",
    unit: "A"
  },
  {
    category: "Circuits",
    id: "PHY_C_02",
    topic: "Equivalent Resistance",
    difficulty: 1500,
    problem: "Three 10 Ohm resistors in series. Total R?",
    answer: "30",
    unit: "Ω"
  },
  {
    category: "Circuits",
    id: "PHY_C_03",
    topic: "Capacitor Charge",
    difficulty: 1600,
    problem: "Capacitance 2F, Voltage 5V. Charge Q?",
    answer: "10",
    unit: "C"
  },
  {
    category: "Circuits",
    id: "PHY_C_04",
    topic: "Power Law",
    difficulty: 1550,
    problem: "Current 2A, Resistance 5Ω. Power dissipated ($I^2R$)?",
    answer: "20",
    unit: "W"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC_NEW_01",
    topic: "Resistors in Series",
    difficulty: 900,
    problem: "Given $R_1=100\\Omega, R_2=200\\Omega$ in series. Find $R_{eq}$.",
    answer: "300",
    unit: "Ω"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC_NEW_02",
    topic: "Resistors in Parallel",
    difficulty: 1100,
    problem: "Given $R_1=100\\Omega, R_2=100\\Omega$ in parallel. Find $R_{eq}$.",
    answer: "50",
    unit: "Ω"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC_NEW_03",
    topic: "Power",
    difficulty: 1200,
    problem: "Calculate power dissipated if $V=10$V and $R=5\\Omega$. ($P=V^2/R$)",
    answer: "20",
    unit: "W"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC_NEW_04",
    topic: "Current",
    difficulty: 1000,
    problem: "Find current $I$ if $V=9$V and $R=4.5\\Omega$.",
    answer: "2",
    unit: "A"
  },
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
  {
    category: "Circuits & Capacitance",
    id: "CC201",
    topic: "Complex Resistor Network",
    difficulty: 1650,
    problem: "A 10Ω resistor is in series with a parallel combination of a 20Ω and a 30Ω resistor. What is the total equivalent resistance of this circuit?",
    answer: "22",
    unit: "Ω"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC202",
    topic: "Kirchhoff's Junction Rule",
    difficulty: 1400,
    problem: "A junction in a circuit has two incoming currents, 3 A and 5 A. There is one outgoing wire. What must be the current in the outgoing wire?",
    answer: "8",
    unit: "A"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC203",
    topic: "Power Dissipation",
    difficulty: 1350,
    problem: "A 100 Ω resistor has a current of 0.5 A flowing through it. How much power is it dissipating as heat?",
    answer: "25",
    unit: "W"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC204",
    topic: "Dielectrics",
    difficulty: 1550,
    problem: "A parallel plate capacitor has a capacitance of 10 μF. A dielectric material with a dielectric constant of κ=4 is inserted between the plates. What is the new capacitance?",
    answer: "40",
    unit: "μF"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC205",
    topic: "RC Circuit Charging",
    difficulty: 1750,
    problem: "An RC circuit with a time constant of 5 seconds is connected to a 12V battery. How long does it take for the capacitor to charge to 63.2% of its maximum voltage?",
    answer: "5",
    unit: "s"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC206",
    topic: "Kirchhoff's Loop Rule",
    difficulty: 1700,
    problem: "A simple circuit contains a 9V battery and two resistors in series, R1=2Ω and R2=4Ω. What is the voltage drop across the 4Ω resistor?",
    answer: "6",
    unit: "V"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC207",
    topic: "Resistivity",
    difficulty: 1600,
    problem: "Wire A and Wire B are made of the same material. Wire B is twice as long and has half the radius of Wire A. What is the ratio of the resistance of Wire B to Wire A?",
    answer: "8",
  },
  {
    category: "Circuits & Capacitance",
    id: "CC208",
    topic: "Internal Resistance",
    difficulty: 1650,
    problem: "A 1.5V battery has an internal resistance of 0.2Ω. When connected to a 2.8Ω resistor, what is the actual voltage (terminal voltage) across the external resistor?",
    answer: "1.4",
    unit: "V"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC209",
    topic: "Complex Capacitor Network",
    difficulty: 1700,
    problem: "A 12μF capacitor and a 6μF capacitor are in series. This combination is in parallel with a 4μF capacitor. What is the total equivalent capacitance?",
    answer: "8",
    unit: "μF"
  },
  {
    category: "Circuits & Capacitance",
    id: "CC210",
    topic: "Discharging Capacitor",
    difficulty: 1800,
    problem: "A 10μF capacitor is charged to 100V and then connected to a 2 MΩ resistor. How much charge remains on the capacitor after 20 seconds?",
    answer: "3.68",
    unit: "μC",
    format_hint: "Round to two decimal places."
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
  {
    category: "Magnetic Fields & Forces",
    id: "MF201",
    topic: "Velocity Selector",
    difficulty: 1750,
    problem: "A region has a uniform magnetic field of 0.5 T pointing north and a uniform electric field. To allow a proton moving east at 2e5 m/s to pass undeflected, what must be the magnitude of the electric field?",
    answer: "100000",
    unit: "V/m"
  },
  {
    category: "Magnetic Fields & Forces",
    id: "MF202",
    topic: "Circular Motion in B-Field",
    difficulty: 1650,
    problem: "An electron ($m=9.11e-31$ kg, $q=1.6e-19$ C) enters a uniform 0.01 T magnetic field at a speed of 3e7 m/s, perpendicular to the field. What is the radius of its circular path?",
    answer: "0.017",
    unit: "m",
    format_hint: "Round to three decimal places."
  },
  {
    category: "Magnetic Fields & Forces",
    id: "MF203",
    topic: "Force Between Wires",
    difficulty: 1800,
    problem: "Two parallel wires are 0.1 m apart. One carries a current of 10 A and the other carries 20 A in the same direction. What is the magnitude of the force per unit length between them? ($\\mu_0 = 4\\pi e-7$ T·m/A)",
    answer: "0.0004",
    unit: "N/m"
  },
  {
    category: "Magnetic Fields & Forces",
    id: "MF204",
    topic: "Magnetic Flux",
    difficulty: 1600,
    problem: "A circular loop of wire with radius 0.1 m is in a uniform 1.5 T magnetic field. The loop is oriented parallel to the field. What is the magnetic flux through the loop?",
    answer: "0",
  },
  {
    category: "Magnetic Fields & Forces",
    id: "MF205",
    topic: "Faraday's Law",
    difficulty: 1700,
    problem: "The magnetic flux through a coil of 100 turns changes from 2 Wb to 5 Wb in 0.5 seconds. What is the magnitude of the induced EMF (voltage) in the coil?",
    answer: "600",
    unit: "V"
  },
  {
    category: "Magnetic Fields & Forces",
    id: "MF206",
    topic: "Lenz's Law",
    difficulty: 1500,
    problem: "A bar magnet is moved towards a closed loop of wire with its North pole facing the loop. The induced current in the loop will create a magnetic pole on that face to oppose the change. What pole will it be?",
    answer: "north",
  },
  {
    category: "Magnetic Fields & Forces",
    id: "MF207",
    topic: "Motional EMF",
    difficulty: 1650,
    problem: "A 0.5 m long conducting rod moves at 4 m/s perpendicular to a 0.2 T magnetic field. What is the magnitude of the EMF induced across the ends of the rod?",
    answer: "0.4",
    unit: "V"
  },
  {
    category: "Magnetic Fields & Forces",
    id: "MF208",
    topic: "Mass Spectrometer",
    difficulty: 1850,
    problem: "In a mass spectrometer, an ion's path radius is $r = mv/(qB)$. If a Carbon-12 ion ($m=12$ u) has a radius of 20 cm, what would be the radius for a Carbon-14 ion ($m=14$ u) with the same charge and speed?",
    answer: "23.3",
    unit: "cm"
  },
  {
    category: "Magnetic Fields & Forces",
    id: "MF209",
    topic: "Field from a Loop",
    difficulty: 1700,
    problem: "The magnetic field at the center of a circular loop of radius $r$ carrying current $I$ is $B=\\mu_0 I/(2r)$. How much current is needed in a 5 cm radius loop to create a 0.001 T field? ($\\mu_0 = 4\\pi e-7$ T·m/A)",
    answer: "79.6",
    unit: "A"
  },
  {
    category: "Magnetic Fields & Forces",
    id: "MF210",
    topic: "Gauss's Law for Magnetism",
    difficulty: 1400,
    problem: "Gauss's Law for Magnetism, $\\oint \\vec{B} \\cdot d\\vec{A} = 0$, implies the non-existence of what fundamental particle?",
    answer: "magnetic monopoles",
  },


  // --- Quantum Mechanics ---

  {
    category: "Quantum Mechanics",
    id: "PHY_QUANT_01",
    topic: "Photon Energy",
    difficulty: 2250,
    problem: "Calculate the energy of a photon with frequency $f$ if Planck's constant is $h$. Formula $E=hf$. If $f=2$ and $h=6.63e-34$, what is E?",
    answer: "1.326e-33",
    unit: "J"
  },
  {
    category: "Quantum Mechanics",
    id: "PHY_QUANT_02",
    topic: "De Broglie Wavelength",
    difficulty: 2350,
    problem: "If momentum $p$ doubles, what happens to the de Broglie wavelength $\\lambda$? (Answer as a fraction, e.g., 1/2)",
    answer: "1/2",
  },
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
  {
    category: "Quantum Mechanics",
    id: "QM201",
    topic: "Photoelectric Effect",
    difficulty: 1650,
    problem: "A metal has a work function of 2.5 eV. What is the maximum kinetic energy of an electron ejected by a photon with an energy of 4.0 eV?",
    answer: "1.5",
    unit: "eV"
  },
  {
    category: "Quantum Mechanics",
    id: "QM202",
    topic: "Atomic Spectra",
    difficulty: 1550,
    problem: "An electron in a hydrogen atom transitions from the n=3 energy level to the n=1 level. The energy of the emitted photon is the difference between the levels, $E_n = -13.6/n^2$ eV. What is the photon's energy?",
    answer: "12.09",
    unit: "eV"
  },
  {
    category: "Quantum Mechanics",
    id: "QM203",
    topic: "Wavefunction Probability",
    difficulty: 1850,
    problem: "A particle in a 1D box of length L is in its ground state, $\\psi(x) = \\sqrt{2/L}\\sin(\\pi x/L)$. What is the probability of finding the particle in the left-most quarter of the box ($0 \\le x \\le L/4$)?",
    answer: "0.091",
    format_hint: "Round to three decimal places."
  },
  {
    category: "Quantum Mechanics",
    id: "QM204",
    topic: "Quantum Tunneling",
    difficulty: 1700,
    problem: "An electron with energy 5 eV encounters a potential barrier of height 10 eV. According to classical physics, what is the probability that the electron will pass through the barrier?",
    answer: "0",
  },
  {
    category: "Quantum Mechanics",
    id: "QM205",
    topic: "Spin",
    difficulty: 1400,
    problem: "An electron is a spin-1/2 particle. In a Stern-Gerlach experiment with the magnetic field aligned in the z-direction, how many distinct paths will a beam of electrons split into?",
    answer: "2",
  },
  {
    category: "Quantum Mechanics",
    id: "QM206",
    topic: "Compton Scattering",
    difficulty: 1900,
    problem: "A photon scatters off a stationary electron. If the photon is deflected by 180 degrees, its wavelength will increase by the Compton wavelength, $h/(m_e c)$. Will the scattered photon's energy be higher, lower, or the same?",
    answer: "lower",
  },
  {
    category: "Quantum Mechanics",
    id: "QM207",
    topic: "Harmonic Oscillator",
    difficulty: 1800,
    problem: "The energy levels of a quantum harmonic oscillator are $E_n = \\hbar\\omega(n+1/2)$. What is the energy of the ground state (n=0)?",
    answer: "hbar*omega/2",
  },
  {
    category: "Quantum Mechanics",
    id: "QM208",
    topic: "Expectation Value of Position",
    difficulty: 1950,
    problem: "A particle in a 1D box of length L is in its ground state, $\\psi(x) = \\sqrt{2/L}\\sin(\\pi x/L)$. Based on the symmetry of the wavefunction, what is the expectation value of its position, $\\langle x \\rangle$?",
    answer: "L/2",
  },
  {
    category: "Quantum Mechanics",
    id: "QM209",
    topic: "Pauli Exclusion Principle",
    difficulty: 1500,
    problem: "The Pauli Exclusion Principle states that no two identical fermions can occupy the same quantum state simultaneously. This principle is responsible for the structure of what common scientific chart?",
    answer: "periodic table",
  },
  {
    category: "Quantum Mechanics",
    id: "QM210",
    topic: "Wave-Particle Duality",
    difficulty: 1450,
    problem: "The double-slit experiment demonstrates that particles like electrons can exhibit properties of both particles and what else?",
    answer: "waves",
  },
  {
    category: "Quantum Mechanics",
    id: "QM211",
    topic: "Superposition",
    difficulty: 1750,
    problem: "A qubit can be in a superposition of states, written as $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$. The probabilities of measuring 0 or 1 are $|\alpha|^2$ and $|\beta|^2$. If a qubit is in the state $|\\psi\\rangle = \\frac{1}{\\sqrt{5}}|0\\rangle + \\frac{2}{\\sqrt{5}}|1\\rangle$, what is the probability of measuring it in the state $|1\\rangle$?",
    answer: "4/5",
  },


  // Thermodynamics (Ideal Gas & Heat)


  {
    category: "Thermodynamics",
    id: "PHY_THERM_01",
    topic: "First Law",
    difficulty: 1850,
    problem: "A gas does 500J of work while expanding adiabatically (no heat exchange). What is the change in internal energy?",
    answer: "-500",
    unit: "J"
  },
  {
    category: "Thermodynamics",
    id: "PHY_THERM_02",
    topic: "Carnot Efficiency",
    difficulty: 1900,
    problem: "A heat engine operates between 600K and 300K. What is its maximum theoretical efficiency (as a decimal)?",
    answer: "0.5",
  },
  {
    category: "Thermodynamics",
    id: "PHY_THERM_03",
    topic: "Ideal Gas Law",
    difficulty: 1600,
    problem: "1 mole of an ideal gas is at 300K in a 1 cubic meter volume. If $R \\approx 8.31$, find the pressure (approx).",
    answer: "2493",
    unit: "Pa"
  },
  {
    category: "Thermodynamics",
    id: "TH_NEW_01",
    topic: "Ideal Gas Law",
    difficulty: 1400,
    problem: "Using $PV=nRT$, find $P$ if $n=1$, $R=8.31$, $T=300$, $V=0.0831$.",
    answer: "30000",
    unit: "Pa"
  },
  {
    category: "Thermodynamics",
    id: "TH_NEW_02",
    topic: "Specific Heat",
    difficulty: 1300,
    problem: "Calculate heat $Q$ to raise 2kg water by $10^\\circ$C. ($c=4186$ J/kgC)",
    answer: "83720",
    unit: "J"
  },
  {
    category: "Thermodynamics",
    id: "TH_NEW_03",
    topic: "Efficiency",
    difficulty: 1500,
    problem: "Carnot efficiency $\\eta = 1 - T_c/T_h$. If $T_c=300$K and $T_h=600$K, find $\\eta$.",
    answer: "0.5"
  },
  {
    category: "Thermodynamics",
    id: "TH_NEW_04",
    topic: "Work",
    difficulty: 1550,
    problem: "Gas expands at constant pressure $P=100$ Pa from $V_1=1$ to $V_2=3$. Find Work ($W=P\\Delta V$).",
    answer: "200",
    unit: "J"
  },

  // Waves & Optics
  {
    category: "Waves & Optics",
    id: "PHY_OPT_01",
    topic: "Snell's Law",
    difficulty: 2100,
    problem: "Light travels from a medium with $n=1$ to $n=2$. If the angle of incidence is $30^{\\circ}$ ($sin(30)=0.5$), what is $sin(\\theta_{refracted})$?",
    answer: "0.25",
  },
  {
    category: "Waves & Optics",
    id: "PHY_WAVE_02",
    topic: "Doppler Effect",
    difficulty: 2150,
    problem: "A source emits sound at 1000Hz. If it moves towards you at the speed of sound, what is the observed frequency?",
    answer: "infinity",
    format_hint: "If the denominator is zero, mathematically it tends to infinity."
  },
  {
    category: "Optics and Waves",
    id: "OW_NEW_01",
    topic: "Wave Speed",
    difficulty: 1100,
    problem: "Find wave speed if $f=50$ Hz and $\\lambda=4$ m.",
    answer: "200",
    unit: "m/s"
  },
  {
    category: "Optics and Waves",
    id: "OW_NEW_02",
    topic: "Frequency",
    difficulty: 1000,
    problem: "Find frequency of a wave with period $T=0.02$ s.",
    answer: "50",
    unit: "Hz"
  },
  {
    category: "Optics and Waves",
    id: "OW_NEW_03",
    topic: "Snell's Law",
    difficulty: 1600,
    problem: "Light passes from air ($n_1=1$) to glass ($n_2=1.5$). If $\\sin(\\theta_1)=0.6$, find $\\sin(\\theta_2)$.",
    answer: "0.4"
  },
  {
    category: "Optics and Waves",
    id: "OW_NEW_04",
    topic: "Mirror Equation",
    difficulty: 1700,
    problem: "Using $1/f = 1/d_o + 1/d_i$, find $1/d_i$ if $f=10$ and $d_o=20$.",
    answer: "0.05",
    unit: "1/cm"
  },

  // --- PHYSICS: MECHANICS & E&M (Tier 3-5: ELO 900-1800) ---
  {
    category: "Physics", id: "PHY_MECH_01", topic: "Newton's Second Law", difficulty: 900,
    problem: "A 10kg object accelerates at $2 m/s^2$. What is the net force?", answer: "20", unit: "N"
  },
  {
    category: "Physics", id: "PHY_MECH_02", topic: "Kinematics", difficulty: 1050,
    problem: "An object falls from rest for 3 seconds ($g \\approx 10 m/s^2$). How far does it fall?", answer: "45", unit: "m"
  },
  {
    category: "Physics", id: "PHY_MECH_03", topic: "Kinetic Energy", difficulty: 1100,
    problem: "Calculate the kinetic energy of a 2kg mass moving at 4 m/s.", answer: "16", unit: "J"
  },
  {
    category: "Physics", id: "PHY_MECH_04", topic: "Gravitational PE", difficulty: 1000,
    problem: "A 5kg rock is raised 10m ($g=10 m/s^2$). What is its Potential Energy?", answer: "500", unit: "J"
  },
  {
    category: "Physics", id: "PHY_MECH_05", topic: "Momentum", difficulty: 1000,
    problem: "A 1000kg car moves at 20 m/s. What is its momentum?", answer: "20000", unit: "kg*m/s"
  },
  {
    category: "Physics", id: "PHY_ELEC_01", topic: "Ohm's Law", difficulty: 950,
    problem: "A circuit has 12V and 4 Ohms resistance. Calculate Current.", answer: "3", unit: "A"
  },
  {
    category: "Physics", id: "PHY_ELEC_02", topic: "Power in Circuits", difficulty: 1150,
    problem: "A resistor dissipates 100W at 20V. What is the current?", answer: "5", unit: "A"
  },
  {
    category: "Physics", id: "PHY_ELEC_03", topic: "Capacitance", difficulty: 1400,
    problem: "A 2uF capacitor is connected to 10V. Calculate charge stored.", answer: "20", unit: "uC"
  },
  {
    category: "Physics", id: "PHY_WAVE_01", topic: "Wave Speed", difficulty: 1200,
    problem: "A wave has frequency 50Hz and wavelength 2m. Find speed.", answer: "100", unit: "m/s"
  },
  {
    category: "Physics", id: "PHY_WAVE_02", topic: "Period/Freq", difficulty: 950,
    problem: "A pendulum swings with a period of 0.5s. What is its frequency?", answer: "2", unit: "Hz"
  },
  {
    category: "Kinematic Equations",
    id: "B2_PHY_01",
    topic: "Velocity",
    difficulty: 500,
    problem: "Distance = 100m, Time = 10s. Find speed.",
    answer: "10",
    unit: "m/s"
  },
  {
    category: "Kinematic Equations",
    id: "B2_PHY_02",
    topic: "Acceleration",
    difficulty: 600,
    problem: "Start at 0m/s, end at 20m/s in 5s. Find acceleration.",
    answer: "4",
    unit: "m/s²"
  },
  {
    category: "Forces & Newton's Laws",
    id: "B2_PHY_03",
    topic: "Newton's 2nd Law",
    difficulty: 650,
    problem: "Mass 10kg, Acceleration 3m/s². Find Force.",
    answer: "30",
    unit: "N"
  },
  {
    category: "Forces & Newton's Laws",
    id: "B2_PHY_04",
    topic: "Weight",
    difficulty: 620,
    problem: "Weight of 1kg mass on Earth ($g=9.8$).",
    answer: "9.8",
    unit: "N"
  },
  {
    category: "Kinematic Equations",
    id: "B2_PHY_05",
    topic: "Free Fall",
    difficulty: 700,
    problem: "Speed after falling 1s from rest ($g=9.8$).",
    answer: "9.8",
    unit: "m/s"
  },
  {
    category: "Work & Energy",
    id: "B2_PHY_06",
    topic: "Kinetic Energy",
    difficulty: 800,
    problem: "KE of 2kg mass at 2m/s. ($0.5mv^2$)",
    answer: "4",
    unit: "J"
  },
  {
    category: "Work & Energy",
    id: "B2_PHY_07",
    topic: "Potential Energy",
    difficulty: 820,
    problem: "PE of 1kg mass at 10m height ($g=9.8$).",
    answer: "98",
    unit: "J"
  },
  {
    category: "Momentum & Collisions",
    id: "B2_PHY_08",
    topic: "Momentum",
    difficulty: 850,
    problem: "Momentum of 10kg car at 5m/s.",
    answer: "50",
    unit: "kg·m/s"
  },
  {
    category: "Work & Energy",
    id: "B2_PHY_09",
    topic: "Work",
    difficulty: 750,
    problem: "Work done pushing box 10m with 5N force.",
    answer: "50",
    unit: "J"
  },
  {
    category: "Forces & Newton's Laws",
    id: "B2_PHY_10",
    topic: "Net Force",
    difficulty: 720,
    problem: "10N right, 4N left. Net force?",
    answer: "6",
    unit: "N"
  },
  {
    category: "Circuits & Capacitance",
    id: "B2_PHY_11",
    topic: "Ohm's Law",
    difficulty: 1050,
    problem: "Voltage 12V, Resistance 6Ω. Current?",
    answer: "2",
    unit: "A"
  },
  {
    category: "Circuits & Capacitance",
    id: "B2_PHY_12",
    topic: "Power",
    difficulty: 1150,
    problem: "Power of resistor with 2A and 5V.",
    answer: "10",
    unit: "W"
  },
  {
    category: "Circular Motion & Gravitation",
    id: "B2_PHY_13",
    topic: "Centripetal Accel",
    difficulty: 1200,
    problem: "$a_c$ for $v=4$ m/s, $r=2$ m.",
    answer: "8",
    unit: "m/s²"
  },
  {
    category: "Optics and Waves",
    id: "B2_PHY_14",
    topic: "Wave Speed",
    difficulty: 1100,
    problem: "Freq 10Hz, Wavelength 2m. Speed?",
    answer: "20",
    unit: "m/s"
  },
  {
    category: "Optics and Waves",
    id: "B2_PHY_15",
    topic: "Period",
    difficulty: 1020,
    problem: "Period of 50Hz wave.",
    answer: "0.02",
    unit: "s"
  },
  {
    category: "Thermodynamics",
    id: "B2_PHY_16",
    topic: "Ideal Gas",
    difficulty: 1350,
    problem: "If T doubles at constant V, P multiplies by?",
    answer: "2"
  },
  {
    category: "Electric Fields & Potential",
    id: "B2_PHY_17",
    topic: "Coulomb Force",
    difficulty: 1400,
    problem: "If distance is halved, force multiplies by?",
    answer: "4"
  },
  {
    category: "Circuits & Capacitance",
    id: "B2_PHY_18",
    topic: "Series Resistors",
    difficulty: 1120,
    problem: "Total R for 10Ω and 20Ω in series.",
    answer: "30",
    unit: "Ω"
  },
  {
    category: "Circuits & Capacitance",
    id: "B2_PHY_19",
    topic: "Parallel Resistors",
    difficulty: 1450,
    problem: "Total R for two 10Ω resistors in parallel.",
    answer: "5",
    unit: "Ω"
  },
  {
    category: "Rotational Motion",
    id: "B2_PHY_20",
    topic: "Torque",
    difficulty: 1300,
    problem: "Force 10N at 2m lever arm (perpendicular). Torque?",
    answer: "20",
    unit: "Nm"
  },
  {
    category: "Quantum Mechanics",
    id: "B2_PHY_21",
    topic: "Photon Energy",
    difficulty: 1600,
    problem: "Energy of photon $E=hf$. If $f$ doubles, E multiplies by?",
    answer: "2"
  },
  {
    category: "Magnetic Fields & Forces",
    id: "B2_PHY_22",
    topic: "Lorentz Force",
    difficulty: 1700,
    problem: "Force on stationary charge in magnetic field.",
    answer: "0",
    unit: "N"
  },
  {
    category: "Quantum Mechanics",
    id: "B2_PHY_23",
    topic: "De Broglie",
    difficulty: 1800,
    problem: "If momentum doubles, wavelength multiplies by?",
    answer: "0.5"
  },
  {
    category: "Thermodynamics",
    id: "B2_PHY_24",
    topic: "Carnot Efficiency",
    difficulty: 1750,
    problem: "Efficiency if $T_c=0$ K?",
    answer: "1"
  },
  {
    category: "Electric Fields & Potential",
    id: "B2_PHY_25",
    topic: "Capacitance",
    difficulty: 1650,
    problem: "Charge stored in 2F cap at 5V.",
    answer: "10",
    unit: "C"
  },
  {
    category: "Forces & Newton's Laws",
    id: "B2_PHY_26",
    topic: "Friction",
    difficulty: 1550,
    problem: "Max static friction if $\\mu=0.5, N=100$.",
    answer: "50",
    unit: "N"
  },
  {
    category: "Kinematic Equations",
    id: "B2_PHY_27",
    topic: "Projectile Range",
    difficulty: 1600,
    problem: "Angle for max range (no air resistance).",
    answer: "45",
    unit: "deg"
  },
  {
    category: "Momentum & Collisions",
    id: "B2_PHY_28",
    topic: "Inelastic Collision",
    difficulty: 1650,
    problem: "1kg at 10m/s hits 1kg at rest, sticks. Final speed?",
    answer: "5",
    unit: "m/s"
  },
  {
    category: "Optics and Waves",
    id: "B2_PHY_29",
    topic: "Snell's Law",
    difficulty: 1700,
    problem: "If $n_1 < n_2$, does light bend toward or away from normal?",
    answer: "toward"
  },
  {
    category: "Magnetic Fields & Forces",
    id: "B2_PHY_30",
    topic: "Solenoid",
    difficulty: 1850,
    problem: "If turns/length doubles, B-field multiplies by?",
    answer: "2"
  },
  // --- PHYSICS: ADVANCED MECHANICS [ELO 1200-1600] ---
  {
    category: "Mechanics",
    id: "PHY_DYN_01",
    topic: "Newton's Laws",
    difficulty: 1200,
    problem: "A 10kg block is pushed with a net force of 50N. What is its acceleration?",
    answer: "5",
    unit: "m/s^2"
  },
  {
    category: "Mechanics",
    id: "PHY_NRG_01",
    topic: "Kinetic Energy",
    difficulty: 1250,
    problem: "Calculate the kinetic energy of a 2kg mass moving at 4 m/s.",
    answer: "16",
    unit: "J"
  },
  {
    category: "Mechanics",
    id: "PHY_MOM_01",
    topic: "Momentum",
    difficulty: 1300,
    problem: "A 4kg object moving at 3 m/s collides with a stationary 2kg object and they stick together. What is the final velocity?",
    answer: "2",
    unit: "m/s"
  },
  {
    category: "Mechanics",
    id: "PHY_FRIC_01",
    topic: "Friction",
    difficulty: 1350,
    problem: "A 5kg block slides on a surface with $\\mu_k = 0.2$. What is the magnitude of the friction force? ($g=9.8$)",
    answer: "9.8",
    unit: "N"
  },
  {
    category: "Mechanics",
    id: "PHY_GRAV_01",
    topic: "Gravitation",
    difficulty: 1400,
    problem: "Calculate the gravitational force between two 1000kg masses separated by 1 meter. ($G \\approx 6.67 \\times 10^{-11}$)",
    answer: "6.67e-5",
    unit: "N",
    format_hint: "Scientific notation"
  },
  {
    category: "Mechanics",
    id: "PHY_CIRC_01",
    topic: "Centripetal Force",
    difficulty: 1450,
    problem: "A 1kg ball spins in a circle of radius 0.5m at 2 m/s. What is the tension in the string?",
    answer: "8",
    unit: "N"
  },
  {
    category: "Mechanics",
    id: "PHY_INC_01",
    topic: "Inclined Planes",
    difficulty: 1500,
    problem: "A block slides down a frictionless $30^\\circ$ incline. What is its acceleration? ($g=9.8$)",
    answer: "4.9",
    unit: "m/s^2"
  },
  {
    category: "Mechanics",
    id: "PHY_SPR_01",
    topic: "Hooke's Law",
    difficulty: 1300,
    problem: "A spring with $k=100$ N/m is compressed 0.2m. What is the potential energy stored?",
    answer: "2",
    unit: "J"
  },
  {
    category: "Mechanics",
    id: "PHY_POW_01",
    topic: "Power",
    difficulty: 1350,
    problem: "An engine does 1000J of work in 5 seconds. What is the power output?",
    answer: "200",
    unit: "W"
  },
  {
    category: "Mechanics",
    id: "PHY_PROJ_01",
    topic: "Projectile Motion",
    difficulty: 1550,
    problem: "A projectile is fired at 20 m/s at $45^\\circ$. What is the range? ($g=10$ m/s$^2$ for simplicity)",
    answer: "40",
    unit: "m"
  },
  // --- PHYSICS: ROTATION & FLUIDS [ELO 1600-1900] ---
  {
    category: "Physics",
    id: "PHY_ROT_01",
    topic: "Torque",
    difficulty: 1600,
    problem: "A 10N force is applied perpendicular to a wrench 0.5m from the pivot. Calculate the torque.",
    answer: "5",
    unit: "Nm"
  },
  {
    category: "Physics",
    id: "PHY_ROT_02",
    topic: "Rotational Inertia",
    difficulty: 1650,
    problem: "Calculate the moment of inertia of a 2kg thin hoop of radius 3m rotating about its center. ($I=MR^2$)",
    answer: "18",
    unit: "kg*m^2"
  },
  {
    category: "Physics",
    id: "PHY_ROT_03",
    topic: "Angular Momentum",
    difficulty: 1700,
    problem: "A disk with $I=2$ kg m$^2$ spins at 5 rad/s. What is its angular momentum?",
    answer: "10",
    unit: "kg m^2/s"
  },
  {
    category: "Physics",
    id: "PHY_ROT_04",
    topic: "Rotational Energy",
    difficulty: 1750,
    problem: "What is the rotational kinetic energy of a sphere ($I=0.4$) spinning at 10 rad/s?",
    answer: "20",
    unit: "J"
  },
  {
    category: "Physics",
    id: "PHY_FLUID_01",
    topic: "Pressure",
    difficulty: 1600,
    problem: "What is the pressure at a depth of 10m in water? (Assume $\\rho=1000$, $g=9.8$, atmospheric pressure ignored).",
    answer: "98000",
    unit: "Pa"
  },
  {
    category: "Physics",
    id: "PHY_FLUID_02",
    topic: "Buoyancy",
    difficulty: 1650,
    problem: "A block displaces 0.002 m$^3$ of water. What is the buoyant force? ($g=9.8$, $\\rho=1000$)",
    answer: "19.6",
    unit: "N"
  },
  {
    category: "Physics",
    id: "PHY_SHM_01",
    topic: "Simple Harmonic Motion",
    difficulty: 1700,
    problem: "A mass-spring system has period $T=2s$. If the mass is quadrupled, what is the new period?",
    answer: "4",
    unit: "s"
  },
  {
    category: "Physics",
    id: "PHY_SHM_02",
    topic: "Pendulum",
    difficulty: 1750,
    problem: "What is the length of a simple pendulum with a period of 2 seconds on Earth? (Use $g \\approx \\pi^2$)",
    answer: "1",
    unit: "m"
  },
  {
    category: "Physics",
    id: "PHY_WAVE_01",
    topic: "Wave Speed",
    difficulty: 1600,
    problem: "A wave has frequency 50Hz and wavelength 2m. What is its speed?",
    answer: "100",
    unit: "m/s"
  },
  {
    category: "Physics",
    id: "PHY_SOUND_01",
    topic: "Doppler Effect",
    difficulty: 1800,
    problem: "A source emits 400Hz moving at 34 m/s towards an observer. Speed of sound is 340 m/s. What frequency is heard?",
    answer: "444.4",
    unit: "Hz"
  },
  // --- PHYSICS: ELECTROMAGNETISM & THERMO ---
  {
    category: "Magnetic Fields & Forces",
    id: "PHY_MAG_01",
    topic: "Lorentz Force",
    difficulty: 2200,
    problem: "An electron ($q = 1.6 \\times 10^{-19}$) moves at $10^6$ m/s perpendicular to a 1 T field. What is the magnitude of force? (Enter in scientific notation like 1.6e-13)",
    answer: "1.6e-13",
    unit: "N"
  },
  {
    category: "Electric Fields & Potential",
    id: "PHY_ELEC_02",
    topic: "Gauss's Law",
    difficulty: 2300,
    problem: "A point charge $q$ is at the center of a sphere of radius $R$. If the radius is doubled to $2R$, what happens to the total electric flux?",
    answer: "1",
    format_hint: "Enter the factor of change (e.g., 1 if unchanged)."
  },

  {
    category: "Physics",
    id: "PHY_ELEC_01",
    topic: "Coulomb's Law",
    difficulty: 1800,
    problem: "Force between two $+1\\mu C$ charges 1m apart. ($k=9\\times10^9$)",
    answer: "0.009",
    unit: "N"
  },
  {
    category: "Physics",
    id: "PHY_ELEC_02",
    topic: "Electric Field",
    difficulty: 1850,
    problem: "Electric field strength 0.5m from a $2\\mu C$ charge. ($k=9\\times10^9$)",
    answer: "72000",
    unit: "N/C"
  },
  {
    category: "Physics",
    id: "PHY_CIRC_02",
    topic: "Ohm's Law",
    difficulty: 1800,
    problem: "Current through a $100\\Omega$ resistor connected to 9V.",
    answer: "0.09",
    unit: "A"
  },
  {
    category: "Physics",
    id: "PHY_CAP_01",
    topic: "Capacitors",
    difficulty: 1900,
    problem: "Energy stored in a $10\\mu F$ capacitor at 100V. ($E = 0.5CV^2$)",
    answer: "0.05",
    unit: "J"
  },
  {
    category: "Physics",
    id: "PHY_CIRC_03",
    topic: "Resistors in Parallel",
    difficulty: 1850,
    problem: "Equivalent resistance of two $100\\Omega$ resistors in parallel.",
    answer: "50",
    unit: "Ohms"
  },
  {
    category: "Physics",
    id: "PHY_MAG_01",
    topic: "Lorentz Force",
    difficulty: 1950,
    problem: "Force on a 2C charge moving 5 m/s perpendicular to a 0.1T magnetic field.",
    answer: "1",
    unit: "N"
  },
  {
    category: "Physics",
    id: "PHY_MAG_02",
    topic: "Wire in B-Field",
    difficulty: 2000,
    problem: "Force on a 2m wire carrying 3A perpendicular to a 0.5T field.",
    answer: "3",
    unit: "N"
  },
  {
    category: "Physics",
    id: "PHY_THERMO_01",
    topic: "Ideal Gas Law",
    difficulty: 1900,
    problem: "Pressure of 1 mole of gas at 300K in 0.025 m$^3$. ($R \\approx 8.31$)",
    answer: "99720",
    unit: "Pa"
  },
  {
    category: "Physics",
    id: "PHY_THERMO_02",
    topic: "Heat Engine",
    difficulty: 2050,
    problem: "Efficiency of a Carnot engine operating between 500K and 300K.",
    answer: "0.4",
    format_hint: "Decimal"
  },
  {
    category: "Physics",
    id: "PHY_THERMO_03",
    topic: "Specific Heat",
    difficulty: 1850,
    problem: "Energy required to heat 1kg of water ($c=4184$) by 10 degrees Celsius.",
    answer: "41840",
    unit: "J"
  },
  {
    category: "Physics",
    id: "PHY_OPT_01",
    topic: "Refraction",
    difficulty: 2000,
    problem: "Light enters glass ($n=1.5$) from air at $30^\\circ$. Find $\\sin(\\theta_{ref})$.",
    answer: "0.333",
  },
  {
    category: "Physics",
    id: "PHY_Q_01",
    topic: "Photon Energy",
    difficulty: 2150,
    problem: "Energy of a photon with frequency $10^{15}$ Hz. ($h \\approx 6.63 \\times 10^{-34}$)",
    answer: "6.63e-19",
    unit: "J"
  },
  {
    category: "Physics",
    id: "PHY_REL_01",
    topic: "Relativity",
    difficulty: 2200,
    problem: "Rest energy of a 1g mass. ($c=3\\times10^8$)",
    answer: "9e13",
    unit: "J"
  },
  {
    category: "Physics",
    id: "PHY_FLUX_01",
    topic: "Magnetic Flux",
    difficulty: 2100,
    problem: "Flux through a 2m$^2$ loop perpendicular to a 3T field.",
    answer: "6",
    unit: "Wb"
  },
  {
    category: "Physics",
    id: "PHY_INDUCT_01",
    topic: "Inductance",
    difficulty: 2150,
    problem: "EMF induced in 2H inductor when current changes at 5 A/s.",
    answer: "10",
    unit: "V"
  },
  {
    category: "Physics",
    id: "PHY_ALT_01",
    topic: "AC Circuits",
    difficulty: 2200,
    problem: "Peak voltage is 170V. What is the RMS voltage?",
    answer: "120",
    unit: "V"
  },
];