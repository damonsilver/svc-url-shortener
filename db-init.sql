CREATE TABLE IF NOT EXISTS url_mappings(
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL UNIQUE,
  short_url_slug TEXT NOT NULL UNIQUE,
  load_count INTEGER NOT NULL DEFAULT 0,
  created_on TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_on TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_url_mappings_original_url ON url_mappings (original_url);
CREATE INDEX IF NOT EXISTS idx_url_mappings_short_url_slug ON url_mappings (short_url_slug);
