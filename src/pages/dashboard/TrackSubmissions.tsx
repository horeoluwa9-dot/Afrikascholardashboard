import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  ChevronDown,
  Upload,
  FileText,
  Send,
  Plus,
} from "lucide-react";

const statusColors: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  Submitted: "bg-primary/10 text-primary",
  "Under Review": "bg-accent/10 text-accent",
  "Minor Revision": "bg-afrika-green/10 text-afrika-green",
  "Major Revision": "bg-accent/20 text-accent",
  Accepted: "bg-afrika-green/20 text-afrika-green",
  Rejected: "bg-destructive/10 text-destructive",
};

const submissions = [
  {
    id: 1,
    title: "The Effects of AI-Driven Health Diagnostics on Clinical Outcomes in Sub-Saharan Africa",
    journal: "Journal of the ACM",
    submitted: "2026-02-15",
    status: "Under Review",
    reviewStage: "Reviewer 2 assigned",
    decision: "Pending",
    timeline: [
      { label: "Draft created", date: "2026-02-10", done: true },
      { label: "Submitted", date: "2026-02-15", done: true },
      { label: "Reviewer assigned", date: "2026-02-20", done: true },
      { label: "Reviews received", date: "", done: false },
      { label: "Decision", date: "", done: false },
    ],
  },
  {
    id: 2,
    title: "Digital Financial Inclusion and Economic Growth in East Africa",
    journal: "Information Sciences",
    submitted: "2026-01-20",
    status: "Minor Revision",
    reviewStage: "Revision requested",
    decision: "Revise & Resubmit",
    timeline: [
      { label: "Draft created", date: "2026-01-10", done: true },
      { label: "Submitted", date: "2026-01-20", done: true },
      { label: "Reviewer assigned", date: "2026-01-25", done: true },
      { label: "Reviews received", date: "2026-02-15", done: true },
      { label: "Revision requested", date: "2026-02-18", done: true },
    ],
  },
  {
    id: 3,
    title: "Climate Change Effects on Agricultural Productivity in West Africa",
    journal: "IEEE Trans. Neural Networks",
    submitted: "2025-12-05",
    status: "Accepted",
    reviewStage: "Complete",
    decision: "Accepted",
    timeline: [
      { label: "Draft created", date: "2025-11-20", done: true },
      { label: "Submitted", date: "2025-12-05", done: true },
      { label: "Reviewer assigned", date: "2025-12-10", done: true },
      { label: "Reviews received", date: "2026-01-05", done: true },
      { label: "Accepted", date: "2026-01-20", done: true },
    ],
  },
];

const TrackSubmissions = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Publishing</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Track Submissions</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Track Submissions</h1>
            <p className="text-sm text-muted-foreground mt-1">Monitor the status of your manuscript submissions.</p>
          </div>
          <Link to="/dashboard/publishing/submit">
            <Button variant="afrika" size="sm" className="gap-1">
              <Plus className="h-3 w-3" /> New Submission
            </Button>
          </Link>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground mt-3">No submissions yet.</p>
            <Link to="/dashboard/publishing/submit" className="text-sm text-accent hover:underline mt-1 inline-flex items-center gap-1">
              Submit your first manuscript <Send className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3 bg-secondary text-xs font-semibold text-muted-foreground border-b border-border">
              <div className="col-span-4">Title</div>
              <div className="col-span-2">Journal</div>
              <div className="col-span-1">Submitted</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Review Stage</div>
              <div className="col-span-1">Decision</div>
            </div>

            {submissions.map((sub) => (
              <div key={sub.id}>
                <button
                  className="w-full grid grid-cols-1 md:grid-cols-12 gap-2 px-5 py-4 text-left hover:bg-secondary/50 transition-colors border-b border-border items-center"
                  onClick={() => setExpanded(expanded === sub.id ? null : sub.id)}
                >
                  <div className="col-span-4 flex items-center gap-2">
                    <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform shrink-0 ${expanded === sub.id ? "rotate-180" : ""}`} />
                    <span className="text-sm font-medium text-foreground truncate">{sub.title}</span>
                  </div>
                  <div className="col-span-2 text-xs text-muted-foreground">{sub.journal}</div>
                  <div className="col-span-1 text-xs text-muted-foreground">{sub.submitted}</div>
                  <div className="col-span-2">
                    <Badge className={`text-[10px] ${statusColors[sub.status]}`}>{sub.status}</Badge>
                  </div>
                  <div className="col-span-2 text-xs text-muted-foreground">{sub.reviewStage}</div>
                  <div className="col-span-1 text-xs font-medium text-foreground">{sub.decision}</div>
                </button>

                {expanded === sub.id && (
                  <div className="px-5 py-4 bg-secondary/30 border-b border-border">
                    <p className="text-xs font-semibold text-foreground mb-3">Submission Timeline</p>
                    <div className="space-y-2">
                      {sub.timeline.map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full shrink-0 ${step.done ? "bg-afrika-green" : "bg-border"}`} />
                          <span className={`text-xs ${step.done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
                          {step.date && <span className="text-[10px] text-muted-foreground">{step.date}</span>}
                        </div>
                      ))}
                    </div>
                    {(sub.status === "Minor Revision" || sub.status === "Major Revision") && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-semibold text-foreground">Upload Revision</p>
                        <div className="flex gap-2">
                          <Input type="file" accept=".pdf,.docx" className="text-xs" />
                          <Button variant="afrika" size="sm" className="gap-1 shrink-0">
                            <Upload className="h-3 w-3" /> Upload
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TrackSubmissions;
