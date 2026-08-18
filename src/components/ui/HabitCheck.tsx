"use client";

import { cn } from "@/lib/cn";

/**
 * Habit checkbox. README: objetivo táctil 44px; al marcar, fondo #27AE60 y "✓".
 * Accessibility: the "✓" (not just color) communicates the done state.
 */
export function HabitCheck({
  done,
  onToggle,
  label,
}: {
  done: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-field border-[1.5px] text-lg font-extrabold transition-colors duration-200 ease-out",
        done
          ? "border-success bg-success text-white"
          : "border-border-input bg-surface text-transparent hover:border-body",
      )}
    >
      ✓
    </button>
  );
}
