import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, UnauthorizedError } from "@/lib/session";
import { fastingCompliance } from "@/lib/business";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PERIODS: Record<string, { days: number; label: string }> = {
  week: { days: 7, label: "Semanal" },
  month: { days: 30, label: "Mensual" },
  quarter: { days: 90, label: "Trimestral" },
};

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export async function GET(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    if (e instanceof UnauthorizedError)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    throw e;
  }

  const periodKey = new URL(req.url).searchParams.get("period") ?? "week";
  const period = PERIODS[periodKey] ?? PERIODS.week;
  const from = new Date(Date.now() - period.days * 864e5);

  const [weights, fasts, measures, waters, activities, habits, habitLogs, plans] = await Promise.all([
    prisma.weightLog.findMany({ where: { userId: user.id, date: { gte: from } }, orderBy: { date: "asc" } }),
    prisma.fastingSession.findMany({ where: { userId: user.id, startedAt: { gte: from } } }),
    prisma.measurement.findMany({ where: { userId: user.id, date: { gte: from } }, orderBy: { date: "asc" } }),
    prisma.waterLog.findMany({ where: { userId: user.id, date: { gte: from } } }),
    prisma.activityLog.findMany({ where: { userId: user.id, date: { gte: from } } }),
    prisma.habit.findMany({ where: { userId: user.id, active: true } }),
    prisma.habitLog.findMany({ where: { habit: { userId: user.id }, done: true, date: { gte: from } } }),
    prisma.dietPlan.findMany({ where: { userId: user.id, generatedAt: { gte: from } } }),
  ]);

  const num = (n: number, unit: string) => `${n > 0 ? "+" : ""}${n.toFixed(1)} ${unit}`;

  // Peso perdido y promedio semanal.
  let lost = "—", avg = "—", lostVal = 0;
  if (weights.length >= 2) {
    lostVal = weights[weights.length - 1].weightKg - weights[0].weightKg;
    lost = num(lostVal, "kg");
    const spanDays = (new Date(weights[weights.length - 1].date).getTime() - new Date(weights[0].date).getTime()) / 864e5;
    avg = num(lostVal / Math.max(1, spanDays / 7), "kg");
  }

  // Cintura.
  let waist = "—";
  const waistM = measures.filter((m) => m.waistCm != null);
  if (waistM.length >= 2) waist = num(waistM[waistM.length - 1].waistCm! - waistM[0].waistCm!, "cm");

  // Cumplimiento de ayuno.
  const fastCompletedN = fasts.filter((f) => f.completed).length;
  const fastPct = fastingCompliance(fastCompletedN, Math.min(period.days, Math.max(fasts.length, 1)));

  // Días registrados (con peso o hábito).
  const daysSet = new Set<string>();
  weights.forEach((w) => daysSet.add(dayKey(w.date)));
  habitLogs.forEach((l) => daysSet.add(dayKey(l.date)));

  // Agua promedio (L/día sobre días con registro).
  const waterAvg = waters.length ? waters.reduce((a, w) => a + w.glasses * 0.25, 0) / waters.length : 0;

  // Actividad y hábitos.
  const activityMin = activities.reduce((a, x) => a + x.minutes, 0);
  const habitsPossible = habits.length * period.days;

  const kpis = {
    lost,
    avg,
    fast: `${fastPct}%`,
    waist,
    days: `${daysSet.size} / ${period.days}`,
    water: `${waterAvg.toFixed(1)} L`,
    act: `${activityMin} min`,
    hab: `${habitLogs.length} / ${habitsPossible || 0}`,
    adj: String(plans.length),
  };

  // Resumen escrito (plantilla a partir de los KPIs reales).
  let summary: string;
  if (weights.length < 2 && daysSet.size <= 1) {
    summary =
      "Aún hay pocos datos en este periodo. Registra tu peso a diario y marca tus hábitos para que tus reportes cobren vida.";
  } else {
    const trend = lostVal < -0.1 ? `bajaste ${Math.abs(lostVal).toFixed(1)} kg` : lostVal > 0.1 ? `subiste ${lostVal.toFixed(1)} kg` : "mantuviste tu peso";
    summary = `En el periodo ${trend}, con ${daysSet.size} de ${period.days} días registrados y ${fastPct}% de cumplimiento de ayuno. ${waterAvg < 2.5 ? "El agua sigue por debajo de la meta: súbela esta semana." : "Buen nivel de hidratación, mantenlo."}`;
  }

  return NextResponse.json({ range: period.label, kpis, summary });
}
