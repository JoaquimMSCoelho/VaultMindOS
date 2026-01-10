<#
.SYNOPSIS
Gerador Automático de Whitepaper Técnico (Padrão CyberTreinaIA)
#>

param (
    [string]$ProjectName = "VaultMindOS",
    [string]$Version = "1.0",
    [string]$Author = "Joaquim Mario Soares Coelho"
)

# 1. Definir Nome e Caminho do Arquivo
$fileName = "Whitepaper_$($ProjectName).md"
$outputDir = "docs\apresentacao"
$fullPath = Join-Path $outputDir $fileName

# 2. Criar Diretório se não existir
if (!(Test-Path $outputDir)) { New-Item -ItemType Directory -Force -Path $outputDir | Out-Null }

# 3. Conteúdo do Template
$content = @"
# 📄 WHITEPAPER TÉCNICO: $ProjectName
**Versão:** $Version
**Autor:** $Author
**Data de Emissão:** $(Get-Date -Format "dd/MM/yyyy")
**Status:** EM DESENVOLVIMENTO

---

## 1. Resumo Executivo
O **$ProjectName** é uma solução tecnológica projetada para resolver problemas complexos através de arquitetura modular. Integra Frontend React, Backend Python e IA Corporativa.

## 2. O Problema
Sistemas tradicionais falham em entregar interoperabilidade e auditabilidade.

## 3. A Solução $ProjectName
Utiliza a metodologia **Marco Zero** para garantir:
* **Governança Nativa**: Rastreabilidade total.
* **Inteligência Híbrida**: Apoio à decisão via CyberTreinaIA.
* **Design System**: Interface Glassmorphism.

## 4. Arquitetura Técnica
| Camada | Tecnologia | Função |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Interface (SPA) |
| **Backend** | Python (Flask) | API e Regras |
| **IA Core** | CyberTreinaIA | Inteligência |
| **Dados** | Supabase | Banco de Dados |

## 5. Estrutura do Projeto
\`\`\`text
$ProjectName/
├── frontend/
├── backend/
├── docs/
└── scripts/
\`\`\`

## 6. Status
- [x] Fase 1: Infraestrutura
- [x] Fase 2: Backend
- [x] Fase 3: Frontend
- [x] Fase 4: Integração
- [ ] Fase 5: Inteligência Artificial

---
*Gerado automaticamente pelo Sistema de Governança CyberTreinaIA.*
"@

# 4. Gravar o Arquivo
Set-Content -Path $fullPath -Value $content -Encoding UTF8
Write-Host "✅ Whitepaper gerado com sucesso em: $fullPath" -ForegroundColor Green