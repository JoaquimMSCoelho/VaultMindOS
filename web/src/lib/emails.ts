/**
 * VaultMindOS - Email Templates System
 * Centralização de comunicações do ecossistema Primeiro Emprego.
 */

interface EmailTemplateProps {
  nome?: string;
  trilha?: string;
}

/**
 * Retorna o template HTML para o e-mail de Boas-Vindas
 */
export const getWelcomeEmailTemplate = ({ nome = "Futuro Profissional", trilha }: EmailTemplateProps) => {
  const trilhaText = trilha ? ` na trilha de **${trilha}**` : "";

  return {
    subject: "[VaultMindOS] Bem-vindo à jornada de prontidão técnica! 🚀",
    text: `
      Olá, ${nome}.
      
      Ficamos muito contentes com o seu interesse no Projeto Primeiro Emprego${trilhaText}. 
      Você acaba de dar o primeiro passo para sair do aprendizado genérico e entrar na capacitação de alta performance.

      No VaultMindOS, nossa missão é transformar potencial em prontidão. Aqui está o que você pode esperar:
      1. Metodologia Contextual aplicada à sua profissão.
      2. IA para Produtividade.
      3. Simulação Real de Empresa.

      Avisaremos você assim que abrirmos as vagas para sua trilha.
      
      Atenciosamente,
      Equipe VaultMindOS.
    `,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #171717;">
        <div style="background-color: #059669; padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">VaultMind<span style="color: #10b981;">OS</span></h1>
        </div>
        
        <div style="padding: 32px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #065f46;">Bem-vindo à jornada de prontidão técnica!</h2>
          <p>Olá, <strong>${nome}</strong>,</p>
          
          <p>Ficamos muito contentes com o seu interesse no <strong>Projeto Primeiro Emprego</strong>${trilhaText}.</p>
          
          <p>No VaultMindOS, nossa missão é transformar potencial em prontidão através de:</p>
          <ul style="line-height: 1.6;">
            <li><strong>Metodologia Contextual:</strong> Aprenda a ferramenta dentro da sua profissão.</li>
            <li><strong>IA para Produtividade:</strong> Domine a tecnologia que o mercado exige.</li>
            <li><strong>Simulação Real:</strong> Experiência prática antes do primeiro emprego.</li>
          </ul>

          <div style="margin-top: 32px; padding: 20px; background-color: #f0fdf4; border-left: 4px solid #10b981;">
            <p style="margin: 0; font-size: 14px; color: #166534;">
              <strong>Próximo Passo:</strong> Nossa equipe está organizando as turmas. Você será notificado por este e-mail assim que as vagas abrirem.
            </p>
          </div>

          <p style="margin-top: 32px; font-size: 14px; color: #737373;">
            Atenciosamente,<br>
            Equipe de Gestão de Talentos<br>
            <em>VaultMindOS - Operating System of Personal Intelligence</em>
          </p>
        </div>
      </div>
    `
  };
};