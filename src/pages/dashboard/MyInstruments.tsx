import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Copy, Share2, ExternalLink, Plus, Eye, BarChart3, Wrench } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const instruments = [
  { id: 1, title: "Student Learning Assessment Survey", type: "📋 Survey", responses: 142, completion: 87, views: 340, status: "Published", link: "https://afrikascholar.com/i/abc123", date: "2026-02-15" },
  { id: 2, title: "Research Impact Likert Scale", type: "📊 Analytical Tool", responses: 56, completion: 92, views: 180, status: "Draft", link: "", date: "2026-02-20" },
  { id: 3, title: "Funding Regression Dashboard", type: "📈 Dashboard", responses: 0, completion: 0, views: 45, status: "Published", link: "https://afrikascholar.com/i/def456", date: "2026-03-01" },
  { id: 4, title: "Policy Impact Calculator", type: "🏛️ Policy Model", responses: 28, completion: 75, views: 95, status: "Published", link: "https://afrikascholar.com/i/ghi789", date: "2026-02-28" },
];

const MyInstruments = () => {
  const { toast } = useToast();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Instrument Studio</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">My Instruments</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Instruments</h1>
            <p className="text-sm text-muted-foreground mt-1">All your created research instruments in one place.</p>
          </div>
          <Link to="/dashboard/instrument-studio">
            <Button variant="afrika" size="sm" className="gap-1"><Plus className="h-3 w-3" /> Create New</Button>
          </Link>
        </div>

        {instruments.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Wrench className="h-10 w-10 mx-auto text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground mt-3">No instruments created yet.</p>
            <Link to="/dashboard/instrument-studio" className="text-sm text-accent font-medium hover:underline mt-1 inline-block">Create your first instrument →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instruments.map((inst) => (
              <div key={inst.id} className="bg-card rounded-xl border border-border p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold text-foreground">{inst.title}</h3>
                  <Badge variant={inst.status === "Published" ? "default" : "secondary"} className="text-[10px]">{inst.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{inst.type} · Created {inst.date}</p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {inst.views} views</span>
                  <span>{inst.responses} responses</span>
                  <span>{inst.completion}% completion</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Link to="/dashboard/instrument-studio">
                    <Button variant="outline" size="sm" className="text-xs gap-1"><Eye className="h-3 w-3" /> View</Button>
                  </Link>
                  <Button variant="outline" size="sm" className="text-xs gap-1"><BarChart3 className="h-3 w-3" /> Analytics</Button>
                  {inst.link && (
                    <>
                      <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => { navigator.clipboard.writeText(inst.link); toast({ title: "Link copied!" }); }}>
                        <Copy className="h-3 w-3" /> Copy Link
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-xs gap-1"><Share2 className="h-3 w-3" /> Share</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm">
                          <DialogHeader><DialogTitle>Share Instrument</DialogTitle></DialogHeader>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => { navigator.clipboard.writeText(inst.link); toast({ title: "Copied!" }); }}><Copy className="h-3 w-3" /> Copy</Button>
                            <Button variant="afrika" size="sm" className="flex-1 gap-1"><ExternalLink className="h-3 w-3" /> WhatsApp</Button>
                            <Button variant="afrikaBlue" size="sm" className="flex-1 gap-1"><ExternalLink className="h-3 w-3" /> LinkedIn</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyInstruments;
