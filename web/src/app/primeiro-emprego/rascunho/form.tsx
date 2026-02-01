'use client'

import { useFormStatus } from "react-dom";
import { registrarInteresse } from "./actions"; // Importa sua Action
import { ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group shadow-lg shadow-emerald-900/20"
    >
      {pending ? (
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
  );
}

export function LeadForm() {
  const [state, setState] = useState<{ success: boolean; message: string } | null>(null);

  async function clientAction(formData: FormData) {
    const result = await registrarInteresse(formData);
    setState(result);
  }

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
    <form action={clientAction} className="flex flex-col gap-4 w-full max-w-md mx-auto sm:mx-0">
      <div className="flex flex-col gap-2 text-left">
        {/* Input Oculto para definir o perfil */}
        <input type="hidden" name="perfil" value="aluno" />
        
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="Digite seu melhor e-mail..."
              className="relative w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-4 text-white placeholder:text-neutral-500 outline-none transition-all shadow-xl"
            />
        </div>
      </div>
      
      {state?.success === false && (
         <div className="text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {state.message}
         </div>
      )}
      
      <SubmitButton />
    </form>
  );
}