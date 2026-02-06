# 🎨 DIRETRIZES DE UI/UX E ARQUITETURA DE MARCA - CONNECTION CYBER OS

> **Status:** V1.1 (Refactor: Tightening & Efficiency)
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

## 2. Design System: "Enterprise Emerald" (Compact Mode)

O visual deve ser corporativo, denso e eficiente. Evitar o "Modo Cinema" (espaços excessivos) em favor de uma navegação fluida.

### Tipografia & Escala (Equilíbrio Corporativo)
* **H1 (Hero):** `text-3xl md:text-4xl` font-extrabold. (Não usar 5xl/7xl).
* **H2 (Seções):** `text-3xl md:text-4xl` font-bold.
* **Corpo:** `text-base` ou `text-lg` (Lead) text-neutral-400.

### Espaçamento & Ritmo (Tightening)
* **Hero Section:** Altura mínima `min-h-[60vh]` (Não usar 80vh/100vh).
* **Padding de Seção:** Padrão `py-16` (Não usar py-24/32).
* **Padding de Topo:** `pt-16` (para compensar Navbar fixa).
* **Margens:** Títulos `mb-6`, Subtítulos `mb-8`.

### Paleta de Cores (Tailwind CSS)
| Elemento | Classe Tailwind | Uso |
| :--- | :--- | :--- |
| **Fundo Global** | `bg-neutral-950` | Fundo de todas as páginas. |
| **Cor Primária** | `text-emerald-500` | Ícones, Destaques, Links. |
| **Botão Ação** | `bg-emerald-600` | CTA Principal. |
| **Bordas** | `border-neutral-800` | Divisórias e Cards. |

---

## 3. Componentes Obrigatórios (Building Blocks)

Nunca recriar manualmente esses elementos. Importar os componentes globais.

### A. Rodapé Global (`<PoweredByFooter />`)
* **Layout:** Linha Única (Flex-Row), centralizado.
* **Elementos:** Powered by (Tricolor) + Logo Produto (w-32) + Copyright.
* **REGRA CRÍTICA:** Nunca importar nas páginas (`page.tsx`). Ele deve estar **apenas** no `layout.tsx`.

### B. Cards de Recursos (`<FeatureCard />`)
* **Uso:** Obrigatório para listar serviços, trilhas ou diferenciais.
* **Path:** `@/components/ui/FeatureCard`
* **Props:** `{ title, description, icon }`.

### C. Navbar Pública (`<Navbar />`)
* Deve conter o Logo do Produto (VaultMindOS) e botão de ação.

---

## 4. Regras de Código (Desenvolvimento)

1.  **Imagens:** Proibido `<img>`. Usar `import Image from "next/image"`.
2.  **Ícones:** Usar biblioteca `lucide-react`.
3.  **Layout vs Página:** O `layout.tsx` define a estrutura (Navbar + Footer). O `page.tsx` define apenas o miolo (`<main>`). **Jamais importar Navbar/Footer dentro de page.tsx em rotas públicas.**

---

**⚠️ INSTRUÇÃO PARA IA:** Ao gerar novos layouts, priorize a eficiência de espaço (`min-h-[60vh]`, `py-16`) e a consistência de componentes (`FeatureCard`).