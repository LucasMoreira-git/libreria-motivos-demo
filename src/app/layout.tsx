import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Librería Motivos - Mendoza",
  description:
    "Librería Motivos en Guaymallén, Mendoza. Útiles escolares, papelería de oficina, arte, dibujo técnico, regalería y atención directa por WhatsApp.",
  icons: {
    icon: "/images/logo-motivos.jpg",
    apple: "/images/logo-motivos.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakartaSans.variable} ${poppins.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
