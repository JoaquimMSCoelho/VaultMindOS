# ---------------------------------------------------------
# VaultMindOS - Deep Purge Script
# Objetivo: Reset total de infraestrutura antes de Builds Críticos
# ---------------------------------------------------------

Write-Host "--- Iniciando Limpeza Profunda (Deep Purge) - VaultMindOS ---" -ForegroundColor Cyan

# Navega para a pasta da aplicação
if (Test-Path ".\web") {
    Set-Location ".\web"
    Write-Host "[PATH] Entrando em /web para limpeza..." -ForegroundColor DarkGray
}

# 1. Limpeza de Pastas de Compilação e Cache do Next.js
if (Test-Path ".next") {
    Write-Host "[1/4] Removendo pasta .next..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next
}

# 2. Limpeza de Módulos e Lockfiles
if (Test-Path "node_modules") {
    Write-Host "[2/4] Removendo node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules
}

if (Test-Path "package-lock.json") {
    Write-Host "[3/4] Removendo package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Force package-lock.json
}

# 3. Limpeza de Caches Globais do NPM
Write-Host "[4/4] Limpando cache do NPM..." -ForegroundColor Yellow
npm cache clean --force

Write-Host "--- Limpeza Concluída. O sistema está pronto para uma instalação limpa. ---" -ForegroundColor Green
Write-Host "Próximo passo recomendado: Volte para START_SESSION.ps1 ou execute 'npm install'" -ForegroundColor White