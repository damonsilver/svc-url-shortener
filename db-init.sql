CREATE TABLE IF NOT EXISTS url_mappings(
  id SERIAL PRIMARY KEY,
  -- The check helps protect the data layer from garbage getting in.
  original_url TEXT NOT NULL UNIQUE CHECK (original_url SIMILAR TO '^https?:\/\/%'),
  short_url TEXT NOT NULL UNIQUE,
  load_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_url_mappings_original_url ON url_mappings (original_url);
CREATE INDEX IF NOT EXISTS idx_url_mappings_short_url ON url_mappings (short_url);
