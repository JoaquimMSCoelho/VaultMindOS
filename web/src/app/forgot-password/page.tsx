'use client'
import { useState } from 'react'
import { resetPassword } from './actions'
import Link from 'next/link'

export default function ForgotPassword() {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true); setError(null); setMessage(null);
    const res = await resetPassword(formData)
    if (res?.error) { setError(res.error) } 
    else { setMessage('O e-mail de redefinição de senha foi enviado. Verifique sua caixa de entrada ou spam.') }
    setLoading(false)
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>
        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity"><h1 className="text-3xl font-bold tracking-tight text-white mb-2">VaultMind<span className="text-cyan-400">OS</span></h1></Link>
          <p className="text-slate-400 text-sm">Recuperação de Acesso</p>
        </div>
        {message ? (
          <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-lg p-6 text-center animate-in fade-in zoom-in">
            <div className="text-cyan-400 text-4xl mb-4">📨</div>
            <p className="text-sm text-cyan-100 font-medium mb-6">{message}</p>
            <Link href="/login" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] block text-center">Voltar para o Login</Link>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-5">
            <div><label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Email</label><input name="email" type="email" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600" /></div>
            {error && <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-xs text-center">{error}</div>}
            <div className="pt-2"><button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)]">{loading ? 'Enviando...' : 'Enviar Link'}</button></div>
            <Link href="/login" className="w-full flex items-center justify-center bg-transparent border border-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/5 hover:border-cyan-500/30 transition-all mt-4">← Voltar para Login</Link>
          </form>
        )}
      </div>
    </div>
  )
}
