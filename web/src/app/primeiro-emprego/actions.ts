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
  const supabase = await createClient();

  // 1. Extração e Sanitização
  const rawData: LeadProjeto = {
    email: (formData.get("email") as string).trim().toLowerCase(),
    perfil: (formData.get("perfil") as string) || "nao_informado",
    trilha_interesse: (formData.get("trilha") as string) || "geral",
    origem: "landing_page_espera"
  };

  // 2. Validação Básica (Server-Side)
  if (!rawData.email || !rawData.email.includes("@")) {
    return { success: false, message: "Por favor, insira um e-mail válido." };
  }

  try {
    // 3. Inserção no Supabase (Banco de Dados)
    const { error } = await supabase
      .from("leads_projeto_primeiro_emprego")
      .insert([rawData]);

    if (error) {
      // Tratamento de Erro: E-mail Duplicado (Unique Constraint)
      if (error.code === '23505') {
        return { success: true, message: "Este e-mail já está na nossa lista de espera!" };
      }
      console.error("Erro Supabase:", error);
      throw error;
    }

    // 4. Injeção Funcional: Disparo de E-mail (Resend)
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
            console.log(`[EMAIL SUCCESS] Enviado para ${rawData.email}`);
        } catch (emailError) {
            // Falha no e-mail não deve travar o cadastro
            console.error("[EMAIL ERROR] Falha ao enviar:", emailError);
        }
    } else {
        console.warn("[SYSTEM WARN] RESEND_API_KEY não configurada. E-mail ignorado.");
    }

    // 5. Finalização
    revalidatePath("/primeiro-emprego");
    return { success: true, message: "Cadastro realizado! Verifique seu e-mail de boas-vindas." };
    
  } catch (error) {
    return { success: false, message: "Erro ao conectar com o servidor. Tente novamente." };
  }
}