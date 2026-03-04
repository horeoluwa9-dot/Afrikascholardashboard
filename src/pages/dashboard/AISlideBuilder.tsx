import { useState } from "react";
import { Link } from "react-router-dom";
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
  ChevronRight, Presentation, Loader2, Download, Share2, Copy, ExternalLink, Edit, ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sources = ["From My Instrument", "From My Paper", "From Prompt"];
const slideTypes = ["Thesis Defense", "Conference Presentation", "Research Proposal", "Policy Brief"];

const sampleSlides = [
  { title: "Title Slide", content: "AI-Driven Health Diagnostics in Sub-Saharan Africa — A Research Presentation" },
  { title: "Introduction", content: "Background & context, research gap, objectives, significance of the study" },
  { title: "Literature Review", content: "Key theoretical frameworks, empirical evidence, research positioning" },
  { title: "Methodology", content: "Research design, sampling, data collection instruments, analysis plan" },
  { title: "Results", content: "Key findings, statistical outputs, tables and figures overview" },
  { title: "Discussion", content: "Interpretation, implications, comparison with prior work" },
  { title: "Conclusion", content: "Summary, recommendations, future research directions" },
  { title: "References", content: "APA 7th formatted bibliography" },
];

const AISlideBuilder = () => {
  const [source, setSource] = useState("");
  const [slideType, setSlideType] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [editingSlide, setEditingSlide] = useState<number | null>(null);
  const [slides, setSlides] = useState(sampleSlides);
  const { toast } = useToast();

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      toast({ title: "Slides generated", description: "Your presentation outline is ready for review." });
    }, 2500);
  };

  const updateSlide = (index: number, field: "title" | "content", value: string) => {
    setSlides((prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Instrument Studio</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">AI Slide Builder</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Slide Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate structured presentation slides from your research content.</p>
        </div>

        {!generated ? (
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source</Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger><SelectValue placeholder="Select source..." /></SelectTrigger>
                  <SelectContent>
                    {sources.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Slide Type</Label>
                <Select value={slideType} onValueChange={setSlideType}>
                  <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                  <SelectContent>
                    {slideTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {source === "From Prompt" && (
              <div className="space-y-2">
                <Label>Describe your presentation</Label>
                <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the topic, key points, and structure..." className="min-h-[100px]" />
              </div>
            )}

            <Button variant="afrika" size="lg" className="w-full gap-1" onClick={handleGenerate} disabled={generating || !source || !slideType}>
              {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating Slides...</> : <><Presentation className="h-4 w-4" /> Generate Slides</>}
            </Button>
            <p className="text-xs text-muted-foreground text-center">Consumes 2 Pro Credits</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-afrika-green/10 border border-afrika-green/30 rounded-xl p-4">
              <p className="text-sm font-semibold text-foreground">✅ Slide deck generated successfully!</p>
              <p className="text-xs text-muted-foreground">Review and edit individual slides below.</p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="gap-1" onClick={() => toast({ title: "Export started", description: "Slides are being exported." })}>
                <Download className="h-3 w-3" /> Export
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1"><Share2 className="h-3 w-3" /> Share</Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader><DialogTitle>Share Slides</DialogTitle></DialogHeader>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => { navigator.clipboard.writeText("https://afrikascholar.com/slides/1"); toast({ title: "Link copied!" }); }}>
                      <Copy className="h-3 w-3" /> Copy Link
                    </Button>
                    <Button variant="afrika" size="sm" className="flex-1 gap-1"><ExternalLink className="h-3 w-3" /> WhatsApp</Button>
                    <Button variant="afrikaBlue" size="sm" className="flex-1 gap-1"><ExternalLink className="h-3 w-3" /> LinkedIn</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {slides.map((slide, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-[10px]">Slide {i + 1}</Badge>
                    <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => setEditingSlide(editingSlide === i ? null : i)}>
                      <Edit className="h-3 w-3" /> {editingSlide === i ? "Done" : "Edit"}
                    </Button>
                  </div>
                  {editingSlide === i ? (
                    <div className="space-y-2">
                      <Input value={slide.title} onChange={(e) => updateSlide(i, "title", e.target.value)} />
                      <Textarea value={slide.content} onChange={(e) => updateSlide(i, "content", e.target.value)} />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-sm font-bold text-foreground">{slide.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{slide.content}</p>
                    </>
                  )}
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full" onClick={() => { setGenerated(false); setSource(""); setSlideType(""); }}>
              Generate Another Deck
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AISlideBuilder;
