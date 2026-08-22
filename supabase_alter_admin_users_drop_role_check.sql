-- Migration to drop constraint check on admin_users role column
ALTER TABLE public.admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;
