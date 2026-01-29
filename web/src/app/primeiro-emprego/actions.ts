"use server";

import { createClient } from "@/utils/supabase/server"; // Ajuste o path conforme sua estrutura de utils
import { revalidatePath } from "next/cache";
import { getWelcomeEmailTemplate } from "@/lib/emails";

/**
 * Interface para os dados capturados na Landing Page
 */
interface LeadData {
  email: string;
  perfil: "aluno" | "empresa";
  trilha_interesse?: string;
}

/**
 * Server Action para capturar leads do Projeto Primeiro Emprego
 * Esta ação valida o e-mail e insere na tabela 'leads_projeto_primeiro_emprego'
 */
export async function registrarInteresse(formData: FormData) {
  const supabase = await createClient();

  // Captura de dados do formulário
  const email = formData.get("email") as string;
  const perfil = formData.get("perfil") as "aluno" | "empresa";
  const trilha_interesse = formData.get("trilha") as string;

  // Validação básica
  if (!email || !email.includes("@")) {
    return { success: false, message: "E-mail inválido." };
  }

  try {
    const { error } = await supabase
      .from("leads_projeto_primeiro_emprego")
      .insert([
        { 
          email, 
          perfil, 
          trilha_interesse,
          origem: "landing_page_espera"
        },
      ]);

    if (error) {
      // Caso o e-mail já exista (ajustar conforme política de duplicatas no Supabase)
      if (error.code === '23505') {
        return { success: true, message: "Você já está na nossa lista! Avisaremos em breve." };
      }
      throw error;
    }

    // Revalida a página para limpar estados se necessário
    revalidatePath("/primeiro-emprego");

    return { 
      success: true, 
      message: "Interesse registrado com sucesso! Bem-vindo ao ecossistema VaultMindOS." 
    };

  } catch (error) {
    console.error("Erro ao registrar lead:", error);
    return { 
      success: false, 
      message: "Erro interno ao processar sua solicitação. Tente novamente." 
    };
  }
}