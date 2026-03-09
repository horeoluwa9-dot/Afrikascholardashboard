import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText, Clock, CheckCircle, ChevronRight, Eye, Download, Star,
  Award, Zap, BookOpen, Calendar, AlertCircle, ArrowRight, Users,
  Bell, Shield, TrendingUp, BarChart2,
} from "lucide-react";
import { toast } from "sonner";

// ── Data Types ──────────────────────────────────────────────────────────────

interface ReviewRequest {
  id: string;
  title: string;
  journal: string;
  editor: string;
  assignedDate: string;
  deadline: string;
  status: "awaiting_response" | "accepted" | "declined";
  blind: boolean;
  abstract: string;
  authors: string;
  keywords: string;
}

interface ActiveReview {
  id: string;
  title: string;
  journal: string;
  deadline: string;
  daysRemaining: number;
  progress: number;
}

interface CompletedReview {
  id: string;
  title: string;
  journal: string;
  reviewDate: string;
  decision: string;
  ratings: Record<string, number>;
}

// ── Demo Data ──────────────────────────────────────────────────────────────

const INIT_REQUESTS: ReviewRequest[] = [
  {
    id: "rr1",
    title: "AI-Assisted Epidemiological Modeling in Sub-Saharan Africa",
    journal: "African Journal of Public Health",
    editor: "Dr. Amina Bello",
    assignedDate: "2026-03-12",
    deadline: "2026-03-28",
    status: "awaiting_response",
    blind: true,
    abstract:
      "This study explores how machine learning models can enhance epidemiological forecasting in resource-limited settings across Sub-Saharan Africa. The paper presents a novel framework combining traditional epidemiological methods with deep learning approaches to improve prediction accuracy for infectious disease outbreaks.",
    authors: "Anonymous (Blind Review)",
    keywords: "Machine Learning, Epidemiology, Sub-Saharan Africa, Forecasting",
  },
  {
    id: "rr2",
    title: "Digital Health Infrastructure in Rural Nigeria",
    journal: "East African Medical Journal",
    editor: "Prof. Kwame Asante",
    assignedDate: "2026-03-14",
    deadline: "2026-04-01",
    status: "awaiting_response",
    blind: false,
    abstract:
      "Assessing the current state of digital health services in underserved communities across rural Nigeria, identifying key infrastructure gaps and proposing an evidence-based roadmap for improvement.",
    authors: "Dr. Chinwe Okeke, University of Abuja",
    keywords: "Digital Health, Nigeria, Rural Healthcare, Infrastructure",
  },
];

const INIT_ACTIVE: ActiveReview[] = [
  {
    id: "ar1",
    title: "Climate Policy Innovation in West Africa",
    journal: "Journal of African Policy Studies",
    deadline: "2026-04-03",
    daysRemaining: 26,
    progress: 40,
  },
  {
    id: "ar2",
    title: "Agricultural Innovation Systems",
    journal: "Journal of African Development Studies",
    deadline: "2026-03-15",
    daysRemaining: 3,
    progress: 70,
  },
];

const COMPLETED_REVIEWS: CompletedReview[] = [
  {
    id: "cr1",
    title: "Renewable Energy Policy Framework",
    journal: "Journal of Energy Economics",
    reviewDate: "2026-02-18",
    decision: "Minor Revisions",
    ratings: { originality: 4, methodology: 3, clarity: 4, contribution: 4, ethics: 5 },
  },
  {
    id: "cr2",
    title: "Mobile Banking Adoption in East Africa",
    journal: "East African Economic Review",
    reviewDate: "2026-01-25",
    decision: "Accept",
    ratings: { originality: 5, methodology: 5, clarity: 4, contribution: 5, ethics: 5 },
  },
  {
    id: "cr3",
    title: "Water Governance in the Sahel",
    journal: "African Environmental Studies",
    reviewDate: "2025-12-10",
    decision: "Major Revisions",
    ratings: { originality: 3, methodology: 2, clarity: 3, contribution: 3, ethics: 4 },
  },
  {
    id: "cr4",
    title: "Pan-African Trade Corridors: A Longitudinal Analysis",
    journal: "Journal of African Trade",
    reviewDate: "2025-11-02",
    decision: "Reject",
    ratings: { originality: 2, methodology: 2, clarity: 3, contribution: 2, ethics: 4 },
  },
];

const DEADLINES = [
  { id: "ar2", title: "Agricultural Innovation Systems", journal: "Journal of African Development Studies", daysRemaining: 3 },
  { id: "ar1", title: "Climate Policy Innovation in West Africa", journal: "Journal of African Policy Studies", daysRemaining: 26 },
];

const RECOGNITION = {
  reviewsCompleted: 12,
  avgReviewTime: "9 days",
  reviewerRating: 4.7,
  fieldsReviewed: ["Public Health", "Energy Policy", "Environmental Science", "Economics"],
  topJournals: [
    "African J. Public Health",
    "Journal of Energy Economics",
    "East African Economic Review",
  ],
  badges: [
    { label: "Top Reviewer", icon: Star, colorClass: "text-accent", bgClass: "bg-accent/10" },
    { label: "Fast Reviewer", icon: Zap, colorClass: "text-primary", bgClass: "bg-primary/10" },
    { label: "Expert Reviewer", icon: Award, colorClass: "text-foreground", bgClass: "bg-secondary" },
  ],
};

const DECISION_COLOR: Record<string, string> = {
  Accept: "bg-primary/10 text-primary border-primary/20",
  "Minor Revisions": "bg-accent/10 text-accent border-accent/20",
  "Major Revisions": "bg-secondary text-secondary-foreground border-border",
  Reject: "bg-destructive/10 text-destructive border-destructive/20",
};

// ── Component ──────────────────────────────────────────────────────────────

export default function PeerReviewsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ReviewRequest[]>(INIT_REQUESTS);
  const [activeReviews, setActiveReviews] = useState<ActiveReview[]>(INIT_ACTIVE);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ReviewRequest | null>(null);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [selectedCompleted, setSelectedCompleted] = useState<CompletedReview | null>(null);

  const pending = requests.filter(r => r.status === "awaiting_response");

  const handleAccept = (req: ReviewRequest) => {
    setSelectedRequest(req);
    setShowAcceptDialog(true);
  };

  const handleDecline = (req: ReviewRequest) => {
    setRequests(prev =>
      prev.map(r => r.id === req.id ? { ...r, status: "declined" as const } : r)
    );
    toast.success("Review invitation declined");
  };

  const handleStartReview = () => {
    if (!selectedRequest) return;
    setRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
    setActiveReviews(prev => [
      ...prev,
      {
        id: selectedRequest.id,
        title: selectedRequest.title,
        journal: selectedRequest.journal,
        deadline: selectedRequest.deadline,
        daysRemaining: 16,
        progress: 0,
      },
    ]);
    setShowAcceptDialog(false);
    toast.success("Review accepted — opening workspace");
    navigate(`/dashboard/publishing/reviews/workspace/${selectedRequest.id}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/publishing" className="hover:text-foreground">Publishing</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Peer Reviews</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-serif">Peer Reviews</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage journal review requests and track your reviewer contributions.
            </p>
          </div>
          {pending.length > 0 && (
            <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-lg px-4 py-2 shrink-0">
              <Bell className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold text-accent">{pending.length} pending request{pending.length > 1 ? "s" : ""}</span>
            </div>
          )}
        </div>

        <Tabs defaultValue="requests">
          <TabsList className="h-9">
            <TabsTrigger value="requests" className="text-xs gap-1.5">
              Review Requests
              {pending.length > 0 && (
                <Badge className="text-[9px] h-4 px-1.5 min-w-[18px]">{pending.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs gap-1.5">
              Active Reviews
              {activeReviews.length > 0 && (
                <Badge variant="secondary" className="text-[9px] h-4 px-1.5">{activeReviews.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="deadlines" className="text-xs">Deadlines</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
            <TabsTrigger value="recognition" className="text-xs">Recognition</TabsTrigger>
          </TabsList>

          {/* ─── SECTION 1: Review Requests ─────────────────────────────── */}
          <TabsContent value="requests" className="space-y-4 mt-4">
            {pending.length === 0 ? (
              <Card className="border-border">
                <CardContent className="py-16 text-center">
                  <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <h3 className="font-semibold text-foreground text-base">You currently have no review requests.</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                    When a journal editor assigns you a paper to review, it will appear here.
                  </p>
                  <Link to="/dashboard/publishing/journals">
                    <Button className="mt-4 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                      <BookOpen className="h-4 w-4" /> Browse Journals
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-secondary/40">
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Paper Title</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Journal</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Editor</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Assigned</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Deadline</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                          <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {pending.map(req => (
                          <tr key={req.id} className="hover:bg-secondary/20 transition-colors">
                            <td className="px-5 py-4 max-w-[220px]">
                              <p className="font-semibold text-foreground text-sm line-clamp-2 leading-tight">{req.title}</p>
                              {req.blind && (
                                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                                  <Shield className="h-2.5 w-2.5" /> Double-Blind
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-xs text-muted-foreground max-w-[140px]">
                              <span className="line-clamp-2">{req.journal}</span>
                            </td>
                            <td className="px-5 py-4 text-xs text-foreground font-medium whitespace-nowrap">{req.editor}</td>
                            <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(req.assignedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </td>
                            <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(req.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </td>
                            <td className="px-5 py-4">
                              <Badge variant="outline" className="text-[10px] text-foreground border-border bg-secondary whitespace-nowrap">
                                Awaiting Response
                              </Badge>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                                <Button size="sm" className="text-xs h-7 gap-1 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleAccept(req)}>
                                                  <CheckCircle className="h-3 w-3" /> Accept Review
                                </Button>
                                <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => handleDecline(req)}>
                                  Decline
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ─── SECTION 2: Active Reviews ──────────────────────────────── */}
          <TabsContent value="active" className="space-y-4 mt-4">
            {activeReviews.length === 0 ? (
              <Card className="border-border">
                <CardContent className="py-16 text-center">
                  <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <h3 className="font-semibold text-foreground">No active reviews.</h3>
                  <p className="text-sm text-muted-foreground mt-1">Accept a review request to begin your evaluation.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeReviews.map(review => (
                  <Card key={review.id} className={`border-border ${review.daysRemaining <= 5 ? "border-l-4 border-l-destructive" : ""}`}>
                    <CardContent className="pt-5 pb-4 px-5 space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground leading-tight">{review.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                          <BookOpen className="h-3 w-3 shrink-0" />
                          <span>{review.journal}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Deadline:</span>
                          <span className={`font-semibold ${review.daysRemaining <= 5 ? "text-destructive" : "text-foreground"}`}>
                            {new Date(review.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <Badge variant={review.daysRemaining <= 5 ? "destructive" : "secondary"} className="text-[10px]">
                          {review.daysRemaining <= 5 && <AlertCircle className="h-2.5 w-2.5 mr-1" />}
                          {review.daysRemaining} days remaining
                        </Badge>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-muted-foreground">Review Progress</span>
                          <span className="text-foreground font-semibold">{review.progress}%</span>
                        </div>
                        <Progress value={review.progress} className="h-2" />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Link to={`/dashboard/publishing/reviews/workspace/${review.id}`} className="flex-1">
                          <Button size="sm" className="text-xs h-8 gap-1.5 w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                            <FileText className="h-3 w-3" /> Continue Review
                          </Button>
                        </Link>
                        <Link to={`/dashboard/publishing/reviews/workspace/${review.id}`}>
                          <Button variant="outline" size="sm" className="text-xs h-8 gap-1.5">
                            <Eye className="h-3 w-3" /> View Manuscript
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ─── SECTION 3: Deadlines ───────────────────────────────────── */}
          <TabsContent value="deadlines" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Upcoming Review Deadlines</h2>
              <span className="text-xs text-muted-foreground">{DEADLINES.length} deadline{DEADLINES.length !== 1 ? "s" : ""}</span>
            </div>
            {DEADLINES.length === 0 ? (
              <Card className="border-border">
                <CardContent className="py-12 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="font-semibold text-foreground">No upcoming deadlines.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="relative pl-6 space-y-0 border-l-2 border-border ml-3">
                {DEADLINES.map((d, i) => (
                  <div key={i} className="relative pb-6 last:pb-0">
                    {/* Timeline dot */}
                    <div className={`absolute -left-[23px] top-0.5 h-4 w-4 rounded-full border-2 border-card flex items-center justify-center ${
                      d.daysRemaining <= 5 ? "bg-destructive" : d.daysRemaining <= 14 ? "bg-accent" : "bg-muted-foreground/40"
                    }`} />
                    <Card className={`border-border hover:border-accent/40 transition-colors ${d.daysRemaining <= 5 ? "border-l-4 border-l-destructive" : ""}`}>
                      <CardContent className="pt-4 pb-3 px-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground leading-tight">{d.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{d.journal}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <Badge
                              variant={d.daysRemaining <= 5 ? "destructive" : d.daysRemaining <= 14 ? "default" : "secondary"}
                              className="text-[10px] whitespace-nowrap"
                            >
                              {d.daysRemaining <= 5 && <AlertCircle className="h-2.5 w-2.5 mr-1" />}
                              Due in {d.daysRemaining} days
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Link to={`/dashboard/publishing/reviews/workspace/${d.id}`}>
                            <Button size="sm" className="text-xs h-7 gap-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                              <FileText className="h-3 w-3" /> Continue Review
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ─── SECTION 4: History ─────────────────────────────────────── */}
          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Completed Reviews</h2>
              <span className="text-xs text-muted-foreground">{COMPLETED_REVIEWS.length} reviews</span>
            </div>
            <Card className="border-border">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/40">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Paper Title</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Journal</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Review Date</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Decision Submitted</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {COMPLETED_REVIEWS.map(r => (
                        <tr key={r.id} className="hover:bg-secondary/20 transition-colors">
                          <td className="px-5 py-4 font-medium text-foreground max-w-[240px]">
                            <span className="line-clamp-2">{r.title}</span>
                          </td>
                          <td className="px-5 py-4 text-xs text-muted-foreground max-w-[160px]">
                            <span className="line-clamp-1">{r.journal}</span>
                          </td>
                          <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(r.reviewDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          <td className="px-5 py-4">
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${DECISION_COLOR[r.decision] || "text-foreground"}`}
                            >
                              {r.decision}
                            </Badge>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 gap-1"
                              onClick={() => { setSelectedCompleted(r); setShowSummaryDialog(true); }}
                            >
                              <Eye className="h-3 w-3" /> View Summary
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── SECTION 5: Recognition ─────────────────────────────────── */}
          <TabsContent value="recognition" className="space-y-6 mt-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="border-border">
                <CardContent className="pt-5 pb-4 px-5">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <FileText className="h-4 w-4" />
                    <p className="text-xs">Reviews Completed</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{RECOGNITION.reviewsCompleted}</p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="pt-5 pb-4 px-5">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    <p className="text-xs">Avg. Review Time</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{RECOGNITION.avgReviewTime}</p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="pt-5 pb-4 px-5">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Star className="h-4 w-4" />
                    <p className="text-xs">Reviewer Rating</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground flex items-center gap-2">
                    {RECOGNITION.reviewerRating}
                    <span className="text-base font-normal text-muted-foreground">/ 5</span>
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="pt-5 pb-4 px-5">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <BookOpen className="h-4 w-4" />
                    <p className="text-xs">Journals Reviewed</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{RECOGNITION.topJournals.length}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Badges */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-4 w-4 text-accent" /> Reviewer Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {RECOGNITION.badges.map(b => (
                      <div key={b.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${b.bgClass}`}>
                        <b.icon className={`h-5 w-5 ${b.colorClass}`} />
                        <div>
                          <p className={`text-sm font-semibold ${b.colorClass}`}>{b.label}</p>
                          <p className="text-xs text-muted-foreground">Earned through consistent performance</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Journals + Fields */}
              <div className="space-y-4">
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-accent" /> Top Journals Reviewed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {RECOGNITION.topJournals.map((j, i) => (
                        <div key={j} className="flex items-center gap-3">
                          <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                          <span className="text-sm text-foreground">{j}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-accent" /> Fields Reviewed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {RECOGNITION.fieldsReviewed.map(f => (
                        <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Profile Link */}
            <Card className="border-border bg-secondary/30">
              <CardContent className="py-4 px-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Reviewer Contributions on Your Profile</p>
                    <p className="text-xs text-muted-foreground">Your review history is visible on your academic profile.</p>
                  </div>
                </div>
                <Link to="/dashboard/profile">
                  <Button variant="outline" size="sm" className="text-xs gap-1.5 shrink-0">
                    View Profile <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ─── Accept Review Dialog ─────────────────────────────────────────── */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-serif">Review Assignment</DialogTitle>
            <p className="text-xs text-muted-foreground">
              Please review the manuscript details below before accepting.
            </p>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Journal</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{selectedRequest.journal}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Handling Editor</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{selectedRequest.editor}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assigned</p>
                  <p className="text-sm text-foreground mt-0.5">
                    {new Date(selectedRequest.assignedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Review Deadline</p>
                  <p className="text-sm text-foreground mt-0.5 font-semibold">
                    {new Date(selectedRequest.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="border border-border rounded-xl p-4 space-y-3 bg-secondary/30">
                <div>
                  <p className="text-xs text-muted-foreground">Paper Title</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{selectedRequest.title}</p>
                </div>
                {selectedRequest.blind ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3.5 w-3.5" /> Double-blind review — author identities hidden
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-muted-foreground">Author(s)</p>
                    <p className="text-sm text-foreground mt-0.5">{selectedRequest.authors}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Abstract</p>
                  <p className="text-sm text-foreground mt-0.5 leading-relaxed">{selectedRequest.abstract}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Keywords</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedRequest.keywords.split(",").map(k => (
                      <Badge key={k} variant="secondary" className="text-[10px] px-2">{k.trim()}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => toast.info("Downloading manuscript PDF...")}
                >
                  <Download className="h-3.5 w-3.5" /> Download Manuscript
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => toast.info("No supplementary files available")}
                >
                  <FileText className="h-3.5 w-3.5" /> Supplementary Files
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>Cancel</Button>
            <Button onClick={handleStartReview} className="gap-1.5 bg-accent hover:bg-accent/90 text-accent-foreground">
              <CheckCircle className="h-4 w-4" /> Accept & Start Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Review Summary Dialog ───────────────────────────────────────── */}
      <Dialog open={showSummaryDialog} onOpenChange={setShowSummaryDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Review Summary</DialogTitle>
          </DialogHeader>
          {selectedCompleted && (
            <div className="space-y-4 py-1">
              <div>
                <p className="text-xs text-muted-foreground">Paper</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{selectedCompleted.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Journal</p>
                  <p className="text-sm text-foreground mt-0.5">{selectedCompleted.journal}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Review Date</p>
                  <p className="text-sm text-foreground mt-0.5">
                    {new Date(selectedCompleted.reviewDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Decision Submitted</p>
                <Badge
                  variant="outline"
                  className={`${DECISION_COLOR[selectedCompleted.decision] || ""} text-sm px-3 py-1`}
                >
                  {selectedCompleted.decision}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Evaluation Scores</p>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(selectedCompleted.ratings).map(([criterion, score]) => (
                    <div key={criterion} className="flex items-center justify-between bg-secondary/40 px-3 py-2 rounded-lg">
                      <span className="text-xs text-muted-foreground capitalize">{criterion.replace(/_/g, " ")}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <div
                              key={s}
                              className={`h-2 w-4 rounded-sm ${s <= score ? "bg-accent" : "bg-border"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-foreground w-6 text-right">{score}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Link to="/dashboard/publishing/reviews/workspace/cr1">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Eye className="h-3.5 w-3.5" /> View Full Review
              </Button>
            </Link>
            <Button onClick={() => setShowSummaryDialog(false)} className="bg-accent hover:bg-accent/90 text-accent-foreground">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
