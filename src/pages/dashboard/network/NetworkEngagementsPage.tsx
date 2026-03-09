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
  Handshake, Clock, CheckCircle, Search, Eye, ListFilter, Building2, Calendar, User,
} from "lucide-react";
import { toast } from "sonner";

interface Engagement {
  id: string;
  title: string;
  academicPartner: string;
  institution: string;
  engagementType: string;
  startDate: string;
  endDate: string | null;
  status: "active" | "completed" | "pending";
  description: string;
  progress: number;
}

const DEMO_ENGAGEMENTS: Engagement[] = [
  {
    id: "1", title: "AI for Public Health Course", academicPartner: "Dr. Amina Bello",
    institution: "University of Lagos", engagementType: "Short Course Instructor",
    startDate: "2026-04-10", endDate: "2026-06-10", status: "active",
    description: "Development and delivery of a 6-week AI for Public Health course for graduate students.",
    progress: 35,
  },
  {
    id: "2", title: "Climate Adaptation Policy Research", academicPartner: "Prof. Kwame Asante",
    institution: "University of Ghana", engagementType: "Research Collaboration",
    startDate: "2026-02-01", endDate: "2026-07-31", status: "active",
    description: "Multi-country research study on climate adaptation policies in West Africa.",
    progress: 60,
  },
  {
    id: "3", title: "Renewable Energy Workshop", academicPartner: "Dr. Fatou Diallo",
    institution: "Université Cheikh Anta Diop", engagementType: "Workshop Facilitator",
    startDate: "2025-11-01", endDate: "2026-01-31", status: "completed",
    description: "Series of workshops on solar energy systems for engineering students.",
    progress: 100,
  },
  {
    id: "4", title: "Agricultural Data Analysis", academicPartner: "Dr. Ibrahim Sadiq",
    institution: "University of Nairobi", engagementType: "Advisory Work",
    startDate: "2026-05-01", endDate: null, status: "pending",
    description: "Advisory services for agricultural data collection and analysis project.",
    progress: 0,
  },
];

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  active: { label: "Active", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  pending: { label: "Pending", variant: "outline" },
};

const STATS = [
  { label: "Active Engagements", value: 8, icon: Handshake, color: "text-accent", bg: "bg-accent/10" },
  { label: "Completed", value: 22, icon: CheckCircle, color: "text-afrika-green", bg: "bg-afrika-green/10" },
  { label: "Pending", value: 3, icon: Clock, color: "text-primary", bg: "bg-primary/10" },
];

const NetworkEngagementsPage = () => {
  const [selected, setSelected] = useState<Engagement | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = DEMO_ENGAGEMENTS.filter((e) => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.academicPartner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Active Engagements</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track active academic collaborations and consulting projects.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
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
            <Input placeholder="Search engagements..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <ListFilter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card className="border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Title</TableHead>
                  <TableHead>Academic Partner</TableHead>
                  <TableHead className="hidden md:table-cell">Engagement Type</TableHead>
                  <TableHead className="hidden md:table-cell">Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((eng) => {
                  const st = STATUS_MAP[eng.status];
                  return (
                    <TableRow key={eng.id}>
                      <TableCell className="font-medium text-foreground">{eng.title}</TableCell>
                      <TableCell className="text-muted-foreground">{eng.academicPartner}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{eng.engagementType}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {new Date(eng.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </TableCell>
                      <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => setSelected(eng)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No engagements found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg">{selected.title}</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="flex gap-2">
                  <Badge variant={STATUS_MAP[selected.status].variant}>{STATUS_MAP[selected.status].label}</Badge>
                  <Badge variant="secondary">{selected.engagementType}</Badge>
                </div>

                <section className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">Academic Partner</p>
                      <p className="text-sm font-medium text-foreground">{selected.academicPartner}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">Institution</p>
                      <p className="text-sm font-medium text-foreground">{selected.institution}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">Start Date</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(selected.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  {selected.endDate && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-[11px] text-muted-foreground">End Date</p>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(selected.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  )}
                </section>

                <section>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-sm text-foreground">{selected.description}</p>
                </section>

                {selected.status === "active" && (
                  <section>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Progress</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${selected.progress}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{selected.progress}%</span>
                    </div>
                  </section>
                )}

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button size="sm" variant="outline" onClick={() => toast.success("Opened project details")}>
                    View Full Project
                  </Button>
                  {selected.status === "active" && (
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => {
                      toast.success("Marked as complete");
                      setSelected(null);
                    }}>
                      <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default NetworkEngagementsPage;
