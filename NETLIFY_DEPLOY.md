# 🚀 DEPLOY NO NETLIFY - GUIA COMPLETO

**Tempo total: ~30 minutos**

---

## ✅ PRÉ-REQUISITOS

- [ ] Conta GitHub com repositório "radar-da-voz"
- [ ] Todas as variáveis de ambiente (use ENV_VARIABLES_TEMPLATE.md)
- [ ] Email: contato@primecorpconsultoria.com.br
- [ ] 5 minutos livres

---

## 🎯 PASSO 1: CRIAR CONTA NETLIFY (5 min)

### Acesse:
```
https://app.netlify.com/signup
```

### Opções:
1. **Com GitHub** (RECOMENDADO)
   - Clique: "Sign up with GitHub"
   - Autorize Netlify
   - Confirme email
   - Pronto!

2. **Com Email**
   - Email: contato@primecorpconsultoria.com.br
   - Crie senha
   - Confirme email
   - Pronto!

---

## 🎯 PASSO 2: CONECTAR REPOSITÓRIO (5 min)

### Na dashboard do Netlify:

```
1. Clique: "Add new site"
2. Selecione: "Import an existing project"
3. Escolha: "GitHub"
4. Busque: "radar-da-voz"
5. Clique: "Install and authorize"
6. Selecione seu repositório
7. Clique: "Deploy site"
```

---

## 🎯 PASSO 3: CONFIGURAR VARIÁVEIS (10 min)

### Na dashboard do Netlify, acesse seu site:

```
Settings → Build & deploy → Environment
```

### Adicione as 15 variáveis:

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

GOOGLE_CLOUD_PROJECT_ID=seu-projeto
NEXT_PUBLIC_APP_URL=https://seu-site.netlify.app
NODE_ENV=production
```

### Como adicionar:
```
1. Clique: "Edit variables"
2. Cada variável:
   - Key: [nome]
   - Value: [valor]
   - Clique: "Save"
3. Salve as mudanças
```

---

## 🎯 PASSO 4: TRIGGER DEPLOY (5 min)

### Após adicionar variáveis:

```
1. Vá em: "Deploys"
2. Clique: "Trigger deploy"
3. Selecione: "Deploy site"
4. Aguarde: 3-5 minutos
5. Pronto! Seu site está pronto! 🎉
```

### Você receberá:
```
✅ URL como: https://seu-site.netlify.app
✅ Status: Published
✅ Build log: Sucesso
```

---

## 📊 RESULTADO

### Seu app agora está:
```
✅ Em produção
✅ Com domínio próprio (netlify.app)
✅ Auto-deploy a cada push no GitHub
✅ SSL/HTTPS automático
✅ CDN global
✅ Analytics integrado
```

---

## 🔗 DOMÍNIO CUSTOMIZADO (Opcional)

### Se quiser usar seu próprio domínio:

```
1. Netlify → Settings → Domain management
2. Clique: "Add custom domain"
3. Digite: radardevoz.com (seu domínio)
4. Siga instruções de DNS
5. Aguarde: 24-48h para ativar
```

---

## 📱 VERSÃO MOBILE

### Seu app já tem:
```
✅ mobile.html - Versão otimizada para celular
✅ Responsive design automático
✅ Touch-friendly buttons
✅ Safe area support (notch)
✅ Scroll otimizado
```

### Para acessar no mobile:
```
1. Abra: https://seu-site.netlify.app no celular
2. Tudo é automático - layout se adapta
3. Adicione à home screen (opcional)
```

---

## 🔄 AUTO-DEPLOY

### Netlify faz deploy automaticamente:

```
Você faz um push no GitHub
    ↓
GitHub notifica Netlify
    ↓
Netlify compila seu código
    ↓
App é publicada automaticamente
    ↓
Novo site ao vivo em 3-5 min
```

### Para testar:
```
1. Edite um arquivo no VS Code
2. Faça git push
3. Veja em: Netlify → Deploys
4. Site atualizada automaticamente
```

---

## 🚨 SE DER ERRO

### Build failed?
```
1. Netlify → Deploys → Deploy anterior
2. Veja logs (clique no deploy)
3. Procure por "error"
4. Fixe o erro localmente
5. Faça git push novamente
6. Redeploy automático
```

### Variável não reconhecida?
```
1. Settings → Build & deploy → Environment
2. Verifique se variável está lá
3. Trigger deploy novamente
4. Aguarde nova build
```

### Site branco/erro?
```
1. Abra console (F12)
2. Procure por erros
3. Verifique variáveis de ambiente
4. Verifique logs do Netlify
5. Redeploye se necessário
```

---

## 📊 MONITORAMENTO

### Netlify oferece grátis:
```
✅ Analytics de visitas
✅ Build logs
✅ Deploy history
✅ Performance metrics
✅ Security headers
```

### Para acessar:
```
Dashboard → Site overview → Analytics
```

---

## 💾 DIFERENÇAS: VERCEL vs NETLIFY

| Recurso | Vercel | Netlify |
|---------|--------|---------|
| **Deploy** | Push automático | Push automático |
| **Funções** | Severless Functions | Netlify Functions |
| **Banco de dados** | ❌ | ❌ (use Supabase) |
| **Domínio grátis** | Sim | Sim |
| **SSL** | Sim | Sim |
| **CDN** | Global | Global |
| **Preço** | Freemium | Freemium |
| **Performance** | Excelente | Excelente |

**Ambos funcionam! Netlify é mais fácil para começar.**

---

## 🎯 PRÓXIMOS PASSOS

Após deploy no Netlify:

### 1. Testar app completa
```
[ ] Abra em desktop
[ ] Abra no celular
[ ] Teste login
[ ] Teste publicar vaga
[ ] Teste candidatura
```

### 2. Configurar domínio (opcional)
```
[ ] Compre domínio (Godaddy, Namecheap)
[ ] Adicione em Netlify
[ ] Configure DNS
[ ] Aguarde propagação
```

### 3. Habilitar Stripe webhook
```
[ ] Stripe Dashboard → Webhooks
[ ] URL: https://seu-site.netlify.app/api/stripe/webhook
[ ] Selecione eventos
[ ] Copie signing secret
[ ] Adicione em Netlify Environment
```

### 4. Analytics Google (opcional)
```
[ ] Google Analytics 4
[ ] Crie property
[ ] Copie ID
[ ] Adicione em Next.js
```

---

## ✅ CHECKLIST FINAL

Quando tudo estiver pronto:

- [ ] Conta Netlify criada
- [ ] Repositório conectado
- [ ] Variáveis adicionadas
- [ ] Deploy bem-sucedido
- [ ] App testada no navegador
- [ ] App testada no celular
- [ ] Stripe webhook configurado
- [ ] Domínio customizado (opcional)
- [ ] Primeira transação testada
- [ ] Pronto para usuários reais!

---

## 🎊 PARABÉNS!

Você está PRONTO para:
```
✅ Receber usuários reais
✅ Processar pagamentos
✅ Ganhar sua primeira receita
✅ Escalar a plataforma
```

---

## 📞 RECURSOS

- **Netlify Docs:** https://docs.netlify.com
- **Next.js + Netlify:** https://nextjs.org/docs/deployment/netlify
- **Supabase Guide:** https://supabase.com
- **Stripe Webhook:** https://stripe.com/docs/webhooks

---

## 🚀 COMEÇAR AGORA

```bash
# Seu repositório já está pronto!
# Basta seguir este guia e Netlify faz o resto.

# 30 minutos e sua app está em produção! 🎉
```

**Boa sorte! Seu Radar da Voz vai decolar! 🎤🚀**

---

*Última atualização: 2026-09-04*
*Status: Pronto para deploy*
