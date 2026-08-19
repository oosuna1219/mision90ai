import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, UnauthorizedError } from "@/lib/session";
import {
  bmi,
  bmiCategory,
  ketoMacros,
  waterGoalGlasses,
  waterGoalLiters,
} from "@/lib/business";
import type { ActivityLevel, Sex } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Convierte edad en años a una fecha de nacimiento aproximada.
function birthdateFromAge(age: number): Date {
  return new Date(Date.now() - age * 365.25 * 864e5);
}

function clampActivity(n: number): ActivityLevel {
  const v = Math.round(n);
  return (v < 1 ? 1 : v > 5 ? 5 : v) as ActivityLevel;
}

export async function POST(req: Request) {
  let user;
  try {
    user = await requireUser();
  } catch (e) {
    if (e instanceof UnauthorizedError)
      return NextResponse.json({ error: "Inicia sesión para continuar." }, { status: 401 });
    throw e;
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });

  const sex: Sex = body.sex === "female" ? "female" : "male";
  const age = Number(body.age) || 34;
  const heightCm = Number(body.heightCm) || 178;
  const weightKg = Number(body.weightKg) || 96;
  const goalWeightKg = Number(body.goalWeightKg) || Math.max(60, weightKg - 15);
  const activity = clampActivity(Number(body.activity) || 2);

  const conditions: string[] = Array.isArray(body.conditions) ? body.conditions.map(String) : [];
  const allergies: string[] = Array.isArray(body.allergies) ? body.allergies.map(String) : [];
  const preferences: string[] = Array.isArray(body.preferences) ? body.preferences.map(String) : [];
  const fastingExperience: string | null = Array.isArray(body.fastingExperience)
    ? (body.fastingExperience[0] ?? null)
    : null;
  const habitNames: string[] = Array.isArray(body.habits) ? body.habits.map(String) : [];

  // --- Cálculos de negocio (server-side, fuente de verdad) ---
  const macros = ketoMacros(sex, weightKg, heightCm, age, activity, goalWeightKg);
  const waterL = waterGoalLiters(weightKg, false);
  const imcValue = bmi(weightKg, heightCm);

  // --- Persistencia (transacción: perfil + peso inicial + hábitos + plan) ---
  await prisma.$transaction(async (tx) => {
    await tx.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        sex,
        birthdate: birthdateFromAge(age),
        heightCm,
        activityLevel: activity,
        conditions,
        allergies,
        preferences,
        goalWeightKg,
        fastingExperience,
      },
      update: {
        sex,
        birthdate: birthdateFromAge(age),
        heightCm,
        activityLevel: activity,
        conditions,
        allergies,
        preferences,
        goalWeightKg,
        fastingExperience,
      },
    });

    // Peso inicial → da datos reales al dashboard y a Progreso.
    await tx.weightLog.create({
      data: { userId: user.id, date: new Date(), weightKg, source: "manual" },
    });

    // Hábitos elegidos (re-crea para que re-onboarding quede limpio).
    await tx.habit.deleteMany({ where: { userId: user.id } });
    if (habitNames.length) {
      await tx.habit.createMany({
        data: habitNames.map((name) => ({ userId: user.id, name })),
      });
    }

    // Plan de la semana 1.
    await tx.dietPlan.deleteMany({ where: { userId: user.id } });
    await tx.dietPlan.create({
      data: {
        userId: user.id,
        week: 1,
        dietType: "keto",
        fastingProtocol: "P16_8",
        kcalTarget: macros.kcal,
        carbsG: macros.carbsG,
        proteinG: macros.proteinG,
        fatG: macros.fatG,
        waterTargetL: waterL,
      },
    });
  });

  return NextResponse.json({
    plan: {
      macros,
      imc: imcValue,
      imcCat: bmiCategory(imcValue),
      waterL,
      waterGlasses: waterGoalGlasses(weightKg, false),
    },
  });
}
