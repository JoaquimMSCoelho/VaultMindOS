import Link from "next/link";
import { PlayCircle, Award, Layout, LogOut, Search, Bell } from "lucide-react";

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-red-600/30 flex">
      
      {/* SIDEBAR DE NAVEGAÇÃO (Esquerda) */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-black/50 backdrop-blur-xl border-r border-white/5 flex flex-col z-50 transition-all">
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-center md:justify-start md:px-8 border-b border-white/5">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center font-bold text-white shadow-lg shadow-red-900/40">
            ▶
          </div>
          <span className="hidden md:block ml-3 font-bold tracking-tight text-lg">
            CC<span className="text-red-600">Play</span>
          </span>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-8 flex flex-col gap-2 px-2 md:px-4">
          <Link href="/portal" className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
            <PlayCircle className="w-6 h-6 group-hover:text-red-500 transition-colors" />
            <span className="hidden md:block font-medium">Início</span>
          </Link>
          
          <Link href="/portal/meus-cursos" className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
            <Layout className="w-6 h-6 group-hover:text-red-500 transition-colors" />
            <span className="hidden md:block font-medium">Minha Lista</span>
          </Link>

          <Link href="/portal/certificados" className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
            <Award className="w-6 h-6 group-hover:text-red-500 transition-colors" />
            <span className="hidden md:block font-medium">Certificados</span>
          </Link>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-white/5">
          <Link href="/login" className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="hidden md:block font-medium text-sm">Sair</span>
          </Link>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL (Conteúdo) */}
      <main className="flex-1 ml-20 md:ml-64 relative">
        {/* Topbar Flutuante */}
        <header className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/80 to-transparent z-40 flex items-center justify-end px-8 gap-6">
          <button className="text-white hover:text-gray-300">
            <Search className="w-5 h-5" />
          </button>
          <button className="text-white hover:text-gray-300 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
          </button>
          <div className="w-8 h-8 rounded bg-slate-700 border border-white/10 overflow-hidden">
             {/* Avatar Placeholder */}
             <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800"></div>
          </div>
        </header>

        {/* Injeção das Páginas (Portal, Watch, etc) */}
        {children}
      </main>
    </div>
  );
}
