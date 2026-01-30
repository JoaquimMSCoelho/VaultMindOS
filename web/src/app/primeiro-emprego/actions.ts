"use server";

import { createClient } from "@/utils/supabase/server"; // Ajuste o path conforme sua estrutura de utils
import { revalidatePath } from "next/cache";
import { Resend } from "resend"; 
import { getWelcomeEmailTemplate } from "@/lib/emails";

// Inicializa o Resend 
// (Se a chave não existir, o código segue rodando, mas sem enviar e-mail)
const resend = new Resend(process.env.RESEND_API_KEY);

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
 * Esta ação valida o e-mail, insere na tabela 'leads_projeto_primeiro_emprego' e dispara o e-mail de boas-vindas.
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
    // ---------------------------------------------------------
    // 1. PERSISTÊNCIA: Salvar no Banco de Dados (Supabase)
    // ---------------------------------------------------------
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

    // Tratamento de erro de duplicidade (usuário já cadastrado)
    if (error) {
      if (error.code === '23505') {
        return { success: true, message: "Você já está na nossa lista! Avisaremos em breve." };
      }
      throw error;
    }

    // ---------------------------------------------------------
    // 2. COMUNICAÇÃO: Enviar E-mail via Resend (Injeção Funcional)
    // ---------------------------------------------------------
    if (process.env.RESEND_API_KEY) {
        try {
            // Gera o HTML do e-mail usando seu template
            const template = getWelcomeEmailTemplate({ 
                nome: "Futuro Profissional", 
                trilha: trilha_interesse 
            });
            
            // Dispara o e-mail real
            await resend.emails.send({
                from: 'VaultMindOS <contatos@cyberconnection.com.br>', // Domínio verificado
                to: email,
                subject: template.subject,
                html: template.html,
            });
            
            console.log(`[EMAIL SUCCESS] Enviado para ${email}`);

        } catch (emailError) {
            // Se o e-mail falhar (ex: DNS ainda propagando), NÃO travamos o cadastro.
            // O lead já está salvo no banco, então apenas logamos o erro.
            console.error("[EMAIL ERROR] Falha ao enviar:", emailError);
        }
    } else {
        console.warn("[SYSTEM WARN] RESEND_API_KEY não configurada. E-mail ignorado.");
    }

    // ---------------------------------------------------------
    // 3. FINALIZAÇÃO
    // ---------------------------------------------------------
    revalidatePath("/primeiro-emprego");

    return { 
      success: true, 
      message: "Cadastro realizado! Verifique seu e-mail de boas-vindas." 
    };

  } catch (error) {
    console.error("Erro ao registrar lead:", error);
    return { 
      success: false, 
      message: "Erro interno ao processar sua solicitação. Tente novamente." 
    };
  }
}