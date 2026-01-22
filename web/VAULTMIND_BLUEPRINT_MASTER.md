# 🏛️ VAULTMIND OS - BLUEPRINT TÉCNICO MESTRE (v1.0)
> **Classificação:** Documento Vivo de Arquitetura e Governança
> **Norma:** PGT-01 (Extremo Zero)
> **Stack:** NestJS + Next.js + React Native + Python Automation

---

## 1. 🛡️ CONSTITUIÇÃO E GOVERNANÇA (A Lei do Projeto)

### 1.1. O Princípio "Extremo Zero" (Cláusula Pétrea)
Para garantir a estabilidade absoluta do VaultMindOS, é **ESTRITAMENTE PROIBIDO** realizar remendos ou edições parciais em arquivos que apresentem falhas estruturais.
1.  **Detectou Erro?** Não corrija a linha.
2.  **Ação:** Gere o arquivo inteiro novamente com a correção.
3.  **Substituição:** Apague o arquivo antigo -> Crie o novo -> Cole o código.

### 1.2. Protocolo de Início de Trabalho (POP-001)
Nenhum desenvolvedor (Humano ou IA) está autorizado a escrever código sem antes validar o terreno.
**Rotina Obrigatória:**
1.  Abrir terminal na raiz: `P:\Projetos\VaultMindOS`
2.  Executar auditoria: `python scripts/verify_env.py`
3.  **Resultado VERDE?** Autorizado.
4.  **Resultado VERMELHO?** Proibido continuar. Instale as dependências faltantes.

### 1.3. Padronização de Arquivos (Header Protocol)
Todo arquivo (`.ts`, `.tsx`, `.py`) deve iniciar com este cabeçalho:

```typescript
/*
-------------------------------------------------------------------------
PROJETO: VAULTMIND OS (ENTERPRISE EDITION)
ARQUITETURA: FULL STACK (NestJS + React Native + Next.js)
GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)
-------------------------------------------------------------------------
MÓDULO: [Caminho/Nome do Arquivo]
DESCRIÇÃO: [Função técnica do componente]
-------------------------------------------------------------------------
*/