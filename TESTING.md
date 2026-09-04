# 🧪 Testing - Radar da Voz

## Setup

```bash
npm install --legacy-peer-deps
npm run test          # Rodar testes
npm run test:watch   # Modo watch
npm run test:cov     # Coverage
```

## Estrutura de Testes

```
__tests__/
├── lib/
│   ├── validation.test.ts      (schemas, sanitização)
│   ├── messaging.test.ts        (funções de chat)
│   └── rate-limiter.test.ts    (rate limiting)
├── api/
│   ├── auth.test.ts            (login, signup)
│   ├── messages.test.ts        (chat API)
│   └── health.test.ts          (health check)
├── components/
│   ├── button.test.tsx         (UI components)
│   ├── chat-window.test.tsx    (chat component)
│   └── input.test.tsx          (input component)
├── security/
│   ├── rls.test.ts             (Row-Level Security)
│   ├── lgpd.test.ts            (LGPD compliance)
│   └── headers.test.ts         (security headers)
├── db/
│   └── isolamento.test.ts      (CRÍTICO: BYPASSRLS check)
└── e2e/
    ├── signup-flow.test.ts     (signup completo)
    ├── job-flow.test.ts        (vaga completa)
    └── chat-flow.test.ts       (chat completo)
```

## Cobertura de Testes

```
Target: 60%+ em todas as métricas

Coverage:
├── Branches: 60%+
├── Functions: 60%+
├── Lines: 60%+
└── Statements: 60%+
```

## Testes Críticos

### 1. RLS (Row-Level Security)
```bash
npm test -- __tests__/db/isolamento.test.ts
```
✅ **CRÍTICO**: Verifica se psico360_app NÃO tem BYPASSRLS
- Se falhar: isolamento entre usuários está quebrado!

### 2. LGPD Compliance
```bash
npm test -- __tests__/security/lgpd.test.ts
```
✅ Verifica direitos LGPD:
- Direito de acesso (export)
- Direito ao esquecimento (delete)
- Consentimento

### 3. Auth & Segurança
```bash
npm test -- __tests__/api/auth.test.ts
```
✅ Verifica:
- Login/Signup
- Rate limiting
- Validação de força de senha

## Rodando Testes

### Todos os testes
```bash
npm test
```

### Apenas unit tests
```bash
npm test -- --testPathPattern="lib|components"
```

### Apenas integration tests
```bash
npm test -- --testPathPattern="api|e2e"
```

### Apenas security tests
```bash
npm test -- --testPathPattern="security|db"
```

### Com coverage
```bash
npm run test:cov
```

### Watch mode (desenvolvimento)
```bash
npm run test:watch
```

## Checklist Pré-Deploy

```bash
# 1. Rodar todos os testes
npm test -- --coverage

# 2. Verificar cobertura mínima
coverage: ✅ 60%+ em todas as métricas

# 3. Verificar testes críticos
✅ RLS isolamento: PASSOU
✅ LGPD compliance: PASSOU
✅ Auth security: PASSOU

# 4. Se algum teste falhar
npm test -- --watch [path]
# Debugar e fixar

# 5. Commit apenas se todos passarem
git commit -m "tests: ✅ cobertura 60%+ validada"
```

## Mock Setup

### Supabase Mock
```typescript
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      // ... métodos
    })),
  })),
}))
```

### Next Router Mock
```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
}))
```

## Escrevendo Novos Testes

### Template - Unit Test
```typescript
describe('Minha Função', () => {
  it('deve fazer X quando recebe Y', () => {
    const resultado = minhaFuncao('input')
    expect(resultado).toBe('output esperado')
  })
})
```

### Template - Integration Test
```typescript
describe('POST /api/endpoint', () => {
  it('deve retornar 200 com dados válidos', async () => {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    })
    expect(response.status).toBe(200)
  })
})
```

### Template - Component Test
```typescript
describe('MyComponent', () => {
  it('deve renderizar corretamente', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

## CI/CD Integration

Testes rodam automaticamente:

```yaml
# .github/workflows/deploy.yml
- name: Run Tests
  run: npm test -- --coverage
  
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Troubleshooting

### Teste falha com "Cannot find module"
```bash
# Limpar cache
npm test -- --clearCache

# Rerun
npm test
```

### Mock não está funcionando
```bash
# Verificar jest.setup.js
cat jest.setup.js

# Reiniciar jest
npm test -- --clearCache --watch
```

### Cobertura não é suficiente
```bash
# Ver qual arquivo precisa cobertura
npm run test:cov

# Abrir coverage/lcov-report/index.html
# Encontrar arquivos em vermelho
# Adicionar testes para eles
```

## Resources

- Jest: https://jestjs.io/
- Testing Library: https://testing-library.com/
- Mock Service Worker: https://mswjs.io/

---

**Requisito Mínimo:** 60% cobertura
**Objetivo:** 80%+ cobertura
**Status:** 🟡 Em construção
