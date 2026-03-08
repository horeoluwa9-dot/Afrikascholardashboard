
-- Subscriptions table to track Publeesh subscription status
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  plan text NOT NULL DEFAULT 'none',
  status text NOT NULL DEFAULT 'inactive',
  paystack_reference text,
  paper_credits_used integer NOT NULL DEFAULT 0,
  paper_credits_total integer NOT NULL DEFAULT 0,
  dataset_credits_used integer NOT NULL DEFAULT 0,
  dataset_credits_total integer NOT NULL DEFAULT 0,
  analysis_credits_used integer NOT NULL DEFAULT 0,
  analysis_credits_total integer NOT NULL DEFAULT 0,
  billing_cycle text DEFAULT 'monthly',
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view their own subscription"
ON public.subscriptions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can insert their own subscription
CREATE POLICY "Users can insert their own subscription"
ON public.subscriptions FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own subscription
CREATE POLICY "Users can update their own subscription"
ON public.subscriptions FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Trigger to update updated_at
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
