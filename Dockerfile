# --- Etapa 1: build (Node solo en build-time) ---
FROM node:20-alpine AS build
WORKDIR /app

# Sin package-lock.json en el repo todavía → npm install (genera el lock en build).
COPY package.json ./
RUN npm install

COPY . .
# next.config.mjs tiene output:"export" → genera /app/out (HTML/CSS/JS estático).
RUN npm run build

# --- Etapa 2: servir estático con nginx (imagen mínima, sin Node en runtime) ---
FROM nginx:alpine
COPY --from=build /app/out /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
