import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, FileSignature, Download, MessageCircle, Eye } from "lucide-react";
import { toast } from "sonner";

const contractMetrics = [
  { label: "Active Contracts", value: 3 },
  { label: "Completed Contracts", value: 8 },
  { label: "Pending Agreements", value: 2 },
];

const contracts = [
  { title: "Guest Lecturer Agreement — Data Science", academic: "Dr. Amina Bello", institution: "University of Lagos", start: "2026-02-01", end: "2026-07-31", status: "Active" },
  { title: "Joint Research — Climate Policy", academic: "Prof. Kwame Asante", institution: "University of Ghana", start: "2026-01-15", end: "2026-12-31", status: "Active" },
  { title: "Curriculum Review — Engineering", academic: "Dr. Ngozi Okafor", institution: "University of Nigeria", start: "2025-09-01", end: "2026-02-28", status: "Completed" },
  { title: "Policy Advisory — Education Reform", academic: "Dr. Tunde Adeyemi", institution: "Federal Ministry of Education", start: "2026-03-01", end: "2026-06-30", status: "Pending" },
];

const statusColors: Record<string, string> = {
  Active: "bg-afrika-green/10 text-afrika-green",
  Completed: "bg-secondary text-secondary-foreground",
  Pending: "bg-accent/10 text-accent",
};

const InstitutionalContractsPage = () => (
  <DashboardLayout>
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/dashboard/institutional" className="hover:text-foreground">Institutional</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Contracts</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground font-serif">Contracts</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage institutional agreements with academics.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {contractMetrics.map(m => (
          <Card key={m.label} className="border-border">
            <CardContent className="pt-4 pb-3 px-4 text-center">
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Contract Title</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Academic Partner</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Institution</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Start</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">End</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contracts.map((c, i) => (
                  <tr key={i} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{c.title}</td>
                    <td className="px-5 py-3 text-xs text-foreground">{c.academic}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{c.institution}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{new Date(c.start).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{new Date(c.end).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td className="px-5 py-3"><Badge className={`text-[10px] ${statusColors[c.status] || ""}`}>{c.status}</Badge></td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="text-xs h-7 gap-1"><Eye className="h-3 w-3" /> View</Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => toast.info("Downloading agreement...")}><Download className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => toast.info("Opening messenger...")}><MessageCircle className="h-3 w-3" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default InstitutionalContractsPage;
