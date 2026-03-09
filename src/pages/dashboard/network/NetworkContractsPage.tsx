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
import { Separator } from "@/components/ui/separator";
import {
  FileSignature, CheckCircle, Clock, Banknote, Search, Eye, Pencil,
  ListFilter, Building2, User, Calendar, Receipt,
} from "lucide-react";
import { toast } from "sonner";

interface Milestone {
  title: string;
  amount: string;
  completed: boolean;
}

interface Contract {
  id: string;
  title: string;
  academicPartner: string;
  institution: string;
  engagementType: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "pending";
  totalValue: string;
  paymentSchedule: string;
  milestones: Milestone[];
}

const DEMO_CONTRACTS: Contract[] = [
  {
    id: "1", title: "AI for Public Health Course", academicPartner: "Dr. Kofi Mensah",
    institution: "University of Cape Town", engagementType: "Short Course Instructor",
    startDate: "2026-04-10", endDate: "2026-06-10", status: "active",
    totalValue: "₦350,000", paymentSchedule: "Milestone Based",
    milestones: [
      { title: "Course Outline Approval", amount: "₦100,000", completed: true },
      { title: "Course Delivery", amount: "₦250,000", completed: false },
    ],
  },
  {
    id: "2", title: "Climate Adaptation Policy Research", academicPartner: "Dr. Amina Bello",
    institution: "University of Lagos", engagementType: "Curriculum Development",
    startDate: "2026-02-01", endDate: "2026-05-31", status: "active",
    totalValue: "₦500,000", paymentSchedule: "Monthly",
    milestones: [
      { title: "Literature Review", amount: "₦150,000", completed: true },
      { title: "Policy Framework Draft", amount: "₦200,000", completed: true },
      { title: "Final Report", amount: "₦150,000", completed: false },
    ],
  },
  {
    id: "3", title: "Renewable Energy Workshop Series", academicPartner: "Prof. Kwame Asante",
    institution: "University of Ghana", engagementType: "Workshop Facilitator",
    startDate: "2025-11-01", endDate: "2026-01-31", status: "completed",
    totalValue: "₦280,000", paymentSchedule: "Milestone Based",
    milestones: [
      { title: "Workshop Materials", amount: "₦80,000", completed: true },
      { title: "Workshop Delivery", amount: "₦200,000", completed: true },
    ],
  },
  {
    id: "4", title: "Data Science Curriculum Advisory", academicPartner: "Dr. Fatou Diallo",
    institution: "Université Cheikh Anta Diop", engagementType: "Advisory",
    startDate: "2026-04-15", endDate: "2026-07-15", status: "pending",
    totalValue: "₦420,000", paymentSchedule: "Milestone Based",
    milestones: [
      { title: "Needs Assessment", amount: "₦120,000", completed: false },
      { title: "Curriculum Design", amount: "₦300,000", completed: false },
    ],
  },
];

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  active: { label: "Active", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  pending: { label: "Pending", variant: "outline" },
};

const STATS = [
  { label: "Active Contracts", value: 8, icon: FileSignature, color: "text-accent", bg: "bg-accent/10" },
  { label: "Completed", value: 22, icon: CheckCircle, color: "text-afrika-green", bg: "bg-afrika-green/10" },
  { label: "Pending", value: 3, icon: Clock, color: "text-primary", bg: "bg-primary/10" },
  { label: "Total Value", value: "₦4.2M", icon: Banknote, color: "text-afrika-orange", bg: "bg-afrika-orange-light" },
];

const NetworkContractsPage = () => {
  const [selected, setSelected] = useState<Contract | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = DEMO_CONTRACTS.filter((c) => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.academicPartner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAction = (action: string, title: string) => {
    toast.success(`${action}: ${title}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Contracts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage agreements and payments for academic collaborations.
          </p>
        </div>

        {/* Summary Cards */}
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
            <Input placeholder="Search by title or academic partner..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <ListFilter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
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
                  <TableHead>Contract Title</TableHead>
                  <TableHead className="hidden md:table-cell">Academic Partner</TableHead>
                  <TableHead className="hidden lg:table-cell">Contract Value</TableHead>
                  <TableHead className="hidden md:table-cell">Start</TableHead>
                  <TableHead className="hidden md:table-cell">End</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => {
                  const st = STATUS_MAP[c.status];
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium text-foreground">{c.title}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{c.academicPartner}</TableCell>
                      <TableCell className="hidden lg:table-cell font-semibold text-accent">{c.totalValue}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {new Date(c.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {new Date(c.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </TableCell>
                      <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setSelected(c)}><Eye className="h-3.5 w-3.5" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => handleAction("Edit terms", c.title)}><Pencil className="h-3.5 w-3.5" /></Button>
                          {c.status === "active" && (
                            <Button size="sm" variant="ghost" onClick={() => handleAction("Marked complete", c.title)}><CheckCircle className="h-3.5 w-3.5" /></Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No contracts found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Contract Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg">{selected.title}</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
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
                    <FileSignature className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">Engagement Type</p>
                      <p className="text-sm font-medium text-foreground">{selected.engagementType}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">Duration</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(selected.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {new Date(selected.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                <section>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Payment Details</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Total Contract Value</span>
                    <span className="text-sm font-bold text-foreground">{selected.totalValue}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Payment Schedule</span>
                    <Badge variant="secondary">{selected.paymentSchedule}</Badge>
                  </div>

                  <div className="space-y-2">
                    {selected.milestones.map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                        <div className="flex items-center gap-2">
                          {m.completed ? (
                            <CheckCircle className="h-4 w-4 text-afrika-green" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={`text-sm ${m.completed ? "text-muted-foreground line-through" : "text-foreground font-medium"}`}>{m.title}</span>
                        </div>
                        <span className="text-sm font-semibold text-foreground">{m.amount}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <Separator />

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleAction("Invoice generated for", selected.title)}>
                    <Receipt className="h-3.5 w-3.5 mr-1.5" /> Generate Invoice
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAction("Milestone marked complete for", selected.title)}>
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Mark Milestone
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleAction("Contract closed", selected.title)}>
                    Close Contract
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

export default NetworkContractsPage;
