import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, CheckCircle, Eye, UserPlus } from "lucide-react";
import { toast } from "sonner";

const suggestedResearchers = [
  { name: "Dr. Fatima Bello", institution: "University of Lagos", field: "Public Health" },
  { name: "Dr. Ahmed Musa", institution: "Ahmadu Bello University", field: "Epidemiology" },
  { name: "Dr. Grace Nwoye", institution: "University of Cape Town", field: "Environmental Science" },
];

const ResearchCollaborationPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ title: "", field: "", collabType: "", funding: "", duration: "", description: "" });

  const handleSubmit = () => {
    if (!form.title || !form.field) { toast.error("Please fill in required fields"); return; }
    setSubmitted(true);
    toast.success("Collaboration request submitted");
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto"><CheckCircle className="h-10 w-10 text-primary" /></div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Collaboration Request Submitted</h1>
          <p className="text-muted-foreground">We will match you with suitable research partners.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/dashboard/institutional/my-requests")}>View My Requests</Button>
            <Button onClick={() => { setSubmitted(false); setForm({ title: "", field: "", collabType: "", funding: "", duration: "", description: "" }); }}>Submit Another</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/institutional" className="hover:text-foreground">Institutional</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Research Collaboration</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Request Research Collaboration</h1>
          <p className="text-sm text-muted-foreground mt-1">Partner with academics for joint research projects.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <Card className="border-border">
              <CardContent className="pt-6 space-y-4">
                <div><Label>Project Title *</Label><Input className="mt-1" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Climate Change Impact Study" /></div>
                <div><Label>Research Field *</Label><Input className="mt-1" value={form.field} onChange={e => setForm(p => ({ ...p, field: e.target.value }))} placeholder="e.g. Environmental Science" /></div>
                <div><Label>Collaboration Type</Label>
                  <Select value={form.collabType} onValueChange={v => setForm(p => ({ ...p, collabType: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="joint_research">Joint Research</SelectItem>
                      <SelectItem value="grant">Grant Collaboration</SelectItem>
                      <SelectItem value="data">Data Collaboration</SelectItem>
                      <SelectItem value="policy">Policy Research</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Funding Available (optional)</Label><Input className="mt-1" value={form.funding} onChange={e => setForm(p => ({ ...p, funding: e.target.value }))} placeholder="e.g. $50,000" /></div>
                  <div><Label>Expected Duration</Label><Input className="mt-1" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 12 months" /></div>
                </div>
                <div><Label>Project Description</Label><Textarea className="mt-1" rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the research project..." /></div>
                <Button className="w-full" onClick={handleSubmit}>Submit Collaboration Request</Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-foreground">Suggested Researchers</h3>
            {suggestedResearchers.map(a => (
              <Card key={a.name} className="border-border">
                <CardContent className="pt-4 pb-3 px-4 space-y-2">
                  <p className="text-sm font-semibold text-foreground">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.institution}</p>
                  <Badge variant="secondary" className="text-[10px]">{a.field}</Badge>
                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" size="sm" className="text-xs h-7 gap-1"><Eye className="h-3 w-3" /> View Profile</Button>
                    <Button size="sm" className="text-xs h-7 gap-1"><UserPlus className="h-3 w-3" /> Invite</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResearchCollaborationPage;
