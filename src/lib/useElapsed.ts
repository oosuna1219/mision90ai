"use client";

import { useEffect, useState } from "react";

/** Ticks every second while `active`. Returns live elapsed seconds. */
export function useElapsed(startSeconds: number, active: boolean): number {
  const [seconds, setSeconds] = useState(startSeconds);
  useEffect(() => {
    setSeconds(startSeconds);
    if (!active) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [startSeconds, active]);
  return seconds;
}

export function formatHMS(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}
