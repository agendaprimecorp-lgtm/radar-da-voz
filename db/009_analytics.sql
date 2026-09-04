-- ============================================
-- ANALYTICS E INSIGHTS
-- ============================================

-- Tabela de eventos para tracking
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL, -- 'page_view', 'login', 'signup', 'talent_view', 'job_apply', 'campaign_submit'
  event_data JSONB,
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);

-- Tabela de métricas diárias (pré-agregadas)
CREATE TABLE IF NOT EXISTS daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  active_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  job_postings INTEGER DEFAULT 0,
  job_applications INTEGER DEFAULT 0,
  campaigns_created INTEGER DEFAULT 0,
  campaign_submissions INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  reviews_created INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para queries por data
CREATE INDEX idx_daily_metrics_date ON daily_metrics(date DESC);

-- View de métricas últimos 30 dias
CREATE OR REPLACE VIEW metrics_30d AS
SELECT
  SUM(active_users) as total_active_users,
  SUM(new_users) as total_new_users,
  SUM(page_views) as total_page_views,
  SUM(job_postings) as total_job_postings,
  SUM(job_applications) as total_job_applications,
  SUM(campaigns_created) as total_campaigns,
  SUM(campaign_submissions) as total_submissions,
  SUM(messages_sent) as total_messages,
  SUM(reviews_created) as total_reviews,
  SUM(revenue)::DECIMAL(10,2) as total_revenue,
  ROUND(SUM(revenue)::NUMERIC / NULLIF(SUM(job_applications), 0), 2) as avg_revenue_per_application,
  ROUND(SUM(campaign_submissions)::NUMERIC / NULLIF(SUM(campaigns_created), 0), 2) as avg_submissions_per_campaign,
  COUNT(*) as days
FROM daily_metrics
WHERE date >= CURRENT_DATE - INTERVAL '30 days';

-- View de tendência diária
CREATE OR REPLACE VIEW daily_trend AS
SELECT
  date,
  active_users,
  new_users,
  job_applications,
  campaign_submissions,
  revenue,
  ROUND(AVG(active_users) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)::NUMERIC, 0) as avg_active_users_7d
FROM daily_metrics
WHERE date >= CURRENT_DATE - INTERVAL '90 days'
ORDER BY date DESC;

-- Função para log de eventos
CREATE OR REPLACE FUNCTION log_analytics_event(
  p_user_id UUID,
  p_event_type VARCHAR,
  p_event_data JSONB DEFAULT NULL,
  p_session_id VARCHAR DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO analytics_events (user_id, event_type, event_data, session_id, ip_address, user_agent)
  VALUES (p_user_id, p_event_type, p_event_data, p_session_id, p_ip_address, p_user_agent)
  RETURNING id INTO v_event_id;

  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;

-- RLS (analytics é read-only para app role)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

-- Grant (read-only para app)
GRANT SELECT ON analytics_events TO psico360_app;
GRANT SELECT ON daily_metrics TO psico360_app;
GRANT SELECT ON metrics_30d TO psico360_app;
GRANT SELECT ON daily_trend TO psico360_app;
GRANT EXECUTE ON FUNCTION log_analytics_event TO psico360_app;
