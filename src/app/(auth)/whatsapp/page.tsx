"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Button } from "@/components/ui/Button";

const LEN = 6;
const RESEND_SECONDS = 45;

export default function WhatsappPage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(LEN).fill(""));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [seconds]);

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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < LEN) return setError("Escribe los 6 dígitos.");
    setError(null);
    // TODO: POST /auth/whatsapp/verify. El código expira en 10 minutos.
    router.push("/");
  }

  return (
    <>
      <AuthHeader
        title="Confirma tu WhatsApp"
        subtitle="Enviamos un código de 6 dígitos a tu número. Expira en 10 minutos."
      />

      <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
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

        {error ? (
          <p role="alert" className="text-[13px] font-semibold text-accent">
            {error}
          </p>
        ) : null}

        <Button type="submit" fullWidth>
          Verificar
        </Button>
      </form>

      <p className="mt-6 text-center text-[15px] text-body">
        {seconds > 0 ? (
          <>Reenviar código en {seconds}s</>
        ) : (
          <button
            type="button"
            onClick={() => setSeconds(RESEND_SECONDS)}
            className="font-bold text-primary hover:text-primary-hover"
          >
            Reenviar código
          </button>
        )}
      </p>

      <p className="mt-4 text-center text-[15px] text-body">
        <Link href="/login" className="font-bold text-primary hover:text-primary-hover">
          Volver al acceso
        </Link>
      </p>
    </>
  );
}
