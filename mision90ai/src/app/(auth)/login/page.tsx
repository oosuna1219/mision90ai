import Link from "next/link";

export const metadata = { title: "Acceso · Misión 90 AI" };

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-col gap-[7px]">
        <h2 className="text-[27px] font-extrabold tracking-[-.03em] text-ink">Bienvenido de vuelta</h2>
        <p className="text-[15px] text-text-body">Continúa en el día 24 de tu misión.</p>
      </div>

      <form className="flex flex-col gap-[14px]" action="/" method="get">
        <label className="flex flex-col gap-[7px]">
          <span className="field-label">Correo electrónico</span>
          <input type="email" name="email" required placeholder="tu@correo.com" className="field-input" />
        </label>
        <label className="flex flex-col gap-[7px]">
          <span className="flex items-center justify-between">
            <span className="field-label">Contraseña</span>
            <Link href="/recuperar" className="text-xs font-bold text-primary hover:text-primary-hover">
              ¿La olvidaste?
            </Link>
          </span>
          <input type="password" name="password" required minLength={8} className="field-input" />
        </label>
        <label className="flex cursor-pointer items-center gap-[10px]">
          <input type="checkbox" name="remember" defaultChecked className="h-[17px] w-[17px] accent-primary" />
          <span className="text-[13px] font-semibold text-text-body">Mantener mi sesión abierta</span>
        </label>

        <div className="flex flex-col gap-3 pt-1">
          <button type="submit" className="btn-primary">
            Entrar
          </button>
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-bold text-text-muted">o</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <Link href="/whatsapp" className="btn-secondary flex items-center justify-center gap-[10px]">
            <span className="h-[9px] w-[9px] rounded-full bg-success" />
            Recibir código por WhatsApp
          </Link>
        </div>
      </form>

      <p className="text-center text-sm text-text-body">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-bold text-primary hover:text-primary-hover">
          Crear una
        </Link>
      </p>
    </div>
  );
}
