import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, FileText, Handshake, CheckCircle, ArrowRight, Building2, Search, Plus,
  TrendingUp, Briefcase, BarChart3, CreditCard, ClipboardList, Shield,
} from "lucide-react";
import { useInstitutional } from "@/hooks/useInstitutional";

const sampleEngagementActivity = [
  { title: "Renewable Energy Policy Advisory", type: "Talent Request", date: "2026-03-06", icon: FileText, link: "/dashboard/institutional/talent-requests" },
  { title: "Dr. Kofi Mensah — Energy Policy", type: "Lecturer Contacted", date: "2026-03-05", icon: Users, link: "/dashboard/institutional/lecturers" },
  { title: "Climate Adaptation Policy Study", type: "Collaboration Started", date: "2026-03-03", icon: Handshake, link: "/dashboard/institutional/collaborations" },
];

const sampleAdminActivity = [
  { title: "Dr. Ngozi Okafor invited to platform", type: "Faculty Invite", date: "2026-03-07", icon: Users, link: "/dashboard/institutional/admin/faculty" },
  { title: "3 new seats purchased", type: "Seat Update", date: "2026-03-06", icon: CreditCard, link: "/dashboard/institutional/admin/seats" },
  { title: "Q1 2026 Report generated", type: "Report Ready", date: "2026-03-05", icon: ClipboardList, link: "/dashboard/institutional/admin/reports" },
  { title: "Platform adoption reached 72%", type: "Analytics", date: "2026-03-04", icon: TrendingUp, link: "/dashboard/institutional/admin/analytics" },
];

const InstitutionalOverview = () => {
  const { talentRequests, collaborations, engagements, loading } = useInstitutional();

  const hasData = talentRequests.length > 0 || collaborations.length > 0 || engagements.length > 0;

  const activeRequests = hasData ? talentRequests.filter(r => r.status === "open").length : 2;
  const totalContacted = hasData ? engagements.length : 7;
  const activeCollabs = hasData ? collaborations.filter(c => c.status === "active").length : 1;
  const completedEngagements = hasData ? engagements.filter(e => e.status === "completed").length : 4;

  const liveEngagementActivity = hasData
    ? [
        ...talentRequests.slice(0, 2).map(r => ({ title: r.title, type: "Talent Request", date: r.created_at, icon: FileText, link: "/dashboard/institutional/talent-requests" })),
        ...collaborations.slice(0, 2).map(c => ({ title: c.title, type: "Collaboration", date: c.created_at, icon: Handshake, link: "/dashboard/institutional/collaborations" })),
        ...engagements.slice(0, 1).map(e => ({ title: e.title, type: "Engagement", date: e.created_at, icon: Briefcase, link: "/dashboard/institutional/engagements" })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)
    : sampleEngagementActivity;

  const engagementStats = [
    { label: "Talent Requests", value: activeRequests, icon: FileText, color: "text-accent", bg: "bg-accent/10" },
    { label: "Lecturers Contacted", value: totalContacted, icon: Users, color: "text-afrika-green", bg: "bg-afrika-green/10" },
    { label: "Active Collaborations", value: activeCollabs, icon: Handshake, color: "text-primary", bg: "bg-primary/10" },
    { label: "Completed", value: completedEngagements, icon: CheckCircle, color: "text-afrika-orange", bg: "bg-afrika-orange-light" },
  ];

  const adminStats = [
    { label: "Faculty Users", value: 18, icon: Users, color: "text-accent", bg: "bg-accent/10" },
    { label: "Seats Available", value: 7, icon: CreditCard, color: "text-afrika-green", bg: "bg-afrika-green/10" },
    { label: "Research Output", value: 142, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    { label: "Platform Adoption", value: "72%", icon: TrendingUp, color: "text-afrika-orange", bg: "bg-afrika-orange-light" },
  ];

  const engagementActions = [
    { title: "Talent Requests", desc: "Post or manage expertise requests", icon: Plus, color: "text-accent", bg: "bg-accent/10", link: "/dashboard/institutional/talent-requests" },
    { title: "Search Lecturers", desc: "Find researchers and academics", icon: Search, color: "text-primary", bg: "bg-primary/10", link: "/dashboard/institutional/lecturers" },
    { title: "Start Collaboration", desc: "Launch a research partnership", icon: Handshake, color: "text-afrika-green", bg: "bg-afrika-green/10", link: "/dashboard/institutional/collaborations" },
  ];

  const adminActions = [
    { title: "Faculty Users", desc: "Manage faculty members and invites", icon: Users, color: "text-accent", bg: "bg-accent/10", link: "/dashboard/institutional/admin/faculty" },
    { title: "Seat Management", desc: "Allocate and purchase seats", icon: CreditCard, color: "text-primary", bg: "bg-primary/10", link: "/dashboard/institutional/admin/seats" },
    { title: "Usage Analytics", desc: "Monitor platform adoption", icon: BarChart3, color: "text-afrika-green", bg: "bg-afrika-green/10", link: "/dashboard/institutional/admin/analytics" },
    { title: "Research Output", desc: "Track publications and impact", icon: TrendingUp, color: "text-afrika-orange", bg: "bg-afrika-orange-light", link: "/dashboard/institutional/admin/research-output" },
    { title: "Reports", desc: "Generate and download reports", icon: ClipboardList, color: "text-accent", bg: "bg-accent/10", link: "/dashboard/institutional/admin/reports" },
  ];

  const ActivityFeed = ({ items }: { items: typeof sampleEngagementActivity }) => (
    <Card className="border-border">
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {items.map((a, i) => (
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
  );

  const QuickActions = ({ items }: { items: typeof engagementActions }) => (
    <div className={`grid grid-cols-1 ${items.length > 3 ? "sm:grid-cols-3 lg:grid-cols-5" : "sm:grid-cols-3"} gap-3`}>
      {items.map(a => (
        <Link key={a.title} to={a.link}>
          <Card className="border-border hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="pt-4 pb-3 px-4 flex items-center gap-3">
              <div className={`h-9 w-9 rounded-lg ${a.bg} flex items-center justify-center shrink-0`}>
                <a.icon className={`h-4 w-4 ${a.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">{a.title}</p>
                <p className="text-[11px] text-muted-foreground truncate">{a.desc}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Institutional Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage academic engagements and institutional administration from one place.
          </p>
        </div>

        {/* ===== ENGAGEMENT SECTION ===== */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Handshake className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-bold text-foreground">Engagement</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {engagementStats.map(s => (
              <Card key={s.label} className="border-border">
                <CardContent className="pt-4 pb-3 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-muted-foreground">{s.label}</p>
                      <p className="text-xl font-bold text-foreground mt-0.5">{loading ? "–" : s.value}</p>
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
              <p className="text-sm font-semibold text-foreground mb-2">Recent Engagement Activity</p>
              <ActivityFeed items={liveEngagementActivity} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Quick Actions</p>
              <div className="space-y-2">
                {engagementActions.map(a => (
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

        {/* Divider */}
        <div className="border-t border-border" />

        {/* ===== ADMINISTRATION SECTION ===== */}
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
              <ActivityFeed items={sampleAdminActivity} />
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
