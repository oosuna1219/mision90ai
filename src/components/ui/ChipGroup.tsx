"use client";

import { cn } from "@/lib/cn";

/**
 * Selectable chips (single or multi). Selected chip: fondo primary-soft +
 * borde primary (README option seleccionada). Accessible via aria-pressed.
 */
export function ChipGroup({
  options,
  value,
  onChange,
  multiple = true,
  columns,
}: {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean;
  columns?: 1 | 2 | 3;
}) {
  function toggle(opt: string) {
    if (multiple) {
      onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
    } else {
      onChange([opt]);
    }
  }
  return (
    <div
      className={cn(
        "grid gap-2.5",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        (!columns || columns === 3) && "grid-cols-2 sm:grid-cols-3",
      )}
    >
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(opt)}
            className={cn(
              "rounded-field border-[1.5px] px-4 py-3 text-left text-[14px] font-semibold transition-colors duration-200 ease-out",
              active
                ? "border-primary bg-primary-soft text-ink"
                : "border-border-input bg-surface text-body hover:border-body",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
