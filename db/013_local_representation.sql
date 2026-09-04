-- ============================================
-- REPRESENTAÇÃO LOCAL (FILIAIS E ENDEREÇOS)
-- ============================================

-- Estados e cidades (lookup tables)
CREATE TABLE IF NOT EXISTS states (
  id SERIAL PRIMARY KEY,
  code VARCHAR(2) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  region VARCHAR(20) NOT NULL -- 'norte', 'nordeste', 'centro-oeste', 'sudeste', 'sul'
);

CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  state_id INTEGER NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),
  UNIQUE(name, state_id)
);

-- Filiais e representações locais
CREATE TABLE IF NOT EXISTS local_offices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  city_id INTEGER NOT NULL REFERENCES cities(id),
  state_id INTEGER NOT NULL REFERENCES states(id),
  address VARCHAR(500),
  postal_code VARCHAR(10),
  phone VARCHAR(20),
  email VARCHAR(255),
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  website VARCHAR(255),
  latitude DECIMAL(9, 6),
  longitude DECIMAL(9, 6),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Representantes locais (contatos por região)
CREATE TABLE IF NOT EXISTS local_representatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  office_id UUID REFERENCES local_offices(id) ON DELETE SET NULL,
  city_id INTEGER NOT NULL REFERENCES cities(id),
  state_id INTEGER NOT NULL REFERENCES states(id),
  phone VARCHAR(20),
  expertise TEXT[], -- array de especialidades
  languages VARCHAR(50)[], -- idiomas
  commission_rate DECIMAL(5, 2) DEFAULT 15.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cobertura de talentos por região
CREATE TABLE IF NOT EXISTS talent_coverage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  representative_id UUID NOT NULL REFERENCES local_representatives(id) ON DELETE CASCADE,
  talent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  covered_since DATE DEFAULT CURRENT_DATE,
  UNIQUE(representative_id, talent_id)
);

-- Índices
CREATE INDEX idx_local_offices_organization_id ON local_offices(organization_id);
CREATE INDEX idx_local_offices_city_id ON local_offices(city_id);
CREATE INDEX idx_local_offices_state_id ON local_offices(state_id);
CREATE INDEX idx_local_representatives_organization_id ON local_representatives(organization_id);
CREATE INDEX idx_local_representatives_city_id ON local_representatives(city_id);
CREATE INDEX idx_local_representatives_state_id ON local_representatives(state_id);
CREATE INDEX idx_local_representatives_office_id ON local_representatives(office_id);
CREATE INDEX idx_talent_coverage_representative_id ON talent_coverage(representative_id);
CREATE INDEX idx_talent_coverage_talent_id ON talent_coverage(talent_id);
CREATE INDEX idx_cities_state_id ON cities(state_id);

-- View de representação por região
CREATE OR REPLACE VIEW regional_representation AS
SELECT
  lr.id,
  lr.user_id,
  u.name,
  u.email,
  lr.phone,
  s.code as state_code,
  s.name as state_name,
  s.region,
  c.name as city_name,
  lo.name as office_name,
  COUNT(tc.id) as talents_covered,
  lr.is_active,
  lr.created_at
FROM local_representatives lr
JOIN users u ON lr.user_id = u.id
JOIN states s ON lr.state_id = s.id
JOIN cities c ON lr.city_id = c.id
LEFT JOIN local_offices lo ON lr.office_id = lo.id
LEFT JOIN talent_coverage tc ON lr.id = tc.representative_id
GROUP BY lr.id, u.name, u.email, s.code, s.name, s.region, c.name, lo.name;

-- View de vagas por região
CREATE OR REPLACE VIEW jobs_by_region AS
SELECT
  j.id,
  j.title,
  j.description,
  s.code as state_code,
  s.name as state_name,
  s.region,
  c.name as city_name,
  COUNT(ja.id) as applications_count,
  j.created_at
FROM jobs j
JOIN cities c ON j.city_id = c.id
JOIN states s ON c.state_id = s.id
LEFT JOIN job_applications ja ON j.id = ja.job_id
GROUP BY j.id, j.title, j.description, s.code, s.name, s.region, c.name;

-- RLS
ALTER TABLE local_offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_representatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE talent_coverage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view offices in their org" ON local_offices
  FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = current_user_id()
  ));

CREATE POLICY "Org admins can manage offices" ON local_offices
  FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = current_user_id() AND role = 'admin'
  ));

CREATE POLICY "Users can view local representatives" ON local_representatives
  FOR SELECT
  USING (true);

CREATE POLICY "Users can view talent coverage" ON talent_coverage
  FOR SELECT
  USING (talent_id = current_user_id() OR representative_id IN (
    SELECT id FROM local_representatives WHERE user_id = current_user_id()
  ));

-- Grant
GRANT SELECT ON states TO psico360_app;
GRANT SELECT ON cities TO psico360_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON local_offices TO psico360_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON local_representatives TO psico360_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON talent_coverage TO psico360_app;
GRANT SELECT ON regional_representation TO psico360_app;
GRANT SELECT ON jobs_by_region TO psico360_app;

-- Seed: Estados brasileiros
INSERT INTO states (code, name, region) VALUES
  ('AC', 'Acre', 'norte'),
  ('AL', 'Alagoas', 'nordeste'),
  ('AP', 'Amapá', 'norte'),
  ('AM', 'Amazonas', 'norte'),
  ('BA', 'Bahia', 'nordeste'),
  ('CE', 'Ceará', 'nordeste'),
  ('DF', 'Distrito Federal', 'centro-oeste'),
  ('ES', 'Espírito Santo', 'sudeste'),
  ('GO', 'Goiás', 'centro-oeste'),
  ('MA', 'Maranhão', 'nordeste'),
  ('MT', 'Mato Grosso', 'centro-oeste'),
  ('MS', 'Mato Grosso do Sul', 'centro-oeste'),
  ('MG', 'Minas Gerais', 'sudeste'),
  ('PA', 'Pará', 'norte'),
  ('PB', 'Paraíba', 'nordeste'),
  ('PR', 'Paraná', 'sul'),
  ('PE', 'Pernambuco', 'nordeste'),
  ('PI', 'Piauí', 'nordeste'),
  ('RJ', 'Rio de Janeiro', 'sudeste'),
  ('RN', 'Rio Grande do Norte', 'nordeste'),
  ('RS', 'Rio Grande do Sul', 'sul'),
  ('RO', 'Rondônia', 'norte'),
  ('RR', 'Roraima', 'norte'),
  ('SC', 'Santa Catarina', 'sul'),
  ('SP', 'São Paulo', 'sudeste'),
  ('SE', 'Sergipe', 'nordeste'),
  ('TO', 'Tocantins', 'norte')
ON CONFLICT DO NOTHING;

-- Seed: Principais cidades
INSERT INTO cities (name, state_id, latitude, longitude) VALUES
  ('São Paulo', (SELECT id FROM states WHERE code = 'SP'), -23.5505, -46.6333),
  ('Rio de Janeiro', (SELECT id FROM states WHERE code = 'RJ'), -22.9068, -43.1729),
  ('Belo Horizonte', (SELECT id FROM states WHERE code = 'MG'), -19.9167, -43.9345),
  ('Brasília', (SELECT id FROM states WHERE code = 'DF'), -15.7942, -47.8822),
  ('Salvador', (SELECT id FROM states WHERE code = 'BA'), -12.9714, -38.5014),
  ('Fortaleza', (SELECT id FROM states WHERE code = 'CE'), -3.7319, -38.5267),
  ('Manaus', (SELECT id FROM states WHERE code = 'AM'), -3.1190, -60.0217),
  ('Curitiba', (SELECT id FROM states WHERE code = 'PR'), -25.4284, -49.2733),
  ('Recife', (SELECT id FROM states WHERE code = 'PE'), -8.0476, -34.8770),
  ('Porto Alegre', (SELECT id FROM states WHERE code = 'RS'), -30.0324, -51.2304)
ON CONFLICT DO NOTHING;
