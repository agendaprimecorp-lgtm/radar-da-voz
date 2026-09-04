-- ============================================
-- SEED PARA BETA TESTING
-- ============================================

-- Limpar dados antigos (apenas para ambiente de teste)
-- DELETE FROM talents;
-- DELETE FROM users WHERE is_deleted = false;

-- ============================================
-- 1. USUÁRIOS DE TESTE
-- ============================================

-- Usuário: Company (Criador de Vagas)
INSERT INTO users (id, email, full_name, user_type, organization_id, is_deleted) VALUES
  ('00000001-0000-0000-0000-000000000001', 'empresa@test.com', 'Empresa Beta', 'company', 'org-001', false)
ON CONFLICT DO NOTHING;

-- Usuário: Artista 1
INSERT INTO users (id, email, full_name, user_type, organization_id, is_deleted) VALUES
  ('00000001-0000-0000-0000-000000000002', 'artista1@test.com', 'João Silva', 'artist', 'org-002', false)
ON CONFLICT DO NOTHING;

-- Usuário: Artista 2
INSERT INTO users (id, email, full_name, user_type, organization_id, is_deleted) VALUES
  ('00000001-0000-0000-0000-000000000003', 'artista2@test.com', 'Maria Santos', 'artist', 'org-003', false)
ON CONFLICT DO NOTHING;

-- Usuário: Produtor
INSERT INTO users (id, email, full_name, user_type, organization_id, is_deleted) VALUES
  ('00000001-0000-0000-0000-000000000004', 'produtor@test.com', 'Carlos Produtor', 'producer', 'org-004', false)
ON CONFLICT DO NOTHING;

-- Usuário: Influencer
INSERT INTO users (id, email, full_name, user_type, organization_id, is_deleted) VALUES
  ('00000001-0000-0000-0000-000000000005', 'influencer@test.com', 'Ana Influencer', 'influencer', 'org-005', false)
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. PERFIS DE TALENTO
-- ============================================

INSERT INTO talents (user_id, specialty, bio, city, state, rating) VALUES
  ('00000001-0000-0000-0000-000000000002', 'singing', 'Cantor lírico com 10 anos de experiência', 'São Paulo', 'SP', 8.5),
  ('00000001-0000-0000-0000-000000000003', 'acting', 'Atriz com experiência em TV e cinema', 'Rio de Janeiro', 'RJ', 7.8)
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. PRIMEIRA VAGA BETA
-- ============================================

INSERT INTO job_postings (id, company_id, title, description, specialty_required, location, salary_min, salary_max, deadline) VALUES
  ('00000001-0000-0000-0000-100000000001', '00000001-0000-0000-0000-000000000001',
   'Cantor para Produção Musical',
   'Procuramos cantor lírico para sessão de gravação de álbum. Experiência com música clássica e popular. Necessário disponibilidade para 5 dias de estúdio.',
   'singing',
   'São Paulo, SP',
   5000, 15000,
   NOW() + INTERVAL '30 days')
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. CAMPANHAS BETA
-- ============================================

INSERT INTO ad_campaigns (id, company_id, title, brief, budget, target_region, city, deadline) VALUES
  ('00000001-0000-0000-0000-200000000001', '00000001-0000-0000-0000-000000000001',
   'Anúncio de Produto - Video 30s',
   'Criamos um novo produto de skincare e precisamos de influencer para fazer um vídeo de 30 segundos mostrando o produto. Casual, divertido e autêntico.',
   5000,
   'São Paulo',
   'São Paulo',
   NOW() + INTERVAL '14 days')
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. CONSENTIMENTO LGPD (BETA TESTERS)
-- ============================================

INSERT INTO lgpd_consent (user_id, consent_type, granted) VALUES
  ('00000001-0000-0000-0000-000000000001', 'marketing', true),
  ('00000001-0000-0000-0000-000000000001', 'analytics', true),
  ('00000001-0000-0000-0000-000000000002', 'marketing', true),
  ('00000001-0000-0000-0000-000000000002', 'analytics', true),
  ('00000001-0000-0000-0000-000000000003', 'marketing', true),
  ('00000001-0000-0000-0000-000000000003', 'analytics', true),
  ('00000001-0000-0000-0000-000000000004', 'marketing', true),
  ('00000001-0000-0000-0000-000000000004', 'analytics', true),
  ('00000001-0000-0000-0000-000000000005', 'marketing', true),
  ('00000001-0000-0000-0000-000000000005', 'analytics', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. AUDITORIA INICIAL
-- ============================================

INSERT INTO audit_log (user_id, action, details) VALUES
  ('00000001-0000-0000-0000-000000000001', 'BETA_SIGNUP', '{"account_type": "company", "timestamp": "' || NOW() || '"}'),
  ('00000001-0000-0000-0000-000000000002', 'BETA_SIGNUP', '{"account_type": "artist", "timestamp": "' || NOW() || '"}'),
  ('00000001-0000-0000-0000-000000000003', 'BETA_SIGNUP', '{"account_type": "artist", "timestamp": "' || NOW() || '"}'),
  ('00000001-0000-0000-0000-000000000004', 'BETA_SIGNUP', '{"account_type": "producer", "timestamp": "' || NOW() || '"}'),
  ('00000001-0000-0000-0000-000000000005', 'BETA_SIGNUP', '{"account_type": "influencer", "timestamp": "' || NOW() || '"}')
ON CONFLICT DO NOTHING;

-- ============================================
-- 7. RESULTADO
-- ============================================

SELECT '✅ BETA SEED COMPLETO!' as resultado;
SELECT COUNT(*) as usuarios_teste FROM users WHERE email LIKE '%@test.com';
SELECT COUNT(*) as vagas_beta FROM job_postings WHERE company_id = '00000001-0000-0000-0000-000000000001';
SELECT COUNT(*) as campanhas_beta FROM ad_campaigns WHERE company_id = '00000001-0000-0000-0000-000000000001';
