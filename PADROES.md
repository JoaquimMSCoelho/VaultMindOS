# [NOME_DO_PROJETO] - MANUAL MESTRE DE GOVERNANÇA E OPERAÇÃO

**Responsável Técnica:** Equipe de Desenvolvimento
**Norma:** Extremo Zero (Substituição Total)
**Versão do Documento:** 2.0 (Consolidada)

---

## 1. 🏛️ A Constituição do Projeto (Política de Governança)

### 1.1. Princípio Fundamental (Cláusula Pétrea)
Fica estabelecido o padrão de **"Desenvolvimento a Partir do Extremo Zero"**. É estritamente **VEDADA** a prática de "remendos", edições parciais ou incrementos diretos em artefatos corrompidos ou ambientes instáveis.
* **Falhou?** Apaga-se e reconstrói-se o artefato.
* **Mudou de Máquina?** Regenera-se o ambiente completo.
* **Vai gerar versão?** Limpa-se tudo antes de compilar.

### 1.2. Consistência de Ambiente
Nenhum código será promovido a Produção, nem o desenvolvimento será iniciado em novo equipamento, sem a prévia validação pelo **Script de Verificação de Ambiente (SVA)** (código disponível na Seção 6 deste manual).

---

## 2. 📍 Localização e Armazenamento
* **Diretório Oficial:** `P:\Projetos\[NOME_DO_PROJETO]`
* **Regra de Ouro:** O desenvolvimento **NUNCA** deve ocorrer dentro de pastas sincronizadas em tempo real (OneDrive, Google Drive) para evitar travamento de arquivos.
* **Backup:** Nuvens apenas para armazenamento frio (zip) ou Repositório Git.

---

## 3. 🛡️ Procedimento Operacional Padrão (POP-001)

### 3.1. Pré-Migração / Início de Trabalho Diário
Sempre que iniciar o trabalho ou trocar de computador:
1.  Acessar o diretório raiz do projeto.
2.  Executar o script: `python scripts/verify_env.py`
3.  **Ler o relatório de saída.**
    * Se retornar `[AUSENTE]` ou `[VERSÃO INCORRETA]`: **PARAR**. Não tente rodar o projeto. Instale o que falta.
    * Se retornar `[STATUS: VERDE/OK]`: **AUTORIZADO** a trabalhar.

### 3.2. Rotina de Alteração (O Ciclo da Substituição)
Sempre que formos [gerar um arquivo], [executar um procedimento] ou [testar uma rotina]:
1.  **Não editar:** Ignorar o estado atual quebrado.
2.  **Gerar do Zero:** Criar o novo componente completo.
3.  **Substituir:** Apagar o velho, colar o novo.
4.  **Validar:** Testar se o novo componente completo funciona.

---

## 4. 🚀 Procedimento de Build e Reconstrução

Para gerar uma nova versão executável ou limpar o ambiente:
1.  **Limpeza Total (obrigatório):** Deletar manualmente as pastas `dist`, `build` e `__pycache__`.
2.  **Verificação:** Rodar `python scripts/verify_env.py` novamente.
3.  **Reinstalação Limpa (Backend):** `pip install -r requirements.txt`.
4.  **Reinstalação Limpa (Frontend):** `npm install`.
5.  **Compilação:** Executar os comandos de build do zero.

---

## 5. ✅ Checklist de Validação (Obrigatório)

Antes de dar qualquer tarefa como "Concluída", marque os itens abaixo:

**1. Validação de Ferramentas (Base)**
- [ ] Python (Versão correta) instalado e no PATH.
- [ ] Node.js instalado.
- [ ] Git instalado e autenticado.

**2. Validação do Repositório (Extremo Zero)**
- [ ] Script `python scripts/verify_env.py` executado e retornou **TUDO VERDE**.
- [ ] Pastas de lixo (`dist`, `build`, `__pycache__`) foram deletadas.

**3. Teste de Fumaça**
- [ ] Backend roda (`uvicorn` ou equivalente) sem erros.
- [ ] Frontend roda (`npm run dev`) sem erros.

---

## 6. 🛠️ Anexo Técnico: O Script de Verificação

*Instrução: Ao iniciar um novo projeto, copie o código abaixo, crie um arquivo em `scripts/verify_env.py` e cole o conteúdo.*

```python
import sys
import os
import subprocess

def print_status(component, status, message=""):
    # Cores para terminal: Verde (92) e Vermelho (91)
    color = "\033[92m" if status == "OK" else "\033[91m" 
    reset = "\033[0m"
    print(f"[{component.ljust(15)}] {color}{status}{reset} {message}")

def check_command(command, version_flag="--version"):
    """Verifica se um comando existe no sistema e retorna a versão."""
    try:
        # shell=True para compatibilidade com Windows
        result = subprocess.run(f"{command} {version_flag}", shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            return True, result.stdout.strip().split('\n')[0]
        else:
            return False, None
    except Exception:
        return False, None

def main():
    print("="*60)
    print("   VERIFICADOR DE AMBIENTE - [NOME_DO_PROJETO]")
    print("   Norma: Extremo Zero | Status: Validando...")
    print("="*60)
    
    # 1. Verificar Python (Execução Atual) - Ajuste a versão conforme necessário
    py_version = sys.version.split()[0]
    if sys.version_info >= (3, 10):
        print_status("PYTHON", "OK", f"Versão: {py_version}")
    else:
        print_status("PYTHON", "ERRO", f"Versão obsoleta: {py_version}. Requer 3.10+")

    # 2. Verificar Node.js
    node_ok, node_ver = check_command("node", "-v")
    if node_ok:
        print_status("NODE.JS", "OK", f"Versão: {node_ver}")
    else:
        print_status("NODE.JS", "CRÍTICO", "Não instalado ou não está no PATH.")

    # 3. Verificar Ferramentas Essenciais
    tools = ["git", "npm"]
    for tool in tools:
        ok, ver = check_command(tool)
        if ok:
            print_status(tool.upper(), "OK", "Instalado")
        else:
            print_status(tool.upper(), "AUSENTE", "Instalação obrigatória necessária.")

    # 4. Verificar Estrutura de Pastas (Deve ser rodado da Raiz)
    # Lista de pastas esperadas na raiz do projeto (Adapte para seu projeto)
    folders = ["backend", "frontend", "docs", "scripts"]
    
    print("-" * 60)
    for folder in folders:
        if os.path.isdir(folder):
            print_status(f"DIR: {folder}", "OK", "Encontrado")
        else:
            print_status(f"DIR: {folder}", "ALERTA", "Diretório não encontrado na raiz.")

    # 5. Verificar Arquivos Críticos
    req_file = os.path.join("backend", "requirements.txt")
    if os.path.exists(req_file):
        print_status("REQ.TXT", "OK", "Encontrado em backend/")
    else:
        print_status("REQ.TXT", "ERRO", "backend/requirements.txt sumiu!")

    print("-" * 60)
    print("CONCLUSÃO DA ANÁLISE:")
    print("Se tudo estiver VERDE (OK), o ambiente está aprovado.")
    print("Se houver VERMELHO, corrija antes de trabalhar.")
    print("=" * 60)

if __name__ == "__main__":
    main()