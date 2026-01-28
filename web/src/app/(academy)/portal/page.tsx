import Link from "next/link";
import { Play, Info, Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function PortalHome() {
  // 1. Conectar ao Supabase
  const supabase = await createClient();

  // 2. Buscar Cursos com Tratamento de Erro (FUSÃO TÉCNICA: Extração de 'error')
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  // BLINDAGEM CONTRA ERRO 500 (INJEÇÃO FUNCIONAL)
  // Se houver erro no banco, renderiza mensagem amigável ao invés de quebrar a página inteira
  if (error) {
    console.error("❌ ERRO CRÍTICO AO BUSCAR CURSOS:", error.message);
    return (
      <div className="h-screen flex flex-col items-center justify-center text-white bg-[#141414]">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Erro no Sistema</h1>
        <p className="text-zinc-400">Não foi possível carregar o catálogo.</p>
        <p className="text-xs text-zinc-600 mt-4 font-mono">Erro: {error.message}</p>
      </div>
    );
  }

  // 3. Lógica de Exibição Segura
  const safeCourses = courses || []; // Garante array vazio se for null
  const featuredCourse = safeCourses[0];
  const otherCourses = safeCourses.slice(1);

  return (
    <div className="pb-20">
      
      {/* BILLBOARD DINÂMICO */}
      {featuredCourse ? (
        <div className="relative h-[80vh] w-full overflow-hidden group">
          {/* Imagem de Fundo */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ 
              backgroundImage: `url(${featuredCourse.thumbnail_url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"})` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
          </div>

          <div className="absolute top-[30%] left-8 md:left-12 max-w-2xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/30 text-red-500 text-xs font-bold uppercase tracking-widest rounded mb-4">
              {featuredCourse.is_premium ? "Exclusivo Assinantes" : "Gratuito"}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
              {featuredCourse.title}
            </h1>
            <p className="text-lg text-slate-200 mb-8 drop-shadow-md leading-relaxed line-clamp-3">
              {featuredCourse.description}
            </p>
            
            <div className="flex items-center gap-4">
              <Link href={`/portal/watch/${featuredCourse.slug}`} className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded hover:bg-white/90 transition-all">
                <Play className="w-5 h-5 fill-black" /> Assistir
              </Link>
              <button className="flex items-center gap-2 px-8 py-3 bg-white/20 backdrop-blur-md text-white font-bold rounded hover:bg-white/30 transition-all">
                <Info className="w-5 h-5" /> Detalhes
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Fallback visualmente corrigido para fundo escuro
        <div className="h-[50vh] flex items-center justify-center text-white bg-[#141414]">
          <p className="animate-pulse">Carregando catálogo ou catálogo vazio...</p>
        </div>
      )}

      {/* TRILHAS DE CONTEÚDO */}
      <div className="relative z-20 -mt-32 px-8 space-y-12">
        <section>
          <h3 className="text-xl font-bold text-white mb-4 pl-1 border-l-4 border-red-600">
            Adicionados Recentemente
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Renderiza os outros cursos buscados do banco */}
            {otherCourses.length > 0 ? (
              otherCourses.map((course) => (
                <Link key={course.id} href={`/portal/watch/${course.slug}`}>
                  <div className="aspect-video bg-zinc-900 rounded-lg border border-white/5 hover:scale-105 hover:border-red-600/50 transition-all cursor-pointer relative overflow-hidden group">
                    {/* Imagem */}
                    {course.thumbnail_url ? (
                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">Sem Capa</div>
                    )}
                    
                    {/* Overlay Hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-12 h-12 text-white fill-white" />
                    </div>

                    {/* Badge Premium */}
                    {course.is_premium && (
                      <div className="absolute top-2 right-2 bg-black/60 p-1 rounded backdrop-blur-sm">
                        <Lock className="w-3 h-3 text-yellow-500" />
                      </div>
                    )}

                    {/* Info Inferior */}
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                      <p className="text-sm font-bold text-white truncate">{course.title}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Correção de layout: col-span-4 para não quebrar o grid
              <p className="text-slate-500 col-span-4">Nenhum outro curso encontrado no momento.</p>
            )}
            
            {/* Card Exemplo - Só aparece se não tiver nada (Lógica condicional aplicada para limpeza visual) */}
            {safeCourses.length === 0 && (
                <div className="aspect-video bg-zinc-800/50 rounded-lg border border-white/5 flex flex-col items-center justify-center text-center p-4 border-dashed col-span-1">
                <span className="text-slate-500 text-sm">Em breve novos cursos...</span>
                </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}