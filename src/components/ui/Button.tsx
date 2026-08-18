import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "dark";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-field text-[15px] font-bold " +
  "transition-all duration-200 ease-out disabled:opacity-50 disabled:pointer-events-none";

const VARIANTS: Record<Variant, string> = {
  // README: botón primario #2563EB → #1D4ED8 en hover, padding 16, radio 12.
  primary: "bg-primary text-white hover:bg-primary-hover px-5 py-4",
  // Secundario blanco con borde 1.5px #D3DBE6.
  secondary:
    "bg-surface text-ink border-[1.5px] border-border-input hover:bg-bg-app px-5 py-4",
  ghost: "bg-transparent text-body hover:text-ink px-3 py-2",
  dark: "bg-white/10 text-white hover:bg-white/[0.16] px-5 py-4",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", fullWidth, className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(BASE, VARIANTS[variant], fullWidth && "w-full", className)}
      {...props}
    />
  );
});
