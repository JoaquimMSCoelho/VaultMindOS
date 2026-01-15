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
    else { setMessage('O e-mail de redefinição de senha foi enviado. Verifique sua caixa de entrada ou spam. O link expira em breve.') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] bg-[#0B0F19] p-8 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity" title="Voltar para a Home">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              VaultMind<span className="text-cyan-400">OS</span>
            </h1>
          </Link>
          <p className="text-slate-400 text-sm">Recuperação de Acesso</p>
        </div>

        {message ? (
          <div className="bg-cyan-950/50 border border-cyan-500/30 rounded-lg p-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="text-cyan-400 text-4xl mb-4">📨</div>
            <p className="text-sm text-cyan-100 font-medium leading-relaxed mb-6">
              {message}
            </p>
            <Link href="/login" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(8,145,178,0.2)] hover:shadow-[0_0_30px_rgba(8,145,178,0.4)] block text-center">
              Voltar para o Login
            </Link>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Endereço de Email</label>
              <input id="email" name="email" type="email" required placeholder="Digite seu e-mail cadastrado" className="w-full bg-[#0F131F] border border-white/5 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-700" />
            </div>

            {error && (<div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs text-center">{error}</div>)}

            <div className="pt-2">
                <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(8,145,178,0.2)] hover:shadow-[0_0_30px_rgba(8,145,178,0.4)]">
                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </button>
            </div>
            
            <Link href="/login" className="w-full flex items-center justify-center bg-transparent border border-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/5 hover:border-cyan-500/30 transition-all mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Voltar para Login
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}
