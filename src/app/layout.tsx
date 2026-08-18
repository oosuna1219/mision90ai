import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Misión 90 AI",
  description:
    "90 días de acompañamiento de salud: peso, medidas, ayuno, hábitos y un coach de IA que lee tus registros reales.",
  icons: { icon: "/logos/logo-mark.png" },
};

export const viewport: Viewport = {
  themeColor: "#0f1720",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={manrope.variable}>
      <body>
        {/* Aplica el tema guardado antes de pintar el contenido (evita el flash). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('m90-theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t}}catch(e){}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
