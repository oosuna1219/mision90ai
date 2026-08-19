"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Segmented } from "@/components/ui/Segmented";
import { DashboardSkeleton } from "@/components/dashboard/DashboardStates";
import { cn } from "@/lib/cn";

interface Settings {
  notifyWeighIn: boolean;
  notifyWater: boolean;
  notifyFastStart: boolean;
  notifyFastEnd: boolean;
  notifyWeeklySummary: boolean;
  notifyCoach: boolean;
  notifyProduct: boolean;
  units: "metric" | "imperial";
  language: string;
  darkMode: boolean;
}

const NOTIFS: { key: keyof Settings; label: string }[] = [
  { key: "notifyWeighIn", label: "Recordatorio de peso" },
  { key: "notifyWater", label: "Recordatorio de agua" },
  { key: "notifyFastStart", label: "Inicio y fin de ayuno" },
  { key: "notifyWeeklySummary", label: "Resumen semanal" },
  { key: "notifyCoach", label: "Mensajes del coach" },
  { key: "notifyProduct", label: "Novedades del producto" },
];

export default function ConfiguracionPage() {
  const router = useRouter();
  const [s, setS] = useState<Settings | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/settings", { cache: "no-store" });
    if (res.status === 401) return router.push("/login");
    const d = await res.json().catch(() => ({}));
    if (d.settings) setS(d.settings);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  const patch = useCallback((partial: Partial<Settings>) => {
    setS((prev) => (prev ? { ...prev, ...partial } : prev));
    fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    }).catch(() => {});
  }, []);

  function setNotif(key: keyof Settings, v: boolean) {
    // El toggle "Inicio y fin de ayuno" controla ambos campos.
    if (key === "notifyFastStart") patch({ notifyFastStart: v, notifyFastEnd: v });
    else patch({ [key]: v } as Partial<Settings>);
  }

  function toggleDark(v: boolean) {
    document.documentElement.dataset.theme = v ? "dark" : "light";
    try {
      localStorage.setItem("m90-theme", v ? "dark" : "light");
    } catch {}
    patch({ darkMode: v });
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (!s) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Notificaciones */}
      <Card>
        <CardEyebrow>Notificaciones</CardEyebrow>
        <ul className="mt-2 flex flex-col divide-y divide-border">
          {NOTIFS.map((n) => (
            <li key={n.key} className="flex items-center justify-between py-3">
              <span className="text-[15px] font-semibold text-ink">{n.label}</span>
              <Switch checked={Boolean(s[n.key])} label={n.label} onChange={(v) => setNotif(n.key, v)} />
            </li>
          ))}
        </ul>
      </Card>

      {/* Preferencias */}
      <Card>
        <CardEyebrow>Preferencias</CardEyebrow>
        <div className="mt-3 flex flex-col gap-4">
          <Row label="Unidades">
            <Segmented
              value={s.units}
              onChange={(v) => patch({ units: v })}
              options={[{ value: "metric", label: "Métrico (kg/cm)" }, { value: "imperial", label: "Imperial (lb/in)" }]}
            />
          </Row>
          <Row label="Idioma">
            <Segmented
              value={s.language === "en" ? "en" : "es"}
              onChange={(v) => patch({ language: v })}
              options={[{ value: "es", label: "Español" }, { value: "en", label: "English" }]}
            />
          </Row>
          <Row label="Modo oscuro">
            <Switch checked={s.darkMode} label="Modo oscuro" onChange={toggleDark} />
          </Row>
        </div>
      </Card>

      {/* Privacidad y cuenta */}
      <Card>
        <CardEyebrow>Privacidad y datos</CardEyebrow>
        <div className="mt-3 flex flex-col gap-2.5">
          <Button variant="secondary" fullWidth className="justify-start">Exportar mis datos</Button>
          <Button variant="secondary" fullWidth className="justify-start">Política de privacidad</Button>
          <Button variant="secondary" fullWidth className="justify-start" onClick={logout}>
            Cerrar sesión
          </Button>
          <button className={cn("mt-1 rounded-field border-[1.5px] border-accent/40 px-5 py-3 text-[15px] font-bold text-accent transition-colors hover:bg-accent/10")}>
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
