"use client";

import { useEffect, useState } from "react";

function formatHm(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return { h, m };
}

/**
 * README §Interacciones: "El temporizador de ayuno se actualiza cada segundo".
 * Deriva el estado del ayuno a partir de startedAt + targetHours, sin
 * depender de un intervalo que reinicie el layout — solo re-renderiza.
 */
export function useFastingClock(startedAtIso: string, targetHours: number) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const startedAt = new Date(startedAtIso).getTime();
  const targetMs = targetHours * 3600 * 1000;
  const elapsedMs = now - startedAt;
  const remainingMs = targetMs - elapsedMs;
  const active = remainingMs > 0;

  const elapsed = formatHm(elapsedMs / 1000);
  const elapsedLabel = `${String(elapsed.h).padStart(2, "0")}:${String(elapsed.m).padStart(2, "0")}`;

  const remaining = formatHm(Math.abs(remainingMs) / 1000);
  const remainingLabel = `${remaining.h}h ${remaining.m}m`;

  const progress = Math.min(1, Math.max(0, elapsedMs / targetMs));

  return { elapsedLabel, remainingLabel, progress, active };
}
