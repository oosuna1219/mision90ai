export type NavItem = {
  href: string;
  label: string;
  subtitle: string;
  shape: "square" | "circle";
};

// Orden y rutas según README §Rutas. Index = route # del prototipo.
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", subtitle: "Domingo 17 de agosto · día 24 de 90", shape: "square" },
  { href: "/progreso", label: "Mi progreso", subtitle: "Peso, medidas y fotos", shape: "square" },
  { href: "/plan", label: "Plan y menú", subtitle: "Keto + 16:8 · semana 4", shape: "square" },
  { href: "/ayuno", label: "Ayuno", subtitle: "Ventana 16:8 · 19:00 a 11:00", shape: "square" },
  { href: "/habitos", label: "Hábitos", subtitle: "6 hábitos activos", shape: "square" },
  { href: "/coach", label: "Coach AI", subtitle: "Lee tus registros reales", shape: "square" },
  { href: "/reportes", label: "Reportes", subtitle: "Semanal, mensual y trimestral", shape: "square" },
  { href: "/logros", label: "Logros", subtitle: "Nivel 3 · 1,240 puntos", shape: "square" },
];

export const NAV_FOOTER_ITEMS: NavItem[] = [
  { href: "/perfil", label: "Perfil", subtitle: "Oswal Ramírez · plan Premium", shape: "circle" },
  { href: "/configuracion", label: "Configuración", subtitle: "Notificaciones, unidades y privacidad", shape: "square" },
];

export const ALL_NAV_ITEMS = [...NAV_ITEMS, ...NAV_FOOTER_ITEMS];

// Los 5 destinos de la barra inferior móvil (README §Breakpoints)
export const MOBILE_BOTTOM_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/progreso", label: "Progreso" },
  { href: "/plan", label: "Plan" },
  { href: "/coach", label: "Coach" },
];

export function routeMeta(pathname: string): { label: string; subtitle: string } {
  const item = ALL_NAV_ITEMS.find((i) =>
    i.href === "/" ? pathname === "/" : pathname.startsWith(i.href)
  );
  return item ?? { label: "Misión 90 AI", subtitle: "" };
}
