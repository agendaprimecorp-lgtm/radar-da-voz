-- ============================================
-- NOTIFICAÇÕES (EMAIL + PUSH)
-- ============================================

-- Preferências de notificação do usuário
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  email_new_applications BOOLEAN DEFAULT TRUE,
  email_new_messages BOOLEAN DEFAULT TRUE,
  email_new_opportunities BOOLEAN DEFAULT TRUE,
  email_marketing BOOLEAN DEFAULT FALSE,
  email_weekly_digest BOOLEAN DEFAULT TRUE,
  push_new_applications BOOLEAN DEFAULT TRUE,
  push_new_messages BOOLEAN DEFAULT TRUE,
  push_new_opportunities BOOLEAN DEFAULT TRUE,
  push_marketing BOOLEAN DEFAULT FALSE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  notification_frequency VARCHAR(20) DEFAULT 'instant', -- 'instant', 'daily', 'weekly'
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Push notification tokens (OneSignal)
CREATE TABLE IF NOT EXISTS push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  device_type VARCHAR(20) NOT NULL, -- 'web', 'ios', 'android'
  device_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Histórico de notificações
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL, -- 'new_application', 'new_message', 'new_opportunity', 'new_review'
  channel VARCHAR(20) NOT NULL, -- 'email', 'push', 'sms'
  subject VARCHAR(255),
  content TEXT,
  recipient VARCHAR(255), -- email, phone, push token
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'read'
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);
CREATE INDEX idx_push_tokens_user_id ON push_tokens(user_id);
CREATE INDEX idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX idx_notification_logs_created_at ON notification_logs(created_at DESC);
CREATE INDEX idx_notification_logs_status ON notification_logs(status);

-- RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" ON notification_preferences
  FOR SELECT
  USING (user_id = current_user_id());

CREATE POLICY "Users can update own preferences" ON notification_preferences
  FOR UPDATE
  USING (user_id = current_user_id());

CREATE POLICY "Users can view own push tokens" ON push_tokens
  FOR SELECT
  USING (user_id = current_user_id());

CREATE POLICY "Users can view own notification logs" ON notification_logs
  FOR SELECT
  USING (user_id = current_user_id());

-- Grant
GRANT SELECT, INSERT, UPDATE ON notification_preferences TO psico360_app;
GRANT SELECT, INSERT, UPDATE ON push_tokens TO psico360_app;
GRANT SELECT, INSERT ON notification_logs TO psico360_app;
