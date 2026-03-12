-- ============================================
-- Migration: Add images array to properties table
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- Add an array of TEXT to store multiple auxiliary image URLs
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Optional: If you want to migrate the existing single image into the first element of the array
-- (This ensures even older properties have at least one image in the gallery array)
UPDATE properties
SET images = ARRAY[image]
WHERE image IS NOT NULL AND (images IS NULL OR array_length(images, 1) IS NULL);
