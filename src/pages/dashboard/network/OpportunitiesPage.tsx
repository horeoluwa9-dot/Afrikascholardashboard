import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Plus, Eye, Search, Building2, Clock, Banknote, Briefcase, Users2, ListFilter, Send, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useAppNotifications } from "@/hooks/useAppNotifications";

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  engagementType: string;
  description: string;
  duration: string;
  payment: string;
  status: "open" | "closed" | "in_progress";
  createdAt: string;
  applications: number;
}

const DEMO_OPPORTUNITIES: Opportunity[] = [
  {
    id: "1", title: "AI & Public Health Course Instructor", organization: "African Health Institute",
    engagementType: "Short Course Instructor", description: "Design and deliver a 6-week course on AI applications in public health for graduate students.", 
    duration: "6 weeks", payment: "₦350,000", status: "open", createdAt: "2026-03-08", applications: 12,
  },
  {
    id: "2", title: "Climate Adaptation Policy Advisor", organization: "UNEP Africa",
    engagementType: "Advisory Work", description: "Provide expert advisory on climate adaptation policies for East African nations.",
    duration: "3 months", payment: "₦500,000", status: "open", createdAt: "2026-03-05", applications: 8,
  },
  {
    id: "3", title: "Agricultural Economics Research Lead", organization: "FAO Regional Office",
    engagementType: "Research Collaboration", description: "Lead a multi-country research study on agricultural innovation systems in West Africa.",
    duration: "6 months", payment: "₦750,000", status: "in_progress", createdAt: "2026-02-20", applications: 15,
  },
  {
    id: "4", title: "Digital Literacy Curriculum Developer", organization: "African Development Bank",
    engagementType: "Curriculum Development", description: "Develop a comprehensive digital skills curriculum for youth training programs.",
    duration: "4 months", payment: "₦420,000", status: "closed", createdAt: "2026-01-15", applications: 22,
  },
];

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  open: { label: "Open", variant: "default" },
  in_progress: { label: "In Progress", variant: "secondary" },
  closed: { label: "Closed", variant: "outline" },
};

const ENGAGEMENT_TYPES = [
  "Research Collaboration",
  "Short Course Instructor",
  "Curriculum Development",
  "Advisory Work",
  "Peer Review",
  "Consulting",
];

const OpportunitiesPage = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [applyOpp, setApplyOpp] = useState<Opportunity | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { profile } = useAuth();
  const { add } = useAppNotifications();
  const [appForm, setAppForm] = useState({ statement: "", experience: "", availability: "", file: null as File | null });

  const filtered = DEMO_OPPORTUNITIES.filter((o) => {
    const matchSearch = !search || o.title.toLowerCase().includes(search.toLowerCase()) || o.organization.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || o.engagementType === typeFilter;
    return matchSearch && matchType;
  });

  const submitApply = () => {
    if (!appForm.statement.trim()) { toast.error("Please complete your statement"); return; }
    setSubmitted(true);
    add({
      category: "Network",
      title: "Application submitted",
      description: `Your interest in "${applyOpp?.title}" was shared with ${applyOpp?.organization}.`,
      link: "/dashboard/network/applications",
    });
  };
  const closeApply = () => { setApplyOpp(null); setSubmitted(false); setAppForm({ statement: "", experience: "", availability: "", file: null }); };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-serif">Opportunities</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Post academic roles, consulting requests, and research collaborations.
            </p>
          </div>
          {/* Posting opportunities is reserved for institutions */}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search opportunities..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <ListFilter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Engagement type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {ENGAGEMENT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((opp) => {
            const st = STATUS_MAP[opp.status];
            return (
              <Card key={opp.id} className="border-border hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-4 px-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-foreground leading-tight">{opp.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{opp.organization}</span>
                      </div>
                    </div>
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{opp.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">{opp.engagementType}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">{opp.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Banknote className="h-3.5 w-3.5 text-accent" />
                      <span className="font-semibold text-accent">{opp.payment}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users2 className="h-3.5 w-3.5" />
                      <span>{opp.applications} applications</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setSelectedOpp(opp)}>
                        <Eye className="h-3 w-3 mr-1" /> Details
                      </Button>
                      {opp.status === "open" && (
                        <Button size="sm" className="text-xs h-7 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => setApplyOpp(opp)}>
                          <Send className="h-3 w-3 mr-1" /> Apply
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <Briefcase className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="font-semibold text-foreground">No opportunities found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Apply Dialog */}
      <Dialog open={!!applyOpp} onOpenChange={(o) => !o && closeApply()}>
        <DialogContent className="max-w-lg">
          {!submitted ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif">Apply: {applyOpp?.title}</DialogTitle>
                <p className="text-xs text-muted-foreground">{applyOpp?.organization}</p>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <section className="bg-secondary/40 rounded-md p-3 space-y-1">
                  <p className="text-[11px] uppercase text-muted-foreground tracking-wide">Basic Info</p>
                  <div className="text-sm"><strong>{profile?.display_name || "—"}</strong></div>
                  <div className="text-xs text-muted-foreground">{profile?.discipline || "Discipline not set"}</div>
                  <div className="text-xs text-muted-foreground">{profile?.institution || "Institution not set"}</div>
                </section>
                <div className="space-y-1.5">
                  <Label>Why are you a good fit for this opportunity? *</Label>
                  <Textarea rows={5} maxLength={3000} value={appForm.statement} onChange={(e) => setAppForm({ ...appForm, statement: e.target.value })} placeholder="Share why this opportunity is a strong fit..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Highlight relevant experience (optional)</Label>
                  <Textarea rows={3} value={appForm.experience} onChange={(e) => setAppForm({ ...appForm, experience: e.target.value })} placeholder="Teaching, research, related projects..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Availability</Label>
                  <Select value={appForm.availability} onValueChange={(v) => setAppForm({ ...appForm, availability: v })}>
                    <SelectTrigger><SelectValue placeholder="Select availability" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediately Available</SelectItem>
                      <SelectItem value="1-2 weeks">Available within 1–2 weeks</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Attach Supporting Document (optional)</Label>
                  <Input type="file" onChange={(e) => setAppForm({ ...appForm, file: e.target.files?.[0] || null })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeApply}>Cancel</Button>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1" onClick={submitApply}>
                  <Send className="h-3.5 w-3.5" /> Submit Interest
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="h-10 w-10 text-afrika-green mx-auto" />
              <h3 className="text-lg font-bold text-foreground">Interest Submitted</h3>
              <p className="text-sm text-muted-foreground">Your interest has been shared with the institution. You will be notified if selected.</p>
              <div className="flex gap-2 justify-center pt-2">
                <Button variant="afrikaOutline" onClick={closeApply}>Close</Button>
                <Link to="/dashboard/network/applications"><Button variant="afrika">View My Applications</Button></Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Opportunity Detail Sheet */}
      <Sheet open={!!selectedOpp} onOpenChange={() => setSelectedOpp(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selectedOpp && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg">{selectedOpp.title}</SheetTitle>
                <p className="text-sm text-muted-foreground">{selectedOpp.organization}</p>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={STATUS_MAP[selectedOpp.status].variant}>{STATUS_MAP[selectedOpp.status].label}</Badge>
                  <Badge variant="secondary">{selectedOpp.engagementType}</Badge>
                </div>
                <section>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-sm text-foreground">{selectedOpp.description}</p>
                </section>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-medium text-foreground">{selectedOpp.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment</p>
                    <p className="text-sm font-bold text-accent">{selectedOpp.payment}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Applications</p>
                    <p className="text-sm font-medium text-foreground">{selectedOpp.applications}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Posted</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(selectedOpp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
                {selectedOpp.status === "open" && (
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => {
                    setApplyOpp(selectedOpp);
                    setSelectedOpp(null);
                  }}>
                    <Send className="h-4 w-4 mr-2" /> Apply Now
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default OpportunitiesPage;
