<#
.SYNOPSIS
    Gerador de Relatório de Estrutura e Código - VaultMindOS
    Filtra pastas irrelevantes e formata para leitura por IA.
#>

# 1. Configurações de Caminho
$rootPath = "E:\Projetos\VaultMindOS"
$docsPath = "$rootPath\docs"
$outputFile = "$docsPath\FULL_PROJECT_CONTEXT.md"

# Cria a pasta docs se não existir
if (-not (Test-Path $docsPath)) { New-Item -ItemType Directory -Path $docsPath | Out-Null }

# 2. Definição do Filtro de "Lixo" (Ignorar)
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

# Extensões para listar o nome, mas NÃO ler o conteúdo (Binários/Imagens)
$binaryExtensions = @(
    ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".webp", 
    ".woff", ".woff2", ".ttf", ".eot", 
    ".mp4", ".mov", ".pdf", ".zip", ".exe", ".dll"
)

# Arquivos de texto gigantes para ignorar conteúdo (apenas listar)
$ignoredContentFiles = @(
    "package-lock.json", 
    "pnpm-lock.yaml", 
    "yarn.lock",
    "FULL_PROJECT_CONTEXT.md" # Evitar ler a si mesmo
)

# 3. Cabeçalho do Arquivo
$reportContent = @()
$reportContent += "# RELATÓRIO COMPLETO DO PROJETO: VaultMindOS"
$reportContent += "> Gerado em: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$reportContent += "> Diretriz: Estrutura completa ignorando bibliotecas e binários."
$reportContent += ""
$reportContent += "---"
$reportContent += ""

Write-Host "🚀 Iniciando varredura em: $rootPath" -ForegroundColor Cyan

# 4. Varredura Recursiva
$files = Get-ChildItem -Path $rootPath -Recurse -File

foreach ($file in $files) {
    # Caminho relativo para exibição
    $relativePath = $file.FullName.Substring($rootPath.Length)
    
    # Verifica se está em pasta ignorada
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
        $reportContent += "## 📂 $relativePath"

        # Lógica de Conteúdo
        if ($binaryExtensions -contains $extension) {
            $reportContent += "*[Arquivo Binário/Mídia - Conteúdo Omitido]*"
        }
        elseif ($ignoredContentFiles -contains $fileName) {
            $reportContent += "*[Arquivo de Lock/Log Gigante - Conteúdo Omitido]*"
        }
        else {
            # Lê o conteúdo do arquivo de código
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
Write-Host "✅ SUCESSO! Relatório salvo em:" -ForegroundColor Green
Write-Host "$outputFile" -ForegroundColor White
Write-Host ""