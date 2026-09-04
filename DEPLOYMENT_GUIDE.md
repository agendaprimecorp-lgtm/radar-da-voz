# 🚀 GUIA DE DEPLOYMENT - RADAR DA VOZ

## Opção 1: Deploy via Dashboard Vercel (RECOMENDADO)

### Passo 1: Criar Conta Vercel
1. Acesse https://vercel.com/signup
2. Crie uma conta (pode usar GitHub)
3. Confirme email

### Passo 2: Conectar Repositório Git
1. Vá em https://vercel.com/new
2. Clique em "Import Git Repository"
3. Selecione seu repositório GitHub/GitLab
4. Clique em "Import"

### Passo 3: Configurar Variáveis de Ambiente
Na tela de deployment, adicione em "Environment Variables":

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

SENDGRID_API_KEY=SG.xxxxx
ONESIGNAL_APP_ID=xxxxx
ONESIGNAL_AUTH_KEY=xxxxx

GOOGLE_CLOUD_PROJECT_ID=seu-projeto
DEEPGRAM_API_KEY=xxxxx

NODE_ENV=production
```

### Passo 4: Deploy!
1. Clique em "Deploy"
2. Aguarde ~5 minutos
3. Pronto! Seu app está online 🎉

---

## Opção 2: Deploy via CLI (Avançado)

### Se você quiser usar CLI:

```bash
# 1. Login interativo (vai abrir browser)
vercel login

# 2. Deploy para staging
vercel deploy

# 3. Deploy para produção
vercel --prod

# 4. Ver logs
vercel logs
```

---

## 📋 Checklist Pós-Deploy

- [ ] Acessar URL do deploy
- [ ] Testar landing page
- [ ] Testar login
- [ ] Configurar domínio customizado (radardevoz.com)
- [ ] Configurar HTTPS
- [ ] Setup de analytics (Google Analytics 4)
- [ ] Configurar webhooks (Stripe, OneSignal)
- [ ] Teste de performance (Lighthouse)

---

## 🔧 Configurar Domínio Customizado

1. No Vercel Dashboard
2. Vá em "Settings" → "Domains"
3. Adicione seu domínio
4. Atualize DNS no seu registrador

```dns
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.165
```

---

## 🎯 URLs Importantes

- **Vercel Console**: https://vercel.com/dashboard
- **GitHub Actions**: https://github.com/seu-usuario/radar-da-voz/actions
- **Supabase Console**: https://app.supabase.com
- **Stripe Dashboard**: https://dashboard.stripe.com

---

## 📞 Troubleshooting

### Build falha
- Verificar: npm install funcionou?
- Verificar: Todas as variáveis de ambiente definidas?
- Logs: `vercel logs --tail`

### App não carrega
- Verificar: Network tab no browser
- Verificar: Console do browser para erros
- Verificar: Variáveis de ambiente corretas?

### Lentidão
- Verificar: Lighthouse performance
- Verificar: Database queries (Supabase)
- Considerar: Cache estratégico

---

## 🎊 Parabéns!

Você deployou o Radar da Voz em produção! 🚀

Próximas ações:
1. Beta program com 50 usuários
2. Coletar feedback
3. Iterar baseado em dados
4. Crescer! 📈

