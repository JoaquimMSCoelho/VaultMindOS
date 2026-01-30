<#
.SYNOPSIS
Script de Backup Multi-Projetos (Híbrido: GitHub + Físico + Dados)
.DESCRIPTION
Gerencia backup de múltiplos diretórios do drive PROJETOS (E:) para BACKUP (J:).
Versão Enterprise - Otimizada para Execução em Lote.
#>

# ==============================================================================
# 1. CONFIGURAÇÕES GERAIS E DETECÇÃO DE DRIVES
# ==============================================================================
$ErrorActionPreference = "Continue"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$dataTimestamp = Get-Date -Format "yyyyMMdd_HHmm"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   SISTEMA DE BACKUP INTEGRADO - V2.0" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# --- Detecção do Drive de PROJETOS (Origem) ---
$sourceLabel = "PROJETOS"
$defaultSource = "E:"
$sourceDrive = Get-Volume | Where-Object { $_.FileSystemLabel -eq $sourceLabel } | Select-Object -ExpandProperty DriveLetter
if ($sourceDrive) { 
    $sourceRoot = "$($sourceDrive):\Projetos"
    Write-Host "[CHECK] Volume '$sourceLabel' detectado na unidade $($sourceDrive):" -ForegroundColor Green
} else {
    $sourceRoot = "$defaultSource\Projetos"
    Write-Host "[AVISO] Volume '$sourceLabel' nao encontrado. Tentando usar $defaultSource..." -ForegroundColor Yellow
}

# --- Detecção do Drive de BACKUP (Destino) ---
$destLabel = "BACKUP"
$defaultDest = "J:"
$destDriveObj = Get-Volume | Where-Object { $_.FileSystemLabel -eq $destLabel } | Select-Object -ExpandProperty DriveLetter

if ($destDriveObj) {
    $backupRoot = "$($destDriveObj):" # J:
    Write-Host "[CHECK] Volume '$destLabel' detectado na unidade $($destDriveObj):" -ForegroundColor Green
} else {
    Write-Host "[CRITICO] O drive de Backup ('$destLabel') nao foi encontrado!" -ForegroundColor Red
    Write-Host "Verifique a conexao do HD Externo."
    Read-Host "Pressione Enter para sair..."
    Exit
}

# ==============================================================================
# 2. LISTA DE PROJETOS (MATRIZ DE EXECUÇÃO)
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
# 3. LOOP DE EXECUÇÃO
# ==============================================================================

foreach ($projName in $projectList) {
    
    $currentSource = "$sourceRoot\$projName"
    $currentDest = "$backupRoot\$projName"

    Write-Host "`n----------------------------------------------------------" -ForegroundColor Gray
    Write-Host "PROCESSANDO: $projName" -ForegroundColor White
    Write-Host "----------------------------------------------------------" -ForegroundColor Gray

    # Verifica se a pasta de origem existe
    if (!(Test-Path $currentSource)) {
        Write-Host "ERRO: Pasta de origem nao encontrada: $currentSource" -ForegroundColor Red
        continue
    }

    # Muda para o diretório do projeto para comandos git/contextuais
    Set-Location $currentSource

    # ---------------------------------------------------------
    # ETAPA A: GITHUB (Se for um repositório git)
    # ---------------------------------------------------------
    if (Test-Path "$currentSource\.git") {
        Write-Host "[CLOUD] Repositorio Git detectado. Sincronizando..." -ForegroundColor Yellow
        $gitStatus = git status --porcelain
        if ($gitStatus) {
            git add .
            git commit -m "Backup Automatico: $timestamp"
            $pushOutput = git push 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "OK: GitHub atualizado." -ForegroundColor Green
            } else {
                Write-Host "AVISO: Falha no Push (Verifique conexao/permissoes)." -ForegroundColor DarkGray
            }
        } else {
            Write-Host "OK: Nada a comitar (Clean)." -ForegroundColor Green
        }
    }

    # ---------------------------------------------------------
    # ETAPA B: SUPABASE LEADS (Específico para VaultMindOS)
    # ---------------------------------------------------------
    if ($projName -eq "VaultMindOS") {
        Write-Host "[DATA] Exportando Leads (VaultMindOS)..." -ForegroundColor Yellow
        
        # Define local para salvar o CSV antes de copiar (dentro da pasta do projeto na origem ou direto no destino)
        # Vamos salvar direto no destino para segurança
        $dbDest = "$currentDest\_database_dumps"
        if (!(Test-Path $dbDest)) { New-Item -ItemType Directory -Force -Path $dbDest | Out-Null }
        
        $FileName = "leads_$dataTimestamp.csv"
        
        try {
            # Tenta exportar direto para o Drive J dentro da pasta do projeto
            supabase db dump --table leads_projeto_primeiro_emprego --data-only > "$dbDest\$FileName"
            if ($LASTEXITCODE -eq 0) {
                Write-Host "OK: Dump Supabase salvo em $dbDest\$FileName" -ForegroundColor Green
            } else {
                Write-Host "AVISO: Erro ao conectar Supabase CLI." -ForegroundColor Red
            }
        } catch {
            Write-Host "ERRO: Falha na exportacao de dados." -ForegroundColor Red
        }
    }

    # ---------------------------------------------------------
    # ETAPA C: ROBOCOPY (Backup Físico)
    # ---------------------------------------------------------
    Write-Host "[DISK] Sincronizando arquivos..." -ForegroundColor Cyan

    # Cria diretório de destino se não existir
    if (!(Test-Path $currentDest)) { New-Item -ItemType Directory -Force -Path $currentDest | Out-Null }

    # Opções do Robocopy:
    # /E = Subpastas (mesmo vazias)
    # /XO = Exclude Older (Só copia se for mais novo)
    # /FFT = Assume tempos de arquivo FAT (útil para drives externos)
    # /R:1 /W:1 = Tenta 1 vez, espera 1 seg (para não travar em arquivos bloqueados)
    # /NP = No Progress (Para não poluir o terminal)
    # /NFL /NDL = No File List / No Dir List (Resumo apenas, remova se quiser ver os arquivos passando)
    
    # Exclusões padrão para desenvolvimento Node/Next/Python
    $excludeDirs = @("node_modules", ".next", ".git", ".vs", "dist", "build", ".vercel", "__pycache__", ".venv")

    robocopy $currentSource $currentDest /E /XO /FFT /R:1 /W:1 /NP /NFL /NDL /XD $excludeDirs

    if ($LASTEXITCODE -lt 8) {
        Write-Host "OK: Copia fisica concluida." -ForegroundColor Green
    } else {
        Write-Host "ERRO: Falha critica no Robocopy." -ForegroundColor Red
    }
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "   TODAS AS TAREFAS FINALIZADAS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

if ($Host.Name -eq "ConsoleHost") {
    Read-Host "Pressione Enter para sair..."
}