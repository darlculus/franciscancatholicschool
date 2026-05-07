-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS school_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default current term
INSERT INTO school_settings (key, value)
VALUES ('current_term', '2nd Term'), ('current_session', '2025/2026')
ON CONFLICT (key) DO NOTHING;
