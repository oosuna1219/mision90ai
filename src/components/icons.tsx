// Minimal stroke icon set (no icon-library dependency). 24x24, currentColor.
import { cn } from "@/lib/cn";

type P = { className?: string };
const base = "h-[22px] w-[22px]";
const svg = (className?: string) => ({
  className: cn(base, className),
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconHome = ({ className }: P) => (
  <svg {...svg(className)}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>
);
export const IconChart = ({ className }: P) => (
  <svg {...svg(className)}><path d="M4 20V4" /><path d="M4 20h16" /><path d="m7 14 3-3 3 2 4-5" /></svg>
);
export const IconPlan = ({ className }: P) => (
  <svg {...svg(className)}><path d="M7 3v18" /><path d="M17 3v18" /><path d="M4 3h16" /><path d="M4 12h16" /></svg>
);
export const IconTimer = ({ className }: P) => (
  <svg {...svg(className)}><circle cx="12" cy="13" r="8" /><path d="M12 13V9" /><path d="M9 2h6" /></svg>
);
export const IconHabits = ({ className }: P) => (
  <svg {...svg(className)}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><path d="m14 17 2 2 4-4" /></svg>
);
export const IconChat = ({ className }: P) => (
  <svg {...svg(className)}><path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12Z" /></svg>
);
export const IconReport = ({ className }: P) => (
  <svg {...svg(className)}><path d="M6 3h9l3 3v15H6z" /><path d="M14 3v4h4" /><path d="M9 13h6M9 17h6" /></svg>
);
export const IconTrophy = ({ className }: P) => (
  <svg {...svg(className)}><path d="M7 4h10v4a5 5 0 0 1-10 0z" /><path d="M7 6H4v1a3 3 0 0 0 3 3" /><path d="M17 6h3v1a3 3 0 0 1-3 3" /><path d="M12 13v4" /><path d="M8 21h8" /><path d="M10 17h4v4h-4z" /></svg>
);
export const IconUser = ({ className }: P) => (
  <svg {...svg(className)}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
export const IconGear = ({ className }: P) => (
  <svg {...svg(className)}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></svg>
);
export const IconMenu = ({ className }: P) => (
  <svg {...svg(className)}><path d="M4 6h16M4 12h16M4 18h16" /></svg>
);
export const IconBell = ({ className }: P) => (
  <svg {...svg(className)}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>
);
export const IconSearch = ({ className }: P) => (
  <svg {...svg(className)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const IconClose = ({ className }: P) => (
  <svg {...svg(className)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const IconPlus = ({ className }: P) => (
  <svg {...svg(className)}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconWater = ({ className }: P) => (
  <svg {...svg(className)}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" /></svg>
);
export const IconFlame = ({ className }: P) => (
  <svg {...svg(className)}><path d="M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.5.5-2.5 1-3 .3 1 1 1.5 1.5 1.5C10 8 11 5.5 12 3Z" /></svg>
);
export const IconSun = ({ className }: P) => (
  <svg {...svg(className)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const IconMoon = ({ className }: P) => (
  <svg {...svg(className)}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>
);
export const IconCamera = ({ className }: P) => (
  <svg {...svg(className)}><path d="M3 8h3l2-2h8l2 2h3v12H3z" /><circle cx="12" cy="13" r="3.5" /></svg>
);
