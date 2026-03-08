import { useState, useEffect } from "react";
import { useModuleUnlocksContext } from "@/contexts/ModuleUnlocksContext";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CreditsHowItWorksModal } from "@/components/dashboard/CreditsModal";
import {
  ChevronRight, ArrowRight, Loader2, Check, Download, Copy,
  BarChart3, Eye, Database, AlertTriangle,
} from "lucide-react";

const sampleSuggestions = ["Survey dataset", "Institutional performance dataset", "Panel dataset", "Time-series dataset", "Experimental dataset"];
const analysisTypes = ["Descriptive", "Correlation", "Regression", "ANOVA", "T-Test", "Hypothesis Test"];

const sampleData = [
  { id: 1, age: 22, gender: "Female", income: 45000, family_size: 4, gpa: 3.5, hours_study: 15, extracurriculars: "Yes", school_type: "Public" },
  { id: 2, age: 24, gender: "Male", income: 62000, family_size: 3, gpa: 3.8, hours_study: 20, extracurriculars: "No", school_type: "Private" },
  { id: 3, age: 19, gender: "Female", income: 38000, family_size: 5, gpa: 3.2, hours_study: 12, extracurriculars: "Yes", school_type: "Public" },
  { id: 4, age: 21, gender: "Male", income: 55000, family_size: 2, gpa: 3.6, hours_study: 18, extracurriculars: "Yes", school_type: "Private" },
  { id: 5, age: 23, gender: "Female", income: 41000, family_size: 6, gpa: 2.9, hours_study: 10, extracurriculars: "No", school_type: "Public" },
];

const summaryStats = [
  { label: "Mean Age", value: "21.8" },
  { label: "Mean GPA", value: "3.4" },
  { label: "Std Dev Income", value: "9,874" },
  { label: "Sample Size", value: "500" },
  { label: "Missing Values", value: "0" },
  { label: "Correlation (GPA~Hours)", value: "0.72" },
];

const DatasetExplorer = () => {
  const { unlockModule } = useModuleUnlocksContext();
  useEffect(() => { unlockModule("publeesh_ai"); }, [unlockModule]);
  const [description, setDescription] = useState("");
  const [sampleSize, setSampleSize] = useState("");
  const [generating, setGenerating] = useState(false);
  const [dataGenerated, setDataGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");
  const [analysisType, setAnalysisType] = useState("Descriptive");
  const [analysisPrompt, setAnalysisPrompt] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const datasetCredits = 25;
  const analysisCredits = 25;

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDataGenerated(true);
      setActiveTab("view");
    }, 2000);
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisComplete(true);
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Data & Analysis</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Dataset Explorer</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dataset Explorer</h1>
            <p className="text-sm text-muted-foreground mt-1">Generate realistic academic datasets, preview structure, and export for analysis.</p>
          </div>
          <div className="text-right space-y-1">
            <div className="text-sm">
              <span className="text-muted-foreground">Dataset Credits: </span>
              <span className="font-bold text-foreground">{datasetCredits}</span>
            </div>
            <CreditsHowItWorksModal />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate" className="gap-1"><Database className="h-3 w-3" /> Generate Dataset</TabsTrigger>
            <TabsTrigger value="view" className="gap-1" disabled={!dataGenerated}><Eye className="h-3 w-3" /> View Data</TabsTrigger>
            <TabsTrigger value="analyze" className="gap-1" disabled={!dataGenerated}><BarChart3 className="h-3 w-3" /> Analyze</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-5">
            <div className="bg-card rounded-xl border border-border p-6 space-y-5">
              <h2 className="text-base font-bold text-foreground">Describe the Dataset You Need</h2>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Student academic performance and socioeconomic factors across Nigerian universities" className="min-h-[100px]" />
              <div className="flex flex-wrap gap-2">
                {sampleSuggestions.map((s) => (
                  <button key={s} onClick={() => setDescription(s)} className="px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card text-muted-foreground hover:border-accent/50 transition-colors">{s}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Sample Size</Label>
                  <Select value={sampleSize} onValueChange={setSampleSize}>
                    <SelectTrigger><SelectValue placeholder="Select size..." /></SelectTrigger>
                    <SelectContent>
                      {["100", "500", "1,000", "5,000"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Noise Level</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Moderate" /></SelectTrigger>
                    <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="moderate">Moderate</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <Select><SelectTrigger><SelectValue placeholder="CSV" /></SelectTrigger>
                    <SelectContent><SelectItem value="csv">CSV</SelectItem><SelectItem value="excel">Excel</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>

              {datasetCredits > 0 ? (
                <Button variant="afrika" size="lg" className="w-full" onClick={handleGenerate} disabled={generating || !description}>
                  {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <>Generate Dataset <ArrowRight className="h-4 w-4" /></>}
                </Button>
              ) : (
                <div className="text-center space-y-3 p-4 border border-destructive/30 rounded-xl bg-destructive/5">
                  <div className="flex items-center justify-center gap-2 text-destructive"><AlertTriangle className="h-4 w-4" /><p className="text-sm font-medium">No remaining Dataset Credits</p></div>
                  <div className="flex gap-3 justify-center">
                    <Link to="/dashboard/billing"><Button variant="afrika" size="sm">Upgrade Plan</Button></Link>
                    <Link to="/dashboard/billing"><Button variant="outline" size="sm">Buy Credit Pack</Button></Link>
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground text-center">Consumes 1 Dataset Credit · Estimated time: 5–20 seconds</p>
            </div>

            {dataGenerated && (
              <div className="bg-afrika-green/10 border border-afrika-green/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3"><Check className="h-5 w-5 text-afrika-green" /><p className="text-sm font-semibold text-foreground">Dataset generated successfully!</p></div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("view")}>View Table</Button>
                  <Button variant="afrikaOutline" size="sm" onClick={() => setActiveTab("analyze")}>Analyze Now</Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="view" className="space-y-5">
            <div className="bg-card rounded-xl border border-border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    {Object.keys(sampleData[0]).map((key) => (
                      <th key={key} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleData.map((row) => (
                    <tr key={row.id} className="border-b border-border hover:bg-secondary/30">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="px-4 py-2.5 text-foreground">{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-3">
              <Button variant="afrika" size="sm" className="gap-1"><Download className="h-4 w-4" /> Download CSV</Button>
              <Button variant="outline" size="sm" className="gap-1"><Copy className="h-4 w-4" /> Copy to Clipboard</Button>
              <Link to="/dashboard/data/analyzer">
                <Button variant="afrikaOutline" size="sm" className="gap-1"><BarChart3 className="h-4 w-4" /> Analyze Dataset</Button>
              </Link>
            </div>

            <div>
              <h3 className="text-base font-bold text-foreground mb-3">Column Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {summaryStats.map((s) => (
                  <div key={s.label} className="bg-card rounded-lg border border-border p-4 text-center">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-lg font-bold text-foreground mt-1">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analyze" className="space-y-5">
            <div className="bg-card rounded-xl border border-border p-6 space-y-5">
              <h2 className="text-base font-bold text-foreground">Statistical Analysis & Interpretation</h2>
              <div>
                <Label className="mb-2 block">Analysis Type</Label>
                <div className="flex flex-wrap gap-2">
                  {analysisTypes.map((t) => (
                    <button key={t} onClick={() => setAnalysisType(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${analysisType === t ? "bg-accent text-accent-foreground border-accent" : "bg-card text-muted-foreground border-border hover:border-accent/50"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Analysis Prompt</Label>
                <Textarea value={analysisPrompt} onChange={(e) => setAnalysisPrompt(e.target.value)} placeholder="e.g. Is there a significant difference in anxiety scores between treatment and control groups?" className="min-h-[80px]" />
              </div>
              {analysisCredits > 0 ? (
                <Button variant="afrika" size="lg" className="w-full" onClick={handleAnalyze} disabled={analyzing}>
                  {analyzing ? <><Loader2 className="h-4 w-4 animate-spin" /> Running Analysis...</> : <>Run Analysis <ArrowRight className="h-4 w-4" /></>}
                </Button>
              ) : (
                <div className="text-center space-y-3 p-4 border border-destructive/30 rounded-xl bg-destructive/5">
                  <div className="flex items-center justify-center gap-2 text-destructive"><AlertTriangle className="h-4 w-4" /><p className="text-sm font-medium">No remaining Analysis Credits</p></div>
                  <div className="flex gap-3 justify-center">
                    <Link to="/dashboard/billing"><Button variant="afrika" size="sm">Upgrade Plan</Button></Link>
                    <Link to="/dashboard/billing"><Button variant="outline" size="sm">Buy Credit Pack</Button></Link>
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground text-center">Consumes 1 Analysis Credit</p>
            </div>

            {analysisComplete && (
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h3 className="text-base font-bold text-foreground">Analysis Results</h3>
                <div className="bg-secondary/50 rounded-lg p-4 text-sm text-foreground space-y-2">
                  <p><strong>Key Findings:</strong> A statistically significant positive correlation was found between study hours and GPA (r = 0.72, p &lt; 0.001).</p>
                  <p><strong>P-value:</strong> p &lt; 0.001</p>
                  <p><strong>Confidence Interval:</strong> 95% CI [0.58, 0.82]</p>
                  <p><strong>Effect Size:</strong> Large (Cohen's d = 0.85)</p>
                  <p><strong>Model Summary:</strong> R² = 0.52, indicating that study hours explain approximately 52% of the variance in GPA.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="gap-1"><Download className="h-4 w-4" /> Results PDF</Button>
                  <Button variant="outline" size="sm" className="gap-1"><Download className="h-4 w-4" /> CSV</Button>
                  <Button variant="outline" size="sm" className="gap-1"><Copy className="h-4 w-4" /> Copy Summary</Button>
                </div>
                <Link to="/dashboard/generate-paper">
                  <Button variant="afrikaOutline" size="sm" className="gap-1 mt-2">Generate Research Paper from Analysis <ArrowRight className="h-4 w-4" /></Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-4">
          <Link to="/dashboard"><Button variant="outline" size="sm">← Back to Dashboard</Button></Link>
          <Link to="/dashboard/generate-paper"><Button variant="afrikaOutline" size="sm">Generate Paper</Button></Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DatasetExplorer;
