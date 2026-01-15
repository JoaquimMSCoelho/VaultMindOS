import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // 1. Verificar Segurança no Servidor (Server Side)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Gatekeeper: Se não tiver crachá, chuta para o Login
  if (!user) {
    return redirect("/login");
  }

  // 3. Área Vip: Renderiza o Painel
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8">
      {/* Cabeçalho */}
      <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Terminal <span className="text-cyan-400">VaultMind</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Bem-vindo, Operador <span className="text-white font-mono">{user.email}</span>
          </p>
        </div>
        <form action="/auth/signout" method="post">
           <button className="px-4 py-2 text-sm bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-all">
             Encerrar Sessão
           </button>
        </form>
      </header>

      {/* Grid de Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Módulo 1: Saúde */}
        <div className="group p-6 bg-[#151B2B] rounded-xl border border-white/5 hover:border-cyan-500/50 transition-all cursor-pointer">
          <div className="h-10 w-10 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center mb-4 text-2xl">
            ✚
          </div>
          <h3 className="text-xl font-semibold mb-2">Saúde Ciclo da Vida</h3>
          <p className="text-slate-400 text-sm">Gestão de pacientes, prontuários e telemedicina.</p>
        </div>

        {/* Módulo 2: Marketing & Vendas */}
        <div className="group p-6 bg-[#151B2B] rounded-xl border border-white/5 hover:border-purple-500/50 transition-all cursor-pointer">
          <div className="h-10 w-10 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mb-4 text-2xl">
            🚀
          </div>
          <h3 className="text-xl font-semibold mb-2">Marketing & Afiliados</h3>
          <p className="text-slate-400 text-sm">Campanhas Digistore24, Tráfego e Automação.</p>
        </div>

        {/* Módulo 3: Varejo Inteligente */}
        <div className="group p-6 bg-[#151B2B] rounded-xl border border-white/5 hover:border-orange-500/50 transition-all cursor-pointer">
          <div className="h-10 w-10 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center mb-4 text-2xl">
            🛒
          </div>
          <h3 className="text-xl font-semibold mb-2">Varejo & Estoque</h3>
          <p className="text-slate-400 text-sm">Controle de PDV, estoque e logística integrada.</p>
        </div>

      </div>
    </div>
  );
}
