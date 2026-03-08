import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users2, Plus, Search, Mail, MoreHorizontal, UserX, Eye, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Faculty {
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
  papers: number;
}

const INITIAL_FACULTY: Faculty[] = [
  { name: "Dr. Ama Mensah", email: "a.mensah@ug.edu.gh", department: "Energy Policy", role: "Researcher", status: "active", papers: 12 },
  { name: "Prof. Kwame Asante", email: "k.asante@ug.edu.gh", department: "Computer Science", role: "Senior Researcher", status: "active", papers: 24 },
  { name: "Dr. Fatima Bello", email: "f.bello@abu.edu.ng", department: "Public Health", role: "Researcher", status: "active", papers: 8 },
  { name: "Dr. Tunde Adeyemi", email: "t.adeyemi@unilag.edu.ng", department: "Political Science", role: "Researcher", status: "pending", papers: 15 },
  { name: "Dr. Ngozi Okafor", email: "n.okafor@unn.edu.ng", department: "Agricultural Science", role: "Lecturer", status: "active", papers: 6 },
];

export default function FacultyUsersPage() {
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState<Faculty[]>(INITIAL_FACULTY);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", department: "", role: "Researcher" });

  const filtered = faculty.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = () => {
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setFaculty(prev => [...prev, { ...inviteForm, status: "pending", papers: 0 }]);
    setInviteForm({ name: "", email: "", department: "", role: "Researcher" });
    setShowInvite(false);
    toast.success(`Invitation sent to ${inviteForm.email}`);
  };

  const handleResendInvite = (f: Faculty) => {
    toast.success(`Invitation resent to ${f.email}`);
  };

  const handleDeactivate = (idx: number) => {
    setFaculty(prev => prev.map((f, i) => i === idx ? { ...f, status: f.status === "active" ? "inactive" : "active" } : f));
    toast.success(faculty[idx].status === "active" ? "Faculty member deactivated" : "Faculty member reactivated");
  };

  const handleRemove = (idx: number) => {
    const name = faculty[idx].name;
    setFaculty(prev => prev.filter((_, i) => i !== idx));
    toast.success(`${name} removed from faculty`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Faculty Users</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage researchers and faculty members under your institution.</p>
          </div>
          <Button className="gap-2" onClick={() => setShowInvite(true)}><Plus className="h-4 w-4" /> Invite Faculty</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Faculty", value: faculty.length, icon: Users2, bg: "bg-accent/10", color: "text-accent" },
            { label: "Active", value: faculty.filter(f => f.status === "active").length, icon: Users2, bg: "bg-afrika-green/10", color: "text-afrika-green" },
            { label: "Pending Invites", value: faculty.filter(f => f.status === "pending").length, icon: Mail, bg: "bg-afrika-orange-light", color: "text-afrika-orange" },
          ].map(s => (
            <Card key={s.label} className="border-border">
              <CardContent className="pt-5 pb-4 px-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search faculty by name or department..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Name</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Department</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Role</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Papers</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((f, i) => {
                    const realIdx = faculty.indexOf(f);
                    return (
                      <tr key={i} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-medium text-foreground">{f.name}</p>
                          <p className="text-xs text-muted-foreground">{f.email}</p>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">{f.department}</td>
                        <td className="px-5 py-3 text-muted-foreground">{f.role}</td>
                        <td className="px-5 py-3 text-muted-foreground">{f.papers}</td>
                        <td className="px-5 py-3">
                          <Badge variant={f.status === "active" ? "default" : f.status === "pending" ? "secondary" : "outline"} className="text-[10px]">
                            {f.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/dashboard/researcher?user=${encodeURIComponent(f.name)}`} className="flex items-center gap-2">
                                  <Eye className="h-3.5 w-3.5" /> View Profile
                                </Link>
                              </DropdownMenuItem>
                              {f.status === "pending" && (
                                <DropdownMenuItem onClick={() => handleResendInvite(f)} className="flex items-center gap-2">
                                  <Send className="h-3.5 w-3.5" /> Resend Invite
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleDeactivate(realIdx)} className="flex items-center gap-2">
                                <UserX className="h-3.5 w-3.5" />
                                {f.status === "active" ? "Deactivate" : "Reactivate"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRemove(realIdx)} className="flex items-center gap-2 text-destructive">
                                <UserX className="h-3.5 w-3.5" /> Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Faculty Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Dr. Jane Doe" value={inviteForm.name} onChange={e => setInviteForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="j.doe@university.edu" value={inviteForm.email} onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input placeholder="e.g. Computer Science" value={inviteForm.department} onChange={e => setInviteForm(p => ({ ...p, department: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input placeholder="e.g. Researcher, Lecturer" value={inviteForm.role} onChange={e => setInviteForm(p => ({ ...p, role: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
            <Button onClick={handleInvite}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
