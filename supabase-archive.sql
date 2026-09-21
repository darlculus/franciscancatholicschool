-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS student_results_archive (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  term TEXT NOT NULL,
  session TEXT NOT NULL,
  class_key TEXT,
  class_name TEXT,
  result JSONB,
  mid_result JSONB,
  archived_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, term, session)
);
