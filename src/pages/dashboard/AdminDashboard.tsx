import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Users, BookOpen, BarChart3, CreditCard, Shield, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const tabs = ["Users", "Journals", "Network Applications", "Payments", "Analytics"];

const mockUsers = [
  { id: 1, name: "Dr. Amina Osei", email: "amina@ug.edu.gh", role: "researcher", status: "Active" },
  { id: 2, name: "Kofi Mensah", email: "kofi@uct.ac.za", role: "student", status: "Active" },
  { id: 3, name: "Dr. Fatima Diallo", email: "fatima@ucad.sn", role: "reviewer", status: "Suspended" },
];

const mockPayments = [
  { id: 1, user: "Dr. Amina Osei", amount: "₦15,000", type: "Publeesh Pro", date: "2026-03-05", status: "Success" },
  { id: 2, user: "Kofi Mensah", amount: "₦5,000", type: "Article Purchase", date: "2026-03-04", status: "Success" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Users");
  const [search, setSearch] = useState("");

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Platform Administration</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage users, journals, payments, and platform analytics.</p>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: "1,243", icon: Users },
            { label: "Active Journals", value: "87", icon: BookOpen },
            { label: "Revenue (MTD)", value: "₦2.4M", icon: CreditCard },
            { label: "Submissions", value: "342", icon: BarChart3 },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-4 w-4 text-accent" />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? "bg-accent text-accent-foreground" : "bg-card text-foreground border border-border hover:bg-secondary"}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Users" && (
          <div className="space-y-3">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            {mockUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase())).map((u) => (
              <div key={u.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] capitalize">{u.role}</Badge>
                  <Badge className={`text-[10px] ${u.status === "Active" ? "bg-afrika-green/10 text-afrika-green" : "bg-destructive/10 text-destructive"}`}>{u.status}</Badge>
                  <Button size="sm" variant="outline">Manage</Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Payments" && (
          <div className="space-y-3">
            {mockPayments.map((p) => (
              <div key={p.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{p.user}</p>
                  <p className="text-xs text-muted-foreground">{p.type} · {p.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{p.amount}</span>
                  <Badge className="bg-afrika-green/10 text-afrika-green text-[10px]">{p.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {["Journals", "Network Applications", "Analytics"].includes(activeTab) && (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{activeTab} management will be populated with live data.</p>
            <p className="text-xs text-muted-foreground mt-1">Module architecture is ready.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
