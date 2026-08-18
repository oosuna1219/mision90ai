"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthHeader } from "@/components/auth/AuthHeader";
import {
  PasswordStrength,
  isValidPassword,
} from "@/components/auth/PasswordStrength";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Formato internacional, p. ej. +52 55 0000 0000.
const WA_RE = /^\+\d{1,3}[\s\d]{7,}$/;

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Escribe tu nombre.");
    if (!EMAIL_RE.test(email)) return setError("Escribe un correo válido.");
    if (!WA_RE.test(whatsapp)) return setError("WhatsApp en formato internacional: +52 55 0000 0000.");
    if (!isValidPassword(password))
      return setError("La contraseña necesita 8+ caracteres, una mayúscula y un número.");
    if (!accepted) return setError("Acepta los términos para continuar.");
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, whatsapp, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "No pudimos crear tu cuenta.");
        return;
      }
      router.push("/onboarding");
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AuthHeader
        title="Crea tu cuenta"
        subtitle="Empieza tu misión de 90 días en dos minutos."
      />

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Field
          label="Nombre"
          autoComplete="name"
          placeholder="Oswal Ramírez"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          label="WhatsApp"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+52 55 0000 0000"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <Field
            label="Contraseña"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordStrength value={password} />
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.5] text-body">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 h-[18px] w-[18px] rounded"
            style={{ accentColor: "rgb(var(--primary))" }}
          />
          <span>
            Acepto los{" "}
            <a href="#" className="font-bold text-primary hover:text-primary-hover">
              términos
            </a>{" "}
            y el{" "}
            <a href="#" className="font-bold text-primary hover:text-primary-hover">
              aviso de privacidad
            </a>
            .
          </span>
        </label>

        {error ? (
          <p role="alert" className="text-[13px] font-semibold text-accent">
            {error}
          </p>
        ) : null}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Creando…" : "Crear cuenta"}
        </Button>
      </form>

      <p className="mt-7 text-center text-[15px] text-body">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-bold text-primary hover:text-primary-hover">
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
