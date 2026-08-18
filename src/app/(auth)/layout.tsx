import { AuthAside } from "@/components/auth/AuthAside";
import { Logo } from "@/components/ui/Logo";

/**
 * Access-flow shell. README "Acceso": desktop grid de 2 columnas (panel oscuro
 * 1.05fr + formulario 1fr centrado, ancho máx ~420px); tablet/móvil solo el
 * formulario a ancho completo. Altura mínima 760px.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-page p-0 md:grid md:place-items-center md:p-6">
      <div className="mx-auto grid min-h-screen w-full overflow-hidden bg-surface shadow-frame md:min-h-[760px] md:max-w-[1100px] md:rounded-card-lg lg:grid-cols-[1.05fr_1fr]">
        <AuthAside />
        <main className="flex flex-col justify-center px-6 py-14 md:px-10 lg:px-12">
          {/* Logo shown above the form on tablet/mobile (aside is hidden there). */}
          <div className="mb-8 lg:hidden">
            <Logo variant="wordmark" width={180} priority />
          </div>
          <div className="mx-auto w-full max-w-[420px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
