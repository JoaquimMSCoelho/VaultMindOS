import { login, signup } from "./actions"; 
import { ShieldCheck, Cpu } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Cyber */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,0,0,0.05),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent"></div>

      <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-500/10 mb-4 border border-red-500/20">
            <Cpu className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Connection Cyber
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            Autenticação Segura VaultMindOS
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">
              E-mail de Acesso
            </label>
            <input
              name="email"
              type="email"
              placeholder="admin@vaultmind.com"
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">
              Senha Mestra
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              formAction={login}
              className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Entrar
            </button>
            <button
              formAction={signup}
              className="w-full bg-transparent border border-white/20 text-white font-medium py-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              Criar Conta
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-600 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3 h-3" /> Ambiente Protegido e Criptografado
          </p>
        </div>
      </div>
    </div>
  );
}