import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronRight, Plus, FileText, Clock, Download, Send,
  Sparkles, Trash2,
} from "lucide-react";
import { useAIPapers } from "@/hooks/useAIPapers";
import { toast } from "sonner";

const DEMO_PAPERS = [
  {
    id: "demo-1", user_id: "demo", title: "AI-Assisted Epidemiological Modeling in Sub-Saharan Africa",
    research_field: "Public Health", paper_type: "research_paper", target_journal: "African Journal of Public Health",
    citation_style: "APA", sections: ["Abstract", "Introduction", "Literature Review", "Methodology", "Results", "Discussion", "Conclusion"],
    content: { Abstract: "This study explores...", Introduction: "Artificial intelligence is increasingly..." },
    sources: [], status: "draft", credits_used: 4, created_at: "2026-03-05T00:00:00Z", updated_at: "2026-03-07T00:00:00Z",
  },
  {
    id: "demo-2", user_id: "demo", title: "Digital Financial Inclusion and Economic Growth in East Africa",
    research_field: "Economics", paper_type: "policy_paper", target_journal: "Journal of African Economics",
    citation_style: "APA", sections: ["Abstract", "Introduction", "Literature Review", "Discussion", "Conclusion"],
    content: { Abstract: "This paper examines..." },
    sources: [], status: "completed", credits_used: 8, created_at: "2026-02-20T00:00:00Z", updated_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "demo-3", user_id: "demo", title: "Climate Policy Innovation in West Africa: A Literature Review",
    research_field: "Climate Policy", paper_type: "literature_review", target_journal: null,
    citation_style: "Harvard", sections: ["Abstract", "Introduction", "Literature Review", "Conclusion"],
    content: {},
    sources: [], status: "draft", credits_used: 2, created_at: "2026-03-06T00:00:00Z", updated_at: "2026-03-06T00:00:00Z",
  },
];

const SavedPapers = () => {
  const { papers: dbPapers, loading, deletePaper } = useAIPapers();
  const papers = dbPapers.length > 0 ? dbPapers : DEMO_PAPERS;
  const isDemo = dbPapers.length === 0;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">AI Paper Generator</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-serif">My AI Generated Papers</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your AI-assisted research papers.</p>
          </div>
          <Link to="/dashboard/ai-papers/new">
            <Button variant="afrika" className="gap-2">
              <Plus className="h-4 w-4" /> Create New Paper
            </Button>
          </Link>
        </div>

        {papers.length === 0 && !loading ? (
          <Card className="border-border">
            <CardContent className="py-16 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Start your first AI-assisted research paper.</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                The AI Paper Generator helps you structure, write, and cite your academic work.
              </p>
              <Link to="/dashboard/ai-papers/new">
                <Button variant="afrika" className="mt-6 gap-2"><Plus className="h-4 w-4" /> Create New Paper</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {papers.map(p => (
              <Card key={p.id} className="border-border hover:shadow-sm transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-accent shrink-0" />
                        <h3 className="text-sm font-bold text-foreground truncate">{p.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant={p.status === "completed" ? "default" : "secondary"} className="text-[10px]">
                          {p.status === "completed" ? "Completed" : "Draft"}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">{p.paper_type.replace("_", " ")}</Badge>
                        {p.research_field && <Badge variant="outline" className="text-[10px]">{p.research_field}</Badge>}
                        {p.target_journal && (
                          <span className="text-[10px] text-muted-foreground">→ {p.target_journal}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(p.updated_at).toLocaleDateString()}</span>
                        <span>{p.sections.length} sections</span>
                        <span>{p.credits_used} credits used</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link to={isDemo ? "#" : `/dashboard/ai-papers/workspace/${p.id}`}>
                        <Button size="sm" variant="afrika" className="h-7 text-[10px] gap-1" disabled={isDemo}>
                          Continue Editing
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1"
                        onClick={() => toast.success("Export coming soon")}>
                        <Download className="h-3 w-3" />
                      </Button>
                      <Link to="/dashboard/publishing/submit">
                        <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1">
                          <Send className="h-3 w-3" />
                        </Button>
                      </Link>
                      {!isDemo && (
                        <Button size="sm" variant="ghost" className="h-7 text-[10px] text-destructive"
                          onClick={() => deletePaper.mutate(p.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedPapers;
