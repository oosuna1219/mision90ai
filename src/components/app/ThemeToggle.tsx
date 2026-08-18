"use client";

import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "@/components/icons";

type Theme = "light" | "dark";
const KEY = "m90-theme";

// El tema se aplica antes del paint con un script inline en el layout (sin flash).
// Aquí solo sincronizamos el estado del botón con lo que ya quedó en <html>.
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme) || "light";
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="flex h-10 w-10 items-center justify-center rounded-field text-ink hover:bg-bg-app"
    >
      {/* Evita el mismatch de hidratación mostrando el icono solo tras montar. */}
      {mounted ? theme === "dark" ? <IconSun /> : <IconMoon /> : <IconMoon />}
    </button>
  );
}
