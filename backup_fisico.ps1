<#
.SYNOPSIS
Script de Backup Híbrido - VaultMindOS (GitHub + Dados + Físico)
.DESCRIPTION
1. Executa Git Add/Commit/Push para a nuvem.
2. Exporta dados críticos (Leads) do Supabase.
3. Realiza backup físico incremental da pasta 'web' no Drive J: ou Local.
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
    
    # Adiciona tudo (respeitando .gitignore)
    git add .
    
    # Comita com Timestamp
    git commit -m "Backup Automatico: $timestamp - Golden State"
    
    # Envia (Push)
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

# Define Destino dos Dados (Prioridade: Drive J:)
if (Test-Path "J:\") {
    $DataBackupPath = "J:\Backups\VaultMindOS\Data"
} else {
    $DataBackupPath = "E:\Projetos\VaultMindOS\_backups_locais\Data"
}

$FileName = "leads_primeiro_emprego_$dataTimestamp.csv"

# Garante que o diretório de dados existe
if (!(Test-Path $DataBackupPath)) { 
    New-Item -ItemType Directory -Force -Path $DataBackupPath | Out-Null 
}

Write-Host "Iniciando exportacao de leads do Supabase..." -ForegroundColor Cyan

try {
    # Comando para exportar a tabela específica para CSV via Supabase CLI
    # Requer login prévio via 'supabase login' no terminal
    supabase db dump --table leads_projeto_primeiro_emprego --data-only > "$DataBackupPath\$FileName"
    
    if (Test-Path "$DataBackupPath\$FileName") {
        Write-Host "OK: Backup dos leads concluido: $FileName" -ForegroundColor Green
    } else {
        # Tenta criar um arquivo vazio de log se falhar, para não parar o script
        Write-Host "AVISO: Arquivo CSV nao foi gerado. Verifique a CLI do Supabase." -ForegroundColor Red
    }
} catch {
    Write-Host "ERRO: Nao foi possivel exportar os leads." -ForegroundColor Red
    Write-Host "   Motivo: Possivel falta de login na CLI do Supabase ou erro de conexao." -ForegroundColor Gray
}

# ---------------------------------------------------------
# ETAPA 3: BACKUP FISICO (DRIVE J: OU LOCAL)
# ---------------------------------------------------------
Write-Host "`n[3/3] [DISK] Iniciando Copia Fisica de Arquivos..." -ForegroundColor Yellow

$backupName = "VaultMindOS_Backup_$folderTimestamp"

# Define Destino (Prioridade: Drive J:)
if (Test-Path "J:\") {
    $destRoot = "J:\Backups_VaultMindOS"
    Write-Host "Drive J: Detectado (Protocolo Seguro)." -ForegroundColor Green
} else {
    $destRoot = "E:\Projetos\VaultMindOS\_backups_locais"
    Write-Host "Drive J: Ausente. Usando armazenamento local temporario." -ForegroundColor Yellow
}

$destination = "$destRoot\$backupName"
New-Item -ItemType Directory -Force -Path $destination | Out-Null

# Robocopy (Apenas pasta WEB, ignorando lixo)
Write-Host "Copiando arquivos criticos..." -ForegroundColor Cyan

# Usando robocopy com parâmetros padrão
robocopy $webSource $destination /E /XO /NDL /NJH /NJS /XD "node_modules" ".next" ".git" ".vs" "dist" "build" ".vercel"

# Robocopy retorna códigos de 0 a 7 como sucesso/parcial
if ($LASTEXITCODE -le 8) {
    Write-Host "`n==========================================" -ForegroundColor Green
    Write-Host "    BACKUP COMPLETO FINALIZADO" -ForegroundColor Green
    Write-Host "    Local: $destination" -ForegroundColor Gray
    Write-Host "==========================================" -ForegroundColor Green
} else {
    Write-Host "`nERRO: Houve falhas na copia fisica." -ForegroundColor Red
}

# Pausa para leitura se executado via clique duplo
if ($Host.Name -eq "ConsoleHost") {
    Read-Host "Pressione Enter para sair..."
}