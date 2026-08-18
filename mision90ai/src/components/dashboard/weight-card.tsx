import type { DashboardData } from "@/lib/dashboard-types";

function fmt(n: number, digits = 1) {
  return n.toLocaleString("es-MX", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export default function WeightCard({ weight, missionDay, missionLength }: {
  weight: DashboardData["weight"];
  missionDay: number;
  missionLength: number;
}) {
  const range = weight.startKg - weight.goalKg;
  const lost = weight.startKg - weight.currentKg;
  const pct = range > 0 ? Math.min(100, Math.max(0, (lost / range) * 100)) : 0;

  return (
    <div className="flex flex-col gap-4 rounded-card-lg border border-border bg-surface p-[18px] desktop:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-extrabold uppercase tracking-[.1em] text-text-muted">Peso actual</span>
          <span className="text-[44px] font-extrabold leading-none tracking-[-.04em] tabular-nums text-ink desktop:text-[54px]">
            {fmt(weight.currentKg)}
            <span className="text-lg font-bold text-text-body"> kg</span>
          </span>
        </div>
        <div className="flex gap-[9px]">
          <span className="rounded-full bg-[#EAF8EF] px-[13px] py-2 text-[13px] font-extrabold tabular-nums text-[#1E8E4E]">
            {fmt(weight.deltaKg)} kg
          </span>
          <span className="rounded-full bg-[#FEF3E2] px-[13px] py-2 text-[13px] font-extrabold text-[#B45309]">
            Racha {weight.streakDays} d
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[9px]">
        <div className="h-3 rounded-full bg-[#EDF1F7]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#27AE60,#2563EB)]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-bold tabular-nums text-text-muted">
          <span>{fmt(weight.startKg, 0)} kg · inicio</span>
          <span className="text-success">{fmt(pct, 1)}% completado</span>
          <span>{fmt(weight.goalKg, 0)} kg · meta</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-[#EDF1F7] pt-1 desktop:grid-cols-4">
        {[
          { label: "Cintura", value: `${weight.waistCm} cm` },
          { label: "IMC", value: fmt(weight.bmi) },
          { label: "Promedio", value: `${fmt(weight.weeklyAvgKg)} kg/sem`, tone: "text-[#1E8E4E]" },
          { label: "Día", value: `${missionDay} / ${missionLength}` },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 pt-3">
            <span className="text-[11px] font-bold uppercase tracking-[.08em] text-text-muted">{stat.label}</span>
            <span className={`text-[19px] font-extrabold tabular-nums ${stat.tone ?? "text-ink"}`}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
