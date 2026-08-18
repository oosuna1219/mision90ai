import Image from "next/image";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh grid-cols-1 bg-white desktop:grid-cols-[1.05fr_1fr]">
      <aside className="hidden flex-col justify-between gap-10 bg-ink-deep px-[38px] py-11 desktop:flex">
        <Image
          src="/assets/logo-wordmark-light.png"
          alt="Misión 90 AI"
          width={236}
          height={48}
          className="w-[236px] object-contain"
        />
        <div className="flex flex-col gap-[26px]">
          <h1 className="text-balance text-[34px] font-extrabold leading-[1.1] tracking-[-.03em] text-white">
            Noventa días para cambiar la relación con tu cuerpo.
          </h1>
          <ul className="flex flex-col gap-[14px]">
            {[
              "Plan nutricional calculado con tus datos, no una plantilla.",
              "Ayuno, hábitos, medidas y fotos en un solo registro diario.",
              "Coach AI que lee tu progreso real y ajusta el plan.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="mt-[7px] h-[7px] w-[7px] flex-none rounded-full bg-accent" />
                <span className="text-sm leading-[1.55] text-text-on-dark-2">{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[13px] leading-[1.6] text-text-on-dark">
            «Bajé 18.6 kg en dos meses y por primera vez entendí por qué.»
          </p>
          <p className="text-xs font-bold text-white">María Fernanda L. · día 61</p>
        </div>
      </aside>

      <div className="flex flex-col items-center justify-center gap-[26px] px-[22px] py-11 tablet:px-10 tablet:py-14 desktop:px-12">
        <div className="flex w-full max-w-[400px] flex-col gap-[26px]">
          <Image
            src="/assets/logo-full.png"
            alt="Misión 90 AI"
            width={150}
            height={60}
            className="w-[150px] self-center object-contain desktop:hidden"
          />
          {children}
        </div>
      </div>
    </div>
  );
}
