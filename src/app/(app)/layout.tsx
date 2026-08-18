import { AppShell } from "@/components/app/AppShell";

// Authenticated app frame: sidebar (desktop) + top bar + mobile bottom nav.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
