#!/bin/sh
set -e

echo "→ Aplicando migraciones de base de datos (prisma migrate deploy)..."
npx prisma migrate deploy

echo "→ Iniciando servidor Next.js en el puerto ${PORT:-3000}..."
exec npm run start
