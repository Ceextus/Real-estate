-- ============================================
-- Run this in Supabase Dashboard > SQL Editor
-- Creates the messages table
-- ============================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interest TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT a message (public contact form)
CREATE POLICY "Anyone can send a message"
  ON messages FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can read messages (admin)
CREATE POLICY "Auth users can read messages"
  ON messages FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update messages (mark read/archived)
CREATE POLICY "Auth users can update messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can delete messages
CREATE POLICY "Auth users can delete messages"
  ON messages FOR DELETE
  TO authenticated
  USING (true);
