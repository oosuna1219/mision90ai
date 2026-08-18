"use client";

import { useMemo, useState } from "react";

// README §Validación: débil <8, media 8+, fuerte 12+ con símbolo.
// segments: cuántas de las 4 barras se pintan de verde.
function strengthOf(value: string): { segments: 0 | 2 | 3 | 4; hint: string } {
  if (value.length === 0) {
    return { segments: 0, hint: "Mínimo 8 caracteres, una mayúscula y un número." };
  }
  if (value.length >= 12 && /[^A-Za-z0-9]/.test(value)) {
    return { segments: 4, hint: "Contraseña fuerte." };
  }
  if (value.length >= 8) {
    return { segments: 2, hint: "Añade un número y un símbolo para reforzarla." };
  }
  return { segments: 0, hint: "Muy corta. Usa al menos 8 caracteres." };
}

export default function PasswordStrengthField() {
  const [value, setValue] = useState("");
  const { segments, hint } = useMemo(() => strengthOf(value), [value]);

  return (
    <label className="flex flex-col gap-[7px]">
      <span className="field-label">Contraseña</span>
      <input
        type="password"
        name="password"
        required
        minLength={8}
        placeholder="Mínimo 8 caracteres"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="field-input"
      />
      <span className="flex gap-[5px] pt-0.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-full"
            style={{ background: i < segments ? "#27AE60" : "#EDF1F7" }}
          />
        ))}
      </span>
      <span className="text-xs text-text-body">{hint}</span>
    </label>
  );
}
