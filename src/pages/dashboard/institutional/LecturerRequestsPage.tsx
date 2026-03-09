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
import { ChevronRight, CheckCircle, GraduationCap, Eye, UserPlus } from "lucide-react";
import { toast } from "sonner";

const suggestedAcademics = [
  { name: "Dr. Amina Bello", institution: "University of Lagos", field: "Public Health" },
  { name: "Prof. Kwame Asante", institution: "University of Ghana", field: "Computer Science" },
  { name: "Dr. Ngozi Okafor", institution: "University of Nigeria", field: "Agricultural Science" },
];

const LecturerRequestsPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ institution: "", program: "", discipline: "", lecturerType: "", deliveryMode: "", duration: "", description: "" });

  const handleSubmit = () => {
    if (!form.institution || !form.discipline) { toast.error("Please fill in required fields"); return; }
    setSubmitted(true);
    toast.success("Lecturer request submitted");
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto"><CheckCircle className="h-10 w-10 text-primary" /></div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Lecturer Request Submitted</h1>
          <p className="text-muted-foreground">Your request has been received. We will match you with suitable academics.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/dashboard/institutional/my-requests")}>View My Requests</Button>
            <Button onClick={() => { setSubmitted(false); setForm({ institution: "", program: "", discipline: "", lecturerType: "", deliveryMode: "", duration: "", description: "" }); }}>Submit Another</Button>
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
          <span className="text-foreground font-medium">Lecturer Requests</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Request Lecturer Support</h1>
          <p className="text-sm text-muted-foreground mt-1">Find academic lecturers and instructors from the Afrika Scholar network.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <Card className="border-border">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Institution Name *</Label><Input className="mt-1" value={form.institution} onChange={e => setForm(p => ({ ...p, institution: e.target.value }))} placeholder="e.g. University of Lagos" /></div>
                  <div><Label>Program Name</Label><Input className="mt-1" value={form.program} onChange={e => setForm(p => ({ ...p, program: e.target.value }))} placeholder="e.g. MSc Data Science" /></div>
                </div>
                <div><Label>Discipline / Field *</Label><Input className="mt-1" value={form.discipline} onChange={e => setForm(p => ({ ...p, discipline: e.target.value }))} placeholder="e.g. Computer Science" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Lecturer Type</Label>
                    <Select value={form.lecturerType} onValueChange={v => setForm(p => ({ ...p, lecturerType: v }))}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="guest">Guest Lecturer</SelectItem>
                        <SelectItem value="adjunct">Adjunct Faculty</SelectItem>
                        <SelectItem value="instructor">Course Instructor</SelectItem>
                        <SelectItem value="mentor">Research Mentor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Delivery Mode</Label>
                    <Select value={form.deliveryMode} onValueChange={v => setForm(p => ({ ...p, deliveryMode: v }))}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select mode" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="physical">Physical</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Engagement Duration</Label><Input className="mt-1" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 3 months" /></div>
                <div><Label>Description of Teaching Needs</Label><Textarea className="mt-1" rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe what you need..." /></div>
                <Button className="w-full" onClick={handleSubmit}>Submit Lecturer Request</Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-foreground">Suggested Academics</h3>
            {suggestedAcademics.map(a => (
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

export default LecturerRequestsPage;
