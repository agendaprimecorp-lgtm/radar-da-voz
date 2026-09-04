# Design System - Radar da Voz

Uma documentação completa da paleta de cores, tipografia, espaçamento e componentes do Radar da Voz.

## Cores

### Cores Primárias

| Nome | Valor | Descrição |
|------|-------|-----------|
| Primary 50 | `#f0f5ff` | Fundo claro para elementos primários |
| Primary 100 | `#e0e7ff` | Fundo moderado |
| Primary 500 | `#6366f1` | Cor primária padrão (Indigo) |
| Primary 600 | `#4f46e5` | Hover state |
| Primary 700 | `#4338ca` | Active state |

### Cores Secundárias

| Nome | Valor | Descrição |
|------|-------|-----------|
| Secondary 500 | `#8b5cf6` | Cor secundária (Purple) |
| Secondary 600 | `#7c3aed` | Hover state |
| Secondary 700 | `#6d28d9` | Active state |

### Status Colors

| Status | Cor | Código | Uso |
|--------|-----|--------|-----|
| Success | Verde | `#10b981` | Ações bem-sucedidas, confirmações |
| Error | Vermelho | `#ef4444` | Erros, avisos críticos |
| Warning | Âmbar | `#f59e0b` | Avisos, informações importantes |
| Info | Ciano | `#06b6d4` | Informações gerais |

### Dark Mode Colors

| Nome | Valor | Uso |
|------|-------|-----|
| Dark 50 | `#f9fafb` | Texto em dark mode |
| Dark 900 | `#0f172a` | Fundo principal |
| Dark 800 | `#1f2937` | Cards e elementos |
| Dark 700 | `#374151` | Bordas, separadores |

## Tipografia

### Tamanhos de Fonte

| Nome | Tamanho | Peso | Linha | Uso |
|------|---------|------|------|-----|
| H1 | 48px | 700 (Bold) | 1.2 | Títulos principais |
| H2 | 36px | 700 (Bold) | 1.3 | Subtítulos maiores |
| H3 | 30px | 700 (Bold) | 1.3 | Subtítulos médios |
| H4 | 24px | 600 (Semibold) | 1.4 | Títulos de seção |
| H5 | 20px | 600 (Semibold) | 1.4 | Subtítulos pequenos |
| Body | 16px | 400 (Normal) | 1.5 | Texto de parágrafo |
| Small | 14px | 400 (Normal) | 1.5 | Texto auxiliar, captions |
| Tiny | 12px | 400 (Normal) | 1.4 | Labels pequenos |

### Font Families

```css
/* Sans Serif - Default */
font-family: system-ui, -apple-system, sans-serif;

/* Monospace - Para código */
font-family: ui-monospace, SFMono-Regular, monospace;
```

### Font Weights

- **400 (Normal)**: Corpo de texto, conteúdo padrão
- **600 (Semibold)**: Ênfase moderada, títulos secundários
- **700 (Bold)**: Ênfase forte, títulos principais

## Espaçamento

Sistema de espaçamento baseado em `4px`:

| Token | Valor | Uso |
|-------|-------|-----|
| xs | 4px | Micro espaçamentos |
| sm | 8px | Espaçamento pequeno |
| md | 16px | Espaçamento padrão |
| lg | 24px | Espaçamento grande |
| xl | 32px | Espaçamento extra grande |

## Raio de Borda

| Token | Valor | Componentes |
|-------|-------|-------------|
| sm | 4px | Inputs pequenos |
| md | 8px | Elementos padrão |
| lg | 12px | Cards, modais |
| full | 9999px | Badges, pills |

## Sombras

| Tamanho | Valor | Uso |
|---------|-------|-----|
| sm | `0 1px 2px rgba(0,0,0,0.1)` | Elevação leve |
| md | `0 4px 16px rgba(0,0,0,0.2)` | Elevação padrão (Cards) |
| lg | `0 8px 24px rgba(0,0,0,0.3)` | Elevação forte (Modais) |

## Estados Interativos

### Hover
- Aumento de shadow
- Mudança de cor (geralmente +1 nível de tom)
- Cursor pointer em elementos clicáveis

### Focus
- Ring de foco: `ring-2 ring-primary-500`
- Ring offset: `ring-offset-2 ring-offset-dark-900`

### Disabled
- Opacity: `opacity-50`
- Cursor: `not-allowed`
- Sem efeitos hover

### Active
- Scale: `scale-95` (pressionado)
- Cor mais escura

## Transitions

- **Duration padrão**: 200ms
- **Timing function**: ease-in-out
- **Propriedades comuns**: `background-color`, `border-color`, `transform`, `opacity`

## Breakpoints (Responsive)

| Nome | Tamanho | Uso |
|------|---------|-----|
| sm | 640px | Celular pequeno |
| md | 768px | Tablet |
| lg | 1024px | Desktop pequeno |
| xl | 1280px | Desktop padrão |
| 2xl | 1536px | Desktop grande |

## Exemplos de Uso

### Cor Primária em Botão
```tsx
<Button variant="primary" className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
  Click Me
</Button>
```

### Typography
```tsx
<h1 className="text-5xl font-bold">Heading 1</h1>
<p className="text-base leading-relaxed">Body text</p>
<small className="text-sm text-gray-400">Small text</small>
```

### Card com Espaçamento
```tsx
<Card className="p-6 space-y-4">
  <h2 className="text-2xl font-semibold">Title</h2>
  <p className="text-base">Content</p>
</Card>
```

## Acessibilidade na Paleta

- Todas as cores seguem WCAG AA (contrast ratio ≥ 4.5:1)
- Não usamos apenas cor para comunicar status
- Fornecemos ícones ou padrões adicionais quando necessário
- Focus states sempre visíveis e de alto contraste

## Temas

### Light Mode
- Fundo: Branco/Cinza claro
- Texto: Preto/Cinza escuro
- Acentos: Cores primárias normais

### Dark Mode (Padrão)
- Fundo: Dark 900 (`#0f172a`)
- Texto: Dark 50 (`#f9fafb`)
- Acentos: Cores primárias com maior brilho

## Referências

- Página de componentes: Ver `.storybook/`
- Componentes UI: Ver `components/ui/`
- Tailwind Config: Ver `tailwind.config.js`
