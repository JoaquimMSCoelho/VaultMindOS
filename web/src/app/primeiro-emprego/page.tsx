import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { LeadForm } from './form';
import { PoweredByFooter } from "@/components/ui/PoweredByFooter"; 
// Importamos o novo componente padronizado (Fusão Técnica)
import { FeatureCard } from '@/components/ui/FeatureCard';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Monitor, 
  Zap,
  Users,
  Rocket
} from 'lucide-react';

export default function PrimeiroEmpregoLanding() {
  // Dados estruturados para o componente FeatureCard
  const trilhas = [
    { title: 'Administrativa 4.0', icon: Users, description: 'Gestão, ERP e Rotinas Digitais' },
    { title: 'Segurança & Automação', icon: ShieldCheck, description: 'CFTV IP e Dispositivos IoT' },
    { title: 'Redes & Conectividade', icon: Zap, description: 'Wi-Fi 6 e Infraestrutura' },
    { title: 'Suporte & Hardware', icon: Monitor, description: 'Manutenção e Diagnóstico' },
    { title: 'Elétrica Moderna', icon: Rocket, description: 'Instalações e Eficiência Solar' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-emerald-500/30 flex flex-col">
      
      {/* HEADER SIMPLIFICADO (MANTIDO DO ARQUIVO ORIGINAL - VALIDADO) */}
      <nav className="border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo do Produto */}
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:opacity-80 transition-opacity relative w-40 h-10">
                 <Image 
                    src="/logo-vaultmind.png" 
                    alt="VaultMindOS" 
                    fill 
                    className="object-contain object-left"
                    priority
                />
            </Link>
          </div>

          {/* Botão Único de Acesso */}
          <Link href="/login" className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-all hover:border-emerald-500/50">
            Já sou Aluno
          </Link>
        </div>
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1">
        
        {/* Hero Section (Mantido visualmente idêntico) */}
        <header className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent)]" />
          <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
            
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full animate-in fade-in zoom-in duration-700">
              Iniciativa Primeiro Emprego & Recolocação
            </span>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 tracking-tight leading-tight">
              Transformando Potencial em Prontidão.
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-400 mb-10 leading-relaxed max-w-2xl">
              A ponte definitiva entre quem quer trabalhar e quem precisa contratar. 
              Uma metodologia inovadora de capacitação técnica contextualizada dentro do ecossistema VaultMindOS.
            </p>

            <div className="flex flex-col items-center gap-6 w-full max-w-md">
              {/* FORMULÁRIO */}
              <LeadForm />
              
              <p className="text-xs text-neutral-600">
                  Junte-se a lista de espera para receber novidades em 
                  <span className="text-emerald-500 font-medium"> contatos@cyberconnection.com.br</span>
              </p>
            </div>

          </div>
        </header>

        {/* Trilhas de Formação - REFATORADO PARA USAR COMPONENTE (VISUAL MANTIDO) */}
        <section className="py-20 px-4 bg-neutral-900/30 border-y border-neutral-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Trilhas de Especialização Contextual</h2>
              <p className="text-neutral-500">Você não aprende apenas a ferramenta. Você aprende a profissão.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {trilhas.map((trilha, i) => (
                <FeatureCard key={i} {...trilha} />
              ))}
            </div>
          </div>
        </section>

        {/* O Diferencial VaultMind (Mantido visualmente idêntico) */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Metodologia Transversal com <span className="text-emerald-500 text-glow">IA e Inteligência Profissional.</span>
              </h2>
              <ul className="space-y-4">
                {[
                  'Domínio de IA para produtividade em todas as áreas.',
                  'Gestão de carreira com LinkedIn estratégico.',
                  'Noções de MEI e Contabilidade integrada.',
                  'Simulação de Empresa Fictícia para prática real.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-400">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="order-1 md:order-2 aspect-video bg-neutral-900 rounded-3xl border border-neutral-800 flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative text-center z-10">
                  <Monitor className="w-16 h-16 text-neutral-700 mx-auto mb-4 group-hover:text-emerald-500 transition-colors" />
                  <p className="text-neutral-500 font-mono text-sm">Preview: VaultMindOS Academy Module</p>
                </div>
            </div>
          </div>
        </section>

      </main>

      {/* RODAPÉ GLOBAL */}
      <PoweredByFooter />
      
    </div>
  );
}