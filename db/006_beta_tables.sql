-- ============================================
-- TABELAS PARA BETA TESTING E FEEDBACK
-- ============================================

-- Tabela de feedback do beta
CREATE TABLE IF NOT EXISTS beta_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  message TEXT NOT NULL,
  category VARCHAR(50), -- 'bug', 'feature_request', 'ux', 'general'
  severity VARCHAR(20), -- 'critical', 'high', 'medium', 'low'
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'acknowledged', 'in_progress', 'resolved'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_beta_feedback_status ON beta_feedback(status);
CREATE INDEX idx_beta_feedback_created_at ON beta_feedback(created_at DESC);
CREATE INDEX idx_beta_feedback_severity ON beta_feedback(severity);

-- Tabela de testes executados
CREATE TABLE IF NOT EXISTS beta_test_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  test_name VARCHAR(255) NOT NULL,
  result VARCHAR(20), -- 'passed', 'failed', 'partial'
  notes TEXT,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_beta_test_runs_user_id ON beta_test_runs(user_id);
CREATE INDEX idx_beta_test_runs_executed_at ON beta_test_runs(executed_at DESC);

-- Tabela de rastreamento de issues
CREATE TABLE IF NOT EXISTS beta_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID REFERENCES beta_feedback(id) ON DELETE CASCADE,
  issue_type VARCHAR(50), -- 'bug', 'performance', 'ux', 'security'
  priority VARCHAR(20), -- 'critical', 'high', 'medium', 'low'
  assigned_to UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'open',
  resolution TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_beta_issues_status ON beta_issues(status);
CREATE INDEX idx_beta_issues_priority ON beta_issues(priority);
CREATE INDEX idx_beta_issues_assigned_to ON beta_issues(assigned_to);

-- Tabela de estatísticas de beta
CREATE TABLE IF NOT EXISTS beta_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE DEFAULT CURRENT_DATE,
  total_testers INTEGER DEFAULT 0,
  feedback_count INTEGER DEFAULT 0,
  bugs_reported INTEGER DEFAULT 0,
  bugs_resolved INTEGER DEFAULT 0,
  avg_session_duration INTEGER, -- em minutos
  feature_requests INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para beta_feedback
ALTER TABLE beta_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit beta feedback" ON beta_feedback
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view feedback" ON beta_feedback
  FOR SELECT
  USING (true); -- Para demo, em produção seria restritivo

-- RLS para beta_test_runs
ALTER TABLE beta_test_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their test runs" ON beta_test_runs
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Grant
GRANT SELECT, INSERT ON beta_feedback TO psico360_app;
GRANT SELECT, INSERT ON beta_test_runs TO psico360_app;
GRANT SELECT, INSERT, UPDATE ON beta_issues TO psico360_app;
GRANT SELECT, INSERT ON beta_stats TO psico360_app;
