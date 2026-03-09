import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight, Activity, FileText, Database, BarChart3, PlusCircle,
} from "lucide-react";

const usageData = [
  { label: "AI Paper Generation", credits: 8, percent: 50, color: "bg-accent", icon: FileText },
  { label: "Dataset Analysis", credits: 5, percent: 30, color: "bg-primary", icon: Database },
  { label: "Instrument Studio", credits: 2, percent: 13, color: "bg-afrika-green", icon: PlusCircle },
  { label: "Community Assessments", credits: 1, percent: 7, color: "bg-muted-foreground", icon: BarChart3 },
];

const dailyUsage = [
  { date: "Mar 9", paper: 1, dataset: 0, analysis: 0 },
  { date: "Mar 8", paper: 0, dataset: 1, analysis: 1 },
  { date: "Mar 7", paper: 2, dataset: 0, analysis: 0 },
  { date: "Mar 6", paper: 0, dataset: 0, analysis: 1 },
  { date: "Mar 5", paper: 1, dataset: 1, analysis: 0 },
  { date: "Mar 4", paper: 1, dataset: 0, analysis: 1 },
  { date: "Mar 3", paper: 2, dataset: 1, analysis: 0 },
];

const BillingUsagePage = () => {
  const [period, setPeriod] = useState("this-month");

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/billing" className="hover:text-foreground">Billing & Credits</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Usage</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Usage Report</h1>
            <p className="text-sm text-muted-foreground mt-1">Detailed breakdown of your credit usage.</p>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <p className="text-2xl font-bold text-foreground">16</p>
            <p className="text-[10px] text-muted-foreground">Total Credits Used</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <p className="text-2xl font-bold text-accent">8</p>
            <p className="text-[10px] text-muted-foreground">Paper Generation</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <p className="text-2xl font-bold text-primary">5</p>
            <p className="text-[10px] text-muted-foreground">Dataset Analysis</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <p className="text-2xl font-bold text-afrika-green">3</p>
            <p className="text-[10px] text-muted-foreground">Other</p>
          </div>
        </div>

        {/* Usage Breakdown */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Usage Breakdown</h2>
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            {usageData.map((u) => (
              <div key={u.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <u.icon className="h-4 w-4 text-accent" />
                    <p className="text-sm text-foreground">{u.label}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{u.credits} credits · {u.percent}%</span>
                </div>
                <div className="h-2.5 bg-secondary rounded-full">
                  <div className={`h-full rounded-full ${u.color}`} style={{ width: `${u.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Activity */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Daily Activity</h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="hidden md:grid grid-cols-4 gap-2 px-5 py-3 bg-secondary text-xs font-semibold text-muted-foreground border-b border-border">
              <div>Date</div><div>Paper Credits</div><div>Dataset Credits</div><div>Analysis Credits</div>
            </div>
            {dailyUsage.map((d) => (
              <div key={d.date} className="grid grid-cols-2 md:grid-cols-4 gap-2 px-5 py-3 border-b border-border text-sm">
                <span className="text-xs text-muted-foreground">{d.date}</span>
                <span className="text-xs text-foreground">{d.paper}</span>
                <span className="text-xs text-foreground">{d.dataset}</span>
                <span className="text-xs text-foreground">{d.analysis}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingUsagePage;
