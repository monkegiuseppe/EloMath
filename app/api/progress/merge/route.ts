// app/api/progress/merge/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const body = await req.json();
        const { anonymousProgress, mergeStrategy } = body;

        if (!anonymousProgress) {
            return NextResponse.json({ error: 'No anonymous progress provided' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { progress: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const existing = user.progress;

        const anonMathAttempts = (anonymousProgress.mathCorrect || 0) + (anonymousProgress.mathIncorrect || 0);
        const anonPhysicsAttempts = (anonymousProgress.physicsCorrect || 0) + (anonymousProgress.physicsIncorrect || 0);
        const existingMathAttempts = existing ? (existing.mathCorrect + existing.mathIncorrect) : 0;
        const existingPhysicsAttempts = existing ? (existing.physicsCorrect + existing.physicsIncorrect) : 0;

        let mergedData: {
            mathElo: number;
            mathCorrect: number;
            mathIncorrect: number;
            mathSkipped: number;
            physicsElo: number;
            physicsCorrect: number;
            physicsIncorrect: number;
            physicsSkipped: number;
        };

        if (!existing || mergeStrategy === 'replace') {
            mergedData = {
                mathElo: anonymousProgress.mathElo || 1200,
                mathCorrect: anonymousProgress.mathCorrect || 0,
                mathIncorrect: anonymousProgress.mathIncorrect || 0,
                mathSkipped: anonymousProgress.mathSkipped || 0,
                physicsElo: anonymousProgress.physicsElo || 1200,
                physicsCorrect: anonymousProgress.physicsCorrect || 0,
                physicsIncorrect: anonymousProgress.physicsIncorrect || 0,
                physicsSkipped: anonymousProgress.physicsSkipped || 0,
            };
        } else if (mergeStrategy === 'combine') {
            const totalMathAttempts = existingMathAttempts + anonMathAttempts;
            const totalPhysicsAttempts = existingPhysicsAttempts + anonPhysicsAttempts;

            const weightedMathElo = totalMathAttempts > 0
                ? Math.round(
                    (existing.mathElo * existingMathAttempts +
                        (anonymousProgress.mathElo || 1200) * anonMathAttempts) /
                    totalMathAttempts
                )
                : (anonymousProgress.mathElo || 1200);

            const weightedPhysicsElo = totalPhysicsAttempts > 0
                ? Math.round(
                    (existing.physicsElo * existingPhysicsAttempts +
                        (anonymousProgress.physicsElo || 1200) * anonPhysicsAttempts) /
                    totalPhysicsAttempts
                )
                : (anonymousProgress.physicsElo || 1200);

            mergedData = {
                mathElo: weightedMathElo,
                mathCorrect: existing.mathCorrect + (anonymousProgress.mathCorrect || 0),
                mathIncorrect: existing.mathIncorrect + (anonymousProgress.mathIncorrect || 0),
                mathSkipped: existing.mathSkipped + (anonymousProgress.mathSkipped || 0),
                physicsElo: weightedPhysicsElo,
                physicsCorrect: existing.physicsCorrect + (anonymousProgress.physicsCorrect || 0),
                physicsIncorrect: existing.physicsIncorrect + (anonymousProgress.physicsIncorrect || 0),
                physicsSkipped: existing.physicsSkipped + (anonymousProgress.physicsSkipped || 0),
            };
        } else if (mergeStrategy === 'keep_best') {
            mergedData = {
                mathElo: Math.max(existing?.mathElo ?? 1200, anonymousProgress.mathElo || 1200),
                mathCorrect: (existing?.mathCorrect ?? 0) + (anonymousProgress.mathCorrect || 0),
                mathIncorrect: (existing?.mathIncorrect ?? 0) + (anonymousProgress.mathIncorrect || 0),
                mathSkipped: (existing?.mathSkipped ?? 0) + (anonymousProgress.mathSkipped || 0),
                physicsElo: Math.max(existing?.physicsElo ?? 1200, anonymousProgress.physicsElo || 1200),
                physicsCorrect: (existing?.physicsCorrect ?? 0) + (anonymousProgress.physicsCorrect || 0),
                physicsIncorrect: (existing?.physicsIncorrect ?? 0) + (anonymousProgress.physicsIncorrect || 0),
                physicsSkipped: (existing?.physicsSkipped ?? 0) + (anonymousProgress.physicsSkipped || 0),
            };
        } else {
            return NextResponse.json({ error: 'Invalid merge strategy' }, { status: 400 });
        }

        const updatedProgress = await prisma.userProgress.upsert({
            where: { userId: user.id },
            update: mergedData,
            create: {
                userId: user.id,
                ...mergedData,
            },
        });

        return NextResponse.json({
            success: true,
            progress: updatedProgress
        });
    } catch (error) {
        console.error('Progress merge error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}