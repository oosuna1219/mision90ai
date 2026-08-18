"use client";

import { useState } from "react";
import type { Habit } from "@/lib/dashboard-types";

export default function HabitsCard({ habits }: { habits: Habit[] }) {
  const [state, setState] = useState(habits);
  const done = state.filter((h) => h.done).length;

  function toggle(id: string) {
    setState((prev) => prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));
  }

  return (
    <div className="flex flex-col gap-3.5 rounded-card-lg border border-border bg-surface p-[18px] desktop:p-6">
      <h2 className="text-base font-extrabold text-ink">Hábitos de hoy</h2>
      {state.map((habit) => (
        <div key={habit.id} className="flex items-center gap-3">
          <button
            type="button"
            aria-pressed={habit.done}
            aria-label={habit.label}
            onClick={() => toggle(habit.id)}
            className={`tap-target grid h-6 w-6 flex-none place-items-center rounded-[7px] border-[1.5px] border-[#C9DCFF] text-[13px] font-extrabold text-white ${
              habit.done ? "bg-success" : "bg-transparent"
            }`}
          >
            {habit.done ? "✓" : ""}
          </button>
          <span className="text-sm font-semibold text-ink">{habit.label}</span>
        </div>
      ))}
      <div className="flex items-center justify-between border-t border-[#EDF1F7] pt-2.5">
        <span className="text-[13px] font-bold text-text-body">Completados hoy</span>
        <span className="text-[15px] font-extrabold tabular-nums text-ink">
          {done} de {state.length}
        </span>
      </div>
    </div>
  );
}
