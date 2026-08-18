import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

/* Loading — exact-shape skeletons with m90pulse (README: nunca spinners). */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-[18px]">
      <div className="grid gap-[14px] md:gap-[18px] lg:grid-cols-[1.35fr_1fr]">
        <Card className="min-h-[200px]">
          <div className="skeleton h-4 w-28" />
          <div className="skeleton mt-4 h-14 w-40" />
          <div className="skeleton mt-6 h-[120px] w-full" />
        </Card>
        <Card className="min-h-[200px]">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton mt-4 h-10 w-full" />
          <div className="skeleton mt-3 h-10 w-full" />
          <div className="skeleton mt-3 h-10 w-3/4" />
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-[14px] md:gap-[18px] lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="min-h-[120px]">
            <div className="skeleton h-3 w-16" />
            <div className="skeleton mt-3 h-8 w-20" />
          </Card>
        ))}
      </div>
    </div>
  );
}

/* Empty — usuario nuevo sin registros, una sola llamada a la acción. */
export function DashboardEmpty() {
  return (
    <Card className="flex flex-col items-center px-6 py-16 text-center md:py-20">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-2xl">
        ⚖️
      </div>
      <h2 className="mt-5 text-[20px] font-extrabold tracking-[-0.02em] text-ink">
        Empieza registrando tu peso
      </h2>
      <p className="mt-2 max-w-[380px] text-[15px] leading-[1.6] text-body">
        Tu dashboard cobra vida en cuanto tengas tu primer registro. Toma 10 segundos.
      </p>
      <Link href="/progreso" className="mt-6">
        <Button>Registrar mi primer peso</Button>
      </Link>
    </Card>
  );
}

/* Error — mensaje en tarjeta con reintento, sin modales. */
export function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="flex flex-col items-center px-6 py-16 text-center md:py-20">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-2xl">
        ⚠️
      </div>
      <h2 className="mt-5 text-[20px] font-extrabold tracking-[-0.02em] text-ink">
        No pudimos cargar tu día
      </h2>
      <p className="mt-2 max-w-[380px] text-[15px] leading-[1.6] text-body">
        Hubo un problema de conexión. Tus datos están a salvo; vuelve a intentarlo.
      </p>
      <Button className="mt-6" onClick={onRetry}>
        Reintentar
      </Button>
    </Card>
  );
}
