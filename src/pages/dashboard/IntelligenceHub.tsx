import { useState, useEffect } from "react";
import { useModuleUnlocksContext } from "@/contexts/ModuleUnlocksContext";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronRight, RefreshCw, ExternalLink, Mail, Send, Loader2,
  Lightbulb, TrendingUp, Calendar, MapPin, Globe,
  BookOpen, Users, Target, FileText, Save, Wrench,
  MessageCircle, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const journals = [
  { name: "African Journal of Energy Studies", indexing: "Scopus indexed", impact: 2.3, openAccess: true, reviewWeeks: 6, matchScore: 92, deadline: "Rolling", acceptance: "18%", field: "Energy Studies" },
  { name: "East African Economic Review", indexing: "DOAJ listed", impact: 1.5, openAccess: true, reviewWeeks: 8, matchScore: 88, deadline: "Rolling", acceptance: "22%", field: "Economics" },
  { name: "African Health Sciences Journal", indexing: "PubMed indexed", impact: 1.8, openAccess: false, reviewWeeks: 12, matchScore: 85, deadline: "Bi-annual", acceptance: "15%", field: "Health Sciences" },
  { name: "Journal of African Development", indexing: "Scopus indexed", impact: 2.1, openAccess: false, reviewWeeks: 10, matchScore: 80, deadline: "Rolling", acceptance: "20%", field: "Development Studies" },
  { name: "African Journal of Science & Tech", indexing: "Web of Science", impact: 3.2, openAccess: true, reviewWeeks: 8, matchScore: 78, deadline: "2026-06-01", acceptance: "12%", field: "Science & Technology" },
  { name: "West African Journal of Medicine", indexing: "PubMed indexed", impact: 1.2, openAccess: false, reviewWeeks: 16, matchScore: 75, deadline: "Quarterly", acceptance: "25%", field: "Medicine" },
];

const conferences = [
  { name: "Pan-African Science Conference 2026", date: "March 15-18, 2026", location: "Nairobi, Kenya", deadline: "Jan 15, 2026", status: "Open", field: "Science", website: "https://example.com" },
  { name: "AfriTech Research Summit", date: "May 8-10, 2026", location: "Lagos, Nigeria", deadline: "Feb 28, 2026", status: "Open", field: "Technology", website: "https://example.com" },
  { name: "African Health Research Forum", date: "July 22-24, 2026", location: "Cape Town, South Africa", deadline: "Apr 30, 2026", status: "Upcoming", field: "Health", website: "https://example.com" },
  { name: "Continental Education Summit", date: "Sep 5-7, 2026", location: "Accra, Ghana", deadline: "Jun 15, 2026", status: "Upcoming", field: "Education", website: "https://example.com" },
];

const stakeholders = [
  { name: "Dr. Amina Osei", role: "Director of Research", institution: "University of Ghana", expertise: ["AI Ethics", "Public Health", "Data Science"], email: "amina@example.com" },
  { name: "Prof. Kwame Mensah", role: "Dean of Engineering", institution: "University of Cape Town", expertise: ["Renewable Energy", "Engineering", "Sustainability"], email: "kwame@example.com" },
  { name: "Dr. Fatima Ibrahim", role: "Lead Researcher", institution: "NISR Rwanda", expertise: ["Statistics", "Policy Analysis", "Demographics"], email: "fatima@example.com" },
  { name: "Prof. Chidi Okonkwo", role: "Department Head", institution: "University of Lagos", expertise: ["Machine Learning", "Cybersecurity", "Networks"], email: "chidi@example.com" },
  { name: "Dr. Zanele Dlamini", role: "Research Fellow", institution: "Wits University", expertise: ["Genomics", "Bioinformatics", "Medicine"], email: "zanele@example.com" },
  { name: "Prof. Hassan Ali", role: "Senior Lecturer", institution: "University of Nairobi", expertise: ["Economics", "Finance", "Development"], email: "hassan@example.com" },
];

const trends = [
  { title: "AI-Powered Climate Modeling for Africa", direction: "up" as const, change: "+34%", region: "Sub-Saharan Africa", explanation: "Growing interest in localized climate models using machine learning for agricultural planning and disaster preparedness.", tags: ["AI", "Climate", "Agriculture"] },
  { title: "Digital Health Infrastructure", direction: "up" as const, change: "+28%", region: "East Africa", explanation: "Rapid expansion of telemedicine and e-health platforms driven by mobile penetration and post-pandemic healthcare reforms.", tags: ["Health", "Digital", "Infrastructure"] },
  { title: "Quantum Computing in Materials Science", direction: "up" as const, change: "+22%", region: "Global", explanation: "Emerging applications of quantum simulation for discovering new materials, with African researchers contributing to open-source quantum frameworks.", tags: ["Quantum", "Materials", "Computing"] },
  { title: "Traditional Knowledge Systems Digitization", direction: "down" as const, change: "-5%", region: "West Africa", explanation: "Slight decline in publication volume but increasing quality and impact of indigenous knowledge preservation research.", tags: ["Indigenous", "Digital", "Preservation"] },
];

const gaps = [
  { title: "Limited AI ethics frameworks for African contexts", impact: "HIGH", desc: "Most AI governance frameworks are designed for Western contexts. Africa-specific ethical guidelines are urgently needed.", direction: "Develop context-aware AI ethics guidelines incorporating African Ubuntu philosophy and communal values." },
  { title: "Insufficient longitudinal health data", impact: "MEDIUM", desc: "Lack of multi-year health datasets across African nations hinders epidemiological research and policy planning.", direction: "Establish pan-African health data collection consortiums with standardized methodologies." },
  { title: "Under-researched renewable energy storage", impact: "HIGH", desc: "While solar adoption grows, energy storage solutions tailored to African climates and infrastructure remain under-explored.", direction: "Investigate locally-sourced battery materials and off-grid storage systems for tropical environments." },
];

const statusColor: Record<string, string> = { Open: "bg-afrika-green/10 text-afrika-green border-afrika-green/30", Upcoming: "bg-accent/10 text-accent border-accent/30" };
const impactColor: Record<string, string> = { HIGH: "bg-destructive/10 text-destructive", MEDIUM: "bg-accent/10 text-accent", LOW: "bg-muted text-muted-foreground" };

const tabItems = [
  { value: "journals", label: "Journals", icon: BookOpen },
  { value: "conferences", label: "Conferences", icon: Calendar },
  { value: "stakeholders", label: "Stakeholders", icon: Users },
  { value: "gaps", label: "Research Gaps", icon: Target },
  { value: "trends", label: "Trends", icon: TrendingUp },
];

const IntelligenceHub = () => {
  const { unlockModule } = useModuleUnlocksContext();
  useEffect(() => { unlockModule("research_intelligence"); }, [unlockModule]);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "journals";
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("2026-03-04 10:15");
  const [savedConferences, setSavedConferences] = useState<string[]>([]);
  const [savedGaps, setSavedGaps] = useState<string[]>([]);
  const [savedTrends, setSavedTrends] = useState<string[]>([]);
  const { toast } = useToast();
  const keywords = ["AI", "Machine Learning", "Public Health", "Climate", "Data Science"];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefreshed(new Date().toLocaleString());
      toast({ title: "Intelligence refreshed", description: "Your recommendations have been updated." });
    }, 2500);
  };

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const saveConference = (name: string) => {
    setSavedConferences((prev) => prev.includes(name) ? prev : [...prev, name]);
    toast({ title: "Conference saved", description: `${name} added to your watchlist.` });
  };

  const saveGap = (title: string) => {
    setSavedGaps((prev) => prev.includes(title) ? prev : [...prev, title]);
    toast({ title: "Research gap saved", description: "Added to your research list." });
  };

  const saveTrend = (title: string) => {
    setSavedTrends((prev) => prev.includes(title) ? prev : [...prev, title]);
    toast({ title: "Added to interests", description: "Your research profile has been updated." });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Intelligence Hub</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Research Intelligence Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered insights tailored to your research profile — journals, conferences, stakeholders, trends, and research gaps.
          </p>
        </div>

        {/* Research Profile Card - full width below header */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Research Profile</p>
              <div className="flex flex-wrap gap-1.5">
                {keywords.map((k) => <Badge key={k} variant="secondary" className="text-[10px]">{k}</Badge>)}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex gap-5 text-center text-xs">
                <div><p className="text-lg font-bold text-foreground">3</p><p className="text-muted-foreground">Papers</p></div>
                <div><p className="text-lg font-bold text-foreground">5</p><p className="text-muted-foreground">Keywords</p></div>
                <div><p className="text-lg font-bold text-foreground">6</p><p className="text-muted-foreground">Matches</p></div>
              </div>
              <div className="space-y-1">
                <Button variant="afrika" size="sm" className="gap-1" onClick={handleRefresh} disabled={refreshing}>
                  {refreshing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                  {refreshing ? "Refreshing..." : "Refresh Intelligence"}
                </Button>
                <p className="text-[10px] text-muted-foreground">Generated: {lastRefreshed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 flex-wrap">
          {tabItems.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === tab.value
                  ? "bg-accent text-accent-foreground"
                  : "bg-card text-muted-foreground border border-border hover:border-accent/50"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" /> {tab.label}
            </button>
          ))}
        </div>

        {/* JOURNALS */}
        {activeTab === "journals" && (
          <div className="space-y-4">
            {journals.map((j) => (
              <div key={j.name} className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-sm transition-shadow">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-foreground">{j.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    <span className="text-accent">{j.indexing}</span>{", "}
                    <span className="text-afrika-green">IF {j.impact}</span>{", "}
                    {j.openAccess ? <span className="text-primary">Open Access</span> : <span>Peer-reviewed</span>}{", "}{j.deadline}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs gap-1"><ExternalLink className="h-3 w-3" /> Details</Button>
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
                        </div>
                        <Link to="/dashboard/publishing/submit">
                          <Button variant="afrika" size="sm" className="w-full gap-1"><Send className="h-3 w-3" /> Submit Paper</Button>
                        </Link>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Link to="/dashboard/publishing/submit">
                    <Button variant="afrika" size="sm" className="text-xs gap-1"><Send className="h-3 w-3" /> Submit</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONFERENCES */}
        {activeTab === "conferences" && (
          <div className="space-y-4">
            {conferences.map((c) => (
              <div key={c.name} className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent shrink-0" />
                    <h3 className="text-sm font-bold text-foreground">{c.name}</h3>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {c.date}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.location}</span>
                  </div>
                  <p className="text-xs text-accent mt-0.5">Submission deadline: {c.deadline}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className={`text-[10px] ${statusColor[c.status]}`}>{c.status}</Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs">View</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>{c.name}</DialogTitle></DialogHeader>
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><span className="text-muted-foreground">Date:</span> {c.date}</div>
                          <div><span className="text-muted-foreground">Location:</span> {c.location}</div>
                          <div><span className="text-muted-foreground">Deadline:</span> {c.deadline}</div>
                          <div><span className="text-muted-foreground">Field:</span> {c.field}</div>
                        </div>
                        <div className="flex gap-2">
                          <a href={c.website} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="gap-1 text-xs"><Globe className="h-3 w-3" /> Website</Button>
                          </a>
                          <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => toast({ title: "Reminder set" })}>🔔 Remind Me</Button>
                        </div>
                        <Button variant="afrika" size="sm" className="w-full gap-1" onClick={() => {
                          const cal = `BEGIN:VCALENDAR\nBEGIN:VEVENT\nSUMMARY:${c.name}\nDTSTART:20260315\nLOCATION:${c.location}\nEND:VEVENT\nEND:VCALENDAR`;
                          const blob = new Blob([cal], { type: "text/calendar" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a"); a.href = url; a.download = `${c.name}.ics`; a.click();
                        }}>
                          <Calendar className="h-3 w-3" /> Add to Calendar
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant={savedConferences.includes(c.name) ? "secondary" : "outline"} size="sm" className="text-xs" onClick={() => saveConference(c.name)}>
                    {savedConferences.includes(c.name) ? "✓ Saved" : "Save"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STAKEHOLDERS */}
        {activeTab === "stakeholders" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stakeholders.map((s) => (
                <div key={s.name} className="bg-card rounded-xl border border-border p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                      {s.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-foreground">{s.name}</h3>
                      <p className="text-xs text-accent">{s.role}</p>
                      <p className="text-xs text-muted-foreground">{s.institution}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {s.expertise.map((e) => <Badge key={e} variant="secondary" className="text-[10px]">{e}</Badge>)}
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs gap-1"><Users className="h-3 w-3" /> Connect</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Connect with {s.name}</DialogTitle></DialogHeader>
                        <p className="text-sm text-muted-foreground">Send a connection request to {s.name} at {s.institution}.</p>
                        <Input placeholder="Add a message..." className="mt-2" />
                        <Button variant="afrika" size="sm" className="w-full mt-2" onClick={() => toast({ title: "Request sent", description: `Connection request sent to ${s.name}.` })}>Send Request</Button>
                      </DialogContent>
                    </Dialog>
                    <Link to={`/dashboard/messages?user=${encodeURIComponent(s.name)}`}>
                      <Button variant="ghost" size="sm" className="text-xs gap-1"><MessageCircle className="h-3 w-3" /> Message</Button>
                    </Link>
                    <a href={`mailto:${s.email}?subject=Research Collaboration&body=Dear ${s.name},%0D%0A%0D%0AI am writing to explore a potential research collaboration...`}>
                      <Button variant="ghost" size="sm" className="text-xs gap-1"><Mail className="h-3 w-3" /> Email</Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground text-center">⚠ Stakeholder profiles are AI-generated. Verify before outreach.</p>
          </div>
        )}

        {/* RESEARCH GAPS */}
        {activeTab === "gaps" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gaps.map((g) => (
              <div key={g.title} className="bg-card rounded-xl border border-border p-5 space-y-3">
                <Badge className={`text-[10px] ${impactColor[g.impact]}`}>{g.impact} IMPACT</Badge>
                <h3 className="text-sm font-bold text-foreground">{g.title}</h3>
                <p className="text-xs text-muted-foreground">{g.desc}</p>
                <div className="bg-secondary rounded-lg p-2">
                  <p className="text-[10px] text-muted-foreground flex items-start gap-1"><Lightbulb className="h-3 w-3 text-accent shrink-0 mt-0.5" /> {g.direction}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Link to={`/dashboard/generate-paper?topic=${encodeURIComponent(g.title)}`}>
                    <Button variant="afrika" size="sm" className="w-full gap-1 text-xs"><FileText className="h-3 w-3" /> Generate Proposal</Button>
                  </Link>
                  <Link to={`/dashboard/instrument-studio?prompt=${encodeURIComponent(g.direction)}`}>
                    <Button variant="outline" size="sm" className="w-full gap-1 text-xs"><Wrench className="h-3 w-3" /> Create Instrument</Button>
                  </Link>
                  <Link to={`/dashboard/community?post=${encodeURIComponent(`Discussing research gap: ${g.title}`)}`}>
                    <Button variant="ghost" size="sm" className="w-full gap-1 text-xs"><MessageCircle className="h-3 w-3" /> Discuss</Button>
                  </Link>
                  <Button variant={savedGaps.includes(g.title) ? "secondary" : "ghost"} size="sm" className="w-full gap-1 text-xs" onClick={() => saveGap(g.title)}>
                    <Save className="h-3 w-3" /> {savedGaps.includes(g.title) ? "Saved" : "Save to Research List"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TRENDS */}
        {activeTab === "trends" && (
          <div className="space-y-4">
            {trends.map((t) => (
              <div key={t.title} className="bg-card rounded-xl border border-border p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {t.direction === "up" ? <ArrowUpRight className="h-4 w-4 text-afrika-green" /> : <ArrowDownRight className="h-4 w-4 text-destructive" />}
                    <h3 className="text-sm font-bold text-foreground">{t.title}</h3>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${t.direction === "up" ? "text-afrika-green border-afrika-green/30" : "text-destructive border-destructive/30"}`}>
                    {t.change}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-[10px]">{t.region}</Badge>
                  {t.tags.map((tag) => <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>)}
                </div>
                <p className="text-xs text-muted-foreground">{t.explanation}</p>
                <div className="flex gap-2 flex-wrap">
                  <Button variant={savedTrends.includes(t.title) ? "secondary" : "outline"} size="sm" className="text-xs gap-1" onClick={() => saveTrend(t.title)}>
                    {savedTrends.includes(t.title) ? "✓ In Interests" : "Add to My Interests"}
                  </Button>
                  <Link to={`/dashboard/generate-paper?topic=${encodeURIComponent(t.title)}`}>
                    <Button variant="afrika" size="sm" className="text-xs gap-1"><FileText className="h-3 w-3" /> Generate Outline</Button>
                  </Link>
                  <Link to={`/dashboard/instrument-studio?prompt=${encodeURIComponent(`Create a research instrument to measure trends in: ${t.title}`)}`}>
                    <Button variant="outline" size="sm" className="text-xs gap-1"><Wrench className="h-3 w-3" /> Create Instrument</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default IntelligenceHub;
