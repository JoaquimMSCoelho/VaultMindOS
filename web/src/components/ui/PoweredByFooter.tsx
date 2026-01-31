import Image from "next/image";

export function PoweredByFooter() {
  return (
    <footer className="w-full py-6 bg-neutral-950 border-t border-neutral-900">
      {/* LAYOUT GLOBAL:
         - flex-row: Mantém tudo na mesma linha.
         - items-center: Alinhamento vertical perfeito.
      */}
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-center gap-5 text-sm text-neutral-500">
        
        {/* 1. TEXTO TRICOLOR (Connection = Verde, Cyber = Branco, OS = Vermelho) */}
        <span className="opacity-90 tracking-wide flex items-center gap-1">
          Powered by 
          <span className="font-bold tracking-tight">
            <span className="text-emerald-500">Connection</span>
            <span className="text-white">Cyber</span>
            <span className="text-red-600">OS</span>
          </span>
          Ecosystem
        </span>

        {/* 2. LOGO DO SISTEMA (Aumentado de w-24 para w-32) */}
        <div className="relative w-32 h-8 grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100 shrink-0">
          <Image 
            src="/logo-vaultmind.png" 
            alt="VaultMindOS" 
            fill 
            className="object-contain"
            priority
          />
        </div>

        {/* 3. COPYRIGHT */}
        <span className="opacity-80 text-xs md:text-sm">
          © 2026 ConnectionCyber Soluções em Tecnologia.
        </span>

      </div>
    </footer>
  );
}