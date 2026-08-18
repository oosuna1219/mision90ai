"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthDivider, AuthHeader } from "@/components/auth/AuthHeader";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) return setError("Escribe un correo válido.");
    if (password.length < 8) return setError("La contraseña tiene mínimo 8 caracteres.");
    setError(null);
    // TODO: POST /auth/login. Prototipo: entra directo a la app.
    router.push("/");
  }

  return (
    <>
      <AuthHeader title="Bienvenido de vuelta" subtitle="Retoma tu misión donde la dejaste." />

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
        <Field
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          labelAside={
            <Link
              href="/recuperar"
              className="text-[13px] font-bold text-primary hover:text-primary-hover"
            >
              ¿Olvidaste?
            </Link>
          }
        />

        <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-body">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-[18px] w-[18px] rounded"
            style={{ accentColor: "rgb(var(--primary))" }}
          />
          Mantener sesión
        </label>

        {error ? (
          <p role="alert" className="text-[13px] font-semibold text-accent">
            {error}
          </p>
        ) : null}

        <Button type="submit" fullWidth>
          Entrar
        </Button>
      </form>

      <AuthDivider />

      <Button
        type="button"
        variant="secondary"
        fullWidth
        onClick={() => router.push("/whatsapp")}
      >
        <span
          className="h-2 w-2 rounded-full bg-success"
          aria-hidden
        />
        Recibir código por WhatsApp
      </Button>

      <p className="mt-7 text-center text-[15px] text-body">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-bold text-primary hover:text-primary-hover">
          Crear una
        </Link>
      </p>
    </>
  );
}
