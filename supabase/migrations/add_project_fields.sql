-- ============================================
-- Migration: Add project-level fields from AGPL Company Profile
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- Add new columns to the properties table for rich project data
ALTER TABLE properties ADD COLUMN IF NOT EXISTS developer TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS supported_by TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS registration_fee TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS plot_types JSONB DEFAULT '[]';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS service_plots JSONB DEFAULT '[]';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS payment_options TEXT[] DEFAULT '{}';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS bank_details JSONB DEFAULT '[]';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS facilities TEXT[] DEFAULT '{}';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS site_plan_image TEXT;

-- plot_types schema: [{ "type": "4-Bedroom Duplex with BQ", "size": "840 sqm", "units": "97", "price": "₦1.8m" }]
-- service_plots schema: [{ "size": "500 sqm", "house_type": "4-Bedroom Duplex", "price": "₦4,000,000" }]
-- bank_details schema: [{ "bank": "Fidelity Bank PLC", "account_name": "Andreams Global Ltd", "account_no": "4010935047" }]
-- payment_options: ["Outright Full Payment (5% discount)", "Down Payment: 40%", ...]
-- facilities: ["Water (Bore Holes)", "Electricity (PHCN)", ...]
