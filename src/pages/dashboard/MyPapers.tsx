import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronRight, FileText, Edit, Send, Download, Share2, Trash2,
  Copy, ExternalLink, Eye, Plus, ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  Submitted: "bg-primary/10 text-primary",
  Published: "bg-afrika-green/10 text-afrika-green",
};

const initialPapers = [
  { id: 1, title: "The Effects of AI-Driven Health Diagnostics on Clinical Outcomes in Sub-Saharan Africa", status: "Draft", journal: "—", date: "2026-03-02", views: 0 },
  { id: 2, title: "Digital Financial Inclusion and Economic Growth in East Africa", status: "Submitted", journal: "Information Sciences", date: "2026-01-20", views: 34 },
  { id: 3, title: "Climate Change Effects on Agricultural Productivity in West Africa", status: "Published", journal: "IEEE Trans. Neural Networks", date: "2025-12-05", views: 128 },
];

const MyPapers = () => {
  const [papers, setPapers] = useState(initialPapers);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    setPapers((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
    toast({ title: "Paper deleted", description: "The paper has been removed from your library." });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span>My Research</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">My Papers</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Papers</h1>
            <p className="text-sm text-muted-foreground mt-1">View and manage all your generated research papers.</p>
          </div>
          <Link to="/dashboard/generate-paper">
            <Button variant="afrika" size="sm" className="gap-1"><Plus className="h-3 w-3" /> Generate Paper</Button>
          </Link>
        </div>

        {papers.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground mt-3">No papers generated yet.</p>
            <Link to="/dashboard/generate-paper" className="text-sm text-accent font-medium hover:underline mt-1 inline-flex items-center gap-1">
              Generate your first paper <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {papers.map((paper) => (
              <div key={paper.id} className="bg-card rounded-xl border border-border p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground">{paper.title}</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <Badge className={`text-[10px] ${statusColors[paper.status]}`}>{paper.status}</Badge>
                      <span className="text-xs text-muted-foreground">Journal: {paper.journal}</span>
                      <span className="text-xs text-muted-foreground">{paper.date}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Eye className="h-3 w-3" /> {paper.views} views</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Link to="/dashboard/generate-paper">
                    <Button variant="outline" size="sm" className="text-xs gap-1"><Edit className="h-3 w-3" /> Edit</Button>
                  </Link>
                  <Link to="/dashboard/publishing/submit">
                    <Button variant="afrika" size="sm" className="text-xs gap-1"><Send className="h-3 w-3" /> Submit</Button>
                  </Link>
                  <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => toast({ title: "Download started", description: "Your paper is being exported as .docx" })}>
                    <Download className="h-3 w-3" /> Export
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs gap-1"><Share2 className="h-3 w-3" /> Share</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                      <DialogHeader><DialogTitle>Share Paper</DialogTitle></DialogHeader>
                      <Textarea readOnly value={`I just published a research article on Afrika Scholar. Read here: https://afrikascholar.com/papers/${paper.id}`} className="text-sm" />
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm" className="gap-1 flex-1" onClick={() => { navigator.clipboard.writeText(`https://afrikascholar.com/papers/${paper.id}`); toast({ title: "Link copied!" }); }}>
                          <Copy className="h-3 w-3" /> Copy
                        </Button>
                        <Button variant="afrika" size="sm" className="gap-1 flex-1" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`I just published a research article on Afrika Scholar. Read here: https://afrikascholar.com/papers/${paper.id}`)}`, "_blank")}>
                          <ExternalLink className="h-3 w-3" /> WhatsApp
                        </Button>
                        <Button variant="afrikaBlue" size="sm" className="gap-1 flex-1" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://afrikascholar.com/papers/${paper.id}`)}`, "_blank")}>
                          <ExternalLink className="h-3 w-3" /> LinkedIn
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={deleteId === paper.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-xs gap-1 text-destructive" onClick={() => setDeleteId(paper.id)}>
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                      <DialogHeader><DialogTitle>Delete Paper</DialogTitle></DialogHeader>
                      <p className="text-sm text-muted-foreground">Are you sure you want to delete "{paper.title}"? This action cannot be undone.</p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDelete(paper.id)}>Delete</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyPapers;
