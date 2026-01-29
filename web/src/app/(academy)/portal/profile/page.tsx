import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Shield, CreditCard, Save } from "lucide-react";
import { updateProfile } from "./actions";

export default async function ProfilePage() {
  const supabase = await createClient();

  // 1. Buscar Usuário
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Buscar Dados do Perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // 3. Buscar Assinaturas/Matrículas (Para mostrar o plano)
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      source,
      status,
      created_at,
      courses (title)
    `)
    .eq("user_id", user.id)
    .eq("status", "active");

  // Lógica para determinar o "Nível" do usuário baseado nas matrículas
  const isSocialProject = enrollments?.some(e => e.source === 'social_project');
  const isPremium = enrollments?.some(e => e.source === 'purchase' || e.source === 'subscription');
  const planName = isSocialProject ? "Bolsista - Projeto Primeiro Emprego" : (isPremium ? "Aluno Premium" : "Acesso Gratuito");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-6 md:p-12" suppressHydrationWarning={true}>
      
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/portal" 
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA: CARTÃO DE IDENTIFICAÇÃO */}
          <div className="col-span-1">
             <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center mb-4 border-2 border-white/10">
                   {profile?.avatar_url ? (
                     <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                   ) : (
                     <User className="w-10 h-10 text-zinc-500" />
                   )}
                </div>
                <h2 className="text-lg font-bold text-white mb-1">{profile?.full_name || "Aluno VaultMind"}</h2>
                <p className="text-xs text-zinc-500 mb-4">{user.email}</p>
                
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    isSocialProject 
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}>
                    {planName}
                </div>
             </div>
          </div>

          {/* COLUNA DIREITA: FORMULÁRIO E DETALHES */}
          <div className="col-span-1 md:col-span-2 space-y-8">
            
            {/* FORMULÁRIO DE DADOS PESSOAIS */}
            <section className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 md:p-8">
               <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-zinc-200">
                 <User className="w-5 h-5 text-red-500" /> Dados Pessoais
               </h3>
               
               <form action={updateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Nome Completo</label>
                    <input 
                      type="text" 
                      name="fullName"
                      defaultValue={profile?.full_name || ""}
                      className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                      placeholder="Seu nome de exibição"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">E-mail (Login)</label>
                    <input 
                      type="text" 
                      value={user.email} 
                      disabled 
                      className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-3 text-zinc-500 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-zinc-600 mt-1">O e-mail não pode ser alterado por segurança.</p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button 
                      type="submit"
                      className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-bold hover:bg-zinc-200 transition-colors"
                    >
                      <Save className="w-4 h-4" /> Salvar Alterações
                    </button>
                  </div>
               </form>
            </section>

            {/* LISTA DE CURSOS ATIVOS (Matrículas) */}
            <section className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 md:p-8">
               <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-zinc-200">
                 <Shield className="w-5 h-5 text-red-500" /> Meus Acessos
               </h3>
               
               {enrollments && enrollments.length > 0 ? (
                 <div className="space-y-3">
                    {enrollments.map((enrollment: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-lg">
                         <div>
                           <p className="font-bold text-sm text-zinc-200">{enrollment.courses.title}</p>
                           <p className="text-xs text-zinc-500">Matriculado em: {new Date(enrollment.created_at).toLocaleDateString('pt-BR')}</p>
                         </div>
                         <div className="text-right">
                            <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-1 rounded">
                              {enrollment.source === 'social_project' ? 'BOLSA INTEGRAL' : 'PREMIUM'}
                            </span>
                         </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="text-center py-8 text-zinc-500 text-sm">
                   Nenhuma matrícula ativa encontrada.
                 </div>
               )}
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}