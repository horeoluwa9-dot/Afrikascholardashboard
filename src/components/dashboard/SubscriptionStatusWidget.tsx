import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { format } from "date-fns";

export function SubscriptionStatusWidget() {
  const { subscription, isActive } = useSubscriptionContext();

  if (!isActive || !subscription) return null;

  const totalCredits =
    (subscription.paper_credits_total - subscription.paper_credits_used) +
    (subscription.dataset_credits_total - subscription.dataset_credits_used) +
    (subscription.analysis_credits_total - subscription.analysis_credits_used);

  const planLabel = subscription.plan === "starter" ? "Starter Trial"
    : subscription.plan === "researcher" ? "Researcher"
    : subscription.plan;

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-accent" />
          Subscription Status
        </h3>
        <Badge className="bg-afrika-green/10 text-afrika-green text-[10px]">
          {subscription.status === "trialing" ? "Trial" : "Active"}
        </Badge>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Plan</span>
          <span className="font-medium text-foreground capitalize">{planLabel}</span>
        </div>
        {subscription.current_period_end && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Next Billing</span>
            <span className="font-medium text-foreground">
              {format(new Date(subscription.current_period_end), "MMM d, yyyy")}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Remaining Credits</span>
          <span className="font-medium text-foreground">{totalCredits.toLocaleString()}</span>
        </div>
      </div>
      <Link to="/publeesh/subscription">
        <Button variant="afrikaOutline" size="sm" className="w-full text-xs">
          Manage Subscription
        </Button>
      </Link>
    </div>
  );
}
