import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Handshake, CheckCircle, ArrowRight, Building2, Search, Plus } from "lucide-react";
import { useInstitutional } from "@/hooks/useInstitutional";

const InstitutionalOverview = () => {
  const { talentRequests, collaborations, engagements, loading } = useInstitutional();

  const activeRequests = talentRequests.filter(r => r.status === "open").length;
  const activeCollabs = collaborations.filter(c => c.status === "active").length;
  const completedEngagements = engagements.filter(e => e.status === "completed").length;
  const totalContacted = engagements.length;

  const stats = [
    { label: "Active Talent Requests", value: activeRequests, icon: FileText, color: "text-accent" },
    { label: "Lecturers Contacted", value: totalContacted, icon: Users, color: "text-afrika-green" },
    { label: "Active Collaborations", value: activeCollabs, icon: Handshake, color: "text-primary" },
    { label: "Completed Engagements", value: completedEngagements, icon: CheckCircle, color: "text-afrika-orange" },
  ];

  const recentActivity = [
    ...talentRequests.slice(0, 2).map(r => ({ title: r.title, type: "Talent Request", date: r.created_at })),
    ...collaborations.slice(0, 2).map(c => ({ title: c.title, type: "Collaboration", date: c.created_at })),
    ...engagements.slice(0, 2).map(e => ({ title: e.title, type: "Engagement", date: e.created_at })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const isEmpty = talentRequests.length === 0 && collaborations.length === 0 && engagements.length === 0;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Institution Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your academic engagements and institutional activities.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <Card key={s.label} className="border-border">
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{loading ? "–" : s.value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isEmpty ? (
          /* Empty state */
          <Card className="border-border">
            <CardContent className="py-16 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">You have not created any academic engagements yet.</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                Start by searching for lecturers, requesting academic talent, or initiating a research collaboration.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <Link to="/dashboard/institutional/lecturers">
                  <Button variant="afrika" className="gap-2"><Search className="h-4 w-4" />Search Lecturers</Button>
                </Link>
                <Link to="/dashboard/institutional/talent-requests">
                  <Button variant="afrikaOutline" className="gap-2"><Plus className="h-4 w-4" />Request Academic Talent</Button>
                </Link>
                <Link to="/dashboard/institutional/collaborations">
                  <Button variant="outline" className="gap-2"><Handshake className="h-4 w-4" />Start Research Collaboration</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Recent Activity */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Recent Institutional Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent activity.</p>
                ) : (
                  recentActivity.map((a, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{a.title}</p>
                        <Badge variant="secondary" className="text-[10px] mt-1">{a.type}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard/institutional/talent-requests">
                <Button variant="afrika" className="gap-2"><Plus className="h-4 w-4" />Request Academic Talent</Button>
              </Link>
              <Link to="/dashboard/institutional/lecturers">
                <Button variant="afrikaOutline" className="gap-2"><Search className="h-4 w-4" />Search Lecturers</Button>
              </Link>
              <Link to="/dashboard/institutional/collaborations">
                <Button variant="outline" className="gap-2"><Handshake className="h-4 w-4" />Start Collaboration</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InstitutionalOverview;
