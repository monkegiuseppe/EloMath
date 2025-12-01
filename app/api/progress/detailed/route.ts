// app/api/progress/detailed/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
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
      include: {
        progress: true,
        attempts: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const searchParams = req.nextUrl.searchParams;
    const yearParam = searchParams.get('year');
    const monthParam = searchParams.get('month');
    const offsetParam = searchParams.get('offset');

    const timezoneOffset = offsetParam ? parseInt(offsetParam) : 0;

    let year: number, month: number;
    if (yearParam && monthParam) {
      year = parseInt(yearParam);
      month = parseInt(monthParam);
    } else {
      const now = new Date();
      year = now.getFullYear();
      month = now.getMonth();
    }

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const monthAttempts = user.attempts.filter(attempt => {
      const attemptDate = adjustForTimezone(new Date(attempt.timestamp), timezoneOffset);
      return attemptDate >= startOfMonth && attemptDate <= endOfMonth;
    });

    const dailyActivity = new Map<string, any>();

    monthAttempts.forEach(attempt => {
      const date = adjustForTimezone(new Date(attempt.timestamp), timezoneOffset);
      const dateKey = formatDateKey(date);

      if (!dailyActivity.has(dateKey)) {
        dailyActivity.set(dateKey, {
          date: dateKey,
          count: 0,
          correct: 0,
          incorrect: 0,
          skipped: 0
        });
      }

      const day = dailyActivity.get(dateKey);
      day.count++;
      day[attempt.result]++;
    });

    const allDates = Array.from(new Set(
      user.attempts.map(a => {
        const d = adjustForTimezone(new Date(a.timestamp), timezoneOffset);
        return formatDateKey(d);
      })
    )).sort().reverse();

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    allDates.forEach((dateStr, index) => {
      const date = new Date(dateStr);

      if (index === 0) {
        const today = adjustForTimezone(new Date(), timezoneOffset);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (dateStr === formatDateKey(today) || dateStr === formatDateKey(yesterday)) {
          currentStreak = 1;
          tempStreak = 1;
        }
      } else if (lastDate) {
        const dayDiff = Math.floor((lastDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
          tempStreak++;
          if (currentStreak > 0) {
            currentStreak = tempStreak;
          }
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
          if (currentStreak > 0 && dayDiff > 1) {
            currentStreak = 0;
          }
        }
      }

      lastDate = date;
    });

    longestStreak = Math.max(longestStreak, tempStreak);

    let mostActiveDay = '';
    let maxCount = 0;
    dailyActivity.forEach(day => {
      if (day.count > maxCount) {
        maxCount = day.count;
        mostActiveDay = day.date;
      }
    });

    const categoryStats = new Map<string, any>();
    user.attempts.forEach(attempt => {
      if (!categoryStats.has(attempt.category)) {
        categoryStats.set(attempt.category, {
          category: attempt.category,
          count: 0,
          correct: 0
        });
      }
      const cat = categoryStats.get(attempt.category);
      cat.count++;
      if (attempt.result === 'correct') {
        cat.correct++;
      }
    });

    const categoryBreakdown = Array.from(categoryStats.values()).map(cat => ({
      ...cat,
      accuracy: cat.count > 0 ? (cat.correct / cat.count) * 100 : 0
    }));

    const totalQuestions = user.attempts.length;
    const totalCorrect = user.attempts.filter(a => a.result === 'correct').length;
    const totalIncorrect = user.attempts.filter(a => a.result === 'incorrect').length;
    const totalSkipped = user.attempts.filter(a => a.result === 'skipped').length;
    const mathQuestions = user.attempts.filter(a => a.subject === 'math').length;
    const physicsQuestions = user.attempts.filter(a => a.subject === 'physics').length;
    const accuracyRate = totalQuestions > 0 ? (totalCorrect / (totalCorrect + totalIncorrect)) * 100 : 0;

    return NextResponse.json({
      mathElo: user.progress?.mathElo || 1200,
      physicsElo: user.progress?.physicsElo || 1200,
      totalQuestions,
      totalCorrect,
      totalIncorrect,
      totalSkipped,
      mathQuestions,
      physicsQuestions,
      accuracyRate,
      currentStreak,
      longestStreak,
      mostActiveDay,
      recentActivity: Array.from(dailyActivity.values()),
      categoryBreakdown
    });

  } catch (error) {
    console.error('Progress detailed fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function adjustForTimezone(date: Date, offsetMinutes: number): Date {
  const adjusted = new Date(date.getTime() - offsetMinutes * 60 * 1000);
  return adjusted;
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}