import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Inbox, Star, CheckCircle, XCircle, Search, Eye, ListFilter, Briefcase, Handshake } from "lucide-react";
import { toast } from "sonner";
import { useAppNotifications } from "@/hooks/useAppNotifications";

interface MyApp {
  id: string; opportunity: string; institution: string; engagementType: string;
  appliedAt: string; status: "under_review" | "shortlisted" | "accepted" | "declined";
}

const DEMO: MyApp[] = [
  { id: "a1", opportunity: "AI & Public Health Course Instructor", institution: "African Health Institute", engagementType: "Short Course", appliedAt: "2026-04-22", status: "under_review" },
  { id: "a2", opportunity: "Climate Adaptation Policy Advisor", institution: "UNEP Africa", engagementType: "Advisory", appliedAt: "2026-04-15", status: "shortlisted" },
  { id: "a3", opportunity: "Solar Energy Systems Lecturer", institution: "Université Cheikh Anta Diop", engagementType: "Teaching", appliedAt: "2026-04-08", status: "accepted" },
  { id: "a4", opportunity: "AI Workshop Facilitator", institution: "University of Nairobi", engagementType: "Workshop", appliedAt: "2026-03-28", status: "declined" },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  under_review: { label: "Under Review", cls: "bg-secondary text-foreground" },
  shortlisted: { label: "Shortlisted", cls: "bg-accent/15 text-accent" },
  accepted: { label: "Accepted", cls: "bg-afrika-green/15 text-afrika-green" },
  declined: { label: "Declined", cls: "bg-destructive/15 text-destructive" },
};

const NetworkApplicationsPage = () => {
  const [apps, setApps] = useState<MyApp[]>(DEMO);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const { add } = useAppNotifications();

  const filtered = apps.filter((a) => {
    const ms = !search || a.opportunity.toLowerCase().includes(search.toLowerCase()) || a.institution.toLowerCase().includes(search.toLowerCase());
    const mf = status === "all" || a.status === status;
    return ms && mf;
  });

  const counts = {
    total: apps.length,
    under_review: apps.filter(a => a.status === "under_review").length,
    shortlisted: apps.filter(a => a.status === "shortlisted").length,
    accepted: apps.filter(a => a.status === "accepted").length,
    declined: apps.filter(a => a.status === "declined").length,
  };

  const acceptEngagement = (a: MyApp) => {
    setApps((p) => p.filter((x) => x.id !== a.id));
    add({
      category: "Engagement",
      title: "Engagement accepted",
      description: `You accepted the engagement for "${a.opportunity}" with ${a.institution}.`,
      link: "/dashboard/network/engagements",
    });
    toast.success("Engagement accepted — added to My Engagements");
  };

  const STATS = [
    { label: "Total", value: counts.total, icon: Inbox },
    { label: "Under Review", value: counts.under_review, icon: Eye },
    { label: "Shortlisted", value: counts.shortlisted, icon: Star },
    { label: "Accepted", value: counts.accepted, icon: CheckCircle },
    { label: "Declined", value: counts.declined, icon: XCircle },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">My Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your submitted opportunities and their progress.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {STATS.map(s => (
            <Card key={s.label} className="border-border">
              <CardContent className="pt-4 pb-3 px-4">
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold text-foreground mt-0.5">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by opportunity or institution" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-[180px]"><ListFilter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Opportunity</TableHead>
                  <TableHead className="hidden md:table-cell">Institution</TableHead>
                  <TableHead className="hidden lg:table-cell">Engagement Type</TableHead>
                  <TableHead className="hidden md:table-cell">Date Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a) => {
                  const st = STATUS_MAP[a.status];
                  return (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium text-foreground">{a.opportunity}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{a.institution}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">{a.engagementType}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {new Date(a.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </TableCell>
                      <TableCell><Badge className={`text-[10px] ${st.cls}`}>{st.label}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" className="h-8 text-xs gap-1"><Eye className="h-3 w-3" /> Details</Button>
                          {a.status === "accepted" && (
                            <Button size="sm" variant="afrika" className="h-8 text-xs gap-1" onClick={() => acceptEngagement(a)}>
                              <Handshake className="h-3 w-3" /> Accept Engagement
                            </Button>
                          )}
                          {a.status === "declined" && (
                            <Button size="sm" variant="ghost" className="h-8 text-xs">View Feedback</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="font-medium text-foreground">You haven't applied to any opportunities yet</p>
                      <Link to="/dashboard/network/opportunities" className="inline-block mt-3">
                        <Button variant="afrika" size="sm">Browse Opportunities</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NetworkApplicationsPage;
