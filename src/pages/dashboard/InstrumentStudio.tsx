import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ChevronRight,
  Wrench,
  Plus,
  Copy,
  ExternalLink,
  Loader2,
  Eye,
  BarChart3,
  Share2,
  ArrowRight,
} from "lucide-react";

const types = ["Survey", "Likert Scale Tool", "Regression Dashboard", "Simulation Model", "Policy Calculator", "Custom"];
const audiences = ["Students", "Faculty", "Researchers", "Policy Makers", "General Public"];

const sampleInstruments = [
  { id: 1, title: "Student Learning Assessment Survey", type: "Survey", responses: 142, completion: 87, status: "Published", link: "https://afrikascholar.com/i/abc123" },
  { id: 2, title: "Research Impact Likert Scale", type: "Likert Scale Tool", responses: 56, completion: 92, status: "Draft", link: "" },
  { id: 3, title: "Funding Regression Dashboard", type: "Regression Dashboard", responses: 0, completion: 0, status: "Published", link: "https://afrikascholar.com/i/def456" },
];

const InstrumentStudio = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [audience, setAudience] = useState("");
  const [logic, setLogic] = useState("");
  const [building, setBuilding] = useState(false);
  const [built, setBuilt] = useState(false);

  const handleBuild = () => {
    setBuilding(true);
    setTimeout(() => {
      setBuilding(false);
      setBuilt(true);
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

        <div>
          <h1 className="text-2xl font-bold text-foreground">Instrument Studio</h1>
          <p className="text-sm text-muted-foreground mt-1">Build and manage research instruments, surveys, and analytical tools.</p>
        </div>

        {/* Creation Form */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-accent" />
            <h2 className="text-base font-bold text-foreground">Create New Instrument</h2>
          </div>

          <div className="space-y-2">
            <Label>Instrument Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Student Academic Performance Survey" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Instrument Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                <SelectContent>
                  {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue placeholder="Select audience..." /></SelectTrigger>
                <SelectContent>
                  {audiences.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Logic Prompt</Label>
            <Textarea
              value={logic}
              onChange={(e) => setLogic(e.target.value)}
              placeholder="Describe what this instrument should measure, the variables involved, and any specific logic..."
              className="min-h-[100px]"
            />
          </div>

          <Button
            variant="afrika"
            size="lg"
            className="w-full gap-1"
            onClick={handleBuild}
            disabled={building || !title || !type}
          >
            {building ? <><Loader2 className="h-4 w-4 animate-spin" /> Building...</> : <>Build Instrument <ArrowRight className="h-4 w-4" /></>}
          </Button>
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
                  <p className="text-sm text-muted-foreground mt-2">Interactive instrument preview will appear here.</p>
                  <p className="text-xs text-muted-foreground mt-1">"{title}" — {type}</p>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="p-5">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="text-2xl font-bold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Responses</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="text-2xl font-bold text-foreground">0%</p>
                    <p className="text-xs text-muted-foreground">Completion Rate</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="text-2xl font-bold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="share" className="p-5 space-y-3">
                <div className="space-y-2">
                  <Label>Public Link</Label>
                  <div className="flex gap-2">
                    <Input readOnly value="https://afrikascholar.com/i/new-instrument" />
                    <Button variant="outline" size="sm" className="gap-1 shrink-0"><Copy className="h-3 w-3" /> Copy</Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="afrika" size="sm" className="gap-1"><ExternalLink className="h-3 w-3" /> WhatsApp</Button>
                  <Button variant="afrikaBlue" size="sm" className="gap-1"><ExternalLink className="h-3 w-3" /> LinkedIn</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* My Instruments */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">My Instruments</h2>
          {sampleInstruments.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <Wrench className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground mt-3">No instruments created yet.</p>
            </div>
          ) : (
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
                      <Button variant="outline" size="sm" className="text-xs gap-1"><Copy className="h-3 w-3" /> Copy Link</Button>
                      <Button variant="ghost" size="sm" className="text-xs gap-1"><Share2 className="h-3 w-3" /> Share</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstrumentStudio;
