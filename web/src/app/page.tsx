import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0F19] selection:bg-cyan-500/30">
      
      {/* BACKGROUND GLOW EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <header className="flex justify-between items-center py-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-cyan-400 rounded-sm shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
            <span className="font-bold text-xl tracking-tight text-white">
              VaultMind<span className="text-cyan-400">OS</span>
            </span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Plataforma</a>
            <a href="#" className="hover:text-white transition-colors">Soluções</a>
            <a href="#" className="hover:text-white transition-colors">Enterprise</a>
            <a href="#" className="hover:text-white transition-colors">Sobre</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-sm font-semibold text-white border border-white/10 px-5 py-2 rounded-lg hover:bg-white/5 transition-all">
              Login
            </button>
          </div>
        </header>

        {/* --- HERO SECTION --- */}
        <main className="pt-24 pb-16 text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/10 backdrop-blur-sm">
            <p className="font-mono text-xs text-cyan-400 tracking-wider">
              &gt; SYSTEM_READY_PROTOCOL_INIT
            </p>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            <span className="bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent">
              O Sistema Operacional
            </span>
            <br />
            <span className="text-white">da sua Empresa.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Centralize Saúde, Marketing e Varejo em uma única arquitetura. 
            Escalabilidade global, segurança de dados e automação via IA.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Começar Agora
            </button>
            <button className="px-8 py-4 bg-[#151B2B] text-white border border-white/10 font-medium rounded-lg hover:border-cyan-400/50 hover:text-cyan-400 transition-all">
              Falar com Arquiteto
            </button>
          </div>
        </main>

        {/* --- GRID DE SERVIÇOS --- */}
        <section className="py-20 border-t border-white/5">
          <h2 className="text-2xl font-semibold mb-10 border-l-4 border-cyan-400 pl-4">
            Ecossistema VaultMind
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* CARD 1 */}
            <div className="group bg-[#151B2B] border border-white/5 p-8 rounded-xl hover:-translate-y-1 hover:border-cyan-500/30 transition-all duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🏥</div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">Saúde Ciclo da Vida</h3>
              <p className="text-sm text-slate-400">Gestão clínica completa, prontuário eletrônico e telemedicina integrada em conformidade com LGPD.</p>
            </div>

            {/* CARD 2 */}
            <div className="group bg-[#151B2B] border border-white/5 p-8 rounded-xl hover:-translate-y-1 hover:border-indigo-500/30 transition-all duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🤖</div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">AutoZap Manager</h3>
              <p className="text-sm text-slate-400">Automação de marketing, disparo inteligente de mensagens e funis de venda via WhatsApp.</p>
            </div>

            {/* CARD 3 */}
            <div className="group bg-[#151B2B] border border-white/5 p-8 rounded-xl hover:-translate-y-1 hover:border-emerald-500/30 transition-all duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🛒</div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Varejo & Lojas</h3>
              <p className="text-sm text-slate-400">ERP modular para gestão de estoque, PDV e e-commerce para nichos específicos.</p>
            </div>

            {/* CARD 4 */}
            <div className="group bg-[#151B2B] border border-white/5 p-8 rounded-xl hover:-translate-y-1 hover:border-cyan-500/30 transition-all duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
              <h3 className="text-lg font-bold text-white mb-2">Analytics Central</h3>
              <p className="text-sm text-slate-400">Dashboards unificados para visualizar a performance de todos os seus negócios em tempo real.</p>
            </div>

            {/* CARD 5 */}
            <div className="group bg-[#151B2B] border border-white/5 p-8 rounded-xl hover:-translate-y-1 hover:border-cyan-500/30 transition-all duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🔐</div>
              <h3 className="text-lg font-bold text-white mb-2">Vault Security</h3>
              <p className="text-sm text-slate-400">SSO (Single Sign-On), criptografia de ponta a ponta e gestão de identidade centralizada.</p>
            </div>

            {/* CARD 6 */}
            <div className="group bg-[#151B2B] border border-white/5 p-8 rounded-xl hover:-translate-y-1 hover:border-cyan-500/30 transition-all duration-300">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🚀</div>
              <h3 className="text-lg font-bold text-white mb-2">Scale Hub</h3>
              <p className="text-sm text-slate-400">Infraestrutura elástica que cresce automaticamente conforme a demanda dos seus usuários.</p>
            </div>

          </div>
        </section>

        {/* --- TAGS DE SETORES --- */}
        <section className="pb-24">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">Setores Atendidos</h4>
          <div className="flex flex-wrap gap-3">
            {["Clínicas Médicas", "Marketing Digital", "Varejo", "Oficinas", "Governo", "Logística", "Bens de Consumo"].map((tag) => (
              <span key={tag} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300 hover:bg-white/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all cursor-default">
                {tag}
              </span>
            ))}
          </div>
        </section>

      </div>

      {/* FOOTER SIMPLES */}
      <footer className="border-t border-white/5 bg-[#080B12] py-8 text-center text-slate-500 text-sm">
        <p>&copy; 2026 VaultMindOS. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}