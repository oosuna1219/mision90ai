// Cliente de WAHA (WhatsApp HTTP API) para enviar los códigos OTP.
// Config por env: WAHA_URL (base, ej. http://waha:3000), WAHA_SESSION, WAHA_API_KEY.

const WAHA_URL = process.env.WAHA_URL || "";
const WAHA_SESSION = process.env.WAHA_SESSION || "default";
const WAHA_API_KEY = process.env.WAHA_API_KEY || "";

export function wahaConfigured(): boolean {
  return Boolean(WAHA_URL);
}

/** Deja solo dígitos (para el chatId y para comparar números). */
export function normalizePhone(input: string): string {
  return String(input || "").replace(/\D/g, "");
}

/** Envía un texto por WhatsApp vía WAHA. `digits` = número solo dígitos. */
export async function sendWhatsApp(digits: string, text: string): Promise<void> {
  if (!WAHA_URL) throw new Error("WAHA_URL no configurado");
  const res = await fetch(`${WAHA_URL.replace(/\/$/, "")}/api/sendText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(WAHA_API_KEY ? { "X-Api-Key": WAHA_API_KEY } : {}),
    },
    body: JSON.stringify({
      session: WAHA_SESSION,
      chatId: `${digits}@c.us`,
      text,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`WAHA ${res.status}: ${body.slice(0, 200)}`);
  }
}
