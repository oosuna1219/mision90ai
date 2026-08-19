import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, generateOtp } from "@/lib/auth";
import { wahaConfigured, sendWhatsApp, normalizePhone } from "@/lib/waha";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Envía un código de 6 dígitos por WhatsApp para iniciar sesión.
export async function POST(req: Request) {
  if (!wahaConfigured()) {
    return NextResponse.json(
      { error: "El acceso por WhatsApp no está configurado (falta WAHA_URL)." },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const digits = normalizePhone(body?.whatsapp ?? "");
  if (digits.length < 10) {
    return NextResponse.json({ error: "Escribe tu número en formato internacional." }, { status: 400 });
  }

  // Busca la cuenta por número normalizado (ignora espacios/guiones del registro).
  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id FROM "User" WHERE regexp_replace(whatsapp, '[^0-9]', '', 'g') = ${digits} LIMIT 1
  `;
  const userId = rows[0]?.id ?? null;
  if (!userId) {
    return NextResponse.json(
      { error: "No encontramos una cuenta con ese número. Regístrate primero." },
      { status: 404 },
    );
  }

  const code = generateOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await prisma.otpCode.create({
    data: { userId, whatsapp: digits, codeHash: await hashPassword(code), expiresAt },
  });

  try {
    await sendWhatsApp(
      digits,
      `Tu código de acceso a Misión 90 AI es ${code}. Vence en 10 minutos. Si no lo pediste, ignora este mensaje.`,
    );
  } catch (e) {
    console.error("waha send error", e);
    return NextResponse.json({ error: "No pudimos enviar el código. Intenta de nuevo." }, { status: 502 });
  }

  return NextResponse.json({ sent: true });
}
