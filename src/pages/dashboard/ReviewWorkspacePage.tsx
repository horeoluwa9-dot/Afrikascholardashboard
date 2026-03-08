import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  ChevronRight, FileText, Download, Save, Send, Eye,
} from "lucide-react";
import { toast } from "sonner";

const CRITERIA = [
  { key: "originality", label: "Originality" },
  { key: "methodology", label: "Methodology" },
  { key: "clarity", label: "Clarity of Writing" },
  { key: "contribution", label: "Contribution to Field" },
  { key: "ethics", label: "Ethical Compliance" },
];

// Demo manuscript data
const DEMO_MANUSCRIPTS: Record<string, { title: string; journal: string; abstract: string; authors: string; blind: boolean }> = {
  rr1: {
    title: "AI-Assisted Epidemiological Modeling in Sub-Saharan Africa",
    journal: "African Journal of Public Health",
    abstract: "This study explores how machine learning models can enhance epidemiological forecasting in resource-limited settings across Sub-Saharan Africa. The paper presents a novel framework that combines traditional epidemiological methods with deep learning approaches to improve prediction accuracy for infectious disease outbreaks.",
    authors: "Anonymous (Blind Review)",
    blind: true,
  },
  ar1: {
    title: "Climate Policy Innovation in West Africa",
    journal: "Journal of African Policy Studies",
    abstract: "A comprehensive comparative analysis of climate adaptation strategies employed by ECOWAS member states. This paper evaluates the effectiveness of national adaptation plans and proposes an integrated policy framework for regional climate governance.",
    authors: "Anonymous (Blind Review)",
    blind: true,
  },
};

export default function ReviewWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const manuscript = DEMO_MANUSCRIPTS[id || "rr1"] || DEMO_MANUSCRIPTS.rr1;

  const [ratings, setRatings] = useState<Record<string, number>>({
    originality: 3, methodology: 3, clarity: 3, contribution: 3, ethics: 3,
  });
  const [comments, setComments] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const handleSaveDraft = () => {
    toast.success("Review draft saved");
  };

  const handleSubmitReview = () => {
    if (!recommendation) {
      toast.error("Please select a recommendation before submitting");
      return;
    }
    if (!comments.trim()) {
      toast.error("Please add reviewer comments");
      return;
    }
    toast.success("Review submitted successfully");
    navigate("/dashboard/publishing/reviews");
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/publishing" className="hover:text-foreground">Publishing</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/publishing/reviews" className="hover:text-foreground">Peer Reviews</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Review Manuscript</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Review Manuscript</h1>
          <p className="text-sm text-muted-foreground mt-1">{manuscript.title}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Manuscript Viewer */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent" /> Manuscript Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Title</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">{manuscript.title}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Journal</p>
                  <p className="text-sm text-foreground mt-0.5">{manuscript.journal}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Author Information</p>
                  <p className="text-sm text-foreground mt-0.5">{manuscript.authors}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Abstract</p>
                  <p className="text-sm text-foreground mt-0.5 leading-relaxed">{manuscript.abstract}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("Downloading manuscript PDF...")}>
                    <Download className="h-3.5 w-3.5" /> Download Manuscript
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("Opening manuscript viewer...")}>
                    <Eye className="h-3.5 w-3.5" /> View Full Paper
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reviewer Notes */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Reviewer Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add private notes while reviewing the manuscript (these are for your reference only)..."
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right: Evaluation Form */}
          <div className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Evaluation Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {CRITERIA.map(c => (
                  <div key={c.key} className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">{c.label}</Label>
                      <span className="text-xs font-semibold text-foreground">{ratings[c.key]}/5</span>
                    </div>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[ratings[c.key]]}
                      onValueChange={([v]) => setRatings(prev => ({ ...prev, [c.key]: v }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Poor</span><span>Excellent</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Reviewer Comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Provide detailed feedback on the manuscript including strengths, weaknesses, and suggestions for improvement..."
                  className="min-h-[150px]"
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                />

                <div className="space-y-2">
                  <Label className="text-xs">Recommendation</Label>
                  <Select value={recommendation} onValueChange={setRecommendation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accept">Accept</SelectItem>
                      <SelectItem value="minor_revisions">Minor Revisions</SelectItem>
                      <SelectItem value="major_revisions">Major Revisions</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-1.5" onClick={handleSaveDraft}>
                <Save className="h-4 w-4" /> Save Draft
              </Button>
              <Button className="flex-1 gap-1.5" onClick={handleSubmitReview}>
                <Send className="h-4 w-4" /> Submit Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
