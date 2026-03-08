
-- Fix infinite recursion in conversation_participants RLS policies
-- Step 1: Create a SECURITY DEFINER function to check participation
CREATE OR REPLACE FUNCTION public.is_conversation_participant(_user_id uuid, _conversation_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE user_id = _user_id AND conversation_id = _conversation_id
  )
$$;

-- Step 2: Drop existing recursive policies
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can add participants" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can update their own participation" ON public.conversation_participants;

DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.messages;

-- Step 3: Recreate policies using the SECURITY DEFINER function

-- conversation_participants policies
CREATE POLICY "Users can view participants of their conversations"
ON public.conversation_participants FOR SELECT TO authenticated
USING (public.is_conversation_participant(auth.uid(), conversation_id));

CREATE POLICY "Users can add participants"
ON public.conversation_participants FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  OR public.is_conversation_participant(auth.uid(), conversation_id)
);

CREATE POLICY "Users can update their own participation"
ON public.conversation_participants FOR UPDATE TO authenticated
USING (user_id = auth.uid());

-- conversations policies
CREATE POLICY "Users can view their conversations"
ON public.conversations FOR SELECT TO authenticated
USING (public.is_conversation_participant(auth.uid(), id));

CREATE POLICY "Users can create conversations"
ON public.conversations FOR INSERT TO authenticated
WITH CHECK (true);

-- messages policies
CREATE POLICY "Users can view messages in their conversations"
ON public.messages FOR SELECT TO authenticated
USING (public.is_conversation_participant(auth.uid(), conversation_id));

CREATE POLICY "Users can send messages in their conversations"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (
  sender_id = auth.uid() 
  AND public.is_conversation_participant(auth.uid(), conversation_id)
);

CREATE POLICY "Users can update their own messages"
ON public.messages FOR UPDATE TO authenticated
USING (public.is_conversation_participant(auth.uid(), conversation_id));
