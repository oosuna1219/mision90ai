import { cn } from "@/lib/cn";

/**
 * Area sparkline of recent weight. Pure SVG, no chart library.
 * Stroke uses product blue; the accent orange is reserved for streaks/logros.
 */
export function WeightSparkline({
  series,
  height = 200,
  className,
}: {
  series: number[];
  height?: number;
  className?: string;
}) {
  const w = 640;
  const h = height;
  const pad = 8;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const stepX = (w - pad * 2) / (series.length - 1);

  const pts = series.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (1 - (v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });

  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${h} L${pts[0][0].toFixed(1)} ${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={cn("w-full", className)}
      style={{ height }}
      role="img"
      aria-label="Tendencia de peso"
    >
      <defs>
        <linearGradient id="wspark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.18" />
          <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#wspark)" />
      <path d={line} fill="none" stroke="rgb(var(--primary))" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={4} fill="rgb(var(--primary))" />
    </svg>
  );
}
