-- For existing databases: add last_scanned to cities if it was created
-- before this column was introduced in the main migration.
-- Run once in Supabase SQL Editor if your app uses the scan cooldown feature.
ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS last_scanned TIMESTAMPTZ;
