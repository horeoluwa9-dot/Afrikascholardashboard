import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Lightbulb, CheckSquare, BarChart3, BookOpen, Bot, Search, Save, Check, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const tips = [
  { id: 1, title: "Effect sizes matter more than p-values", content: "p < .05 only tells you something happened. Effect sizes (Cohen's d, η²) tell you HOW MUCH. A d = 0.2 is small, d = 0.5 medium, d > 0.8 large. Journals like Nature and NEJM now require effect sizes on every claim.", saved: false },
  { id: 2, title: "Sharpen your research question", content: "Every strong paper answers a draft, precise question. Broad topics like 'mental health' become 3-week MBSR reduce cortisol in adults with GADI. Specificity etc.", saved: false },
  { id: 3, title: "Always state your hypotheses formally", content: "Every hypothesis needs a null (H0) and alternative (H1) form: H₀: μ₁ = μ₂; H₁: μ₁ ≠ μ₂ (two-tailed). This discipline forces clarity and rigor.", saved: false },
  { id: 4, title: "Use Boolean operators in your literature search", content: 'Published? PsycINFO (mindfulness OR MBSR) AND (cortisol OR HPA AND anxiety). NOT children. This 3-step Boolean search finds targeted literature faster.', saved: false },
  { id: 5, title: "Write your Methods section so replication is possible", content: "Would a stranger with your training be able to run your study exactly? Include: inclusion/exclusion criteria, all instruments (Cronbach α), software version, a.", saved: false },
  { id: 6, title: "Report confidence intervals alongside every statistic", content: "A CI tells readers where the true value likely lies. CI (3.6, 6.8) is far more informative than 'p < .05 alone. APA 7th requires CIs. Top journals reject work without them.", saved: false },
];

const checklist = [
  { id: 1, text: "Research question is specific and testable", done: false },
  { id: 2, text: "Hypotheses are formally stated (H₀ and H₁)", done: false },
  { id: 3, text: "Literature review covers at least 25 sources", done: false },
  { id: 4, text: "Methodology section is replicable", done: false },
  { id: 5, text: "Statistical tests match research design", done: false },
  { id: 6, text: "Effect sizes are reported", done: false },
  { id: 7, text: "Confidence intervals are included", done: false },
  { id: 8, text: "Limitations are honestly discussed", done: false },
  { id: 9, text: "Citations follow APA 7th format", done: false },
  { id: 10, text: "Abstract follows structured format", done: false },
];

const statsTests = [
  { name: "Independent T-Test", when: "Comparing 2 group means", type: "Parametric" },
  { name: "Paired T-Test", when: "Comparing same group at 2 time points", type: "Parametric" },
  { name: "One-Way ANOVA", when: "Comparing 3+ group means", type: "Parametric" },
  { name: "Chi-Square Test", when: "Comparing categorical frequencies", type: "Non-parametric" },
  { name: "Pearson Correlation", when: "Measuring linear relationship between 2 continuous variables", type: "Parametric" },
  { name: "Mann-Whitney U", when: "Comparing 2 groups (non-normal data)", type: "Non-parametric" },
  { name: "Linear Regression", when: "Predicting outcome from predictor(s)", type: "Parametric" },
  { name: "Logistic Regression", when: "Predicting binary outcome", type: "Parametric" },
];

const glossary = [
  { term: "P-value", definition: "The probability of observing data as extreme as the current results, assuming the null hypothesis is true." },
  { term: "Effect Size", definition: "A quantitative measure of the magnitude of a phenomenon. Common measures: Cohen's d, η², r²." },
  { term: "Confidence Interval", definition: "A range of values within which the true population parameter likely falls, typically at 95% confidence." },
  { term: "Type I Error", definition: "Rejecting a true null hypothesis (false positive). Controlled by alpha level (usually 0.05)." },
  { term: "Type II Error", definition: "Failing to reject a false null hypothesis (false negative). Related to statistical power." },
  { term: "Statistical Power", definition: "The probability of correctly rejecting a false null hypothesis. Recommended minimum: 0.80." },
  { term: "IMRAD", definition: "Standard academic paper structure: Introduction, Methods, Results, And Discussion." },
  { term: "Cronbach's Alpha", definition: "A measure of internal consistency reliability for survey scales. Acceptable: α ≥ 0.70." },
];

const tools = [
  { name: "Generate Paper", desc: "AI-powered paper generator", link: "/dashboard/generate-paper" },
  { name: "Dataset Explorer", desc: "Generate structured datasets", link: "/dashboard/data/explorer" },
  { name: "Dataset Analyzer", desc: "Statistical analysis tools", link: "/dashboard/data/analyzer" },
  { name: "Instrument Studio", desc: "Build research instruments", link: "/dashboard/instrument-studio" },
  { name: "Intelligence Hub", desc: "Journal & conference recommendations", link: "/dashboard/intelligence" },
];

const ProTip = () => {
  const [savedTips, setSavedTips] = useState<number[]>([]);
  const [checklistState, setChecklistState] = useState(checklist);
  const [searchTerm, setSearchTerm] = useState("");
  const [mentorQuestion, setMentorQuestion] = useState("");
  const [mentorResponse, setMentorResponse] = useState("");
  const { toast } = useToast();

  const saveTip = (id: number) => {
    setSavedTips((prev) => prev.includes(id) ? prev : [...prev, id]);
    toast({ title: "Tip saved", description: "Added to your saved tips." });
  };

  const toggleChecklist = (id: number) => {
    setChecklistState((prev) => prev.map((item) => item.id === id ? { ...item, done: !item.done } : item));
  };

  const askMentor = () => {
    if (!mentorQuestion.trim()) return;
    setMentorResponse("Great question! When structuring your methodology section, ensure you include: (1) Research design justification, (2) Sampling strategy with power analysis, (3) Data collection instruments with reliability metrics (Cronbach's α), (4) Analysis plan with specific statistical tests, and (5) Ethical considerations. This framework ensures replicability and rigor.");
    toast({ title: "AI Mentor responded", description: "See the answer below." });
  };

  const filteredGlossary = glossary.filter((g) => g.term.toLowerCase().includes(searchTerm.toLowerCase()) || g.definition.toLowerCase().includes(searchTerm.toLowerCase()));

  const completedCount = checklistState.filter((c) => c.done).length;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span>My Research</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Pro Tip</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Research Pro Tip</h1>
          <p className="text-sm text-muted-foreground mt-1">Sharpen your methodology, writing precision, and statistical rigor.</p>
        </div>

        <Tabs defaultValue="daily-tip">
          <TabsList className="bg-secondary flex-wrap">
            <TabsTrigger value="daily-tip" className="gap-1"><Lightbulb className="h-3 w-3" /> Daily Tip</TabsTrigger>
            <TabsTrigger value="checklist" className="gap-1"><CheckSquare className="h-3 w-3" /> Quality Checklist</TabsTrigger>
            <TabsTrigger value="stats" className="gap-1"><BarChart3 className="h-3 w-3" /> Stats Selector</TabsTrigger>
            <TabsTrigger value="reference" className="gap-1"><BookOpen className="h-3 w-3" /> App Reference</TabsTrigger>
            <TabsTrigger value="mentor" className="gap-1"><Bot className="h-3 w-3" /> AI Mentor</TabsTrigger>
            <TabsTrigger value="glossary" className="gap-1"><Search className="h-3 w-3" /> Glossary</TabsTrigger>
          </TabsList>

          {/* Daily Tip */}
          <TabsContent value="daily-tip" className="space-y-4 mt-4">
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
              <Badge className="bg-accent text-accent-foreground text-[10px] mb-2">TODAY'S TIP — {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}</Badge>
              <h3 className="text-base font-bold text-foreground mt-1">💡 {tips[0].title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{tips[0].content}</p>
              <Button variant="afrika" size="sm" className="mt-3 gap-1" onClick={() => saveTip(tips[0].id)}>
                {savedTips.includes(tips[0].id) ? <><Check className="h-3 w-3" /> Saved</> : <><Save className="h-3 w-3" /> Save Tip</>}
              </Button>
            </div>
            <h3 className="text-base font-bold text-foreground">📚 Tip Library</h3>
            <div className="space-y-3">
              {tips.map((tip) => (
                <div key={tip.id} className="bg-card rounded-xl border border-border p-4 space-y-2">
                  <h4 className="text-sm font-bold text-foreground">💡 {tip.title}</h4>
                  <p className="text-xs text-muted-foreground">{tip.content}</p>
                  <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => saveTip(tip.id)}>
                    {savedTips.includes(tip.id) ? <><Check className="h-3 w-3" /> Saved</> : <><Save className="h-3 w-3" /> Save</>}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Quality Checklist */}
          <TabsContent value="checklist" className="space-y-4 mt-4">
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">Research Quality Checklist</h3>
                <Badge variant="secondary" className="text-[10px]">{completedCount}/{checklistState.length} complete</Badge>
              </div>
              <div className="h-2 bg-secondary rounded-full">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(completedCount / checklistState.length) * 100}%` }} />
              </div>
              <div className="space-y-2">
                {checklistState.map((item) => (
                  <button key={item.id} className="flex items-center gap-3 w-full text-left py-2 px-3 rounded-lg hover:bg-secondary/50 transition-colors" onClick={() => toggleChecklist(item.id)}>
                    <div className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${item.done ? "bg-accent border-accent" : "border-border"}`}>
                      {item.done && <Check className="h-3 w-3 text-accent-foreground" />}
                    </div>
                    <span className={`text-sm ${item.done ? "text-muted-foreground line-through" : "text-foreground"}`}>{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Stats Selector */}
          <TabsContent value="stats" className="space-y-4 mt-4">
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h3 className="text-base font-bold text-foreground">Statistical Test Selector</h3>
              <p className="text-xs text-muted-foreground">Choose the right test for your research design.</p>
              <div className="space-y-3">
                {statsTests.map((test) => (
                  <div key={test.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{test.name}</p>
                      <p className="text-xs text-muted-foreground">{test.when}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{test.type}</Badge>
                      <Link to="/dashboard/data/analyzer">
                        <Button variant="ghost" size="sm" className="text-xs gap-1"><ArrowRight className="h-3 w-3" /> Run Test</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* App Reference */}
          <TabsContent value="reference" className="space-y-4 mt-4">
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h3 className="text-base font-bold text-foreground">Platform Tools Reference</h3>
              <p className="text-xs text-muted-foreground">Quick access to all research tools in your workspace.</p>
              <div className="space-y-3">
                {tools.map((tool) => (
                  <Link key={tool.name} to={tool.link} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">{tool.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-accent" />
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* AI Mentor */}
          <TabsContent value="mentor" className="space-y-4 mt-4">
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h3 className="text-base font-bold text-foreground">🤖 AI Research Mentor</h3>
              <p className="text-xs text-muted-foreground">Ask questions about methodology, statistics, academic writing, or research design.</p>
              <Textarea value={mentorQuestion} onChange={(e) => setMentorQuestion(e.target.value)} placeholder="e.g. How should I structure my methodology section for a mixed-methods study?" className="min-h-[80px]" />
              <Button variant="afrika" size="sm" className="gap-1" onClick={askMentor} disabled={!mentorQuestion.trim()}>
                <Bot className="h-3 w-3" /> Ask Question
              </Button>
              {mentorResponse && (
                <div className="bg-secondary rounded-lg p-4 mt-3">
                  <p className="text-xs font-semibold text-accent mb-1">AI Mentor Response:</p>
                  <p className="text-sm text-foreground leading-relaxed">{mentorResponse}</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Glossary */}
          <TabsContent value="glossary" className="space-y-4 mt-4">
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h3 className="text-base font-bold text-foreground">📖 Research Glossary</h3>
              <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search terms..." className="max-w-sm" />
              <div className="space-y-3">
                {filteredGlossary.map((g) => (
                  <div key={g.term} className="py-2 border-b border-border last:border-0">
                    <p className="text-sm font-bold text-foreground">{g.term}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{g.definition}</p>
                  </div>
                ))}
                {filteredGlossary.length === 0 && <p className="text-xs text-muted-foreground">No matching terms found.</p>}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProTip;
