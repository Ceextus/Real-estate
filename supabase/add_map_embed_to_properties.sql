-- ============================================
-- Add map_embed column to properties table
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

ALTER TABLE properties ADD COLUMN IF NOT EXISTS map_embed TEXT;
