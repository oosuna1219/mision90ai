import { Logo } from "@/components/ui/Logo";

const BENEFITS = [
  "Plan nutricional y ventana de ayuno calculados para ti.",
  "Coach de IA que responde con tus registros reales.",
  "Progreso medible: peso, medidas, fotos y hábitos.",
];

/**
 * Dark left panel of the access screens. README "Acceso":
 * #0F1720, padding 44/38, logo claro arriba, titular 34/800 blanco,
 * tres beneficios con viñeta circular de 7px en #F26522, testimonio abajo.
 * Hidden on tablet/mobile (only the form column shows there).
 */
export function AuthAside() {
  return (
    <aside className="hidden flex-col justify-between bg-ink-deep px-[38px] py-11 lg:flex">
      <Logo variant="wordmark-light" width={236} priority />

      <div className="max-w-[420px]">
        <h1 className="text-[34px] font-extrabold leading-[1.1] tracking-[-0.03em] text-white">
          Noventa días para cambiar la relación con tu cuerpo.
        </h1>
        <ul className="mt-8 flex flex-col gap-4">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <span
                className="mt-2 h-[7px] w-[7px] shrink-0 rounded-full"
                style={{ background: "rgb(var(--accent))" }}
                aria-hidden
              />
              <span className="text-[15px] leading-[1.6] text-on-dark-2">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <figure className="max-w-[420px]">
        <blockquote className="text-[15px] leading-[1.6] text-on-dark">
          “Bajé 11 kg en el primer trimestre sin sentir que estaba a dieta. El
          coach me corrige el día que me desvío.”
        </blockquote>
        <figcaption className="mt-3 text-[12px] font-bold text-white">
          Mariana G. · día 78 de 90
        </figcaption>
      </figure>
    </aside>
  );
}
