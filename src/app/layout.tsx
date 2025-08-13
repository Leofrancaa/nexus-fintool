// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import LayoutWrapper from "../components/navigation/layoutWrapper";
import { DateProvider } from "../contexts/dateContext";
import { ThemeProvider } from "@/contexts/themeContext";
import SwUpdater from "@/components/swUpdater"; // se estiver usando

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus",
  description: "Controle seus gastos de forma simples e visual",
  manifest: "/manifest.json",
  // ❌ NÃO coloque themeColor aqui
};

// ✅ coloque aqui
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Se quiser variar por tema do SO:
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#00D4D4" },
    { media: "(prefers-color-scheme: dark)", color: "#00D4D4" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <head>
        {/* iOS PWA metas */}

        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased bg-gray-50 min-h-screen font-sans">
        <SwUpdater />
        <DateProvider>
          <ThemeProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ThemeProvider>
        </DateProvider>
      </body>
    </html>
  );
}
