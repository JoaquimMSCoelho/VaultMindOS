import { Navbar } from "@/components/Navbar";
import { PoweredByFooter } from "@/components/ui/PoweredByFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col selection:bg-emerald-500/30">
      {/* Componente de Navegação Global (Com Logo Novo e Botão Portal) */}
      <Navbar />
      
      {/* Conteúdo (Compensando a altura da navbar fixa) */}
      <main className="flex-1 pt-20"> 
        {children}
      </main>
      
      {/* Rodapé da Holding */}
      <PoweredByFooter />
    </div>
  );
}