// app/api/progress/reset/route.ts

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
    const { sessionType } = body; // 'math', 'physics', or 'all'

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure progress exists
    let progress = await prisma.userProgress.findUnique({
      where: { userId: user.id }
    });

    if (!progress) {
      progress = await prisma.userProgress.create({
        data: {
          userId: user.id,
          mathElo: 1200,
          mathCorrect: 0,
          mathIncorrect: 0,
          mathSkipped: 0,
          physicsElo: 1200,
          physicsCorrect: 0,
          physicsIncorrect: 0,
          physicsSkipped: 0
        }
      });
    }

    // Build update data based on what needs to be reset
    const updateData: any = {};
    
    if (sessionType === 'math' || sessionType === 'all') {
      updateData.mathElo = 1200;
      updateData.mathCorrect = 0;
      updateData.mathIncorrect = 0;
      updateData.mathSkipped = 0;
    }
    
    if (sessionType === 'physics' || sessionType === 'all') {
      updateData.physicsElo = 1200;
      updateData.physicsCorrect = 0;
      updateData.physicsIncorrect = 0;
      updateData.physicsSkipped = 0;
    }

    // Update progress
    const updatedProgress = await prisma.userProgress.update({
      where: { userId: user.id },
      data: updateData
    });

    // Delete all question attempts for the reset subject(s)
    if (sessionType === 'all') {
      await prisma.questionAttempt.deleteMany({
        where: { userId: user.id }
      });
    } else {
      await prisma.questionAttempt.deleteMany({
        where: { 
          userId: user.id,
          subject: sessionType
        }
      });
    }

    return NextResponse.json(updatedProgress);
  } catch (error) {
    console.error('Progress reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}