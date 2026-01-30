<#
.SYNOPSIS
Script de Backup Híbrido - VaultMindOS (GitHub + Dados + Físico)
.DESCRIPTION
Versão Enterprise Sanitizada (Sem Emojis para compatibilidade total)
#>

# Configurações Iniciais
$projectRoot = "E:\Projetos\VaultMindOS"
$webSource = "E:\Projetos\VaultMindOS\web"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$folderTimestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$dataTimestamp = Get-Date -Format "yyyyMMdd_HHmm"

# Garante que estamos na raiz do projeto
Set-Location $projectRoot

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "    INICIANDO PROTOCOLO DE BACKUP HIBRIDO" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# ---------------------------------------------------------
# ETAPA 1: BACKUP EM NUVEM (GITHUB)
# ---------------------------------------------------------
Write-Host "`n[1/3] [CLOUD] Sincronizando com GitHub..." -ForegroundColor Yellow

# Verifica status
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Alteracoes detectadas. Enviando para o repositorio..." -ForegroundColor Gray
    
    # Adiciona tudo
    git add .
    
    # Comita
    git commit -m "Backup Automatico: $timestamp - Golden State"
    
    # Envia
    $pushOutput = git push 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK: GitHub atualizado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "AVISO: Erro no Git Push ou nada a enviar. Continuando..." -ForegroundColor DarkGray
    }
} else {
    Write-Host "OK: Nada a comitar. O GitHub ja esta atualizado." -ForegroundColor Green
}

# ---------------------------------------------------------
# ETAPA 2: EXPORTACAO DE DADOS (SUPABASE LEADS)
# ---------------------------------------------------------
Write-Host "`n[2/3] [DATA] Exportando Dados de Leads..." -ForegroundColor Yellow

if (Test-Path "J:\") {
    $DataBackupPath = "J:\Backups\VaultMindOS\Data"
} else {
    $DataBackupPath = "E:\Projetos\VaultMindOS\_backups_locais\Data"
}

$FileName = "leads_primeiro_emprego_$dataTimestamp.csv"

if (!(Test-Path $DataBackupPath)) { 
    New-Item -ItemType Directory -Force -Path $DataBackupPath | Out-Null 
}

Write-Host "Iniciando exportacao de leads do Supabase..." -ForegroundColor Cyan

try {
    # Requer login prévio via 'supabase login'
    supabase db dump --table leads_projeto_primeiro_emprego --data-only > "$DataBackupPath\$FileName"
    
    if (Test-Path "$DataBackupPath\$FileName") {
        Write-Host "OK: Backup dos leads concluido: $FileName" -ForegroundColor Green
    } else {
        Write-Host "AVISO: Arquivo CSV nao foi gerado (Verificar login Supabase CLI)." -ForegroundColor Red
    }
} catch {
    Write-Host "ERRO: Falha na exportacao de dados." -ForegroundColor Red
}

# ---------------------------------------------------------
# ETAPA 3: BACKUP FISICO (DRIVE J: OU LOCAL)
# ---------------------------------------------------------
Write-Host "`n[3/3] [DISK] Iniciando Copia Fisica de Arquivos..." -ForegroundColor Yellow

$backupName = "VaultMindOS_Backup_$folderTimestamp"

if (Test-Path "J:\") {
    $destRoot = "J:\Backups_VaultMindOS"
    Write-Host "Drive J: Detectado." -ForegroundColor Green
} else {
    $destRoot = "E:\Projetos\VaultMindOS\_backups_locais"
    Write-Host "Drive J: Ausente. Usando local." -ForegroundColor Yellow
}

$destination = "$destRoot\$backupName"
New-Item -ItemType Directory -Force -Path $destination | Out-Null

Write-Host "Copiando arquivos criticos..." -ForegroundColor Cyan

robocopy $webSource $destination /E /XO /NDL /NJH /NJS /XD "node_modules" ".next" ".git" ".vs" "dist" "build" ".vercel"

if ($LASTEXITCODE -le 8) {
    Write-Host "`n==========================================" -ForegroundColor Green
    Write-Host "    BACKUP COMPLETO FINALIZADO" -ForegroundColor Green
    Write-Host "    Local: $destination" -ForegroundColor Gray
    Write-Host "==========================================" -ForegroundColor Green
} else {
    Write-Host "`nERRO: Falha no Robocopy." -ForegroundColor Red
}

if ($Host.Name -eq "ConsoleHost") {
    Read-Host "Pressione Enter para sair..."
}