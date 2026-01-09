-- Migration: Add original_price and discounted_price to templates
-- Run this in Supabase SQL editor or via CLI

ALTER TABLE public.templates
  ADD COLUMN IF NOT EXISTS original_price numeric(10,2),
  ADD COLUMN IF NOT EXISTS discounted_price numeric(10,2);

-- Optionally add index for price queries
CREATE INDEX IF NOT EXISTS idx_templates_original_price ON public.templates (original_price);
CREATE INDEX IF NOT EXISTS idx_templates_discounted_price ON public.templates (discounted_price);

-- Note: If you use Row Level Security (RLS) ensure to update policies accordingly for inserts/updates by admin users.
