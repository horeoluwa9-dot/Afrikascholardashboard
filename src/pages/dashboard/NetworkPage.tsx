import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Users2, Briefcase, Handshake, Search, UserPlus, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const tabs = ["Academic Network", "Opportunities", "Collaborations"];

const researchers = [
  { id: 1, name: "Dr. Amina Osei", institution: "University of Ghana", expertise: ["AI", "Public Health"], connected: false },
  { id: 2, name: "Prof. Kwame Asante", institution: "University of Cape Town", expertise: ["Climate Science", "Data Analytics"], connected: true },
  { id: 3, name: "Dr. Fatima Diallo", institution: "Université Cheikh Anta Diop", expertise: ["Economics", "Policy"], connected: false },
];

const opportunities = [
  { id: 1, title: "Research Fellow – AI in Healthcare", org: "WHO Africa", deadline: "2026-04-15", type: "Fellowship" },
  { id: 2, title: "Collaborative Study on Food Security", org: "African Union", deadline: "2026-05-01", type: "Collaboration" },
];

const collaborations = [
  { id: 1, title: "Joint Paper on Digital Inclusion", partner: "Dr. Samuel Adeyemi", status: "Active" },
];

const NetworkPage = () => {
  const [activeTab, setActiveTab] = useState("Academic Network");
  const [search, setSearch] = useState("");
  const [connections, setConnections] = useState<Record<number, boolean>>({ 2: true });

  const toggleConnect = (id: number) => {
    setConnections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Network</h1>
          <p className="text-sm text-muted-foreground mt-1">Build your academic network, explore opportunities, and collaborate.</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search network..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? "bg-accent text-accent-foreground" : "bg-card text-foreground border border-border hover:bg-secondary"}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Academic Network" && (
          <div className="space-y-3">
            {researchers.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map((r) => (
              <div key={r.id} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{r.name}</h3>
                    <p className="text-xs text-muted-foreground">{r.institution}</p>
                    <div className="flex gap-1 mt-1">{r.expertise.map(e => <Badge key={e} variant="secondary" className="text-[10px]">{e}</Badge>)}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant={connections[r.id] ? "outline" : "afrika"} onClick={() => toggleConnect(r.id)}>
                    <UserPlus className="h-3 w-3 mr-1" />{connections[r.id] ? "Connected" : "Connect"}
                  </Button>
                  <Link to="/dashboard/messages"><Button size="sm" variant="outline">Message</Button></Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Opportunities" && (
          <div className="space-y-3">
            {opportunities.map((o) => (
              <div key={o.id} className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{o.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{o.org} · Deadline: {o.deadline}</p>
                    <Badge variant="secondary" className="mt-2 text-[10px]">{o.type}</Badge>
                  </div>
                  <Button size="sm" variant="afrika"><ExternalLink className="h-3 w-3 mr-1" /> Apply</Button>
                </div>
              </div>
            ))}
            {opportunities.length === 0 && (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No opportunities available yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "Collaborations" && (
          <div className="space-y-3">
            {collaborations.map((c) => (
              <div key={c.id} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">With {c.partner}</p>
                  <Badge variant="outline" className="mt-1 text-[10px] border-accent text-accent">{c.status}</Badge>
                </div>
                <Button size="sm" variant="outline">View</Button>
              </div>
            ))}
            {collaborations.length === 0 && (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <Handshake className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No active collaborations.</p>
                <Button variant="afrika" size="sm" className="mt-3">Find Collaborators</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NetworkPage;
