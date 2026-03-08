-- Create enum for module types
CREATE TYPE public.module_type AS ENUM (
  'publishing',
  'research_intelligence',
  'publeesh_ai',
  'instrument_studio',
  'my_research'
);

-- Create table to track unlocked modules per user
CREATE TABLE public.user_module_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  module module_type NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, module)
);

-- Enable RLS
ALTER TABLE public.user_module_unlocks ENABLE ROW LEVEL SECURITY;

-- Users can view their own unlocks
CREATE POLICY "Users can view their own unlocks"
ON public.user_module_unlocks
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can unlock modules for themselves
CREATE POLICY "Users can unlock modules"
ON public.user_module_unlocks
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Function to check if user has module unlocked
CREATE OR REPLACE FUNCTION public.has_module_unlocked(_user_id uuid, _module module_type)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_module_unlocks
    WHERE user_id = _user_id AND module = _module
  )
$$;

-- Function to unlock a module for a user
CREATE OR REPLACE FUNCTION public.unlock_module(_user_id uuid, _module module_type)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_module_unlocks (user_id, module)
  VALUES (_user_id, _module)
  ON CONFLICT (user_id, module) DO NOTHING;
END;
$$;