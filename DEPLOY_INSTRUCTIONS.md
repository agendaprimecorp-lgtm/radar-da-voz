# Instruções Completas de Deploy - Radar da Voz

## ⏱️ TEMPO TOTAL: ~40 MINUTOS

---

## FASE 1: PREPARAÇÃO (5 minutos)

### 1.1 Navegar para o projeto
```powershell
cd "C:\Users\Rodrigo\Documents\radar da voz"
```

### 1.2 Verificar status Git
```bash
git status
# Deve estar limpo (sem mudanças não commitadas)
```

### 1.3 Fazer commit das mudanças (se houver)
```bash
git add .
git commit -m "chore: prepare for production deploy to vercel"
git push origin main
```

---

## FASE 2: VERCEL CLI (5 minutos)

### 2.1 Login no Vercel
```bash
vercel login
```

**O que acontece:**
1. Abre navegador pedindo autenticação
2. Escolher: GitHub, GitLab, Bitbucket ou Vercel Account
3. Autorizar e voltar para terminal
4. CLI salva token em `~/.vercel`

### 2.2 Vincular projeto com Vercel
```bash
vercel link
```

**Opções ao executar:**
```
? Set up and deploy "C:\Users\Rodrigo\Documents\radar da voz"? [Y/n] Y

? Which scope should contain your project? (seu-github-user)

? Link to existing project? [y/N] 
  - Se sim: escolher projeto existente
  - Se não: criar novo projeto

? Found project "radar-da-voz". Link to it? [Y/n] Y
```

**Resultado:**
- Cria arquivo `.vercel/project.json`
- Cria arquivo `.vercel/README.txt`

---

## FASE 3: CONFIGURAR VARIÁVEIS DE AMBIENTE (10 minutos)

### 3.1 Abrir Vercel Dashboard
1. Ir para: **https://vercel.com/dashboard**
2. Selecionar projeto: **radar-da-voz**
3. Clicar em: **Settings → Environment Variables**

### 3.2 Adicionar Variáveis - SUPABASE (CRÍTICO)

**Nome:** `NEXT_PUBLIC_SUPABASE_URL`  
**Valor:** `https://[seu-projeto-id].supabase.co`  
**Ambientes:** Production, Preview, Development  
Clique: **Add**

**Nome:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
**Valor:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (do Supabase)  
**Ambientes:** Production, Preview, Development  
Clique: **Add**

**Nome:** `SUPABASE_SERVICE_ROLE_KEY`  
**Valor:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (do Supabase - SECRET)  
**Ambientes:** Production, Preview, Development  
Clique: **Add**

**Nome:** `DATABASE_URL_APP`  
**Valor:** `postgresql://psico360_app:senha@db.supabase.co:5432/postgres`  
**Ambientes:** Production, Preview, Development  
Clique: **Add**

### 3.3 Adicionar Variáveis - APLICAÇÃO

**Nome:** `NEXT_PUBLIC_APP_URL`  
**Valor:** `https://radar-da-voz.vercel.app`  
**Ambientes:** Production  
**Valor:** `http://localhost:3000`  
**Ambientes:** Development  
Clique: **Add** (duas vezes, uma para cada ambiente)

**Nome:** `NODE_ENV`  
**Valor:** `production`  
**Ambientes:** Production, Preview  
Clique: **Add**

### 3.4 Adicionar Variáveis - STRIPE (Pagamentos)

**Nome:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`  
**Valor:** `pk_live_...` (de https://dashboard.stripe.com/keys)  
**Ambientes:** Production  
Clique: **Add**

**Nome:** `STRIPE_SECRET_KEY`  
**Valor:** `sk_live_...` (de https://dashboard.stripe.com/keys - SECRET)  
**Ambientes:** Production  
Clique: **Add**

**Nome:** `STRIPE_WEBHOOK_SECRET`  
**Valor:** `whsec_...` (será gerado depois)  
**Ambientes:** Production  
Clique: **Add**

### 3.5 Adicionar Variáveis - CLOUDINARY (Upload)

**Nome:** `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`  
**Valor:** (de https://cloudinary.com/console)  
**Ambientes:** Production, Preview, Development  
Clique: **Add**

**Nome:** `CLOUDINARY_API_KEY`  
**Valor:** (de https://cloudinary.com/console - Settings)  
**Ambientes:** Production, Preview, Development  
Clique: **Add**

**Nome:** `CLOUDINARY_API_SECRET`  
**Valor:** (de https://cloudinary.com/console - SECRET)  
**Ambientes:** Production, Preview, Development  
Clique: **Add**

### 3.6 Adicionar Variáveis - DEEPGRAM (Áudio)

**Nome:** `DEEPGRAM_API_KEY`  
**Valor:** (de https://console.deepgram.com/keys)  
**Ambientes:** Production, Preview, Development  
Clique: **Add**

### 3.7 Adicionar Variáveis - GOOGLE CLOUD (Vídeo)

**Nome:** `GOOGLE_CLOUD_PROJECT_ID`  
**Valor:** (de Google Cloud Console)  
**Ambientes:** Production, Preview, Development  
Clique: **Add**

**Nome:** `GOOGLE_APPLICATION_CREDENTIALS`  
**Valor:** (JSON da Google Cloud - SECRET)  
**Ambientes:** Production, Preview, Development  
Clique: **Add**

### 3.8 Adicionar Variáveis - SENDGRID (Email)

**Nome:** `SENDGRID_API_KEY`  
**Valor:** `SG.xxx` (de https://app.sendgrid.com/settings/api_keys - SECRET)  
**Ambientes:** Production, Preview, Development  
Clique: **Add**

**Nome:** `SENDGRID_FROM_EMAIL`  
**Valor:** `noreply@radardevoz.com`  
**Ambientes:** Production, Preview, Development  
Clique: **Add**

### 3.9 Adicionar Variáveis - ANALYTICS

**Nome:** `NEXT_PUBLIC_GA_ID`  
**Valor:** `G-XXXXXXXXXX` (Google Analytics)  
**Ambientes:** Production  
Clique: **Add**

**Nome:** `NEXT_PUBLIC_POSTHOG_KEY`  
**Valor:** `phc_xxx` (de https://app.posthog.com)  
**Ambientes:** Production, Preview, Development  
Clique: **Add**

**Nome:** `NEXT_PUBLIC_POSTHOG_HOST`  
**Valor:** `https://app.posthog.com`  
**Ambientes:** Production, Preview, Development  
Clique: **Add**

**Nome:** `NEXT_PUBLIC_SENTRY_DSN`  
**Valor:** (de https://sentry.io)  
**Ambientes:** Production, Preview, Development  
Clique: **Add**

### 3.10 Adicionar Variáveis - SEGURANÇA

**Nome:** `JWT_SECRET`  
**Valor:** [Gerar com: `openssl rand -hex 32`]  
**Ambientes:** Production  
Clique: **Add**

**Nome:** `ENCRYPTION_KEY`  
**Valor:** [Gerar com: `openssl rand -hex 32`]  
**Ambientes:** Production  
Clique: **Add**

---

## FASE 4: GERAR CHAVES DE SEGURANÇA (2 minutos)

### 4.1 No PowerShell, gerar JWT_SECRET
```powershell
$bytes = [byte[]]::new(32)
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$hex = [System.BitConverter]::ToString($bytes) -replace "-",""
$hex.ToLower()
# Copiar saída e adicionar ao Vercel como JWT_SECRET
```

### 4.2 Gerar ENCRYPTION_KEY (mesmo processo)
```powershell
$bytes = [byte[]]::new(32)
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$hex = [System.BitConverter]::ToString($bytes) -replace "-",""
$hex.ToLower()
# Copiar saída e adicionar ao Vercel como ENCRYPTION_KEY
```

---

## FASE 5: DEPLOY EM PRODUÇÃO (5 minutos)

### 5.1 Fazer deploy
```bash
cd "C:\Users\Rodrigo\Documents\radar da voz"
vercel deploy --prod
```

**Output esperado:**
```
✓ Production build complete
✓ Deployed to https://radar-da-voz.vercel.app [1s]
```

### 5.2 Aguardar que o deployment complete
- Vercel automaticamente faz build e deploy
- Tempo estimado: 2-5 minutos
- Você pode monitorar em: https://vercel.com/deployments

---

## FASE 6: CONFIGURAR STRIPE WEBHOOK (5 minutos)

### 6.1 Ir para Stripe Webhooks
1. Abrir: https://dashboard.stripe.com/webhooks
2. Clique em: **Add endpoint**

### 6.2 Configurar endpoint
**URL do endpoint:** `https://radar-da-voz.vercel.app/api/stripe/webhook`

**Eventos a escutar:**
- ✓ `charge.failed`
- ✓ `charge.succeeded`
- ✓ `payment_intent.succeeded`
- ✓ `payment_intent.payment_failed`
- ✓ `invoice.paid`
- ✓ `invoice.payment_failed`
- ✓ `customer.created`
- ✓ `customer.updated`
- ✓ `customer.deleted`

Clique: **Create endpoint**

### 6.3 Copiar Signing Secret
- Depois de criar, clicar no endpoint
- Copiar: **Signing secret** (começa com `whsec_`)
- Ir para Vercel Dashboard → Environment Variables
- Adicionar: `STRIPE_WEBHOOK_SECRET` = valor copiado

---

## FASE 7: CONFIGURAR CORS SUPABASE (3 minutos)

### 7.1 Abrir Supabase
1. Ir para: https://app.supabase.com
2. Selecionar projeto
3. Clicar em: **Settings → API**

### 7.2 Adicionar domínio ao CORS
**Seção: "CORS Configuration"**
- Clique em: **Add**
- Valor: `https://radar-da-voz.vercel.app`
- Clique em: **Save**

---

## FASE 8: CONFIGURAR CLOUDINARY (2 minutos)

### 8.1 Abrir Cloudinary
1. Ir para: https://cloudinary.com/console
2. Settings → Security

### 8.2 Whitelist de domínios
**Seção: "Restricted media access"**
- Valor: `radar-da-voz.vercel.app`
- Salvar

---

## FASE 9: TESTES PÓS-DEPLOY (10 minutos)

### 9.1 Acessar URL principal
```bash
curl https://radar-da-voz.vercel.app/
```
✓ Deve retornar HTML da landing page

### 9.2 Testar health check (se existir)
```bash
curl https://radar-da-voz.vercel.app/api/health
```
✓ Deve retornar JSON com status

### 9.3 Acessar páginas principais no navegador
- [ ] https://radar-da-voz.vercel.app/ (landing)
- [ ] https://radar-da-voz.vercel.app/admin/dashboard
- [ ] https://radar-da-voz.vercel.app/admin/analytics

**Verificar em cada página:**
- ✓ Carrega sem erros
- ✓ CSS aplicado corretamente (cores indigo)
- ✓ Ícones SVG aparecem
- ✓ Responsividade OK (abrir DevTools F12, testar mobile)
- ✓ Console sem erros críticos

### 9.4 Testar funcionalidades críticas
- [ ] Login/Signup funciona
- [ ] Upload de mídia funciona (se houver)
- [ ] Stripe carrega corretamente
- [ ] Database conecta (sem erros de conexão)

### 9.5 Verificar Performance
```bash
# Usar DevTools → Lighthouse
# Abrir: https://radar-da-voz.vercel.app
# Clicar: F12 → Lighthouse → Generate report

# Verificar:
- Performance: > 80
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 3s
```

### 9.6 Verificar Build Logs
```bash
vercel logs https://radar-da-voz.vercel.app --follow
```

### 9.7 Listar Deployments
```bash
vercel list
```

---

## FASE 10: MONITORAMENTO & ALERTAS (2 minutos)

### 10.1 Ativar notificações no Vercel
1. Vercel Dashboard → Project Settings → Monitoring
2. Habilitar:
   - [ ] Error notifications
   - [ ] Performance alerts
   - [ ] Deployment notifications

### 10.2 Ativar logs em tempo real
```bash
vercel logs https://radar-da-voz.vercel.app --follow
```

### 10.3 Setup Sentry (opcional)
1. https://sentry.io → Create project
2. Copiar DSN
3. Adicionar `NEXT_PUBLIC_SENTRY_DSN` no Vercel

---

## FASE 11: CONFIGURAR DOMÍNIO CUSTOMIZADO (OPCIONAL)

### 11.1 Configurar radardevoz.com (se houver)
1. Vercel Dashboard → Project → Domains
2. Clique em: **Add Domain**
3. Digite: `radardevoz.com`
4. Escolher tipo:
   - [ ] Use Vercel Nameservers (recomendado)
   - [ ] Use external nameservers (avançado)
5. Seguir instruções DNS
6. Aguardar propagação (24-48h)

---

## TROUBLESHOOTING

### ❌ Erro: "NEXT_PUBLIC_SUPABASE_URL is not defined"
**Solução:** Adicionar variável no Vercel Dashboard e fazer redeploy
```bash
vercel deploy --prod
```

### ❌ Erro: "Stripe webhook failed"
**Solução:** Verificar se `STRIPE_WEBHOOK_SECRET` está correto
1. Ir para Stripe Dashboard → Webhooks
2. Copiar signing secret novamente
3. Atualizar no Vercel

### ❌ Erro: "CORS error from Supabase"
**Solução:** Adicionar domínio ao CORS no Supabase
1. Settings → API → CORS
2. Adicionar: `https://radar-da-voz.vercel.app`

### ❌ Erro: "Connection refused to Cloudinary"
**Solução:** Verificar chaves e adicionar domínio ao whitelist
1. https://cloudinary.com/console → Settings → Security
2. Adicionar domínio

### ❌ Deploy muito lento (> 10 min)
**Solução:** Verificar tamanho de build
```bash
vercel logs https://radar-da-voz.vercel.app --since=5m
```

---

## CHECKLIST FINAL

- [ ] Variáveis de ambiente configuradas (20+)
- [ ] Deploy em produção completo
- [ ] URL acessível (https://radar-da-voz.vercel.app)
- [ ] Landing page carrega
- [ ] Admin dashboard funciona
- [ ] Stripe webhook configurado
- [ ] Supabase CORS atualizado
- [ ] Cloudinary whitelist atualizado
- [ ] Testes pós-deploy OK
- [ ] Monitoramento ativado
- [ ] Logs verificados

---

## RESUMO DOS COMANDOS

```bash
# 1. Login
vercel login

# 2. Vincular projeto
vercel link

# 3. Deploy em produção
vercel deploy --prod

# 4. Ver logs
vercel logs https://radar-da-voz.vercel.app --follow

# 5. Listar deployments
vercel list

# 6. Verificar variáveis
vercel env list
```

---

## SUPORTE & DOCUMENTAÇÃO

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Cloudinary Docs:** https://cloudinary.com/documentation

---

## TEMPO TOTAL ESTIMADO: 40 MINUTOS ⏱️

**Sucesso!** App estará ao vivo em https://radar-da-voz.vercel.app 🚀
