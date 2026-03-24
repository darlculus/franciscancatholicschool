-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add missing columns to teachers table if they don't exist
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

-- Insert default bursar account
-- Password: bursar123 (hashed with bcrypt)
INSERT INTO users (username, password, full_name, role, email)
VALUES (
  'bursar',
  '$2b$10$rQ8K5O.V8vHxGxH5vxHxHOqK5O.V8vHxGxH5vxHxHOqK5O.V8vHxG',
  'Sr. Clare Ohagwa, OSF',
  'bursar',
  'bursar@franciscan.edu'
)
ON CONFLICT (username) DO NOTHING;
