import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  Cpu, 
  Users,
  ShieldCheck,
  Zap,
  Monitor,
  Rocket,
  Briefcase
} from 'lucide-react';

export default function Home() {

  const features = [
    {
        title: 'Administrativa 4.0',
        icon: Users,
        description: 'Gestão de Sistemas, ERP/CRM/SaaS e Rotinas Digitais.'
    },
    {
        title: 'Segurança & Automação',
        icon: ShieldCheck,
        description: 'Projetos de monitoramento inteligente, câmeras IP. CFTV IP e Dispositivos IoT'
    },
    {
        title: 'Redes & Conectividade',
        icon: Zap,
        description: 'Projetos de monitoramento inteligente, câmeras IP, Wi-Fi 6, controle de acesso e Infraestrutura'
    },
    {
        title: 'Suporte & Hardware',
        icon: Monitor,
        description: 'Manutenção e Diagnóstico, computadores, notebook, câmeras IP, roteadores, Wi-Fi 6, controle de acesso e Infraestrutura'
    },
    {
        title: 'Elétrica Moderna',
        icon: Rocket,
        description: 'Instalações e Eficiência Solar, manutenção e diagnóstico, projetos controle de acesso e Infraestrutura'
    },
    {
        title: 'Consultoria Fiscal',
        icon: Briefcase,
        description: 'Assessoria especializada em IRPF, IRPJ e regularização tributária.'
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-emerald-500/30 flex flex-col">
      
      <Navbar />

      {/* AJUSTE 1: Mudei pt-20 para pt-16 (menos espaço pro topo) */}
      <main className="flex-1 pt-16">
        
        {/* HERO SECTION COMPACTA */}
        {/* AJUSTE 2: py-28 -> py-12 / min-h-[80vh] -> min-h-[60vh] (Sobe tudo drasticamente) */}
        <header className="relative py-12 px-4 overflow-hidden flex flex-col items-center justify-center min-h-[60vh]">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none" />
           <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20"></div>

           <div className="max-w-5xl mx-auto text-center relative z-10">
             
             {/* AJUSTE 3: mb-8 -> mb-6 (Aproxima badge do título) */}
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/80 border border-neutral-800 backdrop-blur-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
               <span className="relative flex h-2.5 w-2.5">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
               </span>
               <span className="text-sm font-medium text-neutral-300">Ecossistema Integrado de Tecnologia e Educação</span>
             </div>

             {/* Título Ajustado (Mantido 3xl/4xl mas com margem menor: mb-6) */}
             <h1 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
               O Sistema Operacional da sua <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 text-glow">
                 Evolução Corporativa.
               </span>
             </h1>
             
             {/* Subtítulo: mb-12 -> mb-8 (Aproxima texto dos botões) */}
             <p className="text-lg md:text-xl text-neutral-400 mb-8 leading-relaxed max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
               Centralize gestão, capacitação e inteligência estratégica em uma única plataforma. 
               Do "Primeiro Emprego" à liderança executiva, o VaultMindOS conecta potenciais a resultados.
             </p>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
               <Link href="/servicos" className="group bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-full text-base font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:scale-105">
                 Explorar Soluções
                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Link>
               <Link href="/primeiro-emprego" className="group bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 text-white px-8 py-3.5 rounded-full text-base font-medium transition-all flex items-center gap-2 backdrop-blur-sm hover:scale-105">
                 Iniciativa Primeiro Emprego
               </Link>
             </div>

           </div>
        </header>


        {/* Nossas Áreas de Atuação - Compactada */}
        {/* AJUSTE 4: py-24 -> py-16 (Sobe os cards para perto do Hero) */}
        <section className="py-16 bg-neutral-950 relative overflow-hidden border-t border-neutral-900">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/5 rounded-full blur-[150px] pointer-events-none" />

            {/* AJUSTE 5: mb-16 -> mb-10 (Aproxima título dos cards) */}
            <div className="text-center mb-10 relative z-10 px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-tight">
                    Nossas Áreas de Atuação
                </h2>
                <p className="text-neutral-400 max-w-2xl mx-auto">
                   Tecnologia de ponta a ponta para sua corporação.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>
        </section>


        {/* Why Us Section - Compactada */}
        {/* AJUSTE 6: py-24 -> py-16 */}
        <section className="py-16 bg-neutral-900/30 relative border-y border-neutral-900">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
              
              <div className="relative">
                  <div className="aspect-square rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden relative group">
                       <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-transparent to-emerald-900/20 opacity-50 group-hover:opacity-70 transition-opacity" />
                       
                       <div className="absolute inset-4 border border-neutral-800 rounded-2xl bg-neutral-950/50 p-6 flex flex-col gap-4 backdrop-blur-md">
                           <div className="h-8 w-3/4 bg-neutral-800/50 rounded-lg animate-pulse" />
                           <div className="flex gap-4">
                               <div className="h-24 w-1/2 bg-neutral-800/50 rounded-lg" />
                               <div className="h-24 w-1/2 bg-emerald-900/20 border border-emerald-500/20 rounded-lg relative overflow-hidden">
                                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                               </div>
                           </div>
                           <div className="h-8 w-full bg-neutral-800/50 rounded-lg" />
                           <div className="h-32 w-full bg-neutral-800/50 rounded-lg mt-auto" />
                       </div>

                       <div className="absolute -top-6 -right-6 w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center shadow-xl transform rotate-12 group-hover:rotate-6 transition-transform">
                           <Cpu className="w-8 h-8 text-emerald-500" />
                       </div>
                       <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center shadow-xl transform -rotate-12 group-hover:-rotate-6 transition-transform">
                           <Shield className="w-8 h-8 text-emerald-500" />
                       </div>
                  </div>
              </div>

              <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                      Muito mais que software. <br />
                      Uma <span className="text-emerald-500">parceria estratégica.</span>
                  </h2>
                  <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
                      O ConnectionCyberOS Ecosystem não apenas fornece as ferramentas, mas também o caminho para o crescimento sustentável.
                      Integramos tecnologia de ponta com desenvolvimento humano.
                  </p>
                  
                  <ul className="space-y-4">
                      {[
                          { title: 'Segurança Unificada', desc: 'Proteção de dados e ativos físicos em uma única visão.' },
                          { title: 'Capacitação Contínua', desc: 'Sua equipe treinada nas tecnologias que sua empresa usa.' },
                          { title: 'Eficiência Operacional', desc: 'Automatize rotinas e foque no que realmente importa.' },
                      ].map((item, i) => (
                          <li key={i} className="flex items-start gap-4 group">
                              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              </div>
                              <div>
                                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                                  <p className="text-neutral-500">{item.desc}</p>
                              </div>
                          </li>
                      ))}
                  </ul>
              </div>

          </div>
        </section>

      </main>
      
    </div>
  );
}