import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditsHowItWorksModal } from "@/components/dashboard/CreditsModal";
import {
  ChevronRight,
  CreditCard,
  Copy,
  ExternalLink,
  FileText,
  Database,
  BarChart3,
  ArrowRight,
  Gift,
  Check,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const credits = [
  { label: "Paper Credits", icon: FileText, used: 5, total: 25, color: "bg-accent" },
  { label: "Dataset Credits", icon: Database, used: 0, total: 25, color: "bg-primary" },
  { label: "Analysis Credits", icon: BarChart3, used: 10, total: 35, color: "bg-afrika-green" },
];

const creditPacks = [
  { label: "+5 Paper Credits", price: "₦7,500", icon: FileText },
  { label: "+10 Dataset Credits", price: "₦5,000", icon: Database },
  { label: "+5 Analysis Credits", price: "₦6,000", icon: BarChart3 },
];

const transactions = [
  { date: "2026-03-01", type: "Subscription Renewal", amount: "₦25,000", credits: "85 credits", status: "Completed" },
  { date: "2026-02-15", type: "Credit Pack Purchase", amount: "₦7,500", credits: "+5 Paper", status: "Completed" },
  { date: "2026-02-01", type: "Subscription Renewal", amount: "₦25,000", credits: "85 credits", status: "Completed" },
  { date: "2026-01-10", type: "Credit Pack Purchase", amount: "₦5,000", credits: "+10 Dataset", status: "Completed" },
];

const referrals = [
  { name: "Aisha M.", status: "Signed Up", reward: "5 credits" },
  { name: "Emmanuel K.", status: "Subscribed", reward: "10 credits" },
  { name: "Fatima O.", status: "Invited", reward: "Pending" },
];

const milestones = [
  { count: 3, reward: "10 bonus credits", reached: true },
  { count: 5, reward: "1 month free", reached: false },
  { count: 10, reward: "Lifetime 10% discount", reached: false },
];

const BillingPage = () => {
  const { toast } = useToast();
  const referralCode = "AFRIKA-DEFI-2026";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({ title: "Copied!", description: "Referral code copied to clipboard." });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Billing & Credits</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing & Credits</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your subscription, credits, and referrals.</p>
        </div>

        {/* Plan Overview */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-bold text-foreground">Individual Pro</h2>
                <Badge className="bg-accent text-accent-foreground text-[10px]">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">₦25,000 / month · Renews April 1, 2026</p>
            </div>
            <Link to="/publeesh/pricing">
              <Button variant="afrikaOutline" size="sm" className="gap-1">
                <ArrowRight className="h-3 w-3" /> Upgrade Plan
              </Button>
            </Link>
          </div>
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
                <Button variant="afrika" size="sm" className="w-full">Purchase</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Transaction History</h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="hidden md:grid grid-cols-5 gap-2 px-5 py-3 bg-secondary text-xs font-semibold text-muted-foreground border-b border-border">
              <div>Date</div>
              <div>Type</div>
              <div>Amount</div>
              <div>Credits</div>
              <div>Status</div>
            </div>
            {transactions.map((t, i) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-2 px-5 py-3 border-b border-border text-sm">
                <span className="text-xs text-muted-foreground">{t.date}</span>
                <span className="text-xs text-foreground">{t.type}</span>
                <span className="text-xs font-medium text-foreground">{t.amount}</span>
                <span className="text-xs text-muted-foreground">{t.credits}</span>
                <Badge variant="secondary" className="text-[10px] w-fit">{t.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Referral */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-foreground">Referral Program</h2>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <p className="text-sm text-muted-foreground">Invite researchers and earn free credits when they subscribe.</p>

            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Your Referral Code</p>
              <div className="flex gap-2">
                <Input readOnly value={referralCode} className="font-mono text-sm" />
                <Button variant="outline" size="sm" className="gap-1 shrink-0" onClick={handleCopyCode}>
                  <Copy className="h-3 w-3" /> Copy
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="afrika" size="sm" className="gap-1">
                <ExternalLink className="h-3 w-3" /> Share via WhatsApp
              </Button>
              <Button variant="afrikaBlue" size="sm" className="gap-1">
                <ExternalLink className="h-3 w-3" /> Share via LinkedIn
              </Button>
            </div>

            {/* Invited list */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Invited Users</p>
              {referrals.map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {r.name[0]}
                    </div>
                    <span className="text-sm text-foreground">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">{r.status}</Badge>
                    <span className="text-xs text-muted-foreground">{r.reward}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Milestones */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Reward Milestones</p>
              {milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${m.reached ? "bg-afrika-green text-accent-foreground" : "bg-border"}`}>
                    {m.reached && <Check className="h-3 w-3" />}
                  </div>
                  <span className="text-xs text-foreground">{m.count} referrals → {m.reward}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingPage;
