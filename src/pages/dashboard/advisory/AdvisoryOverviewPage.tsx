import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdvisoryCases, TYPE_LABEL, STATUS_STAGE, STATUS_LABEL } from "@/hooks/useAdvisoryCases";
import { StatusBadge, CaseIdPill } from "@/components/dashboard/advisory/StatusBadge";
import {
  FolderOpen, Activity, FileCheck, AlertCircle, AlertTriangle, X,
  Upload, MessageCircle, Plus, ArrowRight, Compass,
} from "lucide-react";
import { useMemo, useState } from "react";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(diff / 60000))}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const AdvisoryOverviewPage = () => {
  const { cases } = useAdvisoryCases();
  const [dismissed, setDismissed] = useState(false);

  const stats = useMemo(() => {
    const active = cases.filter((c) => c.status !== "completed");
    const totalDocs = cases.flatMap((c) => c.docs);
    const submitted = totalDocs.filter((d) => d.status !== "missing").length;
    const required = totalDocs.length;
    const awaiting = active.filter((c) => c.docs.some((d) => d.status === "missing" || d.status === "rejected") || c.paymentStatus === "pending").length;
    const current = active[0];
    return { active, submitted, required, awaiting, current };
  }, [cases]);

  const actionAlert = stats.current && stats.current.docs.find((d) => d.status === "missing");

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Academic Advisory</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track your advisory cases, upload documents, and communicate with your advisor.
            </p>
          </div>
          <Link to="/dashboard/advisory/new">
            <Button variant="afrika" className="gap-2"><Plus className="h-4 w-4" /> New Advisory Request</Button>
          </Link>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard icon={FolderOpen} label="Active Cases" value={String(stats.active.length)} accent="primary" />
          <SummaryCard icon={Activity} label="Current Status" value={stats.current ? STATUS_LABEL[stats.current.status] : "—"} accent="primary" small />
          <SummaryCard icon={FileCheck} label="Docs Submitted" value={`${stats.submitted}/${stats.required}`} accent="primary" />
          <SummaryCard icon={AlertCircle} label="Awaiting Your Action" value={String(stats.awaiting)} accent="orange" />
        </div>

        {/* Action banner */}
        {actionAlert && stats.current && !dismissed && (
          <div className="rounded-xl border border-orange-200 bg-orange-50/60 border-l-[3px] border-l-orange-500 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Action Required —</span> Please upload your <span className="font-medium">{actionAlert.name}</span> to continue processing case <CaseIdPill id={stats.current.id} />.
              </p>
            </div>
            <Link to={`/dashboard/advisory/cases/${stats.current.id}`}>
              <Button size="sm" variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">Upload Now</Button>
            </Link>
            <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* My Cases */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">My Cases</h2>
            <Link to="/dashboard/advisory/cases" className="text-sm text-primary hover:underline">View All →</Link>
          </div>

          {stats.active.length === 0 ? (
            <Card><CardContent className="py-12 text-center">
              <Compass className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">You haven't submitted any advisory requests yet.</p>
              <Link to="/dashboard/advisory/new"><Button variant="afrika" className="mt-4">Start a Request</Button></Link>
            </CardContent></Card>
          ) : (
            <div className="space-y-3">
              {stats.active.slice(0, 3).map((c) => {
                const stage = STATUS_STAGE[c.status];
                const missingDocs = c.docs.some((d) => d.status === "missing");
                return (
                  <Link key={c.id} to={`/dashboard/advisory/cases/${c.id}`} className="block">
                    <Card className="hover:border-primary transition-all hover:shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <CaseIdPill id={c.id} />
                          <span className="px-2 py-0.5 rounded-md bg-secondary text-xs text-muted-foreground">{TYPE_LABEL[c.type]}</span>
                          <StatusBadge status={c.status} />
                          <span className="text-xs text-muted-foreground ml-auto">{timeAgo(c.updatedAt)}</span>
                        </div>
                        <p className="text-[15px] font-medium text-foreground">{c.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {c.advisor ? `Advisor: ${c.advisor.name}` : <span className="text-amber-600">Awaiting Assignment</span>}
                        </p>
                        <div className="mt-3 h-1 w-full bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary transition-all" style={{ width: `${(stage / 6) * 100}%` }} />
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs">
                          <span className="text-primary font-medium">View Case →</span>
                          {missingDocs && <span className="text-orange-600">Upload Documents</span>}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickAction icon={Upload} title="Upload Documents" desc="Add required documents to your active case" cta="Upload Now" to={stats.current ? `/dashboard/advisory/cases/${stats.current.id}` : "/dashboard/advisory/documents"} variant="orange" />
            <QuickAction icon={MessageCircle} title="Message Advisor" desc="Send a message to your assigned advisor" cta="Open Messages" to={stats.current ? `/dashboard/advisory/cases/${stats.current.id}` : "/dashboard/messages"} variant="primary" />
            <QuickAction icon={Plus} title="New Request" desc="Start a new transcript, degree, or advisory request" cta="Get Started" to="/dashboard/advisory/new" variant="primary-outline" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

function SummaryCard({ icon: Icon, label, value, accent, small }: { icon: any; label: string; value: string; accent: "primary" | "orange"; small?: boolean }) {
  const border = accent === "orange" ? "border-l-orange-500" : "border-l-primary";
  return (
    <Card className={`border-l-[3px] ${border}`}>
      <CardContent className="pt-5 pb-4 px-5 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={`${small ? "text-base" : "text-2xl"} font-bold text-foreground mt-1 truncate`}>{value}</p>
        </div>
        <div className={`h-10 w-10 rounded-lg ${accent === "orange" ? "bg-orange-100" : "bg-primary/10"} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${accent === "orange" ? "text-orange-600" : "text-primary"}`} />
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({ icon: Icon, title, desc, cta, to, variant }: { icon: any; title: string; desc: string; cta: string; to: string; variant: "orange" | "primary" | "primary-outline" }) {
  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center"><Icon className="h-5 w-5 text-primary" /></div>
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-1">{desc}</p>
        </div>
        <Link to={to}>
          <Button size="sm" variant={variant === "orange" ? "afrika" : variant === "primary-outline" ? "outline" : "default"} className="gap-1.5">
            {cta} <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default AdvisoryOverviewPage;
