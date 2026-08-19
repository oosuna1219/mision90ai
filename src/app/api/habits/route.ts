import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, UnauthorizedError } from "@/lib/session";
import { computeStreak } from "@/lib/business";
import { startOfDay } from "@/lib/date";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAYS = 14;

// Rejilla de 14 días + racha por hábito (README "Hábitos").
export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    if (e instanceof UnauthorizedError)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    throw e;
  }

  const habits = await prisma.habit.findMany({
    where: { userId: user.id, active: true },
    orderBy: { id: "asc" },
  });
  const habitIds = habits.map((h) => h.id);

  // Ventana de 14 días (inicios de día), del más antiguo al de hoy.
  const today = startOfDay();
  const windowStarts: Date[] = [];
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    windowStarts.push(d);
  }
  const windowFrom = windowStarts[0];

  const [rangeLogs, doneLogs] = habitIds.length
    ? await Promise.all([
        prisma.habitLog.findMany({
          where: { habitId: { in: habitIds }, done: true, date: { gte: windowFrom } },
          select: { habitId: true, date: true },
        }),
        prisma.habitLog.findMany({
          where: { habitId: { in: habitIds }, done: true },
          select: { habitId: true, date: true },
        }),
      ])
    : [[], []];

  const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const windowKeys = windowStarts.map(dayKey);

  const result = habits.map((h) => {
    const doneSet = new Set(rangeLogs.filter((l) => l.habitId === h.id).map((l) => dayKey(l.date)));
    const history = windowKeys.map((k) => doneSet.has(k));
    const streak = computeStreak(doneLogs.filter((l) => l.habitId === h.id).map((l) => l.date));
    return { id: h.id, name: h.name, icon: h.icon ?? "✅", streak, history };
  });

  return NextResponse.json({ habits: result });
}
