import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, PlayCircle, Lock, CheckCircle } from "lucide-react";

// Definição de Tipos
type Lesson = {
  id: string;
  title: string;
  duration: number;
  is_free: boolean;
  video_url: string;
  position: number;
};

type Module = {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
};

export default async function WatchPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const { aula } = await searchParams;
  const supabase = await createClient();

  // BUSCA HIERÁRQUICA
  const { data: course, error } = await supabase
    .from("courses")
    .select(`
      *,
      modules (
        id,
        title,
        position,
        lessons (
          id,
          title,
          duration,
          is_free,
          video_url,
          position
        )
      )
    `)
    .eq("slug", slug)
    .single();

  if (error || !course) {
    return notFound();
  }

  // Ordenação
  const sortedModules = (course.modules || []).sort((a: any, b: any) => a.position - b.position);
  sortedModules.forEach((mod: any) => {
    mod.lessons.sort((a: any, b: any) => a.position - b.position);
  });

  // LÓGICA DE SELEÇÃO DE AULA
  let activeLesson = null;
  let activeModuleTitle = "";

  const allLessons = sortedModules.flatMap((m: any) => m.lessons.map((l: any) => ({ ...l, moduleTitle: m.title })));

  if (aula) {
    activeLesson = allLessons.find((l: any) => l.id === aula);
  }
  
  if (!activeLesson && allLessons.length > 0) {
    activeLesson = allLessons[0];
  }

  activeModuleTitle = activeLesson?.moduleTitle || sortedModules[0]?.title;

  return (
    <div className="fixed inset-0 z-50 bg-[#141414] text-white flex flex-col font-sans">
      
      {/* HEADER DE NAVEGAÇÃO */}
      <header className="h-20 border-b border-white/10 flex items-center justify-between px-6 bg-[#141414] shrink-0">
        <div className="flex items-center gap-6">
          <Link 
            href="/portal" 
            className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </div>
            <span className="text-base font-medium">Voltar ao Portal</span>
          </Link>
          <div className="h-8 w-px bg-white/10 hidden md:block"></div>
          <h1 className="text-lg md:text-xl font-bold text-zinc-100 truncate max-w-[300px] md:max-w-xl">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
           <div className="text-sm text-zinc-500 hidden sm:block font-medium">
             Módulo {sortedModules.findIndex((m: any) => m.lessons.some((l: any) => l.id === activeLesson?.id)) + 1} de {sortedModules.length}
           </div>
        </div>
      </header>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* COLUNA 1: PLAYER DE VÍDEO + DESCRIÇÃO */}
        <div className="flex-1 bg-black flex flex-col relative overflow-y-auto custom-scrollbar">
          
          {/* ÁREA DO VÍDEO */}
          {activeLesson ? (
            <div className="w-full bg-black relative group flex-shrink-0 py-4 flex justify-center items-center bg-zinc-950 border-b border-white/5">
                <div className="w-full max-w-6xl px-4">
                    <div className="relative pt-[56.25%] w-full bg-zinc-900 rounded-lg overflow-hidden shadow-2xl shadow-black/50 border border-white/5"> 
                        <div className="absolute inset-0 flex items-center justify-center">
                            {activeLesson.video_url ? (
                                <video 
                                    key={activeLesson.id}
                                    controls 
                                    autoPlay 
                                    className="w-full h-full absolute inset-0 object-contain"
                                    src={activeLesson.video_url}
                                    poster={course.thumbnail_url}
                                >
                                </video>
                            ) : (
                                <div className="text-center">
                                     <Lock className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                                     <p className="text-lg text-zinc-500">Conteúdo indisponível</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
          ) : (
             <div className="flex-1 flex items-center justify-center text-zinc-500 min-h-[300px]">
                Carregando player...
             </div>
          )}

          {/* DADOS DA AULA - LAYOUT SPLIT (40/60) */}
          {activeLesson && (
              <div className="p-8 max-w-6xl mx-auto w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    
                    {/* LADO ESQUERDO: Título e Meta (40%) */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        <h2 className="text-2xl font-bold text-white leading-tight">{activeLesson.title}</h2>
                        
                        <div className="flex items-center gap-4 text-zinc-400">
                            <span className="flex items-center gap-2 text-sm">
                                <PlayCircle className="w-5 h-5" /> {Math.floor(activeLesson.duration / 60)} min
                            </span>
                            <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                            <span className="text-sm">{activeModuleTitle}</span>
                        </div>
                    </div>
                    
                    {/* LADO DIREITO: Descrição (60%) */}
                    <div className="lg:col-span-3 prose prose-invert max-w-none">
                        <h3 className="text-xl font-bold text-zinc-200 mb-3 mt-0">Descrição da Aula</h3>
                        {/* AJUSTE: Fonte reduzida de text-lg para text-base */}
                        <p className="text-zinc-300 text-base leading-relaxed">
                            Nesta aula vamos aprofundar os conceitos técnicos apresentados no módulo. 
                            Aproveite para fazer anotações e revisar o material complementar caso esteja disponível.
                        </p>
                    </div>

                  </div>
              </div>
          )}
        </div>

        {/* COLUNA 2: SIDEBAR */}
        <aside className="w-full lg:w-[420px] bg-[#141414] border-l border-white/5 flex flex-col h-[40vh] lg:h-full shrink-0">
            <div className="p-6 md:p-8 border-b border-white/5 bg-[#141414] z-10">
                <h3 className="font-bold text-xl text-white">Conteúdo</h3>
                <p className="text-sm text-zinc-400 mt-2 font-medium">
                    {sortedModules.length} Módulos • {allLessons.length} Aulas
                </p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
                {sortedModules.map((module: any, index: number) => (
                    <div key={module.id} className="border-b border-white/5 last:border-0">
                        <div className="px-6 py-4 bg-zinc-900/50 sticky top-0 z-10 backdrop-blur-sm border-y border-white/5">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Módulo {index + 1}</span>
                            <h4 className="font-bold text-zinc-200 text-base">{module.title}</h4>
                        </div>

                        <div>
                            {module.lessons.map((lesson: any) => {
                                const isActive = lesson.id === activeLesson?.id;
                                return (
                                  <Link 
                                      key={lesson.id}
                                      href={`/portal/watch/${slug}?aula=${lesson.id}`}
                                      className={`w-full text-left px-6 py-5 flex items-start gap-4 hover:bg-white/5 transition-colors group ${
                                          isActive ? "bg-white/5 border-l-4 border-red-600" : "border-l-4 border-transparent"
                                      }`}
                                  >
                                      <div className="mt-1 shrink-0">
                                          {isActive ? (
                                              <PlayCircle className="w-5 h-5 text-red-500" />
                                          ) : (
                                              <CheckCircle className="w-5 h-5 text-zinc-700 group-hover:text-zinc-500" />
                                          )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                          <p className={`text-base truncate ${isActive ? "text-white font-bold" : "text-zinc-400 font-medium"}`}>
                                              {lesson.title}
                                          </p>
                                          <span className="text-sm text-zinc-500 flex items-center gap-1 mt-2">
                                              <PlayCircle className="w-4 h-4" /> {Math.floor(lesson.duration / 60)} min
                                          </span>
                                      </div>
                                  </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </aside>

      </main>
    </div>
  );
}