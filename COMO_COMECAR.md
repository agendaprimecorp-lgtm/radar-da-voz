# 🚀 COMO COMEÇAR - RADAR DA VOZ

## 5 Passos para Rodar Localmente (15 minutos)

### **Passo 1: Clone e Instale** (2 min)
```bash
cd C:\Users\Rodrigo\Documents\radar\ da voz
npm install
```

### **Passo 2: Crie Conta Supabase** (3 min)
1. Vá para https://supabase.com
2. Clique "Start Your Project"
3. Crie projeto novo (escolha Brasil, região São Paulo)
4. Espere projeto ficar pronto (~2 min)
5. Copie URL e anon key

### **Passo 3: Crie Contas Externas** (5 min)

**Cloudinary**: https://cloudinary.com
- Sign up
- Vá para "Settings" → "API Keys"
- Copie: Cloud Name, API Key, API Secret

**Stripe**: https://stripe.com
- Sign up
- Vá para "API Keys"
- Copie: Publishable Key (pk_test_), Secret Key (sk_test_)

### **Passo 4: Preencha .env.local** (2 min)
```bash
# Abra C:\Users\Rodrigo\Documents\radar da voz\.env.local
# Preencha com seus valores:

# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# CLOUDINARY  
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdef123

# STRIPE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_123456
STRIPE_SECRET_KEY=sk_test_123456

# APP
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### **Passo 5: Execute Schema SQL** (2 min)
1. Abra painel Supabase
2. Vá para "SQL Editor"
3. Clique "+ New Query"
4. Copie conteúdo de `db/001_initial_schema.sql`
5. Cole no editor
6. Clique "Run"
7. Espere completar (deve ter ~15 queries)

---

## ✅ Pronto! Agora teste:

```bash
npm run dev
```

Abra: http://localhost:3000

---

## 🧪 Teste Rápido

1. **Home Page**: http://localhost:3000
   - Vê a landing page

2. **Signup**: http://localhost:3000/auth/signup
   - Crie conta (ex: artista)
   - Email: `test@example.com`
   - Senha: `123456`

3. **Login**: http://localhost:3000/auth/login
   - Use email/senha que criou

4. **Dashboard**: http://localhost:3000/dashboard
   - Vê seu dashboard (vazio, esperado)

5. **Talentos**: http://localhost:3000/talents
   - Lista vazia (sem talentos ainda)

6. **Vagas**: http://localhost:3000/jobs
   - Lista vazia (sem vagas ainda)

7. **Recorder**: http://localhost:3000/recorder
   - Teste gravar áudio
   - Clique "Gravar"
   - Fale algo
   - Clique "Parar"
   - Escuta playback

---

## ⚠️ Problemas Comuns

### ❌ "Cannot find module 'supabase'"
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

### ❌ ".env.local not found"
```bash
cp .env.example .env.local
# Preencha .env.local com valores reais
```

### ❌ "SUPABASE_URL is undefined"
- Verifique se preencheu `.env.local` corretamente
- Reinicie o servidor: `npm run dev`

### ❌ "Cannot record audio"
- Permita microfone no navegador
- Teste em http://localhost:3000 (não https)

### ❌ "Upload falha"
- Verifique credenciais Cloudinary
- Cloudinary precisa ter folder "radar_da_voz"

---

## 📚 Próximas Leituras

1. **Estrutura do Projeto**: [README.md](./README.md)
2. **Progresso de Desenvolvimento**: [PROGRESSO.md](./PROGRESSO.md)
3. **Desenvolvimento Completo**: [DESENVOLVIMENTO_COMPLETO.md](./DESENVOLVIMENTO_COMPLETO.md)
4. **Documentação Startup**: [02-STARTUP-ECONOMIA-DE-TALENTOS.md](./02-STARTUP-ECONOMIA-DE-TALENTOS.md)

---

## 🎯 Checklist de Setup

- [ ] `npm install` funcionou
- [ ] Supabase project criado
- [ ] `.env.local` preenchido com 3+ variáveis
- [ ] SQL schema executado
- [ ] `npm run dev` rodando
- [ ] http://localhost:3000 abrindo
- [ ] Signup funcionando
- [ ] Login funcionando
- [ ] Dashboard carregando
- [ ] Recorder gravando áudio

---

**Quando tudo estiver verde ✅, você tem um MVP funcional!**

---

## 📞 Precisa de Ajuda?

1. Verifique [PROGRESSO.md](./PROGRESSO.md) para debug
2. Verifique erros em `npm run dev` (vê no terminal)
3. Verifique console do navegador (F12 → Console)

---

**TEMPO TOTAL**: ~15-20 minutos  
**RESULTADO**: App rodando localmente ✅  
**PRÓXIMO PASSO**: Testar as features e começar a customizar!

🚀 Boa sorte!
