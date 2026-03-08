import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, FileText, Handshake, CheckCircle, ArrowRight, Building2, Search, Plus,
  TrendingUp, MessageCircle, Calendar, Briefcase, ClipboardList,
} from "lucide-react";
import { useInstitutional } from "@/hooks/useInstitutional";

const sampleActivity = [
  { title: "Renewable Energy Policy Advisory", type: "Talent Request", date: "2026-03-06", icon: FileText, link: "/dashboard/institutional/talent-requests" },
  { title: "Dr. Kofi Mensah — Energy Policy", type: "Lecturer Contacted", date: "2026-03-05", icon: Users, link: "/dashboard/institutional/lecturers" },
  { title: "Climate Adaptation Policy Study", type: "Collaboration Started", date: "2026-03-03", icon: Handshake, link: "/dashboard/institutional/collaborations" },
  { title: "Dr. Amina Osei — Public Health", type: "Lecturer Contacted", date: "2026-03-02", icon: Users, link: "/dashboard/institutional/lecturers" },
  { title: "Agricultural Innovation Research", type: "Talent Request", date: "2026-03-01", icon: FileText, link: "/dashboard/institutional/talent-requests" },
];

const InstitutionalOverview = () => {
  const { talentRequests, collaborations, engagements, loading } = useInstitutional();

  const hasData = talentRequests.length > 0 || collaborations.length > 0 || engagements.length > 0;

  const activeRequests = hasData ? talentRequests.filter(r => r.status === "open").length : 2;
  const totalContacted = hasData ? engagements.length : 7;
  const activeCollabs = hasData ? collaborations.filter(c => c.status === "active").length : 1;
  const completedEngagements = hasData ? engagements.filter(e => e.status === "completed").length : 4;

  const liveActivity = hasData
    ? [
        ...talentRequests.slice(0, 2).map(r => ({ title: r.title, type: "Talent Request", date: r.created_at, icon: FileText, link: "/dashboard/institutional/talent-requests" })),
        ...collaborations.slice(0, 2).map(c => ({ title: c.title, type: "Collaboration", date: c.created_at, icon: Handshake, link: "/dashboard/institutional/collaborations" })),
        ...engagements.slice(0, 2).map(e => ({ title: e.title, type: "Engagement", date: e.created_at, icon: Briefcase, link: "/dashboard/institutional/engagements" })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
    : sampleActivity;

  const stats = [
    { label: "Active Talent Requests", value: activeRequests, icon: FileText, color: "text-accent", bg: "bg-accent/10" },
    { label: "Lecturers Contacted", value: totalContacted, icon: Users, color: "text-afrika-green", bg: "bg-afrika-green/10" },
    { label: "Active Collaborations", value: activeCollabs, icon: Handshake, color: "text-primary", bg: "bg-primary/10" },
    { label: "Completed Engagements", value: completedEngagements, icon: CheckCircle, color: "text-afrika-orange", bg: "bg-afrika-orange-light" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Institution Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage academic collaborations, talent requests, and institutional engagements.
          </p>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <Card key={s.label} className="border-border hover:shadow-sm transition-shadow">
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{loading ? "–" : s.value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>
          <Card className="border-border">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {liveActivity.map((a, i) => (
                  <Link
                    key={i}
                    to={a.link}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <a.icon className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                      <Badge variant="secondary" className="text-[10px] mt-0.5">{a.type}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/dashboard/institutional/talent-requests">
              <Card className="border-border hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="pt-5 pb-4 px-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <Plus className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">View Talent Requests</p>
                    <p className="text-xs text-muted-foreground">Post or manage expertise requests</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/dashboard/institutional/advisory">
              <Card className="border-border hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="pt-5 pb-4 px-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-afrika-orange-light flex items-center justify-center shrink-0">
                    <ClipboardList className="h-5 w-5 text-afrika-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Advisory Requests</p>
                    <p className="text-xs text-muted-foreground">View sent & received advisories</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/dashboard/institutional/lecturers">
              <Card className="border-border hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="pt-5 pb-4 px-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Search Lecturers</p>
                    <p className="text-xs text-muted-foreground">Find researchers and academics</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link to="/dashboard/institutional/collaborations">
              <Card className="border-border hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="pt-5 pb-4 px-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-afrika-green/10 flex items-center justify-center shrink-0">
                    <Handshake className="h-5 w-5 text-afrika-green" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Start Collaboration</p>
                    <p className="text-xs text-muted-foreground">Launch a research partnership</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstitutionalOverview;
