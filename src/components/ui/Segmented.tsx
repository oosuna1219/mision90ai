"use client";

import { cn } from "@/lib/cn";

export interface SegmentedProps<T extends string | number> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  className?: string;
}

/**
 * Segmented control. README: contenedor radio 10px, segmento interno 7px;
 * el activo pinta fondo #17202A (ink) y texto blanco.
 */
export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex gap-1 rounded-segbox border border-border-strong bg-bg-app p-1",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-seg px-3.5 py-2 text-[13px] font-bold transition-colors duration-200 ease-out",
              active ? "bg-ink text-surface" : "text-body hover:text-ink",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
