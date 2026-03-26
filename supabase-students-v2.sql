-- Run this in Supabase SQL Editor to add extended biodata fields
ALTER TABLE students ADD COLUMN IF NOT EXISTS middle_name TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS religion TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS state_of_origin TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS lga TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS guardian_name TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS guardian_phone TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS guardian_relationship TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add subjects column to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS subjects JSONB DEFAULT '[]'::jsonb;
