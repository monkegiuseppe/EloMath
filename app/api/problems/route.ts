// app/api/problems/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject');
    const categoriesParam = searchParams.get('categories');
    const eloParam = searchParams.get('elo');
    const excludeIdsParam = searchParams.get('excludeIds');

    if (!subject || !eloParam) {
        return NextResponse.json({ error: 'Missing required params' }, { status: 400 });
    }

    const userElo = parseInt(eloParam);
    const categories = categoriesParam ? categoriesParam.split(',') : [];
    const clientExcludeIds = excludeIdsParam ? excludeIdsParam.split(',').filter(Boolean) : [];

    try {
        const excludeCustomIds = new Set<string>(clientExcludeIds);

        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { id: true }
            });

            if (user) {
                const recentAttempts = await prisma.questionAttempt.findMany({
                    where: {
                        userId: user.id,
                        subject: subject,
                        timestamp: {
                            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                        }
                    },
                    select: { category: true, difficulty: true },
                    orderBy: { timestamp: 'desc' },
                    take: 100
                });

                if (recentAttempts.length > 0) {
                    const recentQuestions = await prisma.question.findMany({
                        where: {
                            subject: subject,
                            OR: recentAttempts.map(a => ({
                                category: a.category,
                                difficulty: a.difficulty
                            }))
                        },
                        select: { customId: true }
                    });

                    recentQuestions.forEach(q => {
                        if (q.customId) excludeCustomIds.add(q.customId);
                    });
                }
            }
        }

        const excludeArray = Array.from(excludeCustomIds);

        const baseWhere = {
            subject: subject,
            category: { in: categories.length > 0 ? categories : undefined },
            ...(excludeArray.length > 0 && { customId: { notIn: excludeArray } })
        };

        let questions = await prisma.question.findMany({
            where: {
                ...baseWhere,
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

        const harder = await prisma.question.findFirst({
            where: {
                ...baseWhere,
                difficulty: { gte: userElo }
            },
            orderBy: { difficulty: 'asc' }
        });

        const easier = await prisma.question.findFirst({
            where: {
                ...baseWhere,
                difficulty: { lt: userElo }
            },
            orderBy: { difficulty: 'desc' }
        });

        let selected = null;
        if (harder && easier) {
            const diffHard = Math.abs(harder.difficulty - userElo);
            const diffEasy = Math.abs(easier.difficulty - userElo);
            selected = diffHard < diffEasy ? harder : easier;
        } else {
            selected = harder || easier;
        }

        if (!selected) {
            if (excludeArray.length > 0) {
                const anyQuestion = await prisma.question.findFirst({
                    where: {
                        subject: subject,
                        category: { in: categories.length > 0 ? categories : undefined },
                    },
                    orderBy: { difficulty: 'asc' }
                });

                if (anyQuestion) {
                    return NextResponse.json({
                        ...anyQuestion,
                        _cycleReset: true
                    });
                }
            }

            return NextResponse.json({ error: 'No questions found' }, { status: 404 });
        }

        return NextResponse.json(selected);

    } catch (error) {
        console.error('Failed to fetch problem:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}