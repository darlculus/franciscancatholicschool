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
