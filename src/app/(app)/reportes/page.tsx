"use client";

import { useState } from "react";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";

// Datos del prototipo (README "Reportes"): 3 periodos, 9 KPIs + resumen escrito.
const PERIODS = [
  {
    label: "Semanal",
    range: "Semana 4 · 11 al 17 de agosto",
    kpis: { lost: "−1.4 kg", avg: "−1.4 kg", fast: "86%", waist: "−1.5 cm", days: "6 / 7", water: "2.4 L", act: "148 min", hab: "31 / 42", adj: "1" },
    summary:
      "Semana estable. El peso bajó 1.4 kg y la cintura 1.5 cm. El cumplimiento de ayuno subió de 71% a 86%. El agua sigue por debajo de la meta de 3 L.",
  },
  {
    label: "Mensual",
    range: "Agosto 2026 · del 1 al 17",
    kpis: { lost: "−4.6 kg", avg: "−0.9 kg", fast: "81%", waist: "−4.0 cm", days: "24 / 30", water: "2.2 L", act: "512 min", hab: "118 / 180", adj: "3" },
    summary:
      "Buen mes. La pérdida se mantuvo cerca del objetivo de 1 kg por semana, con dos platós cortos que se resolvieron subiendo el agua y bajando el sodio.",
  },
  {
    label: "Trimestral",
    range: "Trimestre · junio a agosto de 2026",
    kpis: { lost: "−11.2 kg", avg: "−0.8 kg", fast: "78%", waist: "−13.0 cm", days: "71 / 90", water: "2.1 L", act: "1,640 min", hab: "312 / 540", adj: "7" },
    summary:
      "Progreso sostenido en los tres meses: 8.7% del peso inicial. La cintura respondió más rápido que la balanza, señal de recomposición corporal.",
  },
];

const KPI_DEFS: { key: keyof (typeof PERIODS)[0]["kpis"]; label: string }[] = [
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

export default function ReportesPage() {
  const [period, setPeriod] = useState(0);
  const p = PERIODS[period];

  return (
    <div className="flex flex-col gap-[18px]">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardEyebrow>Reporte</CardEyebrow>
            <p className="text-[17px] font-extrabold text-ink">{p.range}</p>
          </div>
          <Segmented
            ariaLabel="Periodo del reporte"
            value={period}
            onChange={setPeriod}
            options={PERIODS.map((pp, i) => ({ value: i, label: pp.label }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {KPI_DEFS.map((k) => (
            <div key={k.key} className="rounded-card border border-border bg-bg-app p-4">
              <p className="eyebrow mb-1">{k.label}</p>
              <p className="text-[22px] font-extrabold tracking-[-0.02em] text-ink">
                {p.kpis[k.key]}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Resumen escrito (lo produce el modelo con los KPIs del periodo) */}
      <Card>
        <CardEyebrow>Resumen del coach</CardEyebrow>
        <p className="mt-2 text-[16px] leading-[1.65] text-ink">{p.summary}</p>
      </Card>
    </div>
  );
}
