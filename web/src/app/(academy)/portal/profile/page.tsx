import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Award } from "lucide-react"; 
import { ProfileForm } from "./ProfileForm"; // Importação do novo componente

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

  // 3. Buscar Assinaturas
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

  const isSocialProject = enrollments?.some(e => e.source === 'social_project');
  const isPremium = enrollments?.some(e => e.source === 'purchase' || e.source === 'subscription');
  const planName = isSocialProject ? "Bolsista - Projeto Primeiro Emprego" : (isPremium ? "Aluno Premium" : "Acesso Gratuito");

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-6 md:p-12 selection:bg-emerald-500/30">
      
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10 border-b border-neutral-800 pb-6">
          <Link 
            href="/portal" 
            className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors text-neutral-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
            <p className="text-xs text-neutral-500">Gerencie suas informações e acessos do VaultMindOS.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA: CARTÃO DE IDENTIFICAÇÃO */}
          <div className="col-span-1">
             <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
                {/* Glow Background */}
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
                
                <div className="w-28 h-28 rounded-full bg-neutral-950 flex items-center justify-center mb-4 border border-neutral-800 ring-4 ring-neutral-900 overflow-hidden relative group">
                   {profile?.avatar_url ? (
                     <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                   ) : (
                     <User className="w-10 h-10 text-neutral-600" />
                   )}
                </div>
                
                <h2 className="text-xl font-bold text-white mb-1">{profile?.full_name || "Aluno VaultMind"}</h2>
                <p className="text-xs text-neutral-500 mb-6 font-mono bg-black/30 px-2 py-1 rounded">{user.email}</p>
                
                <div className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-widest border flex items-center justify-center gap-2 ${
                    isSocialProject 
                      ? "bg-emerald-950/30 text-emerald-400 border-emerald-500/30" 
                      : "bg-neutral-800 text-neutral-300 border-neutral-700"
                }`}>
                    <Award className="w-3 h-3" />
                    {planName}
                </div>
             </div>
          </div>

          {/* COLUNA DIREITA: FORMULÁRIO E DETALHES */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            
            {/* FORMULÁRIO (Refatorado para Client Component) */}
            <section className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-6 md:p-8 backdrop-blur-sm">
               <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-500 mb-6 flex items-center gap-2">
                 <User className="w-4 h-4" /> Dados Pessoais
               </h3>
               
               {/* Injeção do Componente Cliente */}
               <ProfileForm 
                  fullName={profile?.full_name || ""} 
                  email={user.email || ""} 
               />
            </section>

            {/* CURSOS */}
            <section className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-6 md:p-8">
               <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-500 mb-6 flex items-center gap-2">
                 <Award className="w-4 h-4" /> Matrículas Ativas
               </h3>
               
               {enrollments && enrollments.length > 0 ? (
                 <div className="space-y-3">
                    {enrollments.map((enrollment: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-lg group hover:border-emerald-500/30 transition-colors">
                          <div>
                           <p className="font-bold text-sm text-neutral-200 group-hover:text-emerald-400 transition-colors">{enrollment.courses.title}</p>
                           <p className="text-[10px] text-neutral-500 mt-1">Início: {new Date(enrollment.created_at).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div className="text-right">
                             <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                                 enrollment.source === 'social_project' 
                                 ? 'bg-emerald-950 text-emerald-500 border-emerald-900' 
                                 : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                             }`}>
                               {enrollment.source === 'social_project' ? 'BOLSA INTEGRAL' : 'PREMIUM'}
                             </span>
                          </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="text-center py-8 text-neutral-600 text-sm bg-neutral-950/50 rounded-lg border border-dashed border-neutral-800">
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