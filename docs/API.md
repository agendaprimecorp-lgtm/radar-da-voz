# API Documentation - Radar da Voz

Documentação completa da API REST do Radar da Voz.

## Base URL

```
Production: https://radardevoz.com/api
Staging: https://staging.radardevoz.com/api
Development: http://localhost:3000/api
```

## Authentication

Todas as requisições autenticadas devem incluir o header:

```bash
Authorization: Bearer {access_token}
```

## Response Format

Todas as respostas seguem este formato:

```json
{
  "success": true,
  "data": { /* response data */ },
  "error": null,
  "timestamp": "2026-09-03T10:30:00Z"
}
```

---

## Endpoints

### Authentication

#### POST /auth/signup
Criar novo usuário.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "userType": "talent" | "employer" | "producer"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGc..."
}
```

**Status Codes:**
- `201` - User created successfully
- `400` - Validation error
- `409` - Email already exists

---

#### POST /auth/login
Fazer login.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "token": "eyJhbGc..."
}
```

---

#### POST /auth/logout
Fazer logout.

**Status Codes:**
- `200` - Logout successful

---

### Talentos

#### GET /talents
Listar talentos com filtros.

**Query Parameters:**
- `search` - Busca por nome/especialidade (string)
- `specialty` - Filtrar por especialidade (string)
- `city` - Filtrar por cidade (string)
- `rating` - Filtrar por avaliação mínima (number 1-5)
- `limit` - Limite de resultados (default: 20)
- `offset` - Offset de paginação (default: 0)

**Response:**
```json
{
  "talents": [
    {
      "id": "uuid",
      "name": "Maria Silva",
      "specialty": "atriz",
      "city": "São Paulo",
      "rating": 4.8,
      "reviews": 45,
      "avatar": "https://..."
    }
  ],
  "total": 342,
  "page": 1
}
```

---

#### GET /talents/:id
Obter detalhes de um talento.

**Response:**
```json
{
  "talent": {
    "id": "uuid",
    "name": "Maria Silva",
    "email": "maria@example.com",
    "specialty": "atriz",
    "bio": "Atriz com 10 anos de experiência",
    "city": "São Paulo",
    "state": "SP",
    "rating": 4.8,
    "reviews": 45,
    "videos": [
      {
        "id": "uuid",
        "url": "https://...",
        "carisma": 8,
        "naturalidade": 9,
        "tecnica": 7
      }
    ]
  }
}
```

---

### Vagas

#### POST /jobs
Criar nova vaga. **(Autenticado)**

**Request:**
```json
{
  "title": "Atriz Principal",
  "description": "Procuramos atriz para série de TV",
  "specialty": "atriz",
  "city": "São Paulo",
  "state": "SP",
  "salary": 5000,
  "duration": "3 meses",
  "startDate": "2026-10-01"
}
```

**Response:**
```json
{
  "job": {
    "id": "uuid",
    "title": "Atriz Principal",
    "createdAt": "2026-09-03T10:30:00Z"
  }
}
```

---

#### GET /jobs
Listar vagas.

**Query Parameters:**
- `specialty` - Filtrar por especialidade
- `city` - Filtrar por cidade
- `status` - 'open', 'closed', 'filled'
- `limit` - (default: 20)

**Response:**
```json
{
  "jobs": [
    {
      "id": "uuid",
      "title": "Atriz Principal",
      "specialty": "atriz",
      "city": "São Paulo",
      "salary": 5000,
      "applications": 12,
      "status": "open"
    }
  ],
  "total": 156
}
```

---

### Candidaturas

#### POST /applications
Candidatar a uma vaga. **(Autenticado)**

**Request:**
```json
{
  "jobId": "uuid",
  "message": "Interessada na oportunidade!",
  "videoUrl": "https://..."
}
```

**Response:**
```json
{
  "application": {
    "id": "uuid",
    "jobId": "uuid",
    "status": "submitted",
    "createdAt": "2026-09-03T10:30:00Z"
  }
}
```

---

#### GET /applications
Listar minhas candidaturas. **(Autenticado)**

**Query Parameters:**
- `status` - 'submitted', 'reviewed', 'accepted', 'rejected'
- `limit` - (default: 20)

**Response:**
```json
{
  "applications": [
    {
      "id": "uuid",
      "job": {
        "id": "uuid",
        "title": "Atriz Principal",
        "company": "Company Name"
      },
      "status": "reviewed",
      "createdAt": "2026-09-03T10:30:00Z"
    }
  ],
  "total": 8
}
```

---

### Mensagens

#### POST /messages
Enviar mensagem. **(Autenticado)**

**Request:**
```json
{
  "recipientId": "uuid",
  "content": "Olá! Tudo bem?"
}
```

**Response:**
```json
{
  "message": {
    "id": "uuid",
    "conversationId": "uuid",
    "content": "Olá! Tudo bem?",
    "createdAt": "2026-09-03T10:30:00Z"
  }
}
```

---

#### GET /messages
Listar conversas. **(Autenticado)**

**Query Parameters:**
- `limit` - (default: 20)
- `offset` - (default: 0)

**Response:**
```json
{
  "conversations": [
    {
      "id": "uuid",
      "participant": {
        "id": "uuid",
        "name": "João Silva",
        "avatar": "https://..."
      },
      "lastMessage": "Ótimo! Vamos agendar.",
      "unreadCount": 2,
      "updatedAt": "2026-09-03T10:30:00Z"
    }
  ],
  "total": 5
}
```

---

### Análise de Vídeo

#### POST /analyze/video
Analisar vídeo de candidato. **(Autenticado)**

**Request:**
```json
{
  "videoUrl": "https://example.com/video.mp4"
}
```

**Response:**
```json
{
  "analysis": {
    "carisma": 8.5,
    "naturalidade": 7.9,
    "tecnica": 8.2,
    "overall": 8.2,
    "feedback": [
      "Excelente presença de palco",
      "Voz clara e bem projetada"
    ],
    "duration": 120,
    "processedAt": "2026-09-03T10:30:00Z"
  }
}
```

---

### Avaliações

#### POST /reviews
Avaliar talento. **(Autenticado)**

**Request:**
```json
{
  "talentId": "uuid",
  "rating": 5,
  "comment": "Excelente profissional!",
  "categories": {
    "communication": 5,
    "professionalism": 4,
    "quality": 5
  }
}
```

**Response:**
```json
{
  "review": {
    "id": "uuid",
    "talentId": "uuid",
    "rating": 5,
    "createdAt": "2026-09-03T10:30:00Z"
  }
}
```

---

#### GET /talents/:id/reviews
Obter avaliações de um talento.

**Query Parameters:**
- `limit` - (default: 10)
- `offset` - (default: 0)

**Response:**
```json
{
  "reviews": [
    {
      "id": "uuid",
      "reviewer": {
        "name": "João Silva"
      },
      "rating": 5,
      "comment": "Excelente profissional!",
      "createdAt": "2026-09-03T10:30:00Z"
    }
  ],
  "summary": {
    "avgRating": 4.8,
    "totalReviews": 45,
    "categories": {
      "communication": 4.9,
      "professionalism": 4.8,
      "quality": 4.7
    }
  }
}
```

---

### Notificações

#### GET /notifications/preferences
Obter preferências de notificação. **(Autenticado)**

**Response:**
```json
{
  "preferences": {
    "emailNewApplications": true,
    "emailNewMessages": true,
    "pushNewApplications": true,
    "pushNewMessages": false,
    "smsEnabled": false,
    "quietHours": {
      "start": "22:00",
      "end": "08:00"
    }
  }
}
```

---

#### PUT /notifications/preferences
Atualizar preferências. **(Autenticado)**

**Request:**
```json
{
  "emailNewMessages": false,
  "pushNewMessages": true
}
```

**Response:**
```json
{
  "preferences": {
    "emailNewMessages": false,
    "pushNewMessages": true
  }
}
```

---

## Error Handling

Erros seguem este formato:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is invalid",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email"
      }
    ]
  },
  "timestamp": "2026-09-03T10:30:00Z"
}
```

### Common Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

- **Free plan**: 100 requests/hour
- **Pro plan**: 1,000 requests/hour
- **Enterprise**: Unlimited

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1693564800
```

---

## Webhooks

### Job Application Webhook

Enviado quando há nova candidatura:

```json
{
  "event": "application.created",
  "data": {
    "applicationId": "uuid",
    "jobId": "uuid",
    "talentName": "Maria Silva",
    "timestamp": "2026-09-03T10:30:00Z"
  }
}
```

Configure em Settings → Webhooks.

---

## Changelog

### v1.0.0 (2026-09-03)
- Initial API release
- Core endpoints for talents, jobs, applications
- Video analysis integration
- Messaging system
- Reviews and ratings

---

## Support

- **Email**: api-support@radardevoz.com
- **Docs**: https://docs.radardevoz.com
- **Status**: https://status.radardevoz.com
