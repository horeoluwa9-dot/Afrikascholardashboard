import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Inbox, UserCheck, CheckCircle, XCircle, Search, Eye, Star, ListFilter,
  FileText, Briefcase, GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

interface Application {
  id: string;
  applicantName: string;
  institution: string;
  expertise: string;
  opportunity: string;
  applicationDate: string;
  status: "under_review" | "shortlisted" | "accepted" | "declined";
  bio: string;
  researchInterests: string[];
  publications: string[];
  pastEngagements: string[];
}

const DEMO_APPLICATIONS: Application[] = [
  {
    id: "1", applicantName: "Dr. Amina Bello", institution: "University of Lagos",
    expertise: "Public Health Policy", opportunity: "AI & Public Health Course Instructor",
    applicationDate: "2026-03-14", status: "under_review",
    bio: "Specialist in public health policy with 12 years of research experience across West Africa.",
    researchInterests: ["Epidemiological modeling", "Health systems", "Data-driven policy"],
    publications: ["Health Policy in West Africa (2025)", "Epidemiological Trends in Nigeria (2024)"],
    pastEngagements: ["WHO Advisory Panel 2024", "Lagos State Health Ministry Consultant"],
  },
  {
    id: "2", applicantName: "Prof. Kwame Asante", institution: "University of Ghana",
    expertise: "Agricultural Economics", opportunity: "Climate Adaptation Policy Advisor",
    applicationDate: "2026-03-12", status: "shortlisted",
    bio: "Leading researcher in agricultural economics and climate adaptation strategies.",
    researchInterests: ["Climate adaptation", "Food security", "Rural development"],
    publications: ["Climate-Smart Farming in Ghana (2025)", "Agricultural Policy Review (2024)"],
    pastEngagements: ["FAO Consultant 2023", "AGRA Research Fellow"],
  },
  {
    id: "3", applicantName: "Dr. Fatou Diallo", institution: "Université Cheikh Anta Diop",
    expertise: "Renewable Energy", opportunity: "Solar Energy Systems Lecturer",
    applicationDate: "2026-03-10", status: "accepted",
    bio: "Expert in renewable energy systems with focus on solar technology in Sub-Saharan Africa.",
    researchInterests: ["Solar photovoltaics", "Energy policy", "Sustainable development"],
    publications: ["Solar Energy Adoption in Senegal (2025)"],
    pastEngagements: ["UNDP Energy Advisor", "Senegal National Energy Agency"],
  },
  {
    id: "4", applicantName: "Dr. Chidi Okonkwo", institution: "University of Nigeria, Nsukka",
    expertise: "Computer Science", opportunity: "AI & Machine Learning Workshop Facilitator",
    applicationDate: "2026-03-08", status: "declined",
    bio: "AI researcher specializing in natural language processing for African languages.",
    researchInterests: ["NLP", "Machine learning", "African languages"],
    publications: ["NLP for Igbo Language (2025)", "AI Ethics in Africa (2024)"],
    pastEngagements: ["Google AI Research Grant 2024"],
  },
  {
    id: "5", applicantName: "Dr. Nalini Mwangi", institution: "University of Nairobi",
    expertise: "Environmental Science", opportunity: "Climate Policy Research Lead",
    applicationDate: "2026-03-06", status: "under_review",
    bio: "Environmental scientist focused on climate change impacts in East Africa.",
    researchInterests: ["Climate change", "Biodiversity", "Water resources"],
    publications: ["Climate Change Impacts on Lake Victoria (2025)"],
    pastEngagements: ["UNEP East Africa Regional Office"],
  },
];

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  under_review: { label: "Under Review", variant: "secondary" },
  shortlisted: { label: "Shortlisted", variant: "outline" },
  accepted: { label: "Accepted", variant: "default" },
  declined: { label: "Declined", variant: "destructive" },
};

const STATS = [
  { label: "Applications Received", value: 48, icon: Inbox, color: "text-accent", bg: "bg-accent/10" },
  { label: "Shortlisted", value: 12, icon: Star, color: "text-primary", bg: "bg-primary/10" },
  { label: "Accepted", value: 6, icon: CheckCircle, color: "text-afrika-green", bg: "bg-afrika-green/10" },
  { label: "Declined", value: 30, icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
];

const NetworkApplicationsPage = () => {
  const [selected, setSelected] = useState<Application | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = DEMO_APPLICATIONS.filter((a) => {
    const matchSearch = !search || a.applicantName.toLowerCase().includes(search.toLowerCase()) || a.opportunity.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAction = (action: string, name: string) => {
    toast.success(`${action}: ${name}`);
    setSelected(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review applications submitted by academics for your opportunities.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map((s) => (
            <Card key={s.label} className="border-border">
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                    <p className="text-xl font-bold text-foreground mt-0.5">{s.value}</p>
                  </div>
                  <div className={`h-9 w-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by applicant or opportunity..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <ListFilter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead className="hidden md:table-cell">Institution</TableHead>
                  <TableHead className="hidden lg:table-cell">Expertise</TableHead>
                  <TableHead>Opportunity</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((app) => {
                  const st = STATUS_MAP[app.status];
                  return (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium text-foreground">{app.applicantName}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{app.institution}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">{app.expertise}</TableCell>
                      <TableCell className="text-muted-foreground">{app.opportunity}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {new Date(app.applicationDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </TableCell>
                      <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setSelected(app)}><Eye className="h-3.5 w-3.5" /></Button>
                          {app.status === "under_review" && (
                            <>
                              <Button size="sm" variant="ghost" onClick={() => handleAction("Shortlisted", app.applicantName)}><Star className="h-3.5 w-3.5" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => handleAction("Accepted", app.applicantName)}><CheckCircle className="h-3.5 w-3.5" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => handleAction("Declined", app.applicantName)}><XCircle className="h-3.5 w-3.5" /></Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No applications found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Application Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg">{selected.applicantName}</SheetTitle>
                <p className="text-sm text-muted-foreground">{selected.institution}</p>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <section>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">About</h3>
                  <p className="text-sm text-foreground">{selected.bio}</p>
                </section>

                <section>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Applied For</h3>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-foreground">{selected.opportunity}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Expertise: {selected.expertise}</p>
                </section>

                <section>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Research Interests</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.researchInterests.map((r) => (
                      <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Publications</h3>
                  <ul className="space-y-1.5">
                    {selected.publications.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-foreground">
                        <FileText className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Past Engagements</h3>
                  <ul className="space-y-1.5">
                    {selected.pastEngagements.map((e) => (
                      <li key={e} className="flex items-start gap-2 text-sm text-foreground">
                        <GraduationCap className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                  <Button size="sm" variant="outline" onClick={() => handleAction("Shortlisted", selected.applicantName)}>
                    <Star className="h-3.5 w-3.5 mr-1.5" /> Shortlist
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAction("Invited to interview", selected.applicantName)}>
                    <UserCheck className="h-3.5 w-3.5 mr-1.5" /> Interview
                  </Button>
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleAction("Accepted", selected.applicantName)}>
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Accept
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default NetworkApplicationsPage;
