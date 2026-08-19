"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardEyebrow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DashboardError, DashboardSkeleton } from "@/components/dashboard/DashboardStates";
import { cn } from "@/lib/cn";

interface ProfileData {
  user: { name: string; email: string; whatsapp: string | null; plan: string; level: number; points: number; missionDay: number };
  profile: { goalWeightKg: number; heightCm: number; units: string } | null;
  nutritionists: {
    id: string; name: string; status: string;
    permissions: Record<string, boolean>;
  }[];
  devices: { id: string; kind: string; brand: string; connected: boolean; lastSyncAt: string | null }[];
}

const PERM_LABELS: Record<string, string> = {
  viewWeight: "Ver peso y medidas", viewPhotos: "Ver fotos", viewMeals: "Ver comidas",
  editPlan: "Editar el plan", editFasting: "Editar ayuno", viewReports: "Ver reportes", writeNotes: "Escribir notas",
};

type UI = "load" | "ok" | "err";

export default function PerfilPage() {
  const router = useRouter();
  const [ui, setUi] = useState<UI>("load");
  const [data, setData] = useState<ProfileData | null>(null);

  const load = useCallback(async () => {
    setUi("load");
    try {
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (res.status === 401) return router.push("/login");
      const d = await res.json().catch(() => null);
      if (!res.ok || !d) return setUi("err");
      setData(d as ProfileData);
      setUi("ok");
    } catch {
      setUi("err");
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  if (ui === "load") return <DashboardSkeleton />;
  if (ui === "err" || !data) return <DashboardError onRetry={load} />;

  const u = data.user;

  return (
    <div className="flex flex-col gap-[18px]">
      {/* Datos y plan */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-[22px] font-extrabold text-white">
            {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[20px] font-extrabold text-ink">{u.name}</p>
            <p className="text-[14px] text-body">{u.email}</p>
          </div>
          <span className="rounded-full bg-primary-soft px-3 py-1 text-[13px] font-bold capitalize text-primary">
            Plan {u.plan}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Día de misión" value={`${u.missionDay} / 90`} />
          <Stat label="Nivel" value={`Nivel ${u.level}`} />
          <Stat label="Puntos" value={u.points.toLocaleString("es-MX")} />
          <Stat label="WhatsApp" value={u.whatsapp ?? "—"} />
        </div>
      </Card>

      {/* Rol nutriólogo */}
      <Card>
        <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
          <CardEyebrow>Acceso de nutriólogo</CardEyebrow>
          <Button variant="secondary" className="!px-4 !py-2 text-[13px]">Invitar profesional</Button>
        </div>
        {data.nutritionists.length === 0 ? (
          <p className="text-[14px] leading-[1.6] text-body">
            No has invitado a ningún profesional. Al invitar a un nutriólogo podrás otorgarle permisos
            granulares (ver peso, editar el plan, escribir notas) y revocarlos al instante.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {data.nutritionists.map((n) => (
              <div key={n.id} className="rounded-card border border-border bg-bg-app p-4">
                <p className="text-[15px] font-bold text-ink">{n.name} · {n.status}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(n.permissions).filter(([, v]) => v).map(([k]) => (
                    <li key={k} className="rounded-full bg-primary-soft px-2.5 py-1 text-[12px] font-bold text-primary">
                      {PERM_LABELS[k] ?? k}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Dispositivos conectados */}
      <Card>
        <CardEyebrow>Dispositivos conectados</CardEyebrow>
        {data.devices.length === 0 ? (
          <p className="mt-2 text-[14px] leading-[1.6] text-body">
            Aún no conectas dispositivos. Podrás vincular una báscula Bluetooth o un wearable para
            sincronizar tu peso y actividad automáticamente.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2.5">
            {data.devices.map((d) => (
              <li key={d.id} className="flex items-center gap-3 rounded-field border border-border bg-bg-app px-4 py-3">
                <span className="text-2xl" aria-hidden>{d.kind === "scale" ? "⚖️" : "⌚"}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-ink capitalize">{d.kind === "scale" ? "Báscula" : "Wearable"}</p>
                  <p className="text-[13px] text-body">{d.brand}</p>
                </div>
                <span className={cn("inline-flex items-center gap-1.5 text-[13px] font-bold", d.connected ? "text-success" : "text-muted")}>
                  <span className={cn("h-2 w-2 rounded-full", d.connected ? "bg-success" : "bg-border-input")} />
                  {d.connected ? "Conectado" : "Desconectado"}
                </span>
              </li>
            ))}
          </ul>
        )}
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
