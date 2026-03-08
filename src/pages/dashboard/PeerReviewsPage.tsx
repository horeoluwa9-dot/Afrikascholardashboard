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
  Award, Zap, BookOpen, Calendar, AlertCircle, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

// ── Demo Data ──

interface ReviewRequest {
  id: string;
  title: string;
  journal: string;
  assignedDate: string;
  deadline: string;
  status: "awaiting_response" | "accepted" | "declined";
  blind: boolean;
  abstract: string;
  authors: string;
}

interface ActiveReview {
  id: string;
  title: string;
  journal: string;
  deadline: string;
  progress: number;
}

interface CompletedReview {
  id: string;
  title: string;
  journal: string;
  reviewDate: string;
  decision: string;
}

const REVIEW_REQUESTS: ReviewRequest[] = [
  {
    id: "rr1",
    title: "AI-Assisted Epidemiological Modeling in Sub-Saharan Africa",
    journal: "African Journal of Public Health",
    assignedDate: "2026-03-12",
    deadline: "2026-03-28",
    status: "awaiting_response",
    blind: true,
    abstract: "This study explores how machine learning models can enhance epidemiological forecasting in resource-limited settings across Sub-Saharan Africa.",
    authors: "Anonymous (Blind Review)",
  },
];

const ACTIVE_REVIEWS: ActiveReview[] = [
  {
    id: "ar1",
    title: "Climate Policy Innovation in West Africa",
    journal: "Journal of African Policy Studies",
    deadline: "2026-04-03",
    progress: 40,
  },
];

const COMPLETED_REVIEWS: CompletedReview[] = [
  { id: "cr1", title: "Renewable Energy Policy Framework", journal: "Journal of Energy Economics", reviewDate: "2026-02-18", decision: "Minor Revisions" },
  { id: "cr2", title: "Mobile Banking Adoption in East Africa", journal: "East African Economic Review", reviewDate: "2026-01-25", decision: "Accept" },
  { id: "cr3", title: "Water Governance in the Sahel", journal: "African Environmental Studies", reviewDate: "2025-12-10", decision: "Major Revisions" },
];

const DEADLINES = [
  { title: "Climate Policy Innovation in West Africa", journal: "Journal of African Policy Studies", daysRemaining: 26 },
  { title: "Agricultural Innovation Systems", journal: "Journal of African Development Studies", daysRemaining: 5 },
];

const RECOGNITION = {
  reviewsCompleted: 12,
  avgReviewTime: "9 days",
  reviewerRating: 4.7,
  topJournals: ["African J. Public Health", "J. Energy Economics", "East African Economic Review"],
  badges: [
    { label: "Top Reviewer", icon: Star, color: "text-accent", bg: "bg-accent/10" },
    { label: "Fast Reviewer", icon: Zap, color: "text-afrika-green", bg: "bg-afrika-green/10" },
    { label: "Expert Reviewer", icon: Award, color: "text-primary", bg: "bg-primary/10" },
  ],
};

export default function PeerReviewsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ReviewRequest[]>(REVIEW_REQUESTS);
  const [activeReviews, setActiveReviews] = useState<ActiveReview[]>(ACTIVE_REVIEWS);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ReviewRequest | null>(null);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [selectedCompleted, setSelectedCompleted] = useState<CompletedReview | null>(null);

  const handleAccept = (req: ReviewRequest) => {
    setSelectedRequest(req);
    setShowAcceptDialog(true);
  };

  const handleDecline = (req: ReviewRequest) => {
    setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "declined" as const } : r));
    toast.success("Review invitation declined");
  };

  const handleStartReview = () => {
    if (!selectedRequest) return;
    setRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
    setActiveReviews(prev => [...prev, {
      id: selectedRequest.id,
      title: selectedRequest.title,
      journal: selectedRequest.journal,
      deadline: selectedRequest.deadline,
      progress: 0,
    }]);
    setShowAcceptDialog(false);
    toast.success("Review accepted — redirecting to workspace");
    navigate(`/dashboard/publishing/reviews/workspace/${selectedRequest.id}`);
  };

  const handleViewSummary = (review: CompletedReview) => {
    setSelectedCompleted(review);
    setShowSummaryDialog(true);
  };

  const pendingRequests = requests.filter(r => r.status === "awaiting_response");

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

        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Peer Reviews</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage journal review requests and track your reviewer contributions.
          </p>
        </div>

        <Tabs defaultValue="requests">
          <TabsList>
            <TabsTrigger value="requests">
              Review Requests {pendingRequests.length > 0 && <Badge className="ml-1.5 text-[9px] h-4 px-1.5">{pendingRequests.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="active">Active Reviews</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="recognition">Recognition</TabsTrigger>
          </TabsList>

          {/* ── SECTION 1: Review Requests ── */}
          <TabsContent value="requests" className="space-y-4 mt-4">
            {pendingRequests.length === 0 ? (
              <Card className="border-border">
                <CardContent className="py-16 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground">No review requests yet.</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                    When a journal editor assigns you a paper, it will appear here.
                  </p>
                  <Link to="/dashboard/publishing/journals">
                    <Button variant="outline" className="mt-4 gap-2"><BookOpen className="h-4 w-4" /> Browse Journals</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-secondary/30">
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Paper Title</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Journal</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Assigned</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Deadline</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                          <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {pendingRequests.map(req => (
                          <tr key={req.id} className="hover:bg-secondary/20 transition-colors">
                            <td className="px-5 py-3 font-medium text-foreground max-w-[250px]">
                              <p className="line-clamp-1">{req.title}</p>
                            </td>
                            <td className="px-5 py-3 text-muted-foreground text-xs">{req.journal}</td>
                            <td className="px-5 py-3 text-muted-foreground text-xs">
                              {new Date(req.assignedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </td>
                            <td className="px-5 py-3 text-muted-foreground text-xs">
                              {new Date(req.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </td>
                            <td className="px-5 py-3">
                              <Badge variant="outline" className="text-[10px] text-afrika-orange border-afrika-orange/30">
                                Awaiting Response
                              </Badge>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" className="text-xs h-7 gap-1" onClick={() => handleAccept(req)}>
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

          {/* ── SECTION 2: Active Reviews ── */}
          <TabsContent value="active" className="space-y-4 mt-4">
            {activeReviews.length === 0 ? (
              <Card className="border-border">
                <CardContent className="py-16 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground">No active reviews.</h3>
                  <p className="text-sm text-muted-foreground mt-1">Accept a review request to begin.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeReviews.map(review => (
                  <Card key={review.id} className="border-border">
                    <CardContent className="pt-5 pb-4 px-5 space-y-3">
                      <p className="text-sm font-semibold text-foreground">{review.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <BookOpen className="h-3 w-3" /> {review.journal}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" /> Deadline: {new Date(review.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Review Progress</span>
                          <span className="text-foreground font-medium">{review.progress}%</span>
                        </div>
                        <Progress value={review.progress} className="h-2" />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Link to={`/dashboard/publishing/reviews/workspace/${review.id}`}>
                          <Button size="sm" className="text-xs h-7 gap-1"><FileText className="h-3 w-3" /> Continue Review</Button>
                        </Link>
                        <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => toast.info("Opening manuscript...")}>
                          <Eye className="h-3 w-3" /> View Manuscript
                        </Button>
                        <Link to={`/dashboard/publishing/reviews/workspace/${review.id}`}>
                          <Button variant="outline" size="sm" className="text-xs h-7 gap-1">
                            <CheckCircle className="h-3 w-3" /> Submit Review
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── SECTION 3: Deadlines ── */}
          <TabsContent value="deadlines" className="space-y-4 mt-4">
            {DEADLINES.length === 0 ? (
              <Card className="border-border">
                <CardContent className="py-16 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground">No upcoming deadlines.</h3>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {DEADLINES.map((d, i) => (
                  <Card key={i} className={`border-border ${d.daysRemaining <= 7 ? "border-l-4 border-l-destructive" : ""}`}>
                    <CardContent className="pt-4 pb-3 px-5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{d.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{d.journal}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={d.daysRemaining <= 7 ? "destructive" : "secondary"} className="text-[10px]">
                          {d.daysRemaining <= 7 && <AlertCircle className="h-3 w-3 mr-1" />}
                          Due in {d.daysRemaining} days
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── SECTION 4: History ── */}
          <TabsContent value="history" className="space-y-4 mt-4">
            <Card className="border-border">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
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
                          <td className="px-5 py-3 font-medium text-foreground">{r.title}</td>
                          <td className="px-5 py-3 text-muted-foreground text-xs">{r.journal}</td>
                          <td className="px-5 py-3 text-muted-foreground text-xs">
                            {new Date(r.reviewDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          <td className="px-5 py-3">
                            <Badge variant="secondary" className="text-[10px]">{r.decision}</Badge>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => handleViewSummary(r)}>
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

          {/* ── SECTION 5: Recognition ── */}
          <TabsContent value="recognition" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-border">
                <CardContent className="pt-5 pb-4 px-5">
                  <p className="text-xs text-muted-foreground">Reviews Completed</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{RECOGNITION.reviewsCompleted}</p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="pt-5 pb-4 px-5">
                  <p className="text-xs text-muted-foreground">Average Review Time</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{RECOGNITION.avgReviewTime}</p>
                </CardContent>
              </Card>
              <Card className="border-border">
                <CardContent className="pt-5 pb-4 px-5">
                  <p className="text-xs text-muted-foreground">Reviewer Rating</p>
                  <p className="text-2xl font-bold text-foreground mt-1 flex items-center gap-1">
                    {RECOGNITION.reviewerRating} <Star className="h-4 w-4 text-accent fill-accent" /> / 5
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border">
              <CardHeader><CardTitle className="text-base">Reviewer Badges</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {RECOGNITION.badges.map(b => (
                    <div key={b.label} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${b.bg}`}>
                      <b.icon className={`h-4 w-4 ${b.color}`} />
                      <span className={`text-sm font-semibold ${b.color}`}>{b.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader><CardTitle className="text-base">Top Journals Reviewed For</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {RECOGNITION.topJournals.map(j => (
                    <Badge key={j} variant="secondary" className="text-xs">{j}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Accept Review Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Assignment</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-2">
              <div>
                <p className="text-xs text-muted-foreground">Paper Title</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{selectedRequest.title}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Journal</p>
                <p className="text-sm text-foreground mt-0.5">{selectedRequest.journal}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Author Information</p>
                <p className="text-sm text-foreground mt-0.5">{selectedRequest.blind ? "Anonymous (Blind Review)" : selectedRequest.authors}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Paper Summary</p>
                <p className="text-sm text-foreground mt-0.5">{selectedRequest.abstract}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("Downloading manuscript...")}>
                  <Download className="h-3.5 w-3.5" /> Download Manuscript
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("No supplementary materials available")}>
                  <FileText className="h-3.5 w-3.5" /> Supplementary Materials
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>Cancel</Button>
            <Button onClick={handleStartReview} className="gap-1.5">
              <ArrowRight className="h-4 w-4" /> Start Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Summary Dialog */}
      <Dialog open={showSummaryDialog} onOpenChange={setShowSummaryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Summary</DialogTitle>
          </DialogHeader>
          {selectedCompleted && (
            <div className="space-y-3 py-2">
              <div>
                <p className="text-xs text-muted-foreground">Paper</p>
                <p className="text-sm font-semibold text-foreground">{selectedCompleted.title}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Journal</p>
                <p className="text-sm text-foreground">{selectedCompleted.journal}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Review Date</p>
                <p className="text-sm text-foreground">
                  {new Date(selectedCompleted.reviewDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Decision Submitted</p>
                <Badge variant="secondary">{selectedCompleted.decision}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Your Evaluation</p>
                <div className="grid grid-cols-2 gap-2 mt-1.5 text-xs">
                  {["Originality", "Methodology", "Clarity", "Contribution", "Ethics"].map((f, i) => (
                    <div key={f} className="flex justify-between bg-secondary/30 px-3 py-1.5 rounded">
                      <span className="text-muted-foreground">{f}</span>
                      <span className="font-semibold text-foreground">{[4, 3, 5, 4, 5][i]}/5</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSummaryDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
