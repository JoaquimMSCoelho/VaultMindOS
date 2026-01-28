/*
-------------------------------------------------------------------------
PROJETO: CONNECTION CYBER (PUBLIC SITE)
MÓDULO: src/app/(public)/page.tsx
DESCRIÇÃO: Home Page Institucional (Vitrine de Serviços)
-------------------------------------------------------------------------
*/

import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO SECTION */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#050A14] to-[#050A14] z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/30 border border-cyan-800/50 rounded-full">
            Soluções Integradas em TI
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Conectando seu Negócio <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">ao Futuro Digital</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10 leading-relaxed">
            Da infraestrutura de redes à consultoria fiscal. Oferecemos um ecossistema completo 
            para impulsionar a performance e segurança da sua empresa.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link 
              href="/contato" 
              className="w-full md:w-auto px-8 py-4 text-sm font-bold uppercase tracking-wider bg-cyan-600 text-white rounded hover:bg-cyan-500 shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all"
            >
              Falar com Especialista
            </Link>
            <Link 
              href="/servicos" 
              className="w-full md:w-auto px-8 py-4 text-sm font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white rounded hover:bg-white/10 transition-all"
            >
              Conhecer Soluções
            </Link>
          </div>
        </div>
      </section>

      {/* SERVIÇOS GRID */}
      <section className="py-20 bg-black/20 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Nossas Áreas de Atuação</h2>
            <p className="text-slate-400">Tecnologia de ponta a ponta para sua corporação.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/50 transition-all hover:bg-white/[0.07]">
              <div className="w-12 h-12 bg-cyan-900/30 rounded-lg flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-white mb-3">CFTV & Segurança</h3>
              <p className="text-sm text-slate-400 mb-6">Projetos de monitoramento inteligente, câmeras IP e controle de acesso.</p>
              <Link href="/lp/cftv" className="text-cyan-400 text-sm font-bold hover:underline">Saiba mais →</Link>
            </div>

            {/* Card 2 */}
            <div className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/50 transition-all hover:bg-white/[0.07]">
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                🚀
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Sistemas ERP/CRM</h3>
              <p className="text-sm text-slate-400 mb-6">Implantação e consultoria em sistemas de gestão para otimizar processos.</p>
              <Link href="/lp/erp" className="text-cyan-400 text-sm font-bold hover:underline">Saiba mais →</Link>
            </div>

            {/* Card 3 */}
            <div className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/50 transition-all hover:bg-white/[0.07]">
              <div className="w-12 h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                💼
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Consultoria Fiscal</h3>
              <p className="text-sm text-slate-400 mb-6">Assessoria especializada em IRPF, IRPJ e regularização tributária.</p>
              <Link href="/contato" className="text-cyan-400 text-sm font-bold hover:underline">Agendar →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
