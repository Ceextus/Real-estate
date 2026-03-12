-- ============================================
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Create the properties table
CREATE TABLE properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  price TEXT NOT NULL,
  type TEXT NOT NULL,
  image TEXT NOT NULL,
  beds TEXT,
  status TEXT,  
  property_type TEXT,
  size TEXT,
  features TEXT[] DEFAULT '{}',
  video_placeholder TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Anyone can read properties (public-facing)
CREATE POLICY "Public can read properties"
  ON properties FOR SELECT
  USING (true);

-- Only authenticated users can insert (admin)
CREATE POLICY "Auth users can insert properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update (admin)
CREATE POLICY "Auth users can update properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can delete (admin)
CREATE POLICY "Auth users can delete properties"
  ON properties FOR DELETE
  TO authenticated
  USING (true);

-- 4. Seed with existing mock data
INSERT INTO properties (title, slug, location, price, type, image, beds, status, property_type, size, features, video_placeholder, description)
VALUES
  (
    'The Serenity Villa',
    'the-serenity-villa',
    'Banana Island, Lagos',
    '₦850,000,000',
    '5 Bed Detached',
    'https://plus.unsplash.com/premium_photo-1686090449192-4ab1d00cb735?q=80&w=1170&auto=format&fit=crop',
    '5 Bedroom Smart Terrace Duplex',
    'Carcass Level (Unfinished Interior)',
    'Buy & Build',
    '450 sqm',
    ARRAY[
      'Strategic Location: Banana Island, Lagos',
      'Within minutes from major expressways',
      'Quick access to city center and major landmarks',
      'Proximity to estates, shopping plazas, schools, and key infrastructure',
      'Smart Home-Ready Design: Layout optimized for smart home integration',
      'Customizable Finishing: Delivered at carcass level to choose your interior materials',
      'Prime Residential Corridor: Banana Island is highly sought after',
      'FCDA-Compliant and Secure: Situated in a planned estate environment'
    ],
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
    'This is ideal for discerning buyers who want to customize their finishes while saving significantly on upfront costs. The Serenity Villa is not just another housing project; it''s your chance to build a personalized smart home in a growing, well-connected part of Lagos.'
  ),
  (
    'Nova Luxury Apartments',
    'nova-luxury-apartments',
    'Ikoyi, Lagos',
    '₦420,000,000',
    '4 Bed Penthouse',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80',
    '4 Bedroom Penthouse Suite',
    'Fully Finished',
    'Move-In Ready',
    '320 sqm',
    ARRAY[
      'Panoramic skyline views of Ikoyi',
      'Dedicated high-speed elevator access',
      'Private rooftop terrace with plunge pool',
      'Integrated home automation system',
      'Italian marble flooring throughout living areas',
      'Chef''s kitchen with built-in Miele appliances',
      '24/7 concierge and premium security'
    ],
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80',
    'Experience the pinnacle of urban luxury at Nova Luxury Apartments. Boasting sweeping views and meticulous contemporary design, this penthouse offers an unmatched lifestyle in the heart of Ikoyi.'
  ),
  (
    'The Haven',
    'the-haven',
    'Lekki Phase 1, Lagos',
    '₦250,000,000',
    '4 Bed Terraced',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80',
    '4 Bedroom Terraced House',
    'Off-Plan',
    'Investment / Residential',
    '280 sqm',
    ARRAY[
      'Located in a highly secure gated community',
      'Contemporary minimalist architecture',
      'Spacious en-suite bedrooms with walk-in closets',
      'Dedicated parking for 3 vehicles',
      'Communal swimming pool and fitness center',
      'Solar power and inverter ready',
      'Flexible payment plans available'
    ],
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80',
    'The Haven brings modern terraced living to Lekki Phase 1. Designed for families and professionals alike, these homes strike the perfect balance between communal luxury and private tranquility.'
  );
