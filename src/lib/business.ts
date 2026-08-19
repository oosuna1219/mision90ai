// Business logic — README "Lógica de negocio". Pure functions, unit-testable,
// shared by client and (eventually) server. No UI here.

import type { ActivityLevel, Sex } from "./types";

const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  1: 1.2, // sedentario
  2: 1.375, // ligero
  3: 1.55, // moderado
  4: 1.725, // alto
  5: 1.9, // muy alto
};

/** TMB (Mifflin-St Jeor). */
export function bmr(sex: Sex, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

/** Gasto energético total. */
export function tdee(sex: Sex, weightKg: number, heightCm: number, age: number, activity: ActivityLevel): number {
  return bmr(sex, weightKg, heightCm, age) * ACTIVITY_FACTOR[activity];
}

export interface Macros {
  kcal: number;
  carbsG: number;
  proteinG: number;
  fatG: number;
}

/**
 * Keto macro target: 20% deficit off TDEE, floor 1200 (women) / 1500 (men),
 * protein 1.6 g/kg of goal weight, net carbs <= 25 g/day, rest of kcal to fat.
 * kcal rounded to the nearest 10.
 */
export function ketoMacros(
  sex: Sex,
  weightKg: number,
  heightCm: number,
  age: number,
  activity: ActivityLevel,
  goalWeightKg: number,
): Macros {
  const floor = sex === "female" ? 1200 : 1500;
  const target = Math.max(floor, tdee(sex, weightKg, heightCm, age, activity) * 0.8);
  const kcal = Math.round(target / 10) * 10;

  const carbsG = 25;
  const proteinG = Math.round(1.6 * goalWeightKg);
  const remainingKcal = kcal - carbsG * 4 - proteinG * 4;
  const fatG = Math.max(0, Math.round(remainingKcal / 9));

  return { kcal, carbsG, proteinG, fatG };
}

export type BmiCategory =
  | "bajo"
  | "normal"
  | "sobrepeso"
  | "obesidad I"
  | "obesidad II"
  | "obesidad III";

export function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return weightKg / (m * m);
}

export function bmiCategory(value: number): BmiCategory {
  if (value < 18.5) return "bajo";
  if (value < 25) return "normal";
  if (value < 30) return "sobrepeso";
  if (value < 35) return "obesidad I";
  if (value < 40) return "obesidad II";
  return "obesidad III";
}

/** Meta de agua en litros: 35 ml/kg, +500 ml si hubo actividad. */
export function waterGoalLiters(weightKg: number, activeToday: boolean): number {
  return (35 * weightKg + (activeToday ? 500 : 0)) / 1000;
}

/** Meta de agua en vasos de 250 ml (redondeada al vaso más cercano). */
export function waterGoalGlasses(weightKg: number, activeToday: boolean): number {
  return Math.round(waterGoalLiters(weightKg, activeToday) / 0.25);
}

/** Porcentaje de la barra de agua del dashboard. */
export function waterPercent(glasses: number, goalGlasses: number): number {
  if (goalGlasses <= 0) return 0;
  return Math.min(100, (glasses / goalGlasses) * 100);
}

const PROTOCOL_HOURS: Record<string, number> = {
  "12:12": 12,
  "14:10": 14,
  "16:8": 16,
  "18:6": 18,
};

export function protocolTargetHours(protocol: string): number {
  return PROTOCOL_HOURS[protocol] ?? 16;
}

/** Una sesión cuenta como completada al 95% de las horas objetivo. */
export function fastingCompleted(elapsedHours: number, targetHours: number): boolean {
  return elapsedHours >= targetHours * 0.95;
}

/** Cumplimiento semanal de ayuno, entero. */
export function fastingCompliance(completed: number, planned: number): number {
  if (planned <= 0) return 0;
  return Math.round((completed / planned) * 100);
}

/**
 * Proyección de peso: regresión lineal simple sobre los últimos 14 días
 * (>= 4 registros), pendiente en kg/semana. Devuelve null si no hay datos.
 */
export function weightProjection(
  logs: { date: string; weightKg: number }[],
  weeksRemaining: number,
  goalWeightKg: number,
): { slopePerWeek: number; projected: number } | null {
  const cutoff = Date.now() - 14 * 864e5;
  const recent = logs
    .filter((l) => new Date(l.date).getTime() >= cutoff)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  if (recent.length < 4) return null;

  const t0 = new Date(recent[0].date).getTime();
  const xs = recent.map((l) => (new Date(l.date).getTime() - t0) / 864e5); // días
  const ys = recent.map((l) => l.weightKg);
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxy = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const sxx = xs.reduce((a, x) => a + x * x, 0);
  const denom = n * sxx - sx * sx;
  if (denom === 0) return null;

  const slopePerDay = (n * sxy - sx * sy) / denom;
  const slopePerWeek = slopePerDay * 7;

  const current = ys[ys.length - 1];
  let projected = current + slopePerWeek * weeksRemaining;
  // Acotada al peso objetivo (no proyectar por debajo de la meta si se baja).
  projected = slopePerWeek < 0 ? Math.max(goalWeightKg, projected) : projected;

  return { slopePerWeek, projected };
}

const LEVEL_THRESHOLDS = [0, 500, 1000, 2000, 3500];

/** Nivel a partir de puntos (README: +2000 por nivel tras el 5). */
export function levelForPoints(points: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (points >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  let threshold = 3500;
  while (points >= threshold + 2000) {
    threshold += 2000;
    level += 1;
  }
  return level;
}

export function pointsToNextLevel(points: number): { current: number; next: number; pct: number } {
  const thresholds = [...LEVEL_THRESHOLDS];
  let next = thresholds[thresholds.length - 1];
  while (points >= next) next += 2000;
  const current = next - (next <= 3500 ? next - (thresholds.filter((t) => t <= points).pop() ?? 0) : 2000);
  const span = next - current;
  const pct = span > 0 ? Math.min(100, ((points - current) / span) * 100) : 100;
  return { current, next, pct };
}

/**
 * Racha: días naturales consecutivos con al menos un registro (peso o hábito).
 * Cuenta hacia atrás desde hoy; si el registro más reciente no es hoy ni ayer,
 * la racha es 0. (TZ: usa la fecha local del servidor; afinar por usuario luego.)
 */
export function computeStreak(dates: Date[]): number {
  if (!dates.length) return 0;
  const key = (d: Date) => {
    const x = new Date(d);
    return `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`;
  };
  const set = new Set(dates.map(key));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // La racha solo cuenta si hay registro hoy o ayer.
  if (!set.has(key(today)) && !set.has(key(yesterday))) return 0;

  let streak = 0;
  const cursor = new Date(today);
  // Si no hay registro hoy pero sí ayer, empieza desde ayer.
  if (!set.has(key(today))) cursor.setDate(cursor.getDate() - 1);
  while (set.has(key(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export const POINTS = {
  weightLog: 10,
  habitDone: 5,
  fastingCompleted: 15,
  fullWeek: 50,
} as const;
