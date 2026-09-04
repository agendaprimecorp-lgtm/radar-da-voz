# Architecture - Radar da Voz

Visão geral da arquitetura do sistema.

## Stack Tecnológico

```
Frontend:     Next.js 14 + React 18 + TypeScript + Tailwind CSS
Backend:      Next.js API Routes + Node.js
Database:     PostgreSQL (Supabase)
Auth:         Supabase Auth + JWT
Storage:      Cloudinary + PostgreSQL
Payments:     Stripe + Pix
Search:       PostgreSQL Full-text Search
Cache:        Redis (via Vercel KV)
Observability: Custom logging + monitoring
```

---

## Arquitetura em Camadas

### 1. Presentation Layer (Frontend)

```
/app
├── (marketing)        # Público (landing, blog)
├── auth               # Autenticação
├── talents            # Página de talentos
├── jobs               # Página de vagas
├── dashboard          # Dashboard personalizado
├── messages           # Chat
├── settings           # Configurações
└── admin              # Admin panel
```

**Responsabilidades:**
- UI/UX
- Form validation (client-side)
- Client-side caching com React Query
- Estado com Zustand

### 2. API Layer (Backend)

```
/app/api
├── auth              # Authentication endpoints
├── talents           # Talent CRUD
├── jobs              # Job CRUD
├── applications      # Application management
├── messages          # Messaging
├── reviews           # Reviews & ratings
├── analyze           # Video/audio analysis
├── notifications     # Email/push notifications
├── analytics         # Analytics events
├── monitoring        # Health checks
└── webhooks          # Stripe, OneSignal, etc.
```

**Responsabilidades:**
- Request validation (Zod schemas)
- Business logic
- Database queries
- Rate limiting
- Error handling
- Request/response transformation

### 3. Business Logic Layer

```
/lib
├── auth.ts           # Auth utilities
├── messaging.ts      # Messaging logic
├── notifications.ts  # Notification orchestration
├── video-analysis.ts # Video analysis
├── subscriptions.ts  # Subscription management
├── analytics.ts      # Analytics aggregation
└── monitoring.ts     # Error/performance tracking
```

**Responsabilidades:**
- Core business logic
- Service orchestration
- External API integration
- Data transformation

### 4. Data Layer

```
/db
├── 001_users.sql              # Users & auth
├── 002_organizations.sql      # Multi-tenancy
├── 003_talents.sql            # Talent profiles
├── 004_jobs.sql               # Job postings
├── 005_applications.sql       # Job applications
├── 006_messages.sql           # Messaging
├── 007_submissions.sql        # Video/audio submissions
├── 008_reviews.sql            # Reviews
├── 009_analytics.sql          # Analytics
├── 010_subscriptions.sql      # Billing
├── 011_monitoring.sql         # Error tracking
├── 012_notifications.sql      # Notification preferences
└── 013_local_representation.sql # Regional offices
```

**Features:**
- Row-Level Security (RLS)
- Automatic timestamps
- Indexes para performance
- Materialized views para analytics

---

## Fluxo de Dados

### Exemplo: Criar Candidatura

```
1. Cliente (React)
   └─> POST /api/applications
       └─> Validação (Zod)
           └─> Business Logic (/lib)
               └─> RLS Query (Supabase)
                   └─> Trigger (DB)
                       └─> Notificação
                           └─> Webhook (opcional)
                               └─> Response para Cliente
```

### Detalhado

```typescript
// 1. Cliente
async function applyForJob(jobId, message) {
  const response = await fetch('/api/applications', {
    method: 'POST',
    body: JSON.stringify({ jobId, message })
  })
}

// 2. API (/app/api/applications/route.ts)
export async function POST(request: NextRequest) {
  const { jobId, message } = await request.json()
  
  // Validar input
  const validated = applicationSchema.parse({ jobId, message })
  
  // Chamar business logic
  const application = await createApplication(userId, validated)
  
  // Retornar resposta
  return response(200, { application })
}

// 3. Business Logic (/lib/applications.ts)
export async function createApplication(userId, data) {
  // Query com RLS automático
  const app = await supabase
    .from('job_applications')
    .insert({ user_id: userId, ...data })
    .select()
    .single()
  
  // Notificar empregador
  await sendNotification({
    userId: job.employer_id,
    type: 'new_application',
    subject: 'Nova candidatura!'
  })
  
  return app
}

// 4. Database (RLS automático)
// Trigger envia evento em tempo real
// Notificação disparada
// Webhook chamado (se configurado)
```

---

## Segurança em Camadas

### 1. Entrada (Input Validation)

```typescript
// Zod schemas em /lib/validation.ts
const applicationSchema = z.object({
  jobId: z.string().uuid(),
  message: z.string().min(10).max(2000),
  videoUrl: z.string().url().optional()
})
```

### 2. Autenticação & Autorização

```typescript
// JWT via Supabase Auth
const user = await supabase.auth.getUser()

// RLS policies no banco
// Cada query é automaticamente filtrada por user/org
```

### 3. Rate Limiting

```typescript
// Em cada endpoint
const rateLimit = await checkRateLimit(userId, endpoint)
if (rateLimit.exceeded) {
  return response(429, { error: 'Too many requests' })
}
```

### 4. Data Encryption

```typescript
// PII em repouso
// Senhas com bcrypt
// Tokens com JWT
```

### 5. Saída (Output Sanitization)

```typescript
// Remover campos sensíveis
const sanitized = omit(user, ['passwordHash', 'twoFactorSecret'])
```

---

## Escalabilidade

### Horizontal Scaling

```
Load Balancer (Vercel)
├── Instance 1 (Next.js)
├── Instance 2 (Next.js)
└── Instance N (Next.js)
    └─> Shared Database (Supabase)
        └─> Shared Storage (Cloudinary)
        └─> Shared Cache (Redis)
```

### Caching Strategy

```
1. Client-side (React Query)
   - Dados de talento (5 min)
   - Lista de vagas (2 min)

2. CDN (Vercel Edge)
   - Landing page (24h)
   - Assets estáticos (30d)

3. Database (PostGres)
   - Queries com índices
   - Materialized views para analytics

4. Application Cache (Redis)
   - Rate limit counters
   - Session data
```

### Database Performance

```sql
-- Índices chave
CREATE INDEX idx_talents_specialty_city ON talents(specialty, city)
CREATE INDEX idx_jobs_employer_id ON jobs(employer_id)
CREATE INDEX idx_applications_job_id ON applications(job_id)

-- Materialized view para analytics (refresh 1x/dia)
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_metrics

-- Particionamento para tabelas grandes
-- analytics_events por ano
ALTER TABLE analytics_events
PARTITION BY RANGE (YEAR(created_at))
```

---

## Observabilidade

### Logging

```
Request → Logger → Database (error_logs table)
             ↓
          Monitoring Dashboard
             ↓
          Alert (Slack/Email)
```

### Metrics

```
/api/monitoring/health
├── Uptime %
├── Error Rate
├── Response Time (P50, P95, P99)
├── Active Users
└── Throughput
```

### Tracing (Futura Implementação)

```
POST /api/applications
├── Timestamp: 2026-09-03T10:30:00Z
├── Duration: 250ms
├── DB Query: 50ms
├── Notification: 150ms
└── External API: 50ms
```

---

## Deployment Architecture

### Local Development

```
localhost:3000
├── Next.js dev server
├── Auto-reload on changes
└── Supabase local (opcional)
```

### Staging

```
staging.radardevoz.com (Vercel)
├── Latest main branch
├── Staging Supabase project
├── Staging Stripe keys
└── Staging SendGrid keys
```

### Production

```
radardevoz.com (Vercel Edge Network)
├── Tag: production
├── Production Supabase
├── Production Stripe keys
├── Auto-scaling
├── CDN (240+ locations)
└── SSL/TLS (Let's Encrypt)
```

---

## Fluxo de CI/CD

```
1. Developer Push
   └─> GitHub Webhook
       └─> Vercel Build
           ├─> Install
           ├─> Lint
           ├─> Type Check
           ├─> Test
           └─> Build
               └─> Preview Deploy (Preview URL)

2. PR Approved
   └─> Merge to main
       └─> Vercel Production Build
           └─> Production Deploy
               └─> Health Checks
                   └─> Email notification
```

---

## Decisões Arquiteturais

### Por que Next.js?

✅ Full-stack com JavaScript/TypeScript
✅ API routes sem infra extra
✅ Built-in optimization
✅ Vercel deployment

### Por que Supabase?

✅ PostgreSQL gerenciado
✅ Auth built-in
✅ RLS para multi-tenancy
✅ Realtime com WebSocket

### Por que Tailwind CSS?

✅ Utility-first
✅ Dark mode built-in
✅ Responsive por padrão
✅ Tree-shakeable

### Por que Vercel?

✅ Zero-config deployment
✅ Edge functions
✅ Preview deployments
✅ Auto-scaling

---

## Evolução Futura

### Próximas Otimizações

- [ ] GraphQL API (em paralelo com REST)
- [ ] Microserviços (separar auth, payments, analysis)
- [ ] Event-driven architecture (RabbitMQ/Kafka)
- [ ] OpenTelemetry (tracing distribuído)
- [ ] DuckDB (analytics OLAP)
- [ ] React Native (mobile app nativa)

---

## Diagramas

### Diagrama de Dados

```
users
├─> organizations (one-to-many)
├─> talents (profile)
├─> jobs (created by)
├─> messages (participant)
└─> subscriptions (billing)

jobs
├─> job_applications
├─> local_offices
└─> reviews

talents
├─> video_submissions
├─> audio_submissions
├─> reviews
└─> local_representatives
```

---

## Referências

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [PostGIS Manual](https://postgis.net/docs)
- [Stripe API](https://stripe.com/docs/api)

---

## Changelog

### v1.0.0 (2026-09-03)
- Initial architecture documentation
- Multi-tier design
- Security layers
- Deployment architecture
