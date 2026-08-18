import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Misión 90 AI",
  description:
    "Plataforma de acompañamiento de salud de 90 días: peso, ayuno, hábitos y coach de IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} bg-bg-app font-sans text-ink antialiased`}>{children}</body>
    </html>
  );
}
