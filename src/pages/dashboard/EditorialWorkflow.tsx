import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle, Circle, Clock, Upload, MessageCircle, FileText,
  ChevronRight, Eye, UserPlus, Send, XCircle, AlertCircle, BookOpen,
  User, Calendar, Tag
} from "lucide-react";
import { usePublishing, type ManuscriptSubmission } from "@/hooks/usePublishing";

const workflowStages = [
  { key: "submission_received", label: "Submission Received", color: "bg-primary/10 text-primary" },
  { key: "editorial_screening", label: "Editorial Screening", color: "bg-accent/10 text-accent" },
  { key: "peer_review", label: "Peer Review", color: "bg-afrika-orange/10 text-afrika-orange" },
  { key: "revision_required", label: "Revision Required", color: "bg-yellow-500/10 text-yellow-600" },
  { key: "decision", label: "Final Decision", color: "bg-afrika-green/10 text-afrika-green" },
  { key: "publication", label: "Publication", color: "bg-primary/10 text-primary" },
];

const stageOrder = workflowStages.map(s => s.key);

// Demo reviewer data
const demoReviewers = [
  { name: "Dr. Fatima Bello", institution: "University of Lagos", expertise: "Epidemiology", status: "Review Submitted", rating: 4.8 },
  { name: "Dr. Kofi Mensah", institution: "University of Ghana", expertise: "Data Science", status: "Pending Review", rating: 4.5 },
];

const REVIEWER_DIRECTORY = [
  { name: "Dr. Ama Mensah", institution: "University of Ghana", expertise: "Energy Policy", rating: 4.7 },
  { name: "Prof. Kwame Asante", institution: "University of Ghana", expertise: "Computer Science", rating: 4.9 },
  { name: "Dr. Ngozi Okafor", institution: "University of Nigeria", expertise: "Agricultural Science", rating: 4.3 },
  { name: "Dr. Tunde Adeyemi", institution: "University of Lagos", expertise: "Political Science", rating: 4.6 },
  { name: "Dr. Grace Nwoye", institution: "University of Cape Town", expertise: "Environmental Science", rating: 4.4 },
];

const demoComments = [
  { reviewer: "Dr. Fatima Bello", comment: "The methodology is solid but requires more detail on dataset selection. Consider expanding Section 3.2 with additional validation metrics.", date: "March 5, 2026" },
  { reviewer: "Dr. Kofi Mensah", comment: "Strong theoretical framework. Minor revisions recommended for the statistical analysis section.", date: "March 6, 2026" },
];

// Demo fallback manuscripts for the pipeline
const DEMO_WORKFLOW_SUBMISSIONS = [
  { id: "demo-w1", user_id: "demo", title: "AI-Assisted Epidemiological Modeling in Sub-Saharan Africa", abstract: "This study explores how machine learning models can enhance epidemiological forecasting.", keywords: "AI, Epidemiology", research_field: "Public Health", journal_name: "African Journal of Public Health", journal_id: null, manuscript_url: null, cover_letter: null, co_authors: [{ name: "Dr. Ama Mensah", institution: "University of Ghana" }], status: "submitted", workflow_stage: "peer_review", reviewer_feedback: [], submitted_at: "2026-03-02T00:00:00Z", updated_at: "2026-03-05T00:00:00Z" },
  { id: "demo-w2", user_id: "demo", title: "Renewable Energy Policy Framework in West Africa", abstract: "Analysis of renewable energy adoption policies across ECOWAS nations.", keywords: "Energy, Policy", research_field: "Environmental Policy", journal_name: "Journal of African Energy Studies", journal_id: null, manuscript_url: null, cover_letter: null, co_authors: [{ name: "Dr. Kofi Mensah", institution: "Kwame Nkrumah University" }], status: "submitted", workflow_stage: "editorial_screening", reviewer_feedback: [], submitted_at: "2026-03-04T00:00:00Z", updated_at: "2026-03-06T00:00:00Z" },
  { id: "demo-w3", user_id: "demo", title: "Climate Policy Innovation in West Africa", abstract: "A comparative study of climate adaptation strategies.", keywords: "Climate, Innovation", research_field: "Political Science", journal_name: "African Policy Research Review", journal_id: null, manuscript_url: null, cover_letter: null, co_authors: [], status: "published", workflow_stage: "publication", reviewer_feedback: [], submitted_at: "2026-01-15T00:00:00Z", updated_at: "2026-02-28T00:00:00Z" },
  { id: "demo-w4", user_id: "demo", title: "Digital Health Infrastructure in Rural Nigeria", abstract: "Assessing the state of digital health services in underserved communities.", keywords: "Digital Health, Nigeria", research_field: "Health Systems", journal_name: "African Journal of Public Health", journal_id: null, manuscript_url: null, cover_letter: null, co_authors: [{ name: "Dr. Fatima Bello", institution: "Ahmadu Bello University" }], status: "submitted", workflow_stage: "submission_received", reviewer_feedback: [], submitted_at: "2026-03-06T00:00:00Z", updated_at: "2026-03-06T00:00:00Z" },
  { id: "demo-w5", user_id: "demo", title: "Indigenous Knowledge Systems and Modern Agriculture", abstract: "Integrating traditional farming practices with modern agritech.", keywords: "Agriculture, Indigenous", research_field: "Agricultural Science", journal_name: "Journal of African Energy Studies", journal_id: null, manuscript_url: null, cover_letter: null, co_authors: [{ name: "Dr. Grace Nwoye", institution: "University of Cape Town" }], status: "revision_required", workflow_stage: "revision_required", reviewer_feedback: [{ reviewer: "Dr. Fatima Bello", comment: "The methodology requires additional dataset clarification." }], submitted_at: "2026-02-20T00:00:00Z", updated_at: "2026-03-04T00:00:00Z" },
  { id: "demo-w6", user_id: "demo", title: "Financial Inclusion Through Mobile Banking in East Africa", abstract: "Examining mobile money impact on financial access.", keywords: "FinTech, Banking", research_field: "Economics", journal_name: "East African Economic Review", journal_id: null, manuscript_url: null, cover_letter: null, co_authors: [], status: "accepted", workflow_stage: "decision", reviewer_feedback: [], submitted_at: "2026-02-01T00:00:00Z", updated_at: "2026-03-01T00:00:00Z" },
  { id: "demo-w7", user_id: "demo", title: "Water Resource Management in the Sahel Region", abstract: "Assessment of water governance frameworks.", keywords: "Water, Governance", research_field: "Environmental Science", journal_name: "African Policy Research Review", journal_id: null, manuscript_url: null, cover_letter: null, co_authors: [{ name: "Prof. Ibrahim Sadiq", institution: "University of Nairobi" }], status: "submitted", workflow_stage: "submission_received", reviewer_feedback: [], submitted_at: "2026-03-07T00:00:00Z", updated_at: "2026-03-07T00:00:00Z" },
] as any[];

const EditorialWorkflow = () => {
  const { submissions: dbSubmissions, loading, updateSubmission } = usePublishing();
  const submissions = dbSubmissions.length > 0 ? dbSubmissions : DEMO_WORKFLOW_SUBMISSIONS;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAssignReviewer, setShowAssignReviewer] = useState(false);
  const [showDecision, setShowDecision] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");
  const [reviewerForm, setReviewerForm] = useState({ name: "", institution: "", expertise: "" });

  const selected = submissions.find(s => s.id === selectedId);

  const getStageSubmissions = (stageKey: string) =>
    submissions.filter(s => s.workflow_stage === stageKey);

  const getStageStatus = (stageKey: string, currentStage: string) => {
    const current = stageOrder.indexOf(currentStage);
    const target = stageOrder.indexOf(stageKey);
    if (target < current) return "completed";
    if (target === current) return "active";
    return "pending";
  };

  const handleDecision = async (decision: string) => {
    if (!selected) return;
    const stageMap: Record<string, string> = {
      accept: "publication",
      revision: "revision_required",
      reject: "decision",
    };
    const statusMap: Record<string, string> = {
      accept: "accepted",
      revision: "revision_required",
      reject: "rejected",
    };
    await updateSubmission.mutateAsync({
      id: selected.id,
      workflow_stage: stageMap[decision] || selected.workflow_stage,
      status: statusMap[decision] || selected.status,
    });
    setShowDecision(false);
  };

  const handleAdvanceStage = async (submission: ManuscriptSubmission) => {
    const idx = stageOrder.indexOf(submission.workflow_stage);
    if (idx < stageOrder.length - 1) {
      await updateSubmission.mutateAsync({
        id: submission.id,
        workflow_stage: stageOrder[idx + 1],
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto space-y-6 px-2 sm:px-4 lg:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/publishing" className="hover:text-foreground">Publishing</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Editorial Workflow</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Editorial Workflow</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track the full lifecycle of manuscript review and editorial decisions.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground">No manuscripts in the editorial pipeline.</h3>
              <p className="text-sm text-muted-foreground mt-1">Submit a manuscript to start the review process.</p>
              <Link to="/dashboard/publishing/submit">
                <Button variant="afrika" className="mt-4 gap-2">Submit Manuscript</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Kanban Pipeline Board */}
            <ScrollArea className="w-full">
              <div className="flex gap-4 min-w-[1200px] pb-4">
                {workflowStages.map(stage => {
                  const stageItems = getStageSubmissions(stage.key);
                  return (
                    <div key={stage.key} className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`text-[10px] font-semibold ${stage.color}`}>
                          {stage.label}
                        </Badge>
                        <span className="text-xs font-bold text-muted-foreground">
                          ({stageItems.length})
                        </span>
                      </div>
                      <div className="space-y-3">
                        {stageItems.length === 0 ? (
                          <div className="border border-dashed border-border rounded-xl p-6 text-center">
                            <p className="text-xs text-muted-foreground">No manuscripts</p>
                          </div>
                        ) : (
                          stageItems.map(ms => (
                            <Card
                              key={ms.id}
                              className="border-border hover:border-accent/50 transition-colors cursor-pointer"
                              onClick={() => { setSelectedId(ms.id); setShowDetail(true); }}
                            >
                              <CardContent className="p-4 space-y-3">
                                <p className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">
                                  {ms.title}
                                </p>
                                <div className="space-y-1.5">
                                  {(ms.co_authors as any[])?.length > 0 && (
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                      <User className="h-3 w-3 shrink-0" />
                                      <span className="line-clamp-1">
                                        {(ms.co_authors as any[]).map((a: any) => a.name || a).join(", ")}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <BookOpen className="h-3 w-3 shrink-0" />
                                    <span className="line-clamp-1">{ms.journal_name}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 shrink-0" />
                                    <span>{new Date(ms.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                  </div>
                                </div>
                                <div className="flex gap-1.5 pt-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-[10px] h-7 px-2 gap-1"
                                    onClick={(e) => { e.stopPropagation(); setSelectedId(ms.id); setShowDetail(true); }}
                                  >
                                    <Eye className="h-3 w-3" /> View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-[10px] h-7 px-2 gap-1"
                                    onClick={(e) => { e.stopPropagation(); setSelectedId(ms.id); setShowAssignReviewer(true); }}
                                  >
                                    <UserPlus className="h-3 w-3" /> Assign
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-[10px] h-7 px-2 gap-1"
                                    onClick={(e) => { e.stopPropagation(); setSelectedId(ms.id); setShowDecision(true); }}
                                  >
                                    <Send className="h-3 w-3" /> Decision
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Summary Table */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">All Manuscripts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paper Title</TableHead>
                      <TableHead>Journal</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map(ms => (
                      <TableRow key={ms.id}>
                        <TableCell className="font-medium max-w-[200px]">
                          <p className="line-clamp-1">{ms.title}</p>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">{ms.journal_name}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {new Date(ms.submitted_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px] capitalize">
                            {ms.workflow_stage.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-[10px] ${
                              ms.status === "accepted" ? "bg-afrika-green/10 text-afrika-green" :
                              ms.status === "rejected" ? "bg-destructive/10 text-destructive" :
                              ms.status === "published" ? "bg-primary/10 text-primary" :
                              "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {ms.status.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() => { setSelectedId(ms.id); setShowDetail(true); }}
                            >
                              <Eye className="h-3 w-3" /> View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() => handleAdvanceStage(ms)}
                            >
                              <ChevronRight className="h-3 w-3" /> Advance
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {/* ===== Manuscript Detail Dialog ===== */}
        <Dialog open={showDetail && !!selected} onOpenChange={setShowDetail}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-lg leading-tight">{selected?.title}</DialogTitle>
              <p className="text-xs text-muted-foreground">{selected?.journal_name}</p>
            </DialogHeader>

            <div className="space-y-6">
              {/* Manuscript Information */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Manuscript Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Research Field</p>
                    <p className="font-medium text-foreground">{selected?.research_field || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Keywords</p>
                    <p className="font-medium text-foreground">{selected?.keywords || "Not specified"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs">Abstract</p>
                    <p className="text-foreground text-sm mt-1">{selected?.abstract || "No abstract provided."}</p>
                  </div>
                </div>
              </div>

              {/* Author Information */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Author Information
                </h4>
                {(selected?.co_authors as any[])?.length > 0 ? (
                  <div className="space-y-2">
                    {(selected!.co_authors as any[]).map((a: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 bg-secondary rounded-lg p-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{a.name || a}</p>
                          {a.institution && <p className="text-xs text-muted-foreground">{a.institution}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No co-authors listed.</p>
                )}
              </div>

              {/* Workflow Progress */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Workflow Progress
                </h4>
                <div className="space-y-3">
                  {workflowStages.map(stage => {
                    const status = getStageStatus(stage.key, selected?.workflow_stage || "");
                    return (
                      <div key={stage.key} className="flex items-center gap-3">
                        {status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-afrika-green shrink-0" />
                        ) : status === "active" ? (
                          <Clock className="h-5 w-5 text-accent shrink-0 animate-pulse" />
                        ) : (
                          <Circle className="h-5 w-5 text-border shrink-0" />
                        )}
                        <span className={`text-sm ${
                          status === "completed" ? "text-foreground font-medium" :
                          status === "active" ? "text-accent font-semibold" :
                          "text-muted-foreground"
                        }`}>
                          {stage.label}
                        </span>
                        {status === "completed" && (
                          <Badge className="text-[10px] bg-afrika-green/10 text-afrika-green ml-auto">Completed</Badge>
                        )}
                        {status === "active" && (
                          <Badge className="text-[10px] bg-accent/10 text-accent ml-auto">In Progress</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviewer Assignments */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Reviewer Assignments
                </h4>
                <div className="space-y-2">
                  {demoReviewers.map((r, i) => (
                    <div key={i} className="flex items-center justify-between bg-secondary rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{r.name}</p>
                          <p className="text-xs text-muted-foreground">{r.institution} · {r.expertise}</p>
                        </div>
                      </div>
                      <Badge className={`text-[10px] ${
                        r.status === "Review Submitted"
                          ? "bg-afrika-green/10 text-afrika-green"
                          : "bg-yellow-500/10 text-yellow-600"
                      }`}>
                        {r.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="afrikaOutline" size="sm" className="gap-1 text-xs">
                    <Send className="h-3 w-3" /> Send Reminder
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <UserPlus className="h-3 w-3" /> Replace Reviewer
                  </Button>
                </div>
              </div>

              {/* Reviewer Comments */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Reviewer Comments
                </h4>
                <div className="space-y-3">
                  {/* Real feedback from DB */}
                  {Array.isArray(selected?.reviewer_feedback) && (selected!.reviewer_feedback as any[]).map((fb: any, i: number) => (
                    <div key={`real-${i}`} className="bg-secondary rounded-lg p-4">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Reviewer {i + 1}</p>
                      <p className="text-sm text-foreground italic">"{fb.comment || fb}"</p>
                    </div>
                  ))}
                  {/* Demo comments */}
                  {demoComments.map((c, i) => (
                    <div key={`demo-${i}`} className="bg-secondary rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-foreground">{c.reviewer}</p>
                        <p className="text-[10px] text-muted-foreground">{c.date}</p>
                      </div>
                      <p className="text-sm text-foreground italic">"{c.comment}"</p>
                    </div>
                  ))}
                </div>

                {/* Author Response */}
                <div className="mt-4 space-y-3">
                  <Textarea
                    placeholder="Respond to reviewer comments..."
                    value={revisionNote}
                    onChange={e => setRevisionNote(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button variant="afrikaOutline" size="sm" className="gap-1">
                      <MessageCircle className="h-3 w-3" /> Respond to Reviewer
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Upload className="h-3 w-3" /> Upload Revision
                    </Button>
                  </div>
                </div>
              </div>

              {/* Editorial Decision */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Editorial Decision
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="afrika"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleDecision("accept")}
                  >
                    <CheckCircle className="h-3 w-3" /> Accept Manuscript
                  </Button>
                  <Button
                    variant="afrikaOutline"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleDecision("revision")}
                  >
                    <AlertCircle className="h-3 w-3" /> Request Revision
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => handleDecision("reject")}
                  >
                    <XCircle className="h-3 w-3" /> Reject Manuscript
                  </Button>
                </div>
                {selected?.status && selected.status !== "submitted" && (
                  <div className="mt-3 p-3 bg-secondary rounded-lg">
                    <p className="text-xs text-muted-foreground">Current Decision</p>
                    <p className="text-sm font-semibold text-foreground capitalize mt-1">
                      {selected.status.replace(/_/g, " ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ===== Assign Reviewer Dialog ===== */}
        <Dialog open={showAssignReviewer} onOpenChange={setShowAssignReviewer}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Reviewer</DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Assign an academic reviewer to evaluate this manuscript.
              </p>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Reviewer Name *</Label>
                <Input
                  className="mt-1"
                  placeholder="e.g. Dr. Fatima Bello"
                  value={reviewerForm.name}
                  onChange={e => setReviewerForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Institution</Label>
                <Input
                  className="mt-1"
                  placeholder="e.g. University of Lagos"
                  value={reviewerForm.institution}
                  onChange={e => setReviewerForm(f => ({ ...f, institution: e.target.value }))}
                />
              </div>
              <div>
                <Label>Area of Expertise</Label>
                <Input
                  className="mt-1"
                  placeholder="e.g. Epidemiology"
                  value={reviewerForm.expertise}
                  onChange={e => setReviewerForm(f => ({ ...f, expertise: e.target.value }))}
                />
              </div>

              {/* Currently assigned */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Currently Assigned
                </p>
                {demoReviewers.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 py-2 border-b border-border last:border-0">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-foreground">{r.name}</span>
                    <Badge className="text-[10px] bg-secondary text-secondary-foreground ml-auto">
                      {r.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAssignReviewer(false)}>Cancel</Button>
              <Button variant="afrika" disabled={!reviewerForm.name}>
                <UserPlus className="h-3 w-3 mr-1" /> Assign Reviewer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ===== Decision Dialog ===== */}
        <Dialog open={showDecision && !!selected} onOpenChange={setShowDecision}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editorial Decision</DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Make an editorial decision for: <strong>{selected?.title}</strong>
              </p>
            </DialogHeader>
            <div className="space-y-3">
              <Textarea
                placeholder="Add notes about the decision (optional)..."
                rows={3}
              />
              <div className="space-y-2">
                <Button
                  variant="afrika"
                  className="w-full gap-2 justify-start"
                  onClick={() => handleDecision("accept")}
                >
                  <CheckCircle className="h-4 w-4" />
                  Accept Manuscript
                  <span className="text-xs opacity-70 ml-auto">Move to Publication</span>
                </Button>
                <Button
                  variant="afrikaOutline"
                  className="w-full gap-2 justify-start"
                  onClick={() => handleDecision("revision")}
                >
                  <AlertCircle className="h-4 w-4" />
                  Request Revision
                  <span className="text-xs opacity-70 ml-auto">Return to Author</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2 justify-start text-destructive"
                  onClick={() => handleDecision("reject")}
                >
                  <XCircle className="h-4 w-4" />
                  Reject Manuscript
                  <span className="text-xs opacity-70 ml-auto">End Review</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default EditorialWorkflow;
