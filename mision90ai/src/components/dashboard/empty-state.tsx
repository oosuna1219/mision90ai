import Image from "next/image";

export default function DashboardEmptyState() {
  return (
    <div className="flex flex-col items-center gap-5 rounded-card-lg border border-border bg-surface px-5 py-10 text-center tablet:px-16 tablet:py-16">
      <Image src="/assets/logo-mark.png" alt="" width={88} height={88} className="opacity-55" />
      <div className="flex max-w-[440px] flex-col gap-[9px]">
        <h1 className="text-[22px] font-extrabold tracking-[-.02em] text-ink">Tu día 1 empieza con un número</h1>
        <p className="text-[15px] leading-[1.6] text-text-body">
          Registra tu peso de hoy y la plataforma calcula tus objetivos, tu ventana de ayuno y el menú de la semana.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-[10px]">
        <button type="button" className="rounded-field bg-primary px-5 py-[14px] text-sm font-bold text-white hover:bg-primary-hover">
          Registrar mi peso
        </button>
        <button type="button" className="rounded-field border border-border-input px-5 py-[14px] text-sm font-bold text-ink">
          Ver cómo funciona
        </button>
      </div>
    </div>
  );
}
