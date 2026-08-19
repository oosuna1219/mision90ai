"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

const LEN = 6;
const RESEND_SECONDS = 45;
const WA_RE = /^\+?\d[\s\d]{8,}$/;

export default function WhatsappPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [whatsapp, setWhatsapp] = useState("");
  const [digits, setDigits] = useState<string[]>(Array(LEN).fill(""));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (step !== "code" || seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [seconds, step]);

  async function requestCode(e?: React.FormEvent) {
    e?.preventDefault();
    if (!WA_RE.test(whatsapp)) return setError("Escribe tu número en formato internacional (+52 55 0000 0000).");
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/whatsapp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setError(data.error ?? "No pudimos enviar el código.");
      setStep("code");
      setSeconds(RESEND_SECONDS);
      setDigits(Array(LEN).fill(""));
      setTimeout(() => inputs.current[0]?.focus(), 50);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function setDigit(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = prev.slice();
      next[i] = d;
      return next;
    });
    if (d && i < LEN - 1) inputs.current[i + 1]?.focus();
  }
  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  }
  function onPaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LEN);
    if (!text) return;
    e.preventDefault();
    const next = Array(LEN).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    inputs.current[Math.min(text.length, LEN - 1)]?.focus();
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < LEN) return setError("Escribe los 6 dígitos.");
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/whatsapp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setError(data.error ?? "Código inválido.");
      router.push("/");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "phone") {
    return (
      <>
        <AuthHeader
          title="Acceso por WhatsApp"
          subtitle="Te enviaremos un código de 6 dígitos al WhatsApp de tu cuenta."
        />
        <form onSubmit={requestCode} className="flex flex-col gap-4" noValidate>
          <Field
            label="WhatsApp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+52 55 0000 0000"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
          {error ? <p role="alert" className="text-[13px] font-semibold text-accent">{error}</p> : null}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Enviando…" : "Enviar código"}
          </Button>
        </form>
        <p className="mt-7 text-center text-[15px] text-body">
          <Link href="/login" className="font-bold text-primary hover:text-primary-hover">Volver al acceso</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <AuthHeader
        title="Confirma tu WhatsApp"
        subtitle={`Enviamos un código a ${whatsapp}. Expira en 10 minutos.`}
      />
      <form onSubmit={verify} className="flex flex-col gap-6" noValidate>
        <div className="flex justify-between gap-2" onPaste={onPaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              aria-label={`Dígito ${i + 1}`}
              className="h-14 w-full rounded-field border-[1.5px] border-border-input bg-surface text-center text-[24px] font-extrabold text-ink outline-none transition-colors duration-200 focus:border-primary"
            />
          ))}
        </div>
        {error ? <p role="alert" className="text-[13px] font-semibold text-accent">{error}</p> : null}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Verificando…" : "Verificar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[15px] text-body">
        {seconds > 0 ? (
          <>Reenviar código en {seconds}s</>
        ) : (
          <button type="button" onClick={() => requestCode()} className="font-bold text-primary hover:text-primary-hover">
            Reenviar código
          </button>
        )}
      </p>
      <p className="mt-4 text-center text-[15px] text-body">
        <button type="button" onClick={() => { setStep("phone"); setError(null); }} className="font-bold text-primary hover:text-primary-hover">
          Cambiar número
        </button>
      </p>
    </>
  );
}
