-- ============================================
-- Gallery table for Andreams Homes
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'Exterior',
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Anyone can read gallery images (public-facing)
CREATE POLICY "Public can read gallery"
  ON gallery FOR SELECT
  USING (true);

-- Only authenticated users can insert (admin)
CREATE POLICY "Auth users can insert gallery"
  ON gallery FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update (admin)
CREATE POLICY "Auth users can update gallery"
  ON gallery FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can delete (admin)
CREATE POLICY "Auth users can delete gallery"
  ON gallery FOR DELETE
  TO authenticated
  USING (true);

-- Seed with existing mock data
INSERT INTO gallery (category, url, caption, sort_order)
VALUES
  ('Exterior', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80', 'Modern exterior design', 1),
  ('Interior', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80', 'Luxury interior finish', 2),
  ('Amenities', 'https://images.unsplash.com/photo-1600607687931-cebfed5183eb?auto=format&fit=crop&q=80', 'Premium amenities', 3),
  ('Exterior', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80', 'Contemporary facade', 4),
  ('Interior', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80', 'Spacious living area', 5),
  ('Amenities', 'https://images.unsplash.com/photo-1584738766473-61c083514bf4?auto=format&fit=crop&q=80', 'Swimming pool area', 6);
