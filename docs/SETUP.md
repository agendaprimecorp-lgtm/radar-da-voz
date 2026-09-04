# Setup Guide - Radar da Voz

Guia completo para configurar e rodar o projeto localmente.

## Pré-requisitos

- **Node.js**: v18+ (recomendado v20)
- **npm**: v9+
- **Git**: v2.40+
- **Conta Supabase**: Para banco de dados
- **API Keys**: Cloudinary, Stripe, SendGrid, OneSignal

---

## Instalação Passo a Passo

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/radar-da-voz.git
cd radar-da-voz
```

### 2. Instalar Dependências

```bash
npm install --legacy-peer-deps
```

Usamos `--legacy-peer-deps` devido a compatibilidades de versão do Next.js 14.

### 3. Configurar Variáveis de Ambiente

Copiar arquivo de exemplo:

```bash
cp .env.example .env.local
```

Editar `.env.local` com suas chaves:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid
SENDGRID_API_KEY=SG.xxx...

# OneSignal
ONESIGNAL_APP_ID=app-id
ONESIGNAL_AUTH_KEY=your-auth-key

# Google Cloud Video Intelligence
GOOGLE_CLOUD_PROJECT_ID=your-project
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Deepgram (Audio Analysis)
DEEPGRAM_API_KEY=your-api-key
```

### 4. Configurar Banco de Dados

#### A. Criar Banco de Dados Supabase

1. Ir em https://supabase.com e criar novo projeto
2. Copiar `SUPABASE_URL` e chaves para `.env.local`

#### B. Executar Migrações

```bash
# Conectar via psql
psql postgresql://postgres:password@localhost:5432/postgres

# Ou via Supabase CLI
supabase migration up
```

Executar SQL migrations em ordem:

```bash
# db/001_users.sql
# db/002_organizations.sql
# db/003_talents.sql
# ... até db/013_local_representation.sql
```

Você pode executar tudo via Supabase SQL Editor ou via CLI.

### 5. Configurar Papéis de Banco de Dados

```bash
# Criar role psico360_app (CRÍTICO para RLS)
psql -d seu_database -c "CREATE ROLE psico360_app WITH LOGIN PASSWORD 'secure_password';"

# Importante: NÃO criar via painel (receberia BYPASSRLS)
```

### 6. Seed de Dados (Opcional)

```bash
# Executar seed para dados de teste
npm run db:seed
```

---

## Desenvolvimento Local

### Iniciar Dev Server

```bash
npm run dev
```

Servidor estará disponível em `http://localhost:3000`

### Hot Reload

O servidor suporta hot reload automático. Editar arquivo e salvar para atualizar.

### TypeScript Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

Correção automática:

```bash
npm run lint:fix
```

---

## Testes

### Rodar Testes Unitários

```bash
npm test
```

### Testes com Coverage

```bash
npm run test:coverage
```

Relatório gerado em `coverage/lcov-report/index.html`

### Testes E2E

```bash
npm run test:e2e
```

---

## Build para Produção

### Build Local

```bash
npm run build
```

Gera otimizações e arquivos em `.next/`

### Analisar Bundle

```bash
npm run analyze
```

### Iniciar Servidor Produção

```bash
npm run start
```

---

## Integração com Serviços Externos

### Cloudinary (Upload de Mídia)

1. Criar conta em https://cloudinary.com
2. Obter Cloud Name e API Key
3. Usar no upload:

```typescript
import { CldUploadWidget } from 'next-cloudinary'

<CldUploadWidget
  uploadPreset="seu_preset"
  onSuccess={(result) => {
    console.log(result.secure_url)
  }}
/>
```

### Stripe (Pagamentos)

1. Criar conta em https://stripe.com
2. Obter chaves de teste e produção
3. Configurar webhooks:

```bash
# Testar webhooks localmente
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### SendGrid (Email)

1. Criar conta em https://sendgrid.com
2. Obter API Key
3. Criar templates de email no painel
4. Usar lib/notifications.ts

### OneSignal (Push)

1. Criar conta em https://onesignal.com
2. Obter App ID e Auth Key
3. Seguir guia de integração web
4. Registrar tokens no cliente

---

## Troubleshooting

### Erro: "MODULE_NOT_FOUND"

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Erro: "EACCES: permission denied"

```bash
# Corrigir permissões em Mac/Linux
sudo chown -R $USER:$USER .
```

### Erro: "Supabase connection refused"

- Verificar se SUPABASE_URL está correto
- Verificar conexão de internet
- Testar conexão:

```bash
curl -i https://your-project.supabase.co/rest/v1/
```

### Erro: "RLS policy violation"

- Verificar se app está usando psico360_app role
- Confirmar que psico360_app NÃO tem BYPASSRLS
- Rodar teste: `npm test -- isolamento.test.ts`

---

## Ambiente de Staging

### Deploy para Staging

```bash
# Branch staging
git checkout staging
git pull origin staging

# Deploy via Vercel
vercel deploy --prod
```

### Testar Webhooks em Staging

```bash
# Usar ngrok para expor servidor local
ngrok http 3000

# Usar URL ngrok em webhook settings
```

---

## Documentação Adicional

- [API Documentation](./API.md)
- [Component Library](./COMPONENTS.md)
- [Architecture](./ARCHITECTURE.md)
- [Database Schema](./DATABASE.md)
- [Deployment Guide](../DEPLOYMENT.md)

---

## Suporte

- **Issues**: https://github.com/seu-usuario/radar-da-voz/issues
- **Email**: dev-support@radardevoz.com
- **Slack**: #radar-da-voz-dev (interno)

---

## Changelog

### v1.0.0 (2026-09-03)
- Initial setup guide
- Database configuration
- External integrations
- Troubleshooting
