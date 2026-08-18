"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { DashboardData } from "@/lib/dashboard-types";
import DashboardSkeleton from "@/components/dashboard/skeleton";
import DashboardEmptyState from "@/components/dashboard/empty-state";
import DashboardErrorState from "@/components/dashboard/error-state";
import WeightCard from "@/components/dashboard/weight-card";
import FastingWaterCard from "@/components/dashboard/fasting-water-card";
import MealsCard from "@/components/dashboard/meals-card";
import WeightTrendCard from "@/components/dashboard/weight-trend-card";
import HabitsCard from "@/components/dashboard/habits-card";
import CoachTipCard from "@/components/dashboard/coach-tip-card";
import QuickLogCard from "@/components/dashboard/quick-log-card";

type LoadState = "load" | "ok" | "empty" | "err";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  // ?demo=load|empty|err fuerza un estado para QA; en producción esto
  // vendría solo del resultado real de GET /dashboard.
  const searchParams = useSearchParams();
  const demo = searchParams.get("demo");

  const [state, setState] = useState<LoadState>("load");
  const [data, setData] = useState<DashboardData | null>(null);

  const load = useCallback(async () => {
    setState("load");
    try {
      const qs = demo ? `?demo=${demo}` : "";
      // Pequeño respiro para que el esqueleto sea perceptible, como en el diseño.
      const [res] = await Promise.all([fetch(`/api/dashboard${qs}`), new Promise((r) => setTimeout(r, 350))]);
      if (!res.ok) throw new Error("request-failed");
      const json = (await res.json()) as DashboardData;
      if (json.empty) {
        setState("empty");
        return;
      }
      setData(json);
      setState("ok");
    } catch {
      setState("err");
    }
  }, [demo]);

  useEffect(() => {
    // Efecto de carga de datos estándar: `load` es async y solo llama a
    // setState tras el await del fetch, no de forma síncrona en el commit.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  if (state === "load") return <DashboardSkeleton />;
  if (state === "empty") return <DashboardEmptyState />;
  if (state === "err") return <DashboardErrorState onRetry={load} />;
  if (!data) return null;

  return (
    <div className="flex flex-col gap-3.5 tablet:gap-[18px]">
      <div className="grid grid-cols-1 items-stretch gap-3.5 desktop:grid-cols-[1.35fr_1fr] tablet:gap-[18px]">
        <WeightCard weight={data.weight} missionDay={data.user.missionDay} missionLength={data.user.missionLength} />
        <FastingWaterCard fasting={data.fasting} water={data.water} />
      </div>

      <div className="grid grid-cols-1 items-start gap-3.5 desktop:grid-cols-[1.5fr_1fr] tablet:gap-[18px]">
        <div className="flex flex-col gap-3.5 tablet:gap-[18px]">
          <MealsCard meals={data.meals} />
          <WeightTrendCard values={data.weightTrend} />
        </div>
        <div className="flex flex-col gap-3.5 tablet:gap-[18px]">
          <HabitsCard habits={data.habits} />
          <CoachTipCard tip={data.coachTip} />
          <QuickLogCard />
        </div>
      </div>
    </div>
  );
}
