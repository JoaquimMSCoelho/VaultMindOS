"use client";

import { useActionState } from "react";
import { registrarInteresse } from "./actions";
import { Mail, Loader2, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

export function PrimeiroEmpregoForm() {
  // Hook nativo do Next.js 15 para gerenciar Server Actions com estado
  const [state, action, isPending] = useActionState(registrarInteresse, null);

  // Se o cadastro for bem-sucedido, mostramos o card de sucesso (preservando o visual original)
  if (state?.success) {
    return (
      <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 animate-in fade-in slide-in-from-bottom-4">
        <CheckCircle className="w-6 h-6 shrink-0" />
        <div>
          <span className="font-bold block">Sucesso!</span>
          <span className="text-sm opacity-90">{state.message}</span>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4 w-full max-w-md mx-auto sm:mx-0">
      
      <div className="flex flex-col gap-2 text-left">
        {/* Inputs Ocultos (Lógica de Negócio) */}
        <input type="hidden" name="trilha" value="geral" />
        <input type="hidden" name="perfil" value="aluno" />
        
        {/* Input de E-mail com Visual Glow */}
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-neutral-900 rounded-xl border border-neutral-800 focus-within:border-emerald-500 transition-colors">
                <Mail className="absolute left-4 w-5 h-5 text-neutral-500" />
                <input 
                  type="email" 
                  name="email" 
                  required 
                  placeholder="Digite seu melhor e-mail..."
                  className="w-full bg-transparent px-4 py-4 pl-12 text-white placeholder:text-neutral-500 outline-none rounded-xl"
                />
            </div>
        </div>
      </div>
      
      {/* Feedback de Erro */}
      {state?.success === false && (
         <div className="text-red-400 text-sm flex items-center gap-2 px-1">
            <AlertCircle className="w-4 h-4" /> {state.message}
         </div>
      )}
      
      {/* Botão de Submit */}
      <button 
        type="submit" 
        disabled={isPending}
        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group shadow-lg shadow-emerald-900/20"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Registrando...
          </>
        ) : (
          <>
            Quero me inscrever na lista de espera
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}