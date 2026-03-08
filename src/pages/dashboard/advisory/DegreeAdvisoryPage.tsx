import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Send, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const pastRequests = [
  { id: "d1", field: "Artificial Intelligence", qualification: "Bachelor's Degree", location: "Nigeria / South Africa", goal: "AI Researcher", status: "in_review", date: "2026-03-04" },
  { id: "d2", field: "Public Health", qualification: "Master's Degree", location: "Kenya", goal: "Health Policy Analyst", status: "completed", date: "2026-02-10" },
];

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  in_review: { label: "Under Review", variant: "secondary" },
  completed: { label: "Guidance Provided", variant: "default" },
  pending: { label: "Pending", variant: "outline" },
};

const DegreeAdvisoryPage = () => {
  const [form, setForm] = useState({ qualification: "", field: "", location: "", goal: "" });

  const handleSubmit = () => {
    if (!form.qualification || !form.field) {
      toast.error("Please fill required fields");
      return;
    }
    toast.success("Degree advisory request submitted!");
    setForm({ qualification: "", field: "", location: "", goal: "" });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Degree Advisory</h1>
          <p className="text-sm text-muted-foreground mt-1">Get expert guidance on selecting the right degree program for your career goals.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <Card className="border-border">
              <CardContent className="pt-6 space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="h-5 w-5 text-accent" />
                  <h2 className="text-base font-semibold text-foreground">Request Degree Advisory</h2>
                </div>
                <div>
                  <Label>Current Qualification *</Label>
                  <Select value={form.qualification} onValueChange={v => setForm(f => ({ ...f, qualification: v }))}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select qualification" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_school">High School Diploma</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Field of Interest *</Label>
                  <Input className="mt-1.5" placeholder="e.g. Artificial Intelligence" value={form.field} onChange={e => setForm(f => ({ ...f, field: e.target.value }))} />
                </div>
                <div>
                  <Label>Preferred Study Location</Label>
                  <Input className="mt-1.5" placeholder="e.g. Nigeria / South Africa" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                </div>
                <div>
                  <Label>Career Goals</Label>
                  <Textarea className="mt-1.5" placeholder="Describe your career aspirations..." value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} rows={3} />
                </div>
                <Button variant="afrika" className="w-full gap-1.5" onClick={handleSubmit}>
                  <Send className="h-4 w-4" /> Request Degree Advisory
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Past Requests */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-semibold text-foreground">Previous Requests</h2>
            {pastRequests.map(r => {
              const sc = statusMap[r.status] || statusMap.pending;
              return (
                <Card key={r.id} className="border-border">
                  <CardContent className="pt-4 pb-3 px-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold text-foreground">{r.field}</p>
                      <Badge variant={sc.variant} className="text-[10px]">{sc.label}</Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>Qualification: {r.qualification}</p>
                      <p>Location: {r.location}</p>
                      <p>Goal: {r.goal}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DegreeAdvisoryPage;
