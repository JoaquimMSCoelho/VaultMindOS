import Image from "next/image";

export function PoweredByFooter() {
  return (
    <footer className="w-full py-6 mt-auto border-t border-neutral-900/50 flex flex-col items-center justify-center gap-3 bg-neutral-950/30 backdrop-blur-sm">
      
      {/* Texto de Endosso */}
      <p className="text-[10px] uppercase tracking-widest text-neutral-600 font-semibold">
        Powered by ConnectionCyberOS Ecosystem
      </p>

      {/* Logos do Ecossistema (Aqui você adicionará o AutoZap no futuro) */}
      <div className="flex items-center gap-4 opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
        
        {/* Logo da Holding (Mãe) */}
        <div className="relative h-6 w-auto">
             {/* Ajuste width/height conforme a proporção real da sua imagem */}
             <Image 
                src="/logo-connection-cyber.png" 
                alt="ConnectionCyberOS" 
                width={120} 
                height={30} 
                className="object-contain h-full w-auto"
             />
        </div>

        {/* Separador Vertical (Quando tiver mais logos) */}
        {/* <div className="h-3 w-px bg-neutral-800"></div> */}

        {/* Exemplo Futuro: <Image src="/logo-autozap.png" ... /> */}
        
      </div>

      <p className="text-[10px] text-neutral-700">
        © 2026 ConnectionCyber Soluções em Tecnologia.
      </p>
    </footer>
  );
}