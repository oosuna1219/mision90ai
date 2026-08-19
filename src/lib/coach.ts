import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "./db";
import { dayRange, daysBetween } from "./date";

// Modelo configurable; por defecto Claude Opus 5 (baja a claude-haiku-4-5 o
// claude-sonnet-5 con COACH_MODEL para reducir costo por mensaje).
const COACH_MODEL = process.env.COACH_MODEL || "claude-opus-5";

export function coachConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

interface CoachContext {
  name: string;
  missionDay: number;
  weightKg: number | null;
  weightDeltaKg: number | null;
  goalWeightKg: number | null;
  water: string;
  habits: string;
  plan: string | null;
  fasting: string;
  trend: string;
}

// Reúne el contexto real del usuario para que el coach responda con sus datos.
export async function getCoachContext(userId: string): Promise<CoachContext> {
  const { start, end } = dayRange();
  const [user, profile, weightLogs, habits, plan, water, fasting] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.profile.findUnique({ where: { userId } }),
    prisma.weightLog.findMany({ where: { userId }, orderBy: { date: "asc" }, take: 20 }),
    prisma.habit.findMany({ where: { userId, active: true } }),
    prisma.dietPlan.findFirst({ where: { userId }, orderBy: { week: "desc" } }),
    prisma.waterLog.findUnique({ where: { userId_date: { userId, date: start } } }),
    prisma.fastingSession.findFirst({ where: { userId, endedAt: null }, orderBy: { startedAt: "desc" } }),
  ]);

  const latest = weightLogs[weightLogs.length - 1] ?? null;
  const prev = weightLogs.length > 1 ? weightLogs[weightLogs.length - 2] : null;

  const habitIds = habits.map((h) => h.id);
  const todayLogs = habitIds.length
    ? await prisma.habitLog.findMany({ where: { habitId: { in: habitIds }, date: { gte: start, lt: end }, done: true } })
    : [];
  const doneToday = todayLogs.length;

  return {
    name: user?.name ?? "el usuario",
    missionDay: user ? Math.max(1, daysBetween(user.missionStartDate, new Date()) + 1) : 1,
    weightKg: latest?.weightKg ?? null,
    weightDeltaKg: prev && latest ? Number((latest.weightKg - prev.weightKg).toFixed(1)) : null,
    goalWeightKg: profile?.goalWeightKg ?? null,
    water: `${water?.glasses ?? 0} vasos hoy`,
    habits: habits.length ? `${doneToday}/${habits.length} hábitos cumplidos hoy (${habits.map((h) => h.name).join(", ")})` : "sin hábitos activos",
    plan: plan ? `${plan.kcalTarget} kcal · ${plan.carbsG}g C · ${plan.proteinG}g P · ${plan.fatG}g G (keto)` : null,
    fasting: fasting ? `ayuno ${fasting.protocol.replace("P", "").replace("_", ":")} activo` : "sin ayuno activo",
    trend: weightLogs.length > 1 ? weightLogs.map((w) => w.weightKg).join(" → ") : "pocos registros aún",
  };
}

function systemPrompt(ctx: CoachContext): string {
  return `Eres el coach de salud de Misión 90 AI, un programa de 90 días. Hablas español, cálido pero directo, como un entrenador que conoce a su cliente. Respondes SIEMPRE con base en los datos reales de ${ctx.name}, no en genérico.

Datos actuales de ${ctx.name} (día ${ctx.missionDay} de 90):
- Peso: ${ctx.weightKg != null ? ctx.weightKg + " kg" : "sin registro"}${ctx.weightDeltaKg != null ? ` (cambio reciente ${ctx.weightDeltaKg} kg)` : ""}
- Meta: ${ctx.goalWeightKg != null ? ctx.goalWeightKg + " kg" : "no definida"}
- Tendencia de peso: ${ctx.trend}
- Agua: ${ctx.water}
- Hábitos: ${ctx.habits}
- Plan: ${ctx.plan ?? "sin plan generado"}
- Ayuno: ${ctx.fasting}

Reglas:
- Sé conciso (2-4 frases). Menciona cifras concretas de sus datos cuando apliquen.
- Da UNA acción clara y accionable, no una lista larga.
- No des diagnósticos médicos ni prometas resultados garantizados; sugiere consultar a un profesional para temas clínicos.
- No incluyas etiquetas XML internas ni tu razonamiento; responde directo al usuario.`;
}

export interface CoachTurn {
  role: "user" | "coach";
  text: string;
}

// Llama a Claude con el contexto del usuario y el historial reciente.
export async function askCoach(userId: string, history: CoachTurn[]): Promise<string> {
  const ctx = await getCoachContext(userId);
  const client = new Anthropic();

  const messages = history.map((m) => ({
    role: (m.role === "coach" ? "assistant" : "user") as "assistant" | "user",
    content: m.text,
  }));

  const res = await client.messages.create({
    model: COACH_MODEL,
    max_tokens: 1024,
    system: systemPrompt(ctx),
    output_config: { effort: "low" },
    messages,
  });

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  return text || "No pude generar una respuesta en este momento. Intenta de nuevo.";
}
