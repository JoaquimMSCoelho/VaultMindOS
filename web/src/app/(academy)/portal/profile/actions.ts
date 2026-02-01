"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Definição do tipo de retorno para consistência com o Client Component
export type ActionResponse = {
  success: boolean;
  message: string;
};

export async function updateProfile(
  prevState: ActionResponse | null, // OBRIGATÓRIO: Argumento exigido pelo useActionState
  formData: FormData
): Promise<ActionResponse> {
  
  const supabase = await createClient();

  // 1. Validar Autenticação
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: "Sessão expirada. Faça login novamente." };
  }

  // 2. Extrair e Sanitizar Dados
  // O uso de ?.trim() previne erros se o campo vier nulo e remove espaços extras
  const fullName = (formData.get("fullName") as string)?.trim();

  if (!fullName || fullName.length < 3) {
    return { success: false, message: "O nome deve ter pelo menos 3 caracteres." };
  }

  try {
    // 3. Atualizar no Banco
    // Fusão Técnica: Usamos 'update' (mais seguro para edição) mas mantemos
    // o 'updated_at' do arquivo original para auditoria.
    const { error } = await supabase
      .from("profiles")
      .update({ 
        full_name: fullName,
        updated_at: new Date().toISOString() 
      })
      .eq("id", user.id);

    if (error) {
      console.error("Erro Supabase:", error);
      return { success: false, message: "Erro ao atualizar perfil. Tente novamente." };
    }

    // 4. Revalidar Cache
    revalidatePath("/portal/profile"); // Atualiza a página atual
    revalidatePath("/portal");         // Atualiza o nome no Header/Sidebar (Recuperado do arquivo original)

    return { success: true, message: "Perfil atualizado com sucesso!" };

  } catch (error) {
    console.error("Erro Interno:", error);
    return { success: false, message: "Erro inesperado no servidor." };
  }
}