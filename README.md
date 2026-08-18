# Misión 90 AI

Plataforma de acompañamiento de salud de 90 días. Este repo implementa el
[design handoff](./Priorización%20de%20pantallas%20y%20funcionalidades/design_handoff_mision90ai/README.md)
en **Next.js (App Router) + TypeScript + Tailwind CSS**.

## Estado de esta entrega

Implementado en este pase:

- **Layout / shell de la app** — sidebar oscuro fijo (escritorio), top bar,
  barra inferior de 5 destinos + drawer y panel de notificaciones (móvil),
  mutuamente excluyentes.
- **Flujo de acceso** — `/login`, `/registro` (con medidor de fuerza de
  contraseña), `/whatsapp` (código de 6 dígitos con reenvío), `/recuperar`, y
  `/onboarding` (asistente de 8 pasos + pantalla de plan generado con macros
  reales calculados vía Mifflin-St Jeor).
- **Dashboard** (`/`) — peso + delta, racha, ventana de ayuno con temporizador
  en vivo, agua (12 vasos, botón +, barra), hábitos con checkboxes de 44px, y
  mini-gráfica de peso. Incluye los **4 estados** diseñados (con datos, cargando,
  vacío, error) — conmutables con el selector "Demo · estado" (aid temporal, no
  la barra de revisión del prototipo).
- Los otros 9 módulos (progreso, plan, ayuno, hábitos, coach, reportes, logros,
  perfil, configuración) están como **stubs navegables**.

Los datos son de ejemplo (`src/lib/mock.ts`, usuario "Oswal Ramírez", día 24 de
90). La lógica de negocio (macros, IMC, agua, racha, ayuno, proyección, niveles)
vive en `src/lib/business.ts` como funciones puras.

## Requisitos

Necesitas **Node.js 18.18+** (o 20+). No está instalado en este equipo — instálalo
desde <https://nodejs.org> (LTS).

## Correr en local

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>.

Rutas de acceso: `/login`, `/registro`, `/whatsapp`, `/recuperar`, `/onboarding`.

## Deploy a IONOS Deploy Now (subdominio)

Deploy Now **no ejecuta Node en runtime** (solo build), así que la app se sirve
como **export estático**. `next.config.mjs` ya trae `output: "export"`,
`images.unoptimized` y `trailingSlash`. `npm run build` genera la carpeta `out/`.

Pasos en el panel de IONOS:

1. En [Deploy Now](https://www.ionos.com/hosting/deploy-now) conecta este repo de
   GitHub (`oosuna1219/mision90ai`), rama `main`.
2. Detecta Next.js; confirma **build command** `npm run build` y **output dir**
   `out`. IONOS commitea un workflow de GitHub Actions con tu clave de deploy.
3. Asigna el subdominio en el panel.

> **Importante:** Deploy Now solo puede alojar este front estático (demo del
> diseño). El producto real del handoff (login JWT, base de datos, códigos de
> WhatsApp, coach IA del lado del servidor) necesita hosting con **Node en
> runtime** — IONOS VPS/Cloud Server, Vercel o Netlify. Ese backend vive en la
> rama `next16-api-base` como base de referencia (Next 16 + API routes).

## Estructura

```
src/
  app/
    (auth)/            # shell de acceso (panel oscuro + formulario)
      login, registro, whatsapp, recuperar
    onboarding/        # asistente de 8 pasos + plan generado
    (app)/             # shell autenticado (sidebar/topbar/bottom-nav)
      page.tsx         # dashboard (ruta 0)
      progreso, plan, ayuno, habitos, coach,
      reportes, logros, perfil, configuracion   # stubs
    globals.css        # design tokens (canales RGB) + utilidades base
    layout.tsx         # root: fuente Manrope
  components/
    ui/                # Button, Field, Card, Segmented, Switch, HabitCheck, ChipGroup, Logo
    auth/              # AuthAside, AuthHeader, PasswordStrength
    app/               # AppShell, ModuleStub
    dashboard/         # WeightSparkline, DashboardStates
    icons.tsx
  lib/
    types.ts, business.ts, mock.ts, nav.ts, cn.ts, useElapsed.ts
```

## Design tokens

Los colores son canales RGB en CSS variables (`globals.css`) expuestos a Tailwind
como `rgb(var(--x) / <alpha-value>)`, así que los modificadores de opacidad
funcionan en cualquier token y el **modo oscuro** (`[data-theme="dark"]`) se
resuelve sin tocar el markup. El naranja `--accent` está reservado a logo, rachas
y logros (README "Marca").
