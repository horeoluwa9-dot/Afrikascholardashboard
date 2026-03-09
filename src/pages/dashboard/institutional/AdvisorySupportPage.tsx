import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const AdvisorySupportPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ institution: "", category: "", description: "", timeline: "" });

  const handleSubmit = () => {
    if (!form.institution || !form.category) { toast.error("Please fill in required fields"); return; }
    setSubmitted(true);
    toast.success("Advisory request submitted");
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto"><CheckCircle className="h-10 w-10 text-primary" /></div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Advisory Request Submitted</h1>
          <p className="text-muted-foreground">Your advisory request has been received.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/dashboard/institutional/my-requests")}>View My Requests</Button>
            <Button onClick={() => { setSubmitted(false); setForm({ institution: "", category: "", description: "", timeline: "" }); }}>Submit Another</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/institutional" className="hover:text-foreground">Institutional</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Advisory Support</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Request Advisory Support</h1>
          <p className="text-sm text-muted-foreground mt-1">Engage academic experts for strategic advisory services.</p>
        </div>
        <Card className="border-border">
          <CardContent className="pt-6 space-y-4">
            <div><Label>Institution *</Label><Input className="mt-1" value={form.institution} onChange={e => setForm(p => ({ ...p, institution: e.target.value }))} placeholder="e.g. Ministry of Education" /></div>
            <div><Label>Advisory Category *</Label>
              <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="policy">Policy Advisory</SelectItem>
                  <SelectItem value="academic">Academic Advisory</SelectItem>
                  <SelectItem value="research">Research Advisory</SelectItem>
                  <SelectItem value="program">Program Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Description</Label><Textarea className="mt-1" rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the advisory needs..." /></div>
            <div><Label>Expected Timeline</Label><Input className="mt-1" value={form.timeline} onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))} placeholder="e.g. 6 months" /></div>
            <Button variant="afrika" className="w-full" onClick={handleSubmit}>Submit Advisory Request</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdvisorySupportPage;
