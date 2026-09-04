-- ============================================
-- CONTRATOS E ASSINATURA DIGITAL
-- ============================================

-- Tipos de contrato
CREATE TABLE IF NOT EXISTS contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_html TEXT NOT NULL,
  variables VARCHAR(255)[], -- variáveis do template {name}, {email}, etc
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contratos
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES contract_templates(id) ON DELETE RESTRICT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  parties_json JSONB NOT NULL, -- {initiator: {}, counterparty: {}}
  content TEXT NOT NULL, -- conteúdo gerado
  variables JSONB, -- valores das variáveis
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'pending', 'signed', 'declined', 'expired'
  initiator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  counterparty_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  due_date DATE,
  signed_date TIMESTAMP WITH TIME ZONE,
  declined_date TIMESTAMP WITH TIME ZONE,
  declined_reason TEXT,
  pdf_url VARCHAR(500),
  docusign_envelope_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assinaturas digitais
CREATE TABLE IF NOT EXISTS contract_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  signer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  signature_data TEXT, -- Base64 encoded signature
  signed_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  timestamp_token VARCHAR(500), -- Certificado de timestamp
  certificate VARCHAR(500), -- Certificado digital
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'signed', 'declined'
  declined_reason TEXT
);

-- Eventos e auditoria de contrato
CREATE TABLE IF NOT EXISTS contract_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL, -- 'created', 'sent', 'viewed', 'signed', 'declined', 'expired'
  event_data JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_contracts_organization_id ON contracts(organization_id);
CREATE INDEX idx_contracts_initiator_id ON contracts(initiator_id);
CREATE INDEX idx_contracts_counterparty_id ON contracts(counterparty_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_created_at ON contracts(created_at DESC);
CREATE INDEX idx_contract_signatures_contract_id ON contract_signatures(contract_id);
CREATE INDEX idx_contract_signatures_signer_id ON contract_signatures(signer_id);
CREATE INDEX idx_contract_audit_logs_contract_id ON contract_audit_logs(contract_id);
CREATE INDEX idx_contract_audit_logs_created_at ON contract_audit_logs(created_at DESC);

-- View de status de contrato
CREATE OR REPLACE VIEW contract_status_view AS
SELECT
  c.id,
  c.title,
  c.status,
  c.initiator_id,
  COALESCE(u1.name, 'Unknown') as initiator_name,
  c.counterparty_id,
  COALESCE(u2.name, 'Unknown') as counterparty_name,
  COUNT(CASE WHEN cs.status = 'signed' THEN 1 END) as signed_count,
  COUNT(CASE WHEN cs.status = 'pending' THEN 1 END) as pending_count,
  c.created_at,
  c.due_date,
  c.signed_date
FROM contracts c
LEFT JOIN users u1 ON c.initiator_id = u1.id
LEFT JOIN users u2 ON c.counterparty_id = u2.id
LEFT JOIN contract_signatures cs ON c.id = cs.contract_id
GROUP BY c.id, u1.name, u2.name;

-- RLS
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view contracts they are part of" ON contracts
  FOR SELECT
  USING (
    initiator_id = current_user_id() OR
    counterparty_id = current_user_id() OR
    organization_id IN (SELECT organization_id FROM users WHERE id = current_user_id())
  );

CREATE POLICY "Users can view signatures on contracts they are part of" ON contract_signatures
  FOR SELECT
  USING (
    contract_id IN (
      SELECT id FROM contracts WHERE
      initiator_id = current_user_id() OR
      counterparty_id = current_user_id()
    )
  );

CREATE POLICY "Users can view audit logs for their contracts" ON contract_audit_logs
  FOR SELECT
  USING (
    contract_id IN (
      SELECT id FROM contracts WHERE
      initiator_id = current_user_id() OR
      counterparty_id = current_user_id()
    )
  );

-- Grant
GRANT SELECT ON contract_templates TO psico360_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON contracts TO psico360_app;
GRANT SELECT, INSERT ON contract_signatures TO psico360_app;
GRANT SELECT, INSERT ON contract_audit_logs TO psico360_app;
GRANT SELECT ON contract_status_view TO psico360_app;

-- Templates padrão
INSERT INTO contract_templates (name, description, template_html, variables) VALUES
(
  'Contrato de Trabalho Freelancer',
  'Template padrão para contrato de trabalho freelancer',
  '<h1>CONTRATO DE TRABALHO FREELANCER</h1>
   <p>Entre {initiator_name} e {counterparty_name}</p>
   <p><strong>Escopo:</strong> {scope}</p>
   <p><strong>Valor:</strong> R$ {value}</p>
   <p><strong>Prazo:</strong> {deadline}</p>
   <p><strong>Condições:</strong> {conditions}</p>',
  ARRAY[''initiator_name'', ''counterparty_name'', ''scope'', ''value'', ''deadline'', ''conditions'']
)
ON CONFLICT DO NOTHING;
