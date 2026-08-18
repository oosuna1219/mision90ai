"use client";

import Link from "next/link";
import { useState } from "react";

export default function RecuperarPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex flex-col gap-[7px]">
        <h2 className="text-[27px] font-extrabold tracking-[-.03em] text-ink">Recuperar acceso</h2>
        <p className="text-[15px] leading-[1.5] text-text-body">
          Te enviamos un enlace para crear una contraseña nueva.
        </p>
      </div>

      <form
        className="flex flex-col gap-[22px]"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <label className="flex flex-col gap-[7px]">
          <span className="field-label">Correo electrónico</span>
          <input type="email" name="email" required placeholder="tu@correo.com" className="field-input" />
        </label>

        {sent && (
          <div className="flex items-start gap-[11px] rounded-xl border border-[#D8EEE1] bg-[#EAF8EF] px-4 py-[15px]">
            <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-success" />
            <p className="text-[13px] leading-[1.55] text-[#1E5E38]">
              Si el correo existe en el sistema, el enlace llega en menos de un minuto y expira en 30.
            </p>
          </div>
        )}

        <button type="submit" className="btn-primary">
          Enviar enlace
        </button>
      </form>

      <Link href="/login" className="text-center text-sm font-bold text-primary hover:text-primary-hover">
        Volver al inicio de sesión
      </Link>
    </div>
  );
}
