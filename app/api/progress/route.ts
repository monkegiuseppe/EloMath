// app/api/progress/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { progress: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If user doesn't have progress yet, create it
    if (!user.progress) {
      const newProgress = await prisma.userProgress.create({
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
      return NextResponse.json(newProgress);
    }

    return NextResponse.json(user.progress);
  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { sessionType, newElo, statUpdate, questionDetails } = body;

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

    // Build update data based on session type
    const updateData: any = {};
    
    if (sessionType === 'math') {
      if (newElo !== undefined) updateData.mathElo = newElo;
      if (statUpdate?.type === 'correct') updateData.mathCorrect = progress.mathCorrect + 1;
      if (statUpdate?.type === 'incorrect') updateData.mathIncorrect = progress.mathIncorrect + 1;
      if (statUpdate?.type === 'skipped') updateData.mathSkipped = progress.mathSkipped + 1;
    } else if (sessionType === 'physics') {
      if (newElo !== undefined) updateData.physicsElo = newElo;
      if (statUpdate?.type === 'correct') updateData.physicsCorrect = progress.physicsCorrect + 1;
      if (statUpdate?.type === 'incorrect') updateData.physicsIncorrect = progress.physicsIncorrect + 1;
      if (statUpdate?.type === 'skipped') updateData.physicsSkipped = progress.physicsSkipped + 1;
    }

    // Update progress
    const updatedProgress = await prisma.userProgress.update({
      where: { userId: user.id },
      data: updateData
    });

    // Track individual attempt if details provided
    if (questionDetails) {
      await prisma.questionAttempt.create({
        data: {
          userId: user.id,
          subject: sessionType,
          category: questionDetails.category || 'Unknown',
          difficulty: questionDetails.difficulty || 0,
          result: statUpdate?.type || 'skipped',
          eloChange: questionDetails.eloChange || 0,
          timestamp: new Date()
        }
      });
    }

    return NextResponse.json(updatedProgress);
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}