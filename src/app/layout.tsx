import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Toaster } from "react-hot-toast";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nexus",
  description: "Controle seus gastos de forma simples e visual",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body className="antialiased bg-gray-50 min-h-screen font-sans">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#111827",
              color: "#F3F4F6",
              border: "1px solid #3B82F6",
              borderRadius: "12px",
              padding: "12px 16px",
              fontFamily: "var(--font-manrope), sans-serif",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
