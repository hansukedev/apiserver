-- Add Foreign Key to link licenses to profiles
-- This resolves PGRST200 (Could not find a relationship)
ALTER TABLE public.licenses
ADD CONSTRAINT licenses_user_id_fkey_profiles
FOREIGN KEY (user_id)
REFERENCES public.profiles (id)
ON DELETE CASCADE;
