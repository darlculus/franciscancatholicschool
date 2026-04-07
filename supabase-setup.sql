-- ============================================================
-- Run this entire script in the Supabase SQL Editor
-- ============================================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── Default portal accounts ──────────────────────────────────────────────────
-- Bursar  →  username: bursar       password: bursar123
INSERT INTO users (username, password, full_name, role, email)
VALUES (
  'bursar',
  '$2b$10$66L1w2XV.907zfgabDXgfeFokR3QhJJazj569goZMqm6nFegfDA9G',
  'Sr. Clare Ohagwa, OSF',
  'bursar',
  'bursar@franciscancnps.org'
) ON CONFLICT (username) DO UPDATE
  SET password  = EXCLUDED.password,
      full_name = EXCLUDED.full_name,
      role      = EXCLUDED.role;

-- Head Teacher / Admin  →  username: admin       password: admin123
INSERT INTO users (username, password, full_name, role, email)
VALUES (
  'admin',
  '$2b$10$seNg5OMJPmTDulIZSH/zyeRvwYiGuTkuLTQPFEiE0oFUUsZ/LHxd6',
  'Rev. Sr. Victoria Ogunwande OSF',
  'headteacher',
  'admin@franciscancnps.org'
) ON CONFLICT (username) DO UPDATE
  SET password  = EXCLUDED.password,
      full_name = EXCLUDED.full_name,
      role      = EXCLUDED.role;

-- ── Teachers table columns (run once) ────────────────────────────────────────
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS assigned_class TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'teacher';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS join_date DATE;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS dob DATE;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS experience TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS employment_type TEXT DEFAULT 'full-time';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS profile_color TEXT DEFAULT '#4CAF50';
