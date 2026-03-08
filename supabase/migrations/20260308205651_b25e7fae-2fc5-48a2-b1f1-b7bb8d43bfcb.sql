
-- Journals table
CREATE TABLE public.journals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  issn TEXT,
  publisher TEXT,
  website_url TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view journals" ON public.journals FOR SELECT USING (true);
CREATE POLICY "Users can create journals" ON public.journals FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Creators can update journals" ON public.journals FOR UPDATE USING (created_by = auth.uid());

-- Editorial board members
CREATE TABLE public.editorial_board_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  journal_id UUID NOT NULL REFERENCES public.journals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'reviewer',
  display_name TEXT,
  institution TEXT,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.editorial_board_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view board members" ON public.editorial_board_members FOR SELECT USING (true);
CREATE POLICY "Journal creators can manage board" ON public.editorial_board_members FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.journals WHERE id = journal_id AND created_by = auth.uid())
);
CREATE POLICY "Journal creators can update board" ON public.editorial_board_members FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.journals WHERE id = journal_id AND created_by = auth.uid())
);
CREATE POLICY "Journal creators can delete board members" ON public.editorial_board_members FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.journals WHERE id = journal_id AND created_by = auth.uid())
);

-- Manuscript submissions (extends publications with workflow data)
CREATE TABLE public.manuscript_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  abstract TEXT,
  keywords TEXT,
  research_field TEXT,
  journal_name TEXT NOT NULL,
  journal_id UUID REFERENCES public.journals(id),
  manuscript_url TEXT,
  cover_letter TEXT,
  co_authors JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'submitted',
  workflow_stage TEXT NOT NULL DEFAULT 'submission_received',
  reviewer_feedback JSONB DEFAULT '[]',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.manuscript_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own submissions" ON public.manuscript_submissions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert submissions" ON public.manuscript_submissions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own submissions" ON public.manuscript_submissions FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own submissions" ON public.manuscript_submissions FOR DELETE USING (user_id = auth.uid());
