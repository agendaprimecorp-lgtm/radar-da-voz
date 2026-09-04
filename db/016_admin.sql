-- ============================================
-- ADMIN PANEL E GERENCIAMENTO
-- ============================================

-- Permissões de admin
CREATE TABLE IF NOT EXISTS admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  is_super_admin BOOLEAN DEFAULT FALSE,
  can_manage_users BOOLEAN DEFAULT FALSE,
  can_manage_organizations BOOLEAN DEFAULT FALSE,
  can_manage_content BOOLEAN DEFAULT FALSE,
  can_view_analytics BOOLEAN DEFAULT FALSE,
  can_manage_payments BOOLEAN DEFAULT FALSE,
  can_manage_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Logs de ação de admin
CREATE TABLE IF NOT EXISTS admin_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL, -- 'user_created', 'user_banned', 'content_removed', etc
  target_id UUID,
  target_type VARCHAR(50), -- 'user', 'organization', 'job', etc
  description TEXT,
  changes JSONB, -- Mudanças feitas
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Denúncias e moderação
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL,
  target_type VARCHAR(50) NOT NULL, -- 'user', 'job', 'campaign'
  reason VARCHAR(255) NOT NULL, -- 'spam', 'harassment', 'inappropriate', etc
  description TEXT,
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'dismissed'
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  resolution TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurações globais
CREATE TABLE IF NOT EXISTS system_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_admin_permissions_user_id ON admin_permissions(user_id);
CREATE INDEX idx_admin_action_logs_admin_id ON admin_action_logs(admin_id);
CREATE INDEX idx_admin_action_logs_created_at ON admin_action_logs(created_at DESC);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_system_settings_key ON system_settings(setting_key);

-- View de estatísticas do sistema
CREATE OR REPLACE VIEW admin_system_stats AS
SELECT
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM organizations) as total_organizations,
  (SELECT COUNT(*) FROM jobs WHERE status = 'open') as open_jobs,
  (SELECT COUNT(*) FROM jobs WHERE status = 'filled') as filled_jobs,
  (SELECT COUNT(*) FROM job_applications) as total_applications,
  (SELECT COUNT(*) FROM contracts WHERE status = 'signed') as signed_contracts,
  (SELECT COUNT(*) FROM reports WHERE status = 'open') as open_reports,
  (SELECT SUM(amount) FROM invoices WHERE status = 'paid') as revenue_total,
  NOW() as last_updated;

-- RLS
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only super admins can view permissions" ON admin_permissions
  FOR SELECT
  USING (user_id = current_user_id());

CREATE POLICY "Only admins can view action logs" ON admin_action_logs
  FOR SELECT
  USING (admin_id = current_user_id() OR
    admin_id IN (SELECT user_id FROM admin_permissions WHERE is_super_admin = TRUE));

CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT
  USING (reporter_id = current_user_id());

CREATE POLICY "Only admins can view all reports" ON reports
  FOR SELECT
  USING (admin_id IN (SELECT user_id FROM admin_permissions WHERE can_manage_content = TRUE))
  TO psico360_app;

-- Grant
GRANT SELECT, INSERT, UPDATE ON admin_permissions TO psico360_app;
GRANT SELECT, INSERT ON admin_action_logs TO psico360_app;
GRANT SELECT, INSERT, UPDATE ON reports TO psico360_app;
GRANT SELECT, INSERT, UPDATE ON system_settings TO psico360_app;
GRANT SELECT ON admin_system_stats TO psico360_app;

-- Settings padrão
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('commission_rate', '{"talent": 20, "employer": 5}', 'Porcentagem de comissão por tipo'),
('max_free_job_postings', '{"limit": 3, "renewal_days": 30}', 'Limite de vagas gratuitas'),
('maintenance_mode', '{"enabled": false, "message": ""}', 'Modo manutenção'),
('email_notifications_enabled', '{"enabled": true}', 'Notificações por email habilitadas'),
('daily_backup_enabled', '{"enabled": true, "time": "02:00"}', 'Backup diário automático')
ON CONFLICT DO NOTHING;
