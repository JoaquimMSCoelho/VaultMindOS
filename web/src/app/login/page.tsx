import { login, signup } from './actions'
import Link from 'next/link'

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const params = await props.searchParams;
  const errorMessage = params?.error;

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] bg-[#0B0F19] p-8 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            VaultMind<span className="text-cyan-400">OS</span>
          </h1>
          <p className="text-slate-400 text-sm">Acesse seu terminal de controle.</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center animate-in fade-in">
            {errorMessage}
          </div>
        )}

        <form className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Endereço de Email</label>
            <input id="email" name="email" type="email" required className="w-full bg-[#0F131F] border border-white/5 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
               <label htmlFor="password" className="block text-xs font-medium text-slate-500 uppercase tracking-wider">Senha de Acesso</label>
               <Link href="/forgot-password" className="text-xs text-cyan-500 hover:text-cyan-300 transition-colors">
                 Esqueci minha senha
               </Link>
            </div>
            <input id="password" name="password" type="password" required className="w-full bg-[#0F131F] border border-white/5 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700" />
          </div>

          <div className="pt-2 flex gap-4">
            <button formAction={login} className="flex-1 bg-white text-black font-bold py-3 rounded-lg hover:bg-cyan-50 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all">
              Entrar
            </button>
            <button formAction={signup} className="flex-1 bg-transparent border border-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/5 hover:border-cyan-500/30 transition-all">
              Criar Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
