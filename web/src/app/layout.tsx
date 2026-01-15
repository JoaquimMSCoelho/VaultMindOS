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
      {/* Removemos a cor de fundo sólida bg-[#050A14] pois agora temos o vídeo */}
      <body className="\ \ antialiased text-slate-200" suppressHydrationWarning>
        
        {/* Camada 0: O Vídeo de Fundo */}
        <BackgroundVideo />

        {/* Camada 1: O Conteúdo do Site */}
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Camada 2: Monitor Global */}
        <SystemStatus />
      </body>
    </html>
  );
}
