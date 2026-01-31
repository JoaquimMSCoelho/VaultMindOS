# 🎨 DIRETRIZES DE UI/UX E ARQUITETURA DE MARCA - CONNECTION CYBER OS

> **Status:** V1.0 (Enterprise Emerald)
> **Aplicação:** Obrigatória em todos os módulos (VaultMindOS, AutoZap, etc.)

---

## 1. Arquitetura de Marca (Hierarquia)

O sistema segue o modelo de **Marca Endossada (Endorsed Branding)**.

### A. A Holding (Nave-Mãe)
* **Nome:** ConnectionCyberOS
* **Representação Visual:** Texto Tricolor estrito.
    * `Connection` -> **Verde** (Emerald-500)
    * `Cyber` -> **Branco** (White)
    * `OS` -> **Vermelho** (Red-600)
* **Logo Asset:** `/public/logo-connection-cyber.png`

### B. Os Produtos (Ecossistema)
* **Produto Atual:** VaultMindOS
* **Representação Visual:** Logo Próprio (Escudo/Cérebro).
* **Logo Asset:** `/public/logo-vaultmind.png`

---

## 2. Design System: "Enterprise Emerald"

Abandonar paletas antigas (Azul/Ciano ou Vermelho/Netflix). O padrão agora é **Corporativo, Dark e Neon Verde**.

### Paleta de Cores (Tailwind CSS)
| Elemento | Classe Tailwind | Hex Code | Uso |
| :--- | :--- | :--- | :--- |
| **Fundo Global** | `bg-neutral-950` | `#0a0a0a` | Fundo de todas as páginas. |
| **Cor Primária** | `text-emerald-500` | `#10b981` | Ícones, Links, Destaques, Botões Hover. |
| **Botão Ação** | `bg-emerald-600` | `#059669` | Botões principais (CTA). |
| **Bordas** | `border-neutral-800` | `#262626` | Divisórias e Cards. |
| **Texto Base** | `text-neutral-400` | `#a3a3a3` | Parágrafos e descrições. |

---

## 3. Componentes Obrigatórios (Building Blocks)

Nunca recriar manualmente esses elementos. Importar os componentes globais.

### A. Rodapé Global (`<PoweredByFooter />`)
Deve estar presente no **Login**, **Landing Pages** e **Layouts Públicos**.
* **Layout:** Linha Única (Flex-Row), centralizado.
* **Elementos Visuais (Ordem Estrita):**
    1.  Texto: *"Powered by"* + **ConnectionCyberOS** (Tricolor: Verde/Branco/Vermelho) + *"Ecosystem"*.
    2.  Separador Central: **Logo do Produto Atual** (ex: VaultMindOS) - Tamanho ajustado (w-32).
    3.  Texto: *Copyright ConnectionCyber Soluções em Tecnologia.*
* **Comportamento:** Fundo `bg-neutral-950`, borda superior sutil.

### B. Navbar Pública (`<Navbar />`)
Uso em todas as páginas institucionais.
* Deve conter o Logo do Produto (VaultMindOS) e botão de ação.
* Em Landing Pages de conversão (Squeeze Pages), usar versão simplificada sem links de saída.

### C. Sidebar do Portal
Uso exclusivo dentro de `(academy)`.
* Logo no topo: **Sempre o Logo do Produto** (VaultMindOS).

---

## 4. Regras de Código (Desenvolvimento)

1.  **Imagens:** Proibido usar tag `<img>`. Usar sempre `import Image from "next/image"`.
2.  **Ícones:** Usar biblioteca `lucide-react`.
3.  **Login Unificado:** A tela de login deve sempre exibir a frase *"Acesso Único ConnectionCyberOS"*.

---

**⚠️ INSTRUÇÃO PARA IA:** Ao gerar novos códigos, verifique este documento. Se o código gerado violar as cores (ex: usar blue-500) ou a estrutura de marca, corrija imediatamente antes de apresentar.