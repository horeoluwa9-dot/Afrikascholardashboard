import { Link, useNavigate } from "react-router-dom";
import { useAuth, AccountType } from "@/contexts/AuthContext";
import { useModuleUnlocksContext } from "@/contexts/ModuleUnlocksContext";
import { ModuleType } from "@/hooks/useModuleUnlocks";
import { ArrowRight, Sparkles, FileText, Users2, Compass, Briefcase, GraduationCap, BookOpen, UserPlus, ClipboardList, Search, FolderOpen } from "lucide-react";

type RoleKey = "researcher" | "lecturer" | "student" | "institution";

function resolveRoleKey(accountType: AccountType | null): RoleKey {
  if (accountType === "lecturer") return "lecturer";
  if (accountType === "institution") return "institution";
  if (accountType === "advisory_client") return "student";
  return "researcher";
}

const greetingByHour = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const roleBadge: Record<RoleKey, { label: string; bg: string; text: string; dot: string }> = {
  researcher: { label: "Researcher", bg: "bg-[#EDE9FE]", text: "text-primary", dot: "bg-primary" },
  lecturer: { label: "Lecturer", bg: "bg-[#EDE9FE]", text: "text-primary", dot: "bg-primary" },
  student: { label: "Advisory Client", bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  institution: { label: "Institution", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
};

const subtextByRole: Record<RoleKey, string> = {
  researcher: "You're in. Now let's build your academic presence.",
  lecturer: "You're in. Let's contribute, review, and lead in your field.",
  student: "You're in. Let's move your academic journey forward.",
  institution: "You're in. Let's find the right talent and drive results.",
};

interface ActionCard {
  title: string;
  description: string;
  cta: string;
  link: string;
  badge?: string;
  primary?: boolean;
  icon: any;
  unlockModule?: ModuleType;
}

const actionsByRole: Record<RoleKey, ActionCard[]> = {
  researcher: [
    { title: "Publish your research", description: "Submit your work, track reviews, and publish your research.", cta: "Submit a paper", link: "/dashboard/publishing/submit", badge: "Recommended", primary: true, icon: FileText, unlockModule: "publishing" },
    { title: "Use Publeesh AI", description: "Generate papers, run literature reviews, and analyse data with AI.", cta: "Try Publeesh", link: "/dashboard/generate-paper", badge: "Popular", icon: Sparkles, unlockModule: "research_intelligence" },
    { title: "Join the academic network", description: "Access teaching and research opportunities and earn from your expertise.", cta: "Join network", link: "/dashboard/network", icon: Users2, unlockModule: "network" },
    { title: "Get advisory support", description: "Get help with transcripts, degree guidance, and academic pathways.", cta: "Start a request", link: "/dashboard/advisory", icon: Compass, unlockModule: "advisory" },
  ],
  lecturer: [
    { title: "Review and contribute to research", description: "Review submissions, provide expert feedback, and contribute to academic work.", cta: "Start reviewing", link: "/dashboard/publishing/reviews", badge: "Recommended", primary: true, icon: ClipboardList, unlockModule: "publishing" },
    { title: "Publish your research", description: "Submit your work, track peer reviews, and publish your research.", cta: "Submit a paper", link: "/dashboard/publishing/submit", icon: FileText, unlockModule: "publishing" },
    { title: "Join the academic network", description: "Access teaching, supervision, and research opportunities across institutions.", cta: "Explore network", link: "/dashboard/network", icon: Users2, unlockModule: "network" },
    { title: "Use AI research assistant", description: "Generate content, analyse literature, and support your academic workflow with AI.", cta: "Use AI tools", link: "/dashboard/generate-paper", badge: "Popular", icon: Sparkles, unlockModule: "research_intelligence" },
  ],
  student: [
    { title: "Get academic guidance", description: "Get help with your academic path, transcripts, and next steps.", cta: "Start guidance", link: "/dashboard/advisory", badge: "Recommended", primary: true, icon: Compass, unlockModule: "advisory" },
    { title: "Explore opportunities", description: "Find programs, research opportunities, and academic pathways.", cta: "Explore opportunities", link: "/dashboard/advisory/pathways", icon: GraduationCap, unlockModule: "advisory" },
    { title: "Use AI research assistant", description: "Generate ideas, summarise articles, and get help with assignments.", cta: "Use AI", link: "/dashboard/generate-paper", badge: "Popular", icon: Sparkles, unlockModule: "research_intelligence" },
    { title: "Build your academic profile", description: "Add your interests, skills, and goals to unlock better opportunities.", cta: "Complete profile", link: "/dashboard/profile", icon: UserPlus },
  ],
  institution: [
    { title: "Post a request", description: "Post a research, teaching, or advisory request and get matched with experts.", cta: "Post a request", link: "/dashboard/institutional/lecturer-requests", badge: "Recommended", primary: true, icon: FileText, unlockModule: "institutional" },
    { title: "Find researchers", description: "Browse and connect with qualified academics across disciplines.", cta: "Find researchers", link: "/dashboard/institutional", icon: Search, unlockModule: "institutional" },
    { title: "Manage projects and collaborations", description: "Track ongoing requests, collaborations, and academic engagements.", cta: "View projects", link: "/dashboard/institutional/research-collaboration", icon: FolderOpen, unlockModule: "institutional" },
    { title: "Review submissions", description: "Review incoming applications, proposals, and expert responses.", cta: "View submissions", link: "/dashboard/institutional/my-requests", icon: ClipboardList, unlockModule: "institutional" },
  ],
};

const heroByRole: Record<RoleKey, { heading: string; body: string }> = {
  researcher: { heading: "Your dashboard is ready, choose your first step", body: "Start with one action below. You can explore everything else anytime." },
  lecturer: { heading: "Your dashboard is ready, choose your first step", body: "Start with one action below. You can explore everything else anytime." },
  student: { heading: "Your dashboard is ready, choose your first step", body: "Start with one action below. You can explore everything else anytime." },
  institution: { heading: "Your dashboard is ready, choose your first step", body: "Start with one action below. You can explore everything else anytime." },
};

const lowFrictionByRole: Record<RoleKey, { title: string; text: string }> = {
  researcher: { title: "Not sure where to start?", text: "Browse journals and explore published research across Africa." },
  lecturer: { title: "Prefer to explore first?", text: "Browse journals, discover new research, and stay updated in your field." },
  student: { title: "Not sure where to start?", text: "Browse journals and explore research to discover your interests." },
  institution: { title: "Want to explore first?", text: "Browse published research and see the kind of work available on Afrika Scholar." },
};

export default function NewUserDashboard() {
  const { profile, accountType } = useAuth();
  const { unlockModule } = useModuleUnlocksContext();
  const navigate = useNavigate();
  const roleKey = resolveRoleKey(accountType);
  const badge = roleBadge[roleKey];
  const hero = heroByRole[roleKey];
  const actions = actionsByRole[roleKey];
  const lowFriction = lowFrictionByRole[roleKey];
  const firstName = (profile?.display_name || "there").split(" ")[0];

  const handleActionClick = async (e: React.MouseEvent, a: ActionCard) => {
    if (a.unlockModule) {
      e.preventDefault();
      await unlockModule(a.unlockModule);
      navigate(a.link);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome header — no card */}
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-[22px] font-semibold text-foreground leading-tight">
            {greetingByHour()}, {firstName}
          </h1>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${badge.bg} ${badge.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
            {badge.label}
          </span>
        </div>
        <p className="text-[13px] text-muted-foreground mt-1">{subtextByRole[roleKey]}</p>
      </div>

      {/* SECTION 1 — Hero action banner */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="space-y-3">
            <h2 className="text-[18px] font-semibold text-foreground">{hero.heading}</h2>
            <p className="text-[13px] text-muted-foreground">{hero.body}</p>
            <div className="pt-2 space-y-2">
              <div className="h-1.5 w-full rounded-full bg-[#EDE9FE]">
                <div className="h-full rounded-full bg-primary" style={{ width: "15%" }} />
              </div>
              <p className="text-[12px] text-primary font-medium">You're just getting started</p>
            </div>
          </div>
          <div className="hidden md:flex h-28 w-40 rounded-xl bg-[#EDE9FE] items-center justify-center">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
        </div>
      </div>

      {/* SECTION 2 — Primary action grid */}
      <div>
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-3">Choose where to begin</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((a) => (
            <Link
              key={a.title}
              to={a.link}
              onClick={(e) => handleActionClick(e, a)}
              className={`group block rounded-2xl p-5 transition-all hover:shadow-md ${
                a.primary
                  ? "border-2 border-primary bg-[#EDE9FE]/40"
                  : "border border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-[#EDE9FE] flex items-center justify-center shrink-0">
                  <a.icon className="h-5 w-5 text-primary" />
                </div>
                {a.badge && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    a.primary ? "bg-primary text-primary-foreground" : "bg-accent/15 text-accent"
                  }`}>
                    {a.badge}
                  </span>
                )}
              </div>
              <h3 className="text-[15px] font-semibold text-foreground mb-1.5">{a.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">{a.description}</p>
              <span className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${
                a.primary
                  ? "bg-primary text-primary-foreground px-4 py-2 rounded-lg group-hover:bg-primary/90"
                  : "text-primary group-hover:gap-2 transition-all"
              }`}>
                {a.cta} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* SECTION 3 — Low-friction entry */}
      <Link
        to="/dashboard/library?tab=subscriptions"
        className="block bg-card rounded-2xl border border-border p-5 hover:shadow-sm transition-all group"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-foreground">{lowFriction.title}</h3>
              <p className="text-[13px] text-muted-foreground mt-0.5">{lowFriction.text}</p>
            </div>
          </div>
          <span className="text-[13px] font-semibold text-primary inline-flex items-center gap-1.5 group-hover:gap-2 transition-all">
            Browse journals <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>

      {/* SECTION 4 — Social proof */}
      <div>
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-3">Platform activity</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { stat: "2,000+", label: "Articles published" },
            { stat: "1,300+", label: "Academics in network" },
            { stat: "240+", label: "Institutions served" },
          ].map((item) => (
            <div key={item.label} className="bg-card rounded-xl border border-border p-4">
              <p className="text-[20px] font-bold text-foreground">{item.stat}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5 — Recent activity (empty state) */}
      <div>
        <h2 className="text-[15px] font-semibold text-foreground mb-3">Recent activity</h2>
        <div className="bg-card rounded-xl border border-border border-dashed p-8 text-center">
          <p className="text-[14px] font-medium text-foreground">No activity yet</p>
          <p className="text-[13px] text-muted-foreground mt-1">Your activity will appear here once you get started.</p>
        </div>
      </div>
    </div>
  );
}