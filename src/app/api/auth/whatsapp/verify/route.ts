import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { normalizePhone } from "@/lib/waha";
import { publicUser } from "@/lib/user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Verifica el código de WhatsApp y crea la sesión.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const digits = normalizePhone(body?.whatsapp ?? "");
  const code = String(body?.code ?? "").trim();
  if (digits.length < 10 || code.length !== 6) {
    return NextResponse.json({ error: "Número o código inválido." }, { status: 400 });
  }

  // Último código no consumido y vigente para ese número.
  const otp = await prisma.otpCode.findFirst({
    where: { whatsapp: digits, consumed: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!otp || !otp.userId) {
    return NextResponse.json({ error: "Código inválido o expirado." }, { status: 401 });
  }

  const ok = await verifyPassword(code, otp.codeHash);
  if (!ok) {
    return NextResponse.json({ error: "Código incorrecto." }, { status: 401 });
  }

  await prisma.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });

  const user = await prisma.user.findUnique({ where: { id: otp.userId } });
  if (!user) return NextResponse.json({ error: "Cuenta no encontrada." }, { status: 404 });

  await createSession(user.id);
  return NextResponse.json({ user: publicUser(user) });
}
