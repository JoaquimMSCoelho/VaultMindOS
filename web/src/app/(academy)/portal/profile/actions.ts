'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  
  // 1. Segurança: Pega o usuário logado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Usuário não autenticado" };
  }

  const fullName = formData.get("fullName") as string;

  // 2. Validação Básica
  if (!fullName || fullName.length < 3) {
    return { error: "O nome deve ter pelo menos 3 caracteres." };
  }

  // 3. Atualização no Banco
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: fullName,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Erro ao atualizar perfil:", error);
    return { error: "Erro ao salvar dados." };
  }

  // 4. Revalidar Cache (Atualiza a interface)
  revalidatePath("/portal/profile");
  revalidatePath("/portal"); // Atualiza o nome no header do dashboard também
  
  return { success: "Perfil atualizado com sucesso!" };
}