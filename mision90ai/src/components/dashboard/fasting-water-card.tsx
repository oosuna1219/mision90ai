"use client";

import { useState } from "react";
import type { DashboardData } from "@/lib/dashboard-types";
import { useFastingClock } from "@/lib/use-fasting-clock";

// README §Lógica de negocio — Agua: 1 vaso = 250 ml, barra = min(100, vasos/meta*100).
export default function FastingWaterCard({
  fasting,
  water,
}: {
  fasting: DashboardData["fasting"];
  water: DashboardData["water"];
}) {
  const [glasses, setGlasses] = useState(water.glasses);
  const { elapsedLabel, remainingLabel, progress, active } = useFastingClock(fasting.startedAt, fasting.targetHours);

  const waterL = parseFloat((glasses * 0.25).toFixed(2));
  const targetL = parseFloat((water.targetGlasses * 0.25).toFixed(2));
  const waterPct = Math.min(100, (glasses / water.targetGlasses) * 100);

  const radius = 41;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  function addWater() {
    setGlasses((g) => Math.min(water.targetGlasses, g + 1));
  }

  return (
    <div className="flex flex-col gap-4 rounded-card-lg bg-ink-deep p-[18px] desktop:p-6">
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 flex-none">
          <svg viewBox="0 0 96 96" className="h-24 w-24 -rotate-90">
            <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="8" />
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke={active ? "#27AE60" : "#FBBF6B"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-[17px] font-extrabold tabular-nums text-white">
            {elapsedLabel}
          </span>
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <span className={`text-[11px] font-extrabold uppercase tracking-[.1em] ${active ? "text-success-on-dark" : "text-warning-on-dark"}`}>
            {active ? "Ayuno activo" : "Ventana de alimentación"}
          </span>
          <span className="text-base font-bold text-white">
            {active ? `Faltan ${remainingLabel}` : "Puedes comer"}
          </span>
          <span className="text-xs tabular-nums text-text-on-dark">
            {fasting.windowLabel} · ventana {fasting.protocol}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[9px]">
        <div className="flex justify-between text-xs font-bold text-text-on-dark-2">
          <span>Agua</span>
          <span className="tabular-nums">
            {waterL} L de {targetL} L
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/14">
          <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${waterPct}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap gap-[9px]">
        <button
          type="button"
          onClick={addWater}
          disabled={glasses >= water.targetGlasses}
          className="min-w-[120px] flex-1 rounded-[11px] border border-white/22 bg-white/8 px-4 py-[13px] text-[13px] font-bold text-white disabled:opacity-50"
        >
          Agua +250 ml
        </button>
        <button type="button" className="min-w-[120px] flex-1 rounded-[11px] bg-primary px-4 py-[13px] text-[13px] font-bold text-white hover:bg-primary-hover">
          Terminar ayuno
        </button>
      </div>
    </div>
  );
}
