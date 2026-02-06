import { Shield } from "lucide-react";

export function PoweredByFooter() {
  return (
    <div className="w-full py-8 border-t border-neutral-900 bg-neutral-950 flex flex-col items-center justify-center gap-2 text-neutral-600">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
        <Shield className="w-3 h-3" />
        Powered by ConnectionCyberOS
      </div>
      <p className="text-[10px] text-neutral-700">Governance & Security Protocol • 2026</p>
    </div>
  );
}