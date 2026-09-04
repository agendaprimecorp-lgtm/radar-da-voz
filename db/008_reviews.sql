-- ============================================
-- SISTEMA DE REVIEWS E RATINGS
-- ============================================

-- Tabela de reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewed_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  categories JSONB DEFAULT '{"communication":0,"professionalism":0,"quality":0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (reviewer_id != reviewed_id)
);

-- Índices
CREATE INDEX idx_reviews_reviewed_id ON reviews(reviewed_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE UNIQUE INDEX idx_reviews_unique ON reviews(reviewer_id, reviewed_id);

-- View para agregação de ratings
CREATE OR REPLACE VIEW reviews_summary AS
SELECT
  reviewed_id,
  COUNT(*) as total_reviews,
  ROUND(AVG(rating)::NUMERIC, 2) as avg_rating,
  MAX(rating) as max_rating,
  MIN(rating) as min_rating,
  ROUND(AVG((categories->>'communication')::INTEGER)::NUMERIC, 2) as avg_communication,
  ROUND(AVG((categories->>'professionalism')::INTEGER)::NUMERIC, 2) as avg_professionalism,
  ROUND(AVG((categories->>'quality')::INTEGER)::NUMERIC, 2) as avg_quality
FROM reviews
GROUP BY reviewed_id;

-- Tabela de helpful votes (útil/não útil)
CREATE TABLE IF NOT EXISTS review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, voter_id)
);

-- Índices
CREATE INDEX idx_review_votes_review_id ON review_votes(review_id);
CREATE INDEX idx_review_votes_voter_id ON review_votes(voter_id);

-- RLS para reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT
  WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Users can update their reviews" ON reviews
  FOR UPDATE
  USING (reviewer_id = auth.uid());

CREATE POLICY "Users can delete their reviews" ON reviews
  FOR DELETE
  USING (reviewer_id = auth.uid());

-- RLS para review_votes
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view votes" ON review_votes
  FOR SELECT
  USING (true);

CREATE POLICY "Users can vote on reviews" ON review_votes
  FOR INSERT
  WITH CHECK (voter_id = auth.uid());

CREATE POLICY "Users can update their votes" ON review_votes
  FOR UPDATE
  USING (voter_id = auth.uid());

CREATE POLICY "Users can delete their votes" ON review_votes
  FOR DELETE
  USING (voter_id = auth.uid());

-- Grant
GRANT SELECT, INSERT, UPDATE, DELETE ON reviews TO psico360_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON review_votes TO psico360_app;
GRANT SELECT ON reviews_summary TO psico360_app;
