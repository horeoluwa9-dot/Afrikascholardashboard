import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CreditsHowItWorksModal } from "@/components/dashboard/CreditsModal";
import {
  ChevronRight,
  ArrowRight,
  Loader2,
  Upload,
  FileSpreadsheet,
  Download,
  Copy,
  BarChart3,
  AlertTriangle,
  Check,
  Lightbulb,
} from "lucide-react";

const analysisTypes = ["Descriptive", "Correlation", "Regression", "ANOVA", "T-Test", "Hypothesis Test"];

const steps = [
  { step: "STEP 1", icon: "📊", title: "Upload Dataset", desc: "CSV or XLSX up to 500 rows × 20 columns, 2 MB max" },
  { step: "STEP 2", icon: "✨", title: "Auto-Cleaning", desc: "Missing values filled, duplicates removed, columns standardised" },
  { step: "STEP 3", icon: "📈", title: "Analyse", desc: "Correlation, ANOVA, regression, t-tests, chi-square & more" },
];

const DatasetAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [analysisType, setAnalysisType] = useState("Descriptive");
  const [prompt, setPrompt] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const analysisCredits = 25;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); }
  };

  const handleUpload = () => {
    if (file) setUploaded(true);
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setAnalysisComplete(true); }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Data & Analysis</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Dataset Analyzer</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dataset Analyzer</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Upload CSV or XLSX → Auto-clean → Run SPSS-style analyses with plain-English prompts.
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className="text-sm">
              <span className="text-muted-foreground">Analysis Credits: </span>
              <span className="font-bold text-foreground">{analysisCredits}</span>
            </div>
            <CreditsHowItWorksModal />
          </div>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((s) => (
            <div key={s.step} className="bg-card rounded-xl border border-border p-5">
              <p className="text-[10px] text-muted-foreground font-medium uppercase">{s.step}</p>
              <p className="text-sm font-bold text-foreground mt-1">{s.icon} {s.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Upload Section */}
        {!uploaded && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <h2 className="text-base font-bold text-foreground">📂 Upload Your Dataset</h2>
            <div
              className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-accent/50 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground/50" />
              <p className="text-sm font-semibold text-foreground mt-3">Drop your file here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">Supports CSV and XLSX files</p>
              <div className="flex gap-2 justify-center mt-3">
                {["Max 500 rows", "Max 20 columns", "Max 2 MB", "CSV & XLSX"].map((b) => (
                  <Badge key={b} variant="secondary" className="text-[10px]">{b}</Badge>
                ))}
              </div>
              <input ref={fileRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileChange} />
            </div>
            {file && <p className="text-sm text-foreground">Selected: <span className="font-medium">{file.name}</span></p>}
            <Button variant="afrika" size="xl" className="w-full" disabled={!file} onClick={handleUpload}>
              <Upload className="h-4 w-4" /> Upload & Clean Dataset
            </Button>
            <p className="text-xs text-muted-foreground text-center">Your file is processed server-side and never stored permanently.</p>
          </div>
        )}

        {/* Tips */}
        {!uploaded && (
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="text-sm font-bold text-foreground flex items-center gap-2"><Lightbulb className="h-4 w-4 text-accent" /> Tips for Best Results</p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc pl-5">
              <li>First row should be <strong>column headers</strong></li>
              <li>Numerical columns should contain only numbers (units in the header, e.g. age_years)</li>
              <li>Categorical columns can be text (e.g. gender, treatment_group)</li>
              <li>Missing values (blank cells) are automatically filled — numeric = column mean, text = 'Unknown'</li>
              <li>Duplicate rows are automatically removed</li>
            </ul>
          </div>
        )}

        {/* Post-upload: Analysis */}
        {uploaded && (
          <>
            <div className="bg-afrika-green/10 border border-afrika-green/30 rounded-xl p-4 flex items-center gap-3">
              <Check className="h-5 w-5 text-afrika-green" />
              <p className="text-sm font-semibold text-foreground">Dataset uploaded and cleaned. Ready for analysis.</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-5">
              <h2 className="text-base font-bold text-foreground">Statistical Analysis & Interpretation</h2>
              <div>
                <Label className="mb-2 block">Analysis Type</Label>
                <div className="flex flex-wrap gap-2">
                  {analysisTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setAnalysisType(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        analysisType === t
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-card text-muted-foreground border-border hover:border-accent/50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Analysis Prompt</Label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Is there a significant difference in anxiety scores between treatment and control groups?"
                  className="min-h-[80px]"
                />
              </div>
              {analysisCredits > 0 ? (
                <Button variant="afrika" size="xl" className="w-full" onClick={handleAnalyze} disabled={analyzing}>
                  {analyzing ? <><Loader2 className="h-4 w-4 animate-spin" /> Running Analysis...</> : <>Run Analysis <ArrowRight className="h-4 w-4" /></>}
                </Button>
              ) : (
                <div className="text-center space-y-3 p-4 border border-destructive/30 rounded-xl bg-destructive/5">
                  <div className="flex items-center justify-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <p className="text-sm font-medium">No remaining Analysis Credits</p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Link to="/publeesh/pricing"><Button variant="afrika" size="sm">Upgrade Plan</Button></Link>
                    <Link to="/publeesh/pricing"><Button variant="afrikaOutline" size="sm">Buy Credit Pack</Button></Link>
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground text-center">Consumes 1 Analysis Credit</p>
            </div>

            {analysisComplete && (
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h3 className="text-base font-bold text-foreground">Analysis Results</h3>
                <div className="bg-secondary/50 rounded-lg p-4 text-sm text-foreground space-y-2">
                  <p><strong>Key Findings:</strong> Significant differences found across groups (F(2, 497) = 14.23, p &lt; 0.001).</p>
                  <p><strong>P-value:</strong> p &lt; 0.001</p>
                  <p><strong>Confidence Interval:</strong> 95% CI [0.34, 0.67]</p>
                  <p><strong>Effect Size:</strong> Medium (η² = 0.054)</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="gap-1"><Download className="h-4 w-4" /> Results PDF</Button>
                  <Button variant="outline" size="sm" className="gap-1"><Download className="h-4 w-4" /> CSV</Button>
                  <Button variant="outline" size="sm" className="gap-1"><Copy className="h-4 w-4" /> Copy Summary</Button>
                </div>
                <Link to="/dashboard/generate-paper">
                  <Button variant="afrikaOutline" size="sm" className="gap-1 mt-2">
                    Generate Research Paper from This Analysis <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}

        {/* Bottom nav */}
        <div className="flex gap-3 pt-4">
          <Link to="/dashboard"><Button variant="outline" size="sm">← Dashboard</Button></Link>
          <Link to="/dashboard/data/explorer"><Button variant="afrikaOutline" size="sm">Dataset Explorer</Button></Link>
          <Link to="/dashboard/generate-paper"><Button variant="afrikaOutline" size="sm">Generate Paper</Button></Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DatasetAnalyzer;
