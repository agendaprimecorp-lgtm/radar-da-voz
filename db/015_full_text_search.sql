-- ============================================
-- FULL-TEXT SEARCH
-- ============================================

-- Tabela de índices de busca (para performance)
CREATE TABLE IF NOT EXISTS search_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL, -- 'talent', 'job', 'campaign'
  entity_id UUID NOT NULL,
  title VARCHAR(255),
  content TEXT,
  searchable_text TSVECTOR, -- Vector para full-text search
  metadata JSONB, -- Filtros facet {specialty, city, rating, etc}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(entity_type, entity_id)
);

-- Índices de full-text search
CREATE INDEX idx_search_index_searchable_text ON search_index USING GIN(searchable_text);
CREATE INDEX idx_search_index_entity ON search_index(entity_type, entity_id);
CREATE INDEX idx_search_index_metadata ON search_index USING GIN(metadata);
CREATE INDEX idx_search_index_created_at ON search_index(created_at DESC);

-- Função para gerar vector de busca (português)
CREATE OR REPLACE FUNCTION generate_search_vector(title TEXT, content TEXT) RETURNS TSVECTOR AS $$
BEGIN
  RETURN to_tsvector('portuguese', COALESCE(title, '') || ' ' || COALESCE(content, ''));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger para atualizar search_index quando talentos são criados/atualizados
CREATE OR REPLACE FUNCTION update_talent_search_index() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO search_index (entity_type, entity_id, title, content, searchable_text, metadata)
  VALUES (
    'talent',
    NEW.id,
    NEW.name,
    NEW.bio || ' ' || COALESCE(NEW.specialty, ''),
    generate_search_vector(NEW.name, NEW.bio || ' ' || COALESCE(NEW.specialty, '')),
    jsonb_build_object(
      'specialty', NEW.specialty,
      'city', NEW.city,
      'state', NEW.state,
      'rating', NEW.rating,
      'reviews', NEW.reviews_count
    )
  )
  ON CONFLICT (entity_type, entity_id)
  DO UPDATE SET
    title = NEW.name,
    content = NEW.bio || ' ' || COALESCE(NEW.specialty, ''),
    searchable_text = generate_search_vector(NEW.name, NEW.bio || ' ' || COALESCE(NEW.specialty, '')),
    metadata = jsonb_build_object(
      'specialty', NEW.specialty,
      'city', NEW.city,
      'state', NEW.state,
      'rating', NEW.rating,
      'reviews', NEW.reviews_count
    ),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER talent_search_index_trigger AFTER INSERT OR UPDATE ON talents
FOR EACH ROW EXECUTE FUNCTION update_talent_search_index();

-- Trigger para vagas
CREATE OR REPLACE FUNCTION update_job_search_index() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO search_index (entity_type, entity_id, title, content, searchable_text, metadata)
  VALUES (
    'job',
    NEW.id,
    NEW.title,
    NEW.description,
    generate_search_vector(NEW.title, NEW.description),
    jsonb_build_object(
      'specialty', NEW.specialty,
      'city', NEW.city,
      'state', NEW.state,
      'salary', NEW.salary,
      'status', NEW.status
    )
  )
  ON CONFLICT (entity_type, entity_id)
  DO UPDATE SET
    title = NEW.title,
    content = NEW.description,
    searchable_text = generate_search_vector(NEW.title, NEW.description),
    metadata = jsonb_build_object(
      'specialty', NEW.specialty,
      'city', NEW.city,
      'state', NEW.state,
      'salary', NEW.salary,
      'status', NEW.status
    ),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER job_search_index_trigger AFTER INSERT OR UPDATE ON jobs
FOR EACH ROW EXECUTE FUNCTION update_job_search_index();

-- View de facets (para filtros)
CREATE OR REPLACE VIEW search_facets AS
SELECT
  'specialty' as facet_type,
  metadata->>'specialty' as facet_value,
  COUNT(*) as count
FROM search_index
WHERE metadata->>'specialty' IS NOT NULL
GROUP BY metadata->>'specialty'
UNION ALL
SELECT
  'city' as facet_type,
  metadata->>'city' as facet_value,
  COUNT(*) as count
FROM search_index
WHERE metadata->>'city' IS NOT NULL
GROUP BY metadata->>'city'
UNION ALL
SELECT
  'status' as facet_type,
  metadata->>'status' as facet_value,
  COUNT(*) as count
FROM search_index
WHERE metadata->>'status' IS NOT NULL
GROUP BY metadata->>'status';

-- Função de busca com ranking e filtros
CREATE OR REPLACE FUNCTION search_full_text(
  query TEXT,
  entity_type_filter VARCHAR DEFAULT NULL,
  specialty_filter VARCHAR DEFAULT NULL,
  city_filter VARCHAR DEFAULT NULL,
  min_rating FLOAT DEFAULT 0,
  limit_results INT DEFAULT 20,
  offset_results INT DEFAULT 0
) RETURNS TABLE (
  id UUID,
  entity_type VARCHAR,
  title VARCHAR,
  content TEXT,
  metadata JSONB,
  rank FLOAT
) AS $$
DECLARE
  search_query TSQUERY;
BEGIN
  -- Converter query em TSQUERY
  search_query := plainto_tsquery('portuguese', query);

  RETURN QUERY
  SELECT
    si.id,
    si.entity_type,
    si.title,
    si.content,
    si.metadata,
    ts_rank(si.searchable_text, search_query) as rank
  FROM search_index si
  WHERE
    si.searchable_text @@ search_query
    AND (entity_type_filter IS NULL OR si.entity_type = entity_type_filter)
    AND (specialty_filter IS NULL OR si.metadata->>'specialty' = specialty_filter)
    AND (city_filter IS NULL OR si.metadata->>'city' = city_filter)
    AND COALESCE((si.metadata->>'rating')::FLOAT, 0) >= min_rating
  ORDER BY rank DESC
  LIMIT limit_results
  OFFSET offset_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- RLS
ALTER TABLE search_index ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can search" ON search_index
  FOR SELECT
  USING (true);

-- Grant
GRANT SELECT ON search_index TO psico360_app;
GRANT SELECT ON search_facets TO psico360_app;
GRANT EXECUTE ON FUNCTION search_full_text TO psico360_app;
