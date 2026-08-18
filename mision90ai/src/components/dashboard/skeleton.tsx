export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-3.5 tablet:gap-[18px]">
      <div className="grid grid-cols-1 gap-3.5 desktop:grid-cols-[1.35fr_1fr] tablet:gap-[18px]">
        <div className="skeleton-shine h-[250px] rounded-card-lg border border-border" />
        <div className="skeleton-shine h-[250px] rounded-card-lg border border-border" style={{ animationDelay: "0.15s" }} />
      </div>
      <div className="grid grid-cols-1 gap-3.5 desktop:grid-cols-[1.5fr_1fr] tablet:gap-[18px]">
        <div className="skeleton-shine h-80 rounded-card-lg border border-border" style={{ animationDelay: "0.3s" }} />
        <div className="skeleton-shine h-80 rounded-card-lg border border-border" style={{ animationDelay: "0.45s" }} />
      </div>
      <div className="flex items-center justify-center gap-3 p-2">
        <span className="spin-m90 h-[18px] w-[18px] rounded-full border-[2.5px] border-border-input border-t-primary" />
        <span className="text-[13px] font-bold text-text-body">Cargando tus registros de hoy</span>
      </div>
    </div>
  );
}
