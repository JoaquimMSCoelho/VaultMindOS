'use client'

import { CheckCircle, Circle } from "lucide-react";
import { useTransition } from "react";
import { toggleLessonProgress } from "@/app/(academy)/portal/actions";

interface LessonCheckProps {
  lessonId: string;
  isCompleted: boolean;
  path: string; // URL atual para revalidar
}

export function LessonCheck({ lessonId, isCompleted, path }: LessonCheckProps) {
  const [isPending, startTransition] = useTransition();

  // Função disparada ao clicar
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que o clique abra o Link da aula (se estiver dentro de um Link)
    e.stopPropagation(); // Garante isolamento

    startTransition(async () => {
      // Chama a Server Action criada no Passo 1
      await toggleLessonProgress(lessonId, isCompleted, path);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`group relative flex items-center justify-center p-1 rounded-full transition-all hover:bg-white/10 ${
        isPending ? "opacity-50 cursor-wait" : "cursor-pointer"
      }`}
      title={isCompleted ? "Marcar como não vista" : "Marcar como concluída"}
    >
      {/* Exibe ícone CHEIO se completou, ou VAZIO se não completou */}
      {isCompleted ? (
        <CheckCircle className="w-5 h-5 text-green-500 fill-green-500/10" />
      ) : (
        <Circle className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400" />
      )}
    </button>
  );
}