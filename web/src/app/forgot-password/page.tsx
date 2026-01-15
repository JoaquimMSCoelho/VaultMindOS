'use client'

import { useState } from 'react'
import { resetPassword } from './actions'
import Link from 'next/link'

export default function ForgotPassword() {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setMessage(null)

    const res = await resetPassword(formData)

    if (res?.error) {
      setError(res.error)
    } else {
      // A MENSAGEM EXATA QUE VOCÊ PEDIU
      setMessage('O e-mail de redefinição de senha foi enviado. Um e-mail de redefinição de senha foi enviada para o endereço de e-mail da sua conta, mas pode levar alguns minutos para aparecer na sua caixa de entrada. Aguarde pelo menos 10 minutos antes de tentar novamente ou verifique sua caixa de spam.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#151B2B] p-8 rounded-xl border border-white/10 shadow-2xl">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/10 mb-4">
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 14l-1 1-1 1H3l2-2h3l1-1h3l1-1h2a6 6 0 012-4zm-2 5h.01M7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Recuperar Acesso</h1>
          <p className="text-slate-400 text-sm mt-2">Digite seu e-mail para receber o link de reset.</p>
        </div>

        {message ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center animate-in fade-in zoom-in duration-300">
            <p className="text-sm text-green-400 font-medium leading-relaxed">
              {message}
            </p>
            <Link href="/login" className="block mt-4 text-sm font-bold text-white hover:text-cyan-400 transition-colors">
              Voltar para o Login
            </Link>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
                Endereço de Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="seu@email.com"
                className="w-full bg-[#0B0F19] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)]"
            >
              {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </button>
            
            <div className="text-center mt-6">
              <Link href="/login" className="text-sm text-slate-500 hover:text-white transition-colors">
                ← Voltar para Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
