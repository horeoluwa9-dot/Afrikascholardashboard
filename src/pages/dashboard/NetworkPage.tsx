import { useRef, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Users2, Briefcase, Handshake, Search, UserPlus, ExternalLink,
  ChevronRight, Globe, MessageCircle, GraduationCap, MapPin,
  Building2, Clock, FileText, Send, ClipboardList, Eye,
  BookOpen, CheckCircle, XCircle, Lightbulb, User,
  TrendingUp, Wallet, CheckCircle2, DollarSign, Download,
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, ResponsiveContainer,
} from "recharts";
import { useNetwork } from "@/hooks/useNetwork";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { PAYMENTS } from "./EarningsPage";

const fmtNaira = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

const EARNINGS_CHART = [
  { month: "Jan", amount: 50000 },
  { month: "Feb", amount: 70000 },
  { month: "Mar", amount: 120000 },
  { month: "Apr", amount: 110000 },
];

const EarningsTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-md text-sm">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        <p className="text-accent font-bold">{fmtNaira(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const PaymentStatusBadge = ({ status }: { status: string }) =>
  status === "Paid" ? (
    <Badge className="bg-accent/15 text-accent border-accent/30 font-medium hover:bg-accent/15">
      <CheckCircle2 className="h-3 w-3 mr-1" /> Paid
    </Badge>
  ) : (
    <Badge className="bg-muted text-muted-foreground border-border font-medium hover:bg-muted">
      <Clock className="h-3 w-3 mr-1" /> Pending
    </Badge>
  );

const tabs = [
  { key: "overview", label: "Overview", icon: Globe },
  { key: "directory", label: "Academic Profiles", icon: Users2 },
  { key: "advisory", label: "Advisory Marketplace", icon: Lightbulb },
  { key: "jobs", label: "Job Opportunities", icon: Briefcase },
  { key: "applications", label: "My Applications", icon: ClipboardList },
  { key: "engagements", label: "Engagements", icon: Handshake },
  { key: "earnings", label: "Earnings", icon: Wallet },
];

// ── Demo fallback data ──
const DEMO_PROFILES = [
  { user_id: "demo-1", display_name: "Dr. Ama Mensah", discipline: "Epidemiology", institution: "University of Ghana", country: "Ghana", academic_title: "PhD", position: "Senior Lecturer", avatar_url: null },
  { user_id: "demo-2", display_name: "Dr. Tunde Adeyemi", discipline: "Data Science", institution: "University of Ibadan", country: "Nigeria", academic_title: "PhD", position: "Associate Professor", avatar_url: null },
  { user_id: "demo-3", display_name: "Dr. Fatima Bello", discipline: "Public Health", institution: "Ahmadu Bello University", country: "Nigeria", academic_title: "PhD", position: "Researcher", avatar_url: null },
  { user_id: "demo-4", display_name: "Dr. Grace Nwoye", discipline: "Environmental Science", institution: "University of Cape Town", country: "South Africa", academic_title: "PhD", position: "Postdoctoral Fellow", avatar_url: null },
  { user_id: "demo-5", display_name: "Prof. Ibrahim Sadiq", discipline: "Renewable Energy", institution: "University of Nairobi", country: "Kenya", academic_title: "Prof", position: "Professor", avatar_url: null },
  { user_id: "demo-6", display_name: "Dr. Kofi Mensah", discipline: "Agricultural Economics", institution: "Kwame Nkrumah University", country: "Ghana", academic_title: "PhD", position: "Lecturer", avatar_url: null },
];

const DEMO_ADVISORY = [
  { id: "demo-adv-1", user_id: "demo-1", specialization: "Epidemiological Modeling", services: ["Research Methodology", "Grant Writing", "Data Analysis"], hourly_rate: "$80/hr", is_available: true, profile: { display_name: "Dr. Ama Mensah", institution: "University of Ghana", avatar_url: null } },
  { id: "demo-adv-2", user_id: "demo-5", specialization: "Energy Policy & Sustainability", services: ["Policy Analysis", "Project Evaluation", "Peer Review"], hourly_rate: "$100/hr", is_available: true, profile: { display_name: "Prof. Ibrahim Sadiq", institution: "University of Nairobi", avatar_url: null } },
  { id: "demo-adv-3", user_id: "demo-2", specialization: "Machine Learning for Health", services: ["Statistical Analysis", "Dataset Curation", "Technical Writing"], hourly_rate: "$90/hr", is_available: true, profile: { display_name: "Dr. Tunde Adeyemi", institution: "University of Ibadan", avatar_url: null } },
];

const DEMO_JOBS = [
  { id: "demo-job-1", title: "Senior Research Fellow — AI & Public Health", institution: "African Institute of Health Sciences", location: "Accra, Ghana", description: "Lead AI-driven epidemiological research across West African healthcare systems. Collaborate with international teams on predictive health modeling.", requirements: "PhD in Computer Science, Public Health, or related field. 5+ years research experience.", job_type: "full-time", application_deadline: "2026-04-30T00:00:00Z", created_at: "2026-03-01T00:00:00Z", posted_by: null },
  { id: "demo-job-2", title: "Postdoctoral Researcher — Climate Policy", institution: "University of Cape Town", location: "Cape Town, South Africa", description: "Investigate climate policy frameworks across African nations with a focus on renewable energy transitions.", requirements: "PhD in Environmental Science or Policy. Strong publication record.", job_type: "contract", application_deadline: "2026-05-15T00:00:00Z", created_at: "2026-03-03T00:00:00Z", posted_by: null },
  { id: "demo-job-3", title: "Lecturer in Agricultural Economics", institution: "Makerere University", location: "Kampala, Uganda", description: "Teach undergraduate and graduate courses in agricultural economics. Conduct research on food security in East Africa.", requirements: "PhD in Agricultural Economics. Teaching experience preferred.", job_type: "full-time", application_deadline: "2026-06-01T00:00:00Z", created_at: "2026-03-05T00:00:00Z", posted_by: null },
  { id: "demo-job-4", title: "Research Assistant — Renewable Energy Data", institution: "University of Nairobi", location: "Nairobi, Kenya", description: "Support data collection and analysis for a multi-country renewable energy adoption study.", requirements: "Master's degree in progress or completed. Proficiency in R or Python.", job_type: "part-time", application_deadline: "2026-04-15T00:00:00Z", created_at: "2026-03-06T00:00:00Z", posted_by: null },
];

const DEMO_ENGAGEMENTS = [
  { id: "demo-eng-1", user_id: "demo", title: "Advisory — Health Data Analytics", institution: "WHO Africa Regional Office", engagement_type: "advisory", status: "active", start_date: "2026-01-15T00:00:00Z", end_date: null, description: "Providing advisory support on health data analytics infrastructure for 6 West African countries.", created_at: "2026-01-15T00:00:00Z" },
  { id: "demo-eng-2", user_id: "demo", title: "Collaborative Research — Food Security", institution: "African Development Bank", engagement_type: "collaboration", status: "active", start_date: "2025-11-01T00:00:00Z", end_date: "2026-06-30T00:00:00Z", description: "Joint research project analyzing food security patterns and agricultural productivity across the Sahel region.", created_at: "2025-11-01T00:00:00Z" },
  { id: "demo-eng-3", user_id: "demo", title: "Peer Review — Journal of African Energy Studies", institution: "Afrika Scholar Publishing", engagement_type: "peer_review", status: "completed", start_date: "2026-02-01T00:00:00Z", end_date: "2026-02-28T00:00:00Z", description: "Completed peer review of 3 manuscripts on renewable energy policy in sub-Saharan Africa.", created_at: "2026-02-01T00:00:00Z" },
];

const DEMO_CONNECTIONS = [
  { id: "demo-conn-1", requester_id: "demo", receiver_id: "demo-1", status: "accepted", created_at: "2026-01-10T00:00:00Z", profile: DEMO_PROFILES[0] },
  { id: "demo-conn-2", requester_id: "demo", receiver_id: "demo-2", status: "accepted", created_at: "2026-02-05T00:00:00Z", profile: DEMO_PROFILES[1] },
  { id: "demo-conn-3", requester_id: "demo-3", receiver_id: "demo", status: "pending", created_at: "2026-03-07T00:00:00Z", profile: DEMO_PROFILES[2] },
];

const NetworkPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const activeTab = searchParams.get("tab") || "overview";
  const setActiveTab = (tab: string) => setSearchParams({ tab });

  const [search, setSearch] = useState("");
  const [filterField, setFilterField] = useState("");
  const [filterCountry, setFilterCountry] = useState("");

  const {
    connections: dbConnections, advisoryProfiles: dbAdvisoryProfiles, advisoryRequests: dbAdvisoryRequests,
    jobs: dbJobs, applications, engagements: dbEngagements,
    allProfiles: dbAllProfiles, loading, connectedUserIds, pendingUserIds,
    sendConnectionRequest, submitAdvisoryRequest, submitApplication, withdrawApplication,
  } = useNetwork();

  // Use real data if available, otherwise fall back to demo data
  const allProfiles = dbAllProfiles.length > 0 ? dbAllProfiles : DEMO_PROFILES;
  const connections = dbConnections.length > 0 ? dbConnections : DEMO_CONNECTIONS as any[];
  const advisoryProfiles = dbAdvisoryProfiles.length > 0 ? dbAdvisoryProfiles : DEMO_ADVISORY as any[];
  const advisoryRequests = dbAdvisoryRequests;
  const jobs = dbJobs.length > 0 ? dbJobs : DEMO_JOBS as any[];
  const engagements = dbEngagements.length > 0 ? dbEngagements : DEMO_ENGAGEMENTS as any[];

  // Dialogs
  const [advisoryDialog, setAdvisoryDialog] = useState(false);
  const [advisoryTarget, setAdvisoryTarget] = useState<string>("");
  const [advisoryForm, setAdvisoryForm] = useState({ institution: "", topic: "", description: "", expected_duration: "" });

  const [applyDialog, setApplyDialog] = useState(false);
  const [applyJobId, setApplyJobId] = useState<string>("");
  const [applyForm, setApplyForm] = useState({ research_statement: "" });

  const [jobDetailDialog, setJobDetailDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);

  const [saving, setSaving] = useState(false);

  const acceptedConnections = connections.filter(c => c.status === "accepted");
  const activeEngagements = engagements.filter(e => e.status === "active");

  const filteredProfiles = allProfiles.filter(p => {
    if (search && !p.display_name?.toLowerCase().includes(search.toLowerCase()) &&
        !p.institution?.toLowerCase().includes(search.toLowerCase()) &&
        !p.discipline?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterField && !p.discipline?.toLowerCase().includes(filterField.toLowerCase())) return false;
    if (filterCountry && !p.country?.toLowerCase().includes(filterCountry.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="h-10 w-48 bg-card rounded animate-pulse" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-card rounded-xl border border-border animate-pulse" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Academic Network</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-serif">Academic Network</h1>
            <p className="text-sm text-muted-foreground mt-1">Connect, collaborate, and discover academic opportunities.</p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search network…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-accent text-accent-foreground"
                  : "bg-card text-foreground border border-border hover:bg-secondary"
              }`}>
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ====== OVERVIEW ====== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Connections", count: acceptedConnections.length, icon: Users2, color: "text-accent" },
                { label: "Advisory Requests", count: advisoryRequests.length, icon: Lightbulb, color: "text-primary" },
                { label: "Job Opportunities", count: jobs.length, icon: Briefcase, color: "text-afrika-green" },
                { label: "Active Engagements", count: activeEngagements.length, icon: Handshake, color: "text-accent" },
              ].map(card => (
                <div key={card.label} className="bg-card rounded-xl border border-border p-5">
                  <card.icon className={`h-5 w-5 ${card.color} mb-2`} />
                  <p className="text-2xl font-bold text-foreground">{card.count}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Recommended Researchers */}
            <div>
              <h2 className="text-base font-bold text-foreground mb-3">Recommended Researchers</h2>
              {allProfiles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {allProfiles.slice(0, 4).map(p => (
                    <div key={p.user_id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                        {(p.display_name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{p.display_name || "Researcher"}</p>
                        {p.discipline && <p className="text-xs text-muted-foreground truncate">{p.discipline}</p>}
                        {p.institution && <p className="text-[10px] text-muted-foreground truncate">{p.institution}</p>}
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <Link to={`/dashboard/researcher?user=${encodeURIComponent(p.display_name || "")}`}>
                          <Button variant="outline" size="sm" className="text-xs w-full gap-1"><Eye className="h-3 w-3" /> View</Button>
                        </Link>
                        {!connectedUserIds.has(p.user_id) && !pendingUserIds.has(p.user_id) ? (
                          <Button variant="afrika" size="sm" className="text-xs gap-1" onClick={() => sendConnectionRequest(p.user_id)}>
                            <UserPlus className="h-3 w-3" /> Connect
                          </Button>
                        ) : pendingUserIds.has(p.user_id) ? (
                          <Badge variant="outline" className="text-[10px] justify-center">Pending</Badge>
                        ) : (
                          <Badge className="bg-afrika-green/10 text-afrika-green text-[10px] justify-center">Connected</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                  <Users2 className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                  <h3 className="text-base font-semibold text-foreground mb-1">Join the Academic Network</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                    Connect with researchers, institutions, and advisory opportunities across Afrika Scholar.
                  </p>
                  <Link to="/dashboard/profile">
                    <Button variant="afrika" size="sm" className="gap-1.5"><User className="h-3.5 w-3.5" /> Complete Your Profile</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====== ACADEMIC PROFILES DIRECTORY ====== */}
        {activeTab === "directory" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <Input placeholder="Research field…" value={filterField} onChange={e => setFilterField(e.target.value)}
                className="max-w-[180px] text-sm" />
              <Input placeholder="Country…" value={filterCountry} onChange={e => setFilterCountry(e.target.value)}
                className="max-w-[160px] text-sm" />
              {(filterField || filterCountry) && (
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setFilterField(""); setFilterCountry(""); }}>
                  Clear Filters
                </Button>
              )}
            </div>

            {filteredProfiles.length > 0 ? (
              <div className="space-y-3">
                {filteredProfiles.map(p => (
                  <div key={p.user_id} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                        {(p.display_name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-foreground">{p.display_name || "Researcher"}</p>
                          {p.academic_title && <Badge variant="outline" className="text-[10px]">{p.academic_title}</Badge>}
                        </div>
                        {p.position && <p className="text-xs text-muted-foreground">{p.position} — {p.discipline}</p>}
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          {p.institution && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{p.institution}</span>}
                          {p.country && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.country}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 flex-wrap">
                      <Link to={`/dashboard/researcher?user=${encodeURIComponent(p.display_name || "")}`}>
                        <Button variant="outline" size="sm" className="text-xs gap-1"><Eye className="h-3 w-3" /> Profile</Button>
                      </Link>
                      {!connectedUserIds.has(p.user_id) && !pendingUserIds.has(p.user_id) ? (
                        <Button variant="afrika" size="sm" className="text-xs gap-1" onClick={() => sendConnectionRequest(p.user_id)}>
                          <UserPlus className="h-3 w-3" /> Connect
                        </Button>
                      ) : pendingUserIds.has(p.user_id) ? (
                        <Badge variant="outline" className="text-xs px-3 py-1.5">Pending</Badge>
                      ) : (
                        <Badge className="bg-afrika-green/10 text-afrika-green text-xs px-3 py-1.5">Connected</Badge>
                      )}
                      <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => {
                        setAdvisoryTarget(p.user_id);
                        setAdvisoryForm({ institution: "", topic: "", description: "", expected_duration: "" });
                        setAdvisoryDialog(true);
                      }}>
                        <Lightbulb className="h-3 w-3" /> Advisory
                      </Button>
                      <Link to="/dashboard/messages">
                        <Button variant="ghost" size="sm" className="text-xs gap-1"><MessageCircle className="h-3 w-3" /> Message</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <Users2 className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground">No researchers found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* ====== ADVISORY MARKETPLACE ====== */}
        {activeTab === "advisory" && (
          <div className="space-y-3">
            {advisoryProfiles.length > 0 ? (
              advisoryProfiles.filter(a => a.user_id !== user?.id).map(adv => (
                <div key={adv.id} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold shrink-0">
                        {(adv.profile?.display_name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{adv.profile?.display_name || "Advisor"}</p>
                        <p className="text-xs text-accent font-medium">{adv.specialization}</p>
                        {adv.profile?.institution && (
                          <p className="text-xs text-muted-foreground mt-0.5">{adv.profile.institution}</p>
                        )}
                        {adv.services.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {adv.services.map(s => (
                              <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Link to={`/dashboard/researcher?user=${encodeURIComponent(adv.profile?.display_name || "")}`}>
                        <Button variant="outline" size="sm" className="text-xs w-full gap-1"><Eye className="h-3 w-3" /> Profile</Button>
                      </Link>
                      <Button variant="afrika" size="sm" className="text-xs gap-1" onClick={() => {
                        setAdvisoryTarget(adv.user_id);
                        setAdvisoryForm({ institution: "", topic: "", description: "", expected_duration: "" });
                        setAdvisoryDialog(true);
                      }}>
                        <Send className="h-3 w-3" /> Request Advisory
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <Lightbulb className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground">No advisory profiles available yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Check back later or explore the academic directory.</p>
              </div>
            )}
          </div>
        )}

        {/* ====== JOB OPPORTUNITIES ====== */}
        {activeTab === "jobs" && (
          <div className="space-y-3">
            {jobs.length > 0 ? (
              jobs.filter(j => !search || j.title.toLowerCase().includes(search.toLowerCase())).map(job => (
                <div key={job.id} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">{job.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{job.institution}</span>
                        {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {job.job_type && <Badge variant="secondary" className="text-[10px] capitalize">{job.job_type}</Badge>}
                        {job.application_deadline && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Deadline: {format(new Date(job.application_deadline), "dd MMM yyyy")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => {
                        setSelectedJob(job);
                        setJobDetailDialog(true);
                      }}>
                        <Eye className="h-3 w-3" /> Details
                      </Button>
                      <Button variant="afrika" size="sm" className="text-xs gap-1" onClick={() => {
                        setApplyJobId(job.id);
                        setApplyForm({ research_statement: "" });
                        setApplyDialog(true);
                      }}>
                        <Send className="h-3 w-3" /> Apply
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <Briefcase className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground">No academic opportunities available yet.</p>
                <p className="text-xs text-muted-foreground mt-1">New opportunities will appear here as they are posted.</p>
              </div>
            )}
          </div>
        )}

        {/* ====== MY APPLICATIONS ====== */}
        {activeTab === "applications" && (
          <div>
            {applications.length > 0 ? (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 p-4 bg-secondary/50 border-b border-border text-xs font-semibold text-muted-foreground">
                  <span>Position</span>
                  <span>Institution</span>
                  <span>Date</span>
                  <span>Status</span>
                </div>
                {applications.map(app => (
                  <div key={app.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 p-4 border-b border-border last:border-0 items-center">
                    <p className="text-sm font-medium text-foreground truncate">{app.job?.title || "Position"}</p>
                    <span className="text-xs text-muted-foreground">{app.job?.institution || "—"}</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(app.created_at), "dd MMM yyyy")}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-[10px] capitalize ${
                        app.status === "submitted" ? "bg-accent/10 text-accent border-accent/30" :
                        app.status === "accepted" ? "bg-afrika-green/10 text-afrika-green border-afrika-green/30" :
                        app.status === "rejected" ? "bg-destructive/10 text-destructive border-destructive/30" : ""
                      }`}>
                        {app.status === "submitted" ? "Under Review" : app.status}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-xs hover:text-destructive" onClick={() => withdrawApplication(app.id)}>
                        Withdraw
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground">No applications submitted yet.</p>
                <Button variant="afrika" size="sm" className="mt-3 gap-1.5" onClick={() => setActiveTab("jobs")}>
                  <Briefcase className="h-3.5 w-3.5" /> Browse Opportunities
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ====== ENGAGEMENTS ====== */}
        {activeTab === "engagements" && (
          <div className="space-y-3">
            {engagements.length > 0 ? (
              engagements.map(eng => (
                <div key={eng.id} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground">{eng.title}</h3>
                      {eng.institution && (
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {eng.institution}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={`text-[10px] capitalize ${
                          eng.status === "active" ? "bg-afrika-green/10 text-afrika-green border-afrika-green/30" :
                          eng.status === "completed" ? "bg-primary/10 text-primary border-primary/30" : ""
                        }`}>
                          {eng.status}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] capitalize">{eng.engagement_type}</Badge>
                        {eng.start_date && (
                          <span className="text-[10px] text-muted-foreground">
                            Started {format(new Date(eng.start_date), "dd MMM yyyy")}
                          </span>
                        )}
                      </div>
                      {eng.description && (
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{eng.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <Button variant="outline" size="sm" className="text-xs gap-1"><Eye className="h-3 w-3" /> Details</Button>
                      <Link to="/dashboard/messages">
                        <Button variant="ghost" size="sm" className="text-xs gap-1 w-full"><MessageCircle className="h-3 w-3" /> Message</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <Handshake className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground">No academic engagements yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Engagements from advisory work and collaborations will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== DIALOGS ===== */}

      {/* Advisory Request */}
      <Dialog open={advisoryDialog} onOpenChange={setAdvisoryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Request Advisory</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Institution / Organization</Label><Input className="mt-1" value={advisoryForm.institution} onChange={e => setAdvisoryForm(f => ({ ...f, institution: e.target.value }))} placeholder="e.g. Ministry of Energy" /></div>
            <div><Label>Advisory Topic</Label><Input className="mt-1" value={advisoryForm.topic} onChange={e => setAdvisoryForm(f => ({ ...f, topic: e.target.value }))} placeholder="e.g. Renewable Energy Policy" /></div>
            <div><Label>Project Description</Label><Textarea className="mt-1" rows={3} value={advisoryForm.description} onChange={e => setAdvisoryForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the advisory support you need..." /></div>
            <div><Label>Expected Duration</Label><Input className="mt-1" value={advisoryForm.expected_duration} onChange={e => setAdvisoryForm(f => ({ ...f, expected_duration: e.target.value }))} placeholder="e.g. 3 months" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setAdvisoryDialog(false)}>Cancel</Button>
            <Button variant="afrika" size="sm" disabled={saving || !advisoryForm.topic.trim()} onClick={async () => {
              setSaving(true);
              await submitAdvisoryRequest({
                advisor_id: advisoryTarget,
                institution: advisoryForm.institution || null,
                topic: advisoryForm.topic,
                description: advisoryForm.description || null,
                expected_duration: advisoryForm.expected_duration || null,
              });
              setSaving(false);
              setAdvisoryDialog(false);
            }}>{saving ? "Submitting..." : "Submit Request"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Job Application */}
      <Dialog open={applyDialog} onOpenChange={setApplyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Apply for Position</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">CV and cover letter upload coming soon. Please include your research statement below.</p>
            <div>
              <Label>Statement of Research Interests</Label>
              <Textarea className="mt-1" rows={5} value={applyForm.research_statement}
                onChange={e => setApplyForm(f => ({ ...f, research_statement: e.target.value }))}
                placeholder="Describe your research experience and interests related to this role..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setApplyDialog(false)}>Cancel</Button>
            <Button variant="afrika" size="sm" disabled={saving || !applyForm.research_statement.trim()} onClick={async () => {
              setSaving(true);
              await submitApplication(applyJobId, { research_statement: applyForm.research_statement });
              setSaving(false);
              setApplyDialog(false);
            }}>{saving ? "Submitting..." : "Submit Application"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Job Detail */}
      <Dialog open={jobDetailDialog} onOpenChange={setJobDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selectedJob?.title}</DialogTitle></DialogHeader>
          {selectedJob && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {selectedJob.institution}</span>
                {selectedJob.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {selectedJob.location}</span>}
              </div>
              {selectedJob.description && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedJob.description}</p>
                </div>
              )}
              {selectedJob.requirements && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground mb-1">Requirements</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedJob.requirements}</p>
                </div>
              )}
              {selectedJob.application_deadline && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Deadline: {format(new Date(selectedJob.application_deadline), "dd MMMM yyyy")}
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setJobDetailDialog(false)}>Close</Button>
            <Button variant="afrika" size="sm" className="gap-1" onClick={() => {
              setJobDetailDialog(false);
              if (selectedJob) {
                setApplyJobId(selectedJob.id);
                setApplyForm({ research_statement: "" });
                setApplyDialog(true);
              }
            }}><Send className="h-3 w-3" /> Apply Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default NetworkPage;
