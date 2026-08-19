-- Alter check constraint on admin_users table to allow the 'rh' role
ALTER TABLE public.admin_users 
DROP CONSTRAINT IF EXISTS admin_users_role_check;

ALTER TABLE public.admin_users 
ADD CONSTRAINT admin_users_role_check 
CHECK (role IN ('admin', 'editor', 'experience_manager', 'restaurant_manager', 'cuentas_por_cobrar', 'viewer', 'rh'));
