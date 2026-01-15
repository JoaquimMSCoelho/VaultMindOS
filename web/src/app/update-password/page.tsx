import { updatePassword } from './actions'

export default async function UpdatePasswordPage(props: { searchParams: Promise<{ error?: string }> }) {
  const params = await props.searchParams;
  const errorMessage = params?.error;

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] bg-[#0B0F19] p-8 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Nova Senha</h1>
          <p className="text-slate-400 text-sm">Crie uma nova senha segura.</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center">
            {errorMessage}
          </div>
        )}

        <form className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Nova Senha</label>
            <input id="password" name="password" type="password" required placeholder="Mínimo 6 caracteres" className="w-full bg-[#0F131F] border border-white/5 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Confirmar Senha</label>
            <input id="confirmPassword" name="confirmPassword" type="password" required placeholder="Repita a senha" className="w-full bg-[#0F131F] border border-white/5 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700" />
          </div>

          <div className="pt-2">
            <button formAction={updatePassword} className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-cyan-50 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Atualizar Senha
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
