import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
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
  BarChart3, Share2, ArrowRight, FileText, Edit, CheckCircle2, Play,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer, Legend, ScatterChart, Scatter, ZAxis } from "recharts";

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

const demoTitle = "R&D Capacity, Funding Structure, Innovation Output, and Institutional Constraints in Nigerian R&D Companies";
const demoType = "Survey / Questionnaire Interface";
const demoPrompt = "A comprehensive survey instrument examining R&D capacity, funding structures, innovation output metrics, and institutional constraints faced by Nigerian R&D companies. Covers operational capacity, funding models, innovation performance indicators, and policy barriers.";

const sampleInstruments = [
  { id: 1, title: "Student Learning Assessment Survey", type: "📋 Survey", responses: 142, completion: 87, status: "Published", link: "https://afrikascholar.com/i/abc123" },
  { id: 2, title: "Research Impact Likert Scale", type: "📊 Analytical Tool", responses: 56, completion: 92, status: "Draft", link: "" },
  { id: 3, title: "Funding Regression Dashboard", type: "📈 Dashboard", responses: 0, completion: 0, status: "Published", link: "https://afrikascholar.com/i/def456" },
];

/* ─── Type-specific preview and analytics data ─── */
const surveySections = [
  { name: "Introduction", fields: ["Respondent ID", "Organization Name", "Organization Type", "Year Established"] },
  { name: "Operational Capacity", fields: ["Total R&D Staff", "Annual R&D Budget (₦)", "Equipment Adequacy (1-5)", "Lab Facilities Rating"] },
  { name: "Funding Models", fields: ["Primary Funding Source", "Secondary Sources (multi-select)", "Funding Stability (1-5)", "Grant Success Rate %"] },
  { name: "Innovation Performance", fields: ["Patents Filed (last 3 yrs)", "Publications (last 3 yrs)", "Products Developed", "Revenue from Innovation (₦)"] },
  { name: "Institutional Constraints", fields: ["Top 3 Constraints (ranked)", "Policy Barrier Description", "Suggested Reforms", "Overall Satisfaction (1-10)"] },
];

const responsePieData = [
  { name: "Completed", value: 68, color: "hsl(25, 90%, 52%)" },
  { name: "Partial", value: 22, color: "hsl(235, 60%, 18%)" },
  { name: "Abandoned", value: 10, color: "hsl(230, 20%, 90%)" },
];
const fundingBarData = [
  { model: "Government", count: 42 },
  { model: "Private", count: 28 },
  { model: "International", count: 18 },
  { model: "Mixed", count: 12 },
];
const innovationLineData = [
  { month: "Jan", patents: 3, papers: 8, products: 1 },
  { month: "Feb", patents: 5, papers: 12, products: 2 },
  { month: "Mar", patents: 4, papers: 15, products: 3 },
  { month: "Apr", patents: 7, papers: 11, products: 2 },
  { month: "May", patents: 6, papers: 18, products: 4 },
  { month: "Jun", patents: 8, papers: 22, products: 5 },
];
const constraintData = [
  { constraint: "Funding gaps", freq: 78 },
  { constraint: "Skill shortage", freq: 62 },
  { constraint: "Policy barriers", freq: 55 },
  { constraint: "Infrastructure", freq: 48 },
  { constraint: "Bureaucracy", freq: 41 },
];
const scatterData = [
  { x: 20, y: 3.2, z: 100 }, { x: 45, y: 4.1, z: 200 }, { x: 30, y: 3.8, z: 150 },
  { x: 60, y: 4.5, z: 300 }, { x: 15, y: 2.9, z: 80 }, { x: 50, y: 4.3, z: 250 },
];

function getTypeMetrics(type: string) {
  switch (type) {
    case "Survey / Questionnaire Interface":
      return [
        { label: "Total Responses", value: "98" },
        { label: "Completion Rate", value: "68%" },
        { label: "Avg Response Time", value: "4.2m" },
        { label: "Total Views", value: "247" },
      ];
    case "Analytical Tool":
      return [
        { label: "Usage Count", value: "156" },
        { label: "Analyses Run", value: "89" },
        { label: "Avg Output", value: "3.7" },
        { label: "User Interactions", value: "312" },
      ];
    case "Data Visualisation Dashboard":
      return [
        { label: "Dataset Size", value: "5,000" },
        { label: "Visualizations", value: "12" },
        { label: "Most Viewed", value: "Bar Chart" },
        { label: "Filters Applied", value: "34" },
      ];
    case "Experimental Interface":
      return [
        { label: "Trial Runs", value: "45" },
        { label: "Success Rate", value: "72%" },
        { label: "Avg Duration", value: "8.3m" },
        { label: "Outcomes Logged", value: "128" },
      ];
    case "Statistical Calculator":
      return [
        { label: "Calculations Run", value: "234" },
        { label: "Most Used Test", value: "T-Test" },
        { label: "Avg p-value", value: "0.032" },
        { label: "Users", value: "67" },
      ];
    case "Simulation Model":
      return [
        { label: "Simulation Runs", value: "78" },
        { label: "Output Range", value: "12-89" },
        { label: "Scenarios", value: "15" },
        { label: "Prediction Acc.", value: "84%" },
      ];
    case "Policy or Economic Model":
      return [
        { label: "Scenarios Evaluated", value: "23" },
        { label: "Impact Score", value: "High" },
        { label: "Projections", value: "8" },
        { label: "Comparisons", value: "12" },
      ];
    default:
      return [
        { label: "Users", value: "45" },
        { label: "Interactions", value: "156" },
        { label: "Executions", value: "78" },
        { label: "Total Views", value: "312" },
      ];
  }
}

/* Preview renderers by type */
function SurveyPreview({ title, type, users, toast: t }: any) {
  return (
    <div className="space-y-4">
      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">{type} · {users || "All users"}</p>
      </div>
      {surveySections.map((section, si) => (
        <div key={si} className="bg-card rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">{si + 1}</span>
            <h4 className="text-sm font-bold text-foreground">{section.name}</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {section.fields.map((field) => (
              <div key={field} className="space-y-1">
                <Label className="text-xs">{field}</Label>
                <Input placeholder={`Enter ${field.toLowerCase()}...`} className="h-8 text-xs" />
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button variant="afrika" size="lg" className="w-full" onClick={() => t({ title: "Response submitted!", description: "Thank you for completing this instrument." })}>
        Submit Response
      </Button>
    </div>
  );
}

function AnalyticalPreview({ title, toast: t }: any) {
  const [val1, setVal1] = useState("");
  const [val2, setVal2] = useState("");
  const [ran, setRan] = useState(false);
  return (
    <div className="space-y-4">
      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">📊 Analytical Tool</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1"><Label className="text-xs">Dataset Input</Label><Input placeholder="Enter dataset or paste values..." value={val1} onChange={(e) => setVal1(e.target.value)} className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Variables Selection</Label><Input placeholder="e.g. GDP, Population, HDI" value={val2} onChange={(e) => setVal2(e.target.value)} className="h-8 text-xs" /></div>
      </div>
      <Button variant="afrika" size="sm" className="gap-1" onClick={() => { setRan(true); t({ title: "Analysis complete" }); }}><Play className="h-3 w-3" /> Run Analysis</Button>
      {ran && <div className="bg-afrika-green/10 border border-afrika-green/30 rounded-lg p-3 text-xs text-foreground">Analysis result: Strong positive correlation detected (r=0.78, p&lt;0.01). Mean difference = 4.32.</div>}
    </div>
  );
}

function DashboardPreview({ title }: any) {
  return (
    <div className="space-y-4">
      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">📈 Data Visualisation Dashboard</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs font-semibold mb-2">Funding Distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={fundingBarData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="model" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="count" fill="hsl(25, 90%, 52%)" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs font-semibold mb-2">Innovation Trends</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={innovationLineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Line type="monotone" dataKey="patents" stroke="hsl(25, 90%, 52%)" strokeWidth={2} /><Line type="monotone" dataKey="papers" stroke="hsl(235, 60%, 18%)" strokeWidth={2} /></LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ExperimentalPreview({ title, toast: t }: any) {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div className="space-y-4">
      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">🧪 Experimental Interface</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1"><Label className="text-xs">Treatment Group Size</Label><Input placeholder="e.g. 50" className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Control Group Size</Label><Input placeholder="e.g. 50" className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Test Duration (days)</Label><Input placeholder="e.g. 30" className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Confidence Level</Label><Input placeholder="e.g. 95%" className="h-8 text-xs" /></div>
      </div>
      <Button variant="afrika" size="sm" className="gap-1" onClick={() => { setRunning(true); setTimeout(() => { setRunning(false); setDone(true); t({ title: "Experiment complete" }); }, 1500); }}>
        {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />} Start Experiment
      </Button>
      {done && <div className="bg-afrika-green/10 border border-afrika-green/30 rounded-lg p-3 text-xs">Treatment group showed 23% improvement over control (p=0.003). Effect size: 0.68 (medium).</div>}
    </div>
  );
}

function CalculatorPreview({ title, toast: t }: any) {
  const [result, setResult] = useState("");
  return (
    <div className="space-y-4">
      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">🧮 Statistical Calculator</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1"><Label className="text-xs">Sample A (comma-separated)</Label><Input placeholder="e.g. 12, 15, 18, 22, 19" className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Sample B (comma-separated)</Label><Input placeholder="e.g. 10, 13, 14, 17, 16" className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Confidence Interval</Label><Input placeholder="95%" className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Test Type</Label>
          <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
            <SelectContent><SelectItem value="ttest">T-Test</SelectItem><SelectItem value="cohens">Cohen's d</SelectItem><SelectItem value="anova">ANOVA</SelectItem></SelectContent>
          </Select>
        </div>
      </div>
      <Button variant="afrika" size="sm" className="gap-1" onClick={() => { setResult("t(48) = 2.34, p = 0.023, Cohen's d = 0.67"); t({ title: "Calculation complete" }); }}><Play className="h-3 w-3" /> Run Calculation</Button>
      {result && <div className="bg-afrika-green/10 border border-afrika-green/30 rounded-lg p-3 text-xs font-mono">{result}</div>}
    </div>
  );
}

function SimulationPreview({ title, toast: t }: any) {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div className="space-y-4">
      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">🌍 Simulation Model</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1"><Label className="text-xs">Initial Variables</Label><Input placeholder="e.g. GDP=500B, Pop=220M" className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Simulation Duration (years)</Label><Input placeholder="e.g. 10" className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Growth Rate (%)</Label><Input placeholder="e.g. 3.5" className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Scenarios</Label><Input placeholder="e.g. 3" className="h-8 text-xs" /></div>
      </div>
      <Button variant="afrika" size="sm" className="gap-1" onClick={() => { setRunning(true); setTimeout(() => { setRunning(false); setDone(true); t({ title: "Simulation complete" }); }, 2000); }}>
        {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />} Run Simulation
      </Button>
      {done && <div className="bg-afrika-green/10 border border-afrika-green/30 rounded-lg p-3 text-xs">Scenario A: GDP grows to 850B by 2036. Scenario B: 720B with reduced funding. Scenario C: 950B with policy reform.</div>}
    </div>
  );
}

function PolicyPreview({ title, toast: t }: any) {
  const [done, setDone] = useState(false);
  return (
    <div className="space-y-4">
      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">🏛️ Policy or Economic Model</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1"><Label className="text-xs">Policy Variables</Label><Input placeholder="e.g. Tax rate, Subsidy amount" className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Economic Indicators</Label><Input placeholder="e.g. CPI, Inflation rate" className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Population Parameters</Label><Input placeholder="e.g. 220M, Urban 52%" className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Time Horizon</Label><Input placeholder="e.g. 5 years" className="h-8 text-xs" /></div>
      </div>
      <Button variant="afrika" size="sm" className="gap-1" onClick={() => { setDone(true); t({ title: "Model evaluated" }); }}><Play className="h-3 w-3" /> Evaluate Policy</Button>
      {done && <div className="bg-afrika-green/10 border border-afrika-green/30 rounded-lg p-3 text-xs">Projected outcome: 12% poverty reduction over 5 years. Employment +8.5%. GDP impact: +2.3% annually.</div>}
    </div>
  );
}

function GenericPreview({ title, type, toast: t }: any) {
  return (
    <div className="space-y-4">
      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
        <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground">⚙️ {type}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1"><Label className="text-xs">Input Parameter 1</Label><Input placeholder="Enter value..." className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Input Parameter 2</Label><Input placeholder="Enter value..." className="h-8 text-xs" /></div>
      </div>
      <Button variant="afrika" size="sm" className="gap-1" onClick={() => t({ title: "Execution complete" })}><Play className="h-3 w-3" /> Execute</Button>
    </div>
  );
}

function TypeSpecificAnalytics({ type }: { type: string }) {
  if (type === "Survey / Questionnaire Interface") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-4">
          <h4 className="text-sm font-bold text-foreground mb-3">Response Distribution</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={responsePieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {responsePieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <h4 className="text-sm font-bold text-foreground mb-3">Funding Model Breakdown</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={fundingBarData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="model" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="count" fill="hsl(25, 90%, 52%)" radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <h4 className="text-sm font-bold text-foreground mb-3">Innovation Metrics Over Time</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={innovationLineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend />
              <Line type="monotone" dataKey="patents" stroke="hsl(25, 90%, 52%)" strokeWidth={2} />
              <Line type="monotone" dataKey="papers" stroke="hsl(235, 60%, 18%)" strokeWidth={2} />
              <Line type="monotone" dataKey="products" stroke="hsl(145, 60%, 40%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <h4 className="text-sm font-bold text-foreground mb-3">Institutional Constraint Frequency</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={constraintData} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis dataKey="constraint" type="category" tick={{ fontSize: 10 }} width={90} /><Tooltip /><Bar dataKey="freq" fill="hsl(235, 60%, 18%)" radius={[0, 4, 4, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  if (type === "Data Visualisation Dashboard") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-4">
          <h4 className="text-sm font-bold text-foreground mb-3">Visualization Interactions</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[{ name: "Bar", views: 145 }, { name: "Line", views: 98 }, { name: "Pie", views: 76 }, { name: "Scatter", views: 45 }]}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="views" fill="hsl(25, 90%, 52%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <h4 className="text-sm font-bold text-foreground mb-3">Data Filters Applied</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={[{ name: "Region", value: 40 }, { name: "Year", value: 30 }, { name: "Category", value: 20 }, { name: "Custom", value: 10 }]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
              {[0, 1, 2, 3].map((i) => <Cell key={i} fill={["hsl(25, 90%, 52%)", "hsl(235, 60%, 18%)", "hsl(145, 60%, 40%)", "hsl(230, 20%, 70%)"][i]} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Default analytics for other types
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card rounded-xl border border-border p-4">
        <h4 className="text-sm font-bold text-foreground mb-3">Usage Over Time</h4>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={innovationLineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip />
            <Line type="monotone" dataKey="patents" name="Executions" stroke="hsl(25, 90%, 52%)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card rounded-xl border border-border p-4">
        <h4 className="text-sm font-bold text-foreground mb-3">Interaction Distribution</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={constraintData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="constraint" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="freq" fill="hsl(235, 60%, 18%)" radius={[4, 4, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const InstrumentStudio = () => {
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [prompt, setPrompt] = useState(searchParams.get("prompt") || "");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [building, setBuilding] = useState(false);
  const [built, setBuilt] = useState(false);
  const [showCreditConfirm, setShowCreditConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { toast } = useToast();

  const toggleUser = (u: string) => setSelectedUsers((prev) => prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u]);

  const autofillDemo = () => {
    setTitle(demoTitle);
    setType(demoType);
    setPrompt(demoPrompt);
    setSelectedUsers(["Researchers", "Policy Analysts", "Institutional Staff"]);
    toast({ title: "Demo autofilled", description: "R&D survey example loaded." });
  };

  const handleBuildConfirm = () => {
    setShowCreditConfirm(false);
    setBuilding(true);
    setTimeout(() => {
      setBuilding(false);
      setBuilt(true);
      toast({ title: "Instrument generated!", description: "Your research instrument is ready for preview." });
      setTimeout(() => setShowShareModal(true), 500);
    }, 3000);
  };

  const handleSharePublicly = () => {
    setShowShareModal(false);
    toast({ title: "Shared to community!", description: "Your instrument has been posted to the community feed." });
  };

  const renderPreview = () => {
    const props = { title, type, users: selectedUsers.join(", "), toast };
    switch (type) {
      case "Survey / Questionnaire Interface": return <SurveyPreview {...props} />;
      case "Analytical Tool": return <AnalyticalPreview {...props} />;
      case "Data Visualisation Dashboard": return <DashboardPreview {...props} />;
      case "Experimental Interface": return <ExperimentalPreview {...props} />;
      case "Statistical Calculator": return <CalculatorPreview {...props} />;
      case "Simulation Model": return <SimulationPreview {...props} />;
      case "Policy or Economic Model": return <PolicyPreview {...props} />;
      default: return <GenericPreview {...props} />;
    }
  };

  const metrics = getTypeMetrics(type);

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

        {/* Share modal */}
        <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Share this update with the community?</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">
              Defi published a new research instrument: <strong>{title || "Untitled"}</strong>
            </p>
            <div className="flex flex-col gap-2 mt-3">
              <Button variant="afrika" size="sm" onClick={handleSharePublicly}>Share Publicly</Button>
              <Button variant="outline" size="sm" onClick={() => { setShowShareModal(false); toast({ title: "Shared with network" }); }}>Share with Network Only</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowShareModal(false)}>Skip</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Creation Form */}
        {!built && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-accent" />
                <h2 className="text-base font-bold text-foreground">Create New Instrument</h2>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-accent" onClick={autofillDemo}>
                🧪 Autofill Demo
              </Button>
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
        )}

        {/* Built preview + analytics */}
        {built && (
          <>
            <div className="bg-afrika-green/10 border border-afrika-green/30 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-afrika-green mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Instrument generated successfully!</p>
                <p className="text-xs text-muted-foreground mt-0.5">"{title}" is ready for preview and distribution.</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <Tabs defaultValue="preview">
                <div className="px-5 pt-4 border-b border-border flex items-center justify-between flex-wrap gap-2">
                  <TabsList className="bg-secondary">
                    <TabsTrigger value="preview" className="gap-1"><Eye className="h-3 w-3" /> Preview</TabsTrigger>
                    <TabsTrigger value="analytics" className="gap-1"><BarChart3 className="h-3 w-3" /> Analytics</TabsTrigger>
                    <TabsTrigger value="share" className="gap-1"><Share2 className="h-3 w-3" /> Share</TabsTrigger>
                  </TabsList>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="text-xs gap-1"><Edit className="h-3 w-3" /> Edit</Button>
                    <Button variant="outline" size="sm" className="text-xs gap-1"><Copy className="h-3 w-3" /> Duplicate</Button>
                    <Link to="/dashboard/my-papers">
                      <Button variant="outline" size="sm" className="text-xs gap-1"><FileText className="h-3 w-3" /> Embed in Paper</Button>
                    </Link>
                  </div>
                </div>

                <TabsContent value="preview" className="p-5">
                  {renderPreview()}
                </TabsContent>

                <TabsContent value="analytics" className="p-5 space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {metrics.map((m) => (
                      <div key={m.label} className="bg-secondary rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-foreground">{m.value}</p>
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  <TypeSpecificAnalytics type={type} />
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
                    <Button variant="afrika" size="sm" className="gap-1" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out my research instrument on Afrika Scholar: https://afrikascholar.com/i/new-instrument`)}`, "_blank")}>
                      <ExternalLink className="h-3 w-3" /> WhatsApp
                    </Button>
                    <Button variant="afrikaBlue" size="sm" className="gap-1" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://afrikascholar.com/i/new-instrument")}`, "_blank")}>
                      <ExternalLink className="h-3 w-3" /> LinkedIn
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <Button variant="outline" className="w-full" onClick={() => { setBuilt(false); setTitle(""); setType(""); setPrompt(""); setSelectedUsers([]); }}>
              Create Another Instrument
            </Button>
          </>
        )}

        {/* My Instruments */}
        {!built && (
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
                            <Button variant="afrika" size="sm" className="flex-1 gap-1" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(inst.link)}`, "_blank")}>
                              <ExternalLink className="h-3 w-3" /> WhatsApp
                            </Button>
                            <Button variant="afrikaBlue" size="sm" className="flex-1 gap-1" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(inst.link)}`, "_blank")}>
                              <ExternalLink className="h-3 w-3" /> LinkedIn
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InstrumentStudio;
