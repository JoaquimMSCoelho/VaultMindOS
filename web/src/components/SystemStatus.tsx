export default function SystemStatus() {
  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#050A14]/80 backdrop-blur-md border border-white/5 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:border-emerald-500/30 transition-all cursor-help group">
      
      {/* O Ponto que Pisca */}
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </div>

      {/* Texto */}
      <span className="text-[10px] font-mono font-medium text-slate-400 group-hover:text-emerald-400 transition-colors uppercase tracking-widest">
        System Operational
      </span>

      {/* Tooltip (Dica ao passar o mouse) */}
      <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-[#151B2B] border border-white/10 rounded text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center shadow-xl">
        Conexão segura com VaultMind Server v1.0
      </div>
    </div>
  )
}
