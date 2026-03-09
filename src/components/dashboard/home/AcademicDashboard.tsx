import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText, BookOpen, Users2, ArrowRight, ClipboardList, Clock,
  CheckCircle, Send, BarChart3, Building2, Handshake, MessageCircle, TrendingUp,
} from "lucide-react";
import CommunityPreview from "@/components/dashboard/CommunityPreview";

const editorialTasks = [
  { text: "3 manuscripts awaiting editorial decision", link: "/dashboard/publishing/workflow" },
  { text: "2 reviewer assignments pending", link: "/dashboard/publishing/reviewer-assignment" },
  { text: "1 revision approval needed", link: "/dashboard/publishing/workflow" },
];

const peerReviewAssignments = [
  { title: "Impact of Mobile Learning in Rural Kenya", due: "Mar 12, 2026", status: "In Progress" },
  { title: "Renewable Energy Policy in Southern Africa", due: "Mar 18, 2026", status: "Pending" },
  { title: "Gender Equity in STEM Higher Education", due: "Mar 25, 2026", status: "Pending" },
];

const recentPublications = [
  { title: "AI Ethics in African Education Systems", status: "Published", journal: "African Journal of Science" },
  { title: "Sustainable Agriculture Practices in West Africa", status: "Submitted", journal: "Pan-African Review" },
];

const collaborations = [
  { title: "Cross-Border Climate Research Initiative", partner: "University of Cape Town", status: "Active" },
  { title: "EdTech Innovation Partnership", partner: "Lagos Business School", status: "Active" },
];

const metrics = [
  { label: "Total Publications", count: 14, icon: FileText },
  { label: "Peer Reviews", count: 23, icon: ClipboardList },
  { label: "Citations", count: 87, icon: TrendingUp },
];

const statusColors: Record<string, string> = {
  "In Progress": "bg-primary/10 text-primary",
  Pending: "bg-muted text-muted-foreground",
  Active: "bg-afrika-green/10 text-afrika-green",
  Published: "bg-afrika-green/10 text-afrika-green",
  Submitted: "bg-primary/10 text-primary",
};

export default function AcademicDashboard() {
  return (
    <div className="space-y-8">
      {/* Academic Metrics */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Academic Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {metrics.map((m) => (
            <div key={m.label} className="bg-card rounded-xl border border-border p-4">
              <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center mb-3">
                <m.icon className="h-4 w-4 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">{m.count}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Tasks */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Editorial Tasks</h2>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {editorialTasks.map((task, i) => (
            <Link key={i} to={task.link} className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/50 transition-colors">
              <p className="text-sm text-foreground">{task.text}</p>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 ml-4" />
            </Link>
          ))}
        </div>
      </div>

      {/* Peer Review Assignments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Peer Review Assignments</h2>
          <Link to="/dashboard/publishing/reviews">
            <Button variant="ghost" size="sm" className="text-xs gap-1">View All <ArrowRight className="h-3 w-3" /></Button>
          </Link>
        </div>
        <div className="space-y-3">
          {peerReviewAssignments.map((r, i) => (
            <Link key={i} to="/dashboard/publishing/reviews" className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-sm transition-shadow block">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">{r.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <Badge className={`text-[10px] ${statusColors[r.status]}`}>{r.status}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Due: {r.due}</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 ml-4" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Publications + Academic Collaboration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Publications</h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {recentPublications.map((p, i) => (
              <Link key={i} to="/dashboard/my-papers" className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge className={`text-[10px] ${statusColors[p.status]}`}>{p.status}</Badge>
                    <span className="text-xs text-muted-foreground">{p.journal}</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 ml-4" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Academic Collaboration</h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {collaborations.map((c, i) => (
              <Link key={i} to="/dashboard/network/engagements" className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge className={`text-[10px] ${statusColors[c.status]}`}>{c.status}</Badge>
                    <span className="text-xs text-muted-foreground">{c.partner}</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 ml-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Institutional Activity */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Institutional Activity</h2>
        <div className="bg-card rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-start gap-3">
            <Building2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Institution Projects</p>
              <p className="text-sm font-medium text-foreground">3 active faculty research projects</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Handshake className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Faculty Collaborations</p>
              <p className="text-sm font-medium text-foreground">2 cross-department partnerships</p>
            </div>
          </div>
          <Link to="/dashboard/institutional">
            <Button variant="afrikaOutline" size="sm" className="w-full mt-2 text-xs">View Institutional Overview</Button>
          </Link>
        </div>
      </div>

      {/* Community Highlights */}
      <CommunityPreview />
    </div>
  );
}
