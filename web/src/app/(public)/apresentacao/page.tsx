import { FeatureCard } from "@/components/ui/FeatureCard";
import { Briefcase, ShieldCheck, Network, Cpu, Zap } from "lucide-react";

export default function ApresentacaoPage() {
  const trilhas = [
    { title: "Administrativa 4.0", icon: Briefcase, desc: "Gestão digital e ERP moderno." },
    { title: "Segurança & IoT", icon: ShieldCheck, desc: "Monitoramento e automação residencial." },
    { title: "Redes & Conectividade", icon: Network, desc: "Infraestrutura Wi-Fi 6 e Fibra." },
    { title: "Suporte & Hardware", icon: Cpu, desc: "Manutenção proativa e recuperação." },
    { title: "Elétrica Moderna", icon: Zap, desc: "Eficiência energética e quadros inteligentes." },
  ];

  return (
    <main className="bg-neutral-950 text-neutral-100 min-h-screen">
      {/* Hero Section - Abertura do Roteiro */}
      <section className="py-20 px-6 border-b border-neutral-800">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            VaultMind<span className="text-emerald-500">OS</span>
          </h1>
          <p className="text-emerald-500 text-lg md:text-xl font-medium tracking-widest uppercase mb-8">
            Operating System of Personal Intelligence
          </p>
          <div className="inline-block px-4 py-1 border border-emerald-500/30 rounded-full bg-emerald-500/10 text-emerald-500 text-sm mb-12">
            Endosso: ConnectionCyberOS
          </div>
        </div>
      </section>

      {/* Grid de Trilhas - Diferencial Contextual */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12 text-emerald-500 uppercase tracking-tighter">
          Especialização por Injeção Dinâmica
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {trilhas.map((trilha) => (
            <FeatureCard 
              key={trilha.title}
              title={trilha.title}
              description={trilha.desc}
              icon={trilha.icon}
            />
          ))}
        </div>
      </section>

      {/* Call to Action - Conversão (React 19) */}
      <section className="py-16 bg-neutral-900/50 text-center">
        <h3 className="text-xl mb-6">Pronto para a Prontidão Técnica?</h3>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-md font-bold transition-all transform hover:scale-105">
          Garantir Minha Vaga (Live Demo)
        </button>
      </section>
    </main>
  );
}