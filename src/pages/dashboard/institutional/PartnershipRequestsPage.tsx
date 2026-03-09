import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Building2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const PartnershipRequestsPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ orgName: "", orgType: "", country: "", contactPerson: "", email: "", phone: "", category: "", description: "", timeline: "" });

  const handleSubmit = () => {
    if (!form.orgName || !form.category || !form.email) {
      toast.error("Please fill in required fields");
      return;
    }
    setSubmitted(true);
    toast.success("Partnership request submitted successfully");
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Request Submitted Successfully</h1>
          <p className="text-muted-foreground">Your partnership request has been received and will be reviewed by our team.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/dashboard/institutional/my-requests")}>View My Requests</Button>
            <Button onClick={() => { setSubmitted(false); setForm({ orgName: "", orgType: "", country: "", contactPerson: "", email: "", phone: "", category: "", description: "", timeline: "" }); }}>Submit Another Request</Button>
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
          <span className="text-foreground font-medium">Partnership Requests</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Request Institutional Partnership</h1>
          <p className="text-sm text-muted-foreground mt-1">Submit a formal partnership request to the Afrika Scholar network.</p>
        </div>

        <Card className="border-border">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Organization Name *</Label><Input className="mt-1" value={form.orgName} onChange={e => setForm(p => ({ ...p, orgName: e.target.value }))} placeholder="e.g. University of Lagos" /></div>
              <div><Label>Organization Type</Label>
                <Select value={form.orgType} onValueChange={v => setForm(p => ({ ...p, orgType: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="research_institute">Research Institute</SelectItem>
                    <SelectItem value="ngo">NGO</SelectItem>
                    <SelectItem value="government">Government Agency</SelectItem>
                    <SelectItem value="corporate">Corporate / Industry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Country</Label><Input className="mt-1" value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} placeholder="e.g. Nigeria" /></div>
              <div><Label>Contact Person</Label><Input className="mt-1" value={form.contactPerson} onChange={e => setForm(p => ({ ...p, contactPerson: e.target.value }))} placeholder="Full name" /></div>
              <div><Label>Email *</Label><Input className="mt-1" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="contact@institution.edu" /></div>
              <div><Label>Phone Number</Label><Input className="mt-1" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+234..." /></div>
            </div>
            <div>
              <Label>Partnership Category *</Label>
              <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic Partnership</SelectItem>
                  <SelectItem value="research">Research Partnership</SelectItem>
                  <SelectItem value="deployment">Institution Deployment</SelectItem>
                  <SelectItem value="advisory">Policy Advisory</SelectItem>
                  <SelectItem value="program">Program Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Description</Label><Textarea className="mt-1" rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your partnership goals..." /></div>
            <div><Label>Expected Timeline</Label><Input className="mt-1" value={form.timeline} onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))} placeholder="e.g. 6 months" /></div>
            <Button className="w-full" onClick={handleSubmit}>Submit Partnership Request</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PartnershipRequestsPage;
