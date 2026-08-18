// Sample data — README: usuario "Oswal Ramírez", día 24 de 90, domingo 17 de
// agosto. In production every value here comes from the API.

import type { DashboardData, User } from "./types";

export const mockUser: User = {
  id: "u_oswal",
  name: "Oswal Ramírez",
  email: "oswal@ejemplo.com",
  whatsapp: "+52 55 0000 0000",
  locale: "es-MX",
  plan: "premium",
  missionStartDate: "2026-07-25",
  missionDay: 24,
  level: 3,
  points: 1240,
  createdAt: "2026-07-25",
};

export const mockDashboard: DashboardData = {
  date: "Domingo 17 de agosto",
  missionDay: 24,
  weightKg: 96.4,
  weightDeltaKg: -0.6,
  streakDays: 11,
  fasting: {
    active: true,
    protocol: "16:8",
    // Started 19:00 the previous evening; ~13h elapsed toward a 16h target.
    startedAt: "2026-08-16T19:00:00",
    targetHours: 16,
    elapsedSeconds: 13 * 3600 + 12 * 60,
  },
  water: { glasses: 6, goalGlasses: 12 },
  habits: [
    { id: "h1", name: "Agua 3 L", icon: "💧", done: true },
    { id: "h2", name: "10 000 pasos", icon: "👟", done: true },
    { id: "h3", name: "Sin azúcar", icon: "🚫", done: false },
    { id: "h4", name: "Dormir 7 h", icon: "😴", done: true },
    { id: "h5", name: "Ayuno 16:8", icon: "⏳", done: true },
    { id: "h6", name: "Registrar peso", icon: "⚖️", done: false },
  ],
  nextMeal: {
    slot: "Cena",
    title: "200 g carne asada · ensalada · brócoli · aceite de oliva",
    kcal: 640,
    timeLabel: "19:00",
  },
  // 24 días de peso descendente, con ligeros platós — para la mini-gráfica.
  weightSeries: [
    102.4, 102.1, 101.9, 101.4, 101.5, 101.0, 100.6, 100.7, 100.2, 99.8, 99.9,
    99.4, 99.0, 98.7, 98.8, 98.3, 98.0, 97.7, 97.8, 97.4, 97.1, 96.9, 97.0, 96.4,
  ],
};
