import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditsHowItWorksModal } from "@/components/dashboard/CreditsModal";
import {
  ChevronRight, FileText, Database, BarChart3, Zap, Timer,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const credits = [
  { label: "Paper Credits", icon: FileText, used: 5, total: 25, color: "bg-accent", expiresIn: 22 },
  { label: "Dataset Credits", icon: Database, used: 0, total: 25, color: "bg-primary", expiresIn: 30 },
  { label: "Analysis Credits", icon: BarChart3, used: 10, total: 35, color: "bg-afrika-green", expiresIn: 15 },
];

const creditPacks = [
  { label: "+5 Paper Credits", price: "₦7,500", icon: FileText },
  { label: "+10 Dataset Credits", price: "₦5,000", icon: Database },
  { label: "+5 Analysis Credits", price: "₦6,000", icon: BarChart3 },
];

const BillingCreditsPage = () => {
  const { toast } = useToast();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/billing" className="hover:text-foreground">Billing & Credits</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Credits</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Credits</h1>
          <p className="text-sm text-muted-foreground mt-1">View your credit balances and purchase add-ons.</p>
        </div>

        {/* Credit Balance */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Credit Balance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {credits.map((c) => (
              <div key={c.label} className="bg-card rounded-xl border border-border p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <c.icon className="h-4 w-4 text-accent" />
                  <p className="text-xs text-muted-foreground font-medium">{c.label}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">{c.total - c.used}</span>
                  <span className="text-sm text-muted-foreground">/ {c.total}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${(c.used / c.total) * 100}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground">{c.used} used this month</p>
                <div className="flex items-center gap-1.5 pt-1 border-t border-border">
                  <Timer className="h-3 w-3 text-muted-foreground" />
                  <p className="text-[10px] text-muted-foreground">
                    Expires in <span className="text-foreground font-medium">{c.expiresIn} days</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <CreditsHowItWorksModal />
        </div>

        {/* Credit Packs */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Credit Packs (Add-Ons)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {creditPacks.map((p) => (
              <div key={p.label} className="bg-card rounded-xl border border-border p-5 text-center space-y-3">
                <p.icon className="h-6 w-6 mx-auto text-accent" />
                <p className="text-sm font-bold text-foreground">{p.label}</p>
                <p className="text-lg font-bold text-accent">{p.price}</p>
                <Button variant="afrika" size="sm" className="w-full" onClick={() => toast({ title: "Purchase initiated", description: `Processing ${p.label}...` })}>
                  Purchase
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingCreditsPage;
