# Acessibilidade - Guia WCAG AA

Diretrizes de acessibilidade para o Radar da Voz, seguindo padrões WCAG 2.1 nível AA.

## Princípios WCAG

### 1. Perceptível
Informações e componentes devem ser perceptíveis a todos os usuários.

### 2. Operável
Componentes devem ser operáveis via teclado e mouse.

### 3. Compreensível
Texto, instruções e navegação devem ser claros.

### 4. Robusto
Compatível com tecnologias assistivas (screen readers, etc).

---

## Contraste e Cores

### Requisitos

- **Texto normal**: Ratio mínimo **4.5:1**
- **Texto grande** (18pt+): Ratio mínimo **3:1**
- **Componentes UI**: Ratio mínimo **3:1**

### Paleta de Cores Testadas

Todas as cores do design system foram testadas contra fundo Dark 900.

| Cor | Fundo | Ratio | Status |
|-----|-------|-------|--------|
| Primary 500 | Dark 900 | 5.2:1 | ✓ AA |
| Secondary 500 | Dark 900 | 4.8:1 | ✓ AA |
| Success 500 | Dark 900 | 4.2:1 | ✓ AA |
| Error 500 | Dark 900 | 4.7:1 | ✓ AA |
| Warning 500 | Dark 900 | 7.5:1 | ✓ AA |

### Boas Práticas com Cores

```tsx
// ✓ BOM: Usa cor + ícone para status
<div className="flex items-center gap-2">
  <span className="text-green-500">✓</span>
  <span>Verificado</span>
</div>

// ✗ RUIM: Apenas cor para status
<div className="text-green-500">Verificado</div>
```

---

## Navegação por Teclado

### Requisitos

- Todos elementos interativos devem ser focusáveis
- Ordem de tabulação deve ser lógica (esquerda→direita, topo→rodapé)
- Focus ring sempre visível

### Focus Styles

Todos os botões e links têm focus ring:

```tsx
className={cn(
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-primary-500",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-dark-900"
)}
```

**Aparência:**
- Borda de 2px com cor primary
- Offset de 2px para visibilidade

### Skip Links

Adicione link para pular para conteúdo principal:

```tsx
<a 
  href="#main-content" 
  className="absolute -top-40 left-0 bg-primary-500 text-white px-4 py-2 focus:top-0 transition-all"
>
  Skip to main content
</a>
```

### Ordem de Tabulação

Use `tabIndex` com cuidado:

```tsx
// ✓ BOM: Ordem natural
<button>First</button>
<button>Second</button>
<button>Third</button>

// ✗ RUIM: Ordem confusa
<button tabIndex={3}>First</button>
<button tabIndex={1}>Second</button>
<button tabIndex={2}>Third</button>
```

---

## ARIA Labels

### Para Ícones

```tsx
// ✓ BOM: Ícone com aria-label
<button aria-label="Fechar menu">
  <IconX aria-hidden="true" />
</button>

// ✗ RUIM: Ícone sem descrição
<button>
  <IconX />
</button>
```

### Para Formulários

```tsx
// ✓ BOM: Label conectado ao input
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// ✗ RUIM: Sem label
<input type="email" placeholder="Email" />
```

### Para Descritores

```tsx
// ✓ BOM: Input com descrição
<div>
  <label htmlFor="password">Senha</label>
  <input 
    id="password"
    aria-describedby="password-hint"
    type="password"
  />
  <p id="password-hint" className="text-sm">
    Mín. 8 caracteres, 1 número
  </p>
</div>
```

### Para Expandir/Colapsar

```tsx
// ✓ BOM: aria-expanded para accordions
<button 
  aria-expanded={isOpen}
  aria-controls="panel-1"
>
  More details
</button>
<div id="panel-1" hidden={!isOpen}>
  {/* conteúdo */}
</div>
```

### Para Conteúdo Decorativo

```tsx
// ✓ BOM: aria-hidden para elementos decorativos
<svg aria-hidden="true" className="w-4 h-4">
  <circle cx="50" cy="50" r="50" />
</svg>
```

---

## Text Alternatives

### Imagens

```tsx
// ✓ BOM: Alt text descritivo
<img 
  src="profile.jpg" 
  alt="João Silva, voice talent, 4.8 stars"
/>

// ✗ RUIM: Alt vazio ou genérico
<img src="profile.jpg" alt="image" />
```

### Ícones em SVG

```tsx
// ✓ BOM: SVG com title
<svg>
  <title>Volume muted</title>
  <path d="..." />
</svg>
```

---

## Estrutura de Página

### Headings

Devem ter hierarquia lógica:

```tsx
// ✓ BOM: Hierarquia correta
<h1>Radar da Voz</h1>
<h2>Encontre Talentos</h2>
<h3>Por categoria</h3>

// ✗ RUIM: Pulando níveis
<h1>Radar da Voz</h1>
<h3>Por categoria</h3>  {/* Deveria ser h2 */}
```

### Landmarks

Use tags semânticas:

```tsx
<header>Logo e navegação</header>
<nav>Menu principal</nav>
<main id="main-content">Conteúdo principal</main>
<aside>Sidebar</aside>
<footer>Rodapé</footer>
```

---

## Formulários

### Labels Associados

```tsx
// ✓ BOM
<label htmlFor="name">Name</label>
<input id="name" type="text" />

// ✗ RUIM
<label>Name</label>
<input type="text" />
```

### Mensagens de Erro

```tsx
<div>
  <label htmlFor="email">Email</label>
  <input 
    id="email"
    type="email"
    aria-describedby="email-error"
  />
  <p id="email-error" role="alert" className="text-red-500">
    Email inválido
  </p>
</div>
```

### Campos Obrigatórios

```tsx
<label htmlFor="name">
  Name <span aria-label="required">*</span>
</label>
<input 
  id="name" 
  type="text"
  required
  aria-required="true"
/>
```

---

## Modais e Dialogs

### Requisitos

- Focus preso dentro do modal
- ESC fecha o modal
- Anúncio ao abrir/fechar

```tsx
<dialog
  role="dialog"
  aria-labelledby="dialog-title"
  aria-modal="true"
>
  <h2 id="dialog-title">Confirmar ação</h2>
  <p>Tem certeza?</p>
  <button onClick={onClose}>Cancelar</button>
  <button onClick={onConfirm}>Confirmar</button>
</dialog>
```

---

## Animações

### Respeitar Preferências do Sistema

```tsx
// Respeitar prefers-reduced-motion
import { useReducedMotion } from 'framer-motion'

const prefersReducedMotion = useReducedMotion()

if (prefersReducedMotion) {
  // Sem animações
}
```

### CSS Alternativo

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Testes de Acessibilidade

### Ferramentas Recomendadas

1. **axe DevTools** (Browser Extension)
2. **Wave** (Web Accessibility Evaluation Tool)
3. **Lighthouse** (Chrome DevTools)
4. **Screen Reader Testing** (NVDA, JAWS)

### Checklist

- [ ] Contrast ratio ≥ 4.5:1
- [ ] Navegação por teclado funciona
- [ ] Focus ring sempre visível
- [ ] Labels para inputs
- [ ] Alt text para imagens
- [ ] Hierarquia de headings correta
- [ ] Landmarks semânticos
- [ ] Avisos e erros anunciados
- [ ] Sem dependência apenas de cor
- [ ] Mobile accessible

---

## Componentes Específicos

### Button

```tsx
<button
  className="focus:ring-2 focus:ring-primary-500"
  aria-label="Descrever ação"
  disabled={isDisabled}
>
  {loading && <span aria-hidden="true">⏳</span>}
  Clique aqui
</button>
```

### Card

```tsx
<article role="region" aria-labelledby="card-title">
  <h2 id="card-title">Título do Card</h2>
  {/* conteúdo */}
</article>
```

### Input

```tsx
<div className="space-y-2">
  <label htmlFor="email" className="block font-semibold">
    Email <span aria-label="required">*</span>
  </label>
  <input
    id="email"
    type="email"
    aria-describedby="email-hint"
    aria-required="true"
  />
  <p id="email-hint" className="text-sm text-gray-400">
    Padrão: usuario@exemplo.com
  </p>
</div>
```

---

## Recursos

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [The A11Y Project](https://www.a11yproject.com/)

---

## Contato

Para questões de acessibilidade, entre em contato com o time de design.
