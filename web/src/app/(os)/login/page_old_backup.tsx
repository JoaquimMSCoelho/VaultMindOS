import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen text-slate-300 font-sans selection:bg-cyan-500/30">
      
      {/* --- NAV BAR --- */}
      <header className="fixed top-0 w-full z-50 bg-[#050A14]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo (Com Link para Home) */}
          <div className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-4 h-4 bg-cyan-400 rounded-sm shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
            <Link href="/" className="font-bold text-xl tracking-tight text-white">
              VaultMind <span className="text-cyan-400">SO</span>
            </Link>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#consultoria" className="hover:text-white transition-colors">Consultoria</a>
            <a href="#plataforma" className="hover:text-white transition-colors">Plataforma</a>
            <a href="#industrias" className="hover:text-white transition-colors">Indústrias</a>
            <a href="#sobre" className="hover:text-white transition-colors">Sobre</a>
          </nav>

          {/* Botões Direita */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-sm border border-white/10 px-3 py-1.5 rounded bg-white/5">
              🇺🇸 Inglês
            </div>
            <Link 
              href="/login" 
              className="text-sm font-semibold text-white border border-white/10 px-6 py-2.5 rounded-lg hover:bg-white/10 transition-all"
            >
              Conecte-se
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="font-mono text-xs text-cyan-400 tracking-wider mb-6 uppercase">
            &gt; FUTURE_READINESS_PROTOCOL_INIT
          </p>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
            Adapte-se às tendências<br />
            emergentes<br />
            antes que elas aconteçam.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Consultoria em previsão estratégica e software de inteligência para ajudar
            sua empresa a se manter informada e a se adaptar às mudanças do mercado.
          </p>
        </div>
        
        {/* Glow de Fundo (Decorativo) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      </section>

      {/* --- SERVIÇOS --- */}
      <section id="consultoria" className="py-14 bg-[#080E1A]/80 border-y border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8 border-l-4 border-cyan-500 pl-4">
            <h2 className="text-3xl font-bold text-white">Serviços de consultoria</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cards mantidos originais */}
            <div className="bg-[#0E1421]/90 p-8 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group">
              <div className="text-yellow-400 text-2xl mb-4">💡</div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Ideias de negócios</h3>
              <p className="text-sm leading-relaxed text-slate-400">Gere conceitos inovadores de produtos e serviços com base em tendências orientadas por dados.</p>
            </div>

            <div className="bg-[#0E1421]/90 p-8 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group">
              <div className="text-purple-400 text-2xl mb-4">🎤</div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Palestrantes futuristas</h3>
              <p className="text-sm leading-relaxed text-slate-400">Cative seu público com apresentações inspiradoras sobre o futuro do seu setor.</p>
            </div>

            <div className="bg-[#0E1421]/90 p-8 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group">
              <div className="text-orange-400 text-2xl mb-4">🛠️</div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Oficinas de Prospectiva</h3>
              <p className="text-sm leading-relaxed text-slate-400">Sessões colaborativas para mapear cenários e construir resiliência estratégica.</p>
            </div>

            <div className="bg-[#0E1421]/90 p-8 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group">
              <div className="text-blue-400 text-2xl mb-4">📊</div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Relatórios Corporativos</h3>
              <p className="text-sm leading-relaxed text-slate-400">Relatórios de pesquisa personalizados e aprofundados, adaptados às necessidades específicas.</p>
            </div>

            <div className="bg-[#0E1421]/90 p-8 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group">
              <div className="text-cyan-400 text-2xl mb-4">🌐</div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Análise de Tendências</h3>
              <p className="text-sm leading-relaxed text-slate-400">Monitoramento contínuo de sinais e mudanças relevantes para o seu setor de mercado.</p>
            </div>

            <div className="bg-[#0E1421]/90 p-8 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group">
              <div className="text-red-400 text-2xl mb-4">🚀</div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Visão de ficção científica</h3>
              <p className="text-sm leading-relaxed text-slate-400">Criar ficção científica e protótipos para visualizar futuros potenciais de forma tangível.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER (Limpo, sem duplicata de status) --- */}
      <footer className="bg-[#050A14]/90 pt-16 pb-8 border-t border-white/5" id="industrias">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
             <div className="flex items-center gap-3 mb-6 border-l-4 border-blue-600 pl-4">
               <h2 className="text-2xl font-bold text-white">Setores em que atuamos</h2>
             </div>
             <div className="flex flex-wrap gap-3">
               {['Aeroespacial', 'Automotivo', 'Bancos e Finanças', 'Bens de Consumo (CPG)', 'Setor de Energia', 'Seguro', 'Varejo', 'Tecnologia', 'Produtos farmacêuticos', 'Governo', 'Logística'].map((item) => (
                 <span key={item} className="px-4 py-2 bg-[#0E1421] border border-white/10 rounded-full text-xs font-medium hover:border-cyan-500/50 hover:text-white cursor-default transition-colors">
                   {item}
                 </span>
               ))}
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-12">
            <div className="space-y-4">
              <h4 className="text-white font-bold tracking-wider text-xs uppercase mb-4">Consultoria</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="hover:text-cyan-400 cursor-pointer">Ideias de negócios</li>
                <li className="hover:text-cyan-400 cursor-pointer">Palestrantes futuristas</li>
                <li className="hover:text-cyan-400 cursor-pointer">Oficinas de Prospectiva</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold tracking-wider text-xs uppercase mb-4">Plataforma</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="hover:text-cyan-400 cursor-pointer">Plataforma de Previsão</li>
                <li className="hover:text-cyan-400 cursor-pointer">Preços e planos</li>
                <li className="hover:text-cyan-400 cursor-pointer">Boletim informativo</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold tracking-wider text-xs uppercase mb-4">Publicações</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="hover:text-cyan-400 cursor-pointer">Site público</li>
                <li className="hover:text-cyan-400 cursor-pointer">Relatório de Tendências</li>
                <li className="hover:text-cyan-400 cursor-pointer">Blog</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold tracking-wider text-xs uppercase mb-4">Empresa</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="hover:text-cyan-400 cursor-pointer">Sobre nós</li>
                <li className="hover:text-cyan-400 cursor-pointer">Carreiras</li>
                <li className="hover:text-cyan-400 cursor-pointer">Contato</li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 text-center md:text-left">
            <p className="text-xs text-slate-600">
              © 2026 VaultMindOS Foresight. Subsidiária do FutureSpec Group. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
