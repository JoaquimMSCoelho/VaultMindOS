# ==============================================================================
# PROJETO: VaultMindOS
# SCRIPT: Protocolo de Abertura de Sessao (Versao Adaptada /web)
# ==============================================================================

# Forca o uso de UTF8 para evitar erros de caracteres
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "[SISTEMA] Iniciando Protocolo de Abertura VaultMindOS..." -ForegroundColor Cyan

# Navega para a pasta da aplicação Next.js
if (Test-Path ".\web") {
    Set-Location ".\web"
    Write-Host "[PATH] Contexto definido para: /web" -ForegroundColor DarkGray
} else {
    Write-Host "[ALERTA] Pasta /web não encontrada. Executando na raiz." -ForegroundColor Yellow
}

# 1. LIMPEZA TECNICA
Write-Host "[CACHE] Limpando cache do Turbopack..." -ForegroundColor White
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
}

# 2. VALIDACAO DE AMBIENTE
Write-Host "[ENV] Verificando variaveis de ambiente (.env.local)..." -ForegroundColor White
if (-not (Test-Path ".env.local")) {
    Write-Host "[ERRO] Arquivo .env.local nao localizado!" -ForegroundColor Red
}

# 3. SINCRONIZACAO
Write-Host "[NPM] Validando pacotes..." -ForegroundColor White
npm install --quiet

# 4. START DO MOTOR
Write-Host "[MOTOR] Inicializando VaultMindOS..." -ForegroundColor Cyan
npm run dev