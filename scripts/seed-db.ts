// scripts/seed-db.ts

import { PrismaClient } from '@prisma/client';
import { mathProblems } from '../lib/math-problems';
import { physicsProblems } from '../lib/physics-problems';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seeding...');

    // 1. Seed Math Problems
    console.log(`Seeding ${mathProblems.length} math problems...`);
    for (const p of mathProblems) {
        await prisma.question.upsert({
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
        });
    }

    // 2. Seed Physics Problems
    console.log(`Seeding ${physicsProblems.length} physics problems...`);
    for (const p of physicsProblems) {
        await prisma.question.upsert({
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
        });
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