import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, BarChart3 } from "lucide-react";

const REPORTS = [
  { title: "Q1 2026 Research Output Summary", type: "Quarterly", date: "2026-03-01", status: "ready" },
  { title: "Faculty Engagement Report — March 2026", type: "Monthly", date: "2026-03-05", status: "ready" },
  { title: "Platform Usage & Adoption — Feb 2026", type: "Monthly", date: "2026-02-28", status: "ready" },
  { title: "Annual Research Impact Report 2025", type: "Annual", date: "2025-12-31", status: "ready" },
  { title: "Seat Allocation Audit — Q4 2025", type: "Quarterly", date: "2025-12-15", status: "ready" },
  { title: "Collaboration & Partnership Report — 2025", type: "Annual", date: "2025-12-31", status: "generating" },
];

export default function InstitutionalReportsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Institutional Reports</h1>
            <p className="text-sm text-muted-foreground mt-1">Access generated reports for compliance, governance, and performance review.</p>
          </div>
          <Button className="gap-2"><BarChart3 className="h-4 w-4" /> Generate Report</Button>
        </div>

        <Card className="border-border">
          <CardContent className="p-0 divide-y divide-border">
            {REPORTS.map((r, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-[10px]">{r.type}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
                {r.status === "ready" ? (
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Download className="h-3.5 w-3.5" /> Download
                  </Button>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">Generating...</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
