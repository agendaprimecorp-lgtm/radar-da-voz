-- ============================================
-- MONITORAMENTO E OBSERVABILIDADE
-- ============================================

-- Tabela de logs de erro
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  stack_trace TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  endpoint VARCHAR(255),
  status_code INTEGER,
  severity VARCHAR(20) DEFAULT 'error', -- 'warning', 'error', 'critical'
  environment VARCHAR(20) DEFAULT 'production', -- 'production', 'staging', 'development'
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX idx_error_logs_severity ON error_logs(severity);
CREATE INDEX idx_error_logs_error_type ON error_logs(error_type);
CREATE INDEX idx_error_logs_endpoint ON error_logs(endpoint);

-- Tabela de logs de performance
CREATE TABLE IF NOT EXISTS performance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL, -- GET, POST, PUT, DELETE
  response_time_ms INTEGER NOT NULL,
  status_code INTEGER NOT NULL,
  user_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_performance_logs_endpoint ON performance_logs(endpoint);
CREATE INDEX idx_performance_logs_created_at ON performance_logs(created_at DESC);

-- View de alertas pendentes
CREATE OR REPLACE VIEW pending_alerts AS
SELECT
  id,
  error_type,
  message,
  severity,
  endpoint,
  created_at,
  EXTRACT(EPOCH FROM (NOW() - created_at)) / 60 as minutes_ago
FROM error_logs
WHERE resolved_at IS NULL
  AND severity IN ('error', 'critical')
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY severity DESC, created_at DESC;

-- View de status de saúde
CREATE OR REPLACE VIEW system_health_status AS
SELECT
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour') as errors_last_hour,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as errors_last_24h,
  COUNT(*) FILTER (WHERE severity = 'critical') as critical_errors,
  ROUND(AVG(response_time_ms)::NUMERIC, 2) as avg_response_time,
  MAX(response_time_ms) as max_response_time,
  MIN(response_time_ms) as min_response_time,
  ROUND(
    COUNT(*) FILTER (WHERE status_code >= 500)::NUMERIC /
    NULLIF(COUNT(*), 0) * 100,
    2
  ) as error_rate_percent
FROM (
  SELECT response_time_ms, status_code FROM performance_logs WHERE created_at > NOW() - INTERVAL '24 hours'
) perf
CROSS JOIN (SELECT severity, created_at FROM error_logs WHERE created_at > NOW() - INTERVAL '24 hours') err;

-- RLS
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view error logs" ON error_logs
  FOR SELECT
  USING (true); -- TODO: adicionar verificação de admin

-- Grant
GRANT SELECT, INSERT ON error_logs TO psico360_app;
GRANT SELECT, INSERT ON performance_logs TO psico360_app;
GRANT SELECT ON pending_alerts TO psico360_app;
GRANT SELECT ON system_health_status TO psico360_app;
