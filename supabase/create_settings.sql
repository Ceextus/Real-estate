-- ============================================
-- Site Settings table for Andreams Homes
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

CREATE TABLE site_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  general JSONB DEFAULT '{}'::jsonb,
  contact JSONB DEFAULT '{}'::jsonb,
  theme JSONB DEFAULT '{}'::jsonb,
  media JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (public-facing)
CREATE POLICY "Public can read settings"
  ON site_settings FOR SELECT
  USING (true);

-- Only authenticated users can update (admin)
CREATE POLICY "Auth users can update settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true);

-- Allow initial insert for authenticated users
CREATE POLICY "Auth users can insert settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Seed with current hardcoded defaults
INSERT INTO site_settings (id, general, contact, theme, media)
VALUES (
  1,
  '{
    "headline": "A Higher Quality of Living.",
    "subheadline": "With Andreams Homes, anyone can discover the perfect property. Just start with what you know. It''s that easy.",
    "about_text": "At Andreams Homes, we believe that true excellence is born at the intersection of relentless hard work and boundless creativity. Our dedication to pushing the boundaries of what is possible drives us to deliver projects that not only meet but exceed expectations."
  }'::jsonb,
  '{
    "phone1": "+234 812 345 6789",
    "phone2": "+234 809 876 5432",
    "email_support": "info@Andreamshomes.com",
    "email_inquiry": "sales@Andreamshomes.com",
    "address": "12, Andreams Homes Avenue, Off Admiralty Way, Lekki Phase 1, Lagos, Nigeria.",
    "socials": {
      "facebook": "",
      "twitter": "",
      "instagram": "",
      "linkedin": ""
    }
  }'::jsonb,
  '{
    "primary_color": "#1D4734",
    "accent_color": "#E09B6B"
  }'::jsonb,
  '{
    "hero_images": []
  }'::jsonb
);
