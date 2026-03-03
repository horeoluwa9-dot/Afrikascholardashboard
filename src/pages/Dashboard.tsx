import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CreditsHowItWorksModal } from "@/components/dashboard/CreditsModal";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  FileText,
  Database,
  BarChart3,
  Send,
  Wrench,
  Compass,
  ArrowRight,
  Newspaper,
  CalendarClock,
  Users2,
  TrendingUp,
  MessageCircle,
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
  { text: "A journal match is available", time: "1 day ago", link: "/dashboard/intelligence/journals" },
  { text: "Conference deadline in 5 days", time: "1 day ago", link: "/dashboard/intelligence/conferences" },
  { text: "Someone commented in Community", time: "2 days ago", link: "/dashboard/community" },
];

const Dashboard = () => (
  <DashboardLayout>
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
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
              <div
                className={`h-full rounded-full ${c.color}`}
                style={{ width: `${(c.used / c.total) * 100}%` }}
              />
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
            <Link
              key={a.title}
              to={a.link}
              className="bg-card rounded-xl p-5 border border-border flex items-center gap-4 hover:shadow-md transition-shadow group"
            >
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
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {recentActivity.map((item, i) => (
              <Link
                key={i}
                to={item.link}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/50 transition-colors"
              >
                <p className="text-sm text-foreground">{item.text}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Intelligence Preview */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Intelligence Insights</h2>
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            {[
              { icon: Newspaper, label: "Top journal match", value: "African Journal of Science" },
              { icon: CalendarClock, label: "Upcoming conference", value: "Pan-African Research Summit" },
              { icon: TrendingUp, label: "Trending topic", value: "AI Ethics in Education" },
              { icon: Users2, label: "Suggested collaborator", value: "Dr. Amina Osei" },
            ].map((insight) => (
              <div key={insight.label} className="flex items-start gap-3">
                <insight.icon className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{insight.label}</p>
                  <p className="text-sm font-medium text-foreground">{insight.value}</p>
                </div>
              </div>
            ))}
            <Link to="/dashboard/intelligence">
              <Button variant="afrikaOutline" size="sm" className="w-full mt-2">
                Open Intelligence Hub
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Papers */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Recent Papers</h2>
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground mt-3">No papers generated yet.</p>
          <Link
            to="/dashboard/generate-paper"
            className="text-sm text-accent font-medium hover:underline mt-1 inline-flex items-center gap-1"
          >
            Generate your first paper <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default Dashboard;
