-- ============================================
-- Run this AFTER running create_properties.sql
-- in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Create a storage bucket for property images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  10485760,  -- 10MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- 2. Allow public read access to property images
CREATE POLICY "Public can view property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

-- 3. Allow authenticated users to upload property images
CREATE POLICY "Auth users can upload property images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-images');

-- 4. Allow authenticated users to update property images
CREATE POLICY "Auth users can update property images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'property-images');

-- 5. Allow authenticated users to delete property images
CREATE POLICY "Auth users can delete property images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'property-images');
