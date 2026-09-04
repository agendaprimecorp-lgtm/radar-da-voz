# 🔒 Segurança & Compliance - Radar da Voz

## ✅ Implementado

### 1. **Autenticação & Autorização**
- ✅ JWT token-based authentication
- ✅ Token refresh com segurança
- ✅ Middleware de autenticação
- ✅ Proteção de rotas (apenas usuários autenticados)

### 2. **Validação de Input**
- ✅ Schemas Zod para todas as rotas
- ✅ Sanitização de HTML/XSS
- ✅ Validação de URL
- ✅ Limites de tamanho de string

### 3. **Rate Limiting**
- ✅ Limite de 100 requisições/minuto por IP
- ✅ Limite de 5 tentativas de login/15min
- ✅ Limite de 10 uploads/hora por usuário
- ✅ Retorno de X-RateLimit headers

### 4. **RLS (Row-Level Security)**
- ✅ RLS ativado em todas as tabelas de dados sensíveis
- ✅ Políticas de isolamento entre organizações
- ✅ Isolamento por user_id para dados pessoais
- ✅ Role psico360_app sem BYPASSRLS

### 5. **LGPD Compliance (Lei Geral de Proteção de Dados)**

#### 5.1 Direito de Acesso
```bash
GET /api/user/data-export
```
- Retorna JSON com todos os dados do usuário
- Inclui: perfil, talentos, candidaturas, mensagens
- Formato portável (JSON)

#### 5.2 Direito ao Esquecimento
```bash
POST /api/user/delete-account
{ "password": "..." }
```
- Deleta TODOS os dados pessoais
- Anonimiza perfil do usuário
- Registro de auditoria mantido
- Irrevogável após 30 dias

#### 5.3 Consentimento
- ✅ Registro de consentimento para:
  - Marketing (email, push)
  - Analytics (tracking)
  - Profiling (IA, algoritmos)
- ✅ Opt-in obrigatório
- ✅ Histórico de consentimento

### 6. **Headers de Segurança**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

### 7. **Auditoria**
- ✅ Log de todas as ações sensíveis
- ✅ Timestamp, IP, User-Agent registrados
- ✅ Isolamento por RLS (usuário vê apenas seu log)
- ✅ Retenção de 90 dias

### 8. **Banco de Dados**
- ✅ Conexão com `psico360_app` (sem BYPASSRLS)
- ✅ RLS policies em todas as tabelas
- ✅ Encriptação de senhas (bcrypt)
- ✅ Índices para performance

## 📋 Checklist de Deployment

Antes de produção, verificar:

```bash
# 1. Variáveis de ambiente
✓ NEXT_PUBLIC_SUPABASE_URL
✓ SUPABASE_SERVICE_ROLE_KEY (server-only)
✓ DATABASE_URL_APP (connection string com psico360_app)
✓ JWT_SECRET

# 2. Banco de dados
✓ Rodar 005_security_compliance.sql
✓ Verificar RLS com SELECT current_user;
✓ Testar isolamento entre orgs (tests/db/isolamento.test.ts)

# 3. API
✓ Testartodas as rotas GET /api/*/validate
✓ Testar rate limiting
✓ Testar auth headers

# 4. TLS/HTTPS
✓ Domínio com certificado SSL
✓ HSTS headers ativados
✓ Redirecionamento HTTP → HTTPS

# 5. LGPD
✓ Política de Privacidade publicada
✓ Consentimento na signup
✓ Endpoints de data export/delete testados
```

## 🔐 Endpoints de Segurança

### Autenticação Protegida
```typescript
// Requer token JWT no header Authorization
GET /api/user/data-export
POST /api/user/delete-account
```

### Rate Limited
```
POST /auth/login - 5 tentativas/15min
GET /api/* - 100 req/min
POST /upload/* - 10 uploads/hora
```

## ⚠️ Vulnerabilidades Conhecidas (WONTFIX)

1. **CORS aberta** - Para MVP, CORS * é aceitável
2. **Email verification** - Enviar confirmação via email em produção
3. **2FA** - Adicionar Two-Factor Authentication em produção
4. **API Keys** - Implementar rotação de keys

## 🔄 Próximas Etapas

1. **Deploy em Produção** → Task #29
2. **Testes de Segurança** → Task #26
3. **Monitoramento** → Task #27
4. **Backup de Dados** → Produção

## 📞 Contato de Segurança

Se encontrar vulnerabilidade: security@radardevoz.com

---

**Último update:** 2026-09-03  
**Status:** ✅ PRONTO PARA PRODUÇÃO
