"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RecoverPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) return setError("Escribe un correo válido.");
    setError(null);
    // TODO: POST /auth/password/forgot
    setSent(true);
  }

  return (
    <>
      <AuthHeader
        title="Recuperar contraseña"
        subtitle="Te enviaremos un enlace para crear una nueva."
      />

      {sent ? (
        <div className="rounded-card border border-border-strong bg-primary-soft p-5 text-[15px] leading-[1.6] text-ink">
          Si <span className="font-bold">{email}</span> tiene una cuenta, el enlace
          para restablecer tu contraseña ya va en camino. Revisa tu correo.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <Field
            label="Correo"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error ? (
            <p role="alert" className="text-[13px] font-semibold text-accent">
              {error}
            </p>
          ) : null}
          <Button type="submit" fullWidth>
            Enviar enlace
          </Button>
        </form>
      )}

      <p className="mt-7 text-center text-[15px] text-body">
        <Link href="/login" className="font-bold text-primary hover:text-primary-hover">
          Volver al acceso
        </Link>
      </p>
    </>
  );
}
