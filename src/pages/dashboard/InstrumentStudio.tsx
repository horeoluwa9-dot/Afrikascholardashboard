import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  ChevronRight, Wrench, Plus, Copy, ExternalLink, Loader2, Eye,
  BarChart3, Share2, ArrowRight, FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const instrumentTypes = [
  { emoji: "📊", label: "Analytical Tool" },
  { emoji: "📋", label: "Survey / Questionnaire Interface" },
  { emoji: "📈", label: "Data Visualisation Dashboard" },
  { emoji: "🧪", label: "Experimental Interface" },
  { emoji: "🧮", label: "Statistical Calculator" },
  { emoji: "🌍", label: "Simulation Model" },
  { emoji: "🏛️", label: "Policy or Economic Model" },
  { emoji: "⚙️", label: "Custom Research System" },
];

const intendedUsers = ["Students", "Researchers", "Policy Analysts", "Public Users", "Institutional Staff"];

const sampleInstruments = [
  { id: 1, title: "Student Learning Assessment Survey", type: "📋 Survey", responses: 142, completion: 87, status: "Published", link: "https://afrikascholar.com/i/abc123" },
  { id: 2, title: "Research Impact Likert Scale", type: "📊 Analytical Tool", responses: 56, completion: 92, status: "Draft", link: "" },
  { id: 3, title: "Funding Regression Dashboard", type: "📈 Dashboard", responses: 0, completion: 0, status: "Published", link: "https://afrikascholar.com/i/def456" },
];

const InstrumentStudio = () => {
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [prompt, setPrompt] = useState(searchParams.get("prompt") || "");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [building, setBuilding] = useState(false);
  const [built, setBuilt] = useState(false);
  const [showCreditConfirm, setShowCreditConfirm] = useState(false);
  const { toast } = useToast();

  const toggleUser = (u: string) => setSelectedUsers((prev) => prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]);

  const handleBuildConfirm = () => {
    setShowCreditConfirm(false);
    setBuilding(true);
    setTimeout(() => {
      setBuilding(false);
      setBuilt(true);
      toast({ title: "Instrument generated!", description: "Your research instrument is ready for preview." });
    }, 3000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Instrument Studio</span>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Research Instrument Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">Design interactive research instruments without writing code — powered by AI.</p>
        </div>

        {/* Creation Form */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-accent" />
            <h2 className="text-base font-bold text-foreground">Create New Instrument</h2>
          </div>

          <div className="space-y-2">
            <Label>Instrument Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Cognitive Load Estimator for Online Learning" />
          </div>

          <div className="space-y-2">
            <Label>Instrument Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
              <SelectContent>
                {instrumentTypes.map((t) => <SelectItem key={t.label} value={t.label}>{t.emoji} {t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Describe functionality, inputs, outputs, and logic</Label>
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the functionality, inputs, outputs, and analytical logic of your instrument..." className="min-h-[100px]" />
          </div>

          <div className="space-y-2">
            <Label>Intended Users</Label>
            <div className="flex flex-wrap gap-2">
              {intendedUsers.map((u) => (
                <button key={u} onClick={() => toggleUser(u)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedUsers.includes(u) ? "bg-accent text-accent-foreground border-accent" : "bg-card text-muted-foreground border-border hover:border-accent/50"}`}>
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Credit confirmation dialog */}
          <Dialog open={showCreditConfirm} onOpenChange={setShowCreditConfirm}>
            <DialogContent className="max-w-sm">
              <DialogHeader><DialogTitle>Confirm Credit Usage</DialogTitle></DialogHeader>
              <p className="text-sm text-muted-foreground">You are about to use 2 Pro Credits to generate this instrument.</p>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowCreditConfirm(false)}>Cancel</Button>
                <Button variant="afrika" size="sm" className="flex-1" onClick={handleBuildConfirm}>Proceed</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="afrika" size="lg" className="w-full gap-1" onClick={() => setShowCreditConfirm(true)} disabled={building || !title || !type}>
            {building ? <><Loader2 className="h-4 w-4 animate-spin" /> Building...</> : <>🧪 Generate Research Instrument</>}
          </Button>
          <p className="text-xs text-muted-foreground text-center">Building an instrument consumes 2 Pro Credits.</p>
        </div>

        {/* Built preview */}
        {built && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Tabs defaultValue="preview">
              <div className="px-5 pt-4 border-b border-border">
                <TabsList className="bg-secondary">
                  <TabsTrigger value="preview" className="gap-1"><Eye className="h-3 w-3" /> Preview</TabsTrigger>
                  <TabsTrigger value="analytics" className="gap-1"><BarChart3 className="h-3 w-3" /> Analytics</TabsTrigger>
                  <TabsTrigger value="share" className="gap-1"><Share2 className="h-3 w-3" /> Share</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="preview" className="p-5">
                <div className="bg-secondary rounded-lg p-6 text-center">
                  <Wrench className="h-8 w-8 mx-auto text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground mt-2">Interactive instrument preview</p>
                  <p className="text-xs text-muted-foreground mt-1">"{title}" — {type}</p>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                  <Button variant="outline" size="sm" className="text-xs gap-1"><Eye className="h-3 w-3" /> Preview</Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1">✏️ Edit</Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1"><Copy className="h-3 w-3" /> Duplicate</Button>
                  <Link to="/dashboard/my-papers">
                    <Button variant="outline" size="sm" className="text-xs gap-1"><FileText className="h-3 w-3" /> Embed in Paper</Button>
                  </Link>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="p-5">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-secondary rounded-lg p-4"><p className="text-2xl font-bold text-foreground">0</p><p className="text-xs text-muted-foreground">Responses</p></div>
                  <div className="bg-secondary rounded-lg p-4"><p className="text-2xl font-bold text-foreground">0%</p><p className="text-xs text-muted-foreground">Completion</p></div>
                  <div className="bg-secondary rounded-lg p-4"><p className="text-2xl font-bold text-foreground">0</p><p className="text-xs text-muted-foreground">Views</p></div>
                </div>
              </TabsContent>
              <TabsContent value="share" className="p-5 space-y-3">
                <div className="space-y-2">
                  <Label>Public Link</Label>
                  <div className="flex gap-2">
                    <Input readOnly value="https://afrikascholar.com/i/new-instrument" />
                    <Button variant="outline" size="sm" className="gap-1 shrink-0" onClick={() => { navigator.clipboard.writeText("https://afrikascholar.com/i/new-instrument"); toast({ title: "Link copied!" }); }}>
                      <Copy className="h-3 w-3" /> Copy
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="afrika" size="sm" className="gap-1" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent("Check out my research instrument on Afrika Scholar: https://afrikascholar.com/i/new-instrument")}`, "_blank")}>
                    <ExternalLink className="h-3 w-3" /> WhatsApp
                  </Button>
                  <Button variant="afrikaBlue" size="sm" className="gap-1" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://afrikascholar.com/i/new-instrument")}`, "_blank")}>
                    <ExternalLink className="h-3 w-3" /> LinkedIn
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* My Instruments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">My Instruments</h2>
            <Link to="/dashboard/instrument-studio/my">
              <Button variant="ghost" size="sm" className="text-xs gap-1">View All <ArrowRight className="h-3 w-3" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleInstruments.map((inst) => (
              <div key={inst.id} className="bg-card rounded-xl border border-border p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold text-foreground">{inst.title}</h3>
                  <Badge variant={inst.status === "Published" ? "default" : "secondary"} className="text-[10px]">{inst.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{inst.type}</p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{inst.responses} responses</span>
                  <span>{inst.completion}% completion</span>
                </div>
                {inst.link && (
                  <div className="flex gap-2">
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
                          <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => { navigator.clipboard.writeText(inst.link); toast({ title: "Link copied!" }); }}>
                            <Copy className="h-3 w-3" /> Copy
                          </Button>
                          <Button variant="afrika" size="sm" className="flex-1 gap-1"><ExternalLink className="h-3 w-3" /> WhatsApp</Button>
                          <Button variant="afrikaBlue" size="sm" className="flex-1 gap-1"><ExternalLink className="h-3 w-3" /> LinkedIn</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstrumentStudio;
