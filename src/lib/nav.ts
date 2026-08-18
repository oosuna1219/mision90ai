import type { ComponentType } from "react";
import {
  IconChart,
  IconChat,
  IconGear,
  IconHabits,
  IconHome,
  IconPlan,
  IconReport,
  IconTimer,
  IconTrophy,
  IconUser,
} from "@/components/icons";

export interface NavItem {
  route: number;
  href: string;
  label: string;
  title: string;
  icon: ComponentType<{ className?: string }>;
  /** Shown in the mobile bottom bar (5 core destinations). */
  primary?: boolean;
}

// README "Rutas" (módulos 0–9).
export const NAV: NavItem[] = [
  { route: 0, href: "/", label: "Dashboard", title: "Dashboard", icon: IconHome, primary: true },
  { route: 1, href: "/progreso", label: "Progreso", title: "Mi progreso", icon: IconChart, primary: true },
  { route: 2, href: "/plan", label: "Plan", title: "Plan y menú", icon: IconPlan, primary: true },
  { route: 3, href: "/ayuno", label: "Ayuno", title: "Ayuno", icon: IconTimer, primary: true },
  { route: 4, href: "/habitos", label: "Hábitos", title: "Hábitos", icon: IconHabits },
  { route: 5, href: "/coach", label: "Coach", title: "Coach AI", icon: IconChat, primary: true },
  { route: 6, href: "/reportes", label: "Reportes", title: "Reportes", icon: IconReport },
  { route: 7, href: "/logros", label: "Logros", title: "Logros", icon: IconTrophy },
  { route: 8, href: "/perfil", label: "Perfil", title: "Perfil", icon: IconUser },
  { route: 9, href: "/configuracion", label: "Configuración", title: "Configuración", icon: IconGear },
];

export const PRIMARY_NAV = NAV.filter((n) => n.primary);

export function navByHref(pathname: string): NavItem {
  // Exact match for "/", prefix match for the rest.
  if (pathname === "/") return NAV[0];
  return NAV.find((n) => n.href !== "/" && pathname.startsWith(n.href)) ?? NAV[0];
}
