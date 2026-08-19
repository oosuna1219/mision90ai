"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DashboardError, DashboardSkeleton } from "@/components/dashboard/DashboardStates";
import { formatHMS, useElapsed } from "@/lib/useElapsed";
import { cn } from "@/lib/cn";

const PROTOCOLS = [
  { n: "12:12", d: "Inicio suave", w: "20:00 → 08:00" },
  { n: "14:10", d: "Progresión", w: "20:00 → 10:00" },
  { n: "16:8", d: "Equilibrado", w: "19:00 → 11:00" },
  { n: "18:6", d: "Avanzado", w: "19:00 → 13:00" },
];

type Fasting =
  | { active: true; protocol: string; startedAt: string; targetHours: number; elapsedSeconds: number }
  | { active: false };

interface FastState {
  active: Fasting;
  selectedProtocol: string;
  weekCompliance: number;
  history: { date: string; protocol: string; completed: boolean }[];
}

type UI = "load" | "ok" | "err";

export default function AyunoPage() {
  const router = useRouter();
  const [ui, setUi] = useState<UI>("load");
  const [data, setData] = useState<FastState | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setUi("load");
    try {
      const res = await fetch("/api/fasting", { cache: "no-store" });
      if (res.status === 401) return router.push("/login");
      const json = await res.json().catch(() => null);
      if (!res.ok || !json) return setUi("err");
      setData(json as FastState);
      setUi("ok");
    } catch {
      setUi("err");
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(action: string, protocol?: string) {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/fasting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, protocol }),
      });
      if (res.ok) setData((await res.json()) as FastState);
    } finally {
      setBusy(false);
    }
  }

  if (ui === "load") return <DashboardSkeleton />;
  if (ui === "err" || !data) return <DashboardError onRetry={load} />;

  return (
    <div className="flex flex-col gap-[18px]">
      {data.active.active ? (
        <ActiveTimer
          fasting={data.active}
          busy={busy}
          onStop={() => act("stop")}
        />
      ) : (
        <div className="rounded-card bg-ink-deep p-6 text-white md:p-8">
          <p className="eyebrow !text-on-dark">Ayuno · {data.selectedProtocol}</p>
          <p className="my-3 text-[28px] font-extrabold">Ventana de alimentación</p>
          <p className="text-[14px] text-on-dark-2">
            No tienes un ayuno activo. Inicia tu protocolo {data.selectedProtocol} cuando estés listo.
          </p>
          <Button className="mt-5" onClick={() => act("start", data.selectedProtocol)} disabled={busy}>
            {busy ? "Iniciando…" : "Iniciar ayuno"}
          </Button>
        </div>
      )}

      {/* Protocolos */}
      <Card>
        <CardEyebrow>Protocolo</CardEyebrow>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PROTOCOLS.map((p) => {
            const active = data.selectedProtocol === p.n;
            return (
              <button
                key={p.n}
                onClick={() => act("protocol", p.n)}
                disabled={busy}
                aria-pressed={active}
                className={cn(
                  "rounded-card border-[1.5px] p-4 text-left transition-colors disabled:opacity-60",
                  active ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-body",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[20px] font-extrabold text-ink">{p.n}</span>
                  {active && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-white">Activo</span>
                  )}
                </div>
                <p className="mt-1 text-[14px] font-semibold text-body">{p.d}</p>
                <p className="mt-0.5 text-[13px] text-muted">{p.w}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Cumplimiento + historial */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <CardEyebrow>Esta semana</CardEyebrow>
          <span className="text-[13px] font-bold text-body">{data.weekCompliance}% cumplimiento</span>
        </div>
        {data.history.length === 0 ? (
          <p className="text-[14px] text-body">Aún no hay ayunos registrados. Inicia el primero arriba.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {data.history.map((h, i) => (
              <li key={i} className="flex items-center justify-between rounded-field border border-border bg-bg-app px-4 py-2.5">
                <span className="text-[14px] font-semibold text-ink">
                  {new Date(h.date).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "short" })} · {h.protocol}
                </span>
                <span className={cn("text-[13px] font-bold", h.completed ? "text-success" : "text-muted")}>
                  {h.completed ? "✓ Completado" : "En curso / incompleto"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function ActiveTimer({
  fasting,
  busy,
  onStop,
}: {
  fasting: { protocol: string; startedAt: string; targetHours: number; elapsedSeconds: number };
  busy: boolean;
  onStop: () => void;
}) {
  const elapsed = useElapsed(fasting.elapsedSeconds, true);
  const target = fasting.targetHours * 3600;
  const pct = Math.min(100, (elapsed / target) * 100);
  const remaining = Math.max(0, target - elapsed);

  return (
    <div className="rounded-card bg-ink-deep p-6 text-white md:p-8">
      <div className="flex items-center justify-between">
        <p className="eyebrow !text-on-dark">Ayuno · {fasting.protocol}</p>
        <span className="text-[13px] font-bold" style={{ color: "rgb(var(--success-on-dark))" }}>● Ayuno activo</span>
      </div>
      <p className="my-4 text-[52px] font-extrabold tabular-nums tracking-[-0.02em] md:text-[64px]">
        {formatHMS(elapsed)}
      </p>
      <p className="text-[14px] text-on-dark-2">
        Faltan {formatHMS(remaining)} para tu ventana de alimentación
      </p>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: "rgb(var(--success-on-dark))" }}
        />
      </div>
      <Button className="mt-5" variant="dark" onClick={onStop} disabled={busy}>
        {busy ? "Finalizando…" : "Finalizar ayuno"}
      </Button>
    </div>
  );
}
