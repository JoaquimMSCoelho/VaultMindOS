# ==============================================================================
# PROJETO: VaultMindOS
# SCRIPT: Auditoria de Estrutura de Arquivos
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "[AUDITORIA] Mapeando estrutura do VaultMindOS..." -ForegroundColor Cyan

# Garante que estamos olhando para a pasta web onde está o src
if (Test-Path ".\web\src") {
    Set-Location ".\web"
}

# Caminho base para remover da visualização (Limpeza visual)
$BaseRemoval = "E:\Projetos\VaultMindOS\web\"

if (Test-Path "src") {
    Get-ChildItem -Path "src" -Recurse | 
    Where-Object { $_.PSIsContainer -eq $false } | 
    Select-Object @{Name="Caminho"; Expression={$_.FullName.Replace($BaseRemoval, "")}}, 
                  @{Name="Tamanho(KB)"; Expression={[math]::round($_.Length / 1KB, 2)}}, 
                  LastWriteTime | 
    Format-Table -AutoSize
    
    Write-Host "[OK] Auditoria concluida." -ForegroundColor Green
} else {
    Write-Host "[ERRO] Pasta 'src' nao encontrada. Voce esta na raiz correta?" -ForegroundColor Red
}