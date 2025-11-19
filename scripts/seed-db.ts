// scripts/seed-db.ts

import { PrismaClient } from '@prisma/client';
import { mathProblems } from '../lib/problems'; // Updated import path to combined list
import { physicsProblems } from '../lib/problems'; // Updated import path

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seeding...');

    // 1. Seed Math Problems (Now includes Arithmetic + Calculus)
    console.log(`Seeding ${mathProblems.length} math problems...`);

    // Batch these to prevent connection timeouts if the list gets huge
    const batchSize = 50;
    for (let i = 0; i < mathProblems.length; i += batchSize) {
        const batch = mathProblems.slice(i, i + batchSize);
        await Promise.all(batch.map(p =>
            prisma.question.upsert({
                where: { customId: p.id },
                update: {
                    subject: 'math',
                    topic: p.topic,
                    category: p.category,
                    difficulty: p.difficulty,
                    problem: p.problem,
                    answer: p.answer,
                    unit: p.unit || null,
                    formatHint: p.format_hint || null,
                },
                create: {
                    customId: p.id,
                    subject: 'math',
                    topic: p.topic,
                    category: p.category,
                    difficulty: p.difficulty,
                    problem: p.problem,
                    answer: p.answer,
                    unit: p.unit || null,
                    formatHint: p.format_hint || null,
                },
            })
        ));
    }

    // 2. Seed Physics Problems
    console.log(`Seeding ${physicsProblems.length} physics problems...`);
    for (let i = 0; i < physicsProblems.length; i += batchSize) {
        const batch = physicsProblems.slice(i, i + batchSize);
        await Promise.all(batch.map(p =>
            prisma.question.upsert({
                where: { customId: p.id },
                update: {
                    subject: 'physics',
                    topic: p.topic,
                    category: p.category,
                    difficulty: p.difficulty,
                    problem: p.problem,
                    answer: p.answer,
                    unit: p.unit || null,
                    formatHint: p.format_hint || null,
                },
                create: {
                    customId: p.id,
                    subject: 'physics',
                    topic: p.topic,
                    category: p.category,
                    difficulty: p.difficulty,
                    problem: p.problem,
                    answer: p.answer,
                    unit: p.unit || null,
                    formatHint: p.format_hint || null,
                },
            })
        ));
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });