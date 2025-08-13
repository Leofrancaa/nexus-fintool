import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import LayoutWrapper from "../components/navigation/layoutWrapper";
import { DateProvider } from "../contexts/dateContext";
import { ThemeProvider } from "@/contexts/themeContext";
import SwUpdater from "@/components/swUpdater"; // ⬅️ adiciona isto

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus",
  description: "Controle seus gastos de forma simples e visual",
  manifest: "/manifest.json",
  themeColor: "#00D4D4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <head>
        {/* Metas específicas para iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased bg-gray-50 min-h-screen font-sans">
        {/* registra o SW e força update quando houver versão nova */}
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
