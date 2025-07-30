import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import LayoutWrapper from "../components/navigation/layoutWrapper"; // Adjust the path as needed

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
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
