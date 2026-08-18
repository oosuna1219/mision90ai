import Link from "next/link";

function buildPath(values: number[]) {
  if (values.length < 2) return { line: "", area: "" };
  const width = 640;
  const height = 200;
  const padTop = 20;
  const padBottom = 24;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - 16) + 8;
    const y = padTop + (1 - (v - min) / span) * (height - padTop - padBottom);
    return [x, y] as const;
  });

  const line = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const [firstX] = points[0];
  const [lastX] = points[points.length - 1];
  const area = `${line} L${lastX.toFixed(1)} ${height} L${firstX.toFixed(1)} ${height} Z`;

  return { line, area, lastPoint: points[points.length - 1] };
}

export default function WeightTrendCard({ values }: { values: number[] }) {
  const { line, area, lastPoint } = buildPath(values);

  return (
    <div className="flex flex-col gap-4 rounded-card-lg border border-border bg-surface p-[18px] desktop:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-extrabold text-ink">Tendencia de peso</h2>
        <Link href="/progreso" className="text-[13px] font-bold text-primary hover:text-primary-hover">
          Ver mi progreso
        </Link>
      </div>
      <svg viewBox="0 0 640 200" className="h-[150px] w-full desktop:h-[200px]">
        <line x1="0" y1="40" x2="640" y2="40" stroke="#EDF1F7" strokeWidth="1" />
        <line x1="0" y1="90" x2="640" y2="90" stroke="#EDF1F7" strokeWidth="1" />
        <line x1="0" y1="140" x2="640" y2="140" stroke="#EDF1F7" strokeWidth="1" />
        {area && <path d={area} fill="rgba(37,99,235,.07)" />}
        {line && <path d={line} fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />}
        {lastPoint && <circle cx={lastPoint[0]} cy={lastPoint[1]} r="6" fill="#2563EB" stroke="#fff" strokeWidth="3" />}
      </svg>
    </div>
  );
}
