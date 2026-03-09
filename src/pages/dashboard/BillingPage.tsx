import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { CreditsHowItWorksModal } from "@/components/dashboard/CreditsModal";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronRight, CreditCard, Copy, ExternalLink, FileText, Database,
  BarChart3, ArrowRight, Gift, Check, Users, Wrench, Presentation,
  AlertTriangle, Clock, Zap, QrCode, Mail, Timer, ShieldCheck,
  CheckCircle2, XCircle, Activity,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const credits = [
  { label: "Paper Credits", icon: FileText, used: 500, total: 5000, color: "bg-accent", expiresIn: 22 },
  { label: "Dataset Credits", icon: Database, used: 0, total: 10000, color: "bg-primary", expiresIn: 30 },
  { label: "Analysis Credits", icon: BarChart3, used: 1000, total: 5000, color: "bg-afrika-green", expiresIn: 15 },
];

const creditPacks = [
  { label: "+1,000 Paper Credits", price: "₦150,000", icon: FileText },
  { label: "+2,500 Dataset Credits", price: "₦225,000", icon: Database },
  { label: "+1,000 Analysis Credits", price: "₦120,000", icon: BarChart3 },
];

const transactions = [
  { date: "2026-03-04", action: "Paper Generation", creditsUsed: 100, balanceAfter: 4400, category: "Instrument" },
  { date: "2026-03-03", action: "Instrument Generation", creditsUsed: 200, balanceAfter: 4500, category: "Instrument" },
  { date: "2026-03-01", action: "Subscription Renewal", creditsUsed: 0, balanceAfter: 4700, category: "Subscription" },
  { date: "2026-02-28", action: "Dataset Analysis", creditsUsed: 150, balanceAfter: 4700, category: "Instrument" },
  { date: "2026-02-25", action: "Paper Generation", creditsUsed: 50, balanceAfter: 4850, category: "Instrument" },
  { date: "2026-02-20", action: "Referral Reward", creditsUsed: -500, balanceAfter: 4900, category: "Referral Reward" },
  { date: "2026-02-15", action: "Credit Pack Purchase", creditsUsed: -1000, balanceAfter: 4400, category: "Subscription" },
];

const referrals = [
  { name: "Aisha M.", status: "Subscribed", reward: "1,000 credits", active: true },
  { name: "Emmanuel K.", status: "Signed Up", reward: "500 credits", active: true },
  { name: "Fatima O.", status: "Invited", reward: "Pending", active: false },
];

const milestones = [
  { count: 3, reward: "1,000 bonus credits", reached: true },
  { count: 5, reward: "1 month free", reached: false },
  { count: 10, reward: "Lifetime 10% discount", reached: false },
];

const usageBreakdown = [
  { label: "AI Paper Generation", credits: 800, percent: 50, color: "bg-accent" },
  { label: "Dataset Analysis", credits: 500, percent: 30, color: "bg-primary" },
  { label: "Instrument Studio", credits: 200, percent: 13, color: "bg-afrika-green" },
  { label: "Community Assessments", credits: 100, percent: 7, color: "bg-muted-foreground" },
];

const billingAlerts = [
  { message: "Your AI credits are running low.", cta: "Buy Credits", ctaUrl: "/dashboard/billing/credits", icon: AlertTriangle, variant: "destructive" as const },
  { message: "Your subscription renews in 7 days.", cta: "View Plan", ctaUrl: "/dashboard/billing", icon: Clock, variant: "secondary" as const },
  { message: "You have unused dataset credits.", cta: "View Usage", ctaUrl: "/dashboard/billing/usage", icon: Zap, variant: "secondary" as const },
];

const invoices = [
  { id: "INV-2026-034", date: "Feb 28, 2026", amount: "₦25,000", status: "Paid" },
  { id: "INV-2026-029", date: "Jan 31, 2026", amount: "₦25,000", status: "Paid" },
  { id: "INV-2026-015", date: "Dec 31, 2025", amount: "₦7,500", status: "Paid" },
];

const billingTimeline = [
  { date: "Mar 4", event: "Paper Generation — 100 credits used", type: "usage" },
  { date: "Mar 3", event: "Instrument Generation — 200 credits used", type: "usage" },
  { date: "Mar 1", event: "Subscription Renewal — ₦25,000", type: "payment" },
  { date: "Feb 28", event: "Dataset Analysis — 150 credits used", type: "usage" },
  { date: "Feb 25", event: "Purchased +1,000 Paper Credits", type: "purchase" },
  { date: "Feb 20", event: "Referral Reward — +500 credits", type: "reward" },
];

const plans = [
  { name: "Free", price: "₦0", aiCredits: "5,000", datasetCredits: "5,000", instrumentAccess: "Limited", journalPublishing: "No", current: false },
  { name: "Individual Pro", price: "₦25,000/mo", aiCredits: "25,000", datasetCredits: "25,000", instrumentAccess: "Full", journalPublishing: "Yes", current: true },
  { name: "Institutional", price: "Custom", aiCredits: "Unlimited", datasetCredits: "Unlimited", instrumentAccess: "Full + Admin", journalPublishing: "Yes + Reports", current: false },
];

const BillingPage = () => {
  const { toast } = useToast();
  const [historyFilter, setHistoryFilter] = useState("All");
  const [autoRenewCredits, setAutoRenewCredits] = useState(false);
  const [spendingLimitEnabled, setSpendingLimitEnabled] = useState(false);
  const [spendingLimit, setSpendingLimit] = useState("30000");
  const [purchaseState, setPurchaseState] = useState<"idle" | "success" | "error">("idle");
  const referralCode = "AFRIKA-DEFI-2026";
  const referralLink = `https://afrikascholar.com/ref/${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({ title: "Copied!", description: "Referral code copied to clipboard." });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: "Copied!", description: "Referral link copied to clipboard." });
  };

  const handlePurchase = (label: string) => {
    setPurchaseState("success");
    toast({ title: "Credits Added", description: `${label} successfully added to your account.` });
    setTimeout(() => setPurchaseState("idle"), 4000);
  };

  const filteredTransactions = historyFilter === "All" ? transactions : transactions.filter((t) => t.category === historyFilter);

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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="afrikaOutline" size="sm" className="gap-1"><ArrowRight className="h-3 w-3" /> Upgrade Plan</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Compare Plans</DialogTitle>
                </DialogHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Feature</th>
                        {plans.map((p) => (
                          <th key={p.name} className="text-center py-3 px-2">
                            <span className="font-bold text-foreground">{p.name}</span>
                            {p.current && <Badge className="ml-1 bg-accent text-accent-foreground text-[8px]">Current</Badge>}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Monthly Price", key: "price" },
                        { label: "AI Credits", key: "aiCredits" },
                        { label: "Dataset Credits", key: "datasetCredits" },
                        { label: "Instrument Access", key: "instrumentAccess" },
                        { label: "Journal Publishing", key: "journalPublishing" },
                      ].map((row) => (
                        <tr key={row.key} className="border-b border-border">
                          <td className="py-3 px-2 text-muted-foreground">{row.label}</td>
                          {plans.map((p) => (
                            <td key={p.name} className="py-3 px-2 text-center text-foreground">
                              {(p as any)[row.key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr>
                        <td className="py-3 px-2" />
                        {plans.map((p) => (
                          <td key={p.name} className="py-3 px-2 text-center">
                            {p.current ? (
                              <Badge variant="secondary" className="text-[10px]">Current Plan</Badge>
                            ) : p.name === "Institutional" ? (
                              <Button variant="afrikaOutline" size="sm">Contact Sales</Button>
                            ) : (
                              <Button variant="afrika" size="sm">Switch Plan</Button>
                            )}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ADDITION 9: Auto-Renew Credits */}
        <div className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Auto-renew Credits</p>
            <p className="text-xs text-muted-foreground">Auto purchase +10 credits when balance drops below 2</p>
          </div>
          <Switch checked={autoRenewCredits} onCheckedChange={setAutoRenewCredits} />
        </div>

        {/* ADDITION 2: Billing Alerts */}
        <div className="space-y-3">
          {billingAlerts.map((alert, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <alert.icon className={`h-4 w-4 shrink-0 ${alert.variant === "destructive" ? "text-destructive" : "text-muted-foreground"}`} />
                <p className="text-sm text-foreground">{alert.message}</p>
              </div>
              <Link to={alert.ctaUrl}>
                <Button variant="afrikaOutline" size="sm" className="shrink-0 text-xs">{alert.cta}</Button>
              </Link>
            </div>
          ))}
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
                {/* ADDITION 4: Expiration notice */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-border">
                  <Timer className="h-3 w-3 text-muted-foreground" />
                  <p className="text-[10px] text-muted-foreground">
                    Unused credits expire in <span className="text-foreground font-medium">{c.expiresIn} days</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <CreditsHowItWorksModal />
            <Link to="/dashboard/billing/credits">
              <Button variant="ghost" size="sm" className="text-xs text-accent gap-1">
                <Zap className="h-3 w-3" /> Use Credits
              </Button>
            </Link>
          </div>
        </div>

        {/* ADDITION 1: Usage Insights */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Usage This Month</h2>
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <div className="space-y-3">
              {usageBreakdown.map((u) => (
                <div key={u.label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-foreground">{u.label}</p>
                    <span className="text-xs text-muted-foreground">{u.credits} credits · {u.percent}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div className={`h-full rounded-full ${u.color}`} style={{ width: `${u.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              {usageBreakdown.map((u) => (
                <div key={u.label} className="flex items-center gap-1.5">
                  <div className={`h-2.5 w-2.5 rounded-full ${u.color}`} />
                  <span className="text-[10px] text-muted-foreground">{u.label.split(" ")[0]} {u.percent}%</span>
                </div>
              ))}
            </div>
            <Link to="/dashboard/billing/usage">
              <Button variant="ghost" size="sm" className="text-xs text-accent gap-1 mt-1">
                <Activity className="h-3 w-3" /> View Full Usage Report
              </Button>
            </Link>
          </div>
        </div>

        {/* Credit Packs */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Credit Packs (Add-Ons)</h2>

          {/* ADDITION 5: Payment feedback */}
          {purchaseState === "success" && (
            <div className="bg-afrika-green/10 border border-afrika-green/30 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-afrika-green shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Credits successfully added to your account.</p>
                <p className="text-xs text-muted-foreground">Your updated balance is reflected above.</p>
              </div>
            </div>
          )}
          {purchaseState === "error" && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Payment could not be processed.</p>
                  <p className="text-xs text-muted-foreground">Please try again or use a different payment method.</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="afrika" size="sm" onClick={() => setPurchaseState("idle")}>Retry</Button>
                <Link to="/dashboard/billing/payment-methods">
                  <Button variant="afrikaOutline" size="sm">Change Method</Button>
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {creditPacks.map((p) => (
              <div key={p.label} className="bg-card rounded-xl border border-border p-5 text-center space-y-3">
                <p.icon className="h-6 w-6 mx-auto text-accent" />
                <p className="text-sm font-bold text-foreground">{p.label}</p>
                <p className="text-lg font-bold text-accent">{p.price}</p>
                <Button variant="afrika" size="sm" className="w-full" onClick={() => handlePurchase(p.label)}>Purchase</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Credit History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Credit History</h2>
            <Select value={historyFilter} onValueChange={setHistoryFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Instrument">Instrument / Slides</SelectItem>
                <SelectItem value="Subscription">Subscription</SelectItem>
                <SelectItem value="Referral Reward">Referral Reward</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="hidden md:grid grid-cols-5 gap-2 px-5 py-3 bg-secondary text-xs font-semibold text-muted-foreground border-b border-border">
              <div>Date</div><div>Action</div><div>Credits Used</div><div>Balance After</div><div>Category</div>
            </div>
            {filteredTransactions.map((t, i) => (
              <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-2 px-5 py-3 border-b border-border text-sm">
                <span className="text-xs text-muted-foreground">{t.date}</span>
                <span className="text-xs text-foreground">{t.action}</span>
                <span className={`text-xs font-medium ${t.creditsUsed < 0 ? "text-afrika-green" : "text-foreground"}`}>
                  {t.creditsUsed < 0 ? `+${Math.abs(t.creditsUsed)}` : t.creditsUsed}
                </span>
                <span className="text-xs text-muted-foreground">{t.balanceAfter}</span>
                <Badge variant="secondary" className="text-[10px] w-fit">{t.category}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* ADDITION 6: Billing Documents / Invoices */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Billing Documents</h2>
            <Link to="/dashboard/billing/invoices">
              <Button variant="ghost" size="sm" className="text-xs text-accent">View All Invoices</Button>
            </Link>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="hidden md:grid grid-cols-5 gap-2 px-5 py-3 bg-secondary text-xs font-semibold text-muted-foreground border-b border-border">
              <div>Invoice ID</div><div>Date</div><div>Amount</div><div>Status</div><div>Actions</div>
            </div>
            {invoices.map((inv) => (
              <div key={inv.id} className="grid grid-cols-2 md:grid-cols-5 gap-2 px-5 py-3 border-b border-border text-sm items-center">
                <span className="text-xs font-mono text-foreground">{inv.id}</span>
                <span className="text-xs text-muted-foreground">{inv.date}</span>
                <span className="text-xs font-medium text-foreground">{inv.amount}</span>
                <Badge variant="secondary" className="text-[10px] w-fit">{inv.status}</Badge>
                <div className="flex gap-2">
                  <Link to={`/dashboard/billing/invoices/${inv.id}`}>
                    <Button variant="ghost" size="sm" className="text-[10px] h-7">View</Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-[10px] h-7" onClick={() => toast({ title: "Download started", description: `${inv.id}.pdf` })}>
                    PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ADDITION 10: Billing Activity Timeline */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Billing Activity Timeline</h2>
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="relative">
              <div className="absolute left-2.5 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                {billingTimeline.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 relative">
                    <div className={`h-5 w-5 rounded-full shrink-0 flex items-center justify-center z-10 ${
                      item.type === "payment" ? "bg-accent" :
                      item.type === "purchase" ? "bg-primary" :
                      item.type === "reward" ? "bg-afrika-green" :
                      "bg-secondary"
                    }`}>
                      <div className="h-2 w-2 rounded-full bg-background" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{item.event}</p>
                      <p className="text-[10px] text-muted-foreground">{item.date}, 2026</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Referral (ADDITION 7: Enhanced) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-foreground">Referral Program</h2>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <p className="text-sm text-muted-foreground">Invite researchers and earn free credits when they subscribe.</p>

            {/* Referral Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-foreground">Referral Progress</p>
                <span className="text-xs text-muted-foreground">{referrals.length} / 5 referrals</span>
              </div>
              <Progress value={(referrals.length / 5) * 100} className="h-2" />
              <p className="text-[10px] text-muted-foreground">Next milestone: 5 referrals → 1 month free</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-secondary rounded-lg p-3"><p className="text-xl font-bold text-foreground">{referrals.length}</p><p className="text-[10px] text-muted-foreground">Total Referrals</p></div>
              <div className="bg-secondary rounded-lg p-3"><p className="text-xl font-bold text-foreground">{referrals.filter((r) => r.active).length}</p><p className="text-[10px] text-muted-foreground">Active</p></div>
              <div className="bg-secondary rounded-lg p-3"><p className="text-xl font-bold text-accent">15</p><p className="text-[10px] text-muted-foreground">Credits Earned</p></div>
              <div className="bg-secondary rounded-lg p-3"><p className="text-xl font-bold text-muted-foreground">5</p><p className="text-[10px] text-muted-foreground">Pending</p></div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Your Referral Code</p>
              <div className="flex gap-2">
                <Input readOnly value={referralCode} className="font-mono text-sm" />
                <Button variant="outline" size="sm" className="gap-1 shrink-0" onClick={handleCopyCode}><Copy className="h-3 w-3" /> Copy</Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Referral Link</p>
              <div className="flex gap-2">
                <Input readOnly value={referralLink} className="font-mono text-xs" />
                <Button variant="outline" size="sm" className="gap-1 shrink-0" onClick={handleCopyLink}><Copy className="h-3 w-3" /> Copy Link</Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="afrika" size="sm" className="gap-1" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join Afrika Scholar using my referral link: ${referralLink}`)}`, "_blank")}>
                <ExternalLink className="h-3 w-3" /> WhatsApp
              </Button>
              <Button variant="afrikaBlue" size="sm" className="gap-1" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`, "_blank")}>
                <ExternalLink className="h-3 w-3" /> LinkedIn
              </Button>
              <Button variant="afrikaOutline" size="sm" className="gap-1" onClick={() => window.open(`mailto:?subject=${encodeURIComponent("Join Afrika Scholar")}&body=${encodeURIComponent(`Check out Afrika Scholar: ${referralLink}`)}`)}>
                <Mail className="h-3 w-3" /> Email
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Invited Users</p>
              {referrals.map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">{r.name[0]}</div>
                    <span className="text-sm text-foreground">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">{r.status}</Badge>
                    <span className="text-xs text-muted-foreground">{r.reward}</span>
                  </div>
                </div>
              ))}
            </div>

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

        {/* ADDITION 8: Spending Limit Controls */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Spending Controls</h2>
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Monthly Spending Limit</p>
                <p className="text-xs text-muted-foreground">Disable credit purchases when limit is reached</p>
              </div>
              <Switch checked={spendingLimitEnabled} onCheckedChange={setSpendingLimitEnabled} />
            </div>
            {spendingLimitEnabled && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">₦</span>
                  <Input
                    type="number"
                    value={spendingLimit}
                    onChange={(e) => setSpendingLimit(e.target.value)}
                    className="w-40"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Credit purchases will be disabled when you reach ₦{parseInt(spendingLimit).toLocaleString()} in a billing period.
                </p>
                <Button variant="afrika" size="sm" onClick={() => toast({ title: "Spending limit saved" })}>
                  Save Limit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingPage;
