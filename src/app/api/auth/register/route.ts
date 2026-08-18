import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { publicUser } from "@/lib/user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const whatsapp = body.whatsapp ? String(body.whatsapp).trim() : null;
  const password = String(body.password ?? "");

  if (name.length < 2) return NextResponse.json({ error: "Escribe tu nombre." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Correo inválido." }, { status: 400 });
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password))
    return NextResponse.json(
      { error: "La contraseña necesita 8+ caracteres, una mayúscula y un número." },
      { status: 400 },
    );

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Ese correo ya está registrado." }, { status: 409 });

  const user = await prisma.user.create({
    data: {
      name,
      email,
      whatsapp,
      passwordHash: await hashPassword(password),
      settings: { create: {} },
    },
  });

  await createSession(user.id);
  return NextResponse.json({ user: publicUser(user) }, { status: 201 });
}
