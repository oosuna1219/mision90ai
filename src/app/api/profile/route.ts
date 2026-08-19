import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, UnauthorizedError } from "@/lib/session";
import { daysBetween } from "@/lib/date";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    if (e instanceof UnauthorizedError)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    throw e;
  }

  const [profile, accesses, devices] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: user.id } }),
    prisma.nutritionistAccess.findMany({
      where: { userId: user.id },
      include: { nutritionist: { select: { name: true, email: true } } },
    }),
    prisma.device.findMany({ where: { userId: user.id } }),
  ]);

  return NextResponse.json({
    user: {
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
      plan: user.plan,
      level: user.level,
      points: user.points,
      missionDay: Math.max(1, daysBetween(user.missionStartDate, new Date()) + 1),
    },
    profile: profile
      ? { goalWeightKg: profile.goalWeightKg, heightCm: profile.heightCm, units: profile.units }
      : null,
    nutritionists: accesses.map((a) => ({
      id: a.id,
      name: a.nutritionist.name,
      status: a.status,
      permissions: {
        viewWeight: a.viewWeight, viewPhotos: a.viewPhotos, viewMeals: a.viewMeals,
        editPlan: a.editPlan, editFasting: a.editFasting, viewReports: a.viewReports, writeNotes: a.writeNotes,
      },
    })),
    devices: devices.map((d) => ({
      id: d.id, kind: d.kind, brand: d.brand, connected: d.connected,
      lastSyncAt: d.lastSyncAt?.toISOString() ?? null,
    })),
  });
}
