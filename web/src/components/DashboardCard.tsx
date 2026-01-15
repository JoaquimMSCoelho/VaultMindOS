import Link from 'next/link'

interface ProductCardProps {
  title: string;
  category: string;
  link: string;
}

export default function DashboardCard({ title, category, link }: ProductCardProps) {
  return (
    <div className="group relative bg-[#0B0F19]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1">
      {/* Categoria (Badge) */}
      <span className="inline-block px-2 py-1 mb-4 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 rounded">
        {category}
      </span>

      {/* Título */}
      <h3 className="text-lg font-bold text-white mb-6 group-hover:text-cyan-50 transition-colors">
        {title}
      </h3>

      {/* Link de Ação */}
      <Link 
        href={link} 
        className="inline-flex items-center text-xs font-bold text-slate-400 group-hover:text-cyan-400 transition-colors uppercase tracking-wider"
      >
        Clique para acessar 
        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </Link>
      
      {/* Brilho Decorativo no canto */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  )
}
