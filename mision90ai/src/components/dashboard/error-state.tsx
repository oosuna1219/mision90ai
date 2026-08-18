export default function DashboardErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-3.5 tablet:gap-[18px]">
      <div className="flex items-start gap-3.5 rounded-2xl border border-[#F3D3D3] bg-[#FEF2F2] p-5">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-[#FBE3E3] text-[17px] font-extrabold text-[#B42318]">
          !
        </span>
        <div className="flex min-w-0 flex-col gap-[5px]">
          <h1 className="text-[15px] font-extrabold text-[#8A1C13]">No pudimos cargar tus registros</h1>
          <p className="text-sm leading-[1.55] text-[#A03A30]">
            La conexión se interrumpió. Tus datos están seguros: lo último que registraste se guardó en tu
            dispositivo y se sincroniza al reconectar.
          </p>
          <div className="flex flex-wrap gap-[10px] pt-2">
            <button
              type="button"
              onClick={onRetry}
              className="rounded-[11px] bg-[#B42318] px-[18px] py-3 text-[13px] font-bold text-white"
            >
              Reintentar
            </button>
            <button type="button" className="rounded-[11px] border border-[#E9BEBA] px-[18px] py-3 text-[13px] font-bold text-[#8A1C13]">
              Trabajar sin conexión
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-5">
        <span className="text-[13px] font-extrabold text-ink">Guardado localmente</span>
        <span className="text-[13px] tabular-nums text-text-body">
          Peso 117.8 kg · agua 1.5 L · 2 hábitos · pendiente de sincronizar
        </span>
      </div>
    </div>
  );
}
