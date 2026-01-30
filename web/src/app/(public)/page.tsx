/*
-------------------------------------------------------------------------
PROJETO: CONNECTION CYBER (PUBLIC SITE)
MÓDULO: src/app/(public)/page.tsx
DESCRIÇÃO: Home Page Institucional (Redesign: Enterprise Emerald)
-------------------------------------------------------------------------
*/

import Link from "next/link"
import { ShieldCheck, Rocket, Briefcase, ChevronRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100 selection:bg-emerald-500/30">
      
      {/* HERO SECTION */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Glow de Fundo (Padrão Emerald) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/30 border border-emerald-800/50 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
            Soluções Integradas em TI
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Conectando seu Negócio <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              ao Futuro Digital
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-neutral-400 mb-10 leading-relaxed">
            Da infraestrutura de redes à consultoria fiscal. Oferecemos um ecossistema completo 
            para impulsionar a performance e segurança da sua empresa.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link 
              href="/contato" 
              className="w-full md:w-auto px-8 py-4 text-sm font-bold uppercase tracking-wider bg-emerald-600 text-white rounded hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-105"
            >
              Falar com Especialista
            </Link>
            <Link 
              href="/servicos" 
              className="w-full md:w-auto px-8 py-4 text-sm font-bold uppercase tracking-wider bg-neutral-900 border border-neutral-800 text-neutral-300 rounded hover:bg-neutral-800 hover:text-white transition-all"
            >
              Conhecer Soluções
            </Link>
          </div>
        </div>
      </section>

      {/* SERVIÇOS GRID */}
      <section className="py-20 border-t border-neutral-900 bg-neutral-950/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Nossas Áreas de Atuação</h2>
            <p className="text-neutral-500">Tecnologia de ponta a ponta para sua corporação.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group p-8 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-900/10">
              <div className="w-12 h-12 bg-emerald-900/20 rounded-lg flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">CFTV & Segurança</h3>
              <p className="text-sm text-neutral-400 mb-6">Projetos de monitoramento inteligente, câmeras IP e controle de acesso.</p>
              <Link href="/lp/cftv" className="text-emerald-500 text-sm font-bold hover:underline flex items-center gap-1">Saiba mais <ChevronRight className="w-4 h-4"/></Link>
            </div>

            {/* Card 2 */}
            <div className="group p-8 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-900/10">
              <div className="w-12 h-12 bg-emerald-900/20 rounded-lg flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">Sistemas ERP/CRM</h3>
              <p className="text-sm text-neutral-400 mb-6">Implantação e consultoria em sistemas de gestão para otimizar processos.</p>
              <Link href="/lp/erp" className="text-emerald-500 text-sm font-bold hover:underline flex items-center gap-1">Saiba mais <ChevronRight className="w-4 h-4"/></Link>
            </div>

            {/* Card 3 */}
            <div className="group p-8 bg-neutral-900/50 border border-neutral-800 rounded-2xl hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-900/10">
              <div className="w-12 h-12 bg-emerald-900/20 rounded-lg flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">Consultoria Fiscal</h3>
              <p className="text-sm text-neutral-400 mb-6">Assessoria especializada em IRPF, IRPJ e regularização tributária.</p>
              <Link href="/contato" className="text-emerald-500 text-sm font-bold hover:underline flex items-center gap-1">Agendar <ChevronRight className="w-4 h-4"/></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}