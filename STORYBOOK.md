# Storybook - Documentação de Componentes

Guia completo para usar, desenvolver e manter o Storybook do Radar da Voz.

## Começar

### Instalação

```bash
# Já está instalado, mas se precisar reinstalar:
npm install -D @storybook/nextjs @storybook/react @storybook/addon-essentials
```

### Iniciar Storybook

```bash
npm run storybook
```

Abre automaticamente em: **http://localhost:6006**

### Build Estático

```bash
npm run build-storybook
```

Gera versão estática em `storybook-static/` para deploy.

---

## Estrutura

```
.storybook/
├── main.ts          # Configuração principal
├── preview.ts       # Estilos e parâmetros globais
└── manager-head.html # Customizações do header

stories/
├── 0-Colors.stories.tsx
├── 1-Typography.stories.tsx
├── 2-Button.stories.tsx
├── 3-Card.stories.tsx
├── 4-Input.stories.tsx
├── 5-Badge.stories.tsx
├── 6-Icons.stories.tsx
├── Pages/
│   └── Dashboard.stories.tsx
└── Components/
    └── [outras stories]

docs/
├── DESIGN-SYSTEM.md
├── COMPONENTS.md
├── ACCESSIBILITY.md
└── README.md
```

---

## Criando uma Story

### Arquivo de Story

Criar arquivo `stories/7-MyComponent.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react"
import { MyComponent } from "@/components/ui/my-component"

const meta = {
  title: "Components/MyComponent",
  component: MyComponent,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof MyComponent>

export default meta
type Story = StoryObj<typeof meta>

// Story padrão
export const Default: Story = {
  args: {
    children: "Default State",
    variant: "primary",
  },
}

// Story alternativa
export const Secondary: Story = {
  args: {
    ...Default.args,
    variant: "secondary",
  },
}

// Story sem args
export const AllVariants = () => (
  <div className="space-y-4">
    <MyComponent variant="primary">Primary</MyComponent>
    <MyComponent variant="secondary">Secondary</MyComponent>
  </div>
)
```

### Usando Controls

```tsx
const meta = {
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    disabled: {
      control: "boolean",
    },
    count: {
      control: { type: "range", min: 0, max: 100 },
    },
    color: {
      control: "color",
    },
  },
}
```

---

## Documentando com MDX

Adicionar documentação em MDX:

`stories/Button.mdx`:

```mdx
# Button Component

## Overview

The Button component is used for user interactions.

## Usage

\`\`\`tsx
import { Button } from "@/components/ui/button"

export default () => <Button>Click me</Button>
\`\`\`

## Props

- `variant`: Button style variant
- `size`: Button size
- `disabled`: Disable interaction

## Examples

<Canvas>
  <Story id="components-button--primary" />
</Canvas>
```

---

## Parâmetros Globais

### Layout

```tsx
parameters: {
  layout: "padded"      // Com padding
  layout: "centered"    // Centralizado
  layout: "fullscreen"  // Tela cheia
}
```

### Viewport

```tsx
parameters: {
  viewport: {
    defaultViewport: "mobile1",
  },
}
```

Viewports disponíveis: `mobile1`, `tablet`, `desktop`, etc.

---

## Addons Principais

### Essentials

- **Docs**: Documentação automática
- **Controls**: Alterar props dinamicamente
- **Actions**: Ver interações de eventos
- **Viewport**: Testar responsividade

### Usando Actions

```tsx
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof Button>
```

---

## Personalizações

### Custom Theme

Adicione em `.storybook/preview.ts`:

```ts
import { themes } from "@storybook/theming"

export const parameters = {
  docs: {
    theme: themes.dark,
  },
}
```

### Custom Styles

Importar estilos globais em `.storybook/preview.ts`:

```ts
import "../styles/globals.css"
```

---

## Deploy

### Vercel

1. Conectar repo ao Vercel
2. Build command: `npm run build-storybook`
3. Output directory: `storybook-static`

### GitHub Pages

```bash
npm run build-storybook
cd storybook-static
git init
git add .
git commit -m "Deploy Storybook"
git push origin gh-pages
```

### Netlify

```bash
npm run build-storybook
# Deployar pasta `storybook-static/`
```

---

## Boas Práticas

### 1. Organize por Categoria

```
stories/
├── 0-Design-System/
│   ├── Colors.stories.tsx
│   ├── Typography.stories.tsx
│   └── Spacing.stories.tsx
├── 1-Base/
│   ├── Button.stories.tsx
│   ├── Card.stories.tsx
│   └── Input.stories.tsx
└── 2-Composite/
    ├── Form.stories.tsx
    └── Modal.stories.tsx
```

### 2. Use Template Pattern

```tsx
const Template = (args) => <MyComponent {...args} />

export const Primary = Template.bind({})
Primary.args = { variant: "primary" }

export const Secondary = Template.bind({})
Secondary.args = { variant: "secondary" }
```

### 3. Documente Props Complexos

```tsx
argTypes: {
  items: {
    control: "object",
    description: "Array of items",
    table: {
      type: { summary: "Item[]" },
    },
  },
}
```

### 4. Teste Responsividade

```tsx
export const MobileView = () => (
  <div style={{ width: "375px" }}>
    <MyComponent />
  </div>
)

export const DesktopView = () => (
  <div style={{ width: "1280px" }}>
    <MyComponent />
  </div>
)
```

### 5. Mostre Estados

```tsx
export const AllStates = () => (
  <div className="space-y-4">
    <MyComponent>Normal</MyComponent>
    <MyComponent disabled>Disabled</MyComponent>
    <MyComponent isLoading>Loading</MyComponent>
    <MyComponent isError>Error</MyComponent>
  </div>
)
```

---

## Troubleshooting

### Storybook não inicia

```bash
# Limpar cache
rm -rf node_modules/.cache
npm run storybook
```

### Estilos Tailwind não funcionam

Verificar em `.storybook/preview.ts`:

```ts
import "../styles/globals.css"
```

### Componentes não encontrados

Verificar imports em `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### TypeScript errors

```bash
# Regenerar tipos
npm run type-check
```

---

## Publicação

### Checklist antes de publicar story

- [ ] Story tem título descritivo
- [ ] Exemplos cobrem casos de uso principais
- [ ] Documentação está completa
- [ ] Props estão corretos
- [ ] Acessibilidade foi considerada
- [ ] Responsividade foi testada
- [ ] Mobile view foi testada

---

## Integração com CI/CD

### GitHub Actions

`.github/workflows/storybook.yml`:

```yaml
name: Storybook

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run build-storybook
      - uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

---

## Recursos

- [Storybook Docs](https://storybook.js.org/docs)
- [Storybook Next.js](https://storybook.js.org/docs/react/get-started/nextjs)
- [Storybook API](https://storybook.js.org/docs/react/api/argtypes)
- [Best Practices](https://storybook.js.org/docs/react/configure/overview)

---

## Feedback e Melhorias

Para sugestões ou problemas, abra uma issue no repositório.

**Última atualização:** Setembro 4, 2026
