# 🟢 PROTOCOLO DE INICIALIZAÇÃO DE AMBIENTE - VAULTMIND OS
> **Objetivo:** Garantir que o ambiente de desenvolvimento esteja limpo, atualizado e seguro antes de escrever qualquer linha de código.

## 1. Navegação para a Raiz
Abra o PowerShell como Administrador e execute:
```powershell
cd E:\Projetos\VaultMindOS

## 2. Verificação de Integridade (Git Status)
cd web
git status

## 3. Atualização de Dependências (Opcional, mas recomendado semanalmente)
npm install

##4. Inicialização do Servidor de Desenvolvimento
npm run dev

## 5. Abertura do Editor (VS Code)
## Abra um segundo terminal (ou aba), volte para a raiz do projeto e lance o editor no contexto correto.
cd E:\Projetos\VaultMindOS
code .

## 6. Verificação Visual
## Abra seu navegador em: http://localhost:3000
## Verifique se a Home carrega.
## Verifique se o Login (/login) carrega.
## Status: Se tudo estiver verde, você está pronto para codar.