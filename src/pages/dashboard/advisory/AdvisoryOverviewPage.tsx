import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList, FileUp, CheckCircle, MessageCircle, ArrowRight,
  FileText, GraduationCap, Globe, Compass,
} from "lucide-react";

const stats = [
  { label: "Active Advisory Requests", value: 2, icon: ClipboardList, color: "text-accent", bg: "bg-accent/10" },
  { label: "Documents Uploaded", value: 5, icon: FileUp, color: "text-primary", bg: "bg-primary/10" },
  { label: "Cases Completed", value: 1, icon: CheckCircle, color: "text-afrika-green", bg: "bg-afrika-green/10" },
  { label: "Advisor Messages", value: 3, icon: MessageCircle, color: "text-afrika-orange", bg: "bg-afrika-orange-light" },
];

const recentActivity = [
  { text: "Transcript request submitted — University of Ibadan", time: "2 hours ago", link: "/dashboard/advisory/transcripts" },
  { text: "Degree advisory requested — Data Science master's programs", time: "1 day ago", link: "/dashboard/advisory/degree" },
  { text: "Advisor response received — Study in Africa consultation", time: "2 days ago", link: "/dashboard/advisory/cases" },
  { text: "Document uploaded — BSc Economics Transcript", time: "3 days ago", link: "/dashboard/advisory/documents" },
  { text: "Academic pathway guidance completed", time: "5 days ago", link: "/dashboard/advisory/pathways" },
];

const quickActions = [
  { icon: FileText, title: "Request Transcript", desc: "Process academic transcripts", link: "/dashboard/advisory/transcripts" },
  { icon: GraduationCap, title: "Degree Advisory", desc: "Get program guidance", link: "/dashboard/advisory/degree" },
  { icon: Globe, title: "Study in Africa", desc: "Explore universities", link: "/dashboard/advisory/study-africa" },
  { icon: Compass, title: "Academic Pathways", desc: "Plan your career", link: "/dashboard/advisory/pathways" },
];

const AdvisoryOverviewPage = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Academic Advisory Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your advisory requests and track progress.
          </p>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <Card key={s.label} className="border-border hover:shadow-sm transition-shadow">
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map(a => (
              <Link key={a.title} to={a.link} className="bg-card rounded-xl p-5 border border-border flex items-center gap-4 hover:shadow-md transition-shadow group">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <a.icon className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {a.desc} <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-foreground mb-4">Recent Advisory Activity</h2>
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              {recentActivity.map((item, i) => (
                <Link key={i} to={item.link} className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/50 transition-colors">
                  <p className="text-sm text-foreground">{item.text}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{item.time}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Action Panel */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Manage</h2>
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <Link to="/dashboard/advisory/cases">
                <Button className="w-full gap-1.5 justify-start" variant="outline">
                  <ClipboardList className="h-4 w-4" /> View Advisory Cases
                </Button>
              </Link>
              <Link to="/dashboard/advisory/documents">
                <Button className="w-full gap-1.5 justify-start" variant="outline">
                  <FileUp className="h-4 w-4" /> Upload Documents
                </Button>
              </Link>
              <Link to="/dashboard/messages">
                <Button className="w-full gap-1.5 justify-start" variant="outline">
                  <MessageCircle className="h-4 w-4" /> Message Advisor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdvisoryOverviewPage;
