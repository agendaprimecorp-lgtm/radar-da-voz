-- ============================================
-- SISTEMA DE SUBSCRIPTIONS E BILLING
-- ============================================

-- Enum de planos
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');

-- Tabela de planos
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  plan_type subscription_plan NOT NULL UNIQUE,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_annual DECIMAL(10,2),
  trial_days INTEGER DEFAULT 0,
  max_job_postings INTEGER DEFAULT 5,
  max_campaigns INTEGER DEFAULT 3,
  max_storage_gb INTEGER DEFAULT 1,
  features JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status subscription_status DEFAULT 'trialing',
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  billing_cycle VARCHAR(10) DEFAULT 'monthly', -- 'monthly' ou 'annual'
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- Tabela de invoices (faturas)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  stripe_invoice_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'open', 'paid', 'void', 'uncollectible'
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_invoices_subscription_id ON invoices(subscription_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_stripe_id ON invoices(stripe_invoice_id);

-- RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view plans" ON plans
  FOR SELECT
  USING (true);

CREATE POLICY "Users can view their subscription" ON subscriptions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their invoices" ON invoices
  FOR SELECT
  USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE user_id = auth.uid()
    )
  );

-- Insert planos padrão
INSERT INTO plans (name, plan_type, description, price_monthly, price_annual, trial_days, max_job_postings, max_campaigns, max_storage_gb, features) VALUES
  ('Gratuito', 'free', 'Comece grátis', 0, NULL, 0, 5, 3, 1, '["discover_talents", "view_reviews", "basic_analytics"]'),
  ('Profissional', 'pro', 'Para profissionais sérios', 29.90, 299.00, 7, 30, 20, 10, '["unlimited_jobs", "campaigns", "priority_support", "advanced_analytics", "custom_branding"]'),
  ('Empresarial', 'enterprise', 'Solução completa', NULL, NULL, 14, -1, -1, 100, '["everything", "dedicated_support", "api_access", "white_label", "sso"]')
ON CONFLICT (plan_type) DO NOTHING;

-- Grant
GRANT SELECT ON plans TO psico360_app;
GRANT SELECT, INSERT, UPDATE ON subscriptions TO psico360_app;
GRANT SELECT, INSERT ON invoices TO psico360_app;
