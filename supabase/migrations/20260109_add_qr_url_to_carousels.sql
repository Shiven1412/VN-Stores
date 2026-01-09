-- Migration: Add qr_url column to carousels table
-- This allows storing QR code URLs for each carousel item

ALTER TABLE public.carousels
  ADD COLUMN IF NOT EXISTS qr_url text;

-- Optional: Create index for QR URL lookups
CREATE INDEX IF NOT EXISTS idx_carousels_qr_url ON public.carousels (qr_url);
