"use client";

import { useActionState } from "react";
import { updateProfile } from "./actions";
import { Save, Mail, Shield, Loader2 } from "lucide-react";

interface ProfileFormProps {
  fullName: string;
  email: string;
}

export function ProfileForm({ fullName, email }: ProfileFormProps) {
  // Hook para gerenciar o estado da Server Action (Loading, Sucesso, Erro)
  const [state, action, isPending] = useActionState(updateProfile, null);

  return (
    <form action={action} className="space-y-5">
      {/* Feedback de Sucesso/Erro */}
      {state?.message && (
        <div className={`p-3 rounded-lg text-xs font-bold border ${
          state.success 
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
            : 'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          {state.message}
        </div>
      )}

      {/* Campo Nome */}
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase">Nome Completo</label>
        <input 
          type="text" 
          name="fullName"
          defaultValue={fullName}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-neutral-700"
          placeholder="Como você quer ser chamado"
        />
      </div>
      
      {/* Campo Email (Somente Leitura) */}
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase">E-mail de Acesso</label>
        <div className="relative">
            <input 
              type="text" 
              value={email} 
              disabled 
              className="w-full bg-neutral-950/50 border border-neutral-800/50 rounded-lg px-4 py-3 text-neutral-500 cursor-not-allowed pl-10"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
        </div>
        <p className="text-[10px] text-neutral-600 mt-2 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Gerenciado pela ConnectionCyberOS Identity
        </p>
      </div>

      {/* Botão de Salvar com Loading State */}
      <div className="pt-4 flex justify-end">
        <button 
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-emerald-900/20 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isPending ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </form>
  );
}