"use client";

import { useEffect, useState } from "react";

export interface Me {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  plan: string;
  missionStartDate: string;
  level: number;
  points: number;
}

// Carga el usuario autenticado desde /api/auth/me (para el shell).
export function useCurrentUser() {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (alive) setUser(d.user ?? null);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { user, loading };
}
