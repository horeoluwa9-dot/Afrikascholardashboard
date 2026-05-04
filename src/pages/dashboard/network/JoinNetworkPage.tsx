import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNetworkMembership, scheduleNetworkAutoApproval } from "@/hooks/useNetworkMembership";
import { useModuleUnlocksContext } from "@/contexts/ModuleUnlocksContext";
import { useAcademicEligibility } from "@/hooks/useAcademicEligibility";
import { useAppNotifications } from "@/hooks/useAppNotifications";
import { toast } from "sonner";

const ENGAGEMENT_TYPES = [
  "Teaching (part-time lecturing, guest lectures)",
  "Research Collaboration",
  "Peer Review",
  "Curriculum Development",
];

const STEPS = [
  { num: 1, label: "Personal Info" },
  { num: 2, label: "Academic Background" },
  { num: 3, label: "Areas of Interest" },
  { num: 4, label: "Experience & Statement" },
];

export default function JoinNetworkPage() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const { eligible } = useAcademicEligibility();
  const { status, setMembershipStatus } = useNetworkMembership();
  const { unlockModule } = useModuleUnlocksContext();
  const { add } = useAppNotifications();

  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({
    firstName: profile?.display_name?.split(" ")[0] || "",
    lastName: profile?.display_name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: "",
    country: "",
    degree: "",
    institution: profile?.institution || "",
    field: profile?.discipline || "",
    gradYear: "",
    engagements: [] as string[],
    disciplines: "",
    publications: "",
    researchAreas: "",
    motivation: "",
    terms: false,
    consent: false,
  });
  const set = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => { unlockModule("network"); }, [unlockModule]);

  if (!eligible) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 text-center space-y-3">
          <h2 className="text-xl font-bold text-foreground">Network not available</h2>
          <p className="text-sm text-muted-foreground">The Academic Network is reserved for Researchers and Lecturers.</p>
          <Link to="/dashboard"><Button variant="afrika">Back to dashboard</Button></Link>
        </div>
      </DashboardLayout>
    );
  }

  if (status === "approved") {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 text-center space-y-3">
          <CheckCircle2 className="h-10 w-10 text-afrika-green mx-auto" />
          <h2 className="text-xl font-bold text-foreground">You're in the Network</h2>
          <p className="text-sm text-muted-foreground">Continue building your academic profile to attract opportunities.</p>
          <div className="flex gap-2 justify-center">
            <Link to="/dashboard/profile"><Button variant="afrika">Build Academic Profile</Button></Link>
            <Link to="/dashboard/network/opportunities"><Button variant="afrikaOutline">Browse Opportunities</Button></Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (status === "pending" || done) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8 text-center space-y-3">
          <Clock className="h-10 w-10 text-accent mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Application Submitted</h2>
          <p className="text-sm text-muted-foreground">Your application is under review. You'll be notified upon approval.</p>
          <Badge variant="secondary" className="text-[10px]">Pending Verification</Badge>
          <div className="flex gap-2 justify-center pt-2">
            <Link to="/dashboard"><Button variant="afrika">Go to Dashboard</Button></Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const submit = () => {
    if (!f.terms || !f.consent) { toast.error("Please accept the terms and consent"); return; }
    setMembershipStatus("pending");
    scheduleNetworkAutoApproval(() => {
      add({
        category: "Network",
        title: "Welcome to the Academic Network",
        description: "Your application has been approved. Complete your academic profile to get matched with opportunities.",
        link: "/dashboard/profile",
      });
    });
    setDone(true);
    toast.success("Application submitted");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Hero */}
        <div className="rounded-2xl bg-primary text-primary-foreground p-8 text-center">
          <p className="text-xs font-bold tracking-widest text-accent uppercase">Join the Academic Network</p>
          <h1 className="text-3xl font-bold font-serif mt-2">Join the Academic Network</h1>
          <p className="text-sm opacity-90 mt-2 max-w-xl mx-auto">
            Complete this application to join Afrika Scholar's Lecturer & Academic Partners Network.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className={`h-7 w-7 rounded-full border flex items-center justify-center text-xs font-semibold ${
                step >= s.num ? "bg-accent text-accent-foreground border-accent" : "bg-card text-muted-foreground border-border"
              }`}>{s.num}</div>
              <span className={`ml-2 text-xs font-medium hidden sm:inline ${step === s.num ? "text-accent" : "text-muted-foreground"}`}>{s.label}</span>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border mx-2" />}
            </div>
          ))}
        </div>

        <Card className="border-border">
          <CardContent className="pt-6 pb-6 space-y-5">
            {step === 1 && (
              <>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Personal Info</h3>
                  <p className="text-xs text-muted-foreground">Step 1 of 4</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>First Name *</Label><Input value={f.firstName} onChange={(e) => set("firstName", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Last Name *</Label><Input value={f.lastName} onChange={(e) => set("lastName", e.target.value)} /></div>
                </div>
                <div className="space-y-1.5"><Label>Email Address *</Label><Input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
                <div className="space-y-1.5"><Label>Phone Number *</Label><Input value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234 800 000 0000" /></div>
                <div className="space-y-1.5">
                  <Label>Country of Residence *</Label>
                  <Select value={f.country} onValueChange={(v) => set("country", v)}>
                    <SelectTrigger><SelectValue placeholder="Select your country" /></SelectTrigger>
                    <SelectContent>
                      {["Nigeria", "Ghana", "Kenya", "South Africa", "Egypt", "Senegal", "Morocco", "Ethiopia", "Tanzania", "Uganda", "Other"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Academic Background</h3>
                  <p className="text-xs text-muted-foreground">Step 2 of 4</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Highest Degree Obtained *</Label>
                  <Select value={f.degree} onValueChange={(v) => set("degree", v)}>
                    <SelectTrigger><SelectValue placeholder="Select your highest degree" /></SelectTrigger>
                    <SelectContent>
                      {["Bachelors", "Masters", "PhD", "Postdoc", "Professor"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Institution *</Label>
                  <Input value={f.institution} onChange={(e) => set("institution", e.target.value)} placeholder="University of Lagos" />
                  <p className="text-[11px] text-muted-foreground">Where you obtained your highest degree</p>
                </div>
                <div className="space-y-1.5"><Label>Field of Study *</Label><Input value={f.field} onChange={(e) => set("field", e.target.value)} placeholder="Economics" /></div>
                <div className="space-y-1.5"><Label>Year of Graduation *</Label><Input value={f.gradYear} onChange={(e) => set("gradYear", e.target.value)} placeholder="2020" /></div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Areas of Interest</h3>
                  <p className="text-xs text-muted-foreground">Step 3 of 4</p>
                </div>
                <div className="space-y-2">
                  <Label>Types of Engagement *</Label>
                  <p className="text-xs text-muted-foreground">Select all that apply</p>
                  <div className="space-y-2">
                    {ENGAGEMENT_TYPES.map((t) => (
                      <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={f.engagements.includes(t)}
                          onCheckedChange={(checked) => {
                            const next = checked ? [...f.engagements, t] : f.engagements.filter((x) => x !== t);
                            set("engagements", next);
                          }}
                        />
                        <span>{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Disciplines / Subject Areas *</Label>
                  <Textarea rows={3} value={f.disciplines} onChange={(e) => set("disciplines", e.target.value)} placeholder="e.g., Economics, Development Studies, Public Policy" />
                  <p className="text-[11px] text-muted-foreground">List your areas of expertise (comma-separated)</p>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Experience & Statement</h3>
                  <p className="text-xs text-muted-foreground">Step 4 of 4</p>
                </div>
                <div className="space-y-1.5">
                  <Label>Do you have academic publications? *</Label>
                  <Select value={f.publications} onValueChange={(v) => set("publications", v)}>
                    <SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Current Research Areas (Optional)</Label>
                  <Textarea rows={3} value={f.researchAreas} onChange={(e) => set("researchAreas", e.target.value)} placeholder="Briefly describe your current research focus..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Why do you want to join the network? *</Label>
                  <Textarea rows={5} value={f.motivation} onChange={(e) => set("motivation", e.target.value)} placeholder="Share your motivation for joining and how you hope to contribute..." />
                  <p className="text-[11px] text-muted-foreground">Minimum 50 characters</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-border">
                  <label className="flex items-start gap-2 text-sm cursor-pointer">
                    <Checkbox checked={f.terms} onCheckedChange={(c) => set("terms", !!c)} />
                    <span>I accept the terms and conditions of the Afrika Scholar Network *</span>
                  </label>
                  <label className="flex items-start gap-2 text-sm cursor-pointer">
                    <Checkbox checked={f.consent} onCheckedChange={(c) => set("consent", !!c)} />
                    <span>I consent to Afrika Scholar processing my data for network purposes *</span>
                  </label>
                </div>
              </>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-border">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-1"><ArrowLeft className="h-3.5 w-3.5" /> Previous</Button>
              ) : <div />}
              {step < 4 ? (
                <Button variant="afrika" onClick={() => setStep(step + 1)} className="gap-1">Next <ArrowRight className="h-3.5 w-3.5" /></Button>
              ) : (
                <Button variant="afrika" onClick={submit} className="gap-1">Submit Application <ArrowRight className="h-3.5 w-3.5" /></Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}