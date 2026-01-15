import DashboardCard from '@/components/DashboardCard'
import Link from 'next/link'
import { signOut } from '@/app/actions' // Caminho corrigido para usar Alias @

// Dados dos produtos
const products = [
  { title: "SAAS Stackposts — Ferramenta de marketing social", category: "Marketing", link: "#" },
  { title: "SAAS CARDÁPIO DIGITAL Multi Restaurante", category: "Food Service", link: "#" },
  { title: "SAAS Delivery Stackfood + APPS", category: "Delivery", link: "#" },
  { title: "6amMart - Solução de comércio eletrônico", category: "E-commerce", link: "#" },
  { title: "SAAS whaticket - Sistema Multi Atendimento", category: "CRM / Chat", link: "#" },
  { title: "WorkDashGo", category: "Gestão", link: "#" },
  { title: "ChatPion-2025", category: "IA / Chatbot", link: "#" },
  { title: "Sistemas ERP, Gestão Empresarial e Outros", category: "ERP", link: "#" },
  { title: "62 SISTEMAS PHP / JAVASCRIPT", category: "Dev Tools", link: "#" },
  { title: "SAAS TYPEBOT", category: "Automação", link: "#" },
  { title: "Crypto e Trading", category: "Financeiro", link: "#" },
  { title: "4.300 SaaS e Templates", category: "Pack Completo", link: "#" },
  { title: "+200 Ferramentas de marketing", category: "Growth", link: "#" },
  { title: "Video Aulas - Plano de Vendas do 0 aos 10K", category: "Educação", link: "#" },
  { title: "10 Mil Planilhas", category: "Recursos", link: "#" },
  { title: "1.000 Landing Pages", category: "Design", link: "#" },
  { title: "Disparador De Mensagens - Venda 50x Mais", category: "Vendas", link: "#" },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-transparent">
      
      {/* --- CABEÇALHO (NAVBAR) --- */}
      <header className="fixed top-0 w-full z-50 bg-[#050A14]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
             <div className="w-4 h-4 bg-cyan-400 rounded-sm shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
             <span className="font-bold text-xl tracking-tight text-white">
               VaultMind <span className="text-cyan-400">OS</span>
             </span>
          </Link>

          {/* Menu Direito */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Status</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ONLINE
              </span>
            </div>
            
            <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>

            {/* BOTÃO SAIR */}
            <form action={signOut}>
              <button 
                className="text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/10 px-5 py-2 rounded transition-colors cursor-pointer"
                type="submit"
              >
                SAIR
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Terminal de Produtos</h1>
              <p className="text-slate-400">Gerencie seus ativos digitais e ferramentas.</p>
            </div>
            
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white hover:bg-white/10 transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                FILTRAR
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <DashboardCard 
                key={index}
                title={product.title}
                category={product.category}
                link={product.link}
              />
            ))}
          </div>
          
        </div>
      </main>
    </div>
  )
}
