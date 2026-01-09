-- Migration: Add template_id to orders table for sales tracking
-- This allows tracking which template each order was for

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS template_id bigint;

-- Optional: Add foreign key constraint
ALTER TABLE public.orders
  ADD CONSTRAINT fk_orders_template_id 
  FOREIGN KEY (template_id) 
  REFERENCES public.templates(id) ON DELETE SET NULL;

-- Optional: Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_template_id ON public.orders (template_id);
