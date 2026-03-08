import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Briefcase, Building2, Eye, MessageCircle, Search, Plus, Handshake } from "lucide-react";
import { useInstitutional } from "@/hooks/useInstitutional";

const statusColors: Record<string, string> = {
  active: "bg-afrika-green/10 text-afrika-green",
  completed: "bg-muted text-muted-foreground",
  pending: "bg-accent/10 text-accent",
};

const MyEngagementsPage = () => {
  const { engagements, loading } = useInstitutional();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Institutional Engagements</h1>
          <p className="text-sm text-muted-foreground mt-1">Track ongoing collaborations and advisory work.</p>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}</div>
        ) : engagements.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-16 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground">No engagements yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Engagements are created when you request advisory support, recruit talent, or initiate collaborations.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <Link to="/dashboard/institutional/lecturers">
                  <Button variant="afrika" className="gap-2"><Search className="h-4 w-4" />Search Lecturers</Button>
                </Link>
                <Link to="/dashboard/institutional/talent-requests">
                  <Button variant="afrikaOutline" className="gap-2"><Plus className="h-4 w-4" />Request Talent</Button>
                </Link>
                <Link to="/dashboard/institutional/collaborations">
                  <Button variant="outline" className="gap-2"><Handshake className="h-4 w-4" />Start Collaboration</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {engagements.map(e => (
              <Card key={e.id} className="border-border">
                <CardContent className="py-5 px-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{e.title}</h3>
                        <Badge className={`text-[10px] ${statusColors[e.status] || statusColors.active}`}>{e.status}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                        {e.institution && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{e.institution}</span>}
                        <Badge variant="secondary" className="text-[10px]">{e.engagement_type}</Badge>
                      </div>
                      {e.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{e.description}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" className="gap-1 text-xs"><Eye className="h-3 w-3" />View Engagement</Button>
                      <Link to="/dashboard/messages">
                        <Button variant="ghost" size="sm" className="gap-1 text-xs"><MessageCircle className="h-3 w-3" />Message Partner</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyEngagementsPage;
