import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO DA HOLDING (ConnectionCyberOS) */}
        <Link href="/" className="relative h-8 w-48 opacity-90 hover:opacity-100 transition-opacity">
           {/* Usa o logo da ConnectionCyber que você salvou */}
           <Image 
             src="/logo-connection-cyber.png" 
             alt="ConnectionCyberOS" 
             fill 
             className="object-contain object-left"
             priority
           />
        </Link>

        {/* LINKS (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <Link href="/" className="hover:text-emerald-500 transition-colors">Home</Link>
          <Link href="/servicos" className="hover:text-emerald-500 transition-colors">Soluções</Link>
          <Link href="/contato" className="hover:text-emerald-500 transition-colors">Contato</Link>
        </div>

        {/* BOTÃO DE ACESSO (Portal) */}
        <div className="flex items-center gap-4">
           {/* Link para Área do Cliente (Opcional, se tiver outro sistema) */}
           <Link href="/cliente" className="hidden md:block text-[10px] uppercase tracking-widest font-bold text-neutral-500 hover:text-white transition-colors">
             Área do Cliente
           </Link>

           <Link 
             href="/login" 
             className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wide px-5 py-2.5 rounded hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
           >
             Portal do Aluno
           </Link>
        </div>

      </div>
    </nav>
  );
}