import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, Eye, MessageCircle, FileText, GraduationCap, Globe, Compass } from "lucide-react";

interface AdvisoryCase {
  id: string;
  request_type: string;
  advisor: string;
  date_submitted: string;
  status: string;
  progress_stages: { label: string; completed: boolean }[];
  description?: string;
}

const sampleCases: AdvisoryCase[] = [
  {
    id: "c1", request_type: "Degree Advisory", advisor: "Dr. Fatima Bello", date_submitted: "2026-03-04", status: "under_review",
    description: "Advisory on Master's programs in AI and Data Science across African universities.",
    progress_stages: [
      { label: "Request Submitted", completed: true },
      { label: "Documents Received", completed: true },
      { label: "Advisor Review", completed: false },
      { label: "Guidance Provided", completed: false },
      { label: "Case Completed", completed: false },
    ],
  },
  {
    id: "c2", request_type: "Transcript Processing", advisor: "Mrs. Ngozi Chukwu", date_submitted: "2026-02-28", status: "documents_pending",
    description: "Transcript request for BSc Economics from University of Ibadan.",
    progress_stages: [
      { label: "Request Submitted", completed: true },
      { label: "Documents Received", completed: false },
      { label: "Advisor Review", completed: false },
      { label: "Guidance Provided", completed: false },
      { label: "Case Completed", completed: false },
    ],
  },
  {
    id: "c3", request_type: "Study in Africa", advisor: "Dr. Amina Osei", date_submitted: "2026-01-20", status: "completed",
    description: "Consultation on Public Health programs in East and Southern Africa.",
    progress_stages: [
      { label: "Request Submitted", completed: true },
      { label: "Documents Received", completed: true },
      { label: "Advisor Review", completed: true },
      { label: "Guidance Provided", completed: true },
      { label: "Case Completed", completed: true },
    ],
  },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  under_review: { label: "Under Review", variant: "secondary" },
  documents_pending: { label: "Documents Pending", variant: "outline" },
  completed: { label: "Completed", variant: "default" },
  pending: { label: "Pending", variant: "outline" },
};

const MyCasesPage = () => {
  const [viewCase, setViewCase] = useState<AdvisoryCase | null>(null);
  const hasCases = sampleCases.length > 0;

  if (!hasCases) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <ClipboardList className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-1">You have not submitted any advisory requests yet.</h2>
            <p className="text-sm text-muted-foreground mb-6">Get started by choosing a service below.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/dashboard/advisory/transcripts"><Button variant="afrika" className="gap-1.5"><FileText className="h-4 w-4" /> Request Transcript</Button></Link>
              <Link to="/dashboard/advisory/degree"><Button variant="afrika" className="gap-1.5"><GraduationCap className="h-4 w-4" /> Request Degree Advisory</Button></Link>
              <Link to="/dashboard/advisory/study-africa"><Button variant="afrikaOutline" className="gap-1.5"><Globe className="h-4 w-4" /> Explore Study in Africa</Button></Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Advisory Cases</h1>
          <p className="text-sm text-muted-foreground mt-1">Track all your advisory requests and their progress.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Cases", value: sampleCases.length, color: "text-accent", bg: "bg-accent/10" },
            { label: "In Progress", value: sampleCases.filter(c => c.status !== "completed").length, color: "text-primary", bg: "bg-primary/10" },
            { label: "Completed", value: sampleCases.filter(c => c.status === "completed").length, color: "text-afrika-green", bg: "bg-afrika-green/10" },
          ].map(s => (
            <Card key={s.label} className="border-border">
              <CardContent className="pt-5 pb-4 px-5">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request Type</TableHead>
                <TableHead>Advisor</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleCases.map(c => {
                const sc = statusConfig[c.status] || statusConfig.pending;
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-sm">{c.request_type}</TableCell>
                    <TableCell className="text-sm">{c.advisor}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(c.date_submitted).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={sc.variant} className="text-[10px]">{sc.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => setViewCase(c)}>
                        <Eye className="h-3 w-3" /> View
                      </Button>
                      <Link to="/dashboard/messages">
                        <Button variant="ghost" size="sm" className="text-xs gap-1">
                          <MessageCircle className="h-3 w-3" /> Message
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Case Detail Dialog with Progress Tracker */}
      <Dialog open={!!viewCase} onOpenChange={(open) => !open && setViewCase(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{viewCase?.request_type}</DialogTitle></DialogHeader>
          {viewCase && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-xs">Advisor</p><p className="font-medium">{viewCase.advisor}</p></div>
                <div><p className="text-muted-foreground text-xs">Status</p>
                  <Badge variant={statusConfig[viewCase.status]?.variant || "secondary"} className="text-[10px] mt-0.5">
                    {statusConfig[viewCase.status]?.label || viewCase.status}
                  </Badge>
                </div>
              </div>
              {viewCase.description && (
                <div><p className="text-muted-foreground text-xs mb-1">Description</p><p className="text-foreground">{viewCase.description}</p></div>
              )}

              {/* Progress Tracker */}
              <div>
                <p className="text-xs font-semibold text-foreground mb-3">Case Progress</p>
                <div className="space-y-0">
                  {viewCase.progress_stages.map((stage, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          stage.completed ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                        }`}>
                          {stage.completed ? "✓" : i + 1}
                        </div>
                        {i < viewCase.progress_stages.length - 1 && (
                          <div className={`w-0.5 h-6 ${stage.completed ? "bg-accent" : "bg-border"}`} />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className={`text-xs font-medium ${stage.completed ? "text-foreground" : "text-muted-foreground"}`}>
                          {stage.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{stage.completed ? "Completed" : "Pending"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/dashboard/messages" className="block">
                <Button variant="afrikaOutline" size="sm" className="w-full gap-1">
                  <MessageCircle className="h-3 w-3" /> Message Advisor
                </Button>
              </Link>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MyCasesPage;
