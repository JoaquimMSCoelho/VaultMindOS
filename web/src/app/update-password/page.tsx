import { updatePassword } from './actions'
import Link from 'next/link'

export default async function UpdatePasswordPage(props: { searchParams: Promise<{ error?: string }> }) {
  const params = await props.searchParams;
  const errorMessage = params?.error;

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>
        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity"><h1 className="text-3xl font-bold tracking-tight text-white mb-2">VaultMind<span className="text-cyan-400">OS</span></h1></Link>
          <p className="text-slate-400 text-sm">Definir Nova Senha</p>
        </div>
        {errorMessage && <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-sm text-center">{errorMessage}</div>}
        <form className="space-y-5">
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Nova Senha</label><input name="password" type="password" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600" /></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Confirmar</label><input name="confirmPassword" type="password" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600" /></div>
          <div className="pt-2"><button formAction={updatePassword} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)]">Atualizar Senha</button></div>
        </form>
      </div>
    </div>
  )
}
