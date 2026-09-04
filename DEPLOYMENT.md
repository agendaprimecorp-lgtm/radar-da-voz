# 🚀 Deployment - Radar da Voz

## Pre-Deploy Checklist

```bash
✅ Código commitado e pusheado
✅ Testes passando (npm test)
✅ Build local funcionando (npm run build)
✅ Variáveis de ambiente configuradas
✅ Banco de dados migrado (005_security_compliance.sql)
✅ RLS testado e validado
```

## 1. Preparar Vercel

### 1.1 Criar Projeto no Vercel

```bash
# Option A: Via CLI
npm i -g vercel
vercel login
vercel

# Option B: Via dashboard
# 1. Acessar https://vercel.com/new
# 2. Importar repositório Git
# 3. Selecionar "Next.js" como framework
```

### 1.2 Configurar Variáveis de Ambiente

No Vercel Dashboard → Project Settings → Environment Variables:

```bash
# Copiar de .env.local e adicionar:

NEXT_PUBLIC_SUPABASE_URL = https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc...
DATABASE_URL_APP = postgresql://psico360_app:senha@db.supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL = https://radardevoz.com
NODE_ENV = production
```

⚠️ **IMPORTANTE**: Service Role Key é sensível! Use "Production" environment only.

## 2. Configurar Banco de Dados

### 2.1 Aplicar Migrations em Produção

```bash
# Via psql direto no Neon
psql postgresql://neon_superuser:senha@db.supabase.co:5432/postgres

# Carregar arquivo SQL:
\i db/001_initial_schema.sql
\i db/005_security_compliance.sql

# Verificar RLS está ativado:
SELECT relname, rowsecurity 
FROM pg_class 
WHERE rowsecurity = true;
```

### 2.2 Verificar Isolamento (CRÍTICO!)

```bash
-- Este teste DEVE passar:
-- tests/db/isolamento.test.ts
-- Verificar que psico360_app não tem BYPASSRLS

SELECT * FROM pg_roles 
WHERE rolname = 'psico360_app' 
AND bypassrls = true;
-- Resultado: 0 linhas (bypassrls = false)
```

## 3. Configurar Domínio

### 3.1 Apontar DNS para Vercel

No seu registrador de domínio (Namecheap, GoDaddy, etc):

```
Type: CNAME
Name: @  (ou radardevoz.com)
Value: cname.vercel-dns.com
```

Ou use nameservers do Vercel:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### 3.2 Adicionar Domínio no Vercel

```bash
# Via CLI
vercel domains add radardevoz.com

# Via Dashboard
# Settings → Domains → Add Domain
```

### 3.3 Habilitar SSL/HTTPS

Vercel gerencia SSL automaticamente ✅

```bash
# Verificar certificado
curl -I https://radardevoz.com
# HTTP/2 200 OK ✅
```

## 4. Variáveis de Ambiente Supabase

### 4.1 Conexão com psico360_app

```bash
# NO BANCO (como neon_superuser):
CREATE ROLE psico360_app WITH LOGIN PASSWORD 'senha_forte_aqui' NOINHERIT;

# Grants:
GRANT CONNECT ON DATABASE postgres TO psico360_app;
GRANT USAGE ON SCHEMA public TO psico360_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO psico360_app;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO psico360_app;

# RLS (CRÍTICO - sem BYPASSRLS)
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO psico360_app;
```

### 4.2 Connection String Produção

```bash
# .env.production (Vercel)
DATABASE_URL_APP=postgresql://psico360_app:senha@db.supabase.co:5432/postgres

# Supabase dashboard:
# Project Settings → API → Connection strings → URI
# Selecionar role: psico360_app
```

## 5. Deploy Inicial

### 5.1 Via Vercel CLI

```bash
# Deploy main branch
vercel deploy --prod

# Aguardar build... (~2 minutos)
# URL: https://radardevoz.com
```

### 5.2 Via Git Push (Recomendado)

```bash
# Conectar Vercel ao GitHub
# Projeto Vercel → Settings → Git

git push origin main
# Vercel detecta push automaticamente
# Inicia build e deploy
```

## 6. Pós-Deploy Verification

### 6.1 Health Check

```bash
curl -I https://radardevoz.com/api/health
# HTTP/2 200 OK
# Content-Type: application/json

curl https://radardevoz.com/api/health | jq .
# {
#   "status": "healthy",
#   "database": "connected",
#   "environment": "production"
# }
```

### 6.2 Testar Rotas

```bash
# Login
curl -X POST https://radardevoz.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'

# Protected route (deve redirecionar se sem token)
curl https://radardevoz.com/dashboard
# HTTP/2 307 (redirect to /auth/login)
```

### 6.3 Verificar SSL

```bash
curl -I https://radardevoz.com
# Verificar headers de segurança
# ✅ Strict-Transport-Security
# ✅ X-Content-Type-Options: nosniff
# ✅ X-Frame-Options: DENY
```

### 6.4 Testar RLS

```bash
# No banco, como psico360_app
psql postgresql://psico360_app:senha@db.supabase.co/postgres

-- Tentar ler dados de OUTRO usuário (deve falhar)
SELECT * FROM talents WHERE user_id != 'meu_user_id';
-- Resultado: 0 linhas (RLS bloqueou)
```

## 7. Monitoramento

### 7.1 Vercel Analytics

Vercel Dashboard → Analytics

```
✓ Pageviews
✓ Response time
✓ Error rate
✓ Deployment status
```

### 7.2 Supabase Monitoring

Supabase Dashboard → Monitoring

```
✓ Database connections
✓ Query performance
✓ Storage usage
✓ Auth events
```

### 7.3 Health Check Periódico

```bash
# Criar job no GitHub Actions ou cron
# Verificar /api/health a cada 5 minutos
# Alertar se status != "healthy"
```

## 8. CI/CD Pipeline

### 8.1 GitHub Actions (Automático com Vercel)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install --legacy-peer-deps
      - run: npm run build
      - name: Deploy to Vercel
        uses: vercel/action@v4
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 9. Escalabilidade

### 9.1 Vercel Limits

```
✅ Serverless Functions: Unlimited
✅ API Routes: Unlimited
✅ Concurrency: Auto-scaling
✅ Bandwidth: Pay per use
✅ Edge Network: Global CDN
```

### 9.2 Supabase Scaling

```
✅ Database: Auto-scaling
✅ Connections: Ajustar pool conforme uso
✅ Storage: Cloudinary (ilimitado)
✅ Auth: Unlimited users
```

## 10. Rollback (Se necessário)

### 10.1 Reverter Deploy

```bash
# Vercel CLI
vercel rollback

# Ou manualmente
git revert <commit>
git push origin main
# Vercel detecta e faz novo deploy
```

### 10.2 Backup de Banco

```bash
# Supabase: Backups automáticos diários
# Supabase Dashboard → Database → Backups

# Manual backup
pg_dump postgresql://user:pass@db.supabase.co/postgres > backup.sql
```

---

## ✅ Checklist Final

- [ ] Vercel projeto criado
- [ ] Variáveis de ambiente setadas
- [ ] Domínio apontando para Vercel
- [ ] SSL/HTTPS funcionando
- [ ] Bank migrations aplicadas
- [ ] RLS testado ✅
- [ ] Health check passando
- [ ] Primeiro deploy realizado
- [ ] Rotas testadas em produção
- [ ] Monitoramento ativado

**Status:** 🟢 PRONTO PARA PRODUÇÃO

---

**Deploy realizado em:** 2026-09-03  
**URL de Produção:** https://radardevoz.com  
**Health Check:** https://radardevoz.com/api/health
