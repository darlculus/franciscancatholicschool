-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS students (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admission_number TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
  date_of_birth DATE,
  class_key TEXT NOT NULL,
  class_name TEXT NOT NULL,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  parent_name TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  address TEXT,
  medical_conditions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate admission numbers: FCS/2025/001 etc.
CREATE SEQUENCE IF NOT EXISTS admission_seq START 1;

CREATE OR REPLACE FUNCTION set_admission_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.admission_number IS NULL THEN
    NEW.admission_number := 'FCNPS/25/26/' || LPAD(nextval('admission_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_admission_number ON students;
CREATE TRIGGER trigger_admission_number
  BEFORE INSERT ON students
  FOR EACH ROW EXECUTE FUNCTION set_admission_number();
