import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SystemStatus from "@/components/SystemStatus";

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
    // 'suppressHydrationWarning' impede que extensões quebrem o React no modo Dev
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <body className="\ \ antialiased bg-[#050A14]" suppressHydrationWarning>
        {children}
        
        {/* Monitor Global */}
        <SystemStatus />
      </body>
    </html>
  );
}
