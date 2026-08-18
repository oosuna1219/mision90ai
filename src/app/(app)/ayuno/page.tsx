"use client";

import { useState } from "react";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatHMS, useElapsed } from "@/lib/useElapsed";
import { protocolTargetHours } from "@/lib/business";
import { cn } from "@/lib/cn";

const PROTOCOLS = [
  { n: "12:12", d: "Inicio suave", w: "20:00 → 08:00" },
  { n: "14:10", d: "Progresión", w: "20:00 → 10:00" },
  { n: "16:8", d: "Tu protocolo actual", w: "19:00 → 11:00" },
  { n: "18:6", d: "Avanzado", w: "19:00 → 13:00" },
];

// Cumplimiento de la semana (sesiones completadas por día).
const WEEK = [
  { day: "Lun", done: true },
  { day: "Mar", done: true },
  { day: "Mié", done: false },
  { day: "Jue", done: true },
  { day: "Vie", done: true },
  { day: "Sáb", done: true },
  { day: "Dom", done: true },
];

export default function AyunoPage() {
  const [proto, setProto] = useState(2); // 16:8
  const [fastOn, setFastOn] = useState(true);
  const target = protocolTargetHours(PROTOCOLS[proto].n) * 3600;
  const elapsed = useElapsed(13 * 3600 + 12 * 60, fastOn);
  const pct = Math.min(100, (elapsed / target) * 100);
  const remaining = Math.max(0, target - elapsed);

  const doneThisWeek = WEEK.filter((w) => w.done).length;
  const compliance = Math.round((doneThisWeek / WEEK.length) * 100);

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Temporizador */}
      <div className="rounded-card bg-ink-deep p-6 text-white md:p-8">
        <div className="flex items-center justify-between">
          <p className="eyebrow !text-on-dark">Ayuno · {PROTOCOLS[proto].n}</p>
          <span
            className="text-[13px] font-bold"
            style={{ color: fastOn ? "rgb(var(--success-on-dark))" : "rgb(var(--warning-on-dark))" }}
          >
            ● {fastOn ? "Ayuno activo" : "Ventana de alimentación"}
          </span>
        </div>
        <p className="my-4 text-[52px] font-extrabold tabular-nums tracking-[-0.02em] md:text-[64px]">
          {formatHMS(fastOn ? elapsed : remaining)}
        </p>
        <p className="text-[14px] text-on-dark-2">
          {fastOn
            ? `Faltan ${formatHMS(remaining)} para tu ventana de alimentación (${PROTOCOLS[proto].w})`
            : "Disfruta tu ventana de alimentación. Tu próximo ayuno empieza a las 19:00."}
        </p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%`, background: "rgb(var(--success-on-dark))" }}
          />
        </div>
        <Button
          className="mt-5"
          variant={fastOn ? "dark" : "primary"}
          onClick={() => setFastOn((v) => !v)}
        >
          {fastOn ? "Finalizar ayuno" : "Iniciar ayuno"}
        </Button>
      </div>

      {/* Protocolos */}
      <Card>
        <CardEyebrow>Protocolo</CardEyebrow>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PROTOCOLS.map((p, i) => {
            const active = proto === i;
            return (
              <button
                key={p.n}
                onClick={() => setProto(i)}
                aria-pressed={active}
                className={cn(
                  "rounded-card border-[1.5px] p-4 text-left transition-colors",
                  active ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-body",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[20px] font-extrabold text-ink">{p.n}</span>
                  {active && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">
                      Activo
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[14px] font-semibold text-body">{p.d}</p>
                <p className="mt-0.5 text-[13px] text-muted">{p.w}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Cumplimiento + historial */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <CardEyebrow>Esta semana</CardEyebrow>
          <span className="text-[13px] font-bold text-body">{compliance}% cumplimiento</span>
        </div>
        <div className="flex justify-between gap-2">
          {WEEK.map((w) => (
            <div key={w.day} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-11 w-full items-center justify-center rounded-field text-lg font-extrabold",
                  w.done ? "bg-success text-white" : "border-[1.5px] border-border-input bg-surface text-muted",
                )}
              >
                {w.done ? "✓" : "—"}
              </div>
              <span className="text-[12px] font-bold text-body">{w.day}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
