/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Fase 2: runtime Node (API routes, auth, BD). `standalone` produce un
  // servidor mínimo (.next/standalone) ideal para el contenedor de producción.
  output: "standalone",

  // Sin optimizador de imágenes (evita la dependencia nativa `sharp`).
  images: { unoptimized: true },
};

export default nextConfig;
