
-- Academic credentials table
CREATE TABLE public.academic_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  university TEXT NOT NULL,
  year_of_graduation INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.academic_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all credentials" ON public.academic_credentials FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own credentials" ON public.academic_credentials FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own credentials" ON public.academic_credentials FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own credentials" ON public.academic_credentials FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Publications table
CREATE TABLE public.publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  journal TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  year INTEGER,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view publications" ON public.publications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own publications" ON public.publications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own publications" ON public.publications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own publications" ON public.publications FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Research interests table
CREATE TABLE public.research_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE public.research_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view interests" ON public.research_interests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own interests" ON public.research_interests FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own interests" ON public.research_interests FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Add department and position columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS academic_title TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS available_for_collaboration BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS collaboration_description TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'public';
