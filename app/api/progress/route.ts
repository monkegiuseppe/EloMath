// app/api/progress/route.ts

import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

// GET handler: Fetches the current user's progress
export async function GET() {
  // Now this works perfectly because authOptions is the correct configuration object
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    let userProgress = await prisma.userProgress.findUnique({
      where: { userId: session.user.id },
    });

    if (!userProgress) {
      userProgress = await prisma.userProgress.create({
        data: {
          userId: session.user.id,
          mathElo: 1200,
          physicsElo: 1200,
        },
      });
    }

    return NextResponse.json(userProgress);
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}


// POST handler: Updates the current user's progress
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { sessionType, newElo, statUpdate } = await request.json();

    if (!['math', 'physics'].includes(sessionType) || typeof newElo !== 'number' || !statUpdate) {
       return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const updateData = {
      [`${sessionType}Elo`]: newElo,
      [`${sessionType}Correct`]: { increment: statUpdate.type === 'correct' ? 1 : 0 },
      [`${sessionType}Incorrect`]: { increment: statUpdate.type === 'incorrect' ? 1 : 0 },
      [`${sessionType}Skipped`]: { increment: statUpdate.type === 'skipped' ? 1 : 0 },
    };

    const updatedProgress = await prisma.userProgress.update({
      where: { userId: session.user.id },
      data: updateData,
    });
    
    return NextResponse.json(updatedProgress);
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}