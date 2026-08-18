import { NextRequest, NextResponse } from "next/server";
import type { DashboardData } from "@/lib/dashboard-types";

// Mock de GET /dashboard (README §Endpoints sugeridos): una sola respuesta
// con todo lo del día. `?demo=` permite forzar un estado para QA
// (load se simula en el cliente con un pequeño delay).
export async function GET(req: NextRequest) {
  const demo = req.nextUrl.searchParams.get("demo");

  if (demo === "err") {
    return NextResponse.json({ message: "No se pudo conectar con el servidor." }, { status: 503 });
  }

  if (demo === "empty") {
    const empty: Pick<DashboardData, "empty"> = { empty: true };
    return NextResponse.json(empty);
  }

  const fastTargetHours = 16;
  const elapsedMs = (14 * 60 + 37) * 60 * 1000; // 14h37 transcurridas, como en el diseño de referencia
  const fastStartedAt = new Date(Date.now() - elapsedMs).toISOString();

  const data: DashboardData = {
    empty: false,
    user: { name: "Oswal Ramírez", missionDay: 24, missionLength: 90 },
    weight: {
      currentKg: 117.8,
      startKg: 129.0,
      goalKg: 90.0,
      deltaKg: -11.2,
      streakDays: 12,
      waistCm: 119,
      bmi: 39.8,
      weeklyAvgKg: -0.8,
    },
    fasting: {
      protocol: "16:8",
      targetHours: fastTargetHours,
      startedAt: fastStartedAt,
      windowLabel: "19:00 → 11:00",
    },
    water: { glasses: 6, targetGlasses: 12 },
    meals: [
      {
        time: "11:00",
        items: "3 huevos · espinaca · ½ aguacate · 150 g pollo",
        kcal: 612,
        carbsG: 8,
        proteinG: 48,
        logged: true,
      },
      {
        time: "15:00",
        items: "Queso manchego 30 g · almendras 20 g",
        kcal: 248,
        carbsG: 3,
        proteinG: 12,
        logged: false,
      },
      {
        time: "18:30",
        items: "200 g carne asada · ensalada · brócoli",
        kcal: 734,
        carbsG: 11,
        proteinG: 62,
        logged: false,
      },
    ],
    habits: [
      { id: "water", label: "Beber 3 L de agua", done: true },
      { id: "fast", label: "Respetar la ventana de ayuno", done: true },
      { id: "walk", label: "Caminar 30 minutos", done: false },
      { id: "sleep", label: "Dormir 7 horas", done: true },
    ],
    weightTrend: [129.0, 126.4, 124.1, 121.8, 119.9, 118.6, 117.8],
    coachTip:
      "Tu cintura bajó 1.5 cm mientras el peso se mantuvo. Es retención de agua, no un plató. Sube el agua a 3 L esta semana.",
  };

  return NextResponse.json(data);
}
