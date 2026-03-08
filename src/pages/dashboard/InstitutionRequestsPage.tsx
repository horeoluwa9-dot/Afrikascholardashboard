import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Building2, GraduationCap, BookOpen, Plus, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const tabs = ["Academic Deployment", "Teaching Support", "Research Advisory"];

const existingRequests = [
  { id: 1, type: "Academic Deployment", title: "Deploy AI Research Lab", institution: "University of Lagos", status: "Pending", date: "2026-03-01" },
  { id: 2, type: "Teaching Support", title: "Statistics Module for Graduate Students", institution: "University of Nairobi", status: "In Progress", date: "2026-02-20" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-muted text-muted-foreground",
  "In Progress": "bg-accent/10 text-accent",
  Completed: "bg-afrika-green/10 text-afrika-green",
};

const InstitutionRequestsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("Academic Deployment");
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [requestForm, setRequestForm] = useState({ title: "", description: "", type: "", institution: "" });

  const handleSubmitRequest = () => {
    toast({ title: "Request submitted", description: "Your institutional request has been submitted for review." });
    setShowNewRequest(false);
    setRequestForm({ title: "", description: "", type: "", institution: "" });
  };

  const filteredRequests = existingRequests.filter(r => {
    if (activeTab === "Academic Deployment") return r.type === "Academic Deployment";
    if (activeTab === "Teaching Support") return r.type === "Teaching Support";
    return r.type === "Research Advisory";
  });

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Institution Requests</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage academic deployment, teaching support, and advisory requests.</p>
          </div>
          <Button variant="afrika" onClick={() => setShowNewRequest(true)}><Plus className="h-4 w-4 mr-1" /> New Request</Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? "bg-accent text-accent-foreground" : "bg-card text-foreground border border-border hover:bg-secondary"}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <ClipboardList className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No {activeTab.toLowerCase()} requests yet.</p>
              <Button variant="afrika" size="sm" className="mt-3" onClick={() => setShowNewRequest(true)}>Create Request</Button>
            </div>
          ) : (
            filteredRequests.map((r) => (
              <div key={r.id} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{r.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{r.institution} · {r.date}</p>
                  <Badge className={`mt-2 text-[10px] ${statusColors[r.status]}`}>{r.status}</Badge>
                </div>
                <Button size="sm" variant="outline">View Details</Button>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={showNewRequest} onOpenChange={setShowNewRequest}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Institution Request</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Request Type</Label>
              <Select value={requestForm.type} onValueChange={(v) => setRequestForm(p => ({ ...p, type: v }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic Deployment">Academic Deployment</SelectItem>
                  <SelectItem value="Teaching Support">Teaching Support</SelectItem>
                  <SelectItem value="Research Advisory">Research Advisory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Title</Label>
              <Input value={requestForm.title} onChange={(e) => setRequestForm(p => ({ ...p, title: e.target.value }))} className="mt-1" placeholder="Brief title for the request" />
            </div>
            <div>
              <Label>Institution</Label>
              <Input value={requestForm.institution} onChange={(e) => setRequestForm(p => ({ ...p, institution: e.target.value }))} className="mt-1" placeholder="e.g. University of Lagos" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={requestForm.description} onChange={(e) => setRequestForm(p => ({ ...p, description: e.target.value }))} className="mt-1" placeholder="Describe what you need..." rows={4} />
            </div>
            <Button variant="afrika" className="w-full" onClick={handleSubmitRequest}>Submit Request</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default InstitutionRequestsPage;
