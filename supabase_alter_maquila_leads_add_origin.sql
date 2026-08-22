-- Migration to add origin column to maquila_leads table
ALTER TABLE public.maquila_leads ADD COLUMN origin text DEFAULT 'quiz';
