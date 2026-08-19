import { NextResponse } from "next/server";
import type { FastingProtocol, User } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireUser, UnauthorizedError } from "@/lib/session";
import { PROTO_LABEL, labelToProto, protoTargetHours } from "@/lib/fasting";
import { fastingCompliance } from "@/lib/business";
import { startOfDay } from "@/lib/date";

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

async function buildState(user: User) {
  const [active, plan, weekSessions] = await Promise.all([
    prisma.fastingSession.findFirst({ where: { userId: user.id, endedAt: null }, orderBy: { startedAt: "desc" } }),
    prisma.dietPlan.findFirst({ where: { userId: user.id }, orderBy: { week: "desc" } }),
    prisma.fastingSession.findMany({
      where: { userId: user.id, startedAt: { gte: new Date(Date.now() - 7 * 864e5) } },
      orderBy: { startedAt: "desc" },
    }),
  ]);

  const selectedProto: FastingProtocol = active?.protocol ?? plan?.fastingProtocol ?? "P16_8";
  const completedThisWeek = weekSessions.filter((s) => s.completed).length;

  return {
    active: active
      ? {
          active: true as const,
          protocol: PROTO_LABEL[active.protocol],
          startedAt: active.startedAt.toISOString(),
          targetHours: active.targetHours,
          elapsedSeconds: Math.floor((Date.now() - active.startedAt.getTime()) / 1000),
        }
      : { active: false as const },
    selectedProtocol: PROTO_LABEL[selectedProto],
    weekCompliance: fastingCompliance(completedThisWeek, 7),
    history: weekSessions.slice(0, 7).map((s) => ({
      date: s.startedAt.toISOString(),
      protocol: PROTO_LABEL[s.protocol],
      completed: s.completed,
    })),
  };
}

export async function GET() {
  const user = await auth();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json(await buildState(user));
}

// Acciones: start | stop | protocol (body { action, protocol? }).
export async function POST(req: Request) {
  const user = await auth();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const action = String(body?.action ?? "");

  if (action === "start") {
    const existing = await prisma.fastingSession.findFirst({ where: { userId: user.id, endedAt: null } });
    if (!existing) {
      const proto = body.protocol ? labelToProto(String(body.protocol)) : "P16_8";
      await prisma.fastingSession.create({
        data: { userId: user.id, protocol: proto, startedAt: new Date(), targetHours: protoTargetHours(proto) },
      });
    }
  } else if (action === "stop") {
    const active = await prisma.fastingSession.findFirst({ where: { userId: user.id, endedAt: null } });
    if (active) {
      const elapsedH = (Date.now() - active.startedAt.getTime()) / 36e5;
      await prisma.fastingSession.update({
        where: { id: active.id },
        data: { endedAt: new Date(), completed: elapsedH >= active.targetHours * 0.95 },
      });
    }
  } else if (action === "protocol") {
    const proto = labelToProto(String(body.protocol ?? "16:8"));
    const active = await prisma.fastingSession.findFirst({ where: { userId: user.id, endedAt: null } });
    if (active) {
      await prisma.fastingSession.update({
        where: { id: active.id },
        data: { protocol: proto, targetHours: protoTargetHours(proto) },
      });
    }
    await prisma.dietPlan.updateMany({ where: { userId: user.id }, data: { fastingProtocol: proto } });
  } else {
    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  }

  return NextResponse.json(await buildState(user));
}
