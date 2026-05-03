import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle, Circle, FileText, ChevronRight, Eye, UserPlus,
  Send, XCircle, AlertCircle, BookOpen, User, Calendar, Search,
  Star, Download, ArrowRight, BarChart3, Inbox, Globe, Users,
  RefreshCw,
} from "lucide-react";
import { usePublishing } from "@/hooks/usePublishing";

// ── Pipeline stages ──────────────────────────────────────────────
const PIPELINE_STAGES = [
  { key: "submission_received", label: "Submission",       demoCount: 18, colorClass: "text-primary",    activeBg: "bg-primary/10",    activeBorder: "border-primary" },
  { key: "editorial_screening", label: "Screening",        demoCount: 6,  colorClass: "text-blue-600",   activeBg: "bg-blue-500/10",   activeBorder: "border-blue-500" },
  { key: "peer_review",         label: "Peer Review",      demoCount: 14, colorClass: "text-amber-600",  activeBg: "bg-amber-500/10",  activeBorder: "border-amber-500" },
  { key: "revision_required",   label: "Revision",         demoCount: 8,  colorClass: "text-yellow-600", activeBg: "bg-yellow-500/10", activeBorder: "border-yellow-500" },
  { key: "decision",            label: "Final Decision",   demoCount: 5,  colorClass: "text-purple-600", activeBg: "bg-purple-500/10", activeBorder: "border-purple-500" },
  { key: "publication",         label: "Published",        demoCount: 32, colorClass: "text-emerald-600",activeBg: "bg-emerald-500/10",activeBorder: "border-emerald-500" },
];

const stageColors: Record<string, string> = {
  submission_received: "text-primary bg-primary/10",
  editorial_screening: "text-blue-600 bg-blue-500/10",
  peer_review:         "text-amber-600 bg-amber-500/10",
  revision_required:   "text-yellow-600 bg-yellow-500/10",
  decision:            "text-purple-600 bg-purple-500/10",
  publication:         "text-emerald-600 bg-emerald-500/10",
};
const statusColors: Record<string, string> = {
  submitted:         "bg-secondary text-secondary-foreground",
  revision_required: "bg-yellow-500/10 text-yellow-600",
  accepted:          "bg-emerald-500/10 text-emerald-600",
  rejected:          "bg-destructive/10 text-destructive",
  published:         "bg-primary/10 text-primary",
};

// ── Reviewer directory ───────────────────────────────────────────
const REVIEWER_DIRECTORY = [
  { name: "Dr. Fatima Bello",  institution: "University of Lagos",      expertise: "Public Health",        rating: 4.8, available: true },
  { name: "Dr. Ahmed Musa",    institution: "Ahmadu Bello University",  expertise: "Epidemiology",         rating: 4.6, available: true },
  { name: "Prof. Kwame Asante",institution: "University of Ghana",      expertise: "Computer Science",     rating: 4.9, available: false },
  { name: "Dr. Ngozi Okafor",  institution: "University of Nigeria",    expertise: "Agricultural Science", rating: 4.3, available: true },
  { name: "Dr. Tunde Adeyemi", institution: "University of Lagos",      expertise: "Political Science",    rating: 4.6, available: true },
  { name: "Dr. Grace Nwoye",   institution: "University of Cape Town",  expertise: "Environmental Science",rating: 4.4, available: true },
  { name: "Dr. Ama Mensah",    institution: "University of Ghana",      expertise: "Energy Policy",        rating: 4.7, available: true },
  { name: "Prof. Ibrahim Sadiq",institution: "University of Nairobi",  expertise: "Water Resources",      rating: 4.5, available: false },
];

const DEMO_ACTIVE_REVIEWERS = [
  { name: "Dr. Fatima Bello", institution: "University of Lagos",     status: "Review In Progress", deadline: "March 28, 2026" },
  { name: "Dr. Ahmed Musa",   institution: "Ahmadu Bello University", status: "Review Submitted",   deadline: "March 20, 2026" },
];

// ── Demo manuscripts ─────────────────────────────────────────────
const DEMO_SUBMISSIONS = [
  { id:"d1", user_id:"demo", title:"AI-Assisted Epidemiological Modeling in Sub-Saharan Africa",
    abstract:"This study explores how machine learning models can enhance epidemiological forecasting in resource-limited settings across Sub-Saharan Africa. We propose a novel hybrid model combining deep learning techniques with traditional epidemiological surveillance data.",
    keywords:"AI, Epidemiology, Machine Learning, Sub-Saharan Africa", research_field:"Public Health",
    journal_name:"African Journal of Public Health", journal_id:null, manuscript_url:null, cover_letter:null,
    co_authors:[{ name:"Dr. Kofi Mensah", institution:"University of Ghana" }],
    status:"submitted", workflow_stage:"peer_review", reviewer_feedback:[],
    submitted_at:"2026-03-02T00:00:00Z", updated_at:"2026-03-05T00:00:00Z" },

  { id:"d2", user_id:"demo", title:"Renewable Energy Policy Framework in West Africa",
    abstract:"Analysis of renewable energy adoption policies across ECOWAS nations and their impact on sustainable regional development.",
    keywords:"Energy, Policy, ECOWAS, Renewable", research_field:"Environmental Policy",
    journal_name:"Journal of African Energy Studies", journal_id:null, manuscript_url:null, cover_letter:null,
    co_authors:[{ name:"Dr. Ama Mensah", institution:"Kwame Nkrumah University" }],
    status:"submitted", workflow_stage:"editorial_screening", reviewer_feedback:[],
    submitted_at:"2026-03-04T00:00:00Z", updated_at:"2026-03-06T00:00:00Z" },

  { id:"d3", user_id:"demo", title:"Climate Policy Innovation in West Africa",
    abstract:"A comparative study of climate adaptation strategies in coastal West African nations, focusing on policy innovation and implementation challenges.",
    keywords:"Climate, Innovation, Adaptation, West Africa", research_field:"Political Science",
    journal_name:"African Policy Research Review", journal_id:null, manuscript_url:null, cover_letter:null,
    co_authors:[], status:"published", workflow_stage:"publication", reviewer_feedback:[],
    submitted_at:"2026-01-15T00:00:00Z", updated_at:"2026-02-28T00:00:00Z" },

  { id:"d4", user_id:"demo", title:"Digital Health Infrastructure in Rural Nigeria",
    abstract:"Assessing the state of digital health services in underserved communities across rural Nigeria, with recommendations for policy reform.",
    keywords:"Digital Health, Nigeria, Rural Communities", research_field:"Health Systems",
    journal_name:"African Journal of Public Health", journal_id:null, manuscript_url:null, cover_letter:null,
    co_authors:[{ name:"Dr. Fatima Bello", institution:"Ahmadu Bello University" }],
    status:"submitted", workflow_stage:"submission_received", reviewer_feedback:[],
    submitted_at:"2026-03-06T00:00:00Z", updated_at:"2026-03-06T00:00:00Z" },

  { id:"d5", user_id:"demo", title:"Indigenous Knowledge Systems and Modern Agriculture",
    abstract:"Integrating traditional farming practices with modern agritech solutions in East Africa for improved food security.",
    keywords:"Agriculture, Indigenous Knowledge, Technology, East Africa", research_field:"Agricultural Science",
    journal_name:"Journal of African Energy Studies", journal_id:null, manuscript_url:null, cover_letter:null,
    co_authors:[{ name:"Dr. Grace Nwoye", institution:"University of Cape Town" }],
    status:"revision_required", workflow_stage:"revision_required",
    reviewer_feedback:[{ reviewer:"Dr. Fatima Bello", comment:"The methodology requires additional dataset clarification. The sampling approach in Section 4 needs to be better justified with clearer inclusion/exclusion criteria." }],
    submitted_at:"2026-02-20T00:00:00Z", updated_at:"2026-03-04T00:00:00Z" },

  { id:"d6", user_id:"demo", title:"Financial Inclusion Through Mobile Banking in East Africa",
    abstract:"Examining mobile money impact on financial access in Kenya, Tanzania, and Uganda over a five-year period.",
    keywords:"FinTech, Mobile Banking, Financial Inclusion, East Africa", research_field:"Economics",
    journal_name:"East African Economic Review", journal_id:null, manuscript_url:null, cover_letter:null,
    co_authors:[], status:"accepted", workflow_stage:"decision", reviewer_feedback:[],
    submitted_at:"2026-02-01T00:00:00Z", updated_at:"2026-03-01T00:00:00Z" },

  { id:"d7", user_id:"demo", title:"Water Resource Management in the Sahel Region",
    abstract:"Assessment of water governance frameworks and their effectiveness in the Sahel, focusing on cross-border collaboration mechanisms.",
    keywords:"Water, Governance, Sahel, Cross-border", research_field:"Environmental Science",
    journal_name:"African Policy Research Review", journal_id:null, manuscript_url:null, cover_letter:null,
    co_authors:[{ name:"Prof. Ibrahim Sadiq", institution:"University of Nairobi" }],
    status:"submitted", workflow_stage:"submission_received", reviewer_feedback:[],
    submitted_at:"2026-03-07T00:00:00Z", updated_at:"2026-03-07T00:00:00Z" },

  { id:"d8", user_id:"demo", title:"Urban Planning Challenges in Rapidly Growing African Cities",
    abstract:"Analysis of urban planning challenges facing megacities in Africa with case studies from Lagos, Nairobi, and Cairo.",
    keywords:"Urban Planning, Cities, Megacities, Africa", research_field:"Urban Studies",
    journal_name:"African Policy Research Review", journal_id:null, manuscript_url:null, cover_letter:null,
    co_authors:[], status:"submitted", workflow_stage:"peer_review", reviewer_feedback:[],
    submitted_at:"2026-02-25T00:00:00Z", updated_at:"2026-03-03T00:00:00Z" },
] as any[];

// ── Decision options ─────────────────────────────────────────────
type DecisionType = "accept" | "minor_revision" | "major_revision" | "reject" | "";
const DECISIONS: { value: DecisionType; label: string; description: string; selectedClass: string }[] = [
  { value: "accept",         label: "Accept",          description: "Accept the manuscript for publication.",         selectedClass: "border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400" },
  { value: "minor_revision", label: "Minor Revision",  description: "Minor revisions required before final acceptance.",selectedClass: "border-blue-500 bg-blue-500/5 text-blue-700 dark:text-blue-400" },
  { value: "major_revision", label: "Major Revision",  description: "Significant revisions required; will be re-reviewed.",selectedClass: "border-amber-500 bg-amber-500/5 text-amber-700 dark:text-amber-400" },
  { value: "reject",         label: "Reject",           description: "Reject the manuscript as submitted.",            selectedClass: "border-destructive bg-destructive/5 text-destructive" },
];

// ────────────────────────────────────────────────────────────────
const EditorialWorkflow = () => {
  const { submissions: dbSubmissions, loading, updateSubmission } = usePublishing();
  const submissions = dbSubmissions.length > 0 ? dbSubmissions : DEMO_SUBMISSIONS;

  const [activeStage,       setActiveStage]       = useState<string | null>(null);
  const [searchQuery,       setSearchQuery]       = useState("");
  const [selectedMs,        setSelectedMs]        = useState<any | null>(null);
  const [sheetOpen,         setSheetOpen]         = useState(false);
  const [activeTab,         setActiveTab]         = useState("details");
  const [assignOpen,        setAssignOpen]        = useState(false);
  const [decisionOpen,      setDecisionOpen]      = useState(false);
  const [reviewerSearch,    setReviewerSearch]    = useState("");
  const [selectedReviewer,  setSelectedReviewer]  = useState<any | null>(null);
  const [selectedDecision,  setSelectedDecision]  = useState<DecisionType>("");
  const [decisionMessage,   setDecisionMessage]   = useState("");
  const [decisionSent,      setDecisionSent]      = useState(false);

  // Metrics
  const metrics = useMemo(() => ({
    newSubmissions:  Math.max(submissions.filter(s => s.workflow_stage === "submission_received").length, 18),
    inReview:        Math.max(submissions.filter(s => s.workflow_stage === "peer_review").length, 34),
    awaitingRevision:Math.max(submissions.filter(s => s.workflow_stage === "revision_required").length, 11),
    accepted:        Math.max(submissions.filter(s => s.status === "accepted" || s.workflow_stage === "decision").length, 42),
    rejected:        Math.max(submissions.filter(s => s.status === "rejected").length, 23),
  }), [submissions]);

  // Pipeline counts
  const pipelineCounts = useMemo(() =>
    PIPELINE_STAGES.reduce((acc, stage) => {
      const live = submissions.filter(s => s.workflow_stage === stage.key).length;
      acc[stage.key] = live > 0 ? live : stage.demoCount;
      return acc;
    }, {} as Record<string, number>),
  [submissions]);

  // Filtered table
  const filteredSubmissions = useMemo(() => {
    let list = activeStage ? submissions.filter(s => s.workflow_stage === activeStage) : submissions;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.journal_name.toLowerCase().includes(q) ||
        (s.research_field || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [submissions, activeStage, searchQuery]);

  const openManuscript = (ms: any, tab = "details") => {
    setSelectedMs(ms);
    setActiveTab(tab);
    setSheetOpen(true);
  };

  const handleSendDecision = async () => {
    if (!selectedMs || !selectedDecision) return;
    const stageMap: Record<string, string> = { accept:"decision", minor_revision:"revision_required", major_revision:"revision_required", reject:"decision" };
    const statusMap: Record<string, string> = { accept:"accepted", minor_revision:"revision_required", major_revision:"revision_required", reject:"rejected" };
    if (selectedMs.user_id !== "demo") {
      await updateSubmission.mutateAsync({ id: selectedMs.id, workflow_stage: stageMap[selectedDecision], status: statusMap[selectedDecision] });
    }
    setDecisionSent(true);
    toast.success("Editorial decision sent successfully.");
    setTimeout(() => { setDecisionOpen(false); setDecisionSent(false); setSelectedDecision(""); setDecisionMessage(""); }, 2500);
  };

  const handleAssignReviewer = () => {
    if (!selectedReviewer) return;
    toast.success(`${selectedReviewer.name} has been invited to review. A notification has been sent.`);
    setAssignOpen(false);
    setSelectedReviewer(null);
    setReviewerSearch("");
  };

  const filteredReviewers = REVIEWER_DIRECTORY.filter(r =>
    !reviewerSearch.trim() ||
    r.name.toLowerCase().includes(reviewerSearch.toLowerCase()) ||
    r.institution.toLowerCase().includes(reviewerSearch.toLowerCase()) ||
    r.expertise.toLowerCase().includes(reviewerSearch.toLowerCase())
  );

  const getStageLabel = (key: string) => PIPELINE_STAGES.find(s => s.key === key)?.label ?? key.replace(/_/g, " ");

  // ── RENDER ──────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto space-y-6 px-2 sm:px-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/publishing" className="hover:text-foreground">Publishing</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Editorial Workflow</span>
        </div>

        {/* Page Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-serif">Editorial Workflow</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage manuscript submissions, assign reviewers, and make editorial decisions.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Link to="/dashboard/publishing/journals">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <BookOpen className="h-3.5 w-3.5" /> Journal Management
              </Button>
            </Link>
            <Link to="/dashboard/publishing/editorial-analytics">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <BarChart3 className="h-3.5 w-3.5" /> Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* Call for Papers — mirrors public site intro */}
        <div className="rounded-2xl border border-accent/30 bg-gradient-to-r from-accent/10 via-card to-primary/5 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2 max-w-2xl">
              <Badge className="bg-accent/15 text-accent border-0">Call for Papers</Badge>
              <h2 className="text-lg font-bold text-foreground font-serif">
                Invite submissions for your journal's next issue
              </h2>
              <p className="text-sm text-muted-foreground">
                Publish a Call for Papers to attract high-quality submissions from researchers across Africa.
                Set the scope, deadlines, and review timelines — Afrika Scholar handles distribution to relevant authors.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/dashboard/publishing/journals">
                <Button variant="afrika" size="sm" className="gap-1">
                  <Send className="h-3.5 w-3.5" /> Publish Call for Papers
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── SECTION 1: OVERVIEW METRICS ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label:"New Submissions",  value:metrics.newSubmissions,   icon:Inbox,        stage:"submission_received", colorClass:"text-primary",    bgClass:"bg-primary/10" },
            { label:"Papers in Review", value:metrics.inReview,         icon:Users,        stage:"peer_review",         colorClass:"text-amber-600",  bgClass:"bg-amber-500/10" },
            { label:"Awaiting Revision",value:metrics.awaitingRevision, icon:RefreshCw,    stage:"revision_required",   colorClass:"text-yellow-600", bgClass:"bg-yellow-500/10" },
            { label:"Accepted Papers",  value:metrics.accepted,         icon:CheckCircle,  stage:"decision",            colorClass:"text-emerald-600",bgClass:"bg-emerald-500/10" },
            { label:"Rejected Papers",  value:metrics.rejected,         icon:XCircle,      stage:null,                  colorClass:"text-destructive",bgClass:"bg-destructive/10" },
          ].map((card, i) => (
            <Card
              key={i}
              className={`border-border cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${activeStage === card.stage && card.stage ? "ring-2 ring-accent ring-offset-1" : ""}`}
              onClick={() => card.stage && setActiveStage(s => s === card.stage ? null : card.stage)}
            >
              <CardContent className="p-4">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-3 ${card.bgClass}`}>
                  <card.icon className={`h-4 w-4 ${card.colorClass}`} />
                </div>
                <p className={`text-2xl font-bold ${card.colorClass}`}>{card.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── SECTION 2: MANUSCRIPT PIPELINE ── */}
        <Card className="border-border">
          <CardHeader className="pb-2 pt-4 px-6">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Manuscript Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-4">
            <div className="flex items-center gap-0 overflow-x-auto pb-1">
              {/* "All" button */}
              <button
                onClick={() => setActiveStage(null)}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-lg mr-2 border-2 text-sm font-medium transition-all ${
                  activeStage === null
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground"
                }`}
              >
                <span className="text-xl font-bold">{submissions.length || 83}</span>
                <span className="text-[11px] mt-0.5">All</span>
              </button>
              {PIPELINE_STAGES.map((stage, idx) => (
                <div key={stage.key} className="flex items-center flex-shrink-0">
                  <ArrowRight className="h-3 w-3 text-muted-foreground/30 mx-1 flex-shrink-0" />
                  <button
                    onClick={() => setActiveStage(s => s === stage.key ? null : stage.key)}
                    className={`flex flex-col items-center px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                      activeStage === stage.key
                        ? `${stage.activeBg} ${stage.activeBorder} ${stage.colorClass}`
                        : "border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
                    }`}
                  >
                    <span className="text-xl font-bold">{pipelineCounts[stage.key]}</span>
                    <span className="text-[11px] mt-0.5 whitespace-nowrap">{stage.label}</span>
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── SECTION 3: MANUSCRIPT MANAGEMENT TABLE ── */}
        <Card className="border-border">
          <CardHeader className="pb-3 px-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <CardTitle className="text-base font-semibold">
                  {activeStage ? `${getStageLabel(activeStage)}` : "All Manuscripts"}
                  <span className="ml-1.5 text-muted-foreground font-normal text-sm">({filteredSubmissions.length})</span>
                </CardTitle>
                {activeStage && (
                  <button onClick={() => setActiveStage(null)} className="text-xs text-accent hover:underline mt-0.5">
                    Clear stage filter
                  </button>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search manuscripts..."
                  className="pl-9 h-9 w-60 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="space-y-2 px-6 pb-6">
                {[1,2,3].map(i => <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />)}
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="py-16 text-center px-4">
                <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">No manuscripts found{activeStage ? " in this stage" : ""}.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeStage ? "Try selecting a different stage or clearing the filter." : "Submit a manuscript to start the editorial process."}
                </p>
                {activeStage && (
                  <Button variant="outline" size="sm" className="mt-4 gap-1.5 text-xs" onClick={() => setActiveStage(null)}>
                    View all manuscripts
                  </Button>
                )}
                {!activeStage && (
                  <Link to="/dashboard/publishing/submit">
                    <Button variant="afrika" size="sm" className="mt-4 gap-1.5 text-xs">Submit Manuscript</Button>
                  </Link>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Paper Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Journal</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((ms) => {
                    const authorName = (ms.co_authors as any[])?.[0]?.name ?? "Submitter";
                    return (
                      <TableRow key={ms.id} className="hover:bg-secondary/40 group">
                        <TableCell className="pl-6 max-w-[220px]">
                          <button
                            className="text-left font-medium text-sm text-foreground hover:text-accent transition-colors line-clamp-2 leading-snug"
                            onClick={() => openManuscript(ms, "details")}
                          >
                            {ms.title}
                          </button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                              <User className="h-3 w-3 text-accent" />
                            </div>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">{authorName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[140px]">
                          <span className="line-clamp-1">{ms.journal_name}</span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {new Date(ms.submitted_at).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })}
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-[11px] font-medium capitalize ${stageColors[ms.workflow_stage] ?? "bg-secondary text-secondary-foreground"}`}>
                            {getStageLabel(ms.workflow_stage)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-[11px] font-medium capitalize ${statusColors[ms.status] ?? "bg-secondary text-secondary-foreground"}`}>
                            {ms.status.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground" onClick={() => openManuscript(ms, "details")}>
                              <Eye className="h-3 w-3" /> View
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground hover:text-accent" onClick={() => { setSelectedMs(ms); setAssignOpen(true); }}>
                              <UserPlus className="h-3 w-3" /> Assign
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground hover:text-primary" onClick={() => { setSelectedMs(ms); setDecisionOpen(true); }}>
                              <Send className="h-3 w-3" /> Decision
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* ══════════════════════════════════════════════════════════
            MANUSCRIPT DETAIL SHEET
        ══════════════════════════════════════════════════════════ */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-3xl p-0 flex flex-col">
            {selectedMs && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">

                {/* Sticky header */}
                <div className="flex-shrink-0 bg-background border-b border-border px-6 pt-5 pb-0">
                  <SheetHeader className="mb-3">
                    <SheetTitle className="text-lg font-bold font-serif leading-tight text-left pr-8 line-clamp-2">
                      {selectedMs.title}
                    </SheetTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-muted-foreground">{selectedMs.journal_name}</span>
                      <Badge className={`text-[10px] capitalize ${stageColors[selectedMs.workflow_stage] ?? ""}`}>
                        {getStageLabel(selectedMs.workflow_stage)}
                      </Badge>
                      <Badge className={`text-[10px] capitalize ${statusColors[selectedMs.status] ?? ""}`}>
                        {selectedMs.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </SheetHeader>
                  <TabsList className="w-full justify-start rounded-none bg-transparent border-b-0 p-0 h-10 gap-1">
                    {["details","reviews","revisions","decision"].map(t => (
                      <TabsTrigger
                        key={t}
                        value={t}
                        className="capitalize text-xs rounded-t-md rounded-b-none data-[state=active]:bg-background data-[state=active]:border data-[state=active]:border-b-background data-[state=active]:border-border data-[state=active]:shadow-none relative -mb-px"
                      >
                        {t}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-6 py-5">

                  {/* ── DETAILS TAB ─────────────────────────────── */}
                  <TabsContent value="details" className="mt-0 space-y-6 data-[state=inactive]:hidden">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Research Field</p>
                        <p className="text-sm font-medium text-foreground">{selectedMs.research_field || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Submission Date</p>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(selectedMs.submitted_at).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" })}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Keywords</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(selectedMs.keywords || "").split(",").filter(Boolean).map((kw: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">{kw.trim()}</Badge>
                          ))}
                          {!selectedMs.keywords && <span className="text-sm text-muted-foreground">Not specified</span>}
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Abstract</p>
                      <p className="text-sm text-foreground leading-relaxed">{selectedMs.abstract || "No abstract provided."}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Authors</p>
                      {(selectedMs.co_authors as any[])?.length > 0 ? (
                        <div className="space-y-2">
                          {(selectedMs.co_authors as any[]).map((a: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 bg-secondary/60 rounded-lg p-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
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
                    <Separator />
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Submission Files</p>
                      <div className="space-y-2">
                        {[
                          { name:"Manuscript.pdf",             meta:"Main document · 2.4 MB",        color:"bg-primary/10 text-primary" },
                          { name:"Supplementary_Files.zip",    meta:"Supplementary materials · 5.1 MB",color:"bg-accent/10 text-accent" },
                        ].map((f, i) => (
                          <div key={i} className="flex items-center justify-between bg-secondary/60 rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${f.color}`}>
                                <FileText className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{f.name}</p>
                                <p className="text-xs text-muted-foreground">{f.meta}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-1 text-xs h-8" onClick={() => toast.info("Download would start in production.")}>
                              <Download className="h-3 w-3" /> Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setActiveTab("reviews")}>
                        <UserPlus className="h-3.5 w-3.5" /> Assign Reviewer
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setActiveTab("decision")}>
                        <Send className="h-3.5 w-3.5" /> Send Decision
                      </Button>
                    </div>
                  </TabsContent>

                  {/* ── REVIEWS TAB ─────────────────────────────── */}
                  <TabsContent value="reviews" className="mt-0 space-y-6 data-[state=inactive]:hidden">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Peer Review Status</p>
                        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setAssignOpen(true)}>
                          <UserPlus className="h-3.5 w-3.5" /> Assign Reviewer
                        </Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="pl-0">Reviewer</TableHead>
                            <TableHead>Institution</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {DEMO_ACTIVE_REVIEWERS.map((r, i) => (
                            <TableRow key={i}>
                              <TableCell className="pl-0">
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                                    <User className="h-3.5 w-3.5 text-accent" />
                                  </div>
                                  <span className="text-sm font-medium text-foreground whitespace-nowrap">{r.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">{r.institution}</TableCell>
                              <TableCell>
                                <Badge className={`text-[10px] ${r.status === "Review Submitted" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                                  {r.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">{r.deadline}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.info("Detailed review panel coming soon.")}>
                                    View Review
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => { setAssignOpen(true); }}>
                                    Replace
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Reviewer Comments</p>
                      <div className="space-y-3">
                        {DEMO_ACTIVE_REVIEWERS.map((r, i) => (
                          <div key={i} className="bg-secondary/60 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-semibold text-foreground">{r.name}</p>
                              <p className="text-[10px] text-muted-foreground">{r.deadline}</p>
                            </div>
                            {r.status === "Review Submitted" ? (
                              <p className="text-sm text-foreground leading-relaxed italic">
                                "The methodology is solid but requires more detail on dataset selection. Consider expanding Section 3.2 with additional validation metrics. The results section is well presented overall."
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground italic">Review pending submission...</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.success("Reminder sent to pending reviewers.")}>
                        <Send className="h-3.5 w-3.5" /> Send Reminder
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setActiveTab("decision")}>
                        <ChevronRight className="h-3.5 w-3.5" /> Proceed to Decision
                      </Button>
                    </div>
                  </TabsContent>

                  {/* ── REVISIONS TAB ───────────────────────────── */}
                  <TabsContent value="revisions" className="mt-0 space-y-6 data-[state=inactive]:hidden">
                    {selectedMs.workflow_stage === "revision_required" ? (
                      <>
                        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">Revision Round 1 — Active</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Author revision requested on {new Date(selectedMs.updated_at).toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" })}.
                              </p>
                            </div>
                          </div>
                        </div>
                        {(selectedMs.reviewer_feedback as any[])?.length > 0 && (
                          <div>
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Reviewer Feedback</p>
                            {(selectedMs.reviewer_feedback as any[]).map((fb: any, i: number) => (
                              <div key={i} className="bg-secondary/60 rounded-lg p-4">
                                <p className="text-xs font-semibold text-muted-foreground mb-1">{fb.reviewer ?? `Reviewer ${i+1}`}</p>
                                <p className="text-sm text-foreground leading-relaxed italic">"{fb.comment ?? fb}"</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div>
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Author Response</p>
                          <div className="flex items-center justify-between bg-secondary/60 rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Awaiting author revision upload</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.success("Revision request sent to author.")}>
                            <RefreshCw className="h-3.5 w-3.5" /> Re-request Revision
                          </Button>
                          <Button variant="afrika" size="sm" className="gap-1.5 text-xs" onClick={() => { toast.success("Revision accepted."); setActiveTab("decision"); }}>
                            <CheckCircle className="h-3.5 w-3.5" /> Accept Revision
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <div className={`h-14 w-14 rounded-full mx-auto flex items-center justify-center mb-3 ${selectedMs.workflow_stage === "publication" || selectedMs.status === "accepted" ? "bg-emerald-500/10" : "bg-secondary"}`}>
                          {selectedMs.workflow_stage === "publication" || selectedMs.status === "accepted" ? (
                            <CheckCircle className="h-7 w-7 text-emerald-600" />
                          ) : (
                            <Circle className="h-7 w-7 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {selectedMs.workflow_stage === "publication" || selectedMs.status === "accepted"
                            ? "No revisions required"
                            : "No active revision request"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                          {selectedMs.workflow_stage === "publication"
                            ? "This manuscript was accepted for publication without revisions."
                            : "You can request revisions after reviewing the peer review report."}
                        </p>
                        {selectedMs.workflow_stage !== "publication" && selectedMs.status !== "accepted" && (
                          <Button variant="outline" size="sm" className="mt-4 gap-1.5 text-xs" onClick={() => toast.success("Revision request sent to author.")}>
                            <RefreshCw className="h-3.5 w-3.5" /> Request Revision
                          </Button>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  {/* ── DECISION TAB ─────────────────────────────── */}
                  <TabsContent value="decision" className="mt-0 space-y-6 data-[state=inactive]:hidden">
                    {(selectedMs.status === "accepted" || selectedMs.workflow_stage === "publication") ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-8 text-center">
                        <div className="h-14 w-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-7 w-7 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Ready for Publication</h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                          This manuscript has been accepted and is ready for publication in <strong className="text-foreground">{selectedMs.journal_name}</strong>.
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info("Publication scheduler coming soon.")}>
                            <Calendar className="h-4 w-4" /> Schedule Publication
                          </Button>
                          <Button variant="afrika" size="sm" className="gap-1.5" onClick={() => toast.success("Manuscript published successfully!")}>
                            <Globe className="h-4 w-4" /> Publish Now
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Editorial Decision</p>
                          <div className="grid grid-cols-2 gap-3">
                            {DECISIONS.map((d) => (
                              <button
                                key={d.value}
                                onClick={() => setSelectedDecision(d.value)}
                                className={`text-left p-4 rounded-lg border-2 transition-all ${
                                  selectedDecision === d.value
                                    ? d.selectedClass
                                    : "border-border text-muted-foreground hover:border-muted-foreground/60 hover:text-foreground"
                                }`}
                              >
                                <p className="text-sm font-semibold">{d.label}</p>
                                <p className="text-[11px] mt-0.5 leading-snug opacity-80">{d.description}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Message to Author
                          </Label>
                          <Textarea
                            className="mt-2"
                            rows={4}
                            placeholder="Explain the editorial decision to the author. This message will be sent with the decision notification."
                            value={decisionMessage}
                            onChange={(e) => setDecisionMessage(e.target.value)}
                          />
                        </div>
                        {selectedMs.status !== "submitted" && (
                          <div className="p-3 bg-secondary rounded-lg">
                            <p className="text-[11px] text-muted-foreground uppercase font-semibold mb-0.5">Current Decision</p>
                            <p className="text-sm font-semibold text-foreground capitalize">
                              {selectedMs.status.replace(/_/g, " ")}
                            </p>
                          </div>
                        )}
                        <Button
                          variant="afrika"
                          className="gap-1.5 w-full sm:w-auto"
                          disabled={!selectedDecision}
                          onClick={() => {
                            if (!selectedDecision) return;
                            toast.success("Editorial decision sent successfully. Author has been notified: \"Your manuscript decision has been issued.\"");
                            setSheetOpen(false);
                          }}
                        >
                          <Send className="h-4 w-4" /> Send Decision to Author
                        </Button>
                      </>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            )}
          </SheetContent>
        </Sheet>

        {/* ══════════════════════════════════════════════════════════
            ASSIGN REVIEWER DIALOG
        ══════════════════════════════════════════════════════════ */}
        <Dialog open={assignOpen} onOpenChange={(o) => { setAssignOpen(o); if (!o) { setSelectedReviewer(null); setReviewerSearch(""); } }}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif">Assign Reviewer</DialogTitle>
              <DialogDescription className="line-clamp-2">
                Select a qualified reviewer for: <strong className="text-foreground">{selectedMs?.title}</strong>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Search by name, institution, or expertise area..."
                  value={reviewerSearch}
                  onChange={(e) => setReviewerSearch(e.target.value)}
                />
              </div>
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {filteredReviewers.map((r, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedReviewer(r)}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedReviewer?.name === r.name
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-muted-foreground/40 hover:bg-secondary/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.institution} · {r.expertise}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> {r.rating}
                      </div>
                      <Badge className={`text-[10px] ${r.available ? "bg-emerald-500/10 text-emerald-600" : "bg-secondary text-muted-foreground"}`}>
                        {r.available ? "Available" : "Busy"}
                      </Badge>
                    </div>
                  </div>
                ))}
                {filteredReviewers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">No reviewers match your search.</p>
                  </div>
                )}
              </div>
              {selectedReviewer && (
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
                  <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Selected Reviewer</p>
                  <p className="text-sm font-medium text-foreground">{selectedReviewer.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedReviewer.institution} · {selectedReviewer.expertise}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setAssignOpen(false); setSelectedReviewer(null); setReviewerSearch(""); }}>Cancel</Button>
              <Button variant="afrika" disabled={!selectedReviewer} onClick={handleAssignReviewer}>
                <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Assign Reviewer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ══════════════════════════════════════════════════════════
            SEND DECISION DIALOG
        ══════════════════════════════════════════════════════════ */}
        <Dialog open={decisionOpen} onOpenChange={(o) => { setDecisionOpen(o); if (!o) { setDecisionSent(false); setSelectedDecision(""); setDecisionMessage(""); } }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif">Send Editorial Decision</DialogTitle>
              {selectedMs && <DialogDescription className="line-clamp-2">{selectedMs.title}</DialogDescription>}
            </DialogHeader>
            {decisionSent ? (
              <div className="py-10 text-center">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-foreground">Decision Sent Successfully</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                  The author has been notified: "Your manuscript decision has been issued."
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {DECISIONS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setSelectedDecision(d.value)}
                      className={`text-left p-3 rounded-lg border-2 transition-all ${
                        selectedDecision === d.value ? d.selectedClass : "border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
                      }`}
                    >
                      <p className="text-sm font-semibold">{d.label}</p>
                      <p className="text-[11px] mt-0.5 opacity-80 leading-snug">{d.description}</p>
                    </button>
                  ))}
                </div>
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase">Message to Author</Label>
                  <Textarea className="mt-1.5" rows={3} placeholder="Explain the decision to the author..." value={decisionMessage} onChange={(e) => setDecisionMessage(e.target.value)} />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDecisionOpen(false)}>Cancel</Button>
                  <Button variant="afrika" disabled={!selectedDecision} onClick={handleSendDecision}>
                    <Send className="h-3.5 w-3.5 mr-1.5" /> Send Decision
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
};

export default EditorialWorkflow;
