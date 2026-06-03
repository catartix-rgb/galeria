import type { Metadata } from "next";
import { Space_Mono, Archivo } from "next/font/google";
import "./globals.css";
import ThresholdDefs from "@/components/ThresholdDefs";

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const display = Archivo({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CASCAS — Archivo Visual",
  description:
    "Archivo fotográfico interactivo. Canvas flotante, Cover Flow y zine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${mono.variable} ${display.variable}`}>
      <body>
        <ThresholdDefs />
        {children}
      </body>
    </html>
  );
}
