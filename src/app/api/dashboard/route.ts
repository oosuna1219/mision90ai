import { NextResponse } from "next/server";
import type { FastingProtocol } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireUser, UnauthorizedError } from "@/lib/session";
import { computeStreak, waterGoalGlasses } from "@/lib/business";
import { dayRange, daysBetween, formatLongDate } from "@/lib/date";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROTOCOL_LABEL: Record<FastingProtocol, string> = {
  P12_12: "12:12",
  P14_10: "14:10",
  P16_8: "16:8",
  P18_6: "18:6",
};

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    if (e instanceof UnauthorizedError)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    throw e;
  }

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json({ needsOnboarding: true });

  const { start, end } = dayRange();

  const [weightLogs, habits, plan, fasting] = await Promise.all([
    prisma.weightLog.findMany({
      where: { userId: user.id },
      orderBy: { date: "asc" },
      take: 60,
    }),
    prisma.habit.findMany({ where: { userId: user.id, active: true }, orderBy: { id: "asc" } }),
    prisma.dietPlan.findFirst({ where: { userId: user.id }, orderBy: { week: "desc" } }),
    prisma.fastingSession.findFirst({
      where: { userId: user.id, endedAt: null },
      orderBy: { startedAt: "desc" },
    }),
  ]);

  if (weightLogs.length === 0) return NextResponse.json({ empty: true });

  const latest = weightLogs[weightLogs.length - 1];
  const prev = weightLogs.length > 1 ? weightLogs[weightLogs.length - 2] : null;

  const habitIds = habits.map((h) => h.id);
  const [todayHabitLogs, doneHabitLogs, water] = await Promise.all([
    prisma.habitLog.findMany({ where: { habitId: { in: habitIds }, date: { gte: start, lt: end } } }),
    prisma.habitLog.findMany({
      where: { habitId: { in: habitIds }, done: true },
      select: { date: true },
    }),
    prisma.waterLog.findUnique({ where: { userId_date: { userId: user.id, date: start } } }),
  ]);

  const doneToday = new Set(todayHabitLogs.filter((l) => l.done).map(l => l.habitId));

  const streakDates = [
    ...weightLogs.map((w) => w.date),
    ...doneHabitLogs.map((l) => l.date),
  ];

  const goalGlasses = waterGoalGlasses(latest.weightKg, false);

  return NextResponse.json({
    dashboard: {
      date: formatLongDate(),
      missionDay: Math.max(1, daysBetween(user.missionStartDate, new Date()) + 1),
      weightKg: latest.weightKg,
      weightDeltaKg: prev ? Number((latest.weightKg - prev.weightKg).toFixed(1)) : 0,
      streakDays: computeStreak(streakDates),
      fasting: fasting
        ? {
            active: true,
            protocol: PROTOCOL_LABEL[fasting.protocol],
            startedAt: fasting.startedAt.toISOString(),
            targetHours: fasting.targetHours,
            elapsedSeconds: Math.floor((Date.now() - fasting.startedAt.getTime()) / 1000),
          }
        : { active: false as const },
      water: { glasses: water?.glasses ?? 0, goalGlasses },
      habits: habits.map((h) => ({
        id: h.id,
        name: h.name,
        icon: h.icon ?? "✅",
        done: doneToday.has(h.id),
      })),
      plan: plan
        ? { kcal: plan.kcalTarget, carbsG: plan.carbsG, proteinG: plan.proteinG, fatG: plan.fatG }
        : null,
      weightSeries: weightLogs.map((w) => w.weightKg),
    },
  });
}
