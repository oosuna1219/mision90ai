"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { ChipGroup } from "@/components/ui/ChipGroup";
import { Segmented } from "@/components/ui/Segmented";
import { cn } from "@/lib/cn";
import {
  bmi,
  bmiCategory,
  ketoMacros,
  waterGoalGlasses,
  waterGoalLiters,
} from "@/lib/business";
import type { ActivityLevel, Sex } from "@/lib/types";

const STEPS = [
  "Datos básicos",
  "Peso y objetivo",
  "Nivel de actividad",
  "Historial y condiciones",
  "Preferencias y alergias",
  "Cocina y presupuesto",
  "Experiencia con ayuno",
  "Hábitos a construir",
];

const ACTIVITY: { level: ActivityLevel; title: string; desc: string }[] = [
  { level: 1, title: "Sedentario", desc: "Poco o nada de ejercicio" },
  { level: 2, title: "Ligero", desc: "1–3 días por semana" },
  { level: 3, title: "Moderado", desc: "3–5 días por semana" },
  { level: 4, title: "Alto", desc: "6–7 días por semana" },
  { level: 5, title: "Muy alto", desc: "Entreno diario o trabajo físico" },
];

interface OnboardingState {
  sex: Sex;
  age: string;
  heightCm: string;
  weightKg: string;
  goalWeightKg: string;
  activity: ActivityLevel;
  conditions: string[];
  allergies: string[];
  preferences: string[];
  kitchen: string[];
  budget: string[];
  fastingExperience: string[];
  habits: string[];
}

const INITIAL: OnboardingState = {
  sex: "male",
  age: "",
  heightCm: "",
  weightKg: "",
  goalWeightKg: "",
  activity: 2,
  conditions: [],
  allergies: [],
  preferences: [],
  kitchen: [],
  budget: [],
  fastingExperience: [],
  habits: [],
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [s, setS] = useState<OnboardingState>(INITIAL);

  const set = <K extends keyof OnboardingState>(k: K, v: OnboardingState[K]) =>
    setS((prev) => ({ ...prev, [k]: v }));

  const pct = Math.round((step / STEPS.length) * 100);

  const plan = useMemo(() => {
    const weight = Number(s.weightKg) || 96;
    const height = Number(s.heightCm) || 178;
    const age = Number(s.age) || 34;
    const goal = Number(s.goalWeightKg) || Math.max(60, weight - 15);
    const macros = ketoMacros(s.sex, weight, height, age, s.activity, goal);
    const imc = bmi(weight, height);
    return {
      macros,
      imc,
      imcCat: bmiCategory(imc),
      waterL: waterGoalLiters(weight, false),
      waterGlasses: waterGoalGlasses(weight, false),
    };
  }, [s]);

  function next() {
    if (step >= STEPS.length) setDone(true);
    else setStep((v) => v + 1);
  }
  function back() {
    setStep((v) => Math.max(1, v - 1));
  }

  if (done) return <GeneratedPlan plan={plan} onEnter={() => router.push("/")} />;

  return (
    <div className="grid flex-1 gap-8 py-4 md:grid-cols-[300px_1fr] md:gap-12">
      {/* Step rail */}
      <div className="hidden flex-col md:flex">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-[13px] font-bold text-on-dark">
            <span>Paso {step} de {STEPS.length}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <ol className="flex flex-col gap-1">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const state = n === step ? "current" : n < step ? "done" : "todo";
            return (
              <li key={label}>
                <button
                  onClick={() => setStep(n)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-field px-3 py-2.5 text-left text-[14px] font-semibold transition-colors",
                    state === "current" ? "bg-white/[0.06]" : "hover:bg-white/[0.04]",
                  )}
                >
                  <span
                    className="h-[9px] w-[9px] shrink-0 rounded-full"
                    style={{
                      background:
                        state === "current"
                          ? "rgb(var(--primary))"
                          : state === "done"
                            ? "rgb(var(--success))"
                            : "var(--overlay-white-18)",
                    }}
                  />
                  <span className={state === "todo" ? "text-on-dark" : "text-white"}>
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Step panel */}
      <div className="flex flex-col">
        {/* Mobile progress */}
        <div className="mb-5 md:hidden">
          <div className="mb-2 flex items-center justify-between text-[13px] font-bold text-on-dark">
            <span>Paso {step} de {STEPS.length}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex-1 rounded-card-lg bg-surface p-6 md:p-9">
          <StepBody step={step} s={s} set={set} />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={back}
            className={cn("!text-on-dark-2 hover:!text-white", step === 1 && "invisible")}
          >
            Atrás
          </Button>
          <Button onClick={next}>
            {step >= STEPS.length ? "Generar mi plan" : "Continuar"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-6">
      <h2 className="text-[23px] font-extrabold tracking-[-0.02em] text-ink md:text-[30px]">
        {title}
      </h2>
      <p className="mt-1.5 text-[15px] leading-[1.6] text-body">{subtitle}</p>
    </header>
  );
}

function StepBody({
  step,
  s,
  set,
}: {
  step: number;
  s: OnboardingState;
  set: <K extends keyof OnboardingState>(k: K, v: OnboardingState[K]) => void;
}) {
  switch (step) {
    case 1:
      return (
        <>
          <StepTitle title="Empecemos por lo básico" subtitle="Con esto calculamos tu gasto energético." />
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-bold text-ink">Sexo</span>
              <Segmented
                ariaLabel="Sexo"
                value={s.sex}
                onChange={(v) => set("sex", v)}
                options={[
                  { value: "male", label: "Hombre" },
                  { value: "female", label: "Mujer" },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Edad" type="number" inputMode="numeric" placeholder="34"
                value={s.age} onChange={(e) => set("age", e.target.value)} />
              <Field label="Estatura (cm)" type="number" inputMode="numeric" placeholder="178"
                value={s.heightCm} onChange={(e) => set("heightCm", e.target.value)} />
            </div>
          </div>
        </>
      );
    case 2:
      return (
        <>
          <StepTitle title="Tu punto de partida y tu meta" subtitle="Definimos un déficit seguro para llegar en 90 días." />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Peso actual (kg)" type="number" inputMode="decimal" placeholder="96.4"
              value={s.weightKg} onChange={(e) => set("weightKg", e.target.value)} />
            <Field label="Peso objetivo (kg)" type="number" inputMode="decimal" placeholder="82"
              value={s.goalWeightKg} onChange={(e) => set("goalWeightKg", e.target.value)} />
          </div>
        </>
      );
    case 3:
      return (
        <>
          <StepTitle title="¿Qué tan activo eres?" subtitle="Ajusta tus calorías al gasto real de tu día." />
          <div className="flex flex-col gap-2.5">
            {ACTIVITY.map((a) => {
              const active = s.activity === a.level;
              return (
                <button
                  key={a.level}
                  type="button"
                  aria-pressed={active}
                  onClick={() => set("activity", a.level)}
                  className={cn(
                    "flex items-center justify-between rounded-field border-[1.5px] px-4 py-3.5 text-left transition-colors",
                    active ? "border-primary bg-primary-soft" : "border-border-input hover:border-body",
                  )}
                >
                  <span>
                    <span className="block text-[15px] font-bold text-ink">{a.title}</span>
                    <span className="block text-[13px] text-body">{a.desc}</span>
                  </span>
                  <span
                    className={cn(
                      "h-5 w-5 rounded-full border-[1.5px]",
                      active ? "border-primary bg-primary" : "border-border-input",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </>
      );
    case 4:
      return (
        <>
          <StepTitle title="Historial y condiciones" subtitle="Marca lo que aplique. Nada de esto se comparte." />
          <ChipGroup
            value={s.conditions}
            onChange={(v) => set("conditions", v)}
            options={["Ninguna", "Hipertensión", "Diabetes tipo 2", "Tiroides", "Colesterol alto", "Resistencia a la insulina", "Problemas digestivos", "Lesión articular"]}
          />
        </>
      );
    case 5:
      return (
        <>
          <StepTitle title="Preferencias y alergias" subtitle="Tu menú evitará lo que marques aquí." />
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-2 text-[13px] font-bold text-ink">Alergias</p>
              <ChipGroup value={s.allergies} onChange={(v) => set("allergies", v)}
                options={["Gluten", "Lácteos", "Frutos secos", "Mariscos", "Huevo", "Soya"]} />
            </div>
            <div>
              <p className="mb-2 text-[13px] font-bold text-ink">Preferencias</p>
              <ChipGroup value={s.preferences} onChange={(v) => set("preferences", v)}
                options={["Sin cerdo", "Pescetariano", "Poca res", "Amo el picante", "Comida sencilla"]} />
            </div>
          </div>
        </>
      );
    case 6:
      return (
        <>
          <StepTitle title="Cocina y presupuesto" subtitle="Adaptamos las recetas a tu realidad." />
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-2 text-[13px] font-bold text-ink">Tiempo para cocinar</p>
              <ChipGroup multiple={false} value={s.kitchen} onChange={(v) => set("kitchen", v)}
                options={["Muy poco", "Algo entre semana", "Me gusta cocinar"]} />
            </div>
            <div>
              <p className="mb-2 text-[13px] font-bold text-ink">Presupuesto semanal</p>
              <ChipGroup multiple={false} value={s.budget} onChange={(v) => set("budget", v)}
                options={["Ajustado", "Medio", "Flexible"]} />
            </div>
          </div>
        </>
      );
    case 7:
      return (
        <>
          <StepTitle title="Tu experiencia con ayuno" subtitle="Elegimos un protocolo que puedas sostener." />
          <ChipGroup multiple={false} value={s.fastingExperience} onChange={(v) => set("fastingExperience", v)}
            columns={1}
            options={["Nunca he ayunado", "He probado 12:12", "Hago 16:8 a veces", "Ayuno con frecuencia"]} />
        </>
      );
    case 8:
      return (
        <>
          <StepTitle title="¿Qué hábitos quieres construir?" subtitle="Empieza con 3 o 4. Puedes cambiarlos después." />
          <ChipGroup value={s.habits} onChange={(v) => set("habits", v)}
            options={["Beber 3 L de agua", "10 000 pasos", "Sin azúcar", "Dormir 7 h", "Registrar peso", "Ayuno 16:8", "Meditar", "Sin alcohol"]} />
        </>
      );
    default:
      return null;
  }
}

function GeneratedPlan({
  plan,
  onEnter,
}: {
  plan: {
    macros: { kcal: number; carbsG: number; proteinG: number; fatG: number };
    imc: number;
    imcCat: string;
    waterL: number;
    waterGlasses: number;
  };
  onEnter: () => void;
}) {
  const { macros } = plan;
  return (
    <div className="flex flex-1 items-center justify-center py-8">
      <div className="w-full max-w-[560px] rounded-card-lg bg-surface p-7 md:p-10">
        <p className="eyebrow mb-3">Tu plan está listo</p>
        <h2 className="text-[27px] font-extrabold tracking-[-0.02em] text-ink md:text-[32px]">
          Keto + 16:8, hecho a tu medida
        </h2>
        <p className="mt-2 text-[15px] leading-[1.6] text-body">
          Calculamos tus macros con Mifflin-St Jeor y un déficit del 20%. Ajustaremos
          semana a semana según tus registros reales.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Metric label="Calorías / día" value={macros.kcal.toLocaleString("es-MX")} unit="kcal" big />
          <Metric label="Agua / día" value={plan.waterL.toFixed(1)} unit={`L · ${plan.waterGlasses} vasos`} big />
          <Metric label="Carbohidratos" value={String(macros.carbsG)} unit="g netos" />
          <Metric label="Proteína" value={String(macros.proteinG)} unit="g" />
          <Metric label="Grasa" value={String(macros.fatG)} unit="g" />
          <Metric label="IMC actual" value={plan.imc.toFixed(1)} unit={plan.imcCat} />
        </div>

        <Button fullWidth className="mt-7" onClick={onEnter}>
          Entrar a mi panel
        </Button>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  unit,
  big,
}: {
  label: string;
  value: string;
  unit: string;
  big?: boolean;
}) {
  return (
    <div className="rounded-card border border-border-strong bg-bg-app p-4">
      <p className="eyebrow mb-1">{label}</p>
      <p className={cn("font-extrabold tracking-[-0.02em] text-ink", big ? "text-[30px]" : "text-[22px]")}>
        {value}
      </p>
      <p className="text-[13px] text-body">{unit}</p>
    </div>
  );
}
