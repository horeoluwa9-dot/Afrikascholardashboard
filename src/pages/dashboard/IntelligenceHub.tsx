import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Mail,
  Send,
  Loader2,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Calendar,
  MapPin,
  Globe,
  BookOpen,
  Users,
  Target,
  ArrowRight,
  FileText,
  Save,
} from "lucide-react";

/* ─── DUMMY DATA ─── */

const journals = [
  { name: "Journal of the ACM", field: "Computer Science", impact: 2.381, matchScore: 92, reviewWeeks: 6, openAccess: false, deadline: "Rolling", acceptance: "18%" },
  { name: "IEEE Transactions on Information Theory", field: "Information Technology", impact: 2.988, reviewWeeks: 8, matchScore: 88, openAccess: false, deadline: "Rolling", acceptance: "22%" },
  { name: "Journal of Machine Learning Research", field: "Machine Learning", impact: 3.864, reviewWeeks: 12, matchScore: 85, openAccess: true, deadline: "Rolling", acceptance: "15%" },
  { name: "Neural Computation", field: "Neural Networks", impact: 4.775, reviewWeeks: 16, matchScore: 80, openAccess: false, deadline: "2026-06-01", acceptance: "20%" },
  { name: "IEEE Trans. Neural Networks", field: "Neural Networks", impact: 10.451, reviewWeeks: 6, matchScore: 78, openAccess: false, deadline: "Rolling", acceptance: "25%" },
  { name: "Information Sciences", field: "Computer Science", impact: 6.795, reviewWeeks: 8, matchScore: 75, openAccess: false, deadline: "Rolling", acceptance: "28%" },
];

const conferences = [
  { name: "International Conference on Machine Learning", abbr: "ICML", location: "Berlin, Germany", date: "July 2026", deadline: "2026-02-25", website: "#", field: "Machine Learning" },
  { name: "Conference on Neural Information Processing Systems", abbr: "NeurIPS", location: "New Orleans, USA", date: "December 2026", deadline: "2026-05-29", website: "#", field: "AI" },
  { name: "International Joint Conference on Artificial Intelligence", abbr: "IJCAI", location: "Vienna, Austria", date: "July 2026", deadline: "2026-02-20", website: "#", field: "AI" },
];

const stakeholders = [
  { name: "Yann LeCun", title: "Director of AI Research", institution: "Facebook AI Research · USA", field: "Artificial Intelligence, Machine Learning", hIndex: 145, recent: "Convolutional Neural Networks", links: { scholar: "#", researchgate: "#", linkedin: "#" } },
  { name: "Fei-Fei Li", title: "Director of Stanford AI Lab", institution: "Stanford University · USA", field: "Artificial Intelligence, Computer Vision", hIndex: 130, recent: "ImageNet", links: { scholar: "#", researchgate: "#", linkedin: "#" } },
  { name: "Andrew Ng", title: "Founder of Coursera and AI Fund", institution: "Stanford University · USA", field: "Artificial Intelligence, Machine Learning", hIndex: 124, recent: "Deep Learning", links: { scholar: "#", researchgate: "#", linkedin: "#" } },
  { name: "Demis Hassabis", title: "Co-Founder and CEO of DeepMind", institution: "DeepMind · UK", field: "AI, Reinforcement Learning", hIndex: 68, recent: "AlphaGo", links: { scholar: "#", researchgate: "#", linkedin: "#" } },
  { name: "Jürgen Schmidhuber", title: "Co-Director, Dalle Molle Institute", institution: "Univ. of Lugano · Switzerland", field: "AI, Recurrent Neural Networks", hIndex: 98, recent: "Long Short-Term Memory", links: { scholar: "#", researchgate: "#", linkedin: "#" } },
  { name: "Geoffrey Hinton", title: "Chief Scientific Adviser, Vector Institute", institution: "Univ. of Toronto · Canada", field: "AI, Deep Learning", hIndex: 172, recent: "Backpropagation", links: { scholar: "#", researchgate: "#", linkedin: "#" } },
];

const researchGaps = [
  { title: "Limited understanding of AI-powered cybersecurity solutions", impact: "HIGH IMPACT" as const, desc: "Develop AI-powered cybersecurity solutions and provide training and education to cybersecurity professionals.", direction: "Invest in AI-powered cybersecurity solutions and develop a team with expertise in AI and cybersecurity" },
  { title: "Limited availability of quantum computing resources", impact: "MEDIUM IMPACT" as const, desc: "Develop quantum computing infrastructure and provide access to quantum computing resources for researchers and organizations.", direction: "Collaborate with quantum computing experts to develop quantum computing infrastructure" },
  { title: "High upfront costs of sustainable energy systems", impact: "LOW IMPACT" as const, desc: "Develop financing options and incentives for sustainable energy systems and provide education and training on sustainable energy.", direction: "Work with sustainable energy organizations to develop financing options and incentives" },
];

const trends = [
  { title: "Artificial Intelligence in Cybersecurity", status: "Rising", year: "2024", tags: ["AI", "Cybersecurity", "Machine Learning"], citations: "~1254", gap: "Limited understanding of AI-powered cybersecurity solutions", suggestion: "Invest in AI-powered cybersecurity solutions and develop a team with expertise in AI and cybersecurity" },
  { title: "Quantum Computing in Materials Science", status: "Emerging", year: "2025", tags: ["Quantum Computing", "Materials Science", "Simulation"], citations: "~5678", gap: "Limited availability of quantum computing resources", suggestion: "Collaborate with quantum computing experts to develop quantum computing infrastructure" },
  { title: "Sustainable Energy Systems", status: "Established", year: "2023", tags: ["Sustainable Energy", "Renewable Energy", "Energy Efficiency"], citations: "~9812", gap: null, suggestion: null },
];

const impactColor: Record<string, string> = {
  "HIGH IMPACT": "bg-destructive text-destructive-foreground",
  "MEDIUM IMPACT": "bg-accent text-accent-foreground",
  "LOW IMPACT": "bg-muted text-muted-foreground",
};

const statusColor: Record<string, string> = {
  Rising: "bg-destructive/20 text-destructive border-destructive/40",
  Emerging: "bg-accent/20 text-accent border-accent/40",
  Established: "bg-afrika-green/20 text-afrika-green border-afrika-green/40",
};

const IntelligenceHub = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("2026-03-03 15:28");
  const keywords = ["AI", "Machine Learning", "Deep Learning", "Cybersecurity", "Neural Networks"];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefreshed(new Date().toLocaleString());
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Intelligence Hub</span>
        </div>

        {/* Header row */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">
              Your <span className="heading-serif text-accent italic">Research</span> Intelligence Hub
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              AI-powered insights tailored to your research profile — curated journals to publish in, upcoming conference deadlines, key stakeholders to connect with, and live signals from the global research community.
            </p>
          </div>

          {/* Profile card */}
          <div className="bg-card rounded-xl border border-border p-5 w-full lg:w-72 space-y-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Your Research Profile</p>
            <div className="flex flex-wrap gap-1">
              {keywords.map((k) => (
                <Badge key={k} variant="secondary" className="text-[10px]">{k}</Badge>
              ))}
            </div>
            <div className="flex gap-4 text-center text-xs">
              <div><p className="text-lg font-bold text-foreground">1</p><p className="text-muted-foreground">Papers</p></div>
              <div><p className="text-lg font-bold text-foreground">5</p><p className="text-muted-foreground">Keywords</p></div>
              <div><p className="text-lg font-bold text-foreground">6</p><p className="text-muted-foreground">Matches</p></div>
            </div>
            <Button
              variant="afrika"
              size="sm"
              className="w-full gap-1"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              {refreshing ? "Refreshing..." : "Refresh Intelligence"}
            </Button>
            <p className="text-[10px] text-muted-foreground">Generated: {lastRefreshed}</p>
          </div>
        </div>

        {/* SECTION 1: Journals */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-bold text-foreground">Recommended Journals to Publish In</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Matched to your research profile — submit your next paper here</p>
            </div>
            <Link to="/dashboard/intelligence/journals" className="text-xs text-accent hover:underline flex items-center gap-1">
              <Globe className="h-3 w-3" /> All Journals
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {journals.map((j) => (
              <div key={j.name} className="bg-card rounded-xl border border-border p-5 space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold text-foreground leading-tight">{j.name}</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-accent hover:text-accent/80 shrink-0 ml-2">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>{j.name}</DialogTitle></DialogHeader>
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><span className="text-muted-foreground">Field:</span> {j.field}</div>
                          <div><span className="text-muted-foreground">Impact Factor:</span> {j.impact}</div>
                          <div><span className="text-muted-foreground">Match Score:</span> {j.matchScore}%</div>
                          <div><span className="text-muted-foreground">Review Time:</span> ~{j.reviewWeeks} weeks</div>
                          <div><span className="text-muted-foreground">Acceptance Rate:</span> {j.acceptance}</div>
                          <div><span className="text-muted-foreground">Open Access:</span> {j.openAccess ? "Yes" : "No"}</div>
                          <div><span className="text-muted-foreground">Deadline:</span> {j.deadline}</div>
                        </div>
                        <p className="text-xs text-muted-foreground">Aims & Scope, Author Guidelines, and Submission Fee details available via journal website.</p>
                        <Button variant="afrika" size="sm" className="w-full">Visit Journal Website</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-xs text-muted-foreground">{j.field}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-[10px]">IF: {j.impact}</Badge>
                  <Badge variant="outline" className="text-[10px]">~{j.reviewWeeks} weeks</Badge>
                  {j.openAccess && <Badge className="text-[10px] bg-afrika-green text-accent-foreground">Open Access</Badge>}
                </div>
                <Link to="/dashboard/publishing/submit">
                  <Button variant="afrika" size="sm" className="w-full gap-1 mt-1">
                    <Send className="h-3 w-3" /> Submit Paper
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: Conferences */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-bold text-foreground">Upcoming Conference Alerts</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Submission deadlines for conferences aligned with your research</p>
            </div>
            <Link to="/dashboard/intelligence/conferences" className="text-xs text-accent hover:underline flex items-center gap-1">
              All Conferences
            </Link>
          </div>

          <div className="space-y-3">
            {conferences.map((c) => (
              <div key={c.name} className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.abbr}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.location}</span>
                      <span>📅 {c.date}</span>
                      <a href={c.website} className="text-accent flex items-center gap-1 hover:underline">
                        <Globe className="h-3 w-3" /> Visit Website
                      </a>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-[10px]">{c.abbr}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Deadline: {c.deadline}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Stakeholders */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-bold text-foreground">Key Stakeholders & Researchers</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Influential academics, collaborators, and institutions in your field</p>
            </div>
            <span className="text-xs text-muted-foreground">{stakeholders.length} researchers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stakeholders.map((s) => (
              <div key={s.name} className="bg-card rounded-xl border border-border p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                    {s.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground">{s.name}</h3>
                    <p className="text-xs text-accent">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.institution}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] shrink-0">h-index: {s.hIndex}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{s.field}</p>
                <p className="text-xs text-muted-foreground">Recent: {s.recent}</p>
                <div className="flex flex-wrap gap-1.5">
                  <a href={s.links.scholar} className="text-[10px] px-2 py-1 rounded bg-accent/10 text-accent hover:bg-accent/20">Scholar</a>
                  <a href={s.links.researchgate} className="text-[10px] px-2 py-1 rounded bg-afrika-green/10 text-afrika-green hover:bg-afrika-green/20">ResearchGate</a>
                  <a href={s.links.linkedin} className="text-[10px] px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20">LinkedIn</a>
                  <a href={`mailto:contact@example.com?subject=Research Collaboration&body=Dear ${s.name},%0D%0A%0D%0AI am writing to discuss a potential research collaboration...`} className="text-[10px] px-2 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center gap-1"><Mail className="h-2.5 w-2.5" /> Email</a>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground text-center">⚠ Stakeholder details are AI-generated based on your research profile. Verify contact information before reaching out.</p>
        </section>

        {/* SECTION 4: Research Trends */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <h2 className="text-xl font-bold text-foreground">Global Research Trends in Your Field</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Live momentum signals — position your next paper for maximum impact</p>
            </div>
            <span className="text-xs text-muted-foreground">{trends.length} trends</span>
          </div>

          <div className="space-y-4">
            {trends.map((t) => (
              <div key={t.title} className="bg-card rounded-xl border border-border p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-[10px] ${statusColor[t.status]}`}>{t.status}</Badge>
                      <span className="text-xs text-muted-foreground">{t.year}</span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground mt-1">{t.title}</h3>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {t.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                  ))}
                  <Badge variant="outline" className="text-[10px]">{t.citations} citations</Badge>
                </div>
                {t.gap && (
                  <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                    <p className="text-xs"><span className="font-semibold text-destructive">Research gap:</span> <span className="text-muted-foreground">{t.gap}</span></p>
                    {t.suggestion && (
                      <p className="text-xs text-accent mt-1 flex items-start gap-1">
                        <Lightbulb className="h-3 w-3 mt-0.5 shrink-0" /> {t.suggestion}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Research Gaps */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold text-foreground">Identified Research Gaps</h2>
          </div>
          <p className="text-sm text-muted-foreground -mt-2">Untapped opportunities for original contributions in your field</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {researchGaps.map((g) => (
              <div key={g.title} className="bg-card rounded-xl border border-border p-5 space-y-3">
                <Badge className={`text-[10px] ${impactColor[g.impact]}`}>{g.impact}</Badge>
                <h3 className="text-sm font-bold text-foreground">{g.title}</h3>
                <p className="text-xs text-muted-foreground">{g.desc}</p>
                <div className="flex gap-2">
                  <Link to={`/dashboard/generate-paper?topic=${encodeURIComponent(g.title)}`}>
                    <Button variant="afrika" size="sm" className="gap-1 text-xs">
                      <FileText className="h-3 w-3" /> Generate Paper
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <Save className="h-3 w-3" /> Save
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Visibility & Impact Strategy */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold text-foreground">Your Visibility & Impact Strategy</h2>
          </div>
          <p className="text-sm text-muted-foreground -mt-2">AI-curated actions to increase your research reach</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Visibility Tips", icon: "✨", items: ["Publish research in top-tier journals", "Present research at international conferences", "Collaborate with industry partners"] },
              { title: "Next Steps", icon: "🎯", items: ["Develop a research plan and secure funding", "Build a team with diverse expertise", "Establish partnerships with industry and academia"] },
              { title: "Collaboration", icon: "💛", items: ["Collaborate with AI researchers to develop AI-powered cybersecurity solutions", "Partner with quantum computing experts to develop quantum computing infrastructure", "Work with sustainable energy organizations to develop financing options and incentives for sustainable energy systems"] },
            ].map((c) => (
              <div key={c.title} className="bg-card rounded-xl border border-border p-5 space-y-3">
                <p className="text-xs font-bold text-accent flex items-center gap-1">{c.icon} {c.title.toUpperCase()}</p>
                <ul className="space-y-2">
                  {c.items.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-accent font-bold">{i + 1}.</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="text-center space-y-4 py-6">
          <p className="text-xs text-muted-foreground">Intelligence refreshed daily · Based on your research profile</p>
          <div className="flex gap-3 justify-center">
            <Link to="/dashboard/generate-paper">
              <Button variant="afrika" className="gap-1">
                <FileText className="h-4 w-4" /> Generate New Paper
              </Button>
            </Link>
            <Button variant="afrikaOutline" className="gap-1" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className="h-4 w-4" /> Refresh Intelligence
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IntelligenceHub;
