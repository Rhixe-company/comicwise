-- ═══════════════════════════════════════════════════════════════════════════
-- SEARCH OPTIMIZATION MIGRATIONS
-- PostgreSQL Full-Text Search & Indexes
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ═══════════════════════════════════════════════════════════════════════════
-- FULL-TEXT SEARCH COLUMNS & INDEXES
-- ═══════════════════════════════════════════════════════════════════════════

-- Add search columns to comics table
ALTER TABLE comics
ADD COLUMN IF NOT EXISTS search_vector tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'B')
) STORED;

-- Create GIN index for full-text search on comics
CREATE INDEX IF NOT EXISTS idx_comics_search_vector
ON comics USING GIN(search_vector);

-- Create trigram index for fuzzy matching (like % queries)
CREATE INDEX IF NOT EXISTS idx_comics_title_trigram
ON comics USING GIN(title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_comics_description_trigram
ON comics USING GIN(description gin_trgm_ops);

-- ═══════════════════════════════════════════════════════════════════════════
-- PERFORMANCE INDEXES
-- ═══════════════════════════════════════════════════════════════════════════

-- Index for published status (common filter)
CREATE INDEX IF NOT EXISTS idx_comics_published
ON comics(published)
WHERE published = true;

-- Index for author lookups
CREATE INDEX IF NOT EXISTS idx_comics_author_id
ON comics(authorId)
WHERE published = true;

-- Index for slug lookups (URL-friendly unique identifier)
CREATE INDEX IF NOT EXISTS idx_comics_slug
ON comics(slug)
WHERE published = true;

-- Index for creation date (sorting/filtering)
CREATE INDEX IF NOT EXISTS idx_comics_created_at
ON comics(createdAt DESC);

-- ═══════════════════════════════════════════════════════════════════════════
-- SEARCH SUGGESTIONS TABLE
-- ═══════════════════════════════════════════════════════════════════════════

-- Create table for search suggestions/autocomplete
CREATE TABLE IF NOT EXISTS search_suggestions (
  id SERIAL PRIMARY KEY,
  term VARCHAR(255) NOT NULL UNIQUE,
  frequency INTEGER DEFAULT 1,
  trending BOOLEAN DEFAULT false,
  last_searched TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_search_suggestions_frequency
ON search_suggestions(frequency DESC);

CREATE INDEX IF NOT EXISTS idx_search_suggestions_trending
ON search_suggestions(trending)
WHERE trending = true;

CREATE INDEX IF NOT EXISTS idx_search_suggestions_term
ON search_suggestions USING GIN(term gin_trgm_ops);

-- ═══════════════════════════════════════════════════════════════════════════
-- SEARCH ANALYTICS TABLE
-- ═══════════════════════════════════════════════════════════════════════════

-- Create table for search analytics
CREATE TABLE IF NOT EXISTS search_analytics (
  id BIGSERIAL PRIMARY KEY,
  search_query VARCHAR(255) NOT NULL,
  result_count INTEGER,
  user_id TEXT REFERENCES "user"(id) ON DELETE SET NULL,
  ip_hash VARCHAR(64),
  user_agent VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for recent analytics
CREATE INDEX IF NOT EXISTS idx_search_analytics_created_at
ON search_analytics(created_at DESC);

-- Create index for query frequency analysis
CREATE INDEX IF NOT EXISTS idx_search_analytics_query_count
ON search_analytics(search_query, created_at DESC);

-- ═══════════════════════════════════════════════════════════════════════════
-- VIEWS FOR ANALYTICS
-- ═══════════════════════════════════════════════════════════════════════════

-- View for popular searches
CREATE OR REPLACE VIEW popular_searches AS
SELECT
  search_query,
  COUNT(*) as frequency,
  COUNT(DISTINCT user_id) as unique_users,
  MAX(created_at) as last_searched
FROM search_analytics
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY search_query
ORDER BY frequency DESC
LIMIT 100;

-- ═══════════════════════════════════════════════════════════════════════════
-- FUNCTIONS FOR SEARCH OPTIMIZATION
-- ═══════════════════════════════════════════════════════════════════════════

-- Function to update search suggestions
CREATE OR REPLACE FUNCTION update_search_suggestions(p_term VARCHAR)
RETURNS void AS $$
BEGIN
  INSERT INTO search_suggestions (term, frequency, last_searched)
  VALUES (p_term, 1, CURRENT_TIMESTAMP)
  ON CONFLICT (term)
  DO UPDATE SET
    frequency = frequency + 1,
    last_searched = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════════════════════════════════════════════════════════
-- MAINTENANCE & OPTIMIZATION
-- ═══════════════════════════════════════════════════════════════════════════

-- Analyze tables for query planning
ANALYZE comics;
ANALYZE search_suggestions;
ANALYZE search_analytics;

-- Note: Run VACUUM ANALYZE periodically for best performance
-- VACUUM ANALYZE comics;
-- VACUUM ANALYZE search_suggestions;
-- VACUUM ANALYZE search_analytics;
