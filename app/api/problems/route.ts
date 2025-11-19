// app/api/problems/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const categoriesParam = searchParams.get('categories');
    const eloParam = searchParams.get('elo');

    if (!subject || !eloParam) {
        return NextResponse.json({ error: 'Missing required params' }, { status: 400 });
    }

    const userElo = parseInt(eloParam);
    const categories = categoriesParam ? categoriesParam.split(',') : [];

    try {
        // 1. Primary Search: Strict ELO range (+- 150)
        const questions = await prisma.question.findMany({
            where: {
                subject: subject,
                category: { in: categories.length > 0 ? categories : undefined },
                difficulty: {
                    gte: userElo - 150,
                    lte: userElo + 150,
                },
            },
            take: 50,
        });

        if (questions.length > 0) {
            const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
            return NextResponse.json(randomQuestion);
        }

        // 2. FALLBACK: Find the *closest* difficulty question
        // Instead of random, find one with difficulty closest to userElo

        // Fetch one question with difficulty >= userElo (harder)
        const harder = await prisma.question.findFirst({
            where: {
                subject,
                category: { in: categories.length > 0 ? categories : undefined },
                difficulty: { gte: userElo }
            },
            orderBy: { difficulty: 'asc' } // Get the easiest of the hard ones
        });

        // Fetch one question with difficulty < userElo (easier)
        const easier = await prisma.question.findFirst({
            where: {
                subject,
                category: { in: categories.length > 0 ? categories : undefined },
                difficulty: { lt: userElo }
            },
            orderBy: { difficulty: 'desc' } // Get the hardest of the easy ones
        });

        // Choose the closest one
        let selected = null;
        if (harder && easier) {
            const diffHard = Math.abs(harder.difficulty - userElo);
            const diffEasy = Math.abs(easier.difficulty - userElo);
            selected = diffHard < diffEasy ? harder : easier;
        } else {
            selected = harder || easier;
        }

        if (!selected) {
            return NextResponse.json({ error: 'No questions found' }, { status: 404 });
        }

        return NextResponse.json(selected);

    } catch (error) {
        console.error('Failed to fetch problem:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}