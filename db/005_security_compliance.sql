-- ============================================
-- SEGURANÇA E COMPLIANCE (LGPD)
-- ============================================

-- Tabela de log de auditoria
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para queries de auditoria
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp DESC);
CREATE INDEX idx_audit_log_action ON audit_log(action);

-- Tabela de consentimento LGPD
CREATE TABLE IF NOT EXISTS lgpd_consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consent_type VARCHAR(50) NOT NULL, -- 'marketing', 'analytics', 'profiling'
  granted BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  UNIQUE(user_id, consent_type)
);

-- Índice para queries de consentimento
CREATE INDEX idx_lgpd_consent_user_id ON lgpd_consent(user_id);
CREATE INDEX idx_lgpd_consent_type ON lgpd_consent(consent_type);

-- Tabela de data deletion requests (direito ao esquecimento)
CREATE TABLE IF NOT EXISTS deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
  reason TEXT
);

-- Índice para deletions
CREATE INDEX idx_deletion_requests_user_id ON deletion_requests(user_id);
CREATE INDEX idx_deletion_requests_status ON deletion_requests(status);

-- Atualizar tabela users com flag de deleção
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;

-- RLS para audit_log (usuários só veem seu próprio log)
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs" ON audit_log
  FOR SELECT
  USING (user_id = auth.uid());

-- RLS para lgpd_consent
ALTER TABLE lgpd_consent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own consent" ON lgpd_consent
  FOR ALL
  USING (user_id = auth.uid());

-- RLS para deletion_requests
ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own deletion requests" ON deletion_requests
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create deletion requests" ON deletion_requests
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Trigger para log automático de deletions
CREATE OR REPLACE FUNCTION log_user_deletion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_deleted = TRUE AND OLD.is_deleted = FALSE THEN
    INSERT INTO deletion_requests (user_id, status)
    VALUES (NEW.id, 'completed');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_deletion ON users;
CREATE TRIGGER trigger_log_deletion
AFTER UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION log_user_deletion();

-- Grant para psico360_app (aplicação)
GRANT SELECT, INSERT ON audit_log TO psico360_app;
GRANT SELECT, INSERT, UPDATE ON lgpd_consent TO psico360_app;
GRANT SELECT, INSERT ON deletion_requests TO psico360_app;
