import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users, FileText, CheckCircle, ArrowRight, TrendingUp, CreditCard,
  ClipboardList, Shield, BarChart3, Network,
} from "lucide-react";

const sampleAdminActivity = [
  { title: "Dr. Ngozi Okafor invited to platform", type: "Faculty Invite", date: "2026-03-07", icon: Users, link: "/dashboard/institutional/admin/faculty" },
  { title: "3 new seats purchased", type: "Seat Update", date: "2026-03-06", icon: CreditCard, link: "/dashboard/institutional/admin/seats" },
  { title: "Q1 2026 Report generated", type: "Report Ready", date: "2026-03-05", icon: ClipboardList, link: "/dashboard/institutional/admin/reports" },
  { title: "Platform adoption reached 72%", type: "Analytics", date: "2026-03-04", icon: TrendingUp, link: "/dashboard/institutional/admin/analytics" },
];

const adminStats = [
  { label: "Faculty Users", value: 18, icon: Users, color: "text-accent", bg: "bg-accent/10" },
  { label: "Seats Available", value: 7, icon: CreditCard, color: "text-afrika-green", bg: "bg-afrika-green/10" },
  { label: "Research Output", value: 142, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
  { label: "Platform Adoption", value: "72%", icon: TrendingUp, color: "text-afrika-orange", bg: "bg-afrika-orange-light" },
];

const adminActions = [
  { title: "Faculty Users", desc: "Manage faculty members and invites", icon: Users, color: "text-accent", bg: "bg-accent/10", link: "/dashboard/institutional/admin/faculty" },
  { title: "Seat Management", desc: "Allocate and purchase seats", icon: CreditCard, color: "text-primary", bg: "bg-primary/10", link: "/dashboard/institutional/admin/seats" },
  { title: "Usage Analytics", desc: "Monitor platform adoption", icon: BarChart3, color: "text-afrika-green", bg: "bg-afrika-green/10", link: "/dashboard/institutional/admin/analytics" },
  { title: "Research Output", desc: "Track publications and impact", icon: TrendingUp, color: "text-afrika-orange", bg: "bg-afrika-orange-light", link: "/dashboard/institutional/admin/research-output" },
  { title: "Reports", desc: "Generate and download reports", icon: ClipboardList, color: "text-accent", bg: "bg-accent/10", link: "/dashboard/institutional/admin/reports" },
];

const InstitutionalOverview = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Institutional Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage institutional administration, faculty, and platform operations.
          </p>
        </div>

        {/* Network Marketplace Banner */}
        <Card className="border-border bg-gradient-to-r from-accent/5 to-primary/5">
          <CardContent className="py-5 px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Network className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Academic Collaboration Marketplace</p>
                  <p className="text-xs text-muted-foreground">Post opportunities, hire academics, and manage engagements in the Network module.</p>
                </div>
              </div>
              <Link to="/dashboard/network">
                <div className="flex items-center gap-2 text-accent text-sm font-medium hover:underline whitespace-nowrap">
                  Go to Network <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Administration Section */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Administration</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {adminStats.map(s => (
              <Card key={s.label} className="border-border">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-muted-foreground">{s.label}</p>
                      <p className="text-xl font-bold text-foreground mt-0.5">{s.value}</p>
                    </div>
                    <div className={`h-9 w-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Recent Admin Activity</p>
              <Card className="border-border">
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {sampleAdminActivity.map((a, i) => (
                      <Link key={i} to={a.link} className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/50 transition-colors">
                        <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                          <a.icon className="h-4 w-4 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                          <Badge variant="secondary" className="text-[10px] mt-0.5">{a.type}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Quick Actions</p>
              <div className="space-y-2">
                {adminActions.map(a => (
                  <Link key={a.title} to={a.link}>
                    <Card className="border-border hover:shadow-sm transition-shadow cursor-pointer">
                      <CardContent className="py-3 px-4 flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg ${a.bg} flex items-center justify-center shrink-0`}>
                          <a.icon className={`h-4 w-4 ${a.color}`} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{a.title}</p>
                          <p className="text-[11px] text-muted-foreground">{a.desc}</p>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default InstitutionalOverview;
