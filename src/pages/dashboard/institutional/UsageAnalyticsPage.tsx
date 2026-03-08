import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users2, FileText, Clock, TrendingUp, Download } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const METRICS = [
  { label: "Monthly Active Users", value: 14, change: "+3", icon: Users2, bg: "bg-accent/10", color: "text-accent" },
  { label: "Papers Generated", value: 47, change: "+12", icon: FileText, bg: "bg-afrika-green/10", color: "text-afrika-green" },
  { label: "Avg. Session Duration", value: "24 min", change: "+5 min", icon: Clock, bg: "bg-primary/10", color: "text-primary" },
  { label: "Platform Adoption", value: "72%", change: "+8%", icon: TrendingUp, bg: "bg-afrika-orange-light", color: "text-afrika-orange" },
];

const MODULE_USAGE = [
  { module: "Paper Generator", pct: 85 },
  { module: "Dataset Explorer", pct: 62 },
  { module: "Intelligence Hub", pct: 48 },
  { module: "Publishing", pct: 71 },
  { module: "Instrument Studio", pct: 35 },
];

const TOP_USERS = [
  { name: "Prof. Kwame Asante", papers: 8, sessions: 42 },
  { name: "Dr. Ama Mensah", papers: 6, sessions: 38 },
  { name: "Dr. Ngozi Okafor", papers: 5, sessions: 29 },
  { name: "Dr. Fatima Bello", papers: 4, sessions: 25 },
  { name: "Dr. Tunde Adeyemi", papers: 3, sessions: 20 },
];

export default function UsageAnalyticsPage() {
  const handleExport = () => {
    toast.success("Analytics report exported successfully");
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Usage Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">Monitor how your institution uses the platform.</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {METRICS.map(m => (
            <Card key={m.label} className="border-border">
              <CardContent className="pt-5 pb-4 px-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{m.value}</p>
                  <p className="text-xs text-afrika-green mt-0.5">{m.change} this month</p>
                </div>
                <div className={`h-10 w-10 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <m.icon className={`h-5 w-5 ${m.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader><CardTitle className="text-base">Module Usage</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {MODULE_USAGE.map(m => (
                <div key={m.module}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-foreground font-medium">{m.module}</span>
                    <span className="text-muted-foreground">{m.pct}%</span>
                  </div>
                  <Progress value={m.pct} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader><CardTitle className="text-base">Top Active Users</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {TOP_USERS.map((u, i) => (
                  <Link
                    key={i}
                    to={`/dashboard/researcher?user=${encodeURIComponent(u.name)}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                        {u.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-foreground">{u.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{u.papers} papers · {u.sessions} sessions</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
