/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // IONOS Deploy Now (y cualquier host estático) no ejecutan Node en runtime:
  // exportamos HTML/CSS/JS plano. La app es 100% cliente, así que esto es válido.
  // El backend real (auth, BD, WhatsApp, coach IA) irá en hosting con Node aparte.
  output: "export",

  // Sin optimizador de imágenes en tiempo de ejecución (no hay servidor Node).
  images: { unoptimized: true },

  // Cada ruta se emite como carpeta/index.html → sirve bien en hosting estático.
  trailingSlash: true,
};

export default nextConfig;
