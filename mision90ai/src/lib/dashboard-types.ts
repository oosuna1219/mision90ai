export type Meal = {
  time: string;
  items: string;
  kcal: number;
  carbsG: number;
  proteinG: number;
  logged: boolean;
};

export type Habit = {
  id: string;
  label: string;
  done: boolean;
};

export type DashboardData = {
  empty: boolean;
  user: { name: string; missionDay: number; missionLength: number };
  weight: {
    currentKg: number;
    startKg: number;
    goalKg: number;
    deltaKg: number;
    streakDays: number;
    waistCm: number;
    bmi: number;
    weeklyAvgKg: number;
  };
  fasting: {
    protocol: string;
    targetHours: number;
    startedAt: string;
    windowLabel: string;
  };
  water: { glasses: number; targetGlasses: number };
  meals: Meal[];
  habits: Habit[];
  weightTrend: number[];
  coachTip: string;
};
