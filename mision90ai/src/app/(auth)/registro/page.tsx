import Link from "next/link";
import PasswordStrengthField from "@/components/auth/password-strength";

export const metadata = { title: "Crear cuenta · Misión 90 AI" };

export default function RegistroPage() {
  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-col gap-[7px]">
        <h2 className="text-[27px] font-extrabold tracking-[-.03em] text-ink">Crea tu cuenta</h2>
        <p className="text-[15px] text-text-body">Tres campos ahora, tu plan en cinco minutos.</p>
      </div>

      <form className="flex flex-col gap-[14px]" action="/onboarding" method="get">
        <label className="flex flex-col gap-[7px]">
          <span className="field-label">Nombre completo</span>
          <input name="name" required placeholder="Oswal Ramírez" className="field-input" />
        </label>
        <label className="flex flex-col gap-[7px]">
          <span className="field-label">Correo electrónico</span>
          <input type="email" name="email" required placeholder="tu@correo.com" className="field-input" />
        </label>
        <label className="flex flex-col gap-[7px]">
          <span className="field-label">WhatsApp</span>
          <input
            name="whatsapp"
            required
            placeholder="+52 55 0000 0000"
            pattern="^\+\d{1,3}\s?\d{2}\s?\d{4}\s?\d{4}$"
            className="field-input"
          />
        </label>
        <PasswordStrengthField />
        <label className="flex cursor-pointer items-start gap-[10px]">
          <input type="checkbox" required className="mt-0.5 h-[17px] w-[17px] accent-primary" />
          <span className="text-[13px] leading-[1.5] text-text-body">
            Acepto los términos y el aviso de privacidad. Entiendo que la plataforma es una herramienta de
            seguimiento y no sustituye atención médica.
          </span>
        </label>
        <button type="submit" className="btn-primary">
          Crear cuenta
        </button>
      </form>

      <p className="text-center text-sm text-text-body">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-bold text-primary hover:text-primary-hover">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
