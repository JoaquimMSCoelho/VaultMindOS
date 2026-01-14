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
            <a href="/login" className="hover:text-white transition-colors">Login</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-semibold text-white border border-white/10 px-5 py-2 rounded-lg hover:bg-white/5 transition-all">
              Acessar Sistema
            </a>
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
            <a href="/login" className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Começar Agora
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
