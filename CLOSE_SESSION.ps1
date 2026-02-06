# ==============================================================================
# PROJETO: VaultMindOS
# SCRIPT: Protocolo de Encerramento e Backup (Versao Limpa)
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "[SISTEMA] Iniciando Protocolo de Selagem VaultMindOS..." -ForegroundColor Cyan

# 1. PARADA DOS PROCESSOS
Write-Host "[PROCESS] Encerrando processos Node.js..." -ForegroundColor White
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. CONSOLIDACAO NO GITHUB
$Mensagem = Read-Host "Descreva a evolucao deste commit"
Write-Host "[GITHUB] Sincronizando com GitHub..." -ForegroundColor Green
git add .
git commit -m "feat(vaultmind): $Mensagem"
git push origin main

# 3. BACKUP FISICO
# Define o destino com ano corrente (baseado no contexto 2026)
$Destino = "J:\VaultMindOS_BK2026"
Write-Host "[BACKUP] Espelhando para o volume BACKUP (J:)..." -ForegroundColor Yellow

if (-not (Test-Path $Destino)) {
    New-Item -ItemType Directory -Path $Destino -Force
}

# Robocopy configurado para excluir node_modules e caches para economizar espaço e tempo
# Backup da Raiz E:\Projetos\VaultMindOS
robocopy "E:\Projetos\VaultMindOS" $Destino /E /Z /R:5 /W:5 /XD node_modules .next .git /V /MT:8

# 4. STATUS FINAL
$Data = Get-Date -Format "dd/MM/yyyy HH:mm"
Write-Host "[OK] Sessao encerrada e blindada as $Data." -ForegroundColor Green