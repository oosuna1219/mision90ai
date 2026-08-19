import { NextResponse } from "next/server";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireUser, UnauthorizedError } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function auth() {
  try {
    return await requireUser();
  } catch (e) {
    if (e instanceof UnauthorizedError) return null;
    throw e;
  }
}

async function ensureSettings(user: User) {
  const s = await prisma.settings.findUnique({ where: { userId: user.id } });
  if (s) return s;
  return prisma.settings.create({ data: { userId: user.id } });
}

export async function GET() {
  const user = await auth();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json({ settings: await ensureSettings(user) });
}

// Actualiza campos de Settings (parcial). Solo se aplican los conocidos.
export async function PATCH(req: Request) {
  const user = await auth();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  const bools = [
    "notifyWeighIn", "notifyWater", "notifyFastStart", "notifyFastEnd",
    "notifyWeeklySummary", "notifyCoach", "notifyProduct", "darkMode",
  ];
  for (const k of bools) if (typeof body[k] === "boolean") data[k] = body[k];
  if (body.units === "metric" || body.units === "imperial") data.units = body.units;
  if (typeof body.language === "string") data.language = body.language.slice(0, 8);

  await ensureSettings(user);
  const saved = await prisma.settings.update({ where: { userId: user.id }, data });
  return NextResponse.json({ settings: saved });
}
