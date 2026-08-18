import { Card } from "@/components/ui/Card";

/** Placeholder for modules not yet built this pass (routes 1–9). */
export function ModuleStub({
  title,
  summary,
}: {
  title: string;
  summary: string;
}) {
  return (
    <Card className="flex flex-col items-start gap-3 px-6 py-14">
      <span className="eyebrow">Próximo módulo</span>
      <h2 className="text-[24px] font-extrabold tracking-[-0.02em] text-ink">{title}</h2>
      <p className="max-w-[560px] text-[15px] leading-[1.6] text-body">{summary}</p>
      <p className="mt-2 rounded-field bg-primary-soft px-3 py-2 text-[13px] font-semibold text-primary">
        Diseñado en el handoff · pendiente de implementar. El layout, el acceso y
        el dashboard ya están listos.
      </p>
    </Card>
  );
}
