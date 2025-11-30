import type { Problem } from './problems';

const generateAlgebraDrills = (): Problem[] => {
    const problems: Problem[] = [];
    let id = 1;

    for (let i = 0; i < 30; i++) {
        const x1 = Math.floor(Math.random() * 10);
        const x2 = x1 + Math.floor(Math.random() * 5) + 1;
        const m = Math.floor(Math.random() * 5) + 1;
        const y1 = Math.floor(Math.random() * 10);
        const y2 = y1 + m * (x2 - x1);

        problems.push({
            category: "Algebra I",
            id: `ALG_SLOPE_${id++}`,
            topic: "Slope",
            difficulty: 650 + (m * 20),
            problem: `Find the slope of the line passing through (${x1}, ${y1}) and (${x2}, ${y2}).`,
            answer: m.toString()
        });
    }

    for (let i = 2; i <= 11; i++) {
        problems.push({
            category: "Algebra II",
            id: `ALG_QUAD_${id++}`,
            topic: "Quadratics",
            difficulty: 700 + (i * 10),
            problem: `Solve for positive x: $x^2 - ${i * i} = 0$`,
            answer: i.toString()
        });
    }

    const bases = [2, 10, 3];
    bases.forEach(base => {
        for (let p = 1; p <= 4; p++) {
            const val = Math.pow(base, p);
            problems.push({
                category: "Algebra II",
                id: `ALG_LOG_${id++}`,
                topic: "Logarithms",
                difficulty: 800 + (val / 2),
                problem: `Evaluate $\\log_{${base}}(${val})$`,
                answer: p.toString()
            });
        }
    });

    return problems;
};

const generateTrigDrills = (): Problem[] => {
    const problems: Problem[] = [];
    let id = 1;

    const angles = [
        { rad: "\\pi", deg: 180, sin: 0, cos: -1 },
        { rad: "\\pi/2", deg: 90, sin: 1, cos: 0 },
        { rad: "0", deg: 0, sin: 0, cos: 1 },
        { rad: "2\\pi", deg: 360, sin: 0, cos: 1 },
        { rad: "3\\pi/2", deg: 270, sin: -1, cos: 0 }
    ];

    angles.forEach(a => {
        problems.push({
            category: "Trigonometry", id: `TRIG_UC_${id++}`, topic: "Unit Circle", difficulty: 850,
            problem: `Evaluate $\\sin(${a.rad})$.`, answer: a.sin.toString()
        });
        problems.push({
            category: "Trigonometry", id: `TRIG_UC_${id++}`, topic: "Unit Circle", difficulty: 900,
            problem: `Evaluate $\\cos(${a.deg}^\\circ)$.`, answer: a.cos.toString()
        });
    });

    const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]];
    triples.forEach(t => {
        problems.push({
            category: "Geometry", id: `GEO_PYT_${id++}`, topic: "Right Triangles", difficulty: 600 + t[2] * 5,
            problem: `A right triangle has legs ${t[0]} and ${t[1]}. Find the hypotenuse.`,
            answer: t[2].toString()
        });
    });

    return problems;
};

const generateStatAndVectorDrills = (): Problem[] => {
    const problems: Problem[] = [];
    let id = 1;

    for (let i = 0; i < 15; i++) {
        const u1 = Math.floor(Math.random() * 10);
        const u2 = Math.floor(Math.random() * 10);
        const v1 = Math.floor(Math.random() * 10);
        const v2 = Math.floor(Math.random() * 10);
        problems.push({
            category: "Linear Algebra", id: `VEC_ADD_${id++}`, topic: "Vector Operations", difficulty: 1100,
            problem: `Add vectors: $[${u1}, ${u2}] + [${v1}, ${v2}]$. Format: [x,y]`,
            answer: `[${u1 + v1},${u2 + v2}]`
        });
    }

    for (let n = 3; n < 15; n++) {
        problems.push({
            category: "Statistics", id: `STAT_PERM_${id++}`, topic: "Permutations", difficulty: 900 + n * 10,
            problem: `Calculate ${n}P1.`,
            answer: n.toString()
        });
    }

    return problems;
}