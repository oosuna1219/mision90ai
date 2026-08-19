import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, UnauthorizedError } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Devuelve todos los registros de peso y medidas; el cliente calcula rangos/KPIs.
export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    if (e instanceof UnauthorizedError)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    throw e;
  }

  const [weights, measurements] = await Promise.all([
    prisma.weightLog.findMany({ where: { userId: user.id }, orderBy: { date: "asc" } }),
    prisma.measurement.findMany({ where: { userId: user.id }, orderBy: { date: "asc" } }),
  ]);

  if (weights.length === 0) return NextResponse.json({ empty: true });

  return NextResponse.json({
    weights: weights.map((w) => ({ date: w.date.toISOString(), weightKg: w.weightKg })),
    measurements: measurements.map((m) => ({
      date: m.date.toISOString(),
      waistCm: m.waistCm,
      hipCm: m.hipCm,
      chestCm: m.chestCm,
      armCm: m.armCm,
      thighCm: m.thighCm,
      neckCm: m.neckCm,
    })),
  });
}
