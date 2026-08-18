"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

interface Msg {
  role: "user" | "coach";
  text: string;
}

// Sugerencias del prototipo: cada una inserta una pregunta real y su respuesta,
// que referencia datos concretos del usuario (README "Coach AI").
const SUGGESTIONS = [
  {
    q: "Ajusta mi menú de esta semana",
    a: "Hecho. Bajé el sodio en tres cenas, subí tu meta de agua a 3 L y moví el salmón al viernes para que llegue fresco del mercado.",
  },
  {
    q: "Arma mi lista de compras",
    a: "22 artículos para 7 días: 1.4 kg de pechuga, 1 kg de res, 700 g de salmón, 30 huevos, 4 aguacates, espinaca, calabacita, brócoli, aceite de oliva, manchego y almendras. Estimado 1,180 MXN.",
  },
  {
    q: "Cambia la cena de salmón",
    a: "Dos opciones con los mismos macros: 200 g de atún a la plancha con ensalada de pepino, o 220 g de muslo de pollo con coliflor rostizada. Ambas te dejan en 21 g de carbohidratos.",
  },
];

const GREETING: Msg = {
  role: "coach",
  text: "Hola Oswal. Vas en el día 24 con −11.2 kg. Tu cintura bajó más rápido que la balanza esta semana: buena señal. ¿En qué te ayudo?",
};

export default function CoachPage() {
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [used, setUsed] = useState<number[]>([]);
  const [draft, setDraft] = useState("");

  function ask(i: number) {
    const s = SUGGESTIONS[i];
    setMessages((m) => [...m, { role: "user", text: s.q }, { role: "coach", text: s.a }]);
    setUsed((u) => [...u, i]);
  }

  function send() {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      { role: "user", text },
      {
        role: "coach",
        text: "Tomo nota. Cuando conectemos tus registros en vivo, responderé con tus datos reales (peso, ayuno, comidas y agua).",
      },
    ]);
    setDraft("");
  }

  const remaining = SUGGESTIONS.map((_, i) => i).filter((i) => !used.includes(i));

  return (
    <Card className="flex h-[calc(100vh-160px)] min-h-[520px] flex-col !p-0">
      {/* Mensajes */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-card px-4 py-3 text-[15px] leading-[1.55]",
                m.role === "user"
                  ? "bg-primary text-white"
                  : "border border-border bg-bg-app text-ink",
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Sugerencias */}
      {remaining.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border px-5 py-3">
          {remaining.map((i) => (
            <button
              key={i}
              onClick={() => ask(i)}
              className="rounded-full border border-border-input bg-surface px-3.5 py-2 text-[13px] font-bold text-primary transition-colors hover:bg-primary-soft"
            >
              {SUGGESTIONS[i].q}
            </button>
          ))}
        </div>
      )}

      {/* Entrada */}
      <div className="flex items-center gap-2 border-t border-border p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Escríbele a tu coach…"
          aria-label="Mensaje para el coach"
          className="flex-1 rounded-field border-[1.5px] border-border-input bg-surface px-3.5 py-3 text-[15px] text-ink outline-none focus:border-primary"
        />
        <button
          onClick={send}
          aria-label="Enviar"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-field bg-primary text-white transition-colors hover:bg-primary-hover"
        >
          ↑
        </button>
      </div>
    </Card>
  );
}
