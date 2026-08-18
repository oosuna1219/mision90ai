import Link from "next/link";
import CodeInput from "@/components/auth/code-input";

export const metadata = { title: "Código de WhatsApp · Misión 90 AI" };

export default function WhatsAppPage() {
  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-col gap-[7px]">
        <h2 className="text-[27px] font-extrabold tracking-[-.03em] text-ink">Escribe tu código</h2>
        <p className="text-[15px] leading-[1.5] text-text-body">
          Enviamos 6 dígitos por WhatsApp al <span className="font-bold text-ink">+52 55 •••• 4417</span>.
        </p>
      </div>

      <CodeInput />

      <Link href="/login" className="text-center text-sm font-bold text-primary hover:text-primary-hover">
        Usar correo y contraseña
      </Link>
    </div>
  );
}
