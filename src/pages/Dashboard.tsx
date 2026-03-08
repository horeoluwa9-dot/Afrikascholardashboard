import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditsHowItWorksModal } from "@/components/dashboard/CreditsModal";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText, Database, BarChart3, Send, Wrench, Compass,
  ArrowRight, Newspaper, CalendarClock, Users2, TrendingUp, Eye,
} from "lucide-react";

const credits = [
  { label: "Paper Credits", used: 5, total: 25, color: "bg-accent" },
  { label: "Dataset Credits", used: 0, total: 25, color: "bg-primary" },
  { label: "Analysis Credits", used: 10, total: 35, color: "bg-afrika-green" },
];

const quickActions = [
  { icon: FileText, title: "Generate Paper", desc: "Get started", link: "/dashboard/generate-paper" },
  { icon: Database, title: "Explore Datasets", desc: "Get started", link: "/dashboard/data/explorer" },
  { icon: BarChart3, title: "Analyze Data", desc: "Get started", link: "/dashboard/data/analyzer" },
  { icon: Send, title: "Submit to Journal", desc: "Get started", link: "/dashboard/publishing/submit" },
  { icon: Wrench, title: "Build Instrument", desc: "Get started", link: "/dashboard/instrument-studio" },
  { icon: Compass, title: "Intelligence Insights", desc: "Get started", link: "/dashboard/intelligence" },
];

const recentActivity = [
  { text: 'You generated a paper titled "AI in African Health Systems"', time: "2 hours ago", link: "/dashboard/my-papers" },
  { text: "Your dataset analysis is complete", time: "5 hours ago", link: "/dashboard/data/analyzer" },
  { text: "A journal match is available", time: "1 day ago", link: "/dashboard/intelligence?tab=journals" },
  { text: "Conference deadline in 5 days", time: "1 day ago", link: "/dashboard/intelligence?tab=conferences" },
  { text: "Someone commented in Community", time: "2 days ago", link: "/dashboard/community" },
];

const recentPapers = [
  { id: 1, title: "The Effects of AI-Driven Health Diagnostics on Clinical Outcomes in Sub-Saharan Africa", status: "Draft", views: 0 },
  { id: 2, title: "Digital Financial Inclusion and Economic Growth in East Africa", status: "Submitted", views: 34 },
  { id: 3, title: "Climate Change Effects on Agricultural Productivity in West Africa", status: "Published", views: 128 },
];

const statusColors: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  Submitted: "bg-primary/10 text-primary",
  Published: "bg-afrika-green/10 text-afrika-green",
};

const Dashboard = () => {
  const { profile, role } = useAuth();
  const displayName = profile?.display_name || "Researcher";

  return (
  <DashboardLayout>
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {displayName} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {role === "institutional_admin"
            ? "Manage your institution's research output, users, and analytics."
            : role === "reviewer"
            ? "Review manuscripts, track submissions, and manage your review queue."
            : role === "student"
            ? "Explore datasets, generate papers, and sharpen your research skills."
            : "Manage your research, publishing, and intelligence tools from one workspace."}
        </p>
      </div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, Defi 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your research, publishing, and intelligence tools from one workspace.
        </p>
      </div>

      {/* Credit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {credits.map((c) => (
          <div key={c.label} className="bg-card rounded-xl p-5 border border-border">
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-foreground">{c.total - c.used}</span>
              <span className="text-sm text-muted-foreground">/ {c.total}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full mt-3">
              <div className={`h-full rounded-full ${c.color}`} style={{ width: `${(c.used / c.total) * 100}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{c.used} / {c.total} used</p>
          </div>
        ))}
      </div>
      <CreditsHowItWorksModal />

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((a) => (
            <Link key={a.title} to={a.link} className="bg-card rounded-xl p-5 border border-border flex items-center gap-4 hover:shadow-md transition-shadow group">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <a.icon className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {a.desc} <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity + Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {recentActivity.map((item, i) => (
              <Link key={i} to={item.link} className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/50 transition-colors">
                <p className="text-sm text-foreground">{item.text}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Intelligence Insights</h2>
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            {[
              { icon: Newspaper, label: "Top journal match", value: "African Journal of Science", link: "/dashboard/intelligence?tab=journals" },
              { icon: CalendarClock, label: "Upcoming conference", value: "Pan-African Research Summit", link: "/dashboard/intelligence?tab=conferences" },
              { icon: TrendingUp, label: "Trending topic", value: "AI Ethics in Education", link: "/dashboard/intelligence?tab=trends" },
              { icon: Users2, label: "Suggested collaborator", value: "Dr. Amina Osei", link: "/dashboard/intelligence?tab=stakeholders" },
            ].map((insight) => (
              <Link key={insight.label} to={insight.link} className="flex items-start gap-3 hover:bg-secondary/30 rounded-lg p-1 -m-1 transition-colors">
                <insight.icon className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{insight.label}</p>
                  <p className="text-sm font-medium text-foreground">{insight.value}</p>
                </div>
              </Link>
            ))}
            <Link to="/dashboard/intelligence">
              <Button variant="afrikaOutline" size="sm" className="w-full mt-2">Open Intelligence Hub</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Papers - shows actual papers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Recent Papers</h2>
          <Link to="/dashboard/my-papers">
            <Button variant="ghost" size="sm" className="text-xs gap-1">View All <ArrowRight className="h-3 w-3" /></Button>
          </Link>
        </div>
        <div className="space-y-3">
          {recentPapers.map((paper) => (
            <Link key={paper.id} to="/dashboard/my-papers" className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-sm transition-shadow block">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">{paper.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <Badge className={`text-[10px] ${statusColors[paper.status]}`}>{paper.status}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Eye className="h-3 w-3" /> {paper.views}</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 ml-4" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default Dashboard;
