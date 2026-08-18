# Handoff: Misión 90 AI — aplicación completa

## Resumen

Misión 90 AI es una plataforma de acompañamiento de salud de 90 días: el usuario registra peso, medidas, fotos, ayuno, agua y hábitos; la app calcula su plan nutricional, su ventana de ayuno y su proyección de peso, y un coach de IA responde con base en esos registros reales. Un nutriólogo puede tener acceso, con permisos granulares, a la cuenta del usuario.

Este paquete contiene el diseño terminado de 10 módulos + flujo de acceso + onboarding, en tres anchos (390 / 834 / 1440), con todos los estados de datos definidos.

## Sobre los archivos de diseño

Los archivos `.dc.html` de este bundle son **referencias de diseño escritas en HTML**: prototipos que muestran el aspecto y el comportamiento previstos, no código de producción para copiar. La tarea es **recrear estos diseños en el entorno del proyecto destino** (React, Next.js, React Native, Flutter, etc.) usando sus patrones y librerías establecidos. Si todavía no existe un entorno — el repositorio `oosuna1219/mision90ai` está vacío al momento de este handoff — elige el stack y monta la estructura desde cero siguiendo la sección "Arquitectura sugerida".

Los estilos del prototipo están en atributos `style` inline por requisitos de la herramienta de diseño. En producción deben convertirse a la convención del proyecto (Tailwind, CSS Modules, styled-components…), preservando los valores exactos de la sección "Design tokens".

## Fidelidad

**Alta fidelidad (hifi).** Colores, tipografía, espaciado, radios y estados son finales. Recréalos con precisión. Los datos mostrados son de ejemplo (usuario "Oswal Ramírez", día 24 de 90) y deben venir de la API.

## Archivos incluidos

| Archivo | Qué es |
| --- | --- |
| `Misión 90 AI - App.dc.html` | Prototipo funcional: auth, onboarding, 10 módulos, 3 breakpoints, 4 estados de datos. **Referencia principal.** |
| `Misión 90 AI.dc.html` | Propuesta visual de venta (16 pantallas). Referencia de tono y marca, no de producto. |
| `assets/logo-mark.png` | Isotipo (solo símbolo). |
| `assets/logo-wordmark.png` | Logotipo horizontal sobre fondo claro. |
| `assets/logo-wordmark-light.png` | Logotipo horizontal sobre fondo oscuro. |
| `assets/logo-full.png` | Versión completa (símbolo + texto + tagline). |
| `support.js`, `image-slot.js` | Runtime del prototipo. No forman parte del producto. |

Cómo abrir el prototipo: `Misión 90 AI - App.dc.html` funciona en el navegador sin build. La barra superior gris ("Barra de revisión") es un control de inspección, **no es parte del producto**: permite cambiar ancho (Móvil 390 / Tablet 834 / Escritorio 1440), vista (Acceso / Onboarding / App) y estado de datos (Con datos / Cargando / Vacío / Error).

---

## Design tokens

### Color

| Token | Hex | Uso |
| --- | --- | --- |
| `primary` | `#2563EB` | Botones primarios, enlaces, selección activa, acentos de UI |
| `primary-hover` | `#1D4ED8` | Hover de enlaces y botones primarios |
| `primary-soft` | `#EAF1FF` | Fondo de tarjeta/opción seleccionada |
| `accent` | `#F26522` | **Solo** logo, rachas (streaks) y logros. Nunca en UI general |
| `ink` | `#17202A` | Texto principal, fondo de segmentos activos |
| `ink-deep` | `#0F1720` | Panel lateral oscuro (auth, onboarding, sidebar) |
| `text-body` | `#68707C` | Texto secundario |
| `text-muted` | `#98A1AE` | Etiquetas, texto terciario |
| `text-on-dark` | `#8F9BAC` | Texto secundario sobre fondo oscuro |
| `text-on-dark-2` | `#A9B4C4` | Texto de navegación inactiva sobre oscuro |
| `surface` | `#FFFFFF` | Tarjetas, campos |
| `bg-app` | `#F7F9FC` | Fondo del área de contenido |
| `bg-page` | `#EEF1F6` | Fondo del lienzo de revisión |
| `border` | `#E6EBF2` | Bordes suaves, divisores |
| `border-strong` | `#DFE5EE` | Bordes de contenedor |
| `border-input` | `#D3DBE6` | Borde de campos (1.5px) |
| `success` | `#27AE60` | Hábito cumplido, WhatsApp, switch activo |
| `success-on-dark` | `#7BE0A5` | Estado "Ayuno activo" sobre oscuro |
| `warning-on-dark` | `#FBBF6B` | Estado "Ventana de alimentación" sobre oscuro |
| `overlay-white-08` | `rgba(255,255,255,.08)` | Chip inactivo sobre oscuro |
| `overlay-white-18` | `rgba(255,255,255,.18)` | Punto de paso pendiente en onboarding |

### Tipografía

- Familia: **Manrope** (fallback `system-ui, sans-serif`). Se carga desde Google Fonts en el prototipo.
- Pesos usados: 600, 700, 800.
- Escala (px / peso / tracking):
  - Display auth y onboarding: 34 / 800 / `-.03em`, line-height 1.1
  - Título de pantalla: 27 / 800 / `-.03em`
  - Métrica grande (KPI): 30–34 / 800 / `-.02em`
  - Subtítulo de sección: 17–19 / 800 / `-.02em`
  - Cuerpo: 15 / 400–600, line-height 1.6
  - Etiqueta de campo: 13 / 700
  - Secundario: 13 / 400–600
  - Micro / eyebrow: 11–12 / 800, `letter-spacing .1em`, mayúsculas

### Espaciado, radios, sombra

- Escala de espaciado: 4, 6, 7, 8, 10, 12, 14, 16, 18, 22, 26, 28, 32, 38, 44 px (gaps de flex/grid; nunca margins entre hermanos).
- Padding de tarjeta: 18–22 px (móvil) / 22–26 px (escritorio).
- Radios: `7px` segmento interno · `10px` contenedor de segmentos · `12px` campo y botón · `16px` tarjeta · `18–20px` tarjeta grande · `50%` círculos.
- Borde de campo: `1.5px solid #D3DBE6`; foco: borde `#2563EB`, sin outline.
- Sombra de marco: `0 40px 90px -40px rgba(23,32,42,.28)`.
- Altura mínima de objetivo táctil: **44px** (checkboxes de hábitos, botones de nav móvil).

---

## Breakpoints y navegación

| Nombre | Ancho nominal | Navegación | Grid de contenido |
| --- | --- | --- | --- |
| Móvil | 390px | Barra inferior de 5 destinos + menú hamburguesa (drawer) para el resto | 1 columna |
| Tablet | 834px | Top bar con menú desplegable | KPIs en 2–3 columnas; tablas con scroll horizontal |
| Escritorio | 1440px | Sidebar oscuro fijo (`#0F1720`) + top bar | KPIs en 4 columnas; layouts de 2 columnas |

El markup es el mismo en los tres anchos; solo cambian columnas, visibilidad de la barra lateral y densidad. En producción esto debe implementarse con media queries / container queries reales (el prototipo lo simula con un estado `bp` porque no puede depender del ancho de la ventana del lienzo).

Comportamiento: abrir el drawer cierra el panel de notificaciones y viceversa. Navegar cierra ambos.

---

## Rutas

| # | Ruta | Pantalla | Propósito |
| --- | --- | --- | --- |
| — | `/login` | Acceso | Email + contraseña, "recordarme", alternativa por WhatsApp |
| — | `/registro` | Registro | Nombre, correo, WhatsApp, contraseña con medidor de fuerza |
| — | `/whatsapp` | Código WhatsApp | 6 dígitos, reenvío con temporizador |
| — | `/recuperar` | Recuperar contraseña | Envío de enlace por correo |
| — | `/onboarding` | Onboarding | Asistente de 8 pasos + pantalla de plan generado |
| 0 | `/` | Dashboard | Estado del día: peso, racha, ayuno, agua, hábitos, siguiente comida |
| 1 | `/progreso` | Mi progreso | Gráfica de peso (6 rangos), tabla de medidas, galería de fotos |
| 2 | `/plan` | Plan y menú | Menú de 7 días con macros por día |
| 3 | `/ayuno` | Ayuno | Temporizador en vivo, selección de protocolo, historial |
| 4 | `/habitos` | Hábitos | Rejilla de 14 días, marcado del día, rachas |
| 5 | `/coach` | Coach AI | Chat con sugerencias que leen los registros del usuario |
| 6 | `/reportes` | Reportes | KPIs semanales / mensuales / trimestrales + resumen escrito |
| 7 | `/logros` | Logros | Nivel, puntos, insignias obtenidas y pendientes |
| 8 | `/perfil` | Perfil | Datos, plan, rol nutriólogo con permisos, dispositivos conectados |
| 9 | `/configuracion` | Configuración | 6 interruptores, unidades, idioma, modo oscuro, privacidad |

---

## Pantallas

### Acceso (`/login`, `/registro`, `/whatsapp`, `/recuperar`)

**Layout.** Escritorio: grid de 2 columnas — panel izquierdo oscuro fijo (`#0F1720`, padding 44px 38px) y panel derecho blanco con el formulario centrado (ancho máximo ~420px). Tablet y móvil: solo el panel derecho, a ancho completo. Altura mínima 760px.

**Panel izquierdo.** Logotipo claro (236px de ancho) arriba; en medio el titular a 34/800 en blanco ("Noventa días para cambiar la relación con tu cuerpo.") y tres beneficios con viñeta circular de 7px en `#F26522`; abajo un testimonio en `#8F9BAC` con atribución en blanco 12/700.

**Login.** Título 27/800 "Bienvenido de vuelta", subtítulo 15 en `#68707C`. Campos: correo, contraseña (con enlace "¿Olvidaste?" a la derecha de la etiqueta), checkbox "Mantener sesión" (`accent-color: #2563EB`). Botón primario `#2563EB`, 16px de padding, radio 12. Divisor "o". Botón secundario blanco con borde `1.5px #D3DBE6` y punto verde `#27AE60`: "Recibir código por WhatsApp". Pie: "¿No tienes cuenta? Crear una".

**Registro.** Cuatro campos (nombre, correo, WhatsApp, contraseña) + medidor de fuerza de contraseña (barra segmentada) + aceptación de términos. Al enviar entra al onboarding.

**Código WhatsApp.** Seis casillas de un dígito, ancho fijo, centradas, 24/800. Texto de reenvío con temporizador. Enlace para volver al acceso.

**Recuperar.** Un campo de correo + botón de envío + enlace de regreso.

**Validación.** Correo con formato válido; contraseña mínimo 8 caracteres con al menos una mayúscula y un número (el medidor refleja: débil <8, media 8+, fuerte 12+ con símbolo); WhatsApp en formato internacional (`+52 55 0000 0000`); código de 6 dígitos numéricos, expira en 10 minutos.

### Onboarding (`/onboarding`)

Asistente de **8 pasos** sobre fondo oscuro, con barra de progreso (porcentaje = paso/8) y lista de pasos navegable a la izquierda: punto `#2563EB` en el paso actual, `#27AE60` en los completados, `rgba(255,255,255,.18)` en los pendientes. Etiqueta "Paso N de 8". Botón "Atrás" oculto en el paso 1; el botón de avance dice "Continuar" y en el paso 8 "Generar mi plan", que lleva a la pantalla de plan generado.

Los 8 pasos capturan: datos básicos (sexo, edad, estatura), peso actual y objetivo, nivel de actividad, historial y condiciones, preferencias y alergias alimentarias, disponibilidad de cocina y presupuesto, experiencia con ayuno, y hábitos a construir.

### Dashboard (`/`)

Encabezado: "Dashboard" + "Domingo 17 de agosto · día 24 de 90".

Tarjetas: peso actual con delta, racha (número en `#F26522`), ventana de ayuno con temporizador, agua (12 vasos de 250 ml, `waterL = vasos × 0.25` litros, barra = `min(100, vasos/12 × 100)%`, botón "+" que suma un vaso hasta 12), hábitos del día con checkboxes de 44px que se pintan `#27AE60` con "✓" al marcarse, siguiente comida del plan, y mini-gráfica de peso.

**Cuatro estados de datos**, todos diseñados:
- **Con datos** — el estado descrito arriba.
- **Cargando** — esqueletos con animación `m90pulse` (opacidad .35 → 1 → .35, 1.4s, infinita) en la forma exacta de cada tarjeta.
- **Vacío** — usuario nuevo sin registros: mensaje y llamada a la acción para registrar el primer peso.
- **Error** — fallo de carga con explicación y botón de reintento.

### Mi progreso (`/progreso`)

Gráfica de peso SVG con 6 rangos seleccionables (`7 d`, `30 d`, `3 m`, `6 m`, `1 año`, `Todo`) en un segmentado; el rango activo pinta fondo `#17202A` y texto blanco. Cada rango tiene su propia curva y su propio bloque de 4 KPIs: peso perdido, promedio semanal, registros y cintura. Debajo, tabla de medidas (cintura, cadera, pecho, brazo, muslo, cuello) con valor inicial, actual y delta, y galería de fotos de progreso por semana con placeholders arrastrables.

### Plan y menú (`/plan`)

Selector de 7 días (`Lunes 18` … `Domingo 24`); el día activo pinta `#17202A`. Para el día seleccionado: desayuno, colación y cena con ingredientes y gramajes, más el total de macros del día (kcal, carbohidratos, proteína, grasa — p. ej. 1,594 kcal · 24 g C · 141 g P · 108 g G). Encabezado "Keto + 16:8 · semana 4".

### Ayuno (`/ayuno`)

Tarjeta oscura con temporizador grande y estado: "Ayuno activo" en `#7BE0A5` o "Ventana de alimentación" en `#FBBF6B`, alternable. Cuatro protocolos como tarjetas seleccionables (12:12 "Inicio suave" 20:00→08:00 · 14:10 "Progresión" · 16:8 · 18:6), la seleccionada con borde `#2563EB` y fondo `#EAF1FF`. Debajo, cumplimiento de la semana e historial.

### Hábitos (`/habitos`)

Rejilla de 14 días × 6 hábitos con celdas de ancho fijo y scroll horizontal (necesario en tablet y móvil). Tarjeta "Marcar hoy" con checkboxes de 44px, editables: al marcar, fondo `#27AE60` y "✓". Rachas por hábito, con el número en `#F26522`.

### Coach AI (`/coach`)

Conversación con burbujas: usuario a la derecha (fondo `#2563EB`, texto blanco), coach a la izquierda (fondo blanco, borde `#E6EBF2`). Tres sugerencias pulsables que insertan una pregunta real y su respuesta:
1. "Ajusta mi menú de esta semana"
2. "Arma mi lista de compras"
3. (tercera sugerencia definida en el prototipo)

Las respuestas hacen referencia explícita a datos del usuario (sodio en cenas, meta de agua a 3 L, artículos y gramajes de la lista de compras): el coach debe recibir el contexto real del usuario, no responder en genérico.

### Reportes (`/reportes`)

Tres periodos seleccionables (semanal, mensual, trimestral). Cada uno muestra el rango de fechas, 9 KPIs (peso perdido, promedio, cumplimiento de ayuno, cintura, días registrados, agua promedio, minutos de actividad, hábitos cumplidos, ajustes del plan) y un resumen escrito de 2–3 frases que interpreta esos números.

### Logros (`/logros`)

Nivel 3 · 1,240 puntos. Barra de progreso al siguiente nivel, insignias obtenidas y pendientes. Es el único módulo, junto con las rachas, donde el naranja `#F26522` se usa con libertad.

### Perfil (`/perfil`)

Datos personales y plan (Premium). Bloque de **rol nutriólogo**: invitar a un profesional y otorgarle permisos granulares e independientes (ver peso y medidas, ver fotos, ver registros de comida, editar el plan, editar protocolo de ayuno, ver reportes, escribir notas). Bloque de **dispositivos conectados**: báscula Bluetooth y wearables, con estado de conexión y última sincronización.

### Configuración (`/configuracion`)

Seis interruptores (recordatorio de peso, recordatorio de agua, inicio/fin de ayuno, resumen semanal, mensajes del coach, novedades del producto): pista `#D3DBE6` → `#27AE60`, pulgar con `translateX(20px)`. Unidades (kg/lb, cm/in), idioma, modo oscuro, privacidad y exportación de datos, cierre de sesión y eliminación de cuenta.

---

## Interacciones y comportamiento

- **Transiciones:** 160–200 ms `ease-out` en hover, cambio de segmento y aparición de tarjetas. El temporizador de ayuno se actualiza cada segundo.
- **Hover:** botón primario `#2563EB → #1D4ED8`; tarjeta pulsable, elevación de sombra sin desplazamiento; fila de tabla, fondo `#F7F9FC`.
- **Foco:** borde `#2563EB` en campos; anillo visible en controles con teclado (requisito de accesibilidad, a implementar).
- **Cargando:** esqueletos con `m90pulse`, nunca spinners de página completa. Cada módulo carga de forma independiente.
- **Error:** mensaje en la tarjeta afectada con reintento; nada de modales de error.
- **Vacío:** cada módulo tiene su propio estado vacío con una sola llamada a la acción.
- **Persistencia local:** posición del temporizador de ayuno y último módulo visitado.

---

## Estado de la aplicación

Estado del prototipo, como referencia de lo que la app necesita mantener:

| Variable | Tipo | Significado |
| --- | --- | --- |
| `view` | `login \| register \| wa \| forgot \| onboard \| obdone \| app` | Etapa de sesión |
| `route` | `0…9` | Módulo activo |
| `bp` | `mobile \| tablet \| desktop` | Solo del prototipo; en producción lo resuelve CSS |
| `data` | `ok \| load \| empty \| err` | Solo del prototipo; en producción son estados reales de fetch |
| `water` | `0…12` | Vasos de 250 ml del día |
| `habits`, `hb` | `boolean[]` | Hábitos marcados hoy |
| `obStep` | `1…8` | Paso de onboarding |
| `range` | `0…5` | Rango de la gráfica de progreso |
| `day` | `0…6` | Día del menú |
| `proto` | `0…3` | Protocolo de ayuno |
| `fastOn` | `boolean` | Ayuno activo vs. ventana de alimentación |
| `period` | `0…2` | Periodo de reportes |
| `chat` | `number[]` | Sugerencias del coach ya usadas |
| `measure` | `number` | Medida seleccionada |
| `navOpen`, `notifOpen` | `boolean` | Drawer y panel de notificaciones (mutuamente excluyentes) |

---

## Modelos de datos

```ts
User        { id, name, email, whatsapp, locale, plan: 'free'|'premium',
              missionStartDate, missionDay, level, points, createdAt }
Profile     { userId, sex, birthdate, heightCm, activityLevel: 1|2|3|4|5,
              conditions: string[], allergies: string[], preferences: string[],
              goalWeightKg, fastingExperience, units: 'metric'|'imperial' }
WeightLog   { id, userId, date, weightKg, bodyFatPct?, source: 'manual'|'scale' }
Measurement { id, userId, date, waistCm, hipCm, chestCm, armCm, thighCm, neckCm }
ProgressPhoto { id, userId, date, week, angle: 'front'|'side'|'back', url }
Plan        { id, userId, week, dietType: 'keto'|…, fastingProtocol,
              kcalTarget, carbsG, proteinG, fatG, waterTargetL, generatedAt }
PlanDay     { planId, dayIndex 0-6, meals: Meal[], kcal, carbsG, proteinG, fatG }
Meal        { slot: 'breakfast'|'snack'|'dinner', items: {name, grams}[], kcal, macros }
FastingSession { id, userId, protocol: '12:12'|'14:10'|'16:8'|'18:6',
                 startedAt, endedAt?, targetHours, completed }
Habit       { id, userId, name, icon, active, targetPerWeek }
HabitLog    { habitId, date, done }
WaterLog    { userId, date, glasses (250 ml c/u) }
ActivityLog { userId, date, minutes, type }
Report      { userId, period: 'week'|'month'|'quarter', rangeStart, rangeEnd,
              kpis {…}, summary: string, generatedAt }
Achievement { id, key, name, description, points, iconKey }
UserAchievement { userId, achievementId, unlockedAt }
CoachMessage { id, userId, role: 'user'|'coach', text, createdAt, contextRefs }
NutritionistAccess { userId, nutritionistId, status: 'pending'|'active'|'revoked',
                     permissions: { viewWeight, viewPhotos, viewMeals, editPlan,
                                    editFasting, viewReports, writeNotes } }
Device      { userId, kind: 'scale'|'wearable', brand, connected, lastSyncAt }
Settings    { userId, notifications { weighIn, water, fastStart, fastEnd,
                                      weeklySummary, coachMessages, product },
              units, language, darkMode }
```

## Endpoints sugeridos

```
POST   /auth/register              POST /auth/login            POST /auth/logout
POST   /auth/whatsapp/request      POST /auth/whatsapp/verify
POST   /auth/password/forgot       POST /auth/password/reset

GET    /me                         PATCH /me                   PATCH /me/settings
POST   /onboarding                 → crea Profile y dispara la generación del plan

GET    /dashboard?date=            → una sola respuesta con todo lo del día
GET    /weight?range=7d|30d|3m|6m|1y|all
POST   /weight                     PATCH /weight/:id           DELETE /weight/:id
GET    /measurements               POST /measurements
GET    /photos                     POST /photos                DELETE /photos/:id

GET    /plan/current               POST /plan/regenerate       GET /plan/:id/day/:i
GET    /plan/shopping-list

GET    /fasting/current            POST /fasting/start         POST /fasting/stop
PATCH  /fasting/protocol           GET  /fasting/history

GET    /habits                     POST /habits                PATCH /habits/:id
POST   /habits/:id/log             GET  /habits/logs?from=&to=
POST   /water                      GET  /water?date=

GET    /reports?period=week|month|quarter
GET    /achievements               GET /achievements/mine

POST   /coach/messages             GET /coach/messages?cursor=
GET    /nutritionist/access        POST /nutritionist/invite
PATCH  /nutritionist/access/:id    DELETE /nutritionist/access/:id
GET    /devices                    POST /devices/:id/sync
```

`GET /dashboard` debe devolver en una sola llamada peso + delta, racha, sesión de ayuno activa, agua del día, hábitos del día, siguiente comida y serie corta de peso — el diseño muestra todo eso junto y no debe cargar en cascada.

## Lógica de negocio

**Macros.** TMB por Mifflin-St Jeor: hombres `10·kg + 6.25·cm − 5·edad + 5`; mujeres `10·kg + 6.25·cm − 5·edad − 161`. Gasto total = TMB × factor de actividad (1.2 sedentario · 1.375 ligero · 1.55 moderado · 1.725 alto · 1.9 muy alto). Déficit objetivo del 20 % del gasto total, con piso de 1,200 kcal en mujeres y 1,500 en hombres. Reparto keto: grasa 65–70 % de las kcal, proteína 1.6 g/kg de peso objetivo, carbohidratos netos ≤ 25 g/día (el resto de kcal va a grasa). Redondear kcal a la decena.

**IMC.** `peso_kg / (estatura_m)²`. Rangos: <18.5 bajo · 18.5–24.9 normal · 25–29.9 sobrepeso · 30–34.9 obesidad I · 35–39.9 obesidad II · ≥40 obesidad III.

**Racha.** Días naturales consecutivos con al menos un registro de peso o de hábito. Se rompe al pasar un día natural completo sin registro; la zona horaria del usuario define el corte. La racha del día en curso cuenta desde el primer registro del día.

**Proyección de peso.** Regresión lineal sobre los registros de los últimos 14 días (mínimo 4 registros); pendiente en kg/semana. Proyección al día 90 = peso actual + pendiente × semanas restantes, acotada al peso objetivo. Si hay menos de 4 registros, no se muestra proyección.

**Agua.** Meta = `35 ml × peso_kg`, redondeada al vaso de 250 ml más cercano, +500 ml en días con actividad registrada. Un vaso = 250 ml; la barra del dashboard usa `min(100, vasos / meta_vasos × 100)`.

**Ayuno.** Protocolos 12:12, 14:10, 16:8, 18:6 (horas de ayuno : horas de ventana). La sesión se cuenta como completada al alcanzar el 95 % de las horas objetivo. Cumplimiento semanal = sesiones completadas / sesiones planeadas × 100, redondeado al entero.

**Puntos y niveles.** Registro de peso 10 · hábito cumplido 5 · ayuno completado 15 · semana completa de registros 50 · insignia según su valor. Umbrales de nivel: 1 = 0, 2 = 500, 3 = 1,000, 4 = 2,000, 5 = 3,500, +2,000 por nivel a partir de ahí.

**Reportes.** Se generan al cierre del domingo (semanal), del último día del mes y del trimestre. El resumen escrito lo produce el modelo con los KPIs del periodo y el anterior como contexto; debe nombrar cifras concretas y señalar exactamente una cosa a corregir.

**Permisos de nutriólogo.** Cada permiso se evalúa de forma independiente en el servidor, no en el cliente. Revocar el acceso invalida las sesiones del nutriólogo para esa cuenta de inmediato.

## Arquitectura sugerida

Si se parte de cero: Next.js (App Router) + TypeScript + Tailwind para web, Postgres con Prisma, autenticación por sesión con JWT httpOnly, WhatsApp Business API para códigos y recordatorios, almacenamiento de fotos en un bucket privado con URLs firmadas y caducidad corta (son fotos corporales: nunca públicas, nunca en el CDN de la app). Las llamadas al modelo de IA (menús, resúmenes, coach) van siempre desde el servidor.

## Accesibilidad

Contraste mínimo AA en todo el texto (verificar `#98A1AE` sobre blanco solo en tamaños ≥ 12px y peso ≥ 600). Objetivos táctiles ≥ 44px. Navegación completa por teclado con foco visible. Etiquetas asociadas a cada campo (`label` + `for`). El estado de un hábito o interruptor no puede comunicarse solo por color: incluir marca "✓" o texto.

## Marca

Azul `#2563EB` es el color de producto. El naranja `#F26522` está reservado al logo, las rachas y los logros — no debe aparecer en botones, enlaces ni fondos generales. Usar los archivos de logo incluidos, sin recolorear ni recomponer.
