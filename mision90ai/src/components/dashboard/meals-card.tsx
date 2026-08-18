"use client";

import Link from "next/link";
import { useState } from "react";
import type { Meal } from "@/lib/dashboard-types";

export default function MealsCard({ meals }: { meals: Meal[] }) {
  const [logged, setLogged] = useState(() => meals.map((m) => m.logged));

  return (
    <div className="flex flex-col gap-4 rounded-card-lg border border-border bg-surface p-[18px] desktop:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-extrabold text-ink">Comidas de hoy</h2>
        <Link href="/plan" className="text-[13px] font-bold text-primary hover:text-primary-hover">
          Ver el menú completo
        </Link>
      </div>

      {meals.map((meal, i) => (
        <div key={meal.time} className="flex items-center gap-3.5 rounded-2xl border border-border bg-bg-app p-3.5">
          <span className="grid h-[52px] w-[52px] flex-none place-items-center rounded-xl bg-primary-soft text-xs font-extrabold tabular-nums text-primary">
            {meal.time}
          </span>
          <div className="flex min-w-0 flex-col gap-[3px]">
            <span className="text-sm font-bold text-ink">{meal.items}</span>
            <span className="text-xs tabular-nums text-text-body">
              {meal.kcal} kcal · {meal.carbsG} g carbos · {meal.proteinG} g proteína
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              setLogged((prev) => {
                const next = [...prev];
                next[i] = !next[i];
                return next;
              })
            }
            className={`ml-auto flex-none rounded-[9px] px-[13px] py-[9px] text-xs font-bold ${
              logged[i] ? "bg-ink text-white" : "border border-border-input text-ink"
            }`}
          >
            {logged[i] ? "Registrado" : "Registrar"}
          </button>
        </div>
      ))}
    </div>
  );
}
