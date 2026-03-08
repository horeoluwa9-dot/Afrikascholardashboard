import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight, ArrowRight, ArrowLeft, FileText, BookOpen,
  ScrollText, GraduationCap, Presentation, Sparkles,
} from "lucide-react";
import { useAIPapers, PaperSetup } from "@/hooks/useAIPapers";

const RESEARCH_FIELDS = [
  "Public Health", "Economics", "Climate Policy", "Artificial Intelligence",
  "Education", "Political Science", "Environmental Science", "Sociology",
  "Engineering", "Law", "Agriculture", "Medicine",
];

const PAPER_TYPES = [
  { value: "research_paper", label: "Research Paper", icon: FileText, desc: "Original empirical research with methodology and findings" },
  { value: "literature_review", label: "Literature Review", icon: BookOpen, desc: "Comprehensive analysis of existing scholarly work" },
  { value: "policy_paper", label: "Policy Paper", icon: ScrollText, desc: "Evidence-based policy analysis and recommendations" },
  { value: "thesis_draft", label: "Thesis Draft", icon: GraduationCap, desc: "Structured thesis chapter or full draft" },
  { value: "conference_paper", label: "Conference Paper", icon: Presentation, desc: "Paper formatted for conference presentation" },
];

const JOURNALS = [
  "African Journal of Public Health",
  "African Energy Policy Review",
  "Journal of African Economics",
  "East African Medical Journal",
  "South African Journal of Science",
];

const ALL_SECTIONS = [
  "Abstract", "Introduction", "Literature Review", "Methodology",
  "Results", "Discussion", "Conclusion",
];

const CITATION_STYLES = ["APA", "MLA", "Chicago", "Harvard"];

const PaperSetupWizard = () => {
  const navigate = useNavigate();
  const { createPaper } = useAIPapers();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [researchField, setResearchField] = useState("");
  const [paperType, setPaperType] = useState("");
  const [targetJournal, setTargetJournal] = useState("");
  const [citationStyle, setCitationStyle] = useState("APA");
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "Abstract", "Introduction", "Literature Review", "Methodology", "Results", "Discussion", "Conclusion",
  ]);

  const toggleSection = (s: string) =>
    setSelectedSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const canProceed = () => {
    if (step === 1) return title.trim().length > 0 && researchField.length > 0;
    if (step === 2) return paperType.length > 0;
    if (step === 3) return true;
    if (step === 4) return selectedSections.length > 0;
    return false;
  };

  const handleCreate = async () => {
    const setup: PaperSetup = {
      title, research_field: researchField, paper_type: paperType,
      target_journal: targetJournal || undefined,
      citation_style: citationStyle,
      sections: selectedSections,
    };
    try {
      const result = await createPaper.mutateAsync(setup);
      navigate(`/dashboard/ai-papers/workspace/${result.id}`);
    } catch { /* error handled in hook */ }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/ai-papers" className="hover:text-foreground">AI Paper Generator</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">New Paper</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Start a New Research Paper</h1>
          <p className="text-sm text-muted-foreground mt-1">Set up your paper structure before the AI assists your writing.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                s === step ? "bg-accent text-accent-foreground" :
                s < step ? "bg-afrika-green text-white" : "bg-secondary text-muted-foreground"
              }`}>{s}</div>
              {s < 4 && <div className={`w-8 h-0.5 ${s < step ? "bg-afrika-green" : "bg-border"}`} />}
            </div>
          ))}
          <span className="text-xs text-muted-foreground ml-2">
            {step === 1 && "Research Topic"}
            {step === 2 && "Paper Type"}
            {step === 3 && "Target Journal"}
            {step === 4 && "Paper Structure"}
          </span>
        </div>

        {/* Step Content */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-5">
          {step === 1 && (
            <>
              <h2 className="text-base font-bold text-foreground">Step 1 — Research Topic</h2>
              <div className="space-y-2">
                <Label>Paper Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. AI-Assisted Epidemiological Modeling in Sub-Saharan Africa" />
              </div>
              <div className="space-y-2">
                <Label>Research Field</Label>
                <Select value={researchField} onValueChange={setResearchField}>
                  <SelectTrigger><SelectValue placeholder="Select field..." /></SelectTrigger>
                  <SelectContent>
                    {RESEARCH_FIELDS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-base font-bold text-foreground">Step 2 — Paper Type</h2>
              <div className="grid gap-3">
                {PAPER_TYPES.map(t => (
                  <button key={t.value} onClick={() => setPaperType(t.value)}
                    className={`flex items-start gap-3 p-4 rounded-lg border text-left transition-all ${
                      paperType === t.value
                        ? "border-accent bg-accent/5 ring-1 ring-accent"
                        : "border-border hover:border-accent/40"
                    }`}>
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                      paperType === t.value ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                    }`}>
                      <t.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-base font-bold text-foreground">Step 3 — Target Journal <span className="text-muted-foreground font-normal">(Optional)</span></h2>
              <p className="text-sm text-muted-foreground">Selecting a journal helps the AI adapt writing style to journal requirements.</p>
              <Select value={targetJournal} onValueChange={setTargetJournal}>
                <SelectTrigger><SelectValue placeholder="Select journal (optional)..." /></SelectTrigger>
                <SelectContent>
                  {JOURNALS.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="space-y-2">
                <Label>Citation Style</Label>
                <div className="flex flex-wrap gap-2">
                  {CITATION_STYLES.map(s => (
                    <button key={s} onClick={() => setCitationStyle(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        citationStyle === s
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-card text-muted-foreground border-border hover:border-accent/50"
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-base font-bold text-foreground">Step 4 — Paper Structure</h2>
              <p className="text-sm text-muted-foreground">Select which sections to include in your paper.</p>
              <div className="grid gap-2">
                {ALL_SECTIONS.map(s => (
                  <label key={s} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors">
                    <Checkbox checked={selectedSections.includes(s)} onCheckedChange={() => toggleSection(s)} />
                    <span className="text-sm font-medium text-foreground">{s}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 1} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {step < 4 ? (
            <Button variant="afrika" onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="gap-1">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="afrika" onClick={handleCreate} disabled={!canProceed() || createPaper.isPending} className="gap-1">
              <Sparkles className="h-4 w-4" /> Create Paper Workspace
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaperSetupWizard;
