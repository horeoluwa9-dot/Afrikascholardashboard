import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CreditsHowItWorksModal } from "@/components/dashboard/CreditsModal";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Check,
  Download,
  Send,
  Save,
  Copy,
  FileText,
  Loader2,
  AlertTriangle,
} from "lucide-react";

const standards = [
  "Harvard / MIT Standard",
  "APA 7th Edition",
  "IMRAD Structure",
  "25+ Citations",
  "Statistical Analysis",
  "SPSS / STATA / R Code",
  "Power Analysis",
  "Word Export",
];

const paperTypes = [
  "Empirical Research Paper",
  "Theoretical Paper",
  "Literature Review",
  "Policy Analysis",
  "Case Study",
  "Experimental Study",
  "Meta-Analysis",
];

const lengths = [
  "~3,000 words (short paper)",
  "~5,000 words",
  "~8,000 words",
  "Custom length",
];

const audiences = [
  "Academic / Peer-reviewed Journal",
  "Policy Institution",
  "Conference Paper",
  "Institutional Report",
  "Working Paper",
];

const paperSections = [
  "TITLE",
  "RUNNING HEAD",
  "ABSTRACT",
  "KEYWORDS",
  "INTRODUCTION",
  "LITERATURE REVIEW",
  "METHODOLOGY",
  "RESULTS",
  "DISCUSSION",
  "CONCLUSION",
  "REFERENCES",
];

const sampleContent: Record<string, string> = {
  TITLE: 'The Effects of AI-Driven Health Diagnostics on Clinical Outcomes in Sub-Saharan Africa: An Empirical Investigation',
  "RUNNING HEAD": 'AI-DRIVEN HEALTH DIAGNOSTICS IN SUB-SAHARAN AFRICA',
  ABSTRACT: 'Background | This study examines the impact of AI-driven health diagnostic tools on clinical outcomes in Sub-Saharan African healthcare settings. Despite growing interest in AI-powered healthcare, empirical evidence on its effectiveness in resource-constrained environments remains limited.\n\nObjectives | This study aims to investigate the effects of AI diagnostics on patient outcomes, with a focus on accuracy, efficiency, and accessibility.\n\nMethods | A mixed-methods approach was employed, combining quantitative analysis of diagnostic accuracy data with qualitative interviews of healthcare providers.\n\nResults | The results show a significant positive correlation between AI diagnostic usage and improved clinical outcomes, with a medium effect size (r = 0.43, p < 0.001, 95% CI [0.25, 0.58]).',
  KEYWORDS: 'AI diagnostics, Sub-Saharan Africa, clinical outcomes, healthcare technology, digital health',
  INTRODUCTION: 'The integration of artificial intelligence (AI) into healthcare diagnostics has gained significant attention in recent years due to its potential to improve clinical outcomes in resource-constrained settings...',
  "LITERATURE REVIEW": 'Existing literature on AI in healthcare has primarily focused on developed nations, with limited attention to the unique challenges and opportunities in Sub-Saharan Africa...',
  METHODOLOGY: 'This study employed a mixed-methods research design, combining both quantitative and qualitative data collection and analysis methods...',
  RESULTS: 'The quantitative analysis revealed a statistically significant relationship between AI diagnostic tool usage and improved clinical outcomes (F(2, 247) = 18.34, p < 0.001)...',
  DISCUSSION: 'The findings of this study contribute to the growing body of evidence supporting the potential of AI-driven diagnostics in improving healthcare outcomes in Sub-Saharan Africa...',
  CONCLUSION: 'This study provides empirical evidence that AI-driven health diagnostic tools can significantly improve clinical outcomes in Sub-Saharan African healthcare settings...',
  REFERENCES: '1. Okonkwo, A., & Mensah, P. (2024). AI-powered diagnostics in African healthcare. Journal of Digital Health, 12(3), 45-62.\n2. Ibrahim, K. et al. (2023). Machine learning applications in tropical medicine. Lancet Digital Health, 5(8), e512-e520.\n...(25+ references)',
};

const GeneratePaper = () => {
  const [selectedStandards, setSelectedStandards] = useState<string[]>(["APA 7th Edition", "IMRAD Structure", "25+ Citations"]);
  const [topic, setTopic] = useState("");
  const [paperType, setPaperType] = useState("");
  const [targetLength, setTargetLength] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [audience, setAudience] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const paperCredits = 20;

  const toggleStandard = (s: string) =>
    setSelectedStandards((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const handleGenerate = () => {
    if (paperCredits <= 0) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 3000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span>My Research</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Generate Paper</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Generate Research Paper</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create structured academic manuscripts aligned with global publishing standards.
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className="text-sm">
              <span className="text-muted-foreground">Paper Credits: </span>
              <span className="font-bold text-foreground">{paperCredits}</span>
            </div>
            <CreditsHowItWorksModal />
          </div>
        </div>

        {/* Standard Selection Badges */}
        <div className="flex flex-wrap gap-2">
          {standards.map((s) => (
            <button
              key={s}
              onClick={() => toggleStandard(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedStandards.includes(s)
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card text-muted-foreground border-border hover:border-accent/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Generation Form */}
        {!generated && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h2 className="text-base font-bold text-foreground">Research Configuration</h2>

            {/* Topic */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Research Topic</Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      <Lightbulb className="h-3 w-3" /> Get Ideas
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Topic Suggestions</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 mt-2">
                      {[
                        "The impact of AI-driven health diagnostics in Sub-Saharan Africa",
                        "Climate change effects on agricultural productivity in West Africa",
                        "Digital financial inclusion and economic growth in East Africa",
                        "The role of indigenous knowledge systems in sustainable development",
                      ].map((idea) => (
                        <button
                          key={idea}
                          onClick={() => { setTopic(idea); }}
                          className="block w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-secondary transition-colors border border-border"
                        >
                          {idea}
                        </button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. The effect of mindfulness-based interventions on cortisol levels in adults with chronic stress"
                className="min-h-[80px]"
              />
            </div>

            {/* Paper Type + Target Length */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Paper Type</Label>
                <Select value={paperType} onValueChange={setPaperType}>
                  <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                  <SelectContent>
                    {paperTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target Length</Label>
                <Select value={targetLength} onValueChange={setTargetLength}>
                  <SelectTrigger><SelectValue placeholder="Select length..." /></SelectTrigger>
                  <SelectContent>
                    {lengths.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Discipline + Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Academic Discipline <span className="text-muted-foreground">(optional)</span></Label>
                <Input
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  placeholder="e.g. Psychology, Public Health, Economics"
                />
              </div>
              <div className="space-y-2">
                <Label>Intended Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger><SelectValue placeholder="Select audience..." /></SelectTrigger>
                  <SelectContent>
                    {audiences.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generate */}
            <div className="pt-2">
              {paperCredits > 0 ? (
                <Button
                  variant="afrika"
                  size="xl"
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={generating || !topic}
                >
                  {generating ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                  ) : (
                    <>Generate Research Paper <ArrowRight className="h-4 w-4" /></>
                  )}
                </Button>
              ) : (
                <div className="text-center space-y-3 p-4 border border-destructive/30 rounded-xl bg-destructive/5">
                  <div className="flex items-center justify-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <p className="text-sm font-medium">No remaining Paper Credits</p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Link to="/publeesh/pricing"><Button variant="afrika" size="sm">Upgrade Plan</Button></Link>
                    <Link to="/publeesh/pricing"><Button variant="afrikaOutline" size="sm">Buy Credit Pack</Button></Link>
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground text-center mt-2">
                Generation takes 30–90 seconds · Consumes 1 Paper Credit
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {generated && (
          <>
            <div className="bg-afrika-green/10 border border-afrika-green/30 rounded-xl p-4 flex items-start gap-3">
              <Check className="h-5 w-5 text-afrika-green mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Academic paper generated and saved to your library.
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  References verified via CrossRef. Review before submission.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="afrika" size="sm" className="gap-1">
                <FileText className="h-4 w-4" /> View Generated Paper
              </Button>
              <Button variant="afrikaOutline" size="sm" className="gap-1">
                <Download className="h-4 w-4" /> Download Word
              </Button>
              <Link to="/dashboard/publishing/submit">
                <Button variant="afrikaOutline" size="sm" className="gap-1">
                  <Send className="h-4 w-4" /> Submit to Journal
                </Button>
              </Link>
            </div>

            {/* Applied tags */}
            <div className="flex flex-wrap gap-2">
              {selectedStandards.map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
              ))}
            </div>

            {/* Generated Paper */}
            <div className="bg-card rounded-xl border border-border">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Generated Paper</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-xs gap-1"><Download className="h-3 w-3" /> Word</Button>
                  <Button variant="ghost" size="sm" className="text-xs gap-1"><Download className="h-3 w-3" /> PDF</Button>
                  <Button variant="ghost" size="sm" className="text-xs gap-1"><Copy className="h-3 w-3" /> Citation</Button>
                </div>
              </div>
              <div className="p-6 space-y-2">
                {paperSections.map((section) => (
                  <Collapsible key={section} defaultOpen={["TITLE", "ABSTRACT"].includes(section)}>
                    <CollapsibleTrigger className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50 transition-colors text-left">
                      <span className="text-sm font-bold text-foreground">{section}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-3 pb-3">
                      <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                        {sampleContent[section] || "Content for this section has been generated and is available for review."}
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button variant="afrika" size="sm" className="gap-1">
                <Send className="h-4 w-4" /> Submit for Publication
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Save className="h-4 w-4" /> Save Draft
              </Button>
              <Button variant="outline" size="sm">Create New Version</Button>
              <Button variant="ghost" size="sm">Compare Versions</Button>
              <Button variant="ghost" size="sm">View Edit History</Button>
            </div>

            {/* Generate another */}
            <Button variant="outline" className="w-full" onClick={() => { setGenerated(false); setTopic(""); }}>
              Generate Another Paper
            </Button>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GeneratePaper;
