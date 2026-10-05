-- Migration: Create sales_kams table for Key Account Managers / Sales Representatives
-- This allows Admins to register, list, and rename KAMs, with automated synchronization to points_of_sale

CREATE TABLE IF NOT EXISTS public.sales_kams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    email TEXT,
    phone TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sales_kams ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'sales_kams' AND policyname = 'Allow public read sales_kams'
    ) THEN
        CREATE POLICY "Allow public read sales_kams" ON public.sales_kams FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'sales_kams' AND policyname = 'Allow full access sales_kams'
    ) THEN
        CREATE POLICY "Allow full access sales_kams" ON public.sales_kams FOR ALL USING (true);
    END IF;
END $$;

-- Populate with existing KAMs from points_of_sale table
INSERT INTO public.sales_kams (name, is_active)
SELECT DISTINCT TRIM(fase) AS name, true AS is_active
FROM public.points_of_sale
WHERE fase IS NOT NULL AND TRIM(fase) <> ''
ON CONFLICT (name) DO NOTHING;
