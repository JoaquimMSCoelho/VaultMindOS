'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Alterna o status de conclusão de uma aula (Concluída/Não Concluída)
 * @param lessonId - ID da aula
 * @param currentStatus - Status ATUAL (true/false). A função vai inverter.
 * @param path - O caminho da página atual para recarregar (ex: /portal/watch/gestao-agil)
 */
export async function toggleLessonProgress(lessonId: string, currentStatus: boolean, path: string) {
  const supabase = await createClient();

  // 1. Segurança: Quem está tentando salvar?
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("Tentativa de salvar progresso sem usuário logado");
    return;
  }

  // 2. Lógica: Inverte o status (Toggle)
  const newStatus = !currentStatus;

  // 3. Banco de Dados: UPSERT (Inserir ou Atualizar)
  // Graças à chave composta (user_id, lesson_id), ele sabe qual linha atualizar.
  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: user.id,
      lesson_id: lessonId,
      is_completed: newStatus,
      last_watched_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id, lesson_id'
    });

  if (error) {
    console.error("Erro ao salvar progresso:", error.message);
    throw new Error("Falha ao atualizar progresso");
  }

  // 4. UX: Revalida o Cache
  // Isso faz o Next.js atualizar o ícone verde/cinza instantaneamente sem F5
  revalidatePath(path);
}