// Data models — mirror of README "Modelos de datos". These are the shapes the
// API is expected to return; the UI is built against them and fed mock data
// from lib/mock.ts until the backend exists.

export type Plan = "free" | "premium";
export type Sex = "male" | "female";
export type Units = "metric" | "imperial";
export type ActivityLevel = 1 | 2 | 3 | 4 | 5;
export type FastingProtocol = "12:12" | "14:10" | "16:8" | "18:6";

export interface User {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  locale: string;
  plan: Plan;
  missionStartDate: string;
  missionDay: number;
  level: number;
  points: number;
  createdAt: string;
}

export interface Profile {
  userId: string;
  sex: Sex;
  birthdate: string;
  heightCm: number;
  activityLevel: ActivityLevel;
  conditions: string[];
  allergies: string[];
  preferences: string[];
  goalWeightKg: number;
  fastingExperience: string;
  units: Units;
}

export interface WeightLog {
  id: string;
  userId: string;
  date: string;
  weightKg: number;
  bodyFatPct?: number;
  source: "manual" | "scale";
}

export interface Measurement {
  id: string;
  userId: string;
  date: string;
  waistCm: number;
  hipCm: number;
  chestCm: number;
  armCm: number;
  thighCm: number;
  neckCm: number;
}

export interface Meal {
  slot: "breakfast" | "snack" | "dinner";
  items: { name: string; grams: number }[];
  kcal: number;
  carbsG: number;
  proteinG: number;
  fatG: number;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  icon: string;
  active: boolean;
  targetPerWeek: number;
}

// Dashboard aggregate — README specifies GET /dashboard returns all of this in
// one call so the day view never loads in cascade.
export interface DashboardData {
  date: string;
  missionDay: number;
  weightKg: number;
  weightDeltaKg: number;
  streakDays: number;
  fasting: {
    active: boolean;
    protocol: FastingProtocol;
    startedAt: string;
    targetHours: number;
    elapsedSeconds: number;
  };
  water: { glasses: number; goalGlasses: number };
  habits: { id: string; name: string; icon: string; done: boolean }[];
  nextMeal: { slot: string; title: string; kcal: number; timeLabel: string };
  weightSeries: number[];
}

export type DataState = "ok" | "load" | "empty" | "err";
