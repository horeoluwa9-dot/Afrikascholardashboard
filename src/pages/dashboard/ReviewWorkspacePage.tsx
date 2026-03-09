import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  ChevronRight, FileText, Download, Save, Send, Eye,
  BookOpen, Shield, Tag, Calendar, CheckCircle, AlertCircle,
  BarChart2, MessageSquare, Lock, List, Image,
} from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

// ── Criteria ────────────────────────────────────────────────────────────────

const CRITERIA = [
  {
    key: "originality",
    label: "Originality",
    description: "Does the paper present novel contributions or ideas?",
  },
  {
    key: "methodology",
    label: "Methodology",
    description: "Is the research design and analysis approach sound?",
  },
  {
    key: "clarity",
    label: "Clarity of Writing",
    description: "Is the paper well-written, organized, and easy to follow?",
  },
  {
    key: "contribution",
    label: "Contribution to Field",
    description: "Does the work meaningfully advance the research field?",
  },
  {
    key: "ethics",
    label: "Ethical Compliance",
    description: "Does the paper follow ethical research standards?",
  },
];

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Below Average",
  3: "Satisfactory",
  4: "Good",
  5: "Excellent",
};

// ── Demo Manuscripts ────────────────────────────────────────────────────────

const DEMO_MANUSCRIPTS: Record<string, {
  title: string;
  journal: string;
  editor: string;
  abstract: string;
  keywords: string[];
  authors: string;
  blind: boolean;
  deadline: string;
  supplementaryFiles: string[];
}> = {
  rr1: {
    title: "AI-Assisted Epidemiological Modeling in Sub-Saharan Africa",
    journal: "African Journal of Public Health",
    editor: "Dr. Amina Bello",
    abstract:
      "This study explores how machine learning models can enhance epidemiological forecasting in resource-limited settings across Sub-Saharan Africa. The paper presents a novel framework that combines traditional epidemiological methods with deep learning approaches to improve prediction accuracy for infectious disease outbreaks. The authors validate their model on historical data from five countries and demonstrate an improvement of 23% in outbreak prediction accuracy compared to conventional methods.",
    keywords: ["Machine Learning", "Epidemiology", "Sub-Saharan Africa", "Forecasting", "Public Health"],
    authors: "Anonymous (Double-Blind Review)",
    blind: true,
    deadline: "March 28, 2026",
    supplementaryFiles: ["Dataset_S1.xlsx", "Appendix_A.pdf"],
  },
  rr2: {
    title: "Digital Health Infrastructure in Rural Nigeria",
    journal: "East African Medical Journal",
    editor: "Prof. Kwame Asante",
    abstract:
      "Assessing the current state of digital health services in underserved communities across rural Nigeria, identifying key infrastructure gaps and proposing an evidence-based roadmap for improvement. The study employs mixed-methods including community health worker surveys across 12 states and qualitative interviews with 48 health officials.",
    keywords: ["Digital Health", "Nigeria", "Rural Healthcare", "Infrastructure", "Health Systems"],
    authors: "Dr. Chinwe Okeke, University of Abuja",
    blind: false,
    deadline: "April 1, 2026",
    supplementaryFiles: ["Interview_Protocol.pdf"],
  },
  ar1: {
    title: "Climate Policy Innovation in West Africa",
    journal: "Journal of African Policy Studies",
    editor: "Dr. Kemi Adeyinka",
    abstract:
      "A comprehensive comparative analysis of climate adaptation strategies employed by ECOWAS member states. This paper evaluates the effectiveness of national adaptation plans and proposes an integrated policy framework for regional climate governance. The study covers twelve member states over a 10-year period.",
    keywords: ["Climate Policy", "West Africa", "ECOWAS", "Adaptation", "Governance"],
    authors: "Anonymous (Double-Blind Review)",
    blind: true,
    deadline: "April 3, 2026",
    supplementaryFiles: ["Policy_Database.xlsx", "Comparative_Charts.pdf"],
  },
  ar2: {
    title: "Agricultural Innovation Systems",
    journal: "Journal of African Development Studies",
    editor: "Dr. Grace Obi",
    abstract:
      "This study investigates how agricultural innovation systems in Sub-Saharan Africa can be strengthened through integration of traditional knowledge with modern agri-tech solutions. Using a case-study approach across Kenya, Ghana, and Nigeria, the paper presents a framework for inclusive agricultural development.",
    keywords: ["Agriculture", "Innovation", "Sub-Saharan Africa", "Technology", "Development"],
    authors: "Anonymous (Double-Blind Review)",
    blind: true,
    deadline: "March 15, 2026",
    supplementaryFiles: [],
  },
  cr1: {
    title: "Renewable Energy Policy Framework",
    journal: "Journal of Energy Economics",
    editor: "Prof. Emeka Osei",
    abstract:
      "This paper presents a comprehensive analysis of renewable energy policy frameworks across West Africa, examining the regulatory landscape, incentive structures, and barriers to adoption. The research proposes a harmonized regional policy framework.",
    keywords: ["Renewable Energy", "Policy", "West Africa", "Regulation"],
    authors: "Dr. Emmanuel Osei, KNUST",
    blind: false,
    deadline: "Feb 18, 2026",
    supplementaryFiles: ["Energy_Data.xlsx"],
  },
};

// ── Component ────────────────────────────────────────────────────────────────

export default function ReviewWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const manuscript = DEMO_MANUSCRIPTS[id || "rr1"] || DEMO_MANUSCRIPTS.rr1;

  const [ratings, setRatings] = useState<Record<string, number>>({
    originality: 3,
    methodology: 3,
    clarity: 3,
    contribution: 3,
    ethics: 3,
  });
  const [confidentialComments, setConfidentialComments] = useState("");
  const [authorComments, setAuthorComments] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [privateNotes, setPrivateNotes] = useState("");

  const totalScore = Math.round(
    Object.values(ratings).reduce((a, b) => a + b, 0) / CRITERIA.length * 10
  ) / 10;

  const handleSaveDraft = () => {
    toast.success("Review draft saved successfully");
  };

  const handleSubmitReview = () => {
    if (!recommendation) {
      toast.error("Please select a recommendation before submitting");
      return;
    }
    if (!authorComments.trim()) {
      toast.error("Please provide comments for the authors");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(false);
    setSubmitted(true);
    toast.success("Review successfully submitted.");
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-serif">Review Submitted Successfully</h1>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Your review has been sent to the journal editor.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-left space-y-3 max-w-sm mx-auto">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Manuscript</span>
              <span className="text-foreground text-xs font-medium line-clamp-1 max-w-[180px]">{manuscript.title}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sent to</span>
              <span className="text-foreground text-xs font-medium">{manuscript.editor}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Recommendation</span>
              <Badge variant="outline">{recommendation.replace(/_/g, " ")}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Score</span>
              <span className="font-bold text-foreground">{totalScore} / 5</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Journal</span>
              <span className="text-foreground text-xs">{manuscript.journal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Next Step</span>
              <span className="text-foreground text-xs">Awaiting Editorial Decision</span>
            </div>
          </div>
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 max-w-sm mx-auto text-left">
            <p className="text-xs text-accent font-medium">Editor Notification Sent</p>
            <p className="text-xs text-muted-foreground mt-1">
              {manuscript.editor} has been notified and the manuscript status has been updated to "Awaiting Editorial Decision."
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/dashboard/publishing/reviews")}>
              Return to Peer Reviews
            </Button>
            <Button onClick={() => navigate("/dashboard/publishing/reviews?tab=history")}>
              View Review History
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/publishing" className="hover:text-foreground">Publishing</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/publishing/reviews" className="hover:text-foreground">Peer Reviews</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Review Workspace</span>
        </div>

        {/* Page Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-serif">Review Manuscript</h1>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{manuscript.title}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {manuscript.blind && (
              <Badge variant="outline" className="gap-1 text-xs">
                <Shield className="h-3 w-3" /> Double-Blind
              </Badge>
            )}
            <Badge variant="outline" className="gap-1 text-xs text-foreground border-border bg-secondary">
              <Calendar className="h-3 w-3" /> Due {manuscript.deadline}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ─── LEFT: Manuscript + Notes ─────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-4">
            {/* Manuscript Summary */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent" /> Manuscript Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Journal</p>
                    <p className="text-sm text-foreground mt-0.5 font-medium">{manuscript.journal}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Handling Editor</p>
                    <p className="text-sm text-foreground mt-0.5 font-medium">{manuscript.editor}</p>
                  </div>
                  {manuscript.blind ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground col-span-2">
                      <Lock className="h-3.5 w-3.5" />
                      Author identities are hidden for this double-blind review.
                    </div>
                  ) : (
                    <div className="col-span-2">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Author(s)</p>
                      <p className="text-sm text-foreground mt-0.5">{manuscript.authors}</p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5">Abstract</p>
                  <p className="text-sm text-foreground leading-relaxed">{manuscript.abstract}</p>
                </div>

                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Keywords
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {manuscript.keywords.map(k => (
                      <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-1 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => toast.info("Downloading manuscript PDF...")}
                  >
                    <Download className="h-3.5 w-3.5" /> Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => toast.info("Opening manuscript viewer...")}
                  >
                    <Eye className="h-3.5 w-3.5" /> View Full Paper
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => toast.info("Loading figures...")}
                  >
                    <Image className="h-3.5 w-3.5" /> View Figures
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => toast.info("Loading references...")}
                  >
                    <List className="h-3.5 w-3.5" /> View References
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Supplementary Files */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-accent" /> Supplementary Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                {manuscript.supplementaryFiles.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No supplementary files provided.</p>
                ) : (
                  <div className="space-y-2">
                    {manuscript.supplementaryFiles.map(file => (
                      <div key={file} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-accent" />
                          <span className="text-sm text-foreground">{file}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 gap-1"
                          onClick={() => toast.info(`Downloading ${file}...`)}
                        >
                          <Download className="h-3 w-3" /> Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Private Notes */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock className="h-4 w-4 text-accent" /> Private Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add private notes while reviewing the manuscript (these are for your reference only and will not be shared)..."
                  className="min-h-[120px] resize-none"
                  value={privateNotes}
                  onChange={e => setPrivateNotes(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground mt-2">
                  Private notes are never shared with the editor or authors.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* ─── RIGHT: Evaluation Form ───────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Evaluation Scores */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-accent" /> Reviewer Evaluation
                </CardTitle>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">Rate each criterion from 1 (Poor) to 5 (Excellent)</p>
                  <Badge variant="secondary" className="text-xs">Overall: {totalScore}/5</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {CRITERIA.map(c => (
                  <div key={c.key} className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <Label className="text-xs font-semibold">{c.label}</Label>
                        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{c.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-foreground">{ratings[c.key]}</span>
                        <span className="text-xs text-muted-foreground">/5</span>
                        <p className="text-[10px] text-accent font-medium">{RATING_LABELS[ratings[c.key]]}</p>
                      </div>
                    </div>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[ratings[c.key]]}
                      onValueChange={([v]) => setRatings(prev => ({ ...prev, [c.key]: v }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[9px] text-muted-foreground px-0.5">
                      <span>1 — Poor</span>
                      <span>5 — Excellent</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Comments */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-accent" /> Reviewer Comments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <Lock className="h-3 w-3" /> Confidential Comments to Editor
                  </Label>
                  <Textarea
                    placeholder="These comments will only be seen by the editor. You may include concerns about ethical issues, conflicts of interest, or other sensitive observations..."
                    className="min-h-[100px] resize-none text-xs"
                    value={confidentialComments}
                    onChange={e => setConfidentialComments(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground">Visible to editor only — not shared with authors.</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3" /> Comments for Authors
                  </Label>
                  <Textarea
                    placeholder="Provide detailed feedback on strengths, weaknesses, methodology, and suggestions for improvement. Be constructive and specific..."
                    className="min-h-[130px] resize-none text-xs"
                    value={authorComments}
                    onChange={e => setAuthorComments(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground">Shared with the authors after editorial review.</p>
                </div>

                {/* Recommendation */}
                <div className="space-y-1.5 pt-1">
                  <Label className="text-xs font-semibold">Recommendation *</Label>
                  <Select value={recommendation} onValueChange={setRecommendation}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select your recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accept">
                        <span className="flex items-center gap-2 text-primary">
                          <CheckCircle className="h-3.5 w-3.5" /> Accept
                        </span>
                      </SelectItem>
                      <SelectItem value="minor_revisions">
                        <span className="flex items-center gap-2 text-accent">
                          <AlertCircle className="h-3.5 w-3.5" /> Minor Revisions
                        </span>
                      </SelectItem>
                      <SelectItem value="major_revisions">
                        <span className="flex items-center gap-2 text-foreground">
                          <AlertCircle className="h-3.5 w-3.5" /> Major Revisions
                        </span>
                      </SelectItem>
                      <SelectItem value="reject">
                        <span className="flex items-center gap-2 text-destructive">
                          <AlertCircle className="h-3.5 w-3.5" /> Reject
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 gap-1.5 text-sm"
                onClick={handleSaveDraft}
              >
                <Save className="h-4 w-4" /> Save Draft
              </Button>
              <Button
                className="flex-1 gap-1.5 text-sm"
                onClick={handleSubmitReview}
              >
                <Send className="h-4 w-4" /> Submit Review
              </Button>
            </div>

            <p className="text-[10px] text-muted-foreground text-center">
              By submitting, you confirm this review reflects your independent scholarly judgment.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Confirm Submit Dialog ──────────────────────────────────────── */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Confirm Review Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              You are about to submit your peer review for:
            </p>
            <div className="bg-secondary/40 border border-border rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">{manuscript.title}</p>
              <p className="text-xs text-muted-foreground">{manuscript.journal}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-muted-foreground">Overall Score</p>
                <p className="text-lg font-bold text-foreground mt-0.5">{totalScore}/5</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-muted-foreground">Recommendation</p>
                <p className="text-sm font-bold text-foreground mt-0.5 capitalize">
                  {recommendation.replace(/_/g, " ")}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              This action cannot be undone. Your review will be sent to the handling editor.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Go Back</Button>
            <Button onClick={handleConfirmSubmit} className="gap-1.5">
              <Send className="h-4 w-4" /> Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
