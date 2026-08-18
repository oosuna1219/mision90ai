"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MOBILE_BOTTOM_ITEMS,
  NAV_FOOTER_ITEMS,
  NAV_ITEMS,
  routeMeta,
} from "@/lib/nav";

function NavIcon({ shape, active }: { shape: "square" | "circle"; active: boolean }) {
  return (
    <span
      className={`h-[18px] w-[18px] flex-none border-2 ${
        shape === "circle" ? "rounded-full" : "rounded-[5px]"
      } ${active ? "border-white" : "border-text-on-dark"}`}
    />
  );
}

function SidebarLink({
  href,
  label,
  shape,
  active,
}: {
  href: string;
  label: string;
  shape: "square" | "circle";
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-[10px] p-3 text-sm font-semibold transition-colors ${
        active ? "bg-white/12 text-white" : "text-text-on-dark hover:bg-white/8"
      }`}
    >
      <NavIcon shape={shape} active={active} />
      <span>{label}</span>
    </Link>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { label, subtitle } = routeMeta(pathname);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  function toggleNav() {
    setNotifOpen(false);
    setNavOpen((v) => !v);
  }
  function toggleNotif() {
    setNavOpen(false);
    setNotifOpen((v) => !v);
  }
  function closeOverlays() {
    setNavOpen(false);
    setNotifOpen(false);
  }

  return (
    <div className="flex min-h-dvh bg-bg-app">
      {/* Sidebar oscuro fijo — tablet y escritorio */}
      <aside className="hidden w-[204px] flex-none flex-col gap-[22px] bg-ink-deep px-[14px] py-[22px] tablet:flex desktop:w-[252px] desktop:px-[18px] desktop:py-6">
        <div className="flex items-center gap-[11px]">
          <span className="grid h-10 w-10 flex-none place-items-center rounded-[11px] bg-white">
            <Image src="/assets/logo-mark.png" alt="Misión 90 AI" width={32} height={32} className="object-contain" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-tight text-white">Misión 90 AI</span>
            <span className="text-[11px] font-semibold text-text-on-dark">Día 24 de 90</span>
          </div>
        </div>

        <nav className="flex flex-col gap-[3px]">
          {NAV_ITEMS.map((item) => (
            <SidebarLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-[3px] border-t border-white/10 pt-4">
          {NAV_FOOTER_ITEMS.map((item) => (
            <SidebarLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 tablet:gap-4 desktop:px-6 desktop:py-4">
          <button
            type="button"
            onClick={toggleNav}
            aria-label="Abrir menú"
            className="flex flex-none flex-col gap-1 rounded-[9px] border border-border p-[9px] tablet:hidden"
          >
            <span className="h-[2px] w-4 rounded-full bg-ink" />
            <span className="h-[2px] w-4 rounded-full bg-ink" />
            <span className="h-[2px] w-4 rounded-full bg-ink" />
          </button>
          <Image
            src="/assets/logo-mark.png"
            alt="Misión 90 AI"
            width={32}
            height={32}
            className="object-contain tablet:hidden"
          />
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-[17px] font-extrabold tracking-tight text-ink desktop:text-xl">
              {label}
            </span>
            <span className="hidden text-xs font-semibold text-text-muted tablet:block">{subtitle}</span>
          </div>
          <div className="ml-auto hidden min-w-[240px] items-center gap-[10px] rounded-[11px] border border-border bg-bg-app px-[15px] py-[11px] desktop:flex">
            <span className="h-[13px] w-[13px] rounded-full border-2 border-text-muted" />
            <span className="text-[13px] text-text-muted">Buscar receta, medida o registro</span>
          </div>
          <div className="ml-auto flex items-center gap-[10px] desktop:ml-0">
            <button
              type="button"
              onClick={toggleNotif}
              aria-label="Notificaciones"
              className="relative grid h-[38px] w-[38px] place-items-center rounded-[11px] border border-border hover:bg-bg-app"
            >
              <span className="h-[14px] w-[14px] rounded-t-[4px] rounded-b-[7px] border-2 border-ink" />
              <span className="absolute right-2 top-[7px] h-2 w-2 rounded-full border-2 border-white bg-accent" />
            </button>
            <Link
              href="/perfil"
              className="grid h-[38px] w-[38px] place-items-center rounded-full bg-ink text-sm font-extrabold text-white"
            >
              O
            </Link>
          </div>
        </div>

        {/* Drawer móvil */}
        {navOpen && (
          <div className="flex flex-wrap gap-2 bg-ink-deep px-5 py-3.5 tablet:hidden">
            {[...NAV_ITEMS, ...NAV_FOOTER_ITEMS].map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeOverlays}
                  className={`rounded-full px-[14px] py-[10px] text-[13px] font-bold ${
                    active ? "bg-primary text-white" : "bg-white/8 text-text-on-dark-2"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Panel de notificaciones */}
        {notifOpen && (
          <div className="flex flex-col gap-[10px] border-b border-border bg-surface px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-extrabold text-ink">Notificaciones</span>
              <button type="button" onClick={() => setNotifOpen(false)} className="text-xs font-bold text-primary">
                Cerrar
              </button>
            </div>
            {[
              { color: "bg-accent", bg: "bg-[#FEF3E2]", border: "border-[#FBE0BA]", title: "Tu ayuno termina en 1h 23m", time: "Hace 4 minutos" },
              { color: "bg-primary", bg: "bg-bg-app", border: "border-border", title: "Coach AI ajustó tu menú de la semana", time: "Hoy, 8:10 AM" },
              { color: "bg-success", bg: "bg-bg-app", border: "border-border", title: "Logro desbloqueado: racha de 12 días", time: "Ayer, 9:02 PM" },
            ].map((n) => (
              <div key={n.title} className={`flex items-start gap-[11px] rounded-xl ${n.bg} border ${n.border} p-[13px]`}>
                <span className={`mt-1.5 h-2 w-2 flex-none rounded-full ${n.color}`} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-bold text-ink">{n.title}</span>
                  <span className="text-xs text-text-body">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <main
          onClick={() => (navOpen || notifOpen) && closeOverlays()}
          className="flex min-w-0 flex-1 flex-col gap-3.5 px-4 pb-[100px] pt-[18px] tablet:gap-[18px] tablet:px-6 tablet:pb-6 tablet:pt-6 desktop:px-8 desktop:pb-8 desktop:pt-7"
        >
          {children}
        </main>

        {/* Barra inferior móvil */}
        <nav className="sticky bottom-0 grid grid-cols-5 items-end border-t border-border bg-[rgba(255,255,255,.97)] px-1.5 pb-4 pt-2.5 tablet:hidden">
          {MOBILE_BOTTOM_ITEMS.slice(0, 2).map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-[5px]">
                <span className={`h-5 w-5 rounded-[6px] border-2 ${active ? "border-ink" : "border-text-muted"}`} />
                <span className={`text-[10px] font-bold ${active ? "text-ink" : "text-text-muted"}`}>{item.label}</span>
              </Link>
            );
          })}
          <div className="grid place-items-center">
            <button
              type="button"
              aria-label="Registro rápido"
              className="mt-[-28px] grid h-14 w-14 place-items-center rounded-full bg-accent text-2xl text-white shadow-[0_10px_22px_-8px_rgba(242,101,34,.75)]"
            >
              +
            </button>
          </div>
          {MOBILE_BOTTOM_ITEMS.slice(2).map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-[5px]">
                <span className={`h-5 w-5 rounded-[6px] border-2 ${active ? "border-ink" : "border-text-muted"}`} />
                <span className={`text-[10px] font-bold ${active ? "text-ink" : "text-text-muted"}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
