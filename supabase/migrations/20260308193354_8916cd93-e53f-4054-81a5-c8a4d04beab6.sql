
-- Library: Purchased Papers
CREATE TABLE public.purchased_papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  authors TEXT,
  journal TEXT,
  year INTEGER,
  access_status TEXT NOT NULL DEFAULT 'purchased',
  pdf_url TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.purchased_papers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own purchased papers" ON public.purchased_papers FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own purchased papers" ON public.purchased_papers FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own purchased papers" ON public.purchased_papers FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Library: Saved Articles
CREATE TABLE public.saved_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  authors TEXT,
  journal TEXT,
  year INTEGER,
  source_url TEXT,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.saved_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own saved articles" ON public.saved_articles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own saved articles" ON public.saved_articles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own saved articles" ON public.saved_articles FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Library: Download History
CREATE TABLE public.download_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  journal TEXT,
  file_type TEXT NOT NULL DEFAULT 'PDF',
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.download_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own downloads" ON public.download_history FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own downloads" ON public.download_history FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Library: Reading Lists
CREATE TABLE public.reading_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.reading_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own reading lists" ON public.reading_lists FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own reading lists" ON public.reading_lists FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own reading lists" ON public.reading_lists FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own reading lists" ON public.reading_lists FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Library: Reading List Items
CREATE TABLE public.reading_list_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reading_list_id UUID NOT NULL REFERENCES public.reading_lists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  authors TEXT,
  journal TEXT,
  year INTEGER,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.reading_list_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own list items" ON public.reading_list_items FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own list items" ON public.reading_list_items FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own list items" ON public.reading_list_items FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Trigger to update reading_lists.updated_at when items change
CREATE OR REPLACE FUNCTION public.update_reading_list_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.reading_lists SET updated_at = now() WHERE id = NEW.reading_list_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_reading_list_item_insert
  AFTER INSERT ON public.reading_list_items
  FOR EACH ROW EXECUTE FUNCTION public.update_reading_list_timestamp();
