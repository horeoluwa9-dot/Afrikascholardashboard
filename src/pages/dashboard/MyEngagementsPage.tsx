import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Briefcase, Building2, Eye, MessageCircle, Search, Plus, Handshake, Calendar } from "lucide-react";
import { useInstitutional } from "@/hooks/useInstitutional";

interface EngagementDisplay {
  id: string;
  title: string;
  institution: string | null;
  engagement_type: string;
  status: string;
  start_date: string | null;
  description: string | null;
  partner: string;
}

const sampleEngagements: EngagementDisplay[] = [
  {
    id: "se-1",
    title: "Energy Policy Advisory",
    institution: "University of Ghana",
    engagement_type: "advisory",
    status: "active",
    start_date: "2026-03-01",
    description: "Providing expert guidance on national energy policy frameworks.",
    partner: "Dr. Kofi Mensah",
  },
  {
    id: "se-2",
    title: "Public Health Data Review",
    institution: "University of Cape Town",
    engagement_type: "research",
    status: "active",
    start_date: "2026-02-15",
    description: "Collaborative data review for regional disease surveillance report.",
    partner: "Prof. Amina Osei",
  },
  {
    id: "se-3",
    title: "Agricultural Innovation Workshop",
    institution: "Mohammed V University",
    engagement_type: "advisory",
    status: "completed",
    start_date: "2025-11-01",
    description: "Workshop series on climate-smart agriculture techniques for North African contexts.",
    partner: "Dr. Fatima Al-Hassan",
  },
  {
    id: "se-4",
    title: "Digital Literacy Curriculum Review",
    institution: "University of Nairobi",
    engagement_type: "collaboration",
    status: "completed",
    start_date: "2025-09-15",
    description: "Review and feedback on digital skills curriculum for East African youth programs.",
    partner: "Dr. Emmanuel Nkrumah",
  },
  {
    id: "se-5",
    title: "Constitutional Reform Advisory",
    institution: "University of Ibadan",
    engagement_type: "advisory",
    status: "completed",
    start_date: "2025-07-01",
    description: "Expert advisory on governance and institutional reform proposals.",
    partner: "Prof. Ngozi Adeyemi",
  },
  {
    id: "se-6",
    title: "Pan-African Education Index",
    institution: "African Development Bank",
    engagement_type: "collaboration",
    status: "completed",
    start_date: "2025-04-01",
    description: "Development of standardized education quality metrics across the continent.",
    partner: "Multiple Partners",
  },
];

const statusColors: Record<string, string> = {
  active: "bg-afrika-green/10 text-afrika-green",
  completed: "bg-muted text-muted-foreground",
  pending: "bg-accent/10 text-accent",
};

const typeLabel: Record<string, string> = {
  advisory: "Advisory",
  research: "Research",
  collaboration: "Collaboration",
};

const MyEngagementsPage = () => {
  const { engagements, loading } = useInstitutional();
  const navigate = useNavigate();

  // View detail dialog
  const [viewEngagement, setViewEngagement] = useState<EngagementDisplay | null>(null);

  const displayEngagements: EngagementDisplay[] = engagements.length > 0
    ? engagements.map(e => ({
        id: e.id,
        title: e.title,
        institution: e.institution,
        engagement_type: e.engagement_type,
        status: e.status,
        start_date: e.start_date,
        description: e.description,
        partner: "—",
      }))
    : sampleEngagements;

  const isEmpty = engagements.length === 0 && loading === false;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Institutional Engagements</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track all advisory work, research partnerships, and institutional collaborations.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="pt-4 pb-3 px-5">
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-xl font-bold text-foreground mt-0.5">
                {displayEngagements.filter(e => e.status === "active").length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-4 pb-3 px-5">
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-xl font-bold text-foreground mt-0.5">
                {displayEngagements.filter(e => e.status === "completed").length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-4 pb-3 px-5">
              <p className="text-xs text-muted-foreground">Total Engagements</p>
              <p className="text-xl font-bold text-foreground mt-0.5">
                {displayEngagements.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}</div>
        ) : (
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-semibold">Project / Engagement</TableHead>
                    <TableHead className="text-xs font-semibold">Academic Partner</TableHead>
                    <TableHead className="text-xs font-semibold">Institution</TableHead>
                    <TableHead className="text-xs font-semibold">Start Date</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayEngagements.map(e => (
                    <TableRow key={e.id}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-foreground">{e.title}</p>
                          <Badge variant="outline" className="text-[10px] mt-0.5">
                            {typeLabel[e.engagement_type] || e.engagement_type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{e.partner}</TableCell>
                      <TableCell>
                        {e.institution ? (
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3" />{e.institution}
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {e.start_date
                          ? new Date(e.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${statusColors[e.status] || statusColors.active}`}>
                          {e.status.charAt(0).toUpperCase() + e.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={() => setViewEngagement(e)}>
                            <Eye className="h-3 w-3" /> View
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={() => navigate("/dashboard/messages")}>
                            <MessageCircle className="h-3 w-3" /> Message
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* View Detail Dialog */}
        <Dialog open={!!viewEngagement} onOpenChange={(open) => !open && setViewEngagement(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{viewEngagement?.title}</DialogTitle>
              <DialogDescription>Engagement details</DialogDescription>
            </DialogHeader>
            {viewEngagement && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Academic Partner</p>
                    <p className="text-sm font-medium text-foreground">{viewEngagement.partner}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Institution</p>
                    <p className="text-sm font-medium text-foreground">{viewEngagement.institution || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <Badge variant="outline" className="text-[10px]">
                      {typeLabel[viewEngagement.engagement_type] || viewEngagement.engagement_type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge className={`text-[10px] ${statusColors[viewEngagement.status] || statusColors.active}`}>
                      {viewEngagement.status.charAt(0).toUpperCase() + viewEngagement.status.slice(1)}
                    </Badge>
                  </div>
                  {viewEngagement.start_date && (
                    <div>
                      <p className="text-xs text-muted-foreground">Start Date</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(viewEngagement.start_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  )}
                </div>
                {viewEngagement.description && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                    <p className="text-sm text-foreground leading-relaxed">{viewEngagement.description}</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => { setViewEngagement(null); navigate("/dashboard/messages"); }}>
                <MessageCircle className="h-3 w-3" /> Message Partner
              </Button>
              <Button variant="outline" onClick={() => setViewEngagement(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Empty state CTA */}
        {isEmpty && (
          <Card className="border-border border-dashed">
            <CardContent className="py-12 text-center">
              <Briefcase className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">No institutional engagements yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Get started by connecting with academics on the platform.</p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                <Link to="/dashboard/institutional/lecturers">
                  <Button variant="afrika" size="sm" className="gap-2"><Search className="h-3.5 w-3.5" />Search Lecturers</Button>
                </Link>
                <Link to="/dashboard/institutional/talent-requests">
                  <Button variant="afrikaOutline" size="sm" className="gap-2"><Plus className="h-3.5 w-3.5" />Create Talent Request</Button>
                </Link>
                <Link to="/dashboard/institutional/collaborations">
                  <Button variant="outline" size="sm" className="gap-2"><Handshake className="h-3.5 w-3.5" />Start Collaboration</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyEngagementsPage;
