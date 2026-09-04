# 💰 PLANO DE MONETIZAÇÃO - RADAR DA VOZ

## 🎯 ESTRATÉGIA: 4 FLUXOS DE RECEITA

```
┌──────────────────────────────────────────────────┐
│  MODELO DE RECEITA MULTI-CAMADAS                │
├──────────────────────────────────────────────────┤
│                                                  │
│  1️⃣ SUBSCRIPTIONS (Planejado - 60%)            │
│     Talentos: Free/Pro/Enterprise               │
│     Empresas: Starter/Pro/Enterprise            │
│                                                  │
│  2️⃣ COMISSÕES (Immediate - 20%)                │
│     20% em cada vaga contratada                 │
│     15% em campanhas comerciais                 │
│                                                  │
│  3️⃣ FEATURED LISTINGS (Quick - 10%)            │
│     Destaque de vagas (R$ 99/mês)              │
│     Destaque de talentos (R$ 49/mês)           │
│                                                  │
│  4️⃣ ANÁLISE E SERVIÇOS (Future - 10%)         │
│     Relatórios de análise (R$ 199)             │
│     Coaching/mentoria (R$ 99-199/mês)          │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 🚀 FASE 1: HOJE (Semana 0-1)

### ✅ Ativar Comissões em Transações

**O que fazer:**
1. Garantir que Stripe está funcionando
2. Testar primeira transação
3. Comissão automaticamente deduzida

**Código já pronto em:**
- `lib/subscriptions.ts` (linha 45+)
- `app/api/jobs/apply/route.ts` (comissão por vaga)
- `app/api/campaigns/apply/route.ts` (comissão por campanha)

**Ganho esperado:**
- Primeira vaga: R$ 500 → Você ganha R$ 100 (20%)
- Primeira campanha: R$ 2.000 → Você ganha R$ 300 (15%)

---

## 📈 FASE 2: SEMANA 1-2

### ✅ Ativar Planos de Subscription

**O que fazer:**
1. Criar 3 planos (Free/Pro/Enterprise)
2. Mostrar pricing page em `/pricing`
3. Integrar com Stripe billing

**Preços Sugeridos:**

**PARA TALENTOS:**
```
Free:       R$ 0/mês    - 3 vagas, sem análise
Pro:        R$ 29,90    - Vagas ilimitadas + análise
Enterprise: Custom      - API access + suporte
```

**PARA EMPRESAS:**
```
Free:       R$ 0/mês    - 1 vaga/mês
Pro:        R$ 99,90    - 10 vagas/mês + analytics
Enterprise: Custom      - Ilimitado + API
```

**Código já está em:**
- `app/pricing/page.tsx` (pronto!)
- `lib/subscriptions.ts` (funções prontas)
- `db/010_subscriptions.sql` (schema)

**Ganho esperado:**
- 50 talentos Pro: 50 × R$ 29,90 = R$ 1.495/mês
- 10 empresas Pro: 10 × R$ 99,90 = R$ 999/mês
- **Total: R$ 2.494/mês só em subscriptions**

---

## ⭐ FASE 3: SEMANA 2-3

### ✅ Featured Listings

**O que fazer:**
1. Criar botão "Destacar" em cada vaga/talento
2. Cobrar R$ 99 por 30 dias de destaque
3. Mostrar no topo da listagem

**Implementação rápida:**
```
Criar tabela: featured_listings
  - listing_id
  - listing_type (job/talent)
  - expires_at
  - paid (boolean)
  
Modificar:
- /api/talents/search → ordenar featured first
- /api/jobs/search → ordenar featured first
```

**Ganho esperado:**
- 30 vagas destacadas × R$ 99 = R$ 2.970/mês
- 20 talentos destacados × R$ 49 = R$ 980/mês
- **Total: R$ 3.950/mês**

---

## 💎 FASE 4: SEMANA 3-4

### ✅ Premium Services

**Serviços a oferecer:**

#### 1. **Relatórios de Análise** (R$ 199/cada)
```
- Análise de performance de talento
- Benchmark com mercado
- Recomendações de melhoria
```

#### 2. **Mentoria/Coaching** (R$ 99-199/mês)
```
- Video call com especialista
- Revisão de portfolio
- Dicas de mercado
```

#### 3. **Verificação Avançada** (R$ 49)
```
- Background check
- Verificação de credenciais
- Portfólio autenticado
```

**Ganho esperado:**
- 20 relatórios/mês × R$ 199 = R$ 3.980
- 30 mentoria/mês × R$ 99 = R$ 2.970
- 100 verificações/mês × R$ 49 = R$ 4.900
- **Total: R$ 11.850/mês**

---

## 📊 PROJEÇÃO DE RECEITA

### Timeline:

```
MÊS 1 (Beta):
├─ Comissões em transações:        R$ 500
├─ Assinantes Pro (10):            R$ 299
└─ Total:                          R$ 799

MÊS 2 (Early Growth):
├─ Comissões:                      R$ 2.000
├─ Assinantes Pro (50):            R$ 1.495
├─ Featured listings (20):         R$ 2.000
└─ Total:                          R$ 5.495

MÊS 3 (Growth):
├─ Comissões:                      R$ 5.000
├─ Assinantes Pro (150):           R$ 4.485
├─ Featured listings (50):         R$ 5.000
├─ Premium services:               R$ 5.000
└─ Total:                          R$ 19.485

MÊS 6 (Scale):
├─ Comissões:                      R$ 20.000
├─ Assinantes:                     R$ 25.000
├─ Featured listings:              R$ 15.000
├─ Premium services:               R$ 15.000
└─ Total:                          R$ 75.000/mês

MÊS 12 (Profitable):
├─ Comissões:                      R$ 100.000
├─ Assinantes:                     R$ 80.000
├─ Featured listings:              R$ 50.000
├─ Premium services:               R$ 100.000
└─ Total:                          R$ 330.000/mês
```

---

## 💳 COMO PROCESSAR PAGAMENTOS

### Já está configurado:
```
✅ Stripe integration (completo)
✅ Comissões automáticas
✅ Pix via Stripe (Brasil)
✅ Cartão de crédito
✅ Recebimento na sua conta
```

### Próximo passo:
```bash
1. Criar conta Stripe em https://stripe.com
2. Conectar conta bancária brasileira
3. Ativar Pix (demora 24h)
4. Pronto! Dinheiro chega em 1-2 dias úteis
```

---

## 🎯 CHECKLIST DE ATIVAÇÃO

### Imediato (Esta semana):
- [ ] Deploy em produção
- [ ] Testar primeira transação Stripe
- [ ] Confirmar comissão sendo deduzida
- [ ] Stripe conectado à sua conta

### Curto prazo (Próximas 2 semanas):
- [ ] Ativar pricing page
- [ ] Primeiro pagamento de assinatura
- [ ] Featured listings funcionando
- [ ] Análise de receita inicial

### Médio prazo (Mês 1):
- [ ] Premium services disponível
- [ ] Beta program gerando receita
- [ ] Primeiros R$ 5.000 de receita
- [ ] Analytics mostrando LTV

---

## 💰 COMO RECEBER O DINHEIRO

### Opção 1: Stripe (RECOMENDADO)
```
Stripe → Sua conta bancária brasileira
- Recebe em 1-2 dias úteis
- Taxa: 2.9% + R$ 0,30 por transação
- Melhor taxa do Brasil
- Suporta Pix
```

### Opção 2: PayPal
```
PayPal → Sua conta
- Recebe em 1-3 dias
- Taxa: 3.5%
- Menos comum no Brasil
```

### Opção 3: Saldo na Plataforma
```
Usuários enviam dinheiro → Seu saldo
- Sem taxa
- Você saca quando quiser
- Mais trabalho operacional
```

---

## 📱 PLANO DE CRESCIMENTO DE USUÁRIOS

### Para gerar receita, precisa de usuários:

```
MÊS 1:
- 100 talentos
- 20 empresas
- 2-3 vagas/mês
- R$ 799 de receita

MÊS 3:
- 1.000 talentos
- 100 empresas
- 50+ vagas/mês
- R$ 19.485 de receita

MÊS 6:
- 5.000 talentos
- 500 empresas
- 500+ vagas/mês
- R$ 75.000 de receita
```

### Como crescer (Marketing):
```
✅ Product Hunt launch
✅ LinkedIn outreach
✅ Influencer partnerships
✅ Content marketing
✅ Referral program
✅ Paid ads (Google/Meta)
✅ Community building (Discord)
```

---

## 🚀 COMEÇAR HOJE

### Passo 1: Deploy
```bash
1. Acesse https://vercel.com/new
2. Conecte repositório
3. Deploy em 5 minutos
```

### Passo 2: Ativar Stripe
```bash
1. Crie conta em https://stripe.com
2. Conecte conta bancária
3. Configure webhook
4. Pronto!
```

### Passo 3: Primeira Transação
```bash
1. Convide 10 amigos para beta
2. Peça que publiquem vaga
3. Peça que talentos se candidatem
4. Primeira vaga contratada = Primeira receita
```

### Passo 4: Escalar
```bash
1. Analise dados (quem paga, quanto)
2. Otimize preços baseado em uso
3. Adicione features premium
4. Cresça organicamente
```

---

## 📊 MÉTRICAS A MONITORAR

```
Diariamente:
- Usuários novos
- Vagas publicadas
- Candidaturas
- Receita do dia

Semanalmente:
- MRR (Monthly Recurring Revenue)
- LTV (Lifetime Value)
- CAC (Customer Acquisition Cost)
- Churn rate

Mensalmente:
- Crescimento %
- Receita total
- Pagar conta do servidor
- Pagar suas despesas
- Lucro restante
```

---

## 🎁 BÔNUS: IDEIA DE CRESCIMENTO RÁPIDO

### Criar Programa de Afiliados:
```
"Convide uma empresa/talento e ganhe 20% comissão permanente"

Exemplo:
- Você paga R$ 20 para gerar uma assinatura de R$ 99
- Você ganha R$ 20 × 12 meses = R$ 240/ano por afiliado
- Se 100 pessoas viram afiliados = R$ 24.000/ano
```

### Parcerias Estratégicas:
```
- Escolas de artes (indica seus alunos)
- Agências de casting (indica seus clientes)
- Produtoras (indica oportunidades)
- Influenciadores (faz reviews)
```

---

## 💡 MINDSET DE MONETIZAÇÃO

```
❌ Não faça:
- Cobrar demais (assusta usuários)
- Cobrar de graça (não gera receita)
- Esperar user base gigante
- Ignorar métricas

✅ Faça:
- Comece com comissões (natural)
- Teste diferentes preços
- Monetize desde o começo
- Acompanhe cada Real
- Itere baseado em dados
```

---

## 🎯 PRIMEIRA META

```
🚀 MÊS 1: Gerar R$ 1.000 de receita
📈 MÊS 3: Gerar R$ 10.000/mês
💰 MÊS 6: Gerar R$ 50.000/mês
🏆 MÊS 12: Gerar R$ 300.000/mês
```

**Você tem tudo pronto. Agora é só começar!** 💪

---

## 📞 RECURSOS FINAIS

- Stripe docs: https://stripe.com/docs
- Pricing psychology: https://stripe.com/pricing-guide
- SaaS metrics: https://www.notion.so/SaaS-Metrics
- Growth playbook: https://www.yc.org/library

---

**Boa sorte! O sucesso está em suas mãos!** 🚀💰

```
Radar da Voz → Sua primeira empresa rentável
Começou aqui, vai dominar o mercado lá!
```

