"use client";

import { useEffect, useState } from "react";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Segmented } from "@/components/ui/Segmented";
import { cn } from "@/lib/cn";

const NOTIFICATIONS = [
  { key: "weighIn", label: "Recordatorio de peso", on: true },
  { key: "water", label: "Recordatorio de agua", on: true },
  { key: "fast", label: "Inicio y fin de ayuno", on: false },
  { key: "weekly", label: "Resumen semanal", on: true },
  { key: "coach", label: "Mensajes del coach", on: false },
  { key: "product", label: "Novedades del producto", on: true },
];

export default function ConfiguracionPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [lengthUnit, setLengthUnit] = useState<"cm" | "in">("cm");
  const [lang, setLang] = useState<"es" | "en">("es");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark((document.documentElement.dataset.theme as string) === "dark");
  }, []);

  function toggleDark(v: boolean) {
    setDark(v);
    const theme = v ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("m90-theme", theme);
    } catch {}
  }

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Notificaciones */}
      <Card>
        <CardEyebrow>Notificaciones</CardEyebrow>
        <ul className="mt-2 flex flex-col divide-y divide-border">
          {notifs.map((n, i) => (
            <li key={n.key} className="flex items-center justify-between py-3">
              <span className="text-[15px] font-semibold text-ink">{n.label}</span>
              <Switch
                checked={n.on}
                label={n.label}
                onChange={(v) =>
                  setNotifs((prev) => {
                    const next = prev.slice();
                    next[i] = { ...next[i], on: v };
                    return next;
                  })
                }
              />
            </li>
          ))}
        </ul>
      </Card>

      {/* Preferencias */}
      <Card>
        <CardEyebrow>Preferencias</CardEyebrow>
        <div className="mt-3 flex flex-col gap-4">
          <Row label="Peso">
            <Segmented value={weightUnit} onChange={setWeightUnit}
              options={[{ value: "kg", label: "kg" }, { value: "lb", label: "lb" }]} />
          </Row>
          <Row label="Longitud">
            <Segmented value={lengthUnit} onChange={setLengthUnit}
              options={[{ value: "cm", label: "cm" }, { value: "in", label: "in" }]} />
          </Row>
          <Row label="Idioma">
            <Segmented value={lang} onChange={setLang}
              options={[{ value: "es", label: "Español" }, { value: "en", label: "English" }]} />
          </Row>
          <Row label="Modo oscuro">
            <Switch checked={dark} label="Modo oscuro" onChange={toggleDark} />
          </Row>
        </div>
      </Card>

      {/* Privacidad y cuenta */}
      <Card>
        <CardEyebrow>Privacidad y datos</CardEyebrow>
        <div className="mt-3 flex flex-col gap-2.5">
          <Button variant="secondary" fullWidth className="justify-start">
            Exportar mis datos
          </Button>
          <Button variant="secondary" fullWidth className="justify-start">
            Política de privacidad
          </Button>
          <Button variant="secondary" fullWidth className="justify-start">
            Cerrar sesión
          </Button>
          <button
            className={cn(
              "mt-1 rounded-field border-[1.5px] border-accent/40 px-5 py-3 text-[15px] font-bold text-accent transition-colors hover:bg-accent/10",
            )}
          >
            Eliminar cuenta
          </button>
        </div>
      </Card>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-[15px] font-semibold text-ink">{label}</span>
      {children}
    </div>
  );
}
