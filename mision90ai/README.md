# Misión 90 AI — app

Implementación en Next.js del handoff en
`Priorización de pantallas y funcionalidades/design_handoff_mision90ai/README.md`.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El build de producción (`npm run build`) descarga la
fuente Manrope desde Google Fonts, así que necesita conexión a internet la primera vez.

## Qué está implementado

- **Layout responsive** (`src/components/app-shell.tsx`): sidebar oscuro fijo en tablet/escritorio, topbar
  con buscador y notificaciones, drawer + barra inferior de 5 destinos en móvil. Breakpoints propios
  `tablet` (834px) y `desktop` (1440px) definidos en `src/app/globals.css`.
- **Flujo de acceso** (`src/app/(auth)/…`): `/login`, `/registro`, `/whatsapp`, `/recuperar`, con el panel
  oscuro de marca y el formulario centrado, medidor de fuerza de contraseña y código de 6 dígitos con
  temporizador de reenvío.
- **Dashboard** (`src/app/(app)/page.tsx`): los 4 estados de datos del handoff — cargando (esqueletos),
  vacío, error (con reintento) y con datos — servidos por un mock de `GET /api/dashboard`
  (`src/app/api/dashboard/route.ts`). Incluye temporizador de ayuno en vivo, contador de agua, checklist de
  hábitos y comidas del día, todos interactivos.
  - Para forzar un estado durante QA: `/?demo=load`, `/?demo=empty`, `/?demo=err`.
- **Los otros 9 módulos** (`/progreso`, `/plan`, `/ayuno`, `/habitos`, `/coach`, `/reportes`, `/logros`,
  `/perfil`, `/configuracion`) están montados como rutas reales con una pantalla "próximamente" para que la
  navegación no rompa — su contenido final es el siguiente paso.

## Design tokens

Colores, radios y sombra están en `@theme` dentro de `src/app/globals.css`, con los mismos nombres que la
tabla de tokens del handoff (`primary`, `ink-deep`, `border-input`, etc.) para usarlos como clases Tailwind
(`bg-ink-deep`, `text-text-muted`, `rounded-card-lg`…).

## Pendiente (fuera de esta primera entrega)

- Autenticación real (sesión JWT httpOnly, verificación de WhatsApp) — hoy los formularios navegan sin
  backend.
- Los 9 módulos restantes con su contenido real.
- Onboarding de 8 pasos.
- Conectar `/api/dashboard` y el resto de endpoints sugeridos a la base de datos real.
