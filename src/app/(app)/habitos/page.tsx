"use client";

import { useState } from "react";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { HabitCheck } from "@/components/ui/HabitCheck";
import { cn } from "@/lib/cn";

interface HabitRow {
  id: string;
  icon: string;
  name: string;
  streak: number;
  // 14 días de historial; el último es "hoy".
  history: boolean[];
}

// Historial semilla: patrón plausible de 14 días.
const seed = (pattern: string): boolean[] => pattern.split("").map((c) => c === "1");

const INITIAL: HabitRow[] = [
  { id: "water", icon: "💧", name: "Beber 3 L de agua", streak: 11, history: seed("11111011111011") },
  { id: "steps", icon: "👟", name: "10 000 pasos", streak: 4, history: seed("10110111101111") },
  { id: "sugar", icon: "🚫", name: "Sin azúcar", streak: 0, history: seed("11101110111110") },
  { id: "sleep", icon: "😴", name: "Dormir 7 h", streak: 6, history: seed("01111101111111") },
  { id: "fast", icon: "⏳", name: "Ayuno 16:8", streak: 12, history: seed("11111111111111") },
  { id: "weigh", icon: "⚖️", name: "Registrar peso", streak: 0, history: seed("11011011010110") },
];

export default function HabitosPage() {
  const [habits, setHabits] = useState(INITIAL);

  function toggleToday(i: number) {
    setHabits((prev) => {
      const next = prev.slice();
      const row = { ...next[i], history: next[i].history.slice() };
      const last = row.history.length - 1;
      row.history[last] = !row.history[last];
      row.streak = row.history[last] ? row.streak + 1 : Math.max(0, row.streak - 1);
      next[i] = row;
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Marcar hoy */}
      <Card>
        <CardEyebrow>Marcar hoy</CardEyebrow>
        <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {habits.map((h, i) => {
            const doneToday = h.history[h.history.length - 1];
            return (
              <li
                key={h.id}
                className="flex items-center gap-3 rounded-field border border-border bg-bg-app px-3 py-2"
              >
                <HabitCheck done={doneToday} label={h.name} onToggle={() => toggleToday(i)} />
                <span className="text-lg" aria-hidden>{h.icon}</span>
                <span className="flex-1 text-[15px] font-semibold text-ink">{h.name}</span>
                <span className="text-[15px] font-extrabold text-accent">{h.streak}🔥</span>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Rejilla de 14 días */}
      <Card>
        <CardEyebrow>Últimos 14 días</CardEyebrow>
        <div className="mt-3 overflow-x-auto">
          <div className="min-w-[520px]">
            {/* Encabezado de días */}
            <div className="mb-2 grid grid-cols-[150px_repeat(14,1fr)] items-center gap-1.5">
              <span />
              {Array.from({ length: 14 }).map((_, d) => (
                <span key={d} className="text-center text-[11px] font-bold text-muted">
                  {d + 1 === 14 ? "Hoy" : d + 1}
                </span>
              ))}
            </div>
            {habits.map((h) => (
              <div
                key={h.id}
                className="grid grid-cols-[150px_repeat(14,1fr)] items-center gap-1.5 py-1"
              >
                <span className="truncate text-[13px] font-semibold text-ink">
                  {h.icon} {h.name}
                </span>
                {h.history.map((done, d) => (
                  <span
                    key={d}
                    title={done ? "Cumplido" : "Sin registro"}
                    className={cn(
                      "aspect-square w-full rounded-[5px]",
                      done ? "bg-success" : "bg-border",
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
