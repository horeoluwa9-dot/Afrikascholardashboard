import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Briefcase, Building2, Eye, Handshake, FileSignature, Wallet, CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { useAppNotifications } from "@/hooks/useAppNotifications";

type EStatus = "pending" | "active" | "submitted" | "completed";
type PStatus = "in_escrow" | "pending_release" | "paid";

interface Engagement {
  id: string; title: string; institution: string; type: string; startDate: string;
  status: EStatus; payment: PStatus; amount: string; scope: string; duration: string; terms: string; role: string;
}

const SEED: Engagement[] = [
  { id: "e1", title: "AI & Public Health Course", institution: "African Health Institute", type: "Short Course", startDate: "2026-04-25", status: "pending", payment: "in_escrow", amount: "₦350,000", role: "Course Instructor", scope: "Design and deliver a 6-week course.", duration: "6 weeks", terms: "Standard Afrika Scholar engagement terms apply." },
  { id: "e2", title: "Energy Policy Advisory", institution: "University of Ghana", type: "Advisory", startDate: "2026-03-01", status: "active", payment: "in_escrow", amount: "₦500,000", role: "Policy Advisor", scope: "Provide expert guidance on national energy policy.", duration: "3 months", terms: "Standard Afrika Scholar engagement terms apply." },
  { id: "e3", title: "Digital Literacy Curriculum Review", institution: "University of Nairobi", type: "Collaboration", startDate: "2025-09-15", status: "submitted", payment: "pending_release", amount: "₦420,000", role: "Reviewer", scope: "Review and feedback on curriculum.", duration: "4 months", terms: "Standard terms." },
  { id: "e4", title: "Pan-African Education Index", institution: "African Development Bank", type: "Collaboration", startDate: "2025-04-01", status: "completed", payment: "paid", amount: "₦750,000", role: "Lead Researcher", scope: "Develop standardized education quality metrics.", duration: "6 months", terms: "Standard terms." },
];

const E_STATUS: Record<EStatus, { label: string; cls: string; hint: string }> = {
  pending: { label: "Pending", cls: "bg-accent/15 text-accent", hint: "Accept to start work" },
  active: { label: "Active", cls: "bg-primary/15 text-primary", hint: "Continue work" },
  submitted: { label: "Submitted", cls: "bg-secondary text-foreground", hint: "Waiting for approval" },
  completed: { label: "Completed", cls: "bg-afrika-green/15 text-afrika-green", hint: "Engagement closed" },
};
const P_STATUS: Record<PStatus, { label: string; cls: string }> = {
  in_escrow: { label: "In Escrow", cls: "bg-secondary text-foreground" },
  pending_release: { label: "Pending Release", cls: "bg-accent/15 text-accent" },
  paid: { label: "Paid", cls: "bg-afrika-green/15 text-afrika-green" },
};

export default function NetworkEngagementsPage() {
  const [list, setList] = useState<Engagement[]>(SEED);
  const [view, setView] = useState<Engagement | null>(null);
  const { add } = useAppNotifications();

  const update = (id: string, patch: Partial<Engagement>) => {
    setList((prev) => prev.map((e) => e.id === id ? { ...e, ...patch } : e));
    setView((v) => v && v.id === id ? { ...v, ...patch } : v);
  };

  const accept = (e: Engagement) => {
    update(e.id, { status: "active" });
    add({ category: "Engagement", title: "Engagement activated", description: `You started "${e.title}"`, link: "/dashboard/network/engagements" });
    toast.success("Engagement is now Active");
  };
  const submitWork = (e: Engagement) => {
    update(e.id, { status: "submitted", payment: "pending_release" });
    toast.success("Work submitted — awaiting institution approval");
  };

  const counts = {
    pending: list.filter(e => e.status === "pending").length,
    active: list.filter(e => e.status === "active").length,
    submitted: list.filter(e => e.status === "submitted").length,
    completed: list.filter(e => e.status === "completed").length,
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">My Engagements</h1>
          <p className="text-sm text-muted-foreground mt-1">Track all advisory work, research partnerships, and collaborations.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Pending", value: counts.pending },
            { label: "Active", value: counts.active },
            { label: "Submitted", value: counts.submitted },
            { label: "Completed", value: counts.completed },
          ].map(s => (
            <Card key={s.label} className="border-border">
              <CardContent className="pt-4 pb-3 px-4">
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold text-foreground mt-0.5">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {list.length === 0 ? (
          <Card className="border-border border-dashed">
            <CardContent className="py-12 text-center space-y-3">
              <Briefcase className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="font-medium text-foreground">You have no engagements yet</p>
              <Link to="/dashboard/network/opportunities"><Button variant="afrika" size="sm">Browse Opportunities</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead className="hidden md:table-cell">Institution</TableHead>
                    <TableHead className="hidden lg:table-cell">Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((e) => {
                    const s = E_STATUS[e.status];
                    const p = P_STATUS[e.payment];
                    return (
                      <TableRow key={e.id}>
                        <TableCell>
                          <p className="text-sm font-medium text-foreground">{e.title}</p>
                          <p className="text-[11px] text-muted-foreground italic mt-0.5">{s.hint}</p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm text-muted-foreground inline-flex items-center gap-1"><Building2 className="h-3 w-3" />{e.institution}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {new Date(e.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </TableCell>
                        <TableCell><Badge className={`text-[10px] ${s.cls}`}>{s.label}</Badge></TableCell>
                        <TableCell><Badge className={`text-[10px] ${p.cls}`}>{p.label}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="ghost" className="h-8 text-xs gap-1" onClick={() => setView(e)}>
                              <Eye className="h-3 w-3" /> View Details
                            </Button>
                            {e.status === "pending" && (
                              <Button size="sm" variant="afrika" className="h-8 text-xs gap-1" onClick={() => accept(e)}>
                                <Handshake className="h-3 w-3" /> Accept
                              </Button>
                            )}
                            {e.status === "active" && (
                              <Button size="sm" variant="afrikaOutline" className="h-8 text-xs gap-1" onClick={() => submitWork(e)}>
                                <Send className="h-3 w-3" /> Submit Work
                              </Button>
                            )}
                            {e.status === "submitted" && (
                              <Button size="sm" variant="ghost" disabled className="h-8 text-xs">Waiting Approval</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Detail */}
        <Sheet open={!!view} onOpenChange={(o) => !o && setView(null)}>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            {view && (
              <>
                <SheetHeader>
                  <SheetTitle>{view.title}</SheetTitle>
                  <p className="text-sm text-muted-foreground">{view.institution}</p>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`text-[10px] ${E_STATUS[view.status].cls}`}>{E_STATUS[view.status].label}</Badge>
                    <Badge className={`text-[10px] ${P_STATUS[view.payment].cls}`}>{P_STATUS[view.payment].label}</Badge>
                  </div>

                  <section className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <FileSignature className="h-4 w-4 text-accent" />
                      <h3 className="text-sm font-semibold text-foreground">Contract / Agreement</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><p className="text-xs text-muted-foreground">Role</p><p className="font-medium text-foreground">{view.role}</p></div>
                      <div><p className="text-xs text-muted-foreground">Duration</p><p className="font-medium text-foreground">{view.duration}</p></div>
                      <div><p className="text-xs text-muted-foreground">Compensation</p><p className="font-medium text-foreground">{view.amount}</p></div>
                      <div><p className="text-xs text-muted-foreground">Start</p><p className="font-medium text-foreground">{new Date(view.startDate).toLocaleDateString()}</p></div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Scope of Work</p>
                      <p className="text-sm text-foreground">{view.scope}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Terms</p>
                      <p className="text-sm text-foreground">{view.terms}</p>
                    </div>
                    <div className="pt-2">
                      {view.status === "pending" && <Button size="sm" variant="afrika" className="gap-1" onClick={() => accept(view)}><Handshake className="h-3.5 w-3.5" /> Accept Contract</Button>}
                      {view.status === "active" && <Button size="sm" variant="afrikaOutline" className="gap-1"><FileSignature className="h-3.5 w-3.5" /> View Contract</Button>}
                      {view.status === "completed" && <Badge variant="secondary" className="text-[10px]">Archived Contract</Badge>}
                    </div>
                  </section>

                  <section className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="h-4 w-4 text-accent" />
                      <h3 className="text-sm font-semibold text-foreground">Payment</h3>
                    </div>
                    <p className="text-sm text-foreground">{view.amount} — <span className="text-muted-foreground">{P_STATUS[view.payment].label}</span></p>
                  </section>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </DashboardLayout>
  );
}
