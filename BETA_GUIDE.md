# 🚀 Beta Program - Radar da Voz

## Bem-vindo ao Beta!

Obrigado por ser parte do programa beta do Radar da Voz! Este guia te ajudará a começar.

---

## 1. Começar Rápido

### 1.1 Acessar o Beta

```
URL: https://radardevoz.com/beta
Login: empresa@test.com
Senha: Teste123!
```

### 1.2 Contas de Teste Disponíveis

```
👤 EMPRESA (Criar Vagas)
Email: empresa@test.com
Senha: Teste123!
Tipo: company
Função: Publicar vagas, campanhas, aprovar candidatos

👤 ARTISTA 1 (Candidatar-se)
Email: artista1@test.com
Senha: Teste123!
Tipo: artist
Função: Procurar vagas, submeter vídeos, receber pagamentos

👤 ARTISTA 2 (Candidatar-se)
Email: artista2@test.com
Senha: Teste123!
Tipo: artist
Função: Idem acima

👤 PRODUTOR (Buscar Talentos)
Email: produtor@test.com
Senha: Teste123!
Tipo: producer
Função: Explorar talentos, fazer ofertas

👤 INFLUENCER (Campanhas)
Email: influencer@test.com
Senha: Teste123!
Tipo: influencer
Função: Descobrir campanhas, submeter vídeos
```

---

## 2. Roteiro de Testes Recomendado

### Sessão 1: Exploração (30 min)

```
1. Login com empresa@test.com
   ✓ Verificar dashboard
   ✓ Explorar menu lateral
   ✓ Acessar primeira vaga beta

2. Logout e login com artista1@test.com
   ✓ Verificar dashboard de artista
   ✓ Explorar banco de talentos
   ✓ Ver vagas disponíveis

3. Explorar campanhas
   ✓ Como influencer@test.com
   ✓ Visualizar campanhas ativas
   ✓ Ver detalhes e budget
```

### Sessão 2: Fluxo Completo (45 min)

```
FLUXO DE VAGA:
1. Login como empresa@test.com
2. Ir para Dashboard → Criar Vaga
3. Preencher formulário (pre-filled com dados)
4. Publicar vaga
5. Logout

6. Login como artista1@test.com
7. Ir para Vagas
8. Encontrar vaga publicada
9. Clicar em "Candidatar-se"
10. Submeter candidatura
11. Voltar e verificar status

FLUXO DE CAMPANHA:
1. Login como empresa@test.com
2. Ir para Campanhas → Criar Campanha
3. Preencher formulário
4. Publicar campanha
5. Logout

6. Login como influencer@test.com
7. Ir para Campanhas
8. Encontrar campanha
9. Clicar em "Participar"
10. Submeter vídeo
11. Verificar análise automática de vídeo
```

### Sessão 3: Recursos Avançados (30 min)

```
ANÁLISE DE VÍDEO:
1. Ir para /video-analyzer
2. Cole URL de vídeo (YouTube, Vimeo)
3. Verificar scores e feedback
4. Testar com múltiplos vídeos

LGPD COMPLIANCE:
1. Ir para Settings → Privacy
2. Clicar em "Exportar Meus Dados"
3. Verificar JSON baixado
4. (NÃO DELETAR CONTA AINDA - apenas testar)

DESCOBERTA DE TALENTOS:
1. Ir para /talents como producer@test.com
2. Explorar filtros (specialty, city, rating)
3. Clicar em talento para ver detalhes
4. Verificar análises de vídeo
```

---

## 3. O Que Testar

### Funcionalidades Críticas ✅

```
✓ Autenticação
  - Login com múltiplos tipos
  - Logout funcionando
  - Tokens expirando corretamente
  - Redirecionamento de rotas protegidas

✓ Dashboard
  - Informações corretas por tipo de usuário
  - Carregamento de dados sem delay
  - Filtros funcionando
  - Paginação (se tiver)

✓ Vagas
  - Criar, editar, deletar vaga
  - Candidatar-se a vaga
  - Ver candidatos (como empresa)
  - Aprovar/rejeitar candidatos

✓ Campanhas
  - Criar campanha com budget
  - Submeter vídeo para campanha
  - Análise automática de vídeo
  - Cálculo de comissão correto

✓ Talentos
  - Filtrar por specialty
  - Filtrar por city
  - Filtrar por rating
  - Visualizar perfil completo
```

### Requisitos Não-Funcionais 🔧

```
✓ Performance
  - Dashboard carrega em < 2s
  - API respostas em < 500ms
  - Vídeo analyzer sem travamento

✓ Segurança
  - Senha não é salva em console
  - HTTPS em produção
  - LGPD endpoints funcionando
  - Rate limiting em api (tenta 100+ requests)

✓ UI/UX
  - Responsivo em mobile
  - Dark theme consistente
  - Toasts de feedback claros
  - Formulários com validação
```

---

## 4. Reportar Bugs

### 4.1 Encontrou um bug?

1. **Reproduza o bug** (faça 2x para ter certeza)
2. **Anote os passos** que levaram ao bug
3. **Capture screenshot** se possível
4. **Abra a página de feedback**: `/beta`
5. **Descreva claramente**:

```
Título do Bug: [Breve descrição]

Passos para reproduzir:
1. Login como empresa@test.com
2. Ir para Dashboard
3. Clicar em "Criar Vaga"
4. [BUG ACONTECE AQUI]

Resultado esperado:
Formulário deveria aceitar título com 200 caracteres

Resultado atual:
Formulário trava quando digito mais de 100 caracteres

Browser/Device:
Chrome 120, Windows 11, Desktop
```

### 4.2 Exemplo de Bom Bug Report

```
Título: Análise de vídeo falha com URLs do TikTok

Passos:
1. Ir para /video-analyzer
2. Cola URL: https://www.tiktok.com/@user/video/123456
3. Clica "Analisar Vídeo"

Esperado: Vídeo analisado, scores mostrados

Atual: Erro 400 "Invalid video URL"

Arquivo de erro (DevTools Console):
TypeError: Cannot read properties of undefined

Nota: Funciona com YouTube e Vimeo, apenas TikTok falha
```

---

## 5. Testes de Performance

### 5.1 Testar Latência

```bash
# No console do navegador (F12):

// Testar login
console.time('login');
// ... fazer login ...
console.timeEnd('login');

// Resultado esperado: ~500ms

// Testar busca de talentos
console.time('search');
// ... fazer busca ...
console.timeEnd('search');

// Resultado esperado: ~200ms
```

### 5.2 Testar Responsividade

```
1. Abrir DevTools (F12)
2. Clicar em "Responsive Design" (Ctrl+Shift+M)
3. Testar em:
   - iPhone 12 (390x844)
   - iPad (768x1024)
   - Desktop (1920x1080)
4. Verificar se layout se adapta
5. Testar botões e formulários em mobile
```

---

## 6. Testes de Segurança

### 6.1 Verificar Headers

```bash
# No terminal:
curl -I https://radardevoz.com/api/health

# Verificar se tem:
✓ Strict-Transport-Security
✓ X-Content-Type-Options: nosniff
✓ X-Frame-Options: DENY
✓ Content-Security-Policy
```

### 6.2 Testar Rate Limiting

```
1. Abrir DevTools → Network
2. Fazer 150+ requisições em < 1 min
3. Verificar se recebe 429 Too Many Requests
4. Esperar 1 minuto
5. Requisição seguinte deve funcionar
```

### 6.3 Testar LGPD

```
1. Login → Settings → Privacy
2. Clicar "Exportar Meus Dados"
3. Verificar JSON contém:
   ✓ User data
   ✓ Talents/Applications
   ✓ Tudo de forma portável
4. Testar "Deletar Conta"
5. Verificar logout automático
```

---

## 7. Checklist Pré-Launch

Antes de declarar beta como "sucesso", verificar:

```
Funcionalidades:
☐ Todos os 5 tipos de usuário conseguem logar
☐ Dashboard carrega dados corretamente
☐ Vagas podem ser criadas e candidatos podem se inscrever
☐ Campanhas funcionam com análise de vídeo
☐ LGPD endpoints funcionando (export, delete)
☐ Rate limiting ativado
☐ Talentos podem ser filtrados

Performance:
☐ Dashboard < 2s
☐ API < 500ms
☐ Video analyzer não trava
☐ Sem memory leaks em DevTools

Segurança:
☐ HTTPS ativado
☐ Headers de segurança presentes
☐ Sem senhas em console logs
☐ RLS testado (isolamento entre orgs)

UX:
☐ UI responsivo (mobile + desktop)
☐ Mensagens de erro claras
☐ Confirmação antes de ações destrutivas
☐ Dark theme consistente

Bugs:
☐ 0 bugs críticos
☐ 0 bugs que travam app
☐ Máximo 3-4 bugs menores
```

---

## 8. Dúvidas Frequentes

**P: Posso deletar minha conta de teste?**  
R: Sim! Mas recomendamos deixar para o final dos testes.

**P: Posso criar minha própria conta?**  
R: Sim! Mas use as contas de teste para comparar comportamentos.

**P: Posso fazer upload de vídeos reais?**  
R: Sim! Para /video-analyzer, pode testar com qualquer vídeo do YouTube/Vimeo.

**P: Quanto tempo o beta vai rodar?**  
R: Até 2 semanas, ou até resolve todos os bugs críticos.

**P: Vou ganhar algo testando?**  
R: Menção honorária nos créditos + beta access gratuito por 6 meses!

---

## 9. Próximos Passos

Após beta bem-sucedido:

```
✅ Fase 1 (Agora): Beta com 5 contas
↓
✅ Fase 2 (Semana 1): Expandir para 50 beta testers
↓
✅ Fase 3 (Semana 2): Corrigir bugs + otimizar
↓
🚀 Fase 4 (Semana 3): LAUNCH PUBLIC!
```

---

## 10. Contato

- **Bug Reports**: `/beta` → Enviar Feedback
- **Email**: dev@radardevoz.com
- **Discord**: [Link do servidor]

---

**Obrigado por participar do Beta! 🎉**

Seu feedback é essencial para o sucesso do Radar da Voz!

---

**Versão Beta:** 1.0.0  
**Data de início:** 2026-09-03  
**Status:** 🟢 ATIVO
