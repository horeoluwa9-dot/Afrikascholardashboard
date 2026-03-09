import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2, Users, Handshake, BookOpen, Shield, Compass,
  ArrowRight, ChevronRight, ClipboardList, FileSignature,
  GraduationCap, Globe,
} from "lucide-react";

const serviceCards = [
  { title: "Request Lecturer Support", desc: "Find academic lecturers and instructors for programs.", icon: GraduationCap, link: "/dashboard/institutional/lecturer-requests", color: "text-accent", bg: "bg-accent/10" },
  { title: "Request Research Collaboration", desc: "Partner with academics for joint research projects.", icon: Handshake, link: "/dashboard/institutional/research-collaboration", color: "text-primary", bg: "bg-primary/10" },
  { title: "Curriculum Development", desc: "Request curriculum design or academic program support.", icon: BookOpen, link: "/dashboard/institutional/curriculum", color: "text-afrika-green", bg: "bg-afrika-green/10" },
  { title: "Academic Validation", desc: "Request peer review, validation, and academic verification.", icon: Shield, link: "/dashboard/institutional/curriculum", color: "text-afrika-orange", bg: "bg-afrika-orange-light" },
  { title: "Policy Advisory", desc: "Engage academic experts for policy advisory.", icon: Compass, link: "/dashboard/institutional/advisory-support", color: "text-accent", bg: "bg-accent/10" },
  { title: "Institution Partnership", desc: "Partner with the Afrika Scholar network.", icon: Building2, link: "/dashboard/institutional/partnership-requests", color: "text-primary", bg: "bg-primary/10" },
];

const overviewMetrics = [
  { label: "Active Requests", value: 5, icon: ClipboardList, color: "text-accent", bg: "bg-accent/10" },
  { label: "Completed Collaborations", value: 12, icon: Handshake, color: "text-primary", bg: "bg-primary/10" },
  { label: "Active Academic Partners", value: 8, icon: Users, color: "text-afrika-green", bg: "bg-afrika-green/10" },
  { label: "Contracts Signed", value: 3, icon: FileSignature, color: "text-afrika-orange", bg: "bg-afrika-orange-light" },
];

const recentRequests = [
  { title: "Lecturer for Data Science Program", type: "Lecturer Request", date: "2026-03-07", status: "Under Review", academic: "Pending Assignment" },
  { title: "Joint Climate Research Project", type: "Research Collaboration", date: "2026-03-05", status: "Academic Assigned", academic: "Dr. Amina Bello" },
  { title: "Curriculum Review — MBA Program", type: "Curriculum & Validation", date: "2026-03-03", status: "In Progress", academic: "Prof. Kwame Asante" },
  { title: "Policy Advisory on EdTech Regulation", type: "Advisory Support", date: "2026-03-01", status: "Completed", academic: "Dr. Ngozi Okafor" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-muted text-muted-foreground",
  "Under Review": "bg-accent/10 text-accent",
  "Academic Assigned": "bg-primary/10 text-primary",
  "In Progress": "bg-afrika-green/10 text-afrika-green",
  Completed: "bg-secondary text-secondary-foreground",
};

const InstitutionalPartnershipsOverview = () => (
  <DashboardLayout>
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Institutional</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground font-serif">Institutional Partnerships</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Request lecturers, advisory support, and academic collaboration from the Afrika Scholar network.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {overviewMetrics.map(m => (
          <Card key={m.label} className="border-border">
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-muted-foreground">{m.label}</p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{m.value}</p>
                </div>
                <div className={`h-9 w-9 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <m.icon className={`h-4 w-4 ${m.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Cards */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-3">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceCards.map(s => (
            <Link key={s.title} to={s.link}>
              <Card className="border-border hover:shadow-sm transition-shadow cursor-pointer h-full">
                <CardContent className="pt-5 pb-4 px-5 space-y-2">
                  <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <p className="text-sm font-bold text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                  <div className="flex items-center gap-1 text-accent text-xs font-medium pt-1">
                    Get Started <ArrowRight className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Requests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-foreground">Recent Requests</h2>
          <Link to="/dashboard/institutional/my-requests" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/40">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Request Title</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Assigned Academic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentRequests.map((r, i) => (
                    <tr key={i} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-5 py-3 font-medium text-foreground">{r.title}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{r.type}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                      <td className="px-5 py-3"><Badge className={`text-[10px] ${statusColors[r.status] || ""}`}>{r.status}</Badge></td>
                      <td className="px-5 py-3 text-xs text-foreground">{r.academic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </DashboardLayout>
);

export default InstitutionalPartnershipsOverview;
