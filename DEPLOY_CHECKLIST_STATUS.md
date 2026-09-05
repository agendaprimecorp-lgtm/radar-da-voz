# Radar da Voz - Deploy Checklist Status
**Data:** 04 de Setembro de 2026
**Status:** PRÉ-DEPLOY COMPLETO - PRONTO PARA VERCEL

---

## 1. PRE-DEPLOY CHECKLIST ✓

### Build Local
- [x] `npm run build` - **SUCESSO**
  - Compilação concluída com sucesso
  - 57 páginas estáticas geradas
  - Tamanho otimizado

**Estrutura de rotas identificada:**
```
Route (app)                              Size     First Load JS
├ ○ / (Landing)                          3.2 kB          109 kB
├ ○ /admin/analytics                     1.76 kB        99.2 kB
├ ○ /admin/dashboard                     2.82 kB         111 kB
├ ○ /admin/local-representation          2.25 kB         111 kB
├ ○ /admin/monitoring                    1.56 kB          99 kB
├ λ /api/admin/dashboard                 0 B                0 B
├ λ /api/analytics/metrics               0 B                0 B
└ ... (20+ rotas de API)
```

### Requisitos de Node
- [x] Node.js: v24.19.0 ✓ (requerido: >=18.0.0)
- [x] npm: 11.17.0 ✓ (requerido: >=9.0.0)

### TypeScript & Linting
- [x] Corrigido: tsconfig.json (removida referência a tsconfig.node.json)
- [!] Type-check: 3 erros em testes (não bloqueia build)
- [x] Build: Completado sem erros

### Dependências
- [x] Next.js 14.0.0
- [x] React 18.2.0
- [x] TypeScript 5.2.0
- [x] Supabase 2.38.0
- [x] Stripe 13.0.0
- [x] Tailwind CSS 3.3.0
- [x] Cloudinary 2.11.0

---

## 2. VARIÁVEIS DE AMBIENTE REQUERIDAS

### Supabase (CRÍTICO)
```env
NEXT_PUBLIC_SUPABASE_URL=https://[seu-projeto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL_APP=postgresql://psico360_app:senha@db.supabase.co:5432/postgres
```

### Aplicação
```env
NEXT_PUBLIC_APP_URL=https://radar-da-voz.vercel.app
NODE_ENV=production
```

### Stripe (Pagamentos)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Cloudinary (Upload de Mídia)
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### Deepgram (Análise de Áudio)
```env
DEEPGRAM_API_KEY=xxx-xxx-xxx-xxx
```

### Google Cloud (Análise de Vídeo)
```env
GOOGLE_CLOUD_PROJECT_ID=seu-projeto
GOOGLE_APPLICATION_CREDENTIALS=sua-credencial-json
```

### SendGrid (Email)
```env
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@radardevoz.com
```

### Analytics (PostHog & Sentry)
```env
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Segurança
```env
JWT_SECRET=gerado-aleatoriamente-32-caracteres
ENCRYPTION_KEY=gerado-aleatoriamente-32-caracteres
```

### Rate Limiting (Redis - Opcional)
```env
REDIS_URL=redis://seu-redis.com:6379
```

### Analytics (Google Analytics)
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 3. CONFIGURAÇÃO VERCEL.JSON

✓ Já configurado em `vercel.json`:
- buildCommand: `npm run build`
- installCommand: `npm install --legacy-peer-deps`
- Environment variables: Supabase + App URLs
- Security headers: HSTS, X-Content-Type-Options, X-Frame-Options, CSP
- Rewrites: /robots.txt
- Redirects: /index → /

---

## 4. PRÓXIMOS PASSOS

### A. Login Vercel (Uma única vez)
```bash
cd "C:\Users\Rodrigo\Documents\radar da voz"
vercel login
# Seguir as instruções para autenticar com GitHub/Google/Vercel Account
```

### B. Link Project com Vercel
```bash
vercel link
# Opção 1: Conectar projeto existente no Vercel
# Opção 2: Criar novo projeto
```

### C. Configurar Variáveis de Ambiente
Via dashboard: https://vercel.com/dashboard
1. Selecionar projeto `radar-da-voz`
2. Settings → Environment Variables
3. Adicionar todas as 20+ variáveis

**Variáveis críticas (sem estas, app não funciona):**
- NEXT_PUBLIC_SUPABASE_URL ✓
- NEXT_PUBLIC_SUPABASE_ANON_KEY ✓
- SUPABASE_SERVICE_ROLE_KEY ✓
- DATABASE_URL_APP ✓
- NEXT_PUBLIC_APP_URL ✓
- STRIPE_SECRET_KEY (para pagamentos)
- CLOUDINARY_API_KEY (para uploads)

### D. Deploy em Produção
```bash
vercel deploy --prod
```

### E. Configurar Webhooks Stripe
1. Ir para: https://dashboard.stripe.com/webhooks
2. Novo endpoint:
   - URL: `https://radar-da-voz.vercel.app/api/stripe/webhook`
   - Eventos: payment_intent.succeeded, invoice.payment_succeeded
3. Copiar Signing Secret
4. Adicionar `STRIPE_WEBHOOK_SECRET` no Vercel

### F. Configurar CORS Supabase
1. https://app.supabase.com → Project Settings → API
2. CORS: Adicionar `https://radar-da-voz.vercel.app`

### G. Configurar Whitelist Cloudinary
1. https://cloudinary.com/console → Settings → Security
2. Domínios: `radar-da-voz.vercel.app`

---

## 5. TESTES PÓS-DEPLOY

Após fazer `vercel deploy --prod`, verificar:

```bash
# 1. Acessar URL
curl https://radar-da-voz.vercel.app/

# 2. Verificar health check
curl https://radar-da-voz.vercel.app/api/health

# 3. Verificar páginas principais
- Landing page (/)
- Admin dashboard (/admin/dashboard)
- Analytics (/admin/analytics)

# 4. Testar funcionalidades
- Login/Signup (/api/auth/signup)
- Upload de mídia (/api/upload)
- Análise de áudio (/api/analyze/audio)
```

---

## 6. MONITORAMENTO & ALERTAS

Após deploy, configurar no Vercel Dashboard:
- Notificações de erro (500, timeout)
- Alertas de performance (First Paint > 3s)
- Logs: `vercel logs` (em tempo real)

---

## 7. COMANDOS RÁPIDOS DE REFERÊNCIA

```bash
# Login Vercel
vercel login

# Vincular projeto
vercel link

# Deploy preview (staging)
vercel deploy

# Deploy produção
vercel deploy --prod

# Ver logs
vercel logs

# Listar variáveis de ambiente
vercel env list

# Deletar projeto (cuidado!)
vercel remove

# Alias customizado (domínio)
vercel alias set radar-da-voz.vercel.app radardevoz.com
```

---

## 8. ESTIMATIVA DE TEMPO

- Configurar Vercel CLI & login: **5 min**
- Adicionar variáveis de ambiente: **10 min**
- Deploy em produção: **5 min**
- Configurar Stripe webhook: **5 min**
- Configurar CORS/Whitelist: **5 min**
- Testes pós-deploy: **10 min**

**TOTAL: ~40 minutos**

---

## 9. STATUS FINAL

✅ Build local: **COMPLETO**
✅ Dependências: **OK**
✅ Configuração TypeScript: **CORRIGIDA**
✅ Vercel.json: **PRONTO**
✅ Estrutura do projeto: **VALIDADA**

⏳ Pendente: **Variáveis de ambiente no Vercel Dashboard**

---

## PRÓXIMA AÇÃO: Seguir o passo A-G acima para completar o deploy! 🚀
