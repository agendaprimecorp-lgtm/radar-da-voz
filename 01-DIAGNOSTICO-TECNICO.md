# 🔍 Diagnóstico Técnico — Radar da Voz

## 1. **Backend: API/Banco de Dados**

### Status Atual: **PARCIAL**
- ✅ Frontend (React/Next.js) — **completo e deployado**
- ⚠️ Backend — **precisa validar**

**Questões críticas:**
- Onde estão os dados sendo salvos quando você grava uma voz?
- Existe servidor/API rodando, ou é tudo localStorage?
- Há integração com banco de dados (PostgreSQL, MongoDB, Firebase)?

**Recomendação:** Confirme se há `API_URL` no código ou se é apenas frontend.

---

## 2. **Análise de Voz: Como funciona?**

### Observado na interface:
- Exibe **NOTA** e **NÍVEL** após gravação
- Instruções precisas (15–30s, frase grave, aguda, trecho cantado)

### Possíveis implementações:
1. **API externa** (Deepgram, AssemblyAI, Google Speech-to-Text)
2. **Web Audio API nativa** (análise de frequência/amplitude com Web Audio)
3. **Modelo ML local** (TensorFlow.js, Onnx.js)
4. **Backend custom** (processamento em servidor Node/Python)

**Recomendação:** Verificar `fetch` calls no código para saber qual serviço está sendo usado.

---

## 3. **Autenticação**

### Status Atual: **NÃO ENCONTRADA**
- Não há login/signup visível
- Não há controle de usuário
- Tudo funciona como "anônimo" ou única sessão

### Necessário para Startup:
- ✅ **Login/SignUp** (email, Google, LinkedIn)
- ✅ **Tipos de usuários**: Artista, Produtora, Influenciador, Empresa
- ✅ **Perfis diferenciados** por tipo de usuário
- ✅ **Persistência de sessão** (token JWT ou similar)

---

## 4. **Persistência de Dados**

### Status Atual: **PROVÁVEL localStorage**
- Banco está vazio inicialmente
- Mensagem: *"Grave a primeira voz na aba Radar"*
- Dados provavelmente apagam ao limpar cache do navegador

### Necessário para Startup:
- ❌ **localStorage** — OK apenas para prototipagem
- ✅ **Banco de dados real** — PostgreSQL, Firebase, Supabase
- ✅ **Servidor dedicado** — Node.js, Python, ou Vercel Functions
- ✅ **Armazenamento de áudio** — S3, Cloudinary, ou similar

---

## **Arquitetura Recomendada**

```
CLIENTE (React/Next.js - frontend)
    ↓
API REST / GraphQL
    ↓
BANCO DE DADOS (PostgreSQL/Supabase)
    ↓
STORAGE DE ÁUDIO (S3/Cloudinary)
    ↓
ANÁLISE DE VOZ (API externa ou modelo ML)
```

---

## **Ações Imediatas**

1. ✅ Confirmar se existe backend rodando
2. ✅ Verificar qual serviço analisa a voz
3. ✅ Migrar de localStorage para banco de dados persistente
4. ✅ Implementar autenticação multi-tier (Artista/Produtora/Empresa)
5. ✅ Criar API para sincronizar dados entre frontend e backend
