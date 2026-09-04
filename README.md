# 🎤 Radar da Voz

Plataforma de economia de talentos que conecta artistas, produtoras, empresas e influenciadores.

## 🚀 Features

- **Análise de Voz**: Análise automática de áudio com score inteligente
- **Banco de Talentos**: Descubra talentos com filtros avançados
- **Comparador de Casting**: Compare 2-6 candidatos lado-a-lado
- **Vagas Abertas**: Produtoras postam oportunidades
- **Plataforma de Comerciais**: Empresas conectam com influenciadores
- **Dashboard Personalizado**: Diferentes views por tipo de usuário
- **Pagamentos Integrados**: Stripe + Pix
- **Chat em Tempo Real**: Comunicação entre usuários
- **Geolocalização**: Encontre talentos locais

## 🛠 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Análise**: Web Audio API + Deepgram + Google Cloud Video Intelligence
- **Armazenamento**: Cloudinary
- **Pagamentos**: Stripe
- **Deployment**: Vercel

## 📋 Pré-requisitos

- Node.js 18+
- npm 9+
- Supabase account
- Cloudinary account
- Stripe account

## 🔧 Setup Local

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/radar-da-voz.git
cd radar-da-voz
```

2. **Instale dependências**
```bash
npm install
```

3. **Configure variáveis de ambiente**
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

4. **Execute o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Abra no navegador**
```
http://localhost:3000
```

## 📦 Build para Produção

```bash
npm run build
npm start
```

## 🧪 Testes

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests
npm run e2e
```

## 📚 Documentação

- [API Documentation](./docs/API.md)
- [Components](./docs/COMPONENTS.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment](./docs/DEPLOYMENT.md)

## 🐛 Reportar Issues

[GitHub Issues](https://github.com/seu-usuario/radar-da-voz/issues)

## 📄 Licença

MIT

## 👥 Contribuindo

Contribuições são bem-vindas! Leia [CONTRIBUTING.md](./CONTRIBUTING.md)

---

Feito com ❤️ por [Seu Nome]
