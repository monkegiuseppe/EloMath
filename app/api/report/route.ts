// app/api/report/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { questionId, problemText, category, reason } = body;

        if (!reason) {
            return NextResponse.json({ error: 'Reason is required' }, { status: 400 });
        }

        // Find user ID if logged in, otherwise null
        let userId = null;
        if (session?.user?.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { id: true }
            });
            if (user) userId = user.id;
        }

        await prisma.report.create({
            data: {
                userId,
                questionId: questionId || null,
                problemText: problemText || "No text provided",
                category: category || "Unknown",
                reason,
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Report submission error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}