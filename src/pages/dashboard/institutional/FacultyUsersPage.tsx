import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users2, Plus, Search, Mail, MoreHorizontal } from "lucide-react";
import { useState } from "react";

const SAMPLE_FACULTY = [
  { name: "Dr. Ama Mensah", email: "a.mensah@ug.edu.gh", department: "Energy Policy", role: "Researcher", status: "active", papers: 12 },
  { name: "Prof. Kwame Asante", email: "k.asante@ug.edu.gh", department: "Computer Science", role: "Senior Researcher", status: "active", papers: 24 },
  { name: "Dr. Fatima Bello", email: "f.bello@abu.edu.ng", department: "Public Health", role: "Researcher", status: "active", papers: 8 },
  { name: "Dr. Tunde Adeyemi", email: "t.adeyemi@unilag.edu.ng", department: "Political Science", role: "Researcher", status: "pending", papers: 15 },
  { name: "Dr. Ngozi Okafor", email: "n.okafor@unn.edu.ng", department: "Agricultural Science", role: "Lecturer", status: "active", papers: 6 },
];

export default function FacultyUsersPage() {
  const [search, setSearch] = useState("");
  const filtered = SAMPLE_FACULTY.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Faculty Users</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage researchers and faculty members under your institution.</p>
          </div>
          <Button className="gap-2"><Plus className="h-4 w-4" /> Invite Faculty</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Faculty", value: SAMPLE_FACULTY.length, icon: Users2, bg: "bg-accent/10", color: "text-accent" },
            { label: "Active", value: SAMPLE_FACULTY.filter(f => f.status === "active").length, icon: Users2, bg: "bg-afrika-green/10", color: "text-afrika-green" },
            { label: "Pending Invites", value: SAMPLE_FACULTY.filter(f => f.status === "pending").length, icon: Mail, bg: "bg-afrika-orange-light", color: "text-afrika-orange" },
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
                  {filtered.map((f, i) => (
                    <tr key={i} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium text-foreground">{f.name}</p>
                        <p className="text-xs text-muted-foreground">{f.email}</p>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{f.department}</td>
                      <td className="px-5 py-3 text-muted-foreground">{f.role}</td>
                      <td className="px-5 py-3 text-muted-foreground">{f.papers}</td>
                      <td className="px-5 py-3">
                        <Badge variant={f.status === "active" ? "default" : "secondary"} className="text-[10px]">
                          {f.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
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
}
