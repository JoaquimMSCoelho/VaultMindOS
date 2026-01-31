<#
.SYNOPSIS
    SISTEMA DE BACKUP INTEGRADO & DOCUMENTACAO AUTOMATICA (V3.0)
.DESCRIPTION
    1. Gera documentação contextual (Markdown) do projeto.
    2. Sincroniza com GitHub.
    3. Faz Dump de Banco de Dados (se aplicável).
    4. Realiza espelhamento físico (Robocopy) para HD Externo.
#>

# ==============================================================================
# 1. FUNÇÃO DE GERAÇÃO DE RELATÓRIO (O "Cérebro" do Contexto)
# ==============================================================================
function Gerar-RelatorioContexto {
    param (
        [string]$DiretorioAlvo
    )

    $docsPath = "$DiretorioAlvo\docs"
    $outputFile = "$docsPath\FULL_PROJECT_CONTEXT.md"

    # Ignora pastas que não têm código fonte relevante para evitar processamento inútil
    if ($DiretorioAlvo -match "ZZ-IMAGENS" -or -not (Test-Path "$DiretorioAlvo\src")) {
        Write-Host "   [DOCS] Ignorado (Diretorio sem estrutura de codigo padrao)." -ForegroundColor DarkGray
        return
    }

    Write-Host "   [DOCS] Atualizando FULL_PROJECT_CONTEXT.md..." -ForegroundColor Cyan

    # Cria pasta docs se não existir
    if (-not (Test-Path $docsPath)) { New-Item -ItemType Directory -Path $docsPath | Out-Null }

    # Filtros
    $ignoredFolders = @("node_modules", ".git", ".next", ".vscode", ".idea", "dist", "build", "coverage", ".vercel")
    $binaryExtensions = @(".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".webp", ".woff", ".woff2", ".ttf", ".eot", ".mp4", ".mov", ".pdf", ".zip", ".exe", ".dll")
    $ignoredContentFiles = @("package-lock.json", "pnpm-lock.yaml", "yarn.lock", "FULL_PROJECT_CONTEXT.md")

    # Cabeçalho
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
# 2. CONFIGURAÇÕES GERAIS E DRIVES
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
    "Fusão_Arquivos",
    "MecanicaSistema",
    "SaudeCicloDaVida",
    "VaultMindOS",
    "ZZ-IMAGENS E LOGOS"
)

# ==============================================================================
# 4. LOOP DE EXECUÇÃO
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
    # ETAPA 1: GERAÇÃO DE DOCUMENTAÇÃO (NOVO)
    # ---------------------------------------------------------
    # Executa ANTES de tudo para garantir que o backup físico inclua o relatório
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
    # ETAPA 4: ROBOCOPY (Backup Físico)
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