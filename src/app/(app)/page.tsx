"use client";

import { useState } from "react";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { HabitCheck } from "@/components/ui/HabitCheck";
import { IconPlus } from "@/components/icons";
import { WeightSparkline } from "@/components/dashboard/WeightSparkline";
import {
  DashboardEmpty,
  DashboardError,
  DashboardSkeleton,
} from "@/components/dashboard/DashboardStates";
import { mockDashboard } from "@/lib/mock";
import { waterPercent } from "@/lib/business";
import { formatHMS, useElapsed } from "@/lib/useElapsed";
import type { DataState } from "@/lib/types";
import { cn } from "@/lib/cn";

export default function DashboardPage() {
  // No backend yet: `state` stands in for the fetch lifecycle. The switcher
  // below is a temporary demo aid, NOT the prototype's review bar.
  const [state, setState] = useState<DataState>("ok");

  return (
    <div className="flex flex-col gap-[18px]">
      <DemoStateSwitcher value={state} onChange={setState} />
      {state === "load" && <DashboardSkeleton />}
      {state === "empty" && <DashboardEmpty />}
      {state === "err" && <DashboardError onRetry={() => setState("ok")} />}
      {state === "ok" && <DashboardContent />}
    </div>
  );
}

function DashboardContent() {
  const d = mockDashboard;
  const [water, setWater] = useState(d.water.glasses);
  const [habits, setHabits] = useState(d.habits);

  const elapsed = useElapsed(d.fasting.elapsedSeconds, d.fasting.active);
  const fastPct = Math.min(100, (elapsed / (d.fasting.targetHours * 3600)) * 100);
  const remaining = Math.max(0, d.fasting.targetHours * 3600 - elapsed);

  const doneCount = habits.filter((h) => h.done).length;

  return (
    <>
      {/* Row 1 — weight hero + fasting */}
      <div className="grid gap-[14px] md:gap-[18px] lg:grid-cols-[1.35fr_1fr]">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <CardEyebrow>Peso actual</CardEyebrow>
              <div className="flex items-end gap-3">
                <span className="text-[44px] font-extrabold leading-none tracking-[-0.02em] text-ink md:text-[54px]">
                  {d.weightKg.toFixed(1)}
                  <span className="ml-1 text-[20px] font-bold text-body">kg</span>
                </span>
                <span
                  className={cn(
                    "mb-2 rounded-full px-2.5 py-1 text-[13px] font-bold",
                    d.weightDeltaKg <= 0
                      ? "bg-success/15 text-success"
                      : "bg-accent/15 text-accent",
                  )}
                >
                  {d.weightDeltaKg > 0 ? "+" : ""}
                  {d.weightDeltaKg.toFixed(1)} kg
                </span>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <WeightSparkline series={d.weightSeries} height={160} />
          </div>
        </Card>

        <FastingCard
          elapsedLabel={formatHMS(elapsed)}
          remainingLabel={formatHMS(remaining)}
          pct={fastPct}
          protocol={d.fasting.protocol}
        />
      </div>

      {/* Row 2 — streak, water, next meal */}
      <div className="grid grid-cols-2 gap-[14px] md:gap-[18px] lg:grid-cols-4">
        <Card>
          <CardEyebrow>Racha</CardEyebrow>
          {/* README: la racha usa el naranja con libertad. */}
          <p className="text-[34px] font-extrabold leading-none text-accent">
            {d.streakDays}
          </p>
          <p className="mt-1 text-[13px] text-body">días seguidos</p>
        </Card>

        <WaterCard
          glasses={water}
          goal={d.water.goalGlasses}
          onAdd={() => setWater((g) => Math.min(d.water.goalGlasses, g + 1))}
        />

        <Card className="col-span-2">
          <CardEyebrow>Siguiente comida · {d.nextMeal.timeLabel}</CardEyebrow>
          <p className="text-[17px] font-extrabold text-ink">{d.nextMeal.slot}</p>
          <p className="mt-1 text-[14px] leading-[1.5] text-body">{d.nextMeal.title}</p>
          <p className="mt-3 text-[13px] font-bold text-body">
            ~{d.nextMeal.kcal} kcal
          </p>
        </Card>
      </div>

      {/* Row 3 — habits */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <CardEyebrow>Hábitos de hoy</CardEyebrow>
            <p className="text-[17px] font-extrabold text-ink">
              {doneCount} de {habits.length} cumplidos
            </p>
          </div>
        </div>
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {habits.map((h, i) => (
            <li
              key={h.id}
              className="flex items-center gap-3 rounded-field border border-border bg-bg-app px-3 py-2"
            >
              <HabitCheck
                done={h.done}
                label={h.name}
                onToggle={() =>
                  setHabits((prev) => {
                    const next = prev.slice();
                    next[i] = { ...next[i], done: !next[i].done };
                    return next;
                  })
                }
              />
              <span className="text-lg" aria-hidden>{h.icon}</span>
              <span
                className={cn(
                  "text-[15px] font-semibold",
                  h.done ? "text-ink line-through decoration-success/60" : "text-ink",
                )}
              >
                {h.name}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

/* ---------------------------------------------------------------- Fasting */

function FastingCard({
  elapsedLabel,
  remainingLabel,
  pct,
  protocol,
}: {
  elapsedLabel: string;
  remainingLabel: string;
  pct: number;
  protocol: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-card bg-ink-deep p-[18px] text-white md:p-6">
      <div className="flex items-center justify-between">
        <p className="eyebrow !text-on-dark">Ayuno · {protocol}</p>
        <span className="text-[13px] font-bold" style={{ color: "rgb(var(--success-on-dark))" }}>
          ● Ayuno activo
        </span>
      </div>
      <div className="my-4">
        <p className="text-[40px] font-extrabold tabular-nums tracking-[-0.02em] md:text-[48px]">
          {elapsedLabel}
        </p>
        <p className="mt-1 text-[13px] text-on-dark-2">
          Faltan {remainingLabel} para tu ventana de alimentación
        </p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: "rgb(var(--success-on-dark))" }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Water */

function WaterCard({
  glasses,
  goal,
  onAdd,
}: {
  glasses: number;
  goal: number;
  onAdd: () => void;
}) {
  const liters = (glasses * 0.25).toFixed(1);
  const pct = waterPercent(glasses, goal);
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <CardEyebrow>Agua</CardEyebrow>
          <p className="text-[26px] font-extrabold leading-none text-ink">
            {liters}
            <span className="ml-1 text-[15px] font-bold text-body">L</span>
          </p>
          <p className="mt-1 text-[13px] text-body">{glasses} / {goal} vasos</p>
        </div>
        <button
          onClick={onAdd}
          aria-label="Agregar un vaso de agua"
          disabled={glasses >= goal}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-hover disabled:opacity-40"
        >
          <IconPlus className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Card>
  );
}

/* ------------------------------------------------- Demo state switcher (temp) */

function DemoStateSwitcher({
  value,
  onChange,
}: {
  value: DataState;
  onChange: (v: DataState) => void;
}) {
  const opts: { v: DataState; label: string }[] = [
    { v: "ok", label: "Con datos" },
    { v: "load", label: "Cargando" },
    { v: "empty", label: "Vacío" },
    { v: "err", label: "Error" },
  ];
  return (
    <div className="flex items-center gap-2 rounded-field border border-dashed border-border-input bg-surface px-3 py-2 text-[12px]">
      <span className="font-bold text-muted">Demo · estado:</span>
      {opts.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={cn(
            "rounded-seg px-2.5 py-1 font-bold transition-colors",
            value === o.v ? "bg-ink text-white" : "text-body hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
