"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { HabitCheck } from "@/components/ui/HabitCheck";
import { IconPlus } from "@/components/icons";
import { WeightSparkline } from "@/components/dashboard/WeightSparkline";
import {
  DashboardEmpty,
  DashboardError,
  DashboardSkeleton,
} from "@/components/dashboard/DashboardStates";
import { waterPercent } from "@/lib/business";
import { formatHMS, useElapsed } from "@/lib/useElapsed";
import { cn } from "@/lib/cn";

type Fasting =
  | { active: true; protocol: string; startedAt: string; targetHours: number; elapsedSeconds: number }
  | { active: false };

interface DashData {
  date: string;
  missionDay: number;
  weightKg: number;
  weightDeltaKg: number;
  streakDays: number;
  fasting: Fasting;
  water: { glasses: number; goalGlasses: number };
  habits: { id: string; name: string; icon: string; done: boolean }[];
  plan: { kcal: number; carbsG: number; proteinG: number; fatG: number } | null;
  weightSeries: number[];
}

type State = "load" | "ok" | "empty" | "err";

export default function DashboardPage() {
  const router = useRouter();
  const [state, setState] = useState<State>("load");
  const [data, setData] = useState<DashData | null>(null);

  const load = useCallback(async () => {
    setState("load");
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      if (res.status === 401) return router.push("/login");
      const json = await res.json().catch(() => ({}));
      if (json.needsOnboarding) return router.push("/onboarding");
      if (json.empty) return setState("empty");
      if (!res.ok || !json.dashboard) return setState("err");
      setData(json.dashboard as DashData);
      setState("ok");
    } catch {
      setState("err");
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  if (state === "load") return <DashboardSkeleton />;
  if (state === "empty") return <DashboardEmpty />;
  if (state === "err") return <DashboardError onRetry={load} />;
  if (!data) return null;

  return <DashboardContent data={data} onChange={setData} />;
}

function DashboardContent({
  data,
  onChange,
}: {
  data: DashData;
  onChange: (updater: (d: DashData | null) => DashData | null) => void;
}) {
  const doneCount = data.habits.filter((h) => h.done).length;

  async function addWater() {
    const res = await fetch("/api/water", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delta: 1 }),
    });
    if (!res.ok) return;
    const { glasses } = await res.json();
    onChange((d) => (d ? { ...d, water: { ...d.water, glasses } } : d));
  }

  async function toggleHabit(id: string) {
    const res = await fetch(`/api/habits/${id}/log`, { method: "POST" });
    if (!res.ok) return;
    const { done } = await res.json();
    onChange((d) =>
      d ? { ...d, habits: d.habits.map((h) => (h.id === id ? { ...h, done } : h)) } : d,
    );
  }

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Row 1 — peso + ayuno */}
      <div className="grid gap-[14px] md:gap-[18px] lg:grid-cols-[1.35fr_1fr]">
        <Card>
          <CardEyebrow>Peso actual</CardEyebrow>
          <div className="flex items-end gap-3">
            <span className="text-[44px] font-extrabold leading-none tracking-[-0.02em] text-ink md:text-[54px]">
              {data.weightKg.toFixed(1)}
              <span className="ml-1 text-[20px] font-bold text-body">kg</span>
            </span>
            {data.weightDeltaKg !== 0 && (
              <span
                className={cn(
                  "mb-2 rounded-full px-2.5 py-1 text-[13px] font-bold",
                  data.weightDeltaKg <= 0 ? "bg-success/15 text-success" : "bg-accent/15 text-accent",
                )}
              >
                {data.weightDeltaKg > 0 ? "+" : ""}
                {data.weightDeltaKg.toFixed(1)} kg
              </span>
            )}
          </div>
          <div className="mt-5">
            <WeightSparkline
              series={data.weightSeries.length > 1 ? data.weightSeries : [data.weightKg, data.weightKg]}
              height={160}
            />
          </div>
        </Card>

        {data.fasting.active ? (
          <FastingCard fasting={data.fasting} />
        ) : (
          <Link
            href="/ayuno"
            className="flex flex-col justify-center rounded-card bg-ink-deep p-6 text-white transition-shadow hover:shadow-card-hover"
          >
            <p className="eyebrow !text-on-dark">Ayuno</p>
            <p className="mt-2 text-[20px] font-extrabold">Sin ayuno activo</p>
            <p className="mt-1 text-[14px] text-on-dark-2">Inicia tu ventana de ayuno →</p>
          </Link>
        )}
      </div>

      {/* Row 2 — racha, agua, plan */}
      <div className="grid grid-cols-2 gap-[14px] md:gap-[18px] lg:grid-cols-4">
        <Card>
          <CardEyebrow>Racha</CardEyebrow>
          <p className="text-[34px] font-extrabold leading-none text-accent">{data.streakDays}</p>
          <p className="mt-1 text-[13px] text-body">días seguidos</p>
        </Card>

        <WaterCard glasses={data.water.glasses} goal={data.water.goalGlasses} onAdd={addWater} />

        <Link href="/plan" className="col-span-2">
          <Card interactive className="h-full">
            <CardEyebrow>Tu plan de hoy</CardEyebrow>
            {data.plan ? (
              <>
                <p className="text-[26px] font-extrabold text-ink">
                  {data.plan.kcal.toLocaleString("es-MX")}
                  <span className="ml-1 text-[15px] font-bold text-body">kcal</span>
                </p>
                <p className="mt-1 text-[14px] text-body">
                  {data.plan.carbsG} g C · {data.plan.proteinG} g P · {data.plan.fatG} g G · Keto 16:8
                </p>
              </>
            ) : (
              <p className="text-[14px] text-body">Aún no tienes plan. Ver menú →</p>
            )}
          </Card>
        </Link>
      </div>

      {/* Row 3 — hábitos */}
      <Card>
        <div className="mb-4">
          <CardEyebrow>Hábitos de hoy</CardEyebrow>
          <p className="text-[17px] font-extrabold text-ink">
            {doneCount} de {data.habits.length} cumplidos
          </p>
        </div>
        {data.habits.length === 0 ? (
          <p className="text-[14px] text-body">
            No tienes hábitos activos.{" "}
            <Link href="/habitos" className="font-bold text-primary">Agrégalos aquí.</Link>
          </p>
        ) : (
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {data.habits.map((h) => (
              <li key={h.id} className="flex items-center gap-3 rounded-field border border-border bg-bg-app px-3 py-2">
                <HabitCheck done={h.done} label={h.name} onToggle={() => toggleHabit(h.id)} />
                <span className="text-lg" aria-hidden>{h.icon}</span>
                <span className="text-[15px] font-semibold text-ink">{h.name}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function FastingCard({
  fasting,
}: {
  fasting: { protocol: string; targetHours: number; elapsedSeconds: number };
}) {
  const elapsed = useElapsed(fasting.elapsedSeconds, true);
  const target = fasting.targetHours * 3600;
  const pct = Math.min(100, (elapsed / target) * 100);
  const remaining = Math.max(0, target - elapsed);

  return (
    <div className="flex flex-col justify-between rounded-card bg-ink-deep p-[18px] text-white md:p-6">
      <div className="flex items-center justify-between">
        <p className="eyebrow !text-on-dark">Ayuno · {fasting.protocol}</p>
        <span className="text-[13px] font-bold" style={{ color: "rgb(var(--success-on-dark))" }}>
          ● Ayuno activo
        </span>
      </div>
      <div className="my-4">
        <p className="text-[40px] font-extrabold tabular-nums tracking-[-0.02em] md:text-[48px]">
          {formatHMS(elapsed)}
        </p>
        <p className="mt-1 text-[13px] text-on-dark-2">
          Faltan {formatHMS(remaining)} para tu ventana de alimentación
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
