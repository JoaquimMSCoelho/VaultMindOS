import Link from "next/link";
import Image from "next/image";
import { PlayCircle, Award, Layout, LogOut, Search, Bell, User } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let avatarUrl = null;
  if (user) {
      const { data: profile } = await supabase.from("profiles").select("avatar_url").eq("id", user.id).single();
      avatarUrl = profile?.avatar_url;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500/30 flex">
      
      {/* SIDEBAR DE NAVEGAÇÃO (Esquerda) */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col z-50 transition-all">
        
        {/* Logo Area (VaultMindOS) */}
        <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-neutral-800 bg-neutral-900/20">
          <Link href="/portal" className="relative w-40 h-10 hidden md:block opacity-90 hover:opacity-100 transition-opacity">
             <Image 
                src="/logo-vaultmind.png" 
                alt="VaultMindOS" 
                fill 
                className="object-contain object-left"
                priority
             />
          </Link>
          {/* Logo Mobile (Ícone) */}
          <div className="md:hidden w-10 h-10 relative">
             <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white">V</div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-8 flex flex-col gap-2 px-2 md:px-4">
          <Link href="/portal" className="flex items-center gap-4 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-xl transition-all group">
            <PlayCircle className="w-5 h-5 group-hover:text-emerald-500 transition-colors" />
            <span className="hidden md:block font-medium text-sm">Início</span>
          </Link>
          
          <Link href="/portal/meus-cursos" className="flex items-center gap-4 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-xl transition-all group">
            <Layout className="w-5 h-5 group-hover:text-emerald-500 transition-colors" />
            <span className="hidden md:block font-medium text-sm">Minha Lista</span>
          </Link>

          <Link href="/portal/certificados" className="flex items-center gap-4 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-xl transition-all group">
            <Award className="w-5 h-5 group-hover:text-emerald-500 transition-colors" />
            <span className="hidden md:block font-medium text-sm">Certificados</span>
          </Link>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-neutral-800">
          <form action="/auth/signout" method="post">
            <button className="w-full flex items-center gap-4 px-4 py-3 text-neutral-500 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="hidden md:block font-medium text-sm">Sair</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL (Conteúdo) */}
      <main className="flex-1 ml-20 md:ml-64 relative bg-neutral-950">
        
        {/* Topbar Flutuante */}
        <header className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-neutral-950 via-neutral-950/80 to-transparent z-40 flex items-center justify-end px-8 gap-6 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-4">
              <button className="text-neutral-400 hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-neutral-400 hover:text-white relative transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </button>
              
              {/* Avatar do Usuário */}
              <Link href="/portal/profile">
                <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden hover:border-emerald-500 transition-colors cursor-pointer relative">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-500">
                            <User className="w-5 h-5" />
                        </div>
                    )}
                </div>
              </Link>
          </div>
        </header>

        {/* Injeção das Páginas */}
        {children}
      </main>
    </div>
  );
}