const ACTIONS = ["Peso", "Medidas", "Foto", "Actividad"];

export default function QuickLogCard() {
  return (
    <div className="flex flex-col gap-3 rounded-card-lg border border-border bg-surface p-[18px] desktop:p-6">
      <h2 className="text-base font-extrabold text-ink">Registro rápido</h2>
      <div className="grid grid-cols-2 gap-[9px]">
        {ACTIONS.map((action) => (
          <button
            key={action}
            type="button"
            className="rounded-xl border border-border bg-bg-app px-3.5 py-3.5 text-center text-[13px] font-bold text-ink hover:bg-border/40"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
