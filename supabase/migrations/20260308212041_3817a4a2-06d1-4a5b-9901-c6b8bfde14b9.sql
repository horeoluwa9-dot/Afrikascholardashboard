
CREATE TABLE public.ai_papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  research_field TEXT,
  paper_type TEXT NOT NULL DEFAULT 'research_paper',
  target_journal TEXT,
  citation_style TEXT NOT NULL DEFAULT 'APA',
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  credits_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own papers" ON public.ai_papers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own papers" ON public.ai_papers FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own papers" ON public.ai_papers FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own papers" ON public.ai_papers FOR DELETE USING (user_id = auth.uid());

CREATE TRIGGER update_ai_papers_updated_at
  BEFORE UPDATE ON public.ai_papers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
