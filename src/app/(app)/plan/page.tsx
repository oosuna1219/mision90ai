"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardEyebrow } from "@/components/ui/Card";
import {
  DashboardEmpty,
  DashboardError,
  DashboardSkeleton,
} from "@/components/dashboard/DashboardStates";
import { cn } from "@/lib/cn";

interface Plan {
  week: number; dietType: string; protocol: string;
  kcal: number; carbsG: number; proteinG: number; fatG: number; waterTargetL: number;
}

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Menú de ejemplo (keto) mientras se genera el menú personalizado por día.
const SAMPLE_MEALS = [
  { slot: "Desayuno", time: "11:00", items: "3 huevos · espinaca · ½ aguacate · 150 g pollo" },
  { slot: "Colación", time: "15:00", items: "Queso manchego 30 g · almendras 20 g" },
  { slot: "Cena", time: "18:30", items: "200 g carne asada · ensalada · brócoli · aceite de oliva" },
];

type UI = "load" | "ok" | "empty" | "err";

export default function PlanPage() {
  const router = useRouter();
  const [ui, setUi] = useState<UI>("load");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [day, setDay] = useState(0);

  const load = useCallback(async () => {
    setUi("load");
    try {
      const res = await fetch("/api/plan", { cache: "no-store" });
      if (res.status === 401) return router.push("/login");
      const d = await res.json().catch(() => ({}));
      if (d.empty) return setUi("empty");
      if (!res.ok || !d.plan) return setUi("err");
      setPlan(d.plan);
      setUi("ok");
    } catch {
      setUi("err");
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  if (ui === "load") return <DashboardSkeleton />;
  if (ui === "empty") return <DashboardEmpty />;
  if (ui === "err" || !plan) return <DashboardError onRetry={load} />;

  return (
    <div className="flex flex-col gap-[18px]">
      <Card>
        <CardEyebrow>Plan de la semana</CardEyebrow>
        <p className="text-[17px] font-extrabold capitalize text-ink">
          {plan.dietType} + {plan.protocol} · semana {plan.week}
        </p>
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
          {DAYS.map((d, i) => (
            <button
              key={i}
              onClick={() => setDay(i)}
              className={cn(
                "min-w-[52px] rounded-field border px-3 py-2 text-[13px] font-bold transition-colors",
                day === i ? "border-ink bg-ink text-surface" : "border-border bg-surface text-body hover:border-body",
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-[18px] lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-[14px]">
          {SAMPLE_MEALS.map((m) => (
            <Card key={m.slot}>
              <div className="flex items-baseline justify-between">
                <p className="text-[17px] font-extrabold text-ink">{m.slot}</p>
                <span className="text-[13px] font-bold text-muted">{m.time}</span>
              </div>
              <p className="mt-2 text-[15px] leading-[1.6] text-body">{m.items}</p>
            </Card>
          ))}
          <p className="text-[13px] text-body">
            Menú de ejemplo. La generación del menú personalizado por día (con la IA) llega pronto.
          </p>
        </div>

        <Card className="h-fit">
          <CardEyebrow>Objetivo diario</CardEyebrow>
          <p className="text-[34px] font-extrabold tracking-[-0.02em] text-ink">
            {plan.kcal.toLocaleString("es-MX")}
            <span className="ml-1 text-[16px] font-bold text-body">kcal</span>
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Macro label="Carbos" value={plan.carbsG} />
            <Macro label="Proteína" value={plan.proteinG} />
            <Macro label="Grasa" value={plan.fatG} />
          </div>
          <p className="mt-4 text-[13px] text-body">Meta de agua: {plan.waterTargetL.toFixed(1)} L/día</p>
        </Card>
      </div>

      <p className="text-center text-[12px] text-muted">
        <Link href="/coach" className="font-bold text-primary">Pídele al coach</Link> que ajuste tu menú o arme tu lista de compras.
      </p>
    </div>
  );
}

function Macro({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card border border-border bg-bg-app p-3 text-center">
      <p className="text-[20px] font-extrabold text-ink">{value}<span className="text-[13px] font-bold text-body">g</span></p>
      <p className="eyebrow mt-0.5">{label}</p>
    </div>
  );
}
