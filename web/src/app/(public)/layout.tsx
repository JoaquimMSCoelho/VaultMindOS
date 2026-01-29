/*
-------------------------------------------------------------------------
PROJETO: CONNECTION CYBER (PUBLIC SITE)
ARQUITETURA: NEXT.JS APP ROUTER
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
-------------------------------------------------------------------------
MÓDULO: src/app/(public)/layout.tsx
DESCRIÇÃO: Layout base do site institucional (Header + Footer)
-------------------------------------------------------------------------
*/

import Link from "next/link"
import React from "react"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#050A14] text-slate-200 selection:bg-cyan-500/30">
      {/* HEADER / NAVBAR */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050A14]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              CC
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Connection<span className="text-cyan-400">Cyber</span>
            </span>
          </Link>

          {/* MENU DESKTOP */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <Link href="/servicos" className="hover:text-cyan-400 transition-colors">Serviços</Link>
            <Link href="/blog" className="hover:text-cyan-400 transition-colors">Blog</Link>
            <Link href="/contato" className="hover:text-cyan-400 transition-colors">Contato</Link>
          </nav>

          {/* AREA DO CLIENTE (LOGIN) */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:border-cyan-500/50 transition-all"
            >
              Área do Cliente
            </Link>
            <Link 
              href="/portal" 
              className="hidden md:block px-4 py-2 text-xs font-bold uppercase tracking-wider bg-cyan-600 text-white rounded hover:bg-cyan-500 shadow-lg shadow-cyan-900/20 transition-all"
            >
              Portal Aluno
            </Link>
          </div>
        </div>
      </header>

      {/* CONTEÚDO DA PÁGINA */}
      <main className="pt-16">
        {children}
      </main>

      {/* FOOTER SIMPLIFICADO */}
      <footer className="border-t border-white/5 bg-black/40 mt-20 py-12">
        <div 
          className="container mx-auto px-4 text-center"
          suppressHydrationWarning={true}
        >
          <p className="text-slate-500 text-sm">
            © 2026 ConnectionCyber Soluções em Tecnologia. Todos os direitos reservados.
          </p>
          <p className="text-slate-600 text-xs mt-2">
            CNPJ: 13.348.881/0001-88 • Piracicaba/SP
          </p>
        </div>
      </footer>
    </div>
  )
}