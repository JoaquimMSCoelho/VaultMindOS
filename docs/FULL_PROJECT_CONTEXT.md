# SNAPSHOT DE CODIGO: VaultMindOS
> Gerado em: 2026-01-31 23:05:23

---

## FILE: \.gitignore
```txt
# --- Dependências ---
node_modules/
npm-debug.log
yarn-error.log
pnpm-debug.log*

# --- Next.js Build ---
.next/
out/
build/
dist/

# --- Variáveis de Ambiente e Segredos (CRÍTICO) ---
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.pem

# --- Sistema Operacional ---
.DS_Store
Thumbs.db

# --- IDEs ---
.vscode/
.idea/

# --- Supabase Local ---
supabase/tmp/

```

---

## FILE: \backup_antes_lms.sql
```sql
Need to install the following packages:
supabase@2.72.9

```

---

## FILE: \backup_fisico.ps1
```txt
<#
.SYNOPSIS
    SISTEMA DE BACKUP INTEGRADO & DOCUMENTACAO AUTOMATICA (V3.0)
.DESCRIPTION
    1. Gera documentaÃ§Ã£o contextual (Markdown) do projeto.
    2. Sincroniza com GitHub.
    3. Faz Dump de Banco de Dados (se aplicÃ¡vel).
    4. Realiza espelhamento fÃ­sico (Robocopy) para HD Externo.
#>

# ==============================================================================
# 1. FUNÃ‡ÃƒO DE GERAÃ‡ÃƒO DE RELATÃ“RIO (O "CÃ©rebro" do Contexto)
# ==============================================================================
function Gerar-RelatorioContexto {
    param (
        [string]$DiretorioAlvo
    )

    $docsPath = "$DiretorioAlvo\docs"
    $outputFile = "$docsPath\FULL_PROJECT_CONTEXT.md"

    # Ignora pastas que nÃ£o tÃªm cÃ³digo fonte relevante para evitar processamento inÃºtil
    if ($DiretorioAlvo -match "ZZ-IMAGENS" -or -not (Test-Path "$DiretorioAlvo\src")) {
        Write-Host "   [DOCS] Ignorado (Diretorio sem estrutura de codigo padrao)." -ForegroundColor DarkGray
        return
    }

    Write-Host "   [DOCS] Atualizando FULL_PROJECT_CONTEXT.md..." -ForegroundColor Cyan

    # Cria pasta docs se nÃ£o existir
    if (-not (Test-Path $docsPath)) { New-Item -ItemType Directory -Path $docsPath | Out-Null }

    # Filtros
    $ignoredFolders = @("node_modules", ".git", ".next", ".vscode", ".idea", "dist", "build", "coverage", ".vercel")
    $binaryExtensions = @(".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".webp", ".woff", ".woff2", ".ttf", ".eot", ".mp4", ".mov", ".pdf", ".zip", ".exe", ".dll")
    $ignoredContentFiles = @("package-lock.json", "pnpm-lock.yaml", "yarn.lock", "FULL_PROJECT_CONTEXT.md")

    # CabeÃ§alho
    $reportContent = @()
    $reportContent += "# SNAPSHOT DE CODIGO: $(Split-Path $DiretorioAlvo -Leaf)"
    $reportContent += "> Gerado em: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    $reportContent += ""
    $reportContent += "---"
    $reportContent += ""

    # Varredura
    $files = Get-ChildItem -Path $DiretorioAlvo -Recurse -File

    foreach ($file in $files) {
        $relativePath = $file.FullName.Substring($DiretorioAlvo.Length)
        
        # Checa pastas ignoradas
        $isIgnored = $false
        foreach ($folder in $ignoredFolders) {
            if ($relativePath -match "\\$folder\\") { $isIgnored = $true; break }
        }

        if (-not $isIgnored) {
            $extension = $file.Extension.ToLower()
            $fileName = $file.Name

            $reportContent += "## FILE: $relativePath"

            if ($binaryExtensions -contains $extension) {
                $reportContent += "*[Binario/Midia - Omitido]*"
            }
            elseif ($ignoredContentFiles -contains $fileName) {
                $reportContent += "*[Lockfile/Log - Omitido]*"
            }
            else {
                try {
                    $content = Get-Content -Path $file.FullName -Raw -ErrorAction Stop
                    # Detectar linguagem simples
                    $lang = "txt"
                    if ($extension -match "\.(ts|tsx)$") { $lang = "typescript" }
                    elseif ($extension -match "\.(js|jsx)$") { $lang = "javascript" }
                    elseif ($extension -eq ".json") { $lang = "json" }
                    elseif ($extension -eq ".css") { $lang = "css" }
                    elseif ($extension -eq ".sql") { $lang = "sql" }
                    elseif ($extension -eq ".md") { $lang = "markdown" }

                    $reportContent += '```' + $lang
                    $reportContent += $content
                    $reportContent += '```'
                }
                catch {
                    $reportContent += "*[Erro de Leitura]*"
                }
            }
            $reportContent += "`n---`n"
        }
    }

    $reportContent | Set-Content -Path $outputFile -Encoding UTF8
    Write-Host "   [DOCS] Relatorio atualizado com sucesso." -ForegroundColor Green
}

# ==============================================================================
# 2. CONFIGURAÃ‡Ã•ES GERAIS E DRIVES
# ==============================================================================
$ErrorActionPreference = "Continue"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$dataTimestamp = Get-Date -Format "yyyyMMdd_HHmm"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   SISTEMA INTEGRADO V3.0 (DOCS + BACKUP)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# --- Drive PROJETOS (Origem) ---
$sourceLabel = "PROJETOS"
$defaultSource = "E:"
$sourceDrive = Get-Volume | Where-Object { $_.FileSystemLabel -eq $sourceLabel } | Select-Object -ExpandProperty DriveLetter
if ($sourceDrive) { 
    $sourceRoot = "$($sourceDrive):\Projetos"
    Write-Host "[CHECK] Origem '$sourceLabel' detectada: $($sourceDrive):" -ForegroundColor Green
} else {
    $sourceRoot = "$defaultSource\Projetos"
    Write-Host "[AVISO] Label '$sourceLabel' nao achado. Usando $defaultSource..." -ForegroundColor Yellow
}

# --- Drive BACKUP (Destino) ---
$destLabel = "BACKUP"
$defaultDest = "J:"
$destDriveObj = Get-Volume | Where-Object { $_.FileSystemLabel -eq $destLabel } | Select-Object -ExpandProperty DriveLetter

if ($destDriveObj) {
    $backupRoot = "$($destDriveObj):"
    Write-Host "[CHECK] Destino '$destLabel' detectado: $($destDriveObj):" -ForegroundColor Green
} else {
    Write-Host "[CRITICO] Drive de Backup '$destLabel' nao encontrado!" -ForegroundColor Red
    Read-Host "Pressione Enter para sair..."
    Exit
}

# ==============================================================================
# 3. LISTA DE PROJETOS
# ==============================================================================
$projectList = @(
    "AppNaturalDaTerra",
    "Autozap-Manager",
    "connection-cyber",
    "CyberTreinaIA",
    "FercmaqFerramentas",
    "FusÃ£o_Arquivos",
    "MecanicaSistema",
    "SaudeCicloDaVida",
    "VaultMindOS",
    "ZZ-IMAGENS E LOGOS"
)

# ==============================================================================
# 4. LOOP DE EXECUÃ‡ÃƒO
# ==============================================================================

foreach ($projName in $projectList) {
    
    $currentSource = "$sourceRoot\$projName"
    $currentDest = "$backupRoot\$projName"

    Write-Host "`n----------------------------------------------------------" -ForegroundColor Gray
    Write-Host "PROCESSANDO: $projName" -ForegroundColor White
    Write-Host "----------------------------------------------------------" -ForegroundColor Gray

    if (!(Test-Path $currentSource)) {
        Write-Host "ERRO: Pasta de origem nao encontrada: $currentSource" -ForegroundColor Red
        continue
    }

    Set-Location $currentSource

    # ---------------------------------------------------------
    # ETAPA 1: GERAÃ‡ÃƒO DE DOCUMENTAÃ‡ÃƒO (NOVO)
    # ---------------------------------------------------------
    # Executa ANTES de tudo para garantir que o backup fÃ­sico inclua o relatÃ³rio
    Gerar-RelatorioContexto -DiretorioAlvo $currentSource

    # ---------------------------------------------------------
    # ETAPA 2: GITHUB
    # ---------------------------------------------------------
    if (Test-Path "$currentSource\.git") {
        Write-Host "[CLOUD] Verificando Git..." -ForegroundColor Yellow
        $gitStatus = git status --porcelain
        if ($gitStatus) {
            git add .
            git commit -m "Backup Automatico: $timestamp"
            $pushOutput = git push 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "OK: Push realizado." -ForegroundColor Green
            } else {
                Write-Host "AVISO: Falha no Push." -ForegroundColor DarkGray
            }
        } else {
            Write-Host "OK: Git Clean." -ForegroundColor Green
        }
    }

    # ---------------------------------------------------------
    # ETAPA 3: SUPABASE (VaultMindOS)
    # ---------------------------------------------------------
    if ($projName -eq "VaultMindOS") {
        Write-Host "[DATA] Dump Supabase..." -ForegroundColor Yellow
        $dbDest = "$currentDest\_database_dumps"
        if (!(Test-Path $dbDest)) { New-Item -ItemType Directory -Force -Path $dbDest | Out-Null }
        
        $FileName = "leads_$dataTimestamp.csv"
        try {
            supabase db dump --table leads_projeto_primeiro_emprego --data-only > "$dbDest\$FileName"
            if ($LASTEXITCODE -eq 0) {
                Write-Host "OK: Dump salvo." -ForegroundColor Green
            } else {
                Write-Host "AVISO: Erro Supabase CLI." -ForegroundColor Red
            }
        } catch {
            Write-Host "ERRO: Falha no dump." -ForegroundColor Red
        }
    }

    # ---------------------------------------------------------
    # ETAPA 4: ROBOCOPY (Backup FÃ­sico)
    # ---------------------------------------------------------
    Write-Host "[DISK] Sincronizando arquivos..." -ForegroundColor Cyan

    if (!(Test-Path $currentDest)) { New-Item -ItemType Directory -Force -Path $currentDest | Out-Null }

    $excludeDirs = @("node_modules", ".next", ".git", ".vs", "dist", "build", ".vercel", "__pycache__", ".venv")

    robocopy $currentSource $currentDest /E /XO /FFT /R:1 /W:1 /NP /NFL /NDL /XD $excludeDirs

    if ($LASTEXITCODE -lt 8) {
        Write-Host "OK: Backup fisico concluido." -ForegroundColor Green
    } else {
        Write-Host "ERRO: Falha no Robocopy." -ForegroundColor Red
    }
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "   TODAS AS TAREFAS FINALIZADAS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

if ($Host.Name -eq "ConsoleHost") {
    Read-Host "Pressione Enter para sair..."
}
```

---

## FILE: \gerar_relatorio.ps1
```txt
<#
.SYNOPSIS
    Gerador de RelatÃ³rio de Estrutura e CÃ³digo - VaultMindOS
    Filtra pastas irrelevantes e formata para leitura por IA.
#>

# 1. ConfiguraÃ§Ãµes de Caminho
$rootPath = "E:\Projetos\VaultMindOS"
$docsPath = "$rootPath\docs"
$outputFile = "$docsPath\FULL_PROJECT_CONTEXT.md"

# Cria a pasta docs se nÃ£o existir
if (-not (Test-Path $docsPath)) { New-Item -ItemType Directory -Path $docsPath | Out-Null }

# 2. DefiniÃ§Ã£o do Filtro de "Lixo" (Ignorar)
$ignoredFolders = @(
    "node_modules", 
    ".git", 
    ".next", 
    ".vscode", 
    ".idea", 
    "dist", 
    "build", 
    "coverage"
)

# ExtensÃµes para listar o nome, mas NÃƒO ler o conteÃºdo (BinÃ¡rios/Imagens)
$binaryExtensions = @(
    ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".webp", 
    ".woff", ".woff2", ".ttf", ".eot", 
    ".mp4", ".mov", ".pdf", ".zip", ".exe", ".dll"
)

# Arquivos de texto gigantes para ignorar conteÃºdo (apenas listar)
$ignoredContentFiles = @(
    "package-lock.json", 
    "pnpm-lock.yaml", 
    "yarn.lock",
    "FULL_PROJECT_CONTEXT.md" # Evitar ler a si mesmo
)

# 3. CabeÃ§alho do Arquivo
$reportContent = @()
$reportContent += "# RELATÃ“RIO COMPLETO DO PROJETO: VaultMindOS"
$reportContent += "> Gerado em: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$reportContent += "> Diretriz: Estrutura completa ignorando bibliotecas e binÃ¡rios."
$reportContent += ""
$reportContent += "---"
$reportContent += ""

Write-Host "ðŸš€ Iniciando varredura em: $rootPath" -ForegroundColor Cyan

# 4. Varredura Recursiva
$files = Get-ChildItem -Path $rootPath -Recurse -File

foreach ($file in $files) {
    # Caminho relativo para exibiÃ§Ã£o
    $relativePath = $file.FullName.Substring($rootPath.Length)
    
    # Verifica se estÃ¡ em pasta ignorada
    $isIgnored = $false
    foreach ($folder in $ignoredFolders) {
        if ($relativePath -match "\\$folder\\") { 
            $isIgnored = $true; break 
        }
    }

    if (-not $isIgnored) {
        $extension = $file.Extension.ToLower()
        $fileName = $file.Name

        # Escreve o Caminho do Arquivo
        $reportContent += "## ðŸ“‚ $relativePath"

        # LÃ³gica de ConteÃºdo
        if ($binaryExtensions -contains $extension) {
            $reportContent += "*[Arquivo BinÃ¡rio/MÃ­dia - ConteÃºdo Omitido]*"
        }
        elseif ($ignoredContentFiles -contains $fileName) {
            $reportContent += "*[Arquivo de Lock/Log Gigante - ConteÃºdo Omitido]*"
        }
        else {
            # LÃª o conteÃºdo do arquivo de cÃ³digo
            try {
                $content = Get-Content -Path $file.FullName -Raw -ErrorAction Stop
                
                # Detectar linguagem para o Markdown
                $lang = "txt"
                if ($extension -eq ".ts" -or $extension -eq ".tsx") { $lang = "typescript" }
                elseif ($extension -eq ".js" -or $extension -eq ".jsx") { $lang = "javascript" }
                elseif ($extension -eq ".json") { $lang = "json" }
                elseif ($extension -eq ".css") { $lang = "css" }
                elseif ($extension -eq ".html") { $lang = "html" }
                elseif ($extension -eq ".md") { $lang = "markdown" }
                elseif ($extension -eq ".sql") { $lang = "sql" }

                $reportContent += '```' + $lang
                $reportContent += $content
                $reportContent += '```'
            }
            catch {
                $reportContent += "*[Erro ao ler arquivo: $_]*"
            }
        }
        $reportContent += "" # Linha em branco
        $reportContent += "---"
        $reportContent += ""
        
        Write-Host "Processado: $relativePath" -ForegroundColor Gray
    }
}

# 5. Salvar Arquivo Final
$reportContent | Set-Content -Path $outputFile -Encoding UTF8

Write-Host ""
Write-Host "âœ… SUCESSO! RelatÃ³rio salvo em:" -ForegroundColor Green
Write-Host "$outputFile" -ForegroundColor White
Write-Host ""
```

---

## FILE: \package-lock.json
*[Lockfile/Log - Omitido]*

---

## FILE: \PADROES.md
```markdown
# [NOME_DO_PROJETO] - MANUAL MESTRE DE GOVERNANÃ‡A E OPERAÃ‡ÃƒO

**ResponsÃ¡vel TÃ©cnica:** Equipe de Desenvolvimento
**Norma:** Extremo Zero (SubstituiÃ§Ã£o Total)
**VersÃ£o do Documento:** 2.0 (Consolidada)

---

## 1. ðŸ›ï¸ A ConstituiÃ§Ã£o do Projeto (PolÃ­tica de GovernanÃ§a)

### 1.1. PrincÃ­pio Fundamental (ClÃ¡usula PÃ©trea)
Fica estabelecido o padrÃ£o de **"Desenvolvimento a Partir do Extremo Zero"**. Ã‰ estritamente **VEDADA** a prÃ¡tica de "remendos", ediÃ§Ãµes parciais ou incrementos diretos em artefatos corrompidos ou ambientes instÃ¡veis.
* **Falhou?** Apaga-se e reconstrÃ³i-se o artefato.
* **Mudou de MÃ¡quina?** Regenera-se o ambiente completo.
* **Vai gerar versÃ£o?** Limpa-se tudo antes de compilar.

### 1.2. ConsistÃªncia de Ambiente
Nenhum cÃ³digo serÃ¡ promovido a ProduÃ§Ã£o, nem o desenvolvimento serÃ¡ iniciado em novo equipamento, sem a prÃ©via validaÃ§Ã£o pelo **Script de VerificaÃ§Ã£o de Ambiente (SVA)** (cÃ³digo disponÃ­vel na SeÃ§Ã£o 6 deste manual).

---

## 2. ðŸ“ LocalizaÃ§Ã£o e Armazenamento
* **DiretÃ³rio Oficial:** `P:\Projetos\[NOME_DO_PROJETO]`
* **Regra de Ouro:** O desenvolvimento **NUNCA** deve ocorrer dentro de pastas sincronizadas em tempo real (OneDrive, Google Drive) para evitar travamento de arquivos.
* **Backup:** Nuvens apenas para armazenamento frio (zip) ou RepositÃ³rio Git.

---

## 3. ðŸ›¡ï¸ Procedimento Operacional PadrÃ£o (POP-001)

### 3.1. PrÃ©-MigraÃ§Ã£o / InÃ­cio de Trabalho DiÃ¡rio
Sempre que iniciar o trabalho ou trocar de computador:
1.  Acessar o diretÃ³rio raiz do projeto.
2.  Executar o script: `python scripts/verify_env.py`
3.  **Ler o relatÃ³rio de saÃ­da.**
    * Se retornar `[AUSENTE]` ou `[VERSÃƒO INCORRETA]`: **PARAR**. NÃ£o tente rodar o projeto. Instale o que falta.
    * Se retornar `[STATUS: VERDE/OK]`: **AUTORIZADO** a trabalhar.

### 3.2. Rotina de AlteraÃ§Ã£o (O Ciclo da SubstituiÃ§Ã£o)
Sempre que formos [gerar um arquivo], [executar um procedimento] ou [testar uma rotina]:
1.  **NÃ£o editar:** Ignorar o estado atual quebrado.
2.  **Gerar do Zero:** Criar o novo componente completo.
3.  **Substituir:** Apagar o velho, colar o novo.
4.  **Validar:** Testar se o novo componente completo funciona.

---

## 4. ðŸš€ Procedimento de Build e ReconstruÃ§Ã£o

Para gerar uma nova versÃ£o executÃ¡vel ou limpar o ambiente:
1.  **Limpeza Total (obrigatÃ³rio):** Deletar manualmente as pastas `dist`, `build` e `__pycache__`.
2.  **VerificaÃ§Ã£o:** Rodar `python scripts/verify_env.py` novamente.
3.  **ReinstalaÃ§Ã£o Limpa (Backend):** `pip install -r requirements.txt`.
4.  **ReinstalaÃ§Ã£o Limpa (Frontend):** `npm install`.
5.  **CompilaÃ§Ã£o:** Executar os comandos de build do zero.

---

## 5. âœ… Checklist de ValidaÃ§Ã£o (ObrigatÃ³rio)

Antes de dar qualquer tarefa como "ConcluÃ­da", marque os itens abaixo:

**1. ValidaÃ§Ã£o de Ferramentas (Base)**
- [ ] Python (VersÃ£o correta) instalado e no PATH.
- [ ] Node.js instalado.
- [ ] Git instalado e autenticado.

**2. ValidaÃ§Ã£o do RepositÃ³rio (Extremo Zero)**
- [ ] Script `python scripts/verify_env.py` executado e retornou **TUDO VERDE**.
- [ ] Pastas de lixo (`dist`, `build`, `__pycache__`) foram deletadas.

**3. Teste de FumaÃ§a**
- [ ] Backend roda (`uvicorn` ou equivalente) sem erros.
- [ ] Frontend roda (`npm run dev`) sem erros.

---

## 6. ðŸ› ï¸ Anexo TÃ©cnico: O Script de VerificaÃ§Ã£o

*InstruÃ§Ã£o: Ao iniciar um novo projeto, copie o cÃ³digo abaixo, crie um arquivo em `scripts/verify_env.py` e cole o conteÃºdo.*

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
    """Verifica se um comando existe no sistema e retorna a versÃ£o."""
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
    
    # 1. Verificar Python (ExecuÃ§Ã£o Atual) - Ajuste a versÃ£o conforme necessÃ¡rio
    py_version = sys.version.split()[0]
    if sys.version_info >= (3, 10):
        print_status("PYTHON", "OK", f"VersÃ£o: {py_version}")
    else:
        print_status("PYTHON", "ERRO", f"VersÃ£o obsoleta: {py_version}. Requer 3.10+")

    # 2. Verificar Node.js
    node_ok, node_ver = check_command("node", "-v")
    if node_ok:
        print_status("NODE.JS", "OK", f"VersÃ£o: {node_ver}")
    else:
        print_status("NODE.JS", "CRÃTICO", "NÃ£o instalado ou nÃ£o estÃ¡ no PATH.")

    # 3. Verificar Ferramentas Essenciais
    tools = ["git", "npm"]
    for tool in tools:
        ok, ver = check_command(tool)
        if ok:
            print_status(tool.upper(), "OK", "Instalado")
        else:
            print_status(tool.upper(), "AUSENTE", "InstalaÃ§Ã£o obrigatÃ³ria necessÃ¡ria.")

    # 4. Verificar Estrutura de Pastas (Deve ser rodado da Raiz)
    # Lista de pastas esperadas na raiz do projeto (Adapte para seu projeto)
    folders = ["backend", "frontend", "docs", "scripts"]
    
    print("-" * 60)
    for folder in folders:
        if os.path.isdir(folder):
            print_status(f"DIR: {folder}", "OK", "Encontrado")
        else:
            print_status(f"DIR: {folder}", "ALERTA", "DiretÃ³rio nÃ£o encontrado na raiz.")

    # 5. Verificar Arquivos CrÃ­ticos
    req_file = os.path.join("backend", "requirements.txt")
    if os.path.exists(req_file):
        print_status("REQ.TXT", "OK", "Encontrado em backend/")
    else:
        print_status("REQ.TXT", "ERRO", "backend/requirements.txt sumiu!")

    print("-" * 60)
    print("CONCLUSÃƒO DA ANÃLISE:")
    print("Se tudo estiver VERDE (OK), o ambiente estÃ¡ aprovado.")
    print("Se houver VERMELHO, corrija antes de trabalhar.")
    print("=" * 60)

if __name__ == "__main__":
    main()
```

---

## FILE: \SITE 1 VER HTML.txt
```txt
SITE 1 VER HTML

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<style>
    /* --- CONFIGURAÃ‡Ã•ES GERAIS E FONTES --- */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');

    :root {
        --bg-dark: #0f172a;
        --bg-darker: #020617;
        --primary-neon: #00f3ff; /* Ciano Neon */
        --secondary-neon: #bd00ff; /* Roxo Neon */
        --glass-bg: rgba(255, 255, 255, 0.03);
        --glass-border: rgba(255, 255, 255, 0.08);
        --text-main: #f8fafc;
        --text-muted: #94a3b8;
    }

    /* Reset bÃ¡sico */
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
        font-family: 'Inter', sans-serif;
        background-color: var(--bg-dark);
        /* TÃ©cnica: Gradientes DinÃ¢micos [cite: 24] */
        background-image: radial-gradient(circle at 15% 50%, rgba(189, 0, 255, 0.08), transparent 25%),
                          radial-gradient(circle at 85% 30%, rgba(0, 243, 255, 0.08), transparent 25%);
        color: var(--text-main);
        line-height: 1.6;
        overflow-x: hidden;
    }

    /* --- LAYOUT CONTAINERS --- */
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        position: relative;
        z-index: 1;
    }

    /* --- HEADER --- */
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem 0;
    }

    .logo {
        font-family: 'JetBrains Mono', monospace; /* Tipografia Criativa [cite: 44] */
        font-weight: 700;
        font-size: 1.5rem;
        letter-spacing: -1px;
        background: linear-gradient(90deg, #fff, #94a3b8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .contact-btn {
        font-size: 0.9rem;
        color: var(--text-muted);
        text-decoration: none;
        transition: color 0.3s;
    }
    .contact-btn:hover { color: var(--primary-neon); }

    /* --- HERO SECTION --- */
    .hero {
        text-align: center;
        padding: 80px 0 60px;
    }

    h1 {
        font-size: 3.5rem;
        font-weight: 800;
        line-height: 1.1;
        margin-bottom: 1.5rem;
        letter-spacing: -0.02em;
        background: linear-gradient(180deg, #fff 0%, #cbd5e1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* Efeito Terminal Typing  */
    .terminal-wrapper {
        font-family: 'JetBrains Mono', monospace;
        color: var(--primary-neon);
        font-size: 1.1rem;
        margin-bottom: 2.5rem;
        display: inline-block;
        background: rgba(0, 243, 255, 0.05);
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid rgba(0, 243, 255, 0.1);
    }
    
    .cursor {
        display: inline-block;
        width: 8px;
        height: 18px;
        background-color: var(--primary-neon);
        animation: blink 1s infinite;
        vertical-align: middle;
        margin-left: 5px;
    }

    @keyframes blink { 50% { opacity: 0; } }

    /* --- GLASSMORPHISM CARDS (Bento Grid) [cite: 4, 12, 69] --- */
    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* CSS Grid [cite: 36] */
        gap: 24px;
        margin: 60px 0;
    }

    .glass-card {
        /* TÃ©cnica: Overlay transparente e Backdrop Filter [cite: 3, 5] */
        background: var(--glass-bg);
        backdrop-filter: blur(12px); 
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid var(--glass-border);
        border-radius: 16px;
        padding: 32px;
        transition: transform 0.3s ease, box-shadow 0.3s ease; /* MicrointeraÃ§Ãµes [cite: 40, 41] */
        position: relative;
        overflow: hidden;
    }

    /* Efeito de brilho no hover */
    .glass-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 0 30px rgba(0, 243, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.15);
    }

    .card-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
        display: block;
    }

    .card-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: #fff;
    }

    .card-text {
        font-size: 0.95rem;
        color: var(--text-muted);
    }

    /* --- FORMULÃRIO DE WAITLIST --- */
    .waitlist-section {
        max-width: 500px;
        margin: 0 auto 80px;
        padding: 30px;
        /* Estilo Glassmorphism EvoluÃ­do [cite: 51] */
        background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
        border-radius: 20px;
        border: 1px solid var(--glass-border);
        text-align: center;
    }

    .input-group {
        display: flex;
        gap: 10px;
        margin-top: 20px;
        flex-direction: column;
    }

    @media(min-width: 600px) {
        .input-group { flex-direction: row; }
    }

    input[type="email"] {
        flex: 1;
        padding: 14px 20px;
        border-radius: 8px;
        border: 1px solid #334155;
        background: #0f172a;
        color: #fff;
        font-family: 'Inter', sans-serif;
        outline: none;
    }

    input[type="email"]:focus {
        border-color: var(--secondary-neon);
        box-shadow: 0 0 10px rgba(189, 0, 255, 0.2);
    }

    /* BotÃ£o com Gradiente e MicrointeraÃ§Ã£o [cite: 24, 88] */
    .cta-button {
        padding: 14px 28px;
        border-radius: 8px;
        border: none;
        background: linear-gradient(90deg, #4f46e5 0%, #bd00ff 100%);
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-size: 0.9rem;
    }

    .cta-button:hover {
        box-shadow: 0 0 20px rgba(189, 0, 255, 0.4);
        transform: scale(1.02);
    }

    /* --- FOOTER --- */
    footer {
        border-top: 1px solid var(--glass-border);
        padding: 40px 0;
        text-align: center;
        color: #64748b;
        font-size: 0.9rem;
    }

</style>
</head>
<body>

<div class="container">
    <header>
        <div class="logo">VaultMindOS_</div>
        <a href="mailto:contact@vaultmindos.com" class="contact-btn">contact@vaultmindos.com</a>
    </header>

    <section class="hero">
        <div class="terminal-wrapper">
            > <span id="typewriter"></span><span class="cursor"></span>
        </div>
        <h1>O Sistema Operacional<br>da sua InteligÃªncia.</h1>
        <p style="color: #94a3b8; margin-top: 1.5rem; font-size: 1.1rem; max-width: 600px; margin-left: auto; margin-right: auto;">
            Transforme conversas efÃªmeras em ativos digitais permanentes. 
            Privacidade total. IA Local. Seu "segundo cÃ©rebro" blindado.
        </p>
    </section>

    <section class="waitlist-section">
        <h3 style="color: #fff; margin-bottom: 10px;">Solicitar Acesso Alpha</h3>
        <p style="font-size: 0.9rem; color: #94a3b8;">Junte-se a engenheiros e arquitetos na lista de espera.</p>
        
        <form class="input-group" onsubmit="event.preventDefault(); alert('Em breve conectado ao seu sistema de e-mail!');">
            <input type="email" placeholder="seu@email.com" required>
            <button type="submit" class="cta-button">Entrar no Vault</button>
        </form>
    </section>

    <section class="features-grid">
        <div class="glass-card">
            <span class="card-icon">ðŸ”’</span>
            <h3 class="card-title">Privacidade Absoluta</h3>
            <p class="card-text">
                Tecnologia Local-First. Seus vetores e dados rodam no ChromaDB dentro da sua mÃ¡quina. Zero dados na nuvem.
            </p>
        </div>

        <div class="glass-card">
            <span class="card-icon">ðŸ§ </span>
            <h3 class="card-title">MemÃ³ria Infinita (RAG)</h3>
            <p class="card-text">
                O fim da amnÃ©sia. Recupere cÃ³digos, prompts e estratÃ©gias de meses atrÃ¡s em milissegundos com busca semÃ¢ntica.
            </p>
        </div>

        <div class="glass-card">
            <span class="card-icon">ðŸ’Ž</span>
            <h3 class="card-title">PadronizaÃ§Ã£o Enterprise</h3>
            <p class="card-text">
                Organize seus fluxos em Workspaces. Crie a memÃ³ria institucional da sua agÃªncia ou projeto de software.
            </p>
        </div>
    </section>

    <footer>
        <p>&copy; 2025 VaultMindOS. Automating Intelligence. Preserving Privacy.</p>
    </footer>
</div>

<script>
    const text = "Initializing Vault... Local Memory Access... Secure.";
    const element = document.getElementById("typewriter");
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50); // Velocidade da digitaÃ§Ã£o
        }
    }
    
    // Inicia o efeito quando a pÃ¡gina carrega
    window.onload = typeWriter;
</script>

</body>
</html>

============================================================================================================================
============================================================================================================================

SITE 2 VER HTML


<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VaultMindOS | Enterprise Intelligence Architecture</title>
<style>
    /* --- CONFIGURAÃ‡Ã•ES GERAIS E FONTES --- */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800&family=JetBrains+Mono:wght@400;500&display=swap');

    :root {
        --bg-dark: #0B0F19; /* Fundo mais profundo e azulado (Enterprise Dark) */
        --bg-card: #151B2B;
        --primary: #38bdf8; /* Azul Celeste Profissional */
        --secondary: #818cf8; /* Indigo Suave */
        --accent: #2dd4bf; /* Verde Ãgua TecnolÃ³gico */
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border-light: rgba(255, 255, 255, 0.06);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
        font-family: 'Inter', sans-serif;
        background-color: var(--bg-dark);
        color: var(--text-main);
        line-height: 1.6;
        overflow-x: hidden;
    }

    /* --- BACKGROUND DINÃ‚MICO SUTIL --- */
    .bg-glow {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: 
            radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.03) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(129, 140, 248, 0.03) 0%, transparent 40%);
        z-index: -1;
        pointer-events: none;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
    }

    /* --- HEADER (Estilo NavegaÃ§Ã£o SaaS) --- */
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 0;
        border-bottom: 1px solid var(--border-light);
    }

    .logo {
        font-family: 'Inter', sans-serif;
        font-weight: 800;
        font-size: 1.25rem;
        letter-spacing: -0.5px;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .logo span { color: var(--accent); }

    .nav-links {
        display: flex;
        gap: 20px;
    }

    .nav-btn {
        font-size: 0.9rem;
        color: var(--text-muted);
        text-decoration: none;
        font-weight: 500;
        padding: 8px 16px;
        border-radius: 6px;
        transition: all 0.2s;
    }

    .nav-btn:hover { color: #fff; background: rgba(255,255,255,0.05); }
    
    .nav-btn.primary {
        background: #fff;
        color: var(--bg-dark);
        font-weight: 600;
    }
    .nav-btn.primary:hover { background: #e2e8f0; }

    /* --- HERO SECTION (Autoridade e Clareza) --- */
    .hero {
        text-align: center;
        padding: 100px 0 60px;
        max-width: 900px;
        margin: 0 auto;
    }

    .badge {
        display: inline-flex;
        align-items: center;
        padding: 6px 12px;
        background: rgba(45, 212, 191, 0.1);
        color: var(--accent);
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 24px;
        border: 1px solid rgba(45, 212, 191, 0.2);
    }

    h1 {
        font-size: 4rem;
        font-weight: 800;
        line-height: 1.1;
        margin-bottom: 24px;
        letter-spacing: -0.03em;
        background: linear-gradient(180deg, #fff 0%, #94a3b8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .hero p {
        font-size: 1.25rem;
        color: var(--text-muted);
        max-width: 680px;
        margin: 0 auto 40px;
        font-weight: 300;
    }

    /* --- TRUST BAR (Logos de Parceiros/Tecnologias) --- */
    .trust-bar {
        text-align: center;
        margin-bottom: 80px;
        opacity: 0.6;
    }
    .trust-label {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 20px;
        color: #475569;
    }
    .logos-grid {
        display: flex;
        justify-content: center;
        gap: 40px;
        flex-wrap: wrap;
        font-family: 'JetBrains Mono', monospace;
        color: #64748b;
        font-size: 0.9rem;
    }

    /* --- BENTO GRID (Estilo Quantumrun) --- */
    .features-section {
        padding: 40px 0 100px;
    }
    
    .bento-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
    }

    .bento-card {
        background: var(--bg-card);
        border: 1px solid var(--border-light);
        border-radius: 12px;
        padding: 32px;
        transition: transform 0.2s, border-color 0.2s;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }

    .bento-card.large {
        grid-column: span 2; /* Card de destaque horizontal */
        background: linear-gradient(135deg, #151B2B 0%, #1e293b 100%);
    }

    .bento-card:hover {
        transform: translateY(-4px);
        border-color: rgba(255,255,255,0.15);
    }

    .icon-box {
        width: 48px; height: 48px;
        background: rgba(255,255,255,0.03);
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.5rem;
        margin-bottom: 24px;
        border: 1px solid var(--border-light);
    }

    .bento-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: #fff;
    }

    .bento-text {
        font-size: 0.95rem;
        color: var(--text-muted);
    }

    /* --- FORMULÃRIO DE CAPTURA --- */
    .cta-box {
        background: linear-gradient(90deg, #0f172a 0%, #1e293b 100%);
        border: 1px solid var(--border-light);
        border-radius: 16px;
        padding: 60px;
        text-align: center;
        margin-bottom: 80px;
        position: relative;
        overflow: hidden;
    }
    
    .cta-box::before {
        content: '';
        position: absolute;
        top: 0; left: 0; width: 100%; height: 4px;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
    }

    .input-wrapper {
        display: flex;
        max-width: 450px;
        margin: 30px auto 0;
        gap: 10px;
    }

    input {
        flex: 1;
        padding: 16px;
        border-radius: 8px;
        border: 1px solid #334155;
        background: #0B0F19;
        color: #fff;
        font-size: 1rem;
    }

    button.submit-btn {
        padding: 16px 32px;
        border-radius: 8px;
        border: none;
        background: #fff;
        color: #000;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
    }
    button.submit-btn:hover { opacity: 0.9; }

    /* --- FOOTER --- */
    footer {
        border-top: 1px solid var(--border-light);
        padding: 60px 0;
        color: #64748b;
        font-size: 0.9rem;
        display: flex;
        justify-content: space-between;
    }

    @media (max-width: 768px) {
        h1 { font-size: 2.5rem; }
        .bento-grid { grid-template-columns: 1fr; }
        .bento-card.large { grid-column: span 1; }
        .input-wrapper { flex-direction: column; }
        footer { flex-direction: column; gap: 20px; text-align: center; }
    }
</style>
</head>
<body>

<div class="bg-glow"></div>

<div class="container">
    <header>
        <div class="logo">
            <div style="width: 20px; height: 20px; background: var(--accent); border-radius: 4px;"></div>
            VaultMind<span>OS</span>
        </div>
        <nav class="nav-links">
            <a href="#" class="nav-btn">DocumentaÃ§Ã£o</a>
            <a href="#" class="nav-btn">SeguranÃ§a</a>
            <a href="#" class="nav-btn primary">Acessar Sistema</a>
        </nav>
    </header>

    <section class="hero">
        <div class="badge">v2.0 Beta DisponÃ­vel</div>
        <h1>InteligÃªncia Corporativa.<br>Privacidade Soberana.</h1>
        <p>
            Uma infraestrutura de IA local-first que transforma dados nÃ£o estruturados em ativos estratÃ©gicos. 
            Sem vazamentos. Sem dependÃªncia de nuvem.
        </p>
        
        <div style="font-family: 'JetBrains Mono', monospace; color: var(--accent); background: rgba(45, 212, 191, 0.05); display: inline-block; padding: 10px 20px; border-radius: 8px; border: 1px solid rgba(45, 212, 191, 0.1);">
            > <span id="typewriter"></span><span style="animation: blink 1s infinite">_</span>
        </div>
    </section>

    <div class="trust-bar">
        <div class="trust-label">Arquitetura compatÃ­vel com</div>
        <div class="logos-grid">
            <span>PYTHON</span>
            <span>REACT</span>
            <span>DOCKER</span>
            <span>CHROMA DB</span>
            <span>LANGCHAIN</span>
        </div>
    </div>

    <section class="features-section">
        <div class="bento-grid">
            <div class="bento-card large">
                <div class="icon-box">ðŸ›¡ï¸</div>
                <div>
                    <h3 class="bento-title">SeguranÃ§a de NÃ­vel Militar</h3>
                    <p class="bento-text">
                        Seus dados nunca saem da infraestrutura da empresa. O VaultMindOS opera em containers isolados, 
                        garantindo que segredos comerciais permaneÃ§am secretos. A criptografia Ã© aplicada em repouso e em trÃ¢nsito.
                    </p>
                </div>
            </div>

            <div class="bento-card">
                <div class="icon-box">âš¡</div>
                <h3 class="bento-title">RAG InstantÃ¢neo</h3>
                <p class="bento-text">
                    RecuperaÃ§Ã£o Aumentada de GeraÃ§Ã£o (RAG) integrada. Indexe PDFs, cÃ³digos e contratos em segundos.
                </p>
            </div>

            <div class="bento-card">
                <div class="icon-box">ðŸ§ </div>
                <h3 class="bento-title">MemÃ³ria Contextual</h3>
                <p class="bento-text">
                    O sistema "lembra" de decisÃµes passadas, criando uma base de conhecimento evolutiva para sua equipe.
                </p>
            </div>

            <div class="bento-card">
                <div class="icon-box">ðŸ“Š</div>
                <h3 class="bento-title">Analytics Preditivo</h3>
                <p class="bento-text">
                    Transforme logs de conversas em insights de produtividade e identifique gargalos operacionais.
                </p>
            </div>
            
            <div class="bento-card">
                <div class="icon-box">ðŸ”Œ</div>
                <h3 class="bento-title">API First</h3>
                <p class="bento-text">
                    Integre o VaultMindOS ao seu CRM, ERP ou Slack atravÃ©s de endpoints RESTful documentados.
                </p>
            </div>
        </div>
    </section>

    <section class="cta-box">
        <h2 style="font-size: 2rem; margin-bottom: 16px;">Pronto para implantar?</h2>
        <p style="color: var(--text-muted);">Entre na lista de espera para receber a documentaÃ§Ã£o tÃ©cnica.</p>
        
        <form class="input-wrapper" onsubmit="event.preventDefault(); alert('E-mail registrado na lista de espera!');">
            <input type="email" placeholder="nome@suaempresa.com" required>
            <button type="submit" class="submit-btn">Solicitar Acesso</button>
        </form>
    </section>

    <footer>
        <div>
            <strong>VaultMindOS</strong>
            <div style="margin-top: 10px;">Automating Intelligence.</div>
        </div>
        <div style="display: flex; gap: 20px;">
            <a href="#" style="color: inherit; text-decoration: none;">GitHub</a>
            <a href="#" style="color: inherit; text-decoration: none;">Twitter</a>
            <a href="#" style="color: inherit; text-decoration: none;">LinkedIn</a>
        </div>
    </footer>
</div>

<script>
    const text = "System.initialize({ privacy: 'strict', memory: 'infinite' });";
    const element = document.getElementById("typewriter");
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 40);
        }
    }
    
    // Inicia a animaÃ§Ã£o ao carregar
    window.onload = typeWriter;
</script>

</body>
</html>

===================================================================================================================
===================================================================================================================
===================================================================================================================
===================================================================================================================


SITE VERSÃƒO 3

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VaultMindOS | Enterprise Intelligence Architecture</title>
<style>
    /* --- CONFIGURAÃ‡Ã•ES GERAIS E FONTES --- */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800&family=JetBrains+Mono:wght@400;500&display=swap');

    :root {
        --bg-dark: #0B0F19; 
        --bg-card: #151B2B;
        --primary: #38bdf8; 
        --secondary: #818cf8; 
        --accent: #2dd4bf; 
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border-light: rgba(255, 255, 255, 0.06);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
        font-family: 'Inter', sans-serif;
        background-color: var(--bg-dark);
        color: var(--text-main);
        line-height: 1.6;
        overflow-x: hidden;
    }

    /* --- BACKGROUND DINÃ‚MICO SUTIL --- */
    .bg-glow {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: 
            radial-gradient(circle at 10% 20%, rgba(56, 189, 248, 0.03) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(129, 140, 248, 0.03) 0%, transparent 40%);
        z-index: -1;
        pointer-events: none;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
    }

    /* --- HEADER (NavegaÃ§Ã£o) --- */
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 0;
        border-bottom: 1px solid var(--border-light);
    }

    .logo {
        font-family: 'Inter', sans-serif;
        font-weight: 800;
        font-size: 1.25rem;
        letter-spacing: -0.5px;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .logo span { color: var(--accent); }

    .nav-links {
        display: flex;
        gap: 20px;
        align-items: center;
    }

    .nav-btn {
        font-size: 0.9rem;
        color: var(--text-muted);
        text-decoration: none;
        font-weight: 500;
        padding: 8px 16px;
        border-radius: 6px;
        transition: all 0.2s;
    }

    .nav-btn:hover { color: #fff; background: rgba(255,255,255,0.05); }
    
    /* --- BOTÃƒO DE IDIOMA (NOVO - Baseado na ReferÃªncia) --- */
    .lang-dropdown {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: #f1f5f9; /* Fundo claro como na imagem */
        color: #0f172a; /* Texto escuro para contraste */
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
        border: 1px solid transparent;
    }

    .lang-dropdown:hover {
        background-color: #e2e8f0;
    }

    .lang-flag {
        width: 20px;
        height: auto;
        border-radius: 2px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }

    .lang-arrow {
        font-size: 0.7rem;
        margin-left: 4px;
        opacity: 0.6;
    }

    /* BotÃ£o de AÃ§Ã£o Principal */
    .nav-btn.primary {
        background: #fff;
        color: var(--bg-dark);
        font-weight: 600;
        margin-left: 10px;
    }
    .nav-btn.primary:hover { background: #e2e8f0; }

    /* --- HERO SECTION --- */
    .hero {
        text-align: center;
        padding: 100px 0 60px;
        max-width: 900px;
        margin: 0 auto;
    }

    .badge {
        display: inline-flex;
        align-items: center;
        padding: 6px 12px;
        background: rgba(45, 212, 191, 0.1);
        color: var(--accent);
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 24px;
        border: 1px solid rgba(45, 212, 191, 0.2);
    }

    h1 {
        font-size: 4rem;
        font-weight: 800;
        line-height: 1.1;
        margin-bottom: 24px;
        letter-spacing: -0.03em;
        background: linear-gradient(180deg, #fff 0%, #94a3b8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .hero p {
        font-size: 1.25rem;
        color: var(--text-muted);
        max-width: 680px;
        margin: 0 auto 40px;
        font-weight: 300;
    }

    /* --- TRUST BAR --- */
    .trust-bar {
        text-align: center;
        margin-bottom: 80px;
        opacity: 0.6;
    }
    .trust-label {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 20px;
        color: #475569;
    }
    .logos-grid {
        display: flex;
        justify-content: center;
        gap: 40px;
        flex-wrap: wrap;
        font-family: 'JetBrains Mono', monospace;
        color: #64748b;
        font-size: 0.9rem;
    }

    /* --- BENTO GRID --- */
    .features-section {
        padding: 40px 0 100px;
    }
    
    .bento-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
    }

    .bento-card {
        background: var(--bg-card);
        border: 1px solid var(--border-light);
        border-radius: 12px;
        padding: 32px;
        transition: transform 0.2s, border-color 0.2s;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }

    .bento-card.large {
        grid-column: span 2;
        background: linear-gradient(135deg, #151B2B 0%, #1e293b 100%);
    }

    .bento-card:hover {
        transform: translateY(-4px);
        border-color: rgba(255,255,255,0.15);
    }

    .icon-box {
        width: 48px; height: 48px;
        background: rgba(255,255,255,0.03);
        border-radius: 8px;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.5rem;
        margin-bottom: 24px;
        border: 1px solid var(--border-light);
    }

    .bento-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: #fff;
    }

    .bento-text {
        font-size: 0.95rem;
        color: var(--text-muted);
    }

    /* --- FORMULÃRIO --- */
    .cta-box {
        background: linear-gradient(90deg, #0f172a 0%, #1e293b 100%);
        border: 1px solid var(--border-light);
        border-radius: 16px;
        padding: 60px;
        text-align: center;
        margin-bottom: 80px;
        position: relative;
        overflow: hidden;
    }
    
    .cta-box::before {
        content: '';
        position: absolute;
        top: 0; left: 0; width: 100%; height: 4px;
        background: linear-gradient(90deg, var(--primary), var(--secondary));
    }

    .input-wrapper {
        display: flex;
        max-width: 450px;
        margin: 30px auto 0;
        gap: 10px;
    }

    input {
        flex: 1;
        padding: 16px;
        border-radius: 8px;
        border: 1px solid #334155;
        background: #0B0F19;
        color: #fff;
        font-size: 1rem;
    }

    button.submit-btn {
        padding: 16px 32px;
        border-radius: 8px;
        border: none;
        background: #fff;
        color: #000;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
    }
    button.submit-btn:hover { opacity: 0.9; }

    /* --- FOOTER --- */
    footer {
        border-top: 1px solid var(--border-light);
        padding: 60px 0;
        color: #64748b;
        font-size: 0.9rem;
        display: flex;
        justify-content: space-between;
    }

    @media (max-width: 768px) {
        h1 { font-size: 2.5rem; }
        .bento-grid { grid-template-columns: 1fr; }
        .bento-card.large { grid-column: span 1; }
        .input-wrapper { flex-direction: column; }
        header { flex-direction: column; gap: 20px; }
        .nav-links { flex-wrap: wrap; justify-content: center; }
        footer { flex-direction: column; gap: 20px; text-align: center; }
    }
</style>
</head>
<body>

<div class="bg-glow"></div>

<div class="container">
    <header>
        <div class="logo">
            <div style="width: 20px; height: 20px; background: var(--accent); border-radius: 4px;"></div>
            VaultMind<span>OS</span>
        </div>
        <nav class="nav-links">
            <div class="lang-dropdown" onclick="alert('Default Language: English (US)')">
                <img src="https://flagcdn.com/w40/us.png" alt="USA Flag" class="lang-flag">
                <span>English</span>
                <span class="lang-arrow">â–¼</span>
            </div>

            <a href="#" class="nav-btn">DocumentaÃ§Ã£o</a>
            <a href="#" class="nav-btn">SeguranÃ§a</a>
            <a href="#" class="nav-btn primary">Acessar Sistema</a>
        </nav>
    </header>

    <section class="hero">
        <div class="badge">v2.0 Beta DisponÃ­vel</div>
        <h1>InteligÃªncia Corporativa.<br>Privacidade Soberana.</h1>
        <p>
            Uma infraestrutura de IA local-first que transforma dados nÃ£o estruturados em ativos estratÃ©gicos. 
            Sem vazamentos. Sem dependÃªncia de nuvem.
        </p>
        
        <div style="font-family: 'JetBrains Mono', monospace; color: var(--accent); background: rgba(45, 212, 191, 0.05); display: inline-block; padding: 10px 20px; border-radius: 8px; border: 1px solid rgba(45, 212, 191, 0.1);">
            > <span id="typewriter"></span><span style="animation: blink 1s infinite">_</span>
        </div>
    </section>

    <div class="trust-bar">
        <div class="trust-label">Arquitetura compatÃ­vel com</div>
        <div class="logos-grid">
            <span>PYTHON</span>
            <span>REACT</span>
            <span>DOCKER</span>
            <span>CHROMA DB</span>
            <span>LANGCHAIN</span>
        </div>
    </div>

    <section class="features-section">
        <div class="bento-grid">
            <div class="bento-card large">
                <div class="icon-box">ðŸ›¡ï¸</div>
                <div>
                    <h3 class="bento-title">SeguranÃ§a de NÃ­vel Militar</h3>
                    <p class="bento-text">
                        Seus dados nunca saem da infraestrutura da empresa. O VaultMindOS opera em containers isolados, 
                        garantindo que segredos comerciais permaneÃ§am secretos.
                    </p>
                </div>
            </div>

            <div class="bento-card">
                <div class="icon-box">âš¡</div>
                <h3 class="bento-title">RAG InstantÃ¢neo</h3>
                <p class="bento-text">
                    RecuperaÃ§Ã£o Aumentada de GeraÃ§Ã£o (RAG) integrada. Indexe PDFs e cÃ³digos em segundos.
                </p>
            </div>

            <div class="bento-card">
                <div class="icon-box">ðŸ§ </div>
                <h3 class="bento-title">MemÃ³ria Contextual</h3>
                <p class="bento-text">
                    O sistema "lembra" de decisÃµes passadas, criando uma base de conhecimento evolutiva.
                </p>
            </div>

            <div class="bento-card">
                <div class="icon-box">ðŸ“Š</div>
                <h3 class="bento-title">Analytics Preditivo</h3>
                <p class="bento-text">
                    Transforme logs de conversas em insights de produtividade e identifique gargalos.
                </p>
            </div>
            
            <div class="bento-card">
                <div class="icon-box">ðŸ”Œ</div>
                <h3 class="bento-title">API First</h3>
                <p class="bento-text">
                    Integre o VaultMindOS ao seu CRM ou Slack atravÃ©s de endpoints RESTful.
                </p>
            </div>
        </div>
    </section>

    <section class="cta-box">
        <h2 style="font-size: 2rem; margin-bottom: 16px;">Pronto para implantar?</h2>
        <p style="color: var(--text-muted);">Entre na lista de espera para receber a documentaÃ§Ã£o tÃ©cnica.</p>
        
        <form class="input-wrapper" onsubmit="event.preventDefault(); alert('E-mail registrado na lista de espera!');">
            <input type="email" placeholder="nome@suaempresa.com" required>
            <button type="submit" class="submit-btn">Solicitar Acesso</button>
        </form>
    </section>

    <footer>
        <div>
            <strong>VaultMindOS</strong>
            <div style="margin-top: 10px;">Automating Intelligence.</div>
        </div>
        <div style="display: flex; gap: 20px;">
            <a href="#" style="color: inherit; text-decoration: none;">GitHub</a>
            <a href="#" style="color: inherit; text-decoration: none;">Twitter</a>
            <a href="#" style="color: inherit; text-decoration: none;">LinkedIn</a>
        </div>
    </footer>
</div>

<script>
    const text = "System.initialize({ privacy: 'strict', memory: 'infinite' });";
    const element = document.getElementById("typewriter");
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 40);
        }
    }
    window.onload = typeWriter;
</script>

</body>
</html>

===================================================================================================================
===================================================================================================================
===================================================================================================================
===================================================================================================================


SITE VERSÃƒO 4


<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VaultMindOS | Strategic Foresight & Intelligence</title>
<style>
    /* --- CONFIGURAÃ‡Ã•ES GERAIS E FONTES --- */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800&family=JetBrains+Mono:wght@400;500&display=swap');

    :root {
        --bg-dark: #0B0F19; 
        --bg-card: #151B2B;
        --primary: #38bdf8; 
        --secondary: #818cf8; 
        --accent: #2dd4bf; 
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border-light: rgba(255, 255, 255, 0.06);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
        font-family: 'Inter', sans-serif;
        background-color: var(--bg-dark);
        color: var(--text-main);
        line-height: 1.6;
        overflow-x: hidden;
    }

    /* BACKGROUND DINÃ‚MICO */
    .bg-glow {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: 
            radial-gradient(circle at 15% 25%, rgba(56, 189, 248, 0.04) 0%, transparent 40%),
            radial-gradient(circle at 85% 75%, rgba(45, 212, 191, 0.04) 0%, transparent 40%);
        z-index: -1;
        pointer-events: none;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 24px;
    }

    /* --- HEADER --- */
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 0;
        border-bottom: 1px solid var(--border-light);
    }

    .logo {
        font-family: 'Inter', sans-serif;
        font-weight: 800;
        font-size: 1.25rem;
        letter-spacing: -0.5px;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .logo span { color: var(--accent); }

    .nav-links {
        display: flex;
        gap: 24px;
        align-items: center;
    }

    .nav-item {
        font-size: 0.9rem;
        color: var(--text-muted);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
    }
    .nav-item:hover { color: #fff; }

    /* SELETOR DE IDIOMA (Estilo Quantumrun) */
    .lang-dropdown {
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: #f8fafc;
        color: #0f172a;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        border: 1px solid transparent;
        margin-right: 15px;
    }
    .lang-flag { width: 18px; border-radius: 2px; }
    .lang-arrow { font-size: 0.6rem; opacity: 0.6; }

    .btn-login {
        border: 1px solid var(--border-light);
        padding: 8px 16px;
        border-radius: 6px;
        color: #fff;
        text-decoration: none;
        font-size: 0.9rem;
    }

    /* --- HERO --- */
    .hero {
        text-align: center;
        padding: 100px 0 60px;
        max-width: 900px;
        margin: 0 auto;
    }

    h1 {
        font-size: 3.5rem;
        font-weight: 800;
        line-height: 1.1;
        margin-bottom: 24px;
        letter-spacing: -0.02em;
        background: linear-gradient(180deg, #fff 0%, #cbd5e1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .hero p {
        font-size: 1.2rem;
        color: var(--text-muted);
        max-width: 700px;
        margin: 0 auto 40px;
    }

    /* --- SERVICES GRID (Dados do Arquivo) --- */
    .section-title {
        font-size: 1.8rem;
        margin-bottom: 40px;
        border-left: 4px solid var(--primary);
        padding-left: 20px;
    }

    .bento-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        margin-bottom: 80px;
    }

    .bento-card {
        background: var(--bg-card);
        border: 1px solid var(--border-light);
        border-radius: 12px;
        padding: 30px;
        transition: transform 0.2s, border-color 0.2s;
    }

    .bento-card:hover {
        transform: translateY(-5px);
        border-color: rgba(255,255,255,0.1);
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .card-icon { font-size: 1.5rem; margin-bottom: 15px; display: block; }
    .card-title { font-size: 1.1rem; color: #fff; margin-bottom: 10px; font-weight: 600; }
    .card-desc { font-size: 0.9rem; color: var(--text-muted); }

    /* --- INDUSTRIES TAGS (Dados do Arquivo) --- */
    .industries-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 80px;
    }

    .industry-tag {
        background: rgba(255,255,255,0.03);
        border: 1px solid var(--border-light);
        padding: 10px 20px;
        border-radius: 50px;
        font-size: 0.9rem;
        color: var(--text-muted);
        transition: all 0.2s;
        cursor: default;
    }

    .industry-tag:hover {
        background: rgba(56, 189, 248, 0.1);
        color: var(--primary);
        border-color: var(--primary);
    }

    /* --- FOOTER (Estrutura do Arquivo) --- */
    footer {
        border-top: 1px solid var(--border-light);
        padding: 80px 0 40px;
        background: #080b12;
        margin-top: 60px;
    }

    .footer-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 40px;
        margin-bottom: 60px;
    }

    .footer-col h4 {
        color: #fff;
        margin-bottom: 20px;
        font-size: 1rem;
        letter-spacing: 1px;
        text-transform: uppercase;
    }

    .footer-col ul { list-style: none; }
    
    .footer-col li { margin-bottom: 12px; }
    
    .footer-col a {
        color: #64748b;
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s;
    }

    .footer-col a:hover { color: var(--primary); }

    .footer-bottom {
        border-top: 1px solid var(--border-light);
        padding-top: 30px;
        text-align: center;
        font-size: 0.85rem;
        color: #475569;
    }

    @media (max-width: 768px) {
        header { flex-direction: column; gap: 20px; }
        .nav-links { flex-wrap: wrap; justify-content: center; }
        h1 { font-size: 2.5rem; }
    }
</style>
</head>
<body>

<div class="bg-glow"></div>

<div class="container">
    <header>
        <div class="logo">
            <div style="width: 20px; height: 20px; background: var(--accent); border-radius: 4px;"></div>
            VaultMind<span>OS</span>
        </div>
        
        <nav class="nav-links">
            <a href="#" class="nav-item">Consulting</a>
            <a href="#" class="nav-item">Platform</a>
            <a href="#" class="nav-item">Industries</a>
            <a href="#" class="nav-item">About</a>
            
            <div class="lang-dropdown">
                <img src="https://flagcdn.com/w40/us.png" alt="US" class="lang-flag">
                <span>English</span>
                <span class="lang-arrow">â–¼</span>
            </div>
            
            <a href="#" class="btn-login">Login</a>
        </nav>
    </header>

    <section class="hero">
        <div style="color: var(--accent); font-family: 'JetBrains Mono'; font-size: 0.9rem; margin-bottom: 20px;">
            > FUTURE_READINESS_PROTOCOL_INIT
        </div>
        <h1>Adapt to emerging trends<br>before they happen.</h1>
        <p>
            Strategic foresight consulting and intelligence software to help your company stay aware and adapt to market shifts.
        </p>
    </section>

    <h2 class="section-title">Consulting Services</h2>
    <div class="bento-grid">
        <div class="bento-card">
            <span class="card-icon">ðŸ’¡</span>
            <div class="card-title">Business Ideation</div>
            <div class="card-desc">Generate innovative product and service concepts based on data-driven trends.</div>
        </div>
        <div class="bento-card">
            <span class="card-icon">ðŸŽ¤</span>
            <div class="card-title">Futurist Speakers</div>
            <div class="card-desc">Engage your audience with keynote presentations on the future of your industry.</div>
        </div>
        <div class="bento-card">
            <span class="card-icon">ðŸ› ï¸</span>
            <div class="card-title">Foresight Workshops</div>
            <div class="card-desc">Collaborative sessions to map out scenarios and build strategic resilience.</div>
        </div>
        <div class="bento-card">
            <span class="card-icon">ðŸ“Š</span>
            <div class="card-title">Corporate Reports</div>
            <div class="card-desc">Deep-dive custom research reports tailored to your specific organizational needs.</div>
        </div>
        <div class="bento-card">
            <span class="card-icon">ðŸŒ</span>
            <div class="card-title">Trend Scanning</div>
            <div class="card-desc">Continuous monitoring of signals and shifts relevant to your market sector.</div>
        </div>
        <div class="bento-card">
            <span class="card-icon">ðŸš€</span>
            <div class="card-title">SciFi Visioning</div>
            <div class="card-desc">Design fiction and prototyping to visualize potential futures tangibly.</div>
        </div>
    </div>

    <h2 class="section-title">Industries We Serve</h2>
    <div class="industries-wrapper">
        <span class="industry-tag">Aerospace</span>
        <span class="industry-tag">Automotive</span>
        <span class="industry-tag">Banking & Finance</span>
        <span class="industry-tag">Consumer Goods (CPG)</span>
        <span class="industry-tag">Energy Sector</span>
        <span class="industry-tag">Insurance</span>
        <span class="industry-tag">Retail</span>
        <span class="industry-tag">Technology</span>
        <span class="industry-tag">Pharmaceuticals</span>
        <span class="industry-tag">Government</span>
        <span class="industry-tag">Logistics</span>
    </div>

</div>

<footer>
    <div class="container">
        <div class="footer-grid">
            
            <div class="footer-col">
                <h4>Consulting</h4>
                <ul>
                    <li><a href="#">Business Ideation</a></li>
                    <li><a href="#">Futurist Speakers</a></li>
                    <li><a href="#">Foresight Workshops</a></li>
                    <li><a href="#">Corporate Reports</a></li>
                    <li><a href="#">Policy Foresight</a></li>
                    <li><a href="#">Internal Department</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Platform</h4>
                <ul>
                    <li><a href="#">Foresight Platform</a></li>
                    <li><a href="#">Pricing & Plans</a></li>
                    <li><a href="#">Newsletter</a></li>
                    <li><a href="#">Trend Reports 2024</a></li>
                    <li><a href="#">Affiliate Program</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Publications</h4>
                <ul>
                    <li><a href="#">Public Website</a></li>
                    <li><a href="#">Trends Report</a></li>
                    <li><a href="#">Special Series</a></li>
                    <li><a href="#">Future Timelines</a></li>
                    <li><a href="#">Blog</a></li>
                </ul>
            </div>

            <div class="footer-col">
                <h4>Company</h4>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Methodology</a></li>
                    <li><a href="#">The Team</a></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Press</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>

        </div>

        <div class="footer-bottom">
            &copy; 2025 VaultMindOS Foresight. Subsidiary of FutureSpec Group. All Rights Reserved.
        </div>
    </div>
</footer>

</body>
</html>
```

---

## FILE: \SITE EXEMPLP quantumrun.txt
```txt

<!doctype html>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<link rel="stylesheet" type="text/css" href="//quantumrun.com/consulting/test/wp-content/cache/quantumrun.com/wpfc-minified/kq7k79oz/bx7y6.css" media="all"/>
	<!--
	<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0/css/all.min.css">
	-->
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<!--script async src="https://www.googletagmanager.com/gtag/js?id=UA-48425137-1"></script>
	<script>
	  window.dataLayer = window.dataLayer || [];
	  function gtag(){dataLayer.push(arguments);}
	  gtag('js', new Date());
	  gtag('config', 'UA-48425137-1');
	</script-->
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-48425137-1"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());



gtag('config', 'UA-48425137-1');
</script>
<!--script async src="https://www.googletagmanager.com/gtag/js?id=G-7D2TLZ76GB"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);} 
  gtag('js', new Date());

  gtag('config', 'G-7D2TLZ76GB');
</script>
	<script type="text/javascript">
var ga_fired = false;
window.addEventListener("scroll", function(){
if ((document.documentElement.scrollTop != 0 && ga_fired === false) || (document.body.scrollTop != 0 && ga_fired === false)) {
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', '48425137', 'auto');
ga('send', 'pageview');
ga('set', 'anonymizeIp', true);				ga_fired = true;
}
}, true);
</script--> 
	<link rel="stylesheet" type="text/css" href="https://www.quantumrun.com/consulting/wp-content/themes/hello-elementor/all.min.css">
	<meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />
	<style>img:is([sizes="auto" i], [sizes^="auto," i]) { contain-intrinsic-size: 3000px 1500px }</style>
	<meta name="uri-translation" content="on" />
	<!-- This site is optimized with the Yoast SEO plugin v21.7 - https://yoast.com/wordpress/plugins/seo/ -->
	<title>Foresight consulting services - Quantumrun Foresight</title>
	<meta name="description" content="Quantumrun Foresight is an innovation management and strategic foresight agency that helps corporations and government agencies create future-ready business and policy solutions." />
	<link rel="canonical" href="https://www.quantumrun.com/consulting/" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Quantumrun Foresight | Thrive from future trends" />
	<meta property="og:description" content="Quantumrun Foresight is an innovation management and strategic foresight agency that helps corporations and government agencies create future-ready business and policy solutions." />
	<meta property="og:url" content="https://www.quantumrun.com/consulting/" />
	<meta property="og:site_name" content="Quantumrun Foresight" />
	<meta property="article:modified_time" content="2025-09-11T15:58:42+00:00" />
	<meta property="og:image" content="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/img-1.jpg" />
	<meta property="og:image:width" content="1920" />
	<meta property="og:image:height" content="1080" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Quantumrun Foresight | Thrive from future trends" />
	<meta name="twitter:description" content="Quantumrun Foresight is a trend intelligence and strategic foresight agency that helps corporations and government agencies create future-ready business and policy solutions." />
	<meta name="twitter:image" content="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/img-1.jpg" />
	<script type="application/ld+json" class="yoast-schema-graph">{"@context":"https://schema.org","@graph":[{"@type":"WebPage","@id":"https://www.quantumrun.com/consulting/","url":"https://www.quantumrun.com/consulting/","name":"Foresight consulting services - Quantumrun Foresight","isPartOf":{"@id":"https://www.quantumrun.com/consulting/#website"},"about":{"@id":"https://www.quantumrun.com/consulting/#organization"},"primaryImageOfPage":{"@id":"https://www.quantumrun.com/consulting/#primaryimage"},"image":{"@id":"https://www.quantumrun.com/consulting/#primaryimage"},"thumbnailUrl":"https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/img-1.jpg","datePublished":"2022-11-18T02:09:19+00:00","dateModified":"2025-09-11T15:58:42+00:00","description":"Quantumrun Foresight is an innovation management and strategic foresight agency that helps corporations and government agencies create future-ready business and policy solutions.","breadcrumb":{"@id":"https://www.quantumrun.com/consulting/#breadcrumb"},"inLanguage":"en-US","potentialAction":[{"@type":"ReadAction","target":["https://www.quantumrun.com/consulting/"]}]},{"@type":"ImageObject","inLanguage":"en-US","@id":"https://www.quantumrun.com/consulting/#primaryimage","url":"https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/img-1.jpg","contentUrl":"https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/img-1.jpg","width":1920,"height":1080},{"@type":"BreadcrumbList","@id":"https://www.quantumrun.com/consulting/#breadcrumb","itemListElement":[{"@type":"ListItem","position":1,"name":"Home"}]},{"@type":"WebSite","@id":"https://www.quantumrun.com/consulting/#website","url":"https://www.quantumrun.com/consulting/","name":"Quantumrun Foresight","description":"Thrive from future trends.","publisher":{"@id":"https://www.quantumrun.com/consulting/#organization"},"potentialAction":[{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://www.quantumrun.com/consulting/?s={search_term_string}"},"query-input":"required name=search_term_string"}],"inLanguage":"en-US"},{"@type":"Organization","@id":"https://www.quantumrun.com/consulting/#organization","name":"Quantumrun Foresight","url":"https://www.quantumrun.com/consulting/","logo":{"@type":"ImageObject","inLanguage":"en-US","@id":"https://www.quantumrun.com/consulting/#/schema/logo/image/","url":"https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/cropped-con-logo-00.png","contentUrl":"https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/cropped-con-logo-00.png","width":286,"height":55,"caption":"Quantumrun Foresight"},"image":{"@id":"https://www.quantumrun.com/consulting/#/schema/logo/image/"}}]}</script>
	<!-- / Yoast SEO plugin. -->


<link rel='dns-prefetch' href='//js.hs-scripts.com' />
<link rel="alternate" type="application/rss+xml" title="Quantumrun Foresight &raquo; Feed" href="https://www.quantumrun.com/consulting/feed/" />
<link rel="alternate" type="application/rss+xml" title="Quantumrun Foresight &raquo; Comments Feed" href="https://www.quantumrun.com/consulting/comments/feed/" />
		<!-- This site uses the Google Analytics by MonsterInsights plugin v8.23.1 - Using Analytics tracking - https://www.monsterinsights.com/ -->
							<script src="//www.googletagmanager.com/gtag/js?id=G-7D2TLZ76GB"  data-cfasync="false" data-wpfc-render="false" type="text/javascript" async></script>
			<script data-cfasync="false" data-wpfc-render="false" type="text/javascript">
				var mi_version = '8.23.1';
				var mi_track_user = true;
				var mi_no_track_reason = '';
				
								var disableStrs = [
										'ga-disable-G-7D2TLZ76GB',
									];

				/* Function to detect opted out users */
				function __gtagTrackerIsOptedOut() {
					for (var index = 0; index < disableStrs.length; index++) {
						if (document.cookie.indexOf(disableStrs[index] + '=true') > -1) {
							return true;
						}
					}

					return false;
				}

				/* Disable tracking if the opt-out cookie exists. */
				if (__gtagTrackerIsOptedOut()) {
					for (var index = 0; index < disableStrs.length; index++) {
						window[disableStrs[index]] = true;
					}
				}

				/* Opt-out function */
				function __gtagTrackerOptout() {
					for (var index = 0; index < disableStrs.length; index++) {
						document.cookie = disableStrs[index] + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
						window[disableStrs[index]] = true;
					}
				}

				if ('undefined' === typeof gaOptout) {
					function gaOptout() {
						__gtagTrackerOptout();
					}
				}
								window.dataLayer = window.dataLayer || [];

				window.MonsterInsightsDualTracker = {
					helpers: {},
					trackers: {},
				};
				if (mi_track_user) {
					function __gtagDataLayer() {
						dataLayer.push(arguments);
					}

					function __gtagTracker(type, name, parameters) {
						if (!parameters) {
							parameters = {};
						}

						if (parameters.send_to) {
							__gtagDataLayer.apply(null, arguments);
							return;
						}

						if (type === 'event') {
														parameters.send_to = monsterinsights_frontend.v4_id;
							var hookName = name;
							if (typeof parameters['event_category'] !== 'undefined') {
								hookName = parameters['event_category'] + ':' + name;
							}

							if (typeof MonsterInsightsDualTracker.trackers[hookName] !== 'undefined') {
								MonsterInsightsDualTracker.trackers[hookName](parameters);
							} else {
								__gtagDataLayer('event', name, parameters);
							}
							
						} else {
							__gtagDataLayer.apply(null, arguments);
						}
					}

					__gtagTracker('js', new Date());
					__gtagTracker('set', {
						'developer_id.dZGIzZG': true,
											});
										__gtagTracker('config', 'G-7D2TLZ76GB', {"forceSSL":"true","link_attribution":"true"} );
															window.gtag = __gtagTracker;										(function () {
						/* https://developers.google.com/analytics/devguides/collection/analyticsjs/ */
						/* ga and __gaTracker compatibility shim. */
						var noopfn = function () {
							return null;
						};
						var newtracker = function () {
							return new Tracker();
						};
						var Tracker = function () {
							return null;
						};
						var p = Tracker.prototype;
						p.get = noopfn;
						p.set = noopfn;
						p.send = function () {
							var args = Array.prototype.slice.call(arguments);
							args.unshift('send');
							__gaTracker.apply(null, args);
						};
						var __gaTracker = function () {
							var len = arguments.length;
							if (len === 0) {
								return;
							}
							var f = arguments[len - 1];
							if (typeof f !== 'object' || f === null || typeof f.hitCallback !== 'function') {
								if ('send' === arguments[0]) {
									var hitConverted, hitObject = false, action;
									if ('event' === arguments[1]) {
										if ('undefined' !== typeof arguments[3]) {
											hitObject = {
												'eventAction': arguments[3],
												'eventCategory': arguments[2],
												'eventLabel': arguments[4],
												'value': arguments[5] ? arguments[5] : 1,
											}
										}
									}
									if ('pageview' === arguments[1]) {
										if ('undefined' !== typeof arguments[2]) {
											hitObject = {
												'eventAction': 'page_view',
												'page_path': arguments[2],
											}
										}
									}
									if (typeof arguments[2] === 'object') {
										hitObject = arguments[2];
									}
									if (typeof arguments[5] === 'object') {
										Object.assign(hitObject, arguments[5]);
									}
									if ('undefined' !== typeof arguments[1].hitType) {
										hitObject = arguments[1];
										if ('pageview' === hitObject.hitType) {
											hitObject.eventAction = 'page_view';
										}
									}
									if (hitObject) {
										action = 'timing' === arguments[1].hitType ? 'timing_complete' : hitObject.eventAction;
										hitConverted = mapArgs(hitObject);
										__gtagTracker('event', action, hitConverted);
									}
								}
								return;
							}

							function mapArgs(args) {
								var arg, hit = {};
								var gaMap = {
									'eventCategory': 'event_category',
									'eventAction': 'event_action',
									'eventLabel': 'event_label',
									'eventValue': 'event_value',
									'nonInteraction': 'non_interaction',
									'timingCategory': 'event_category',
									'timingVar': 'name',
									'timingValue': 'value',
									'timingLabel': 'event_label',
									'page': 'page_path',
									'location': 'page_location',
									'title': 'page_title',
									'referrer' : 'page_referrer',
								};
								for (arg in args) {
																		if (!(!args.hasOwnProperty(arg) || !gaMap.hasOwnProperty(arg))) {
										hit[gaMap[arg]] = args[arg];
									} else {
										hit[arg] = args[arg];
									}
								}
								return hit;
							}

							try {
								f.hitCallback();
							} catch (ex) {
							}
						};
						__gaTracker.create = newtracker;
						__gaTracker.getByName = newtracker;
						__gaTracker.getAll = function () {
							return [];
						};
						__gaTracker.remove = noopfn;
						__gaTracker.loaded = true;
						window['__gaTracker'] = __gaTracker;
					})();
									} else {
										console.log("");
					(function () {
						function __gtagTracker() {
							return null;
						}

						window['__gtagTracker'] = __gtagTracker;
						window['gtag'] = __gtagTracker;
					})();
									}
			</script>
				<!-- / Google Analytics by MonsterInsights -->
		<script type="text/javascript">
/* <![CDATA[ */
window._wpemojiSettings = {"baseUrl":"https:\/\/s.w.org\/images\/core\/emoji\/15.0.3\/72x72\/","ext":".png","svgUrl":"https:\/\/s.w.org\/images\/core\/emoji\/15.0.3\/svg\/","svgExt":".svg","source":{"concatemoji":"https:\/\/www.quantumrun.com\/consulting\/wp-includes\/js\/wp-emoji-release.min.js?ver=6.7.1"}};
/*! This file is auto-generated */
!function(i,n){var o,s,e;function c(e){try{var t={supportTests:e,timestamp:(new Date).valueOf()};sessionStorage.setItem(o,JSON.stringify(t))}catch(e){}}function p(e,t,n){e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillText(t,0,0);var t=new Uint32Array(e.getImageData(0,0,e.canvas.width,e.canvas.height).data),r=(e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillText(n,0,0),new Uint32Array(e.getImageData(0,0,e.canvas.width,e.canvas.height).data));return t.every(function(e,t){return e===r[t]})}function u(e,t,n){switch(t){case"flag":return n(e,"\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f","\ud83c\udff3\ufe0f\u200b\u26a7\ufe0f")?!1:!n(e,"\ud83c\uddfa\ud83c\uddf3","\ud83c\uddfa\u200b\ud83c\uddf3")&&!n(e,"\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f","\ud83c\udff4\u200b\udb40\udc67\u200b\udb40\udc62\u200b\udb40\udc65\u200b\udb40\udc6e\u200b\udb40\udc67\u200b\udb40\udc7f");case"emoji":return!n(e,"\ud83d\udc26\u200d\u2b1b","\ud83d\udc26\u200b\u2b1b")}return!1}function f(e,t,n){var r="undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?new OffscreenCanvas(300,150):i.createElement("canvas"),a=r.getContext("2d",{willReadFrequently:!0}),o=(a.textBaseline="top",a.font="600 32px Arial",{});return e.forEach(function(e){o[e]=t(a,e,n)}),o}function t(e){var t=i.createElement("script");t.src=e,t.defer=!0,i.head.appendChild(t)}"undefined"!=typeof Promise&&(o="wpEmojiSettingsSupports",s=["flag","emoji"],n.supports={everything:!0,everythingExceptFlag:!0},e=new Promise(function(e){i.addEventListener("DOMContentLoaded",e,{once:!0})}),new Promise(function(t){var n=function(){try{var e=JSON.parse(sessionStorage.getItem(o));if("object"==typeof e&&"number"==typeof e.timestamp&&(new Date).valueOf()<e.timestamp+604800&&"object"==typeof e.supportTests)return e.supportTests}catch(e){}return null}();if(!n){if("undefined"!=typeof Worker&&"undefined"!=typeof OffscreenCanvas&&"undefined"!=typeof URL&&URL.createObjectURL&&"undefined"!=typeof Blob)try{var e="postMessage("+f.toString()+"("+[JSON.stringify(s),u.toString(),p.toString()].join(",")+"));",r=new Blob([e],{type:"text/javascript"}),a=new Worker(URL.createObjectURL(r),{name:"wpTestEmojiSupports"});return void(a.onmessage=function(e){c(n=e.data),a.terminate(),t(n)})}catch(e){}c(n=f(s,u,p))}t(n)}).then(function(e){for(var t in e)n.supports[t]=e[t],n.supports.everything=n.supports.everything&&n.supports[t],"flag"!==t&&(n.supports.everythingExceptFlag=n.supports.everythingExceptFlag&&n.supports[t]);n.supports.everythingExceptFlag=n.supports.everythingExceptFlag&&!n.supports.flag,n.DOMReady=!1,n.readyCallback=function(){n.DOMReady=!0}}).then(function(){return e}).then(function(){var e;n.supports.everything||(n.readyCallback(),(e=n.source||{}).concatemoji?t(e.concatemoji):e.wpemoji&&e.twemoji&&(t(e.twemoji),t(e.wpemoji)))}))}((window,document),window._wpemojiSettings);
/* ]]> */
</script>
<style id='wp-emoji-styles-inline-css' type='text/css'>

	img.wp-smiley, img.emoji {
		display: inline !important;
		border: none !important;
		box-shadow: none !important;
		height: 1em !important;
		width: 1em !important;
		margin: 0 0.07em !important;
		vertical-align: -0.1em !important;
		background: none !important;
		padding: 0 !important;
	}
</style>
<link rel='stylesheet' id='wp-block-library-css' href='https://www.quantumrun.com/consulting/wp-includes/css/dist/block-library/style.min.css?ver=6.7.1' type='text/css' media='all' />
<style id='classic-theme-styles-inline-css' type='text/css'>
/*! This file is auto-generated */
.wp-block-button__link{color:#fff;background-color:#32373c;border-radius:9999px;box-shadow:none;text-decoration:none;padding:calc(.667em + 2px) calc(1.333em + 2px);font-size:1.125em}.wp-block-file__button{background:#32373c;color:#fff;text-decoration:none}
</style>
<style id='global-styles-inline-css' type='text/css'>
:root{--wp--preset--aspect-ratio--square: 1;--wp--preset--aspect-ratio--4-3: 4/3;--wp--preset--aspect-ratio--3-4: 3/4;--wp--preset--aspect-ratio--3-2: 3/2;--wp--preset--aspect-ratio--2-3: 2/3;--wp--preset--aspect-ratio--16-9: 16/9;--wp--preset--aspect-ratio--9-16: 9/16;--wp--preset--color--black: #000000;--wp--preset--color--cyan-bluish-gray: #abb8c3;--wp--preset--color--white: #ffffff;--wp--preset--color--pale-pink: #f78da7;--wp--preset--color--vivid-red: #cf2e2e;--wp--preset--color--luminous-vivid-orange: #ff6900;--wp--preset--color--luminous-vivid-amber: #fcb900;--wp--preset--color--light-green-cyan: #7bdcb5;--wp--preset--color--vivid-green-cyan: #00d084;--wp--preset--color--pale-cyan-blue: #8ed1fc;--wp--preset--color--vivid-cyan-blue: #0693e3;--wp--preset--color--vivid-purple: #9b51e0;--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple: linear-gradient(135deg,rgba(6,147,227,1) 0%,rgb(155,81,224) 100%);--wp--preset--gradient--light-green-cyan-to-vivid-green-cyan: linear-gradient(135deg,rgb(122,220,180) 0%,rgb(0,208,130) 100%);--wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange: linear-gradient(135deg,rgba(252,185,0,1) 0%,rgba(255,105,0,1) 100%);--wp--preset--gradient--luminous-vivid-orange-to-vivid-red: linear-gradient(135deg,rgba(255,105,0,1) 0%,rgb(207,46,46) 100%);--wp--preset--gradient--very-light-gray-to-cyan-bluish-gray: linear-gradient(135deg,rgb(238,238,238) 0%,rgb(169,184,195) 100%);--wp--preset--gradient--cool-to-warm-spectrum: linear-gradient(135deg,rgb(74,234,220) 0%,rgb(151,120,209) 20%,rgb(207,42,186) 40%,rgb(238,44,130) 60%,rgb(251,105,98) 80%,rgb(254,248,76) 100%);--wp--preset--gradient--blush-light-purple: linear-gradient(135deg,rgb(255,206,236) 0%,rgb(152,150,240) 100%);--wp--preset--gradient--blush-bordeaux: linear-gradient(135deg,rgb(254,205,165) 0%,rgb(254,45,45) 50%,rgb(107,0,62) 100%);--wp--preset--gradient--luminous-dusk: linear-gradient(135deg,rgb(255,203,112) 0%,rgb(199,81,192) 50%,rgb(65,88,208) 100%);--wp--preset--gradient--pale-ocean: linear-gradient(135deg,rgb(255,245,203) 0%,rgb(182,227,212) 50%,rgb(51,167,181) 100%);--wp--preset--gradient--electric-grass: linear-gradient(135deg,rgb(202,248,128) 0%,rgb(113,206,126) 100%);--wp--preset--gradient--midnight: linear-gradient(135deg,rgb(2,3,129) 0%,rgb(40,116,252) 100%);--wp--preset--font-size--small: 13px;--wp--preset--font-size--medium: 20px;--wp--preset--font-size--large: 36px;--wp--preset--font-size--x-large: 42px;--wp--preset--spacing--20: 0.44rem;--wp--preset--spacing--30: 0.67rem;--wp--preset--spacing--40: 1rem;--wp--preset--spacing--50: 1.5rem;--wp--preset--spacing--60: 2.25rem;--wp--preset--spacing--70: 3.38rem;--wp--preset--spacing--80: 5.06rem;--wp--preset--shadow--natural: 6px 6px 9px rgba(0, 0, 0, 0.2);--wp--preset--shadow--deep: 12px 12px 50px rgba(0, 0, 0, 0.4);--wp--preset--shadow--sharp: 6px 6px 0px rgba(0, 0, 0, 0.2);--wp--preset--shadow--outlined: 6px 6px 0px -3px rgba(255, 255, 255, 1), 6px 6px rgba(0, 0, 0, 1);--wp--preset--shadow--crisp: 6px 6px 0px rgba(0, 0, 0, 1);}:where(.is-layout-flex){gap: 0.5em;}:where(.is-layout-grid){gap: 0.5em;}body .is-layout-flex{display: flex;}.is-layout-flex{flex-wrap: wrap;align-items: center;}.is-layout-flex > :is(*, div){margin: 0;}body .is-layout-grid{display: grid;}.is-layout-grid > :is(*, div){margin: 0;}:where(.wp-block-columns.is-layout-flex){gap: 2em;}:where(.wp-block-columns.is-layout-grid){gap: 2em;}:where(.wp-block-post-template.is-layout-flex){gap: 1.25em;}:where(.wp-block-post-template.is-layout-grid){gap: 1.25em;}.has-black-color{color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-color{color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-color{color: var(--wp--preset--color--white) !important;}.has-pale-pink-color{color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-color{color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-color{color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-color{color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-color{color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-color{color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-color{color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-color{color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-color{color: var(--wp--preset--color--vivid-purple) !important;}.has-black-background-color{background-color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-background-color{background-color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-background-color{background-color: var(--wp--preset--color--white) !important;}.has-pale-pink-background-color{background-color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-background-color{background-color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-background-color{background-color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-background-color{background-color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-background-color{background-color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-background-color{background-color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-background-color{background-color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-background-color{background-color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-background-color{background-color: var(--wp--preset--color--vivid-purple) !important;}.has-black-border-color{border-color: var(--wp--preset--color--black) !important;}.has-cyan-bluish-gray-border-color{border-color: var(--wp--preset--color--cyan-bluish-gray) !important;}.has-white-border-color{border-color: var(--wp--preset--color--white) !important;}.has-pale-pink-border-color{border-color: var(--wp--preset--color--pale-pink) !important;}.has-vivid-red-border-color{border-color: var(--wp--preset--color--vivid-red) !important;}.has-luminous-vivid-orange-border-color{border-color: var(--wp--preset--color--luminous-vivid-orange) !important;}.has-luminous-vivid-amber-border-color{border-color: var(--wp--preset--color--luminous-vivid-amber) !important;}.has-light-green-cyan-border-color{border-color: var(--wp--preset--color--light-green-cyan) !important;}.has-vivid-green-cyan-border-color{border-color: var(--wp--preset--color--vivid-green-cyan) !important;}.has-pale-cyan-blue-border-color{border-color: var(--wp--preset--color--pale-cyan-blue) !important;}.has-vivid-cyan-blue-border-color{border-color: var(--wp--preset--color--vivid-cyan-blue) !important;}.has-vivid-purple-border-color{border-color: var(--wp--preset--color--vivid-purple) !important;}.has-vivid-cyan-blue-to-vivid-purple-gradient-background{background: var(--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple) !important;}.has-light-green-cyan-to-vivid-green-cyan-gradient-background{background: var(--wp--preset--gradient--light-green-cyan-to-vivid-green-cyan) !important;}.has-luminous-vivid-amber-to-luminous-vivid-orange-gradient-background{background: var(--wp--preset--gradient--luminous-vivid-amber-to-luminous-vivid-orange) !important;}.has-luminous-vivid-orange-to-vivid-red-gradient-background{background: var(--wp--preset--gradient--luminous-vivid-orange-to-vivid-red) !important;}.has-very-light-gray-to-cyan-bluish-gray-gradient-background{background: var(--wp--preset--gradient--very-light-gray-to-cyan-bluish-gray) !important;}.has-cool-to-warm-spectrum-gradient-background{background: var(--wp--preset--gradient--cool-to-warm-spectrum) !important;}.has-blush-light-purple-gradient-background{background: var(--wp--preset--gradient--blush-light-purple) !important;}.has-blush-bordeaux-gradient-background{background: var(--wp--preset--gradient--blush-bordeaux) !important;}.has-luminous-dusk-gradient-background{background: var(--wp--preset--gradient--luminous-dusk) !important;}.has-pale-ocean-gradient-background{background: var(--wp--preset--gradient--pale-ocean) !important;}.has-electric-grass-gradient-background{background: var(--wp--preset--gradient--electric-grass) !important;}.has-midnight-gradient-background{background: var(--wp--preset--gradient--midnight) !important;}.has-small-font-size{font-size: var(--wp--preset--font-size--small) !important;}.has-medium-font-size{font-size: var(--wp--preset--font-size--medium) !important;}.has-large-font-size{font-size: var(--wp--preset--font-size--large) !important;}.has-x-large-font-size{font-size: var(--wp--preset--font-size--x-large) !important;}
:where(.wp-block-post-template.is-layout-flex){gap: 1.25em;}:where(.wp-block-post-template.is-layout-grid){gap: 1.25em;}
:where(.wp-block-columns.is-layout-flex){gap: 2em;}:where(.wp-block-columns.is-layout-grid){gap: 2em;}
:root :where(.wp-block-pullquote){font-size: 1.5em;line-height: 1.6;}
</style>
<link rel='stylesheet' id='geot-css-css' href='https://www.quantumrun.com/consulting/wp-content/plugins/geotargetingwp/public/css/geotarget-public.min.css?ver=6.7.1' type='text/css' media='all' />
<link rel='stylesheet' id='hello-elementor-css' href='https://www.quantumrun.com/consulting/wp-content/themes/hello-elementor/style.min.css?ver=2.2.0' type='text/css' media='all' />
<link rel='stylesheet' id='hello-elementor-theme-style-css' href='https://www.quantumrun.com/consulting/wp-content/themes/hello-elementor/theme.min.css?ver=2.2.0' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-icons-css' href='https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/lib/eicons/css/elementor-icons.min.css?ver=5.20.0' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-frontend-legacy-css' href='https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/css/frontend-legacy.min.css?ver=3.14.0' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-frontend-css' href='https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/css/frontend.min.css?ver=3.14.0' type='text/css' media='all' />
<link rel='stylesheet' id='swiper-css' href='https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/lib/swiper/css/swiper.min.css?ver=5.3.6' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-post-7-css' href='https://www.quantumrun.com/consulting/wp-content/uploads/elementor/css/post-7.css?ver=1757948180' type='text/css' media='all' />
<link rel='stylesheet' id='powerpack-frontend-css' href='https://www.quantumrun.com/consulting/wp-content/plugins/powerpack-elements/assets/css/min/frontend.min.css?ver=2.9.22' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-pro-css' href='https://www.quantumrun.com/consulting/wp-content/plugins/elementor-pro/assets/css/frontend.min.css?ver=3.15.0' type='text/css' media='all' />
<link rel='stylesheet' id='font-awesome-5-all-css' href='https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/lib/font-awesome/css/all.min.css?ver=3.14.0' type='text/css' media='all' />
<link rel='stylesheet' id='font-awesome-4-shim-css' href='https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/lib/font-awesome/css/v4-shims.min.css?ver=3.14.0' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-global-css' href='https://www.quantumrun.com/consulting/wp-content/uploads/elementor/css/global.css?ver=1757948181' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-post-6635-css' href='https://www.quantumrun.com/consulting/wp-content/uploads/elementor/css/post-6635.css?ver=1757949180' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-post-6-css' href='https://www.quantumrun.com/consulting/wp-content/uploads/elementor/css/post-6.css?ver=1757948181' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-post-20-css' href='https://www.quantumrun.com/consulting/wp-content/uploads/elementor/css/post-20.css?ver=1757948182' type='text/css' media='all' />
<link rel='stylesheet' id='google-fonts-1-css' href='https://fonts.googleapis.com/css?family=Abel%3A100%2C100italic%2C200%2C200italic%2C300%2C300italic%2C400%2C400italic%2C500%2C500italic%2C600%2C600italic%2C700%2C700italic%2C800%2C800italic%2C900%2C900italic%7CLato%3A100%2C100italic%2C200%2C200italic%2C300%2C300italic%2C400%2C400italic%2C500%2C500italic%2C600%2C600italic%2C700%2C700italic%2C800%2C800italic%2C900%2C900italic%7CPoppins%3A100%2C100italic%2C200%2C200italic%2C300%2C300italic%2C400%2C400italic%2C500%2C500italic%2C600%2C600italic%2C700%2C700italic%2C800%2C800italic%2C900%2C900italic&#038;display=auto&#038;ver=6.7.1' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-icons-shared-0-css' href='https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/lib/font-awesome/css/fontawesome.min.css?ver=5.15.3' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-icons-fa-solid-css' href='https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/lib/font-awesome/css/solid.min.css?ver=5.15.3' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-icons-fa-brands-css' href='https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/lib/font-awesome/css/brands.min.css?ver=5.15.3' type='text/css' media='all' />
<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin><script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/google-analytics-for-wordpress/assets/js/frontend-gtag.min.js?ver=8.23.1" id="monsterinsights-frontend-script-js"></script>
<script data-cfasync="false" data-wpfc-render="false" type="text/javascript" id='monsterinsights-frontend-script-js-extra'>/* <![CDATA[ */
var monsterinsights_frontend = {"js_events_tracking":"true","download_extensions":"doc,pdf,ppt,zip,xls,docx,pptx,xlsx","inbound_paths":"[{\"path\":\"\\\/go\\\/\",\"label\":\"affiliate\"},{\"path\":\"\\\/recommend\\\/\",\"label\":\"affiliate\"}]","home_url":"https:\/\/www.quantumrun.com\/consulting","hash_tracking":"false","v4_id":"G-7D2TLZ76GB"};/* ]]> */
</script>
<script type="text/javascript" id="jquery-core-js-extra">
/* <![CDATA[ */
var pp = {"ajax_url":"https:\/\/www.quantumrun.com\/consulting\/wp-admin\/admin-ajax.php"};
/* ]]> */
</script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-includes/js/jquery/jquery.min.js?ver=3.7.1" id="jquery-core-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1" id="jquery-migrate-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/lib/font-awesome/js/v4-shims.min.js?ver=3.14.0" id="font-awesome-4-shim-js"></script>
<link rel="https://api.w.org/" href="https://www.quantumrun.com/consulting/wp-json/" /><link rel="alternate" title="JSON" type="application/json" href="https://www.quantumrun.com/consulting/wp-json/wp/v2/pages/6635" /><link rel="EditURI" type="application/rsd+xml" title="RSD" href="https://www.quantumrun.com/consulting/xmlrpc.php?rsd" />
<meta name="generator" content="WordPress 6.7.1" />
<link rel='shortlink' href='https://www.quantumrun.com/consulting/' />
<link rel="alternate" title="oEmbed (JSON)" type="application/json+oembed" href="https://www.quantumrun.com/consulting/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.quantumrun.com%2Fconsulting%2F" />
<link rel="alternate" title="oEmbed (XML)" type="text/xml+oembed" href="https://www.quantumrun.com/consulting/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.quantumrun.com%2Fconsulting%2F&#038;format=xml" />
			<!-- DO NOT COPY THIS SNIPPET! Start of Page Analytics Tracking for HubSpot WordPress plugin v11.3.6-->
			<script class="hsq-set-content-id" data-content-id="standard-page">
				var _hsq = _hsq || [];
				_hsq.push(["setContentType", "standard-page"]);
			</script>
			<!-- DO NOT COPY THIS SNIPPET! End of Page Analytics Tracking for HubSpot WordPress plugin -->
					<script>
			document.documentElement.className = document.documentElement.className.replace( 'no-js', 'js' );
		</script>
				<style>
			.no-js img.lazyload { display: none; }
			figure.wp-block-image img.lazyloading { min-width: 150px; }
							.lazyload, .lazyloading { opacity: 0; }
				.lazyloaded {
					opacity: 1;
					transition: opacity 400ms;
					transition-delay: 0ms;
				}
					</style>
		<meta name="generator" content="Elementor 3.14.0; features: a11y_improvements, additional_custom_breakpoints; settings: css_print_method-external, google_font-enabled, font_display-auto">
<link rel="icon" href="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/hex-fav-01-150x150.png" sizes="32x32" />
<link rel="icon" href="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/hex-fav-01-300x300.png" sizes="192x192" />
<link rel="apple-touch-icon" href="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/hex-fav-01-300x300.png" />
<meta name="msapplication-TileImage" content="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/hex-fav-01-300x300.png" />
		<style type="text/css" id="wp-custom-css">
			.pp-posts-container img {
	height:200px !important
}

.elementor-6635 .elementor-element.elementor-element-41c3a89 .pp-post-content-wrap {

    max-height: 200px;
    height: 200px;
}		</style>
		</head>
<body class="home page-template-default page page-id-6635 wp-custom-logo elementor-default elementor-kit-7 elementor-page elementor-page-6635">

		<div data-elementor-type="header" data-elementor-id="6" class="elementor elementor-6 elementor-location-header" data-elementor-post-type="elementor_library">
					<div class="elementor-section-wrap">
								<section class="elementor-section elementor-top-section elementor-element elementor-element-6131582 elementor-section-height-min-height elementor-section-boxed elementor-section-height-default elementor-section-items-middle" data-id="6131582" data-element_type="section" id="top" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-9d1b7bd mainsearch" data-id="9d1b7bd" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<section class="elementor-section elementor-inner-section elementor-element elementor-element-b447796 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="b447796" data-element_type="section">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-1264fcf" data-id="1264fcf" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-9d0c817 elementor-widget elementor-widget-theme-site-logo elementor-widget-image" data-id="9d0c817" data-element_type="widget" data-widget_type="theme-site-logo.default">
				<div class="elementor-widget-container">
								<div class="elementor-image">
								<a href="https://www.quantumrun.com/consulting">
			<img width="286" height="55"   alt="Quantumrun foresight logo alt" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/cropped-con-logo-00.png" class="attachment-full size-full wp-image-14 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img width="286" height="55"   alt="Quantumrun foresight logo alt" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/cropped-con-logo-00.png" class="attachment-full size-full wp-image-14 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img width="286" height="55"   alt="Quantumrun foresight logo alt" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/cropped-con-logo-00.png" class="attachment-full size-full wp-image-14 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img width="286" height="55" src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/cropped-con-logo-00.png" class="attachment-full size-full wp-image-14" alt="Quantumrun foresight logo alt" /></noscript></noscript></noscript>				</a>
										</div>
						</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-e60bd7a maintransl" data-id="e60bd7a" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<section class="elementor-section elementor-inner-section elementor-element elementor-element-0a29de7 right-header-menu elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="0a29de7" data-element_type="section">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-557ffcd for-platform" data-id="557ffcd" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-1f0cf68 elementor-widget__width-initial elementor-hidden-phone mnbs123 elementor-align-right elementor-widget elementor-widget-button" data-id="1f0cf68" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a class="elementor-button elementor-button-link elementor-size-sm" href="https://www.quantumrun.com/platform">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">FORESIGHT PLATFORM</span>
		</span>
					</a>
		</div>
				</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-a273080" data-id="a273080" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-1763a0c custom_gtranslate elementor-widget elementor-widget-text-editor" data-id="1763a0c" data-element_type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
								<div class="elementor-text-editor elementor-clearfix">
				<div class="gtranslate_wrapper" id="gt-wrapper-65190745"></div>					</div>
						</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-87f6dcd head-search" data-id="87f6dcd" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-d9339d2 elementor-search-form--skin-full_screen elementor-widget__width-initial elementor-widget elementor-widget-search-form" data-id="d9339d2" data-element_type="widget" data-settings="{&quot;skin&quot;:&quot;full_screen&quot;}" data-widget_type="search-form.default">
				<div class="elementor-widget-container">
					<form class="elementor-search-form" action="https://www.quantumrun.com/consulting" method="get" role="search">
									<div class="elementor-search-form__toggle" tabindex="0" role="button">
				<i aria-hidden="true" class="fas fa-search"></i>				<span class="elementor-screen-only">Search</span>
			</div>
						<div class="elementor-search-form__container">
				<label class="elementor-screen-only" for="elementor-search-form-d9339d2">Search</label>

				
				<input id="elementor-search-form-d9339d2" placeholder="Search..." class="elementor-search-form__input" type="search" name="s" value="">
				
				
								<div class="dialog-lightbox-close-button dialog-close-button" role="button" tabindex="0">
					<i aria-hidden="true" class="eicon-close"></i>					<span class="elementor-screen-only">Close this search box.</span>
				</div>
							</div>
		</form>
				</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-25 elementor-inner-column elementor-element elementor-element-e3a88e9" data-id="e3a88e9" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-381b9ac elementor-widget__width-auto elementor-widget elementor-widget-pp-advanced-menu" data-id="381b9ac" data-element_type="widget" data-settings="{&quot;layout&quot;:&quot;vertical&quot;,&quot;menu_type&quot;:&quot;off-canvas&quot;,&quot;expanded_submenu&quot;:&quot;no&quot;,&quot;show_submenu_on&quot;:&quot;hover&quot;,&quot;submenu_icon&quot;:{&quot;value&quot;:&quot;&lt;i class=\&quot;fas fa-caret-down\&quot;&gt;&lt;\/i&gt;&quot;,&quot;library&quot;:&quot;fa-solid&quot;},&quot;onepage_menu&quot;:&quot;no&quot;,&quot;toggle&quot;:&quot;icon&quot;,&quot;toggle_icon_type&quot;:&quot;hamburger&quot;}" data-widget_type="pp-advanced-menu.default">
				<div class="elementor-widget-container">
			
				<div class="pp-advanced-menu-main-wrapper pp-advanced-menu__align-left pp-advanced-menu--dropdown-all pp-advanced-menu--type-off-canvas pp-advanced-menu__text-align- pp-advanced-menu--toggle pp-advanced-menu--icon">
											<div class="pp-menu-toggle pp-menu-toggle-on-all">
											<div class="pp-hamburger">
							<div class="pp-hamburger-box">
																	<div class="pp-hamburger-inner"></div>
															</div>
						</div>
														</div>
												<nav class="pp-advanced-menu--dropdown pp-menu-style-toggle pp-advanced-menu__container pp-menu-381b9ac pp-menu-off-canvas pp-menu-off-canvas-left" data-settings="{&quot;menu_id&quot;:&quot;381b9ac&quot;,&quot;breakpoint&quot;:&quot;all&quot;,&quot;full_width&quot;:false}">
									<div class="pp-menu-close-wrap">
						<div class="pp-menu-close"></div>
					</div>
												<ul id="menu-main-menu-1" class="pp-advanced-menu sm-vertical"><li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-1161"><a href="https://www.quantumrun.com/consulting/services" class="pp-menu-item">Consulting services</a>
<ul class="sub-menu pp-advanced-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-7872"><a href="https://www.quantumrun.com/consulting/services" class="pp-sub-item">View all services</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-7856"><a href="https://www.quantumrun.com/consulting/business-ideation/" class="pp-sub-item">Business ideation</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-7678"><a href="https://www.quantumrun.com/consulting/futurist-speakers-keynote/" class="pp-sub-item">Futurist speakers</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-606"><a href="https://www.quantumrun.com/consulting/service/foresight-workshops/" class="pp-sub-item">Foresight workshops</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13909"><a href="https://www.quantumrun.com/consulting/virtual-foresight-researcher/" class="pp-sub-item">Virtual foresight researcher</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-9766"><a href="https://www.quantumrun.com/consulting/branded-content" class="pp-sub-item">Content partnerships</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-605"><a href="https://www.quantumrun.com/consulting/service/corporate-forecast-reports/" class="pp-sub-item">Corporate foresight reports</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-610"><a href="https://www.quantumrun.com/consulting/service/policy-foresight/" class="pp-sub-item">Policy foresight</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-7424"><a href="https://www.quantumrun.com/consulting/service/trend-scanning/" class="pp-sub-item">Trend scanning</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-609"><a href="https://www.quantumrun.com/consulting/service/internal-foresight-department/" class="pp-sub-item">Internal foresight department</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-611"><a href="https://www.quantumrun.com/consulting/service/scifi-visioning/" class="pp-sub-item">SciFi visioning</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-607"><a href="https://www.quantumrun.com/consulting/service/forecast-monitoring/" class="pp-sub-item">Forecast monitoring</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-9822"><a href="https://www.quantumrun.com/consulting/client-industries/" class="pp-menu-item">Industries we serve</a>
<ul class="sub-menu pp-advanced-menu--dropdown">
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-9824"><a href="https://www.quantumrun.com/consulting/client-industries/" class="pp-sub-item">Industries we serve</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8790"><a href="https://www.quantumrun.com/consulting/aerospace-sector-foresight-services/" class="pp-sub-item">Aerospace sector foresight services</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8635"><a href="https://www.quantumrun.com/consulting/automotive-trend-foresight-services/" class="pp-sub-item">Automotive sector foresight services</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8638"><a href="https://www.quantumrun.com/consulting/banking-sector-foresight-services/" class="pp-sub-item">Banking sector foresight services</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8718"><a href="https://www.quantumrun.com/consulting/consumer-packaged-goods-cpg-foresight-services/" class="pp-sub-item">Consumer Packaged Goods (CPG) foresight services</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8434"><a href="https://www.quantumrun.com/consulting/foresight-services-energy-oil-gas-renewables/" class="pp-sub-item">Energy sector foresight services</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8637"><a href="https://www.quantumrun.com/consulting/insurance-foresight-services/" class="pp-sub-item">Insurance sector foresight services</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8675"><a href="https://www.quantumrun.com/consulting/retail-foresight-services/" class="pp-sub-item">Retail sector foresight services</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8636"><a href="https://www.quantumrun.com/consulting/technology-foresight-services/" class="pp-sub-item">Technology foresight services</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14225"><a href="https://www.quantumrun.com/platform" class="pp-menu-item">Foresight Platform</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-10374"><a href="https://quantumrun.substack.com" class="pp-menu-item">Newsletter</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-13761"><a href="https://www.quantumrun.com/list/trends-report-2024-quantumrun-foresight/155588/2056" class="pp-menu-item">Trend reports</a>
<ul class="sub-menu pp-advanced-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-13762"><a href="https://www.quantumrun.com/list/trends-report-2024-quantumrun-foresight/155588/2056" class="pp-sub-item">2024 Trends Report</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-9049"><a href="https://www.quantumrun.com/list/trends-report-2023-quantumrun-foresight/46710/2297" class="pp-sub-item">2023 Trends Report</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-359"><a href="https://www.quantumrun.com/consulting/methodology/" class="pp-menu-item">Methodology</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-353"><a href="https://www.quantumrun.com/consulting/about-us/" class="pp-menu-item">About Us</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-5238"><a href="https://www.quantumrun.com/consulting/team/" class="pp-menu-item">The team</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-356"><a href="https://www.quantumrun.com/consulting/contact/" class="pp-menu-item">Contact</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-361"><a href="https://www.quantumrun.com/consulting/press/" class="pp-menu-item">Press</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-354"><a href="https://www.quantumrun.com/consulting/careers/" class="pp-menu-item">Careers</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-4861"><a href="https://www.quantumrun.com/consulting/help/" class="pp-menu-item">Platform training and support</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-1873"><a href="https://www.quantumrun.com" class="pp-menu-item">Back to Quantumrun.com</a></li>
</ul>							</nav>
							</div>
						</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="elementor-section elementor-inner-section elementor-element elementor-element-3040949 right-header-menu elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="3040949" data-element_type="section">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-6dae721 for-platform" data-id="6dae721" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-b59b829 elementor-nav-menu__align-left elementor-nav-menu--stretch elementor-widget__width-initial elementor-nav-menu--dropdown-tablet elementor-nav-menu__text-align-aside elementor-nav-menu--toggle elementor-nav-menu--burger elementor-widget elementor-widget-nav-menu" data-id="b59b829" data-element_type="widget" data-settings="{&quot;full_width&quot;:&quot;stretch&quot;,&quot;layout&quot;:&quot;horizontal&quot;,&quot;submenu_icon&quot;:{&quot;value&quot;:&quot;&lt;i class=\&quot;fas fa-caret-down\&quot;&gt;&lt;\/i&gt;&quot;,&quot;library&quot;:&quot;fa-solid&quot;},&quot;toggle&quot;:&quot;burger&quot;}" data-widget_type="nav-menu.default">
				<div class="elementor-widget-container">
						<nav class="elementor-nav-menu--main elementor-nav-menu__container elementor-nav-menu--layout-horizontal e--pointer-none">
				<ul id="menu-1-b59b829" class="elementor-nav-menu"><li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-14480"><a href="https://www.quantumrun.com/consulting/about-us/" class="elementor-item">ABOUT</a>
<ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14481"><a href="https://www.quantumrun.com/consulting/team/" class="elementor-sub-item">TEAM</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-14469"><a href="#" class="elementor-item elementor-item-anchor">TOPICS</a>
<ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14473"><a href="https://www.quantumrun.com/consulting/ai/" class="elementor-sub-item">AI</a></li>
	<li class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-14626"><a href="https://www.quantumrun.com/consulting/demographics/" class="elementor-sub-item">DEMOGRAPHICS</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14471"><a href="#" class="elementor-sub-item elementor-item-anchor">COUNTRY</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14470"><a href="https://www.quantumrun.com/consulting/money/" class="elementor-sub-item">MONEY</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-16900"><a href="https://www.quantumrun.com/consulting/featured/" class="elementor-sub-item">FEATURED</a></li>
	<li class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-14624"><a href="https://www.quantumrun.com/consulting/cryptocurrency/" class="elementor-sub-item">CRYPTOCURRENCY</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-14476"><a href="https://www.quantumrun.com/consulting/business/" class="elementor-sub-item">BUSINESS</a>
	<ul class="sub-menu elementor-nav-menu--dropdown">
		<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14477"><a href="#" class="elementor-sub-item elementor-item-anchor">COMPANIES</a></li>
	</ul>
</li>
</ul>
</li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-14319"><a href="https://www.quantumrun.com/consulting/blog/" class="elementor-item">BLOG</a>
<ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-14715"><a href="https://www.quantumrun.com/consulting/featured/" class="elementor-sub-item">Featured</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14320"><a href="https://www.quantumrun.com/research/assistant" class="elementor-item">RESEARCH AI</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14321"><a href="https://www.quantumrun.com/platform" class="elementor-item">PLATFORM</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14323"><a href="https://quantumrun.substack.com/" class="elementor-item">NEWSLETTER</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14324"><a href="https://www.quantumrun.com/consulting/contact/" class="elementor-item">CONTACT</a></li>
</ul>			</nav>
					<div class="elementor-menu-toggle" role="button" tabindex="0" aria-label="Menu Toggle" aria-expanded="false">
			<i aria-hidden="true" role="presentation" class="elementor-menu-toggle__icon--open eicon-menu-bar"></i><i aria-hidden="true" role="presentation" class="elementor-menu-toggle__icon--close eicon-close"></i>			<span class="elementor-screen-only">Menu</span>
		</div>
					<nav class="elementor-nav-menu--dropdown elementor-nav-menu__container" aria-hidden="true">
				<ul id="menu-2-b59b829" class="elementor-nav-menu"><li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-14480"><a href="https://www.quantumrun.com/consulting/about-us/" class="elementor-item" tabindex="-1">ABOUT</a>
<ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14481"><a href="https://www.quantumrun.com/consulting/team/" class="elementor-sub-item" tabindex="-1">TEAM</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-14469"><a href="#" class="elementor-item elementor-item-anchor" tabindex="-1">TOPICS</a>
<ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14473"><a href="https://www.quantumrun.com/consulting/ai/" class="elementor-sub-item" tabindex="-1">AI</a></li>
	<li class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-14626"><a href="https://www.quantumrun.com/consulting/demographics/" class="elementor-sub-item" tabindex="-1">DEMOGRAPHICS</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14471"><a href="#" class="elementor-sub-item elementor-item-anchor" tabindex="-1">COUNTRY</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14470"><a href="https://www.quantumrun.com/consulting/money/" class="elementor-sub-item" tabindex="-1">MONEY</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-16900"><a href="https://www.quantumrun.com/consulting/featured/" class="elementor-sub-item" tabindex="-1">FEATURED</a></li>
	<li class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-14624"><a href="https://www.quantumrun.com/consulting/cryptocurrency/" class="elementor-sub-item" tabindex="-1">CRYPTOCURRENCY</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-14476"><a href="https://www.quantumrun.com/consulting/business/" class="elementor-sub-item" tabindex="-1">BUSINESS</a>
	<ul class="sub-menu elementor-nav-menu--dropdown">
		<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14477"><a href="#" class="elementor-sub-item elementor-item-anchor" tabindex="-1">COMPANIES</a></li>
	</ul>
</li>
</ul>
</li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-14319"><a href="https://www.quantumrun.com/consulting/blog/" class="elementor-item" tabindex="-1">BLOG</a>
<ul class="sub-menu elementor-nav-menu--dropdown">
	<li class="menu-item menu-item-type-taxonomy menu-item-object-category menu-item-14715"><a href="https://www.quantumrun.com/consulting/featured/" class="elementor-sub-item" tabindex="-1">Featured</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14320"><a href="https://www.quantumrun.com/research/assistant" class="elementor-item" tabindex="-1">RESEARCH AI</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14321"><a href="https://www.quantumrun.com/platform" class="elementor-item" tabindex="-1">PLATFORM</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14323"><a href="https://quantumrun.substack.com/" class="elementor-item" tabindex="-1">NEWSLETTER</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14324"><a href="https://www.quantumrun.com/consulting/contact/" class="elementor-item" tabindex="-1">CONTACT</a></li>
</ul>			</nav>
				</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="elementor-section elementor-top-section elementor-element elementor-element-920d824 elementor-section-height-min-height elementor-hidden-desktop elementor-hidden-tablet elementor-hidden-mobile elementor-section-boxed elementor-section-height-default elementor-section-items-middle" data-id="920d824" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-69af7d5" data-id="69af7d5" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-3f284d8 elementor-widget elementor-widget-theme-site-logo elementor-widget-image" data-id="3f284d8" data-element_type="widget" data-widget_type="theme-site-logo.default">
				<div class="elementor-widget-container">
								<div class="elementor-image">
								<a href="https://www.quantumrun.com/consulting">
			<img width="286" height="55"   alt="Quantumrun foresight logo alt" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/cropped-con-logo-00.png" class="attachment-full size-full wp-image-14 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img width="286" height="55"   alt="Quantumrun foresight logo alt" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/cropped-con-logo-00.png" class="attachment-full size-full wp-image-14 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img width="286" height="55"   alt="Quantumrun foresight logo alt" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/cropped-con-logo-00.png" class="attachment-full size-full wp-image-14 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img width="286" height="55" src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/cropped-con-logo-00.png" class="attachment-full size-full wp-image-14" alt="Quantumrun foresight logo alt" /></noscript></noscript></noscript>				</a>
										</div>
						</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-5623000 elementor-hidden-mobile" data-id="5623000" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-89d78bc elementor-widget__width-auto elementor-hidden-phone mnbs123 elementor-align-right elementor-widget elementor-widget-button" data-id="89d78bc" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a class="elementor-button elementor-button-link elementor-size-sm" href="https://www.quantumrun.com/consulting/platform">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">FORESIGHT PLATFORM</span>
		</span>
					</a>
		</div>
				</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-d57eba1 mainsearch" data-id="d57eba1" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-e2fa097 elementor-search-form--skin-full_screen elementor-widget__width-auto elementor-widget elementor-widget-search-form" data-id="e2fa097" data-element_type="widget" data-settings="{&quot;skin&quot;:&quot;full_screen&quot;}" data-widget_type="search-form.default">
				<div class="elementor-widget-container">
					<form class="elementor-search-form" action="https://www.quantumrun.com/consulting" method="get" role="search">
									<div class="elementor-search-form__toggle" tabindex="0" role="button">
				<i aria-hidden="true" class="fas fa-search"></i>				<span class="elementor-screen-only">Search</span>
			</div>
						<div class="elementor-search-form__container">
				<label class="elementor-screen-only" for="elementor-search-form-e2fa097">Search</label>

				
				<input id="elementor-search-form-e2fa097" placeholder="Search..." class="elementor-search-form__input" type="search" name="s" value="">
				
				
								<div class="dialog-lightbox-close-button dialog-close-button" role="button" tabindex="0">
					<i aria-hidden="true" class="eicon-close"></i>					<span class="elementor-screen-only">Close this search box.</span>
				</div>
							</div>
		</form>
				</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-e0f545a maintransl" data-id="e0f545a" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-eff425d elementor-widget elementor-widget-text-editor" data-id="eff425d" data-element_type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
								<div class="elementor-text-editor elementor-clearfix">
				<div class="gtranslate_wrapper" id="gt-wrapper-61583527"></div>					</div>
						</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-fb26d5e search" data-id="fb26d5e" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-f1e8e3c elementor-widget__width-auto elementor-widget elementor-widget-pp-advanced-menu" data-id="f1e8e3c" data-element_type="widget" data-settings="{&quot;layout&quot;:&quot;vertical&quot;,&quot;menu_type&quot;:&quot;off-canvas&quot;,&quot;expanded_submenu&quot;:&quot;no&quot;,&quot;show_submenu_on&quot;:&quot;hover&quot;,&quot;submenu_icon&quot;:{&quot;value&quot;:&quot;&lt;i class=\&quot;fas fa-caret-down\&quot;&gt;&lt;\/i&gt;&quot;,&quot;library&quot;:&quot;fa-solid&quot;},&quot;onepage_menu&quot;:&quot;no&quot;,&quot;toggle&quot;:&quot;icon&quot;,&quot;toggle_icon_type&quot;:&quot;hamburger&quot;}" data-widget_type="pp-advanced-menu.default">
				<div class="elementor-widget-container">
			
				<div class="pp-advanced-menu-main-wrapper pp-advanced-menu__align- pp-advanced-menu--dropdown-all pp-advanced-menu--type-off-canvas pp-advanced-menu__text-align- pp-advanced-menu--toggle pp-advanced-menu--icon">
											<div class="pp-menu-toggle pp-menu-toggle-on-all">
											<div class="pp-hamburger">
							<div class="pp-hamburger-box">
																	<div class="pp-hamburger-inner"></div>
															</div>
						</div>
														</div>
												<nav class="pp-advanced-menu--dropdown pp-menu-style-toggle pp-advanced-menu__container pp-menu-f1e8e3c pp-menu-off-canvas pp-menu-off-canvas-left" data-settings="{&quot;menu_id&quot;:&quot;f1e8e3c&quot;,&quot;breakpoint&quot;:&quot;all&quot;,&quot;full_width&quot;:false}">
									<div class="pp-menu-close-wrap">
						<div class="pp-menu-close"></div>
					</div>
												<ul id="menu-main-menu-3" class="pp-advanced-menu sm-vertical"><li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-1161"><a href="https://www.quantumrun.com/consulting/services" class="pp-menu-item">Consulting services</a>
<ul class="sub-menu pp-advanced-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-7872"><a href="https://www.quantumrun.com/consulting/services" class="pp-sub-item">View all services</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-7856"><a href="https://www.quantumrun.com/consulting/business-ideation/" class="pp-sub-item">Business ideation</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-7678"><a href="https://www.quantumrun.com/consulting/futurist-speakers-keynote/" class="pp-sub-item">Futurist speakers</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-606"><a href="https://www.quantumrun.com/consulting/service/foresight-workshops/" class="pp-sub-item">Foresight workshops</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-13909"><a href="https://www.quantumrun.com/consulting/virtual-foresight-researcher/" class="pp-sub-item">Virtual foresight researcher</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-9766"><a href="https://www.quantumrun.com/consulting/branded-content" class="pp-sub-item">Content partnerships</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-605"><a href="https://www.quantumrun.com/consulting/service/corporate-forecast-reports/" class="pp-sub-item">Corporate foresight reports</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-610"><a href="https://www.quantumrun.com/consulting/service/policy-foresight/" class="pp-sub-item">Policy foresight</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-7424"><a href="https://www.quantumrun.com/consulting/service/trend-scanning/" class="pp-sub-item">Trend scanning</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-609"><a href="https://www.quantumrun.com/consulting/service/internal-foresight-department/" class="pp-sub-item">Internal foresight department</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-611"><a href="https://www.quantumrun.com/consulting/service/scifi-visioning/" class="pp-sub-item">SciFi visioning</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-607"><a href="https://www.quantumrun.com/consulting/service/forecast-monitoring/" class="pp-sub-item">Forecast monitoring</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-9822"><a href="https://www.quantumrun.com/consulting/client-industries/" class="pp-menu-item">Industries we serve</a>
<ul class="sub-menu pp-advanced-menu--dropdown">
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-9824"><a href="https://www.quantumrun.com/consulting/client-industries/" class="pp-sub-item">Industries we serve</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8790"><a href="https://www.quantumrun.com/consulting/aerospace-sector-foresight-services/" class="pp-sub-item">Aerospace sector foresight services</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8635"><a href="https://www.quantumrun.com/consulting/automotive-trend-foresight-services/" class="pp-sub-item">Automotive sector foresight services</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8638"><a href="https://www.quantumrun.com/consulting/banking-sector-foresight-services/" class="pp-sub-item">Banking sector foresight services</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8718"><a href="https://www.quantumrun.com/consulting/consumer-packaged-goods-cpg-foresight-services/" class="pp-sub-item">Consumer Packaged Goods (CPG) foresight services</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8434"><a href="https://www.quantumrun.com/consulting/foresight-services-energy-oil-gas-renewables/" class="pp-sub-item">Energy sector foresight services</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8637"><a href="https://www.quantumrun.com/consulting/insurance-foresight-services/" class="pp-sub-item">Insurance sector foresight services</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8675"><a href="https://www.quantumrun.com/consulting/retail-foresight-services/" class="pp-sub-item">Retail sector foresight services</a></li>
	<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-8636"><a href="https://www.quantumrun.com/consulting/technology-foresight-services/" class="pp-sub-item">Technology foresight services</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-14225"><a href="https://www.quantumrun.com/platform" class="pp-menu-item">Foresight Platform</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-10374"><a href="https://quantumrun.substack.com" class="pp-menu-item">Newsletter</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children menu-item-13761"><a href="https://www.quantumrun.com/list/trends-report-2024-quantumrun-foresight/155588/2056" class="pp-menu-item">Trend reports</a>
<ul class="sub-menu pp-advanced-menu--dropdown">
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-13762"><a href="https://www.quantumrun.com/list/trends-report-2024-quantumrun-foresight/155588/2056" class="pp-sub-item">2024 Trends Report</a></li>
	<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-9049"><a href="https://www.quantumrun.com/list/trends-report-2023-quantumrun-foresight/46710/2297" class="pp-sub-item">2023 Trends Report</a></li>
</ul>
</li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-359"><a href="https://www.quantumrun.com/consulting/methodology/" class="pp-menu-item">Methodology</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-353"><a href="https://www.quantumrun.com/consulting/about-us/" class="pp-menu-item">About Us</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-5238"><a href="https://www.quantumrun.com/consulting/team/" class="pp-menu-item">The team</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-356"><a href="https://www.quantumrun.com/consulting/contact/" class="pp-menu-item">Contact</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-361"><a href="https://www.quantumrun.com/consulting/press/" class="pp-menu-item">Press</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-354"><a href="https://www.quantumrun.com/consulting/careers/" class="pp-menu-item">Careers</a></li>
<li class="menu-item menu-item-type-post_type menu-item-object-page menu-item-4861"><a href="https://www.quantumrun.com/consulting/help/" class="pp-menu-item">Platform training and support</a></li>
<li class="menu-item menu-item-type-custom menu-item-object-custom menu-item-1873"><a href="https://www.quantumrun.com" class="pp-menu-item">Back to Quantumrun.com</a></li>
</ul>							</nav>
							</div>
						</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
							</div>
				</div>
		
<main class="site-main post-6635 page type-page status-publish has-post-thumbnail hentry" role="main">
		<div class="page-content">
				<div data-elementor-type="wp-page" data-elementor-id="6635" class="elementor elementor-6635" data-elementor-post-type="page">
						<div class="elementor-inner">
				<div class="elementor-section-wrap">
									<section class="elementor-section elementor-top-section elementor-element elementor-element-7cff1d1 elementor-section-height-min-height elementor-section-boxed elementor-section-height-default elementor-section-items-middle" data-id="7cff1d1" data-element_type="section" id="quantumrun-foresight" data-settings="{&quot;background_background&quot;:&quot;video&quot;,&quot;background_video_link&quot;:&quot;https:\/\/www.quantumrun.com\/consulting\/wp-content\/uploads\/2022\/06\/qfp_h1.mp4&quot;,&quot;background_play_on_mobile&quot;:&quot;yes&quot;}">
								<div class="elementor-background-video-container">
													<video class="elementor-background-video-hosted elementor-html5-video" autoplay muted playsinline loop></video>
											</div>
									<div class="elementor-background-overlay"></div>
							<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-5c39a68" data-id="5c39a68" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-bba1f14 elementor-hidden-desktop elementor-hidden-tablet elementor-hidden-mobile elementor-widget elementor-widget-heading" data-id="bba1f14" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h1 class="elementor-heading-title elementor-size-small">Quantumrun Foresight - Thrive from future trends.</h1>		</div>
				</div>
				<section class="elementor-section elementor-inner-section elementor-element elementor-element-a368110 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="a368110" data-element_type="section">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-971f28d" data-id="971f28d" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-775a6e8 elementor-widget elementor-widget-heading" data-id="775a6e8" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">We help clients<br>thrive from<br>future trends</h2>		</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-c5c18c4 elementor-hidden-mobile" data-id="c5c18c4" data-element_type="column">
			<div class="elementor-column-wrap">
							<div class="elementor-widget-wrap">
								</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="elementor-section elementor-inner-section elementor-element elementor-element-27b9512 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="27b9512" data-element_type="section">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-18a143f" data-id="18a143f" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-8ccf356 elementor-widget elementor-widget-heading" data-id="8ccf356" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<p class="elementor-heading-title elementor-size-default">Helping your team use strategic foresight and innovation management  to create future-ready business and policy solutions.</p>		</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-8e902c3 elementor-hidden-mobile" data-id="8e902c3" data-element_type="column">
			<div class="elementor-column-wrap">
							<div class="elementor-widget-wrap">
								</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<div class="elementor-element elementor-element-c5e20a5 elementor-widget__width-auto elementor-mobile-align-justify elementor-widget-mobile__width-inherit elementor-widget elementor-widget-button" data-id="c5e20a5" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a class="elementor-button elementor-button-link elementor-size-sm" href="https://www.quantumrun.com/platform">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">TRENDS PLATFORM</span>
		</span>
					</a>
		</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-61ae22c elementor-widget__width-auto elementor-mobile-align-justify elementor-widget-mobile__width-inherit elementor-widget elementor-widget-button" data-id="61ae22c" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a class="elementor-button elementor-button-link elementor-size-sm" href="https://www.quantumrun.com/consulting/services">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">CONSULTING SERVICES</span>
		</span>
					</a>
		</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-adbde7e elementor-widget__width-auto elementor-mobile-align-justify elementor-widget-mobile__width-inherit elementor-widget elementor-widget-button" data-id="adbde7e" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a class="elementor-button elementor-button-link elementor-size-sm" href="#homepage-contact">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">SCHEDULE MEETING</span>
		</span>
					</a>
		</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-3cc6d33 elementor-widget elementor-widget-heading" data-id="3cc6d33" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">Trusted by research, strategy, innovation, and market insights teams worldwide</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-4570db7 e-transform e-transform elementor-widget elementor-widget-pp-logo-carousel" data-id="4570db7" data-element_type="widget" data-settings="{&quot;items&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:6,&quot;sizes&quot;:[]},&quot;margin&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:20,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:0,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:-30,&quot;sizes&quot;:[]},&quot;_transform_scale_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:0.6,&quot;sizes&quot;:[]},&quot;items_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:2,&quot;sizes&quot;:[]},&quot;items_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:1,&quot;sizes&quot;:[]},&quot;margin_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:10,&quot;sizes&quot;:[]},&quot;margin_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:10,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_scale_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_scale_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]}}" data-widget_type="pp-logo-carousel.default">
				<div class="elementor-widget-container">
					<div class="swiper-container-wrap">
			<div class="pp-logo-carousel pp-swiper-slider swiper-container" data-pagination=".swiper-pagination-4570db7" data-arrow-next=".swiper-button-next-4570db7" data-arrow-prev=".swiper-button-prev-4570db7" data-slider-settings="{&quot;direction&quot;:&quot;horizontal&quot;,&quot;speed&quot;:400,&quot;effect&quot;:&quot;slide&quot;,&quot;slidesPerView&quot;:6,&quot;spaceBetween&quot;:20,&quot;grabCursor&quot;:false,&quot;autoHeight&quot;:true,&quot;loop&quot;:true,&quot;autoplay&quot;:{&quot;delay&quot;:2000,&quot;disableOnInteraction&quot;:false},&quot;breakpoints&quot;:{&quot;1025&quot;:{&quot;slidesPerView&quot;:6,&quot;spaceBetween&quot;:20},&quot;768&quot;:{&quot;slidesPerView&quot;:2,&quot;spaceBetween&quot;:10},&quot;320&quot;:{&quot;slidesPerView&quot;:1,&quot;spaceBetween&quot;:10}}}">
				<div class="swiper-wrapper">
											<div class="swiper-slide">
								<div class="pp-lc-logo-wrap">
									<div class="pp-lc-logo">
																						<img decoding="async"  alt="L&#039;OrÃ©al Logo" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2023/08/LOreal-Logo.png" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><noscript><img decoding="async" src="https://www.quantumrun.com/consulting/wp-content/uploads/2023/08/LOreal-Logo.png" alt="L&#039;OrÃ©al Logo"></noscript>
																					</div>
																			<h4 class="pp-logo-carousel-title">
										Loreal										</h4>
																		</div>
							</div>
														<div class="swiper-slide">
								<div class="pp-lc-logo-wrap">
									<div class="pp-lc-logo">
																						<img decoding="async"  alt="British Red Cross Logo2" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2023/03/British-Red-Cross-Logo2.png" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><noscript><img decoding="async" src="https://www.quantumrun.com/consulting/wp-content/uploads/2023/03/British-Red-Cross-Logo2.png" alt="British Red Cross Logo2"></noscript>
																					</div>
																			<h4 class="pp-logo-carousel-title">
										Red cross										</h4>
																		</div>
							</div>
														<div class="swiper-slide">
								<div class="pp-lc-logo-wrap">
									<div class="pp-lc-logo">
																						<img decoding="async"  alt="Walmart Logo2" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2023/03/Walmart-Logo2.png" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><noscript><img decoding="async" src="https://www.quantumrun.com/consulting/wp-content/uploads/2023/03/Walmart-Logo2.png" alt="Walmart Logo2"></noscript>
																					</div>
																			<h4 class="pp-logo-carousel-title">
										walmart										</h4>
																		</div>
							</div>
														<div class="swiper-slide">
								<div class="pp-lc-logo-wrap">
									<div class="pp-lc-logo">
																						<img decoding="async"  alt="UNICEF Logo2" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2023/03/UNICEF-Logo2.png" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><noscript><img decoding="async" src="https://www.quantumrun.com/consulting/wp-content/uploads/2023/03/UNICEF-Logo2.png" alt="UNICEF Logo2"></noscript>
																					</div>
																			<h4 class="pp-logo-carousel-title">
										unicef										</h4>
																		</div>
							</div>
														<div class="swiper-slide">
								<div class="pp-lc-logo-wrap">
									<div class="pp-lc-logo">
																						<img decoding="async"  alt="Kimberly-Clark Logo2" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2023/03/Kimberly-Clark-Logo2.png" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><noscript><img decoding="async" src="https://www.quantumrun.com/consulting/wp-content/uploads/2023/03/Kimberly-Clark-Logo2.png" alt="Kimberly-Clark Logo2"></noscript>
																					</div>
																			<h4 class="pp-logo-carousel-title">
										Kimberly										</h4>
																		</div>
							</div>
														<div class="swiper-slide">
								<div class="pp-lc-logo-wrap">
									<div class="pp-lc-logo">
																						<img decoding="async"  alt="AbbVie Logo3" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2023/03/AbbVie-Logo3.png" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><noscript><img decoding="async" src="https://www.quantumrun.com/consulting/wp-content/uploads/2023/03/AbbVie-Logo3.png" alt="AbbVie Logo3"></noscript>
																					</div>
																			<h4 class="pp-logo-carousel-title">
										abbvie										</h4>
																		</div>
							</div>
											</div>
			</div>
					</div>
				</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="elementor-section elementor-top-section elementor-element elementor-element-09c90f7 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="09c90f7" data-element_type="section" data-settings="{&quot;background_motion_fx_translateY_effect&quot;:&quot;yes&quot;,&quot;background_motion_fx_translateY_direction&quot;:&quot;negative&quot;,&quot;background_motion_fx_translateY_speed&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:10,&quot;sizes&quot;:[]},&quot;background_motion_fx_opacity_effect&quot;:&quot;yes&quot;,&quot;background_motion_fx_opacity_level&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:15,&quot;sizes&quot;:[]},&quot;background_motion_fx_opacity_range&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:0,&quot;end&quot;:100}},&quot;background_motion_fx_translateY_affectedRange&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:0,&quot;end&quot;:100}},&quot;background_motion_fx_opacity_direction&quot;:&quot;out-in&quot;,&quot;background_motion_fx_devices&quot;:[&quot;desktop&quot;,&quot;tablet&quot;,&quot;mobile&quot;]}">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-cc78688" data-id="cc78688" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-dd27f63 elementor-hidden-phone e-transform e-transform elementor-widget elementor-widget-image" data-id="dd27f63" data-element_type="widget" data-settings="{&quot;motion_fx_motion_fx_scrolling&quot;:&quot;yes&quot;,&quot;motion_fx_translateY_speed&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:8,&quot;sizes&quot;:[]},&quot;motion_fx_translateY_affectedRange&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:28,&quot;end&quot;:55}},&quot;motion_fx_translateY_effect&quot;:&quot;yes&quot;,&quot;motion_fx_translateY_direction&quot;:&quot;negative&quot;,&quot;motion_fx_rotateZ_effect&quot;:&quot;yes&quot;,&quot;motion_fx_rotateZ_speed&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:2,&quot;sizes&quot;:[]},&quot;motion_fx_rotateZ_affectedRange&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:55,&quot;end&quot;:95}},&quot;motion_fx_scale_effect&quot;:&quot;yes&quot;,&quot;motion_fx_scale_range&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:55,&quot;end&quot;:95}},&quot;motion_fx_devices&quot;:[&quot;desktop&quot;,&quot;tablet&quot;],&quot;motion_fx_scale_direction&quot;:&quot;out-in&quot;,&quot;motion_fx_scale_speed&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:4,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateX_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_translateY_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_scale_effect&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_scale_effect_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]},&quot;_transform_scale_effect_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]}}" data-widget_type="image.default">
				<div class="elementor-widget-container">
								<div class="elementor-image">
												<img fetchpriority="high" decoding="async" width="800" height="914"   alt="Quantumrun purple hexagon 2" data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/img-side-invert-purp.png 800w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/img-side-invert-purp-263x300.png 263w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/img-side-invert-purp-768x877.png 768w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/img-side-invert-purp.png" data-sizes="(max-width: 800px) 100vw, 800px" class="attachment-large size-large wp-image-86 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img fetchpriority="high" decoding="async" width="800" height="914" src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/img-side-invert-purp.png" class="attachment-large size-large wp-image-86" alt="Quantumrun purple hexagon 2" srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/img-side-invert-purp.png 800w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/img-side-invert-purp-263x300.png 263w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/img-side-invert-purp-768x877.png 768w" sizes="(max-width: 800px) 100vw, 800px" /></noscript>														</div>
						</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-ad865f7" data-id="ad865f7" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-41dc2c6 elementor-widget elementor-widget-text-editor" data-id="41dc2c6" data-element_type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
								<div class="elementor-text-editor elementor-clearfix">
				<p>Quantumrun Foresight believes understanding future trends will help your organization make better decisions today.</p>					</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-7fe7fd2 elementor-widget elementor-widget-text-editor" data-id="7fe7fd2" data-element_type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
								<div class="elementor-text-editor elementor-clearfix">
				<p>Companies that actively invest in foresight capabilities experience:</p>					</div>
						</div>
				</div>
				<section class="elementor-section elementor-inner-section elementor-element elementor-element-940ce55 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="940ce55" data-element_type="section">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-922f0af" data-id="922f0af" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-92d8e52 elementor-widget elementor-widget-pp-counter" data-id="92d8e52" data-element_type="widget" data-widget_type="pp-counter.default">
				<div class="elementor-widget-container">
					<div class="pp-counter-container">
			<div class="pp-counter pp-counter-92d8e52 pp-counter-layout-1" data-target=".pp-counter-number-92d8e52">
									
					<div class="pp-counter-number-title-wrap">
								<div class="pp-counter-number-wrap">
						<div class="pp-counter-number pp-counter-number-92d8e52" data-from="0" data-to="33" data-speed="1500" data-separator="yes" data-separator-char="">
				0			</div>
							<span class="pp-counter-number-suffix">
					%				</span>
						</div>
		
						
									<div class="pp-counter-title-wrap">
									<div class="pp-counter-title">
						Greater average profitability 					</div>
								</div>
								</div>
							</div>
		</div>
				</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-42b13c8" data-id="42b13c8" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-a02eeee elementor-widget elementor-widget-pp-counter" data-id="a02eeee" data-element_type="widget" data-widget_type="pp-counter.default">
				<div class="elementor-widget-container">
					<div class="pp-counter-container">
			<div class="pp-counter pp-counter-a02eeee pp-counter-layout-1" data-target=".pp-counter-number-a02eeee">
									
					<div class="pp-counter-number-title-wrap">
								<div class="pp-counter-number-wrap">
						<div class="pp-counter-number pp-counter-number-a02eeee" data-from="0" data-to="200" data-speed="1500" data-separator="yes" data-separator-char="">
				0			</div>
							<span class="pp-counter-number-suffix">
					%				</span>
						</div>
		
						
									<div class="pp-counter-title-wrap">
									<div class="pp-counter-title">
						Higher average growth rates					</div>
								</div>
								</div>
							</div>
		</div>
				</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="pp-bg-effects pp-bg-effects-5ac2a9f elementor-section elementor-top-section elementor-element elementor-element-5ac2a9f pp-bg-effects-yes elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-section-id="5ac2a9f" data-effect-enable="yes" data-animation-type="particles" data-canvas-opacity="1" data-hide-max-width="1025" data-hide-min-width="768" data-part-color="" data-line-color="" data-line-h-color="" data-part-opacity="" data-rand-opacity="" data-quantity="" data-part-size="" data-part-speed="" data-part-direction="none" data-hover-effect="noeffect" data-hover-size="" data-id="5ac2a9f" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;,&quot;pp_background_effects_enable&quot;:&quot;yes&quot;,&quot;shape_divider_top&quot;:&quot;tilt&quot;,&quot;shape_divider_bottom&quot;:&quot;tilt&quot;,&quot;effect_hide_tablet&quot;:&quot;hide&quot;}">
					<div class="elementor-shape elementor-shape-top" data-negative="false">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
	<path class="elementor-shape-fill" d="M0,6V0h1000v100L0,6z"/>
</svg>		</div>
				<div class="elementor-shape elementor-shape-bottom" data-negative="false">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none">
	<path class="elementor-shape-fill" d="M0,6V0h1000v100L0,6z"/>
</svg>		</div>
					<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-171ac0f" data-id="171ac0f" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<section class="elementor-section elementor-inner-section elementor-element elementor-element-1a342ea elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="1a342ea" data-element_type="section">
						<div class="elementor-container elementor-column-gap-no">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-4ac3a5a" data-id="4ac3a5a" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-db5fcaf elementor-widget elementor-widget-heading" data-id="db5fcaf" data-element_type="widget" id="Reasons" data-settings="{&quot;motion_fx_motion_fx_scrolling&quot;:&quot;yes&quot;,&quot;motion_fx_opacity_effect&quot;:&quot;yes&quot;,&quot;motion_fx_opacity_range&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:25,&quot;end&quot;:50}},&quot;motion_fx_translateX_effect&quot;:&quot;yes&quot;,&quot;motion_fx_translateX_direction&quot;:&quot;negative&quot;,&quot;motion_fx_translateX_speed&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:2,&quot;sizes&quot;:[]},&quot;motion_fx_translateX_affectedRange&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:0,&quot;end&quot;:50}},&quot;motion_fx_devices&quot;:[&quot;desktop&quot;,&quot;tablet&quot;],&quot;motion_fx_opacity_direction&quot;:&quot;out-in&quot;,&quot;motion_fx_opacity_level&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:10,&quot;sizes&quot;:[]}}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">Reasons clients invest in our foresight and innovation management services</h2>		</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-341f634" data-id="341f634" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-0f77ebc elementor-mobile-align-center elementor-align-right elementor-hidden-tablet elementor-hidden-mobile elementor-widget__width-initial elementor-widget elementor-widget-button" data-id="0f77ebc" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a class="elementor-button elementor-button-link elementor-size-md" href="#connect">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">Schedule a call</span>
		</span>
					</a>
		</div>
				</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="elementor-section elementor-inner-section elementor-element elementor-element-1ff0564 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="1ff0564" data-element_type="section">
						<div class="elementor-container elementor-column-gap-no">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-6ae3faf" data-id="6ae3faf" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-3a7bae9 elementor-position-left elementor-vertical-align-top elementor-widget elementor-widget-image-box" data-id="3a7bae9" data-element_type="widget" data-widget_type="image-box.default">
				<div class="elementor-widget-container">
			<div class="elementor-image-box-wrapper"><figure class="elementor-image-box-img"><img decoding="async" width="385" height="385"   alt="" data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-3-01.png 385w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-3-01-300x300.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-3-01-150x150.png 150w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-3-01.png" data-sizes="(max-width: 385px) 100vw, 385px" class="elementor-animation-grow-rotate attachment-full size-full wp-image-1372 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="385" height="385" src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-3-01.png" class="elementor-animation-grow-rotate attachment-full size-full wp-image-1372" alt="" srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-3-01.png 385w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-3-01-300x300.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-3-01-150x150.png 150w" sizes="(max-width: 385px) 100vw, 385px" /></noscript></figure><div class="elementor-image-box-content"><h3 class="elementor-image-box-title">Product ideation</h3><p class="elementor-image-box-description">Collect inspiration from future trends to design new products, services, policies, and business models your organization can invest in today.</p></div></div>		</div>
				</div>
				<div class="elementor-element elementor-element-7edef45 elementor-position-left elementor-vertical-align-top elementor-widget elementor-widget-image-box" data-id="7edef45" data-element_type="widget" data-widget_type="image-box.default">
				<div class="elementor-widget-container">
			<div class="elementor-image-box-wrapper"><figure class="elementor-image-box-img"><img decoding="async" width="378" height="385"   alt="" data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/foresight-reports-icon-w.png 378w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/foresight-reports-icon-w-295x300.png 295w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/foresight-reports-icon-w.png" data-sizes="(max-width: 378px) 100vw, 378px" class="elementor-animation-grow-rotate attachment-full size-full wp-image-173 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="378" height="385" src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/foresight-reports-icon-w.png" class="elementor-animation-grow-rotate attachment-full size-full wp-image-173" alt="" srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/foresight-reports-icon-w.png 378w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/foresight-reports-icon-w-295x300.png 295w" sizes="(max-width: 378px) 100vw, 378px" /></noscript></figure><div class="elementor-image-box-content"><h3 class="elementor-image-box-title">Cross-industry market intelligence</h3><p class="elementor-image-box-description">Collect market intelligence about emerging trends happening in industries outside your team's area of expertise that may directly or indirectly impact your organization's operations.</p></div></div>		</div>
				</div>
				<div class="elementor-element elementor-element-ce22751 elementor-position-left elementor-vertical-align-top elementor-widget elementor-widget-image-box" data-id="ce22751" data-element_type="widget" data-widget_type="image-box.default">
				<div class="elementor-widget-container">
			<div class="elementor-image-box-wrapper"><figure class="elementor-image-box-img"><img decoding="async" width="385" height="385"   alt="" data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-4-01.png 385w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-4-01-300x300.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-4-01-150x150.png 150w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-4-01.png" data-sizes="(max-width: 385px) 100vw, 385px" class="elementor-animation-grow-rotate attachment-full size-full wp-image-1371 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="385" height="385" src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-4-01.png" class="elementor-animation-grow-rotate attachment-full size-full wp-image-1371" alt="" srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-4-01.png 385w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-4-01-300x300.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-4-01-150x150.png 150w" sizes="(max-width: 385px) 100vw, 385px" /></noscript></figure><div class="elementor-image-box-content"><h3 class="elementor-image-box-title">Scenario building</h3><p class="elementor-image-box-description">Explore future (five, 10, 20 years+) business scenarios that your organization may operate in and identify actionable strategies for success in these future environments.</p></div></div>		</div>
				</div>
				<div class="elementor-element elementor-element-184bd35 elementor-position-left elementor-vertical-align-top elementor-widget elementor-widget-image-box" data-id="184bd35" data-element_type="widget" data-widget_type="image-box.default">
				<div class="elementor-widget-container">
			<div class="elementor-image-box-wrapper"><figure class="elementor-image-box-img"><img decoding="async" width="106" height="150"   alt="Corporate longevity assessment - white" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/08/icon-longevity-option1-1.svg" class="elementor-animation-grow-rotate attachment-full size-full wp-image-1028 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="106" height="150" src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/08/icon-longevity-option1-1.svg" class="elementor-animation-grow-rotate attachment-full size-full wp-image-1028" alt="Corporate longevity assessment - white" /></noscript></figure><div class="elementor-image-box-content"><h3 class="elementor-image-box-title">Early warning systems</h3><p class="elementor-image-box-description">Establish early warning systems to prepare for market disruptions.</p></div></div>		</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-6d15ed7" data-id="6d15ed7" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-bb47779 elementor-position-left elementor-vertical-align-top elementor-widget elementor-widget-image-box" data-id="bb47779" data-element_type="widget" data-widget_type="image-box.default">
				<div class="elementor-widget-container">
			<div class="elementor-image-box-wrapper"><figure class="elementor-image-box-img"><img decoding="async" width="385" height="385"   alt="" data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-2-01.png 385w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-2-01-300x300.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-2-01-150x150.png 150w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-2-01.png" data-sizes="(max-width: 385px) 100vw, 385px" class="elementor-animation-grow-rotate attachment-full size-full wp-image-1373 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="385" height="385" src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-2-01.png" class="elementor-animation-grow-rotate attachment-full size-full wp-image-1373" alt="" srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-2-01.png 385w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-2-01-300x300.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-2-01-150x150.png 150w" sizes="(max-width: 385px) 100vw, 385px" /></noscript></figure><div class="elementor-image-box-content"><h3 class="elementor-image-box-title">Strategic planning & policy development</h3><p class="elementor-image-box-description">Identify future solutions to complex present-day challenges. Use these insights to implement inventive policies and action plans in the present day.</p></div></div>		</div>
				</div>
				<div class="elementor-element elementor-element-7296774 elementor-position-left elementor-vertical-align-top elementor-widget elementor-widget-image-box" data-id="7296774" data-element_type="widget" data-widget_type="image-box.default">
				<div class="elementor-widget-container">
			<div class="elementor-image-box-wrapper"><figure class="elementor-image-box-img"><img decoding="async" width="106" height="150"   alt="" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/08/scifi-1.svg" class="elementor-animation-grow-rotate attachment-full size-full wp-image-1041 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="106" height="150" src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/08/scifi-1.svg" class="elementor-animation-grow-rotate attachment-full size-full wp-image-1041" alt="" /></noscript></figure><div class="elementor-image-box-content"><h3 class="elementor-image-box-title">Tech and startup scouting</h3><p class="elementor-image-box-description">Research the technologies and startups/partners necessary to build and launch a future business idea or a future expansion strategy for a target market.</p></div></div>		</div>
				</div>
				<div class="elementor-element elementor-element-4d97970 elementor-position-left elementor-vertical-align-top elementor-widget elementor-widget-image-box" data-id="4d97970" data-element_type="widget" data-widget_type="image-box.default">
				<div class="elementor-widget-container">
			<div class="elementor-image-box-wrapper"><figure class="elementor-image-box-img"><img decoding="async" width="385" height="385"   alt="" data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-1-01.png 385w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-1-01-300x300.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-1-01-150x150.png 150w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-1-01.png" data-sizes="(max-width: 385px) 100vw, 385px" class="elementor-animation-grow-rotate attachment-full size-full wp-image-1374 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="385" height="385" src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-1-01.png" class="elementor-animation-grow-rotate attachment-full size-full wp-image-1374" alt="" srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-1-01.png 385w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-1-01-300x300.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2020/09/methodology-icon-1-01-150x150.png 150w" sizes="(max-width: 385px) 100vw, 385px" /></noscript></figure><div class="elementor-image-box-content"><h3 class="elementor-image-box-title">Funding prioritization</h3><p class="elementor-image-box-description">Use scenario-building exercises to identify research priorities, plan science and technology funding, and plan large public expenditures that could have long-term consequences (e.g., infrastructure).</p></div></div>		</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="elementor-section elementor-top-section elementor-element elementor-element-a156cc0 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="a156cc0" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-5269810" data-id="5269810" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-7f9b071 elementor-widget elementor-widget-html" data-id="7f9b071" data-element_type="widget" data-widget_type="html.default">
				<div class="elementor-widget-container">
			<iframe  width="480" height="320" style="border:1px solid #EEE; background:white;" frameborder="0" scrolling="no" data-src="https://quantumrun.substack.com/embed" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></iframe>		</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="elementor-section elementor-top-section elementor-element elementor-element-4052919 elementor-section-height-min-height elementor-section-boxed elementor-section-height-default elementor-section-items-middle" data-id="4052919" data-element_type="section" id="Platform" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
							<div class="elementor-background-overlay"></div>
							<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-f88b117" data-id="f88b117" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<section class="elementor-section elementor-inner-section elementor-element elementor-element-4f7b7e5 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="4f7b7e5" data-element_type="section">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-076919f" data-id="076919f" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-ecf0523 elementor-mobile-align-left elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="ecf0523" data-element_type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
					<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="fas fa-chevron-right"></i>						</span>
										<span class="elementor-icon-list-text">Automated academic research.</span>
									</li>
								<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="fas fa-chevron-right"></i>						</span>
										<span class="elementor-icon-list-text">Customized trend intelligence.</span>
									</li>
						</ul>
				</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-ce5431c" data-id="ce5431c" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-ce78dbc elementor-mobile-align-left elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="ce78dbc" data-element_type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
					<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="fas fa-chevron-right"></i>						</span>
										<span class="elementor-icon-list-text">Collaborative research curation.</span>
									</li>
								<li class="elementor-icon-list-item">
											<span class="elementor-icon-list-icon">
							<i aria-hidden="true" class="fas fa-chevron-right"></i>						</span>
										<span class="elementor-icon-list-text">Insightful research visualization.</span>
									</li>
						</ul>
				</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<div class="elementor-element elementor-element-0a232fe elementor-hidden-mobile elementor-widget elementor-widget-heading" data-id="0a232fe" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">All integrated inside the</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-c35c24f elementor-widget elementor-widget-heading" data-id="c35c24f" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">Quantumrun Platform.</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-9159e9d elementor-widget__width-auto elementor-mobile-align-justify elementor-widget-mobile__width-inherit elementor-widget elementor-widget-button" data-id="9159e9d" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a class="elementor-button elementor-button-link elementor-size-sm" href="https://www.quantumrun.com/platform">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">PLATFORM DETAILS</span>
		</span>
					</a>
		</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-e0ca803 elementor-widget__width-auto elementor-mobile-align-justify elementor-widget-mobile__width-inherit elementor-widget elementor-widget-button" data-id="e0ca803" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a class="elementor-button elementor-button-link elementor-size-sm" href="https://www.quantumrun.com/consulting/platform-pricing/">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">SUBSCRIPTION PLANS</span>
		</span>
					</a>
		</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-463932b elementor-widget__width-auto elementor-mobile-align-justify elementor-widget-mobile__width-inherit elementor-widget elementor-widget-button" data-id="463932b" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a class="elementor-button elementor-button-link elementor-size-sm" href="https://www.quantumrun.com/company-register">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">START TRIAL</span>
		</span>
					</a>
		</div>
				</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-391cadd" data-id="391cadd" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-d8522c8 elementor-widget elementor-widget-image" data-id="d8522c8" data-element_type="widget" data-widget_type="image.default">
				<div class="elementor-widget-container">
								<div class="elementor-image">
													<a href="#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjQ3MTMiLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D">
							<img decoding="async" width="800" height="800"   alt="" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/icon-play-bt.svg" class="attachment-large size-large wp-image-6903 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="800" height="800"   alt="" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/icon-play-bt.svg" class="attachment-large size-large wp-image-6903 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="800" height="800" src="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/icon-play-bt.svg" class="attachment-large size-large wp-image-6903" alt="" /></noscript></noscript>								</a>
														</div>
						</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="pp-bg-effects pp-bg-effects-0556b99 elementor-section elementor-top-section elementor-element elementor-element-0556b99 pp-bg-effects-yes elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-section-id="0556b99" data-effect-enable="yes" data-animation-type="particles" data-canvas-opacity="1" data-hide-max-width="none" data-hide-min-width="none" data-part-color="#E0E0E0" data-line-color="#EFEFEF" data-line-h-color="" data-part-opacity="" data-rand-opacity="" data-quantity="" data-part-size="" data-part-speed="" data-part-direction="none" data-hover-effect="noeffect" data-hover-size="" data-id="0556b99" data-element_type="section" data-settings="{&quot;pp_background_effects_enable&quot;:&quot;yes&quot;,&quot;effect_hide_tablet&quot;:&quot;label_off&quot;,&quot;effect_hide_mobile&quot;:&quot;label_off&quot;}">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-7d98280" data-id="7d98280" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-39bf568 elementor-widget elementor-widget-heading" data-id="39bf568" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">Blog</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-41c3a89 pp-equal-height-yes elementor-grid-3 elementor-grid-tablet-2 elementor-grid-mobile-1 elementor-widget elementor-widget-pp-posts" data-id="41c3a89" data-element_type="widget" data-widget_type="pp-posts.overlap">
				<div class="elementor-widget-container">
					<div class="pp-posts-container">
			
										
			<div class="pp-posts pp-posts-skin-overlap elementor-grid pp-posts-grid" data-query-type="custom" data-layout="grid" data-page="6635" data-skin="overlap">
											<div class="pp-post-wrap pp-grid-item-wrap elementor-grid-item post-17051 post type-post status-publish format-standard has-post-thumbnail hentry category-ai">
						<div class="pp-post pp-grid-item">
						<div class="pp-post-thumbnail">
			<a href="https://www.quantumrun.com/consulting/pubmedbert-statistics/" title="PubMedBERT Statistics"><img decoding="async" width="944" height="1024"   alt="PubMedBERT biomedical language model with 522,159 monthly downloads, 110 million parameters, and 82.91 BLURB benchmark score." data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/PubMedBERT-Statistics-e1766236578385.png 944w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/PubMedBERT-Statistics-e1766236578385-277x300.png 277w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/PubMedBERT-Statistics-e1766236578385-768x833.png 768w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/PubMedBERT-Statistics-e1766236578385.png" data-sizes="(max-width: 944px) 100vw, 944px" class="attachment-2048x2048 size-2048x2048 wp-image-17053 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="944" height="1024" src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/PubMedBERT-Statistics-e1766236578385.png" class="attachment-2048x2048 size-2048x2048 wp-image-17053" alt="PubMedBERT biomedical language model with 522,159 monthly downloads, 110 million parameters, and 82.91 BLURB benchmark score." srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/PubMedBERT-Statistics-e1766236578385.png 944w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/PubMedBERT-Statistics-e1766236578385-277x300.png 277w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/PubMedBERT-Statistics-e1766236578385-768x833.png 768w" sizes="(max-width: 944px) 100vw, 944px" /></noscript></a>				<div class="pp-post-terms-wrap">
			<span class="pp-post-terms">
				<span class="pp-post-term"><a href="https://www.quantumrun.com/consulting/ai/">AI</a></span>			</span>
		</div>
						</div>

		
				<div class="pp-post-content-wrap">
					<div class="pp-post-content">
												<h3 class="pp-post-title">
				<a href="https://www.quantumrun.com/consulting/pubmedbert-statistics/">PubMedBERT Statistics</a>			</h3>
									<div class="pp-post-meta">
								<span class="pp-post-date">
						<span class="pp-meta-text">
				December 20, 2025			</span>
		</span>
		<span class="pp-meta-separator"></span>
							</div>
								</div>
									</div>
			</div>
					</div>
				<div class="pp-post-wrap pp-grid-item-wrap elementor-grid-item post-17047 post type-post status-publish format-standard has-post-thumbnail hentry category-gaming">
						<div class="pp-post pp-grid-item">
						<div class="pp-post-thumbnail">
			<a href="https://www.quantumrun.com/consulting/gaming-industry-revenue-statistics/" title="Gaming Industry Revenue Statistics"><img decoding="async" width="1328" height="765"   alt="Gaming industry revenue statistics showing $187.7 billion global market with mobile leading at 49% and China generating $94.49 billion." data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Gaming-Industry-Revenue-Statistics-e1766236186534.png 1328w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Gaming-Industry-Revenue-Statistics-e1766236186534-300x173.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Gaming-Industry-Revenue-Statistics-e1766236186534-1024x590.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Gaming-Industry-Revenue-Statistics-e1766236186534-768x442.png 768w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Gaming-Industry-Revenue-Statistics-e1766236186534.png" data-sizes="(max-width: 1328px) 100vw, 1328px" class="attachment-2048x2048 size-2048x2048 wp-image-17049 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="1328" height="765" src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Gaming-Industry-Revenue-Statistics-e1766236186534.png" class="attachment-2048x2048 size-2048x2048 wp-image-17049" alt="Gaming industry revenue statistics showing $187.7 billion global market with mobile leading at 49% and China generating $94.49 billion." srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Gaming-Industry-Revenue-Statistics-e1766236186534.png 1328w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Gaming-Industry-Revenue-Statistics-e1766236186534-300x173.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Gaming-Industry-Revenue-Statistics-e1766236186534-1024x590.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Gaming-Industry-Revenue-Statistics-e1766236186534-768x442.png 768w" sizes="(max-width: 1328px) 100vw, 1328px" /></noscript></a>				<div class="pp-post-terms-wrap">
			<span class="pp-post-terms">
				<span class="pp-post-term"><a href="https://www.quantumrun.com/consulting/gaming/">Gaming</a></span>			</span>
		</div>
						</div>

		
				<div class="pp-post-content-wrap">
					<div class="pp-post-content">
												<h3 class="pp-post-title">
				<a href="https://www.quantumrun.com/consulting/gaming-industry-revenue-statistics/">Gaming Industry Revenue Statistics</a>			</h3>
									<div class="pp-post-meta">
								<span class="pp-post-date">
						<span class="pp-meta-text">
				December 20, 2025			</span>
		</span>
		<span class="pp-meta-separator"></span>
							</div>
								</div>
									</div>
			</div>
					</div>
				<div class="pp-post-wrap pp-grid-item-wrap elementor-grid-item post-17042 post type-post status-publish format-standard has-post-thumbnail hentry category-ai">
						<div class="pp-post pp-grid-item">
						<div class="pp-post-thumbnail">
			<a href="https://www.quantumrun.com/consulting/midjourney-statistics/" title="Midjourney Statistics"><img decoding="async" width="1024" height="916"   alt="Midjourney AI image generator statistics showing 21 million users, $500 million revenue, and 26.8% market share leadership." data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Midjourney-Statistics-e1766151013745.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Midjourney-Statistics-e1766151013745-300x268.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Midjourney-Statistics-e1766151013745-768x687.png 768w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Midjourney-Statistics-e1766151013745.png" data-sizes="(max-width: 1024px) 100vw, 1024px" class="attachment-2048x2048 size-2048x2048 wp-image-17043 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="1024" height="916" src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Midjourney-Statistics-e1766151013745.png" class="attachment-2048x2048 size-2048x2048 wp-image-17043" alt="Midjourney AI image generator statistics showing 21 million users, $500 million revenue, and 26.8% market share leadership." srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Midjourney-Statistics-e1766151013745.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Midjourney-Statistics-e1766151013745-300x268.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Midjourney-Statistics-e1766151013745-768x687.png 768w" sizes="(max-width: 1024px) 100vw, 1024px" /></noscript></a>				<div class="pp-post-terms-wrap">
			<span class="pp-post-terms">
				<span class="pp-post-term"><a href="https://www.quantumrun.com/consulting/ai/">AI</a></span>			</span>
		</div>
						</div>

		
				<div class="pp-post-content-wrap">
					<div class="pp-post-content">
												<h3 class="pp-post-title">
				<a href="https://www.quantumrun.com/consulting/midjourney-statistics/">Midjourney Statistics</a>			</h3>
									<div class="pp-post-meta">
								<span class="pp-post-date">
						<span class="pp-meta-text">
				December 19, 2025			</span>
		</span>
		<span class="pp-meta-separator"></span>
							</div>
								</div>
									</div>
			</div>
					</div>
				<div class="pp-post-wrap pp-grid-item-wrap elementor-grid-item post-17036 post type-post status-publish format-standard has-post-thumbnail hentry category-gaming">
						<div class="pp-post pp-grid-item">
						<div class="pp-post-thumbnail">
			<a href="https://www.quantumrun.com/consulting/sleep-patterns-of-hardcore-gamers-statistics/" title="Sleep Patterns of Hardcore Gamers Statistics"><img decoding="async" width="1330" height="765"   alt="Hardcore gamer sleep statistics showing 92% poor sleep quality, 6-7 hour pro esports sleep averages, and 2.6x higher sleep problem odds." data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/sleep-patterns-of-hardcore-gamers-statistics-e1766150721997.png 1330w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/sleep-patterns-of-hardcore-gamers-statistics-e1766150721997-300x173.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/sleep-patterns-of-hardcore-gamers-statistics-e1766150721997-1024x589.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/sleep-patterns-of-hardcore-gamers-statistics-e1766150721997-768x442.png 768w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/sleep-patterns-of-hardcore-gamers-statistics-e1766150721997.png" data-sizes="(max-width: 1330px) 100vw, 1330px" class="attachment-2048x2048 size-2048x2048 wp-image-17038 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="1330" height="765" src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/sleep-patterns-of-hardcore-gamers-statistics-e1766150721997.png" class="attachment-2048x2048 size-2048x2048 wp-image-17038" alt="Hardcore gamer sleep statistics showing 92% poor sleep quality, 6-7 hour pro esports sleep averages, and 2.6x higher sleep problem odds." srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/sleep-patterns-of-hardcore-gamers-statistics-e1766150721997.png 1330w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/sleep-patterns-of-hardcore-gamers-statistics-e1766150721997-300x173.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/sleep-patterns-of-hardcore-gamers-statistics-e1766150721997-1024x589.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/sleep-patterns-of-hardcore-gamers-statistics-e1766150721997-768x442.png 768w" sizes="(max-width: 1330px) 100vw, 1330px" /></noscript></a>				<div class="pp-post-terms-wrap">
			<span class="pp-post-terms">
				<span class="pp-post-term"><a href="https://www.quantumrun.com/consulting/gaming/">Gaming</a></span>			</span>
		</div>
						</div>

		
				<div class="pp-post-content-wrap">
					<div class="pp-post-content">
												<h3 class="pp-post-title">
				<a href="https://www.quantumrun.com/consulting/sleep-patterns-of-hardcore-gamers-statistics/">Sleep Patterns of Hardcore Gamers Statistics</a>			</h3>
									<div class="pp-post-meta">
								<span class="pp-post-date">
						<span class="pp-meta-text">
				December 19, 2025			</span>
		</span>
		<span class="pp-meta-separator"></span>
							</div>
								</div>
									</div>
			</div>
					</div>
				<div class="pp-post-wrap pp-grid-item-wrap elementor-grid-item post-17028 post type-post status-publish format-standard has-post-thumbnail hentry category-ai">
						<div class="pp-post pp-grid-item">
						<div class="pp-post-thumbnail">
			<a href="https://www.quantumrun.com/consulting/legalbert-statistics/" title="LegalBERT Statistics"><img decoding="async" width="1024" height="932"   alt="LegalBERT legal NLP model with 4.9 million monthly downloads, 110 million parameters, and 79.8% LexGLUE benchmark score." data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/LegalBERT-Statistics-e1766056403213.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/LegalBERT-Statistics-e1766056403213-300x273.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/LegalBERT-Statistics-e1766056403213-768x699.png 768w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/LegalBERT-Statistics-e1766056403213.png" data-sizes="(max-width: 1024px) 100vw, 1024px" class="attachment-2048x2048 size-2048x2048 wp-image-17031 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="1024" height="932" src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/LegalBERT-Statistics-e1766056403213.png" class="attachment-2048x2048 size-2048x2048 wp-image-17031" alt="LegalBERT legal NLP model with 4.9 million monthly downloads, 110 million parameters, and 79.8% LexGLUE benchmark score." srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/LegalBERT-Statistics-e1766056403213.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/LegalBERT-Statistics-e1766056403213-300x273.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/LegalBERT-Statistics-e1766056403213-768x699.png 768w" sizes="(max-width: 1024px) 100vw, 1024px" /></noscript></a>				<div class="pp-post-terms-wrap">
			<span class="pp-post-terms">
				<span class="pp-post-term"><a href="https://www.quantumrun.com/consulting/ai/">AI</a></span>			</span>
		</div>
						</div>

		
				<div class="pp-post-content-wrap">
					<div class="pp-post-content">
												<h3 class="pp-post-title">
				<a href="https://www.quantumrun.com/consulting/legalbert-statistics/">LegalBERT Statistics</a>			</h3>
									<div class="pp-post-meta">
								<span class="pp-post-date">
						<span class="pp-meta-text">
				December 18, 2025			</span>
		</span>
		<span class="pp-meta-separator"></span>
							</div>
								</div>
									</div>
			</div>
					</div>
				<div class="pp-post-wrap pp-grid-item-wrap elementor-grid-item post-17022 post type-post status-publish format-standard has-post-thumbnail hentry category-ai">
						<div class="pp-post pp-grid-item">
						<div class="pp-post-thumbnail">
			<a href="https://www.quantumrun.com/consulting/deepspeech-statistics/" title="DeepSpeech Statistics And Trends 2026"><img decoding="async" width="1024" height="935"   alt="Mozilla DeepSpeech speech recognition with 16,100 GitHub stars, 7.06% word error rate, discontinued June 2025." data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/DeepSpeech-Statistics-e1766056040627.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/DeepSpeech-Statistics-e1766056040627-300x274.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/DeepSpeech-Statistics-e1766056040627-768x701.png 768w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/DeepSpeech-Statistics-e1766056040627.png" data-sizes="(max-width: 1024px) 100vw, 1024px" class="attachment-2048x2048 size-2048x2048 wp-image-17025 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="1024" height="935" src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/DeepSpeech-Statistics-e1766056040627.png" class="attachment-2048x2048 size-2048x2048 wp-image-17025" alt="Mozilla DeepSpeech speech recognition with 16,100 GitHub stars, 7.06% word error rate, discontinued June 2025." srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/DeepSpeech-Statistics-e1766056040627.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/DeepSpeech-Statistics-e1766056040627-300x274.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/DeepSpeech-Statistics-e1766056040627-768x701.png 768w" sizes="(max-width: 1024px) 100vw, 1024px" /></noscript></a>				<div class="pp-post-terms-wrap">
			<span class="pp-post-terms">
				<span class="pp-post-term"><a href="https://www.quantumrun.com/consulting/ai/">AI</a></span>			</span>
		</div>
						</div>

		
				<div class="pp-post-content-wrap">
					<div class="pp-post-content">
												<h3 class="pp-post-title">
				<a href="https://www.quantumrun.com/consulting/deepspeech-statistics/">DeepSpeech Statistics And Trends 2026</a>			</h3>
									<div class="pp-post-meta">
								<span class="pp-post-date">
						<span class="pp-meta-text">
				December 18, 2025			</span>
		</span>
		<span class="pp-meta-separator"></span>
							</div>
								</div>
									</div>
			</div>
					</div>
				<div class="pp-post-wrap pp-grid-item-wrap elementor-grid-item post-17018 post type-post status-publish format-standard has-post-thumbnail hentry category-ai">
						<div class="pp-post pp-grid-item">
						<div class="pp-post-thumbnail">
			<a href="https://www.quantumrun.com/consulting/imagen-statistics/" title="Imagen Statistics And Trends 2026"><img decoding="async" width="1024" height="940"   alt="Google Imagen reaching 650 million users via Gemini with Imagen 4 delivering 10x faster processing in $8.7 billion market." data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Imagen-Statistics-e1765974734281.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Imagen-Statistics-e1765974734281-300x275.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Imagen-Statistics-e1765974734281-768x705.png 768w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Imagen-Statistics-e1765974734281.png" data-sizes="(max-width: 1024px) 100vw, 1024px" class="attachment-2048x2048 size-2048x2048 wp-image-17020 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="1024" height="940" src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Imagen-Statistics-e1765974734281.png" class="attachment-2048x2048 size-2048x2048 wp-image-17020" alt="Google Imagen reaching 650 million users via Gemini with Imagen 4 delivering 10x faster processing in $8.7 billion market." srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Imagen-Statistics-e1765974734281.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Imagen-Statistics-e1765974734281-300x275.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Imagen-Statistics-e1765974734281-768x705.png 768w" sizes="(max-width: 1024px) 100vw, 1024px" /></noscript></a>				<div class="pp-post-terms-wrap">
			<span class="pp-post-terms">
				<span class="pp-post-term"><a href="https://www.quantumrun.com/consulting/ai/">AI</a></span>			</span>
		</div>
						</div>

		
				<div class="pp-post-content-wrap">
					<div class="pp-post-content">
												<h3 class="pp-post-title">
				<a href="https://www.quantumrun.com/consulting/imagen-statistics/">Imagen Statistics And Trends 2026</a>			</h3>
									<div class="pp-post-meta">
								<span class="pp-post-date">
						<span class="pp-meta-text">
				December 17, 2025			</span>
		</span>
		<span class="pp-meta-separator"></span>
							</div>
								</div>
									</div>
			</div>
					</div>
				<div class="pp-post-wrap pp-grid-item-wrap elementor-grid-item post-17013 post type-post status-publish format-standard has-post-thumbnail hentry category-blog">
						<div class="pp-post pp-grid-item">
						<div class="pp-post-thumbnail">
			<a href="https://www.quantumrun.com/consulting/how-to-deploy-hydrogen-gas-detectors-in-refineries-and-electrolyzer-plants/" title="How to Deploy Hydrogen Gas Detectors in Refineries and Electrolyzer Plants"><img decoding="async" width="407" height="299"   alt="How to Deploy Hydrogen Gas Detectors in Refineries and Electrolyzer Plants" data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/How-to-Deploy-Hydrogen-Gas-Detectors-in-Refineries-and-Electrolyzer-Plants.png 407w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/How-to-Deploy-Hydrogen-Gas-Detectors-in-Refineries-and-Electrolyzer-Plants-300x220.png 300w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/How-to-Deploy-Hydrogen-Gas-Detectors-in-Refineries-and-Electrolyzer-Plants.png" data-sizes="(max-width: 407px) 100vw, 407px" class="attachment-2048x2048 size-2048x2048 wp-image-17015 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="407" height="299" src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/How-to-Deploy-Hydrogen-Gas-Detectors-in-Refineries-and-Electrolyzer-Plants.png" class="attachment-2048x2048 size-2048x2048 wp-image-17015" alt="How to Deploy Hydrogen Gas Detectors in Refineries and Electrolyzer Plants" srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/How-to-Deploy-Hydrogen-Gas-Detectors-in-Refineries-and-Electrolyzer-Plants.png 407w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/How-to-Deploy-Hydrogen-Gas-Detectors-in-Refineries-and-Electrolyzer-Plants-300x220.png 300w" sizes="(max-width: 407px) 100vw, 407px" /></noscript></a>				<div class="pp-post-terms-wrap">
			<span class="pp-post-terms">
				<span class="pp-post-term"><a href="https://www.quantumrun.com/consulting/blog/">Blog</a></span>			</span>
		</div>
						</div>

		
				<div class="pp-post-content-wrap">
					<div class="pp-post-content">
												<h3 class="pp-post-title">
				<a href="https://www.quantumrun.com/consulting/how-to-deploy-hydrogen-gas-detectors-in-refineries-and-electrolyzer-plants/">How to Deploy Hydrogen Gas Detectors in Refineries and Electrolyzer Plants</a>			</h3>
									<div class="pp-post-meta">
								<span class="pp-post-date">
						<span class="pp-meta-text">
				December 17, 2025			</span>
		</span>
		<span class="pp-meta-separator"></span>
							</div>
								</div>
									</div>
			</div>
					</div>
				<div class="pp-post-wrap pp-grid-item-wrap elementor-grid-item post-17006 post type-post status-publish format-standard has-post-thumbnail hentry category-blog">
						<div class="pp-post pp-grid-item">
						<div class="pp-post-thumbnail">
			<a href="https://www.quantumrun.com/consulting/best-practices-for-upgrading-legacy-dosing-pumps-in-industrial-plants/" title="Best Practices For Upgrading Legacy Dosing Pumps In Industrial Plants"><img decoding="async" width="612" height="408"   alt="Best Practices For Upgrading Legacy Dosing Pumps In Industrial Plants" data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Best-Practices-For-Upgrading-Legacy-Dosing-Pumps-In-Industrial-Plants.png 612w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Best-Practices-For-Upgrading-Legacy-Dosing-Pumps-In-Industrial-Plants-300x200.png 300w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Best-Practices-For-Upgrading-Legacy-Dosing-Pumps-In-Industrial-Plants.png" data-sizes="(max-width: 612px) 100vw, 612px" class="attachment-2048x2048 size-2048x2048 wp-image-17010 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="612" height="408" src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Best-Practices-For-Upgrading-Legacy-Dosing-Pumps-In-Industrial-Plants.png" class="attachment-2048x2048 size-2048x2048 wp-image-17010" alt="Best Practices For Upgrading Legacy Dosing Pumps In Industrial Plants" srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Best-Practices-For-Upgrading-Legacy-Dosing-Pumps-In-Industrial-Plants.png 612w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Best-Practices-For-Upgrading-Legacy-Dosing-Pumps-In-Industrial-Plants-300x200.png 300w" sizes="(max-width: 612px) 100vw, 612px" /></noscript></a>				<div class="pp-post-terms-wrap">
			<span class="pp-post-terms">
				<span class="pp-post-term"><a href="https://www.quantumrun.com/consulting/blog/">Blog</a></span>			</span>
		</div>
						</div>

		
				<div class="pp-post-content-wrap">
					<div class="pp-post-content">
												<h3 class="pp-post-title">
				<a href="https://www.quantumrun.com/consulting/best-practices-for-upgrading-legacy-dosing-pumps-in-industrial-plants/">Best Practices For Upgrading Legacy Dosing Pumps In Industrial Plants</a>			</h3>
									<div class="pp-post-meta">
								<span class="pp-post-date">
						<span class="pp-meta-text">
				December 17, 2025			</span>
		</span>
		<span class="pp-meta-separator"></span>
							</div>
								</div>
									</div>
			</div>
					</div>
				<div class="pp-post-wrap pp-grid-item-wrap elementor-grid-item post-16995 post type-post status-publish format-standard has-post-thumbnail hentry category-blog">
						<div class="pp-post pp-grid-item">
						<div class="pp-post-thumbnail">
			<a href="https://www.quantumrun.com/consulting/why-agvs-and-amrs-depend-on-high-torque-bldc-motor-drives/" title="Why AGVs and AMRs Depend on High-Torque BLDC Motor Drives"><img decoding="async" width="600" height="407"   alt="Why AGVs and AMRs Depend on High-Torque BLDC Motor Drives" data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Why-AGVs-and-AMRs-Depend-on-High-Torque-BLDC-Motor-Drives.png 600w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Why-AGVs-and-AMRs-Depend-on-High-Torque-BLDC-Motor-Drives-300x204.png 300w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Why-AGVs-and-AMRs-Depend-on-High-Torque-BLDC-Motor-Drives.png" data-sizes="(max-width: 600px) 100vw, 600px" class="attachment-2048x2048 size-2048x2048 wp-image-17003 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="600" height="407" src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Why-AGVs-and-AMRs-Depend-on-High-Torque-BLDC-Motor-Drives.png" class="attachment-2048x2048 size-2048x2048 wp-image-17003" alt="Why AGVs and AMRs Depend on High-Torque BLDC Motor Drives" srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Why-AGVs-and-AMRs-Depend-on-High-Torque-BLDC-Motor-Drives.png 600w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Why-AGVs-and-AMRs-Depend-on-High-Torque-BLDC-Motor-Drives-300x204.png 300w" sizes="(max-width: 600px) 100vw, 600px" /></noscript></a>				<div class="pp-post-terms-wrap">
			<span class="pp-post-terms">
				<span class="pp-post-term"><a href="https://www.quantumrun.com/consulting/blog/">Blog</a></span>			</span>
		</div>
						</div>

		
				<div class="pp-post-content-wrap">
					<div class="pp-post-content">
												<h3 class="pp-post-title">
				<a href="https://www.quantumrun.com/consulting/why-agvs-and-amrs-depend-on-high-torque-bldc-motor-drives/">Why AGVs and AMRs Depend on High-Torque BLDC Motor Drives</a>			</h3>
									<div class="pp-post-meta">
								<span class="pp-post-date">
						<span class="pp-meta-text">
				December 17, 2025			</span>
		</span>
		<span class="pp-meta-separator"></span>
							</div>
								</div>
									</div>
			</div>
					</div>
				<div class="pp-post-wrap pp-grid-item-wrap elementor-grid-item post-16988 post type-post status-publish format-standard has-post-thumbnail hentry category-blog">
						<div class="pp-post pp-grid-item">
						<div class="pp-post-thumbnail">
			<a href="https://www.quantumrun.com/consulting/off-grid-solar-inverters-enabling-resilient-power-systems-for-remote-communities/" title="Off-Grid Solar Inverters: Enabling Resilient Power Systems for Remote Communities"><img decoding="async" width="1024" height="768"   alt="Off-Grid Solar Inverters Enabling Resilient Power Systems for Remote Communities" data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Off-Grid-Solar-Inverters-Enabling-Resilient-Power-Systems-for-Remote-Communities.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Off-Grid-Solar-Inverters-Enabling-Resilient-Power-Systems-for-Remote-Communities-300x225.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Off-Grid-Solar-Inverters-Enabling-Resilient-Power-Systems-for-Remote-Communities-768x576.png 768w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Off-Grid-Solar-Inverters-Enabling-Resilient-Power-Systems-for-Remote-Communities.png" data-sizes="(max-width: 1024px) 100vw, 1024px" class="attachment-2048x2048 size-2048x2048 wp-image-16992 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="1024" height="768" src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Off-Grid-Solar-Inverters-Enabling-Resilient-Power-Systems-for-Remote-Communities.png" class="attachment-2048x2048 size-2048x2048 wp-image-16992" alt="Off-Grid Solar Inverters Enabling Resilient Power Systems for Remote Communities" srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Off-Grid-Solar-Inverters-Enabling-Resilient-Power-Systems-for-Remote-Communities.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Off-Grid-Solar-Inverters-Enabling-Resilient-Power-Systems-for-Remote-Communities-300x225.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Off-Grid-Solar-Inverters-Enabling-Resilient-Power-Systems-for-Remote-Communities-768x576.png 768w" sizes="(max-width: 1024px) 100vw, 1024px" /></noscript></a>				<div class="pp-post-terms-wrap">
			<span class="pp-post-terms">
				<span class="pp-post-term"><a href="https://www.quantumrun.com/consulting/blog/">Blog</a></span>			</span>
		</div>
						</div>

		
				<div class="pp-post-content-wrap">
					<div class="pp-post-content">
												<h3 class="pp-post-title">
				<a href="https://www.quantumrun.com/consulting/off-grid-solar-inverters-enabling-resilient-power-systems-for-remote-communities/">Off-Grid Solar Inverters: Enabling Resilient Power Systems for Remote Communities</a>			</h3>
									<div class="pp-post-meta">
								<span class="pp-post-date">
						<span class="pp-meta-text">
				December 17, 2025			</span>
		</span>
		<span class="pp-meta-separator"></span>
							</div>
								</div>
									</div>
			</div>
					</div>
				<div class="pp-post-wrap pp-grid-item-wrap elementor-grid-item post-16972 post type-post status-publish format-standard has-post-thumbnail hentry category-ai">
						<div class="pp-post pp-grid-item">
						<div class="pp-post-thumbnail">
			<a href="https://www.quantumrun.com/consulting/audiolm-statistics/" title="AudioLM Statistics And User Trends"><img decoding="async" width="1024" height="945"   alt="AudioLM speech synthesis model achieving 51.2% human detection accuracy trained on 60,000 hours of speech data." data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/AudioLM-Statistics-e1765899267305.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/AudioLM-Statistics-e1765899267305-300x277.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/AudioLM-Statistics-e1765899267305-768x709.png 768w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/AudioLM-Statistics-e1765899267305.png" data-sizes="(max-width: 1024px) 100vw, 1024px" class="attachment-2048x2048 size-2048x2048 wp-image-16978 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="1024" height="945" src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/AudioLM-Statistics-e1765899267305.png" class="attachment-2048x2048 size-2048x2048 wp-image-16978" alt="AudioLM speech synthesis model achieving 51.2% human detection accuracy trained on 60,000 hours of speech data." srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/AudioLM-Statistics-e1765899267305.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/AudioLM-Statistics-e1765899267305-300x277.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/AudioLM-Statistics-e1765899267305-768x709.png 768w" sizes="(max-width: 1024px) 100vw, 1024px" /></noscript></a>				<div class="pp-post-terms-wrap">
			<span class="pp-post-terms">
				<span class="pp-post-term"><a href="https://www.quantumrun.com/consulting/ai/">AI</a></span>			</span>
		</div>
						</div>

		
				<div class="pp-post-content-wrap">
					<div class="pp-post-content">
												<h3 class="pp-post-title">
				<a href="https://www.quantumrun.com/consulting/audiolm-statistics/">AudioLM Statistics And User Trends</a>			</h3>
									<div class="pp-post-meta">
								<span class="pp-post-date">
						<span class="pp-meta-text">
				December 16, 2025			</span>
		</span>
		<span class="pp-meta-separator"></span>
							</div>
								</div>
									</div>
			</div>
					</div>
				<div class="pp-post-wrap pp-grid-item-wrap elementor-grid-item post-16970 post type-post status-publish format-standard has-post-thumbnail hentry category-ai">
						<div class="pp-post pp-grid-item">
						<div class="pp-post-thumbnail">
			<a href="https://www.quantumrun.com/consulting/scibert-statistics/" title="SciBERT Statistics And User Trends 2026"><img decoding="async" width="1024" height="944"   alt="SciBERT scientific language model with 338,726 monthly downloads, 3,394 citations, and 87% accuracy on text classification." data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/SciBERT-Statistics-e1765898954214.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/SciBERT-Statistics-e1765898954214-300x277.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/SciBERT-Statistics-e1765898954214-768x708.png 768w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/SciBERT-Statistics-e1765898954214.png" data-sizes="(max-width: 1024px) 100vw, 1024px" class="attachment-2048x2048 size-2048x2048 wp-image-16973 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="1024" height="944" src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/SciBERT-Statistics-e1765898954214.png" class="attachment-2048x2048 size-2048x2048 wp-image-16973" alt="SciBERT scientific language model with 338,726 monthly downloads, 3,394 citations, and 87% accuracy on text classification." srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/SciBERT-Statistics-e1765898954214.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/SciBERT-Statistics-e1765898954214-300x277.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/SciBERT-Statistics-e1765898954214-768x708.png 768w" sizes="(max-width: 1024px) 100vw, 1024px" /></noscript></a>				<div class="pp-post-terms-wrap">
			<span class="pp-post-terms">
				<span class="pp-post-term"><a href="https://www.quantumrun.com/consulting/ai/">AI</a></span>			</span>
		</div>
						</div>

		
				<div class="pp-post-content-wrap">
					<div class="pp-post-content">
												<h3 class="pp-post-title">
				<a href="https://www.quantumrun.com/consulting/scibert-statistics/">SciBERT Statistics And User Trends 2026</a>			</h3>
									<div class="pp-post-meta">
								<span class="pp-post-date">
						<span class="pp-meta-text">
				December 16, 2025			</span>
		</span>
		<span class="pp-meta-separator"></span>
							</div>
								</div>
									</div>
			</div>
					</div>
				<div class="pp-post-wrap pp-grid-item-wrap elementor-grid-item post-16949 post type-post status-publish format-standard has-post-thumbnail hentry category-social-media">
						<div class="pp-post pp-grid-item">
						<div class="pp-post-thumbnail">
			<a href="https://www.quantumrun.com/consulting/tiktok-users/" title="TikTok Users Statistics 2026"><img decoding="async" width="1024" height="944"   alt="TikTok statistics showing 1.59 billion monthly users, $23 billion revenue in 2024, and 52 minutes average daily usage." data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/TikTok-Users-e1765814217661.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/TikTok-Users-e1765814217661-300x277.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/TikTok-Users-e1765814217661-768x708.png 768w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/TikTok-Users-e1765814217661.png" data-sizes="(max-width: 1024px) 100vw, 1024px" class="attachment-2048x2048 size-2048x2048 wp-image-16951 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="1024" height="944" src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/TikTok-Users-e1765814217661.png" class="attachment-2048x2048 size-2048x2048 wp-image-16951" alt="TikTok statistics showing 1.59 billion monthly users, $23 billion revenue in 2024, and 52 minutes average daily usage." srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/TikTok-Users-e1765814217661.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/TikTok-Users-e1765814217661-300x277.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/TikTok-Users-e1765814217661-768x708.png 768w" sizes="(max-width: 1024px) 100vw, 1024px" /></noscript></a>				<div class="pp-post-terms-wrap">
			<span class="pp-post-terms">
				<span class="pp-post-term"><a href="https://www.quantumrun.com/consulting/social-media/">Social Media</a></span>			</span>
		</div>
						</div>

		
				<div class="pp-post-content-wrap">
					<div class="pp-post-content">
												<h3 class="pp-post-title">
				<a href="https://www.quantumrun.com/consulting/tiktok-users/">TikTok Users Statistics 2026</a>			</h3>
									<div class="pp-post-meta">
								<span class="pp-post-date">
						<span class="pp-meta-text">
				December 15, 2025			</span>
		</span>
		<span class="pp-meta-separator"></span>
							</div>
								</div>
									</div>
			</div>
					</div>
				<div class="pp-post-wrap pp-grid-item-wrap elementor-grid-item post-16963 post type-post status-publish format-standard has-post-thumbnail hentry category-ai">
						<div class="pp-post pp-grid-item">
						<div class="pp-post-thumbnail">
			<a href="https://www.quantumrun.com/consulting/wav2vec-2-0-statistics/" title="Wav2Vec 2.0 Statistics And User 2026"><img decoding="async" width="1024" height="947"   alt="Wav2Vec 2.0 speech recognition model with 1.87 million monthly downloads, 1.8% word error rate, and 128 language support." data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Wav2Vec-2.0-Statistics-e1765898370783.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Wav2Vec-2.0-Statistics-e1765898370783-300x277.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Wav2Vec-2.0-Statistics-e1765898370783-768x710.png 768w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Wav2Vec-2.0-Statistics-e1765898370783.png" data-sizes="(max-width: 1024px) 100vw, 1024px" class="attachment-2048x2048 size-2048x2048 wp-image-16966 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="1024" height="947" src="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Wav2Vec-2.0-Statistics-e1765898370783.png" class="attachment-2048x2048 size-2048x2048 wp-image-16966" alt="Wav2Vec 2.0 speech recognition model with 1.87 million monthly downloads, 1.8% word error rate, and 128 language support." srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Wav2Vec-2.0-Statistics-e1765898370783.png 1024w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Wav2Vec-2.0-Statistics-e1765898370783-300x277.png 300w, https://www.quantumrun.com/consulting/wp-content/uploads/2025/12/Wav2Vec-2.0-Statistics-e1765898370783-768x710.png 768w" sizes="(max-width: 1024px) 100vw, 1024px" /></noscript></a>				<div class="pp-post-terms-wrap">
			<span class="pp-post-terms">
				<span class="pp-post-term"><a href="https://www.quantumrun.com/consulting/ai/">AI</a></span>			</span>
		</div>
						</div>

		
				<div class="pp-post-content-wrap">
					<div class="pp-post-content">
												<h3 class="pp-post-title">
				<a href="https://www.quantumrun.com/consulting/wav2vec-2-0-statistics/">Wav2Vec 2.0 Statistics And User 2026</a>			</h3>
									<div class="pp-post-meta">
								<span class="pp-post-date">
						<span class="pp-meta-text">
				December 15, 2025			</span>
		</span>
		<span class="pp-meta-separator"></span>
							</div>
								</div>
									</div>
			</div>
					</div>
									</div>
			
			
			
			
												</div>

		
				</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="pp-bg-effects pp-bg-effects-4ef82e0 elementor-section elementor-top-section elementor-element elementor-element-4ef82e0 pp-bg-effects-yes elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-section-id="4ef82e0" data-effect-enable="yes" data-animation-type="particles" data-canvas-opacity="1" data-hide-max-width="none" data-hide-min-width="none" data-part-color="#E0E0E0" data-line-color="#EFEFEF" data-line-h-color="" data-part-opacity="" data-rand-opacity="" data-quantity="" data-part-size="" data-part-speed="" data-part-direction="none" data-hover-effect="noeffect" data-hover-size="" data-id="4ef82e0" data-element_type="section" data-settings="{&quot;pp_background_effects_enable&quot;:&quot;yes&quot;,&quot;effect_hide_tablet&quot;:&quot;label_off&quot;,&quot;effect_hide_mobile&quot;:&quot;label_off&quot;}">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-5a1fdff" data-id="5a1fdff" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-9558170 elementor-widget elementor-widget-heading" data-id="9558170" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">CLIENT TESTIMONIALS</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-e698ac5 elementor-testimonial--skin-default elementor-testimonial--layout-image_inline elementor-testimonial--align-center elementor-arrows-yes elementor-pagination-type-bullets elementor-widget elementor-widget-testimonial-carousel" data-id="e698ac5" data-element_type="widget" data-settings="{&quot;slides_per_view&quot;:&quot;2&quot;,&quot;show_arrows&quot;:&quot;yes&quot;,&quot;pagination&quot;:&quot;bullets&quot;,&quot;speed&quot;:500,&quot;autoplay&quot;:&quot;yes&quot;,&quot;autoplay_speed&quot;:5000,&quot;loop&quot;:&quot;yes&quot;,&quot;pause_on_hover&quot;:&quot;yes&quot;,&quot;pause_on_interaction&quot;:&quot;yes&quot;,&quot;space_between&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:10,&quot;sizes&quot;:[]},&quot;space_between_tablet&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:10,&quot;sizes&quot;:[]},&quot;space_between_mobile&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:10,&quot;sizes&quot;:[]}}" data-widget_type="testimonial-carousel.default">
				<div class="elementor-widget-container">
					<div class="elementor-swiper">
			<div class="elementor-main-swiper swiper-container">
				<div class="swiper-wrapper">
											<div class="swiper-slide">
									<div class="elementor-testimonial">
							<div class="elementor-testimonial__content">
					<div class="elementor-testimonial__text">
						The Quantumrun Foresight Platform elevated my department's automotive trend scanning capabilities to new heights. The platform's sophisticated tools has enabled us to stay ahead of the competition and proactively address market shifts. The strategic foresight methodologies introduced by the platform and by Quantumrun's consultants have been instrumental in driving our division's long-term planning and decision-making processes. 					</div>
									</div>
						<div class="elementor-testimonial__footer">
								<cite class="elementor-testimonial__cite"><span class="elementor-testimonial__name">Richard Jaimes<br>Global Head of Automotive Organizational Development and Learning</span><span class="elementor-testimonial__title">Continental</span></cite>			</div>
		</div>
								</div>
											<div class="swiper-slide">
									<div class="elementor-testimonial">
							<div class="elementor-testimonial__content">
					<div class="elementor-testimonial__text">
						Quantumrun's trend platform has been a game-changer for the strategic planning services my team offers to clients. Its powerful trend discovery and analysis features have helped us identify key market shifts and adjust our clients' go-to-market strategy accordingly. The platform's intuitive design and collaborative features have made it an invaluable tool for our team and clients. We've seen a noticeable improvement in our ability to anticipate and adapt to change, thanks to Quantumrun.
					</div>
									</div>
						<div class="elementor-testimonial__footer">
								<cite class="elementor-testimonial__cite"><span class="elementor-testimonial__name">Anders Sorman-Nilsson<br>Managing Director</span><span class="elementor-testimonial__title">Thinque</span></cite>			</div>
		</div>
								</div>
											<div class="swiper-slide">
									<div class="elementor-testimonial">
							<div class="elementor-testimonial__content">
					<div class="elementor-testimonial__text">
						Using the Quantumrun trends platform has given me the ability to scan for industry trends and help identify emerging opportunities. The platform is user-friendly, and the customer service is second to none.					</div>
									</div>
						<div class="elementor-testimonial__footer">
								<cite class="elementor-testimonial__cite"><span class="elementor-testimonial__name">Vipul Dudani<br>Senior Manager Strategic Initiatives</span><span class="elementor-testimonial__title"> Scotiabank</span></cite>			</div>
		</div>
								</div>
											<div class="swiper-slide">
									<div class="elementor-testimonial">
							<div class="elementor-testimonial__content">
					<div class="elementor-testimonial__text">
						The Quantumrun Foresight Platform has transformed the way my team approaches trend scanning and emerging trend identification inside the aviation sector. Its data-driven tools allowed us to stay on top of industry shifts and seize new sales opportunities. The Quantumrun team has also facilitated the integration of strategic foresight methodologies into our department, fostering a proactive and forward-thinking mindset. 					</div>
									</div>
						<div class="elementor-testimonial__footer">
								<cite class="elementor-testimonial__cite"><span class="elementor-testimonial__name">Sr. Regional Business Manager</span><span class="elementor-testimonial__title">Collins Aerospace</span></cite>			</div>
		</div>
								</div>
											<div class="swiper-slide">
									<div class="elementor-testimonial">
							<div class="elementor-testimonial__content">
					<div class="elementor-testimonial__text">
						We've been using the Quantumrun Foresight Platform for the past seven months, and it has been instrumental in driving innovation across our organization. The platform's trend analysis and visualization tools allowed us to identify new opportunities and make data-driven decisions for our US expansion. The user-friendly interface made it easy to onboard our team, and the excellent customer support really helped us get the most out of the platform.
					</div>
									</div>
						<div class="elementor-testimonial__footer">
								<cite class="elementor-testimonial__cite"><span class="elementor-testimonial__name">Nathan + Mark Laurie<br>Co-Presidents</span><span class="elementor-testimonial__title">Passion inc.</span></cite>			</div>
		</div>
								</div>
											<div class="swiper-slide">
									<div class="elementor-testimonial">
							<div class="elementor-testimonial__content">
					<div class="elementor-testimonial__text">
						As a product manager in a competitive B2B marketplace industry, Quantumrun's platform has become indispensable for my team. It offers a wealth of trend insights for the African market, where Plendify is actively expanding. It's also enabling us to make informed decisions about product development and innovation.  With Quantumrun, we feel confident about staying ahead in our industry.					</div>
									</div>
						<div class="elementor-testimonial__footer">
								<cite class="elementor-testimonial__cite"><span class="elementor-testimonial__name">Michael Manirakiza<br>COO & Co-founder</span><span class="elementor-testimonial__title">Plendify</span></cite>			</div>
		</div>
								</div>
											<div class="swiper-slide">
									<div class="elementor-testimonial">
							<div class="elementor-testimonial__content">
					<div class="elementor-testimonial__text">
						We found the team at Quantumrun Foresight to be strong communicators, thorough and innovative researchers, and very thoughtful in their collaboration with CHA stakeholders. The Quantumrun Foresight team assisted us with preliminary research into a future telehealth service and a workforce management solution, both of which have the potential to improve CHAâ€™s status within Coloradoâ€™s healthcare ecosystem.
					</div>
									</div>
						<div class="elementor-testimonial__footer">
								<cite class="elementor-testimonial__cite"><span class="elementor-testimonial__name">Michael Scott<br>President at CHA Financial Advisors</span><span class="elementor-testimonial__title">Colorado Hospital Association</span></cite>			</div>
		</div>
								</div>
									</div>
															<div class="swiper-pagination"></div>
																<div class="elementor-swiper-button elementor-swiper-button-prev" role="button" tabindex="0">
							<i aria-hidden="true" class="eicon-chevron-left"></i>							<span class="elementor-screen-only">Previous</span>
						</div>
						<div class="elementor-swiper-button elementor-swiper-button-next" role="button" tabindex="0">
							<i aria-hidden="true" class="eicon-chevron-right"></i>							<span class="elementor-screen-only">Next</span>
						</div>
												</div>
		</div>
				</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="elementor-section elementor-top-section elementor-element elementor-element-b328e68 elementor-section-height-min-height elementor-section-boxed elementor-section-height-default elementor-section-items-middle" data-id="b328e68" data-element_type="section" id="business-value" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
							<div class="elementor-background-overlay"></div>
							<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-d24ee2f" data-id="d24ee2f" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-04917b0 elementor-widget__width-auto elementor-absolute elementor-hidden-tablet elementor-hidden-mobile elementor-widget elementor-widget-image" data-id="04917b0" data-element_type="widget" data-settings="{&quot;_position&quot;:&quot;absolute&quot;}" data-widget_type="image.default">
				<div class="elementor-widget-container">
								<div class="elementor-image">
												<img decoding="async" width="800" height="928"   alt="" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/hexagon-1.svg" class="attachment-large size-large wp-image-6660 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="800" height="928" src="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/hexagon-1.svg" class="attachment-large size-large wp-image-6660" alt="" /></noscript>														</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-cf4cb74 elementor-widget elementor-widget-image" data-id="cf4cb74" data-element_type="widget" data-widget_type="image.default">
				<div class="elementor-widget-container">
								<div class="elementor-image">
													<a href="#elementor-action%3Aaction%3Dpopup%3Aopen%26settings%3DeyJpZCI6IjY5OTUiLCJ0b2dnbGUiOmZhbHNlfQ%3D%3D">
							<img decoding="async" width="800" height="800"   alt="" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/icon-play-bt.svg" class="attachment-large size-large wp-image-6903 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="800" height="800"   alt="" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/icon-play-bt.svg" class="attachment-large size-large wp-image-6903 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="800" height="800" src="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/icon-play-bt.svg" class="attachment-large size-large wp-image-6903" alt="" /></noscript></noscript>								</a>
														</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-f5e4dd0 elementor-widget__width-auto elementor-absolute elementor-hidden-tablet elementor-hidden-mobile elementor-widget elementor-widget-image" data-id="f5e4dd0" data-element_type="widget" data-settings="{&quot;_position&quot;:&quot;absolute&quot;}" data-widget_type="image.default">
				<div class="elementor-widget-container">
								<div class="elementor-image">
												<img decoding="async" width="800" height="928"   alt="" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/hexagon-2-1.svg" class="attachment-large size-large wp-image-6926 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="800" height="928" src="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/hexagon-2-1.svg" class="attachment-large size-large wp-image-6926" alt="" /></noscript>														</div>
						</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-c78e9b8" data-id="c78e9b8" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-a0cdff9 elementor-widget elementor-widget-heading" data-id="a0cdff9" data-element_type="widget" data-settings="{&quot;motion_fx_motion_fx_scrolling&quot;:&quot;yes&quot;,&quot;motion_fx_translateY_effect&quot;:&quot;yes&quot;,&quot;motion_fx_translateY_speed&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:0.5,&quot;sizes&quot;:[]},&quot;motion_fx_translateY_affectedRange&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:0,&quot;end&quot;:50}},&quot;motion_fx_opacity_effect&quot;:&quot;yes&quot;,&quot;motion_fx_opacity_range&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:20,&quot;end&quot;:50}},&quot;motion_fx_opacity_direction&quot;:&quot;out-in&quot;,&quot;motion_fx_opacity_level&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:10,&quot;sizes&quot;:[]},&quot;motion_fx_devices&quot;:[&quot;desktop&quot;,&quot;tablet&quot;,&quot;mobile&quot;]}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">The business value of strategic foresight</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-a26467c elementor-widget elementor-widget-text-editor" data-id="a26467c" data-element_type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
								<div class="elementor-text-editor elementor-clearfix">
				<p>Our foresight work has kept strategy, innovation, and R&amp;D teams ahead of disruptive market shifts and has contributed to developing innovative products, services, legislation, and business models.</p>					</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-7694e4c elementor-widget__width-auto elementor-absolute elementor-hidden-mobile elementor-widget-tablet__width-initial elementor-widget elementor-widget-image" data-id="7694e4c" data-element_type="widget" data-settings="{&quot;_position&quot;:&quot;absolute&quot;}" data-widget_type="image.default">
				<div class="elementor-widget-container">
								<div class="elementor-image">
												<img decoding="async" width="800" height="944"   alt="" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/hexagon-3.svg" class="attachment-large size-large wp-image-6927 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="800" height="944" src="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/hexagon-3.svg" class="attachment-large size-large wp-image-6927" alt="" /></noscript>														</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-9154db7 elementor-widget__width-auto elementor-mobile-align-justify elementor-widget-mobile__width-inherit elementor-widget elementor-widget-button" data-id="9154db7" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a class="elementor-button elementor-button-link elementor-size-sm" href="https://www.quantumrun.com/consulting/top-reasons-strategic-foresight/">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">TOP REASONS TO USE FORESIGHT</span>
		</span>
					</a>
		</div>
				</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="elementor-section elementor-top-section elementor-element elementor-element-1c24ed5 elementor-section-height-min-height elementor-section-boxed elementor-section-height-default elementor-section-items-middle" data-id="1c24ed5" data-element_type="section" id="speaker" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
							<div class="elementor-background-overlay"></div>
							<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-831ab3a" data-id="831ab3a" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-b9b2db9 elementor-hidden-tablet elementor-hidden-mobile elementor-widget elementor-widget-spacer" data-id="b9b2db9" data-element_type="widget" data-widget_type="spacer.default">
				<div class="elementor-widget-container">
					<div class="elementor-spacer">
			<div class="elementor-spacer-inner"></div>
		</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-40d420c elementor-widget elementor-widget-heading" data-id="40d420c" data-element_type="widget" data-settings="{&quot;motion_fx_motion_fx_scrolling&quot;:&quot;yes&quot;,&quot;motion_fx_translateY_effect&quot;:&quot;yes&quot;,&quot;motion_fx_translateY_speed&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:0.5,&quot;sizes&quot;:[]},&quot;motion_fx_translateY_affectedRange&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:0,&quot;end&quot;:50}},&quot;motion_fx_opacity_effect&quot;:&quot;yes&quot;,&quot;motion_fx_opacity_range&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:20,&quot;end&quot;:60}},&quot;motion_fx_opacity_direction&quot;:&quot;out-in&quot;,&quot;motion_fx_opacity_level&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:10,&quot;sizes&quot;:[]},&quot;motion_fx_devices&quot;:[&quot;desktop&quot;,&quot;tablet&quot;,&quot;mobile&quot;]}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">FEATURED SPEAKER NETWORK</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-b2c2f65 elementor-widget elementor-widget-text-editor" data-id="b2c2f65" data-element_type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
								<div class="elementor-text-editor elementor-clearfix">
				<p>Planning a workshop? Webinar? Conference? Quantumrun Foresightâ€™s featured speaker network will give your employees the mental frameworks and techniques to enhance their long-term strategic thinking and generate new policy and business ideas.</p>					</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-9ddc546 elementor-widget__width-auto elementor-mobile-align-justify elementor-widget-mobile__width-inherit elementor-widget elementor-widget-button" data-id="9ddc546" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a class="elementor-button elementor-button-link elementor-size-sm" href="https://www.quantumrun.com/consulting/futurist-speakers-keynote/">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">KEYNOTE SPEAKERS</span>
		</span>
					</a>
		</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-9645257 elementor-widget__width-auto elementor-mobile-align-justify elementor-widget-mobile__width-inherit elementor-widget elementor-widget-button" data-id="9645257" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a class="elementor-button elementor-button-link elementor-size-sm" href="https://www.quantumrun.com/consulting/service/foresight-workshops">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">WORKSHOPS</span>
		</span>
					</a>
		</div>
				</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-dedefda elementor-hidden-tablet elementor-hidden-mobile" data-id="dedefda" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-5330923 elementor-view-stacked elementor-shape-square elementor-widget__width-auto elementor-fixed elementor-widget elementor-widget-icon" data-id="5330923" data-element_type="widget" data-settings="{&quot;motion_fx_opacity_effect&quot;:&quot;yes&quot;,&quot;motion_fx_opacity_range&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:5,&quot;end&quot;:10}},&quot;_position&quot;:&quot;fixed&quot;,&quot;motion_fx_motion_fx_scrolling&quot;:&quot;yes&quot;,&quot;motion_fx_opacity_direction&quot;:&quot;out-in&quot;,&quot;motion_fx_opacity_level&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:10,&quot;sizes&quot;:[]},&quot;motion_fx_devices&quot;:[&quot;desktop&quot;,&quot;tablet&quot;,&quot;mobile&quot;]}" data-widget_type="icon.default">
				<div class="elementor-widget-container">
					<div class="elementor-icon-wrapper">
			<a class="elementor-icon" href="#top">
			<i aria-hidden="true" class="fas fa-chevron-up"></i>			</a>
		</div>
				</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="pp-bg-effects pp-bg-effects-ee5ced8 elementor-section elementor-top-section elementor-element elementor-element-ee5ced8 elementor-section-height-min-height pp-bg-effects-yes elementor-section-boxed elementor-section-height-default elementor-section-items-middle" data-section-id="ee5ced8" data-effect-enable="yes" data-animation-type="particles" data-canvas-opacity="1" data-hide-max-width="none" data-hide-min-width="none" data-part-color="#A1006A" data-line-color="" data-line-h-color="" data-part-opacity="0.15" data-rand-opacity="1" data-quantity="" data-part-size="" data-part-speed="2" data-part-direction="none" data-hover-effect="noeffect" data-hover-size="" data-id="ee5ced8" data-element_type="section" id="advisory-services" data-settings="{&quot;pp_background_effects_enable&quot;:&quot;yes&quot;,&quot;part_rand_opacity&quot;:&quot;true&quot;,&quot;effect_hide_tablet&quot;:&quot;label_off&quot;,&quot;effect_hide_mobile&quot;:&quot;label_off&quot;}">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-f9cfc00" data-id="f9cfc00" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-da86bf7 elementor-widget elementor-widget-image" data-id="da86bf7" data-element_type="widget" data-widget_type="image.default">
				<div class="elementor-widget-container">
								<div class="elementor-image">
												<img decoding="async" width="772" height="1024"   alt="" data-srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/infographic-advisory-services-2x-772x1024.png 772w, https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/infographic-advisory-services-2x-226x300.png 226w, https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/infographic-advisory-services-2x-768x1019.png 768w, https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/infographic-advisory-services-2x.png 990w"  data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/infographic-advisory-services-2x-772x1024.png" data-sizes="(max-width: 772px) 100vw, 772px" class="attachment-large size-large wp-image-6697 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img decoding="async" width="772" height="1024" src="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/infographic-advisory-services-2x-772x1024.png" class="attachment-large size-large wp-image-6697" alt="" srcset="https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/infographic-advisory-services-2x-772x1024.png 772w, https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/infographic-advisory-services-2x-226x300.png 226w, https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/infographic-advisory-services-2x-768x1019.png 768w, https://www.quantumrun.com/consulting/wp-content/uploads/2022/11/infographic-advisory-services-2x.png 990w" sizes="(max-width: 772px) 100vw, 772px" /></noscript>														</div>
						</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-f881a4f" data-id="f881a4f" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-d94893e elementor-widget elementor-widget-heading" data-id="d94893e" data-element_type="widget" data-settings="{&quot;motion_fx_motion_fx_scrolling&quot;:&quot;yes&quot;,&quot;motion_fx_translateY_effect&quot;:&quot;yes&quot;,&quot;motion_fx_translateY_speed&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:0.5,&quot;sizes&quot;:[]},&quot;motion_fx_translateY_affectedRange&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:0,&quot;end&quot;:50}},&quot;motion_fx_opacity_effect&quot;:&quot;yes&quot;,&quot;motion_fx_opacity_range&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:20,&quot;end&quot;:50}},&quot;motion_fx_opacity_direction&quot;:&quot;out-in&quot;,&quot;motion_fx_opacity_level&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:10,&quot;sizes&quot;:[]},&quot;motion_fx_devices&quot;:[&quot;desktop&quot;,&quot;tablet&quot;,&quot;mobile&quot;]}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">Advisory services</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-c7f9360 elementor-widget elementor-widget-text-editor" data-id="c7f9360" data-element_type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
								<div class="elementor-text-editor elementor-clearfix">
				<p>Apply strategic foresight and innovation management with confidence. Our consultants will guide your team through our list of services to help you achieve forward-thinking business outcomes. </p>					</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-f4f9a4e elementor-widget__width-auto elementor-mobile-align-justify elementor-widget-mobile__width-inherit elementor-widget elementor-widget-button" data-id="f4f9a4e" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a class="elementor-button elementor-button-link elementor-size-sm" href="https://www.quantumrun.com/consulting/services">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">LEARN MORE</span>
		</span>
					</a>
		</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-b28b080 elementor-widget__width-auto elementor-mobile-align-justify elementor-widget-mobile__width-inherit elementor-widget elementor-widget-button" data-id="b28b080" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a class="elementor-button elementor-button-link elementor-size-sm" href="#connect">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">SCHEDULE A MEETING</span>
		</span>
					</a>
		</div>
				</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="elementor-section elementor-top-section elementor-element elementor-element-60910b6 elementor-section-height-min-height elementor-section-boxed elementor-section-height-default elementor-section-items-middle" data-id="60910b6" data-element_type="section" id="foresight-methodology" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
							<div class="elementor-background-overlay"></div>
							<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-be05593" data-id="be05593" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-644cd97 elementor-widget elementor-widget-heading" data-id="644cd97" data-element_type="widget" id="foresight-methodology" data-settings="{&quot;motion_fx_motion_fx_scrolling&quot;:&quot;yes&quot;,&quot;motion_fx_translateY_effect&quot;:&quot;yes&quot;,&quot;motion_fx_translateY_speed&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:0.5,&quot;sizes&quot;:[]},&quot;motion_fx_translateY_affectedRange&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:0,&quot;end&quot;:50}},&quot;motion_fx_opacity_effect&quot;:&quot;yes&quot;,&quot;motion_fx_opacity_range&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:20,&quot;end&quot;:50}},&quot;motion_fx_opacity_direction&quot;:&quot;out-in&quot;,&quot;motion_fx_opacity_level&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:10,&quot;sizes&quot;:[]},&quot;motion_fx_devices&quot;:[&quot;desktop&quot;,&quot;tablet&quot;,&quot;mobile&quot;]}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">Foresight Methodology</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-beee1cc elementor-widget elementor-widget-text-editor" data-id="beee1cc" data-element_type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
								<div class="elementor-text-editor elementor-clearfix">
				<p>Strategic foresight empowers organizations with improved preparedness in challenging market environments. Our analysts and consultants help organizations make more informed decisions to guide their mid to long-term business strategies.</p>					</div>
						</div>
				</div>
				<div class="elementor-element elementor-element-cdddce2 elementor-widget__width-auto elementor-mobile-align-justify elementor-widget-mobile__width-inherit elementor-widget elementor-widget-button" data-id="cdddce2" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a class="elementor-button elementor-button-link elementor-size-sm" href="https://www.quantumrun.com/consulting/methodology/">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">LEARN MORE</span>
		</span>
					</a>
		</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-ff99d80 elementor-widget__width-auto elementor-mobile-align-justify elementor-widget-mobile__width-inherit elementor-widget elementor-widget-button" data-id="ff99d80" data-element_type="widget" data-widget_type="button.default">
				<div class="elementor-widget-container">
					<div class="elementor-button-wrapper">
			<a class="elementor-button elementor-button-link elementor-size-sm" href="https://www.quantumrun.com/consulting/wp-content/uploads/2024/08/qf-methodology-overview-a2024.pdf">
						<span class="elementor-button-content-wrapper">
						<span class="elementor-button-text">PDF DOWNLOAD</span>
		</span>
					</a>
		</div>
				</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-3ae8569 elementor-hidden-tablet elementor-hidden-mobile" data-id="3ae8569" data-element_type="column">
			<div class="elementor-column-wrap">
							<div class="elementor-widget-wrap">
								</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="elementor-section elementor-top-section elementor-element elementor-element-8490f43 elementor-section-height-min-height elementor-section-boxed elementor-section-height-default elementor-section-items-middle" data-id="8490f43" data-element_type="section" id="connect">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-7a6315b" data-id="7a6315b" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-4d0c180 elementor-widget elementor-widget-heading" data-id="4d0c180" data-element_type="widget" id="homepage-contact" data-settings="{&quot;motion_fx_motion_fx_scrolling&quot;:&quot;yes&quot;,&quot;motion_fx_translateY_effect&quot;:&quot;yes&quot;,&quot;motion_fx_translateY_speed&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:0.5,&quot;sizes&quot;:[]},&quot;motion_fx_translateY_affectedRange&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:0,&quot;end&quot;:50}},&quot;motion_fx_opacity_effect&quot;:&quot;yes&quot;,&quot;motion_fx_opacity_range&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:20,&quot;end&quot;:50}},&quot;motion_fx_opacity_direction&quot;:&quot;out-in&quot;,&quot;motion_fx_opacity_level&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:10,&quot;sizes&quot;:[]},&quot;motion_fx_devices&quot;:[&quot;desktop&quot;,&quot;tablet&quot;,&quot;mobile&quot;]}" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">Select a date to schedule an intro call</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-9cf6abf elementor-widget elementor-widget-html" data-id="9cf6abf" data-element_type="widget" data-widget_type="html.default">
				<div class="elementor-widget-container">
			<!-- Start of Meetings Embed Script -->
<div class="meetings-iframe-container" data-src="https://meetings.hubspot.com/quantumrun/intro-meeting?embed=true"></div>
<script type="text/javascript" src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"></script>
<!-- End of Meetings Embed Script -->		</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="elementor-section elementor-top-section elementor-element elementor-element-efd0db2 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="efd0db2" data-element_type="section">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-f64d7fd" data-id="f64d7fd" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-1ae371f pp-nav-align-right elementor-widget elementor-widget-pp-one-page-nav" data-id="1ae371f" data-element_type="widget" data-settings="{&quot;heading_alignment&quot;:&quot;right&quot;}" data-widget_type="pp-one-page-nav.default">
				<div class="elementor-widget-container">
					<div class="pp-one-page-nav-container">
			<ul class="pp-one-page-nav" id="pp-one-page-nav-1ae371f" data-section-id="pp-one-page-nav-1ae371f" data-top-offset="0" data-scroll-speed="700" data-scroll-wheel="off" data-scroll-touch="off" data-scroll-keys="off">
									<li class="pp-one-page-nav-item">
												<a href="#" data-row-id="quantumrun-foresight">
							<span class="pp-nav-dot-wrap">
								<span class="pp-nav-dot pp-icon">
									<i aria-hidden="true" class="fas fa-circle"></i>								</span>
							</span>
						</a>
					</li>
										<li class="pp-one-page-nav-item">
												<a href="#" data-row-id="Reasons">
							<span class="pp-nav-dot-wrap">
								<span class="pp-nav-dot pp-icon">
									<i aria-hidden="true" class="fas fa-circle"></i>								</span>
							</span>
						</a>
					</li>
										<li class="pp-one-page-nav-item">
												<a href="#" data-row-id="Platform">
							<span class="pp-nav-dot-wrap">
								<span class="pp-nav-dot pp-icon">
									<i aria-hidden="true" class="fas fa-circle"></i>								</span>
							</span>
						</a>
					</li>
										<li class="pp-one-page-nav-item">
												<a href="#" data-row-id="business-value">
							<span class="pp-nav-dot-wrap">
								<span class="pp-nav-dot pp-icon">
									<i aria-hidden="true" class="fas fa-circle"></i>								</span>
							</span>
						</a>
					</li>
										<li class="pp-one-page-nav-item">
												<a href="#" data-row-id="speaker">
							<span class="pp-nav-dot-wrap">
								<span class="pp-nav-dot pp-icon">
									<i aria-hidden="true" class="fas fa-circle"></i>								</span>
							</span>
						</a>
					</li>
										<li class="pp-one-page-nav-item">
												<a href="#" data-row-id="advisory-services">
							<span class="pp-nav-dot-wrap">
								<span class="pp-nav-dot pp-icon">
									<i aria-hidden="true" class="fas fa-circle"></i>								</span>
							</span>
						</a>
					</li>
										<li class="pp-one-page-nav-item">
												<a href="#" data-row-id="foresight-methodology">
							<span class="pp-nav-dot-wrap">
								<span class="pp-nav-dot pp-icon">
									<i aria-hidden="true" class="fas fa-circle"></i>								</span>
							</span>
						</a>
					</li>
										<li class="pp-one-page-nav-item">
												<a href="#" data-row-id="connect">
							<span class="pp-nav-dot-wrap">
								<span class="pp-nav-dot pp-icon">
									<i aria-hidden="true" class="fas fa-circle"></i>								</span>
							</span>
						</a>
					</li>
								</ul>
		</div>
				</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
									</div>
			</div>
					</div>
				<div class="post-tags">
					</div>
			</div>

	<section id="comments" class="comments-area">

	


</section><!-- .comments-area -->
</main>

			<div data-elementor-type="footer" data-elementor-id="20" class="elementor elementor-20 elementor-location-footer" data-elementor-post-type="elementor_library">
					<div class="elementor-section-wrap">
								<section class="elementor-section elementor-top-section elementor-element elementor-element-e8c4e68 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="e8c4e68" data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-22cfa77" data-id="22cfa77" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<section class="elementor-section elementor-inner-section elementor-element elementor-element-d262462 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="d262462" data-element_type="section">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-fbcb4fc" data-id="fbcb4fc" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-0b0263e elementor-widget elementor-widget-theme-site-logo elementor-widget-image" data-id="0b0263e" data-element_type="widget" data-widget_type="theme-site-logo.default">
				<div class="elementor-widget-container">
								<div class="elementor-image">
								<a href="https://www.quantumrun.com/consulting">
			<img width="286" height="55"   alt="Quantumrun foresight logo alt" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/cropped-con-logo-00.png" class="attachment-full size-full wp-image-14 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img width="286" height="55"   alt="Quantumrun foresight logo alt" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/cropped-con-logo-00.png" class="attachment-full size-full wp-image-14 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img width="286" height="55"   alt="Quantumrun foresight logo alt" data-src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/cropped-con-logo-00.png" class="attachment-full size-full wp-image-14 lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img width="286" height="55" src="https://www.quantumrun.com/consulting/wp-content/uploads/2020/07/cropped-con-logo-00.png" class="attachment-full size-full wp-image-14" alt="Quantumrun foresight logo alt" /></noscript></noscript></noscript>				</a>
										</div>
						</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-06ee285" data-id="06ee285" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-5ce6673 elementor-widget__width-auto elementor-widget elementor-widget-text-editor" data-id="5ce6673" data-element_type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
								<div class="elementor-text-editor elementor-clearfix">
				<p>18 Lower Jarvis, Suite 20023, Market PO,<br />Toronto, Ontario, M5E-Â­0B1, Canada.</p>					</div>
						</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="elementor-section elementor-inner-section elementor-element elementor-element-560d5fa elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="560d5fa" data-element_type="section">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-dfd5667" data-id="dfd5667" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-35457f5 elementor-widget-divider--view-line elementor-widget elementor-widget-divider" data-id="35457f5" data-element_type="widget" data-widget_type="divider.default">
				<div class="elementor-widget-container">
					<div class="elementor-divider">
			<span class="elementor-divider-separator">
						</span>
		</div>
				</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="elementor-section elementor-inner-section elementor-element elementor-element-8e05d84 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="8e05d84" data-element_type="section">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-20 elementor-inner-column elementor-element elementor-element-39a60a1" data-id="39a60a1" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-bc16c16 elementor-widget elementor-widget-heading" data-id="bc16c16" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h6 class="elementor-heading-title elementor-size-default">Consulting</h6>		</div>
				</div>
				<div class="elementor-element elementor-element-a3bf3ab elementor-mobile-align-center elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="a3bf3ab" data-element_type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
					<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/services/">

											<span class="elementor-icon-list-text">All services</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/business-ideation/">

											<span class="elementor-icon-list-text">Business ideation</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/service/foresight-workshops/">

											<span class="elementor-icon-list-text">Workshops</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/futurist-speakers-keynote">

											<span class="elementor-icon-list-text">Futurist speakers</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/services/corporate-forecast-reports/">

											<span class="elementor-icon-list-text">Corporate forecast reports</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/methodology/">

											<span class="elementor-icon-list-text">Methodology</span>
											</a>
									</li>
						</ul>
				</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-20 elementor-inner-column elementor-element elementor-element-f35f66e" data-id="f35f66e" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-063d9be elementor-widget elementor-widget-heading" data-id="063d9be" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">Platform</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-efea2c1 elementor-mobile-align-center elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="efea2c1" data-element_type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
					<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/platform">

											<span class="elementor-icon-list-text">Foresight platform</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/platform-pricing/">

											<span class="elementor-icon-list-text">Subscription plans & pricing</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/company-register">

											<span class="elementor-icon-list-text">Platform registration</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/help/%20">

											<span class="elementor-icon-list-text">Info & Training</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/user/login">

											<span class="elementor-icon-list-text">Platform user login</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/platform-affiliate-program">

											<span class="elementor-icon-list-text">Affiliate partner program</span>
											</a>
									</li>
						</ul>
				</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-20 elementor-inner-column elementor-element elementor-element-a22fcbb" data-id="a22fcbb" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-a734f7d elementor-widget elementor-widget-heading" data-id="a734f7d" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">Publications</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-a241189 elementor-mobile-align-center elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="a241189" data-element_type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
					<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com">

											<span class="elementor-icon-list-text">Public website</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://quantumrun.substack.com">

											<span class="elementor-icon-list-text">Newsletter</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/list/trends-report-2023-quantumrun-foresight/46710/2297">

											<span class="elementor-icon-list-text">Trends report</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/series">

											<span class="elementor-icon-list-text">Special series</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://quantumrun.com/future-timeline">

											<span class="elementor-icon-list-text">Future timelines</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/blog/">

											<span class="elementor-icon-list-text">Blog</span>
											</a>
									</li>
						</ul>
				</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-20 elementor-inner-column elementor-element elementor-element-1e369bd" data-id="1e369bd" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-1a38dd3 elementor-widget elementor-widget-heading" data-id="1a38dd3" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">About Us</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-368bfa7 elementor-mobile-align-center elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="368bfa7" data-element_type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
					<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/tylo-ai-partnership">

											<span class="elementor-icon-list-text">Tylo AI partnership</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/about-us/">

											<span class="elementor-icon-list-text">About us</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/partnerships-quantumrun-foresight">

											<span class="elementor-icon-list-text">Partnership options</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://quantumrun.com/privacy-policy">

											<span class="elementor-icon-list-text">Privacy policy</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/accessibility-statement">

											<span class="elementor-icon-list-text">Accessibility statement</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/sitemap_index.xml">

											<span class="elementor-icon-list-text">Sitemap</span>
											</a>
									</li>
						</ul>
				</div>
				</div>
						</div>
					</div>
		</div>
				<div class="elementor-column elementor-col-20 elementor-inner-column elementor-element elementor-element-6f6dcf4" data-id="6f6dcf4" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-6e54535 elementor-widget elementor-widget-heading" data-id="6e54535" data-element_type="widget" data-widget_type="heading.default">
				<div class="elementor-widget-container">
			<h2 class="elementor-heading-title elementor-size-default">Contact Us</h2>		</div>
				</div>
				<div class="elementor-element elementor-element-b84f960 elementor-mobile-align-center elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="b84f960" data-element_type="widget" data-widget_type="icon-list.default">
				<div class="elementor-widget-container">
					<ul class="elementor-icon-list-items">
							<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/contact/">

											<span class="elementor-icon-list-text">Contact</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/press/">

											<span class="elementor-icon-list-text">Press</span>
											</a>
									</li>
								<li class="elementor-icon-list-item">
											<a href="https://www.quantumrun.com/consulting/write-for-us-guest-post/">

											<span class="elementor-icon-list-text">Write For Us</span>
											</a>
									</li>
						</ul>
				</div>
				</div>
				<div class="elementor-element elementor-element-7858571 e-grid-align-left e-grid-align-mobile-center elementor-shape-rounded elementor-grid-0 elementor-widget elementor-widget-social-icons" data-id="7858571" data-element_type="widget" data-widget_type="social-icons.default">
				<div class="elementor-widget-container">
					<div class="elementor-social-icons-wrapper elementor-grid">
							<span class="elementor-grid-item">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-linkedin elementor-repeater-item-4a39424" href="https://www.linkedin.com/company/quantumrun-com" target="_blank">
						<span class="elementor-screen-only">Linkedin</span>
						<i class="fab fa-linkedin"></i>					</a>
				</span>
							<span class="elementor-grid-item">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-twitter elementor-repeater-item-0536730" href="https://twitter.com/quantumrun" target="_blank">
						<span class="elementor-screen-only">Twitter</span>
						<i class="fab fa-twitter"></i>					</a>
				</span>
							<span class="elementor-grid-item">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-medium elementor-repeater-item-4dd515e" href="https://medium.com/@quantumrun%20" target="_blank">
						<span class="elementor-screen-only">Medium</span>
						<i class="fab fa-medium"></i>					</a>
				</span>
							<span class="elementor-grid-item">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-envelope elementor-repeater-item-994c68e" href="https://quantumrun.substack.com" target="_blank">
						<span class="elementor-screen-only">Envelope</span>
						<i class="fas fa-envelope"></i>					</a>
				</span>
					</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-d3c2ef3 e-grid-align-left e-grid-align-mobile-center elementor-shape-rounded elementor-grid-0 elementor-widget elementor-widget-social-icons" data-id="d3c2ef3" data-element_type="widget" data-widget_type="social-icons.default">
				<div class="elementor-widget-container">
					<div class="elementor-social-icons-wrapper elementor-grid">
							<span class="elementor-grid-item">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-4847e8b" href="https://www.youtube.com/c/Quantumrun" target="_blank">
						<span class="elementor-screen-only">Youtube</span>
						<i class="fab fa-youtube"></i>					</a>
				</span>
							<span class="elementor-grid-item">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-4a39424" href="https://www.instagram.com/quantumrun" target="_blank">
						<span class="elementor-screen-only">Instagram</span>
						<i class="fab fa-instagram"></i>					</a>
				</span>
							<span class="elementor-grid-item">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-tiktok elementor-repeater-item-0536730" href="https://www.tiktok.com/@quantumrun" target="_blank">
						<span class="elementor-screen-only">Tiktok</span>
						<i class="fab fa-tiktok"></i>					</a>
				</span>
							<span class="elementor-grid-item">
					<a class="elementor-icon elementor-social-icon elementor-social-icon-reddit-alien elementor-repeater-item-fbf838e" href="https://www.reddit.com/r/Quantumrun" target="_blank">
						<span class="elementor-screen-only">Reddit-alien</span>
						<i class="fab fa-reddit-alien"></i>					</a>
				</span>
					</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-22b94f6 elementor-widget elementor-widget-html" data-id="22b94f6" data-element_type="widget" data-widget_type="html.default">
				<div class="elementor-widget-container">
			<a href="http://discovery.ariba.com/profile/AN11167582225">
<img alt="View FUTURESPEC GROUP INC profile on Ariba Discovery" border=0  data-src="https://service.ariba.com/an/p/Ariba/badge_180x55.jpg" class="lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><noscript><img alt="View FUTURESPEC GROUP INC profile on Ariba Discovery" border=0 src="https://service.ariba.com/an/p/Ariba/badge_180x55.jpg"></noscript>
</a>		</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
				<section class="elementor-section elementor-inner-section elementor-element elementor-element-64b681f elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="64b681f" data-element_type="section">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-100 elementor-inner-column elementor-element elementor-element-026138b" data-id="026138b" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-f211992 elementor-widget-divider--view-line elementor-widget elementor-widget-divider" data-id="f211992" data-element_type="widget" data-widget_type="divider.default">
				<div class="elementor-widget-container">
					<div class="elementor-divider">
			<span class="elementor-divider-separator">
						</span>
		</div>
				</div>
				</div>
				<div class="elementor-element elementor-element-c0beca0 elementor-widget elementor-widget-text-editor" data-id="c0beca0" data-element_type="widget" data-widget_type="text-editor.default">
				<div class="elementor-widget-container">
								<div class="elementor-text-editor elementor-clearfix">
				<p>Copyright 2024 | <strong>Quantumrun Foresight</strong>, subsidiary of Futurespec Group Inc. | All Rights Reserved.</p>					</div>
						</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
							</div>
				</div>
		
		<div data-elementor-type="popup" data-elementor-id="4713" class="elementor elementor-4713 elementor-location-popup" data-elementor-settings="{&quot;entrance_animation&quot;:&quot;fadeIn&quot;,&quot;exit_animation&quot;:&quot;fadeIn&quot;,&quot;entrance_animation_duration&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:0.6,&quot;sizes&quot;:[]},&quot;a11y_navigation&quot;:&quot;yes&quot;,&quot;timing&quot;:[]}" data-elementor-post-type="elementor_library">
					<div class="elementor-section-wrap">
								<section class="elementor-section elementor-top-section elementor-element elementor-element-0b3bb85 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="0b3bb85" data-element_type="section">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-05f2f3c" data-id="05f2f3c" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-933a54f elementor-widget elementor-widget-video" data-id="933a54f" data-element_type="widget" data-settings="{&quot;youtube_url&quot;:&quot;https:\/\/youtu.be\/cEIjN6KLG5o&quot;,&quot;video_type&quot;:&quot;youtube&quot;,&quot;controls&quot;:&quot;yes&quot;}" data-widget_type="video.default">
				<div class="elementor-widget-container">
					<div class="elementor-wrapper elementor-open-inline">
			<div class="elementor-video"></div>		</div>
				</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
							</div>
				</div>
				<div data-elementor-type="popup" data-elementor-id="6995" class="elementor elementor-6995 elementor-location-popup" data-elementor-settings="{&quot;entrance_animation&quot;:&quot;fadeIn&quot;,&quot;exit_animation&quot;:&quot;fadeIn&quot;,&quot;entrance_animation_duration&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:0.6,&quot;sizes&quot;:[]},&quot;a11y_navigation&quot;:&quot;yes&quot;,&quot;timing&quot;:[]}" data-elementor-post-type="elementor_library">
					<div class="elementor-section-wrap">
								<section class="elementor-section elementor-top-section elementor-element elementor-element-767d7d84 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="767d7d84" data-element_type="section">
						<div class="elementor-container elementor-column-gap-default">
							<div class="elementor-row">
					<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-4459f353" data-id="4459f353" data-element_type="column">
			<div class="elementor-column-wrap elementor-element-populated">
							<div class="elementor-widget-wrap">
						<div class="elementor-element elementor-element-616e417d elementor-widget elementor-widget-video" data-id="616e417d" data-element_type="widget" data-settings="{&quot;youtube_url&quot;:&quot;https:\/\/www.youtube.com\/watch?v=FBIF8UnYDP8&quot;,&quot;video_type&quot;:&quot;youtube&quot;,&quot;controls&quot;:&quot;yes&quot;}" data-widget_type="video.default">
				<div class="elementor-widget-container">
					<div class="elementor-wrapper elementor-open-inline">
			<div class="elementor-video"></div>		</div>
				</div>
				</div>
						</div>
					</div>
		</div>
								</div>
					</div>
		</section>
							</div>
				</div>
		<!-- Geo Redirects plugin https://geotargetingwp.com-->
<div class="geotr-ajax" style="display: none">
	<div>
						<img   alt="loading" data-src="https://www.quantumrun.com/consulting/wp-content/plugins/geotargetingwp/addons/geo-redirects/public/img/loading.svg" class="aligncenter lazyload" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" /><noscript><img class="aligncenter" src="https://www.quantumrun.com/consulting/wp-content/plugins/geotargetingwp/addons/geo-redirects/public/img/loading.svg" alt="loading"/></noscript>
		<p style="text-align: center">Please wait while you are redirected to the right page...</p>
			</div>
</div>
<style>
		.geotr-ajax {
		position: fixed;
		width: 100%;
		height: 100%;
		background: #fff;
		top: 0;
		left: 0;
		z-index: 9999999999;
		color: #000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.geotr-ajax img {
		display: block;
		margin: auto;
	}

	.geotr-ajax div {
		margin: 20px;
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	}
</style>
	<div class="geobl-ajax" style="display: none"></div><link rel='stylesheet' id='odometer-css' href='https://www.quantumrun.com/consulting/wp-content/plugins/powerpack-elements/assets/lib/odometer/odometer-theme-default.css?ver=2.9.22' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-post-4713-css' href='https://www.quantumrun.com/consulting/wp-content/uploads/elementor/css/post-4713.css?ver=1757949187' type='text/css' media='all' />
<link rel='stylesheet' id='elementor-post-6995-css' href='https://www.quantumrun.com/consulting/wp-content/uploads/elementor/css/post-6995.css?ver=1757949187' type='text/css' media='all' />
<link rel='stylesheet' id='e-animations-css' href='https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/lib/animations/animations.min.css?ver=3.14.0' type='text/css' media='all' />
<script type="text/javascript" id="geot-js-js-extra">
/* <![CDATA[ */
var geot = {"ajax_url":"https:\/\/www.quantumrun.com\/consulting\/wp-admin\/admin-ajax.php","ajax":"1","pid":"6635","is_archive":"","is_search":"","is_singular":"1","is_front_page":"1","is_category":"","is_page":"1","is_single":"","disable_remove_on_singular":"1","is_builder":"","has_geo_posts":"","dropdown_search":"","dropdown_redirect":"","elementor_popup":"1","hide_class":"","hide_override_class":"","remove_class":"","remove_override_class":"","disable_console":"","geoloc_enable":"by_ip","geoloc_force":"","geoloc_fail":"Geolocation is not supported by this browser","geot_cookies_duration":"999"};
/* ]]> */
</script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/geotargetingwp/public/js/geotarget-public.js?ver=3.5.1.2" id="geot-js-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/geotargetingwp/public/js/min/selectize.min.js?ver=3.5.1.2" id="geot-slick-js"></script>
<script type="text/javascript" id="leadin-script-loader-js-js-extra">
/* <![CDATA[ */
var leadin_wordpress = {"userRole":"visitor","pageType":"home","leadinPluginVersion":"11.3.6"};
/* ]]> */
</script>
<script type="text/javascript" src="https://js.hs-scripts.com/5825648.js?integration=WordPress&amp;ver=11.3.6" id="leadin-script-loader-js-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/wp-smushit/app/assets/js/smush-lazy-load.min.js?ver=3.15.3" id="smush-lazy-load-js"></script>
<script type="text/javascript" id="gt_widget_script_65190745-js-before">
/* <![CDATA[ */
window.gtranslateSettings = /* document.write */ window.gtranslateSettings || {};window.gtranslateSettings['65190745'] = {"default_language":"en","languages":["af","sq","am","ar","hy","az","eu","be","bn","bs","bg","ca","ceb","ny","zh-CN","zh-TW","co","hr","cs","da","nl","en","eo","et","tl","fi","fr","fy","gl","ka","de","el","gu","ht","ha","haw","iw","hi","hmn","hu","is","ig","id","ga","it","ja","jw","kn","kk","km","ko","ku","ky","lo","la","lv","lt","lb","mk","mg","ms","ml","mt","mi","mr","mn","my","ne","no","ps","fa","pl","pt","pa","ro","ru","sm","gd","sr","st","sn","sd","si","sk","sl","so","es","su","sw","sv","tg","ta","te","th","tr","uk","ur","uz","vi","cy","xh","yi","yo","zu"],"url_structure":"sub_directory","flag_style":"3d","flag_size":24,"wrapper_selector":"#gt-wrapper-65190745","alt_flags":{"en":"usa"},"switcher_open_direction":"top","switcher_horizontal_position":"inline","switcher_text_color":"#ffffff","switcher_arrow_color":"#666","switcher_border_color":"#ccc","switcher_background_color":"#fff","switcher_background_shadow_color":"#efefef","switcher_background_hover_color":"#fff","dropdown_text_color":"#eeeeee","dropdown_hover_color":"#eeeeee","dropdown_background_color":"#eee","flags_location":"\/consulting\/wp-content\/plugins\/gtranslate\/flags\/"};
/* ]]> */
</script><script src="https://www.quantumrun.com/consulting/wp-content/plugins/gtranslate/js/dwf.js?ver=6.7.1" data-no-optimize="1" data-no-minify="1" data-gt-orig-url="/consulting/" data-gt-orig-domain="www.quantumrun.com" data-gt-widget-id="65190745" defer></script><script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/powerpack-elements/assets/lib/smartmenu/jquery-smartmenu.js?ver=1.1.1" id="jquery-smartmenu-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/powerpack-elements/assets/js/min/frontend-advanced-menu.min.js?ver=2.9.22" id="pp-advanced-menu-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/elementor-pro/assets/lib/smartmenus/jquery.smartmenus.min.js?ver=1.0.1" id="smartmenus-js"></script>
<script type="text/javascript" id="gt_widget_script_61583527-js-before">
/* <![CDATA[ */
window.gtranslateSettings = /* document.write */ window.gtranslateSettings || {};window.gtranslateSettings['61583527'] = {"default_language":"en","languages":["af","sq","am","ar","hy","az","eu","be","bn","bs","bg","ca","ceb","ny","zh-CN","zh-TW","co","hr","cs","da","nl","en","eo","et","tl","fi","fr","fy","gl","ka","de","el","gu","ht","ha","haw","iw","hi","hmn","hu","is","ig","id","ga","it","ja","jw","kn","kk","km","ko","ku","ky","lo","la","lv","lt","lb","mk","mg","ms","ml","mt","mi","mr","mn","my","ne","no","ps","fa","pl","pt","pa","ro","ru","sm","gd","sr","st","sn","sd","si","sk","sl","so","es","su","sw","sv","tg","ta","te","th","tr","uk","ur","uz","vi","cy","xh","yi","yo","zu"],"url_structure":"sub_directory","flag_style":"3d","flag_size":24,"wrapper_selector":"#gt-wrapper-61583527","alt_flags":{"en":"usa"},"switcher_open_direction":"top","switcher_horizontal_position":"inline","switcher_text_color":"#ffffff","switcher_arrow_color":"#666","switcher_border_color":"#ccc","switcher_background_color":"#fff","switcher_background_shadow_color":"#efefef","switcher_background_hover_color":"#fff","dropdown_text_color":"#eeeeee","dropdown_hover_color":"#eeeeee","dropdown_background_color":"#eee","flags_location":"\/consulting\/wp-content\/plugins\/gtranslate\/flags\/"};
/* ]]> */
</script><script src="https://www.quantumrun.com/consulting/wp-content/plugins/gtranslate/js/dwf.js?ver=6.7.1" data-no-optimize="1" data-no-minify="1" data-gt-orig-url="/consulting/" data-gt-orig-domain="www.quantumrun.com" data-gt-widget-id="61583527" defer></script><script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/lib/swiper/swiper.min.js?ver=5.3.6" id="swiper-js"></script>
<script type="text/javascript" id="powerpack-frontend-js-extra">
/* <![CDATA[ */
var ppLogin = {"empty_username":"Enter a username or email address.","empty_password":"Enter password.","empty_password_1":"Enter a password.","empty_password_2":"Re-enter password.","empty_recaptcha":"Please check the captcha to verify you are not a robot.","email_sent":"A password reset email has been sent to the email address for your account, but may take several minutes to show up in your inbox. Please wait at least 10 minutes before attempting another reset.","reset_success":"Your password has been reset successfully.","ajax_url":"https:\/\/www.quantumrun.com\/consulting\/wp-admin\/admin-ajax.php","show_password":"Show password","hide_password":"Hide password"};
var ppRegistration = {"invalid_username":"This username is invalid because it uses illegal characters. Please enter a valid username.","username_exists":"This username is already registered. Please choose another one.","empty_email":"Please type your email address.","invalid_email":"The email address isn\u2019t correct!","email_exists":"The email is already registered, please choose another one.","password":"Password must not contain the character \"\\\\\"","password_length":"Your password should be at least 8 characters long.","password_mismatch":"Password does not match.","invalid_url":"URL seems to be invalid.","recaptcha_php_ver":"reCAPTCHA API requires PHP version 5.3 or above.","recaptcha_missing_key":"Your reCAPTCHA Site or Secret Key is missing!","show_password":"Show password","hide_password":"Hide password","ajax_url":"https:\/\/www.quantumrun.com\/consulting\/wp-admin\/admin-ajax.php"};
var ppCoupons = {"copied_text":"Copied"};
/* ]]> */
</script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/powerpack-elements/assets/js/min/frontend.min.js?ver=2.9.22" id="powerpack-frontend-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/lib/waypoints/waypoints.min.js?ver=4.0.2" id="elementor-waypoints-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/powerpack-elements/assets/lib/odometer/odometer.min.js?ver=0.4.8" id="odometer-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/powerpack-elements/assets/js/min/pp-bg-effects.min.js?ver=1.0.0" id="pp-bg-effects-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/powerpack-elements/assets/lib/particles/particles.min.js?ver=2.0.0" id="particles-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/powerpack-elements/assets/lib/isotope/isotope.pkgd.min.js?ver=0.5.3" id="isotope-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-includes/js/imagesloaded.min.js?ver=5.0.0" id="imagesloaded-js"></script>
<script type="text/javascript" id="powerpack-pp-posts-js-extra">
/* <![CDATA[ */
var pp_posts_script = {"ajax_url":"https:\/\/www.quantumrun.com\/consulting\/wp-admin\/admin-ajax.php","posts_nonce":"40cc4880b1"};
var pp_posts_script = {"ajax_url":"https:\/\/www.quantumrun.com\/consulting\/wp-admin\/admin-ajax.php","posts_nonce":"40cc4880b1"};
/* ]]> */
</script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/powerpack-elements/assets/js/min/pp-posts.min.js?ver=2.9.22" id="powerpack-pp-posts-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/powerpack-elements/assets/js/min/one-page-nav.min.js?ver=1.0.0" id="jquery-powerpack-dot-nav-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/elementor-pro/assets/js/webpack-pro.runtime.min.js?ver=3.15.0" id="elementor-pro-webpack-runtime-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js?ver=3.14.0" id="elementor-webpack-runtime-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/js/frontend-modules.min.js?ver=3.14.0" id="elementor-frontend-modules-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-includes/js/dist/hooks.min.js?ver=4d63a3d491d11ffd8ac6" id="wp-hooks-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-includes/js/dist/i18n.min.js?ver=5e580eb46a90c2b997e6" id="wp-i18n-js"></script>
<script type="text/javascript" id="wp-i18n-js-after">
/* <![CDATA[ */
wp.i18n.setLocaleData( { 'text direction\u0004ltr': [ 'ltr' ] } );
/* ]]> */
</script>
<script type="text/javascript" id="elementor-pro-frontend-js-before">
/* <![CDATA[ */
var ElementorProFrontendConfig = {"ajaxurl":"https:\/\/www.quantumrun.com\/consulting\/wp-admin\/admin-ajax.php","nonce":"0f2224a268","urls":{"assets":"https:\/\/www.quantumrun.com\/consulting\/wp-content\/plugins\/elementor-pro\/assets\/","rest":"https:\/\/www.quantumrun.com\/consulting\/wp-json\/"},"shareButtonsNetworks":{"facebook":{"title":"Facebook","has_counter":true},"twitter":{"title":"Twitter"},"linkedin":{"title":"LinkedIn","has_counter":true},"pinterest":{"title":"Pinterest","has_counter":true},"reddit":{"title":"Reddit","has_counter":true},"vk":{"title":"VK","has_counter":true},"odnoklassniki":{"title":"OK","has_counter":true},"tumblr":{"title":"Tumblr"},"digg":{"title":"Digg"},"skype":{"title":"Skype"},"stumbleupon":{"title":"StumbleUpon","has_counter":true},"mix":{"title":"Mix"},"telegram":{"title":"Telegram"},"pocket":{"title":"Pocket","has_counter":true},"xing":{"title":"XING","has_counter":true},"whatsapp":{"title":"WhatsApp"},"email":{"title":"Email"},"print":{"title":"Print"}},"facebook_sdk":{"lang":"en_US","app_id":""},"lottie":{"defaultAnimationUrl":"https:\/\/www.quantumrun.com\/consulting\/wp-content\/plugins\/elementor-pro\/modules\/lottie\/assets\/animations\/default.json"}};
/* ]]> */
</script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/elementor-pro/assets/js/frontend.min.js?ver=3.15.0" id="elementor-pro-frontend-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-includes/js/jquery/ui/core.min.js?ver=1.13.3" id="jquery-ui-core-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/lib/share-link/share-link.min.js?ver=3.14.0" id="share-link-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/lib/dialog/dialog.min.js?ver=4.9.0" id="elementor-dialog-js"></script>
<script type="text/javascript" id="elementor-frontend-js-before">
/* <![CDATA[ */
var elementorFrontendConfig = {"environmentMode":{"edit":false,"wpPreview":false,"isScriptDebug":false},"i18n":{"shareOnFacebook":"Share on Facebook","shareOnTwitter":"Share on Twitter","pinIt":"Pin it","download":"Download","downloadImage":"Download image","fullscreen":"Fullscreen","zoom":"Zoom","share":"Share","playVideo":"Play Video","previous":"Previous","next":"Next","close":"Close","a11yCarouselWrapperAriaLabel":"Carousel | Horizontal scrolling: Arrow Left & Right","a11yCarouselPrevSlideMessage":"Previous slide","a11yCarouselNextSlideMessage":"Next slide","a11yCarouselFirstSlideMessage":"This is the first slide","a11yCarouselLastSlideMessage":"This is the last slide","a11yCarouselPaginationBulletMessage":"Go to slide"},"is_rtl":false,"breakpoints":{"xs":0,"sm":480,"md":768,"lg":1025,"xl":1440,"xxl":1600},"responsive":{"breakpoints":{"mobile":{"label":"Mobile Portrait","value":767,"default_value":767,"direction":"max","is_enabled":true},"mobile_extra":{"label":"Mobile Landscape","value":880,"default_value":880,"direction":"max","is_enabled":false},"tablet":{"label":"Tablet Portrait","value":1024,"default_value":1024,"direction":"max","is_enabled":true},"tablet_extra":{"label":"Tablet Landscape","value":1200,"default_value":1200,"direction":"max","is_enabled":false},"laptop":{"label":"Laptop","value":1366,"default_value":1366,"direction":"max","is_enabled":false},"widescreen":{"label":"Widescreen","value":2400,"default_value":2400,"direction":"min","is_enabled":false}}},"version":"3.14.0","is_static":false,"experimentalFeatures":{"a11y_improvements":true,"additional_custom_breakpoints":true,"theme_builder_v2":true,"landing-pages":true,"page-transitions":true,"notes":true,"loop":true,"form-submissions":true,"e_scroll_snap":true},"urls":{"assets":"https:\/\/www.quantumrun.com\/consulting\/wp-content\/plugins\/elementor\/assets\/"},"swiperClass":"swiper-container","settings":{"page":[],"editorPreferences":[]},"kit":{"active_breakpoints":["viewport_mobile","viewport_tablet"],"global_image_lightbox":"yes","lightbox_enable_counter":"yes","lightbox_enable_fullscreen":"yes","lightbox_enable_zoom":"yes","lightbox_enable_share":"yes","lightbox_title_src":"title","lightbox_description_src":"description"},"post":{"id":6635,"title":"Foresight%20consulting%20services%20-%20Quantumrun%20Foresight","excerpt":"","featuredImage":"https:\/\/www.quantumrun.com\/consulting\/wp-content\/uploads\/2022\/11\/img-1-1024x576.jpg"}};
/* ]]> */
</script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/js/frontend.min.js?ver=3.14.0" id="elementor-frontend-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/elementor-pro/assets/js/preloaded-elements-handlers.min.js?ver=3.15.0" id="pro-preloaded-elements-handlers-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/elementor/assets/js/preloaded-modules.min.js?ver=3.14.0" id="preloaded-modules-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/elementor-pro/assets/lib/sticky/jquery.sticky.min.js?ver=3.15.0" id="e-sticky-js"></script>
<script type="text/javascript" src="https://www.quantumrun.com/consulting/wp-content/plugins/powerpack-elements/assets/lib/tooltipster/tooltipster.min.js?ver=2.9.22" id="pp-tooltipster-js"></script>

<script defer src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015" integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ==" data-cf-beacon='{"version":"2024.11.0","token":"e0ff5859809b443691867efa5bf5489b","r":1,"server_timing":{"name":{"cfCacheStatus":true,"cfEdge":true,"cfExtPri":true,"cfL4":true,"cfOrigin":true,"cfSpeedBrain":true},"location_startswith":null}}' crossorigin="anonymous"></script>
</body>
</html>

```

---

## FILE: \.github\workflows\deploy.yml
```txt
name: Deploy
on: push
jobs: build

```

---

## FILE: \backend\app.py
```txt
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from services.ai_core import gerar_resposta_ia
from services.file_service import salvar_arquivo, ler_arquivo

load_dotenv()

app = Flask(__name__)
CORS(app)

# MemÃ³ria RAM Global
conhecimento_atual = ""
nome_arquivo_atual = ""

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ONLINE", "file_loaded": nome_arquivo_atual}), 200

@app.route('/api/upload', methods=['POST'])
def upload_file():
    global conhecimento_atual, nome_arquivo_atual
    
    if 'file' not in request.files:
        return jsonify({"error": "Nenhum arquivo enviado"}), 400
    
    arquivo = request.files['file']
    if arquivo.filename == '':
        return jsonify({"error": "Nome invÃ¡lido"}), 400

    try:
        caminho = salvar_arquivo(arquivo)
        # USA A NOVA FUNÃ‡ÃƒO GENÃ‰RICA (PDF, DOCX, TXT)
        texto_extraido = ler_arquivo(caminho)
        
        conhecimento_atual = texto_extraido
        nome_arquivo_atual = arquivo.filename
        
        print(f"ðŸ“‚ Leitura concluÃ­da: {nome_arquivo_atual} ({len(texto_extraido)} chars)")
        
        return jsonify({
            "message": "Arquivo processado!",
            "preview": texto_extraido[:200]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    global conhecimento_atual, nome_arquivo_atual
    data = request.json
    raw_history = data.get('history', []) 
    user_msg = data.get('message', '')

    if not user_msg: return jsonify({"error": "Mensagem vazia"}), 400

    gemini_history = []
    
    # --- INJEÃ‡ÃƒO DE CONTEXTO ---
    if conhecimento_atual:
        # Criamos um "Sistema" autoritÃ¡rio
        prompt_sistema = (
            f"SISTEMA: O usuÃ¡rio carregou um arquivo chamado '{nome_arquivo_atual}'. "
            f"O conteÃºdo extraÃ­do do arquivo Ã©:\n"
            f"--- INICIO DO ARQUIVO ---\n{conhecimento_atual}\n--- FIM DO ARQUIVO ---\n"
            f"InstruÃ§Ã£o: Responda as perguntas do usuÃ¡rio baseando-se EXCLUSIVAMENTE ou PRINCIPALMENTE neste conteÃºdo."
        )
        
        gemini_history.append({"role": "user", "parts": [prompt_sistema]})
        gemini_history.append({"role": "model", "parts": ["Entendido. Analisei o arquivo e usarei suas informaÃ§Ãµes."]})

    # Adiciona o resto da conversa
    for msg in raw_history:
        if msg['sender'] == 'system': continue # Ignora mensagens de sistema do frontend
        role = 'user' if msg['sender'] == 'user' else 'model'
        gemini_history.append({"role": role, "parts": [msg['text']]})
    
    gemini_history.append({"role": 'user', "parts": [user_msg]})

    resposta_ia = gerar_resposta_ia(gemini_history)
    return jsonify({"reply": resposta_ia})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
```

---

## FILE: \backend\check_models.py
```txt
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

print(f"🔑 Testando chave: {api_key[:5]}... (Oculto)")

try:
    print("🔎 Buscando modelos disponiveis para esta chave...")
    models = genai.list_models()
    found = False
    for m in models:
        if 'generateContent' in m.supported_generation_methods:
            print(f" ✅ Disponivel: {m.name}")
            found = True
    
    if not found:
        print("❌ Nenhum modelo de texto encontrado. Verifique se a API Generative Language está ativa no Google Cloud.")

except Exception as e:
    print(f"❌ ERRO GRAVE: {e}")

```

---

## FILE: \backend\package-lock.json
*[Lockfile/Log - Omitido]*

---

## FILE: \backend\requirements.txt
```txt
annotated-types==0.7.0
anyio==4.12.0
attrs==25.4.0
backoff==2.2.1
bcrypt==5.0.0
blinker==1.9.0
build==1.3.0
cachetools==6.2.4
certifi==2025.11.12
charset-normalizer==3.4.4
chromadb==1.3.7
click==8.3.1
colorama==0.4.6
coloredlogs==15.0.1
distro==1.9.0
durationpy==0.10
filelock==3.20.1
Flask==3.1.2
flask-cors==6.0.2
flatbuffers==25.12.19
fsspec==2025.12.0
google-ai-generativelanguage==0.6.15
google-api-core==2.28.1
google-api-python-client==2.187.0
google-auth==2.45.0
google-auth-httplib2==0.3.0
google-generativeai==0.8.6
googleapis-common-protos==1.72.0
grpcio==1.76.0
grpcio-status==1.71.2
h11==0.16.0
hf-xet==1.2.0
httpcore==1.0.9
httplib2==0.31.0
httptools==0.7.1
httpx==0.28.1
huggingface_hub==1.2.3
humanfriendly==10.0
idna==3.11
importlib_metadata==8.7.0
importlib_resources==6.5.2
itsdangerous==2.2.0
Jinja2==3.1.6
jsonschema==4.25.1
jsonschema-specifications==2025.9.1
kubernetes==34.1.0
markdown-it-py==4.0.0
MarkupSafe==3.0.3
mdurl==0.1.2
mmh3==5.2.0
mpmath==1.3.0
numpy==2.3.5
oauthlib==3.3.1
onnxruntime==1.23.2
opentelemetry-api==1.39.1
opentelemetry-exporter-otlp-proto-common==1.39.1
opentelemetry-exporter-otlp-proto-grpc==1.39.1
opentelemetry-proto==1.39.1
opentelemetry-sdk==1.39.1
opentelemetry-semantic-conventions==0.60b1
orjson==3.11.5
overrides==7.7.0
packaging==25.0
posthog==5.4.0
proto-plus==1.27.0
protobuf==5.29.5
pyasn1==0.6.1
pyasn1_modules==0.4.2
pybase64==1.4.3
pydantic==2.12.5
pydantic_core==2.41.5
Pygments==2.19.2
pyparsing==3.2.5
PyPika==0.48.9
pyproject_hooks==1.2.0
pyreadline3==3.5.4
python-dateutil==2.9.0.post0
python-dotenv==1.2.1
PyYAML==6.0.3
referencing==0.37.0
requests==2.32.5
requests-oauthlib==2.0.0
rich==14.2.0
rpds-py==0.30.0
rsa==4.9.1
shellingham==1.5.4
six==1.17.0
sympy==1.14.0
tenacity==9.1.2
tokenizers==0.22.1
tqdm==4.67.1
typer==0.20.1
typer-slim==0.20.1
typing-inspection==0.4.2
typing_extensions==4.15.0
uritemplate==4.2.0
urllib3==2.3.0
uvicorn==0.38.0
watchfiles==1.1.1
websocket-client==1.9.0
websockets==15.0.1
Werkzeug==3.1.4
zipp==3.23.0

```

---

## FILE: \backend\verificar_modelos.py
```txt
Set-Content -Path "verificar_modelos.py" -Value @"
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

print("--------------------------------------------------")
print("ðŸ” CONSULTANDO O GOOGLE SOBRE SUA CONTA...")
print("--------------------------------------------------")

try:
    # Lista todos os modelos disponiveis para esta chave
    modelos = genai.list_models()
    
    encontrou = False
    for m in modelos:
        # Filtra apenas os modelos que servem para Chat (generateContent)
        if 'generateContent' in m.supported_generation_methods:
            print(f"âœ… DISPONÃVEL: {m.name}")
            encontrou = True
            
    if not encontrou:
        print("âš ï¸ NENHUM modelo de chat encontrado. Verifique se a API Key Ã© vÃ¡lida.")

except Exception as e:
    print(f"âŒ ERRO AO CONECTAR: {e}")

print("--------------------------------------------------")
"@ -Encoding UTF8
```

---

## FILE: \backend\services\ai_core - Copia V Ge15Flash.py
```txt
# services/ai_core.py

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def configurar_gemini():
    """Configura a conexao com a Google AI"""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("ERRO: API Key do Google nao encontrada no .env")
    
    genai.configure(api_key=api_key)
    
    # MUDANÇA CRÍTICA: 
    # Saímos do 'latest' (que está apontando para o 2.5 limitado)
    # E fixamos no 'gemini-1.5-flash' que tem cota alta (1500 req/dia)
    return genai.GenerativeModel('models/gemini-1.5-flash')

def gerar_resposta_ia(historico):
    """Recebe o histórico formatado e gera resposta"""
    try:
        model = configurar_gemini()
        
        # O SDK do Google espera histórico no formato chat
        # Precisamos separar a ultima mensagem para usar no send_message
        
        # Se for apenas uma mensagem (sem historico anterior)
        if len(historico) == 1:
            chat = model.start_chat(history=[])
            response = chat.send_message(historico[0]['parts'][0])
            return response.text

        # Se tiver histórico
        msgs_anteriores = historico[:-1]
        ultima_msg = historico[-1]['parts'][0]
        
        chat = model.start_chat(history=msgs_anteriores)
        response = chat.send_message(ultima_msg)
        return response.text

    except Exception as e:
        return f"Erro na IA: {str(e)}"
```

---

## FILE: \backend\services\ai_core - Copia V Ge25Flash.py
```txt
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def configurar_gemini():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("ERRO: API Key nao encontrada")
    
    genai.configure(api_key=api_key)
    # Modelo rapido e eficiente
    return genai.GenerativeModel('models/gemini-flash-latest')

def gerar_resposta_ia(historico):
    """
    Recebe uma LISTA de mensagens (historico) e gera a resposta.
    Formato esperado: [{'role': 'user', 'parts': ['texto']}, ...]
    """
    try:
        model = configurar_gemini()
        
        # Inicia um chat com o historico que o Frontend mandou
        chat = model.start_chat(history=historico)
        
        # Pega a ultima mensagem do usuario (que esta no fim da lista)
        # Nota: O SDK do Google gerencia o historico se usarmos chat.send_message
        # Mas aqui, como somos Stateless (API), precisamos reconstruir o chat a cada request.
        
        last_msg = historico[-1]['parts'][0]
        
        # Remove a ultima msg do historico 'oficial' do chat para nao duplicar no envio
        # (Truque tecnico: start_chat ja carrega o passado, send_message envia o novo)
        chat_session = model.start_chat(history=historico[:-1])
        
        response = chat_session.send_message(last_msg)
        return response.text
    except Exception as e:
        return f"Erro na Memória: {str(e)}"

```

---

## FILE: \backend\services\ai_core.py
```txt
import os
import google.generativeai as genai
from dotenv import load_dotenv
import time
import random

load_dotenv()

def configurar_gemini():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("ERRO: API Key não encontrada.")
    
    genai.configure(api_key=api_key)
    
    # TÁTICA 1: Usar o modelo 'Experimental'.
    # Geralmente tem menos tráfego que o 'Lite' ou 'Pro'.
    return genai.GenerativeModel('models/gemini-2.0-flash-exp')

def gerar_resposta_ia(historico):
    model = configurar_gemini()
    
    # Prepara o histórico
    chat_history = []
    last_user_msg = ""
    
    for msg in historico:
        role = 'user' if msg['role'] == 'user' else 'model'
        text = msg['parts'][0]
        if msg == historico[-1] and role == 'user':
            last_user_msg = text
            continue
        chat_history.append({"role": role, "parts": [text]})
    
    if not last_user_msg and historico:
        last_user_msg = historico[-1]['parts'][0]

    # TÁTICA 2: RETENTATIVA AUTOMÁTICA (Backoff)
    # Tenta 3 vezes antes de desistir
    max_tentativas = 3
    
    for tentativa in range(max_tentativas):
        try:
            chat = model.start_chat(history=chat_history)
            response = chat.send_message(last_user_msg)
            return response.text

        except Exception as e:
            erro = str(e)
            
            # Se for erro de Cota (429) e não for a última tentativa...
            if "429" in erro and tentativa < max_tentativas - 1:
                tempo_espera = (tentativa + 1) * 5 + random.uniform(0, 2) # Espera 5s, 10s...
                print(f"⚠️ Tráfego alto. Tentativa {tentativa+1}/{max_tentativas}. Esperando {tempo_espera:.1f}s...")
                time.sleep(tempo_espera)
                continue # Tenta de novo loop
            
            # Se falhar todas ou for outro erro:
            if "429" in erro:
                return "⚠️ **SISTEMA OCUPADO:** O servidor da IA está superlotado no momento. Tente novamente em 1 minuto."
            elif "404" in erro:
                 return f"⚠️ **ERRO DE MODELO:** O modelo experimental não está acessível. Detalhe: {erro}"
            else:
                return f"⚠️ **ERRO TÉCNICO:** {erro}"
```

---

## FILE: \backend\services\file_service.py
```txt
import os
from pypdf import PdfReader
from docx import Document

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def salvar_arquivo(arquivo):
    caminho_completo = os.path.join(UPLOAD_FOLDER, arquivo.filename)
    arquivo.save(caminho_completo)
    return caminho_completo

def ler_arquivo(caminho_arquivo):
    """Identifica a extensÃ£o e usa a ferramenta certa"""
    extensao = os.path.splitext(caminho_arquivo)[1].lower()
    
    try:
        if extensao == '.pdf':
            return _ler_pdf(caminho_arquivo)
        elif extensao == '.docx':
            return _ler_docx(caminho_arquivo)
        elif extensao == '.txt' or extensao == '.md':
            return _ler_txt(caminho_arquivo)
        else:
            return "Formato nÃ£o suportado ainda. Envie PDF, DOCX ou TXT."
    except Exception as e:
        return f"Erro ao ler arquivo: {str(e)}"

# --- FunÃ§Ãµes Internas ---

def _ler_pdf(path):
    texto = ""
    reader = PdfReader(path)
    for page in reader.pages:
        texto += page.extract_text() + "\n"
    return texto

def _ler_docx(path):
    doc = Document(path)
    texto = ""
    for para in doc.paragraphs:
        texto += para.text + "\n"
    return texto

def _ler_txt(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()
```

---

## FILE: \docs\checkpoint.md
```markdown
# ðŸ“ Checkpoint do Projeto SaudeCicloDaVida - v0.1

**Data:** $(Get-Date -Format "dd MMMM yyyy")
**Autor:** Manus AI

## ðŸš¦ VisÃ£o Geral

Este checkpoint marca o inÃ­cio formal do projeto "SaudeCicloDaVida" sob a metodologia **Marco Zero**. A estrutura bÃ¡sica do repositÃ³rio foi criada, e os documentos fundamentais estÃ£o sendo estabelecidos.

## ðŸ“‚ MÃ³dulos Implementados (Estrutura)

- `SaudeCicloDaVida/` (pasta raiz)
  - `frontend/`
  - `backend/`
  - `docs/`
  - `sql/`
  - `scripts/`
  - `tests/`
  - `README.md`
  - `checkpoint.md` (este arquivo)

## ðŸ’¡ DecisÃµes TÃ©cnicas

- **Metodologia:** AdoÃ§Ã£o integral do "Guia Mestre Marco Zero v2.0" para governanÃ§a e desenvolvimento.
- **Estrutura de RepositÃ³rio:** PadrÃ£o `frontend/` e `backend/` para separaÃ§Ã£o clara de responsabilidades.

## âš ï¸ Pontos de AtenÃ§Ã£o

- O conteÃºdo dos diretÃ³rios `frontend/` e `backend/` ainda estÃ¡ vazio. SerÃ¡ preenchido nas prÃ³ximas fases.
- O `guia_mestre_marco_zero_v2.0.md` serÃ¡ criado e consolidado na pasta `docs/` em breve.

## ðŸ—ºï¸ Roadmap (PrÃ³ximos Passos)

1.  **Fase 1: EstruturaÃ§Ã£o Inicial**
    *   **Passo 1.1:** Criar a pasta raiz do projeto.
    *   **Passo 1.2:** Criar a estrutura de diretÃ³rios padrÃ£o.
    *   **Passo 1.3:** Criar arquivos de documentaÃ§Ã£o iniciais (README, checkpoint, guia_mestre).
    *   **Passo 1.4:** Inicializar o repositÃ³rio Git e criar a branch `marco-zero`.

---

**PrÃ³ximo Checkpoint:** `checkpoint_v0.2.md` (ApÃ³s configuraÃ§Ã£o inicial do ambiente e criaÃ§Ã£o do Guia Mestre v2.0).

```

---

## FILE: \docs\checkpoint_v1.md
```markdown
# Checkpoint v1 - IntegraÃ§Ã£o Full Stack
**Data:** 20/12/2025
**Status:** âœ… SUCESSO

## Entregas TÃ©cnicas
1. [x] Backend Python/Flask rodando na porta 5000.
2. [x] Frontend React/Vite rodando na porta 5173.
3. [x] ComunicaÃ§Ã£o via Axios estabelecida (CORS ativo).
4. [x] Endpoint `/health` respondendo JSON estruturado.
5. [x] Interface com Glassmorphism aplicada.

## PrÃ³ximo Passo
- Implementar o endpoint `/api/cybertreinaia/process` para conectar com a IA Generativa (Gemini).
```

---

## FILE: \docs\checkpoint_v2.md
```markdown
# Checkpoint v2 - NÃºcleo de InteligÃªncia e MemÃ³ria
**Data:** 20/12/2025
**Status:** âœ… SUCESSO

## Entregas TÃ©cnicas
1. [x] IntegraÃ§Ã£o com Google Gemini (Modelo: gemini-flash-latest).
2. [x] Tratamento de erros de API (404/429) resolvido.
3. [x] Interface de Chat (React) com UX aprimorada (Auto-scroll).
4. [x] **MemÃ³ria de Curto Prazo:** Sistema envia contexto histÃ³rico a cada requisiÃ§Ã£o.

## Teste de ValidaÃ§Ã£o
- **Input:** "Quero ir para a TailÃ¢ndia" -> "Qual a melhor cidade nessa Ã©poca?"
- **Resultado:** A IA manteve o contexto geogrÃ¡fico e temporal.

## PrÃ³ximo Passo
- Implementar RAG (Retrieval-Augmented Generation) para que a IA possa ler PDFs e documentos da empresa, nÃ£o apenas conhecimentos gerais da internet.
```

---

## FILE: \docs\MARCO
```txt
# MARCO ZERO v3.0 - Framework MetodolÃ³gico para Desenvolvimento de Projetos com IA

## 1. INTRODUÃ‡ÃƒO E PREMISSAS FUNDAMENTAIS

### 1.1. PropÃ³sito do Framework
O MARCO ZERO v3.0 Ã© um framework meta-metodolÃ³gico projetado para ser ingerido por Sistemas de IA Generativa. Seu propÃ³sito Ã© estabelecer um protocolo deterministicamente estruturado para a anÃ¡lise, planejamento e execuÃ§Ã£o de projetos de desenvolvimento tecnolÃ³gico, garantindo aderÃªncia contextual, consistÃªncia lÃ³gica e rastreabilidade completa.

### 1.2. Axiomas de Base
- **Axioma 1 (Determinismo Contextual):** Toda aÃ§Ã£o deriva de uma anÃ¡lise semÃ¢ntica profunda do projeto contra este framework.
- **Axioma 2 (Cronologia IrreversÃ­vel):** O tempo Ã© a dimensÃ£o primÃ¡ria de estruturaÃ§Ã£o; todas as tarefas possuem uma relaÃ§Ã£o temporal explÃ­cita.
- **Axioma 3 (Acoplamento Fraco, CoesÃ£o Forte):** MÃ³dulos sÃ£o independentes; processos sÃ£o altamente coesos.
- **Axioma 4 (Rastreabilidade Total):** Toda decisÃ£o Ã© vinculada a uma diretriz do framework ou a um artefato do projeto.

## 2. ESPECIFICAÃ‡Ã•ES DO FRAMEWORK

### 2.1. Estrutura de Camadas LÃ³gicas

### 2.2. Protocolo de IngestÃ£o e CorrelaÃ§Ã£o

#### Fase 1.1: IngestÃ£o Dupla SÃ­ncrona
- **Input A:** Arquivo do Projeto (`projeto.md`)
- **Input B:** Este Framework (`MARCO ZERO v3.0.md`)
- **Processo:** CriaÃ§Ã£o de mapa de embeddings cruzados entre os documentos.

#### Fase 1.2: AnÃ¡lise de CorrelaÃ§Ã£o SemÃ¢ntica
- **Passo 1.2.1:** IdentificaÃ§Ã£o de *Entidades-Chave* no projeto.
- **Passo 1.2.2:** Mapeamento de *Requisitos Funcionais* contra SeÃ§Ã£o 3.1.
- **Passo 1.2.3:** ClassificaÃ§Ã£o de *Requisitos NÃ£o-Funcionais* contra SeÃ§Ã£o 3.2.
- **Passo 1.2.4:** ValidaÃ§Ã£o de *DependÃªncias Externas* contra SeÃ§Ã£o 3.3.

## 3. MATRIZ DE DECISÃƒO PARA PLANEJAMENTO

### 3.1. ClassificaÃ§Ã£o de Requisitos Funcionais

### 3.2. ClassificaÃ§Ã£o de Requisitos NÃ£o-Funcionais

### 3.3. Matriz de DependÃªncias TecnolÃ³gicas
| Tecnologia | PrÃ©-requisitos | Conflitos | PadrÃ£o de ImplementaÃ§Ã£o |
|------------|----------------|-----------|-------------------------|
| Banco SQL  | Schema v1.0    | NoSQL     | DB-PATTERN-001          |
| API REST   | AutenticaÃ§Ã£o   | GraphQL   | API-PATTERN-001         |
| Frontend   | Design System  | -         | UI-PATTERN-001          |

## 4. CRONOGAMA ESTRUTURADO - PROTOCOLO TEMPORAL

### 4.1. Fase Zero: PreparaÃ§Ã£o Ambiental (Dias 1-2)

### 4.2. Fase Alfa: Desenvolvimento do NÃºcleo (Dias 3-10)

### 4.3. Fase Beta: IntegraÃ§Ã£o e ValidaÃ§Ã£o (Dias 11-15)

## 5. PROTOCOLOS DE EXECUÃ‡ÃƒO E VALIDAÃ‡ÃƒO

### 5.1. Protocolo de Desenvolvimento DiÃ¡rio

### 5.2. Matriz de ValidaÃ§Ã£o de Qualidade
| CritÃ©rio | MÃ©trica | Threshold | AÃ§Ã£o Corretiva |
|----------|---------|-----------|----------------|
| Cobertura de CÃ³digo | % linhas cobertas | â‰¥ 80% | Expandir testes |
| Complexidade CiclomÃ¡tica | PontuaÃ§Ã£o | â‰¤ 10 | Refatorar cÃ³digo |
| DÃ©bito TÃ©cnico | Horas estimadas | â‰¤ 8 | Alocar sprint de correÃ§Ã£o |

## 6. FRAMEWORK DE ENTREGAS E ARTEFATOS

### 6.1. Artefatos ObrigatÃ³rios por Fase
- **Fase Zero:** Documento de Arquitetura, Setup de Ambiente
- **Fase Alfa:** CÃ³digo Fonte, Testes UnitÃ¡rios, APIs Documentadas
- **Fase Beta:** RelatÃ³rio de Performance, Manual de ImplantaÃ§Ã£o

### 6.2. CritÃ©rios de AceitaÃ§Ã£o
- [ ] Todos os requisitos funcionais implementados
- [ ] MÃ©tricas de nÃ£o-funcionais dentro dos thresholds
- [ ] DocumentaÃ§Ã£o completa e atualizada
- [ ] Pipeline CI/CD executando com sucesso

## 7. PROTOCOLO DE ATIVAÃ‡ÃƒO DO FRAMEWORK

### 7.1. Gatilho de InicializaÃ§Ã£o

### 7.2. SaÃ­da Esperada
Ao final do processamento inicial, o sistema deve gerar:
1. **Cronograma Contextualizado:** Adaptado Ã s especificidades do projeto
2. **Plano de Desenvolvimento Detalhado:** Com tarefas e dependÃªncias
3. **Matriz de Riscos:** IdentificaÃ§Ã£o proativa de desafios
4. **RecomendaÃ§Ãµes Arquiteturais:** Baseadas nas melhores prÃ¡ticas do framework

---
**FIM DO FRAMEWORK MARCO ZERO v3.0**

```

---

## FILE: \docs\MARCO ZERO v30.txt
```txt
# MARCO ZERO v3.0 - Framework MetodolÃ³gico para Desenvolvimento de Projetos com IA

## 1. INTRODUÃ‡ÃƒO E PREMISSAS FUNDAMENTAIS

### 1.1. PropÃ³sito do Framework
O MARCO ZERO v3.0 Ã© um framework meta-metodolÃ³gico projetado para ser ingerido por Sistemas de IA Generativa. Seu propÃ³sito Ã© estabelecer um protocolo deterministicamente estruturado para a anÃ¡lise, planejamento e execuÃ§Ã£o de projetos de desenvolvimento tecnolÃ³gico, garantindo aderÃªncia contextual, consistÃªncia lÃ³gica e rastreabilidade completa.

### 1.2. Axiomas de Base
- **Axioma 1 (Determinismo Contextual):** Toda aÃ§Ã£o deriva de uma anÃ¡lise semÃ¢ntica profunda do projeto contra este framework.
- **Axioma 2 (Cronologia IrreversÃ­vel):** O tempo Ã© a dimensÃ£o primÃ¡ria de estruturaÃ§Ã£o; todas as tarefas possuem uma relaÃ§Ã£o temporal explÃ­cita.
- **Axioma 3 (Acoplamento Fraco, CoesÃ£o Forte):** MÃ³dulos sÃ£o independentes; processos sÃ£o altamente coesos.
- **Axioma 4 (Rastreabilidade Total):** Toda decisÃ£o Ã© vinculada a uma diretriz do framework ou a um artefato do projeto.

## 2. ESPECIFICAÃ‡Ã•ES DO FRAMEWORK

### 2.1. Estrutura de Camadas LÃ³gicas

### 2.2. Protocolo de IngestÃ£o e CorrelaÃ§Ã£o

#### Fase 1.1: IngestÃ£o Dupla SÃ­ncrona
- **Input A:** Arquivo do Projeto (`projeto.md`)
- **Input B:** Este Framework (`MARCO ZERO v3.0.md`)
- **Processo:** CriaÃ§Ã£o de mapa de embeddings cruzados entre os documentos.

#### Fase 1.2: AnÃ¡lise de CorrelaÃ§Ã£o SemÃ¢ntica
- **Passo 1.2.1:** IdentificaÃ§Ã£o de *Entidades-Chave* no projeto.
- **Passo 1.2.2:** Mapeamento de *Requisitos Funcionais* contra SeÃ§Ã£o 3.1.
- **Passo 1.2.3:** ClassificaÃ§Ã£o de *Requisitos NÃ£o-Funcionais* contra SeÃ§Ã£o 3.2.
- **Passo 1.2.4:** ValidaÃ§Ã£o de *DependÃªncias Externas* contra SeÃ§Ã£o 3.3.

## 3. MATRIZ DE DECISÃƒO PARA PLANEJAMENTO

### 3.1. ClassificaÃ§Ã£o de Requisitos Funcionais

### 3.2. ClassificaÃ§Ã£o de Requisitos NÃ£o-Funcionais

### 3.3. Matriz de DependÃªncias TecnolÃ³gicas
| Tecnologia | PrÃ©-requisitos | Conflitos | PadrÃ£o de ImplementaÃ§Ã£o |
|------------|----------------|-----------|-------------------------|
| Banco SQL  | Schema v1.0    | NoSQL     | DB-PATTERN-001          |
| API REST   | AutenticaÃ§Ã£o   | GraphQL   | API-PATTERN-001         |
| Frontend   | Design System  | -         | UI-PATTERN-001          |

## 4. CRONOGAMA ESTRUTURADO - PROTOCOLO TEMPORAL

### 4.1. Fase Zero: PreparaÃ§Ã£o Ambiental (Dias 1-2)

### 4.2. Fase Alfa: Desenvolvimento do NÃºcleo (Dias 3-10)

### 4.3. Fase Beta: IntegraÃ§Ã£o e ValidaÃ§Ã£o (Dias 11-15)

## 5. PROTOCOLOS DE EXECUÃ‡ÃƒO E VALIDAÃ‡ÃƒO

### 5.1. Protocolo de Desenvolvimento DiÃ¡rio

### 5.2. Matriz de ValidaÃ§Ã£o de Qualidade
| CritÃ©rio | MÃ©trica | Threshold | AÃ§Ã£o Corretiva |
|----------|---------|-----------|----------------|
| Cobertura de CÃ³digo | % linhas cobertas | â‰¥ 80% | Expandir testes |
| Complexidade CiclomÃ¡tica | PontuaÃ§Ã£o | â‰¤ 10 | Refatorar cÃ³digo |
| DÃ©bito TÃ©cnico | Horas estimadas | â‰¤ 8 | Alocar sprint de correÃ§Ã£o |

## 6. FRAMEWORK DE ENTREGAS E ARTEFATOS

### 6.1. Artefatos ObrigatÃ³rios por Fase
- **Fase Zero:** Documento de Arquitetura, Setup de Ambiente
- **Fase Alfa:** CÃ³digo Fonte, Testes UnitÃ¡rios, APIs Documentadas
- **Fase Beta:** RelatÃ³rio de Performance, Manual de ImplantaÃ§Ã£o

### 6.2. CritÃ©rios de AceitaÃ§Ã£o
- [ ] Todos os requisitos funcionais implementados
- [ ] MÃ©tricas de nÃ£o-funcionais dentro dos thresholds
- [ ] DocumentaÃ§Ã£o completa e atualizada
- [ ] Pipeline CI/CD executando com sucesso

## 7. PROTOCOLO DE ATIVAÃ‡ÃƒO DO FRAMEWORK

### 7.1. Gatilho de InicializaÃ§Ã£o

### 7.2. SaÃ­da Esperada
Ao final do processamento inicial, o sistema deve gerar:
1. **Cronograma Contextualizado:** Adaptado Ã s especificidades do projeto
2. **Plano de Desenvolvimento Detalhado:** Com tarefas e dependÃªncias
3. **Matriz de Riscos:** IdentificaÃ§Ã£o proativa de desafios
4. **RecomendaÃ§Ãµes Arquiteturais:** Baseadas nas melhores prÃ¡ticas do framework

---
**FIM DO FRAMEWORK MARCO ZERO v3.0**

```

---

## FILE: \docs\PADROES_VISUAIS_V1.md
```markdown
# ðŸŽ¨ DIRETRIZES DE UI/UX E ARQUITETURA DE MARCA - CONNECTION CYBER OS

> **Status:** V1.1 (Refactor: Tightening & Efficiency)
> **AplicaÃ§Ã£o:** ObrigatÃ³ria em todos os mÃ³dulos (VaultMindOS, AutoZap, etc.)

---

## 1. Arquitetura de Marca (Hierarquia)

O sistema segue o modelo de **Marca Endossada (Endorsed Branding)**.

### A. A Holding (Nave-MÃ£e)
* **Nome:** ConnectionCyberOS
* **RepresentaÃ§Ã£o Visual:** Texto Tricolor estrito.
    * `Connection` -> **Verde** (Emerald-500)
    * `Cyber` -> **Branco** (White)
    * `OS` -> **Vermelho** (Red-600)
* **Logo Asset:** `/public/logo-connection-cyber.png`

### B. Os Produtos (Ecossistema)
* **Produto Atual:** VaultMindOS
* **RepresentaÃ§Ã£o Visual:** Logo PrÃ³prio (Escudo/CÃ©rebro).
* **Logo Asset:** `/public/logo-vaultmind.png`

---

## 2. Design System: "Enterprise Emerald" (Compact Mode)

O visual deve ser corporativo, denso e eficiente. Evitar o "Modo Cinema" (espaÃ§os excessivos) em favor de uma navegaÃ§Ã£o fluida.

### Tipografia & Escala (EquilÃ­brio Corporativo)
* **H1 (Hero):** `text-3xl md:text-4xl` font-extrabold. (NÃ£o usar 5xl/7xl).
* **H2 (SeÃ§Ãµes):** `text-3xl md:text-4xl` font-bold.
* **Corpo:** `text-base` ou `text-lg` (Lead) text-neutral-400.

### EspaÃ§amento & Ritmo (Tightening)
* **Hero Section:** Altura mÃ­nima `min-h-[60vh]` (NÃ£o usar 80vh/100vh).
* **Padding de SeÃ§Ã£o:** PadrÃ£o `py-16` (NÃ£o usar py-24/32).
* **Padding de Topo:** `pt-16` (para compensar Navbar fixa).
* **Margens:** TÃ­tulos `mb-6`, SubtÃ­tulos `mb-8`.

### Paleta de Cores (Tailwind CSS)
| Elemento | Classe Tailwind | Uso |
| :--- | :--- | :--- |
| **Fundo Global** | `bg-neutral-950` | Fundo de todas as pÃ¡ginas. |
| **Cor PrimÃ¡ria** | `text-emerald-500` | Ãcones, Destaques, Links. |
| **BotÃ£o AÃ§Ã£o** | `bg-emerald-600` | CTA Principal. |
| **Bordas** | `border-neutral-800` | DivisÃ³rias e Cards. |

---

## 3. Componentes ObrigatÃ³rios (Building Blocks)

Nunca recriar manualmente esses elementos. Importar os componentes globais.

### A. RodapÃ© Global (`<PoweredByFooter />`)
* **Layout:** Linha Ãšnica (Flex-Row), centralizado.
* **Elementos:** Powered by (Tricolor) + Logo Produto (w-32) + Copyright.
* **REGRA CRÃTICA:** Nunca importar nas pÃ¡ginas (`page.tsx`). Ele deve estar **apenas** no `layout.tsx`.

### B. Cards de Recursos (`<FeatureCard />`)
* **Uso:** ObrigatÃ³rio para listar serviÃ§os, trilhas ou diferenciais.
* **Path:** `@/components/ui/FeatureCard`
* **Props:** `{ title, description, icon }`.

### C. Navbar PÃºblica (`<Navbar />`)
* Deve conter o Logo do Produto (VaultMindOS) e botÃ£o de aÃ§Ã£o.

---

## 4. Regras de CÃ³digo (Desenvolvimento)

1.  **Imagens:** Proibido `<img>`. Usar `import Image from "next/image"`.
2.  **Ãcones:** Usar biblioteca `lucide-react`.
3.  **Layout vs PÃ¡gina:** O `layout.tsx` define a estrutura (Navbar + Footer). O `page.tsx` define apenas o miolo (`<main>`). **Jamais importar Navbar/Footer dentro de page.tsx em rotas pÃºblicas.**

---

**âš ï¸ INSTRUÃ‡ÃƒO PARA IA:** Ao gerar novos layouts, priorize a eficiÃªncia de espaÃ§o (`min-h-[60vh]`, `py-16`) e a consistÃªncia de componentes (`FeatureCard`).
```

---

## FILE: \docs\PROMPT_MESTRE_V1.2.md
```markdown
# ðŸ§  VAULTMIND OS - PROMPT MESTRE DE ARQUITETURA (V1.2)

> **ATENÃ‡ÃƒO:** Este documento define a "Personalidade TÃ©cnica e Visual" da IA para este projeto.
> **ORDEM DE EXECUÃ‡ÃƒO:** Leia este arquivo + o arquivo `PADROES_VISUAIS_V1.md`.

---

## 1. PERSONA E FUNÃ‡ÃƒO
**ATUAR COMO:** Chief Integrated Systems Architect & Senior Dev Full Stack.
**PROJETO:** VaultMindOS (Plataforma de EducaÃ§Ã£o e GestÃ£o Corporativa).
**TOM DE VOZ:** Profissional, TÃ©cnico, Preciso e Seguro (Estilo "Enterprise").

**Atributos Comportamentais:**
* **Protetor:** VocÃª defende a integridade do cÃ³digo. Se o usuÃ¡rio pedir algo que quebre o padrÃ£o (ex: CSS inline), vocÃª alerta e corrige.
* **AnalÃ­tico:** Antes de codar, vocÃª analisa o impacto no sistema global.

---

## 2. A REGRA DE OURO (ESTRUTURA & CAMINHOS)
**CRÃTICO:** O nÃ£o cumprimento desta regra quebra o projeto.
1.  **Raiz Absoluta:** `E:\Projetos\VaultMindOS`
2.  **AplicaÃ§Ã£o Next.js:** `E:\Projetos\VaultMindOS\web`
3.  **DiretÃ³rio de CÃ³digo:** TODO cÃ³digo (componentes, pÃ¡ginas, aÃ§Ãµes) deve residir em `web/src/...`.
4.  **Comandos de Terminal:**
    * Ao sugerir comandos (`npm`, `code`), sempre considere que o usuÃ¡rio pode estar na raiz.
    * Use `cd web` antes de comandos npm.
    * Use o caminho completo para abrir arquivos: `code web/src/...`

**LÃ³gica de Layouts (Next.js 15):**
* `app/(public)/layout.tsx`: ContÃ©m `<Navbar>` e `<PoweredByFooter>`.
* `app/(public)/page.tsx`: ContÃ©m APENAS o conteÃºdo principal (`main`). **NÃ£o importe o Footer aqui.**
* `app/(academy)/layout.tsx`: Layout especÃ­fico para a Ã¡rea logada (Sidebar).

---

## 3. STACK TECNOLÃ“GICA (IMUTÃVEL)
* **Framework:** Next.js 15 (App Router) + TypeScript.
* **Backend/Auth:** Supabase (PostgreSQL) com RLS.
* **EstilizaÃ§Ã£o:** Tailwind CSS + Lucide React.
* **Email:** Resend.
* **Componentes:** Server Components por padrÃ£o.

### 3.1 Arquitetura de FormulÃ¡rios (Strict Mode)
* **Server Actions com Retorno:** Se uma action retorna mensagens (sucesso/erro), ela OBRIGATORIAMENTE deve ser consumida via hook `useActionState`.
* **PadrÃ£o de ImplementaÃ§Ã£o:** Separe sempre em dois arquivos:
    1. `Page.tsx` (Server): Busca dados.
    2. `Form.tsx` (Client): Gerencia o `useActionState` e UI.

---

## 4. CONSTITUIÃ‡ÃƒO VISUAL ("ENTERPRISE EMERALD")
*Consulte `PADROES_VISUAIS_V1.md` para detalhes finos.*

1.  **Paleta:** Fundo `bg-neutral-950` e Acentos `text-emerald-500`.
2.  **Tight Layouts (Compact Mode):** Prefira layouts eficientes (`py-16`, `min-h-[60vh]`).
3.  **ComponentizaÃ§Ã£o:** Reutilize componentes (`FeatureCard`).
4.  **Imagens:** Sempre usar `next/image`.

---

## 5. ESTADO ATUAL E FUNCIONALIDADES CHAVE
* **MÃ³dulo Academy:** Rota `/portal/watch/[slug]`.
* **Holding:** ConnectionCyberOS. Produto: VaultMindOS.
* **Login:** "Acesso Ãšnico ConnectionCyberOS".

---

## 6. PROTOCOLOS DE SEGURANÃ‡A E OPERAÃ‡ÃƒO
1.  **Backup:** Antes de grandes refatoraÃ§Ãµes, lembrar de rodar:
    `.\backup_fisico.ps1` (Na raiz `E:\Projetos`).
2.  **Dados:** Nunca "mockar" IDs. Usar `supabase.auth.getUser()`.
3.  **Server Actions:** Use `"use server"` no topo e trate erros `23505` (duplicidade).

---

## 7. PROTOCOLO DE RESPOSTA (WORKFLOW)
1.  **AnÃ¡lise:** Entenda o contexto (Home, Landing Page, Portal).
2.  **VerificaÃ§Ã£o:** Cheque componentes existentes (`FeatureCard`, `PoweredByFooter`).
3.  **FusÃ£o:** Mantenha o que funciona. NÃ£o reescreva do zero.
4.  **Entrega:** ForneÃ§a o cÃ³digo completo.

---

## 8. PROTOCOLO DE EXECUÃ‡ÃƒO BLINDADA (NOVO)
**CRITÃ‰RIO DE ALTERAÃ‡ÃƒO RIGOROSO:**
As alteraÃ§Ãµes devem ser feitas obedecendo a seguinte granularidade, sem exceÃ§Ãµes:
* MÃ³dulo por MÃ³dulo.
* TÃ³pico por TÃ³pico.
* SessÃ£o por SessÃ£o.
* Passo a Passo (Step-by-Step).
* Linha por Linha.
* Comando a Comando.
* Caminho Exato: Sempre especificar o local discriminado (ex: `web/src/app/...`).

**CRITÃ‰RIO DE PRIORIDADE:**
* Sempre que houver mÃºltiplas opÃ§Ãµes, verificar a **Prioridade TÃ©cnica e CronolÃ³gica**.
* Ã‰ **expressamente proibido** iniciar um mÃ³dulo sem ter validado e consolidado o mÃ³dulo anterior na fila de prioridade.
* A execuÃ§Ã£o deve ser linear e validada a cada etapa.

---

**COMANDO DE INICIALIZAÃ‡ÃƒO:**
Se vocÃª compreendeu sua Persona, a Estrutura de Pastas (WEB) e as Regras Visuais, responda APENAS:
"ðŸš€ **Sistema VaultMindOS Carregado (V1.2).**
- Modo: Senior Architect
- Visual: Enterprise Emerald (Compact) ðŸŸ¢
- Backup: Monitorado ðŸ›¡ï¸
Qual a prÃ³xima missÃ£o, Arquiteto?"
```

---

## FILE: \docs\api\Manual_Integracao.md
```markdown
# Manual de Integracao
Endpoint: POST /api/cybertreinaia/process

```

---

## FILE: \docs\apresentacao\Whitepaper_VaultMindOS.md
```markdown
# ðŸ“„ WHITEPAPER TÃ‰CNICO: VaultMindOS
**VersÃ£o:** 1.0-MVP
**Autor:** Joaquim Mario Soares Coelho
**Data de EmissÃ£o:** 20/12/2025
**Status:** EM DESENVOLVIMENTO

---

## 1. Resumo Executivo
O **VaultMindOS** Ã© uma soluÃ§Ã£o tecnolÃ³gica projetada para resolver problemas complexos atravÃ©s de arquitetura modular. Integra Frontend React, Backend Python e IA Corporativa.

## 2. O Problema
Sistemas tradicionais falham em entregar interoperabilidade e auditabilidade.

## 3. A SoluÃ§Ã£o VaultMindOS
Utiliza a metodologia **Marco Zero** para garantir:
* **GovernanÃ§a Nativa**: Rastreabilidade total.
* **InteligÃªncia HÃ­brida**: Apoio Ã  decisÃ£o via CyberTreinaIA.
* **Design System**: Interface Glassmorphism.

## 4. Arquitetura TÃ©cnica
| Camada | Tecnologia | FunÃ§Ã£o |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Interface (SPA) |
| **Backend** | Python (Flask) | API e Regras |
| **IA Core** | CyberTreinaIA | InteligÃªncia |
| **Dados** | Supabase | Banco de Dados |

## 5. Estrutura do Projeto
\\\	ext
VaultMindOS/
â”œâ”€â”€ frontend/
â”œâ”€â”€ backend/
â”œâ”€â”€ docs/
â””â”€â”€ scripts/
\\\

## 6. Status
- [x] Fase 1: Infraestrutura
- [x] Fase 2: Backend
- [x] Fase 3: Frontend
- [x] Fase 4: IntegraÃ§Ã£o
- [ ] Fase 5: InteligÃªncia Artificial

---
*Gerado automaticamente pelo Sistema de GovernanÃ§a CyberTreinaIA.*

```

---

## FILE: \docs\governanca\Protocolo_Relevancia.yaml
```txt
versao: 1.0
criterios:
  - nome: impacto
    descricao: "Implementacao deve gerar impacto tecnico ou cognitivo mensuravel."
  - nome: custo
    descricao: "Custo de integracao proporcional ao ganho."
decisao:
  aprovado: "Criterios >= 7"
  rejeitado: "Impacto < 7"

```

---

## FILE: \docs\Rascunhos\PROMPT_MESTRE_V1.md
```markdown
# ðŸ§  VAULTMIND OS - PROMPT MESTRE DE ARQUITETURA (V1.2)

> **ATENÃ‡ÃƒO:** Este documento define a "Personalidade TÃ©cnica e Visual" da IA para este projeto.
> **ORDEM DE EXECUÃ‡ÃƒO:** Leia este arquivo + o arquivo `PADROES_VISUAIS_V1.md`.

---

## 1. PERSONA E FUNÃ‡ÃƒO
**ATUAR COMO:** Chief Integrated Systems Architect & Senior Dev Full Stack.
**PROJETO:** VaultMindOS (Plataforma de EducaÃ§Ã£o e GestÃ£o Corporativa).
**TOM DE VOZ:** Profissional, TÃ©cnico, Preciso e Seguro (Estilo "Enterprise").

**Atributos Comportamentais:**
* **Protetor:** VocÃª defende a integridade do cÃ³digo. Se o usuÃ¡rio pedir algo que quebre o padrÃ£o (ex: CSS inline), vocÃª alerta e corrige.
* **AnalÃ­tico:** Antes de codar, vocÃª analisa o impacto no sistema global.

---

## 2. A REGRA DE OURO (ESTRUTURA & CAMINHOS)
**CRÃTICO:** O nÃ£o cumprimento desta regra quebra o projeto.
1.  **Raiz Absoluta:** `E:\Projetos\VaultMindOS`
2.  **AplicaÃ§Ã£o Next.js:** `E:\Projetos\VaultMindOS\web`
3.  **DiretÃ³rio de CÃ³digo:** TODO cÃ³digo (componentes, pÃ¡ginas, aÃ§Ãµes) deve residir em `web/src/...`.
4.  **Comandos de Terminal:**
    * Ao sugerir comandos (`npm`, `code`), sempre considere que o usuÃ¡rio pode estar na raiz.
    * Use `cd web` antes de comandos npm.
    * Use o caminho completo para abrir arquivos: `code web/src/...`

**LÃ³gica de Layouts (Next.js 15):**
* `app/(public)/layout.tsx`: ContÃ©m `<Navbar>` e `<PoweredByFooter>`.
* `app/(public)/page.tsx`: ContÃ©m APENAS o conteÃºdo principal (`main`). **NÃ£o importe o Footer aqui.**
* `app/(academy)/layout.tsx`: Layout especÃ­fico para a Ã¡rea logada (Sidebar).

---

## 3. STACK TECNOLÃ“GICA (IMUTÃVEL)
* **Framework:** Next.js 15 (App Router) + TypeScript.
* **Backend/Auth:** Supabase (PostgreSQL) com RLS.
* **EstilizaÃ§Ã£o:** Tailwind CSS + Lucide React.
* **Email:** Resend.
* **Componentes:** Server Components por padrÃ£o.

### 3.1 Arquitetura de FormulÃ¡rios (Strict Mode)
* **Server Actions com Retorno:** Se uma action retorna mensagens (sucesso/erro), ela OBRIGATORIAMENTE deve ser consumida via hook `useActionState`.
* **PadrÃ£o de ImplementaÃ§Ã£o:** Separe sempre em dois arquivos:
    1. `Page.tsx` (Server): Busca dados.
    2. `Form.tsx` (Client): Gerencia o `useActionState` e UI.

---

## 4. CONSTITUIÃ‡ÃƒO VISUAL ("ENTERPRISE EMERALD")
*Consulte `PADROES_VISUAIS_V1.md` para detalhes finos.*

1.  **Paleta:** Fundo `bg-neutral-950` e Acentos `text-emerald-500`.
2.  **Tight Layouts (Compact Mode):** Prefira layouts eficientes (`py-16`, `min-h-[60vh]`).
3.  **ComponentizaÃ§Ã£o:** Reutilize componentes (`FeatureCard`).
4.  **Imagens:** Sempre usar `next/image`.

---

## 5. ESTADO ATUAL E FUNCIONALIDADES CHAVE
* **MÃ³dulo Academy:** Rota `/portal/watch/[slug]`.
* **Holding:** ConnectionCyberOS. Produto: VaultMindOS.
* **Login:** "Acesso Ãšnico ConnectionCyberOS".

---

## 6. PROTOCOLOS DE SEGURANÃ‡A E OPERAÃ‡ÃƒO
1.  **Backup:** Antes de grandes refatoraÃ§Ãµes, lembrar de rodar:
    `.\backup_fisico.ps1` (Na raiz `E:\Projetos`).
2.  **Dados:** Nunca "mockar" IDs. Usar `supabase.auth.getUser()`.
3.  **Server Actions:** Use `"use server"` no topo e trate erros `23505` (duplicidade).

---

## 7. PROTOCOLO DE RESPOSTA (WORKFLOW)
1.  **AnÃ¡lise:** Entenda o contexto (Home, Landing Page, Portal).
2.  **VerificaÃ§Ã£o:** Cheque componentes existentes (`FeatureCard`, `PoweredByFooter`).
3.  **FusÃ£o:** Mantenha o que funciona. NÃ£o reescreva do zero.
4.  **Entrega:** ForneÃ§a o cÃ³digo completo.

---

**COMANDO DE INICIALIZAÃ‡ÃƒO:**
Se vocÃª compreendeu sua Persona, a Estrutura de Pastas (WEB) e as Regras Visuais, responda APENAS:
"ðŸš€ **Sistema VaultMindOS Carregado (V1.2).**
- Modo: Senior Architect
- Visual: Enterprise Emerald (Compact) ðŸŸ¢
- Backup: Monitorado ðŸ›¡ï¸
Qual a prÃ³xima missÃ£o, Arquiteto?"
```

---

## FILE: \frontend\.gitignore
```txt
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

---

## FILE: \frontend\eslint.config.js
```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])

```

---

## FILE: \frontend\index.html
```txt
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>frontend</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

```

---

## FILE: \frontend\package-lock.json
*[Lockfile/Log - Omitido]*

---

## FILE: \frontend\package.json
```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.13.2",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-markdown": "^10.1.0",
    "remark-gfm": "^4.0.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "vite": "npm:rolldown-vite@7.2.5"
  },
  "overrides": {
    "vite": "npm:rolldown-vite@7.2.5"
  }
}

```

---

## FILE: \frontend\README.md
```markdown
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```

---

## FILE: \frontend\vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

```

---

## FILE: \frontend\public\vite.svg
*[Binario/Midia - Omitido]*

---

## FILE: \frontend\src\App.css
```css
/* Reset bÃ¡sico */
* { box-sizing: border-box; }
body { margin: 0; padding: 0; overflow: hidden; }

/* AnimaÃ§Ã£o do botÃ£o de anexo */
button:active { transform: scale(0.95); }

/* Scrollbar bonita */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
::-webkit-scrollbar-thumb { background: rgba(22, 160, 133, 0.5); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: rgba(22, 160, 133, 0.8); }

/* --- ESTILOS DE MARKDOWN (TABELAS E LISTAS) --- */

/* Garante que o texto nÃ£o "vaze" do balÃ£o */
.markdown-content {
    overflow-wrap: break-word;
    font-size: 0.95rem;
}

.markdown-content p {
    margin-bottom: 10px;
}

/* TÃ­tulos dentro do chat */
.markdown-content h1, 
.markdown-content h2, 
.markdown-content h3 {
    margin-top: 15px;
    margin-bottom: 8px;
    font-weight: 700;
    color: #16A085; /* Verde-Ãgua da sua paleta */
}

/* Listas */
.markdown-content ul, 
.markdown-content ol {
    padding-left: 20px;
    margin-bottom: 10px;
}

/* Negrito */
.markdown-content strong {
    color: #2C3E50;
    font-weight: 700;
}

/* --- TABELAS PROFISSIONAIS --- */
.markdown-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
    font-size: 0.9rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    overflow: hidden; /* Arredonda as bordas da tabela */
}

.markdown-content th {
    background-color: #16A085; /* CabeÃ§alho Verde */
    color: white;
    text-align: left;
    padding: 10px;
    font-weight: bold;
}

.markdown-content td {
    padding: 8px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.markdown-content tr:last-child td {
    border-bottom: none;
}

/* Links */
.markdown-content a {
    color: #F39C12;
    text-decoration: underline;
}
```

---

## FILE: \frontend\src\App.jsx
```javascript
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './App.css'

function App() {
  // --- TEMA "ENERGIA VITAL" (Refinado para Enterprise) ---
  const theme = {
    primary: '#16A085',     // Verde Principal
    secondary: '#F39C12',   // Laranja AÃ§Ã£o
    bgGlobal: '#F4F7F6',    // Fundo Cinza Gelo Profissional
    sidebarBg: '#ffffff',   // Sidebar Branca Clean
    textMain: '#2C3E50',
    textLight: '#ffffff',
    borderColor: 'rgba(0,0,0,0.08)'
  }

  const [input, setInput] = useState('')
  // Mensagem inicial mais curta para dar espaÃ§o aos Cards
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'OlÃ¡. O VaultMindOS estÃ¡ pronto. Selecione uma ferramenta ou envie um documento.' }
  ])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => { scrollToBottom() }, [messages])

  // --- LÃ“GICA DE UPLOAD E CHAT (Mantida idÃªntica) ---
  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessages(prev => [...prev, { 
        sender: 'system', 
        text: `ðŸ“Ž **DOCUMENTO ANEXADO:** "${file.name}"\n\nDados extraÃ­dos e prontos para anÃ¡lise.` 
      }])
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', isError: true, text: 'Erro ao processar arquivo.' }])
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const sendMessage = async (textOverride) => {
    const textToSend = textOverride || input
    if (!textToSend.trim()) return

    const userMsg = { sender: 'user', text: textToSend }
    const currentHistory = messages.filter(m => m.sender !== 'system')
    
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: textToSend,
        history: currentHistory
      })
      const aiMsg = { sender: 'ai', text: response.data.reply }
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', isError: true, text: 'O sistema estÃ¡ sobrecarregado (Cota API). Tente em breve.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  // --- COMPONENTES VISUAIS (Inspirados no Quantumrun) ---
  
  const SidebarItem = ({ icon, label, active }) => (
    <div style={{
      padding: '12px 20px',
      margin: '5px 10px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: '10px',
      color: active ? theme.primary : '#7F8C8D',
      background: active ? '#E8F6F3' : 'transparent',
      fontWeight: active ? '600' : '400',
      transition: 'all 0.2s'
    }}>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <span>{label}</span>
    </div>
  )

  const ActionCard = ({ title, desc, icon }) => (
    <div 
      onClick={() => sendMessage(`Iniciar modo: ${title}`)}
      style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${theme.borderColor}`,
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex', flexDirection: 'column', gap: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)'
      }}
    >
      <div style={{ 
        width: '40px', height: '40px', borderRadius: '8px', 
        background: '#E8F6F3', color: theme.primary, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' 
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '0.95rem', color: theme.textMain }}>{title}</h3>
        <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#7F8C8D' }}>{desc}</p>
      </div>
    </div>
  )

  return (
    <div style={{ 
      width: '100vw', height: '100vh', 
      background: theme.bgGlobal, 
      color: theme.textMain,
      display: 'flex', 
      fontFamily: "'Segoe UI', 'Roboto', sans-serif"
    }}>
      
      {/* 1. SIDEBAR (NavegaÃ§Ã£o Profissional) */}
      <div style={{
        width: '260px',
        background: theme.sidebarBg,
        borderRight: `1px solid ${theme.borderColor}`,
        display: 'flex', flexDirection: 'column',
        zIndex: 20
      }}>
        {/* Logo Area */}
        <div style={{ padding: '25px 20px', borderBottom: `1px solid ${theme.borderColor}` }}>
          <h1 style={{ margin: 0, fontSize: '1.2rem', color: theme.primary, letterSpacing: '-0.5px' }}>
            ðŸŒ¿ VaultMind<span style={{fontWeight:'300'}}>OS</span>
          </h1>
          <span style={{ fontSize: '0.7rem', color: '#95A5A6', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Enterprise Edition
          </span>
        </div>

        {/* Menu Items */}
        <div style={{ padding: '20px 0', flex: 1 }}>
          <SidebarItem icon="ðŸ“Š" label="Dashboard" active />
          <SidebarItem icon="ðŸ“‚" label="Meus Arquivos" />
          <SidebarItem icon="ðŸ§ " label="MemÃ³ria Ativa" />
          <SidebarItem icon="âš™ï¸" label="ConfiguraÃ§Ãµes" />
        </div>

        {/* User Profile (Fake) */}
        <div style={{ padding: '20px', borderTop: `1px solid ${theme.borderColor}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: theme.secondary, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>J</div>
          <div style={{ fontSize: '0.85rem' }}>
            <div style={{ fontWeight: '600' }}>Joaquim</div>
            <div style={{ color: '#95A5A6', fontSize: '0.75rem' }}>Admin Pro</div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT (Ãrea de Trabalho) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Header Simples */}
        <div style={{ 
          height: '60px', background: 'white', borderBottom: `1px solid ${theme.borderColor}`,
          display: 'flex', alignItems: 'center', padding: '0 30px', justifyContent: 'space-between'
        }}>
          <span style={{ fontWeight: '600', color: theme.textMain }}>Nova AnÃ¡lise de Documento</span>
          <span style={{ fontSize: '0.8rem', color: theme.primary, background: '#E8F6F3', padding: '5px 10px', borderRadius: '15px' }}>
             â— Sistema Online
          </span>
        </div>

        {/* Ãrea de Scroll do Chat */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* CARDS DE AÃ‡ÃƒO (Estilo Quantumrun) - SÃ³ aparecem no inicio */}
          {messages.length < 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
              <ActionCard icon="ðŸ“„" title="Resumir Documento" desc="Extrair pontos chave de PDFs." />
              <ActionCard icon="ðŸ›¡ï¸" title="Auditoria de Risco" desc="Avaliar seguranÃ§a do texto." />
              <ActionCard icon="ðŸ’¡" title="IdeaÃ§Ã£o EstratÃ©gica" desc="Criar planos baseados em dados." />
            </div>
          )}

          {/* Mensagens */}
          {messages.map((msg, index) => (
            <div key={index} style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : (msg.sender === 'system' ? 'center' : 'flex-start'),
              maxWidth: msg.sender === 'system' ? '90%' : '80%',
              background: msg.sender === 'user' ? theme.primary : (msg.sender === 'system' ? '#E8F6F3' : 'white'),
              color: msg.sender === 'user' ? 'white' : theme.textMain,
              padding: '15px 25px',
              borderRadius: '12px',
              border: msg.sender === 'user' ? 'none' : `1px solid ${theme.borderColor}`,
              boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
              borderLeft: msg.isError ? `4px solid ${theme.secondary}` : undefined
            }}>
              {msg.sender !== 'system' && (
                <div style={{ fontSize: '0.75rem', marginBottom: '5px', opacity: 0.7, fontWeight: 'bold' }}>
                  {msg.sender === 'user' ? 'VOCÃŠ' : 'VAULTMIND AI'}
                </div>
              )}
              <div className="markdown-content">
                {msg.sender === 'user' ? msg.text : <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>}
              </div>
            </div>
          ))}
          {loading && <div style={{ color: '#95A5A6', fontStyle: 'italic', paddingLeft: '10px' }}>Processando dados...</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '20px 30px', background: 'white', borderTop: `1px solid ${theme.borderColor}`, display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button 
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            style={{ 
              background: '#F4F6F7', border: 'none', width: '45px', height: '45px', 
              borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem', color: '#7F8C8D',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.background = '#E5E8E8'}
            onMouseOut={e => e.currentTarget.style.background = '#F4F6F7'}
          >
            ðŸ“Ž
          </button>
          
          <input 
            type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx,.txt,.md" style={{ display: 'none' }} 
          />

          <input 
            value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress}
            placeholder={uploading ? "Analisando arquivo..." : "Digite seu comando ou pergunte sobre o documento..."}
            disabled={uploading}
            style={{
              flex: 1, padding: '15px', borderRadius: '8px', background: '#F4F6F7',
              border: '1px solid transparent', outline: 'none', color: theme.textMain
            }}
            onFocus={e => { e.target.style.background = 'white'; e.target.style.borderColor = theme.primary }}
            onBlur={e => { e.target.style.background = '#F4F6F7'; e.target.style.borderColor = 'transparent' }}
          />
          
          <button 
            onClick={() => sendMessage()} disabled={uploading}
            style={{
              padding: '0 25px', height: '45px', borderRadius: '8px', background: theme.primary,
              color: 'white', fontWeight: '600', border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(22, 160, 133, 0.3)'
            }}
          >
            ENVIAR
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
```

---

## FILE: \frontend\src\index.css
```css
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}

```

---

## FILE: \frontend\src\main.jsx
```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

---

## FILE: \frontend\src\assets\react.svg
*[Binario/Midia - Omitido]*

---

## FILE: \scripts\generate_whitepaper.ps1
```txt
<#
.SYNOPSIS
Gerador AutomÃ¡tico de Whitepaper TÃ©cnico (PadrÃ£o CyberTreinaIA)
#>

param (
    [string]$ProjectName = "VaultMindOS",
    [string]$Version = "1.0",
    [string]$Author = "Joaquim Mario Soares Coelho"
)

# 1. Definir Nome e Caminho do Arquivo
$fileName = "Whitepaper_$($ProjectName).md"
$outputDir = "docs\apresentacao"
$fullPath = Join-Path $outputDir $fileName

# 2. Criar DiretÃ³rio se nÃ£o existir
if (!(Test-Path $outputDir)) { New-Item -ItemType Directory -Force -Path $outputDir | Out-Null }

# 3. ConteÃºdo do Template
$content = @"
# ðŸ“„ WHITEPAPER TÃ‰CNICO: $ProjectName
**VersÃ£o:** $Version
**Autor:** $Author
**Data de EmissÃ£o:** $(Get-Date -Format "dd/MM/yyyy")
**Status:** EM DESENVOLVIMENTO

---

## 1. Resumo Executivo
O **$ProjectName** Ã© uma soluÃ§Ã£o tecnolÃ³gica projetada para resolver problemas complexos atravÃ©s de arquitetura modular. Integra Frontend React, Backend Python e IA Corporativa.

## 2. O Problema
Sistemas tradicionais falham em entregar interoperabilidade e auditabilidade.

## 3. A SoluÃ§Ã£o $ProjectName
Utiliza a metodologia **Marco Zero** para garantir:
* **GovernanÃ§a Nativa**: Rastreabilidade total.
* **InteligÃªncia HÃ­brida**: Apoio Ã  decisÃ£o via CyberTreinaIA.
* **Design System**: Interface Glassmorphism.

## 4. Arquitetura TÃ©cnica
| Camada | Tecnologia | FunÃ§Ã£o |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Interface (SPA) |
| **Backend** | Python (Flask) | API e Regras |
| **IA Core** | CyberTreinaIA | InteligÃªncia |
| **Dados** | Supabase | Banco de Dados |

## 5. Estrutura do Projeto
\`\`\`text
$ProjectName/
â”œâ”€â”€ frontend/
â”œâ”€â”€ backend/
â”œâ”€â”€ docs/
â””â”€â”€ scripts/
\`\`\`

## 6. Status
- [x] Fase 1: Infraestrutura
- [x] Fase 2: Backend
- [x] Fase 3: Frontend
- [x] Fase 4: IntegraÃ§Ã£o
- [ ] Fase 5: InteligÃªncia Artificial

---
*Gerado automaticamente pelo Sistema de GovernanÃ§a CyberTreinaIA.*
"@

# 4. Gravar o Arquivo
Set-Content -Path $fullPath -Value $content -Encoding UTF8
Write-Host "âœ… Whitepaper gerado com sucesso em: $fullPath" -ForegroundColor Green
```

---

## FILE: \scripts\verify_env.py
```txt
import sys
import subprocess
import re
import shutil
import platform

# --- CONFIGURAÃ‡ÃƒO DE GOVERNANÃ‡A (CORES E ESTILO) ---
class Style:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_banner():
    print(f"{Style.HEADER}{Style.BOLD}")
    print("=" * 70)
    print("   ðŸ›¡ï¸  CyberTreinaIA - VERIFICADOR DE AMBIENTE (SVA) v3.1 (NATIVE)")
    print("   PROJETO: VAULTMINDOS | GOVERNANÃ‡A: ATIVA")
    print("=" * 70)
    print(f"{Style.ENDC}")

def normalize_version(v_str):
    """
    Converte string de versÃ£o '1.2.3' para tupla (1, 2, 3) usando apenas RegEx nativo.
    Remove sufixos nÃ£o numÃ©ricos para comparaÃ§Ã£o segura.
    """
    try:
        # Pega apenas nÃºmeros e pontos
        clean_v = re.sub(r'[^0-9.]', '', v_str)
        # Divide por ponto e converte para inteiro
        return tuple(map(int, clean_v.split('.')))
    except ValueError:
        return (0, 0, 0)

def check_version(current, required):
    """Compara versÃµes semÃ¢nticas sem dependÃªncias externas."""
    return normalize_version(current) >= normalize_version(required)

def get_binary_version(command, regex_pattern):
    """Executa um comando e extrai a versÃ£o usando Regex."""
    try:
        result = subprocess.run(
            command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True
        )
        if result.returncode != 0:
            return None
        
        output = result.stdout.strip()
        # Se stdout estiver vazio, tenta stderr (algumas ferramentas jogam versÃ£o no stderr)
        if not output:
            output = result.stderr.strip()

        match = re.search(regex_pattern, output)
        if match:
            return match.group(1)
        return None
    except Exception:
        return None

def audit_tool(name, check_cmd, regex, min_version=None):
    """Audita uma ferramenta especÃ­fica."""
    print(f"Auditando {name.ljust(20, '.')} ", end="")
    
    # 1. Verifica se existe no PATH
    cmd_base = check_cmd.split()[0]
    if not shutil.which(cmd_base):
        print(f"{Style.FAIL}[CRÃTICO - NÃƒO ENCONTRADO]{Style.ENDC}")
        return False

    # 2. Verifica VersÃ£o
    detected_ver = get_binary_version(check_cmd, regex)
    
    if not detected_ver:
        print(f"{Style.FAIL}[ERRO DE LEITURA]{Style.ENDC}")
        return False

    # 3. Valida VersÃ£o MÃ­nima
    if min_version:
        if check_version(detected_ver, min_version):
            print(f"{Style.GREEN}[OK] v{detected_ver}{Style.ENDC}")
            return True
        else:
            print(f"{Style.FAIL}[OBSOLETO]{Style.ENDC} (Atual: {detected_ver} | Req: {min_version}+)")
            return False
    else:
        print(f"{Style.GREEN}[OK] v{detected_ver}{Style.ENDC}")
        return True

def main():
    print_banner()
    
    # Sistema Operacional
    print(f"Sistema Operacional: {Style.CYAN}{platform.system()} {platform.release()}{Style.ENDC}\n")
    print(f"{Style.BOLD}--- 1. ARSENAL TECNOLÃ“GICO (VALIDAÃ‡ÃƒO DE BINÃRIOS) ---{Style.ENDC}")

    global_status = True

    # 1. PYTHON (3.10+)
    py_ver = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    print(f"Auditando Python................ ", end="")
    if sys.version_info >= (3, 10):
        print(f"{Style.GREEN}[OK] v{py_ver}{Style.ENDC}")
    else:
        print(f"{Style.FAIL}[ERRO] v{py_ver} (Requer 3.10+){Style.ENDC}")
        global_status = False

    # 2. NODE.JS (18+)
    if not audit_tool("Node.js", "node --version", r"v(\d+\.\d+\.\d+)", "18.0.0"):
        global_status = False

    # 3. NPM
    if not audit_tool("Npm", "npm --version", r"(\d+\.\d+\.\d+)", None):
        global_status = False

    # 4. GIT
    if not audit_tool("Git", "git --version", r"version (\d+\.\d+\.\d+)", None):
        global_status = False

    # 5. DOCKER (CRÃTICO)
    print(f"Auditando Docker................ ", end="")
    docker_ver = get_binary_version("docker --version", r"version (\d+\.\d+\.\d+)")
    
    if docker_ver:
        # Tenta verificar se o Docker estÃ¡ rodando (Engine)
        try:
            subprocess.run("docker ps", stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True, shell=True)
            print(f"{Style.GREEN}[OK] v{docker_ver} (Engine Ativo){Style.ENDC}")
        except subprocess.CalledProcessError:
            print(f"{Style.WARNING}[ALERTA]{Style.ENDC} Instalado v{docker_ver}, mas o Docker Desktop parece fechado.")
            print(f"    {Style.CYAN}AÃ§Ã£o:{Style.ENDC} Inicie o Docker Desktop para habilitar containers.")
            # Alerta, mas nÃ£o bloqueia hard se instalado
    else:
        print(f"{Style.FAIL}[NÃƒO INSTALADO]{Style.ENDC}")
        print(f"    {Style.CYAN}AÃ§Ã£o:{Style.ENDC} Instale Docker Desktop imediatamente.")
        global_status = False

    print("\n" + "="*70)
    if global_status:
        print(f"{Style.GREEN}âœ… STATUS VERDE: AMBIENTE VALIDADO. AUTORIZADO A PROSSEGUIR.{Style.ENDC}")
        sys.exit(0)
    else:
        print(f"{Style.FAIL}ðŸ›‘ STATUS VERMELHO: AMBIENTE CORROMPIDO OU INCOMPLETO.{Style.ENDC}")
        print("   AÃ‡ÃƒO NECESSÃRIA: Corrija as dependÃªncias listadas acima.")
        sys.exit(1)

if __name__ == "__main__":
    main()
```

---

## FILE: \src\app\(academy)\portal\profile\ProfileForm.tsx
```typescript
"use client";

import { useActionState } from "react";
import { updateProfile } from "./actions";
import { Save, Mail, Shield, Loader2 } from "lucide-react";

interface ProfileFormProps {
  fullName: string;
  email: string;
}

export function ProfileForm({ fullName, email }: ProfileFormProps) {
  // Hook para gerenciar o estado da Server Action (Loading, Sucesso, Erro)
  const [state, action, isPending] = useActionState(updateProfile, null);

  return (
    <form action={action} className="space-y-5">
      {/* Feedback de Sucesso/Erro (InjeÃ§Ã£o Funcional) */}
      {state?.message && (
        <div className={`p-3 rounded-lg text-xs font-bold border ${
          state.success 
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
            : 'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          {state.message}
        </div>
      )}

      {/* Campo Nome */}
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase">Nome Completo</label>
        <input 
          type="text" 
          name="fullName"
          defaultValue={fullName}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-neutral-700"
          placeholder="Como vocÃª quer ser chamado"
        />
      </div>
      
      {/* Campo Email (Somente Leitura) */}
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase">E-mail de Acesso</label>
        <div className="relative">
            <input 
              type="text" 
              value={email} 
              disabled 
              className="w-full bg-neutral-950/50 border border-neutral-800/50 rounded-lg px-4 py-3 text-neutral-500 cursor-not-allowed pl-10"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
        </div>
        <p className="text-[10px] text-neutral-600 mt-2 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Gerenciado pela ConnectionCyberOS Identity
        </p>
      </div>

      {/* BotÃ£o de Salvar com Loading State */}
      <div className="pt-4 flex justify-end">
        <button 
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-emerald-900/20 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isPending ? "Salvando..." : "Salvar AlteraÃ§Ãµes"}
        </button>
      </div>
    </form>
  );
}
```

---

## FILE: \web\.env.local
```txt
NEXT_PUBLIC_SUPABASE_URL=https://rrzyurigafcqikjycven.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyenl1cmlnYWZjcWlranljdmVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNDg5NTcsImV4cCI6MjA4MzkyNDk1N30.gNTLkYWO7XSF1EEmjabEEWaKinYqNOypqIEn9mL0z3E
RESEND_API_KEY=re_SKwaJdhZ_MPuy1edMRz7RPeMkDgzg99Nc
```

---

## FILE: \web\.gitignore
```txt
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

.vercel

```

---

## FILE: \web\eslint.config.mjs
```txt
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

```

---

## FILE: \web\next-env.d.ts
```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

---

## FILE: \web\next.config.ts
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;

```

---

## FILE: \web\package-lock.json
*[Lockfile/Log - Omitido]*

---

## FILE: \web\package.json
```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@supabase/ssr": "^0.8.0",
    "@supabase/supabase-js": "^2.90.1",
    "lucide-react": "^0.563.0",
    "next": "16.1.1",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "resend": "^6.9.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "babel-plugin-react-compiler": "1.0.0",
    "eslint": "^9",
    "eslint-config-next": "16.1.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}

```

---

## FILE: \web\postcss.config.mjs
```txt
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

```

---

## FILE: \web\README.md
```markdown
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```

---

## FILE: \web\schema.prisma
```txt
// 1. ConfiguraÃ§Ãµes do Gerador e Fonte de Dados
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Importante para Migrations no Supabase
}

// 2. Enums (Tipagem Forte para Regras de NegÃ³cio)
enum UserRole {
  SUPER_ADMIN // VocÃª (Acesso Total)
  ARCHITECT   // Perfil TÃ©cnico
  DOCTOR      // MÃ³dulo SaÃºde
  AFFILIATE   // MÃ³dulo Marketing/Vendas
  USER        // UsuÃ¡rio Final
}

enum SubscriptionTier {
  FREE
  PRO
  ENTERPRISE
}

// 3. Tabela Mestra de Perfis (Vinculada ao Supabase Auth)
model Profile {
  id          String   @id @default(uuid()) // Este ID deve bater com o auth.users.id do Supabase
  email       String   @unique
  fullName    String?
  avatarUrl   String?
  role        UserRole @default(USER)
  tier        SubscriptionTier @default(FREE)
  
  // Auditoria
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos (Arquitetura Modular)
  // MÃ³dulo SaÃºde
  doctorProfile DoctorProfile? 
  patients      Patient[]
  
  // MÃ³dulo Marketing/Varejo
  campaigns     MarketingCampaign[]
  products      Product[]

  @@map("profiles") // Nome da tabela no banco (lowercase)
}

// --- MÃ“DULO 1: SAÃšDE CICLO DA VIDA ---

model DoctorProfile {
  id             String  @id @default(cuid())
  crm            String  @unique // Registro MÃ©dico
  specialty      String
  profileId      String  @unique
  profile        Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  
  @@map("doctor_profiles")
}

model Patient {
  id             String   @id @default(cuid())
  name           String
  birthDate      DateTime
  clinicalNotes  String?  @db.Text
  
  // Quem cadastrou este paciente? (MÃ©dico ou Admin)
  managedById    String
  managedBy      Profile  @relation(fields: [managedById], references: [id])

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("patients")
}

// --- MÃ“DULO 2: MARKETING & VAREJO (AutoZap/Digistore) ---

model MarketingCampaign {
  id          String   @id @default(cuid())
  name        String
  platform    String   // Ex: Facebook, Google, YouTube
  status      String   @default("DRAFT") // DRAFT, ACTIVE, PAUSED
  budget      Decimal  @db.Decimal(10, 2)
  
  ownerId     String
  owner       Profile  @relation(fields: [ownerId], references: [id])

  createdAt   DateTime @default(now())
  
  @@map("marketing_campaigns")
}

model Product {
  id          String   @id @default(cuid())
  title       String
  price       Decimal  @db.Decimal(10, 2)
  affiliateLink String? // Link do Digistore24/ClickBank
  
  sellerId    String
  seller      Profile  @relation(fields: [sellerId], references: [id])

  createdAt   DateTime @default(now())

  @@map("products")
}
```

---

## FILE: \web\tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}

```

---

## FILE: \web\VAULTMIND_BLUEPRINT_MASTER.md
```markdown
# ðŸ›ï¸ VAULTMIND OS - BLUEPRINT TÃ‰CNICO MESTRE (v1.0)
> **ClassificaÃ§Ã£o:** Documento Vivo de Arquitetura e GovernanÃ§a
> **Norma:** PGT-01 (Extremo Zero)
> **Stack:** NestJS + Next.js + React Native + Python Automation

---

## 1. ðŸ›¡ï¸ CONSTITUIÃ‡ÃƒO E GOVERNANÃ‡A (A Lei do Projeto)

### 1.1. O PrincÃ­pio "Extremo Zero" (ClÃ¡usula PÃ©trea)
Para garantir a estabilidade absoluta do VaultMindOS, Ã© **ESTRITAMENTE PROIBIDO** realizar remendos ou ediÃ§Ãµes parciais em arquivos que apresentem falhas estruturais.
1.  **Detectou Erro?** NÃ£o corrija a linha.
2.  **AÃ§Ã£o:** Gere o arquivo inteiro novamente com a correÃ§Ã£o.
3.  **SubstituiÃ§Ã£o:** Apague o arquivo antigo -> Crie o novo -> Cole o cÃ³digo.

### 1.2. Protocolo de InÃ­cio de Trabalho (POP-001)
Nenhum desenvolvedor (Humano ou IA) estÃ¡ autorizado a escrever cÃ³digo sem antes validar o terreno.
**Rotina ObrigatÃ³ria:**
1.  Abrir terminal na raiz: `P:\Projetos\VaultMindOS`
2.  Executar auditoria: `python scripts/verify_env.py`
3.  **Resultado VERDE?** Autorizado.
4.  **Resultado VERMELHO?** Proibido continuar. Instale as dependÃªncias faltantes.

### 1.3. PadronizaÃ§Ã£o de Arquivos (Header Protocol)
Todo arquivo (`.ts`, `.tsx`, `.py`) deve iniciar com este cabeÃ§alho:

```typescript
/*
-------------------------------------------------------------------------
PROJETO: VAULTMIND OS (ENTERPRISE EDITION)
ARQUITETURA: FULL STACK (NestJS + React Native + Next.js)
GOVERNANÃ‡A: PGT-01 (NORMA EXTREMO ZERO)
-------------------------------------------------------------------------
MÃ“DULO: [Caminho/Nome do Arquivo]
DESCRIÃ‡ÃƒO: [FunÃ§Ã£o tÃ©cnica do componente]
-------------------------------------------------------------------------
*/
```

---

## FILE: \web\public\file.svg
*[Binario/Midia - Omitido]*

---

## FILE: \web\public\globe.svg
*[Binario/Midia - Omitido]*

---

## FILE: \web\public\logo-connection-cyber.png
*[Binario/Midia - Omitido]*

---

## FILE: \web\public\logo-vaultmind.png
*[Binario/Midia - Omitido]*

---

## FILE: \web\public\next.svg
*[Binario/Midia - Omitido]*

---

## FILE: \web\public\vercel.svg
*[Binario/Midia - Omitido]*

---

## FILE: \web\public\window.svg
*[Binario/Midia - Omitido]*

---

## FILE: \web\public\ConnectionCyberOS\LogoOficial ConnectionCyberOS.jpg
*[Binario/Midia - Omitido]*

---

## FILE: \web\public\ConnectionCyberOS\LogoOficial_ConnectionCyberOS-Fundo.png
*[Binario/Midia - Omitido]*

---

## FILE: \web\public\VaultMindOS\LogoOficial VaultMindOS.jpg
*[Binario/Midia - Omitido]*

---

## FILE: \web\scripts\verify_env.py
```txt
import subprocess
import sys
import os

# CABEÇALHO PADRÃO PGT-01
# PROJETO: VAULTMIND OS (ENTERPRISE EDITION)
# ARQUITETURA: PYTHON SCRIPT
# GOVERNANÇA: PGT-01 (NORMA EXTREMO ZERO)

def print_header(text):
    print(f"\n\033[1;36m{text}\033[0m")

def check_command(command):
    try:
        cmd_run = command
        if command == "npm":
            cmd_run = "npm.cmd" 
            
        if command == "python":
            cmd_list = ["python", "--version"]
        else:
            cmd_list = [cmd_run, "--version"]
            
        result = subprocess.run(cmd_list, capture_output=True, text=True, check=True)
        version = result.stdout.strip()
        print(f"[OK] {command.upper()}: Detectado ({version})")
        return True
    except Exception as e:
        print(f"\033[1;31m[ERRO] {command.upper()} nao encontrado. ({e})\033[0m")
        return False

def check_file(filepath):
    if os.path.exists(filepath):
        print(f"[OK] Arquivo: {filepath}")
        return True
    else:
        print(f"\033[1;31m[ERRO] Arquivo Ausente: {filepath}\033[0m")
        return False

def main():
    print("\033[1;34m---------------------------------------------------------")
    print(" SVA v1.1 - VAULTMIND OS | VERIFICACAO DE AMBIENTE")
    print(" Governanca: Extremo Zero")
    print("---------------------------------------------------------\033[0m")
    
    all_systems_go = True

    print_header("1. CHECKLIST DE FERRAMENTAS BASE")
    tools = ["python", "node", "git", "npm"]
    for tool in tools:
        if not check_command(tool):
            all_systems_go = False

    print_header("2. INTEGRIDADE DOS ARQUIVOS (Restaurados)")
    critical_files = [
        "package.json",
        "next.config.ts",
        "src/app/layout.tsx",
        "src/app/page.tsx",
        "src/middleware.ts"
    ]
    
    for f in critical_files:
        if not check_file(f):
            all_systems_go = False

    print("\n---------------------------------------------------------")
    if all_systems_go:
        print("\033[1;32m✅ STATUS VERDE: AMBIENTE RESTAURADO E SEGURO.\033[0m")
        sys.exit(0)
    else:
        print("\033[1;31m🛑 STATUS VERMELHO: FALHA NA RESTAURAÇÃO.\033[0m")
        sys.exit(1)

if __name__ == "__main__":
    main()

```

---

## FILE: \web\src\middleware.ts
```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Atualiza o token do Supabase (renovação automática)
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas, EXCETO:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico (ícone)
     * - imagens (jpg, png, svg, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

```

---

## FILE: \web\src\app\actions.ts
```typescript
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

```

---

## FILE: \web\src\app\favicon.ico
*[Binario/Midia - Omitido]*

---

## FILE: \web\src\app\global - Copia.css
```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

```

---

## FILE: \web\src\app\globals - Copia.css
```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

```

---

## FILE: \web\src\app\globals.css
```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

```

---

## FILE: \web\src\app\layout.tsx
```typescript
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SystemStatus from "@/components/SystemStatus";
import BackgroundVideo from "@/components/BackgroundVideo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "VaultMindOS | Enterprise Intelligence",
  description: "Sistema de Gestão Modular e Inteligência de Dados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning={true}>
      <body
        className={`${inter.variable} ${mono.variable} antialiased text-slate-200 bg-transparent`}
        suppressHydrationWarning={true}
      >
        {/* Componentes Globais do VaultMindOS */}
        <BackgroundVideo />

        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>

        <SystemStatus />
      </body>
    </html>
  );
}

```

---

## FILE: \web\src\app\(academy)\layout.tsx
```typescript
import Link from "next/link";
import Image from "next/image";
import { PlayCircle, Award, Layout, LogOut, Search, Bell, User } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let avatarUrl = null;
  if (user) {
      const { data: profile } = await supabase.from("profiles").select("avatar_url").eq("id", user.id).single();
      avatarUrl = profile?.avatar_url;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500/30 flex">
      
      {/* SIDEBAR DE NAVEGAÇÃO (Esquerda) */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col z-50 transition-all">
        
        {/* Logo Area (VaultMindOS) */}
        <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-neutral-800 bg-neutral-900/20">
          <Link href="/portal" className="relative w-40 h-10 hidden md:block opacity-90 hover:opacity-100 transition-opacity">
             <Image 
                src="/logo-vaultmind.png" 
                alt="VaultMindOS" 
                fill 
                className="object-contain object-left"
                priority
             />
          </Link>
          {/* Logo Mobile (Ícone) */}
          <div className="md:hidden w-10 h-10 relative">
             <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-white">V</div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-8 flex flex-col gap-2 px-2 md:px-4">
          <Link href="/portal" className="flex items-center gap-4 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-xl transition-all group">
            <PlayCircle className="w-5 h-5 group-hover:text-emerald-500 transition-colors" />
            <span className="hidden md:block font-medium text-sm">Início</span>
          </Link>
          
          <Link href="/portal/meus-cursos" className="flex items-center gap-4 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-xl transition-all group">
            <Layout className="w-5 h-5 group-hover:text-emerald-500 transition-colors" />
            <span className="hidden md:block font-medium text-sm">Minha Lista</span>
          </Link>

          <Link href="/portal/certificados" className="flex items-center gap-4 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-xl transition-all group">
            <Award className="w-5 h-5 group-hover:text-emerald-500 transition-colors" />
            <span className="hidden md:block font-medium text-sm">Certificados</span>
          </Link>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-neutral-800">
          <form action="/auth/signout" method="post">
            <button className="w-full flex items-center gap-4 px-4 py-3 text-neutral-500 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="hidden md:block font-medium text-sm">Sair</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL (Conteúdo) */}
      <main className="flex-1 ml-20 md:ml-64 relative bg-neutral-950">
        
        {/* Topbar Flutuante */}
        <header className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-neutral-950 via-neutral-950/80 to-transparent z-40 flex items-center justify-end px-8 gap-6 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-4">
              <button className="text-neutral-400 hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-neutral-400 hover:text-white relative transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </button>
              
              {/* Avatar do Usuário */}
              <Link href="/portal/profile">
                <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden hover:border-emerald-500 transition-colors cursor-pointer relative">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-500">
                            <User className="w-5 h-5" />
                        </div>
                    )}
                </div>
              </Link>
          </div>
        </header>

        {/* Injeção das Páginas */}
        {children}
      </main>
    </div>
  );
}
```

---

## FILE: \web\src\app\(academy)\portal\actions.ts
```typescript
'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Alterna o status de conclusÃ£o de uma aula (ConcluÃ­da/NÃ£o ConcluÃ­da)
 * @param lessonId - ID da aula
 * @param currentStatus - Status ATUAL (true/false). A funÃ§Ã£o vai inverter.
 * @param path - O caminho da pÃ¡gina atual para recarregar (ex: /portal/watch/gestao-agil)
 */
export async function toggleLessonProgress(lessonId: string, currentStatus: boolean, path: string) {
  const supabase = await createClient();

  // 1. SeguranÃ§a: Quem estÃ¡ tentando salvar?
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("Tentativa de salvar progresso sem usuÃ¡rio logado");
    return;
  }

  // 2. LÃ³gica: Inverte o status (Toggle)
  const newStatus = !currentStatus;

  // 3. Banco de Dados: UPSERT (Inserir ou Atualizar)
  // GraÃ§as Ã  chave composta (user_id, lesson_id), ele sabe qual linha atualizar.
  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: user.id,
      lesson_id: lessonId,
      is_completed: newStatus,
      last_watched_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id, lesson_id'
    });

  if (error) {
    console.error("Erro ao salvar progresso:", error.message);
    throw new Error("Falha ao atualizar progresso");
  }

  // 4. UX: Revalida o Cache
  // Isso faz o Next.js atualizar o Ã­cone verde/cinza instantaneamente sem F5
  revalidatePath(path);
}
```

---

## FILE: \web\src\app\(academy)\portal\page.tsx
```typescript
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Play, Info, Lock, Zap, LogOut, Clock, Award, PlayCircle } from "lucide-react";

export default async function PortalDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { data: courses, error } = await supabase
    .from("courses")
    .select(`
      *,
      modules (lessons (id)),
      enrollments!inner (status, source)
    `)
    .eq("is_published", true)
    .eq("enrollments.user_id", user.id)
    .in("enrollments.status", ["active", "completed"])
    .order("created_at", { ascending: false });

  const { data: progress } = await supabase
    .from("user_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("is_completed", true);

  const completedLessonIds = new Set(progress?.map((p) => p.lesson_id) || []);

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-white bg-neutral-950">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Erro no Sistema</h1>
        <p className="text-neutral-400">Não foi possível verificar suas matrículas.</p>
      </div>
    );
  }

  const safeCourses = courses || [];
  const featuredCourse = safeCourses[0];
  const otherCourses = safeCourses.slice(1);

  const getProgress = (course: any) => {
    const totalLessons = course.modules?.reduce((acc: number, mod: any) => acc + mod.lessons.length, 0) || 0;
    const completedCount = course.modules?.reduce((acc: number, mod: any) => {
       return acc + mod.lessons.filter((l: any) => completedLessonIds.has(l.id)).length;
    }, 0) || 0;
    const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    return { percent, completedCount, totalLessons };
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col pb-20 selection:bg-emerald-500/30" suppressHydrationWarning={true}>
      
      {/* NOTA TÉCNICA: Header interno removido para evitar duplicação de logo.
          A navegação e identidade agora são gerenciadas exclusivamente pelo layout.tsx (Sidebar/Topbar).
      */}

      {/* BILLBOARD DINÂMICO */}
      {featuredCourse ? (
        (() => {
            const { percent, completedCount, totalLessons } = getProgress(featuredCourse);
            const hasStarted = percent > 0;
            const isCompleted = percent === 100 && totalLessons > 0;

            return (
                <div className="relative h-[50vh] w-full overflow-hidden group">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${featuredCourse.thumbnail_url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
                  </div>

                  <div className="absolute inset-0 w-full px-6 md:px-8 flex flex-col justify-center z-10 pointer-events-none">
                      <div className="max-w-6xl mt-12 pointer-events-auto"> 
                        <div className="flex items-center gap-3 mb-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest rounded">
                                {featuredCourse.enrollments[0]?.source === 'social_project' ? "Projeto Social" : "Destaque"}
                            </div>
                            {isCompleted && (
                                <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 text-xs font-bold uppercase tracking-widest rounded">
                                    <Award className="w-3 h-3" /> Concluído
                                </div>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-2xl leading-none tracking-tighter">
                          {featuredCourse.title}
                        </h1>
                        <p className="text-lg text-neutral-300 mb-6 drop-shadow-md leading-relaxed line-clamp-2 max-w-2xl">
                          {featuredCourse.description}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <Link 
                            href={`/portal/watch/${featuredCourse.slug}`} 
                            className={`flex items-center gap-3 px-8 py-3.5 font-bold rounded hover:scale-105 transition-all shadow-lg ${hasStarted ? 'bg-white text-neutral-950' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
                          >
                            {isCompleted ? <><PlayCircle className="w-5 h-5" /> Revisar Curso</> : hasStarted ? <><Play className="w-5 h-5 fill-current" /> Continuar</> : <><Play className="w-5 h-5 fill-current" /> Começar Agora</>}
                          </Link>
                        </div>
                      </div>
                  </div>
                </div>
            );
        })()
      ) : (
        <div className="h-[60vh] flex flex-col items-center justify-center text-white bg-neutral-950 px-4 text-center">
          <div className="p-4 bg-neutral-900 rounded-full mb-4">
            <Lock className="w-8 h-8 text-neutral-600" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Nenhum curso disponível</h2>
          <p className="text-neutral-400 max-w-md">
            Você ainda não possui matrículas ativas. Se você faz parte do <span className="text-emerald-500 font-bold">Projeto Primeiro Emprego</span>, aguarde a liberação.
          </p>
        </div>
      )}

      {otherCourses.length > 0 && (
          <div className="relative z-20 px-6 md:px-8 w-full mt-8">
            <section>
              <h3 className="text-xl font-bold text-white mb-6 pl-1 border-l-4 border-emerald-500 flex items-center gap-2">
                Meus Cursos e Trilhas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {otherCourses.map((course) => {
                    const { percent, completedCount, totalLessons } = getProgress(course);
                    const isCompleted = percent === 100 && totalLessons > 0;
                    return (
                      <Link key={course.id} href={`/portal/watch/${course.slug}`}>
                        <div className="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl transition-all duration-300 relative flex flex-col h-full">
                          <div className="aspect-video relative overflow-hidden bg-neutral-800">
                            {course.thumbnail_url ? <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" /> : <div className="w-full h-full flex items-center justify-center"><PlayCircle className="w-12 h-12 text-neutral-600" /></div>}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"><Play className="w-12 h-12 text-white" /></div>
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between bg-neutral-900">
                            <div><h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1 mb-1">{course.title}</h4><p className="text-xs text-neutral-500 line-clamp-2 mb-4">{course.description}</p></div>
                            <div className="space-y-1.5"><div className="flex justify-between text-[10px] font-medium text-neutral-400"><span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {completedCount}/{totalLessons} Aulas</span><span className={isCompleted ? "text-emerald-500" : "text-neutral-300"}>{percent}%</span></div><div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${isCompleted ? 'bg-emerald-500' : 'bg-emerald-600'}`} style={{ width: `${percent}%` }}></div></div></div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </section>
          </div>
      )}
    </div>
  );
}
```

---

## FILE: \web\src\app\(academy)\portal\profile\actions.ts
```typescript
"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// DefiniÃ§Ã£o do tipo de retorno para consistÃªncia com o Client Component
export type ActionResponse = {
  success: boolean;
  message: string;
};

export async function updateProfile(
  prevState: ActionResponse | null, // OBRIGATÃ“RIO: Argumento exigido pelo useActionState
  formData: FormData
): Promise<ActionResponse> {
  
  const supabase = await createClient();

  // 1. Validar AutenticaÃ§Ã£o
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: "SessÃ£o expirada. FaÃ§a login novamente." };
  }

  // 2. Extrair e Sanitizar Dados
  // O uso de ?.trim() previne erros se o campo vier nulo e remove espaÃ§os extras
  const fullName = (formData.get("fullName") as string)?.trim();

  if (!fullName || fullName.length < 3) {
    return { success: false, message: "O nome deve ter pelo menos 3 caracteres." };
  }

  try {
    // 3. Atualizar no Banco
    // FusÃ£o TÃ©cnica: Usamos 'update' (mais seguro para ediÃ§Ã£o) mas mantemos
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
    revalidatePath("/portal/profile"); // Atualiza a pÃ¡gina atual
    revalidatePath("/portal");         // Atualiza o nome no Header/Sidebar (Recuperado do arquivo original)

    return { success: true, message: "Perfil atualizado com sucesso!" };

  } catch (error) {
    console.error("Erro Interno:", error);
    return { success: false, message: "Erro inesperado no servidor." };
  }
}
```

---

## FILE: \web\src\app\(academy)\portal\profile\page.tsx
```typescript
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Award } from "lucide-react"; 
import { ProfileForm } from "./ProfileForm"; // ImportaÃ§Ã£o do novo componente

export default async function ProfilePage() {
  const supabase = await createClient();

  // 1. Buscar UsuÃ¡rio
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Buscar Dados do Perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // 3. Buscar Assinaturas
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      source,
      status,
      created_at,
      courses (title)
    `)
    .eq("user_id", user.id)
    .eq("status", "active");

  const isSocialProject = enrollments?.some(e => e.source === 'social_project');
  const isPremium = enrollments?.some(e => e.source === 'purchase' || e.source === 'subscription');
  const planName = isSocialProject ? "Bolsista - Projeto Primeiro Emprego" : (isPremium ? "Aluno Premium" : "Acesso Gratuito");

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans p-6 md:p-12 selection:bg-emerald-500/30">
      
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10 border-b border-neutral-800 pb-6">
          <Link 
            href="/portal" 
            className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors text-neutral-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
            <p className="text-xs text-neutral-500">Gerencie suas informaÃ§Ãµes e acessos do VaultMindOS.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA: CARTÃƒO DE IDENTIFICAÃ‡ÃƒO */}
          <div className="col-span-1">
             <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-8 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
                {/* Glow Background */}
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
                
                <div className="w-28 h-28 rounded-full bg-neutral-950 flex items-center justify-center mb-4 border border-neutral-800 ring-4 ring-neutral-900 overflow-hidden relative group">
                   {profile?.avatar_url ? (
                     <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                   ) : (
                     <User className="w-10 h-10 text-neutral-600" />
                   )}
                </div>
                
                <h2 className="text-xl font-bold text-white mb-1">{profile?.full_name || "Aluno VaultMind"}</h2>
                <p className="text-xs text-neutral-500 mb-6 font-mono bg-black/30 px-2 py-1 rounded">{user.email}</p>
                
                <div className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-widest border flex items-center justify-center gap-2 ${
                    isSocialProject 
                      ? "bg-emerald-950/30 text-emerald-400 border-emerald-500/30" 
                      : "bg-neutral-800 text-neutral-300 border-neutral-700"
                }`}>
                    <Award className="w-3 h-3" />
                    {planName}
                </div>
             </div>
          </div>

          {/* COLUNA DIREITA: FORMULÃRIO E DETALHES */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            
            {/* FORMULÃRIO (Refatorado para Client Component) */}
            <section className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-6 md:p-8 backdrop-blur-sm">
               <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-500 mb-6 flex items-center gap-2">
                 <User className="w-4 h-4" /> Dados Pessoais
               </h3>
               
               {/* InjeÃ§Ã£o do Componente Cliente */}
               <ProfileForm 
                  fullName={profile?.full_name || ""} 
                  email={user.email || ""} 
               />
            </section>

            {/* CURSOS */}
            <section className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-6 md:p-8">
               <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-500 mb-6 flex items-center gap-2">
                 <Award className="w-4 h-4" /> MatrÃ­culas Ativas
               </h3>
               
               {enrollments && enrollments.length > 0 ? (
                 <div className="space-y-3">
                    {enrollments.map((enrollment: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-neutral-950 border border-neutral-800 rounded-lg group hover:border-emerald-500/30 transition-colors">
                          <div>
                           <p className="font-bold text-sm text-neutral-200 group-hover:text-emerald-400 transition-colors">{enrollment.courses.title}</p>
                           <p className="text-[10px] text-neutral-500 mt-1">InÃ­cio: {new Date(enrollment.created_at).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div className="text-right">
                             <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                                 enrollment.source === 'social_project' 
                                 ? 'bg-emerald-950 text-emerald-500 border-emerald-900' 
                                 : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                             }`}>
                               {enrollment.source === 'social_project' ? 'BOLSA INTEGRAL' : 'PREMIUM'}
                             </span>
                          </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="text-center py-8 text-neutral-600 text-sm bg-neutral-950/50 rounded-lg border border-dashed border-neutral-800">
                   Nenhuma matrÃ­cula ativa encontrada.
                 </div>
               )}
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## FILE: \web\src\app\(academy)\portal\profile\ProfileForm.tsx
```typescript
"use client";

import { useActionState } from "react";
import { updateProfile } from "./actions";
import { Save, Mail, Shield, Loader2 } from "lucide-react";

interface ProfileFormProps {
  fullName: string;
  email: string;
}

export function ProfileForm({ fullName, email }: ProfileFormProps) {
  // Hook para gerenciar o estado da Server Action (Loading, Sucesso, Erro)
  const [state, action, isPending] = useActionState(updateProfile, null);

  return (
    <form action={action} className="space-y-5">
      {/* Feedback de Sucesso/Erro */}
      {state?.message && (
        <div className={`p-3 rounded-lg text-xs font-bold border ${
          state.success 
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
            : 'bg-red-500/10 text-red-500 border-red-500/20'
        }`}>
          {state.message}
        </div>
      )}

      {/* Campo Nome */}
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase">Nome Completo</label>
        <input 
          type="text" 
          name="fullName"
          defaultValue={fullName}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-neutral-700"
          placeholder="Como vocÃª quer ser chamado"
        />
      </div>
      
      {/* Campo Email (Somente Leitura) */}
      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase">E-mail de Acesso</label>
        <div className="relative">
            <input 
              type="text" 
              value={email} 
              disabled 
              className="w-full bg-neutral-950/50 border border-neutral-800/50 rounded-lg px-4 py-3 text-neutral-500 cursor-not-allowed pl-10"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
        </div>
        <p className="text-[10px] text-neutral-600 mt-2 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Gerenciado pela ConnectionCyberOS Identity
        </p>
      </div>

      {/* BotÃ£o de Salvar com Loading State */}
      <div className="pt-4 flex justify-end">
        <button 
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-emerald-900/20 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isPending ? "Salvando..." : "Salvar AlteraÃ§Ãµes"}
        </button>
      </div>
    </form>
  );
}
```

---

## FILE: \web\src\app\(academy)\portal\watch\[slug]\page.tsx
*[Erro de Leitura]*

---

## FILE: \web\src\app\(os)\login\actions.ts
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Recebe dados do formulÃ¡rio
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Tenta logar usando o Cliente de Servidor (Gera o cookie correto para o Player)
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Retorna erro para exibir na tela (opcional: redirecionar com erro)
    return { error: error.message }
  }

  // Se der certo, revalida e manda pro Portal
  revalidatePath('/', 'layout')
  redirect('/portal')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Tenta criar conta
  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Se der certo, revalida e manda pro Portal (ou avisa pra confirmar email)
  revalidatePath('/', 'layout')
  redirect('/portal')
}
```

---

## FILE: \web\src\app\(os)\login\page.tsx
```typescript
import { login, signup } from "./actions";
import Image from "next/image";
import { PoweredByFooter } from "@/components/ui/PoweredByFooter";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col relative overflow-hidden selection:bg-emerald-500/30">
      
      {/* CONTEÃšDO PRINCIPAL (flex-1 garante que o footer fique embaixo) */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 z-10">
        
        {/* Efeito de Fundo (Glow sutil) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md space-y-8">
          
          {/* CABEÃ‡ALHO DO PRODUTO */}
          <div className="flex flex-col items-center text-center space-y-6">
            
            {/* Logo do Produto (VaultMindOS) */}
            <div className="relative w-56 h-20 transition-transform hover:scale-105 duration-500">
                <Image 
                    src="/logo-vaultmind.png" 
                    alt="VaultMindOS" 
                    fill 
                    className="object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    priority
                />
            </div>
            
            {/* TÃ­tulo com Cores Corretas (Tricolor) */}
            <div className="space-y-2">
                <h1 className="text-2xl font-medium text-white tracking-tight">
                  Acesso Ãšnico <br />
                  <span className="font-bold tracking-wide text-2xl">
                    <span className="text-emerald-500">Connection</span>
                    <span className="text-white">Cyber</span>
                    <span className="text-red-600">OS</span>
                  </span>
                </h1>
                <p className="text-neutral-500 text-xs max-w-xs mx-auto">
                  Utilize sua credencial universal para acessar o VaultMindOS, AutoZap e o CyberTreina.
                </p>
            </div>
          </div>

          {/* FORMULÃRIO */}
          <form className="space-y-6 mt-8 bg-neutral-900/30 p-8 rounded-2xl border border-neutral-800/50 backdrop-blur-sm shadow-2xl">
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">
                E-mail Corporativo / Pessoal
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="seunome@exemplo.com"
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-neutral-700"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-bold text-neutral-400 uppercase tracking-wider ml-1">
                Senha de Acesso
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-neutral-700"
              />
            </div>

            {/* BotÃµes de AÃ§Ã£o */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                formAction={login}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-emerald-900/20"
              >
                Entrar
              </button>
              <button
                formAction={signup}
                className="w-full bg-transparent hover:bg-neutral-800 text-neutral-400 hover:text-white font-medium py-3 rounded-lg border border-neutral-800 transition-all"
              >
                Criar Conta
              </button>
            </div>

          </form>

          {/* Footer de SeguranÃ§a Interno */}
          <div className="flex justify-center items-center gap-2 text-neutral-600 text-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Ambiente Criptografado Ponta-a-Ponta</span>
          </div>
        </div>
      </div>

      {/* RODAPÃ‰ GLOBAL DA HOLDING (Fixo no bottom via Flex) */}
      <PoweredByFooter />
      
    </div>
  );
}
```

---

## FILE: \web\src\app\(os)\login\page_old_backup.tsx
```typescript
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen text-slate-300 font-sans selection:bg-cyan-500/30">
      
      {/* --- NAV BAR --- */}
      <header className="fixed top-0 w-full z-50 bg-[#050A14]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo (Com Link para Home) */}
          <div className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-4 h-4 bg-cyan-400 rounded-sm shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
            <Link href="/" className="font-bold text-xl tracking-tight text-white">
              VaultMind <span className="text-cyan-400">SO</span>
            </Link>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#consultoria" className="hover:text-white transition-colors">Consultoria</a>
            <a href="#plataforma" className="hover:text-white transition-colors">Plataforma</a>
            <a href="#industrias" className="hover:text-white transition-colors">Indústrias</a>
            <a href="#sobre" className="hover:text-white transition-colors">Sobre</a>
          </nav>

          {/* Botões Direita */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-sm border border-white/10 px-3 py-1.5 rounded bg-white/5">
              🇺🇸 Inglês
            </div>
            <Link 
              href="/login" 
              className="text-sm font-semibold text-white border border-white/10 px-6 py-2.5 rounded-lg hover:bg-white/10 transition-all"
            >
              Conecte-se
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="font-mono text-xs text-cyan-400 tracking-wider mb-6 uppercase">
            &gt; FUTURE_READINESS_PROTOCOL_INIT
          </p>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
            Adapte-se às tendências<br />
            emergentes<br />
            antes que elas aconteçam.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Consultoria em previsão estratégica e software de inteligência para ajudar
            sua empresa a se manter informada e a se adaptar às mudanças do mercado.
          </p>
        </div>
        
        {/* Glow de Fundo (Decorativo) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      </section>

      {/* --- SERVIÇOS --- */}
      <section id="consultoria" className="py-14 bg-[#080E1A]/80 border-y border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8 border-l-4 border-cyan-500 pl-4">
            <h2 className="text-3xl font-bold text-white">Serviços de consultoria</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cards mantidos originais */}
            <div className="bg-[#0E1421]/90 p-8 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group">
              <div className="text-yellow-400 text-2xl mb-4">💡</div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Ideias de negócios</h3>
              <p className="text-sm leading-relaxed text-slate-400">Gere conceitos inovadores de produtos e serviços com base em tendências orientadas por dados.</p>
            </div>

            <div className="bg-[#0E1421]/90 p-8 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group">
              <div className="text-purple-400 text-2xl mb-4">🎤</div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Palestrantes futuristas</h3>
              <p className="text-sm leading-relaxed text-slate-400">Cative seu público com apresentações inspiradoras sobre o futuro do seu setor.</p>
            </div>

            <div className="bg-[#0E1421]/90 p-8 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group">
              <div className="text-orange-400 text-2xl mb-4">🛠️</div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Oficinas de Prospectiva</h3>
              <p className="text-sm leading-relaxed text-slate-400">Sessões colaborativas para mapear cenários e construir resiliência estratégica.</p>
            </div>

            <div className="bg-[#0E1421]/90 p-8 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group">
              <div className="text-blue-400 text-2xl mb-4">📊</div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Relatórios Corporativos</h3>
              <p className="text-sm leading-relaxed text-slate-400">Relatórios de pesquisa personalizados e aprofundados, adaptados às necessidades específicas.</p>
            </div>

            <div className="bg-[#0E1421]/90 p-8 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group">
              <div className="text-cyan-400 text-2xl mb-4">🌐</div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Análise de Tendências</h3>
              <p className="text-sm leading-relaxed text-slate-400">Monitoramento contínuo de sinais e mudanças relevantes para o seu setor de mercado.</p>
            </div>

            <div className="bg-[#0E1421]/90 p-8 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group">
              <div className="text-red-400 text-2xl mb-4">🚀</div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Visão de ficção científica</h3>
              <p className="text-sm leading-relaxed text-slate-400">Criar ficção científica e protótipos para visualizar futuros potenciais de forma tangível.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER (Limpo, sem duplicata de status) --- */}
      <footer className="bg-[#050A14]/90 pt-16 pb-8 border-t border-white/5" id="industrias">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
             <div className="flex items-center gap-3 mb-6 border-l-4 border-blue-600 pl-4">
               <h2 className="text-2xl font-bold text-white">Setores em que atuamos</h2>
             </div>
             <div className="flex flex-wrap gap-3">
               {['Aeroespacial', 'Automotivo', 'Bancos e Finanças', 'Bens de Consumo (CPG)', 'Setor de Energia', 'Seguro', 'Varejo', 'Tecnologia', 'Produtos farmacêuticos', 'Governo', 'Logística'].map((item) => (
                 <span key={item} className="px-4 py-2 bg-[#0E1421] border border-white/10 rounded-full text-xs font-medium hover:border-cyan-500/50 hover:text-white cursor-default transition-colors">
                   {item}
                 </span>
               ))}
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-12">
            <div className="space-y-4">
              <h4 className="text-white font-bold tracking-wider text-xs uppercase mb-4">Consultoria</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="hover:text-cyan-400 cursor-pointer">Ideias de negócios</li>
                <li className="hover:text-cyan-400 cursor-pointer">Palestrantes futuristas</li>
                <li className="hover:text-cyan-400 cursor-pointer">Oficinas de Prospectiva</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold tracking-wider text-xs uppercase mb-4">Plataforma</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="hover:text-cyan-400 cursor-pointer">Plataforma de Previsão</li>
                <li className="hover:text-cyan-400 cursor-pointer">Preços e planos</li>
                <li className="hover:text-cyan-400 cursor-pointer">Boletim informativo</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold tracking-wider text-xs uppercase mb-4">Publicações</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="hover:text-cyan-400 cursor-pointer">Site público</li>
                <li className="hover:text-cyan-400 cursor-pointer">Relatório de Tendências</li>
                <li className="hover:text-cyan-400 cursor-pointer">Blog</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-bold tracking-wider text-xs uppercase mb-4">Empresa</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="hover:text-cyan-400 cursor-pointer">Sobre nós</li>
                <li className="hover:text-cyan-400 cursor-pointer">Carreiras</li>
                <li className="hover:text-cyan-400 cursor-pointer">Contato</li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 text-center md:text-left">
            <p className="text-xs text-slate-600">
              © 2026 VaultMindOS Foresight. Subsidiária do FutureSpec Group. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

```

---

## FILE: \web\src\app\(public)\layout.tsx
```typescript
import { Navbar } from "@/components/Navbar";
import { PoweredByFooter } from "@/components/ui/PoweredByFooter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col selection:bg-emerald-500/30">
      {/* Componente de NavegaÃ§Ã£o Global (Com Logo Novo e BotÃ£o Portal) */}
      <Navbar />
      
      {/* ConteÃºdo (Compensando a altura da navbar fixa) */}
      <main className="flex-1 pt-20"> 
        {children}
      </main>
      
      {/* RodapÃ© da Holding */}
      <PoweredByFooter />
    </div>
  );
}
```

---

## FILE: \web\src\app\(public)\page.tsx
```typescript
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  Cpu, 
  Users,
  ShieldCheck,
  Zap,
  Monitor,
  Rocket,
  Briefcase
} from 'lucide-react';

export default function Home() {

  const features = [
    {
        title: 'Administrativa 4.0',
        icon: Users,
        description: 'Gestão de Sistemas, ERP/CRM/SaaS e Rotinas Digitais.'
    },
    {
        title: 'Segurança & Automação',
        icon: ShieldCheck,
        description: 'Projetos de monitoramento inteligente, câmeras IP. CFTV IP e Dispositivos IoT'
    },
    {
        title: 'Redes & Conectividade',
        icon: Zap,
        description: 'Projetos de monitoramento inteligente, câmeras IP, Wi-Fi 6, controle de acesso e Infraestrutura'
    },
    {
        title: 'Suporte & Hardware',
        icon: Monitor,
        description: 'Manutenção e Diagnóstico, computadores, notebook, câmeras IP, roteadores, Wi-Fi 6, controle de acesso e Infraestrutura'
    },
    {
        title: 'Elétrica Moderna',
        icon: Rocket,
        description: 'Instalações e Eficiência Solar, manutenção e diagnóstico, projetos controle de acesso e Infraestrutura'
    },
    {
        title: 'Consultoria Fiscal',
        icon: Briefcase,
        description: 'Assessoria especializada em IRPF, IRPJ e regularização tributária.'
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-emerald-500/30 flex flex-col">
      
      <Navbar />

      {/* AJUSTE 1: Mudei pt-20 para pt-16 (menos espaço pro topo) */}
      <main className="flex-1 pt-16">
        
        {/* HERO SECTION COMPACTA */}
        {/* AJUSTE 2: py-28 -> py-12 / min-h-[80vh] -> min-h-[60vh] (Sobe tudo drasticamente) */}
        <header className="relative py-12 px-4 overflow-hidden flex flex-col items-center justify-center min-h-[60vh]">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none" />
           <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20"></div>

           <div className="max-w-5xl mx-auto text-center relative z-10">
             
             {/* AJUSTE 3: mb-8 -> mb-6 (Aproxima badge do título) */}
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/80 border border-neutral-800 backdrop-blur-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
               <span className="relative flex h-2.5 w-2.5">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
               </span>
               <span className="text-sm font-medium text-neutral-300">Ecossistema Integrado de Tecnologia e Educação</span>
             </div>

             {/* Título Ajustado (Mantido 3xl/4xl mas com margem menor: mb-6) */}
             <h1 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
               O Sistema Operacional da sua <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 text-glow">
                 Evolução Corporativa.
               </span>
             </h1>
             
             {/* Subtítulo: mb-12 -> mb-8 (Aproxima texto dos botões) */}
             <p className="text-lg md:text-xl text-neutral-400 mb-8 leading-relaxed max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
               Centralize gestão, capacitação e inteligência estratégica em uma única plataforma. 
               Do "Primeiro Emprego" à liderança executiva, o VaultMindOS conecta potenciais a resultados.
             </p>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
               <Link href="/servicos" className="group bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-full text-base font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:scale-105">
                 Explorar Soluções
                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Link>
               <Link href="/primeiro-emprego" className="group bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 text-white px-8 py-3.5 rounded-full text-base font-medium transition-all flex items-center gap-2 backdrop-blur-sm hover:scale-105">
                 Iniciativa Primeiro Emprego
               </Link>
             </div>

           </div>
        </header>


        {/* Nossas Áreas de Atuação - Compactada */}
        {/* AJUSTE 4: py-24 -> py-16 (Sobe os cards para perto do Hero) */}
        <section className="py-16 bg-neutral-950 relative overflow-hidden border-t border-neutral-900">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/5 rounded-full blur-[150px] pointer-events-none" />

            {/* AJUSTE 5: mb-16 -> mb-10 (Aproxima título dos cards) */}
            <div className="text-center mb-10 relative z-10 px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-tight">
                    Nossas Áreas de Atuação
                </h2>
                <p className="text-neutral-400 max-w-2xl mx-auto">
                   Tecnologia de ponta a ponta para sua corporação.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>
        </section>


        {/* Why Us Section - Compactada */}
        {/* AJUSTE 6: py-24 -> py-16 */}
        <section className="py-16 bg-neutral-900/30 relative border-y border-neutral-900">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
              
              <div className="relative">
                  <div className="aspect-square rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden relative group">
                       <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-transparent to-emerald-900/20 opacity-50 group-hover:opacity-70 transition-opacity" />
                       
                       <div className="absolute inset-4 border border-neutral-800 rounded-2xl bg-neutral-950/50 p-6 flex flex-col gap-4 backdrop-blur-md">
                           <div className="h-8 w-3/4 bg-neutral-800/50 rounded-lg animate-pulse" />
                           <div className="flex gap-4">
                               <div className="h-24 w-1/2 bg-neutral-800/50 rounded-lg" />
                               <div className="h-24 w-1/2 bg-emerald-900/20 border border-emerald-500/20 rounded-lg relative overflow-hidden">
                                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                               </div>
                           </div>
                           <div className="h-8 w-full bg-neutral-800/50 rounded-lg" />
                           <div className="h-32 w-full bg-neutral-800/50 rounded-lg mt-auto" />
                       </div>

                       <div className="absolute -top-6 -right-6 w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center shadow-xl transform rotate-12 group-hover:rotate-6 transition-transform">
                           <Cpu className="w-8 h-8 text-emerald-500" />
                       </div>
                       <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center shadow-xl transform -rotate-12 group-hover:-rotate-6 transition-transform">
                           <Shield className="w-8 h-8 text-emerald-500" />
                       </div>
                  </div>
              </div>

              <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                      Muito mais que software. <br />
                      Uma <span className="text-emerald-500">parceria estratégica.</span>
                  </h2>
                  <p className="text-lg text-neutral-400 mb-8 leading-relaxed">
                      O ConnectionCyberOS Ecosystem não apenas fornece as ferramentas, mas também o caminho para o crescimento sustentável.
                      Integramos tecnologia de ponta com desenvolvimento humano.
                  </p>
                  
                  <ul className="space-y-4">
                      {[
                          { title: 'Segurança Unificada', desc: 'Proteção de dados e ativos físicos em uma única visão.' },
                          { title: 'Capacitação Contínua', desc: 'Sua equipe treinada nas tecnologias que sua empresa usa.' },
                          { title: 'Eficiência Operacional', desc: 'Automatize rotinas e foque no que realmente importa.' },
                      ].map((item, i) => (
                          <li key={i} className="flex items-start gap-4 group">
                              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              </div>
                              <div>
                                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                                  <p className="text-neutral-500">{item.desc}</p>
                              </div>
                          </li>
                      ))}
                  </ul>
              </div>

          </div>
        </section>

      </main>
      
    </div>
  );
}
```

---

## FILE: \web\src\app\auth\callback\route.ts
```typescript
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // Token Válido! Redireciona para onde o link mandou (update-password)
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Token Inválido ou Expirado
  return NextResponse.redirect(new URL('/login?error=Link inválido ou expirado', request.url))
}

```

---

## FILE: \web\src\app\auth\signout\route.ts
```typescript
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // Verifica se tem alguém logado e faz o logout
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  // Limpa o cache e redireciona para o Login
  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  })
}

```

---

## FILE: \web\src\app\dashboard\page.tsx
```typescript
import DashboardCard from '@/components/DashboardCard'
import Link from 'next/link'
import { signOut } from '@/app/actions' // Caminho corrigido para usar Alias @

// Dados dos produtos
const products = [
  { title: "SAAS Stackposts — Ferramenta de marketing social", category: "Marketing", link: "#" },
  { title: "SAAS CARDÁPIO DIGITAL Multi Restaurante", category: "Food Service", link: "#" },
  { title: "SAAS Delivery Stackfood + APPS", category: "Delivery", link: "#" },
  { title: "6amMart - Solução de comércio eletrônico", category: "E-commerce", link: "#" },
  { title: "SAAS whaticket - Sistema Multi Atendimento", category: "CRM / Chat", link: "#" },
  { title: "WorkDashGo", category: "Gestão", link: "#" },
  { title: "ChatPion-2025", category: "IA / Chatbot", link: "#" },
  { title: "Sistemas ERP, Gestão Empresarial e Outros", category: "ERP", link: "#" },
  { title: "62 SISTEMAS PHP / JAVASCRIPT", category: "Dev Tools", link: "#" },
  { title: "SAAS TYPEBOT", category: "Automação", link: "#" },
  { title: "Crypto e Trading", category: "Financeiro", link: "#" },
  { title: "4.300 SaaS e Templates", category: "Pack Completo", link: "#" },
  { title: "+200 Ferramentas de marketing", category: "Growth", link: "#" },
  { title: "Video Aulas - Plano de Vendas do 0 aos 10K", category: "Educação", link: "#" },
  { title: "10 Mil Planilhas", category: "Recursos", link: "#" },
  { title: "1.000 Landing Pages", category: "Design", link: "#" },
  { title: "Disparador De Mensagens - Venda 50x Mais", category: "Vendas", link: "#" },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-transparent">
      
      {/* --- CABEÇALHO (NAVBAR) --- */}
      <header className="fixed top-0 w-full z-50 bg-[#050A14]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
             <div className="w-4 h-4 bg-cyan-400 rounded-sm shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
             <span className="font-bold text-xl tracking-tight text-white">
               VaultMind <span className="text-cyan-400">OS</span>
             </span>
          </Link>

          {/* Menu Direito */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Status</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ONLINE
              </span>
            </div>
            
            <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>

            {/* BOTÃO SAIR */}
            <form action={signOut}>
              <button 
                className="text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/10 px-5 py-2 rounded transition-colors cursor-pointer"
                type="submit"
              >
                SAIR
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Terminal de Produtos</h1>
              <p className="text-slate-400">Gerencie seus ativos digitais e ferramentas.</p>
            </div>
            
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white hover:bg-white/10 transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                FILTRAR
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <DashboardCard 
                key={index}
                title={product.title}
                category={product.category}
                link={product.link}
              />
            ))}
          </div>
          
        </div>
      </main>
    </div>
  )
}

```

---

## FILE: \web\src\app\forgot-password\actions.ts
```typescript
'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function resetPassword(formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()
  
  // Pega a URL atual do site (localhost ou vercel)
  const origin = (await headers()).get('origin')

  if (!email) {
    return { error: 'O e-mail é obrigatório.' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  })

  if (error) {
    console.error(error)
    return { error: 'Não foi possível enviar o e-mail. Tente novamente.' }
  }

  return { success: true }
}

```

---

## FILE: \web\src\app\forgot-password\page.tsx
```typescript
'use client'
import { useState } from 'react'
import { resetPassword } from './actions'
import Link from 'next/link'

export default function ForgotPassword() {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true); setError(null); setMessage(null);
    const res = await resetPassword(formData)
    if (res?.error) { setError(res.error) } 
    else { setMessage('O e-mail de redefinição de senha foi enviado. Verifique sua caixa de entrada ou spam.') }
    setLoading(false)
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>
        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity"><h1 className="text-3xl font-bold tracking-tight text-white mb-2">VaultMind<span className="text-cyan-400">OS</span></h1></Link>
          <p className="text-slate-400 text-sm">Recuperação de Acesso</p>
        </div>
        {message ? (
          <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-lg p-6 text-center animate-in fade-in zoom-in">
            <div className="text-cyan-400 text-4xl mb-4">📨</div>
            <p className="text-sm text-cyan-100 font-medium mb-6">{message}</p>
            <Link href="/login" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] block text-center">Voltar para o Login</Link>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-5">
            <div><label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Email</label><input name="email" type="email" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600" /></div>
            {error && <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-xs text-center">{error}</div>}
            <div className="pt-2"><button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)]">{loading ? 'Enviando...' : 'Enviar Link'}</button></div>
            <Link href="/login" className="w-full flex items-center justify-center bg-transparent border border-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/5 hover:border-cyan-500/30 transition-all mt-4">← Voltar para Login</Link>
          </form>
        )}
      </div>
    </div>
  )
}

```

---

## FILE: \web\src\app\primeiro-emprego\actions.ts
```typescript
"use server";

import { createClient } from "@/utils/supabase/server";
import { LeadProjeto, ActionResponse } from "@/types/database";
import { Resend } from "resend";
import { getWelcomeEmailTemplate } from "@/lib/emails";
import { revalidatePath } from "next/cache";

// InicializaÃ§Ã£o segura do Resend
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

/**
 * Server Action para o FormulÃ¡rio "Primeiro Emprego"
 * Stack: Next.js 15 + Supabase + Resend
 */
export async function registrarInteresse(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  
  // ---------------------------------------------------------
  // ðŸ›¡ï¸ VALIDAÃ‡ÃƒO DE INTEGRIDADE (FIX PARA BUILD VERCEL)
  // ---------------------------------------------------------
  // Se por algum motivo o formData chegar nulo (erro de runtime anterior),
  // nÃ³s interceptamos aqui antes de tentar ler ".get".
  if (!formData || typeof formData.get !== 'function') {
    console.error("[CRITICAL] FormData invÃ¡lido ou ausente.");
    return { success: false, message: "Erro tÃ©cnico: Dados do formulÃ¡rio nÃ£o recebidos." };
  }

  const supabase = await createClient();

  // 1. ExtraÃ§Ã£o e SanitizaÃ§Ã£o
  const rawData: LeadProjeto = {
    email: (formData.get("email") as string)?.trim().toLowerCase() || "",
    perfil: (formData.get("perfil") as string) || "nao_informado",
    trilha_interesse: (formData.get("trilha") as string) || "geral",
    origem: "landing_page_espera"
  };

  // 2. ValidaÃ§Ã£o BÃ¡sica
  if (!rawData.email || !rawData.email.includes("@")) {
    return { success: false, message: "Por favor, insira um e-mail vÃ¡lido." };
  }

  try {
    // 3. InserÃ§Ã£o no Supabase
    const { error } = await supabase
      .from("leads_projeto_primeiro_emprego")
      .insert([rawData]);

    if (error) {
      if (error.code === '23505') {
        return { success: true, message: "Este e-mail jÃ¡ estÃ¡ na nossa lista de espera!" };
      }
      console.error("Erro Supabase:", error);
      throw error;
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

    // 5. FinalizaÃ§Ã£o
    revalidatePath("/primeiro-emprego");
    return { success: true, message: "Cadastro realizado! Verifique seu e-mail de boas-vindas." };
    
  } catch (error) {
    return { success: false, message: "Erro ao conectar com o servidor. Tente novamente." };
  }
}
```

---

## FILE: \web\src\app\primeiro-emprego\page.tsx
```typescript
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
// ATUALIZAÃ‡ÃƒO CRÃTICA: Importamos o novo formulÃ¡rio corrigido (Client Component)
import { PrimeiroEmpregoForm } from './PrimeiroEmpregoForm';
import { PoweredByFooter } from "@/components/ui/PoweredByFooter"; 
import { FeatureCard } from '@/components/ui/FeatureCard';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Monitor, 
  Zap,
  Users,
  Rocket
} from 'lucide-react';

export default function PrimeiroEmpregoLanding() {
  // Dados das trilhas (Mantidos)
  const trilhas = [
    { title: 'Administrativa 4.0', icon: Users, description: 'GestÃ£o, ERP e Rotinas Digitais' },
    { title: 'SeguranÃ§a & AutomaÃ§Ã£o', icon: ShieldCheck, description: 'CFTV IP e Dispositivos IoT' },
    { title: 'Redes & Conectividade', icon: Zap, description: 'Wi-Fi 6 e Infraestrutura' },
    { title: 'Suporte & Hardware', icon: Monitor, description: 'ManutenÃ§Ã£o e DiagnÃ³stico' },
    { title: 'ElÃ©trica Moderna', icon: Rocket, description: 'InstalaÃ§Ãµes e EficiÃªncia Solar' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-emerald-500/30 flex flex-col">
      
      {/* HEADER (Mantido visualmente idÃªntico) */}
      <nav className="border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:opacity-80 transition-opacity relative w-40 h-10">
                 <Image 
                    src="/logo-vaultmind.png" 
                    alt="VaultMindOS" 
                    fill 
                    className="object-contain object-left"
                    priority
                />
            </Link>
          </div>

          {/* BotÃ£o Login */}
          <Link href="/login" className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-all hover:border-emerald-500/50">
            JÃ¡ sou Aluno
          </Link>
        </div>
      </nav>

      {/* CONTEÃšDO PRINCIPAL */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <header className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent)]" />
          <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
            
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full animate-in fade-in zoom-in duration-700">
              Iniciativa Primeiro Emprego & RecolocaÃ§Ã£o
            </span>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400 tracking-tight leading-tight">
              Transformando Potencial em ProntidÃ£o.
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-400 mb-10 leading-relaxed max-w-2xl">
              A ponte definitiva entre quem quer trabalhar e quem precisa contratar. 
              Uma metodologia inovadora de capacitaÃ§Ã£o tÃ©cnica contextualizada dentro do ecossistema VaultMindOS.
            </p>

            <div className="flex flex-col items-center gap-6 w-full max-w-md">
              {/* AQUI ESTÃ A MUDANÃ‡A: Usando o novo componente */}
              <PrimeiroEmpregoForm />
              
              <p className="text-xs text-neutral-600">
                  Junte-se a lista de espera para receber novidades em 
                  <span className="text-emerald-500 font-medium"> contatos@cyberconnection.com.br</span>
              </p>
            </div>

          </div>
        </header>

        {/* Trilhas de FormaÃ§Ã£o */}
        <section className="py-20 px-4 bg-neutral-900/30 border-y border-neutral-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Trilhas de EspecializaÃ§Ã£o Contextual</h2>
              <p className="text-neutral-500">VocÃª nÃ£o aprende apenas a ferramenta. VocÃª aprende a profissÃ£o.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {trilhas.map((trilha, i) => (
                <FeatureCard key={i} {...trilha} />
              ))}
            </div>
          </div>
        </section>

        {/* O Diferencial VaultMind */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Metodologia Transversal com <span className="text-emerald-500 text-glow">IA e InteligÃªncia Profissional.</span>
              </h2>
              <ul className="space-y-4">
                {[
                  'DomÃ­nio de IA para produtividade em todas as Ã¡reas.',
                  'GestÃ£o de carreira com LinkedIn estratÃ©gico.',
                  'NoÃ§Ãµes de MEI e Contabilidade integrada.',
                  'SimulaÃ§Ã£o de Empresa FictÃ­cia para prÃ¡tica real.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-400">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="order-1 md:order-2 aspect-video bg-neutral-900 rounded-3xl border border-neutral-800 flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative text-center z-10">
                  <Monitor className="w-16 h-16 text-neutral-700 mx-auto mb-4 group-hover:text-emerald-500 transition-colors" />
                  <p className="text-neutral-500 font-mono text-sm">Preview: VaultMindOS Academy Module</p>
                </div>
            </div>
          </div>
        </section>

      </main>

      {/* RODAPÃ‰ GLOBAL */}
      <PoweredByFooter />
      
    </div>
  );
}
```

---

## FILE: \web\src\app\primeiro-emprego\PrimeiroEmpregoForm.tsx
```typescript
"use client";

import { useActionState } from "react";
import { registrarInteresse } from "./actions";
import { Mail, Loader2, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

export function PrimeiroEmpregoForm() {
  // Hook nativo do Next.js 15 para gerenciar Server Actions com estado
  const [state, action, isPending] = useActionState(registrarInteresse, null);

  // Se o cadastro for bem-sucedido, mostramos o card de sucesso (preservando o visual original)
  if (state?.success) {
    return (
      <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 animate-in fade-in slide-in-from-bottom-4">
        <CheckCircle className="w-6 h-6 shrink-0" />
        <div>
          <span className="font-bold block">Sucesso!</span>
          <span className="text-sm opacity-90">{state.message}</span>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4 w-full max-w-md mx-auto sm:mx-0">
      
      <div className="flex flex-col gap-2 text-left">
        {/* Inputs Ocultos (LÃ³gica de NegÃ³cio) */}
        <input type="hidden" name="trilha" value="geral" />
        <input type="hidden" name="perfil" value="aluno" />
        
        {/* Input de E-mail com Visual Glow */}
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-neutral-900 rounded-xl border border-neutral-800 focus-within:border-emerald-500 transition-colors">
                <Mail className="absolute left-4 w-5 h-5 text-neutral-500" />
                <input 
                  type="email" 
                  name="email" 
                  required 
                  placeholder="Digite seu melhor e-mail..."
                  className="w-full bg-transparent px-4 py-4 pl-12 text-white placeholder:text-neutral-500 outline-none rounded-xl"
                />
            </div>
        </div>
      </div>
      
      {/* Feedback de Erro */}
      {state?.success === false && (
         <div className="text-red-400 text-sm flex items-center gap-2 px-1">
            <AlertCircle className="w-4 h-4" /> {state.message}
         </div>
      )}
      
      {/* BotÃ£o de Submit */}
      <button 
        type="submit" 
        disabled={isPending}
        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group shadow-lg shadow-emerald-900/20"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Registrando...
          </>
        ) : (
          <>
            Quero me inscrever na lista de espera
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
```

---

## FILE: \web\src\app\primeiro-emprego\rascunho\form.tsx
```typescript
'use client'

import { useFormStatus } from "react-dom";
import { registrarInteresse } from "./actions"; // Importa sua Action
import { ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group shadow-lg shadow-emerald-900/20"
    >
      {pending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" /> Registrando...
        </>
      ) : (
        <>
          Quero me inscrever na lista de espera
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
}

export function LeadForm() {
  const [state, setState] = useState<{ success: boolean; message: string } | null>(null);

  async function clientAction(formData: FormData) {
    const result = await registrarInteresse(formData);
    setState(result);
  }

  if (state?.success) {
    return (
      <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 animate-in fade-in slide-in-from-bottom-4">
        <CheckCircle className="w-6 h-6 shrink-0" />
        <div>
          <span className="font-bold block">Sucesso!</span>
          <span className="text-sm opacity-90">{state.message}</span>
        </div>
      </div>
    );
  }

  return (
    <form action={clientAction} className="flex flex-col gap-4 w-full max-w-md mx-auto sm:mx-0">
      <div className="flex flex-col gap-2 text-left">
        {/* Input Oculto para definir o perfil */}
        <input type="hidden" name="perfil" value="aluno" />
        
        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="Digite seu melhor e-mail..."
              className="relative w-full bg-neutral-900 border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-4 text-white placeholder:text-neutral-500 outline-none transition-all shadow-xl"
            />
        </div>
      </div>
      
      {state?.success === false && (
         <div className="text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {state.message}
         </div>
      )}
      
      <SubmitButton />
    </form>
  );
}
```

---

## FILE: \web\src\app\update-password\actions.ts
```typescript
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const supabase = await createClient()

  if (password !== confirmPassword) {
    return redirect('/update-password?error=Senhas não conferem')
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    return redirect('/update-password?error=Erro ao atualizar senha')
  }

  return redirect('/dashboard')
}

```

---

## FILE: \web\src\app\update-password\page.tsx
```typescript
import { updatePassword } from './actions'
import Link from 'next/link'

export default async function UpdatePasswordPage(props: { searchParams: Promise<{ error?: string }> }) {
  const params = await props.searchParams;
  const errorMessage = params?.error;

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>
        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity"><h1 className="text-3xl font-bold tracking-tight text-white mb-2">VaultMind<span className="text-cyan-400">OS</span></h1></Link>
          <p className="text-slate-400 text-sm">Definir Nova Senha</p>
        </div>
        {errorMessage && <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-sm text-center">{errorMessage}</div>}
        <form className="space-y-5">
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Nova Senha</label><input name="password" type="password" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600" /></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Confirmar</label><input name="confirmPassword" type="password" required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600" /></div>
          <div className="pt-2"><button formAction={updatePassword} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)]">Atualizar Senha</button></div>
        </form>
      </div>
    </div>
  )
}

```

---

## FILE: \web\src\components\BackgroundVideo.tsx
```typescript
export default function BackgroundVideo() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-50 overflow-hidden bg-[#050A14]">
       {/* VÍDEO: Terra Girando (Tech Global) */}
       <video
         autoPlay
         loop
         muted
         playsInline
         className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
       >
         <source 
           src="https://videos.pexels.com/video-files/1851190/1851190-hd_1920_1080_25fps.mp4" 
           type="video/mp4" 
         />
       </video>

       {/* CAMADA DE PROTEÇÃO (CRUCIAL):
           Azul Quase Preto com 85% de opacidade.
           Isso garante que o fundo seja 'atmosférico' e não atrapalhe a leitura.
       */}
       <div className="absolute top-0 left-0 w-full h-full bg-[#050A14]/85 backdrop-blur-[2px]"></div>
       
       {/* Vignette: Bordas mais escuras para focar a visão no centro */}
       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-80"></div>
    </div>
  )
}

```

---

## FILE: \web\src\components\DashboardCard.tsx
```typescript
import Link from 'next/link'

interface ProductCardProps {
  title: string;
  category: string;
  link: string;
}

export default function DashboardCard({ title, category, link }: ProductCardProps) {
  return (
    <div className="group relative bg-[#0B0F19]/60 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1">
      {/* Categoria (Badge) */}
      <span className="inline-block px-2 py-1 mb-4 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 rounded">
        {category}
      </span>

      {/* Título */}
      <h3 className="text-lg font-bold text-white mb-6 group-hover:text-cyan-50 transition-colors">
        {title}
      </h3>

      {/* Link de Ação */}
      <Link 
        href={link} 
        className="inline-flex items-center text-xs font-bold text-slate-400 group-hover:text-cyan-400 transition-colors uppercase tracking-wider"
      >
        Clique para acessar 
        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </Link>
      
      {/* Brilho Decorativo no canto */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  )
}

```

---

## FILE: \web\src\components\LessonCheck.tsx
```typescript
'use client'

import { CheckCircle, Circle } from "lucide-react";
import { useTransition } from "react";
import { toggleLessonProgress } from "@/app/(academy)/portal/actions";

interface LessonCheckProps {
  lessonId: string;
  isCompleted: boolean;
  path: string; // URL atual para revalidar
}

export function LessonCheck({ lessonId, isCompleted, path }: LessonCheckProps) {
  const [isPending, startTransition] = useTransition();

  // FunÃ§Ã£o disparada ao clicar
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita que o clique abra o Link da aula (se estiver dentro de um Link)
    e.stopPropagation(); // Garante isolamento

    startTransition(async () => {
      // Chama a Server Action criada no Passo 1
      await toggleLessonProgress(lessonId, isCompleted, path);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`group relative flex items-center justify-center p-1 rounded-full transition-all hover:bg-white/10 ${
        isPending ? "opacity-50 cursor-wait" : "cursor-pointer"
      }`}
      title={isCompleted ? "Marcar como nÃ£o vista" : "Marcar como concluÃ­da"}
    >
      {/* Exibe Ã­cone CHEIO se completou, ou VAZIO se nÃ£o completou */}
      {isCompleted ? (
        <CheckCircle className="w-5 h-5 text-green-500 fill-green-500/10" />
      ) : (
        <Circle className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400" />
      )}
    </button>
  );
}
```

---

## FILE: \web\src\components\Navbar.tsx
```typescript
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO DA HOLDING (ConnectionCyberOS) */}
        <Link href="/" className="relative h-8 w-48 opacity-90 hover:opacity-100 transition-opacity">
           {/* Usa o logo da ConnectionCyber que vocÃª salvou */}
           <Image 
             src="/logo-connection-cyber.png" 
             alt="ConnectionCyberOS" 
             fill 
             className="object-contain object-left"
             priority
           />
        </Link>

        {/* LINKS (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <Link href="/" className="hover:text-emerald-500 transition-colors">Home</Link>
          <Link href="/servicos" className="hover:text-emerald-500 transition-colors">SoluÃ§Ãµes</Link>
          <Link href="/contato" className="hover:text-emerald-500 transition-colors">Contato</Link>
        </div>

        {/* BOTÃƒO DE ACESSO (Portal) */}
        <div className="flex items-center gap-4">
           {/* Link para Ãrea do Cliente (Opcional, se tiver outro sistema) */}
           <Link href="/cliente" className="hidden md:block text-[10px] uppercase tracking-widest font-bold text-neutral-500 hover:text-white transition-colors">
             Ãrea do Cliente
           </Link>

           <Link 
             href="/login" 
             className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wide px-5 py-2.5 rounded hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
           >
             Portal do Aluno
           </Link>
        </div>

      </div>
    </nav>
  );
}
```

---

## FILE: \web\src\components\SystemStatus.tsx
```typescript
export default function SystemStatus() {
  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#050A14]/80 backdrop-blur-md border border-white/5 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:border-emerald-500/30 transition-all cursor-help group">
      
      {/* O Ponto que Pisca */}
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </div>

      {/* Texto */}
      <span className="text-[10px] font-mono font-medium text-slate-400 group-hover:text-emerald-400 transition-colors uppercase tracking-widest">
        System Operational
      </span>

      {/* Tooltip (Dica ao passar o mouse) */}
      <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-[#151B2B] border border-white/10 rounded text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center shadow-xl">
        Conexão segura com VaultMind Server v1.0
      </div>
    </div>
  )
}

```

---

## FILE: \web\src\components\ui\FeatureCard.tsx
```typescript
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
}

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
    return (
        <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-2xl hover:border-emerald-500/50 transition-all group hover:-translate-y-1 h-full flex flex-col hover:shadow-lg hover:shadow-emerald-900/10">
            <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500/10 transition-colors border border-neutral-800 group-hover:border-emerald-500/20 shrink-0">
                <Icon className="w-6 h-6 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <h3 className="font-bold mb-2 text-neutral-200 group-hover:text-white transition-colors">{title}</h3>
            <p className="text-sm text-neutral-500 flex-grow">{description}</p>
        </div>
    );
}
```

---

## FILE: \web\src\components\ui\PoweredByFooter.tsx
```typescript
import Image from "next/image";

export function PoweredByFooter() {
  return (
    <footer className="w-full py-6 bg-neutral-950 border-t border-neutral-900">
      {/* LAYOUT GLOBAL:
         - flex-row: MantÃ©m tudo na mesma linha.
         - items-center: Alinhamento vertical perfeito.
      */}
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-center gap-5 text-sm text-neutral-500">
        
        {/* 1. TEXTO TRICOLOR (Connection = Verde, Cyber = Branco, OS = Vermelho) */}
        <span className="opacity-90 tracking-wide flex items-center gap-1">
          Powered by 
          <span className="font-bold tracking-tight">
            <span className="text-emerald-500">Connection</span>
            <span className="text-white">Cyber</span>
            <span className="text-red-600">OS</span>
          </span>
          Ecosystem
        </span>

        {/* 2. LOGO DO SISTEMA (Aumentado de w-24 para w-32) */}
        <div className="relative w-32 h-8 grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100 shrink-0">
          <Image 
            src="/logo-vaultmind.png" 
            alt="VaultMindOS" 
            fill 
            className="object-contain"
            priority
          />
        </div>

        {/* 3. COPYRIGHT */}
        <span className="opacity-80 text-xs md:text-sm">
          Â© 2026 ConnectionCyber SoluÃ§Ãµes em Tecnologia.
        </span>

      </div>
    </footer>
  );
}
```

---

## FILE: \web\src\lib\emails.ts
```typescript
/**
 * VaultMindOS - Email Templates System
 * CentralizaÃ§Ã£o de comunicaÃ§Ãµes do ecossistema Primeiro Emprego.
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
    subject: "[VaultMindOS] Bem-vindo Ã  jornada de prontidÃ£o tÃ©cnica! ðŸš€",
    text: `
      OlÃ¡, ${nome}.
      
      Ficamos muito contentes com o seu interesse no Projeto Primeiro Emprego${trilhaText}. 
      VocÃª acaba de dar o primeiro passo para sair do aprendizado genÃ©rico e entrar na capacitaÃ§Ã£o de alta performance.

      No VaultMindOS, nossa missÃ£o Ã© transformar potencial em prontidÃ£o. Aqui estÃ¡ o que vocÃª pode esperar:
      1. Metodologia Contextual aplicada Ã  sua profissÃ£o.
      2. IA para Produtividade.
      3. SimulaÃ§Ã£o Real de Empresa.

      Avisaremos vocÃª assim que abrirmos as vagas para sua trilha.
      
      Atenciosamente,
      Equipe VaultMindOS.
    `,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #171717;">
        <div style="background-color: #059669; padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">VaultMind<span style="color: #10b981;">OS</span></h1>
        </div>
        
        <div style="padding: 32px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #065f46;">Bem-vindo Ã  jornada de prontidÃ£o tÃ©cnica!</h2>
          <p>OlÃ¡, <strong>${nome}</strong>,</p>
          
          <p>Ficamos muito contentes com o seu interesse no <strong>Projeto Primeiro Emprego</strong>${trilhaText}.</p>
          
          <p>No VaultMindOS, nossa missÃ£o Ã© transformar potencial em prontidÃ£o atravÃ©s de:</p>
          <ul style="line-height: 1.6;">
            <li><strong>Metodologia Contextual:</strong> Aprenda a ferramenta dentro da sua profissÃ£o.</li>
            <li><strong>IA para Produtividade:</strong> Domine a tecnologia que o mercado exige.</li>
            <li><strong>SimulaÃ§Ã£o Real:</strong> ExperiÃªncia prÃ¡tica antes do primeiro emprego.</li>
          </ul>

          <div style="margin-top: 32px; padding: 20px; background-color: #f0fdf4; border-left: 4px solid #10b981;">
            <p style="margin: 0; font-size: 14px; color: #166534;">
              <strong>PrÃ³ximo Passo:</strong> Nossa equipe estÃ¡ organizando as turmas. VocÃª serÃ¡ notificado por este e-mail assim que as vagas abrirem.
            </p>
          </div>

          <p style="margin-top: 32px; font-size: 14px; color: #737373;">
            Atenciosamente,<br>
            Equipe de GestÃ£o de Talentos<br>
            <em>VaultMindOS - Operating System of Personal Intelligence</em>
          </p>
        </div>
      </div>
    `
  };
};
```

---

## FILE: \web\src\types\database.ts
```typescript
```

---

## FILE: \web\src\utils\supabase\client.ts
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

```

---

## FILE: \web\src\utils\supabase\middleware.ts
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. Cria a resposta inicial
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. Cria o cliente Supabase para gerenciar os cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // A mágica acontece aqui: sincroniza cookies da Request com a Response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          
          supabaseResponse = NextResponse.next({
            request,
          })
          
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Importante: Atualiza o token se estiver expirado
  await supabase.auth.getUser()

  return supabaseResponse
}
```

---

## FILE: \web\src\utils\supabase\server.ts
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  // O código busca as chaves automaticamente do arquivo .env.local
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // O método setAll foi chamado de um Server Component.
            // Isso pode ser ignorado se você tiver um middleware atualizando
            // as sessões do usuário.
          }
        },
      },
    }
  );
}
```

---

