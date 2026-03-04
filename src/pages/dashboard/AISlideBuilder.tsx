import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronRight, ChevronDown, Presentation, Loader2, Download, Share2, Copy, ExternalLink,
  Edit, Sparkles, FileText, BookOpen, ArrowRight, ArrowLeft, Check, Trash2, Plus, GripVertical,
  BarChart3, Clock, Users, Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const detailLevels = [
  { label: "Brief", desc: "Focus on key research insights and summary conclusions." },
  { label: "Standard", desc: "Balanced detail suitable for academic presentations." },
  { label: "Detailed", desc: "Full explanation for teaching, lectures, and documentation." },
];

const themes = [
  "Academic Minimal", "Research Conference", "Policy Presentation",
  "Data Visualisation", "Educational Lecture", "Modern Minimal",
];

const generationSteps = [
  "Analyzing presentation topic",
  "Understanding audience context",
  "Researching supporting information",
  "Building presentation outline",
  "Identifying gaps and missing context",
  "Generating slide content",
];

const sampleSlides = [
  { title: "Title Slide", content: "AI-Driven Diagnostics and Clinical Outcomes in Sub-Saharan Africa", layout: "title" },
  { title: "Introduction", content: "Background & context, research gap, objectives, significance of the study", layout: "content" },
  { title: "Literature Review", content: "Key theoretical frameworks, empirical evidence, research positioning", layout: "content" },
  { title: "Methodology", content: "Research design, sampling, data collection instruments, analysis plan", layout: "content" },
  { title: "Key Findings", content: "Primary results with statistical significance, effect sizes, confidence intervals", layout: "data" },
  { title: "Data Visualisation", content: "Charts showing response distribution, funding models, innovation metrics", layout: "chart" },
  { title: "Discussion", content: "Interpretation, implications, comparison with prior work, limitations", layout: "content" },
  { title: "Recommendations", content: "Policy recommendations, practical implications, future research directions", layout: "content" },
  { title: "Conclusion", content: "Summary of key contributions, impact statement, call to action", layout: "content" },
  { title: "References", content: "APA 7th formatted bibliography — 25+ references", layout: "content" },
];

const AISlideBuilder = () => {
  const [step, setStep] = useState(1);
  const [startMethod, setStartMethod] = useState<"prompt" | "outline" | "convert" | "">("");
  const [prompt, setPrompt] = useState("");
  const [detailLevel, setDetailLevel] = useState("Standard");
  const [slideLength, setSlideLength] = useState("");
  const [language, setLanguage] = useState("English");
  const [tone, setTone] = useState("Academic");
  const [selectedTheme, setSelectedTheme] = useState("Academic Minimal");
  const [genProgress, setGenProgress] = useState(0);
  const [genStepIdx, setGenStepIdx] = useState(0);
  const [slides, setSlides] = useState(sampleSlides);
  const [editingSlide, setEditingSlide] = useState<number | null>(null);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const { toast } = useToast();

  const startGeneration = () => {
    setStep(5);
    setGenProgress(0);
    setGenStepIdx(0);
    const interval = setInterval(() => {
      setGenProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStep(6);
            setShowCompletionModal(true);
          }, 500);
          return 100;
        }
        return p + 2;
      });
      setGenStepIdx((i) => Math.min(i + 1, generationSteps.length - 1));
    }, 150);
  };

  const deleteSlide = (i: number) => {
    setSlides((prev) => prev.filter((_, idx) => idx !== i));
    if (selectedSlide >= slides.length - 1) setSelectedSlide(Math.max(0, slides.length - 2));
  };

  const duplicateSlide = (i: number) => {
    const s = slides[i];
    setSlides((prev) => [...prev.slice(0, i + 1), { ...s, title: s.title + " (Copy)" }, ...prev.slice(i + 1)]);
  };

  const addSlide = () => {
    setSlides((prev) => [...prev, { title: "New Slide", content: "Add content here...", layout: "content" }]);
    setSelectedSlide(slides.length);
  };

  const updateSlide = (i: number, field: "title" | "content", value: string) => {
    setSlides((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const handleSharePublicly = () => {
    setShowShareModal(false);
    toast({ title: "Shared to community!", description: "Your presentation has been posted to the community feed." });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Instrument Studio</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">AI Slide Builder</span>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">AI Slide Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">Create structured academic presentations instantly using AI.</p>
        </div>

        {/* Step indicator */}
        {step < 6 && (
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className={`h-2 w-8 rounded-full transition-colors ${step >= s ? "bg-accent" : "bg-border"}`} />
            ))}
          </div>
        )}

        {/* STEP 1 — Choose method */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: "prompt" as const, icon: Sparkles, title: "Start from a research topic", desc: "Describe your presentation topic and the AI will generate a structured slide deck." },
              { key: "outline" as const, icon: FileText, title: "Use an outline", desc: "Provide a structured outline and convert it into a full slide presentation." },
              { key: "convert" as const, icon: BookOpen, title: "Convert research into slides", desc: "Transform an academic paper or structured research idea into a conference-ready presentation." },
            ].map((opt) => (
              <button key={opt.key} onClick={() => { setStartMethod(opt.key); setStep(2); }}
                className="bg-card rounded-xl border border-border p-6 text-left hover:shadow-md hover:border-accent/50 transition-all space-y-3">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <opt.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-sm font-bold text-foreground">{opt.title}</h3>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
                <span className="text-xs text-accent font-medium flex items-center gap-1">Start Presentation <ArrowRight className="h-3 w-3" /></span>
              </button>
            ))}
          </div>
        )}

        {/* STEP 2 — Describe */}
        {step === 2 && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h2 className="text-base font-bold text-foreground">Describe your presentation</h2>
            <p className="text-xs text-muted-foreground">Provide a short description or research prompt.</p>
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
              placeholder="Create a 12-slide academic presentation on AI-driven diagnostics and clinical outcomes in Sub-Saharan Africa."
              className="min-h-[120px]" />
            <div className="flex flex-wrap gap-2">
              {["Academic conference presentation", "Research findings summary", "Policy briefing presentation", "PhD defense presentation", "Research methodology presentation"].map((s) => (
                <button key={s} onClick={() => setPrompt(s)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card text-muted-foreground hover:border-accent/50 transition-colors">{s}</button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={() => setStep(1)}><ArrowLeft className="h-3 w-3 mr-1" /> Back</Button>
              <Button variant="afrika" size="lg" className="flex-1" onClick={() => setStep(3)} disabled={!prompt}>Continue <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </div>
          </div>
        )}

        {/* STEP 3 — Configure */}
        {step === 3 && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h2 className="text-base font-bold text-foreground">Customize your presentation</h2>

            <div className="space-y-2">
              <Label>Level of Detail</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {detailLevels.map((d) => (
                  <button key={d.label} onClick={() => setDetailLevel(d.label)}
                    className={`p-4 rounded-xl border text-left transition-colors ${detailLevel === d.label ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"}`}>
                    <p className="text-sm font-semibold text-foreground">{d.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{d.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Presentation Length</Label>
              <Select value={slideLength} onValueChange={setSlideLength}>
                <SelectTrigger><SelectValue placeholder="Let AI decide" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Let AI decide</SelectItem>
                  <SelectItem value="short">Short (6–8 slides)</SelectItem>
                  <SelectItem value="medium">Medium (10–12 slides)</SelectItem>
                  <SelectItem value="long">Long (15–20 slides)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger className="flex items-center gap-2 text-xs font-medium text-accent">
                <ChevronDown className={`h-3 w-3 transition-transform ${showAdvanced ? "" : "-rotate-90"}`} /> Advanced Settings
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="Arabic">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={() => setStep(2)}><ArrowLeft className="h-3 w-3 mr-1" /> Back</Button>
              <Button variant="afrika" size="lg" className="flex-1" onClick={() => setStep(4)}>Continue <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </div>
          </div>
        )}

        {/* STEP 4 — Theme */}
        {step === 4 && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h2 className="text-base font-bold text-foreground">Select Presentation Style</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {themes.map((t) => (
                <button key={t} onClick={() => setSelectedTheme(t)}
                  className={`p-4 rounded-xl border text-center transition-all ${selectedTheme === t ? "border-accent bg-accent/5 shadow-sm" : "border-border hover:border-accent/30"}`}>
                  <div className="h-20 bg-secondary rounded-lg mb-2 flex items-center justify-center">
                    <Presentation className="h-8 w-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-xs font-medium text-foreground">{t}</p>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" onClick={() => setStep(3)}><ArrowLeft className="h-3 w-3 mr-1" /> Back</Button>
              <Button variant="afrika" size="lg" className="flex-1 gap-1" onClick={startGeneration}>
                <Sparkles className="h-4 w-4" /> Generate Slides
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">Consumes 2 Pro Credits</p>
          </div>
        )}

        {/* STEP 5 — Generating */}
        {step === 5 && (
          <div className="bg-card rounded-xl border border-border p-8 space-y-6 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto" />
            <h2 className="text-base font-bold text-foreground">Generating your presentation...</h2>
            <Progress value={genProgress} className="max-w-md mx-auto" />
            <div className="space-y-2 max-w-sm mx-auto text-left">
              {generationSteps.map((s, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs transition-opacity ${i <= genStepIdx ? "opacity-100" : "opacity-30"}`}>
                  {i < genStepIdx ? <Check className="h-3 w-3 text-afrika-green" /> : i === genStepIdx ? <Loader2 className="h-3 w-3 animate-spin text-accent" /> : <div className="h-3 w-3" />}
                  <span className={i <= genStepIdx ? "text-foreground" : "text-muted-foreground"}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6 — Slide Editor */}
        {step === 6 && (
          <>
            {/* Completion modal */}
            <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
              <DialogContent className="max-w-sm">
                <DialogHeader><DialogTitle>Presentation Ready ✅</DialogTitle></DialogHeader>
                <p className="text-sm text-muted-foreground">Your AI-generated research presentation is ready.</p>
                <div className="flex flex-col gap-2 mt-3">
                  <Button variant="afrika" size="sm" onClick={() => setShowCompletionModal(false)}>Edit Slides</Button>
                  <Button variant="outline" size="sm" onClick={() => { setShowCompletionModal(false); toast({ title: "Downloading PPT..." }); }}>
                    <Download className="h-3 w-3 mr-1" /> Download PPT
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setShowCompletionModal(false); setShowShareModal(true); }}>
                    <Share2 className="h-3 w-3 mr-1" /> Share Presentation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Share modal */}
            <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
              <DialogContent className="max-w-sm">
                <DialogHeader><DialogTitle>Share this update with the community?</DialogTitle></DialogHeader>
                <p className="text-sm text-muted-foreground">
                  Defi created a research presentation: <strong>{prompt.slice(0, 60) || "Untitled"}...</strong>
                </p>
                <div className="flex flex-col gap-2 mt-3">
                  <Button variant="afrika" size="sm" onClick={handleSharePublicly}>Share Publicly</Button>
                  <Button variant="outline" size="sm" onClick={() => { setShowShareModal(false); toast({ title: "Shared with network" }); }}>Share with Network Only</Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowShareModal(false)}>Skip</Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{slides.length} slides</Badge>
                <Badge variant="outline" className="text-xs">{selectedTheme}</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => toast({ title: "Exporting PPT..." })}><Download className="h-3 w-3" /> PPT</Button>
                <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => toast({ title: "Exporting PDF..." })}><Download className="h-3 w-3" /> PDF</Button>
                <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => setShowShareModal(true)}><Share2 className="h-3 w-3" /> Share</Button>
              </div>
            </div>

            {/* Editor layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Slide thumbnails */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {slides.map((s, i) => (
                  <button key={i} onClick={() => { setSelectedSlide(i); setEditingSlide(null); }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedSlide === i ? "border-accent bg-accent/5" : "border-border bg-card hover:border-accent/30"}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-mono">{i + 1}</span>
                      <p className="text-xs font-medium text-foreground truncate">{s.title}</p>
                    </div>
                  </button>
                ))}
                <Button variant="ghost" size="sm" className="w-full text-xs gap-1" onClick={addSlide}><Plus className="h-3 w-3" /> Add Slide</Button>
              </div>

              {/* Main preview */}
              <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 min-h-[400px] flex flex-col">
                {editingSlide === selectedSlide ? (
                  <div className="space-y-3 flex-1">
                    <Input value={slides[selectedSlide].title} onChange={(e) => updateSlide(selectedSlide, "title", e.target.value)} className="text-lg font-bold" />
                    <Textarea value={slides[selectedSlide].content} onChange={(e) => updateSlide(selectedSlide, "content", e.target.value)} className="flex-1 min-h-[200px]" />
                    <Button variant="afrika" size="sm" onClick={() => setEditingSlide(null)}>Done Editing</Button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
                    <Badge variant="secondary" className="text-[10px]">Slide {selectedSlide + 1} of {slides.length}</Badge>
                    <h2 className="text-xl font-bold text-foreground">{slides[selectedSlide].title}</h2>
                    <p className="text-sm text-muted-foreground max-w-md">{slides[selectedSlide].content}</p>
                  </div>
                )}
              </div>

              {/* Right panel - tools & analytics */}
              <div className="space-y-4">
                <div className="bg-card rounded-xl border border-border p-4 space-y-2">
                  <p className="text-xs font-semibold text-foreground">Slide Actions</p>
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1" onClick={() => setEditingSlide(selectedSlide)}><Edit className="h-3 w-3" /> Edit Slide</Button>
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1" onClick={() => duplicateSlide(selectedSlide)}><Copy className="h-3 w-3" /> Duplicate</Button>
                  <Button variant="ghost" size="sm" className="w-full text-xs gap-1 text-destructive" onClick={() => deleteSlide(selectedSlide)}><Trash2 className="h-3 w-3" /> Delete</Button>
                </div>

                <div className="bg-card rounded-xl border border-border p-4 space-y-3">
                  <p className="text-xs font-semibold text-foreground">Presentation Analytics</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Slides</span><span className="font-medium text-foreground">{slides.length}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Est. Time</span><span className="font-medium text-foreground">~{Math.round(slides.length * 2.5)} min</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Detail Level</span><span className="font-medium text-foreground">{detailLevel}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Theme</span><span className="font-medium text-foreground">{selectedTheme}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => { setStep(1); setPrompt(""); setSlides(sampleSlides); setSelectedSlide(0); }}>
              Create Another Presentation
            </Button>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AISlideBuilder;
