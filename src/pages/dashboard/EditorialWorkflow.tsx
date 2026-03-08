import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Circle, Clock, Upload, MessageCircle, FileText, ChevronRight } from "lucide-react";
import { usePublishing } from "@/hooks/usePublishing";

const workflowStages = [
  { key: "submission_received", label: "Submission Received" },
  { key: "editorial_screening", label: "Editorial Screening" },
  { key: "peer_review", label: "Peer Review" },
  { key: "decision", label: "Decision" },
  { key: "publication", label: "Publication" },
];

const stageOrder = workflowStages.map(s => s.key);

const EditorialWorkflow = () => {
  const { submissions, loading, updateSubmission } = usePublishing();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [revisionNote, setRevisionNote] = useState("");

  const selected = submissions.find(s => s.id === selectedId);

  const getStageStatus = (stageKey: string, currentStage: string) => {
    const current = stageOrder.indexOf(currentStage);
    const target = stageOrder.indexOf(stageKey);
    if (target < current) return "completed";
    if (target === current) return "active";
    return "pending";
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/publishing" className="hover:text-foreground">Publishing</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Editorial Workflow</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Editorial Workflow</h1>
          <p className="text-sm text-muted-foreground mt-1">Track the review stages of your manuscript submissions.</p>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)}</div>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Submission List */}
            <div className="lg:col-span-1 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Manuscript</p>
              {submissions.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedId(s.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    selectedId === s.id ? "bg-accent/5 border-accent" : "bg-card border-border hover:border-accent/50"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground line-clamp-2">{s.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.journal_name}</p>
                  <Badge variant="secondary" className="text-[10px] mt-2">{s.workflow_stage.replace(/_/g, " ")}</Badge>
                </button>
              ))}
            </div>

            {/* Workflow Detail */}
            <div className="lg:col-span-2">
              {!selected ? (
                <Card className="border-border">
                  <CardContent className="py-12 text-center">
                    <p className="text-sm text-muted-foreground">Select a manuscript to view its editorial workflow.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Progress Tracker */}
                  <Card className="border-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">{selected.title}</CardTitle>
                      <p className="text-xs text-muted-foreground">{selected.journal_name}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {workflowStages.map((stage, i) => {
                          const status = getStageStatus(stage.key, selected.workflow_stage);
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
                              }`}>{stage.label}</span>
                              {status === "completed" && <Badge className="text-[10px] bg-afrika-green/10 text-afrika-green ml-auto">Completed</Badge>}
                              {status === "active" && <Badge className="text-[10px] bg-accent/10 text-accent ml-auto">In Progress</Badge>}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Reviewer Feedback */}
                  {Array.isArray(selected.reviewer_feedback) && selected.reviewer_feedback.length > 0 && (
                    <Card className="border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Reviewer Feedback</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {selected.reviewer_feedback.map((fb: any, i: number) => (
                          <div key={i} className="bg-secondary rounded-lg p-4">
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Reviewer {i + 1}</p>
                            <p className="text-sm text-foreground italic">"{fb.comment || fb}"</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Author Actions */}
                  {(selected.workflow_stage === "peer_review" || selected.workflow_stage === "decision") && (
                    <Card className="border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Author Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Textarea
                          placeholder="Respond to reviewer comments..."
                          value={revisionNote}
                          onChange={e => setRevisionNote(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button variant="afrikaOutline" size="sm" className="gap-1">
                            <MessageCircle className="h-3 w-3" />Respond to Reviewer
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Upload className="h-3 w-3" />Upload Revision
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditorialWorkflow;
