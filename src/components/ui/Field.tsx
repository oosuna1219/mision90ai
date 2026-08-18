"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

const INPUT =
  "w-full rounded-field border-[1.5px] border-border-input bg-surface px-3.5 py-3 " +
  "text-[15px] text-ink placeholder:text-muted outline-none " +
  "transition-colors duration-200 ease-out focus:border-primary";

export interface FieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Optional node rendered at the right of the label row (e.g. "¿Olvidaste?"). */
  labelAside?: React.ReactNode;
  hint?: string;
}

// README "Accesibilidad": every field has an associated <label for>.
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, labelAside, hint, id, className, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor={inputId} className="text-[13px] font-bold text-ink">
          {label}
        </label>
        {labelAside}
      </div>
      <input id={inputId} ref={ref} className={cn(INPUT, className)} {...props} />
      {hint ? <p className="text-[13px] text-body">{hint}</p> : null}
    </div>
  );
});
