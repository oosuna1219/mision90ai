"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";
import { DashboardError, DashboardSkeleton } from "@/components/dashboard/DashboardStates";

interface Report {
  range: string;
  kpis: Record<string, string>;
  summary: string;
}

const PERIODS = [
  { value: "week", label: "Semanal" },
  { value: "month", label: "Mensual" },
  { value: "quarter", label: "Trimestral" },
];

const KPI_DEFS: { key: string; label: string }[] = [
  { key: "lost", label: "Peso perdido" },
  { key: "avg", label: "Promedio semanal" },
  { key: "fast", label: "Cumplimiento ayuno" },
  { key: "waist", label: "Cintura" },
  { key: "days", label: "Días registrados" },
  { key: "water", label: "Agua promedio" },
  { key: "act", label: "Minutos de actividad" },
  { key: "hab", label: "Hábitos cumplidos" },
  { key: "adj", label: "Ajustes del plan" },
];

type UI = "load" | "ok" | "err";

export default function ReportesPage() {
  const router = useRouter();
  const [period, setPeriod] = useState("week");
  const [ui, setUi] = useState<UI>("load");
  const [data, setData] = useState<Report | null>(null);

  const load = useCallback(
    async (p: string) => {
      setUi("load");
      try {
        const res = await fetch(`/api/reports?period=${p}`, { cache: "no-store" });
        if (res.status === 401) return router.push("/login");
        const d = await res.json().catch(() => null);
        if (!res.ok || !d) return setUi("err");
        setData(d as Report);
        setUi("ok");
      } catch {
        setUi("err");
      }
    },
    [router],
  );

  useEffect(() => {
    load(period);
  }, [load, period]);

  return (
    <div className="flex flex-col gap-[18px]">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <CardEyebrow>Reporte</CardEyebrow>
          <Segmented
            ariaLabel="Periodo del reporte"
            value={period}
            onChange={setPeriod}
            options={PERIODS}
          />
        </div>
        {ui === "load" && <DashboardSkeleton />}
        {ui === "err" && <DashboardError onRetry={() => load(period)} />}
        {ui === "ok" && data && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {KPI_DEFS.map((k) => (
              <div key={k.key} className="rounded-card border border-border bg-bg-app p-4">
                <p className="eyebrow mb-1">{k.label}</p>
                <p className="text-[22px] font-extrabold tracking-[-0.02em] text-ink">{data.kpis[k.key] ?? "—"}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {ui === "ok" && data && (
        <Card>
          <CardEyebrow>Resumen</CardEyebrow>
          <p className="mt-2 text-[16px] leading-[1.65] text-ink">{data.summary}</p>
        </Card>
      )}
    </div>
  );
}
