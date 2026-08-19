import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, UnauthorizedError } from "@/lib/session";
import { startOfDay } from "@/lib/date";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Marca/desmarca el hábito para hoy. Body opcional { done: boolean } (default: toggle).
export async function POST(req: Request, { params }: { params: { id: string } }) {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    if (e instanceof UnauthorizedError)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    throw e;
  }

  // El hábito debe pertenecer al usuario.
  const habit = await prisma.habit.findFirst({ where: { id: params.id, userId: user.id } });
  if (!habit) return NextResponse.json({ error: "Hábito no encontrado" }, { status: 404 });

  const today = startOfDay();
  const body = await req.json().catch(() => ({}));

  const existing = await prisma.habitLog.findUnique({
    where: { habitId_date: { habitId: habit.id, date: today } },
  });
  const done = typeof body?.done === "boolean" ? body.done : !(existing?.done ?? false);

  const saved = await prisma.habitLog.upsert({
    where: { habitId_date: { habitId: habit.id, date: today } },
    create: { habitId: habit.id, date: today, done },
    update: { done },
  });

  return NextResponse.json({ id: habit.id, done: saved.done });
}
