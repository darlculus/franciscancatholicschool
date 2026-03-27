-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  recipient TEXT NOT NULL,  -- 'all-students', a class_key, or an admission_number
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);
