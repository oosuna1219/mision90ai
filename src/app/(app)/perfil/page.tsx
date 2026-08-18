"use client";

import { useState } from "react";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { mockUser } from "@/lib/mock";
import { cn } from "@/lib/cn";

// Permisos granulares e independientes del nutriólogo (README "Perfil").
const PERMISSIONS = [
  { key: "viewWeight", label: "Ver peso y medidas", on: true },
  { key: "viewPhotos", label: "Ver fotos de progreso", on: false },
  { key: "viewMeals", label: "Ver registros de comida", on: true },
  { key: "editPlan", label: "Editar el plan", on: true },
  { key: "editFasting", label: "Editar protocolo de ayuno", on: false },
  { key: "viewReports", label: "Ver reportes", on: true },
  { key: "writeNotes", label: "Escribir notas", on: true },
];

const DEVICES = [
  { icon: "⚖️", name: "Báscula Bluetooth", brand: "Renpho ES-CS20M", connected: true, sync: "hace 3 h" },
  { icon: "⌚", name: "Wearable", brand: "Apple Watch SE", connected: true, sync: "hace 12 min" },
  { icon: "💍", name: "Anillo de sueño", brand: "Oura Gen3", connected: false, sync: "—" },
];

export default function PerfilPage() {
  const [perms, setPerms] = useState(PERMISSIONS);

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Datos y plan */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-[22px] font-extrabold text-white">
            {mockUser.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[20px] font-extrabold text-ink">{mockUser.name}</p>
            <p className="text-[14px] text-body">{mockUser.email}</p>
          </div>
          <span className="rounded-full bg-primary-soft px-3 py-1 text-[13px] font-bold capitalize text-primary">
            Plan {mockUser.plan}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Día de misión" value={`${mockUser.missionDay} / 90`} />
          <Stat label="Nivel" value={`Nivel ${mockUser.level}`} />
          <Stat label="Puntos" value={mockUser.points.toLocaleString("es-MX")} />
          <Stat label="WhatsApp" value={mockUser.whatsapp} />
        </div>
      </Card>

      {/* Rol nutriólogo */}
      <Card>
        <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
          <CardEyebrow>Acceso de nutriólogo</CardEyebrow>
          <Button variant="secondary" className="!px-4 !py-2 text-[13px]">
            Invitar profesional
          </Button>
        </div>
        <p className="mb-4 text-[14px] leading-[1.6] text-body">
          Otorga permisos independientes. Revocar el acceso cierra sus sesiones al instante.
        </p>
        <ul className="flex flex-col divide-y divide-border">
          {perms.map((p, i) => (
            <li key={p.key} className="flex items-center justify-between py-3">
              <span className="text-[15px] font-semibold text-ink">{p.label}</span>
              <Switch
                checked={p.on}
                label={p.label}
                onChange={(v) =>
                  setPerms((prev) => {
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

      {/* Dispositivos conectados */}
      <Card>
        <CardEyebrow>Dispositivos conectados</CardEyebrow>
        <ul className="mt-3 flex flex-col gap-2.5">
          {DEVICES.map((d) => (
            <li
              key={d.name}
              className="flex items-center gap-3 rounded-field border border-border bg-bg-app px-4 py-3"
            >
              <span className="text-2xl" aria-hidden>{d.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold text-ink">{d.name}</p>
                <p className="text-[13px] text-body">{d.brand}</p>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-[13px] font-bold",
                    d.connected ? "text-success" : "text-muted",
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full", d.connected ? "bg-success" : "bg-border-input")} />
                  {d.connected ? "Conectado" : "Desconectado"}
                </span>
                <p className="text-[12px] text-muted">Sinc. {d.sync}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-border bg-bg-app p-3">
      <p className="eyebrow mb-1">{label}</p>
      <p className="text-[15px] font-extrabold text-ink">{value}</p>
    </div>
  );
}
