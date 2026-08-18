import { Card, CardEyebrow } from "@/components/ui/Card";
import { mockUser } from "@/lib/mock";
import { levelForPoints } from "@/lib/business";
import { cn } from "@/lib/cn";

// Nivel a partir de puntos (README "Puntos y niveles").
const LEVEL_STOPS = [0, 500, 1000, 2000, 3500, 5500, 7500];

function progress(points: number) {
  const level = levelForPoints(points);
  const current = LEVEL_STOPS[level - 1] ?? 0;
  const next = LEVEL_STOPS[level] ?? current + 2000;
  const pct = Math.min(100, ((points - current) / (next - current)) * 100);
  return { level, current, next, pct, remaining: next - points };
}

const BADGES = [
  { icon: "🔥", name: "Racha de 7 días", got: true },
  { icon: "💧", name: "Meta de agua 5 días", got: true },
  { icon: "⏳", name: "10 ayunos completos", got: true },
  { icon: "⚖️", name: "Primer −5 kg", got: true },
  { icon: "📸", name: "4 semanas de fotos", got: true },
  { icon: "🏔️", name: "Primer −10 kg", got: true },
  { icon: "🥇", name: "Racha de 30 días", got: false },
  { icon: "💎", name: "Semana perfecta", got: false },
  { icon: "🚀", name: "Llegar a la meta", got: false },
];

export default function LogrosPage() {
  const { points } = mockUser;
  const { level, next, pct, remaining } = progress(points);
  const got = BADGES.filter((b) => b.got).length;

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Nivel y puntos — módulo donde el naranja se usa con libertad */}
      <div className="rounded-card bg-ink-deep p-6 text-white md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow !text-on-dark">Nivel actual</p>
            <p className="text-[44px] font-extrabold leading-none tracking-[-0.02em]">
              Nivel {level}
            </p>
          </div>
          <p className="text-[30px] font-extrabold tracking-[-0.02em] text-accent">
            {points.toLocaleString("es-MX")}
            <span className="ml-1 text-[15px] font-bold text-on-dark-2">pts</span>
          </p>
        </div>
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-[13px] font-semibold text-on-dark-2">
            <span>Nivel {level}</span>
            <span>Nivel {level + 1}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-[13px] text-on-dark-2">
            Te faltan <span className="font-bold text-white">{remaining.toLocaleString("es-MX")} pts</span>{" "}
            para el nivel {level + 1} ({next.toLocaleString("es-MX")} pts).
          </p>
        </div>
      </div>

      {/* Insignias */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <CardEyebrow>Insignias</CardEyebrow>
          <span className="text-[13px] font-bold text-body">{got} de {BADGES.length}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BADGES.map((b) => (
            <div
              key={b.name}
              className={cn(
                "flex flex-col items-center gap-2 rounded-card border p-4 text-center transition-colors",
                b.got
                  ? "border-accent/30 bg-accent/[0.06]"
                  : "border-border bg-bg-app opacity-70",
              )}
            >
              <span className={cn("text-3xl", !b.got && "grayscale")} aria-hidden>
                {b.icon}
              </span>
              <span className="text-[13px] font-bold text-ink">{b.name}</span>
              <span
                className={cn(
                  "text-[11px] font-extrabold uppercase tracking-[0.08em]",
                  b.got ? "text-accent" : "text-muted",
                )}
              >
                {b.got ? "Obtenida" : "Pendiente"}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
