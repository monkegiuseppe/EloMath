import type { Problem } from './problems';

export const beginnerPhysicsProblems: Problem[] = [
    // Kinematics: Velocity & Speed (500-800)
    {
        id: "BP_KIN01",
        topic: "Average Speed",
        category: "Kinematic Equations",
        difficulty: 500,
        problem: "A car travels 100 meters in 5 seconds. What is its speed?",
        answer: "20",
        unit: "m/s"
    },
    {
        id: "BP_KIN02",
        topic: "Velocity",
        category: "Kinematic Equations",
        difficulty: 550,
        problem: "If $v = d/t$, calculate velocity if $d=60$m and $t=3$s.",
        answer: "20",
        unit: "m/s"
    },
    {
        id: "BP_KIN03",
        topic: "Distance",
        category: "Kinematic Equations",
        difficulty: 600,
        problem: "How far does a runner traveling at 6 m/s go in 10 seconds?",
        answer: "60",
        unit: "m"
    },
    {
        id: "BP_KIN04",
        topic: "Time",
        category: "Kinematic Equations",
        difficulty: 650,
        problem: "How long does it take to travel 500m at 25 m/s?",
        answer: "20",
        unit: "s"
    },
    {
        id: "BP_KIN05",
        topic: "Acceleration",
        category: "Kinematic Equations",
        difficulty: 700,
        problem: "Velocity changes from 0 to 20 m/s in 4 seconds. Find acceleration.",
        answer: "5",
        unit: "m/s²"
    },
    {
        id: "BP_KIN06",
        topic: "Acceleration",
        category: "Kinematic Equations",
        difficulty: 750,
        problem: "A car slows down from 30 m/s to 10 m/s in 5 seconds. What is the magnitude of deceleration?",
        answer: "4",
        unit: "m/s²"
    },
    {
        id: "BP_KIN07",
        topic: "Kinematics",
        category: "Kinematic Equations",
        difficulty: 800,
        problem: "An object falls from rest. Using $v = gt$, find velocity after 3s. ($g=9.8$)",
        answer: "29.4",
        unit: "m/s"
    },
    {
        id: "BP_KIN08",
        topic: "Kinematics",
        category: "Kinematic Equations",
        difficulty: 900,
        problem: "Using $d = \\frac{1}{2}at^2$, find distance fallen in 2s from rest. ($g=9.8$)",
        answer: "19.6",
        unit: "m"
    },
    {
        id: "BP_KIN09",
        topic: "Final Velocity",
        category: "Kinematic Equations",
        difficulty: 850,
        problem: "Start $v_0=5$ m/s, accel $a=2$ m/s$^2$. Find $v$ after 4s using $v = v_0 + at$.",
        answer: "13",
        unit: "m/s"
    },
    {
        id: "BP_KIN10",
        topic: "Displacement",
        category: "Kinematic Equations",
        difficulty: 1000,
        problem: "Calculate displacement: initial $v=0$, $a=5$, $t=4$. Formula: $\\Delta x = \\frac{1}{2}at^2$.",
        answer: "40",
        unit: "m"
    },

    // Forces & Newton's Laws (600-950)
    {
        id: "BP_FOR01",
        topic: "Newton's 2nd Law",
        category: "Forces & Newton's Laws",
        difficulty: 600,
        problem: "Calculate Force: mass $m=10$ kg, accel $a=2$ m/s$^2$. ($F=ma$)",
        answer: "20",
        unit: "N"
    },
    {
        id: "BP_FOR02",
        topic: "Newton's 2nd Law",
        category: "Forces & Newton's Laws",
        difficulty: 650,
        problem: "Find mass if Force $F=50$ N and accel $a=5$ m/s$^2$.",
        answer: "10",
        unit: "kg"
    },
    {
        id: "BP_FOR03",
        topic: "Newton's 2nd Law",
        category: "Forces & Newton's Laws",
        difficulty: 700,
        problem: "Find acceleration: Force $F=12$ N, mass $m=3$ kg.",
        answer: "4",
        unit: "m/s²"
    },
    {
        id: "BP_FOR04",
        topic: "Weight",
        category: "Forces & Newton's Laws",
        difficulty: 650,
        problem: "Calculate weight of a 5 kg mass. ($W=mg$, $g=9.8$)",
        answer: "49",
        unit: "N"
    },
    {
        id: "BP_FOR05",
        topic: "Net Force",
        category: "Forces & Newton's Laws",
        difficulty: 750,
        problem: "A 20N force pulls right, 5N friction pulls left. What is the net force?",
        answer: "15",
        unit: "N"
    },
    {
        id: "BP_FOR06",
        topic: "Balanced Forces",
        category: "Forces & Newton's Laws",
        difficulty: 800,
        problem: "An object moves at constant velocity. What is the net force acting on it?",
        answer: "0",
        unit: "N"
    },
    {
        id: "BP_FOR07",
        topic: "Spring Force",
        category: "Forces & Newton's Laws",
        difficulty: 850,
        problem: "Hooke's Law $F=kx$. Find $F$ if $k=100$ N/m and $x=0.5$ m.",
        answer: "50",
        unit: "N"
    },
    {
        id: "BP_FOR08",
        topic: "Spring Constant",
        category: "Forces & Newton's Laws",
        difficulty: 900,
        problem: "Find spring constant $k$ if $F=20$ N causes stretch $x=0.1$ m.",
        answer: "200",
        unit: "N/m"
    },
    {
        id: "BP_FOR09",
        topic: "Friction",
        category: "Forces & Newton's Laws",
        difficulty: 950,
        problem: "Max static friction $f = \\mu N$. If $\\mu=0.5$ and Normal Force $N=40$, find $f$.",
        answer: "20",
        unit: "N"
    },
    {
        id: "BP_FOR10",
        topic: "Normal Force",
        category: "Forces & Newton's Laws",
        difficulty: 800,
        problem: "A 10 kg box sits on a flat table. What is the normal force? ($g=9.8$)",
        answer: "98",
        unit: "N"
    },

    // Work & Energy (700-1000)
    {
        id: "BP_WORK01",
        topic: "Work",
        category: "Work & Energy",
        difficulty: 700,
        problem: "Calculate Work: Force $F=10$ N pushes a box $d=5$ m. ($W=Fd$)",
        answer: "50",
        unit: "J"
    },
    {
        id: "BP_WORK02",
        topic: "Work",
        category: "Work & Energy",
        difficulty: 750,
        problem: "How much work to lift a 2kg object 3 meters? ($W=mgh$, $g=9.8$)",
        answer: "58.8",
        unit: "J"
    },
    {
        id: "BP_ENG01",
        topic: "Kinetic Energy",
        category: "Work & Energy",
        difficulty: 800,
        problem: "Find Kinetic Energy: $m=2$ kg, $v=3$ m/s. ($K = 0.5mv^2$)",
        answer: "9",
        unit: "J"
    },
    {
        id: "BP_ENG02",
        topic: "Kinetic Energy",
        category: "Work & Energy",
        difficulty: 850,
        problem: "Find Kinetic Energy: $m=4$ kg, $v=2$ m/s.",
        answer: "8",
        unit: "J"
    },
    {
        id: "BP_ENG03",
        topic: "Potential Energy",
        category: "Work & Energy",
        difficulty: 800,
        problem: "Gravitational PE: $m=5$ kg, $h=2$ m. ($U=mgh$, $g=9.8$)",
        answer: "98",
        unit: "J"
    },
    {
        id: "BP_ENG04",
        topic: "Potential Energy",
        category: "Work & Energy",
        difficulty: 850,
        problem: "A 10 kg rock is on a 5 m cliff. Find PE. ($g=9.8$)",
        answer: "490",
        unit: "J"
    },
    {
        id: "BP_POW01",
        topic: "Power",
        category: "Work & Energy",
        difficulty: 900,
        problem: "Power $P = W/t$. Work=100 J done in 5 seconds. Find Power.",
        answer: "20",
        unit: "W"
    },
    {
        id: "BP_POW02",
        topic: "Power",
        category: "Work & Energy",
        difficulty: 950,
        problem: "A machine does 500 J of work in 10 s. What is its power output?",
        answer: "50",
        unit: "W"
    },
    {
        id: "BP_ENG05",
        topic: "Conservation",
        category: "Work & Energy",
        difficulty: 1000,
        problem: "A ball drops. Loss in PE is 50 J. What is the gain in KE (ignoring air)?",
        answer: "50",
        unit: "J"
    },
    {
        id: "BP_ENG06",
        topic: "Spring Energy",
        category: "Work & Energy",
        difficulty: 1100,
        problem: "Spring PE = $0.5kx^2$. If $k=200$ and $x=0.1$, find PE.",
        answer: "1",
        unit: "J"
    },

    // Circuits (750-1000)
    {
        id: "BP_CIRC01",
        topic: "Ohm's Law",
        category: "Circuits & Capacitance",
        difficulty: 750,
        problem: "Find Voltage: Current $I=2$ A, Resistance $R=5$ $\\Omega$. ($V=IR$)",
        answer: "10",
        unit: "V"
    },
    {
        id: "BP_CIRC02",
        topic: "Ohm's Law",
        category: "Circuits & Capacitance",
        difficulty: 800,
        problem: "Find Current: Voltage $V=12$ V, Resistance $R=4$ $\\Omega$.",
        answer: "3",
        unit: "A"
    },
    {
        id: "BP_CIRC03",
        topic: "Ohm's Law",
        category: "Circuits & Capacitance",
        difficulty: 850,
        problem: "Find Resistance: Voltage $V=20$ V, Current $I=5$ A.",
        answer: "4",
        unit: "Ω"
    },
    {
        id: "BP_CIRC04",
        topic: "Power",
        category: "Circuits & Capacitance",
        difficulty: 900,
        problem: "Electric Power $P=IV$. If $I=2$ A and $V=120$ V, find Power.",
        answer: "240",
        unit: "W"
    },
    {
        id: "BP_CIRC05",
        topic: "Power",
        category: "Circuits & Capacitance",
        difficulty: 950,
        problem: "Power dissipated by resistor: $P=I^2R$. If $I=3$ A, $R=2$ $\\Omega$.",
        answer: "18",
        unit: "W"
    },
    {
        id: "BP_CIRC06",
        topic: "Series Circuits",
        category: "Circuits & Capacitance",
        difficulty: 850,
        problem: "Two resistors in series: $R_1=10$, $R_2=20$. Find equivalent resistance.",
        answer: "30",
        unit: "Ω"
    },
    {
        id: "BP_CIRC07",
        topic: "Parallel Circuits",
        category: "Circuits & Capacitance",
        difficulty: 1000,
        problem: "Two $10 \\Omega$ resistors in parallel. Equivalent resistance?",
        answer: "5",
        unit: "Ω"
    },
    {
        id: "BP_CIRC08",
        topic: "Capacitance",
        category: "Circuits & Capacitance",
        difficulty: 1100,
        problem: "Charge $Q = CV$. If $C=2$ F (huge!) and $V=5$ V, find charge Q.",
        answer: "10",
        unit: "C"
    },
    {
        id: "BP_CIRC09",
        topic: "Charge Flow",
        category: "Circuits & Capacitance",
        difficulty: 800,
        problem: "Current $I = Q/t$. If 10 Coulombs pass in 2 seconds, find Current.",
        answer: "5",
        unit: "A"
    },
    {
        id: "BP_CIRC10",
        topic: "Energy",
        category: "Circuits & Capacitance",
        difficulty: 1150,
        problem: "Energy used: $E = Pt$. A 100W bulb runs for 10s. Energy?",
        answer: "1000",
        unit: "J"
    },

    // Momentum (800-1100)
    {
        id: "BP_MOM01",
        topic: "Momentum",
        category: "Momentum & Collisions",
        difficulty: 800,
        problem: "Calculate Momentum $p=mv$: $m=5$ kg, $v=4$ m/s.",
        answer: "20",
        unit: "kg*m/s"
    },
    {
        id: "BP_MOM02",
        topic: "Momentum",
        category: "Momentum & Collisions",
        difficulty: 850,
        problem: "Find mass if momentum $p=50$ and velocity $v=10$.",
        answer: "5",
        unit: "kg"
    },
    {
        id: "BP_MOM03",
        topic: "Impulse",
        category: "Momentum & Collisions",
        difficulty: 950,
        problem: "Impulse $J = Ft$. Force $F=10$ N acts for 3s. Find Impulse.",
        answer: "30",
        unit: "N*s"
    },
    {
        id: "BP_MOM04",
        topic: "Conservation",
        category: "Momentum & Collisions",
        difficulty: 1050,
        problem: "A 2kg object at 3m/s hits a stationary 1kg object and sticks. Total momentum before?",
        answer: "6",
        unit: "kg*m/s"
    },
    {
        id: "BP_MOM05",
        topic: "Velocity Change",
        category: "Momentum & Collisions",
        difficulty: 900,
        problem: "Change in momentum $\\Delta p = m\\Delta v$. If $m=2$ and $v$ changes by 5, find $\\Delta p$.",
        answer: "10",
        unit: "kg*m/s"
    },

    // Waves & Optics Basics (900-1150)
    {
        id: "BP_WAVE01",
        topic: "Wave Speed",
        category: "Optics and Waves",
        difficulty: 900,
        problem: "Wave equation $v = f\\lambda$. If freq $f=10$ Hz and wavelength $\\lambda=2$ m, find speed.",
        answer: "20",
        unit: "m/s"
    },
    {
        id: "BP_WAVE02",
        topic: "Frequency",
        category: "Optics and Waves",
        difficulty: 950,
        problem: "Find frequency $f=1/T$. If Period $T=0.5$ s, find $f$.",
        answer: "2",
        unit: "Hz"
    },
    {
        id: "BP_WAVE03",
        topic: "Period",
        category: "Optics and Waves",
        difficulty: 950,
        problem: "Find Period $T=1/f$. If $f=50$ Hz, find $T$.",
        answer: "0.02",
        unit: "s"
    },
    {
        id: "BP_WAVE04",
        topic: "Sound Speed",
        category: "Optics and Waves",
        difficulty: 1000,
        problem: "Echo takes 2s to return. Sound speed=340 m/s. Distance to wall? ($d = v \\cdot t/2$)",
        answer: "340",
        unit: "m"
    },
    {
        id: "BP_WAVE05",
        topic: "Light Speed",
        category: "Optics and Waves",
        difficulty: 1150,
        problem: "Distance light travels in 1 second? ($c \\approx 3\\times 10^8$)",
        answer: "3e8",
        unit: "m",
        format_hint: "Use scientific notation"
    }
];