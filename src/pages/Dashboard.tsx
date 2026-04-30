import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditsHowItWorksModal } from "@/components/dashboard/CreditsModal";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WelcomePanel from "@/components/dashboard/WelcomePanel";
import ResearchIdentityCard from "@/components/dashboard/ResearchIdentityCard";
import { SubscriptionUnlockPanel } from "@/components/dashboard/SubscriptionUnlockPanel";
import { SubscriptionStatusWidget } from "@/components/dashboard/SubscriptionStatusWidget";
import ResearcherDashboard from "@/components/dashboard/home/ResearcherDashboard";
import AcademicDashboard from "@/components/dashboard/home/AcademicDashboard";
import ProfessionalDashboard from "@/components/dashboard/home/ProfessionalDashboard";
import NewUserDashboard from "@/components/dashboard/NewUserDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { useModuleUnlocksContext } from "@/contexts/ModuleUnlocksContext";

const Dashboard = () => {
  const { profile, role, userType } = useAuth();
  const { subscription, isActive } = useSubscriptionContext();
  const { unlockedModules } = useModuleUnlocksContext();
  const displayName = profile?.display_name || "Researcher";
  const currentUserType = userType || "researcher";

  // Detect if the user has any meaningful activity — if so, hide the onboarding panel
  const hasActivity = (unlockedModules && unlockedModules.size > 0) || isActive;

  // Brand-new user just out of onboarding — show focused first-action dashboard
  if (!hasActivity) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          <NewUserDashboard />
        </div>
      </DashboardLayout>
    );
  }

  const subtitleMap: Record<string, string> = {
    researcher: "Manage your research, publishing, and intelligence tools from one workspace.",
    academic: "Manage publishing, peer reviews, editorial tasks, and academic collaboration.",
    professional: "Discover research partnerships, consulting opportunities, and academic networks.",
  };

  const credits = isActive && subscription ? [
    { label: "Paper Credits", used: subscription.paper_credits_used, total: subscription.paper_credits_total, color: "bg-accent" },
    { label: "Dataset Credits", used: subscription.dataset_credits_used, total: subscription.dataset_credits_total, color: "bg-primary" },
    { label: "Analysis Credits", used: subscription.analysis_credits_used, total: subscription.analysis_credits_total, color: "bg-afrika-green" },
  ] : [];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {displayName} 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {subtitleMap[currentUserType] || subtitleMap.researcher}
          </p>
        </div>

        {/* Research Identity Card */}
        <ResearchIdentityCard />

        {/* Welcome Panel — only for brand-new users with zero activity */}
        {!hasActivity && <WelcomePanel />}

        {/* Subscription Status Widget (active users) */}
        {isActive && <SubscriptionStatusWidget />}

        {/* INACTIVE: Show unlock panel */}
        {!isActive && <SubscriptionUnlockPanel />}

        {/* Credit Cards (active subscribers) */}
        {isActive && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {credits.map((c) => {
                const remaining = c.total - c.used;
                const isZero = remaining <= 0;
                return (
                  <div key={c.label} className="bg-card rounded-xl p-5 border border-border">
                    <p className="text-xs text-muted-foreground">{c.label}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`text-2xl font-bold ${isZero ? "text-destructive" : "text-foreground"}`}>{remaining.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">/ {c.total.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full mt-3">
                      <div className={`h-full rounded-full ${isZero ? "bg-destructive" : c.color}`} style={{ width: `${(c.used / c.total) * 100}%` }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{c.used} / {c.total} used</p>
                    {isZero && (
                      <div className="mt-2 p-2 bg-destructive/5 rounded-md">
                        <p className="text-[10px] text-destructive font-medium">You have used all credits this month.</p>
                        <div className="flex gap-2 mt-1">
                          <Link to="/publeesh/subscription" className="text-[10px] text-accent font-medium hover:underline">Buy Credits</Link>
                          <Link to="/publeesh/subscription" className="text-[10px] text-accent font-medium hover:underline">Upgrade Plan</Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <CreditsHowItWorksModal />
          </>
        )}

        {/* User-type specific dashboard content — always rendered */}
        {currentUserType === "academic" && <AcademicDashboard />}
        {currentUserType === "professional" && <ProfessionalDashboard />}
        {currentUserType === "researcher" && <ResearcherDashboard />}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
