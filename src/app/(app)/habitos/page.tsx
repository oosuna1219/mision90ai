"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { HabitCheck } from "@/components/ui/HabitCheck";
import { DashboardError, DashboardSkeleton } from "@/components/dashboard/DashboardStates";
import { cn } from "@/lib/cn";

interface HabitRow {
  id: string;
  icon: string;
  name: string;
  streak: number;
  history: boolean[]; // 14 días, el último es hoy
}

type State = "load" | "ok" | "err";

export default function HabitosPage() {
  const router = useRouter();
  const [state, setState] = useState<State>("load");
  const [habits, setHabits] = useState<HabitRow[]>([]);

  const load = useCallback(async () => {
    setState("load");
    try {
      const res = await fetch("/api/habits", { cache: "no-store" });
      if (res.status === 401) return router.push("/login");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setState("err");
      setHabits(data.habits as HabitRow[]);
      setState("ok");
    } catch {
      setState("err");
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleToday(id: string) {
    const res = await fetch(`/api/habits/${id}/log`, { method: "POST" });
    if (!res.ok) return;
    const { done } = await res.json();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const history = h.history.slice();
        const wasDone = history[history.length - 1];
        history[history.length - 1] = done;
        const streak = done ? h.streak + (wasDone ? 0 : 1) : Math.max(0, h.streak - (wasDone ? 1 : 0));
        return { ...h, history, streak };
      }),
    );
  }

  if (state === "load") return <DashboardSkeleton />;
  if (state === "err") return <DashboardError onRetry={load} />;

  if (habits.length === 0) {
    return (
      <Card className="flex flex-col items-center px-6 py-16 text-center">
        <span className="text-3xl">✅</span>
        <h2 className="mt-4 text-[20px] font-extrabold text-ink">Aún no tienes hábitos</h2>
        <p className="mt-2 max-w-[380px] text-[15px] text-body">
          Agrega tus hábitos en el onboarding o desde tu perfil para empezar a construir rachas.
        </p>
        <Link href="/onboarding" className="mt-5 rounded-field bg-primary px-5 py-3 text-[15px] font-bold text-white">
          Configurar hábitos
        </Link>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Marcar hoy */}
      <Card>
        <CardEyebrow>Marcar hoy</CardEyebrow>
        <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {habits.map((h) => {
            const doneToday = h.history[h.history.length - 1];
            return (
              <li key={h.id} className="flex items-center gap-3 rounded-field border border-border bg-bg-app px-3 py-2">
                <HabitCheck done={doneToday} label={h.name} onToggle={() => toggleToday(h.id)} />
                <span className="text-lg" aria-hidden>{h.icon}</span>
                <span className="flex-1 text-[15px] font-semibold text-ink">{h.name}</span>
                <span className="text-[15px] font-extrabold text-accent">{h.streak}🔥</span>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Rejilla de 14 días */}
      <Card>
        <CardEyebrow>Últimos 14 días</CardEyebrow>
        <div className="mt-3 overflow-x-auto">
          <div className="min-w-[520px]">
            <div className="mb-2 grid grid-cols-[150px_repeat(14,1fr)] items-center gap-1.5">
              <span />
              {Array.from({ length: 14 }).map((_, d) => (
                <span key={d} className="text-center text-[11px] font-bold text-muted">
                  {d + 1 === 14 ? "Hoy" : d + 1}
                </span>
              ))}
            </div>
            {habits.map((h) => (
              <div key={h.id} className="grid grid-cols-[150px_repeat(14,1fr)] items-center gap-1.5 py-1">
                <span className="truncate text-[13px] font-semibold text-ink">{h.icon} {h.name}</span>
                {h.history.map((done, d) => (
                  <span
                    key={d}
                    title={done ? "Cumplido" : "Sin registro"}
                    className={cn("aspect-square w-full rounded-[5px]", done ? "bg-success" : "bg-border")}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
