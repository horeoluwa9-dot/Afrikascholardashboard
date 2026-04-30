import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, BookOpen, Globe, Compass, FileText, Building2, Brain, Star, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth, AccountType } from "@/contexts/AuthContext";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { useModuleUnlocksContext } from "@/contexts/ModuleUnlocksContext";
import { ModuleType } from "@/hooks/useModuleUnlocks";
import { toast } from "sonner";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const roleBadge: Record<AccountType, { label: string; className: string }> = {
  researcher: { label: "Researcher", className: "bg-primary/10 text-primary border-primary/20" },
  lecturer: { label: "Lecturer", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  institution: { label: "Institution", className: "bg-blue-500/10 text-blue-700 border-blue-500/20" },
  advisory_client: { label: "Advisory Client", className: "bg-amber-500/10 text-amber-700 border-amber-500/20" },
};

type Action = {
  id: "publish" | "ai" | "network" | "advisory";
  title: string;
  desc: string;
  cta: string;
  href: string;
  module: ModuleType;
  icon: any;
};

export default function ActivationDashboard() {
  const navigate = useNavigate();
  const { profile, accountType } = useAuth();
  const { isActive: hasSubscription } = useSubscriptionContext();
  const { unlockModule, unlockedModules } = useModuleUnlocksContext();

  const name = profile?.display_name?.split(" ")[0] || "there";
  const type = (accountType || "researcher") as AccountType;
  const badge = roleBadge[type];
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  const recommended: Action["id"] = useMemo(() => {
    if (type === "lecturer" || type === "institution") return "network";
    if (type === "advisory_client") return "advisory";
    return "publish";
  }, [type]);

  const actions: Action[] = [
    {
      id: "publish",
      title: "Publish Research",
      desc: "Publish and manage your research",
      cta: "Start Publishing",
      href: "/dashboard/publishing/submit",
      module: "publishing",
      icon: FileText,
    },
    {
      id: "ai",
      title: "Use AI Research Tools",
      desc: "Generate, analyse, and accelerate your research",
      cta: hasSubscription ? "Open Workspace" : "Start Free Trial",
      href: hasSubscription ? "/dashboard/intelligence?tab=journals" : "/publeesh/subscription",
      module: "research_intelligence",
      icon: Brain,
    },
    {
      id: "network",
      title: "Join Academic Network",
      desc: "Access opportunities and earn from your expertise",
      cta: "Join Network",
      href: "/dashboard/network",
      module: "publishing", // network not in ModuleType list — reuse closest; sidebar toggles via unlock
      icon: Globe,
    },
    {
      id: "advisory",
      title: "Get Advisory Support",
      desc: "Request transcripts and academic guidance",
      cta: "Start Request",
      href: "/dashboard/advisory",
      module: "publishing",
      icon: Compass,
    },
  ];

  const previews = [
    { title: "Publishing", desc: "Submit, review, and track manuscripts", icon: FileText },
    { title: "Network", desc: "Connect with researchers and earn", icon: Globe },
    { title: "Advisory", desc: "Transcripts and academic guidance", icon: Compass },
    { title: "Research Intelligence", desc: "AI-powered tools for research", icon: Brain },
  ];

  const handleAction = async (a: Action) => {
    await unlockModule(a.module);
    toast.success(`✔ ${a.title.replace("Use ", "").replace("Get ", "").replace("Join ", "").replace("Publish ", "Publishing ")} activated`);
    navigate(a.href);
  };

  return (
    <div className="max-w-[1040px] mx-auto space-y-8">
      {/* SECTION 1 — Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold text-foreground leading-tight">
            {greeting()}, {name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className={`text-xs font-medium ${badge.className}`}>
              {badge.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Your dashboard is ready. Let's start with your first action.
          </p>
        </div>
        <p className="text-xs text-muted-foreground hidden sm:block whitespace-nowrap">{today}</p>
      </div>

      {/* SECTION 2 — Primary action grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((a) => {
          const isRec = a.id === recommended;
          return (
            <div
              key={a.id}
              className={`relative bg-card rounded-2xl p-6 border transition-all hover:shadow-md ${
                isRec ? "border-primary/40 shadow-sm ring-1 ring-primary/20" : "border-border"
              }`}
            >
              {isRec && (
                <div className="absolute -top-2 left-4 inline-flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  <Star className="h-3 w-3 fill-current" /> Recommended
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                  isRec ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                }`}>
                  <a.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{a.desc}</p>
                  <Button
                    onClick={() => handleAction(a)}
                    size="sm"
                    className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {a.cta}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 3 — Module preview */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Available features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {previews.map((p) => (
            <div key={p.title} className="bg-muted/40 rounded-xl p-4 border border-dashed border-border opacity-70">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground">
                  <p.icon className="h-4 w-4" />
                </div>
                <Lock className="h-3 w-3 text-muted-foreground ml-auto" />
              </div>
              <p className="text-sm font-semibold text-foreground mt-3">{p.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
              <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wide">Unlock by getting started</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4 — Continue exploring (after first action) */}
      {unlockedModules.size > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Continue exploring Afrika Scholar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {actions.filter((a) => a.id !== recommended).map((a) => (
              <Link
                key={a.id}
                to={a.href}
                onClick={() => unlockModule(a.module)}
                className="bg-card rounded-xl p-4 border border-border hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-primary">
                  <a.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-foreground mt-3">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}