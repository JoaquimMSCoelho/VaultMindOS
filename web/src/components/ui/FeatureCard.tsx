import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
}

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
    return (
        <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-2xl hover:border-emerald-500/50 transition-all group hover:-translate-y-1 h-full flex flex-col hover:shadow-lg hover:shadow-emerald-900/10">
            <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500/10 transition-colors border border-neutral-800 group-hover:border-emerald-500/20 shrink-0">
                <Icon className="w-6 h-6 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <h3 className="font-bold mb-2 text-neutral-200 group-hover:text-white transition-colors">{title}</h3>
            <p className="text-sm text-neutral-500 flex-grow">{description}</p>
        </div>
    );
}