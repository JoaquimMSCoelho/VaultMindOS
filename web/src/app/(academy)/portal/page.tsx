import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Play, Info, Lock, Zap, LogOut, Clock, Award, PlayCircle } from "lucide-react";

export default async function PortalDashboard() {
  // 1. Conectar ao Supabase
  const supabase = await createClient();

  // 2. SEGURANÇA: Verifica usuário logado
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  // --- BUSCAR PERFIL ---
  // Busca o nome de exibição para mostrar no Header
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // 3. BUSCA DE DADOS BLINDADA (Via Enrollments)
  // Filtra por cursos que tenham uma matrícula correspondente ao usuário
  const { data: courses, error } = await supabase
    .from("courses")
    .select(`
      *,
      modules (
        lessons (id)
      ),
      enrollments!inner (
        status,
        source
      )
    `)
    .eq("is_published", true)
    .eq("enrollments.user_id", user.id)
    .in("enrollments.status", ["active", "completed"])
    .order("created_at", { ascending: false });

  // 4. Busca o Progresso do Usuário
  const { data: progress } = await supabase
    .from("user_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("is_completed", true);

  const completedLessonIds = new Set(progress?.map((p) => p.lesson_id) || []);

  if (error) {
    console.error("❌ ERRO CRÍTICO AO BUSCAR CURSOS:", error.message);
    return (
      <div className="h-screen flex flex-col items-center justify-center text-white bg-neutral-950">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Erro no Sistema</h1>
        <p className="text-neutral-400">Não foi possível verificar suas matrículas.</p>
        <p className="text-xs text-neutral-600 mt-4 font-mono">Erro: {error.message}</p>
      </div>
    );
  }

  const safeCourses = courses || [];
  const featuredCourse = safeCourses[0];
  const otherCourses = safeCourses.slice(1);

  const getProgress = (course: any) => {
    const totalLessons = course.modules?.reduce((acc: number, mod: any) => acc + mod.lessons.length, 0) || 0;
    const completedCount = course.modules?.reduce((acc: number, mod: any) => {
       return acc + mod.lessons.filter((l: any) => completedLessonIds.has(l.id)).length;
    }, 0) || 0;
    const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    return { percent, completedCount, totalLessons };
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col pb-20 selection:bg-emerald-500/30"
    suppressHydrationWarning={true}
    >
      
      {/* HEADER DO DASHBOARD */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="w-full px-6 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <Zap className="w-6 h-6 text-emerald-500" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">VaultMind<span className="text-emerald-500">Academy</span></h1>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="text-right hidden sm:block">
                <p className="text-xs text-neutral-500 uppercase tracking-wider">Aluno</p>
                <p className="text-sm font-medium text-white">
                    {profile?.full_name || user.email?.split('@')[0]}
                </p>
             </div>
             {/* Botão Sair */}
             <form action="/auth/signout" method="post">
                <button className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors" title="Sair">
                  <LogOut className="w-5 h-5" />
                </button>
             </form>
          </div>
        </div>
      </header>

      {/* BILLBOARD DINÂMICO */}
      {featuredCourse ? (
        (() => {
            const { percent, completedCount, totalLessons } = getProgress(featuredCourse);
            const hasStarted = percent > 0;
            const isCompleted = percent === 100 && totalLessons > 0;

            return (
                <div className="relative h-[50vh] w-full overflow-hidden group">
                  {/* Imagem de Fundo */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ 
                      backgroundImage: `url(${featuredCourse.thumbnail_url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"})` 
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
                  </div>

                  <div className="absolute inset-0 w-full px-6 md:px-8 flex flex-col justify-center z-10 pointer-events-none">
                      
                      <div className="max-w-6xl -mt-12 pointer-events-auto"> 
                        
                        <div className="flex items-center gap-3 mb-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest rounded">
                                {featuredCourse.enrollments[0]?.source === 'social_project' ? "Projeto Social" : (featuredCourse.is_premium ? "Destaque" : "Gratuito")}
                            </div>
                            {isCompleted && (
                                <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 text-xs font-bold uppercase tracking-widest rounded">
                                    <Award className="w-3 h-3" /> Concluído
                                </div>
                            )}
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-2xl leading-none tracking-tighter">
                          {featuredCourse.title}
                        </h1>
                        
                        <p className="text-lg text-neutral-300 mb-6 drop-shadow-md leading-relaxed line-clamp-2 max-w-2xl">
                          {featuredCourse.description}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <Link 
                            href={`/portal/watch/${featuredCourse.slug}`} 
                            className={`flex items-center gap-3 px-8 py-3.5 font-bold rounded hover:scale-105 transition-all shadow-lg ${hasStarted ? 'bg-white text-neutral-950' : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20'}`}
                          >
                            {isCompleted ? (
                                <> <PlayCircle className="w-5 h-5" /> Revisar Curso </>
                            ) : hasStarted ? (
                                <> <Play className="w-5 h-5 fill-current" /> Continuar (Aula {completedCount + 1}) </>
                            ) : (
                                <> <Play className="w-5 h-5 fill-current" /> Começar Agora </>
                            )}
                          </Link>
                          
                          {hasStarted && (
                              <div className="flex flex-col gap-1 w-full sm:w-64">
                                  <div className="flex justify-between text-xs font-medium text-neutral-400">
                                      <span>Progresso</span>
                                      <span className="text-white">{percent}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                      <div 
                                          className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                          style={{ width: `${percent}%` }}
                                      ></div>
                                  </div>
                              </div>
                          )}
                        </div>
                      </div>
                  </div>
                </div>
            );
        })()
      ) : (
        // STATE EMPTY
        <div className="h-[60vh] flex flex-col items-center justify-center text-white bg-neutral-950 px-4 text-center">
          <div className="p-4 bg-neutral-900 rounded-full mb-4">
            <Lock className="w-8 h-8 text-neutral-600" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Nenhum curso disponível</h2>
          <p className="text-neutral-400 max-w-md">
            Você ainda não possui matrículas ativas. Se você faz parte do <span className="text-emerald-500 font-bold">Projeto Primeiro Emprego</span>, aguarde a liberação ou entre em contato com o suporte.
          </p>
        </div>
      )}

      {/* TRILHAS DE CONTEÚDO */}
      {otherCourses.length > 0 && (
          <div className="relative z-20 -mt-15 px-6 md:px-8 w-full">
            <section>
              <h3 className="text-xl font-bold text-white mb-6 pl-1 border-l-4 border-emerald-500 flex items-center gap-2">
                Meus Cursos e Trilhas
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {otherCourses.map((course) => {
                    const { percent, completedCount, totalLessons } = getProgress(course);
                    const isCompleted = percent === 100 && totalLessons > 0;

                    return (
                      <Link key={course.id} href={`/portal/watch/${course.slug}`}>
                        <div className="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300 relative flex flex-col h-full">
                          
                          <div className="aspect-video relative overflow-hidden bg-neutral-800">
                            {course.thumbnail_url ? (
                                <img 
                                    src={course.thumbnail_url} 
                                    alt={course.title} 
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                    <PlayCircle className="w-12 h-12" />
                                </div>
                            )}
                            
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-12 h-12 text-white fill-white drop-shadow-lg" />
                            </div>

                            {isCompleted && (
                                <div className="absolute top-2 right-2 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow">
                                    CONCLUÍDO
                                </div>
                            )}
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between bg-neutral-900">
                            <div>
                                <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 mb-1">
                                    {course.title}
                                </h4>
                                <p className="text-xs text-neutral-500 line-clamp-2 mb-4">
                                    {course.description || "Sem descrição."}
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px] font-medium text-neutral-400">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {completedCount}/{totalLessons} Aulas
                                    </span>
                                    <span className={isCompleted ? "text-emerald-500" : "text-neutral-300"}>{percent}%</span>
                                </div>
                                <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all ${isCompleted ? 'bg-emerald-500' : 'bg-emerald-600'}`}
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </section>
          </div>
      )}
    </div>
  );
}