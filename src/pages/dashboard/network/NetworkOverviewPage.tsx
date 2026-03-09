import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users2, Briefcase, FileText, Handshake, ArrowRight, Search, Plus,
  TrendingUp, Globe, Building2, CheckCircle,
} from "lucide-react";

const STATS = [
  { label: "Active Academics", value: "5,200", icon: Users2, color: "text-accent", bg: "bg-accent/10" },
  { label: "Open Opportunities", value: 48, icon: Briefcase, color: "text-primary", bg: "bg-primary/10" },
  { label: "Applications Received", value: 320, icon: FileText, color: "text-afrika-green", bg: "bg-afrika-green/10" },
  { label: "Active Engagements", value: 17, icon: Handshake, color: "text-afrika-orange", bg: "bg-afrika-orange-light" },
];

const RECENT_ACTIVITY = [
  { title: "Dr. Amina Bello applied for AI Course Instructor", type: "Application", date: "2026-03-08", icon: FileText, link: "/dashboard/network/applications" },
  { title: "New opportunity posted: Climate Policy Research Lead", type: "Opportunity", date: "2026-03-07", icon: Briefcase, link: "/dashboard/network/opportunities" },
  { title: "Contract signed with Prof. Kwame Asante", type: "Contract", date: "2026-03-06", icon: CheckCircle, link: "/dashboard/network/contracts" },
  { title: "Dr. Fatou Diallo joined the network", type: "New Member", date: "2026-03-05", icon: Users2, link: "/dashboard/network/directory" },
];

const FEATURED_OPPORTUNITIES = [
  { title: "AI & Public Health Course Instructor", org: "African Health Institute", type: "Short Course", duration: "6 weeks", payment: "₦350,000" },
  { title: "Climate Adaptation Policy Advisor", org: "UNEP Africa", type: "Advisory", duration: "3 months", payment: "₦500,000" },
  { title: "Agricultural Economics Research Lead", org: "FAO Regional Office", type: "Research", duration: "6 months", payment: "₦750,000" },
];

const QUICK_ACTIONS = [
  { title: "Browse Academics", desc: "Find researchers and experts", icon: Search, link: "/dashboard/network/directory", color: "text-primary", bg: "bg-primary/10" },
  { title: "Post Opportunity", desc: "Create a new academic role", icon: Plus, link: "/dashboard/network/opportunities", color: "text-accent", bg: "bg-accent/10" },
  { title: "View Applications", desc: "Review incoming applications", icon: FileText, link: "/dashboard/network/applications", color: "text-afrika-green", bg: "bg-afrika-green/10" },
  { title: "Manage Contracts", desc: "Track active agreements", icon: Handshake, link: "/dashboard/network/contracts", color: "text-afrika-orange", bg: "bg-afrika-orange-light" },
];

const NetworkOverviewPage = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-serif">Academic Network</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Connect with researchers, lecturers, and institutions across Africa.
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/dashboard/network/directory">
              <Button variant="outline" className="gap-2">
                <Search className="h-4 w-4" /> Browse Academics
              </Button>
            </Link>
            <Link to="/dashboard/network/opportunities">
              <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="h-4 w-4" /> Post Opportunity
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map((s) => (
            <Card key={s.label} className="border-border">
              <CardContent className="pt-4 pb-3 px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                    <p className="text-xl font-bold text-foreground mt-0.5">{s.value}</p>
                  </div>
                  <div className={`h-9 w-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.title} to={a.link}>
              <Card className="border-border hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="pt-4 pb-3 px-4 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${a.bg} flex items-center justify-center shrink-0`}>
                    <a.icon className={`h-5 w-5 ${a.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{a.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
            </div>
            <Card className="border-border">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {RECENT_ACTIVITY.map((a, i) => (
                    <Link key={i} to={a.link} className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/50 transition-colors">
                      <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <a.icon className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                        <Badge variant="secondary" className="text-[10px] mt-0.5">{a.type}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Featured Opportunities */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Featured Opportunities</h2>
              <Link to="/dashboard/network/opportunities" className="text-xs text-accent hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {FEATURED_OPPORTUNITIES.map((opp, i) => (
                <Card key={i} className="border-border hover:shadow-sm transition-shadow">
                  <CardContent className="py-4 px-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{opp.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{opp.org}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="secondary" className="text-[10px]">{opp.type}</Badge>
                          <span className="text-xs text-muted-foreground">{opp.duration}</span>
                          <span className="text-xs font-semibold text-accent">{opp.payment}</span>
                        </div>
                      </div>
                      <Link to="/dashboard/network/opportunities">
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Network Stats Banner */}
        <Card className="border-border bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="py-6 px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">Join Africa's largest academic network</p>
                  <p className="text-sm text-muted-foreground">Connect with 5,200+ researchers across 45 countries</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">45</p>
                  <p className="text-xs text-muted-foreground">Countries</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">320+</p>
                  <p className="text-xs text-muted-foreground">Institutions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">₦42M+</p>
                  <p className="text-xs text-muted-foreground">Paid Out</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NetworkOverviewPage;
