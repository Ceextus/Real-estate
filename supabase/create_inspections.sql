-- ============================================
-- Inspections table for Andreams Homes
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

CREATE TABLE inspections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  property_title TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form submission)
CREATE POLICY "Public can insert inspections"
  ON inspections FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can read (admin)
CREATE POLICY "Auth users can read inspections"
  ON inspections FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update (admin)
CREATE POLICY "Auth users can update inspections"
  ON inspections FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can delete (admin)
CREATE POLICY "Auth users can delete inspections"
  ON inspections FOR DELETE
  TO authenticated
  USING (true);
