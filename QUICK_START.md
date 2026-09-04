# ⚡ QUICK START - DEPLOY E STRIPE

**Tempo total: 2 horas | Começar agora!**

---

## 🎯 3 PASSOS

### PASSO 1️⃣: COLETAR VARIÁVEIS (30 min)

**Abra em abas separadas:**

| Serviço | Link | Copiar |
|---------|------|--------|
| **Supabase** | https://app.supabase.com | 3 chaves (Settings → API) |
| **Cloudinary** | https://cloudinary.com | 3 chaves (Cloud Name + API) |
| **Stripe** | https://stripe.com | 3 chaves (Developers → API Keys) |
| **Deepgram** | https://console.deepgram.com | 1 chave (API Keys) |
| **SendGrid** | https://app.sendgrid.com | 1 chave (Settings → API Keys) |

**Arquivo:** `ENV_VARIABLES_TEMPLATE.md` (preencha enquanto coleta)

---

### PASSO 2️⃣: DEPLOY NO VERCEL (40 min)

```
1. https://vercel.com/signup → Sign up com GitHub
2. https://vercel.com/new → Import repositório "radar-da-voz"
3. Environment Variables → Cole as 12 variáveis coletadas
4. Clique: Deploy
5. Aguarde: ~3-5 min
6. Pronto! URL: https://radar-da-voz.vercel.app
```

**Arquivo:** `SETUP_VERCEL_STRIPE.md` (Parte 1-2)

---

### PASSO 3️⃣: CONFIGURAR STRIPE (30 min)

```
1. Stripe Dashboard → Settings → Payment Methods
2. Ative: Pix (24h para ativar)
3. Stripe Dashboard → Webhooks
4. Add endpoint: https://radar-da-voz.vercel.app/api/stripe/webhook
5. Copie webhook secret
6. Vercel → Environment Variables → Adicione STRIPE_WEBHOOK_SECRET
7. Teste pagamento com cartão 4242 4242 4242 4242
```

**Arquivo:** `SETUP_VERCEL_STRIPE.md` (Parte 3)

---

## ✅ CHECKLIST FINAL

**Antes de começar:**
- [ ] GitHub account e repositório
- [ ] Email do projeto
- [ ] CPF/CNPJ em mãos
- [ ] Dados bancários em mãos
- [ ] 2 horas de tempo

**Depois de Passo 1:**
- [ ] 12 variáveis coletadas
- [ ] Arquivo ENV_VARIABLES_TEMPLATE.md preenchido

**Depois de Passo 2:**
- [ ] App em produção
- [ ] URL funcionando
- [ ] Teste: http://seu-app/login

**Depois de Passo 3:**
- [ ] Stripe teste bem-sucedido
- [ ] Webhook configurado
- [ ] Pix ativado

---

## 💰 RESULTADO

```
✅ App pública em produção
✅ Pagamentos funcionando
✅ Pronto para primeira venda
✅ Primeira receita em 24-48h
```

---

## 📞 SE ERRO

| Erro | Solução |
|------|---------|
| "Cannot find module" | Variável faltando - Verifique ENV_VARIABLES_TEMPLATE.md |
| "Deploy failed" | Logs → Procure "error" → Fixe issue → Redeploy |
| "Pix não funciona" | Stripe → Settings → Payment Methods → Ative |
| "Pagamento falha" | Use teste: 4242 4242 4242 4242 |

---

## 🚀 PRÓXIMA FASE (Após tudo pronto)

```
1. Convidar 5 amigos para beta
2. Publicar primeira vaga (teste)
3. Receber primeira candidatura
4. Processar pagamento
5. Receber dinheiro em conta (1-2 dias)
```

---

## 📁 ARQUIVOS IMPORTANTES

```
✅ SETUP_VERCEL_STRIPE.md       ← Guia passo-a-passo completo
✅ ENV_VARIABLES_TEMPLATE.md     ← Preencha enquanto coleta
✅ MONETIZACAO_ROADMAP.md        ← Estratégia de receita
✅ ACAO_IMEDIATA.md              ← Plano 3 dias
✅ QUICK_START.md                ← Este arquivo
```

---

## 🎬 COMEÇAR AGORA

1. **Abra:** `SETUP_VERCEL_STRIPE.md`
2. **Siga:** Seção "PARTE 1: Obter Variáveis"
3. **Preencha:** `ENV_VARIABLES_TEMPLATE.md` conforme coleta
4. **Siga:** Seção "PARTE 2: Deploy Vercel"
5. **Siga:** Seção "PARTE 3: Stripe"
6. **Pronto:** Deploy + Stripe configurado! 🎉

---

**Boa sorte! Você consegue! 💪🚀**

```
2 horas agora = Infinito de receita depois
Vamos lá!
```
