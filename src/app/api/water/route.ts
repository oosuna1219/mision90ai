import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, UnauthorizedError } from "@/lib/session";
import { waterGoalGlasses } from "@/lib/business";
import { startOfDay } from "@/lib/date";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Suma (o resta) vasos de agua del día. Body: { delta?: number } (default +1).
export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    if (e instanceof UnauthorizedError)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    throw e;
  }

  const body = await req.json().catch(() => ({}));
  const delta = Number(body?.delta ?? 1) || 1;
  const today = startOfDay();

  const latestWeight = await prisma.weightLog.findFirst({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });
  const goal = latestWeight ? waterGoalGlasses(latestWeight.weightKg, false) : 12;

  const current = await prisma.waterLog.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  });
  const next = Math.max(0, Math.min(goal, (current?.glasses ?? 0) + delta));

  const saved = await prisma.waterLog.upsert({
    where: { userId_date: { userId: user.id, date: today } },
    create: { userId: user.id, date: today, glasses: next },
    update: { glasses: next },
  });

  return NextResponse.json({ glasses: saved.glasses, goalGlasses: goal });
}
