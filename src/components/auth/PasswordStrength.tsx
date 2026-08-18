import { cn } from "@/lib/cn";

export type Strength = 0 | 1 | 2 | 3; // vacío, débil, media, fuerte

// README "Validación": débil <8, media 8+, fuerte 12+ con símbolo.
export function scorePassword(pw: string): Strength {
  if (!pw) return 0;
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);
  if (pw.length >= 12 && hasSymbol) return 3;
  if (pw.length >= 8) return 2;
  return 1;
}

const LABEL = ["", "Débil", "Media", "Fuerte"] as const;
// Naranja está reservado a logro/racha, así que la fuerza usa la escala de UI.
const COLOR = ["", "#98A1AE", "#FBBF6B", "#27AE60"] as const;

export function PasswordStrength({ value }: { value: string }) {
  const s = scorePassword(value);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1.5" aria-hidden>
        {[1, 2, 3].map((seg) => (
          <span
            key={seg}
            className={cn("h-1.5 flex-1 rounded-full transition-colors duration-200")}
            style={{ background: s >= seg ? COLOR[s] : "rgb(var(--border-input))" }}
          />
        ))}
      </div>
      {s > 0 ? (
        <p className="text-[13px] font-semibold" style={{ color: COLOR[s] }}>
          Seguridad: {LABEL[s]}
        </p>
      ) : (
        <p className="text-[13px] text-body">Mínimo 8 caracteres, una mayúscula y un número.</p>
      )}
    </div>
  );
}

export function isValidPassword(pw: string): boolean {
  return pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);
}
