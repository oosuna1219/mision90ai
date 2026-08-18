"use client";

import { cn } from "@/lib/cn";

/**
 * Toggle switch. README /configuracion: pista #D3DBE6 → #27AE60, pulgar con
 * translateX(20px). Accessibility: state is not color-only — role=switch +
 * aria-checked carries it to assistive tech.
 */
export function Switch({
  checked,
  onChange,
  label,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  id?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-out",
        checked ? "bg-success" : "bg-border-input",
      )}
    >
      <span
        className={cn(
          "h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}
