import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Configuração das Fontes Profissionais
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "VaultMindOS | Enterprise Operating System",
  description: "O Sistema Operacional definitivo para gestão de SaaS, Saúde e Varejo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans bg-[#0B0F19] text-slate-100 antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}