"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { NAV, PRIMARY_NAV, navByHref } from "@/lib/nav";
import { useCurrentUser, type Me } from "@/lib/useCurrentUser";
import { daysBetween, formatLongDate } from "@/lib/date";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/app/ThemeToggle";
import { IconBell, IconClose, IconMenu, IconSearch } from "@/components/icons";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const active = navByHref(pathname);
  const { user, loading } = useCurrentUser();
  const [navOpen, setNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Gate: sin sesión → login (una vez resuelto /me).
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  // README: abrir el drawer cierra notificaciones y viceversa; navegar cierra ambos.
  const openNav = () => {
    setNotifOpen(false);
    setNavOpen(true);
  };
  const openNotif = () => {
    setNavOpen(false);
    setNotifOpen((v) => !v);
  };
  const closeAll = () => {
    setNavOpen(false);
    setNotifOpen(false);
  };

  const missionDay = user
    ? Math.max(1, daysBetween(new Date(user.missionStartDate), new Date()) + 1)
    : null;
  const subtitle =
    active.route === 0 && missionDay
      ? `${formatLongDate()} · día ${missionDay} de 90`
      : undefined;

  return (
    <div className="min-h-screen bg-bg-app lg:flex">
      {/* Desktop / tablet sidebar */}
      <Sidebar activeHref={active.href} user={user} />

      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar
          title={active.title}
          subtitle={subtitle}
          onBurger={openNav}
          onNotif={openNotif}
        />

        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-24 pt-[18px] md:px-6 md:pb-8 lg:px-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav activeHref={active.href} onMore={openNav} />

      {/* Overlays */}
      {(navOpen || notifOpen) && (
        <button
          aria-label="Cerrar"
          onClick={closeAll}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
        />
      )}
      <Drawer open={navOpen} activeHref={active.href} onClose={closeAll} />
      <NotificationsPanel open={notifOpen} onClose={closeAll} />
    </div>
  );
}

/* ------------------------------------------------------------------ Sidebar */

function Sidebar({ activeHref, user }: { activeHref: string; user: Me | null }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[204px] shrink-0 flex-col bg-ink-deep px-3.5 py-6 lg:flex xl:w-[252px] xl:px-[18px]">
      <div className="px-2">
        <Logo variant="wordmark-light" width={150} priority />
      </div>
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV.map((item) => (
          <SidebarLink key={item.href} item={item} active={item.href === activeHref} />
        ))}
      </nav>
      <UserChip user={user} />
    </aside>
  );
}

function SidebarLink({
  item,
  active,
}: {
  item: (typeof NAV)[number];
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-field px-3 py-2.5 text-[14px] font-bold transition-colors duration-200",
        active
          ? "bg-primary text-white"
          : "text-on-dark-2 hover:bg-white/[0.06] hover:text-white",
      )}
    >
      <Icon className="h-5 w-5" />
      {item.label}
    </Link>
  );
}

function UserChip({ user }: { user: Me | null }) {
  const name = user?.name ?? "…";
  const plan = user?.plan ?? "free";
  return (
    <div className="mt-4 flex items-center gap-3 rounded-field bg-white/[0.05] px-3 py-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[13px] font-extrabold text-white">
        {user ? initials(user.name) : "·"}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-bold text-white">{name}</p>
        <p className="truncate text-[12px] text-on-dark capitalize">Plan {plan}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- TopBar */

function TopBar({
  title,
  subtitle,
  onBurger,
  onNotif,
}: {
  title: string;
  subtitle?: string;
  onBurger: () => void;
  onNotif: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/90 px-4 py-3 backdrop-blur md:gap-4 md:px-6 md:py-4">
      <button
        onClick={onBurger}
        aria-label="Abrir menú"
        className="flex h-10 w-10 items-center justify-center rounded-field text-ink hover:bg-bg-app lg:hidden"
      >
        <IconMenu />
      </button>

      <div className="lg:hidden">
        <Logo variant="mark" width={28} />
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[17px] font-extrabold tracking-[-0.02em] text-ink md:text-[20px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="hidden truncate text-[13px] text-body md:block">{subtitle}</p>
        ) : null}
      </div>

      <div className="hidden items-center gap-2 rounded-field border border-border-input bg-bg-app px-3 py-2 text-[14px] text-muted lg:flex">
        <IconSearch className="h-[18px] w-[18px]" />
        <span>Buscar…</span>
      </div>

      <ThemeToggle />

      <button
        onClick={onNotif}
        aria-label="Notificaciones"
        className="relative flex h-10 w-10 items-center justify-center rounded-field text-ink hover:bg-bg-app"
      >
        <IconBell />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent ring-2 ring-surface" />
      </button>
    </header>
  );
}

/* ---------------------------------------------------------------- BottomNav */

function BottomNav({
  activeHref,
  onMore,
}: {
  activeHref: string;
  onMore: () => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-6 border-t border-border bg-surface/95 backdrop-blur md:hidden">
      {PRIMARY_NAV.map((item) => {
        const Icon = item.icon;
        const active = item.href === activeHref;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px] font-bold",
              active ? "text-primary" : "text-muted",
            )}
          >
            <Icon className="h-[22px] w-[22px]" />
            {item.label}
          </Link>
        );
      })}
      <button
        onClick={onMore}
        className="flex min-h-[56px] flex-col items-center justify-center gap-1 text-[11px] font-bold text-muted"
      >
        <IconMenu className="h-[22px] w-[22px]" />
        Más
      </button>
    </nav>
  );
}

/* ------------------------------------------------------------------- Drawer */

function Drawer({
  open,
  activeHref,
  onClose,
}: {
  open: boolean;
  activeHref: string;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col bg-ink-deep px-4 py-6 transition-transform duration-200 ease-out lg:hidden",
        open ? "translate-x-0" : "-translate-x-full",
      )}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between px-2">
        <Logo variant="wordmark-light" width={150} />
        <button
          onClick={onClose}
          aria-label="Cerrar menú"
          className="flex h-9 w-9 items-center justify-center rounded-field text-on-dark-2 hover:bg-white/[0.06] hover:text-white"
        >
          <IconClose className="h-5 w-5" />
        </button>
      </div>
      <nav className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.href === activeHref;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-field px-3 py-3 text-[15px] font-bold transition-colors",
                active ? "bg-primary text-white" : "text-on-dark-2 hover:bg-white/[0.06] hover:text-white",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

/* -------------------------------------------------------- NotificationsPanel */

const NOTIFS = [
  { title: "Tu ventana de ayuno termina a las 11:00", time: "hace 5 min", unread: true },
  { title: "Registra tu peso de hoy para no perder la racha", time: "hace 2 h", unread: true },
  { title: "Reporte semanal listo: bajaste 1.4 kg", time: "ayer", unread: false },
];

function NotificationsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "fixed right-0 top-0 z-50 flex h-full w-[340px] max-w-[90vw] flex-col border-l border-border bg-surface transition-transform duration-200 ease-out",
        open ? "translate-x-0" : "translate-x-full",
      )}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-[17px] font-extrabold text-ink">Notificaciones</h2>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="flex h-9 w-9 items-center justify-center rounded-field text-body hover:bg-bg-app"
        >
          <IconClose className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-col divide-y divide-border overflow-y-auto">
        {NOTIFS.map((n, i) => (
          <div key={i} className="flex gap-3 px-5 py-4">
            <span
              className={cn(
                "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                n.unread ? "bg-primary" : "bg-border-input",
              )}
            />
            <div>
              <p className="text-[14px] leading-[1.5] text-ink">{n.title}</p>
              <p className="mt-0.5 text-[12px] text-muted">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
