import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronRight, TrendingUp, Clock, CheckCircle2, Briefcase,
  FileText, ExternalLink, Wallet, DollarSign,
} from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

const SUMMARY = [
  {
    title: "Total Earnings",
    value: fmt(350000),
    description: "Total income earned from completed engagements.",
    icon: TrendingUp,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    title: "Pending Payments",
    value: fmt(80000),
    description: "Payments awaiting release after engagement completion.",
    icon: Clock,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    title: "Completed Projects",
    value: "7",
    description: "Total engagements successfully completed.",
    icon: CheckCircle2,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    title: "Active Engagements",
    value: "2",
    description: "Projects currently in progress.",
    icon: Briefcase,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const CHART_DATA = [
  { month: "Jan", amount: 50000 },
  { month: "Feb", amount: 70000 },
  { month: "Mar", amount: 120000 },
  { month: "Apr", amount: 110000 },
];

export const PAYMENTS = [
  {
    id: "pay-1",
    project: "Policy Research Advisory",
    institution: "African Development Policy Center",
    amount: 50000,
    status: "Paid",
    date: "Feb 10, 2026",
    method: "Bank Transfer",
    engagementId: "demo-eng-1",
  },
  {
    id: "pay-2",
    project: "Curriculum Development Project",
    institution: "University of Lagos",
    amount: 80000,
    status: "Pending",
    date: "Processing",
    method: "Bank Transfer",
    engagementId: "demo-eng-2",
  },
  {
    id: "pay-3",
    project: "Climate Data Analysis Consultation",
    institution: "West African Climate Institute",
    amount: 120000,
    status: "Paid",
    date: "Jan 28, 2026",
    method: "Bank Transfer",
    engagementId: "demo-eng-1",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "Paid") {
    return (
      <Badge className="bg-accent/15 text-accent border-accent/30 font-medium hover:bg-accent/15">
        <CheckCircle2 className="h-3 w-3 mr-1" /> Paid
      </Badge>
    );
  }
  return (
    <Badge className="bg-muted text-muted-foreground border-border font-medium hover:bg-muted">
      <Clock className="h-3 w-3 mr-1" /> Pending
    </Badge>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-md text-sm">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        <p className="text-accent font-bold">{fmt(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const EarningsPage = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hasPayments = PAYMENTS.length > 0;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-7">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/network" className="hover:text-foreground transition-colors">Academic Network</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Earnings</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-serif flex items-center gap-2">
              <Wallet className="h-6 w-6 text-accent" />
              Earnings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track your earnings from advisory work, consulting engagements, and academic collaborations.
            </p>
          </div>
          <Button onClick={scrollToTable} variant="outline" className="shrink-0 gap-2">
            <FileText className="h-4 w-4" />
            View Payment History
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUMMARY.map((card) => (
            <div key={card.title} className="bg-card rounded-xl border border-border p-5">
              <div className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${card.bg} mb-3`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs font-semibold text-foreground mt-0.5">{card.title}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{card.description}</p>
            </div>
          ))}
        </div>

        {hasPayments ? (
          <>
            {/* Chart */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="h-4 w-4 text-accent" />
                <h2 className="text-base font-bold text-foreground">Monthly Earnings</h2>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={CHART_DATA} margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={false}
                    tickLine={false}
                    width={55}
                  />
                  <ReTooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2.5}
                    dot={{ fill: "hsl(var(--accent))", r: 5, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Payment History Table */}
            <div ref={tableRef} className="bg-card rounded-xl border border-border p-6 scroll-mt-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-accent" />
                  <h2 className="text-base font-bold text-foreground">Payment History</h2>
                </div>
                <Badge variant="outline" className="text-xs">{PAYMENTS.length} Records</Badge>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-xs font-semibold text-muted-foreground">Project / Engagement</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground">Institution / Client</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground">Amount</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground">Status</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground">Payment Date</TableHead>
                      <TableHead className="text-xs font-semibold text-muted-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PAYMENTS.map((p) => (
                      <TableRow key={p.id} className="border-border hover:bg-secondary/50 transition-colors">
                        <TableCell className="font-medium text-sm text-foreground">{p.project}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.institution}</TableCell>
                        <TableCell className="text-sm font-semibold text-foreground">{fmt(p.amount)}</TableCell>
                        <TableCell><StatusBadge status={p.status} /></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs gap-1 h-7"
                              onClick={() => navigate(`/dashboard/institutional/engagements`)}
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Project
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs gap-1 h-7 text-accent hover:text-accent hover:bg-accent/10"
                              onClick={() => navigate(`/dashboard/earnings/invoice/${p.id}`)}
                            >
                              <FileText className="h-3 w-3" />
                              View Invoice
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="bg-card rounded-xl border border-border p-16 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-5">
              <Wallet className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">You have not received any payments yet.</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              Complete engagements through the Afrika Scholar Network to start earning.
            </p>
            <Button variant="afrika" onClick={() => navigate("/dashboard/network?tab=jobs")}>
              Browse Opportunities
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EarningsPage;
