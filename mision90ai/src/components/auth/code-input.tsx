"use client";

import { useEffect, useRef, useState } from "react";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 42; // README: reenvío con temporizador

export default function CodeInput() {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  function handleChange(index: number, raw: string) {
    const value = raw.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (value && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="grid grid-cols-6 gap-[9px]">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Dígito ${i + 1} de ${CODE_LENGTH}`}
            className={`grid h-[60px] place-items-center rounded-xl border-[1.5px] text-center text-2xl font-extrabold text-ink outline-none ${
              d ? "border-primary bg-primary-soft" : "border-border-input bg-white"
            }`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <button type="button" className="btn-primary" disabled={digits.some((d) => !d)}>
          Verificar y entrar
        </button>
        <p className="text-center text-[13px] text-text-body">
          {seconds > 0 ? (
            <>
              Reenviar código en{" "}
              <span className="font-bold text-ink tabular-nums">
                {mm}:{ss}
              </span>
            </>
          ) : (
            <button type="button" onClick={() => setSeconds(RESEND_SECONDS)} className="font-bold text-primary">
              Reenviar código
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
