// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { Toaster } from "react-hot-toast";
import LayoutWrapper from "../components/navigation/layoutWrapper";
import { DateProvider } from "../contexts/dateContext";
import { ThemeProvider } from "@/contexts/themeContext";
import AuthGuard from "@/components/authGuard";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus",
  description: "Controle seus gastos de forma simples e visual",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#00D4D4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body className="antialiased bg-gray-50 min-h-screen font-sans">
        <AuthGuard>
          <DateProvider>
            <ThemeProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#1F2937",
                    color: "#F9FAFB",
                    border: "1px solid #374151",
                  },
                }}
              />
            </ThemeProvider>
          </DateProvider>
        </AuthGuard>
      </body>
    </html>
  );
}
