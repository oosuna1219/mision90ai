"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

interface Msg {
  role: "user" | "coach";
  text: string;
}

// Arranques rápidos: envían un mensaje real al coach.
const SUGGESTIONS = [
  "Ajusta mi menú de esta semana",
  "Arma mi lista de compras",
  "¿Cómo voy con mi progreso?",
];

const GREETING: Msg = {
  role: "coach",
  text: "Hola, soy tu coach. Puedo revisar tu peso, ayuno, agua y hábitos y ajustarte el plan. ¿En qué te ayudo hoy?",
};

export default function CoachPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Carga el historial real al entrar.
  useEffect(() => {
    fetch("/api/coach/messages", { cache: "no-store" })
      .then((r) => {
        if (r.status === 401) {
          router.push("/login");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d?.messages?.length) setMessages([GREETING, ...d.messages]);
      })
      .catch(() => {});
  }, [router]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || sending) return;
    setError(null);
    setDraft("");
    setMessages((m) => [...m, { role: "user", text: message }]);
    setSending(true);
    try {
      const res = await fetch("/api/coach/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });
      if (res.status === 401) return router.push("/login");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "El coach no está disponible.");
        return;
      }
      setMessages((m) => [...m, { role: "coach", text: data.reply }]);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Card className="flex h-[calc(100vh-160px)] min-h-[520px] flex-col !p-0">
      {/* Mensajes */}
      <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] whitespace-pre-wrap rounded-card px-4 py-3 text-[15px] leading-[1.55]",
                m.role === "user" ? "bg-primary text-white" : "border border-border bg-bg-app text-ink",
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-card border border-border bg-bg-app px-4 py-3 text-[15px] text-body">
              El coach está escribiendo…
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-start">
            <div className="rounded-card border border-accent/30 bg-accent/[0.06] px-4 py-3 text-[14px] font-semibold text-accent">
              {error}
            </div>
          </div>
        )}
      </div>

      {/* Sugerencias */}
      <div className="flex flex-wrap gap-2 border-t border-border px-5 py-3">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={sending}
            className="rounded-full border border-border-input bg-surface px-3.5 py-2 text-[13px] font-bold text-primary transition-colors hover:bg-primary-soft disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Entrada */}
      <div className="flex items-center gap-2 border-t border-border p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(draft)}
          placeholder="Escríbele a tu coach…"
          aria-label="Mensaje para el coach"
          disabled={sending}
          className="flex-1 rounded-field border-[1.5px] border-border-input bg-surface px-3.5 py-3 text-[15px] text-ink outline-none focus:border-primary disabled:opacity-60"
        />
        <button
          onClick={() => send(draft)}
          disabled={sending}
          aria-label="Enviar"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-field bg-primary text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
        >
          ↑
        </button>
      </div>
    </Card>
  );
}
