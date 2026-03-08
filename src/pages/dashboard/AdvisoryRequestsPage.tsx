import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Eye, MessageCircle, Building2, Clock, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface AdvisoryDisplay {
  id: string;
  topic: string;
  description: string | null;
  institution: string | null;
  expected_duration: string | null;
  status: string;
  created_at: string;
  advisor_name: string;
  requester_name: string;
  is_advisor: boolean;
}

const sampleAdvisories: AdvisoryDisplay[] = [
  {
    id: "sa-1",
    topic: "Energy Policy Research",
    description: "Seeking expert guidance on national renewable energy policy frameworks for West Africa.",
    institution: "Ministry of Energy Ghana",
    expected_duration: "3 months",
    status: "pending",
    created_at: "2026-03-06",
    advisor_name: "Dr. Kofi Mensah",
    requester_name: "You",
    is_advisor: false,
  },
  {
    id: "sa-2",
    topic: "Public Health Data Analysis",
    description: "Statistical consultation for regional disease surveillance data across 12 countries.",
    institution: "WHO Africa Regional Office",
    expected_duration: "2 months",
    status: "accepted",
    created_at: "2026-02-20",
    advisor_name: "Prof. Amina Osei",
    requester_name: "You",
    is_advisor: false,
  },
  {
    id: "sa-3",
    topic: "Climate-Smart Agriculture",
    description: "Advisory on climate adaptation strategies for smallholder farming communities.",
    institution: "FAO Regional Office",
    expected_duration: "4 months",
    status: "completed",
    created_at: "2025-12-10",
    advisor_name: "Dr. Fatima Al-Hassan",
    requester_name: "You",
    is_advisor: false,
  },
  {
    id: "sa-4",
    topic: "AI in Healthcare Education",
    description: "Consultation on integrating machine learning modules into medical school curricula.",
    institution: "University of Nairobi",
    expected_duration: "1 month",
    status: "pending",
    created_at: "2026-03-04",
    advisor_name: "You",
    requester_name: "Dr. Emmanuel Nkrumah",
    is_advisor: true,
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-accent/10 text-accent",
  accepted: "bg-afrika-green/10 text-afrika-green",
  completed: "bg-muted text-muted-foreground",
  rejected: "bg-destructive/10 text-destructive",
};

const statusLabel: Record<string, string> = {
  pending: "Pending",
  accepted: "Accepted",
  completed: "Completed",
  rejected: "Rejected",
};

const AdvisoryRequestsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [viewAdvisory, setViewAdvisory] = useState<AdvisoryDisplay | null>(null);

  const { data: dbAdvisories, isLoading } = useQuery({
    queryKey: ["advisory_requests", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advisory_requests")
        .select("*")
        .or(`requester_id.eq.${user!.id},advisor_id.eq.${user!.id}`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const displayAdvisories: AdvisoryDisplay[] = dbAdvisories && dbAdvisories.length > 0
    ? dbAdvisories.map(a => ({
        id: a.id,
        topic: a.topic,
        description: a.description,
        institution: a.institution,
        expected_duration: a.expected_duration,
        status: a.status,
        created_at: a.created_at,
        advisor_name: a.advisor_id === user?.id ? "You" : "Advisor",
        requester_name: a.requester_id === user?.id ? "You" : "Requester",
        is_advisor: a.advisor_id === user?.id,
      }))
    : sampleAdvisories;

  const handleUpdateStatus = async (id: string, status: string) => {
    if (id.startsWith("sa-")) return;
    await supabase.from("advisory_requests").update({ status }).eq("id", id);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Advisory Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage all advisory requests — both sent and received.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: "Pending", count: displayAdvisories.filter(a => a.status === "pending").length },
            { label: "Accepted", count: displayAdvisories.filter(a => a.status === "accepted").length },
            { label: "Completed", count: displayAdvisories.filter(a => a.status === "completed").length },
            { label: "Total", count: displayAdvisories.length },
          ].map(s => (
            <Card key={s.label} className="border-border">
              <CardContent className="pt-4 pb-3 px-5">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold text-foreground mt-0.5">{isLoading ? "–" : s.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}</div>
        ) : (
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-semibold">Topic</TableHead>
                    <TableHead className="text-xs font-semibold">Role</TableHead>
                    <TableHead className="text-xs font-semibold">With</TableHead>
                    <TableHead className="text-xs font-semibold">Institution</TableHead>
                    <TableHead className="text-xs font-semibold">Date</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayAdvisories.map(a => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <p className="text-sm font-medium text-foreground">{a.topic}</p>
                        {a.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[240px]">{a.description}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {a.is_advisor ? "Advisor" : "Requester"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {a.is_advisor ? a.requester_name : a.advisor_name}
                      </TableCell>
                      <TableCell>
                        {a.institution ? (
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3" />{a.institution}
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${statusColors[a.status] || statusColors.pending}`}>
                          {statusLabel[a.status] || a.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={() => setViewAdvisory(a)}>
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

        {displayAdvisories.length === 0 && !isLoading && (
          <Card className="border-border border-dashed">
            <CardContent className="py-12 text-center">
              <Briefcase className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">No advisory requests yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Search for lecturers and request advisory support.</p>
              <Button variant="afrika" size="sm" className="mt-4" onClick={() => navigate("/dashboard/institutional/lecturers")}>
                Search Lecturers
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Detail Dialog */}
      <Dialog open={!!viewAdvisory} onOpenChange={(open) => !open && setViewAdvisory(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewAdvisory?.topic}</DialogTitle>
            <DialogDescription>Advisory request details</DialogDescription>
          </DialogHeader>
          {viewAdvisory && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Your Role</p>
                  <Badge variant="outline" className="text-[10px]">
                    {viewAdvisory.is_advisor ? "Advisor" : "Requester"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{viewAdvisory.is_advisor ? "Requested By" : "Advisor"}</p>
                  <p className="text-sm font-medium text-foreground">
                    {viewAdvisory.is_advisor ? viewAdvisory.requester_name : viewAdvisory.advisor_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Institution</p>
                  <p className="text-sm font-medium text-foreground">{viewAdvisory.institution || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expected Duration</p>
                  <p className="text-sm font-medium text-foreground">{viewAdvisory.expected_duration || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge className={`text-[10px] ${statusColors[viewAdvisory.status] || statusColors.pending}`}>
                    {statusLabel[viewAdvisory.status] || viewAdvisory.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(viewAdvisory.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
              {viewAdvisory.description && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-foreground leading-relaxed">{viewAdvisory.description}</p>
                </div>
              )}

              {/* Action buttons for advisors on pending requests */}
              {viewAdvisory.is_advisor && viewAdvisory.status === "pending" && !viewAdvisory.id.startsWith("sa-") && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="afrika"
                    size="sm"
                    className="flex-1"
                    onClick={async () => {
                      await handleUpdateStatus(viewAdvisory.id, "accepted");
                      setViewAdvisory({ ...viewAdvisory, status: "accepted" });
                    }}
                  >
                    Accept Request
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive hover:text-destructive"
                    onClick={async () => {
                      await handleUpdateStatus(viewAdvisory.id, "rejected");
                      setViewAdvisory({ ...viewAdvisory, status: "rejected" });
                    }}
                  >
                    Decline
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => { setViewAdvisory(null); navigate("/dashboard/messages"); }}>
              <MessageCircle className="h-3 w-3" /> Message
            </Button>
            <Button variant="outline" onClick={() => setViewAdvisory(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdvisoryRequestsPage;
