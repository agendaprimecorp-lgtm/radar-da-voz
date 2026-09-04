# Radar da Voz - Storybook & Design System

Documentação visual e interativa de todos os componentes, design tokens e padrões do Radar da Voz.

## 🚀 Começar Rápido

### Iniciar Storybook

```bash
npm run storybook
```

Abre automaticamente em **http://localhost:6006**

### Build Estático (Deploy)

```bash
npm run build-storybook
```

Gera versão estática em `storybook-static/` pronta para deploy.

---

## 📚 Documentação Incluída

### Design System
- **[DESIGN-SYSTEM.md](./docs/DESIGN-SYSTEM.md)** - Cores, tipografia, espaçamento e tokens
- **[COMPONENTS.md](./docs/COMPONENTS.md)** - Guia de uso de cada componente
- **[ACCESSIBILITY.md](./docs/ACCESSIBILITY.md)** - Padrões WCAG AA e acessibilidade

### Storybook
- **[STORYBOOK.md](./STORYBOOK.md)** - Guia completo do Storybook

---

## 📦 Componentes Base

| Componente | Story | Descrição |
|-----------|-------|-----------|
| **Button** | 2-Button | Botão reutilizável com 7 variantes e 5 tamanhos |
| **Card** | 3-Card | Container com estilo e subcomponentes |
| **Input** | 4-Input | Campo de entrada de texto |
| **Badge** | 5-Badge | Etiqueta/label para categorizar conteúdo |
| **Select** | Components/Select | Dropdown de seleção |

---

## 🎨 Design Tokens

### Cores
- **Primary**: Indigo (#6366f1) - Ações principais
- **Secondary**: Purple (#8b5cf6) - Ações secundárias
- **Success**: Green (#10b981) - Confirmações
- **Error**: Red (#ef4444) - Erros
- **Warning**: Amber (#f59e0b) - Avisos

### Tipografia
- **H1**: 48px Bold
- **H2**: 36px Bold
- **Body**: 16px Normal
- **Small**: 14px Normal

### Espaçamento
- xs: 4px | sm: 8px | md: 16px | lg: 24px | xl: 32px

### Raio de Borda
- sm: 4px | md: 8px | lg: 12px | full: 9999px

---

## 📖 Stories Disponíveis

### Design System
- ✓ **0-Colors** - Paleta de cores com valores hex
- ✓ **1-Typography** - Tamanhos, pesos e exemplos
- ✓ **6-Icons** - Ícones disponíveis em diferentes tamanhos

### Componentes Base
- ✓ **2-Button** - Variantes, tamanhos, estados e exemplos
- ✓ **3-Card** - Cards simples, com footer, imagem e interativos
- ✓ **4-Input** - Inputs simples, com label, validação, etc
- ✓ **5-Badge** - Variantes de badges e casos de uso
- ✓ **7-Forms** - Formulários com validação e múltiplos passos

### Páginas de Exemplo
- ✓ **Pages/Dashboard** - Dashboard de talento e cliente
- ✓ **Pages/Login** - Login, signup com validação

---

## 🎯 Principais Features

### Controls Interativos
Altere props em tempo real com os controls do Storybook:

```
variant: select entre primary, secondary, outline, ghost, link, destructive
size: escolha entre sm, default, lg, xl, icon
disabled: toggle desabilitado
```

### Documentação Automática
Clique em "Docs" para ver documentação automática gerada.

### Responsive Design
Veja como componentes se comportam em mobile, tablet e desktop com o viewport selector.

### Viewport Testing
- Mobile (375px)
- Tablet (768px)
- Desktop (1280px)

---

## 💡 Padrões e Boas Práticas

### 1. Cores + Ícones para Status
Não use apenas cor para comunicar status:

```tsx
// ✓ BOM
<Badge variant="success">✓ Verificado</Badge>

// ✗ RUIM
<div className="text-green-500">Verificado</div>
```

### 2. Labels para Inputs
Sempre forneça labels associados:

```tsx
<label htmlFor="email">Email</label>
<Input id="email" type="email" />
```

### 3. Focus Visible
Todos elementos interativos têm focus ring:

```css
focus-visible:ring-2 focus-visible:ring-primary-500
```

### 4. Sem Inline Styles
Use componentes e Tailwind classes:

```tsx
// ✓ BOM
<Button variant="primary" size="lg">Click</Button>

// ✗ RUIM
<button style={{ background: 'blue', padding: '16px' }}>Click</button>
```

---

## 🔧 Customizações

### Adicionar Nova Story

1. Criar arquivo `stories/8-MyComponent.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { MyComponent } from "@/components/ui/my-component"

const meta = {
  title: "Components/MyComponent",
  component: MyComponent,
} satisfies Meta<typeof MyComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: "Default" },
}
```

2. Atualizar `docs/COMPONENTS.md` com documentação

### Mudar Cores
Editar `tailwind.config.js` ou `.storybook/preview.ts`

### Adicionar Fonte
Editar `styles/globals.css` e `.storybook/preview.ts`

---

## 📱 Responsividade

Todos componentes testados em:
- ✓ Mobile (375px)
- ✓ Tablet (768px)
- ✓ Desktop (1280px)

Use o selector de viewport do Storybook para testar.

---

## ♿ Acessibilidade

100% WCAG AA compliant:
- ✓ Contrast ratio ≥ 4.5:1
- ✓ Keyboard navigation
- ✓ Focus rings visíveis
- ✓ ARIA labels
- ✓ Alt text para imagens
- ✓ Sem dependência apenas de cor

Ver [ACCESSIBILITY.md](./docs/ACCESSIBILITY.md) para detalhes.

---

## 🚢 Deploy

### Vercel
```bash
npm run build-storybook
# Deploy pasta `storybook-static/`
```

### GitHub Pages
```bash
npm run build-storybook
cd storybook-static
git init && git add . && git commit -m "Deploy"
git push origin gh-pages
```

### Netlify
```bash
npm run build-storybook
# Deploy `storybook-static/`
```

---

## 📊 Estrutura de Pastas

```
projeto/
├── .storybook/              # Configuração Storybook
│   ├── main.ts              # Config principal
│   └── preview.ts           # Estilos globais
├── stories/                 # Stories dos componentes
│   ├── 0-Colors.stories.tsx
│   ├── 1-Typography.stories.tsx
│   ├── 2-Button.stories.tsx
│   ├── 3-Card.stories.tsx
│   ├── 4-Input.stories.tsx
│   ├── 5-Badge.stories.tsx
│   ├── 6-Icons.stories.tsx
│   ├── 7-Forms.stories.tsx
│   └── Pages/
│       ├── Dashboard.stories.tsx
│       └── Login.stories.tsx
├── components/
│   ├── ui/                  # Componentes base
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── badge.tsx
│   └── [outros]
├── docs/
│   ├── DESIGN-SYSTEM.md
│   ├── COMPONENTS.md
│   └── ACCESSIBILITY.md
└── tailwind.config.js       # Tokens Tailwind
```

---

## 🔗 Links Úteis

- [Storybook Docs](https://storybook.js.org/docs)
- [Next.js + Storybook](https://storybook.js.org/docs/react/get-started/nextjs)
- [Tailwind CSS](https://tailwindcss.com/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 📝 Checklist de Qualidade

Antes de commitar uma story:

- [ ] Story tem título descritivo
- [ ] Exemplos cobrem principais casos de uso
- [ ] Props estão corretos e documentados
- [ ] Acessibilidade foi testada
- [ ] Responsividade foi testada
- [ ] Mobile view foi testada
- [ ] Documentação atualizada em `docs/COMPONENTS.md`

---

## 💬 Feedback

Dúvidas ou sugestões sobre o Storybook?
- Abra uma issue no repositório
- Discuta no time de design

---

**Última atualização:** Setembro 4, 2026

Happy documenting! 🎨✨
