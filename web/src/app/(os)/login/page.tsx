import { login, signup } from "./actions";
import Image from "next/image";
import { PoweredByFooter } from "@/components/ui/PoweredByFooter";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col relative overflow-hidden selection:bg-emerald-500/30">
      
      {/* CONTEÚDO PRINCIPAL (Centralizado com flex-1 para empurrar o footer) */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 z-10">
        
        {/* Efeito de Fundo (Glow sutil) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md space-y-8">
          
          {/* CABEÇALHO DO PRODUTO (VaultMindOS) */}
          <div className="flex flex-col items-center text-center space-y-4">
            
            {/* Logo Oficial do Produto (Substitui o SVG antigo) */}
            <div className="relative w-48 h-16 transition-transform hover:scale-105 duration-500">
                <Image 
                    src="/logo-vaultmind.png" 
                    alt="VaultMindOS" 
                    fill 
                    className="object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    priority
                />
            </div>
            
            {/* A ESTRATÉGIA DE SSO (Single Sign-On) */}
            <div className="space-y-1">
                <h1 className="text-xl font-medium text-white tracking-tight">
                  Acesso Único <span className="text-emerald-500 font-bold">ConnectionCyberOS</span>
                </h1>
                <p className="text-neutral-500 text-xs max-w-xs mx-auto">
                  Utilize sua credencial universal para acessar o VaultMindOS, AutoZap e o CyberTreina.
                </p>
            </div>
          </div>

          {/* FORMULÁRIO */}
          <form className="space-y-6 mt-8 bg-neutral-900/30 p-8 rounded-2xl border border-neutral-800/50 backdrop-blur-sm shadow-2xl">
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">
                E-mail Corporativo / Pessoal
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="seunome@exemplo.com"
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-neutral-700"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">
                Senha de Acesso
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-neutral-700"
              />
            </div>

            {/* Botões de Ação */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                formAction={login}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-emerald-900/20"
              >
                Entrar
              </button>
              <button
                formAction={signup}
                className="w-full bg-transparent hover:bg-neutral-800 text-neutral-400 hover:text-white font-medium py-3 rounded-lg border border-neutral-800 transition-all"
              >
                Criar Conta
              </button>
            </div>

          </form>

          {/* Footer de Segurança (Mantido do Original) */}
          <div className="flex justify-center items-center gap-2 text-neutral-600 text-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Ambiente Criptografado Ponta-a-Ponta</span>
          </div>
        </div>
      </div>

      {/* RODAPÉ GLOBAL DA HOLDING (Injeção Funcional) */}
      <PoweredByFooter />
      
    </div>
  );
}