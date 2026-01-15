import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SystemStatus from "@/components/SystemStatus";
import BackgroundVideo from "@/components/BackgroundVideo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "VaultMindOS | Enterprise Intelligence",
  description: "Sistema de Gestão Modular e Inteligência de Dados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <body className="\ \ antialiased text-slate-200 bg-transparent" suppressHydrationWarning>
        <BackgroundVideo />
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
        <SystemStatus />
      </body>
    </html>
  );
}
