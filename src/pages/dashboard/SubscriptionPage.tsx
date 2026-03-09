import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Star, Building2, Sparkles, CreditCard, Landmark, Smartphone } from "lucide-react";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "7-day trial",
    description: "Get started with limited access to research tools.",
    features: [
      "5 Paper Credits",
      "5 Dataset Credits",
      "5 Analysis Credits",
      "Basic AI drafting",
      "Community access",
    ],
    cta: "Start Free Trial",
    variant: "afrikaOutline" as const,
    planKey: "starter",
    highlight: false,
  },
  {
    name: "Researcher",
    price: "₦25,000",
    period: "/month",
    description: "Full research tools for individual researchers.",
    features: [
      "25 Paper Credits",
      "25 Dataset Credits",
      "35 Analysis Credits",
      "AI-powered drafting",
      "Dataset access & analysis",
      "Research intelligence",
      "Priority support",
    ],
    cta: "Subscribe Now",
    variant: "afrika" as const,
    planKey: "researcher",
    highlight: true,
  },
  {
    name: "Institutional",
    price: "Custom",
    period: "",
    description: "Multi-user access for universities and research orgs.",
    features: [
      "Unlimited credits",
      "Multi-user dashboards",
      "Institution analytics",
      "Research collaboration",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Request Demo",
    variant: "afrikaOutline" as const,
    planKey: "institutional",
    highlight: false,
  },
];

export default function SubscriptionPage() {
  const { user } = useAuth();
  const { subscription, refetch } = useSubscriptionContext();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSelectPlan = (plan: typeof plans[0]) => {
    if (plan.planKey === "institutional") {
      navigate("/publeesh/institutional-demo");
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePayment = async (method: string) => {
    if (!user || !selectedPlan) return;
    setProcessing(true);

    try {
      const isStarter = selectedPlan.planKey === "starter";
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setDate(periodEnd.getDate() + (isStarter ? 7 : 30));

      const subData = {
        user_id: user.id,
        plan: selectedPlan.planKey,
        status: isStarter ? "trialing" : "active",
        paper_credits_used: 0,
        paper_credits_total: isStarter ? 5000 : 25000,
        dataset_credits_used: 0,
        dataset_credits_total: isStarter ? 5000 : 25000,
        analysis_credits_used: 0,
        analysis_credits_total: isStarter ? 5000 : 35000,
        billing_cycle: "monthly",
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        paystack_reference: `ref_${Date.now()}`,
      };

      if (subscription) {
        await supabase.from("subscriptions").update(subData).eq("user_id", user.id);
      } else {
        await supabase.from("subscriptions").insert(subData);
      }

      await refetch();
      setShowPayment(false);
      navigate("/publeesh/payment-success");
    } catch (err) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Choose Your Publeesh Plan</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Unlock AI-powered research drafting, datasets, and analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.planKey}
              className={`relative flex flex-col ${
                plan.highlight
                  ? "border-accent shadow-lg ring-2 ring-accent/20"
                  : "border-border"
              }`}
            >
              {plan.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs px-3">
                  <Star className="h-3 w-3 mr-1" /> Recommended
                </Badge>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  {plan.planKey === "institutional" ? (
                    <Building2 className="h-5 w-5 text-accent" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-accent" />
                  )}
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <CardDescription className="mt-1">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-afrika-green shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.variant}
                  className="w-full mt-6"
                  onClick={() => handleSelectPlan(plan)}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-secondary rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium text-foreground">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Billing</span>
                  <span className="font-medium text-foreground">Monthly</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium text-foreground">{selectedPlan.price}{selectedPlan.period}</span>
                </div>
                {selectedPlan.planKey !== "starter" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">VAT (0%)</span>
                      <span className="font-medium text-foreground">$0.00</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
                      <span>Total</span>
                      <span className="text-foreground">{selectedPlan.price}/mo</span>
                    </div>
                  </>
                )}
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Payment Method</p>
                {selectedPlan.planKey === "starter" ? (
                  <Button
                    variant="afrika"
                    className="w-full"
                    onClick={() => handlePayment("trial")}
                    disabled={processing}
                  >
                    {processing ? "Activating..." : "Start Free Trial"}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    {[
                      { method: "card", label: "Debit / Credit Card", icon: CreditCard },
                      { method: "bank", label: "Bank Transfer", icon: Landmark },
                      { method: "mobile", label: "Mobile Money", icon: Smartphone },
                    ].map((pm) => (
                      <Button
                        key={pm.method}
                        variant="outline"
                        className="w-full justify-start gap-3"
                        onClick={() => handlePayment(pm.method)}
                        disabled={processing}
                      >
                        <pm.icon className="h-4 w-4 text-accent" />
                        {processing ? "Processing..." : pm.label}
                      </Button>
                    ))}
                    <p className="text-[10px] text-muted-foreground text-center mt-2">
                      Secured by Paystack. You'll be redirected to complete payment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
