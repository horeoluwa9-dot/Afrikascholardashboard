import { Link, useParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Circle, Upload, FileText, MessageSquare, History } from "lucide-react";
import { usePublishing } from "@/hooks/usePublishing";

const STAGES = [
  { key: "submission_received", label: "Submission received" },
  { key: "editorial_screening", label: "Editorial screening" },
  { key: "peer_review", label: "Peer review" },
  { key: "decision", label: "Decision" },
  { key: "publication", label: "Publication" },
];

const SubmissionDetail = () => {
  const { id } = useParams();
  const { submissions } = usePublishing();
  const sub = submissions.find((s) => s.id === id);

  // Demo fallback so the page is always meaningful
  const data = sub || {
    id: id || "demo",
    title: "AI-Assisted Epidemiological Modeling in Sub-Saharan Africa",
    abstract: "This study explores how machine learning models can enhance epidemiological forecasting across regional health systems.",
    keywords: "AI, Epidemiology, Public Health",
    research_field: "Public Health",
    journal_name: "African Journal of Public Health",
    status: "submitted",
    workflow_stage: "peer_review",
    co_authors: [{ name: "Dr. Ama Mensah", institution: "University of Ghana" }] as any[],
    reviewer_feedback: [
      { reviewer: "Reviewer 1", comment: "Strong methodology. Suggest expanding section 3 on data sources.", date: "2026-03-12" },
    ] as any[],
    submitted_at: "2026-03-02T00:00:00Z",
    updated_at: "2026-03-12T00:00:00Z",
  };

  const currentStageIndex = STAGES.findIndex((s) => s.key === data.workflow_stage);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <Link to="/dashboard/publishing/submissions" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to My Submissions
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">{data.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="secondary">{String(data.status).replace("_", " ")}</Badge>
            <span className="text-xs text-muted-foreground">{data.journal_name}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">Submitted {new Date(data.submitted_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Paper details */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Paper details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.abstract && <div><p className="text-muted-foreground text-xs mb-1">Abstract</p><p>{data.abstract}</p></div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.keywords && <div><p className="text-muted-foreground text-xs">Keywords</p><p>{data.keywords}</p></div>}
              {data.research_field && <div><p className="text-muted-foreground text-xs">Field</p><p>{data.research_field}</p></div>}
            </div>
            {data.co_authors && data.co_authors.length > 0 && (
              <div>
                <p className="text-muted-foreground text-xs mb-1">Co-authors</p>
                <ul className="list-disc ml-5 space-y-0.5">
                  {data.co_authors.map((a: any, i: number) => (
                    <li key={i}>{a.name}{a.institution ? ` — ${a.institution}` : ""}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status tracker */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Status tracker</CardTitle></CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {STAGES.map((stage, idx) => {
                const done = idx <= currentStageIndex;
                const current = idx === currentStageIndex;
                return (
                  <li key={stage.key} className="flex items-center gap-3 text-sm">
                    {done ? (
                      <CheckCircle2 className={`h-5 w-5 ${current ? "text-accent" : "text-afrika-green"}`} />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground/40" />
                    )}
                    <span className={current ? "font-semibold" : done ? "" : "text-muted-foreground"}>{stage.label}</span>
                    {current && <Badge variant="secondary" className="text-[10px]">Current</Badge>}
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        {/* Reviewer feedback */}
        <Card>
          <CardHeader className="pb-2 flex-row items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Reviewer feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {data.reviewer_feedback && data.reviewer_feedback.length > 0 ? (
              <div className="space-y-3">
                {data.reviewer_feedback.map((f: any, i: number) => (
                  <div key={i} className="border border-border rounded-md p-3 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{f.reviewer || `Reviewer ${i + 1}`}</p>
                      {f.date && <span className="text-xs text-muted-foreground">{new Date(f.date).toLocaleDateString()}</span>}
                    </div>
                    <p className="text-muted-foreground">{f.comment || f.text || "No comment."}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reviewer feedback yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Upload revision + version history */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2 flex-row items-center gap-2">
              <Upload className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Upload revision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Upload an updated manuscript file in response to reviewer feedback.</p>
              <Button variant="afrikaOutline" className="gap-2"><Upload className="h-4 w-4" />Choose file</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex-row items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Version history</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" />v1 — Initial submission</span>
                  <span className="text-xs text-muted-foreground">{new Date(data.submitted_at).toLocaleDateString()}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubmissionDetail;