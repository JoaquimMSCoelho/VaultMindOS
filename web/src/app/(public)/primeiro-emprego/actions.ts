"use server";

import { createClient } from "@/utils/supabase/server";
import { LeadProjeto, ActionResponse } from "@/types/database";
import { Resend } from "resend";
import { getWelcomeEmailTemplate } from "@/lib/emails";
import { revalidatePath } from "next/cache";

// Inicialização segura do Resend
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

/**
 * Server Action para o Formulário "Primeiro Emprego"
 * Stack: Next.js 15 + Supabase + Resend
 */
export async function registrarInteresse(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  
  // ---------------------------------------------------------
  // 🛡️ VALIDAÇÃO DE INTEGRIDADE (FIX PARA BUILD VERCEL)
  // ---------------------------------------------------------
  // Se por algum motivo o formData chegar nulo (erro de runtime anterior),
  // nós interceptamos aqui antes de tentar ler ".get".
  if (!formData || typeof formData.get !== 'function') {
    console.error("[CRITICAL] FormData inválido ou ausente.");
    return { success: false, message: "Erro técnico: Dados do formulário não recebidos." };
  }

  const supabase = await createClient();

  // 1. Extração e Sanitização
  const rawData: LeadProjeto = {
    email: (formData.get("email") as string)?.trim().toLowerCase() || "",
    perfil: (formData.get("perfil") as string) || "nao_informado",
    trilha_interesse: (formData.get("trilha") as string) || "geral",
    origem: "landing_page_espera"
  };

  // 2. Validação Básica
  if (!rawData.email || !rawData.email.includes("@")) {
    return { success: false, message: "Por favor, insira um e-mail válido." };
  }

  try {
    // 3. Inserção no Supabase
    // FUSÃO: Renomeação de variável para evitar shadowing e uso genérico de 'error'
    const { error: insertError } = await supabase
      .from("leads_projeto_primeiro_emprego")
      .insert([rawData]);

    if (insertError) {
      // Tratamento de Duplicidade (Erro 23505)
      if (insertError.code === '23505') {
        return { success: true, message: "Este e-mail já está na nossa lista de espera!" };
      }
      // Log do erro específico de inserção
      console.error("Erro Supabase:", insertError);
      throw insertError;
    }

    // 4. Disparo de E-mail (Resend)
    if (resend) {
        try {
            const template = getWelcomeEmailTemplate({ 
                nome: "Futuro Profissional", 
                trilha: rawData.trilha_interesse 
            });
            
            await resend.emails.send({
                from: 'VaultMindOS <contatos@cyberconnection.com.br>',
                to: rawData.email,
                subject: template.subject,
                html: template.html,
            });
        } catch (emailError) {
            console.error("[EMAIL ERROR]", emailError);
        }
    }

    // 5. Finalização
    revalidatePath("/primeiro-emprego");
    return { success: true, message: "Cadastro realizado! Verifique seu e-mail de boas-vindas." };
    
  } catch (err) {
    // Uso da variável 'err' para evitar aviso de linter (unused var)
    console.error("Erro crítico na Server Action:", err);
    return { success: false, message: "Erro ao conectar com o servidor. Tente novamente." };
  }
}