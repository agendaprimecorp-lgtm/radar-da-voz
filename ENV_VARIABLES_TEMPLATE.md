# 🔐 TEMPLATE DE VARIÁVEIS - PREENCHA AQUI

**Use este arquivo para coletar as variáveis enquanto segue o SETUP_VERCEL_STRIPE.md**

---

## 📋 SUPABASE

Acesse: https://app.supabase.com → Project → Settings → API

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**Status:** ☐ Coletado

---

## 📷 CLOUDINARY

Acesse: https://cloudinary.com → Dashboard

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Status:** ☐ Coletado

---

## 💳 STRIPE (TEST MODE!)

Acesse: https://stripe.com → Dashboard → Developers → API Keys

**AVISO: Use TEST keys (pk_test_, sk_test_)**

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_
STRIPE_SECRET_KEY=sk_test_
STRIPE_WEBHOOK_SECRET=whsec_
```

**Status:** ☐ Coletado
**Status Pix:** ☐ Ativado (24h)
**Status Webhook:** ☐ Configurado

---

## 🎙️ DEEPGRAM

Acesse: https://console.deepgram.com → API Keys

```
DEEPGRAM_API_KEY=
```

**Status:** ☐ Coletado

---

## 📧 SENDGRID

Acesse: https://app.sendgrid.com → Settings → API Keys

```
SENDGRID_API_KEY=SG.
```

**Status:** ☐ Coletado

---

## 🌩️ GOOGLE CLOUD (OPCIONAL)

Acesse: https://console.cloud.google.com

```
GOOGLE_CLOUD_PROJECT_ID=
```

**Status:** ☐ Coletado (deixe vazio por enquanto)

---

## ⚙️ CONFIGURAÇÃO

```
NEXT_PUBLIC_APP_URL=https://radar-da-voz.vercel.app
NODE_ENV=production
```

---

## ✅ COMPLETO - PRONTO PARA VERCEL

Quando tudo acima estiver preenchido:

1. **Abra:** https://vercel.com/new
2. **Importe** seu repositório
3. **Cole todas as variáveis** na seção "Environment Variables"
4. **Clique:** Deploy

---

## 🎯 CHECKLIST DE PROGRESSO

### Coleta de Variáveis
- [ ] Supabase (3 variáveis)
- [ ] Cloudinary (3 variáveis)
- [ ] Stripe (3 variáveis)
- [ ] Deepgram (1 variável)
- [ ] SendGrid (1 variável)
- [ ] Google Cloud (1 variável - opcional)
- [ ] Config (2 variáveis)

### Deploy
- [ ] Vercel account criada
- [ ] GitHub conectado
- [ ] Repositório importado
- [ ] Variáveis adicionadas no Vercel
- [ ] Deploy iniciado
- [ ] Deploy bem-sucedido
- [ ] App testada em produção

### Stripe
- [ ] Conta criada (test mode)
- [ ] Banco conectado
- [ ] Pix ativado
- [ ] Webhook adicionado
- [ ] Webhook secret copido para Vercel
- [ ] Primeiro pagamento testado

### Pronto para Monetização
- [ ] Todas as variáveis no Vercel ✅
- [ ] App em produção ✅
- [ ] Pagamentos funcionando ✅
- [ ] Pronto para primeiro usuário! 🚀

---

## 📞 QUANDO TUDO ESTIVER PRONTO

Você terá:

✅ App pública: https://radar-da-voz.vercel.app
✅ Banco de dados em produção
✅ Pagamentos ativos (Stripe + Pix)
✅ Emails saindo (SendGrid)
✅ Análise de áudio (Deepgram)
✅ Uploads de mídia (Cloudinary)

**Pronto para ganhar dinheiro! 💰**

---

## 🚀 PRÓXIMO PASSO

Após completar este arquivo:
1. Vá para SETUP_VERCEL_STRIPE.md
2. Siga Parte 2: Deploy no Vercel
3. Siga Parte 3: Configurar Stripe
4. Sucesso! 🎉
