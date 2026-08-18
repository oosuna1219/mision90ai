"use client";

import { useState } from "react";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";
import { WeightSparkline } from "@/components/dashboard/WeightSparkline";
import { IconCamera } from "@/components/icons";
import { cn } from "@/lib/cn";

// Cada rango tiene su curva y su bloque de 4 KPIs (README "Mi progreso").
const RANGES = [
  { label: "7 d", drop: "−1.4 kg", avg: "−1.4 kg", logs: "6", waist: "−1.5 cm",
    series: [98.0, 97.7, 97.8, 97.4, 97.1, 96.9, 96.4] },
  { label: "30 d", drop: "−4.6 kg", avg: "−0.9 kg", logs: "18", waist: "−4.0 cm",
    series: [101.0, 100.4, 99.8, 99.1, 98.6, 98.0, 97.6, 97.1, 96.8, 96.4] },
  { label: "3 m", drop: "−11.2 kg", avg: "−0.8 kg", logs: "47", waist: "−13.0 cm",
    series: [107.6, 105.9, 104.2, 102.5, 101.0, 99.6, 98.3, 97.2, 96.4] },
  { label: "6 m", drop: "−11.2 kg", avg: "−0.5 kg", logs: "47", waist: "−13.0 cm",
    series: [108.4, 106.6, 104.6, 102.6, 100.8, 99.2, 98.0, 97.0, 96.4] },
  { label: "1 año", drop: "−11.2 kg", avg: "−0.3 kg", logs: "47", waist: "−13.0 cm",
    series: [108.9, 107.2, 105.1, 103.0, 101.1, 99.4, 98.0, 97.0, 96.4] },
  { label: "Todo", drop: "−11.2 kg", avg: "−0.8 kg", logs: "47", waist: "−13.0 cm",
    series: [107.6, 105.2, 103.1, 101.2, 99.5, 98.1, 97.0, 96.4] },
];

const MEASURES = [
  { name: "Cintura", start: 118, now: 105 },
  { name: "Cadera", start: 122, now: 112 },
  { name: "Pecho", start: 118, now: 110 },
  { name: "Brazo", start: 40, now: 37 },
  { name: "Muslo", start: 68, now: 63 },
  { name: "Cuello", start: 45, now: 42 },
];

const PHOTO_WEEKS = [1, 2, 3, 4];

export default function ProgresoPage() {
  const [range, setRange] = useState(2); // "3 m" por defecto
  const r = RANGES[range];

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Gráfica + rangos */}
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
        <WeightSparkline series={r.series} height={200} />
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi label="Peso perdido" value={r.drop} />
          <Kpi label="Promedio semanal" value={r.avg} />
          <Kpi label="Registros" value={r.logs} />
          <Kpi label="Cintura" value={r.waist} />
        </div>
      </Card>

      {/* Tabla de medidas */}
      <Card>
        <CardEyebrow>Medidas corporales (cm)</CardEyebrow>
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
              {MEASURES.map((m) => {
                const delta = m.now - m.start;
                return (
                  <tr key={m.name} className="border-t border-border transition-colors hover:bg-bg-app">
                    <td className="py-3 pr-4 font-semibold text-ink">{m.name}</td>
                    <td className="py-3 pr-4 text-body">{m.start}</td>
                    <td className="py-3 pr-4 font-bold text-ink">{m.now}</td>
                    <td className="py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[13px] font-bold",
                          delta <= 0 ? "bg-success/15 text-success" : "bg-accent/15 text-accent",
                        )}
                      >
                        {delta > 0 ? "+" : ""}
                        {delta} cm
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Galería de fotos */}
      <Card>
        <CardEyebrow>Fotos de progreso</CardEyebrow>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PHOTO_WEEKS.map((w) => (
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
          Sube una foto por semana (frente, lado y espalda). Se guardan privadas, nunca públicas.
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
