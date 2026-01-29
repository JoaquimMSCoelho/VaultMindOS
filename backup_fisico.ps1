<#
.SYNOPSIS
Script de Backup Híbrido - VaultMindOS (GitHub + Físico)
.DESCRIPTION
1. Executa Git Add/Commit/Push para a nuvem.
2. Realiza backup físico incremental da pasta 'web' no Drive J: ou Local.
#>

# Configurações Iniciais
$projectRoot = "E:\Projetos\VaultMindOS"
$webSource = "E:\Projetos\VaultMindOS\web"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$folderTimestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"

# Garante que estamos na raiz do projeto
Set-Location $projectRoot

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   INICIANDO PROTOCOLO DE BACKUP HÍBRIDO" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# ---------------------------------------------------------
# ETAPA 1: BACKUP EM NUVEM (GITHUB)
# ---------------------------------------------------------
Write-Host "`n[1/2] ☁️ Sincronizando com GitHub..." -ForegroundColor Yellow

# Verifica status
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Alterações detectadas. Enviando para o repositório..." -ForegroundColor Gray
    
    # Adiciona tudo (respeitando .gitignore)
    git add .
    
    # Comita com Timestamp
    git commit -m "Backup Automático: $timestamp - Golden State (Auth+Player)"
    
    # Envia (Push)
    $pushOutput = git push 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ GitHub atualizado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Erro no Git Push. Verifique sua conexão. O backup físico continuará." -ForegroundColor Red
        Write-Host $pushOutput -ForegroundColor DarkGray
    }
} else {
    Write-Host "✅ Nada a comitar. O GitHub já está atualizado." -ForegroundColor Green
}

# ---------------------------------------------------------
# ETAPA 2: BACKUP FÍSICO (DRIVE J: OU LOCAL)
# ---------------------------------------------------------
Write-Host "`n[2/2] 💾 Iniciando Cópia Física..." -ForegroundColor Yellow

$backupName = "VaultMindOS_Backup_$folderTimestamp"

# Define Destino (Prioridade: Drive J:)
if (Test-Path "J:\") {
    $destRoot = "J:\Backups_VaultMindOS"
    Write-Host "Drive J: Detectado (Protocolo Seguro)." -ForegroundColor Green
} else {
    $destRoot = "E:\Projetos\VaultMindOS\_backups_locais"
    Write-Host "Drive J: Ausente. Usando armazenamento local temporário." -ForegroundColor Yellow
}

$destination = "$destRoot\$backupName"
New-Item -ItemType Directory -Force -Path $destination | Out-Null

# Robocopy (Apenas pasta WEB, ignorando lixo)
# /E = Recursivo | /XO = Excluir arquivos antigos inalterados | /NFL = Sem lista de arquivos (limpo)
Write-Host "Copiando arquivos críticos..." -ForegroundColor Cyan

robocopy $webSource $destination /E /XO /NFT /NDL /NJH /NJS /XD "node_modules" ".next" ".git" ".vs" "dist" "build" ".vercel"

if ($LASTEXITCODE -le 8) {
    Write-Host "`n==========================================" -ForegroundColor Green
    Write-Host "   ✅ BACKUP COMPLETO FINALIZADO" -ForegroundColor Green
    Write-Host "   Local: $destination" -ForegroundColor Gray
    Write-Host "==========================================" -ForegroundColor Green
} else {
    Write-Host "`n❌ Houve erros na cópia física." -ForegroundColor Red
}

# Pausa para leitura se executado via clique duplo
if ($Host.Name -eq "ConsoleHost") {
    Read-Host "Pressione Enter para sair..."
}