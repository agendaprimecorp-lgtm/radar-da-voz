# Component Library - Radar da Voz

Guia completo dos componentes reutilizáveis da aplicação.

## Instalação

Todos os componentes estão em `/components` e podem ser importados diretamente:

```typescript
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
```

---

## Componentes Base

### Button

Botão reutilizável com múltiplas variantes.

**Importação:**
```typescript
import { Button } from '@/components/ui/button'
```

**Uso:**
```jsx
<Button>Clique aqui</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button size="sm">Pequeno</Button>
<Button size="lg">Grande</Button>
<Button disabled>Desabilitado</Button>
```

**Props:**
- `variant`: 'default' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `onClick`: () => void
- `children`: React.ReactNode

---

### Input

Campo de entrada de texto.

**Importação:**
```typescript
import { Input } from '@/components/ui/input'
```

**Uso:**
```jsx
<Input placeholder="Digite aqui..." />
<Input type="email" label="Email" />
<Input disabled value="Desabilitado" />
<Input error="Campo obrigatório" />
```

**Props:**
- `placeholder`: string
- `type`: 'text' | 'email' | 'password' | 'number'
- `label`: string
- `error`: string
- `disabled`: boolean
- `value`: string
- `onChange`: (e: ChangeEvent) => void

---

### Card

Container com estilo de card.

**Importação:**
```typescript
import { Card } from '@/components/ui/card'
```

**Uso:**
```jsx
<Card>
  <h3>Título do Card</h3>
  <p>Conteúdo do card</p>
</Card>

<Card className="p-8">
  Conteúdo customizado
</Card>
```

**Props:**
- `children`: React.ReactNode
- `className`: string (opcional)

---

### Badge

Etiqueta de status ou categoria.

**Importação:**
```typescript
import { Badge } from '@/components/ui/badge'
```

**Uso:**
```jsx
<Badge>Novo</Badge>
<Badge variant="success">Ativo</Badge>
<Badge variant="error">Erro</Badge>
<Badge variant="warning">Aviso</Badge>
```

---

### Modal

Diálogo modal.

**Importação:**
```typescript
import { Modal } from '@/components/ui/modal'
```

**Uso:**
```jsx
<Modal isOpen={isOpen} onClose={onClose} title="Confirmar">
  <p>Tem certeza que deseja continuar?</p>
  <div className="flex gap-4 mt-6">
    <Button onClick={onClose}>Cancelar</Button>
    <Button onClick={handleConfirm}>Confirmar</Button>
  </div>
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `children`: React.ReactNode

---

### Textarea

Área de texto multilinha.

**Importação:**
```typescript
import { Textarea } from '@/components/ui/textarea'
```

**Uso:**
```jsx
<Textarea 
  placeholder="Digite sua mensagem..."
  rows={5}
/>
```

**Props:**
- `placeholder`: string
- `rows`: number
- `value`: string
- `onChange`: (e: ChangeEvent) => void

---

## Componentes de Negócio

### TalentCard

Card que exibe informações de um talento.

**Importação:**
```typescript
import { TalentCard } from '@/components/talent/talent-card'
```

**Uso:**
```jsx
<TalentCard
  talent={{
    id: "uuid",
    name: "Maria Silva",
    specialty: "atriz",
    city: "São Paulo",
    rating: 4.8,
    avatar: "https://..."
  }}
/>
```

---

### VideoAnalysisResult

Exibe resultado de análise de vídeo.

**Importação:**
```typescript
import { VideoAnalysisResult } from '@/components/video/video-analysis-result'
```

**Uso:**
```jsx
<VideoAnalysisResult
  analysis={{
    carisma: 8.5,
    naturalidade: 7.9,
    tecnica: 8.2,
    feedback: ["Excelente presença", "Voz clara"]
  }}
/>
```

---

### ReviewForm

Formulário para avaliar talento.

**Importação:**
```typescript
import { ReviewForm } from '@/components/reviews/review-form'
```

**Uso:**
```jsx
<ReviewForm
  talentId="uuid"
  onSubmit={handleSubmit}
/>
```

---

### ChatWindow

Componente de chat para mensagens.

**Importação:**
```typescript
import { ChatWindow } from '@/components/messaging/chat-window'
```

**Uso:**
```jsx
<ChatWindow
  conversationId="uuid"
  recipientName="João Silva"
/>
```

---

### MetricsCard

Card para exibir métrica com trend.

**Importação:**
```typescript
import { MetricsCard } from '@/components/analytics/metrics-card'
```

**Uso:**
```jsx
<MetricsCard
  title="Usuários Ativos"
  value={1234}
  icon="👥"
  trend={{ value: 12, direction: 'up' }}
/>
```

---

## Composição de Componentes

### Exemplo: Formulário de Vaga

```jsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

export function JobForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: ''
  })

  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold mb-6">Criar Vaga</h2>
      
      <Input
        label="Título da Vaga"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      
      <Textarea
        label="Descrição"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows={5}
      />
      
      <Input
        type="number"
        label="Salário"
        value={formData.salary}
        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
      />
      
      <Button className="mt-6">Criar Vaga</Button>
    </Card>
  )
}
```

---

## Temas e Customização

### Dark Theme

Todos os componentes suportam dark theme via Tailwind CSS.

```jsx
// Automático com preferência do sistema
<div className="dark:bg-dark-900">
  <Button>Clique</Button>
</div>
```

### Cores Disponíveis

```
primary-500: #6366f1 (Indigo)
success-500: #10b981 (Green)
error-500: #ef4444 (Red)
warning-500: #f59e0b (Amber)
dark-900: #0f172a (Dark background)
dark-800: #1e293b
dark-400: #94a3b8
```

---

## Acessibilidade

Todos os componentes seguem WCAG 2.1 AA:

```jsx
// Buttons com aria-label
<Button aria-label="Enviar formulário">
  Enviar
</Button>

// Inputs com labels associados
<Input
  id="email"
  label="Email"
  aria-required="true"
/>
```

---

## Performance

### Otimização com React.memo

Componentes pesados devem usar `React.memo`:

```typescript
export const TalentCard = React.memo(({ talent }) => {
  return <div>...</div>
})
```

### Lazy Loading

```jsx
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

export function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

---

## Exemplos Completos

### Página de Talento

```jsx
import { TalentCard } from '@/components/talent/talent-card'
import { ReviewForm } from '@/components/reviews/review-form'
import { VideoAnalysisResult } from '@/components/video/video-analysis-result'
import { Button } from '@/components/ui/button'

export default function TalentPage({ id }) {
  const [talent, setTalent] = useState(null)
  
  useEffect(() => {
    fetch(`/api/talents/${id}`)
      .then(r => r.json())
      .then(d => setTalent(d.talent))
  }, [id])
  
  if (!talent) return <Loading />
  
  return (
    <div className="space-y-8">
      <TalentCard talent={talent} />
      
      <div className="grid grid-cols-2 gap-8">
        <VideoAnalysisResult analysis={talent.latestAnalysis} />
        <ReviewForm talentId={id} />
      </div>
      
      <Button className="w-full">Contratar</Button>
    </div>
  )
}
```

---

## Debugging

### DevTools

Use React DevTools para inspecionar componentes:

```bash
npm install --save-dev @react-devtools/shell
```

### Console Logging

```typescript
export const Button = ({ children, ...props }) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Button rendered:', children)
  }
  
  return <button {...props}>{children}</button>
}
```

---

## Contributing

Para adicionar novo componente:

1. Criar arquivo em `/components/ui/component-name.tsx`
2. Implementar com TypeScript
3. Adicionar exemplos neste guia
4. Testar com Jest
5. Fazer PR

---

## Changelog

### v1.0.0 (2026-09-03)
- Initial component library
- 15+ base components
- 8+ business components
- Dark theme support
- Accessibility compliant
