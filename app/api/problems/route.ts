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
        // Fetch possible questions
        // We look for questions within a reasonable difficulty range (+- 150)
        const questions = await prisma.question.findMany({
            where: {
                subject: subject,
                category: { in: categories.length > 0 ? categories : undefined },
                difficulty: {
                    gte: userElo - 150,
                    lte: userElo + 150,
                },
            },
            take: 50, // Limit pool size for performance
        });

        if (questions.length === 0) {
            // Fallback: Find *any* question in categories if strict ELO match fails
            const fallbackQuestions = await prisma.question.findMany({
                where: {
                    subject: subject,
                    category: { in: categories.length > 0 ? categories : undefined },
                },
                take: 20,
            });

            if (fallbackQuestions.length === 0) {
                return NextResponse.json({ error: 'No questions found' }, { status: 404 });
            }

            const randomQ = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
            return NextResponse.json(randomQ);
        }

        // Pick random
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        return NextResponse.json(randomQuestion);

    } catch (error) {
        console.error('Failed to fetch problem:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}