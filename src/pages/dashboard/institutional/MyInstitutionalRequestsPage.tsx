import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ClipboardList, Download, MessageCircle, Eye } from "lucide-react";
import { toast } from "sonner";

const requests = [
  { title: "Lecturer for Data Science Program", type: "Lecturer Request", date: "2026-03-07", status: "Under Review", academic: "Pending Assignment" },
  { title: "Joint Climate Research Project", type: "Research Collaboration", date: "2026-03-05", status: "Academic Assigned", academic: "Dr. Amina Bello" },
  { title: "Curriculum Review — MBA Program", type: "Curriculum & Validation", date: "2026-03-03", status: "In Progress", academic: "Prof. Kwame Asante" },
  { title: "Policy Advisory on EdTech Regulation", type: "Advisory Support", date: "2026-03-01", status: "Completed", academic: "Dr. Ngozi Okafor" },
  { title: "Guest Lecturer — AI Ethics Module", type: "Lecturer Request", date: "2026-02-25", status: "Pending", academic: "Pending Assignment" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-muted text-muted-foreground",
  "Under Review": "bg-accent/10 text-accent",
  "Academic Assigned": "bg-primary/10 text-primary",
  "In Progress": "bg-afrika-green/10 text-afrika-green",
  Completed: "bg-secondary text-secondary-foreground",
};

const MyInstitutionalRequestsPage = () => (
  <DashboardLayout>
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/dashboard/institutional" className="hover:text-foreground">Institutional</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">My Requests</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground font-serif">My Institutional Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">Track all your institutional partnership and service requests.</p>
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Request Title</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Submitted</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Assigned Academic</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.map((r, i) => (
                  <tr key={i} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{r.title}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{r.type}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td className="px-5 py-3"><Badge className={`text-[10px] ${statusColors[r.status] || ""}`}>{r.status}</Badge></td>
                    <td className="px-5 py-3 text-xs text-foreground">{r.academic}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="text-xs h-7 gap-1"><Eye className="h-3 w-3" /> View</Button>
                        <Button variant="outline" size="sm" className="text-xs h-7 gap-1" onClick={() => toast.info("Opening messenger...")}><MessageCircle className="h-3 w-3" /> Message</Button>
                        <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={() => toast.info("Downloading summary...")}><Download className="h-3 w-3" /></Button>
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

export default MyInstitutionalRequestsPage;
