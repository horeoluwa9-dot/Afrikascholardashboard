import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronRight, User, Search, Star, UserPlus, Send } from "lucide-react";

const REVIEWERS = [
  { name: "Dr. Fatima Bello", institution: "University of Lagos", expertise: "Public Health", rating: 4.8, available: true, reviews: 12 },
  { name: "Dr. Ahmed Musa", institution: "Ahmadu Bello University", expertise: "Epidemiology", rating: 4.6, available: true, reviews: 8 },
  { name: "Prof. Kwame Asante", institution: "University of Ghana", expertise: "Computer Science", rating: 4.9, available: false, reviews: 15 },
  { name: "Dr. Ngozi Okafor", institution: "University of Nigeria", expertise: "Agricultural Science", rating: 4.3, available: true, reviews: 6 },
  { name: "Dr. Tunde Adeyemi", institution: "University of Lagos", expertise: "Political Science", rating: 4.6, available: true, reviews: 9 },
  { name: "Dr. Grace Nwoye", institution: "University of Cape Town", expertise: "Environmental Science", rating: 4.4, available: true, reviews: 7 },
];

const ACTIVE = [
  { reviewer: "Dr. Fatima Bello", manuscript: "AI-Assisted Epidemiological Modeling", status: "In Progress", deadline: "March 28, 2026" },
  { reviewer: "Dr. Ahmed Musa", manuscript: "Renewable Energy Policy Framework", status: "Submitted", deadline: "March 20, 2026" },
  { reviewer: "Dr. Grace Nwoye", manuscript: "Water Resource Management in the Sahel", status: "Pending Acceptance", deadline: "April 5, 2026" },
];

const ReviewerAssignmentPage = () => {
  const [search, setSearch] = useState("");
  const filtered = REVIEWERS.filter(r =>
    !search.trim() || r.name.toLowerCase().includes(search.toLowerCase()) || r.institution.toLowerCase().includes(search.toLowerCase()) || r.expertise.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-full mx-auto space-y-6 px-2 sm:px-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/publishing" className="hover:text-foreground">Publishing</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Reviewer Assignment</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Reviewer Assignment</h1>
          <p className="text-sm text-muted-foreground mt-1">Search, filter, and assign qualified reviewers to manuscripts.</p>
        </div>

        {/* Reviewer Directory */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Reviewer Directory</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search reviewers..." className="pl-9 h-9 w-56 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Reviewer</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Expertise</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-accent/10 flex items-center justify-center"><User className="h-3.5 w-3.5 text-accent" /></div>
                        <span className="text-sm font-medium text-foreground">{r.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.institution}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.expertise}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm"><Star className="h-3 w-3 text-amber-400 fill-amber-400" /> {r.rating}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.reviews}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${r.available ? "bg-emerald-500/10 text-emerald-600" : "bg-secondary text-muted-foreground"}`}>
                        {r.available ? "Available" : "Busy"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => toast.success(`Invitation sent to ${r.name}.`)}>
                        <UserPlus className="h-3 w-3" /> Invite
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Active Assignments */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Active Assignments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Reviewer</TableHead>
                  <TableHead>Manuscript</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ACTIVE.map((a, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6 text-sm font-medium text-foreground">{a.reviewer}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] line-clamp-1">{a.manuscript}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${a.status === "Submitted" ? "bg-emerald-500/10 text-emerald-600" : a.status === "In Progress" ? "bg-amber-500/10 text-amber-600" : "bg-blue-500/10 text-blue-600"}`}>
                        {a.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{a.deadline}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => toast.success("Reminder sent.")}>
                        <Send className="h-3 w-3" /> Remind
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReviewerAssignmentPage;
