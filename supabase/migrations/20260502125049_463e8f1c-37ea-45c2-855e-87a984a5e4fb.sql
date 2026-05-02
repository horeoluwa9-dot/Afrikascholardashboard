ALTER TABLE public.manuscript_submissions
  ADD COLUMN IF NOT EXISTS is_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS price_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_earnings numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS download_count integer NOT NULL DEFAULT 0;