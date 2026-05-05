import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Compass } from "lucide-react";
import { useAdvisoryCases, AdvisoryType, CaseStatus, TYPE_LABEL, STATUS_LABEL } from "@/hooks/useAdvisoryCases";
import { StatusBadge, CaseIdPill } from "@/components/dashboard/advisory/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(diff / 60000))}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const TYPE_OPTIONS: ({ v: "all" | AdvisoryType; label: string })[] = [
  { v: "all", label: "All" },
  { v: "transcript", label: "Transcript" },
  { v: "degree", label: "Degree" },
  { v: "study", label: "Study in Africa" },
  { v: "institutional", label: "Institutional" },
];

export default function MyCasesPage() {
  const { cases } = useAdvisoryCases();
  const [typeFilter, setTypeFilter] = useState<"all" | AdvisoryType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | CaseStatus>("all");

  const filtered = useMemo(() => cases.filter(c =>
    (typeFilter === "all" || c.type === typeFilter) &&
    (statusFilter === "all" || c.status === statusFilter)
  ), [cases, typeFilter, statusFilter]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Advisory Cases</h1>
            <p className="text-sm text-muted-foreground mt-1">All your advisory cases in one place.</p>
          </div>
          <Link to="/dashboard/advisory/new">
            <Button variant="afrika" className="gap-2"><Plus className="h-4 w-4" /> New Request</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {TYPE_OPTIONS.map(o => (
            <button
              key={o.v}
              onClick={() => setTypeFilter(o.v)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full border transition-colors",
                typeFilter === o.v ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-primary"
              )}
            >{o.label}</button>
          ))}
          <div className="ml-auto w-48">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="h-9"><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {(Object.keys(STATUS_LABEL) as CaseStatus[]).map(s => (
                  <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cases */}
        {filtered.length === 0 ? (
          <Card><CardContent className="py-16 text-center">
            <Compass className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">You have not submitted any advisory requests yet.</p>
            <Link to="/dashboard/advisory/new"><Button variant="afrika" className="mt-4">Start a Request</Button></Link>
          </CardContent></Card>
        ) : (
          <Card>
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/40">
                  <tr className="text-left text-xs uppercase text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Case ID</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium">Advisor</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Updated</th>
                    <th className="px-4 py-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer">
                      <td className="px-4 py-3"><CaseIdPill id={c.id} /></td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-md bg-secondary text-xs">{TYPE_LABEL[c.type]}</span></td>
                      <td className="px-4 py-3 max-w-xs truncate text-foreground">{c.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.advisor?.name || <span className="text-amber-600">Unassigned</span>}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{timeAgo(c.updatedAt)}</td>
                      <td className="px-4 py-3"><Link to={`/dashboard/advisory/cases/${c.id}`} className="text-primary text-sm hover:underline">View →</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border">
              {filtered.map(c => (
                <Link key={c.id} to={`/dashboard/advisory/cases/${c.id}`} className="block p-4 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CaseIdPill id={c.id} />
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.advisor?.name || "Unassigned"} · {timeAgo(c.updatedAt)}</p>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
