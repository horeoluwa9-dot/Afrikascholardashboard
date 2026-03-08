import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  paystack_reference: string | null;
  paper_credits_used: number;
  paper_credits_total: number;
  dataset_credits_used: number;
  dataset_credits_total: number;
  analysis_credits_used: number;
  analysis_credits_total: number;
  billing_cycle: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const isActive = subscription?.status === "active" || subscription?.status === "trialing";

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();
    setSubscription(data as Subscription | null);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  return { subscription, isActive, loading, refetch: fetchSubscription };
}
