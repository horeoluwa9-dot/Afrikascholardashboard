import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, BookOpen, Plus, ArrowRight, Send } from "lucide-react";
import { usePublishing } from "@/hooks/usePublishing";

// Demo fallback submissions
const DEMO_SUBMISSIONS = [
  { id: "demo-1", user_id: "demo", title: "AI-Assisted Epidemiological Modeling in Sub-Saharan Africa", abstract: "This study explores how machine learning models can enhance epidemiological forecasting.", keywords: "AI, Epidemiology, Public Health", research_field: "Public Health", journal_name: "African Journal of Public Health", journal_id: null, manuscript_url: null, cover_letter: null, co_authors: [{ name: "Dr. Ama Mensah", institution: "University of Ghana" }], status: "submitted", workflow_stage: "peer_review", reviewer_feedback: [], submitted_at: "2026-03-02T00:00:00Z", updated_at: "2026-03-05T00:00:00Z" },
  { id: "demo-2", user_id: "demo", title: "Climate Policy Innovation in West Africa", abstract: "An analysis of renewable energy policy frameworks across West African nations.", keywords: "Climate, Policy, Energy", research_field: "Environmental Policy", journal_name: "African Policy Research Review", journal_id: null, manuscript_url: null, cover_letter: null, co_authors: [{ name: "Dr. Kofi Mensah", institution: "Kwame Nkrumah University" }], status: "published", workflow_stage: "publication", reviewer_feedback: [], submitted_at: "2026-01-15T00:00:00Z", updated_at: "2026-02-28T00:00:00Z" },
  { id: "demo-3", user_id: "demo", title: "Digital Financial Inclusion and Economic Growth in East Africa", abstract: "Examining the impact of digital financial services on economic development.", keywords: "FinTech, Inclusion, Economics", research_field: "Economics", journal_name: "East African Economic Review", journal_id: null, manuscript_url: null, cover_letter: null, co_authors: [], status: "accepted", workflow_stage: "decision", reviewer_feedback: [], submitted_at: "2026-02-10T00:00:00Z", updated_at: "2026-03-01T00:00:00Z" },
] as any[];

const PublishingOverview = () => {
  const { submissions: dbSubmissions, loading } = usePublishing();

  const submissions = dbSubmissions.length > 0 ? dbSubmissions : DEMO_SUBMISSIONS;

  const submitted = submissions.length;
  const underReview = submissions.filter(s => ["editorial_screening", "peer_review"].includes(s.workflow_stage)).length;
  const accepted = submissions.filter(s => s.status === "accepted").length;
  const published = submissions.filter(s => s.status === "published").length;

  const stats = [
    { label: "Submitted Manuscripts", value: submitted, icon: Send, color: "text-primary" },
    { label: "Under Review", value: underReview, icon: Clock, color: "text-accent" },
    { label: "Accepted Papers", value: accepted, icon: CheckCircle, color: "text-afrika-green" },
    { label: "Published Papers", value: published, icon: BookOpen, color: "text-afrika-orange" },
  ];

  const isEmpty = submissions.length === 0;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Publishing Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your academic publishing activity.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <Card key={s.label} className="border-border">
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{loading ? "–" : s.value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isEmpty ? (
          <Card className="border-border">
            <CardContent className="py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">You have not submitted any manuscripts yet.</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                Start by submitting your first manuscript for journal review.
              </p>
              <Link to="/dashboard/publishing/submit">
                <Button variant="afrika" className="mt-6 gap-2"><Plus className="h-4 w-4" />Submit Your First Manuscript</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Recent Activity */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Recent Publishing Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {submissions.slice(0, 5).map(s => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{s.journal_name}</span>
                        <Badge variant="secondary" className="text-[10px]">{s.status.replace("_", " ")}</Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(s.submitted_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Link to="/dashboard/publishing/submit">
                <Button variant="afrika" className="gap-2"><Plus className="h-4 w-4" />Submit New Manuscript</Button>
              </Link>
              <Link to="/dashboard/publishing/submissions">
                <Button variant="afrikaOutline" className="gap-2"><ArrowRight className="h-4 w-4" />View All Submissions</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PublishingOverview;
