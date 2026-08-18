export function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="mb-7">
      <h2 className="text-[27px] font-extrabold tracking-[-0.03em] text-ink">
        {title}
      </h2>
      <p className="mt-1.5 text-[15px] leading-[1.6] text-body">{subtitle}</p>
    </header>
  );
}

export function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-3" aria-hidden>
      <span className="h-px flex-1 bg-border" />
      <span className="text-[13px] font-bold text-muted">o</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
