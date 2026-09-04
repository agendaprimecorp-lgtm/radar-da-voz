# 🚀 GUIA COMPLETO: VERCEL + STRIPE SETUP

**Tempo total: ~2 horas**

---

## 📋 PRÉ-REQUISITOS

- [ ] Email: `contato@primecorpconsultoria.com.br`
- [ ] Acesso ao GitHub (repositório radar-da-voz)
- [ ] Dados bancários em mãos
- [ ] CPF/CNPJ
- [ ] Telefone para verificação (Stripe)

---

## PARTE 1: OBTER VARIÁVEIS DE AMBIENTE (30 min)

### 🔹 1.1 SUPABASE (Base de Dados)

**Onde:** https://app.supabase.com

```
1. Login com email
2. Clique em seu projeto "radar-da-voz" (ou crie um)
3. Vá em: Settings → API
4. Copie:
   - Project URL         → NEXT_PUBLIC_SUPABASE_URL
   - Anon public key     → NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Service role key    → SUPABASE_SERVICE_ROLE_KEY
```

**Resultado esperado:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **Tempo: 5 min**

---

### 🔹 1.2 CLOUDINARY (Upload de Mídia)

**Onde:** https://cloudinary.com

```
1. Crie conta GRATUITA
   - Email: contato@primecorpconsultoria.com.br
2. Dashboard → Settings → Account
3. Copie:
   - Cloud Name           → NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
4. Vá em: Settings → API Keys
5. Copie:
   - API Key              → CLOUDINARY_API_KEY
   - API Secret           → CLOUDINARY_API_SECRET
```

**Resultado esperado:**
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxxx
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdefghijk
```

✅ **Tempo: 10 min**

---

### 🔹 1.3 STRIPE (Pagamentos) ⭐ CRÍTICO

**Onde:** https://stripe.com

```
1. Sign up (novo account)
   - Email: contato@primecorpconsultoria.com.br
   - País: Brazil
   - Selecione: Freelancer/Solo
   
2. Verifique email (confirme)

3. Preencha documentação:
   - Nome
   - CPF/CNPJ
   - Data de nascimento
   - Telefone
   - Endereço
   
4. Conecte conta bancária:
   - Banco: Seu banco
   - Tipo: Conta corrente
   - Agência + Número
   
5. Dashboard → Developers → API Keys
   Copie (atenção: use TEST keys primeiro!):
   - Secret Key (pk_test_...)       → STRIPE_SECRET_KEY
   - Publishable Key (sk_test_...) → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

**⚠️ IMPORTANTE: Use TEST keys (pk_test_, sk_test_) no beta!**

**Resultado esperado:**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Webhook (configurar depois):**
- Acesse: https://dashboard.stripe.com/webhooks
- Adicione endpoint: `https://seu-app.vercel.app/api/stripe/webhook`
- Selecione eventos: `payment_intent.succeeded`, `payment_intent.failed`

✅ **Tempo: 15 min**

---

### 🔹 1.4 DEEPGRAM (Análise de Áudio)

**Onde:** https://console.deepgram.com

```
1. Sign up gratuito
   - Email: contato@primecorpconsultoria.com.br
2. Vá em: API Keys
3. Copie a key principal
   → DEEPGRAM_API_KEY
```

**Resultado esperado:**
```
DEEPGRAM_API_KEY=xxxxx-xxxxx-xxxxx-xxxxx
```

✅ **Tempo: 5 min**

---

### 🔹 1.5 GOOGLE CLOUD (Análise de Vídeo) - OPCIONAL

**Onde:** https://console.cloud.google.com

```
1. Crie projeto novo: "radar-da-voz"
2. Ative APIs:
   - Video Intelligence API
   - Cloud Vision API
3. Crie chave de serviço (Service Account)
4. Copie Project ID
   → GOOGLE_CLOUD_PROJECT_ID
```

**Para produção**, deixe em branco ou configure depois.

✅ **Tempo: 10 min (opcional agora)**

---

### 🔹 1.6 SENDGRID (Email)

**Onde:** https://app.sendgrid.com

```
1. Sign up gratuito (300 emails/dia)
2. Settings → API Keys
3. Copie API key
   → SENDGRID_API_KEY
```

**Resultado esperado:**
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
```

✅ **Tempo: 5 min**

---

### 🔹 1.7 OUTRAS VARIÁVEIS

```
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
NODE_ENV=production

# Deixe em branco por enquanto:
SENTRY_DSN=
POSTHOG_KEY=
GOOGLE_APPLICATION_CREDENTIALS=
STRIPE_WEBHOOK_SECRET= (Será preenchido depois)
```

---

## PARTE 2: DEPLOY NO VERCEL (40 min)

### ✅ Passo 1: Criar Conta Vercel

```
1. Acesse: https://vercel.com/signup
2. Clique: "Continue with GitHub"
3. Autorize Vercel a acessar seu GitHub
4. Confirme email
```

**✓ Pronto! Conta Vercel criada**

---

### ✅ Passo 2: Importar Repositório

```
1. Acesse: https://vercel.com/new
2. Procure seu repositório: "radar-da-voz"
3. Clique: "Import"
4. Tela de Project Settings aparece
```

**✓ Vercel conectado ao repositório**

---

### ✅ Passo 3: Adicionar Variáveis de Ambiente

**Na tela que abriu (Project Settings → Environment Variables):**

**Cole exatamente o seguinte (substitua XXX pelos valores que copiou):**

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxxx
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdefghijk

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx

DEEPGRAM_API_KEY=xxxxx-xxxxx-xxxxx-xxxxx
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx

NEXT_PUBLIC_APP_URL=https://radar-da-voz.vercel.app
NODE_ENV=production

GOOGLE_CLOUD_PROJECT_ID=seu-projeto
```

**Como adicionar:**
1. Campo "Key": `NEXT_PUBLIC_SUPABASE_URL`
2. Campo "Value": `https://xxxxxxxxxxxx.supabase.co`
3. Clique: "Add"
4. Repita para cada variável

**✓ Todas as variáveis adicionadas**

---

### ✅ Passo 4: Deploy!

```
1. Clique em: "Deploy"
2. Vercel vai compilar o código (~3-5 min)
3. Aguarde mensagem: "Successfully deployed!"
4. Você verá uma URL como:
   https://radar-da-voz.vercel.app
```

**✓ App deployada em produção!**

---

### ✅ Passo 5: Testar Deploy

```
1. Abra sua URL: https://radar-da-voz.vercel.app
2. Teste:
   ✅ Página carrega?
   ✅ Consegue fazer login?
   ✅ Consegue navegar?
   ✅ Consegue clicar em "Publicar vaga"?
   
3. Se tudo OK → Deploy bem-sucedido! 🎉
```

**✓ Deploy testado e funcionando**

---

## PARTE 3: CONFIGURAR STRIPE (30 min)

### ✅ Passo 1: Ativar Pix

**Acesso:** https://dashboard.stripe.com → Settings → Payment methods

```
1. Procure por "Pix"
2. Clique em "Activate"
3. Aguarde 24h para ativar
4. Mensagem: "Active" em verde = pronto
```

**✓ Pix ativado para receber dinheiro**

---

### ✅ Passo 2: Configurar Webhook

**Acesso:** https://dashboard.stripe.com → Webhooks

```
1. Clique em "Add endpoint"
2. URL do endpoint: 
   https://radar-da-voz.vercel.app/api/stripe/webhook
3. Selecione eventos:
   ✅ payment_intent.succeeded
   ✅ payment_intent.failed
   ✅ charge.refunded
4. Clique: "Add endpoint"
5. Copie o "Signing secret" (whsec_...)
6. Volte ao Vercel → Environment Variables
7. Adicione:
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
8. Redeploy (automático no Vercel)
```

**✓ Webhook configurado para receber eventos**

---

### ✅ Passo 3: Testar Pagamento

**Teste no app:**

```
1. Abra seu app: https://radar-da-voz.vercel.app
2. Faça login como empresa
3. Publique uma vaga (teste)
4. Vá em: Dashboard → Vagas
5. Clique: "Processar Pagamento"
6. Use cartão de teste Stripe:
   
   Número: 4242 4242 4242 4242
   Mês/Ano: 12/25 (qualquer data futura)
   CVC: 123 (qualquer código)

7. Complete o pagamento
8. Confira: Stripe Dashboard → Payments
   Deve aparecer transaction nova (test)
```

**✓ Pagamento testado com sucesso**

---

## PARTE 4: CHECKLIST FINAL ✅

### Deploy
- [ ] Conta Vercel criada
- [ ] Repositório importado
- [ ] Todas variáveis adicionadas
- [ ] Deploy bem-sucedido
- [ ] App funcionando em produção

### Stripe
- [ ] Conta Stripe criada (test mode)
- [ ] Banco conectado
- [ ] Pix ativado
- [ ] Webhook configurado
- [ ] Pagamento testado

### Prontos para monetização
- [ ] Primeira transação processada
- [ ] Dinheiro recebido (1-2 dias úteis)
- [ ] Dashboard Stripe mostrando receita

---

## 📊 RESUMO DE VARIÁVEIS

```
Supabase (3):
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY

Cloudinary (3):
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  CLOUDINARY_API_KEY
  CLOUDINARY_API_SECRET

Stripe (3):
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  STRIPE_SECRET_KEY
  STRIPE_WEBHOOK_SECRET

APIs (4):
  DEEPGRAM_API_KEY
  SENDGRID_API_KEY
  GOOGLE_CLOUD_PROJECT_ID
  NEXT_PUBLIC_APP_URL

Config (1):
  NODE_ENV=production

TOTAL: 15 variáveis principais
```

---

## 🚨 ERROS COMUNS

| Erro | Causa | Solução |
|------|-------|--------|
| "Cannot find module" | Variável faltando | Verifique .env.example |
| "Payment failed" | Chave Stripe errada | Use pk_test_, sk_test_ |
| "App loads but branco" | JavaScript error | Vercel → Logs → Procure erro |
| "Supabase connection error" | URL ou chave errada | Copie novamente de Supabase |
| "Pix não aparece" | Não foi ativado | Settings → Payment methods → Activate |

---

## 📞 PRÓXIMAS AÇÕES

1. **Hoje:** Seguir este guia até seção 2 (Deploy)
2. **Amanhã:** Configurar Stripe completamente
3. **Domingo:** Primeira transação de teste

---

## ✨ ESTÁ PRONTO!

Quando completar este guia, você terá:
- ✅ App em produção (URL pública)
- ✅ Banco de dados conectado
- ✅ Pagamentos funcionando
- ✅ Pronto para primeira venda!

**Boa sorte! Agora é só executar! 🚀**

```
Radar da Voz está pronto para ganhar dinheiro!
```
