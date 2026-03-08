
-- Academic connections
CREATE TABLE public.academic_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(requester_id, receiver_id)
);
ALTER TABLE public.academic_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own connections" ON public.academic_connections FOR SELECT TO authenticated USING (requester_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Users can create connections" ON public.academic_connections FOR INSERT TO authenticated WITH CHECK (requester_id = auth.uid());
CREATE POLICY "Users can update own connections" ON public.academic_connections FOR UPDATE TO authenticated USING (requester_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "Users can delete own connections" ON public.academic_connections FOR DELETE TO authenticated USING (requester_id = auth.uid());

-- Advisory profiles (users offering advisory services)
CREATE TABLE public.advisory_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  specialization TEXT NOT NULL,
  services TEXT[] DEFAULT '{}',
  hourly_rate TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.advisory_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view advisory profiles" ON public.advisory_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own advisory profile" ON public.advisory_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own advisory profile" ON public.advisory_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Advisory requests
CREATE TABLE public.advisory_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL,
  advisor_id UUID NOT NULL,
  institution TEXT,
  topic TEXT NOT NULL,
  description TEXT,
  expected_duration TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.advisory_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own advisory requests" ON public.advisory_requests FOR SELECT TO authenticated USING (requester_id = auth.uid() OR advisor_id = auth.uid());
CREATE POLICY "Users can create advisory requests" ON public.advisory_requests FOR INSERT TO authenticated WITH CHECK (requester_id = auth.uid());
CREATE POLICY "Users can update own advisory requests" ON public.advisory_requests FOR UPDATE TO authenticated USING (requester_id = auth.uid() OR advisor_id = auth.uid());

-- Job opportunities
CREATE TABLE public.job_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  institution TEXT NOT NULL,
  location TEXT,
  description TEXT,
  requirements TEXT,
  application_deadline TIMESTAMP WITH TIME ZONE,
  job_type TEXT DEFAULT 'full-time',
  posted_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.job_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view job opportunities" ON public.job_opportunities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can post jobs" ON public.job_opportunities FOR INSERT TO authenticated WITH CHECK (posted_by = auth.uid());

-- Job applications
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_id UUID NOT NULL REFERENCES public.job_opportunities(id) ON DELETE CASCADE,
  cv_url TEXT,
  cover_letter_url TEXT,
  research_statement TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own applications" ON public.job_applications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can submit applications" ON public.job_applications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own applications" ON public.job_applications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can withdraw applications" ON public.job_applications FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Engagements
CREATE TABLE public.engagements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  institution TEXT,
  engagement_type TEXT NOT NULL DEFAULT 'advisory',
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.engagements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own engagements" ON public.engagements FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create engagements" ON public.engagements FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own engagements" ON public.engagements FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Storage bucket for CVs and cover letters
INSERT INTO storage.buckets (id, name, public) VALUES ('application-documents', 'application-documents', false);

CREATE POLICY "Users can upload own documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'application-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'application-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
