export default function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-card-lg border border-border bg-surface px-6 py-16 text-center tablet:px-10">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-border-input text-text-muted">
        ⋯
      </span>
      <div className="flex max-w-md flex-col gap-2">
        <h1 className="text-[22px] font-extrabold tracking-[-.02em] text-ink">{title}</h1>
        <p className="text-[15px] leading-[1.6] text-text-body">{description}</p>
      </div>
      <span className="rounded-full bg-bg-app px-4 py-2 text-xs font-bold text-text-muted">
        Próximamente en esta fase de desarrollo
      </span>
    </div>
  );
}
