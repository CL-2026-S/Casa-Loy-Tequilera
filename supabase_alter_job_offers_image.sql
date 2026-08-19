-- Add image_url column to job_offers table to support custom vacancy images
ALTER TABLE public.job_offers 
ADD COLUMN IF NOT EXISTS image_url TEXT;
