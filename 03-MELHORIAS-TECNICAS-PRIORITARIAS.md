# ⚙️ MELHORIAS TÉCNICAS PRIORITÁRIAS — Radar da Voz

## **MATRIZ DE PRIORIDADE**

```
IMPACTO ALTO + ESFORÇO BAIXO = FAZER IMEDIATAMENTE
IMPACTO ALTO + ESFORÇO ALTO = FAZER EM PHASES
IMPACTO BAIXO + ESFORÇO BAIXO = FAZER DEPOIS
IMPACTO BAIXO + ESFORÇO ALTO = NÃO FAZER
```

---

## **TIER 1: CRITICO (Próximas 2 semanas)**

### 1. **Autenticação & Multi-Tenant**
**Impacto:** ⭐⭐⭐⭐⭐ (Sem isso não funciona como startup)  
**Esforço:** ⭐⭐⭐

**O que fazer:**
```typescript
// Adicionar tipos de usuário:
enum UserType {
  ARTIST = "artist",           // Artista/Talento
  PRODUCER = "producer",       // Produtora de música
  COMPANY = "company",         // Empresa/Marca
  INFLUENCER = "influencer",   // Blogueiro/Influencer
  BAND = "band",              // Banda
  TV_RADIO = "tv_radio"       // TV/Rádio/Produtora audiovisual
}

// Estrutura de usuário:
{
  id: uuid,
  email: string,
  type: UserType,
  name: string,
  bio: string,
  profilePicture: string,
  verified: boolean,
  location: {
    city: string,
    state: string,
    region: string,
    lat/lng: coordinates
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Tecnologia:**
- Supabase Auth (mais simples) OU Auth0 (mais robusto)
- JWT tokens com tipo de usuário incluído
- Row-Level Security (RLS) no banco

---

### 2. **Migração para Banco de Dados Real**
**Impacto:** ⭐⭐⭐⭐⭐ (Dados precisam persistir)  
**Esforço:** ⭐⭐⭐

**Tecnologia recomendada:** Supabase (PostgreSQL + hosting + RLS + Auth)

**Schema básico:**

```sql
-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  user_type VARCHAR(50) NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  profile_picture_url TEXT,
  location_city TEXT,
  location_state TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de talentos/artistas
CREATE TABLE talents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  specialty VARCHAR(100), -- voz, violão, bateria, influencer
  genre TEXT[], -- sertanejo, rock, pop, axé, etc
  experience_years INTEGER,
  verified BOOLEAN DEFAULT false,
  rating DECIMAL(3, 2),
  portfolio_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de gravações de áudio
CREATE TABLE audio_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  talent_id UUID REFERENCES talents(id),
  audio_url TEXT NOT NULL, -- S3/Cloudinary URL
  duration_seconds INTEGER,
  analysis_score JSONB, -- {nota: 8.5, nivel: "profissional", frequencias: {...}}
  status VARCHAR(50), -- analyzing, completed, failed
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de vídeos
CREATE TABLE video_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  talent_id UUID REFERENCES talents(id),
  video_url TEXT NOT NULL,
  video_type VARCHAR(50), -- performance, interview, casting
  analysis_score JSONB, -- {carisma: 8, tecnica: 9, naturalidade: 8}
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de vagas/oportunidades
CREATE TABLE job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  posted_by_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  specialty_required VARCHAR(100),
  genre_required TEXT[],
  location_city TEXT,
  location_state TEXT,
  budget_min DECIMAL(10, 2),
  budget_max DECIMAL(10, 2),
  status VARCHAR(50), -- open, closed, filled
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Tabela de candidaturas
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES job_postings(id),
  talent_id UUID REFERENCES talents(id),
  status VARCHAR(50), -- applied, reviewed, shortlisted, rejected, hired
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de campanhas comerciais
CREATE TABLE ad_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  brief TEXT,
  budget DECIMAL(10, 2),
  target_region TEXT,
  deadline TIMESTAMP,
  status VARCHAR(50), -- open, in_progress, completed, closed
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de submissions em campanhas
CREATE TABLE campaign_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES ad_campaigns(id),
  influencer_id UUID REFERENCES users(id),
  video_url TEXT,
  status VARCHAR(50), -- submitted, approved, rejected, published
  engagement_metrics JSONB, -- {views: 5000, likes: 250, shares: 50}
  commission_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de representantes locais
CREATE TABLE local_representatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  influencer_id UUID REFERENCES users(id),
  region TEXT,
  city TEXT,
  followers_count INTEGER,
  commission_percentage DECIMAL(5, 2),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3. **API REST Estruturada**
**Impacto:** ⭐⭐⭐⭐⭐ (Frontend precisa buscar dados)  
**Esforço:** ⭐⭐⭐

**Endpoints essenciais:**

```
POST   /api/auth/register          # Criar conta
POST   /api/auth/login             # Login
POST   /api/auth/logout            # Logout

GET    /api/talents                # Listar talentos
GET    /api/talents/:id            # Ver perfil de talento
POST   /api/talents/:id/audio      # Upload de áudio
POST   /api/talents/:id/video      # Upload de vídeo

GET    /api/jobs                   # Listar vagas
POST   /api/jobs                   # Criar vaga (produtora)
POST   /api/jobs/:id/apply         # Aplicar para vaga

GET    /api/campaigns              # Listar campanhas comerciais
POST   /api/campaigns              # Criar campanha (empresa)
POST   /api/campaigns/:id/submit   # Submeter vídeo (influencer)

GET    /api/dashboard              # Dashboard personalizado por tipo
GET    /api/analytics              # Analytics/estatísticas

GET    /api/user/profile           # Ver perfil do usuário
PUT    /api/user/profile           # Atualizar perfil
POST   /api/user/avatar            # Upload de foto
```

**Stack recomendado:**
- Next.js API Routes (já estão usando Next)
- Supabase SDK para banco de dados
- TypeScript para type safety

---

## **TIER 2: IMPORTANTE (Semanas 3-4)**

### 4. **Análise de Áudio — Validar implementação existente**
**Impacto:** ⭐⭐⭐⭐  
**Esforço:** ⭐⭐ (se já existe) até ⭐⭐⭐⭐ (se precisa implementar)

**Verificar:**
- Qual serviço/API está sendo usado?
- Metrics retornadas: NOTA (0-10), NÍVEL (iniciante/intermediário/profissional)?
- Latência aceitável?

**Se não existir, recomendações:**

```typescript
// Opção 1: Web Audio API (nativo, zero custo)
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
// Analisar frequências, amplitude, etc
// Criar algoritmo próprio de scoring

// Opção 2: API externa (mais preciso, com custo)
// Deepgram (speech-to-text + análise)
// AssemblyAI (transcrição + análise emocional)
// Google Cloud Speech-to-Text

// Recomendado: Combinar
// 1. Web Audio API para score inicial
// 2. Deepgram para transcrição e análise de tom
// 3. Seu algoritmo proprietário para scoring final
```

---

### 5. **Upload e Armazenamento de Mídia**
**Impacto:** ⭐⭐⭐⭐  
**Esforço:** ⭐⭐

**Solução:** Cloudinary ou Supabase Storage + S3

```typescript
// Exemplo com Cloudinary
import { v2 as cloudinary } from 'cloudinary';

const uploadAudio = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'radar_da_voz');
  formData.append('folder', 'audio_submissions');
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/auto/upload`,
    { method: 'POST', body: formData }
  );
  
  const data = await response.json();
  return data.secure_url; // URL persistente
};
```

---

### 6. **Sistema de Pagamentos**
**Impacto:** ⭐⭐⭐⭐⭐  
**Esforço:** ⭐⭐⭐

**Implementar:**
- Stripe (cartão de crédito) + Pix (Brasil)
- Webhook para confirmar pagamento
- Guardar histórico de transações

```typescript
// Stripe + Pix via Stripe (ou parceiro local)
import Stripe from 'stripe';

const createPayment = async (amount: number) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // centavos
    currency: 'brl',
    payment_method_types: ['card', 'boleto'], // adicionar pix quando disponível
  });
  
  return paymentIntent.client_secret;
};
```

---

## **TIER 3: MELHORIAS (Semanas 5-6)**

### 7. **Upload de Vídeo + Análise de Vídeo**
**Impacto:** ⭐⭐⭐⭐  
**Esforço:** ⭐⭐⭐⭐

**Análise automatizada:**
- Carisma (expressão facial, contato visual)
- Naturalidade (linguagem corporal)
- Técnica vocal (se performance musical)
- Duração (validar 15-30s)

**Tecnologia:**
- Cloudinary Video Intelligence (cloud-based)
- Google Cloud Video Intelligence API
- Seu modelo custom com TensorFlow.js

---

### 8. **Comparador de Casting com Filtros Avançados**
**Impacto:** ⭐⭐⭐⭐  
**Esforço:** ⭐⭐

**Filtros:**
- Por região (geolocalização)
- Por gênero musical
- Por nível de experiência
- Por score de análise
- Por preço/cache

```typescript
// Filtro no banco
SELECT * FROM talents 
WHERE location_city = 'São Paulo'
  AND genre @> '{rock}' -- array contains
  AND rating >= 4.0
  AND specialty = 'voz'
ORDER BY rating DESC
LIMIT 10;
```

---

### 9. **Sistema de Mensagens (Chat)**
**Impacto:** ⭐⭐⭐  
**Esforço:** ⭐⭐⭐

**Stack:**
- Socket.io para real-time (ou Supabase Realtime)
- Tabela `messages` no banco
- Notificações via email/push

---

### 10. **Dashboard Personalizado**
**Impacto:** ⭐⭐⭐⭐  
**Esforço:** ⭐⭐⭐

**Varia por tipo de usuário:**

**Artista vê:**
- Meu perfil, meus vídeos
- Histórico de propostas recebidas
- Minhas candidaturas pendentes
- Meu rating

**Produtora vê:**
- Vagas abertas (minhas)
- Candidatos por vaga
- Talentos salvos
- Comparador

**Empresa vê:**
- Campanhas ativas
- Submissões recebidas
- Performance de cada anúncio
- Influenciadores participantes

---

## **ESTIMATIVA DE TEMPO**

```
Tier 1 (crítico):       2 semanas    → MVP com autenticação + BD
Tier 2 (importante):    2 semanas    → Funcionalidades core
Tier 3 (melhorias):     2 semanas    → Polish + novos recursos

TOTAL MVP v2:           ~6 semanas (1.5 meses)

Para produção/escala:   +2-4 semanas (testes, segurança, performance)

GO LIVE:                2.5-3 meses do início
```

---

## **STACK TÉCNICO RECOMENDADO (FULL)**

```
FRONTEND
├─ Next.js 14+ (React + SSR + API routes)
├─ TypeScript
├─ Tailwind CSS (já está usando, bom)
├─ Zustand (state management)
└─ React Query (data fetching)

BACKEND
├─ Supabase (PostgreSQL + Auth + Storage + RLS)
├─ Node.js/TypeScript
├─ API Routes do Next.js (simples)
└─ Environment variables com .env.local

BANCO DE DADOS
├─ PostgreSQL (via Supabase)
├─ Row-Level Security (RLS) para isolamento
└─ Migrations com Supabase CLI

ARMAZENAMENTO DE MÍDIA
├─ Cloudinary (imagens + vídeos)
├─ S3 (backup + áudios)
└─ Supabase Storage (alternativa)

ANÁLISE DE MÍDIA
├─ Web Audio API (nativo)
├─ Deepgram API (transcrição + tom)
├─ Google Cloud Video Intelligence (análise de vídeo)
└─ Seu algoritmo proprietário (scoring)

PAGAMENTOS
├─ Stripe (cartão de crédito)
├─ Pix (via parceiro ou Stripe no futuro)
└─ Webhook para sincronização

DEPLOY
├─ Vercel (front + back + BD Supabase)
├─ GitHub Actions (CI/CD)
└─ Monitoramento: Sentry (errors), PostHog (analytics)
```

---

## **CHECKLIST DE IMPLEMENTAÇÃO**

### Semana 1-2:
- [ ] Supabase project criado
- [ ] Schema do banco implementado
- [ ] Autenticação (signup/login) funcionando
- [ ] Perfil de usuário salvo no banco
- [ ] CRUD básico de talentos

### Semana 3-4:
- [ ] Upload de áudio funcionando (Cloudinary)
- [ ] Análise de áudio funcionando
- [ ] API de jobs/vagas
- [ ] Aplicação para vaga funcionando

### Semana 5-6:
- [ ] Upload de vídeo
- [ ] Pagamentos (Stripe) básico
- [ ] Dashboard simples por tipo de usuário
- [ ] Filtros avançados

### Semana 7-8:
- [ ] Testes de segurança
- [ ] Testes de performance
- [ ] Documentação da API
- [ ] Beta com 10 usuários reais

---

## **QUESTÕES A RESPONDER IMEDIATAMENTE**

1. O que está análise de voz usando agora? (Qual API/serviço?)
2. Onde estão sendo armazenados os áudios? (Cloudinary? S3? localStorage?)
3. Vocês querem hospedar backend próprio ou usar serverless (Vercel/Supabase)?
4. Qual é o orçamento mensal para APIs externas?
5. Quando precisa estar pronto para primeiro beta?

---

**Próximo passo:** Responder essas questões e começar Tier 1! 🚀
