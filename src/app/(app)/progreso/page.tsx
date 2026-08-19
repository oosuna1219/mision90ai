"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";
import { WeightSparkline } from "@/components/dashboard/WeightSparkline";
import { IconCamera } from "@/components/icons";
import {
  DashboardEmpty,
  DashboardError,
  DashboardSkeleton,
} from "@/components/dashboard/DashboardStates";
import { cn } from "@/lib/cn";

interface Weight { date: string; weightKg: number }
interface Measurement {
  date: string;
  waistCm: number | null; hipCm: number | null; chestCm: number | null;
  armCm: number | null; thighCm: number | null; neckCm: number | null;
}

const RANGES = [
  { label: "7 d", days: 7 },
  { label: "30 d", days: 30 },
  { label: "3 m", days: 90 },
  { label: "6 m", days: 180 },
  { label: "1 año", days: 365 },
  { label: "Todo", days: Infinity },
];

const MEASURE_FIELDS: { key: keyof Measurement; name: string }[] = [
  { key: "waistCm", name: "Cintura" },
  { key: "hipCm", name: "Cadera" },
  { key: "chestCm", name: "Pecho" },
  { key: "armCm", name: "Brazo" },
  { key: "thighCm", name: "Muslo" },
  { key: "neckCm", name: "Cuello" },
];

type UI = "load" | "ok" | "empty" | "err";

export default function ProgresoPage() {
  const router = useRouter();
  const [ui, setUi] = useState<UI>("load");
  const [weights, setWeights] = useState<Weight[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [range, setRange] = useState(2);

  const load = useCallback(async () => {
    setUi("load");
    try {
      const res = await fetch("/api/progress", { cache: "no-store" });
      if (res.status === 401) return router.push("/login");
      const d = await res.json().catch(() => ({}));
      if (d.empty) return setUi("empty");
      if (!res.ok || !d.weights) return setUi("err");
      setWeights(d.weights);
      setMeasurements(d.measurements ?? []);
      setUi("ok");
    } catch {
      setUi("err");
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const rangeData = useMemo(() => {
    const days = RANGES[range].days;
    const cutoff = days === Infinity ? 0 : Date.now() - days * 864e5;
    const w = weights.filter((x) => new Date(x.date).getTime() >= cutoff);
    const series = w.map((x) => x.weightKg);
    const m = measurements.filter((x) => new Date(x.date).getTime() >= cutoff);

    const fmt = (n: number, unit: string) => `${n > 0 ? "+" : ""}${n.toFixed(1)} ${unit}`;
    let lost = "—", avg = "—", waist = "—";
    if (w.length >= 2) {
      const delta = w[w.length - 1].weightKg - w[0].weightKg;
      lost = fmt(delta, "kg");
      const spanDays = (new Date(w[w.length - 1].date).getTime() - new Date(w[0].date).getTime()) / 864e5;
      const weeks = Math.max(1, spanDays / 7);
      avg = fmt(delta / weeks, "kg");
    }
    const withWaist = m.filter((x) => x.waistCm != null);
    if (withWaist.length >= 2) {
      waist = fmt((withWaist[withWaist.length - 1].waistCm! - withWaist[0].waistCm!), "cm");
    }
    return { series, lost, avg, logs: String(w.length), waist };
  }, [weights, measurements, range]);

  const measureRows = useMemo(() => {
    if (measurements.length === 0) return [];
    const first = measurements[0];
    const last = measurements[measurements.length - 1];
    return MEASURE_FIELDS.map((f) => {
      const start = first[f.key] as number | null;
      const now = last[f.key] as number | null;
      const delta = start != null && now != null ? now - start : null;
      return { name: f.name, start, now, delta };
    }).filter((r) => r.now != null);
  }, [measurements]);

  if (ui === "load") return <DashboardSkeleton />;
  if (ui === "empty") return <DashboardEmpty />;
  if (ui === "err") return <DashboardError onRetry={load} />;

  const r = rangeData;

  return (
    <div className="flex flex-col gap-[18px]">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <CardEyebrow>Evolución del peso</CardEyebrow>
          <Segmented
            ariaLabel="Rango de tiempo"
            value={range}
            onChange={setRange}
            options={RANGES.map((rr, i) => ({ value: i, label: rr.label }))}
          />
        </div>
        <WeightSparkline
          series={r.series.length > 1 ? r.series : [r.series[0] ?? 0, r.series[0] ?? 0]}
          height={200}
        />
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi label="Peso perdido" value={r.lost} />
          <Kpi label="Promedio semanal" value={r.avg} />
          <Kpi label="Registros" value={r.logs} />
          <Kpi label="Cintura" value={r.waist} />
        </div>
      </Card>

      <Card>
        <CardEyebrow>Medidas corporales (cm)</CardEyebrow>
        {measureRows.length === 0 ? (
          <p className="mt-3 text-[14px] text-body">
            Aún no registras medidas. Cuando agregues cintura, cadera, etc., verás tu cambio aquí.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-[14px]">
              <thead>
                <tr className="text-left text-[12px] font-bold uppercase tracking-[0.06em] text-muted">
                  <th className="py-2 pr-4 font-bold">Medida</th>
                  <th className="py-2 pr-4 font-bold">Inicial</th>
                  <th className="py-2 pr-4 font-bold">Actual</th>
                  <th className="py-2 font-bold">Cambio</th>
                </tr>
              </thead>
              <tbody>
                {measureRows.map((m) => (
                  <tr key={m.name} className="border-t border-border transition-colors hover:bg-bg-app">
                    <td className="py-3 pr-4 font-semibold text-ink">{m.name}</td>
                    <td className="py-3 pr-4 text-body">{m.start ?? "—"}</td>
                    <td className="py-3 pr-4 font-bold text-ink">{m.now}</td>
                    <td className="py-3">
                      {m.delta != null ? (
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[13px] font-bold",
                            m.delta <= 0 ? "bg-success/15 text-success" : "bg-accent/15 text-accent",
                          )}
                        >
                          {m.delta > 0 ? "+" : ""}
                          {m.delta} cm
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <CardEyebrow>Fotos de progreso</CardEyebrow>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[1, 2, 3, 4].map((w) => (
            <button
              key={w}
              className="group flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-card border-[1.5px] border-dashed border-border-input bg-bg-app text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <IconCamera className="h-7 w-7" />
              <span className="text-[13px] font-bold">Semana {w}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[13px] text-body">
          La subida de fotos (almacenamiento privado) llega en la siguiente fase.
        </p>
      </Card>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-border bg-bg-app p-4">
      <p className="eyebrow mb-1">{label}</p>
      <p className="text-[22px] font-extrabold tracking-[-0.02em] text-ink">{value}</p>
    </div>
  );
}
