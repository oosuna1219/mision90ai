// Utilidades de fecha del servidor (TZ del servidor; afinar por usuario luego).

/** Rango [inicio, fin) del día natural que contiene a `d`. */
export function dayRange(d: Date = new Date()): { start: Date; end: Date } {
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

/** Inicio del día natural de `d`. */
export function startOfDay(d: Date = new Date()): Date {
  return dayRange(d).start;
}

/** Días naturales completos entre dos fechas. */
export function daysBetween(a: Date, b: Date): number {
  const ms = startOfDay(b).getTime() - startOfDay(a).getTime();
  return Math.round(ms / 864e5);
}

/** "Domingo 17 de agosto" en español. */
export function formatLongDate(d: Date = new Date()): string {
  const s = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
