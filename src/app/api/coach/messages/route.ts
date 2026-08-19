import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, UnauthorizedError } from "@/lib/session";
import { askCoach, coachConfigured, type CoachTurn } from "@/lib/coach";

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

// Historial de mensajes del coach para el usuario.
export async function GET() {
  const user = await auth();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const messages = await prisma.coachMessage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    take: 100,
  });
  return NextResponse.json({
    messages: messages.map((m) => ({ role: m.role === "coach" ? "coach" : "user", text: m.text })),
  });
}

// Envía un mensaje al coach y devuelve su respuesta (persistiendo ambos).
export async function POST(req: Request) {
  const user = await auth();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!coachConfigured()) {
    return NextResponse.json(
      { error: "El coach IA no está configurado (falta ANTHROPIC_API_KEY)." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const text = String(body?.text ?? "").trim();
  if (!text) return NextResponse.json({ error: "Escribe un mensaje." }, { status: 400 });
  if (text.length > 2000) return NextResponse.json({ error: "Mensaje demasiado largo." }, { status: 400 });

  // Guarda el mensaje del usuario.
  await prisma.coachMessage.create({ data: { userId: user.id, role: "user", text } });

  // Historial reciente como contexto (incluye el que acabamos de guardar).
  const recent = await prisma.coachMessage.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  const history: CoachTurn[] = recent
    .reverse()
    .map((m) => ({ role: m.role === "coach" ? "coach" : "user", text: m.text }));

  let reply: string;
  try {
    reply = await askCoach(user.id, history);
  } catch (e) {
    console.error("coach error", e);
    return NextResponse.json({ error: "El coach no está disponible ahora mismo." }, { status: 502 });
  }

  await prisma.coachMessage.create({ data: { userId: user.id, role: "coach", text: reply } });

  return NextResponse.json({ reply });
}
