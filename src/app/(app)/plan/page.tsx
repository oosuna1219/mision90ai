"use client";

import { useState } from "react";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

const DAYS = [
  { short: "L", name: "Lunes 18" },
  { short: "M", name: "Martes 19" },
  { short: "M", name: "Miércoles 20" },
  { short: "J", name: "Jueves 21" },
  { short: "V", name: "Viernes 22" },
  { short: "S", name: "Sábado 23" },
  { short: "D", name: "Domingo 24" },
];

// Datos del prototipo (README "Plan y menú").
const MENU = [
  { a: "3 huevos · espinaca · ½ aguacate · 150 g pollo", b: "Queso manchego 30 g · almendras 20 g", c: "200 g carne asada · ensalada · brócoli · aceite de oliva", kcal: 1594, carbs: 24, prot: 138, fat: 112 },
  { a: "Omelette de 3 huevos con champiñones · 40 g queso", b: "Nueces 20 g", c: "180 g salmón · calabacita salteada · ensalada verde", kcal: 1612, carbs: 21, prot: 129, fat: 118 },
  { a: "200 g pechuga de pollo · aguacate · espinaca", b: "Sin colación", c: "Bistec 200 g · coliflor rostizada · mantequilla", kcal: 1571, carbs: 19, prot: 145, fat: 105 },
  { a: "2 huevos · tocino 40 g · aguacate", b: "Aceitunas 10 piezas", c: "200 g camarones al ajillo · ensalada de pepino", kcal: 1583, carbs: 22, prot: 132, fat: 110 },
  { a: "Ensalada de atún con mayonesa y apio", b: "Queso panela 40 g", c: "250 g arrachera · nopales asados · guacamole", kcal: 1648, carbs: 26, prot: 141, fat: 116 },
  { a: "Huevos revueltos con chorizo · aguacate", b: "Almendras 20 g", c: "Pollo al horno con hierbas · brócoli con mantequilla", kcal: 1667, carbs: 23, prot: 136, fat: 121 },
  { a: "Café con crema · 3 huevos cocidos · aguacate", b: "Sin colación", c: "Pescado a la plancha · ensalada mixta · aceite de oliva", kcal: 1542, carbs: 20, prot: 127, fat: 109 },
];

const MEALS: { key: "a" | "b" | "c"; slot: string; time: string }[] = [
  { key: "a", slot: "Desayuno", time: "11:00" },
  { key: "b", slot: "Colación", time: "15:00" },
  { key: "c", slot: "Cena", time: "18:30" },
];

export default function PlanPage() {
  const [day, setDay] = useState(0);
  const d = MENU[day];

  return (
    <div className="flex flex-col gap-[18px]">
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardEyebrow>Plan de la semana</CardEyebrow>
            <p className="text-[17px] font-extrabold text-ink">Keto + 16:8 · semana 4</p>
          </div>
        </div>
        {/* Selector de 7 días */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {DAYS.map((dd, i) => {
            const active = day === i;
            return (
              <button
                key={i}
                onClick={() => setDay(i)}
                className={cn(
                  "flex min-w-[44px] flex-col items-center gap-0.5 rounded-field border px-3 py-2 transition-colors",
                  active
                    ? "border-ink bg-ink text-surface"
                    : "border-border bg-surface text-body hover:border-body",
                )}
              >
                <span className="text-[11px] font-bold uppercase">{dd.short}</span>
                <span className="text-[15px] font-extrabold">{dd.name.split(" ")[1]}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Comidas del día */}
      <div className="grid gap-[18px] lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-[14px]">
          {MEALS.map((m) => (
            <Card key={m.key}>
              <div className="flex items-baseline justify-between">
                <p className="text-[17px] font-extrabold text-ink">{m.slot}</p>
                <span className="text-[13px] font-bold text-muted">{m.time}</span>
              </div>
              <p className="mt-2 text-[15px] leading-[1.6] text-body">{d[m.key]}</p>
            </Card>
          ))}
        </div>

        {/* Macros del día */}
        <Card className="h-fit">
          <CardEyebrow>Total del día</CardEyebrow>
          <p className="text-[34px] font-extrabold tracking-[-0.02em] text-ink">
            {d.kcal.toLocaleString("es-MX")}
            <span className="ml-1 text-[16px] font-bold text-body">kcal</span>
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Macro label="Carbos" value={d.carbs} />
            <Macro label="Proteína" value={d.prot} />
            <Macro label="Grasa" value={d.fat} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Macro({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card border border-border bg-bg-app p-3 text-center">
      <p className="text-[20px] font-extrabold text-ink">{value}<span className="text-[13px] font-bold text-body">g</span></p>
      <p className="eyebrow mt-0.5">{label}</p>
    </div>
  );
}
