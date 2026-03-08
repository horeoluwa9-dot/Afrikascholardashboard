
-- Add 'institutional' to module_type enum
ALTER TYPE public.module_type ADD VALUE IF NOT EXISTS 'institutional';

-- Talent requests table
CREATE TABLE public.talent_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  expertise_area TEXT NOT NULL,
  description TEXT,
  expected_duration TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.talent_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own talent requests" ON public.talent_requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own talent requests" ON public.talent_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own talent requests" ON public.talent_requests FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own talent requests" ON public.talent_requests FOR DELETE USING (user_id = auth.uid());

-- Project collaborations table
CREATE TABLE public.project_collaborations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  partner_institution TEXT NOT NULL,
  research_area TEXT NOT NULL,
  description TEXT,
  expected_duration TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.project_collaborations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own collaborations" ON public.project_collaborations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own collaborations" ON public.project_collaborations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own collaborations" ON public.project_collaborations FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own collaborations" ON public.project_collaborations FOR DELETE USING (user_id = auth.uid());
